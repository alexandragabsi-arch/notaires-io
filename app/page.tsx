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
    q: "Comment prendre RDV avec un notaire en ligne ?",
    a: "Vous décrivez votre situation en quelques questions, vous comparez les créneaux réellement disponibles des notaires compétents sur votre sujet, puis vous réservez. La confirmation arrive par e-mail, avec le lien de visioconférence ou l'adresse de l'étude. Vous n'attendez aucun rappel : le créneau est bloqué dans l'agenda au moment où vous le choisissez.",
  },
  {
    q: "Combien de temps faut-il pour obtenir un rendez-vous ?",
    a: "Cela dépend de l'étude et de votre sujet. Les créneaux en visioconférence se libèrent généralement plus vite que les rendez-vous au cabinet, et une étude voisine a souvent des disponibilités que la vôtre n'a plus. L'intérêt de la réservation en ligne est précisément de voir ces écarts au lieu de les découvrir au téléphone, étude après étude.",
  },
  {
    q: "Peut-on choisir librement son notaire en France ?",
    a: "Oui, sur tout le territoire : rien ne vous oblige à consulter celui de votre commune. Pour une vente immobilière, acheteur et vendeur peuvent même avoir chacun le leur sans surcoût — les émoluments, fixés par décret, sont alors partagés entre les deux offices.",
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
        {/*
          Page de 3 866 signes au 27/09/2026, face à des plateformes entières
          sur « rdv notaire en ligne » — et l'expression n'y figurait qu'une
          fois. Cette section donne à Google de quoi comprendre l'intention de
          la page, et au lecteur de quoi décider.
        */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-[760px] mx-auto px-6">
            <p className="text-[12px] font-bold uppercase tracking-[1px] text-[var(--color-accent)] mb-4">
              Prendre rendez-vous
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold leading-tight text-[var(--color-text-strong)] mb-6 text-balance">
              Prendre RDV avec un notaire en ligne : ce que ça change
            </h2>

            <div className="space-y-5 text-[16px] leading-[1.75] text-[var(--color-muted)]">
              <p>
                Longtemps, joindre un notaire supposait d&apos;appeler un standard aux
                heures ouvrées, d&apos;exposer sa situation, puis d&apos;attendre un rappel
                pour connaître une date. La réservation en ligne inverse l&apos;ordre :
                vous voyez d&apos;abord les créneaux libres, et vous choisissez.
              </p>
              <p>
                Ce n&apos;est pas qu&apos;une question de confort. Quand une échéance court —
                le délai de dépôt d&apos;une déclaration de succession, un compromis
                signé, un contrat de mariage à établir avant une date — les jours
                passés à attendre un rappel sont des jours perdus pour de bon.
              </p>

              <h3 className="text-[19px] font-bold text-[var(--color-text-strong)] pt-3">
                Visioconférence ou cabinet : les deux se complètent
              </h3>
              <p>
                Un premier rendez-vous en visio suffit le plus souvent à cadrer un
                dossier : clarifier la situation, lister les pièces à réunir,
                comprendre le calendrier et le coût. Les créneaux à distance sont
                plus nombreux, et rien ne vous oblige à vous déplacer pour poser
                vos questions.
              </p>
              <p>
                La signature d&apos;un acte authentique — vente, donation, testament —
                suppose en revanche des formalités précises et, le plus souvent,
                votre présence à l&apos;étude. L&apos;un ne remplace pas l&apos;autre : la visio
                fait gagner les premières semaines, le cabinet conclut.
              </p>

              <h3 className="text-[19px] font-bold text-[var(--color-text-strong)] pt-3">
                Votre notaire n&apos;est pas forcément celui de votre rue
              </h3>
              <p>
                Le choix du notaire est libre sur tout le territoire. C&apos;est une
                liberté largement ignorée, et c&apos;est pourtant elle qui débloque la
                plupart des situations : une étude à trente kilomètres, ou dans le
                département voisin, a souvent des disponibilités que la vôtre n&apos;a
                plus. Ses honoraires sont les mêmes — les émoluments sont fixés par
                décret, identiques d&apos;un office à l&apos;autre pour un acte donné.
              </p>

              <h3 className="text-[19px] font-bold text-[var(--color-text-strong)] pt-3">
                Ce que Notaires.io fait, et ce qu&apos;il ne fait pas
              </h3>
              <p>
                Nous vous orientons vers un notaire dont votre sujet est le
                quotidien, et nous vous montrons ses disponibilités réelles. Le
                service est gratuit et sans engagement ; si un acte est nécessaire,
                vous réglez ensuite le notaire au tarif réglementé.
              </p>
              <p>
                Notaires.io n&apos;est pas un office notarial et ne délivre aucun conseil
                juridique : le conseil relève du notaire que vous rencontrez, et de
                lui seul.
              </p>
            </div>
          </div>
        </section>

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
