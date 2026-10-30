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
  title: "RDV notaire à Strasbourg : prendre rendez-vous en ligne",
  description:
    "Trouvez un notaire à Strasbourg disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Strasbourg",
    "notaire Strasbourg immobilier",
    "notaire Strasbourg mariage",
    "notaire Strasbourg société",
    "trouver un notaire Strasbourg",
    "notaire en ligne Strasbourg",
    "rendez-vous notaire Strasbourg",
    "notaire Bas-Rhin",
  ],
  alternates: { canonical: "https://notaires.io/notaire-strasbourg" },
  openGraph: {
    title: "RDV notaire à Strasbourg · Notaires.io",
    description:
      "Trouvez un notaire à Strasbourg disponible rapidement, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-strasbourg",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Quels quartiers et communes de l'Eurométropole sont couverts par vos notaires à Strasbourg ?",
    a: "Les notaires interviennent dans tous les quartiers strasbourgeois : Neudorf, Cronenbourg, Hautepierre, Robertsau, Koenigshoffen, l'Orangerie, la Meinau, ainsi que dans les communes de l'Eurométropole : Schiltigheim, Illkirch-Graffenstaden, Ostwald, Lingolsheim et Hoenheim. La visioconférence permet également de servir les clients du Kochersberg ou du Ried.",
  },
  {
    q: "Quelles sont les particularités du droit local alsacien pour les actes notariés ?",
    a: "Strasbourg et l'Alsace sont régis par le droit local alsacien-mosellan, héritage du droit allemand. Concrètement, cela implique des spécificités en matière de registre foncier (Grundbuch), de bail rural, de droit des associations loi 1908 et de certaines règles successorales. Votre notaire à Strasbourg maîtrise ce droit local et vous guidera sur ses implications pratiques pour votre situation.",
  },
  {
    q: "Comment se déroule un achat immobilier chez un notaire à Strasbourg ?",
    a: "À Strasbourg, le marché immobilier tendu en centre-ville (Grande Île, Petite France, quartier européen) rend le recours rapide au notaire indispensable. Après la promesse synallagmatique, le délai de réitération en acte authentique est d'environ 3 mois. Le notaire vérifie le titre de propriété dans le registre foncier local (et non le fichier immobilier national), conformément au droit alsacien-mosellan.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Strasbourg ?",
    a: "Oui. La signature électronique à distance (AAED) est pleinement disponible à Strasbourg. Que vous soyez en déplacement à Bruxelles pour les institutions européennes ou simplement préférez éviter le déplacement, vous pouvez signer votre acte par visioconférence. Votre notaire vous précisera si l'acte envisagé est compatible avec ce dispositif au regard du droit local.",
  },
];

export default async function Page() {
  // Département, communes voisines et nombre réel de notaires (lib/grandes-villes.ts).
  const ville = grandeVille("Strasbourg", "strasbourg");
  const faq = [questionNombre(ville), ...FAQ];
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Strasbourg", 120);
  const notaires = avecInscrits(
    scrapedNotaires.length > 0 ? scrapedNotaires : LISTING_NOTAIRES.filter((n) => n.city === "Strasbourg"),
    await getInscritsVille("Strasbourg"),
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
          h1="Prendre RDV avec un notaire à Strasbourg"
          intro={introNombre(ville) + "Vous cherchez un notaire à Strasbourg pour votre mariage, votre PACS, un achat immobilier ou la création de votre société ? Les notaires strasbourgeois maîtrisent le droit local alsacien et sont disponibles selon leurs créneaux, en visio ou au cabinet."}
          notaires={notaires}
          faq={faq}
          relatedLinks={[
            // Département et communes voisines d'abord : le maillage qui manquait.
            ...liensGrandeVille(ville),
            { href: "/notaire-metz", label: "RDV notaire à Metz" },
            { href: "/notaire-nancy", label: "RDV notaire à Nancy" },
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
