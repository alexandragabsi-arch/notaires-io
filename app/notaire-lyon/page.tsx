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

const LYON_ARRONDISSEMENTS = Array.from({ length: 9 }, (_, i) => ({
  num: i + 1,
  label: i === 0 ? "1er" : `${i + 1}ème`,
  slug: i === 0 ? "1er" : `${i + 1}eme`,
}));

export const metadata: Metadata = {
  title: "RDV notaire à Lyon : prendre rendez-vous en ligne",
  description:
    "Trouvez un notaire à Lyon disponible rapidement. Mariage, PACS, immobilier, création de société — prise de rendez-vous en ligne. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Lyon",
    "notaire Lyon immobilier",
    "notaire Lyon mariage",
    "notaire Lyon société",
    "trouver un notaire Lyon",
    "notaire en ligne Lyon",
    "rendez-vous notaire Lyon",
    "notaire Rhône",
  ],
  alternates: { canonical: "https://notaires.io/notaire-lyon" },
  openGraph: {
    title: "RDV notaire à Lyon · Notaires.io",
    description:
      "Trouvez un notaire à Lyon disponible rapidement, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-lyon",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Quels sont les arrondissements lyonnais où exercent les notaires ?",
    a: "Les notaires à Lyon interviennent sur l'ensemble de la métropole lyonnaise : Lyon 1er au 9ème arrondissement, ainsi que Villeurbanne, Caluire-et-Cuire et les communes périphériques. Certains proposent également des rendez-vous en visioconférence, pratique si vous êtes à Bron, Vénissieux ou en Ain.",
  },
  {
    q: "Comment choisir son régime matrimonial chez un notaire à Lyon ?",
    a: "Le choix du régime matrimonial (communauté réduite aux acquêts, séparation de biens, participation aux acquêts) est une décision importante que votre notaire à Lyon vous guidera à prendre selon votre situation professionnelle et patrimoniale. La consultation prénuptiale est fortement conseillée. Sans contrat de mariage, vous serez automatiquement soumis au régime légal de la communauté réduite aux acquêts.",
  },
  {
    q: "Mon entreprise est basée à Lyon : le notaire est-il obligatoire pour la création de société ?",
    a: "Le notaire n'est pas obligatoire pour créer une SARL ou une SAS, mais il l'est pour certaines opérations spécifiques : apport d'un bien immobilier au capital social, constitution d'une SCI, ou rédaction de statuts avec des clauses complexes. Faire rédiger vos statuts par un notaire vous offre une sécurité juridique maximale et un acte authentique opposable aux tiers.",
  },
  {
    q: "Peut-on réaliser des actes notariés à distance depuis Lyon ?",
    a: "Oui. Depuis 2020, la France autorise la signature électronique à distance d'actes notariés par visioconférence (acte authentique électronique à distance, AAED). Concrètement, vous pouvez signer votre acte depuis votre domicile ou votre bureau à Lyon, face à votre notaire en ligne. Certains actes restent toutefois soumis à la présence physique des parties.",
  },
];

export default async function Page() {
  // Département, communes voisines et nombre réel de notaires (lib/grandes-villes.ts).
  const ville = grandeVille("Lyon", "lyon");
  const faq = [questionNombre(ville), ...FAQ];
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  // 60 fiches sur 406 : au-delà de 2 Mo de HTML, Google tronque ou renonce.
  // Les arrondissements, liés plus bas, portent le reste.
  const scrapedNotaires = getNotairesByCity("Lyon", 60);
  const notaires = avecInscrits(
    scrapedNotaires.length > 0 ? scrapedNotaires : LISTING_NOTAIRES.filter((n) => n.city === "Lyon"),
    await getInscritsVille("Lyon"),
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
          h1="Prendre RDV avec un notaire à Lyon"
          intro={introNombre(ville) + "Vous cherchez un notaire à Lyon pour votre mariage, votre PACS, un achat immobilier ou la création de votre société ? Les notaires lyonnais sont disponibles selon leurs créneaux, en visio ou au cabinet dans votre arrondissement."}
          notaires={notaires}
          faq={faq}
          relatedLinks={[
            // Département et communes voisines d'abord : le maillage qui manquait.
            ...liensGrandeVille(ville),
            ...LYON_ARRONDISSEMENTS.map(a => ({
              href: `/notaire-lyon/${a.slug}`,
              label: `Notaire Lyon ${a.label}`,
            })),
            { href: "/notaire-paris", label: "RDV notaire à Paris" },
            { href: "/notaire-marseille", label: "RDV notaire à Marseille" },
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-mariage-pacs", label: "Notaire mariage / PACS" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
