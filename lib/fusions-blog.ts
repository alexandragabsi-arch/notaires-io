/**
 * Pages de blog retirées au profit d'une autre, sur la même intention.
 *
 * Search Console montrait neuf pages en concurrence sur « rdv notaire » :
 * l'accueil à la 28ᵉ place avec 98 impressions, et huit articles entre la 15ᵉ
 * et la 65ᵉ, aucun ne décollant. Google n'arrivait pas à désigner la page qui
 * représente le site. Chaque groupe converge désormais vers une seule page,
 * celle qui portait déjà les meilleurs signaux.
 *
 * Cette table est l'unique source de vérité : `next.config.ts` en tire les
 * redirections 308, et `app/sitemap.ts` s'en sert pour ne plus déclarer les
 * URL retirées. Ajouter une entrée ici suffit — ne jamais recopier la liste.
 */
export const FUSIONS_BLOG: Record<string, string> = {
  // « rendez-vous rapide / urgent » — un seul sujet, trois pages.
  // rdv-notaire-rapide hérite déjà des URL horodatées les mieux placées
  // (15,8ᵉ et 15,9ᵉ) : c'est elle qui garde l'autorité.
  "rdv-notaire-rapide-en-ligne": "rdv-notaire-rapide",
  "rdv-notaire-urgent-rapide": "rdv-notaire-rapide",
  // Requête transactionnelle, et titre encore daté de 2025.
  "prendre-rdv-notaire-en-ligne": "rdv-notaire-rapide",

  // « premier rendez-vous gratuit » — la page conservée traite la question
  // sous l'angle « mythe ou réalité », sans promettre la gratuité.
  "premier-rdv-notaire-gratuit": "premier-rendez-vous-notaire-gratuit",

  // Rendez-vous en visio — deux pages pour la même chose.
  "rdv-notaire-en-visio": "notaire-en-ligne-rendez-vous-visio",

  // « consultation notaire prix » — deux pages pour la même requête.
  // consultation-notaire-prix est en position 5.7, 106 clics : on le garde.
  "prix-consultation-notaire-pour-renseignement": "consultation-notaire-prix",
};

/**
 * Articles fusionnés dans une page hors du blog.
 *
 * « frais de notaire » (29/10/2026) : quatre articles visaient la même
 * recherche et plafonnaient entre la 33ᵉ et la 52ᵉ place sur 90 jours
 * (« frais de notaire achat maison » : 141 impressions, position 44,5).
 * Ils convergent vers /frais-de-notaire, qui porte le simulateur.
 */
export const FUSIONS_VERS_PAGE: Record<string, string> = {
  "frais-de-notaire-achat-maison": "/frais-de-notaire",
  "frais-de-notaire-achat-immobilier": "/frais-de-notaire",
  "frais-de-notaire-vente-immobiliere": "/frais-de-notaire",
  "frais-notaire-maison-ancienne": "/frais-de-notaire",

  // « compromis / acte de vente / délai de signature » (29/10/2026) : quatre
  // articles sur le même parcours. « signature notaire délai » (383
  // impressions) et « compromis de vente notaire » (188) restaient vers la
  // 27ᵉ place sans un clic. Ils convergent vers /compromis-acte-de-vente.
  "compromis-acte-de-vente-difference": "/compromis-acte-de-vente",
  "delai-signature-acte-notarie": "/compromis-acte-de-vente",
  "acte-de-vente-notaire-immobilier": "/compromis-acte-de-vente",
  "compromis-de-vente-notaire": "/compromis-acte-de-vente",
};

/** Slugs qui ne doivent plus être déclarés ni liés. */
export const SLUGS_RETIRES = new Set([...Object.keys(FUSIONS_BLOG), ...Object.keys(FUSIONS_VERS_PAGE)]);
