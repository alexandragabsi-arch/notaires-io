import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getNotairesBySpecialty } from "@/lib/notaires-source";

export const metadata: Metadata = {
  title: "Notaire création de société · Notaires.io",
  description:
    "Trouvez un notaire spécialisé en droit des sociétés pour créer votre SCI, SAS, SARL ou holding. Statuts sécurisés, apports immobiliers, pactes d'associés.",
  keywords: [
    "notaire création société",
    "notaire SCI",
    "notaire SAS",
    "notaire SARL",
    "notaire holding",
    "apport immobilier société",
    "notaire droit des affaires",
    "statuts société notaire",
    "pacte associés notaire",
    "notaire entreprise",
  ],
  alternates: { canonical: "https://notaires.io/notaire-creation-societe" },
  openGraph: {
    title: "Notaire création de société · Notaires.io",
    description:
      "Créez votre SCI, SAS ou holding avec un notaire spécialisé. Statuts sécurisés, apports immobiliers.",
    url: "https://notaires.io/notaire-creation-societe",
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
        { "@type": "ListItem", position: 2, name: "Notaire création de société", item: "https://notaires.io/notaire-creation-societe" },
      ],
    },
    {
      "@type": "Service",
      name: "Notaire création de société",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      description:
        "Notaires spécialisés en droit des sociétés : création de SCI, SAS, SARL, holding, apport immobilier, cession de parts.",
      url: "https://notaires.io/notaire-creation-societe",
    },
  ],
};

const FAQ = [
  {
    q: "Pourquoi passer par un notaire pour créer une SCI ?",
    a: "La SCI (Société Civile Immobilière) peut théoriquement être créée sans notaire si elle n'implique pas d'apport immobilier. En revanche, dès qu'un bien immeuble est apporté au capital, l'acte notarié est obligatoire. Même sans obligation légale, faire rédiger vos statuts de SCI par un notaire présente de nombreux avantages : il anticipe les situations de blocage entre associés, prévoit les clauses de sortie, et conseille sur les options fiscales (IR ou IS). C'est un investissement faible pour éviter de lourds conflits futurs.",
  },
  {
    q: "Quel est le coût d'un notaire pour la création d'une société ?",
    a: "Pour une SCI sans apport immobilier, les honoraires libres du notaire varient généralement entre 800 € et 1 500 €. Pour une SCI avec apport immobilier, des émoluments réglementés s'appliquent sur la valeur de l'apport (environ 1 % à 2 %). Pour une SAS ou une SARL avec statuts complexes (pacte d'associés, clauses de préemption, de liquidité), comptez entre 1 500 € et 3 000 €. Ces coûts sont à mettre en regard de la sécurité juridique apportée.",
  },
  {
    q: "Mon associé et moi avons des désaccords : le notaire peut-il aider ?",
    a: "Oui, lors de la rédaction des statuts, le notaire vous aide à anticiper les situations conflictuelles : droits de vote, majorité requise pour les décisions importantes, clauses de rachat forcé, procédure en cas de mésentente. Il peut aussi rédiger un pacte d'associés distinct des statuts, confidentiel et plus souple à modifier. En cas de conflit existant, il peut jouer un rôle de conseil neutre, même si la médiation ou la voie judiciaire sera parfois nécessaire.",
  },
  {
    q: "Comment transmettre une société familiale à ses enfants via le notaire ?",
    a: "La transmission d'une entreprise familiale peut s'opérer par donation des parts sociales (avec abattement de 100 000 € par enfant tous les 15 ans et possibilité d'exonération partielle sous le régime Dutreil), par cession à prix préférentiel, ou par voie testamentaire. Le notaire coordonne ces opérations avec le pacte Dutreil (engagement de conservation des titres sur 6 ans) et s'assure que la transmission respecte la réserve héréditaire des autres enfants. Une anticipation de 5 à 10 ans est idéale.",
  },
];

export default function Page() {
  const scraped = getNotairesBySpecialty("Droit des sociétés", [], 60);
  const notaires = scraped.length > 0
    ? scraped
    : LISTING_NOTAIRES.filter((n) => n.specialties.includes("Droit des sociétés"));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1="Notaire pour la création de votre société"
          intro="SCI pour votre patrimoine immobilier, SAS pour votre start-up, holding pour votre groupe familial : nos notaires spécialisés en droit des sociétés rédigent vos statuts, sécurisent vos apports et anticipent les situations de blocage."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-donation", label: "Notaire donation" },
            { href: "/notaire-succession", label: "Notaire succession" },
            { href: "/notaire-paris", label: "Notaire société à Paris" },
            { href: "/notaire-lyon", label: "Notaire société à Lyon" },
            { href: "/notaire-lille", label: "Notaire société à Lille" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
