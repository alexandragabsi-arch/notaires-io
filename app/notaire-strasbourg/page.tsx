import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Strasbourg — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Strasbourg disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
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
    title: "Notaire à Strasbourg — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Strasbourg disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-strasbourg",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Strasbourg", item: "https://notaires.io/notaire-strasbourg" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Strasbourg",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Strasbourg", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Strasbourg pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-strasbourg",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de l'Eurométropole sont couverts par vos notaires à Strasbourg ?",
    a: "Nos notaires partenaires interviennent dans tous les quartiers strasbourgeois : Neudorf, Cronenbourg, Hautepierre, Robertsau, Koenigshoffen, l'Orangerie, la Meinau, ainsi que dans les communes de l'Eurométropole : Schiltigheim, Illkirch-Graffenstaden, Ostwald, Lingolsheim et Hoenheim. La visioconférence permet également de servir les clients du Kochersberg ou du Ried.",
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

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Strasbourg");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Strasbourg");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Strasbourg"
          intro="Vous cherchez un notaire à Strasbourg pour votre mariage, votre PACS, un achat immobilier ou la création de votre société ? Nos notaires partenaires strasbourgeois maîtrisent le droit local alsacien et sont disponibles sous 48 h, en visio ou au cabinet. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-metz", label: "Notaire à Metz" },
            { href: "/notaire-nancy", label: "Notaire à Nancy" },
            { href: "/notaire-reims", label: "Notaire à Reims" },
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
