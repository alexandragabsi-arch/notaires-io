import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Dijon — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Dijon disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Dijon",
    "notaire Dijon immobilier",
    "notaire Dijon mariage",
    "notaire Dijon société",
    "trouver un notaire Dijon",
    "notaire en ligne Dijon",
    "rendez-vous notaire Dijon",
    "notaire Côte-d'Or",
  ],
  alternates: { canonical: "https://notaires.io/notaire-dijon" },
  openGraph: {
    title: "Notaire à Dijon — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Dijon disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-dijon",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Dijon", item: "https://notaires.io/notaire-dijon" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Dijon",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Dijon", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Dijon pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-dijon",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de Dijon Métropole couvrent vos notaires ?",
    a: "Nos notaires partenaires interviennent dans tous les quartiers dijonnais : Centre historique, Montchapet, Fontaine-d'Ouche, Bourroches, Grésilles, Les Valendons, ainsi que dans les communes de Dijon Métropole : Chenôve, Longvic, Quetigny, Talant, Saint-Apollinaire et Chevigny-Saint-Sauveur. La visioconférence est disponible pour les clients de la Côte viticole ou du Pays de l'Auxois.",
  },
  {
    q: "Quels actes notariés sont fréquents pour les domaines viticoles en Côte-d'Or ?",
    a: "La Côte-d'Or abrite les plus grands vignobles de Bourgogne (Gevrey-Chambertin, Nuits-Saint-Georges, Pommard). La cession ou la transmission d'un domaine viticole ou d'un bail à long terme sur des parcelles classées implique des actes notariés très spécialisés : évaluation des droits de plantation, droit de préemption SAFER, conventions entre exploitants. Votre notaire à Dijon dispose de l'expertise pour ces opérations viticoles d'exception.",
  },
  {
    q: "Y a-t-il des spécificités pour les hôtels particuliers et demeures historiques à Dijon ?",
    a: "Dijon possède un riche patrimoine de demeures historiques classées ou inscrites (hôtels particuliers de la rue des Forges, maisons à pans de bois). L'acquisition d'un tel bien implique des obligations de conservation, des autorisations de travaux en secteur sauvegardé et parfois des servitudes de passage. Votre notaire à Dijon vous guidera sur les spécificités de l'immobilier patrimonial et les avantages fiscaux de la loi Malraux.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Dijon ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Dijon. Que vous soyez en déplacement professionnel ou viticulteur difficile à joindre en période de vendanges, vous pouvez signer votre acte par visioconférence. Votre notaire partenaire vous confirmera l'éligibilité de l'acte envisagé.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Dijon");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Dijon");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Dijon"
          intro="Vous cherchez un notaire à Dijon pour votre mariage, votre PACS, un achat immobilier en Bourgogne ou la création de votre société ? Nos notaires partenaires dijonnais sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-lyon", label: "Notaire à Lyon" },
            { href: "/notaire-reims", label: "Notaire à Reims" },
            { href: "/notaire-nancy", label: "Notaire à Nancy" },
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
