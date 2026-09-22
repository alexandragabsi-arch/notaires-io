"use client";

// Fusion des fiches complétées par les notaires (Supabase) dans les listes de
// l'annuaire et des pages villes, côté navigateur.
//   - fiche de l'annuaire revendiquée → remplacée par sa version complétée
//     (photo, présentation, langues…), sans doublon ;
//   - fiche créée à l'inscription → ajoutée si elle est de la ville affichée.

import { useEffect, useMemo, useState } from "react";
import type { ListingNotaire } from "./notaires-listing";
import { getRemoteProfiles } from "./notaire-profiles";

// Une seule requête par visite, partagée par tous les composants de la page.
let _promesse: Promise<ListingNotaire[]> | null = null;
function chargerUneFois(): Promise<ListingNotaire[]> {
  _promesse ??= getRemoteProfiles().catch(() => []);
  return _promesse;
}

function sansAccents(s: string): string {
  return (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

// « Paris 8ème » / « 75008 » → 8 (Paris, Lyon, Marseille), comme l'annuaire.
function arrondissement(n: ListingNotaire): number | undefined {
  const m = (n.address ?? "").match(/\b(75|69|13)(\d{3})\b/);
  if (m) {
    const code = parseInt(m[1] + m[2], 10);
    if (code === 75116) return 16;
    const num = code - parseInt(m[1] + "000", 10);
    const max = m[1] === "75" ? 20 : m[1] === "69" ? 9 : 16;
    if (num >= 1 && num <= max) return num;
  }
  const v = sansAccents(n.city).match(/^(paris|lyon|marseille)\s+(\d{1,2})/);
  return v ? parseInt(v[2], 10) : undefined;
}

// Ville sans arrondissement, pour le regroupement par ville (« Paris 8ème » → « paris »).
function villeCle(city: string): string {
  return sansAccents(city).replace(/\s+\d.*$/, "").trim();
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
    return { ...b, ...Object.fromEntries(renseignes) } as ListingNotaire;
  });

  // Fiches créées à l'inscription (absentes de l'annuaire importé).
  const villes = new Set(base.map((n) => villeCle(n.city)));
  const nouvelles = [...parId.values()]
    .filter((n) => !villesSeulement || villes.has(villeCle(n.city)))
    .map((n) => ({ ...n, arrondissement: n.arrondissement ?? arrondissement(n) }));

  // Fiches actives en tête : ce sont elles qui prennent des rendez-vous.
  return [...nouvelles, ...fusion];
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
