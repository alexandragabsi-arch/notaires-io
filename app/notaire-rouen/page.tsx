import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire à Rouen — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Rouen disponible rapidement. Mariage, PACS, immobilier, création de société — prise de RDV en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Rouen",
    "notaire Rouen immobilier",
    "notaire Rouen mariage",
    "notaire Rouen société",
    "trouver un notaire Rouen",
    "notaire en ligne Rouen",
    "rendez-vous notaire Rouen",
    "notaire Seine-Maritime",
  ],
  alternates: { canonical: "https://notaires.io/notaire-rouen" },
  openGraph: {
    title: "Notaire à Rouen — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Rouen disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-rouen",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Rouen", item: "https://notaires.io/notaire-rouen" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Rouen",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Rouen", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Rouen pour mariage, PACS, immobilier, création de société et succession.",
      url: "https://notaires.io/notaire-rouen",
    },
  ],
};

const FAQ = [
  {
    q: "Quels quartiers et communes de la Métropole Rouen Normandie couvrent vos notaires ?",
    a: "Nos notaires partenaires à Rouen couvrent tous les quartiers : Vieux-Rouen (rive droite), Rive Gauche, Saint-Sever, La Chapelle-du-Mont-de-France, Mont-Saint-Aignan, Bois-Guillaume, ainsi que les communes de la métropole : Sotteville-lès-Rouen, Saint-Étienne-du-Rouvray, Déville-lès-Rouen, Bihorel et Maromme. La visioconférence est disponible pour les clients du Pays de Bray ou du Pays de Caux.",
  },
  {
    q: "Quels actes notariés sont fréquents pour l'immobilier à Rouen ?",
    a: "Rouen attire de nombreux acquéreurs en provenance de Paris (1h15 en train) cherchant une meilleure qualité de vie. Les notaires traitent des ventes de colombages médiévaux dans le Vieux-Rouen (secteur sauvegardé), d'appartements en rive gauche et de maisons bourgeoises à Mont-Saint-Aignan. Les donations intergénérationnelles sont fréquentes dans les familles normandes installées de longue date.",
  },
  {
    q: "Y a-t-il des spécificités pour l'immobilier ancien et le patrimoine à Rouen ?",
    a: "Rouen possède l'un des plus beaux ensembles de maisons à colombages de France (quartier des Antiquaires, rue du Gros-Horloge). L'acquisition d'un bien dans le secteur sauvegardé implique des contraintes architecturales strictes (ABF), des autorisations de travaux spécifiques et potentiellement des avantages fiscaux loi Malraux. Votre notaire à Rouen vous guidera sur ces réglementations propres au patrimoine normand.",
  },
  {
    q: "Peut-on signer un acte notarié à distance depuis Rouen ?",
    a: "Oui. La signature électronique à distance (AAED) est disponible à Rouen. Particulièrement appréciée des cadres navettant régulièrement sur Paris, vous pouvez signer votre acte par visioconférence depuis votre domicile à Rouen ou depuis votre bureau à Paris. Votre notaire partenaire vous précisera les actes compatibles avec ce dispositif.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Rouen");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Rouen");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Rouen"
          intro="Vous cherchez un notaire à Rouen pour votre mariage, votre PACS, un achat immobilier en Normandie ou la création de votre société ? Nos notaires partenaires rouennais sont disponibles sous 48 h, en visio ou au cabinet dans votre quartier. Le 1er rendez-vous est toujours offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-le-havre", label: "Notaire au Havre" },
            { href: "/notaire-paris", label: "Notaire à Paris" },
            { href: "/notaire-caen", label: "Notaire à Caen" },
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
