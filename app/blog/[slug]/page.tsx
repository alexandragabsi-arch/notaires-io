import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog-posts";
import { getPostContent } from "@/lib/blog-content";
import { getDynamicArticleBySlug, getDynamicArticleSlugs } from "@/lib/blog-supabase";

const BASE = "https://notaires.io";
// Image de partage social (OpenGraph / Twitter) par défaut pour les articles.
const OG_IMAGE = { url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: "Notaires.io" };

// Allow slugs not in generateStaticParams (new articles from N8N agent)
export const dynamicParams = true;

export async function generateStaticParams() {
  const staticSlugs = BLOG_POSTS.map((post) => ({ slug: post.slug }));
  const dynamicSlugs = (await getDynamicArticleSlugs()).map((slug) => ({ slug }));
  const seen = new Set(staticSlugs.map((s) => s.slug));
  const merged = [...staticSlugs, ...dynamicSlugs.filter((s) => !seen.has(s.slug))];
  return merged;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const dynamic = await getDynamicArticleBySlug(slug);
  if (dynamic) {
    const title = dynamic.meta_title ?? dynamic.title;
    const desc = dynamic.meta_description ?? dynamic.excerpt ?? "";
    return {
      title,
      description: desc,
      keywords: dynamic.keyword ? [dynamic.keyword] : undefined,
      alternates: { canonical: `${BASE}/blog/${slug}` },
      openGraph: {
        title: `${title} · Notaires.io`,
        description: desc,
        url: `${BASE}/blog/${slug}`,
        siteName: "Notaires.io",
        locale: "fr_FR",
        type: "article",
        publishedTime: dynamic.published_at,
        images: [OG_IMAGE],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} · Notaires.io`,
        description: desc,
        images: [OG_IMAGE.url],
      },
    };
  }

  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: post.canonicalUrl },
    openGraph: {
      title: `${post.title} · Notaires.io`,
      description: post.excerpt,
      url: post.canonicalUrl,
      siteName: "Notaires.io",
      locale: "fr_FR",
      type: "article",
      publishedTime: post.date,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} · Notaires.io`,
      description: post.excerpt,
      images: [OG_IMAGE.url],
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  Mariage: "bg-pink-50 text-pink-700",
  Immobilier: "bg-blue-50 text-blue-700",
  Succession: "bg-green-50 text-green-800",
  Famille: "bg-purple-50 text-purple-700",
  Guide: "bg-emerald-50 text-emerald-700",
  Donation: "bg-orange-50 text-orange-700",
  FAQ: "bg-teal-50 text-teal-700",
  Local: "bg-violet-50 text-violet-700",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Dynamic articles from N8N agent (Supabase)
  const dynamic = await getDynamicArticleBySlug(slug);
  if (dynamic) {
    const catColor = CATEGORY_COLORS[dynamic.category] ?? "bg-gray-100 text-gray-600";
    const faq = dynamic.faq_json ?? [];

    const articleJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: dynamic.h1 ?? dynamic.title,
      description: dynamic.excerpt ?? "",
      url: `${BASE}/blog/${slug}`,
      datePublished: dynamic.published_at,
      dateModified: dynamic.published_at,
      author: { "@type": "Organization", name: "Notaires.io", url: BASE },
      publisher: {
        "@type": "Organization",
        name: "Notaires.io",
        url: BASE,
        logo: { "@type": "ImageObject", url: `${BASE}/og-image.png` },
      },
      inLanguage: "fr-FR",
      keywords: dynamic.keyword ?? "",
    };

    const faqJsonLd = faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.r },
          })),
        }
      : null;

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        {faqJsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        )}
        <Header />
        <main className="flex-1 bg-white">
          <div className="bg-[var(--color-tint-blue)] border-b border-[var(--color-border-soft)]">
            <div className="max-w-[800px] mx-auto px-6 py-3 text-[13px] text-[var(--color-muted)] flex items-center gap-2">
              <a href="/" className="hover:text-[var(--color-accent)] transition-colors">Accueil</a>
              <span>›</span>
              <a href="/blog" className="hover:text-[var(--color-accent)] transition-colors">Blog</a>
              <span>›</span>
              <span className="text-[var(--color-text-strong)] truncate">{dynamic.title}</span>
            </div>
          </div>

          <article className="max-w-[800px] mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-5">
              <span className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${catColor}`}>
                {dynamic.category}
              </span>
              <span className="text-[13px] text-[var(--color-muted)]">{dynamic.reading_time} min de lecture</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] leading-tight mb-4">
              {dynamic.h1 ?? dynamic.title}
            </h1>

            <div className="flex items-center gap-4 text-[13px] text-[var(--color-muted)] border-y border-[var(--color-border-soft)] py-4 mb-8">
              <span>Par <strong className="text-[var(--color-text-strong)]">Notaires.io</strong></span>
              <span>·</span>
              <time dateTime={dynamic.published_at}>{formatDate(dynamic.published_at)}</time>
            </div>

            {/* Une seule introduction : on privilégie `intro` (le vrai chapô de
               l'article) ; à défaut on retombe sur `excerpt`. L'excerpt reste
               utilisé pour le SEO (meta description) et les cartes du blog. */}
            {(dynamic.intro || dynamic.excerpt) && (
              <p className="text-[17px] leading-relaxed text-[var(--color-muted)] mb-8 text-justify hyphens-auto">
                {dynamic.intro || dynamic.excerpt}
              </p>
            )}

            <div
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: dynamic.content_html }}
            />

            {faq.length > 0 && (
              <div className="mt-12 border-t border-[var(--color-border-soft)] pt-10">
                <h2 className="text-xl font-bold text-[var(--color-primary)] mb-6">Questions fréquentes</h2>
                <div className="flex flex-col gap-4">
                  {faq.map((f, i) => (
                    <div key={i} className="bg-[var(--color-tint-blue)] rounded-xl p-5">
                      <p className="font-semibold text-[var(--color-text-strong)] mb-2">{f.q}</p>
                      <p className="text-[var(--color-muted)] text-[15px] leading-relaxed">{f.r}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          <section className="bg-[var(--color-tint-blue)] border-t border-[var(--color-border-soft)] py-12 px-6">
            <div className="max-w-[800px] mx-auto">
              <h2 className="text-xl font-bold text-[var(--color-primary)] mb-6">Autres guides</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {BLOG_POSTS.slice(0, 4).map((p) => {
                  const cc = CATEGORY_COLORS[p.category] ?? "bg-gray-100 text-gray-600";
                  return (
                    <a key={p.slug} href={`/blog/${p.slug}`}
                      className="bg-white border border-[var(--color-border)] rounded-xl p-4 hover:shadow-[var(--shadow-card)] transition-shadow block">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${cc}`}>
                        {p.category}
                      </span>
                      <p className="text-sm font-semibold text-[var(--color-text-strong)] leading-snug">{p.title}</p>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  // Static articles (existing blog posts)
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const content = getPostContent(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: post.canonicalUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Notaires.io", url: BASE },
    publisher: {
      "@type": "Organization",
      name: "Notaires.io",
      url: BASE,
      logo: { "@type": "ImageObject", url: `${BASE}/og-image.png` },
    },
    inLanguage: "fr-FR",
    keywords: post.keywords.join(", "),
  };

  const faqLd = post.faqs && post.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const catColor = CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      <Header />
      <main className="flex-1 bg-white">
        <div className="bg-[var(--color-tint-blue)] border-b border-[var(--color-border-soft)]">
          <div className="max-w-[800px] mx-auto px-6 py-3 text-[13px] text-[var(--color-muted)] flex items-center gap-2">
            <a href="/" className="hover:text-[var(--color-accent)] transition-colors">Accueil</a>
            <span>›</span>
            <a href="/blog" className="hover:text-[var(--color-accent)] transition-colors">Blog</a>
            <span>›</span>
            <span className="text-[var(--color-text-strong)] truncate">{post.title}</span>
          </div>
        </div>

        <article className="max-w-[800px] mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-5">
            <span className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${catColor}`}>
              {post.category}
            </span>
            <span className="text-[13px] text-[var(--color-muted)]">{post.readingTime} min de lecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-4 text-justify hyphens-auto">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 text-[13px] text-[var(--color-muted)] border-y border-[var(--color-border-soft)] py-4 mb-10">
            <span>Par <strong className="text-[var(--color-text-strong)]">Notaires.io</strong></span>
            <span>·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>

          <div className="prose-article">
            {content}
          </div>
        </article>

        <section className="bg-[var(--color-tint-blue)] border-t border-[var(--color-border-soft)] py-12 px-6">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-xl font-bold text-[var(--color-primary)] mb-6">Autres guides</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {BLOG_POSTS.filter((p) => p.slug !== slug)
                .slice(0, 4)
                .map((p) => {
                  const cc = CATEGORY_COLORS[p.category] ?? "bg-gray-100 text-gray-600";
                  return (
                    <a key={p.slug} href={`/blog/${p.slug}`}
                      className="bg-white border border-[var(--color-border)] rounded-xl p-4 hover:shadow-[var(--shadow-card)] transition-shadow block">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${cc}`}>
                        {p.category}
                      </span>
                      <p className="text-sm font-semibold text-[var(--color-text-strong)] leading-snug">{p.title}</p>
                    </a>
                  );
                })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
