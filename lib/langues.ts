/**
 * Langues parlées affichées sur les cartes notaire : le français toujours en
 * premier, puis celles que le notaire a renseignées. Beaucoup de profils n'en
 * indiquent aucune (Me Alezan, 19/10/2026) et la carte n'en montrait alors pas.
 */
export function languesAffichees(langues?: string[]): string[] {
  const autres = (langues ?? []).filter((l) => l && l.trim().toLowerCase() !== "français");
  return ["Français", ...new Set(autres.map((l) => l.trim()))];
}
