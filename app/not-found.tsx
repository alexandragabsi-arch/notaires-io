import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Page 404 du site. Celle de Next.js par défaut était en anglais, sans en-tête
// ni lien : une impasse pour le visiteur comme pour les robots. Celle-ci
// renvoie vers les pages qui comptent (annuaire, villes, départements).
export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

const VILLES = [
  { nom: "Paris", href: "/notaire-paris" },
  { nom: "Lyon", href: "/notaire-lyon" },
  { nom: "Marseille", href: "/notaire-marseille" },
  { nom: "Toulouse", href: "/notaire-toulouse" },
  { nom: "Bordeaux", href: "/notaire-bordeaux" },
  { nom: "Nice", href: "/notaire-nice" },
  { nom: "Nantes", href: "/notaire-nantes" },
  { nom: "Lille", href: "/notaire-lille" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="max-w-[860px] mx-auto px-6 py-16 sm:py-24 text-center">
        <p className="text-sm font-semibold text-[var(--color-accent)] mb-3">Erreur 404</p>
        <h1 className="serif text-[28px] sm:text-[36px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight text-balance">
          Cette page est introuvable
        </h1>
        <p className="text-[var(--color-muted)] text-[16px] max-w-[560px] mx-auto mt-4 leading-relaxed">
          Le lien est peut-être ancien, ou la fiche a été retirée de l&apos;annuaire.
          Retrouvez un notaire près de chez vous et prenez rendez-vous en ligne.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/annuaire"
            className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-[15px] font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Rechercher un notaire
          </Link>
          <Link
            href="/notaire-departement"
            className="rounded-full border border-[var(--color-border-soft)] bg-white px-6 py-3 text-[15px] font-semibold text-[var(--color-text-strong)] hover:border-[var(--color-accent)] transition-colors"
          >
            Notaires par département
          </Link>
        </div>

        <h2 className="serif text-[20px] font-bold text-[var(--color-text-strong)] mt-14 mb-4">
          Notaires dans les grandes villes
        </h2>
        <ul className="flex flex-wrap justify-center gap-2">
          {VILLES.map((v) => (
            <li key={v.href}>
              <Link
                href={v.href}
                className="inline-block rounded-2xl border border-[var(--color-border-soft)] bg-white px-4 py-2 text-[14px] text-[var(--color-text-strong)] hover:border-[var(--color-accent)] hover:bg-[var(--color-tint-blue)] transition-colors"
              >
                Notaire à {v.nom}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
