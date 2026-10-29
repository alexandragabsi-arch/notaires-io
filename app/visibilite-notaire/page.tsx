import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import { OFFRES, OFFRE_PAR_DEFAUT, dateFr } from "@/lib/offres";

const URL_PAGE = "https://notaires.io/visibilite-notaire";

/* « visibilité en ligne notaire » apparaît dans Search Console (75
   impressions sur 90 jours, 25e place). Page d'acquisition côté notaires :
   ce sont eux qui manquent pour offrir des créneaux aux particuliers.
   /notaires reste la page « référencer mon étude » ; celle-ci explique les
   leviers de visibilité et y renvoie. */
export const metadata: Metadata = {
  // Court : le gabarit ajoute « · Notaires.io ».
  title: "Notaire : gagner en visibilité en ligne",
  description:
    "Comment une étude notariale gagne en visibilité en ligne : recherches « notaire + ville », fiche Google, prise de rendez-vous en ligne, visio, assistants IA. Dans le respect de la déontologie.",
  keywords: [
    "visibilité en ligne notaire",
    "visibilité étude notariale",
    "notaire Google",
    "prise de rendez-vous en ligne notaire",
    "référencement étude notariale",
    "agenda en ligne notaire",
  ],
  alternates: { canonical: URL_PAGE },
  openGraph: {
    title: "Notaire : gagner en visibilité en ligne · Notaires.io",
    description: "Les leviers concrets pour qu'une étude soit trouvée et choisie en ligne.",
    url: URL_PAGE,
    type: "website",
  },
};

const offre = OFFRES[OFFRE_PAR_DEFAUT];

