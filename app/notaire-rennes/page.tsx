import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Rennes · Notaires.io",
  description:
    "Trouvez un notaire à Rennes disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Rennes",
    "notaire Rennes immobilier",
    "notaire Rennes mariage",
    "notaire Rennes société",
    "trouver un notaire Rennes",
    "notaire en ligne Rennes",
    "rendez-vous notaire Rennes",
    "notaire Ille-et-Vilaine",
  ],
  alternates: { canonical: "https://notaires.io/notaire-rennes" },
  openGraph: {
    title: "Notaire à Rennes · Notaires.io",
    description:
      "Trouvez un notaire à Rennes disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-rennes",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://notaires.io" },
        { "@type": "ListItem", position: 2, name: "Notaire à Rennes", item: "https://notaires.io/notaire-rennes" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Rennes",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Rennes", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Rennes pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-rennes",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de Rennes Métropole sont couverts par vos notaires ?",
    a: "Nos notaires partenaires à Rennes interviennent dans tous les quartiers : Centre historique, Thabor, Beaulieu, Villejean, Cleunay, Maurepas, ainsi que dans les communes de Rennes Métropole : Cesson-Sévigné, Saint-Grégoire, Bruz, Betton, Chantepie et Pacé. La visioconférence est disponible pour les clients du bassin de Rennes plus éloignés.",
  },
  {
    q: "Quels actes notariés sont les plus demandés pour l'immobilier à Rennes ?",
    a: "À Rennes, ville universitaire en forte croissance, la demande porte principalement sur les actes de vente en primo-accession, les investissements locatifs en loi Pinel ou Malraux (secteur sauvegardé du Vieux-Rennes), et les VEFA dans les nouveaux quartiers comme EuroRennes ou la ZAC de la Courrouze. Les donations immobilières intergénérationnelles sont également fréquentes.",
  },
  {
    q: "Y a-t-il des spécificités bretonnes pour les successions à Rennes ?",
    a: "La Bretagne applique le droit civil commun pour les successions. Toutefois, les propriétés rurales bretonnes (terres, exploitations agricoles autour de Rennes) et les biens sous régime du bail rural nécessitent une expertise particulière. Pour les familles de tradition catholique bretonne, votre notaire à Rennes vous orientera également sur les dons manuels et les donations-partages.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Rennes ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Rennes. Que vous soyez cadre en déplacement fréquent à Paris ou télétravailleur installé en Ille-et-Vilaine, vous pouvez signer votre acte par visioconférence. Certains actes restent soumis à présence physique ; votre notaire partenaire vous en informera au préalable.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Rennes");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Rennes");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Rennes"
          intro="Vous cherchez un notaire à Rennes pour votre mariage, votre PACS, un achat immobilier ou la création de votre société ? Nos notaires partenaires rennais sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-nantes", label: "Notaire à Nantes" },
            { href: "/notaire-brest", label: "Notaire à Brest" },
            { href: "/notaire-le-havre", label: "Notaire au Havre" },
            { href: "/notaire-mariage-pacs", label: "Notaire mariage / PACS" },
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-creation-societe", label: "Notaire création de société" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
