import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import ParcoursFlow from "@/components/ParcoursFlow";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  // « rdv notaire » en tête : c'est la requête sur laquelle Google associe déjà
  // l'accueil (172 des 233 impressions « rdv » sur 3 mois), loin devant les
  // articles de blog. L'accueil est LA page qui porte cette intention.
  title: "RDV notaire en ligne : prendre rendez-vous avec un notaire",
  // 173 caractères auparavant : Google tronquait la phrase en plein milieu.
  // « gratuitement » retiré aussi — placé là, il se lisait comme un
  // rendez-vous offert, la promesse que nous ne faisons pas.
  description:
    "Prenez rendez-vous avec un notaire en ligne : immobilier, succession, mariage, donation. Créneaux réels, en visio ou au cabinet, confirmation immédiate.",
  keywords: [
    "rdv notaire",
    "rdv notaire en ligne",
    "prendre rdv notaire",
    "prendre rendez-vous notaire",
    "notaire en ligne",
    "notaire immobilier",
    "notaire succession",
    "notaire mariage pacs",
    "notaire visio",
    "rendez-vous notaire gratuit",
  ],
  alternates: { canonical: "https://notaires.io" },
  openGraph: {
    title: "RDV notaire en ligne · Notaires.io",
    description:
      "Prenez RDV avec un notaire en ligne, gratuitement, en visio ou au cabinet.",
    url: "https://notaires.io",
    type: "website",
  },
};

const faqParticuliers = [
  {
    q: "Comment prendre RDV avec un notaire en ligne ?",
    a: "Indiquez votre ville ou le nom du notaire, choisissez le motif (achat immobilier, succession, donation, mariage, société…), puis un créneau libre dans son agenda, en visio ou au cabinet. La confirmation arrive aussitôt par e-mail : pas d'appel au standard, pas de rappel à attendre.",
  },
  {
    q: "Combien coûte un rendez-vous chez le notaire ?",
    a: "La prise de RDV sur Notaires.io est gratuite. Chez le notaire, les actes (vente, donation, contrat de mariage…) suivent un tarif réglementé fixé par l'État. Une consultation juridique détachée de tout acte peut en revanche donner lieu à des honoraires libres, convenus à l'avance avec le notaire par écrit.",
  },
  {
    q: "Quel délai pour obtenir un RDV chez un notaire ?",
    a: "Tout dépend de l'étude et de la période. En ligne, vous voyez directement les prochains créneaux libres de chaque notaire et pouvez comparer : un premier rendez-vous en visio se trouve souvent plus vite qu'au cabinet.",
  },
  {
    q: "Puis-je choisir n'importe quel notaire, même loin de chez moi ?",
    a: "Oui. Le choix du notaire est libre, et un notaire peut instrumenter partout en France, quel que soit le lieu du bien ou votre domicile. Pour une vente, acheteur et vendeur peuvent même avoir chacun le leur, sans frais supplémentaires : les honoraires sont partagés entre eux.",
  },
  {
    q: "Le service Notaires.io est-il payant ?",
    a: "L'utilisation de Notaires.io est 100 % gratuite et sans engagement. Si un acte notarié est nécessaire, vous réglez ensuite les honoraires directement au notaire — comme dans n'importe quelle étude, selon le tarif réglementé.",
  },
  {
    q: "Comment ça marche concrètement ?",
    a: "Vous décrivez votre besoin en quelques clics, on vous oriente vers un notaire compétent sur votre sujet, puis vous choisissez le créneau qui vous convient. Vous recevez votre confirmation et, si c'est en visio, votre lien de connexion.",
  },
  {
    q: "Le rendez-vous se passe en visio ou au cabinet ?",
    a: "Les deux sont possibles, selon le notaire et votre préférence. La visioconférence vous permet d'être reçu à distance, comme au cabinet, sans vous déplacer.",
  },
  {
    q: "Dois-je préparer des documents à l'avance ?",
    a: "Oui, on vous indiquera dans votre espace les documents utiles à télécharger si vous souhaitez préparer votre dossier en amont du rendez-vous. Rien d'obligatoire — le notaire peut aussi vous guider lors du rendez-vous.",
  },
  {
    q: "Puis-je annuler ou reporter mon rendez-vous ?",
    a: "Oui. Vous pouvez gérer votre rendez-vous depuis votre confirmation. En cas d'imprévu, prévenez simplement le plus tôt possible.",
  },
  {
    q: "Mes données personnelles sont-elles protégées ?",
    a: "Oui. Vos informations sont confidentielles et traitées conformément au RGPD. Elles ne servent qu'à préparer votre rendez-vous avec votre notaire.",
  },
];

/* ── JSON-LD : WebPage + FAQPage ─────────────────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://notaires.io/#webpage",
      url: "https://notaires.io",
      name: "RDV notaire en ligne : prendre rendez-vous avec un notaire — Notaires.io",
      isPartOf: { "@id": "https://notaires.io/#website" },
      about: { "@id": "https://notaires.io/#organization" },
      description:
        "Prenez RDV avec un notaire en ligne : immobilier, succession, mariage, société. En visio ou au cabinet.",
      inLanguage: "fr-FR",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [{ "@type": "ListItem", position: 1, name: "Accueil", item: "https://notaires.io" }],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqParticuliers.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@type": "Service",
      name: "Prise de rendez-vous notariale en ligne",
      serviceType: "Service notarial",
      provider: { "@id": "https://notaires.io/#organization" },
      areaServed: { "@type": "Country", name: "France" },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: "https://notaires.io",
        serviceType: "Rendez-vous en ligne",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: "Service 100 % gratuit et sans engagement",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <Hero />
        <SocialProof />

        {/* Notre point fort : les questions qui orientent */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <p className="text-[12px] font-bold uppercase tracking-[1px] text-[var(--color-accent)] mb-6 text-center">
              Orientation personnalisée
            </p>
            <ParcoursFlow headingLevel={2} />
          </div>
        </section>

        <Features />
        <HowItWorks />
        <FAQ
          eyebrow="Questions fréquentes"
          title="Vous vous posez peut-être ces questions."
          items={faqParticuliers}
        />
      </main>
      <Footer />
    </>
  );
}
