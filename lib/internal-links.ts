import { supabase } from "./supabase";
import { FUSIONS_BLOG, FUSIONS_VERS_PAGE } from "./fusions-blog";

/**
 * Pages piliers, liées avant tout article. Les articles se liaient seulement
 * entre eux : sur « frais de notaire », sept pages se renvoyaient la balle et
 * aucune ne pointait vers le simulateur, qui est pourtant la réponse à
 * « calcul frais de notaire ». Les ancres vont de la plus précise à la plus
 * générale : la première trouvée dans l'article est utilisée.
 */
const PAGES_PILIERS: { href: string; ancres: string[] }[] = [
  {
    href: "/frais-de-notaire",
    ancres: [
      "calcul des frais de notaire",
      "calculer les frais de notaire",
      "calculer vos frais de notaire",
      "simulateur de frais de notaire",
      "frais de notaire",
    ],
  },
];

/** Adresse finale d'un article : un article fusionné renvoie vers sa page de destination. */
function hrefArticle(slug: string): string {
  if (FUSIONS_VERS_PAGE[slug]) return FUSIONS_VERS_PAGE[slug];
  return `/blog/${FUSIONS_BLOG[slug] ?? slug}`;
}

interface ArticleLink {
  slug: string;
  keyword: string | null;
  title: string;
}

let _cache: { articles: ArticleLink[]; ts: number } | null = null;
const CACHE_TTL = 3600_000;

async function getArticlesForLinking(): Promise<ArticleLink[]> {
  if (_cache && Date.now() - _cache.ts < CACHE_TTL) return _cache.articles;
  const { data } = await supabase
    .from("blog_articles")
    .select("slug, keyword, title")
    .eq("published", true);
  const articles = (data ?? []) as ArticleLink[];
  _cache = { articles, ts: Date.now() };
  return articles;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function insertInternalLinks(
  html: string,
  currentSlug: string,
): Promise<string> {
  const articles = await getArticlesForLinking();
  const candidates = articles
    .filter((a) => a.slug !== currentSlug && a.keyword)
    .map((a) => ({
      ...a,
      anchor: a.keyword!,
      anchorNorm: normalize(a.keyword!),
      anchorLen: a.keyword!.length,
    }))
    .sort((a, b) => b.anchorLen - a.anchorLen);

  let inserted = 0;
  const maxLinks = 5;
  // Un lien par adresse : deux articles fusionnés dans la même page ne la lient pas deux fois.
  const usedHrefs = new Set<string>();
  let result = html;

  for (const pilier of PAGES_PILIERS) {
    for (const ancre of pilier.ancres) {
      const lie = lierAncre(result, ancre, pilier.href);
      if (lie) {
        result = lie;
        usedHrefs.add(pilier.href);
        inserted++;
        break;
      }
    }
  }

  for (const c of candidates) {
    if (inserted >= maxLinks) break;
    const href = hrefArticle(c.slug);
    if (usedHrefs.has(href) || href === `/blog/${currentSlug}`) continue;

    const lie = lierAncre(result, c.anchor, href);
    if (lie) {
      result = lie;
      usedHrefs.add(href);
      inserted++;
    }
  }

  return result;
}

/** Lie la première occurrence libre de l'ancre ; null si elle n'apparaît pas hors d'un lien. */
function lierAncre(html: string, ancre: string, href: string): string | null {
  const pattern = new RegExp(
    `(?<![<\/a-zA-Z"=])\\b(${escapeRegex(ancre)})\\b(?![^<]*<\\/a>)(?![^<]*>)`,
    "i",
  );
  const match = html.match(pattern);
  if (!match || match.index === undefined) return null;
  const before = html.slice(0, match.index);
  if (isInsideTag(before)) return null;
  const after = html.slice(match.index + match[0].length);
  return `${before}<a href="${href}">${match[0]}</a>${after}`;
}

function isInsideTag(textBefore: string): boolean {
  const lastOpen = textBefore.lastIndexOf("<");
  const lastClose = textBefore.lastIndexOf(">");
  return lastOpen > lastClose;
}
