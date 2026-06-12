import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Aperçu des espaces — Notaires.io",
  description: "Page de test interne : aperçu de l'espace particulier et de l'espace notaire.",
  robots: { index: false, follow: false }, // page de test : non indexée
  alternates: { canonical: "/test" },
};

const CARDS = [
  {
    href: "/espace-client?demo=1",
    emoji: "👤",
    title: "Espace particulier",
    desc: "Aperçu de l'espace client : rendez-vous à venir, passés, pièces transmises et reçues.",
  },
  {
    href: "/espace-notaire?demo=1",
    emoji: "⚖️",
    title: "Espace notaire",
    desc: "Aperçu de l'espace notaire : profil avec photo, QR code, raccourcis et tableau de bord.",
  },
];

export default function TestPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-[760px] mx-auto">
            <div className="text-center mb-10">
              <div className="text-[12px] font-bold uppercase tracking-[1px] text-[var(--color-accent)] mb-2">
                Page de test interne
              </div>
              <h1 className="serif text-[30px] sm:text-[40px] font-bold text-[var(--color-text-strong)] tracking-tight">
                Aperçu des espaces
              </h1>
              <p className="text-[15px] text-[var(--color-muted)] mt-3 max-w-[480px] mx-auto">
                Accès démo, sans connexion. Les données affichées sont fictives
                (aucune donnée réelle de client ou de notaire).
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {CARDS.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  className="group flex flex-col gap-3 p-7 bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-strong)] hover:-translate-y-0.5 transition-all"
                >
                  <span className="text-[34px]" aria-hidden>{c.emoji}</span>
                  <span className="serif text-[20px] font-bold text-[var(--color-text-strong)]">
                    {c.title}
                  </span>
                  <span className="text-[14px] text-[var(--color-muted)] leading-relaxed flex-1">
                    {c.desc}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-accent)] mt-1">
                    Ouvrir l&apos;aperçu
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
