import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import Breadcrumb from "@/components/Breadcrumb";
import { grandeVille, filGrandeVille, liensGrandeVille, questionNombre, introNombre, jsonLdGrandeVille } from "@/lib/grandes-villes";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";
import { avecInscrits, getInscritsVille } from "@/lib/inscrits-serveur";

// Inscrits relus toutes les 5 minutes (lib/inscrits-serveur.ts).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "RDV notaire à Grenoble : prendre rendez-vous en ligne",
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
    title: "RDV notaire à Grenoble · Notaires.io",
    description:
      "Trouvez un notaire à Grenoble disponible rapidement, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-grenoble",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Quels quartiers et communes de la métropole grenobloise couvrent vos notaires ?",
    a: "Les notaires à Grenoble interviennent dans tous les secteurs : Hyper-Centre, Championnet, Eaux-Claires, Île Verte, Village olympique, ainsi que dans les communes de la métropole : Échirolles, Saint-Martin-d'Hères, Grenoble Saint-Egrève, Meylan, Gières, Crolles et Voiron. Des rendez-vous en visio sont disponibles pour les clients des Chartreuse ou du Vercors.",
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
    a: "Oui. La signature électronique à distance (AAED) est disponible à Grenoble. Particulièrement utile pour les ingénieurs et chercheurs en déplacement, vous pouvez signer votre acte par visioconférence depuis votre bureau ou votre résidence de montagne. Votre notaire vous précisera les actes compatibles avec ce dispositif.",
  },
];

export default async function Page() {
  // Département, communes voisines et nombre réel de notaires (lib/grandes-villes.ts).
  const ville = grandeVille("Grenoble", "grenoble");
  const faq = [questionNombre(ville), ...FAQ];
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Grenoble", 120);
  const notaires = avecInscrits(
    scrapedNotaires.length > 0 ? scrapedNotaires : LISTING_NOTAIRES.filter((n) => n.city === "Grenoble"),
    await getInscritsVille("Grenoble"),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGrandeVille(ville, faq, notaires)) }}
      />
      <Header />
      <Breadcrumb items={filGrandeVille(ville)} />
      <main>
        <SeoLandingPage
          h1="Prendre RDV avec un notaire à Grenoble"
          intro={introNombre(ville) + "Vous cherchez un notaire à Grenoble pour votre mariage, votre PACS, un achat immobilier en ville ou à la montagne, ou la création de votre société ? Les notaires grenoblois sont disponibles selon leurs créneaux, en visio ou au cabinet."}
          notaires={notaires}
          faq={faq}
          relatedLinks={[
            // Département et communes voisines d'abord : le maillage qui manquait.
            ...liensGrandeVille(ville),
            { href: "/notaire-lyon", label: "RDV notaire à Lyon" },
            { href: "/notaire-ville/annecy", label: "RDV notaire à Annecy" },
            { href: "/notaire-dijon", label: "RDV notaire à Dijon" },
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
