import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Bordeaux · Notaires.io",
  description:
    "Trouvez un notaire à Bordeaux pour votre succession, achat immobilier, mariage ou divorce. Prise de rendez-vous en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Bordeaux",
    "notaire Bordeaux succession",
    "notaire Bordeaux immobilier",
    "notaire Bordeaux famille",
    "trouver un notaire Bordeaux",
    "notaire en ligne Bordeaux",
    "rendez-vous notaire Bordeaux",
    "notaire Gironde",
  ],
  alternates: { canonical: "https://notaires.io/notaire-bordeaux" },
  openGraph: {
    title: "Notaire à Bordeaux · Notaires.io",
    description:
      "Trouvez un notaire à Bordeaux disponible rapidement. Succession, famille, immobilier.",
    url: "https://notaires.io/notaire-bordeaux",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Bordeaux", item: "https://notaires.io/notaire-bordeaux" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Bordeaux",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Bordeaux", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Bordeaux pour succession, famille, immobilier et divorce.",
      url: "https://notaires.io/notaire-bordeaux",
    },
  ],
};

const FAQ = [
  {
    q: "Comment régler une succession complexe à Bordeaux ?",
    a: "Une succession est dite complexe lorsqu'elle implique plusieurs héritiers, des biens immobiliers (notamment dans le vignoble bordelais), une entreprise familiale ou des héritiers vivant à l'étranger. Votre notaire à Bordeaux centralise l'ensemble des démarches : déclaration de succession auprès des impôts, liquidation et partage du patrimoine, évaluation des biens. Comptez entre 6 et 18 mois pour clôturer une succession importante.",
  },
  {
    q: "Quels sont les droits de succession à payer en Gironde ?",
    a: "Les droits de succession sont les mêmes partout en France — il n'existe pas de taux locaux. Entre parents et enfants, un abattement de 100 000 € s'applique, puis des taux progressifs de 5 % à 45 % selon les tranches. Entre époux et partenaires de PACS, la succession est totalement exonérée de droits. Un notaire à Bordeaux vous aidera à optimiser la transmission de votre patrimoine dans le cadre légal.",
  },
  {
    q: "Le marché immobilier bordelais est-il impacté par les délais notariaux ?",
    a: "Bordeaux connaît un marché immobilier tendu qui a parfois allongé les délais de traitement dans les études notariales locales. Avec Notaires.io, vous accédez à des notaires partenaires qui ont organisé leur étude pour réduire ces délais. La signature du compromis peut intervenir dès que vous avez trouvé votre bien, et l'acte authentique suit généralement 2 à 3 mois après.",
  },
  {
    q: "Peut-on faire un testament chez un notaire à Bordeaux ?",
    a: "Oui, et c'est même vivement conseillé. Le testament authentique (rédigé par le notaire en votre présence) est la forme la plus sécurisée : il est inscrit au fichier central des dispositions de dernières volontés (FCDDV), ce qui garantit qu'il sera retrouvé à votre décès. Votre notaire à Bordeaux peut également vous conseiller sur la rédaction d'un testament olographe (écrit, daté et signé de votre main) que vous lui confierez en dépôt.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Bordeaux");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Bordeaux");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Bordeaux"
          intro="Succession, achat immobilier dans le bordelais, mariage ou divorce : nos notaires partenaires à Bordeaux vous accompagnent à chaque étape de votre vie. Disponibles rapidement, en visio ou au cabinet. Le 1er rendez-vous est offert — sans engagement."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-paris", label: "Notaire à Paris" },
            { href: "/notaire-lyon", label: "Notaire à Lyon" },
            { href: "/notaire-marseille", label: "Notaire à Marseille" },
            { href: "/notaire-nantes", label: "Notaire à Nantes" },
            { href: "/notaire-succession", label: "Notaire succession" },
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-donation", label: "Notaire donation" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
