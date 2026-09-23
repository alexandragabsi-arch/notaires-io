// Les articles du blog sont rédigés en HTML par l'agent SEO. Les champs de
// texte simple (chapô, résumé, réponses de FAQ) sont parfois livrés avec des
// balises : affichés tels quels, le lecteur voyait « <strong>6 mois</strong> »,
// et les balises se retrouvaient dans la description Google.

const ENTITES: Record<string, string> = {
  "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"',
  "&#39;": "'", "&apos;": "'", "&eacute;": "é", "&egrave;": "è", "&agrave;": "à",
  "&ccedil;": "ç", "&ocirc;": "ô", "&ecirc;": "ê", "&laquo;": "«", "&raquo;": "»",
  "&hellip;": "…", "&euro;": "€", "&rsquo;": "’",
};

/** Texte sans balises HTML ni entités, pour un affichage en texte simple. */
export function texteBrut(v: string | null | undefined): string {
  if (!v) return "";
  return v
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6])>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z#0-9]+;/gi, (e) => ENTITES[e.toLowerCase()] ?? e)
    .replace(/\s+/g, " ")
    .trim();
}
