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
  title: "RDV notaire à Nancy : prendre rendez-vous en ligne",
  description:
    "Trouvez un notaire à Nancy disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Nancy",
    "notaire Nancy immobilier",
    "notaire Nancy mariage",
    "notaire Nancy société",
    "trouver un notaire Nancy",
    "notaire en ligne Nancy",
    "rendez-vous notaire Nancy",
    "notaire Meurthe-et-Moselle",
  ],
  alternates: { canonical: "https://notaires.io/notaire-nancy" },
  openGraph: {
    title: "RDV notaire à Nancy · Notaires.io",
    description:
      "Trouvez un notaire à Nancy disponible rapidement, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-nancy",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Quels quartiers et communes du Grand Nancy couvrent vos notaires ?",
    a: "Les notaires à Nancy interviennent dans tous les quartiers : Centre (place Stanislas, Vieille-Ville), Haussonville, Saurupt, Plateau de Haye, Saint-Pierre, ainsi que dans les communes du Grand Nancy : Vandœuvre-lès-Nancy, Saint-Max, Essey-lès-Nancy, Laxou, Maxéville, Jarville-la-Malgrange et Villers-lès-Nancy. La visioconférence est disponible pour les clients de la Lorraine plus éloignés.",
  },
  {
    q: "Quels actes notariés sont fréquents pour l'immobilier Art nouveau à Nancy ?",
    a: "Nancy est la capitale mondiale de l'Art nouveau (école de Nancy) avec un patrimoine architectural exceptionnel. L'acquisition d'une villa Art nouveau (Émile Gallé, Louis Majorelle) ou d'un appartement dans un immeuble classé implique des obligations de conservation, des autorisations ABF et des avantages fiscaux loi Malraux. Votre notaire à Nancy vous guidera sur les spécificités de ce patrimoine unique.",
  },
  {
    q: "Y a-t-il des spécificités pour les entreprises lorraines à Nancy ?",
    a: "Nancy est un pôle universitaire et de recherche important (Université de Lorraine, INP Lorraine). La création de startups dans les secteurs des matériaux, de la santé ou du numérique y est dynamique. Les notaires nancéiens accompagnent régulièrement les entrepreneurs dans la constitution de SAS, les pactes d'actionnaires et les opérations de cession de fonds de commerce dans le centre-ville en transformation.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Nancy ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Nancy. Que vous soyez chercheur à l'Université de Lorraine en déplacement ou entrepreneur trop occupé pour vous déplacer, vous pouvez signer votre acte par visioconférence. Votre notaire vous précisera les actes éligibles à ce dispositif sécurisé.",
  },
];

export default async function Page() {
  // Département, communes voisines et nombre réel de notaires (lib/grandes-villes.ts).
  const ville = grandeVille("Nancy", "nancy");
  const faq = [questionNombre(ville), ...FAQ];
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Nancy", 120);
  const notaires = avecInscrits(
    scrapedNotaires.length > 0 ? scrapedNotaires : LISTING_NOTAIRES.filter((n) => n.city === "Nancy"),
    await getInscritsVille("Nancy"),
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
          h1="Prendre RDV avec un notaire à Nancy"
          intro={introNombre(ville) + "Vous cherchez un notaire à Nancy pour votre mariage, votre PACS, un achat immobilier en Lorraine ou la création de votre société ? Les notaires nancéiens sont disponibles selon leurs créneaux, en visio ou au cabinet dans votre quartier."}
          notaires={notaires}
          faq={faq}
          relatedLinks={[
            // Département et communes voisines d'abord : le maillage qui manquait.
            ...liensGrandeVille(ville),
            { href: "/notaire-metz", label: "RDV notaire à Metz" },
            { href: "/notaire-strasbourg", label: "RDV notaire à Strasbourg" },
            { href: "/notaire-reims", label: "RDV notaire à Reims" },
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
