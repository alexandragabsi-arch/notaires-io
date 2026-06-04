import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesBySpecialty, getNotairesMixed } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire donation — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire spécialisé en donation pour transmettre votre patrimoine à vos enfants ou proches. Donation simple, donation-partage, usufruit, abattements fiscaux. 1er rendez-vous offert.",
  keywords: [
    "notaire donation",
    "donation enfants notaire",
    "donation-partage notaire",
    "abattement donation",
    "donation immobilier",
    "usufruit nue-propriété",
    "donation entre vifs",
    "optimisation fiscale donation",
    "notaire transmission patrimoine",
  ],
  alternates: { canonical: "https://notaires.io/notaire-donation" },
  openGraph: {
    title: "Notaire donation — 1er RDV offert · Notaires.io",
    description:
      "Donation simple, donation-partage, usufruit : nos notaires optimisent votre transmission. 1er RDV offert.",
    url: "https://notaires.io/notaire-donation",
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
        { "@type": "ListItem", position: 2, name: "Notaire donation", item: "https://notaires.io/notaire-donation" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire donation",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      description:
        "Notaires spécialisés en transmission patrimoniale : donation simple, donation-partage, démembrement de propriété, abattements fiscaux.",
      url: "https://notaires.io/notaire-donation",
    },
  ],
};

const FAQ = [
  {
    q: "Quels sont les abattements fiscaux pour une donation à ses enfants ?",
    a: "Chaque parent peut donner à chacun de ses enfants jusqu'à 100 000 € en franchise totale de droits de donation, tous les 15 ans. S'y ajoutent des abattements spécifiques pour les dons de sommes d'argent (31 865 € par enfant, tous les 15 ans, si le donateur a moins de 80 ans et le bénéficiaire plus de 18 ans). Pour les petits-enfants, l'abattement est de 31 865 €, et pour les arrière-petits-enfants, 5 310 €. Votre notaire calculera le montant de l'abattement applicable à votre situation.",
  },
  {
    q: "Qu'est-ce que la donation avec réserve d'usufruit ?",
    a: "La donation en nue-propriété avec réserve d'usufruit est une technique de transmission très utilisée. Le donateur (parent) cède la nue-propriété du bien à ses enfants tout en conservant l'usufruit — c'est-à-dire le droit d'utiliser le bien et d'en percevoir les revenus (loyers) jusqu'à son décès. À son décès, les enfants récupèrent la pleine propriété sans droits de succession supplémentaires. Les droits de donation sont calculés sur la valeur de la nue-propriété uniquement (moins élevée), ce qui réduit la fiscalité.",
  },
  {
    q: "Quelle est la différence entre une donation simple et une donation-partage ?",
    a: "La donation simple transmet un bien à un seul bénéficiaire ou à plusieurs sans organiser le partage. La donation-partage, en revanche, organise la répartition du patrimoine entre tous les descendants (ou entre plusieurs personnes) en une seule fois. Son grand avantage : les biens sont évalués au jour de la donation et non au jour du décès — ce qui évite les réévaluations défavorables et les conflits entre héritiers. La donation-partage est irrévocable et implique l'accord de tous les bénéficiaires.",
  },
  {
    q: "Peut-on donner son logement principal à ses enfants tout en continuant à y vivre ?",
    a: "Oui, c'est précisément l'objet de la donation avec réserve d'usufruit. Le parent transmet la nue-propriété de sa résidence principale à ses enfants, mais conserve le droit d'y habiter sa vie durant (usufruit viager). Les enfants n'ont aucun droit d'entrée dans le logement tant que le parent est vivant et souhaite y résider. Au décès, ils deviennent automatiquement pleinement propriétaires. Cette opération est formalisée par acte notarié obligatoire.",
  },
];

export default function Page() {
  const scraped = getNotairesBySpecialty("Donations", [], 60);
  // Si peu de résultats spécialisés, affiche un panel multi-villes (tous notaires pratiquent les donations)
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
          h1="Notaire spécialisé en donation"
          intro="Transmettre votre patrimoine de votre vivant est l'un des actes les plus importants de votre vie. Nos notaires spécialisés vous accompagnent pour choisir la bonne stratégie — donation simple, donation-partage, usufruit — et optimiser la fiscalité dans le cadre légal. 1er rendez-vous offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-succession", label: "Notaire succession" },
            { href: "/notaire-mariage-pacs", label: "Notaire mariage / PACS" },
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-marseille", label: "Notaire donation à Marseille" },
            { href: "/notaire-nantes", label: "Notaire donation à Nantes" },
            { href: "/notaire-paris", label: "Notaire donation à Paris" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
