import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { getNotairesMixed } from "@/lib/notaires-source";

const URL_PAGE = "https://notaires.io/notaire-en-ligne";

/* « notaire en ligne » : 362 impressions sur 90 jours, 25e place, sans page
   dédiée. L'accueil garde « rdv notaire » ; cette page vise la consultation
   à distance (visio, signature électronique, procuration à distance). */
export const metadata: Metadata = {
  // Court : le gabarit ajoute « · Notaires.io ».
  title: "Notaire en ligne : rendez-vous en visio",
  description:
    "Consultez un notaire en ligne, en visioconférence, sans vous déplacer : prise de rendez-vous gratuite, créneaux visibles, procuration et signature à distance. Valeur légale, déroulé, actes possibles.",
  keywords: [
    "notaire en ligne",
    "notaire en visio",
    "rendez-vous notaire en ligne",
    "consultation notaire à distance",
    "signature acte notarié à distance",
    "procuration notariée à distance",
  ],
  alternates: { canonical: URL_PAGE },
  openGraph: {
    title: "Notaire en ligne : rendez-vous en visio · Notaires.io",
    description: "Un notaire en visioconférence, sans vous déplacer. Prise de rendez-vous gratuite.",
    url: URL_PAGE,
    type: "website",
  },
};

const FAQ = [
  {
    q: "Un notaire en ligne a-t-il la même valeur qu'au cabinet ?",
    a: "Oui. Le notaire que vous consultez en visio est un officier public, inscrit à son étude, avec les mêmes obligations de conseil et de secret professionnel qu'au cabinet. Les actes qu'il reçoit ont la même valeur authentique, qu'ils soient signés sur place ou à distance selon les procédures prévues par les textes.",
  },
  {
    q: "Peut-on signer un acte notarié à distance ?",
    a: "Oui, dans un cadre précis. Depuis le décret n° 2020-1422 du 20 novembre 2020, un notaire peut recevoir à distance, par visioconférence, une procuration authentique électronique : vous donnez pouvoir sans vous déplacer, et l'acte est ensuite signé pour vous. Selon les actes et les pratiques de l'étude, la signature électronique de l'acte lui-même est aussi possible. Votre notaire vous indique ce qu'il pratique.",
  },
  {
    q: "Combien coûte un rendez-vous avec un notaire en ligne ?",
    a: "La prise de rendez-vous sur Notaires.io est gratuite. Un renseignement simple n'est pas facturé, et le conseil qui prépare un acte est compris dans le prix de cet acte, fixé par l'État. Seule une consultation approfondie sans acte peut être payante, à un prix annoncé à l'avance.",
  },
  {
    q: "Quels sujets peut-on traiter en visio avec un notaire ?",
    a: "La plupart des premiers rendez-vous : succession, donation, achat immobilier, contrat de mariage ou PACS, création de société, divorce. Le notaire vous écoute, vous explique la marche à suivre et la liste des pièces à fournir, puis prépare l'acte.",
  },
  {
    q: "De quoi ai-je besoin pour un rendez-vous en visio ?",
    a: "Un ordinateur, une tablette ou un smartphone avec caméra et micro, une connexion stable et une pièce d'identité. Le lien de la visio vous est envoyé par e-mail après la réservation.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://notaires.io" },
        { "@type": "ListItem", position: 2, name: "Notaire en ligne", item: URL_PAGE },
      ],
    },
    {
      "@type": "Service",
      name: "Rendez-vous avec un notaire en ligne",
      serviceType: "Consultation notariale en visioconférence",
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
      areaServed: { "@type": "Country", name: "France" },
      url: URL_PAGE,
    },
    { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

const ETAPES = [
  ["Choisissez votre notaire", "Filtrez par spécialité et par ville, et repérez les créneaux en visio."],
  ["Réservez le créneau", "Gratuitement, en quelques clics : vous indiquez l'objet du rendez-vous."],
  ["Recevez le lien", "Le lien de la visio et la liste des documents utiles arrivent par e-mail."],
  ["Échangez à distance", "Le notaire vous conseille, répond à vos questions et prépare l'acte."],
];

export default function Page() {
  const notaires = getNotairesMixed(60);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <SeoLandingPage
          h1="Notaire en ligne : un rendez-vous en visio, sans vous déplacer"
          intro="Consultez un notaire en visioconférence depuis chez vous : succession, donation, achat immobilier, contrat de mariage. La prise de rendez-vous est gratuite, les créneaux sont visibles en temps réel, et le notaire a la même valeur qu'au cabinet."
          notaires={notaires}
          faq={FAQ}
          relatedLinks={[
            { href: "/frais-de-notaire", label: "Simulateur de frais de notaire" },
            { href: "/compromis-acte-de-vente", label: "Du compromis à l'acte de vente" },
            { href: "/notaire-succession", label: "Notaire succession" },
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-donation", label: "Notaire donation" },
            { href: "/blog/consultation-notaire-prix", label: "Prix d'une consultation notaire" },
          ]}
        />

        <section className="bg-white px-6 pb-16">
          <div className="max-w-[820px] mx-auto">
            <div className="text-center">
              <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">Comment ça marche</div>
              <h2 className="serif font-bold tracking-tight text-[28px] sm:text-[32px] leading-[1.15] text-[var(--color-text-strong)]">
                Votre notaire en ligne en <span className="serif-accent">4 étapes</span>
              </h2>
            </div>
            <ol className="mt-8 grid sm:grid-cols-2 gap-4">
              {ETAPES.map(([titre, texte], i) => (
                <li key={titre} className="rounded-2xl border border-[var(--color-border-soft)] bg-white p-5 shadow-[var(--shadow-card)]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-[14px] font-bold text-white">{i + 1}</span>
                  <p className="mt-3 serif font-bold text-[18px] text-[var(--color-text-strong)]">{titre}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-muted)]">{texte}</p>
                </li>
              ))}
            </ol>

            <h2 className="serif font-bold tracking-tight text-[28px] sm:text-[32px] leading-[1.15] text-[var(--color-text-strong)] mt-16 mb-4">
              Ce qu&apos;un notaire peut faire à <span className="serif-accent">distance</span>
            </h2>
            <ul className="space-y-3 text-[16px] leading-relaxed text-[var(--color-muted)] list-disc pl-5">
              <li><strong className="text-[var(--color-text-strong)]">Vous conseiller</strong> : premier rendez-vous, explication des démarches, des délais et des frais.</li>
              <li><strong className="text-[var(--color-text-strong)]">Préparer l&apos;acte</strong> : collecte des pièces par voie électronique, projet d&apos;acte relu avec vous.</li>
              <li><strong className="text-[var(--color-text-strong)]">Recevoir votre procuration à distance</strong> : procuration authentique électronique par visioconférence, pour signer sans vous déplacer.</li>
              <li><strong className="text-[var(--color-text-strong)]">Signer électroniquement</strong> : l&apos;acte authentique électronique a la même valeur que l&apos;acte papier ; les modalités de signature à distance dépendent de l&apos;acte et de l&apos;étude.</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
