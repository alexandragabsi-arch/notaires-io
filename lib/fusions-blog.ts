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
};

/** Slugs qui ne doivent plus être déclarés ni liés. */
export const SLUGS_RETIRES = new Set(Object.keys(FUSIONS_BLOG));
