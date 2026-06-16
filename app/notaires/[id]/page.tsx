import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotaireProfileClient from "@/components/NotaireProfileClient";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getAllNotaires } from "@/lib/notaires-source";
import type { ListingNotaire } from "@/lib/notaires-listing";

// Génère statiquement les 35 notaires vedettes ; les autres sont SSR à la demande
export async function generateStaticParams() {
  return LISTING_NOTAIRES.map((n) => ({ id: n.id }));
}

// Permet les pages dynamiques pour les 9 000+ membres non pré-générés
export const dynamicParams = true;

/** Cherche un notaire dans LISTING_NOTAIRES puis dans getAllNotaires() */
function findNotaire(id: string): ListingNotaire | undefined {
  return (
    LISTING_NOTAIRES.find((n) => n.id === id) ??
    getAllNotaires().find((n) => n.id === id)
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const n = findNotaire(id);
  if (!n) return { title: "Profil notaire · Notaires.io" };

  const location = n.area ? `${n.city} ${n.area}` : n.city;
  const specs = n.specialties.join(", ");

  return {
    title: `${n.name} — ${n.isOffice ? "Étude notariale" : "Notaire"} à ${location}`,
    description: `Prenez rendez-vous avec ${n.name}, notaire à ${location}. Spécialités : ${specs}. Tarifs réglementés.`,
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
  const n = findNotaire(id);
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
          description: "Premier rendez-vous de 30 minutes",
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
  const notaire = findNotaire(id);  // lookup serveur (membres.json inclus)
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
        {/* On passe le notaire en prop pour éviter le lookup côté client (membres.json = server only) */}
        <NotaireProfileClient id={id} initialNotaire={notaire} />
      </main>
      <Footer />
    </>
  );
}
