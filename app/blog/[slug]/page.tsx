import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog-posts";
import { getPostContent } from "@/lib/blog-content";

const BASE = "https://notaires.io";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
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
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  Mariage: "bg-pink-50 text-pink-700",
  Immobilier: "bg-blue-50 text-blue-700",
  Succession: "bg-amber-50 text-amber-700",
  Famille: "bg-purple-50 text-purple-700",
  Guide: "bg-emerald-50 text-emerald-700",
  Donation: "bg-orange-50 text-orange-700",
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
    author: {
      "@type": "Organization",
      name: "Notaires.io",
      url: BASE,
    },
    publisher: {
      "@type": "Organization",
      name: "Notaires.io",
      url: BASE,
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/og-image.png`,
      },
    },
    inLanguage: "fr-FR",
    keywords: post.keywords.join(", "),
  };

  const catColor = CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 bg-white">
        {/* Breadcrumb */}
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
          {/* Category + reading time */}
          <div className="flex items-center gap-3 mb-5">
            <span className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${catColor}`}>
              {post.category}
            </span>
            <span className="text-[13px] text-[var(--color-muted)]">{post.readingTime} min de lecture</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] leading-tight mb-4">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-4">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-[13px] text-[var(--color-muted)] border-y border-[var(--color-border-soft)] py-4 mb-10">
            <span>
              Par <strong className="text-[var(--color-text-strong)]">Notaires.io</strong>
            </span>
            <span>·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>

          {/* Article body */}
          <div className="prose-article">
            {content}
          </div>
        </article>

        {/* Related articles */}
        <section className="bg-[var(--color-tint-blue)] border-t border-[var(--color-border-soft)] py-12 px-6">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-xl font-bold text-[var(--color-primary)] mb-6">Autres guides</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {BLOG_POSTS.filter((p) => p.slug !== slug)
                .slice(0, 4)
                .map((p) => {
                  const cc = CATEGORY_COLORS[p.category] ?? "bg-gray-100 text-gray-600";
                  return (
                    <a
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="bg-white border border-[var(--color-border)] rounded-xl p-4 hover:shadow-[var(--shadow-card)] transition-shadow block"
                    >
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${cc}`}>
                        {p.category}
                      </span>
                      <p className="text-sm font-semibold text-[var(--color-text-strong)] leading-snug">
                        {p.title}
                      </p>
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
