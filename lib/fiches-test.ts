/**
 * Fiches de démonstration, à garder en base mais à cacher des moteurs.
 *
 * « Me Test Martin — FICHE DE TEST » est marquée `verifie = true` et
 * `subscription_status = 'active'` : elle passait donc pour une fiche
 * complétée, était déclarée au sitemap et servie en `index, follow`. Google
 * était explicitement invité à indexer un faux notaire — sur un site qui n'en
 * compte que deux inscrits, c'est un signal de qualité coûteux.
 *
 * On ne la supprime pas : c'est vraisemblablement le compte de démonstration
 * fourni à la revue App Store. On la rend simplement invisible aux robots.
 */
export const FICHES_TEST = new Set<string>([
  "11111111-1111-4111-8111-111111111111",
]);

export const estFicheTest = (id: string) => FICHES_TEST.has(id);
