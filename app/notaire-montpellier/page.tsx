import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Montpellier — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Montpellier disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Montpellier",
    "notaire Montpellier immobilier",
    "notaire Montpellier mariage",
    "notaire Montpellier société",
    "trouver un notaire Montpellier",
    "notaire en ligne Montpellier",
    "rendez-vous notaire Montpellier",
    "notaire Hérault",
  ],
  alternates: { canonical: "https://notaires.io/notaire-montpellier" },
  openGraph: {
    title: "Notaire à Montpellier — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Montpellier disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-montpellier",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Montpellier", item: "https://notaires.io/notaire-montpellier" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Montpellier",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Montpellier", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Montpellier pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-montpellier",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de Montpellier Méditerranée Métropole couvrent vos notaires ?",
    a: "Nos notaires partenaires interviennent dans tous les secteurs de Montpellier : Écusson (centre historique), Antigone, Port-Marianne, Les Arceaux, Mosson, Hôpitaux-Facultés, ainsi que dans les communes de la métropole : Castelnau-le-Lez, Lattes, Pérols, Juvignac, Grabels et Clapiers. Des rendez-vous en visioconférence sont proposés pour les clients plus éloignés.",
  },
  {
    q: "Quels actes notariés sont les plus demandés pour l'immobilier à Montpellier ?",
    a: "Montpellier, ville à la croissance démographique soutenue, génère une forte demande pour les actes de vente en primo-accession, les VEFA dans les nouveaux quartiers (Port-Marianne, Ode à la Mer), et les investissements locatifs meublés. Les notaires traitent aussi de nombreuses acquisitions de résidences secondaires dans le Pays de l'Or (La Grande-Motte, Palavas-les-Flots).",
  },
  {
    q: "Y a-t-il des spécificités pour les exploitations viticoles et agricoles en Hérault ?",
    a: "L'Hérault est un département viticole majeur (Pic Saint-Loup, Terrasses du Larzac). La cession ou la transmission d'un domaine viticole ou d'une cave coopérative implique des actes notariés spécifiques : évaluation des stocks, reprise du bail rural, droit de préemption SAFER. Votre notaire à Montpellier dispose de l'expertise nécessaire pour sécuriser ces opérations agricoles.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Montpellier ?",
    a: "Oui. La signature électronique à distance (AAED) est pleinement disponible à Montpellier. Que vous soyez chercheur au CHU de Montpellier, étudiant en déplacement ou résident secondaire à Sète, vous pouvez signer votre acte par visioconférence. Votre notaire partenaire vous précisera les modalités selon la nature de l'acte envisagé.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Montpellier", 15);
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Montpellier");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Montpellier"
          intro="Vous cherchez un notaire à Montpellier pour votre mariage, votre PACS, un achat immobilier ou la création de votre société ? Nos notaires partenaires montpelliérains sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-toulouse", label: "Notaire à Toulouse" },
            { href: "/notaire-marseille", label: "Notaire à Marseille" },
            { href: "/notaire-nice", label: "Notaire à Nice" },
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
