import type { Metadata } from "next";
import Header from "@/components/Header";
import NotairePitch from "@/components/NotairePitch";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Référencer mon étude notariale — Espace notaires",
  description:
    "Rejoignez Notaires.io : recevez des rendez-vous déjà préparés sur la bonne spécialité, gérez vos créneaux en visio ou au cabinet, envoyez vos propositions d'honoraires en ligne. Plateforme créée par un notaire en exercice. 129 € HT/mois.",
  keywords: [
    "logiciel notaire",
    "gestion rendez-vous notaire",
    "plateforme notaire",
    "notaire en ligne espace professionnel",
    "référencer étude notariale",
    "prise de rdv notaire en ligne",
  ],
  alternates: { canonical: "https://notaires.io/notaires" },
  openGraph: {
    title: "Rejoignez Notaires.io — La plateforme de rendez-vous pour notaires",
    description:
      "Recevez des clients déjà qualifiés sur votre spécialité. RDV en visio ou au cabinet. 1er mois offert.",
    url: "https://notaires.io/notaires",
    type: "website",
  },
};

/* ── JSON-LD : SoftwareApplication + Offer ─────────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      url: "https://notaires.io/notaires",
      name: "Espace notaires — Notaires.io",
      description: "Plateforme de prise de RDV pour notaires. Clients qualifiés, visio intégrée, proposition d'honoraires.",
      isPartOf: { "@id": "https://notaires.io/#website" },
      inLanguage: "fr-FR",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://notaires.io" },
          { "@type": "ListItem", position: 2, name: "Espace notaires", item: "https://notaires.io/notaires" },
        ],
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Notaires.io",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "129",
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "129",
          priceCurrency: "EUR",
          billingDuration: "P1M",
          unitText: "mois",
        },
        description: "Abonnement mensuel — accès à la plateforme de prise de RDV notariale",
      },
      provider: { "@id": "https://notaires.io/#organization" },
    },
  ],
};

export default function NotairesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <NotairePitch />
      </main>
      <Footer />
    </>
  );
}
