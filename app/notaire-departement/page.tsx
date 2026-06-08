import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DEPARTEMENTS } from "@/lib/departements-data";

export const metadata: Metadata = {
  title: "Notaire par département — tous les départements de France · Notaires.io",
  description: "Trouvez un notaire dans votre département. Notaires.io couvre les 95 départements métropolitains. 1er rendez-vous offert, en visio ou au cabinet.",
  alternates: { canonical: "https://notaires.io/notaire-departement" },
};

// Trier par population décroissante pour afficher les plus peuplés en premier
const sorted = [...DEPARTEMENTS].sort((a, b) => b.population - a.population);

export default function Page() {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Trouver un notaire par département
        </h1>
        <p className="text-gray-600 mb-10 text-lg">
          Sélectionnez votre département pour trouver un notaire disponible rapidement.
          Le 1<sup>er</sup> rendez-vous est offert — en visio ou au cabinet.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {sorted.map((dep) => (
            <Link
              key={dep.slug}
              href={`/notaire-departement/${dep.slug}`}
              className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
            >
              <span className="w-10 text-center text-xs font-bold text-gray-400 group-hover:text-blue-600 shrink-0">
                {dep.code}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate group-hover:text-blue-700">
                  {dep.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{dep.chefLieu}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-blue-50 border border-blue-100 p-6 text-center">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            1<sup>er</sup> rendez-vous notaire offert
          </h2>
          <p className="text-blue-700 mb-4">
            Quel que soit votre département, nos notaires partenaires vous reçoivent en visio ou au cabinet.
          </p>
          <Link
            href="/annuaire"
            className="inline-block bg-blue-600 text-white rounded-xl px-6 py-3 font-semibold hover:bg-blue-700 transition-colors"
          >
            Trouver mon notaire
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
