// Conversion code postal → arrondissement, pour Paris, Lyon et Marseille.
//
// Piège : l'API Adresse renvoie 751XX pour Paris (75116 = Paris 16e), pas
// seulement 750XX. Un motif « 750\d\d » seul rate le 16e — le visiteur se
// retrouvait alors avec tous les notaires de Paris, y compris ceux du 8e.

export interface Arrondissement {
  num: number;
  label: string;  // « 1er », « 16ème »
  slug: string;   // « 1er », « 16eme »
}

const VILLES_A_ARRONDISSEMENTS = [
  { prefixes: ["750", "751"], max: 20 }, // Paris
  { prefixes: ["690"], max: 9 },         // Lyon
  { prefixes: ["130"], max: 16 },        // Marseille
];

export function libelleArr(num: number): string {
  return num === 1 ? "1er" : `${num}ème`;
}

export function slugArr(num: number): string {
  return num === 1 ? "1er" : `${num}eme`;
}

/** Arrondissement correspondant à un code postal (null si la ville n'en a pas). */
export function arrDepuisCodePostal(code: string | null | undefined): Arrondissement | null {
  const c = (code ?? "").trim();
  if (!/^\d{5}$/.test(c)) return null;
  for (const { prefixes, max } of VILLES_A_ARRONDISSEMENTS) {
    if (!prefixes.includes(c.slice(0, 3))) continue;
    const num = parseInt(c.slice(3), 10);
    if (num >= 1 && num <= max) return { num, label: libelleArr(num), slug: slugArr(num) };
  }
  return null;
}

/** Arrondissement déduit d'une adresse complète (premier code postal trouvé). */
export function arrDepuisAdresse(adresse: string | null | undefined): Arrondissement | null {
  const m = (adresse ?? "").match(/\b\d{5}\b/);
  return m ? arrDepuisCodePostal(m[0]) : null;
}

// Code commune des trois villes à arrondissements. L'API Adresse renvoie pour
// « Paris » la commune entière (75056) avec le code postal 75001 : le prendre
// pour un arrondissement enfermait le visiteur dans le 1er.
const COMMUNES_A_ARRONDISSEMENTS = new Set(["75056", "69123", "13055"]);

export function estVilleEntiere(citycode: string | null | undefined): boolean {
  return !!citycode && COMMUNES_A_ARRONDISSEMENTS.has(citycode);
}

/** Arrondissement d'une suggestion de ville : aucun si c'est la ville entière. */
export function arrDeSuggestion(s: { postcode?: string | null; citycode?: string | null }): Arrondissement | null {
  return estVilleEntiere(s.citycode) ? null : arrDepuisCodePostal(s.postcode);
}
