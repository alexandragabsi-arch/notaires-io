import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Toulouse — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Toulouse disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Toulouse",
    "notaire Toulouse immobilier",
    "notaire Toulouse mariage",
    "notaire Toulouse société",
    "trouver un notaire Toulouse",
    "notaire en ligne Toulouse",
    "rendez-vous notaire Toulouse",
    "notaire Haute-Garonne",
  ],
  alternates: { canonical: "https://notaires.io/notaire-toulouse" },
  openGraph: {
    title: "Notaire à Toulouse — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Toulouse disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-toulouse",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Toulouse", item: "https://notaires.io/notaire-toulouse" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Toulouse",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Toulouse", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Toulouse pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-toulouse",
    },
  ],
};

const FAQ = [
  {
    q: "Dans quels quartiers et communes de la métropole toulousaine vos notaires interviennent-ils ?",
    a: "Nos notaires partenaires couvrent l'ensemble de Toulouse et sa métropole : les quartiers du Capitole, Compans-Caffarelli, Saint-Cyprien, les Minimes, Rangueil, ainsi que les communes de Blagnac, Colomiers, Tournefeuille, Balma et L'Union. Des rendez-vous en visioconférence sont également disponibles pour les clients de Muret ou du Lauragais.",
  },
  {
    q: "Quels actes notariés sont les plus demandés pour l'immobilier à Toulouse ?",
    a: "À Toulouse, le marché immobilier dynamique génère une forte demande pour les compromis et actes de vente dans des quartiers comme Jolimont, Saint-Agne ou la Côte Pavée. Les notaires traitent aussi de nombreuses primo-accessions via le PTZ, des achats en VEFA dans les nouvelles résidences et des donations entre époux pour sécuriser le patrimoine familial.",
  },
  {
    q: "Y a-t-il des spécificités locales pour les successions en Haute-Garonne ?",
    a: "La Haute-Garonne applique le droit civil commun, mais la forte proportion de biens ruraux et agricoles autour de Toulouse (domaines viticoles, terres du Lauragais) implique souvent des évaluations spécifiques. Votre notaire à Toulouse saura mobiliser des experts agréés pour l'estimation foncière et agricole, indispensable pour un partage successoral équitable.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Toulouse ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible depuis 2020. Depuis votre domicile à Toulouse ou en déplacement professionnel, vous pouvez signer votre acte par visioconférence sécurisée. Certains actes (donation entre vifs de biens immobiliers, par exemple) peuvent nécessiter une présence physique que votre notaire vous confirmera.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Toulouse");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Toulouse");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Toulouse"
          intro="Vous cherchez un notaire à Toulouse pour votre mariage, votre PACS, un achat immobilier ou la création de votre société ? Nos notaires partenaires toulousains sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-bordeaux", label: "Notaire à Bordeaux" },
            { href: "/notaire-montpellier", label: "Notaire à Montpellier" },
            { href: "/notaire-marseille", label: "Notaire à Marseille" },
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
