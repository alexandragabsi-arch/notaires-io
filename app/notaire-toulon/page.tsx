import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Toulon — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Toulon disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Toulon",
    "notaire Toulon immobilier",
    "notaire Toulon mariage",
    "notaire Toulon société",
    "trouver un notaire Toulon",
    "notaire en ligne Toulon",
    "rendez-vous notaire Toulon",
    "notaire Var",
  ],
  alternates: { canonical: "https://notaires.io/notaire-toulon" },
  openGraph: {
    title: "Notaire à Toulon — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Toulon disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-toulon",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Toulon", item: "https://notaires.io/notaire-toulon" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Toulon",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Toulon", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Toulon pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-toulon",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de Toulon Provence Méditerranée couvrent vos notaires ?",
    a: "Nos notaires partenaires à Toulon couvrent tous les secteurs : Centre-ville, Le Mourillon, Cap Brun, Pont-du-Las, La Seyne-sur-Mer, ainsi que les communes de la métropole TPM : La Garde, La Valette-du-Var, Six-Fours-les-Plages, Hyères et Ollioules. La visioconférence permet également de servir les clients des îles (Porquerolles, île du Levant) ou du Haut-Var.",
  },
  {
    q: "Quels actes notariés sont les plus demandés pour l'immobilier à Toulon ?",
    a: "Toulon et sa rade offrent un marché immobilier attractif avec des prix inférieurs à Nice ou Cannes. Les notaires traitent de nombreuses ventes de maisons avec vue mer au Cap Brun ou au Mourillon, des achats de biens en copropriété balnéaire à Hyères ou Six-Fours, ainsi que des viagers qui restent courants dans le Var. Les donations entre époux et les mandats de protection future y sont également fréquents.",
  },
  {
    q: "Y a-t-il des spécificités pour les successions militaires à Toulon ?",
    a: "Toulon abrite la principale base navale française. Pour les militaires, les successions présentent des spécificités : pensions de réversion, capital décès versé par l'État, régimes de retraite spécifiques (CNRACL, IRCANTEC). Votre notaire à Toulon est habitué à collaborer avec la direction des ressources humaines de la Marine pour garantir des inventaires successoraux complets.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Toulon ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible depuis Toulon. Que vous soyez en déplacement militaire, en mission à l'étranger ou simplement à bord, vous pouvez signer votre acte notarié par visioconférence sécurisée. Votre notaire partenaire vous confirmera l'éligibilité de l'acte envisagé à ce dispositif.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Toulon");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Toulon");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Toulon"
          intro="Vous cherchez un notaire à Toulon pour votre mariage, votre PACS, un achat immobilier dans le Var ou la création de votre société ? Nos notaires partenaires toulonnais sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-marseille", label: "Notaire à Marseille" },
            { href: "/notaire-nice", label: "Notaire à Nice" },
            { href: "/notaire-aix-en-provence", label: "Notaire à Aix-en-Provence" },
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
