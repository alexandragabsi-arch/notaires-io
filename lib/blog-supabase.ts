import { supabase } from "./supabase";

export interface DynamicBlogArticle {
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  excerpt: string | null;
  h1: string | null;
  intro: string | null;
  content_html: string;
  faq_json: Array<{ q: string; r: string }> | null;
  category: string;
  keyword: string | null;
  reading_time: number;
  published_at: string;
}

export async function getDynamicArticleBySlug(
  slug: string,
): Promise<DynamicBlogArticle | null> {
  const { data, error } = await supabase
    .from("blog_articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  return data as DynamicBlogArticle;
}

export async function getDynamicArticles(): Promise<
  Pick<DynamicBlogArticle, "slug" | "title" | "excerpt" | "category" | "reading_time" | "published_at">[]
> {
  const { data, error } = await supabase
    .from("blog_articles")
    .select("slug, title, excerpt, category, reading_time, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  return data;
}

export async function getDynamicArticleSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from("blog_articles")
    .select("slug")
    .eq("published", true);
  return (data ?? []).map((r: { slug: string }) => r.slug);
}
