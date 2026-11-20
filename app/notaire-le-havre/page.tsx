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
  title: "RDV notaire au Havre : prendre rendez-vous en ligne",
  description:
    "Trouvez un notaire au Havre disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne. Notaires certifiés, tarifs réglementés.",
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
    title: "RDV notaire au Havre · Notaires.io",
    description:
      "Trouvez un notaire au Havre disponible rapidement, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-le-havre",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Quels quartiers et communes de la CODAH couvrent vos notaires au Havre ?",
    a: "Les notaires au Havre interviennent dans tous les quartiers : Centre reconstruit (UNESCO), Sainte-Marie, Sanvic, Caucriauville, Mont-Gaillard, Bléville, Côte d'Albâtre, ainsi que dans les communes de la communauté d'agglomération : Montivilliers, Harfleur, Gonfreville-l'Orcher, Octeville-sur-Mer et Saint-Jouin-Bruneval. La visioconférence est disponible pour les clients du Pays de Caux ou de l'Estuaire.",
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
    a: "Oui. La signature électronique à distance (AAED) est disponible au Havre. Très utile pour les professionnels du secteur maritime souvent en déplacement ou embarqués, vous pouvez signer votre acte par visioconférence depuis n'importe quel endroit. Votre notaire vous confirmera l'éligibilité de l'acte et organisera la session de signature.",
  },
];

export default async function Page() {
  // Département, communes voisines et nombre réel de notaires (lib/grandes-villes.ts).
  const ville = grandeVille("Le Havre", "le-havre");
  const faq = [questionNombre(ville), ...FAQ];
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Le Havre", 120);
  const notaires = avecInscrits(
    scrapedNotaires.length > 0 ? scrapedNotaires : LISTING_NOTAIRES.filter((n) => n.city === "Le Havre"),
    await getInscritsVille("Le Havre"),
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
          h1="Prendre RDV avec un notaire au Havre"
          intro={introNombre(ville) + "Vous cherchez un notaire au Havre pour votre mariage, votre PACS, un achat immobilier en Seine-Maritime ou la création de votre société ? Les notaires havrais sont disponibles selon leurs créneaux, en visio ou au cabinet dans votre quartier."}
          notaires={notaires}
          faq={faq}
          relatedLinks={[
            // Département et communes voisines d'abord : le maillage qui manquait.
            ...liensGrandeVille(ville),
            { href: "/notaire-rouen", label: "RDV notaire à Rouen" },
            { href: "/notaire-ville/caen", label: "RDV notaire à Caen" },
            { href: "/notaire-brest", label: "RDV notaire à Brest" },
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
