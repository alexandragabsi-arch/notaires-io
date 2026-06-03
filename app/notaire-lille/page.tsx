import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Lille — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Lille pour votre achat immobilier, création de société ou succession. Prise de rendez-vous en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Lille",
    "notaire Lille immobilier",
    "notaire Lille société",
    "notaire Lille succession",
    "trouver un notaire Lille",
    "notaire en ligne Lille",
    "rendez-vous notaire Lille",
    "notaire Nord",
    "notaire Hauts-de-France",
  ],
  alternates: { canonical: "https://notaires.io/notaire-lille" },
  openGraph: {
    title: "Notaire à Lille — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Lille pour votre achat immobilier ou création de société. 1er RDV offert.",
    url: "https://notaires.io/notaire-lille",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Lille", item: "https://notaires.io/notaire-lille" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Lille",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Lille", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Lille pour immobilier, société, succession et famille.",
      url: "https://notaires.io/notaire-lille",
    },
  ],
};

const FAQ = [
  {
    q: "Quelles sont les particularités de l'immobilier à Lille pour un notaire ?",
    a: "Lille présente plusieurs spécificités que votre notaire doit maîtriser : le droit de préemption urbain (DPU) exercé fréquemment par la Métropole Européenne de Lille, les nombreux biens en copropriété ancienne (immeubles haussmanniens du Vieux-Lille), et les règles d'urbanisme strictes dans les secteurs protégés. Par ailleurs, la frontière belge implique parfois des enjeux transfrontaliers pour les investisseurs ou les couples franco-belges.",
  },
  {
    q: "Mon entreprise dans les Hauts-de-France a-t-elle besoin d'un notaire pour ses statuts ?",
    a: "Le notaire n'est pas systématiquement obligatoire pour créer une société commerciale (SARL, SAS), mais il est indispensable dès que la constitution implique un apport immobilier ou une SCI. Pour un entrepreneur dans le Nord, un notaire apporte également une valeur ajoutée précieuse sur la rédaction de baux commerciaux, la cession de fonds de commerce, ou les pactes d'associés. Nos notaires partenaires à Lille accompagnent régulièrement des start-ups et PME de la métropole.",
  },
  {
    q: "Comment procéder à un achat immobilier transfrontalier entre Lille et la Belgique ?",
    a: "Pour un bien situé en Belgique, c'est un notaire belge qui est compétent. En revanche, si vous résidez à Lille et achetez un bien belge, votre notaire lillois peut vous conseiller sur les implications fiscales françaises (déclaration des avoirs à l'étranger, ISF/IFI, succession future). Pour un bien situé dans le Nord de la France, nos notaires partenaires à Lille gèrent l'ensemble de la procédure, y compris les spécificités du règlement de copropriété.",
  },
  {
    q: "Quel délai pour ouvrir une succession avec des biens dans le Nord ?",
    a: "La déclaration de succession doit être déposée dans les 6 mois suivant le décès pour un décès survenu en France métropolitaine. Votre notaire à Lille prend en charge l'ensemble des formalités : attestation de propriété immobilière, déclaration auprès des impôts, liquidation des comptes bancaires, partage entre héritiers. Pour une succession comportant un ou plusieurs biens immobiliers dans le Nord, comptez 6 à 12 mois pour clôturer le dossier.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Lille");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Lille");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Lille"
          intro="Achat immobilier dans la métropole lilloise, création de votre société dans les Hauts-de-France ou règlement d'une succession : nos notaires partenaires à Lille sont disponibles rapidement. 1er rendez-vous offert, en visio ou au cabinet. Certains reçoivent également en anglais."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-paris", label: "Notaire à Paris" },
            { href: "/notaire-lyon", label: "Notaire à Lyon" },
            { href: "/notaire-nantes", label: "Notaire à Nantes" },
            { href: "/notaire-bordeaux", label: "Notaire à Bordeaux" },
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-creation-societe", label: "Notaire création de société" },
            { href: "/notaire-succession", label: "Notaire succession" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
