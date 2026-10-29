import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import SimulateurFraisNotaire from "@/components/SimulateurFraisNotaire";
import {
  DATE_BAREME,
  DEPARTEMENTS_FRAIS,
  FORFAIT_FORMALITES_TTC,
  calculerFrais,
  economies,
  economieTotale,
  formatEuros,
  formatPourcent,
  tauxGlobalAncien,
} from "@/lib/frais-notaire";

const URL_PAGE = "https://notaires.io/frais-de-notaire";

export const metadata: Metadata = {
  title: "Frais de notaire 2026 : simulateur et calcul exact par département",
  description:
    "Calculez vos frais de notaire 2026 pour un achat (barème DGFiP par département, primo-accédant, neuf ou ancien), une donation, une succession ou un partage après divorce. Détail ligne par ligne, gratuit.",
  keywords: [
    "frais de notaire",
    "simulateur frais de notaire",
    "calcul frais de notaire",
    "frais de notaire 2026",
    "frais de notaire achat maison",
    "frais de notaire ancien",
    "frais de notaire neuf",
    "droits de mutation 2026",
    "frais de notaire primo-accédant",
    "frais de notaire donation",
    "frais de notaire succession",
    "droit de partage divorce",
    "simulateur droits de succession",
  ],
  alternates: { canonical: URL_PAGE },
  openGraph: {
    title: "Simulateur de frais de notaire 2026 · Notaires.io",
    description:
      "Le calcul exact de vos frais de notaire, département par département, avec le barème officiel 2026.",
    url: URL_PAGE,
    type: "website",
  },
};

/* Exemples calculés avec le même moteur que le simulateur : ils restent justes
   quand le barème est mis à jour dans lib/frais-notaire.ts. */
const EXEMPLES = [150_000, 250_000, 400_000].map((prix) => ({
  prix,
  ancien: calculerFrais({ prix, type: "ancien", codeDepartement: "75", primoAccedant: false, mobilier: 0 }),
  primo: calculerFrais({ prix, type: "ancien", codeDepartement: "75", primoAccedant: true, mobilier: 0 }),
  neuf: calculerFrais({ prix, type: "neuf", codeDepartement: "75", primoAccedant: false, mobilier: 0 }),
}));

const ENTREE_EXEMPLE = { prix: 260_000, type: "ancien", codeDepartement: "75", primoAccedant: true, mobilier: 8_000, fraisAgence: 10_000 } as const;
const EXEMPLE_ECONOMIES = economies(ENTREE_EXEMPLE, true);
const EXEMPLE_TOTAL = economieTotale(ENTREE_EXEMPLE);

const EXCEPTIONS = DEPARTEMENTS_FRAIS.filter((d) => d.taux < 5);
const EX_250 = EXEMPLES[1];

