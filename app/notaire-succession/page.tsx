import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";

export const metadata: Metadata = {
  title: "Notaire succession — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire spécialisé en succession pour régler un héritage, organiser un partage ou rédiger un testament. Prise de rendez-vous en ligne, 1er rendez-vous offert. Accompagnement humain garanti.",
  keywords: [
    "notaire succession",
    "notaire héritage",
    "règlement succession notaire",
    "notaire testament",
    "déclaration succession",
    "partage succession",
    "notaire décès",
    "droits de succession",
    "héritiers réservataires",
  ],
  alternates: { canonical: "https://notaires.io/notaire-succession" },
  openGraph: {
    title: "Notaire succession — 1er RDV offert · Notaires.io",
    description:
      "Règlement de succession, testament, partage : nos notaires spécialisés vous accompagnent. 1er RDV offert.",
    url: "https://notaires.io/notaire-succession",
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
        { "@type": "ListItem", position: 2, name: "Notaire succession", item: "https://notaires.io/notaire-succession" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire succession",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      description:
        "Notaires spécialisés en droit des successions : héritage, testament, partage, déclaration fiscale, acte de notoriété.",
      url: "https://notaires.io/notaire-succession",
    },
  ],
};

const FAQ = [
  {
    q: "Dans quel délai dois-je contacter un notaire après un décès ?",
    a: "Il n'y a pas de délai légal pour contacter un notaire après un décès, mais vous avez 6 mois pour déposer la déclaration de succession auprès des services fiscaux (et 12 mois si le décès a eu lieu hors de France métropolitaine). Il est conseillé de prendre rendez-vous avec un notaire dans les premières semaines suivant le décès pour qu'il établisse l'acte de notoriété, qui permettra d'identifier les héritiers et de débloquer les comptes bancaires du défunt.",
  },
  {
    q: "Combien coûte le règlement d'une succession chez un notaire ?",
    a: "Les émoluments du notaire pour une succession sont réglementés par décret. Ils sont calculés sur la valeur des biens transmis selon un barème dégressif : 1,935 % jusqu'à 6 500 €, 1,064 % de 6 500 € à 17 000 €, 0,709 % de 17 000 € à 60 000 €, puis 0,532 % au-delà. À ces émoluments s'ajoutent les droits de succession (calculés sur la part reçue par chaque héritier, avec des abattements selon le lien de parenté) et les débours (frais de formalités). Pour une succession simple sans bien immobilier, le coût total peut rester modéré.",
  },
  {
    q: "Puis-je renoncer à une succession chargée de dettes ?",
    a: "Oui, tout héritier peut choisir entre trois options : accepter purement et simplement la succession (avec les dettes), l'accepter à concurrence de l'actif net (vous n'êtes responsable des dettes que jusqu'à hauteur de ce que vous recevez), ou y renoncer totalement. La renonciation doit être faite par déclaration au greffe du tribunal judiciaire dans un délai raisonnable (sauf procédure judiciaire, vous avez en principe 10 ans pour exercer votre option). Votre notaire vous conseillera sur la meilleure option selon la situation patrimoniale du défunt.",
  },
  {
    q: "Comment protéger son conjoint dans une succession ?",
    a: "Sans dispositions particulières, le conjoint survivant a des droits légaux limités (usufruit de la totalité ou quart en pleine propriété selon la présence d'enfants). Pour renforcer sa protection, plusieurs options existent : le testament légant au conjoint la quotité disponible, la donation au dernier vivant (aussi appelée donation entre époux), ou le choix d'un régime matrimonial favorable (communauté universelle avec clause d'attribution intégrale). Votre notaire vous guidera selon votre situation familiale et patrimoniale.",
  },
];

export default function Page() {
  const notaires = LISTING_NOTAIRES.filter((n) => n.specialties.includes("Succession"));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Notaire spécialisé en succession"
          intro="Le règlement d'une succession est une étape douloureuse qui exige rigueur juridique et accompagnement humain. Nos notaires spécialisés prennent en charge l'intégralité du dossier — acte de notoriété, déclaration fiscale, partage — pour que vous puissiez traverser cette période sereinement. 1er rendez-vous offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-donation", label: "Notaire donation" },
            { href: "/notaire-mariage-pacs", label: "Notaire mariage / PACS" },
            { href: "/notaire-paris", label: "Notaire succession à Paris" },
            { href: "/notaire-bordeaux", label: "Notaire succession à Bordeaux" },
            { href: "/notaire-nantes", label: "Notaire succession à Nantes" },
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-divorce", label: "Notaire divorce" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
