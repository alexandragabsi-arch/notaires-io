import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Lyon — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Lyon disponible rapidement. Mariage, PACS, immobilier, création de société — prise de rendez-vous en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Lyon",
    "notaire Lyon immobilier",
    "notaire Lyon mariage",
    "notaire Lyon société",
    "trouver un notaire Lyon",
    "notaire en ligne Lyon",
    "rendez-vous notaire Lyon",
    "notaire Rhône",
  ],
  alternates: { canonical: "https://notaires.io/notaire-lyon" },
  openGraph: {
    title: "Notaire à Lyon — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Lyon disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-lyon",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Lyon", item: "https://notaires.io/notaire-lyon" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Lyon",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Lyon", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Lyon pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-lyon",
    },
  ],
};

const FAQ = [
  {
    q: "Quels sont les arrondissements lyonnais où exercent vos notaires partenaires ?",
    a: "Nos notaires partenaires à Lyon interviennent sur l'ensemble de la métropole lyonnaise : Lyon 1er au 9ème arrondissement, ainsi que Villeurbanne, Caluire-et-Cuire et les communes périphériques. Certains proposent également des rendez-vous en visioconférence, pratique si vous êtes à Bron, Vénissieux ou en Ain.",
  },
  {
    q: "Comment choisir son régime matrimonial chez un notaire à Lyon ?",
    a: "Le choix du régime matrimonial (communauté réduite aux acquêts, séparation de biens, participation aux acquêts) est une décision importante que votre notaire à Lyon vous guidera à prendre selon votre situation professionnelle et patrimoniale. La consultation prénuptiale est fortement conseillée. Sans contrat de mariage, vous serez automatiquement soumis au régime légal de la communauté réduite aux acquêts.",
  },
  {
    q: "Mon entreprise est basée à Lyon : le notaire est-il obligatoire pour la création de société ?",
    a: "Le notaire n'est pas obligatoire pour créer une SARL ou une SAS, mais il l'est pour certaines opérations spécifiques : apport d'un bien immobilier au capital social, constitution d'une SCI, ou rédaction de statuts avec des clauses complexes. Faire rédiger vos statuts par un notaire vous offre une sécurité juridique maximale et un acte authentique opposable aux tiers.",
  },
  {
    q: "Peut-on réaliser des actes notariés à distance depuis Lyon ?",
    a: "Oui. Depuis 2020, la France autorise la signature électronique à distance d'actes notariés par visioconférence (acte authentique électronique à distance, AAED). Concrètement, vous pouvez signer votre acte depuis votre domicile ou votre bureau à Lyon, face à votre notaire en ligne. Certains actes restent toutefois soumis à la présence physique des parties.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Lyon");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Lyon");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Lyon"
          intro="Vous cherchez un notaire à Lyon pour votre mariage, votre PACS, un achat immobilier ou la création de votre société ? Nos notaires partenaires lyonnais sont disponibles sous 48 h, en visio ou au cabinet dans votre arrondissement. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-paris", label: "Notaire à Paris" },
            { href: "/notaire-bordeaux", label: "Notaire à Bordeaux" },
            { href: "/notaire-marseille", label: "Notaire à Marseille" },
            { href: "/notaire-nantes", label: "Notaire à Nantes" },
            { href: "/notaire-mariage-pacs", label: "Notaire mariage / PACS" },
            { href: "/notaire-creation-societe", label: "Notaire création de société" },
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
