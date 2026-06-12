import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { getDynamicArticles } from "@/lib/blog-supabase";

// Revalidate every 5 minutes so new N8N articles appear quickly
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Conseils notariaux — Guides pratiques · Notaires.io",
  description:
    "Guides pratiques sur l'immobilier, la succession, le mariage, le divorce et la création de société. Toutes vos questions notariales en clair.",
  alternates: { canonical: "https://notaires.io/blog" },
};

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

export default async function BlogPage() {
  // Merge static posts with dynamic Supabase articles, newest first
  const dynamic = await getDynamicArticles();

  const staticPosts = BLOG_POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    reading_time: p.readingTime,
    published_at: p.date,
  }));

  const dynamicSlugs = new Set(dynamic.map((d) => d.slug));
  const merged = [
    ...dynamic,
    ...staticPosts.filter((p) => !dynamicSlugs.has(p.slug)),
  ].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        {/* Hero */}
        <section className="bg-white border-b border-[var(--color-border-soft)] py-16 px-6">
          <div className="max-w-[760px] mx-auto text-center">
            <p className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-wider mb-3">
              Conseils notariaux
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] mb-4 leading-tight">
              Guides pratiques
            </h1>
            <p className="text-[var(--color-muted)] text-lg max-w-[560px] mx-auto">
              Tout ce que vous devez savoir avant votre rendez-vous : immobilier, succession, mariage, donation.
            </p>
            <p className="text-[13px] text-[var(--color-muted)] mt-3">
              {merged.length} guides disponibles
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {merged.map((post) => {
              const catColor = CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600";
              return (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 flex flex-col hover:shadow-[var(--shadow-strong)] hover:border-[var(--color-accent-soft)] transition-all duration-200"
                >
                  <span className={`inline-block self-start text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3.5 ${catColor}`}>
                    {post.category}
                  </span>

                  <h2 className="text-[17px] font-bold text-[var(--color-text-strong)] leading-snug mb-2.5 group-hover:text-[var(--color-accent)] transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-5 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-[12px] text-[var(--color-muted)] border-t border-[var(--color-border-soft)] pt-4">
                    <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                    <span>{post.reading_time} min de lecture</span>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] group-hover:gap-2.5 transition-all">
                    Lire l&apos;article →
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-white border-t border-[var(--color-border-soft)] py-14 px-6">
          <div className="max-w-[640px] mx-auto text-center">
            <h2 className="text-2xl font-extrabold text-[var(--color-primary)] mb-3">
              Une question pour un notaire ?
            </h2>
            <p className="text-[var(--color-muted)] mb-6">
              Le premier rendez-vous est offert. En visio ou au cabinet, en moins de 48 h.
            </p>
            <a
              href="/#hero"
              className="inline-block bg-gradient-cta text-white px-7 py-3.5 rounded-[10px] font-semibold shadow-[var(--shadow-cta)] hover:shadow-[var(--shadow-cta-hover)] transition-shadow"
            >
              Prendre rendez-vous gratuitement
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
