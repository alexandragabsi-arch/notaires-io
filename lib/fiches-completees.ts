"use client";

// Fusion des fiches complétées par les notaires (Supabase) dans les listes de
// l'annuaire et des pages villes, côté navigateur.
//   - fiche de l'annuaire revendiquée → remplacée par sa version complétée
//     (photo, présentation, langues…), sans doublon ;
//   - fiche créée à l'inscription → ajoutée si elle est de la ville affichée.

import { useEffect, useMemo, useState } from "react";
import type { ListingNotaire } from "./notaires-listing";
import { getRemoteProfiles } from "./notaire-profiles";
import { arrDepuisAdresse } from "./arrondissements";
import { aDesCreneaux } from "./disponibilites";
import { adresseComplete, adresseCompleteBAN } from "./adresse";

// Une seule requête par visite, partagée par tous les composants de la page.
let _promesse: Promise<ListingNotaire[]> | null = null;
function chargerUneFois(): Promise<ListingNotaire[]> {
  // Sans la fiche de démonstration : elle reste consultable par lien direct
  // (revue App Store) mais n'apparaît plus dans l'annuaire ni les pages villes.
  // Adresse sans code postal : complétée par la Base Adresse Nationale.
  _promesse ??= getRemoteProfiles()
    .then((l) => l.filter((n) => !estFicheTest(n)))
    .then((l) => Promise.all(l.map(async (n) => ({ ...n, address: await adresseCompleteBAN(n.address, n.city) }))))
    .catch(() => []);
  return _promesse;
}

function sansAccents(s: string): string {
  return (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

// « Paris 8ème » / adresse « … 75008 … » → 8 (Paris, Lyon, Marseille).
function arrondissement(n: ListingNotaire): number | undefined {
  const parAdresse = arrDepuisAdresse(n.address);
  if (parAdresse) return parAdresse.num;
  const v = sansAccents(n.city).match(/^(paris|lyon|marseille)\s+(\d{1,2})/);
  return v ? parseInt(v[2], 10) : undefined;
}

// Ville sans arrondissement, pour le regroupement par ville (« Paris 8ème » → « paris »).
function villeCle(city: string): string {
  return sansAccents(city).replace(/\s+\d.*$/, "").trim();
}

// Ville sans accents ni arrondissement, comme cleVille (lib/inscrits-serveur.ts),
// recopiée ici pour ne pas charger l'annuaire complet dans le navigateur.
function cleVille(city: string): string {
  return (city ?? "")
    .toLowerCase()
    .replace(/œ/g, "oe").replace(/æ/g, "ae")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\s+\d.*$/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** « Me Vanessa Alezan » → ["vanessa", "alezan"]. */
function jetonsNom(nom: string): string[] {
  return cleVille(nom).split(" ").filter((t) => t && t !== "me");
}

export function fusionnerFiches(
  base: ListingNotaire[],
  completees: ListingNotaire[],
  { villesSeulement }: { villesSeulement: boolean },
): ListingNotaire[] {
  if (completees.length === 0) return base;
  const parId = new Map(completees.map((n) => [n.id, n]));
  const fusion = base.map((b) => {
    const r = parId.get(b.id);
    if (!r) return b;
    parId.delete(b.id);
    // Seuls les champs renseignés remplacent ceux de l'annuaire.
    const renseignes = Object.entries(r).filter(
      ([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0),
    );
    // L'adresse complétée (code postal, ville) ne doit pas être écrasée par
    // la rue seule saisie par le notaire (Me Robin, /notaire-lyon, 19/10/2026).
    return { ...b, ...Object.fromEntries(renseignes), address: adresseComplete(r.address, b.address) } as ListingNotaire;
  });

  // Fiches créées à l'inscription (absentes de l'annuaire importé).
  const villes = new Set(base.map((n) => villeCle(n.city)));
  const nouvelles: ListingNotaire[] = [...parId.values()]
    .filter((n) => !villesSeulement || villes.has(villeCle(n.city)))
    .map((n) => ({ ...n, arrondissement: n.arrondissement ?? arrondissement(n) }));

  // Sans doublon : la fiche importée d'un notaire inscrit sous un autre id
  // restait listée à côté de son profil activé (Me Alezan, 19/10/2026). Même
  // règle que côté serveur (memeNotaire, lib/inscrits-serveur.ts) : même ville,
  // tous les mots du nom de l'inscrit dans celui de la fiche. La fiche retirée
  // complète le profil, comme côté serveur : code postal et ville de
  // l'adresse, champs que le notaire n'a pas renseignés.
  const inscritsParVille = new Map<string, { jetons: string[]; index: number }[]>();
  nouvelles.forEach((n, index) => {
    const jetons = jetonsNom(n.name);
    if (jetons.length < 2) return;
    const cle = cleVille(n.city);
    inscritsParVille.set(cle, [...(inscritsParVille.get(cle) ?? []), { jetons, index }]);
  });
  const sansDoublon = inscritsParVille.size === 0 ? fusion : fusion.filter((b) => {
    if (b.claimed) return true;
    const inscrits = inscritsParVille.get(cleVille(b.city));
    if (!inscrits) return true;
    const nomFiche = new Set(jetonsNom(b.name));
    const inscrit = inscrits.find(({ jetons }) => jetons.every((t) => nomFiche.has(t)));
    if (!inscrit) return true;
    const n = nouvelles[inscrit.index];
    const renseignes = Object.entries(n).filter(
      ([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0),
    );
    nouvelles[inscrit.index] = {
      ...b,
      ...Object.fromEntries(renseignes),
      address: adresseComplete(n.address, b.address),
    } as ListingNotaire;
    return false;
  });

  // Fiches actives en tête : ce sont elles qui prennent des rendez-vous.
  return [...nouvelles, ...sansDoublon];
}

/** Fiche de démonstration (Me Test Martin) : jamais en tête des résultats publics. */
export function estFicheTest(n: ListingNotaire): boolean {
  return n.id === "11111111-1111-4111-8111-111111111111" || /fiche de test/i.test(n.officeName ?? "");
}

/** Rang d'affichage : inscrits avec créneaux ouverts, autres inscrits, fiche
 *  de test, puis le reste de l'annuaire. Plus petit = plus haut. */
export function rangAffichage(n: ListingNotaire): number {
  if (!n.claimed) return 3;
  if (estFicheTest(n)) return 2;
  return aDesCreneaux(n) ? 0 : 1;
}

/** Notaires inscrits sur la plateforme en tête (ceux qui ont des créneaux
 *  d'abord), la fiche de test après eux, le reste dans l'ordre d'origine.
 *  Ce sont les seuls qui prennent réellement des rendez-vous en ligne. */
export function abonnesEnTete(liste: ListingNotaire[]): ListingNotaire[] {
  return [...liste].sort((a, b) => rangAffichage(a) - rangAffichage(b));
}

/** Liste de l'annuaire enrichie des fiches complétées (chargées après le rendu). */
export function useFichesCompletees(base: ListingNotaire[], villesSeulement = true): ListingNotaire[] {
  const [completees, setCompletees] = useState<ListingNotaire[]>([]);
  useEffect(() => {
    let actif = true;
    chargerUneFois().then((l) => { if (actif) setCompletees(l); });
    return () => { actif = false; };
  }, []);
  return useMemo(() => fusionnerFiches(base, completees, { villesSeulement }), [base, completees, villesSeulement]);
}
