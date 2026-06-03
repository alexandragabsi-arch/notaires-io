import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Conseils notariaux — Guide pratique",
  description:
    "Guides pratiques sur l'immobilier, la succession, le mariage, le divorce et la création de société. Conseils rédigés par des notaires en exercice.",
  alternates: { canonical: "https://notaires.io/blog" },
};

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

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        {/* Hero */}
        <section className="bg-[var(--color-tint-blue)] border-b border-[var(--color-border-soft)] py-16 px-6">
          <div className="max-w-[1200px] mx-auto">
            <p className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-wider mb-3">
              Blog & Guides
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] mb-4 leading-tight">
              Conseils notariaux — Guide pratique
            </h1>
            <p className="text-[var(--color-muted)] text-lg max-w-[640px]">
              Guides rédigés par des notaires en exercice pour vous aider à préparer votre projet immobilier, votre succession, votre mariage ou votre donation.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {BLOG_POSTS.map((post) => {
              const catColor = CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600";
              return (
                <article
                  key={post.slug}
                  className="bg-white border border-[var(--color-border)] rounded-2xl p-6 flex flex-col hover:shadow-[var(--shadow-strong)] transition-shadow duration-200"
                >
                  {/* Category pill */}
                  <span
                    className={`inline-block self-start text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4 ${catColor}`}
                  >
                    {post.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-[17px] font-bold text-[var(--color-text-strong)] leading-snug mb-3 flex-1">
                    <a
                      href={`/blog/${post.slug}`}
                      className="hover:text-[var(--color-accent)] transition-colors"
                    >
                      {post.title}
                    </a>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-[12px] text-[var(--color-muted)] border-t border-[var(--color-border-soft)] pt-4">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>{post.readingTime} min de lecture</span>
                  </div>

                  {/* CTA */}
                  <a
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:underline"
                  >
                    Lire l&apos;article →
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[var(--color-tint-blue)] border-t border-[var(--color-border-soft)] py-14 px-6">
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
