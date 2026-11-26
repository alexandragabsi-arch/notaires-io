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
  title: "RDV notaire à Nice : prendre rendez-vous en ligne",
  description:
    "Trouvez un notaire à Nice disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Nice",
    "notaire Nice immobilier",
    "notaire Nice mariage",
    "notaire Nice société",
    "trouver un notaire Nice",
    "notaire en ligne Nice",
    "rendez-vous notaire Nice",
    "notaire Alpes-Maritimes",
  ],
  alternates: { canonical: "https://notaires.io/notaire-nice" },
  openGraph: {
    title: "RDV notaire à Nice · Notaires.io",
    description:
      "Trouvez un notaire à Nice disponible rapidement, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-nice",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Quels quartiers et communes de la Côte d'Azur couvrent les notaires à Nice ?",
    a: "Les notaires interviennent dans tous les quartiers de Nice : Vieux-Nice, Cimiez, Libération, Nice-Nord, Musiciens, Carras, ainsi que dans les communes limitrophes de Saint-Laurent-du-Var, Cagnes-sur-Mer, Antibes, Villefranche-sur-Mer et Monaco pour les résidents français. Des rendez-vous en visioconférence sont disponibles pour les clients éloignés ou résidant à l'étranger.",
  },
  {
    q: "Quels actes notariés sont les plus fréquents pour l'immobilier à Nice ?",
    a: "Le marché immobilier niçois, parmi les plus chers de France, génère une forte demande pour les actes de vente de biens de prestige, les viagers (fréquents sur la Côte d'Azur), les démembrements de propriété et les SCI familiales. Les notaires traitent également de nombreuses acquisitions par des acheteurs étrangers, avec les vérifications spécifiques que cela implique.",
  },
  {
    q: "Y a-t-il des spécificités pour les successions internationales à Nice ?",
    a: "Nice accueille une proportion importante de résidents étrangers et d'expatriés. Pour les successions transfrontalières, le règlement européen du 4 août 2015 (dit règlement Successions) s'applique et permet de choisir la loi de sa nationalité. Votre notaire à Nice est rompu à ces dossiers et pourra coordonner avec des confrères européens selon les biens présents à l'étranger.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Nice ?",
    a: "Oui. La signature électronique à distance (AAED) permet à un résident de Nice ou de la Côte d'Azur de signer un acte authentique par visioconférence depuis chez lui. C'est particulièrement utile pour les non-résidents français possédant un bien à Nice. Votre notaire vous précisera les actes éligibles à ce dispositif.",
  },
];

export default async function Page() {
  // Département, communes voisines et nombre réel de notaires (lib/grandes-villes.ts).
  const ville = grandeVille("Nice", "nice");
  const faq = [questionNombre(ville), ...FAQ];
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Nice", 120);
  const notaires = avecInscrits(
    scrapedNotaires.length > 0 ? scrapedNotaires : LISTING_NOTAIRES.filter((n) => n.city === "Nice"),
    await getInscritsVille("Nice"),
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
          h1="Prendre RDV avec un notaire à Nice"
          intro={introNombre(ville) + "Vous cherchez un notaire à Nice pour votre mariage, votre PACS, un achat immobilier sur la Côte d'Azur ou la création de votre société ? Les notaires niçois sont disponibles selon leurs créneaux, en visio ou au cabinet dans votre quartier."}
          notaires={notaires}
          faq={faq}
          relatedLinks={[
            // Département et communes voisines d'abord : le maillage qui manquait.
            ...liensGrandeVille(ville),
            { href: "/notaire-marseille", label: "RDV notaire à Marseille" },
            { href: "/notaire-toulouse", label: "RDV notaire à Toulouse" },
            { href: "/notaire-aix-en-provence", label: "RDV notaire à Aix-en-Provence" },
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
