import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Grenoble · Notaires.io",
  description:
    "Trouvez un notaire à Grenoble disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Grenoble",
    "notaire Grenoble immobilier",
    "notaire Grenoble mariage",
    "notaire Grenoble société",
    "trouver un notaire Grenoble",
    "notaire en ligne Grenoble",
    "rendez-vous notaire Grenoble",
    "notaire Isère",
  ],
  alternates: { canonical: "https://notaires.io/notaire-grenoble" },
  openGraph: {
    title: "Notaire à Grenoble · Notaires.io",
    description:
      "Trouvez un notaire à Grenoble disponible rapidement, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-grenoble",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Grenoble", item: "https://notaires.io/notaire-grenoble" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Grenoble",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Grenoble", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Grenoble pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-grenoble",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de la métropole grenobloise couvrent vos notaires ?",
    a: "Nos notaires partenaires à Grenoble interviennent dans tous les secteurs : Hyper-Centre, Championnet, Eaux-Claires, Île Verte, Village olympique, ainsi que dans les communes de la métropole : Échirolles, Saint-Martin-d'Hères, Grenoble Saint-Egrève, Meylan, Gières, Crolles et Voiron. Des rendez-vous en visio sont disponibles pour les clients des Chartreuse ou du Vercors.",
  },
  {
    q: "Quels actes sont fréquents pour l'immobilier montagnard autour de Grenoble ?",
    a: "La proximité des stations de ski (Chamrousse, Les Sept-Laux, Villard-de-Lans) génère une forte demande pour les actes de vente d'appartements en résidence de tourisme, les droits de jouissance exclusive (parties communes), et les statuts de copropriété complexes. Les chalets et chalets-hôtels du Vercors ou de Belledonne nécessitent également des actes spécifiques que vos notaires grenoblois maîtrisent.",
  },
  {
    q: "Y a-t-il des spécificités locales pour les entreprises à Grenoble ?",
    a: "Grenoble est un pôle technologique majeur (STMicroelectronics, Schneider Electric, Soitec). La création de startups deeptech et les opérations de capital-risque (apport en nature, pactes d'actionnaires, SAS complexes) y sont fréquentes. Votre notaire à Grenoble maîtrise les montages juridiques propres à l'écosystème de l'innovation, notamment les BSPCE et les augmentations de capital en plusieurs tours.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Grenoble ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Grenoble. Particulièrement utile pour les ingénieurs et chercheurs en déplacement, vous pouvez signer votre acte par visioconférence depuis votre bureau ou votre résidence de montagne. Votre notaire partenaire vous précisera les actes compatibles avec ce dispositif.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Grenoble");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Grenoble");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Grenoble"
          intro="Vous cherchez un notaire à Grenoble pour votre mariage, votre PACS, un achat immobilier en ville ou à la montagne, ou la création de votre société ? Nos notaires partenaires grenoblois sont disponibles sous 48 h, en visio ou au cabinet."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-lyon", label: "Notaire à Lyon" },
            { href: "/notaire-annecy", label: "Notaire à Annecy" },
            { href: "/notaire-dijon", label: "Notaire à Dijon" },
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
