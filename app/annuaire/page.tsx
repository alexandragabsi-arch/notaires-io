import type { Metadata } from "next";
import Header from "@/components/Header";
import NotaireListing from "@/components/NotaireListing";
import Footer from "@/components/Footer";
import { getAllNotaires } from "@/lib/notaires-source";
import { getVillesCouvertes } from "@/lib/villes-data";

export const metadata: Metadata = {
  title: "Annuaire des notaires — Trouver un notaire par ville et spécialité",
  description:
    "Consultez l'annuaire de nos notaires partenaires. Filtrez par ville (Paris, Lyon, Bordeaux…) et par spécialité : immobilier, succession, mariage, PACS, divorce, création de société. Prenez rendez-vous en ligne en quelques clics.",
  keywords: [
    "annuaire notaires",
    "trouver un notaire",
    "notaire Paris",
    "notaire Lyon",
    "notaire immobilier",
    "notaire succession",
    "notaire en ligne",
  ],
  alternates: { canonical: "https://notaires.io/annuaire" },
  openGraph: {
    title: "Annuaire des notaires — Notaires.io",
    description:
      "Trouvez un notaire près de chez vous par ville et spécialité. Prenez rendez-vous en ligne.",
    url: "https://notaires.io/annuaire",
    type: "website",
  },
};

/* Villes ayant leur page rédigée à la main, mises en avant. */
const GRANDES_VILLES: [string, string][] = [
  ["Paris", "/notaire-paris"], ["Lyon", "/notaire-lyon"], ["Marseille", "/notaire-marseille"],
  ["Toulouse", "/notaire-toulouse"], ["Nice", "/notaire-nice"], ["Nantes", "/notaire-nantes"],
  ["Montpellier", "/notaire-montpellier"], ["Strasbourg", "/notaire-strasbourg"],
  ["Bordeaux", "/notaire-bordeaux"], ["Lille", "/notaire-lille"], ["Rennes", "/notaire-rennes"],
  ["Reims", "/notaire-reims"], ["Toulon", "/notaire-toulon"], ["Saint-Étienne", "/notaire-saint-etienne"],
  ["Le Havre", "/notaire-le-havre"], ["Grenoble", "/notaire-grenoble"], ["Dijon", "/notaire-dijon"],
  ["Angers", "/notaire-angers"], ["Nancy", "/notaire-nancy"], ["Metz", "/notaire-metz"],
  ["Clermont-Ferrand", "/notaire-clermont-ferrand"], ["Aix-en-Provence", "/notaire-aix-en-provence"],
  ["Brest", "/notaire-brest"], ["Rouen", "/notaire-rouen"], ["Orléans", "/notaire-orleans"],
  ["Perpignan", "/notaire-perpignan"], ["Par département", "/notaire-departement"],
];

export default function AnnuairePage() {
  const allNotaires = getAllNotaires();
  const villes = getVillesCouvertes();

  /* ── JSON-LD : CollectionPage + ItemList (30 premiers pour rester léger) ── */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://notaires.io/annuaire#webpage",
        url: "https://notaires.io/annuaire",
        name: "Annuaire des notaires — Notaires.io",
        description: "Annuaire de notaires partenaires avec prise de rendez-vous en ligne.",
        isPartOf: { "@id": "https://notaires.io/#website" },
        inLanguage: "fr-FR",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://notaires.io" },
            { "@type": "ListItem", position: 2, name: "Annuaire", item: "https://notaires.io/annuaire" },
          ],
        },
      },
      {
        "@type": "ItemList",
        name: "Notaires Notaires.io",
        numberOfItems: allNotaires.length,
        itemListElement: allNotaires.slice(0, 30).map((n, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://notaires.io/notaires/${n.id}`,
          name: `${n.name} — Notaire à ${n.city}`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <NotaireListing baseListings={allNotaires} />

        {/* Sommaire des villes.
            Sans cette page qui les recense, les pages de ville n'étaient
            atteignables depuis nulle part : Google les découvrait par le
            sitemap et les laissait « détectées, actuellement non indexées ».
            L'annuaire devient le point de passage qui leur donne du poids. */}
        <section className="max-w-[1100px] mx-auto px-6 pb-16">
          <h2 className="serif text-[26px] font-bold text-[var(--color-primary)] mb-2">
            Trouver un notaire par ville
          </h2>
          <p className="text-[15px] text-[var(--color-muted)] mb-6">
            {villes.length + 26} villes couvertes, {allNotaires.length} notaires référencés.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8">
            {GRANDES_VILLES.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-[15px] font-semibold text-[var(--color-accent)] hover:underline"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {villes.map((v) => (
              <a
                key={v.slug}
                href={`/notaire-ville/${v.slug}`}
                className="text-[13px] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                {v.nom} <span className="opacity-60">({v.nombre})</span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
