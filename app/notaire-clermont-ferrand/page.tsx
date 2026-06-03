import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";

export const metadata: Metadata = {
  title: "Notaire à Clermont-Ferrand — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Clermont-Ferrand disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er RDV offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Clermont-Ferrand",
    "notaire Clermont immobilier",
    "notaire Clermont-Ferrand mariage",
    "notaire Clermont société",
    "trouver un notaire Clermont-Ferrand",
    "notaire en ligne Clermont-Ferrand",
    "rendez-vous notaire Clermont-Ferrand",
    "notaire Puy-de-Dôme",
  ],
  alternates: { canonical: "https://notaires.io/notaire-clermont-ferrand" },
  openGraph: {
    title: "Notaire à Clermont-Ferrand — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Clermont-Ferrand disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-clermont-ferrand",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Clermont-Ferrand", item: "https://notaires.io/notaire-clermont-ferrand" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Clermont-Ferrand",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Clermont-Ferrand", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Clermont-Ferrand pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-clermont-ferrand",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de Clermont Auvergne Métropole couvrent vos notaires ?",
    a: "Nos notaires partenaires à Clermont-Ferrand interviennent dans tous les secteurs : Jaude (centre-ville), Montferrand (cité médiévale), La Pardieu, Les Salins, La Gauthière, Chamalières, ainsi que dans les communes de la métropole : Cournon-d'Auvergne, Riom, Issoire, Thiers, Vichy et Royat. La visioconférence est disponible pour les clients du Massif Central ou de l'Allier.",
  },
  {
    q: "Quels actes notariés sont fréquents pour l'immobilier à Clermont-Ferrand ?",
    a: "Clermont-Ferrand offre un marché immobilier attractif avec des prix modérés. Les notaires traitent des ventes d'appartements en pierres de Volvic dans le centre historique, de maisons dans les communes résidentielles de la métropole (Chamalières, Royat, Orcines), et de propriétés avec vue sur la chaîne des Puys. Les investissements locatifs étudiants sont nombreux à proximité de l'Université Clermont-Auvergne et de l'École de Michelin.",
  },
  {
    q: "Y a-t-il des spécificités pour les entreprises auvergnates à Clermont-Ferrand ?",
    a: "Clermont-Ferrand est le siège de Michelin, ce qui en fait un pôle industriel et de recherche majeur. La ville attire des PME dans les secteurs du caoutchouc, des matériaux avancés et de la mobilité. Les notaires clermontois accompagnent fréquemment les transmissions d'entreprises familiales, les cessions de fonds de commerce dans le secteur tertiaire et les constitutions de holding pour les dirigeants d'ETI auvergnates.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Clermont-Ferrand ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Clermont-Ferrand. Que vous soyez dirigeant en déplacement à Paris ou en voyage d'affaires, vous pouvez signer votre acte par visioconférence depuis n'importe quel endroit. Votre notaire partenaire vous confirmera l'éligibilité de l'acte et les modalités pratiques.",
  },
];

export default function Page() {
  const notaires = LISTING_NOTAIRES.filter((n) => n.city === "Clermont-Ferrand");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Clermont-Ferrand"
          intro="Vous cherchez un notaire à Clermont-Ferrand pour votre mariage, votre PACS, un achat immobilier en Auvergne ou la création de votre société ? Nos notaires partenaires clermontois sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-lyon", label: "Notaire à Lyon" },
            { href: "/notaire-saint-etienne", label: "Notaire à Saint-Étienne" },
            { href: "/notaire-dijon", label: "Notaire à Dijon" },
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
