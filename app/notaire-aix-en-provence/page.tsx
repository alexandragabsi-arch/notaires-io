import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Aix-en-Provence — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Aix-en-Provence disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er RDV offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Aix-en-Provence",
    "notaire Aix immobilier",
    "notaire Aix-en-Provence mariage",
    "notaire Aix société",
    "trouver un notaire Aix-en-Provence",
    "notaire en ligne Aix-en-Provence",
    "rendez-vous notaire Aix",
    "notaire Bouches-du-Rhône",
  ],
  alternates: { canonical: "https://notaires.io/notaire-aix-en-provence" },
  openGraph: {
    title: "Notaire à Aix-en-Provence — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Aix-en-Provence disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-aix-en-provence",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Aix-en-Provence", item: "https://notaires.io/notaire-aix-en-provence" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Aix-en-Provence",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Aix-en-Provence", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Aix-en-Provence pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-aix-en-provence",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes du Pays d'Aix couvrent vos notaires ?",
    a: "Nos notaires partenaires interviennent dans tous les secteurs d'Aix-en-Provence : Vieil-Aix (Cours Mirabeau), Luynes, Les Milles, Jas-de-Bouffan, Pont-de-l'Arc, Encagnane, ainsi que dans les communes du Pays d'Aix : Pertuis, Gardanne, Vitrolles, Meyreuil, Bouc-Bel-Air et Puyricard. La visioconférence est disponible pour les clients du Luberon ou de la Sainte-Victoire.",
  },
  {
    q: "Quels actes sont fréquents pour l'immobilier de prestige à Aix-en-Provence ?",
    a: "Aix-en-Provence est l'une des villes les plus chères du Sud de la France. Les notaires y traitent de nombreuses ventes de bastides provençales, d'hôtels particuliers dans le Vieil-Aix, d'appartements avec vue sur la Sainte-Victoire et de propriétés avec piscine et terrain. Les SCI familiales, les démembrements de propriété et les donations entre époux sont particulièrement répandus pour optimiser la transmission de ce patrimoine de valeur.",
  },
  {
    q: "Y a-t-il des spécificités pour les fondations et associations à Aix-en-Provence ?",
    a: "Aix-en-Provence est une ville universitaire et culturelle majeure (Festival d'Art Lyrique, Université d'Aix-Marseille). La constitution d'une fondation d'entreprise, d'une association reconnue d'utilité publique ou d'une dotation initiale nécessite souvent l'intervention d'un notaire pour authentifier les actes constitutifs. Votre notaire à Aix-en-Provence maîtrise ces structures propres au monde culturel et académique.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Aix-en-Provence ?",
    a: "Oui. La signature électronique à distance (AAED) est pleinement disponible à Aix-en-Provence. Très appréciée des chefs d'entreprise basés dans les zones d'activités des Milles ou de la technopole de Gardanne, vous pouvez signer votre acte par visioconférence sans interrompre votre activité. Votre notaire partenaire vous précisera les modalités selon l'acte envisagé.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Aix-en-Provence");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Aix-en-Provence");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Aix-en-Provence"
          intro="Vous cherchez un notaire à Aix-en-Provence pour votre mariage, votre PACS, un achat immobilier en Provence ou la création de votre société ? Nos notaires partenaires aixois sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-marseille", label: "Notaire à Marseille" },
            { href: "/notaire-toulon", label: "Notaire à Toulon" },
            { href: "/notaire-nice", label: "Notaire à Nice" },
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
