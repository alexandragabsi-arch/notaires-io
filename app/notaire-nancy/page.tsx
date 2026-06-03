import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Nancy — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Nancy disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Nancy",
    "notaire Nancy immobilier",
    "notaire Nancy mariage",
    "notaire Nancy société",
    "trouver un notaire Nancy",
    "notaire en ligne Nancy",
    "rendez-vous notaire Nancy",
    "notaire Meurthe-et-Moselle",
  ],
  alternates: { canonical: "https://notaires.io/notaire-nancy" },
  openGraph: {
    title: "Notaire à Nancy — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Nancy disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-nancy",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Nancy", item: "https://notaires.io/notaire-nancy" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Nancy",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Nancy", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Nancy pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-nancy",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes du Grand Nancy couvrent vos notaires ?",
    a: "Nos notaires partenaires à Nancy interviennent dans tous les quartiers : Centre (place Stanislas, Vieille-Ville), Haussonville, Saurupt, Plateau de Haye, Saint-Pierre, ainsi que dans les communes du Grand Nancy : Vandœuvre-lès-Nancy, Saint-Max, Essey-lès-Nancy, Laxou, Maxéville, Jarville-la-Malgrange et Villers-lès-Nancy. La visioconférence est disponible pour les clients de la Lorraine plus éloignés.",
  },
  {
    q: "Quels actes notariés sont fréquents pour l'immobilier Art nouveau à Nancy ?",
    a: "Nancy est la capitale mondiale de l'Art nouveau (école de Nancy) avec un patrimoine architectural exceptionnel. L'acquisition d'une villa Art nouveau (Émile Gallé, Louis Majorelle) ou d'un appartement dans un immeuble classé implique des obligations de conservation, des autorisations ABF et des avantages fiscaux loi Malraux. Votre notaire à Nancy vous guidera sur les spécificités de ce patrimoine unique.",
  },
  {
    q: "Y a-t-il des spécificités pour les entreprises lorraines à Nancy ?",
    a: "Nancy est un pôle universitaire et de recherche important (Université de Lorraine, INP Lorraine). La création de startups dans les secteurs des matériaux, de la santé ou du numérique y est dynamique. Les notaires nancéiens accompagnent régulièrement les entrepreneurs dans la constitution de SAS, les pactes d'actionnaires et les opérations de cession de fonds de commerce dans le centre-ville en transformation.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Nancy ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Nancy. Que vous soyez chercheur à l'Université de Lorraine en déplacement ou entrepreneur trop occupé pour vous déplacer, vous pouvez signer votre acte par visioconférence. Votre notaire partenaire vous précisera les actes éligibles à ce dispositif sécurisé.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Nancy");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Nancy");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Nancy"
          intro="Vous cherchez un notaire à Nancy pour votre mariage, votre PACS, un achat immobilier en Lorraine ou la création de votre société ? Nos notaires partenaires nancéiens sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-metz", label: "Notaire à Metz" },
            { href: "/notaire-strasbourg", label: "Notaire à Strasbourg" },
            { href: "/notaire-reims", label: "Notaire à Reims" },
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
