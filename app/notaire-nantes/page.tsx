import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";

export const metadata: Metadata = {
  title: "Notaire à Nantes — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire à Nantes pour votre succession, donation ou mariage. Prise de rendez-vous en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.",
  keywords: [
    "notaire Nantes",
    "notaire Nantes succession",
    "notaire Nantes donation",
    "notaire Nantes famille",
    "trouver un notaire Nantes",
    "notaire en ligne Nantes",
    "rendez-vous notaire Nantes",
    "notaire Loire-Atlantique",
  ],
  alternates: { canonical: "https://notaires.io/notaire-nantes" },
  openGraph: {
    title: "Notaire à Nantes — 1er RDV offert · Notaires.io",
    description:
      "Trouvez un notaire à Nantes pour votre succession, donation ou mariage. 1er RDV offert.",
    url: "https://notaires.io/notaire-nantes",
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
        { "@type": "ListItem", position: 2, name: "Notaire à Nantes", item: "https://notaires.io/notaire-nantes" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire à Nantes",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "City", name: "Nantes", addressCountry: "FR" },
      description:
        "Mise en relation avec des notaires partenaires à Nantes pour succession, donation, mariage et famille.",
      url: "https://notaires.io/notaire-nantes",
    },
  ],
};

const FAQ = [
  {
    q: "Comment fonctionne une donation entre vifs chez un notaire à Nantes ?",
    a: "La donation entre vifs est un acte par lequel une personne (le donateur) transfère de son vivant la propriété d'un bien à une autre (le donataire). À Nantes, comme partout en France, la donation d'un bien immobilier ou d'une somme d'argent importante doit être constatée par acte authentique chez un notaire. Elle peut être assortie de conditions (réserve d'usufruit, charge au profit d'un tiers). Les abattements fiscaux sont de 100 000 € par enfant tous les 15 ans.",
  },
  {
    q: "Que se passe-t-il si je décède sans testament à Nantes ?",
    a: "En l'absence de testament, la succession est régie par les règles légales du Code civil. La loi organise une hiérarchie d'héritiers : les descendants (enfants, petits-enfants) primant les ascendants et les collatéraux. Si vous êtes pacsé sans testament, votre partenaire n'hérite de rien — seul un testament ou un legs entre partenaires peut protéger le survivant. Consultez dès maintenant un notaire à Nantes pour rédiger votre testament et sécuriser vos proches.",
  },
  {
    q: "La donation-partage est-elle intéressante pour une famille nombreuse à Nantes ?",
    a: "Oui, la donation-partage est particulièrement adaptée aux familles avec plusieurs enfants. Elle permet de partager équitablement le patrimoine entre tous les héritiers de son vivant, de figer les valeurs au jour de la donation (évitant les réévaluations futures) et de prévenir les conflits successoraux. Votre notaire à Nantes en rédigera l'acte et veillera à ce que l'équilibre entre les enfants soit respecté selon vos volontés.",
  },
  {
    q: "Peut-on inclure une maison de vacances en Loire-Atlantique dans une donation ?",
    a: "Tout à fait. La donation d'un bien immobilier situé en Loire-Atlantique (résidence secondaire, maison de famille) est possible et suit les mêmes règles qu'une donation ordinaire. Votre notaire à Nantes est compétent pour instrumenter l'acte, quel que soit le lieu du bien en France. Il procédera aux vérifications d'urbanisme, de servitudes et d'hypothèques avant la signature.",
  },
];

export default function Page() {
  const notaires = LISTING_NOTAIRES.filter((n) => n.city === "Nantes");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Trouver un notaire à Nantes"
          intro="Vous souhaitez organiser votre succession, faire une donation à vos enfants ou préparer votre mariage à Nantes ? Nos notaires partenaires en Loire-Atlantique vous accompagnent avec pédagogie à chaque étape. 1er rendez-vous offert, en visio ou au cabinet."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-paris", label: "Notaire à Paris" },
            { href: "/notaire-bordeaux", label: "Notaire à Bordeaux" },
            { href: "/notaire-lille", label: "Notaire à Lille" },
            { href: "/notaire-lyon", label: "Notaire à Lyon" },
            { href: "/notaire-succession", label: "Notaire succession" },
            { href: "/notaire-donation", label: "Notaire donation" },
            { href: "/notaire-mariage-pacs", label: "Notaire mariage / PACS" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
