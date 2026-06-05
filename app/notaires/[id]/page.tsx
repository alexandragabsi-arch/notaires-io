import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotaireProfileClient from "@/components/NotaireProfileClient";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";

export async function generateStaticParams() {
  return LISTING_NOTAIRES.map((n) => ({ id: n.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const n = LISTING_NOTAIRES.find((x) => x.id === id);
  if (!n) return { title: "Profil notaire · Notaires.io" };

  const location = n.area ? `${n.city} ${n.area}` : n.city;
  const specs = n.specialties.join(", ");

  return {
    title: `${n.name} — Notaire à ${location}`,
    description: `Prenez rendez-vous avec ${n.name}, notaire à ${location}. Spécialités : ${specs}. 1er rendez-vous offert (30 min) en visio ou au cabinet. Tarifs réglementés.`,
    keywords: [
      `notaire ${n.city.toLowerCase()}`,
      `${n.name.toLowerCase()}`,
      ...n.specialties.map((s) => `notaire ${s.toLowerCase()}`),
      "prendre rendez-vous notaire",
      "notaire en ligne",
    ],
    alternates: { canonical: `https://notaires.io/notaires/${n.id}` },
    openGraph: {
      title: `${n.name} — Notaire à ${location} · Notaires.io`,
      description: `Spécialités : ${specs}. en visio ou au cabinet.`,
      url: `https://notaires.io/notaires/${n.id}`,
      type: "profile",
    },
  };
}

function buildJsonLd(id: string) {
  const n = LISTING_NOTAIRES.find((x) => x.id === id);
  if (!n) return null;
  const location = n.area ? `${n.city} ${n.area}` : n.city;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LegalService", "LocalBusiness"],
        "@id": `https://notaires.io/notaires/${n.id}`,
        name: n.name,
        description: n.bio ?? `Notaire à ${location} — spécialités : ${n.specialties.join(", ")}.`,
        url: `https://notaires.io/notaires/${n.id}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: n.city,
          addressRegion: n.area ?? "",
          addressCountry: "FR",
        },
        priceRange: "Tarifs réglementés",
        currenciesAccepted: "EUR",
        openingHours: "Mo-Fr 09:00-18:00",
        knowsAbout: n.specialties,
        availableLanguage: n.languages ?? ["Français"],
        makesOffer: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          description: "Premier rendez-vous de 30 minutes offert",
          availability: "https://schema.org/InStock",
        },
        isPartOf: { "@id": "https://notaires.io/#organization" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://notaires.io" },
          { "@type": "ListItem", position: 2, name: "Annuaire", item: "https://notaires.io/annuaire" },
          { "@type": "ListItem", position: 3, name: n.name, item: `https://notaires.io/notaires/${n.id}` },
        ],
      },
    ],
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jsonLd = buildJsonLd(id);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Header />
      <main className="min-h-screen bg-white">
        <NotaireProfileClient id={id} />
      </main>
      <Footer />
    </>
  );
}
