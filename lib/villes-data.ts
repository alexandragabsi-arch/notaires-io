// Villes couvertes par une page dédiée.
//
// La base compte 4 257 communes où au moins un notaire est référencé, mais le
// site n'exposait que 34 pages de ville. On ouvre celles qui ont assez de
// professionnels pour qu'une page ait du contenu : en dessous d'une dizaine,
// la page serait vide et desservirait le référencement plutôt que de l'aider.
//
// La liste est construite à la compilation à partir des données réelles, jamais
// saisie à la main : une ville qui perdrait ses notaires disparaîtrait d'elle-même.

import { getAllNotaires } from "@/lib/notaires-source";

/** En dessous de ce nombre de notaires, pas de page dédiée. */
export const SEUIL_VILLE = 10;

/** Villes déjà servies par une page écrite à la main, à ne pas dupliquer. */
export const VILLES_STATIQUES = new Set([
  "paris", "lyon", "marseille", "toulouse", "nice", "nantes", "montpellier",
  "strasbourg", "bordeaux", "lille", "rennes", "reims", "toulon",
  "saint-etienne", "le-havre", "grenoble", "dijon", "angers", "nancy", "metz",
  "clermont-ferrand", "aix-en-provence", "brest", "rouen", "orleans", "perpignan",
]);

export function slugVille(nom: string): string {
  return nom
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface VilleCouverte {
  nom: string;
  slug: string;
  nombre: number;
  /** Spécialités les plus représentées localement, pour différencier les pages. */
  specialites: string[];
  /**
   * Code postal principal, déduit des adresses des études.
   * « notaire 74000 » est une recherche courante, et le code postal est le
   * signal qui rattache sans ambiguïté une page à un territoire — les
   * plateformes concurrentes le placent d'ailleurs dans leurs URL.
   */
  codePostal?: string;
}

let cache: VilleCouverte[] | null = null;

export function getVillesCouvertes(): VilleCouverte[] {
  if (cache) return cache;

  const parVille = new Map<string, { nom: string; specs: Map<string, number>; cps: Map<string, number> }>();
  for (const n of getAllNotaires()) {
    const nom = (n.city || "").trim();
    if (!nom) continue;
    const slug = slugVille(nom);
    if (!slug || VILLES_STATIQUES.has(slug)) continue;
    let entree = parVille.get(slug);
    if (!entree) {
      entree = { nom, specs: new Map(), cps: new Map() };
      parVille.set(slug, entree);
    }
    // Une commune peut avoir plusieurs codes postaux : on retient le plus fréquent.
    const cp = (n.address || "").match(/\b(\d{5})\b/)?.[1];
    if (cp) entree.cps.set(cp, (entree.cps.get(cp) ?? 0) + 1);
    for (const s of n.specialties || []) {
      entree.specs.set(s, (entree.specs.get(s) ?? 0) + 1);
    }
    entree.specs.set("__total", (entree.specs.get("__total") ?? 0) + 1);
  }

  cache = [...parVille.entries()]
    .map(([slug, { nom, specs, cps }]) => {
      const total = specs.get("__total") ?? 0;
      const specialites = [...specs.entries()]
        .filter(([k]) => k !== "__total")
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([k]) => k);
      const codePostal = [...cps.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      return { nom, slug, nombre: total, specialites, codePostal };
    })
    .filter((v) => v.nombre >= SEUIL_VILLE)
    .sort((a, b) => b.nombre - a.nombre);

  return cache;
}

export function getVilleParSlug(slug: string): VilleCouverte | undefined {
  return getVillesCouvertes().find((v) => v.slug === slug);
}
