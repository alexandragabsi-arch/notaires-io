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
  title: "RDV notaire à Metz : prendre rendez-vous en ligne",
  description:
    "Trouvez un notaire à Metz disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Metz",
    "notaire Metz immobilier",
    "notaire Metz mariage",
    "notaire Metz société",
    "trouver un notaire Metz",
    "notaire en ligne Metz",
    "rendez-vous notaire Metz",
    "notaire Moselle",
  ],
  alternates: { canonical: "https://notaires.io/notaire-metz" },
  openGraph: {
    title: "RDV notaire à Metz · Notaires.io",
    description:
      "Trouvez un notaire à Metz disponible rapidement, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-metz",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Quels quartiers et communes de Metz Métropole couvrent vos notaires ?",
    a: "Les notaires à Metz interviennent dans tous les quartiers : Centre-ville, Île du Saulcy, Nouvelle Ville (quartier impérial), Sablon, Borny, Queuleu, Magny, ainsi que dans les communes de Metz Métropole : Montigny-lès-Metz, Woippy, Thionville, Amnéville et Ars-sur-Moselle. La visioconférence est disponible pour les clients de la Moselle ou de la frontière luxembourgeoise.",
  },
  {
    q: "Quels actes notariés sont fréquents pour les frontaliers travaillant au Luxembourg ?",
    a: "La position transfrontalière de Metz génère une demande spécifique : les frontaliers résidant en Moselle et travaillant au Luxembourg ont souvent besoin d'actes coordonnant droit français et droit luxembourgeois (achat d'un bien en France, testament international, donation). Votre notaire à Metz est habitué à conseiller ces profils et à collaborer avec des notaires luxembourgeois le cas échéant.",
  },
  {
    q: "Y a-t-il des spécificités du droit local mosellan à Metz ?",
    a: "Comme Strasbourg, Metz est soumis au droit local alsacien-mosellan. Cela implique un registre foncier spécifique (Grundbuch), des règles particulières pour les baux ruraux et les associations loi 1908. Pour les actes immobiliers, le titre de propriété est vérifié dans ce registre local et non dans le fichier immobilier national. Votre notaire à Metz maîtrise ces spécificités juridiques locales.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Metz ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Metz. Très pratique pour les frontaliers dont les horaires de travail au Luxembourg sont contraignants, vous pouvez signer votre acte par visioconférence depuis votre domicile en Moselle. Votre notaire vous précisera les actes éligibles et les modalités.",
  },
];

export default async function Page() {
  // Département, communes voisines et nombre réel de notaires (lib/grandes-villes.ts).
  const ville = grandeVille("Metz", "metz");
  const faq = [questionNombre(ville), ...FAQ];
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Metz", 120);
  const notaires = avecInscrits(
    scrapedNotaires.length > 0 ? scrapedNotaires : LISTING_NOTAIRES.filter((n) => n.city === "Metz"),
    await getInscritsVille("Metz"),
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
          h1="Prendre RDV avec un notaire à Metz"
          intro={introNombre(ville) + "Vous cherchez un notaire à Metz pour votre mariage, votre PACS, un achat immobilier en Moselle ou la création de votre société ? Les notaires messins maîtrisent le droit local et sont disponibles selon leurs créneaux, en visio ou au cabinet."}
          notaires={notaires}
          faq={faq}
          relatedLinks={[
            // Département et communes voisines d'abord : le maillage qui manquait.
            ...liensGrandeVille(ville),
            { href: "/notaire-nancy", label: "RDV notaire à Nancy" },
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
