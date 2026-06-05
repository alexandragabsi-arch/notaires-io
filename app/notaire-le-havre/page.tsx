import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire au Havre · Notaires.io",
  description:
    "Trouvez un notaire au Havre disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Le Havre",
    "notaire Le Havre immobilier",
    "notaire Le Havre mariage",
    "notaire Le Havre société",
    "trouver un notaire Le Havre",
    "notaire en ligne Le Havre",
    "rendez-vous notaire Le Havre",
    "notaire Seine-Maritime",
  ],
  alternates: { canonical: "https://notaires.io/notaire-le-havre" },
  openGraph: {
    title: "Notaire au Havre · Notaires.io",
    description:
      "Trouvez un notaire au Havre disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-le-havre",
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
        { "@type": "ListItem", position: 2, name: "Notaire au Havre", item: "https://notaires.io/notaire-le-havre" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire au Havre",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Le Havre", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires au Havre pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-le-havre",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de la CODAH couvrent vos notaires au Havre ?",
    a: "Nos notaires partenaires au Havre interviennent dans tous les quartiers : Centre reconstruit (UNESCO), Sainte-Marie, Sanvic, Caucriauville, Mont-Gaillard, Bléville, Côte d'Albâtre, ainsi que dans les communes de la communauté d'agglomération : Montivilliers, Harfleur, Gonfreville-l'Orcher, Octeville-sur-Mer et Saint-Jouin-Bruneval. La visioconférence est disponible pour les clients du Pays de Caux ou de l'Estuaire.",
  },
  {
    q: "Quels actes notariés sont fréquents pour l'immobilier au Havre ?",
    a: "Le Havre, ville inscrite au patrimoine mondial de l'UNESCO pour son centre reconstruit par Auguste Perret, génère des actes de vente d'appartements atypiques (grandes baies vitrées, matériaux béton brut). Les notaires traitent aussi des ventes de villas sur la Côte d'Albâtre (Étretat, Fécamp), des acquisitions portuaires et logistiques, et des investissements locatifs dans les quartiers étudiants proches du port.",
  },
  {
    q: "Y a-t-il des spécificités pour les activités portuaires et maritimes au Havre ?",
    a: "Le Havre est le premier port à conteneurs de France. Les activités portuaires génèrent des besoins notariaux spécifiques : cessions de parts sociales dans des sociétés de transport et de logistique, constitutions de GIE portuaires, baux commerciaux en zone portuaire soumis aux règles du GPMH (Grand Port Maritime du Havre). Votre notaire au Havre maîtrise ces opérations propres à l'économie maritime.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Le Havre ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible au Havre. Très utile pour les professionnels du secteur maritime souvent en déplacement ou embarqués, vous pouvez signer votre acte par visioconférence depuis n'importe quel endroit. Votre notaire partenaire vous confirmera l'éligibilité de l'acte et organisera la session de signature.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Le Havre");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Le Havre");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire au Havre"
          intro="Vous cherchez un notaire au Havre pour votre mariage, votre PACS, un achat immobilier en Seine-Maritime ou la création de votre société ? Nos notaires partenaires havrais sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-rouen", label: "Notaire à Rouen" },
            { href: "/notaire-caen", label: "Notaire à Caen" },
            { href: "/notaire-brest", label: "Notaire à Brest" },
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
