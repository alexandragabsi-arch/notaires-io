import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";

export const metadata: Metadata = {
  title: "Notaire à Orléans — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Orléans disponible rapidement. Mariage, PACS, immobilier, succession — prise de rendez-vous en ligne, 1er rendez-vous offert.",
  keywords: [
    "notaire Orléans","notaire Orléans immobilier","notaire Orléans mariage",
    "notaire Orléans succession","trouver un notaire Orléans","notaire en ligne Orléans",
    "rendez-vous notaire Orléans","notaire Loiret",
  ],
  alternates: { canonical: "https://notaires.io/notaire-orleans" },
  openGraph: {
    title: "Notaire à Orléans — 1er RDV offert · Notaires.io",
    description: "Trouvez un notaire à Orléans rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-orleans",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Orléans", item: "https://notaires.io/notaire-orleans" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Orléans",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Orléans", addressCountry: "FR" },
      description: "Mise en relation avec des notaires partenaires à Orléans.",
      url: "https://notaires.io/notaire-orleans",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers d'Orléans couvrent vos notaires partenaires ?",
    a: "Nos notaires partenaires interviennent sur l'ensemble de la métropole orléanaise : centre-ville, La Source, Saint-Marceau, Argonne, ainsi que Fleury-les-Aubrais, Saran et Olivet. Des rendez-vous en visioconférence sont disponibles pour tout le Loiret.",
  },
  {
    q: "Combien coûtent les frais de notaire pour un achat à Orléans ?",
    a: "Pour un achat dans l'ancien à Orléans, les frais de notaire représentent environ 7 à 8 % du prix. Sur un bien à 200 000 €, comptez environ 14 000 à 16 000 € (émoluments + droits de mutation + débours).",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Orléans ?",
    a: "Oui. La signature électronique à distance (AAED) est autorisée depuis 2020. Vous pouvez signer votre acte en visioconférence depuis Orléans ou n'importe où dans le Loiret, sans déplacement.",
  },
  {
    q: "Quel notaire choisir pour une succession à Orléans ?",
    a: "Choisissez un notaire spécialisé en droit des successions, idéalement proche du domicile du défunt. Notaires.io vous oriente selon la complexité de votre dossier : bien immobilier, nombre d'héritiers, testament.",
  },
];

export default function Page() {
  const notaires = LISTING_NOTAIRES.filter((n) => n.city === "Orléans");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Orléans"
          intro="Vous cherchez un notaire à Orléans pour votre mariage, un achat immobilier ou une succession ? Nos partenaires sont disponibles sous 48 h, en visio ou au cabinet. Le 1er rendez-vous est offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-paris", label: "Notaire à Paris" },
            { href: "/notaire-lyon", label: "Notaire à Lyon" },
            { href: "/notaire-bordeaux", label: "Notaire à Bordeaux" },
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-succession", label: "Notaire succession" },
            { href: "/notaire-mariage-pacs", label: "Notaire mariage / PACS" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
