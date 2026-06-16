import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesBySpecialty, getNotairesMixed } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire divorce · Notaires.io",
  description:
    "Trouvez un notaire pour votre divorce par consentement mutuel, la liquidation de votre régime matrimonial ou la vente de votre bien commun. Accompagnement bienveillant.",
  keywords: [
    "notaire divorce",
    "divorce consentement mutuel notaire",
    "liquidation régime matrimonial",
    "partage biens divorce",
    "notaire séparation",
    "bien immobilier divorce",
    "rachat soulte",
    "notaire famille divorce",
  ],
  alternates: { canonical: "https://notaires.io/notaire-divorce" },
  openGraph: {
    title: "Notaire divorce · Notaires.io",
    description:
      "Divorce par consentement mutuel, liquidation du régime matrimonial : nos notaires vous accompagnent.",
    url: "https://notaires.io/notaire-divorce",
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
        { "@type": "ListItem", position: 2, name: "Notaire divorce", item: "https://notaires.io/notaire-divorce" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire divorce",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      description:
        "Notaires spécialisés en droit de la famille : divorce par consentement mutuel, liquidation du régime matrimonial, rachat de soulte, partage du bien immobilier commun.",
      url: "https://notaires.io/notaire-divorce",
    },
  ],
};

const FAQ = [
  {
    q: "Depuis 2017, le notaire remplace-t-il l'avocat pour le divorce par consentement mutuel ?",
    a: "Depuis le 1er janvier 2017, le divorce par consentement mutuel sans enfant mineur peut être prononcé sans juge. La procédure est alors entièrement extrajudiciaire : les deux époux, chacun assisté d'un avocat, signent une convention de divorce qui est déposée chez un notaire (dépôt pour enregistrement). Le notaire ne rédige pas la convention — c'est le rôle des avocats — mais son dépôt lui confère la force exécutoire. Si le couple a des enfants mineurs, un juge aux affaires familiales doit valider le divorce.",
  },
  {
    q: "Comment se passe la liquidation du régime matrimonial lors d'un divorce ?",
    a: "La liquidation du régime matrimonial consiste à identifier les biens communs (ou indivis), à les évaluer et à les partager entre les époux. Si le couple possède un bien immobilier, la liquidation doit impérativement être constatée par acte notarié. Le notaire dresse l'état liquidatif qui liste les actifs et passifs communs, détermine les droits de chacun, et organise le partage. La taxe de partage est due (2,5 % de l'actif net partagé pour les biens immobiliers).",
  },
  {
    q: "Qu'est-ce qu'un rachat de soulte et comment se passe-t-il ?",
    a: "Lorsqu'un époux souhaite conserver seul la résidence familiale, il doit « racheter la part » de l'autre — c'est ce qu'on appelle le rachat de soulte. Le bien est évalué (par accord amiable ou par un expert), puis la soulte correspond à la moitié de la valeur nette (après déduction du capital restant dû du prêt immobilier). L'acte de rachat de soulte est obligatoirement notarié et entraîne le paiement de la taxe de partage. L'époux qui conserve le bien doit généralement refinancer seul le prêt.",
  },
  {
    q: "Faut-il vendre le bien immobilier commun en cas de divorce ?",
    a: "Non, la vente n'est pas obligatoire. Trois options existent : l'un des époux rachète la part de l'autre (rachat de soulte), les deux époux vendent le bien à un tiers et se partagent le produit, ou — plus rarement — ils maintiennent l'indivision temporairement (déconseillé car source de conflits). La décision dépend de la capacité financière de chacun, des conditions du marché immobilier local, et de l'intérêt des enfants. Votre notaire vous aidera à analyser chaque option.",
  },
];

export default function Page() {
  const scraped = getNotairesBySpecialty("Divorce", ["Droit de la famille"], 60);
  // Si peu de résultats spécialisés, affiche un panel multi-villes
  const notaires = scraped.length >= 6
    ? scraped
    : getNotairesMixed(60);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Notaire pour votre divorce"
          intro="Divorce par consentement mutuel, liquidation de votre régime matrimonial, rachat de soulte ou vente du bien commun : nos notaires spécialisés en droit de la famille vous accompagnent avec bienveillance dans cette étape difficile, sans engagement."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-mariage-pacs", label: "Notaire mariage / PACS" },
            { href: "/notaire-succession", label: "Notaire succession" },
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-paris", label: "Notaire famille à Paris" },
            { href: "/notaire-lyon", label: "Notaire famille à Lyon" },
            { href: "/notaire-bordeaux", label: "Notaire famille à Bordeaux" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
