import type { Metadata } from "next";
import Header from "@/components/Header";
import NotaireListing from "@/components/NotaireListing";
import Footer from "@/components/Footer";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";

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

/* ── JSON-LD : ItemList des notaires + CollectionPage ──────────────────────── */
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
      name: "Notaires partenaires Notaires.io",
      numberOfItems: LISTING_NOTAIRES.length,
      itemListElement: LISTING_NOTAIRES.map((n, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://notaires.io/notaires/${n.id}`,
        name: `${n.name} — Notaire à ${n.city}${n.area ? ` ${n.area}` : ""}`,
      })),
    },
  ],
};

export default function AnnuairePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <NotaireListing />
      </main>
      <Footer />
    </>
  );
}
