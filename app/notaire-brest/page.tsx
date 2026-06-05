import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Brest · Notaires.io",
  description:
    "Trouvez un notaire à Brest disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
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
    title: "Notaire à Brest · Notaires.io",
    description:
      "Trouvez un notaire à Brest disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-brest",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://notaires.io" },
        { "@type": "ListItem", position: 2, name: "Notaire à Brest", item: "https://notaires.io/notaire-brest" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Brest",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Brest", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Brest pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-brest",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de Brest Métropole couvrent vos notaires ?",
    a: "Nos notaires partenaires à Brest interviennent dans tous les quartiers : Saint-Marc, Lambézellec, Bellevue, Pontanézen, Saint-Pierre, Recouvrance, ainsi que dans les communes de la métropole : Guipavas, Le Relecq-Kerhuon, Plougastel-Daoulas, Plouzané, Guilers et Bohars. La visioconférence est disponible pour les clients du Pays de Brest ou du Léon.",
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
    a: "Oui. La signature électronique à distance (AAED) est disponible à Brest. C'est particulièrement utile pour les marins en navigation, les militaires en mission ou les Bretons expatriés souhaitant investir dans leur région. Votre notaire partenaire vous précisera quels actes sont éligibles et organisera la session de signature par visioconférence sécurisée.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Brest");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Brest");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Brest"
          intro="Vous cherchez un notaire à Brest pour votre mariage, votre PACS, un achat immobilier en Finistère ou la création de votre société ? Nos notaires partenaires brestois sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-rennes", label: "Notaire à Rennes" },
            { href: "/notaire-nantes", label: "Notaire à Nantes" },
            { href: "/notaire-le-havre", label: "Notaire au Havre" },
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
