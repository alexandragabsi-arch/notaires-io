import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesBySpecialty, getNotairesMixed } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire mariage et PACS · Notaires.io",
  description:
    "Trouvez un notaire pour votre contrat de mariage, votre PACS ou votre convention de PACS. Conseils sur le régime matrimonial, rédaction de l'acte, enregistrement. 1er rendez-vous offert.",
  keywords: [
    "notaire mariage",
    "notaire PACS",
    "contrat de mariage notaire",
    "convention PACS notaire",
    "régime matrimonial",
    "séparation de biens",
    "communauté universelle",
    "notaire avant mariage",
  ],
  alternates: { canonical: "https://notaires.io/notaire-mariage-pacs" },
  openGraph: {
    title: "Notaire mariage et PACS · Notaires.io",
    description:
      "Contrat de mariage, PACS, régime matrimonial : nos notaires vous conseillent.",
    url: "https://notaires.io/notaire-mariage-pacs",
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
        { "@type": "ListItem", position: 2, name: "Notaire mariage et PACS", item: "https://notaires.io/notaire-mariage-pacs" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire mariage et PACS",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      description:
        "Notaires spécialisés en droit de la famille : contrat de mariage, PACS, choix du régime matrimonial, modification de contrat.",
      url: "https://notaires.io/notaire-mariage-pacs",
    },
  ],
};

const FAQ = [
  {
    q: "Ai-je besoin d'un contrat de mariage si je n'ai pas de patrimoine ?",
    a: "La question du contrat de mariage ne se pose pas uniquement en termes de patrimoine existant, mais aussi de patrimoine futur. Sans contrat, vous serez soumis au régime légal de la communauté réduite aux acquêts : tout ce que vous acquérez pendant le mariage appartient à moitié à chacun. Si vous êtes entrepreneur, si vous avez des projets d'achat immobilier à financer seul, ou si vous anticipez une héritage important, un contrat de séparation de biens peut être préférable. Consultez un notaire avant de vous marier — c'est gratuit avec Notaires.io.",
  },
  {
    q: "Quelle est la différence entre le PACS chez un notaire et en mairie ?",
    a: "Le PACS peut être enregistré gratuitement en mairie (depuis 2017) ou chez un notaire. Le PACS notarié offre des avantages supplémentaires : le notaire rédigera une convention personnalisée (organisation des biens, contributions aux charges, régime de séparation ou d'indivision), vous conseillera sur ses implications patrimoniales et fiscales, et conservera l'acte dans ses archives. En cas de rupture ou de décès, les dispositions prévues seront claires. Comptez entre 200 € et 400 € pour un PACS chez un notaire.",
  },
  {
    q: "Peut-on changer de régime matrimonial après le mariage ?",
    a: "Oui, depuis 2007, les époux peuvent changer de régime matrimonial à tout moment, sans avoir à attendre 2 ans (condition supprimée par la réforme). Le changement doit être acté par un notaire et publié dans un journal d'annonces légales. Il peut être contesté par les enfants ou les créanciers dans un délai de 3 mois. Changer de régime est utile par exemple lorsqu'un conjoint crée une entreprise et souhaite protéger le patrimoine familial.",
  },
  {
    q: "Quels sont les effets du mariage sur mes biens immobiliers ?",
    a: "En régime légal (communauté réduite aux acquêts), les biens que vous possédiez avant le mariage restent vos biens propres, mais les biens achetés pendant le mariage (même avec vos seuls revenus) sont communs à moitié-moitié. En séparation de biens, chaque époux reste seul propriétaire de ce qu'il achète, même pendant le mariage. Le notaire vous expliquera ces mécanismes et leurs conséquences concrètes, notamment en cas de divorce ou de décès.",
  },
];

export default function Page() {
  const scraped = getNotairesBySpecialty("Mariage / PACS", ["Droit de la famille"], 60);
  // Si peu de résultats spécialisés, affiche un panel multi-villes (tous notaires pratiquent le PACS/mariage)
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
          h1="Notaire pour votre mariage ou PACS"
          intro="Mariage ou PACS : une étape qui mérite une réflexion sérieuse sur votre avenir commun. Nos notaires spécialisés en droit de la famille vous conseillent sur le régime matrimonial ou la convention de PACS la plus adaptée à votre situation, et rédigent l'acte en toute sécurité. 1er rendez-vous offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-divorce", label: "Notaire divorce" },
            { href: "/notaire-succession", label: "Notaire succession" },
            { href: "/notaire-donation", label: "Notaire donation" },
            { href: "/notaire-paris", label: "Notaire mariage à Paris" },
            { href: "/notaire-lyon", label: "Notaire mariage à Lyon" },
            { href: "/notaire-nantes", label: "Notaire mariage à Nantes" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
