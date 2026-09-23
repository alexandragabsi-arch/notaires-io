// Offres « essai sans carte ». L'offre de lancement s'applique à toute
// inscription ; un lien /inscription?offre=<code> permet d'en nommer une autre
// (campagne identifiée, suivi séparé). Partagé navigateur / serveur ; le
// serveur revérifie toujours la validité.

export const OFFRES = {
  // Offre par défaut : 2 mois offerts sans carte pour tout notaire qui s'inscrit.
  lancement: {
    mois: 2,
    finValidite: "2026-12-31T23:59:59+01:00",
    libelle: "Offre de lancement",
  },
  // Campagne abonnés de la page LinkedIn (septembre 2026).
  linkedin: {
    mois: 2,
    finValidite: "2026-09-30T23:59:59+02:00",
    libelle: "Offre abonnés LinkedIn",
  },
} as const;

/** Offre appliquée quand le lien n'en précise aucune. */
export const OFFRE_PAR_DEFAUT: CodeOffre = "lancement";

export type CodeOffre = keyof typeof OFFRES;

export function offreConnue(code: string | null | undefined): CodeOffre | null {
  return code && Object.prototype.hasOwnProperty.call(OFFRES, code) ? (code as CodeOffre) : null;
}

// Offre existante ET encore ouverte aux inscriptions.
export function offreValide(code: string | null | undefined, maintenant = new Date()): CodeOffre | null {
  const c = offreConnue(code);
  return c && maintenant.getTime() <= new Date(OFFRES[c].finValidite).getTime() ? c : null;
}

/** Offre à appliquer à une inscription : celle du lien si elle est encore
 *  ouverte, sinon l'offre de lancement. Null si plus aucune n'est ouverte. */
export function offreApplicable(code: string | null | undefined, maintenant = new Date()): CodeOffre | null {
  return offreValide(code, maintenant) ?? offreValide(OFFRE_PAR_DEFAUT, maintenant);
}

/** Fin de l'accès offert : N mois calendaires (le 15 mars → le 15 mai).
 *  Débordement (31 déc. + 2 mois) recalé sur le dernier jour du mois visé. */
export function finAccesIso(mois: number, depuis = new Date()): string {
  const d = new Date(depuis);
  const jour = d.getDate();
  d.setMonth(d.getMonth() + mois);
  if (d.getDate() !== jour) d.setDate(0);
  return d.toISOString();
}

export function dateFr(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
}

// Statuts d'abonnement (colonne subscription_status).
export const STATUTS_ESSAI = ["essai_offert", "offert"] as const;
export function estEssaiSansCarte(statut: string | null | undefined): boolean {
  return statut === "essai_offert" || statut === "offert";
}
