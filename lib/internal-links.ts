import { supabase } from "./supabase";

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
  const usedSlugs = new Set<string>();
  let result = html;

  for (const c of candidates) {
    if (inserted >= maxLinks) break;
    if (usedSlugs.has(c.slug)) continue;

    const pattern = new RegExp(
      `(?<![<\/a-zA-Z"=])\\b(${escapeRegex(c.anchor)})\\b(?![^<]*<\\/a>)(?![^<]*>)`,
      "i",
    );
    const match = result.match(pattern);
    if (match && match.index !== undefined) {
      const before = result.slice(0, match.index);
      const after = result.slice(match.index + match[0].length);
      if (!isInsideTag(before)) {
        const link = `<a href="/blog/${c.slug}">${match[0]}</a>`;
        result = before + link + after;
        usedSlugs.add(c.slug);
        inserted++;
      }
    }
  }

  return result;
}

function isInsideTag(textBefore: string): boolean {
  const lastOpen = textBefore.lastIndexOf("<");
  const lastClose = textBefore.lastIndexOf(">");
  return lastOpen > lastClose;
}
