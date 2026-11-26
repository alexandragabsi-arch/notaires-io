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
  title: "RDV notaire à Brest : prendre rendez-vous en ligne",
  description:
    "Trouvez un notaire à Brest disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Brest",
    "notaire Brest immobilier",
    "notaire Brest mariage",
    "notaire Brest société",
    "trouver un notaire Brest",
    "notaire en ligne Brest",
    "rendez-vous notaire Brest",
    "notaire Finistère",
  ],
  alternates: { canonical: "https://notaires.io/notaire-brest" },
  openGraph: {
    title: "RDV notaire à Brest · Notaires.io",
    description:
      "Trouvez un notaire à Brest disponible rapidement, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-brest",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Quels quartiers et communes de Brest Métropole couvrent vos notaires ?",
    a: "Les notaires à Brest interviennent dans tous les quartiers : Saint-Marc, Lambézellec, Bellevue, Pontanézen, Saint-Pierre, Recouvrance, ainsi que dans les communes de la métropole : Guipavas, Le Relecq-Kerhuon, Plougastel-Daoulas, Plouzané, Guilers et Bohars. La visioconférence est disponible pour les clients du Pays de Brest ou du Léon.",
  },
  {
    q: "Quels actes notariés sont fréquents pour l'immobilier à Brest ?",
    a: "À Brest, les notaires traitent de nombreuses ventes de maisons individuelles à Lambézellec ou Saint-Marc, d'appartements en vue sur la rade de Brest, et d'acquisitions de résidences secondaires sur la Presqu'île de Crozon ou en Pays d'Iroise. Les achats de terrains à bâtir dans les communes périphériques (Guilers, Plougastel) sont aussi très courants. Les primo-accédants bénéficient souvent du PTZ que votre notaire intégrera dans l'acte.",
  },
  {
    q: "Y a-t-il des spécificités pour les successions maritimes à Brest ?",
    a: "Brest est un grand port militaire et commercial. Pour les marins (Marine nationale, Marine marchande), les successions présentent des particularités : pension de réversion versée par la CNRACL ou l'ENIM (Établissement national des invalides de la marine), capital décès, droits à la retraite spécifiques. Votre notaire à Brest est familier de ces dossiers et collabore avec les services compétents pour établir des inventaires complets.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Brest ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Brest. C'est particulièrement utile pour les marins en navigation, les militaires en mission ou les Bretons expatriés souhaitant investir dans leur région. Votre notaire vous précisera quels actes sont éligibles et organisera la session de signature par visioconférence sécurisée.",
  },
];

export default async function Page() {
  // Département, communes voisines et nombre réel de notaires (lib/grandes-villes.ts).
  const ville = grandeVille("Brest", "brest");
  const faq = [questionNombre(ville), ...FAQ];
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Brest", 120);
  const notaires = avecInscrits(
    scrapedNotaires.length > 0 ? scrapedNotaires : LISTING_NOTAIRES.filter((n) => n.city === "Brest"),
    await getInscritsVille("Brest"),
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
          h1="Prendre RDV avec un notaire à Brest"
          intro={introNombre(ville) + "Vous cherchez un notaire à Brest pour votre mariage, votre PACS, un achat immobilier en Finistère ou la création de votre société ? Les notaires brestois sont disponibles selon leurs créneaux, en visio ou au cabinet dans votre quartier."}
          notaires={notaires}
          faq={faq}
          relatedLinks={[
            // Département et communes voisines d'abord : le maillage qui manquait.
            ...liensGrandeVille(ville),
            { href: "/notaire-rennes", label: "RDV notaire à Rennes" },
            { href: "/notaire-nantes", label: "RDV notaire à Nantes" },
            { href: "/notaire-le-havre", label: "RDV notaire au Havre" },
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
