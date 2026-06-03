import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Reims — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Reims disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Reims",
    "notaire Reims immobilier",
    "notaire Reims mariage",
    "notaire Reims société",
    "trouver un notaire Reims",
    "notaire en ligne Reims",
    "rendez-vous notaire Reims",
    "notaire Marne",
  ],
  alternates: { canonical: "https://notaires.io/notaire-reims" },
  openGraph: {
    title: "Notaire à Reims — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Reims disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-reims",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Reims", item: "https://notaires.io/notaire-reims" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Reims",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Reims", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Reims pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-reims",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de la grande agglomération rémoise couvrent vos notaires ?",
    a: "Nos notaires partenaires à Reims interviennent dans tous les quartiers : Centre-ville, Clairmarais, Europe, Croix-Rouge, Murigny, Wilson, Orgeval, ainsi que dans les communes de la Communauté Urbaine du Grand Reims : Épernay, Cormontreuil, Tinqueux, Bezannes et Fismes. La visioconférence est disponible pour les clients de la Montagne de Reims ou de la Vallée de la Marne.",
  },
  {
    q: "Quels actes notariés sont courants pour les maisons de Champagne à Reims ?",
    a: "Reims est au cœur du vignoble champenois (Montagne de Reims, Grande Vallée de la Marne). Les notaires traitent régulièrement des cessions de maisons de Champagne, de parts sociales dans des coopératives viticoles, et de transmissions de droits de plantation. Les caves cathédrales creusées dans la craie (crayères) qui font partie de certains biens requièrent une analyse juridique spécifique lors des ventes.",
  },
  {
    q: "Y a-t-il des spécificités pour les hôtels particuliers Art déco à Reims ?",
    a: "Reims a été en grande partie reconstruite après la Première Guerre mondiale dans un style Art déco exceptionnel. L'acquisition d'un immeuble classé ou inscrit dans le secteur protégé du centre-ville implique des servitudes particulières, des règles de rénovation strictes et potentiellement des avantages fiscaux loi Malraux. Votre notaire à Reims vous guidera sur ce patrimoine spécifique.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Reims ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Reims. Très pratique pour les viticulteurs en pleine saison ou les cadres navettant sur Paris (45 min en TGV), vous pouvez signer votre acte par visioconférence depuis votre domicile ou votre bureau. Votre notaire partenaire vous précisera les actes éligibles à ce dispositif.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Reims", 15);
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Reims");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Reims"
          intro="Vous cherchez un notaire à Reims pour votre mariage, votre PACS, un achat immobilier en Champagne ou la création de votre société ? Nos notaires partenaires rémois sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-paris", label: "Notaire à Paris" },
            { href: "/notaire-metz", label: "Notaire à Metz" },
            { href: "/notaire-nancy", label: "Notaire à Nancy" },
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