const LEVIERS: { titre: string; texte: string }[] = [
  {
    titre: "Être là où vos clients cherchent",
    texte:
      "Un particulier qui a besoin d'un notaire tape « notaire » suivi de sa ville, de son quartier ou de son besoin : succession, achat, donation. Sur Notaires.io, ces recherches locales sont celles qui génèrent le plus d'impressions sur Google. Une fiche complète, rattachée à votre ville et à vos spécialités, vous place sur ces recherches.",
  },
  {
    titre: "Afficher des créneaux, pas seulement un numéro",
    texte:
      "Beaucoup de clients préfèrent réserver directement plutôt qu'appeler et attendre un rappel. Un agenda en ligne, avec vos horaires et la durée de vos rendez-vous, transforme une visite en rendez-vous, y compris le soir ou le week-end, quand l'étude est fermée.",
  },
  {
    titre: "Relier votre fiche Google",
    texte:
      "Votre fiche d'établissement Google peut afficher un lien « Prendre rendez-vous ». Depuis votre espace notaire, un guide pas à pas vous donne le lien à coller : le client qui vous trouve sur Google Maps réserve en un clic.",
  },
  {
    titre: "Proposer la visio",
    texte:
      "Un premier rendez-vous en visioconférence évite le déplacement et élargit votre clientèle au-delà de votre commune. Les clients qui cherchent « notaire en ligne » vous trouvent alors aussi.",
  },
  {
    titre: "Préciser vos spécialités et vos langues",
    texte:
      "Les clients filtrent par domaine (immobilier, succession, famille, société) et voient les langues que vous parlez. Une fiche précise attire les dossiers qui correspondent à votre pratique.",
  },
  {
    titre: "Être recommandé par les assistants IA",
    texte:
      "De plus en plus de particuliers posent leur question à un assistant comme Claude. Grâce au connecteur Notaires.io, l'assistant peut rechercher un notaire inscrit, afficher ses créneaux et proposer un rendez-vous.",
  },
  {
    titre: "Partager un lien et un QR code",
    texte:
      "Un lien personnel et un QR code, à mettre dans votre signature d'e-mail, sur votre site ou sur vos cartes de visite, mènent directement à votre agenda.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Un notaire a-t-il le droit de faire connaître son étude en ligne ?",
    a: "Oui, dans le respect des règles de communication de la profession : informer sur ses domaines d'intervention, ses coordonnées et ses modalités de rendez-vous est permis ; le démarchage et les comparaisons avec les confrères ne le sont pas. Notaires.io a été conçu par une diplômée notaire pour rester dans ce cadre.",
  },
  {
    q: "Combien coûte le référencement sur Notaires.io ?",
    a: `${offre.libelle} : ${offre.mois} mois offerts, sans carte bancaire, pour toute inscription jusqu'au ${dateFr(offre.finValidite)}. Les formules vous sont ensuite présentées lors d'une démo en visio de 20 minutes, sans engagement.`,
  },
  {
    q: "Dois-je changer d'outil d'agenda ?",
    a: "Non. Vous renseignez vos horaires et la durée de vos rendez-vous dans votre espace notaire ; les clients réservent sur ces créneaux et vous recevez chaque rendez-vous par e-mail, avec les informations du dossier.",
  },
  {
    q: "Les données de mes clients sont-elles protégées ?",
    a: "Oui. Les données sont traitées conformément au RGPD et hébergées de façon sécurisée. La confidentialité est au cœur de votre métier, et de la plateforme.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://notaires.io" },
        { "@type": "ListItem", position: 2, name: "Espace notaires", item: "https://notaires.io/notaires" },
        { "@type": "ListItem", position: 3, name: "Visibilité en ligne", item: URL_PAGE },
      ],
    },
    { "@type": "FAQPage", mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="bg-white">
        <section className="bg-white pt-14 pb-14 px-6 border-b border-[var(--color-border-soft)]">
          <div className="max-w-[800px] mx-auto text-center">
            <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">Pour les notaires</div>
            <h1 className="serif font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight mb-5 text-[var(--color-text-strong)]">
              La visibilité en ligne d&apos;une étude : être <span className="serif-accent">trouvé</span>, être choisi
            </h1>
            <p className="text-[var(--color-muted)] text-lg leading-relaxed max-w-[640px] mx-auto">
              Vos futurs clients cherchent un notaire sur Google, sur une carte ou auprès d&apos;un assistant IA. Voici les leviers
              concrets pour apparaître au bon moment, et transformer une recherche en rendez-vous.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="/inscription" className="rounded-xl bg-[var(--color-primary)] px-6 py-3 text-[15px] font-bold text-white shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-hover)] transition-colors">
                Référencer mon étude
              </a>
              <Link href="/notaires" className="rounded-xl border border-[var(--color-border)] px-6 py-3 text-[15px] font-bold text-[var(--color-text-strong)] hover:border-[var(--color-primary)] transition-colors">
                Découvrir la plateforme
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-[var(--color-muted)]">
              {offre.mois} mois offerts, sans carte bancaire, jusqu&apos;au {dateFr(offre.finValidite)}.
            </p>
          </div>
        </section>

        <section className="max-w-[1000px] mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">Les leviers</div>
            <h2 className="serif font-bold tracking-tight text-[28px] sm:text-[34px] leading-[1.15] text-[var(--color-text-strong)]">
              7 façons d&apos;être plus <span className="serif-accent">visible</span>
            </h2>
          </div>
          <ol className="grid md:grid-cols-2 gap-5">
            {LEVIERS.map((l, i) => (
              <li key={l.titre} className="rounded-2xl border border-[var(--color-border-soft)] bg-white p-6 shadow-[var(--shadow-card)]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-[14px] font-bold text-white">{i + 1}</span>
                <h3 className="mt-3 serif font-bold text-[19px] text-[var(--color-text-strong)]">{l.titre}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-muted)]">{l.texte}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="px-6 pb-8">
          <div className="max-w-[820px] mx-auto rounded-2xl border border-[var(--color-border-soft)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
            <p className="serif font-bold text-[26px] leading-snug tracking-tight text-[var(--color-text-strong)]">
              Votre étude en ligne en quelques <span className="serif-accent">minutes</span>
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-muted)] max-w-[560px] mx-auto">
              Fiche, horaires, visio, lien pour Google et QR code : tout se règle depuis votre espace notaire.
              {` ${offre.libelle} : ${offre.mois} mois offerts, sans carte bancaire.`}
            </p>
            <a
              href="/inscription"
              className="mt-6 inline-block rounded-xl bg-[var(--color-primary)] px-6 py-3 text-[15px] font-bold text-white shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Référencer mon étude
            </a>
          </div>
        </section>

        <FAQ eyebrow="Questions fréquentes" title="Visibilité en ligne : vos questions" items={FAQ_ITEMS} />
      </main>
      <Footer />
    </>
  );
}
