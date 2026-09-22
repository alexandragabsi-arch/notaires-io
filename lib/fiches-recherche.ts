// Recherche d'une fiche existante de l'annuaire au moment de l'inscription,
// pour que le notaire complète SA fiche au lieu d'en créer un doublon.
// Serveur uniquement (lit data/*.json via notaires-source).

import { getAllNotaires } from "./notaires-source";
import { LISTING_NOTAIRES, type ListingNotaire } from "./notaires-listing";

export interface FicheTrouvee {
  id: string;
  name: string;
  city: string;
  officeName?: string;
  address?: string;
  claimed: boolean;  // déjà rattachée à un compte
}

// « Élodie LE GOFF-Martin » → « elodie le goff martin »
export function normaliser(s: string): string {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function mots(s: string): string[] {
  return normaliser(s).split(" ").filter((m) => m.length > 1 && m !== "me");
}

// « Paris 8ème », « PARIS », « 75008 Paris » → même ville « paris ».
function villeCle(s: string): string {
  return mots(s).filter((m) => !/^\d/.test(m) && !/^(er|e|eme|ème|arrondissement|cedex)$/.test(m)).join(" ");
}

export function ficheParId(id: string): ListingNotaire | undefined {
  return LISTING_NOTAIRES.find((n) => n.id === id) ?? getAllNotaires().find((n) => n.id === id);
}

/**
 * Fiches correspondant au nom (obligatoire), au prénom et à la ville.
 *  - tous les mots du nom de famille doivent figurer dans la fiche ;
 *  - la ville doit correspondre (sinon on renverrait tous les « Martin » de France) ;
 *  - le prénom départage : correspondance exacte, puis bon prénom, puis le reste.
 */
export function rechercherFiches(prenom: string, nom: string, ville: string, max = 5): ListingNotaire[] {
  const motsNom = mots(nom);
  const cleVille = villeCle(ville);
  if (motsNom.length === 0 || !cleVille) return [];
  const motsPrenom = mots(prenom);

  const resultats: { n: ListingNotaire; score: number }[] = [];
  for (const n of getAllNotaires()) {
    if (n.isOffice) continue;
    const villeFiche = villeCle(n.city);
    if (!villeFiche || !(villeFiche.startsWith(cleVille) || cleVille.startsWith(villeFiche))) continue;

    const nomFiche = new Set(mots(n.name));
    if (!motsNom.every((m) => nomFiche.has(m))) continue;

    const prenomOk = motsPrenom.length > 0 && motsPrenom.some((m) => nomFiche.has(m));
    // Correspondance exacte (ni mot en plus, ni mot en moins) : en tête.
    const exact = prenomOk && nomFiche.size === new Set([...motsNom, ...motsPrenom]).size;
    resultats.push({ n, score: (prenomOk ? 2 : 0) + (exact ? 2 : 0) + 1 });
  }

  return resultats
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((r) => r.n);
}
