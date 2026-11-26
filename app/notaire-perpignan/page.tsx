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
  title: "RDV notaire à Perpignan : prendre rendez-vous en ligne",
  description:
    "Trouvez un notaire à Perpignan disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Perpignan",
    "notaire Perpignan immobilier",
    "notaire Perpignan mariage",
    "notaire Perpignan société",
    "trouver un notaire Perpignan",
    "notaire en ligne Perpignan",
    "rendez-vous notaire Perpignan",
    "notaire Pyrénées-Orientales",
  ],
  alternates: { canonical: "https://notaires.io/notaire-perpignan" },
  openGraph: {
    title: "RDV notaire à Perpignan · Notaires.io",
    description:
      "Trouvez un notaire à Perpignan disponible rapidement, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-perpignan",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Quels quartiers et communes de la Perpignan Méditerranée Métropole couvrent vos notaires ?",
    a: "Les notaires à Perpignan couvrent tous les secteurs : Centre historique (Castillet, Loge de Mer), Saint-Jacques, Moulin-à-Vent, Mas Balande, Saint-Mathieu, ainsi que les communes de la métropole : Canet-en-Roussillon, Saint-Estève, Cabestany, Rivesaltes, Pia et Le Barcarès. La visioconférence est disponible pour les clients de la Cerdagne ou de l'Albères.",
  },
  {
    q: "Quels actes notariés sont fréquents pour l'immobilier côtier en Roussillon ?",
    a: "Les Pyrénées-Orientales offrent un littoral attractif (Canet-en-Roussillon, Saint-Cyprien, Argelès-sur-Mer) à des prix encore accessibles comparés à la Côte d'Azur. Les notaires traitent de nombreuses ventes de résidences secondaires, d'appartements en front de mer, de maisons catalanes dans l'arrière-pays, et de terrains constructibles dans les communes rurales. Le viager est également courant dans cette région à forte population retraitée.",
  },
  {
    q: "Y a-t-il des spécificités pour les propriétés transfrontalières franco-espagnoles à Perpignan ?",
    a: "La proximité de l'Espagne (frontière à 30 km) génère des situations patrimoniales transfrontalières : résidents espagnols acquérant un bien en France, Français possédant un bien en Catalogne espagnole. Le règlement européen Successions et la convention franco-espagnole encadrent ces situations. Votre notaire à Perpignan, familier de la culture catalane et des enjeux transfrontaliers, vous accompagnera efficacement.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Perpignan ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Perpignan. Très pratique pour les Français résidant en Espagne qui souhaitent acquérir un bien en Roussillon, ou pour les acheteurs d'une résidence secondaire depuis Paris ou Lyon, vous pouvez signer votre acte par visioconférence. Votre notaire vous précisera les actes compatibles.",
  },
];

export default async function Page() {
  // Département, communes voisines et nombre réel de notaires (lib/grandes-villes.ts).
  const ville = grandeVille("Perpignan", "perpignan");
  const faq = [questionNombre(ville), ...FAQ];
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Perpignan", 120);
  const notaires = avecInscrits(
    scrapedNotaires.length > 0 ? scrapedNotaires : LISTING_NOTAIRES.filter((n) => n.city === "Perpignan"),
    await getInscritsVille("Perpignan"),
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
          h1="Prendre RDV avec un notaire à Perpignan"
          intro={introNombre(ville) + "Vous cherchez un notaire à Perpignan pour votre mariage, votre PACS, un achat immobilier en Roussillon ou la création de votre société ? Les notaires perpignanais sont disponibles selon leurs créneaux, en visio ou au cabinet dans votre quartier."}
          notaires={notaires}
          faq={faq}
          relatedLinks={[
            // Département et communes voisines d'abord : le maillage qui manquait.
            ...liensGrandeVille(ville),
            { href: "/notaire-montpellier", label: "RDV notaire à Montpellier" },
            { href: "/notaire-toulouse", label: "RDV notaire à Toulouse" },
            { href: "/notaire-marseille", label: "RDV notaire à Marseille" },
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
