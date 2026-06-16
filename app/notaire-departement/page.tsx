import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DEPARTEMENTS } from "@/lib/departements-data";

export const metadata: Metadata = {
  title: "Notaire par département — tous les départements de France · Notaires.io",
  description: "Trouvez un notaire dans votre département. Notaires.io couvre les 95 départements métropolitains — prise de rendez-vous en ligne, en visio ou au cabinet.",
  alternates: { canonical: "https://notaires.io/notaire-departement" },
};

// Trier par population décroissante pour afficher les plus peuplés en premier
const sorted = [...DEPARTEMENTS].sort((a, b) => b.population - a.population);

export default function Page() {
  return (
    <>
      <Header />
      <main className="max-w-[1200px] mx-auto px-6 py-14 sm:py-20">
        <div className="text-center mb-12">
          <h1 className="serif text-[28px] sm:text-[34px] lg:text-[40px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight text-balance">
            Trouver un notaire par département
          </h1>
          <p className="text-[var(--color-muted)] text-[16px] max-w-[620px] mx-auto mt-4 leading-relaxed">
            Sélectionnez votre département pour trouver un notaire et prendre
            rendez-vous en ligne — en visio ou au cabinet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-[1000px] mx-auto">
          {sorted.map((dep) => (
            <Link
              key={dep.slug}
              href={`/notaire-departement/${dep.slug}`}
              className="flex items-center gap-3 rounded-2xl border border-[var(--color-border-soft)] bg-white px-4 py-3 shadow-[var(--shadow-card)] hover:border-[var(--color-accent)] hover:bg-[var(--color-tint-blue)] hover:-translate-y-0.5 transition-all group"
            >
              <span className="w-10 text-center text-xs font-bold text-[var(--color-muted)] group-hover:text-[var(--color-accent)] shrink-0">
                {dep.code}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-[var(--color-text-strong)] truncate group-hover:text-[var(--color-primary)]">
                  {dep.name}
                </p>
                {dep.chefLieu && (
                  <p className="text-xs text-[var(--color-muted)] truncate">{dep.chefLieu}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 max-w-[760px] mx-auto rounded-3xl bg-[var(--color-tint-blue)] border border-[var(--color-border-soft)] p-8 text-center">
          <h2 className="serif text-[22px] sm:text-[26px] font-bold text-[var(--color-text-strong)] mb-2">
            Votre notaire, partout en France
          </h2>
          <p className="text-[var(--color-muted)] text-[15px] max-w-[480px] mx-auto mb-6 leading-relaxed">
            Quel que soit votre département, nos notaires partenaires vous reçoivent
            en visio ou au cabinet.
          </p>
          <Link
            href="/annuaire"
            className="inline-flex items-center justify-center bg-gradient-cta text-white rounded-[10px] px-7 py-3.5 text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
          >
            Trouver mon notaire
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
