import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Metz — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Metz disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Metz",
    "notaire Metz immobilier",
    "notaire Metz mariage",
    "notaire Metz société",
    "trouver un notaire Metz",
    "notaire en ligne Metz",
    "rendez-vous notaire Metz",
    "notaire Moselle",
  ],
  alternates: { canonical: "https://notaires.io/notaire-metz" },
  openGraph: {
    title: "Notaire à Metz — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Metz disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-metz",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Metz", item: "https://notaires.io/notaire-metz" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Metz",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Metz", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Metz pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-metz",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de Metz Métropole couvrent vos notaires ?",
    a: "Nos notaires partenaires à Metz interviennent dans tous les quartiers : Centre-ville, Île du Saulcy, Nouvelle Ville (quartier impérial), Sablon, Borny, Queuleu, Magny, ainsi que dans les communes de Metz Métropole : Montigny-lès-Metz, Woippy, Thionville, Amnéville et Ars-sur-Moselle. La visioconférence est disponible pour les clients de la Moselle ou de la frontière luxembourgeoise.",
  },
  {
    q: "Quels actes notariés sont fréquents pour les frontaliers travaillant au Luxembourg ?",
    a: "La position transfrontalière de Metz génère une demande spécifique : les frontaliers résidant en Moselle et travaillant au Luxembourg ont souvent besoin d'actes coordonnant droit français et droit luxembourgeois (achat d'un bien en France, testament international, donation). Votre notaire à Metz est habitué à conseiller ces profils et à collaborer avec des notaires luxembourgeois le cas échéant.",
  },
  {
    q: "Y a-t-il des spécificités du droit local mosellan à Metz ?",
    a: "Comme Strasbourg, Metz est soumis au droit local alsacien-mosellan. Cela implique un registre foncier spécifique (Grundbuch), des règles particulières pour les baux ruraux et les associations loi 1908. Pour les actes immobiliers, le titre de propriété est vérifié dans ce registre local et non dans le fichier immobilier national. Votre notaire à Metz maîtrise ces spécificités juridiques locales.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Metz ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Metz. Très pratique pour les frontaliers dont les horaires de travail au Luxembourg sont contraignants, vous pouvez signer votre acte par visioconférence depuis votre domicile en Moselle. Votre notaire partenaire vous précisera les actes éligibles et les modalités.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Metz", 15);
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Metz");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Metz"
          intro="Vous cherchez un notaire à Metz pour votre mariage, votre PACS, un achat immobilier en Moselle ou la création de votre société ? Nos notaires partenaires messins maîtrisent le droit local et sont disponibles sous 48 h, en visio ou au cabinet. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-nancy", label: "Notaire à Nancy" },
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
