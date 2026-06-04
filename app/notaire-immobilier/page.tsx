import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesBySpecialty } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire immobilier — 1er RDV offert · Notaires.io",
  description:
    "Trouvez un notaire spécialisé en immobilier pour votre achat, vente, investissement locatif ou SCI. Prise de rendez-vous en ligne, 1er rendez-vous offert. Tarifs réglementés, acte authentique garanti.",
  keywords: [
    "notaire immobilier",
    "notaire achat immobilier",
    "notaire vente immobilier",
    "frais de notaire",
    "acte authentique",
    "notaire SCI",
    "notaire investissement locatif",
    "promesse de vente notaire",
    "compromis de vente",
  ],
  alternates: { canonical: "https://notaires.io/notaire-immobilier" },
  openGraph: {
    title: "Notaire immobilier — 1er RDV offert · Notaires.io",
    description:
      "Notaires spécialisés en immobilier : achat, vente, SCI, investissement. 1er RDV offert.",
    url: "https://notaires.io/notaire-immobilier",
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
        { "@type": "ListItem", position: 2, name: "Notaire immobilier", item: "https://notaires.io/notaire-immobilier" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire immobilier",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      description:
        "Notaires spécialisés en droit immobilier : achat, vente, financement, SCI, baux, copropriété.",
      url: "https://notaires.io/notaire-immobilier",
    },
  ],
};

const FAQ = [
  {
    q: "Quels sont les frais de notaire pour un achat immobilier ?",
    a: "Les frais de notaire (appelés également « droits de mutation ») comprennent trois composantes : les droits d'enregistrement et taxes collectés pour l'État et les collectivités locales (environ 5,8 % pour un bien ancien), les émoluments du notaire fixés par décret (environ 1 % du prix, dégressifs) et les débours (frais engagés pour les formalités : géomètre, publications, extraits de documents). Au total, comptez 7 % à 8 % du prix pour un logement ancien, et 2 % à 3 % pour un bien neuf (TVA incluse).",
  },
  {
    q: "Quelle est la différence entre un compromis de vente et une promesse de vente ?",
    a: "Le compromis de vente (aussi appelé synallagmatique) engage les deux parties : l'acheteur s'engage à acheter, le vendeur à vendre. En cas de désistement, des pénalités peuvent être réclamées. La promesse unilatérale de vente, en revanche, n'engage que le vendeur — l'acheteur dispose d'une option qu'il peut lever ou non. Les deux peuvent être signés sous seing privé ou chez un notaire. La signature chez un notaire offre une date certaine, une vérification approfondie et une sécurité juridique maximale.",
  },
  {
    q: "Pourquoi créer une SCI pour un investissement immobilier ?",
    a: "La Société Civile Immobilière (SCI) est une structure juridique permettant à plusieurs personnes de détenir et gérer ensemble un ou plusieurs biens immobiliers. Elle présente des avantages en matière de transmission (donation de parts sociales plutôt que de l'immeuble, avec des abattements renouvelables), de gestion (les décisions de gestion sont organisées par les statuts) et parfois de fiscalité (choix entre IR et IS). La création d'une SCI exige obligatoirement un acte notarié si elle implique un apport immobilier.",
  },
  {
    q: "Le notaire peut-il m'aider à négocier mon achat immobilier ?",
    a: "Le rôle premier du notaire est d'instrumenter l'acte et de conseiller sur le plan juridique, non de négocier le prix. Cette mission revient à l'agent immobilier ou au vendeur. En revanche, votre notaire peut jouer un rôle de conseil précieux : il vérifie l'état hypothécaire du bien, les servitudes, les règles d'urbanisme, l'état de la copropriété, et vous signale tout élément susceptible d'influencer la valeur ou l'utilité du bien. Un notaire expérimenté peut ainsi vous éviter des mauvaises surprises coûteuses après l'achat.",
  },
];

export default function Page() {
  const scraped = getNotairesBySpecialty("Droit immobilier", [], 60);
  const notaires = scraped.length > 0
    ? scraped
    : LISTING_NOTAIRES.filter((n) => n.specialties.includes("Droit immobilier"));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Notaire spécialisé en immobilier"
          intro="Achat, vente, SCI, investissement locatif : nos notaires spécialisés en droit immobilier vous accompagnent à chaque étape de votre transaction. Ils vérifient, sécurisent et authentifient votre acte pour que vous puissiez signer en toute sérénité. 1er rendez-vous offert."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-paris", label: "Notaire immobilier à Paris" },
            { href: "/notaire-lyon", label: "Notaire immobilier à Lyon" },
            { href: "/notaire-bordeaux", label: "Notaire immobilier à Bordeaux" },
            { href: "/notaire-marseille", label: "Notaire immobilier à Marseille" },
            { href: "/notaire-succession", label: "Notaire succession" },
            { href: "/notaire-creation-societe", label: "Notaire création de société" },
            { href: "/notaire-donation", label: "Notaire donation" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
