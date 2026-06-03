import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesByCity } from "@/lib/notaires-source";

const PARIS_ARRONDISSEMENTS = Array.from({ length: 20 }, (_, i) => ({
  num: i + 1,
  label: i === 0 ? "1er" : `${i + 1}ème`,
  slug: i === 0 ? "1er" : `${i + 1}eme`,
}));

export const metadata: Metadata = {
  title: "Notaire à Paris — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Paris disponible rapidement. Immobilier, succession, mariage, PACS, société — prise de rendez-vous en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Paris",
    "notaire Paris immobilier",
    "notaire Paris succession",
    "trouver un notaire Paris",
    "notaire en ligne Paris",
    "notaire 8ème arrondissement",
    "notaire 9ème arrondissement",
    "rendez-vous notaire Paris",
  ],
  alternates: { canonical: "https://notaires.io/notaire-paris" },
  openGraph: {
    title: "Notaire à Paris — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Paris disponible rapidement. 1er rendez-vous offert, en visio ou au cabinet.",
    url: "https://notaires.io/notaire-paris",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Paris", item: "https://notaires.io/notaire-paris" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Paris",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Paris", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Paris pour immobilier, succession, mariage, PACS, divorce et création de société.",
      url: "https://notaires.io/notaire-paris",
    },
  ],
};

const FAQ = [
  {
    q: "Combien coûte un notaire à Paris pour un achat immobilier ?",
    a: "Les honoraires du notaire pour un achat immobilier sont réglementés par l'État et représentent généralement entre 7 % et 8 % du prix du bien pour un logement ancien, ou 2 % à 3 % pour un bien neuf. À Paris, ces frais incluent les droits de mutation, la rémunération du notaire (émoluments) et les débours (frais d'actes et de formalités). Pour un bien à 500 000 €, comptez environ 35 000 à 40 000 € de frais de notaire.",
  },
  {
    q: "Quel est le délai moyen pour signer un acte chez un notaire à Paris ?",
    a: "Le délai entre la signature du compromis de vente et l'acte authentique est généralement de 2 à 3 mois à Paris. Ce délai permet au notaire d'effectuer toutes les vérifications nécessaires : purge des droits de préemption, levée des hypothèques, vérification des diagnostics, obtention des pièces d'état civil. Dans certains cas (succession complexe, financement sans prêt), le délai peut être ramené à 6 semaines.",
  },
  {
    q: "Peut-on choisir librement son notaire à Paris ?",
    a: "Oui, le choix du notaire est totalement libre en France. Lors d'une transaction immobilière, l'acheteur et le vendeur peuvent chaque avoir leur propre notaire — les honoraires sont alors partagés entre les deux études sans surcoût pour les parties. Il est conseillé de choisir un notaire situé dans l'arrondissement ou l'arrondissement adjacent pour faciliter les échanges et les visites au cabinet.",
  },
  {
    q: "Comment prendre rendez-vous avec un notaire à Paris via Notaires.io ?",
    a: "C'est simple : choisissez votre notaire dans notre annuaire, sélectionnez un créneau disponible et confirmez votre rendez-vous en ligne. Le 1er rendez-vous est offert, en visio ou au cabinet selon votre préférence. Vous recevrez une confirmation par email et pourrez préparer votre dossier grâce à notre checklist personnalisée.",
  },
];

export default function Page() {
  // Utilise les vrais notaires scrapés depuis notaires.fr, avec fallback sur les données fictives
  const scrapedNotaires = getNotairesByCity("Paris");
  const notaires = scrapedNotaires.length > 0
    ? scrapedNotaires
    : LISTING_NOTAIRES.filter((n) => n.city === "Paris");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Paris"
          intro="Besoin d'un notaire à Paris pour votre achat immobilier, votre succession ou votre mariage ? Nos notaires partenaires sont disponibles rapidement, en visio ou au cabinet. Le 1er rendez-vous est offert — comparez les profils et réservez en quelques clics."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            ...PARIS_ARRONDISSEMENTS.map(a => ({
              href: `/notaire-paris/${a.slug}`,
              label: `Notaire Paris ${a.label}`,
            })),
            { href: "/notaire-lyon", label: "Notaire à Lyon" },
            { href: "/notaire-marseille", label: "Notaire à Marseille" },
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-succession", label: "Notaire succession" },
            { href: "/notaire-mariage-pacs", label: "Notaire mariage / PACS" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
