import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Angers — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Angers disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Angers",
    "notaire Angers immobilier",
    "notaire Angers mariage",
    "notaire Angers société",
    "trouver un notaire Angers",
    "notaire en ligne Angers",
    "rendez-vous notaire Angers",
    "notaire Maine-et-Loire",
  ],
  alternates: { canonical: "https://notaires.io/notaire-angers" },
  openGraph: {
    title: "Notaire à Angers — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Angers disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-angers",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Angers", item: "https://notaires.io/notaire-angers" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Angers",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Angers", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Angers pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-angers",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes d'Angers Loire Métropole couvrent vos notaires ?",
    a: "Nos notaires partenaires à Angers interviennent dans tous les quartiers : Centre-ville, La Doutre, Belle-Beille, Verneau, Justices, Monplaisir, Saint-Serge, ainsi que dans les communes de la métropole : Saint-Barthélemy-d'Anjou, Les Ponts-de-Cé, Trélazé, Avrillé et Mûrs-Erigné. La visioconférence est disponible pour les clients du Saumurois ou du Segréen.",
  },
  {
    q: "Quels actes notariés sont les plus fréquents pour l'immobilier à Angers ?",
    a: "Angers, régulièrement classée parmi les villes où il fait bon vivre, attire de nombreux acquéreurs. Les notaires traitent des ventes de maisons de ville en ardoise (centre historique), d'appartements en bord de Maine, et de pavillons dans la première couronne. Le marché du viager est actif dans une ville à forte population senior, tout comme les donations-partages pour les familles angevines installées depuis plusieurs générations.",
  },
  {
    q: "Y a-t-il des spécificités pour les domaines viticoles et horticoles en Maine-et-Loire ?",
    a: "Le Maine-et-Loire est le premier département horticole de France et un grand vignoble (Anjou, Saumur, Muscadet). La transmission ou la cession d'une exploitation horticole, d'une pépinière ou d'un domaine viticole implique des actes notariés spécifiques : droit de préemption SAFER, baux ruraux, évaluation du fonds agricole. Votre notaire à Angers maîtrise ces opérations propres au terroir anjouine.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Angers ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Angers. Que vous soyez en déplacement à Paris ou à Nantes pour le travail, vous pouvez signer votre acte par visioconférence depuis n'importe quel endroit. Votre notaire partenaire vous précisera quels actes sont éligibles à ce dispositif.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Angers");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Angers");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Angers"
          intro="Vous cherchez un notaire à Angers pour votre mariage, votre PACS, un achat immobilier en Anjou ou la création de votre société ? Nos notaires partenaires angevins sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-nantes", label: "Notaire à Nantes" },
            { href: "/notaire-rennes", label: "Notaire à Rennes" },
            { href: "/notaire-orleans", label: "Notaire à Orléans" },
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
