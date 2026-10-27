// Les 26 grandes villes servies par une page écrite à la main
// (/notaire-paris, /notaire-lyon…) plutôt que par /notaire-ville/[ville].
//
// Module pur, sans accès au disque : le fil d'Ariane des fiches, utilisé par un
// composant client, et next.config.ts en ont besoin. villes-data, qui lit
// l'annuaire avec `fs`, le réexporte.

/** Villes déjà servies par une page écrite à la main, à ne pas dupliquer. */
export const VILLES_STATIQUES = new Set([
  "paris", "lyon", "marseille", "toulouse", "nice", "nantes", "montpellier",
  "strasbourg", "bordeaux", "lille", "rennes", "reims", "toulon",
  "saint-etienne", "le-havre", "grenoble", "dijon", "angers", "nancy", "metz",
  "clermont-ferrand", "aix-en-provence", "brest", "rouen", "orleans", "perpignan",
]);

/**
 * Chemin de la page d'une ville. Pour les 26 villes statiques,
 * /notaire-ville/{slug} n'existe pas (404) : la page est /notaire-{slug}.
 */
export function cheminVille(slug: string): string {
  return VILLES_STATIQUES.has(slug) ? `/notaire-${slug}` : `/notaire-ville/${slug}`;
}
