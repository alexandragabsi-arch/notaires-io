import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesBySpecialty, getNotairesMixed } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Contrat de mariage — Notaire en ligne · Notaires.io",
  description:
    "Besoin d'un notaire pour votre contrat de mariage ? Séparation de biens, communauté réduite aux acquêts, régime de participation — nos notaires vous conseillent et rédigent votre contrat. Prise de RDV en ligne en visio ou au cabinet.",
  keywords: [
    "contrat de mariage notaire",
    "contrat de mariage séparation de biens",
    "notaire contrat de mariage",
    "régime matrimonial notaire",
    "contrat mariage avant mariage",
    "coût contrat de mariage",
    "communauté réduite aux acquêts",
    "contrat de mariage prix",
  ],
  alternates: { canonical: "https://notaires.io/notaire-contrat-mariage" },
  openGraph: {
    title: "Contrat de mariage — Notaire en ligne · Notaires.io",
    description:
      "Séparation de biens ou communauté ? Nos notaires vous conseillent sur votre régime matrimonial.",
    url: "https://notaires.io/notaire-contrat-mariage",
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
        { "@type": "ListItem", position: 2, name: "Contrat de mariage", item: "https://notaires.io/notaire-contrat-mariage" },
      ],
    },
    {
      "@type": "Service",
      name: "Contrat de mariage — Notaire",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      description:
        "Rédaction et conseil sur les contrats de mariage : séparation de biens, communauté réduite aux acquêts, régime de participation aux acquêts. Notaires partenaires disponibles en visio ou au cabinet.",
      url: "https://notaires.io/notaire-contrat-mariage",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: "Premier rendez-vous de conseil offert — 30 minutes",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Est-il obligatoire de faire un contrat de mariage ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non, le contrat de mariage n'est pas obligatoire. Sans contrat, les époux sont automatiquement soumis au régime légal de la communauté réduite aux acquêts. Un contrat est recommandé si l'un des époux est entrepreneur, propriétaire de biens avant le mariage, ou si vous souhaitez protéger vos héritiers respectifs.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte un contrat de mariage chez un notaire ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le tarif d'un contrat de mariage est réglementé. Les émoluments du notaire sont de 371,48 € pour la rédaction. Auxquels s'ajoutent la TVA (20 %) et les débours (environ 50 à 100 €). Le coût total est généralement compris entre 500 et 600 € — un investissement modeste au regard de la protection qu'il apporte.",
          },
        },
      ],
    },
  ],
};

const FAQ = [
  {
    q: "Est-il obligatoire de faire un contrat de mariage ?",
    a: "Non, le contrat de mariage n'est pas obligatoire. Sans contrat, les époux sont automatiquement soumis au régime légal : la communauté réduite aux acquêts. Ce régime est adapté à de nombreuses situations, mais un contrat est fortement conseillé si l'un des époux est entrepreneur, s'il possède des biens immobiliers avant le mariage, ou si vous souhaitez protéger vos héritiers respectifs en cas de décès.",
  },
  {
    q: "Quels sont les différents types de contrats de mariage ?",
    a: "Il existe trois régimes principaux : (1) La séparation de biens — chaque époux conserve la propriété exclusive de ses biens, passés et futurs. Idéal pour les entrepreneurs. (2) La communauté universelle — tous les biens des époux, présents et futurs, sont mis en commun. (3) Le régime de participation aux acquêts — hybride entre séparation et communauté, chaque époux gère ses biens librement pendant le mariage, mais à la dissolution, les enrichissements sont partagés. Le notaire vous conseille selon votre situation patrimoniale et professionnelle.",
  },
  {
    q: "Combien coûte un contrat de mariage chez un notaire ?",
    a: "Les honoraires sont réglementés par l'État. Les émoluments du notaire pour la rédaction d'un contrat de mariage sont de 371,48 € HT (soit 445,78 € TTC). Auxquels s'ajoutent les débours (frais d'actes et de publication) pour environ 50 à 100 €. Le coût total est généralement compris entre 500 et 620 €. C'est un investissement modeste au regard de la protection patrimoniale et juridique qu'il vous apporte.",
  },
  {
    q: "Jusqu'à quand peut-on signer un contrat de mariage ?",
    a: "Le contrat de mariage doit obligatoirement être signé chez le notaire avant la célébration du mariage. Le notaire remet ensuite un certificat qui doit être présenté à l'officier d'état civil. Après le mariage, il est toujours possible de changer de régime matrimonial, mais la procédure est plus complexe : elle nécessite l'homologation d'un juge si le couple a des enfants mineurs, et un délai minimum de 2 ans de mariage.",
  },
  {
    q: "Faut-il se déplacer chez le notaire pour signer un contrat de mariage ?",
    a: "La signature du contrat de mariage nécessite la présence physique des deux futurs époux chez le notaire, car il s'agit d'un acte authentique. Cependant, le premier rendez-vous de conseil — où vous discutez du régime le mieux adapté à votre situation — peut se tenir en visioconférence. Nos notaires partenaires proposent un premier rendez-vous offert en visio pour vous orienter avant la signature en cabinet.",
  },
];

export default function Page() {
  // Utilise les données réelles (notaires-membres.json) en priorité
  const scraped = getNotairesBySpecialty("Mariage / PACS", ["Droit de la famille"], 60);
  // Si peu de résultats spécialisés, affiche un panel multi-villes (tous notaires pratiquent les contrats de mariage)
  const notaires = scraped.length >= 6
    ? scraped
    : getNotairesMixed(60);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Contrat de mariage — Conseil et rédaction par un notaire"
          intro="Séparation de biens, communauté universelle ou régime de participation ? Choisir son régime matrimonial est une décision importante. Nos notaires partenaires vous accompagnent lors d'un 1er rendez-vous offert pour analyser votre situation et rédiger le contrat adapté — en visio ou au cabinet, avant votre mariage."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-mariage-pacs", label: "Mariage et PACS" },
            { href: "/notaire-divorce", label: "Notaire divorce" },
            { href: "/notaire-donation", label: "Donation entre époux" },
            { href: "/notaire-succession", label: "Notaire succession" },
            { href: "/notaire-paris", label: "Notaire à Paris" },
            { href: "/notaire-lyon", label: "Notaire à Lyon" },
            { href: "/notaire-marseille", label: "Notaire à Marseille" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
