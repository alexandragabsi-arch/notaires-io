import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Wizard from "@/components/Wizard";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Prendre rendez-vous avec un notaire en ligne",
  description:
    "Trouvez le bon notaire pour votre situation en 3 questions. Achat immobilier, succession, mariage, PACS, création de société — rendez-vous en visio ou au cabinet (30 min). Tarifs réglementés.",
  keywords: [
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
    title: "Notaires.io — Prendre rendez-vous avec un notaire en ligne",
    description:
      "Trouvez le bon notaire pour votre situation en 3 questions. en visio ou au cabinet.",
    url: "https://notaires.io",
    type: "website",
  },
};

const faqParticuliers = [
  {
    q: "Combien ça coûte ?",
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
      name: "Prendre rendez-vous avec un notaire en ligne — Notaires.io",
      isPartOf: { "@id": "https://notaires.io/#website" },
      about: { "@id": "https://notaires.io/#organization" },
      description:
        "Trouvez le bon notaire pour votre situation en 3 questions. Immobilier, succession, mariage, société.",
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
            <div className="text-center mb-10">
              <p className="text-[12px] font-bold uppercase tracking-[1px] text-[var(--color-accent)] mb-2 !text-center">
                Orientation personnalisée
              </p>
              <h2 className="serif text-[26px] sm:text-[32px] font-bold text-[var(--color-text-strong)] tracking-tight">
                Quelle est votre situation ?
              </h2>
              <p className="text-[16px] text-[var(--color-muted)] mt-3 max-w-[480px] mx-auto !text-center">
                Répondez à 2–3 questions, on vous oriente vers le bon notaire et la bonne spécialité.
              </p>
            </div>
            <div className="flex justify-center">
              <Wizard />
            </div>
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