const FAQ_ITEMS = [
  {
    q: "Combien coûtent les frais de notaire en 2026 ?",
    a: `Dans l'ancien, comptez environ 7,5 à 8 % du prix dans la grande majorité des départements, qui appliquent depuis 2025 un taux départemental de 5 %. Pour un achat à 250 000 € à Paris, le total atteint ${formatEuros(EX_250.ancien.total)}, formalités comprises. Dans le neuf, les frais tombent autour de 2 à 3 % du prix, car la vente est soumise à TVA et les droits de mutation sont réduits à 0,715 %.`,
  },
  {
    q: "Pourquoi les frais de notaire ont-ils augmenté en 2025 ?",
    a: "La loi de finances pour 2025 a autorisé les départements à relever leur taux de 4,50 % à 5 % maximum, du 1er avril 2025 au 31 mars 2028. Au 1er juin 2026, seuls onze départements sont restés à 4,50 % et l'Indre applique 3,80 %. Partout ailleurs, la hausse ajoute environ 0,5 % du prix aux frais d'un bien ancien.",
  },
  {
    q: "Qui peut garder le taux de 4,50 % en tant que primo-accédant ?",
    a: "L'acheteur qui n'a pas été propriétaire de sa résidence principale au cours des deux années précédant l'achat, et qui acquiert le bien pour en faire sa résidence principale. Il reste au taux de 4,50 % même dans un département passé à 5 %. Le notaire recueille sa déclaration dans l'acte de vente.",
  },
  {
    q: "Les frais de notaire sont-ils négociables ?",
    a: "Les droits de mutation sont des impôts et ne se négocient pas. Les émoluments du notaire sont fixés par l'État et identiques dans toutes les études. Seule exception : le notaire peut accorder une remise de 20 % au plus sur la part de ses émoluments calculée au-delà de 100 000 € de prix. Vous pouvez en revanche réduire légalement l'assiette des droits en déduisant le mobilier vendu avec le bien et en sortant les frais d'agence à votre charge.",
  },
  {
    q: "Quand faut-il payer les frais de notaire ?",
    a: "Le notaire demande une provision au plus tard le jour de la signature de l'acte de vente, en même temps que le prix. Il règle ensuite les impôts et les formalités pour votre compte. Quelques mois après, il établit un décompte définitif et vous rembourse le trop-perçu éventuel.",
  },
  {
    q: "Combien coûte une donation de maison à un enfant ?",
    a: "Chaque parent peut donner 100 000 € à chaque enfant sans droits, tous les 15 ans. Au-delà, le barème va de 5 % à 45 %, avec 20 % sur l'essentiel des montants courants. S'ajoutent la taxe de publicité foncière (0,60 % plus frais d'assiette), la contribution de sécurité immobilière (0,10 %) et les émoluments du notaire. Donner la nue-propriété en gardant l'usufruit réduit la valeur taxée selon l'âge du donateur.",
  },
  {
    q: "Quels frais pour une succession avec une maison ?",
    a: "Les droits de succession dépendent du lien de parenté : chaque enfant bénéficie d'un abattement de 100 000 €, et le conjoint ou partenaire de PACS est exonéré. Le notaire facture l'acte de notoriété, l'attestation immobilière et la déclaration de succession selon des barèmes réglementés, auxquels s'ajoutent une taxe fixe de 125 € et la contribution de sécurité immobilière.",
  },
  {
    q: "Quel est le droit de partage après un divorce ?",
    a: "Depuis le 1er janvier 2022, le partage des biens après un divorce, une séparation de corps ou la rupture d'un PACS est taxé à 1,10 % de l'actif net partagé, c'est-à-dire après déduction des dettes comme le prêt restant dû. Dans les autres cas, le droit de partage est de 2,50 %.",
  },
  {
    q: "Les frais de notaire peuvent-ils être financés par le prêt immobilier ?",
    a: "Certaines banques financent les frais de notaire, mais la plupart demandent qu'ils soient couverts par l'apport personnel. Attention, les frais de garantie du prêt (hypothèque, privilège de prêteur de deniers ou caution) s'ajoutent aux frais d'achat et ne sont pas compris dans ce simulateur.",
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
        { "@type": "ListItem", position: 3, name: "Frais de notaire", item: URL_PAGE },
      ],
    },
    {
      "@type": "WebApplication",
      name: "Simulateur de frais de notaire 2026",
      url: `${URL_PAGE}#simulateur`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Tous",
      inLanguage: "fr-FR",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

const h2 = "serif font-bold tracking-tight text-[28px] sm:text-[32px] leading-[1.15] text-[var(--color-text-strong)] mt-16 mb-4";
const p = "text-[16px] leading-relaxed text-[var(--color-muted)] mb-4";
const th = "text-left font-semibold px-4 py-3 text-[var(--color-text-strong)]";
const td = "px-4 py-3 tabular-nums";

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="bg-white">
        <section className="bg-white pt-14 pb-14 px-6 border-b border-[var(--color-border-soft)]">
          <div className="max-w-[800px] mx-auto text-center">
            <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">
              Barème officiel au {DATE_BAREME}
            </div>
            <h1 className="serif font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight mb-5 text-[var(--color-text-strong)]">
              Frais de notaire 2026 : <span className="serif-accent">simulateur</span> et calcul exact
            </h1>
            <p className="text-[var(--color-muted)] text-lg leading-relaxed max-w-[640px] mx-auto">
              Les « frais de notaire » sont pour l&apos;essentiel des impôts : environ 7,5 à 8 % du prix dans l&apos;ancien,
              2 à 3 % dans le neuf. Calculez les vôtres, département par département, ligne par ligne.
            </p>
          </div>
          <div className="max-w-[1100px] mx-auto mt-10">
            <SimulateurFraisNotaire />
          </div>
        </section>

        <article className="max-w-[820px] mx-auto px-6 pb-8">
          <h2 className={h2}>De quoi se composent les frais de notaire ?</h2>
          <p className={p}>
            L&apos;expression est trompeuse : sur un achat dans l&apos;ancien, le notaire ne garde qu&apos;environ 10 à 15 % de la somme.
            Le reste correspond à des impôts qu&apos;il collecte pour l&apos;État et les collectivités, et à des frais avancés pour votre
            compte. Pour un appartement ancien à 250 000 € à Paris :
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border-soft)] mb-6">
            <table className="w-full text-[14px]">
              <thead className="border-b border-[var(--color-border-soft)]">
                <tr>
                  <th className={th}>Poste</th>
                  <th className={th}>Qui le perçoit</th>
                  <th className={`${th} text-right`}>Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-soft)]">
                <tr><td className="px-4 py-3">Droits de mutation (taxe départementale, communale, frais d&apos;assiette)</td><td className="px-4 py-3">Département, commune, État</td><td className={`${td} text-right`}>{formatEuros(EX_250.ancien.droitsMutation)}</td></tr>
                <tr><td className="px-4 py-3">Émoluments du notaire (barème réglementé, TVA comprise)</td><td className="px-4 py-3">Le notaire (et l&apos;État pour la TVA)</td><td className={`${td} text-right`}>{formatEuros(EX_250.ancien.emolumentsTTC)}</td></tr>
                <tr><td className="px-4 py-3">Contribution de sécurité immobilière (0,10 %)</td><td className="px-4 py-3">État</td><td className={`${td} text-right`}>{formatEuros(EX_250.ancien.csi)}</td></tr>
                <tr><td className="px-4 py-3">Formalités et débours (estimation)</td><td className="px-4 py-3">Administrations, syndic, géomètre…</td><td className={`${td} text-right`}>{formatEuros(EX_250.ancien.formalites)}</td></tr>
                <tr className="font-semibold text-[var(--color-text-strong)]"><td className="px-4 py-3" colSpan={2}>Total</td><td className={`${td} text-right`}>{formatEuros(EX_250.ancien.total)}</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="serif font-bold text-[21px] text-[var(--color-text-strong)] mt-10 mb-2">Les droits de mutation</h3>
          <p className={p}>
            C&apos;est le poste le plus lourd. Dans l&apos;ancien, il additionne la taxe départementale (5 % dans la plupart des
            départements), la taxe communale de 1,20 % et des frais d&apos;assiette égaux à 2,37 % de la taxe départementale.
            Le taux global atteint ainsi {formatPourcent(tauxGlobalAncien(5))} du prix dans un département à 5 %, et{" "}
            {formatPourcent(tauxGlobalAncien(4.5))} dans un département resté à 4,50 %.
          </p>

          <h3 className="serif font-bold text-[21px] text-[var(--color-text-strong)] mt-10 mb-2">Les émoluments du notaire</h3>
          <p className={p}>
            La rémunération du notaire pour une vente est fixée par l&apos;État (article A444-91 du Code de commerce) et identique
            dans toutes les études. Elle se calcule par tranches du prix, hors taxes :
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border-soft)] mb-4">
            <table className="w-full text-[14px]">
              <thead className="border-b border-[var(--color-border-soft)]">
                <tr><th className={th}>Tranche du prix</th><th className={`${th} text-right`}>Taux HT</th></tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-soft)]">
                <tr><td className="px-4 py-3">De 0 à 6 500 €</td><td className={`${td} text-right`}>3,870 %</td></tr>
                <tr><td className="px-4 py-3">De 6 500 € à 17 000 €</td><td className={`${td} text-right`}>1,596 %</td></tr>
                <tr><td className="px-4 py-3">De 17 000 € à 60 000 €</td><td className={`${td} text-right`}>1,064 %</td></tr>
                <tr><td className="px-4 py-3">Au-delà de 60 000 €</td><td className={`${td} text-right`}>0,799 %</td></tr>
              </tbody>
            </table>
          </div>
          <p className={p}>
            S&apos;y ajoute la TVA à 20 %. Pour 250 000 €, les émoluments s&apos;élèvent à {formatEuros(EX_250.ancien.emolumentsHT)} HT.
            Le notaire peut accorder une remise de 20 % au plus sur la part calculée au-delà de 100 000 € (article R444-10 du Code
            de commerce), à condition de l&apos;appliquer de la même façon à tous ses clients.
          </p>

          <h3 className="serif font-bold text-[21px] text-[var(--color-text-strong)] mt-10 mb-2">La contribution de sécurité immobilière et les débours</h3>
          <p className={p}>
            La contribution de sécurité immobilière rémunère l&apos;inscription de la vente au fichier immobilier : 0,10 % du prix,
            15 € au minimum. Les débours et émoluments de formalités couvrent les documents que le notaire obtient pour vous
            (cadastre, état hypothécaire, certificats d&apos;urbanisme, état daté du syndic). Ils varient selon le dossier : le
            simulateur retient un ordre de grandeur de {formatEuros(FORFAIT_FORMALITES_TTC)}.
          </p>

          <h2 className={h2}>Droits de mutation 2026 : le taux de votre département</h2>
          <p className={p}>
            La loi de finances pour 2025 permet aux départements de porter leur taux de 4,50 % à 5 %, du 1er avril 2025 au
            31 mars 2028. Au {DATE_BAREME}, presque tous l&apos;ont fait. Font exception :
          </p>
          <ul className="mb-4 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-[15px] text-[var(--color-muted)] list-disc pl-5">
            {EXCEPTIONS.map((d) => (
              <li key={d.code}>
                {d.nom} ({d.code}) : <strong className="text-[var(--color-text-strong)]">{formatPourcent(d.taux)}</strong>
              </li>
            ))}
          </ul>
          <details className="rounded-xl border border-[var(--color-border-soft)] mb-6">
            <summary className="cursor-pointer px-4 py-3 font-semibold text-[var(--color-text-strong)]">
              Voir le taux des {DEPARTEMENTS_FRAIS.length} départements
            </summary>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px]">
                <thead className="border-b border-[var(--color-border-soft)]">
                  <tr>
                    <th className={th}>Département</th>
                    <th className={`${th} text-right`}>Taux départemental</th>
                    <th className={`${th} text-right`}>Taux global (ancien)</th>
                    <th className={`${th} text-right`}>Primo-accédant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-soft)]">
                  {DEPARTEMENTS_FRAIS.map((d) => (
                    <tr key={d.code}>
                      <td className="px-4 py-2">{d.code} · {d.nom}</td>
                      <td className="px-4 py-2 tabular-nums text-right">{formatPourcent(d.taux)}</td>
                      <td className="px-4 py-2 tabular-nums text-right">{formatPourcent(tauxGlobalAncien(d.taux))}</td>
                      <td className="px-4 py-2 tabular-nums text-right">{formatPourcent(tauxGlobalAncien(d.tauxPrimo))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <p className={p}>
            Quelques départements prévoient en outre des abattements ou des taux réduits pour des situations particulières
            (vente par lots avec droit de préemption du locataire, acquisition d&apos;une première propriété…). Ils figurent au
            barème de la DGFiP et votre notaire les applique dans l&apos;acte.
          </p>

          <h2 className={h2}>Primo-accédants : rester à 4,50 %</h2>
          <p className={p}>
            La hausse à 5 % ne s&apos;applique pas à un primo-accédant qui achète sa résidence principale. Est primo-accédant
            l&apos;acheteur qui n&apos;a pas été propriétaire de sa résidence principale au cours des deux années précédant
            l&apos;achat. Sur un bien ancien à 250 000 € à Paris, l&apos;économie atteint{" "}
            <strong className="text-[var(--color-text-strong)]">{formatEuros(EX_250.ancien.total - EX_250.primo.total)}</strong>.
          </p>

          <h2 className={h2}>Neuf ou ancien : pourquoi un tel écart ?</h2>
          <p className={p}>
            Un logement neuf vendu pour la première fois dans les cinq ans de son achèvement (vente en l&apos;état futur
            d&apos;achèvement comprise) est soumis à la TVA, déjà incluse dans le prix. Les droits de mutation sont alors remplacés
            par une taxe de publicité foncière réduite : 0,70 %, plus 2,14 % de frais d&apos;assiette, soit 0,715 % du prix.
            Les émoluments du notaire, eux, restent les mêmes.
          </p>

          <h2 className={h2}>Exemples chiffrés (Paris, 2026)</h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border-soft)] mb-4">
            <table className="w-full text-[14px]">
              <thead className="border-b border-[var(--color-border-soft)]">
                <tr>
                  <th className={th}>Prix du bien</th>
                  <th className={`${th} text-right`}>Ancien</th>
                  <th className={`${th} text-right`}>Ancien, primo-accédant</th>
                  <th className={`${th} text-right`}>Neuf</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-soft)]">
                {EXEMPLES.map((e) => (
                  <tr key={e.prix}>
                    <td className={td}>{formatEuros(e.prix)}</td>
                    <td className={`${td} text-right`}>{formatEuros(e.ancien.total)} <span className="text-[var(--color-muted)]">({formatPourcent(e.ancien.pourcentage, 1)})</span></td>
                    <td className={`${td} text-right`}>{formatEuros(e.primo.total)} <span className="text-[var(--color-muted)]">({formatPourcent(e.primo.pourcentage, 1)})</span></td>
                    <td className={`${td} text-right`}>{formatEuros(e.neuf.total)} <span className="text-[var(--color-muted)]">({formatPourcent(e.neuf.pourcentage, 1)})</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-[var(--color-muted)] mb-4">
            Formalités et débours estimés à {formatEuros(FORFAIT_FORMALITES_TTC)}, sans remise sur les émoluments ni mobilier déduit.
          </p>

          <h2 className={h2}>Comment réduire légalement ses frais de notaire</h2>
          <ul className="space-y-3 mb-4 text-[16px] leading-relaxed text-[var(--color-muted)] list-disc pl-5">
            <li>
              <strong className="text-[var(--color-text-strong)]">Déduire le mobilier.</strong> Les meubles vendus avec le bien
              (cuisine équipée, électroménager, mobilier) ne supportent pas les droits de mutation. Ils doivent figurer sur une
              liste détaillée annexée à l&apos;acte, à leur valeur réelle : une estimation exagérée peut être redressée par
              l&apos;administration fiscale.
            </li>
            <li>
              <strong className="text-[var(--color-text-strong)]">Sortir les frais d&apos;agence de l&apos;assiette.</strong> Quand
              la commission est à la charge de l&apos;acheteur et mentionnée comme telle dans le compromis, elle n&apos;entre pas
              dans le prix soumis aux droits.
            </li>
            <li>
              <strong className="text-[var(--color-text-strong)]">Vérifier le statut de primo-accédant.</strong> S&apos;il
              s&apos;applique, il évite la hausse de 0,5 point dans la plupart des départements.
            </li>
            <li>
              <strong className="text-[var(--color-text-strong)]">Demander la remise sur les émoluments.</strong> Possible
              au-delà de 100 000 €, dans la limite de 20 % de la part concernée.
            </li>
          </ul>
          <p className={p}>
            Exemple : un appartement ancien à Paris affiché 260 000 €, dont 10 000 € de frais d&apos;agence à la charge de
            l&apos;acheteur et 8 000 € de mobilier, acheté par un primo-accédant :
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border-soft)] mb-4">
            <table className="w-full text-[14px]">
              <tbody className="divide-y divide-[var(--color-border-soft)]">
                {EXEMPLE_ECONOMIES.map((l) => (
                  <tr key={l.levier}>
                    <td className="px-4 py-3">{l.levier}</td>
                    <td className={`${td} text-right text-[var(--color-success)] font-semibold`}>
                      {l.appliquee ? "− " : "jusqu'à − "}{formatEuros(l.montant)}
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold text-[var(--color-text-strong)]">
                  <td className="px-4 py-3">Économie réelle des trois déductions cumulées (hors remise)</td>
                  <td className={`${td} text-right text-[var(--color-success)]`}>− {formatEuros(EXEMPLE_TOTAL)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className={h2}>Qui paie les frais de notaire, et quand ?</h2>
          <p className={p}>
            Sauf clause contraire (vente « acte en mains »), c&apos;est l&apos;acheteur. Le notaire réclame une provision au plus
            tard le jour de la signature, verse les impôts et paie les formalités, puis vous adresse un décompte définitif et vous
            rembourse l&apos;éventuel trop-perçu. Les frais de garantie de votre prêt (hypothèque ou caution) s&apos;ajoutent à cette
            somme.
          </p>

          <h2 className={h2}>Donation, succession, partage : d&apos;autres règles</h2>
          <p className={p}>
            Quand un bien est transmis par donation ou par succession, ce ne sont plus des droits de mutation « à titre onéreux »
            qui s&apos;appliquent, mais des droits de donation ou de succession, calculés sur la part de chacun après un abattement
            qui dépend du lien de parenté. Le simulateur ci-dessus traite aussi ces cas : choisissez l&apos;onglet correspondant.
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border-soft)] mb-6">
            <table className="w-full text-[14px]">
              <thead className="border-b border-[var(--color-border-soft)]">
                <tr><th className={th}>Lien avec le bénéficiaire</th><th className={`${th} text-right`}>Donation</th><th className={`${th} text-right`}>Succession</th></tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-soft)]">
                <tr><td className="px-4 py-3">Enfant, parent</td><td className={`${td} text-right`}>100 000 €</td><td className={`${td} text-right`}>100 000 €</td></tr>
                <tr><td className="px-4 py-3">Époux, partenaire de PACS</td><td className={`${td} text-right`}>80 724 €</td><td className={`${td} text-right`}>Exonéré</td></tr>
                <tr><td className="px-4 py-3">Petit-enfant</td><td className={`${td} text-right`}>31 865 €</td><td className={`${td} text-right`}>Celui du parent, par représentation</td></tr>
                <tr><td className="px-4 py-3">Arrière-petit-enfant</td><td className={`${td} text-right`}>5 310 €</td><td className={`${td} text-right`}>Celui du parent, par représentation</td></tr>
                <tr><td className="px-4 py-3">Frère, sœur</td><td className={`${td} text-right`}>15 932 €</td><td className={`${td} text-right`}>15 932 € (exonéré sous conditions)</td></tr>
                <tr><td className="px-4 py-3">Neveu, nièce</td><td className={`${td} text-right`}>7 967 €</td><td className={`${td} text-right`}>7 967 €</td></tr>
                <tr><td className="px-4 py-3">Autre personne</td><td className={`${td} text-right`}>Aucun</td><td className={`${td} text-right`}>1 594 €</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-[var(--color-muted)] -mt-3 mb-6">
            Abattements par donateur ou défunt et par bénéficiaire (CGI, art. 779, 788, 790 B à 790 F). Une personne handicapée
            bénéficie de 159 325 € en plus. Les abattements se reconstituent tous les 15 ans.
          </p>

          <h3 className="serif font-bold text-[21px] text-[var(--color-text-strong)] mt-10 mb-2">Droits en ligne directe (enfants, parents)</h3>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border-soft)] mb-4">
            <table className="w-full text-[14px]">
              <thead className="border-b border-[var(--color-border-soft)]">
                <tr><th className={th}>Part taxable, après abattement</th><th className={`${th} text-right`}>Taux</th></tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-soft)]">
                {[
                  ["Jusqu'à 8 072 €", "5 %"],
                  ["De 8 072 € à 12 109 €", "10 %"],
                  ["De 12 109 € à 15 932 €", "15 %"],
                  ["De 15 932 € à 552 324 €", "20 %"],
                  ["De 552 324 € à 902 838 €", "30 %"],
                  ["De 902 838 € à 1 805 677 €", "40 %"],
                  ["Au-delà de 1 805 677 €", "45 %"],
                ].map(([tranche, taux]) => (
                  <tr key={tranche}><td className="px-4 py-3">{tranche}</td><td className={`${td} text-right`}>{taux}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={p}>
            Entre frères et sœurs, le taux est de 35 % jusqu&apos;à 24 430 € puis 45 %. Il est de 55 % pour les neveux, nièces et
            cousins, et de 60 % entre personnes sans lien de parenté.
          </p>

          <h3 className="serif font-bold text-[21px] text-[var(--color-text-strong)] mt-10 mb-2">Donation d&apos;un bien immobilier</h3>
          <p className={p}>
            Aux droits de donation s&apos;ajoutent une taxe de publicité foncière de 0,60 % (plus 2,37 % de frais d&apos;assiette), la
            contribution de sécurité immobilière de 0,10 % et les émoluments du notaire : 4,837 % jusqu&apos;à 6 500 €, 1,995 %
            jusqu&apos;à 17 000 €, 1,330 % jusqu&apos;à 60 000 € et 0,998 % au-delà, hors TVA. Donner la seule nue-propriété en gardant
            l&apos;usufruit réduit fortement la valeur taxée : à 65 ans, elle ne représente que 60 % de la valeur du bien.
          </p>

          <h3 className="serif font-bold text-[21px] text-[var(--color-text-strong)] mt-10 mb-2">Succession comportant un bien immobilier</h3>
          <p className={p}>
            Le notaire établit l&apos;acte de notoriété (56,60 € HT), l&apos;attestation immobilière qui transfère le bien aux héritiers
            et, le plus souvent, la déclaration de succession, à déposer dans les 6 mois du décès. Ses émoluments suivent des barèmes
            propres (1,935 % puis 1,064 %, 0,726 % et 0,532 % au-delà de 30 000 € pour l&apos;attestation). S&apos;y ajoutent une taxe
            fixe de 125 € et la contribution de sécurité immobilière. Le conjoint survivant et le partenaire de PACS ne paient aucun
            droit de succession.
          </p>

          <h3 className="serif font-bold text-[21px] text-[var(--color-text-strong)] mt-10 mb-2">Partage après un divorce</h3>
          <p className={p}>
            Le partage des biens communs ou indivis supporte un droit de partage de 1,10 % de l&apos;actif net (après déduction du
            prêt restant dû) lorsqu&apos;il fait suite à un divorce, une séparation de corps ou la rupture d&apos;un PACS. Dans les autres
            cas, notamment entre héritiers, le taux est de 2,50 %. S&apos;y ajoutent les émoluments du notaire, calculés sur la valeur
            brute des biens, et la contribution de sécurité immobilière.
          </p>

          <h2 className={h2}>Les autres frais facturés lors d&apos;un achat</h2>
          <p className={p}>
            Le décompte du notaire et votre plan de financement comportent souvent d&apos;autres lignes, qui ne sont pas des
            « frais de notaire » au sens strict :
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border-soft)] mb-4">
            <table className="w-full text-[14px]">
              <thead className="border-b border-[var(--color-border-soft)]">
                <tr><th className={th}>Frais</th><th className={th}>Qui paie</th><th className={th}>Ordre de grandeur</th></tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-soft)] align-top">
                <tr><td className="px-4 py-3">Garantie du prêt : caution (Crédit Logement…)</td><td className="px-4 py-3">Acheteur</td><td className="px-4 py-3">1 à 1,5 % du montant emprunté, en partie restitué en fin de prêt</td></tr>
                <tr><td className="px-4 py-3">Garantie du prêt : hypothèque ou privilège de prêteur de deniers (acte notarié)</td><td className="px-4 py-3">Acheteur</td><td className="px-4 py-3">1 à 2 % du montant emprunté</td></tr>
                <tr><td className="px-4 py-3">Frais de dossier de la banque, courtage</td><td className="px-4 py-3">Acheteur</td><td className="px-4 py-3">Libres, souvent quelques centaines à quelques milliers d&apos;euros</td></tr>
                <tr><td className="px-4 py-3">Taxe foncière de l&apos;année, au prorata</td><td className="px-4 py-3">Acheteur, remboursée au vendeur</td><td className="px-4 py-3">Part de l&apos;année restant à courir après la signature, selon le compromis</td></tr>
                <tr><td className="px-4 py-3">Charges de copropriété du trimestre, au prorata</td><td className="px-4 py-3">Réparties entre vendeur et acheteur</td><td className="px-4 py-3">Selon le décompte du syndic</td></tr>
                <tr><td className="px-4 py-3">État daté du syndic</td><td className="px-4 py-3">Vendeur</td><td className="px-4 py-3">380 € TTC au maximum</td></tr>
                <tr><td className="px-4 py-3">Diagnostics, mainlevée d&apos;une hypothèque restante</td><td className="px-4 py-3">Vendeur</td><td className="px-4 py-3">Selon le bien et le prêt à solder</td></tr>
                <tr><td className="px-4 py-3">Honoraires de conseil du notaire hors tarif</td><td className="px-4 py-3">Celui qui les demande</td><td className="px-4 py-3">Libres, sur convention écrite préalable</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 rounded-2xl border border-[var(--color-border-soft)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
            <p className="serif font-bold text-[26px] leading-snug tracking-tight text-[var(--color-text-strong)]">
              Vous préparez un <span className="serif-accent">achat</span> ?
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-muted)] max-w-[560px] mx-auto">
              Un notaire spécialisé en immobilier relit le compromis, vérifie votre statut de primo-accédant et chiffre vos frais
              sur votre dossier réel. Rendez-vous en visio ou au cabinet.
            </p>
            <a
              href="/notaire-immobilier"
              className="mt-6 inline-block rounded-xl bg-[var(--color-primary)] px-6 py-3 text-[15px] font-bold text-white shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Trouver un notaire immobilier
            </a>
          </div>

          <h2 className={h2}>Sources</h2>
          <ul className="text-[14px] text-[var(--color-muted)] list-disc pl-5 space-y-1 mb-4">
            <li>
              <a className="text-[var(--color-primary)] hover:underline" href="https://www.impots.gouv.fr/sites/default/files/media/1_metier/3_partenaire/notaires/dmto/dmto_2026-06.pdf" rel="noopener" target="_blank">
                DGFiP : taux des droits d&apos;enregistrement et de la taxe de publicité foncière au 1er juin 2026
              </a>
            </li>
            <li>
              <a className="text-[var(--color-primary)] hover:underline" href="https://www.impots.gouv.fr/particulier/questions/jachete-un-bien-immobilier-quaurai-je-payer-comme-frais-au-notaire" rel="noopener" target="_blank">
                impots.gouv.fr : j&apos;achète un bien immobilier, qu&apos;aurai-je à payer comme frais au notaire ?
              </a>
            </li>
            <li>
              <a className="text-[var(--color-primary)] hover:underline" href="https://www.notaires.fr/fr/profession-notaire/le-tarif-du-notaire-emoluments-et-honoraires" rel="noopener" target="_blank">
                Notaires de France : le tarif du notaire, émoluments et honoraires
              </a>
            </li>
            <li>
              <a className="text-[var(--color-primary)] hover:underline" href="https://www.service-public.gouv.fr/particuliers/vosdroits/F14203" rel="noopener" target="_blank">
                service-public.gouv.fr : droits de donation
              </a>
            </li>
            <li>
              <a className="text-[var(--color-primary)] hover:underline" href="https://www.service-public.gouv.fr/particuliers/vosdroits/F14198" rel="noopener" target="_blank">
                service-public.gouv.fr : droits de succession
              </a>
            </li>
            <li>
              <a className="text-[var(--color-primary)] hover:underline" href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006179723/" rel="noopener" target="_blank">
                Légifrance : droit de partage (art. 746 du CGI)
              </a>
            </li>
          </ul>
          <p className="text-[13px] text-[var(--color-muted)]">
            Simulation indicative, à jour du barème au {DATE_BAREME}. Seul le décompte établi par votre notaire fait foi.
          </p>
        </article>

        <FAQ eyebrow="Questions fréquentes" title="Frais de notaire : vos questions" items={FAQ_ITEMS} />

        <nav aria-label="Pages liées" className="max-w-[820px] mx-auto px-6 pb-16">
          <ul className="flex flex-wrap gap-2 text-[14px]">
            {[
              ["/notaire-immobilier", "Notaire immobilier"],
              ["/blog/compromis-acte-de-vente-difference", "Compromis et acte de vente"],
              ["/blog/delai-signature-acte-notarie", "Délai de signature chez le notaire"],
              ["/blog/frais-notaire-neuf-vefa", "Frais de notaire dans le neuf (VEFA)"],
              ["/blog/frais-de-notaire-succession", "Frais de notaire d'une succession"],
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
