import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";

const URL_PAGE = "https://notaires.io/compromis-acte-de-vente";

export const metadata: Metadata = {
  // Court : le gabarit ajoute « · Notaires.io » (59 caractères au total).
  title: "Compromis et acte de vente : étapes et délais",
  description:
    "Compromis de vente, délai de rétractation, conditions suspensives, prêt, droit de préemption, signature de l'acte authentique : chaque étape d'un achat immobilier chez le notaire, avec ses délais légaux.",
  keywords: [
    "compromis de vente notaire",
    "acte de vente notarié",
    "délai entre compromis et acte de vente",
    "signature notaire délai",
    "délai de rétractation compromis",
    "condition suspensive de prêt",
    "acte authentique vente",
  ],
  alternates: { canonical: URL_PAGE },
  openGraph: {
    title: "Du compromis à l'acte de vente · Notaires.io",
    description: "Les étapes et les délais d'un achat immobilier chez le notaire, du compromis à la remise des clés.",
    url: URL_PAGE,
    type: "website",
  },
};

const ETAPES: { titre: string; delai: string; texte: string }[] = [
  {
    titre: "L'offre d'achat acceptée",
    delai: "Jour J",
    texte:
      "Vous faites une offre au prix demandé ou en dessous ; le vendeur l'accepte par écrit. Elle engage les deux parties à négocier de bonne foi, mais la vente n'est formée qu'avec l'avant-contrat.",
  },
  {
    titre: "La signature du compromis (ou de la promesse)",
    delai: "Quelques jours à 3 semaines",
    texte:
      "L'avant-contrat fixe le prix, la date limite de signature de l'acte et les conditions suspensives. Il peut être signé chez le notaire ou à l'agence ; le notaire vérifie au préalable la situation du bien (titre de propriété, urbanisme, copropriété, diagnostics). Vous versez un dépôt de garantie, en général 5 à 10 % du prix, conservé par le notaire.",
  },
  {
    titre: "Le délai de rétractation",
    delai: "10 jours",
    texte:
      "L'acheteur non professionnel d'un logement peut se rétracter sans motif pendant 10 jours, à compter du lendemain de la remise ou de la première présentation du compromis signé (article L271-1 du Code de la construction et de l'habitation). Le dépôt de garantie lui est alors restitué en totalité.",
  },
  {
    titre: "Le prêt et les conditions suspensives",
    delai: "1 à 2 mois",
    texte:
      "La condition suspensive d'obtention du prêt dure au moins un mois (article L313-41 du Code de la consommation), souvent 45 à 60 jours. Si le prêt est refusé malgré des demandes conformes au compromis, la vente est annulée et le dépôt de garantie restitué.",
  },
  {
    titre: "Les vérifications du notaire",
    delai: "En parallèle, 2 à 3 mois",
    texte:
      "Le notaire purge le droit de préemption de la commune, qui dispose de 2 mois pour répondre (article L213-2 du Code de l'urbanisme), interroge le service de publicité foncière sur les hypothèques, réunit les pièces d'urbanisme et l'état daté du syndic, et prépare l'acte.",
  },
  {
    titre: "La signature de l'acte authentique",
    delai: "Environ 3 mois après le compromis",
    texte:
      "Le notaire lit l'acte avec vous, en présence du vendeur ou de son représentant. Le prix et les frais doivent être sur son compte avant le rendez-vous : au-delà de 3 000 €, les fonds sont versés par virement (article L112-6-1 du Code monétaire et financier). Vous recevez les clés le jour même.",
  },
  {
    titre: "La publication et le titre de propriété",
    delai: "Quelques semaines à quelques mois",
    texte:
      "Le notaire publie la vente au service de publicité foncière, règle le vendeur, les impôts et les frais, puis vous adresse votre titre de propriété et le décompte définitif, avec le remboursement de l'éventuel trop-perçu.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Quel est le délai entre le compromis et la signature chez le notaire ?",
    a: "Comptez environ 3 mois. Ce délai couvre la rétractation de 10 jours, l'obtention du prêt (au moins un mois de condition suspensive), la réponse de la commune sur son droit de préemption (2 mois au plus) et la préparation de l'acte. Sans prêt, il peut se réduire à 6 à 8 semaines.",
  },
  {
    q: "Quelle différence entre un compromis et un acte de vente ?",
    a: "Le compromis est un avant-contrat : il engage le vendeur et l'acheteur sur la chose et le prix, sous conditions suspensives, et peut être signé à l'agence ou chez le notaire. L'acte de vente est l'acte authentique, obligatoirement reçu par un notaire : il transfère la propriété, déclenche le paiement du prix et des frais, et sera publié au service de publicité foncière.",
  },
  {
    q: "Faut-il signer le compromis chez le notaire ?",
    a: "Ce n'est pas obligatoire, mais c'est recommandé : le notaire vérifie la situation du bien avant que vous vous engagiez. Chaque partie peut aussi choisir son propre notaire, sans surcoût : les deux notaires se partagent les émoluments.",
  },
  {
    q: "Que se passe-t-il si le prêt est refusé ?",
    a: "Si la condition suspensive de prêt n'est pas réalisée alors que vous avez déposé des demandes conformes au compromis, la vente est caduque et le dépôt de garantie vous est restitué. Gardez les refus écrits des banques pour le justifier.",
  },
  {
    q: "Peut-on signer l'acte de vente à distance ?",
    a: "Oui. Le notaire peut recevoir l'acte en visioconférence (acte authentique électronique à distance) ou vous pouvez donner procuration à un clerc de l'étude. Renseignez-vous auprès de votre notaire sur les modalités qu'il pratique.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://notaires.io" },
        { "@type": "ListItem", position: 2, name: "Notaire immobilier", item: "https://notaires.io/notaire-immobilier" },
        { "@type": "ListItem", position: 3, name: "Du compromis à l'acte de vente", item: URL_PAGE },
      ],
    },
    {
      "@type": "HowTo",
      name: "Acheter un bien immobilier chez le notaire, du compromis à l'acte de vente",
      totalTime: "P3M",
      step: ETAPES.map((e, i) => ({ "@type": "HowToStep", position: i + 1, name: e.titre, text: e.texte })),
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

const h2 = "serif font-bold tracking-tight text-[28px] sm:text-[32px] leading-[1.15] text-[var(--color-text-strong)] mt-16 mb-4";
const p = "text-[16px] leading-relaxed text-justify hyphens-auto text-[var(--color-muted)] mb-4";
const th = "text-left font-semibold px-4 py-3 text-[var(--color-text-strong)]";

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="bg-white">
        <section className="bg-white pt-14 pb-14 px-6 border-b border-[var(--color-border-soft)]">
          <div className="max-w-[800px] mx-auto text-center">
            <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">Achat immobilier</div>
            <h1 className="serif font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight mb-5 text-[var(--color-text-strong)]">
              Du compromis à l&apos;<span className="serif-accent">acte de vente</span> : étapes et délais
            </h1>
            <p className="text-[var(--color-muted)] text-lg leading-relaxed text-justify hyphens-auto max-w-[640px] mx-auto [text-align-last:center]">
              Environ 3 mois séparent le compromis de la signature chez le notaire. Voici ce qui se passe pendant ce temps,
              étape par étape, avec les délais fixés par la loi.
            </p>
          </div>
        </section>

        <article className="max-w-[820px] mx-auto px-6 pb-8">
          <h2 className={h2}>Les 7 étapes d&apos;un achat chez le <span className="serif-accent">notaire</span></h2>
          <ol className="relative border-l-2 border-[var(--color-border-soft)] ml-3 space-y-8 mt-8">
            {ETAPES.map((e, i) => (
              <li key={e.titre} className="pl-8 relative">
                <span className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-[14px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-[12px] font-bold tracking-[1.2px] uppercase text-[var(--color-accent)]">{e.delai}</p>
                <h3 className="serif font-bold text-[20px] text-[var(--color-text-strong)] mt-1">{e.titre}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-justify hyphens-auto text-[var(--color-muted)]">{e.texte}</p>
              </li>
            ))}
          </ol>

          <h2 className={h2}>Compromis, promesse, acte de vente : quelles différences ?</h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border-soft)] mb-6">
            <table className="w-full text-[14px]">
              <thead className="border-b border-[var(--color-border-soft)]">
                <tr><th className={th}><span className="sr-only">Critère</span></th><th className={th}>Compromis</th><th className={th}>Promesse unilatérale</th><th className={th}>Acte de vente</th></tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-soft)] align-top">
                <tr><td className="px-4 py-3 font-semibold">Qui s&apos;engage</td><td className="px-4 py-3">Vendeur et acheteur</td><td className="px-4 py-3">Le vendeur seul ; l&apos;acheteur dispose d&apos;une option</td><td className="px-4 py-3">Les deux : la vente est conclue</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Où le signer</td><td className="px-4 py-3">Notaire ou agence</td><td className="px-4 py-3">Notaire, ou enregistrement sous 10 jours</td><td className="px-4 py-3">Chez le notaire, obligatoirement</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Argent versé</td><td className="px-4 py-3">Dépôt de garantie, 5 à 10 %</td><td className="px-4 py-3">Indemnité d&apos;immobilisation, souvent 10 %</td><td className="px-4 py-3">Le prix et les frais de notaire</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Effet</td><td className="px-4 py-3">Vente sous conditions suspensives</td><td className="px-4 py-3">Bien réservé pendant l&apos;option</td><td className="px-4 py-3">Transfert de propriété, remise des clés</td></tr>
              </tbody>
            </table>
          </div>
          <p className={p}>
            Une promesse unilatérale sous seing privé doit être enregistrée auprès des impôts dans les 10 jours, sous peine de
            nullité : c&apos;est pourquoi elle est le plus souvent signée chez le notaire.
          </p>

          <h2 className={h2}>Les délais à retenir</h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border-soft)] mb-6">
            <table className="w-full text-[14px]">
              <thead className="border-b border-[var(--color-border-soft)]">
                <tr><th className={th}>Délai</th><th className={th}>Durée</th><th className={th}>Texte</th></tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-soft)]">
                <tr><td className="px-4 py-3">Rétractation de l&apos;acheteur</td><td className="px-4 py-3">10 jours</td><td className="px-4 py-3">Art. L271-1 CCH</td></tr>
                <tr><td className="px-4 py-3">Condition suspensive de prêt</td><td className="px-4 py-3">1 mois minimum</td><td className="px-4 py-3">Art. L313-41 C. conso.</td></tr>
                <tr><td className="px-4 py-3">Droit de préemption de la commune</td><td className="px-4 py-3">2 mois pour répondre</td><td className="px-4 py-3">Art. L213-2 C. urb.</td></tr>
                <tr><td className="px-4 py-3">Compromis à acte de vente</td><td className="px-4 py-3">Environ 3 mois</td><td className="px-4 py-3">Usage</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={h2}>Ce que vous payez, et quand</h2>
          <p className={p}>
            Au compromis, le dépôt de garantie, déduit ensuite du prix. À l&apos;acte, le solde du prix et les frais de notaire,
            environ 7,5 à 8 % du prix dans l&apos;ancien et 2 à 3 % dans le neuf, essentiellement des impôts. Notre{" "}
            <a href="/frais-de-notaire" className="text-[var(--color-accent)] underline underline-offset-2 font-semibold">simulateur de frais de notaire</a>{" "}
            calcule la somme exacte à verser au notaire le jour de la signature, prorata de taxe foncière compris.
          </p>

          <div className="mt-12 rounded-2xl border border-[var(--color-border-soft)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
            <p className="serif font-bold text-[26px] leading-snug tracking-tight text-[var(--color-text-strong)]">
              Un compromis à <span className="serif-accent">relire</span> ?
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-justify hyphens-auto text-[var(--color-muted)] max-w-[560px] mx-auto [text-align-last:center]">
              Un notaire spécialisé en immobilier relit votre avant-contrat, vérifie les conditions suspensives et fixe la date de
              signature. Rendez-vous en visio ou au cabinet.
            </p>
            <a
              href="/notaire-immobilier"
              className="mt-6 inline-block rounded-xl bg-[var(--color-primary)] px-6 py-3 text-[15px] font-bold text-white shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Trouver un notaire immobilier
            </a>
          </div>
        </article>

        <FAQ eyebrow="Questions fréquentes" title="Compromis et acte de vente : vos questions" items={FAQ_ITEMS} />

        <nav aria-label="Pages liées" className="max-w-[820px] mx-auto px-6 pb-16">
          <ul className="flex flex-wrap gap-2 text-[14px]">
            {[
              ["/frais-de-notaire", "Simulateur de frais de notaire"],
              ["/notaire-immobilier", "Notaire immobilier"],
              ["/blog/promesse-vente-unilaterale", "La promesse unilatérale de vente"],
              ["/notaire-paris", "Notaire à Paris"],
              ["/notaire-lyon", "Notaire à Lyon"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="inline-block rounded-full border border-[var(--color-border)] px-4 py-2 text-[var(--color-text-strong)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <Footer />
    </>
  );
}
