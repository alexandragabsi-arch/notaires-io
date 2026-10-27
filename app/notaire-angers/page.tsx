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
  title: "RDV notaire à Angers : prendre rendez-vous en ligne",
  description:
    "Trouvez un notaire à Angers disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Angers",
    "notaire Angers immobilier",
    "notaire Angers mariage",
    "notaire Angers société",
    "trouver un notaire Angers",
    "notaire en ligne Angers",
    "rendez-vous notaire Angers",
    "notaire Maine-et-Loire",
  ],
  alternates: { canonical: "https://notaires.io/notaire-angers" },
  openGraph: {
    title: "RDV notaire à Angers · Notaires.io",
    description:
      "Trouvez un notaire à Angers disponible rapidement, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-angers",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Quels quartiers et communes d'Angers Loire Métropole couvrent vos notaires ?",
    a: "Les notaires à Angers interviennent dans tous les quartiers : Centre-ville, La Doutre, Belle-Beille, Verneau, Justices, Monplaisir, Saint-Serge, ainsi que dans les communes de la métropole : Saint-Barthélemy-d'Anjou, Les Ponts-de-Cé, Trélazé, Avrillé et Mûrs-Erigné. La visioconférence est disponible pour les clients du Saumurois ou du Segréen.",
  },
  {
    q: "Quels actes notariés sont les plus fréquents pour l'immobilier à Angers ?",
    a: "Angers, régulièrement classée parmi les villes où il fait bon vivre, attire de nombreux acquéreurs. Les notaires traitent des ventes de maisons de ville en ardoise (centre historique), d'appartements en bord de Maine, et de pavillons dans la première couronne. Le marché du viager est actif dans une ville à forte population senior, tout comme les donations-partages pour les familles angevines installées depuis plusieurs générations.",
  },
  {
    q: "Y a-t-il des spécificités pour les domaines viticoles et horticoles en Maine-et-Loire ?",
    a: "Le Maine-et-Loire est le premier département horticole de France et un grand vignoble (Anjou, Saumur, Muscadet). La transmission ou la cession d'une exploitation horticole, d'une pépinière ou d'un domaine viticole implique des actes notariés spécifiques : droit de préemption SAFER, baux ruraux, évaluation du fonds agricole. Votre notaire à Angers maîtrise ces opérations propres au terroir anjouine.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Angers ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Angers. Que vous soyez en déplacement à Paris ou à Nantes pour le travail, vous pouvez signer votre acte par visioconférence depuis n'importe quel endroit. Votre notaire vous précisera quels actes sont éligibles à ce dispositif.",
  },
];

export default async function Page() {
  // Département, communes voisines et nombre réel de notaires (lib/grandes-villes.ts).
  const ville = grandeVille("Angers", "angers");
  const faq = [questionNombre(ville), ...FAQ];
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Angers", 120);
  const notaires = avecInscrits(
    scrapedNotaires.length > 0 ? scrapedNotaires : LISTING_NOTAIRES.filter((n) => n.city === "Angers"),
    await getInscritsVille("Angers"),
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
          h1="Prendre RDV avec un notaire à Angers"
          intro={introNombre(ville) + "Vous cherchez un notaire à Angers pour votre mariage, votre PACS, un achat immobilier en Anjou ou la création de votre société ? Les notaires angevins sont disponibles selon leurs créneaux, en visio ou au cabinet dans votre quartier."}
          notaires={notaires}
          faq={faq}
          relatedLinks={[
            // Département et communes voisines d'abord : le maillage qui manquait.
            ...liensGrandeVille(ville),
            { href: "/notaire-nantes", label: "RDV notaire à Nantes" },
            { href: "/notaire-rennes", label: "RDV notaire à Rennes" },
            { href: "/notaire-orleans", label: "RDV notaire à Orléans" },
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
