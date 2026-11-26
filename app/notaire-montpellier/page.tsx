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
  title: "RDV notaire à Montpellier : prendre rendez-vous en ligne",
  description:
    "Trouvez un notaire à Montpellier disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne. Notaires certifiés, tarifs réglementés.",
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
    title: "RDV notaire à Montpellier · Notaires.io",
    description:
      "Trouvez un notaire à Montpellier disponible rapidement, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-montpellier",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Quels quartiers et communes de Montpellier Méditerranée Métropole couvrent vos notaires ?",
    a: "Les notaires interviennent dans tous les secteurs de Montpellier : Écusson (centre historique), Antigone, Port-Marianne, Les Arceaux, Mosson, Hôpitaux-Facultés, ainsi que dans les communes de la métropole : Castelnau-le-Lez, Lattes, Pérols, Juvignac, Grabels et Clapiers. Des rendez-vous en visioconférence sont proposés pour les clients plus éloignés.",
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
    a: "Oui. La signature électronique à distance (AAED) est pleinement disponible à Montpellier. Que vous soyez chercheur au CHU de Montpellier, étudiant en déplacement ou résident secondaire à Sète, vous pouvez signer votre acte par visioconférence. Votre notaire vous précisera les modalités selon la nature de l'acte envisagé.",
  },
];

export default async function Page() {
  // Département, communes voisines et nombre réel de notaires (lib/grandes-villes.ts).
  const ville = grandeVille("Montpellier", "montpellier");
  const faq = [questionNombre(ville), ...FAQ];
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Montpellier", 120);
  const notaires = avecInscrits(
    scrapedNotaires.length > 0 ? scrapedNotaires : LISTING_NOTAIRES.filter((n) => n.city === "Montpellier"),
    await getInscritsVille("Montpellier"),
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
          h1="Prendre RDV avec un notaire à Montpellier"
          intro={introNombre(ville) + "Vous cherchez un notaire à Montpellier pour votre mariage, votre PACS, un achat immobilier ou la création de votre société ? Les notaires montpelliérains sont disponibles selon leurs créneaux, en visio ou au cabinet dans votre quartier."}
          notaires={notaires}
          faq={faq}
          relatedLinks={[
            // Département et communes voisines d'abord : le maillage qui manquait.
            ...liensGrandeVille(ville),
            { href: "/notaire-toulouse", label: "RDV notaire à Toulouse" },
            { href: "/notaire-marseille", label: "RDV notaire à Marseille" },
            { href: "/notaire-nice", label: "RDV notaire à Nice" },
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
