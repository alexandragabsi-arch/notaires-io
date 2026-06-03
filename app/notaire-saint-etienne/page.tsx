import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Saint-Étienne — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Saint-Étienne disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Saint-Étienne",
    "notaire Saint-Etienne immobilier",
    "notaire Saint-Étienne mariage",
    "notaire Saint-Etienne société",
    "trouver un notaire Saint-Étienne",
    "notaire en ligne Saint-Étienne",
    "rendez-vous notaire Saint-Étienne",
    "notaire Loire",
  ],
  alternates: { canonical: "https://notaires.io/notaire-saint-etienne" },
  openGraph: {
    title: "Notaire à Saint-Étienne — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Saint-Étienne disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-saint-etienne",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Saint-Étienne", item: "https://notaires.io/notaire-saint-etienne" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Saint-Étienne",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Saint-Étienne", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Saint-Étienne pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-saint-etienne",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de Saint-Étienne Métropole couvrent vos notaires ?",
    a: "Nos notaires partenaires interviennent dans tous les secteurs stéphanois : Centre-ville, Beaubrun, Tarentaize, Bergson, Montchovet, Valbenoîte, ainsi que dans les communes de la métropole : Saint-Chamond, Firminy, Andrézieux-Bouthéon, Roche-la-Molière et Rive-de-Gier. La visioconférence est disponible pour les clients du Pilat ou du Forez.",
  },
  {
    q: "Quels actes notariés sont les plus courants pour l'immobilier à Saint-Étienne ?",
    a: "Saint-Étienne offre parmi les prix immobiliers les plus bas des grandes villes françaises, ce qui en fait une destination prisée pour les investisseurs locatifs. Les notaires traitent de nombreuses ventes de maisons ouvrières rénovées dans les quartiers anciens (Jacquard, Grangeneuve), des acquisitions de lots en copropriété et des cessions de locaux commerciaux dans le centre en mutation. Les SCI d'investissement locatif sont également fréquentes.",
  },
  {
    q: "Y a-t-il des spécificités pour les cessions de fonds de commerce à Saint-Étienne ?",
    a: "Saint-Étienne, ville de tradition industrielle et commerçante, connaît un renouveau entrepreneurial (design, numérique, santé). La cession d'un fonds de commerce ou d'une boutique dans le centre-ville nécessite un acte notarié sécurisant la purge des créanciers inscrits, la vérification du bail commercial et le respect des formalités fiscales (droit d'enregistrement, TVA). Votre notaire à Saint-Étienne vous accompagne dans ces opérations.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Saint-Étienne ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Saint-Étienne. Que vous soyez en déplacement professionnel à Lyon ou simplement souhaitez éviter le déplacement, vous pouvez signer votre acte par visioconférence sécurisée. Votre notaire partenaire vous informera des actes éligibles à ce dispositif.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Saint-Étienne");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Saint-Étienne");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Saint-Étienne"
          intro="Vous cherchez un notaire à Saint-Étienne pour votre mariage, votre PACS, un achat immobilier ou la création de votre société ? Nos notaires partenaires stéphanois sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-lyon", label: "Notaire à Lyon" },
            { href: "/notaire-grenoble", label: "Notaire à Grenoble" },
            { href: "/notaire-clermont-ferrand", label: "Notaire à Clermont-Ferrand" },
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
