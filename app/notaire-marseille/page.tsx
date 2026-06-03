import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

const MARSEILLE_ARRONDISSEMENTS = Array.from({ length: 16 }, (_, i) => ({
  num: i + 1,
  label: i === 0 ? "1er" : `${i + 1}ème`,
  slug: i === 0 ? "1er" : `${i + 1}eme`,
}));

export const metadata: Metadata = {
  title: "Notaire à Marseille — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Marseille pour votre achat immobilier, donation ou succession. Prise de rendez-vous en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Marseille",
    "notaire Marseille immobilier",
    "notaire Marseille donation",
    "notaire Marseille succession",
    "trouver un notaire Marseille",
    "notaire en ligne Marseille",
    "rendez-vous notaire Marseille",
    "notaire Bouches-du-Rhône",
  ],
  alternates: { canonical: "https://notaires.io/notaire-marseille" },
  openGraph: {
    title: "Notaire à Marseille — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Marseille pour votre achat immobilier ou donation. 1er RDV offert.",
    url: "https://notaires.io/notaire-marseille",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Marseille", item: "https://notaires.io/notaire-marseille" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Marseille",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Marseille", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Marseille pour immobilier, donation et succession.",
      url: "https://notaires.io/notaire-marseille",
    },
  ],
};

const FAQ = [
  {
    q: "Quelles spécificités pour un achat immobilier en bord de mer à Marseille ?",
    a: "Acheter un bien immobilier sur le littoral marseillais (Vallon des Auffes, Malmousque, les Goudes) implique de vérifier plusieurs contraintes spécifiques : loi Littoral, servitude de passage des piétons le long du rivage, zonages PLU souvent restrictifs, et risques naturels (submersion marine, feux de forêt). Votre notaire à Marseille est formé à ces particularités et procède à toutes les vérifications d'urbanisme avant la signature de l'acte authentique.",
  },
  {
    q: "Comment faire une donation à ses enfants à Marseille ?",
    a: "La donation entre vifs permet de transmettre tout ou partie de son patrimoine de son vivant, en bénéficiant d'abattements fiscaux renouvelables tous les 15 ans (100 000 € par enfant et par parent). À Marseille comme partout en France, la donation d'un bien immobilier ou de sommes importantes nécessite obligatoirement un acte notarié. Votre notaire vous conseillera sur les options disponibles : donation simple, donation-partage, donation avec réserve d'usufruit.",
  },
  {
    q: "Mon bien marseillais est en indivision : que faire ?",
    a: "L'indivision survient fréquemment lors d'une succession non encore partagée, ou lorsque plusieurs personnes achètent ensemble sans créer de société. En cas de blocage entre indivisaires, le notaire peut proposer un partage amiable, et en dernier recours, un partage judiciaire peut être demandé au tribunal. Il est conseillé de consulter un notaire dès que des tensions apparaissent pour trouver une solution amiable moins coûteuse.",
  },
  {
    q: "Peut-on organiser une donation-partage à Marseille entre enfants de plusieurs unions ?",
    a: "Oui, la donation-partage transgénérationnelle est possible depuis 2006. Elle permet d'organiser la transmission entre les descendants de plusieurs degrés (enfants et petits-enfants) ou entre enfants de différentes unions (famille recomposée). C'est un acte notarié complexe mais très sécurisant, qui gèle les valeurs au jour de la donation et évite les conflits au moment de la succession. Nos notaires partenaires à Marseille sont spécialisés dans ce type de montage.",
  },
];

export default function Page() {
  // Vrais notaires de notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Marseille");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Marseille");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Marseille"
          intro="Achat immobilier sur le littoral méditerranéen, donation à vos proches, succession : nos notaires partenaires à Marseille maîtrisent les spécificités juridiques de la région PACA. Disponibles rapidement, en visio ou au cabinet. 1er rendez-vous offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            ...MARSEILLE_ARRONDISSEMENTS.map(a => ({
              href: `/notaire-marseille/${a.slug}`,
              label: `Notaire Marseille ${a.label}`,
            })),
            { href: "/notaire-paris", label: "Notaire à Paris" },
            { href: "/notaire-lyon", label: "Notaire à Lyon" },
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-succession", label: "Notaire succession" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
