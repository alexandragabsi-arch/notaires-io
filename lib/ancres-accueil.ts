/**
 * Texte des liens contextuels qui pointent vers la page d'accueil.
 *
 * L'accueil est la page que Google retient pour « rdv notaire en ligne » :
 * 28 des 35 impressions de la requête lui reviennent. Or aucune des
 * 1 775 pages de ville ne le lui disait — les seuls liens vers « / » venaient
 * de l'en-tête et du pied de page, avec pour texte « Prendre RDV » ou
 * « Notaires.io ». Le texte d'un lien est pourtant ce qui indique à un moteur
 * le sujet de la page d'arrivée.
 *
 * La formulation varie selon la page : mille sept cents liens portant le même
 * texte exact se lisent comme une optimisation, pas comme une rédaction.
 */
const ANCRES = [
  "Prendre RDV avec un notaire en ligne",
  "Prenez rendez-vous avec un notaire en ligne",
  "Réserver un rendez-vous notaire en ligne",
  "Trouver un notaire et réserver en ligne",
  "Prendre RDV notaire sur les disponibilités réelles",
] as const;

/** Toujours la même ancre pour une page donnée, pour que le lien soit stable. */
export function ancreAccueil(cle: string): string {
  let somme = 0;
  for (let i = 0; i < cle.length; i++) somme = (somme * 31 + cle.charCodeAt(i)) >>> 0;
  return ANCRES[somme % ANCRES.length];
}
