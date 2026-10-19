/**
 * Langues étrangères affichées sur les cartes notaire. Le français va de soi
 * et n'est pas affiché : la ligne « Langues » n'apparaît que si le notaire
 * parle une autre langue.
 */
export function languesAffichees(langues?: string[]): string[] {
  const autres = (langues ?? []).map((l) => l?.trim()).filter((l) => l && l.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() !== "francais");
  return [...new Set(autres)];
}
