/**
 * Prépositions devant un nom de commune.
 *
 * Les pages de ville écrivaient « à Le Vésinet », « de Le Pecq », « à Les
 * Lilas », « de Épinal » : des fautes visibles dans le titre, le H1 et la FAQ
 * de toutes les communes à article. En français l'article se contracte
 * (au, aux, du, des) et « de » s'élide devant une voyelle.
 *
 * « La » et « L' » ne se contractent pas : « à La Ciotat », « de L'Isle-Adam ».
 * Le h n'est pas élidé, faute de distinguer h muet et h aspiré.
 */

const VOYELLE = /^[aeiouyàâäéèêëîïôöùûüœæ]/i;

function decouper(nom: string): { article: "le" | "les" | null; reste: string } {
  const m = nom.match(/^(Le|Les)\s+(.+)$/);
  if (!m) return { article: null, reste: nom };
  return { article: m[1].toLowerCase() as "le" | "les", reste: m[2] };
}

const cap = (s: string, majuscule: boolean) =>
  majuscule ? s.charAt(0).toUpperCase() + s.slice(1) : s;

/** « à Paris », « au Vésinet », « aux Lilas », « à La Ciotat ». */
export function aVille(nom: string, majuscule = false): string {
  const { article, reste } = decouper(nom);
  const prep = article === "le" ? "au " : article === "les" ? "aux " : "à ";
  return cap(prep, majuscule) + (article ? reste : nom);
}

/** « de Paris », « du Pecq », « des Lilas », « d'Épinal », « de La Ciotat ». */
export function deVille(nom: string, majuscule = false): string {
  const { article, reste } = decouper(nom);
  if (article === "le") return cap("du ", majuscule) + reste;
  if (article === "les") return cap("des ", majuscule) + reste;
  return cap(VOYELLE.test(nom) ? "d'" : "de ", majuscule) + nom;
}
