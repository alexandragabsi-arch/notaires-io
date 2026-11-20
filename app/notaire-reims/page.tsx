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
  title: "RDV notaire à Reims : prendre rendez-vous en ligne",
  description:
    "Trouvez un notaire à Reims disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Reims",
    "notaire Reims immobilier",
    "notaire Reims mariage",
    "notaire Reims société",
    "trouver un notaire Reims",
    "notaire en ligne Reims",
    "rendez-vous notaire Reims",
    "notaire Marne",
  ],
  alternates: { canonical: "https://notaires.io/notaire-reims" },
  openGraph: {
    title: "RDV notaire à Reims · Notaires.io",
    description:
      "Trouvez un notaire à Reims disponible rapidement, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-reims",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Quels quartiers et communes de la grande agglomération rémoise couvrent vos notaires ?",
    a: "Les notaires à Reims interviennent dans tous les quartiers : Centre-ville, Clairmarais, Europe, Croix-Rouge, Murigny, Wilson, Orgeval, ainsi que dans les communes de la Communauté Urbaine du Grand Reims : Épernay, Cormontreuil, Tinqueux, Bezannes et Fismes. La visioconférence est disponible pour les clients de la Montagne de Reims ou de la Vallée de la Marne.",
  },
  {
    q: "Quels actes notariés sont courants pour les maisons de Champagne à Reims ?",
    a: "Reims est au cœur du vignoble champenois (Montagne de Reims, Grande Vallée de la Marne). Les notaires traitent régulièrement des cessions de maisons de Champagne, de parts sociales dans des coopératives viticoles, et de transmissions de droits de plantation. Les caves cathédrales creusées dans la craie (crayères) qui font partie de certains biens requièrent une analyse juridique spécifique lors des ventes.",
  },
  {
    q: "Y a-t-il des spécificités pour les hôtels particuliers Art déco à Reims ?",
    a: "Reims a été en grande partie reconstruite après la Première Guerre mondiale dans un style Art déco exceptionnel. L'acquisition d'un immeuble classé ou inscrit dans le secteur protégé du centre-ville implique des servitudes particulières, des règles de rénovation strictes et potentiellement des avantages fiscaux loi Malraux. Votre notaire à Reims vous guidera sur ce patrimoine spécifique.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Reims ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Reims. Très pratique pour les viticulteurs en pleine saison ou les cadres navettant sur Paris (45 min en TGV), vous pouvez signer votre acte par visioconférence depuis votre domicile ou votre bureau. Votre notaire vous précisera les actes éligibles à ce dispositif.",
  },
];

export default async function Page() {
  // Département, communes voisines et nombre réel de notaires (lib/grandes-villes.ts).
  const ville = grandeVille("Reims", "reims");
  const faq = [questionNombre(ville), ...FAQ];
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Reims", 120);
  const notaires = avecInscrits(
    scrapedNotaires.length > 0 ? scrapedNotaires : LISTING_NOTAIRES.filter((n) => n.city === "Reims"),
    await getInscritsVille("Reims"),
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
          h1="Prendre RDV avec un notaire à Reims"
          intro={introNombre(ville) + "Vous cherchez un notaire à Reims pour votre mariage, votre PACS, un achat immobilier en Champagne ou la création de votre société ? Les notaires rémois sont disponibles selon leurs créneaux, en visio ou au cabinet dans votre quartier."}
          notaires={notaires}
          faq={faq}
          relatedLinks={[
            // Département et communes voisines d'abord : le maillage qui manquait.
            ...liensGrandeVille(ville),
            { href: "/notaire-paris", label: "RDV notaire à Paris" },
            { href: "/notaire-metz", label: "RDV notaire à Metz" },
            { href: "/notaire-nancy", label: "RDV notaire à Nancy" },
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
