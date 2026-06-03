import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Perpignan — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Perpignan disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Perpignan",
    "notaire Perpignan immobilier",
    "notaire Perpignan mariage",
    "notaire Perpignan société",
    "trouver un notaire Perpignan",
    "notaire en ligne Perpignan",
    "rendez-vous notaire Perpignan",
    "notaire Pyrénées-Orientales",
  ],
  alternates: { canonical: "https://notaires.io/notaire-perpignan" },
  openGraph: {
    title: "Notaire à Perpignan — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Perpignan disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-perpignan",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Perpignan", item: "https://notaires.io/notaire-perpignan" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Perpignan",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Perpignan", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Perpignan pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-perpignan",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de la Perpignan Méditerranée Métropole couvrent vos notaires ?",
    a: "Nos notaires partenaires à Perpignan couvrent tous les secteurs : Centre historique (Castillet, Loge de Mer), Saint-Jacques, Moulin-à-Vent, Mas Balande, Saint-Mathieu, ainsi que les communes de la métropole : Canet-en-Roussillon, Saint-Estève, Cabestany, Rivesaltes, Pia et Le Barcarès. La visioconférence est disponible pour les clients de la Cerdagne ou de l'Albères.",
  },
  {
    q: "Quels actes notariés sont fréquents pour l'immobilier côtier en Roussillon ?",
    a: "Les Pyrénées-Orientales offrent un littoral attractif (Canet-en-Roussillon, Saint-Cyprien, Argelès-sur-Mer) à des prix encore accessibles comparés à la Côte d'Azur. Les notaires traitent de nombreuses ventes de résidences secondaires, d'appartements en front de mer, de maisons catalanes dans l'arrière-pays, et de terrains constructibles dans les communes rurales. Le viager est également courant dans cette région à forte population retraitée.",
  },
  {
    q: "Y a-t-il des spécificités pour les propriétés transfrontalières franco-espagnoles à Perpignan ?",
    a: "La proximité de l'Espagne (frontière à 30 km) génère des situations patrimoniales transfrontalières : résidents espagnols acquérant un bien en France, Français possédant un bien en Catalogne espagnole. Le règlement européen Successions et la convention franco-espagnole encadrent ces situations. Votre notaire à Perpignan, familier de la culture catalane et des enjeux transfrontaliers, vous accompagnera efficacement.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Perpignan ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Perpignan. Très pratique pour les Français résidant en Espagne qui souhaitent acquérir un bien en Roussillon, ou pour les acheteurs d'une résidence secondaire depuis Paris ou Lyon, vous pouvez signer votre acte par visioconférence. Votre notaire partenaire vous précisera les actes compatibles.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Perpignan", 15);
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Perpignan");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Perpignan"
          intro="Vous cherchez un notaire à Perpignan pour votre mariage, votre PACS, un achat immobilier en Roussillon ou la création de votre société ? Nos notaires partenaires perpignanais sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-montpellier", label: "Notaire à Montpellier" },
            { href: "/notaire-toulouse", label: "Notaire à Toulouse" },
            { href: "/notaire-marseille", label: "Notaire à Marseille" },
            { href: "/notaire-mariage-pacs", label: "Notaire mariage / PACS" },
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-succession", label: "Notaire succession" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
