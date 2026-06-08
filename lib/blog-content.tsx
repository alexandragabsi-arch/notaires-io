import type { ReactNode } from "react";

/* ── Shared styled components ─────────────────────────────────────────────── */

function KeyPoints({ points }: { points: string[] }) {
  return (
    <div className="bg-[var(--color-tint-blue)] border-l-4 border-[var(--color-accent)] rounded-xl p-5 mb-8">
      <p className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
        Points clés
      </p>
      <ul className="flex flex-col gap-2">
        {points.map((pt, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-strong)]">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-[var(--color-accent)] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InternalCTA() {
  return (
    <div className="mt-12 bg-[var(--color-tint-blue)] rounded-2xl p-7 text-center">
      <p className="text-lg font-bold text-[var(--color-primary)] mb-2">
        Besoin de l&apos;avis d&apos;un notaire ?
      </p>
      <p className="text-sm text-[var(--color-muted)] mb-5">
        Le premier rendez-vous est offert. En visio ou au cabinet, en moins de 48 h.
      </p>
      <a
        href="/#hero"
        className="inline-block bg-gradient-cta text-white px-7 py-3 rounded-[10px] font-semibold shadow-[var(--shadow-cta)] hover:shadow-[var(--shadow-cta-hover)] transition-shadow"
      >
        Prendre rendez-vous avec un notaire
      </a>
    </div>
  );
}

/* ── Article 1 ────────────────────────────────────────────────────────────── */

function Article1() {
  return (
    <>
      <KeyPoints
        points={[
          "En l'absence de contrat de mariage, les époux sont automatiquement soumis au régime de la communauté légale réduite aux acquêts.",
          "La séparation de biens protège chaque époux des dettes de l'autre et facilite la gestion patrimoniale pour les entrepreneurs.",
          "La communauté universelle est un choix de protection maximale pour le conjoint survivant, mais peut défavoriser les enfants d'un premier lit.",
          "Le notaire est obligatoire pour établir un contrat de mariage avant la célébration, ou pour en modifier un après deux ans de mariage.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le régime légal par défaut</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        En France, lorsque deux personnes se marient sans rédiger de contrat de mariage chez un notaire, elles sont automatiquement soumises au <strong className="text-[var(--color-text-strong)]">régime de la communauté réduite aux acquêts</strong>. Ce régime, défini par les articles 1401 et suivants du Code civil, distingue les biens propres de chaque époux (ceux possédés avant le mariage ou reçus par donation ou succession) et les biens communs (tout ce qui est acquis pendant l'union, qu'il s'agisse de revenus, d'épargne ou de biens immobiliers).
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Concrètement, si vous achetez un appartement après votre mariage, il appartient pour moitié à chacun des époux, même si l'un a apporté davantage. Les dettes contractées pendant le mariage pour les besoins de la vie courante (loyer, alimentation, soins médicaux) engagent les deux époux solidairement. En cas de divorce, les biens communs sont partagés en deux parts égales, indépendamment des contributions réelles de chacun.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Ce régime convient à de nombreux couples, notamment ceux qui souhaitent une véritable mise en commun de leurs ressources et une égalité patrimoniale. Toutefois, il présente des risques pour les conjoints exerçant une activité professionnelle indépendante, car les créanciers professionnels peuvent potentiellement saisir les biens communs.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La séparation de biens</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le régime de <strong className="text-[var(--color-text-strong)]">séparation de biens</strong> (articles 1536 à 1543 du Code civil) est le plus choisi par les couples mariés disposant d'un contrat. Chaque époux conserve la propriété exclusive des biens qu'il possédait avant le mariage et de ceux qu'il acquiert pendant l'union. Il n'existe pas de patrimoine commun : les revenus de chacun lui appartiennent en propre.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Ce régime présente de nombreux avantages. D'abord, la <strong className="text-[var(--color-text-strong)]">protection face aux dettes</strong> : si l'un des époux est commerçant, artisan ou profession libérale, ses créanciers professionnels ne peuvent en principe pas saisir les biens personnels de l'autre conjoint. Ensuite, la <strong className="text-[var(--color-text-strong)]">simplification en cas de divorce</strong> : chacun repart avec ce qui lui appartient, sans nécessité de partage long et coûteux.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Mais la séparation de biens a aussi ses limites. Elle ne protège pas le conjoint économiquement plus faible, souvent celui qui a mis sa carrière entre parenthèses pour s'occuper des enfants. Pour pallier cette inégalité, il est possible d'introduire dans le contrat une <strong className="text-[var(--color-text-strong)]">clause d'adjonction de société d'acquêts</strong> : une masse de biens communs limitée (par exemple le logement familial) coexiste avec la séparation pour le reste du patrimoine.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Attention : en séparation de biens, lorsque les époux achètent ensemble un bien immobilier, ils deviennent co-propriétaires en indivision, selon leur contribution respective. Mieux vaut préciser les quotes-parts dans l'acte notarié.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La communauté universelle</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        À l'opposé de la séparation de biens, la <strong className="text-[var(--color-text-strong)]">communauté universelle</strong> (article 1526 du Code civil) fusionne l'intégralité des patrimoines des deux époux en une seule et même masse commune. Tous les biens — qu'ils aient été acquis avant ou après le mariage, reçus par donation ou succession — appartiennent indistinctement aux deux époux.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Ce régime est souvent associé à une <strong className="text-[var(--color-text-strong)]">clause d'attribution intégrale au conjoint survivant</strong> : en cas de décès, le survivant hérite automatiquement de la totalité du patrimoine commun, sans droits de succession entre époux (exonération totale depuis 2007). C'est un instrument puissant de protection du conjoint survivant.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Ses inconvénients sont néanmoins réels. Les enfants issus d'un premier lit peuvent se retrouver lésés, car ils n'hériteront qu'au décès du second conjoint. Par ailleurs, les dettes de chaque époux engagent l'ensemble du patrimoine commun. Ce régime convient surtout aux couples sans enfants d'unions précédentes ou disposant d'un patrimoine familial homogène.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le régime de participation aux acquêts</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Moins connu mais particulièrement équilibré, le <strong className="text-[var(--color-text-strong)]">régime de participation aux acquêts</strong> (articles 1569 à 1581 du Code civil) fonctionne comme la séparation de biens pendant la vie commune, puis comme une communauté à la dissolution du régime. Durant le mariage, chaque époux gère son patrimoine de manière indépendante. À la dissolution (divorce ou décès), on calcule l'enrichissement de chacun pendant l'union et la créance de participation est versée par l'époux le plus enrichi à l'autre.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Ce régime est idéal pour les couples souhaitant l'indépendance patrimoniale au quotidien, tout en préservant une certaine équité à long terme. Toutefois, sa complexité technique rend son application contentieuse en cas de désaccord sur les valorisations, notamment pour les patrimoines professionnels ou les biens difficiles à évaluer.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment choisir ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le choix d'un régime matrimonial dépend de votre situation personnelle, professionnelle et patrimoniale :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6">
        {[
          ["Vous êtes entrepreneur ou exercez une profession à risque", "Optez pour la séparation de biens pour protéger votre conjoint de vos dettes professionnelles."],
          ["Vous souhaitez protéger un conjoint sans revenus propres", "La communauté universelle avec attribution intégrale est la solution la plus efficace."],
          ["Vous avez des enfants d'une première union", "Évitez la communauté universelle sans conseils approfondis ; préférez une séparation de biens avec libéralités ciblées."],
          ["Votre patrimoine est similaire et vous démarrez ensemble", "La communauté légale par défaut peut suffire, ou la participation aux acquêts si vous valorisez l'indépendance."],
        ].map(([situation, conseil], i) => (
          <li key={i} className="flex gap-3 p-4 bg-[var(--color-tint-blue)] rounded-xl text-sm">
            <span className="shrink-0 font-bold text-[var(--color-accent)]">→</span>
            <div>
              <strong className="text-[var(--color-text-strong)] block mb-0.5">{situation}</strong>
              <span className="text-[var(--color-muted)]">{conseil}</span>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle du notaire</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La rédaction d'un contrat de mariage est un <strong className="text-[var(--color-text-strong)]">acte authentique</strong> qui doit obligatoirement être établi par un notaire avant la célébration du mariage (article 1394 du Code civil). Le notaire recueille votre consentement éclairé, vous informe sur les conséquences juridiques et fiscales de chaque régime, et transmet le certificat de notaire à l'officier d'état civil.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Il est possible de <strong className="text-[var(--color-text-strong)]">changer de régime matrimonial</strong> après deux ans d'application, toujours devant notaire. La procédure est simplifiée depuis 2007 : sauf opposition des créanciers ou des enfants majeurs, le changement est homologué sans passer par le tribunal.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les émoluments du notaire pour la rédaction d'un contrat de mariage sont <strong className="text-[var(--color-text-strong)]">réglementés par l'État</strong> : 371,48 € HT, soit 445,78 € TTC. Auxquels s'ajoutent les débours (environ 50 à 100 €). Le coût total est généralement compris entre <strong className="text-[var(--color-text-strong)]">500 et 620 €</strong>, quelle que soit la région ou la complexité du contrat.
      </p>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Chez Notaires.io, vous pouvez <a href="/notaire-contrat-mariage" className="text-[var(--color-accent)] font-semibold hover:underline">trouver un notaire spécialisé en contrat de mariage</a> ou prendre rendez-vous pour un <a href="/notaire-mariage-pacs" className="text-[var(--color-accent)] font-semibold hover:underline">conseil mariage et PACS</a> dès aujourd'hui.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Article 2 ────────────────────────────────────────────────────────────── */

function Article2() {
  return (
    <>
      <KeyPoints
        points={[
          "Les frais de notaire représentent 7 à 8 % du prix d'achat dans l'immobilier ancien, contre 2 à 3 % dans le neuf.",
          "Ils se composent principalement des droits de mutation (taxe fiscale), des émoluments du notaire et des débours (frais avancés).",
          "Les droits de mutation s'élèvent à environ 5,80 % pour la grande majorité des biens anciens en France.",
          "Les émoluments notariaux sont réglementés et calculés selon un barème dégressif fixé par décret.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Pourquoi parle-t-on de « frais de notaire » ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        L'expression « frais de notaire » est en réalité un abus de langage : la grande majorité de ces sommes ne revient pas au notaire lui-même. Il s'agit plutôt des <strong className="text-[var(--color-text-strong)]">frais d'acquisition</strong>, qui regroupent des taxes collectées pour le compte de l'État et des collectivités locales, des débours (frais avancés par le notaire pour votre compte) et seulement une petite partie correspond aux honoraires réglementés du notaire (les émoluments).
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Ces frais sont dus par <strong className="text-[var(--color-text-strong)]">l'acquéreur</strong> lors de tout achat immobilier. Ils sont versés au notaire qui les répartit ensuite entre les différents bénéficiaires (État, département, commune, etc.). Voici comment ils se décomposent en détail.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les droits de mutation : la plus grande part</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les <strong className="text-[var(--color-text-strong)]">droits de mutation à titre onéreux (DMTO)</strong> constituent environ 80 % des frais d'acquisition d'un bien ancien. Ils se composent de :
      </p>
      <ul className="list-none flex flex-col gap-2 mb-6">
        {[
          ["Taxe départementale", "4,50 % (la majorité des départements ont opté pour ce taux maximum, sauf rares exceptions à 3,80 %)"],
          ["Taxe communale", "1,20 % (reversée aux communes)"],
          ["Frais d'assiette de recouvrement", "0,10 % (frais de perception de l'État)"],
          ["Total approximatif", "5,80 % du prix de vente net vendeur"],
        ].map(([label, val], i) => (
          <li key={i} className="grid grid-cols-[auto_1fr] gap-3 p-3 bg-[var(--color-tint-blue)] rounded-xl text-sm">
            <strong className="text-[var(--color-text-strong)] shrink-0">{label} :</strong>
            <span className="text-[var(--color-muted)]">{val}</span>
          </li>
        ))}
      </ul>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Dans le neuf (achat en VEFA — Vente en l'État Futur d'Achèvement), les droits de mutation sont réduits à <strong className="text-[var(--color-text-strong)]">0,715 %</strong>, ce qui explique pourquoi les frais globaux sont bien moins élevés que dans l'ancien.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les émoluments du notaire</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les <strong className="text-[var(--color-text-strong)]">émoluments</strong> sont la rémunération réglementée du notaire, fixée par décret (article A444-91 du Code de commerce). Ils sont calculés selon un barème dégressif sur le prix de vente :
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--color-tint-blue)]">
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Tranche du prix</th>
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Taux</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["De 0 à 6 500 €", "3,870 %"],
              ["De 6 500 € à 17 000 €", "1,596 %"],
              ["De 17 000 € à 60 000 €", "1,064 %"],
              ["Au-delà de 60 000 €", "0,799 %"],
            ].map(([tr, tx], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3 text-[var(--color-muted)] border border-[var(--color-border)]">{tr}</td>
                <td className="p-3 text-[var(--color-text-strong)] font-semibold border border-[var(--color-border)]">{tx}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Des émoluments minimum sont également prévus par décret. La TVA à 20 % s'applique sur les émoluments du notaire.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les débours</h2>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Les <strong className="text-[var(--color-text-strong)]">débours</strong> correspondent aux sommes que le notaire avance pour votre compte afin de réaliser les formalités nécessaires à la transaction : publication au fichier immobilier (anciennement conservation des hypothèques), frais de géomètre, documents d'urbanisme, copies d'actes, etc. Ces frais varient généralement entre 300 et 1 000 €.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Exemples chiffrés réels</h2>
      <div className="grid sm:grid-cols-3 gap-5 mb-6">
        {[
          {
            prix: "200 000 €",
            type: "Bien ancien",
            droits: "11 600 €",
            emoluments: "1 490 €",
            debours: "600 €",
            total: "~ 13 690 €",
            pct: "6,85 %",
          },
          {
            prix: "350 000 €",
            type: "Bien ancien",
            droits: "20 300 €",
            emoluments: "2 040 €",
            debours: "700 €",
            total: "~ 23 040 €",
            pct: "6,58 %",
          },
          {
            prix: "500 000 €",
            type: "Bien ancien",
            droits: "29 000 €",
            emoluments: "2 580 €",
            debours: "800 €",
            total: "~ 32 380 €",
            pct: "6,47 %",
          },
        ].map((ex, i) => (
          <div key={i} className="border border-[var(--color-border)] rounded-2xl p-5 bg-white">
            <p className="text-xl font-extrabold text-[var(--color-primary)] mb-1">{ex.prix}</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)] mb-4">{ex.type}</p>
            <ul className="flex flex-col gap-1.5 text-sm mb-4">
              <li className="flex justify-between"><span className="text-[var(--color-muted)]">Droits de mutation</span><span className="font-semibold">{ex.droits}</span></li>
              <li className="flex justify-between"><span className="text-[var(--color-muted)]">Émoluments</span><span className="font-semibold">{ex.emoluments}</span></li>
              <li className="flex justify-between"><span className="text-[var(--color-muted)]">Débours</span><span className="font-semibold">{ex.debours}</span></li>
            </ul>
            <div className="border-t border-[var(--color-border-soft)] pt-3 flex justify-between items-center">
              <span className="font-bold text-[var(--color-text-strong)]">Total estimé</span>
              <span className="text-[var(--color-accent)] font-extrabold">{ex.total}</span>
            </div>
            <p className="text-right text-[12px] text-[var(--color-muted)] mt-1">soit {ex.pct} du prix</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Peut-on réduire les frais de notaire ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les droits de mutation étant fixés par la loi, il n'est pas possible de les négocier. Cependant, plusieurs stratégies permettent d'en réduire l'assiette :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6 text-sm">
        {[
          "Déduire le prix des meubles et équipements inclus dans la vente (cuisine équipée, luminaires, placards) en les valorisant séparément dans le compromis — les droits de mutation ne s'appliquent pas sur les meubles.",
          "Négocier les honoraires d'agence séparément si l'acheteur les supporte, afin qu'ils ne s'incorporent pas dans l'assiette taxable.",
          "Pour un bien neuf en VEFA, les frais de notaire se limitent à 2-3 % du prix de vente : un avantage considérable pour les investisseurs.",
        ].map((item, i) => (
          <li key={i} className="flex gap-2 p-4 bg-[var(--color-tint-blue)] rounded-xl">
            <span className="text-[var(--color-accent)] font-bold shrink-0">✓</span>
            <span className="text-[var(--color-muted)]">{item}</span>
          </li>
        ))}
      </ul>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Pour tout projet d'acquisition, <a href="/notaire-immobilier" className="text-[var(--color-accent)] font-semibold hover:underline">un notaire spécialisé en immobilier</a> peut vous accompagner, notamment à <a href="/notaire-paris" className="text-[var(--color-accent)] font-semibold hover:underline">Paris</a> et dans les grandes villes françaises.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Article 3 ────────────────────────────────────────────────────────────── */

function Article3() {
  return (
    <>
      <KeyPoints
        points={[
          "La déclaration de succession doit être déposée dans les 6 mois suivant le décès en France (12 mois si le décès a lieu à l'étranger).",
          "Une succession simple (peu d'héritiers, pas d'immobilier, pas de conflit) peut être réglée en 3 à 6 mois.",
          "Les successions complexes (immobilier, entreprise, héritiers nombreux ou en désaccord) peuvent prendre 1 à 3 ans, voire plus.",
          "Des pénalités de retard s'appliquent si la déclaration fiscale n'est pas déposée dans les délais.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Pourquoi le règlement d'une succession prend-il du temps ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le règlement d'une succession est un processus en plusieurs étapes, chacune ayant ses propres délais légaux ou pratiques. Entre les formalités administratives, la réunion des documents, l'inventaire du patrimoine et l'accord entre les héritiers, le processus peut s'étirer sur plusieurs mois ou années selon la complexité du dossier.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        La loi impose cependant un délai impératif : la <strong className="text-[var(--color-text-strong)]">déclaration de succession auprès des impôts</strong> doit être déposée dans les 6 mois suivant le décès. Passé ce délai, des intérêts de retard (0,20 % par mois) et des majorations (10 % à 80 % selon les circonstances) s'appliquent sur les droits de succession dus.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les étapes d'une succession</h2>

      <h3 className="text-lg font-bold text-[var(--color-text-strong)] mt-6 mb-3">1. Les premières démarches (semaines 1 à 4)</h3>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Dès le décès, plusieurs démarches urgentes s'imposent : déclaration de décès en mairie, organisation des obsèques, prévention de la banque du défunt (blocage des comptes), recherche d'un éventuel testament ou d'un contrat d'assurance-vie. C'est également le moment de mandater un notaire qui centralisera l'ensemble des démarches.
      </p>

      <h3 className="text-lg font-bold text-[var(--color-text-strong)] mt-6 mb-3">2. L'acte de notoriété (mois 1 à 2)</h3>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le notaire établit un <strong className="text-[var(--color-text-strong)]">acte de notoriété</strong> qui identifie les héritiers légaux du défunt. Ce document est indispensable pour débloquer les comptes bancaires et accéder au logement. Il nécessite la production de l'acte de décès, des actes d'état civil des héritiers et la vérification de l'absence de dispositions testamentaires contraires.
      </p>

      <h3 className="text-lg font-bold text-[var(--color-text-strong)] mt-6 mb-3">3. L'inventaire du patrimoine (mois 1 à 3)</h3>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le notaire rassemble tous les éléments de l'actif et du passif de la succession : comptes bancaires, immobilier, placements financiers, véhicules, bijoux, dettes, prêts en cours, etc. Pour les biens immobiliers, une <strong className="text-[var(--color-text-strong)]">évaluation à la valeur vénale</strong> est nécessaire. Pour les entreprises ou les parts sociales, une expertise peut s'imposer.
      </p>

      <h3 className="text-lg font-bold text-[var(--color-text-strong)] mt-6 mb-3">4. La déclaration de succession (avant 6 mois)</h3>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le notaire rédige la <strong className="text-[var(--color-text-strong)]">déclaration de succession</strong> qui récapitule l'ensemble de l'actif net taxable et calcule les droits de succession dus par chaque héritier, après application des abattements légaux (100 000 € par enfant, 15 932 € entre frères et sœurs, etc.). Cette déclaration est déposée auprès du Service de Publicité Foncière (SPF) et des impôts.
      </p>

      <h3 className="text-lg font-bold text-[var(--color-text-strong)] mt-6 mb-3">5. Le partage de la succession</h3>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Une fois les droits de succession réglés, les héritiers peuvent procéder au <strong className="text-[var(--color-text-strong)]">partage</strong> de la succession. Si le patrimoine comprend des biens immobiliers, le notaire rédige un acte de partage notarié. Si tous les héritiers s'accordent, cette étape peut être rapide. En cas de désaccord, un partage judiciaire devant le tribunal judiciaire sera nécessaire, ce qui allonge considérablement les délais.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Succession simple vs succession complexe</h2>
      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-[var(--color-tint-green)] border border-green-100 rounded-2xl p-5">
          <p className="font-bold text-green-800 mb-3">Succession simple (3–6 mois)</p>
          <ul className="text-sm text-green-700 flex flex-col gap-2">
            {[
              "1 ou 2 héritiers en ligne directe",
              "Pas de bien immobilier",
              "Épargne et comptes bancaires uniquement",
              "Bonne entente entre héritiers",
              "Pas de testament contesté",
            ].map((item, i) => <li key={i}>✓ {item}</li>)}
          </ul>
        </div>
        <div className="bg-[var(--color-tint-rose)] border border-red-100 rounded-2xl p-5">
          <p className="font-bold text-red-800 mb-3">Succession complexe (1–3 ans+)</p>
          <ul className="text-sm text-red-700 flex flex-col gap-2">
            {[
              "Nombreux héritiers, familles recomposées",
              "Bien immobilier (surtout à valoriser)",
              "Entreprise, parts sociales, patrimoine international",
              "Héritiers en désaccord",
              "Testament contesté ou dons à rapporter",
            ].map((item, i) => <li key={i}>✗ {item}</li>)}
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les délais légaux à retenir absolument</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--color-tint-blue)]">
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Démarche</th>
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Délai</th>
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Conséquence en cas de retard</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Déclaration de succession (France)", "6 mois", "Pénalités + intérêts de retard"],
              ["Déclaration de succession (décès à l'étranger)", "12 mois", "Pénalités + intérêts de retard"],
              ["Option héritier : acceptation/renonciation", "4 mois (ou 10 ans pour l'État)", "Acceptation présumée après mise en demeure"],
              ["Recours pour recel successoral", "5 ans", "Prescription de l'action en justice"],
            ].map(([d, dl, c], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3 text-[var(--color-muted)] border border-[var(--color-border)]">{d}</td>
                <td className="p-3 text-[var(--color-text-strong)] font-bold border border-[var(--color-border)]">{dl}</td>
                <td className="p-3 text-[var(--color-muted)] border border-[var(--color-border)]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment accélérer le règlement d'une succession ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Plusieurs actions permettent de fluidifier le traitement d'un dossier de succession :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6 text-sm">
        {[
          "Réunir rapidement tous les documents administratifs : livret de famille, actes de propriété, relevés bancaires, contrats d'assurance-vie.",
          "Désigner un mandataire unique parmi les héritiers pour centraliser les communications avec le notaire.",
          "Anticiper les désaccords potentiels en optant pour la médiation notariale plutôt que pour le contentieux judiciaire.",
          "Si le patrimoine inclut une entreprise, faire réaliser une évaluation par un expert-comptable dès le début.",
        ].map((item, i) => (
          <li key={i} className="flex gap-2 p-4 bg-[var(--color-tint-blue)] rounded-xl">
            <span className="text-[var(--color-accent)] font-bold shrink-0">✓</span>
            <span className="text-[var(--color-muted)]">{item}</span>
          </li>
        ))}
      </ul>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Pour engager un <a href="/notaire-succession" className="text-[var(--color-accent)] font-semibold hover:underline">notaire spécialisé en succession</a>, Notaires.io vous met en relation avec des professionnels disponibles rapidement.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Article 4 ────────────────────────────────────────────────────────────── */

function Article4() {
  return (
    <>
      <KeyPoints
        points={[
          "Le PACS ne crée pas de droits successoraux automatiques : le partenaire ne figure pas parmi les héritiers légaux.",
          "Le mariage confère une protection successorale au conjoint, notamment via la réserve héréditaire et le droit au logement.",
          "Sur le plan fiscal, le PACS et le mariage sont quasi équivalents pour l'imposition des revenus (déclaration commune).",
          "Le notaire intervient dans les deux cas pour établir une convention de PACS notariée ou un contrat de mariage.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Présentation rapide des deux statuts</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le <strong className="text-[var(--color-text-strong)]">Pacte Civil de Solidarité (PACS)</strong>, créé en 1999, est un contrat entre deux personnes majeures pour organiser leur vie commune. Il est conclu soit en mairie (depuis 2017), soit chez un notaire. Le <strong className="text-[var(--color-text-strong)]">mariage</strong>, institution millénaire, est une union civile et/ou religieuse créant des droits et obligations beaucoup plus larges, notamment en matière successorale.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Si les deux statuts permettent une déclaration d'impôts commune et ouvrent des droits similaires sur de nombreux points, des différences fondamentales subsistent — notamment dans les domaines de la succession, de la protection sociale et de la séparation.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Tableau comparatif PACS / Mariage</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--color-tint-blue)]">
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Critère</th>
              <th className="text-left p-3 font-bold text-[var(--color-accent)] border border-[var(--color-border)]">PACS</th>
              <th className="text-left p-3 font-bold text-[var(--color-primary)] border border-[var(--color-border)]">Mariage</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Succession légale", "Aucun droit (sauf testament)", "Héritier légal en l'absence d'enfants"],
              ["Droits de succession", "Exonération totale (avec testament)", "Exonération totale"],
              ["Imposition commune", "Oui, dès la même année", "Oui, à compter de l'année du mariage"],
              ["Régime patrimonial par défaut", "Séparation de biens", "Communauté réduite aux acquêts"],
              ["Protection du logement", "Limitée (cotitularité si bail commun)", "Forte (droit viager au logement)"],
              ["Séparation", "Simple déclaration unilatérale", "Procédure de divorce (consentement mutuel possible)"],
              ["Pension de réversion", "Aucun droit", "50 % de la retraite du défunt"],
              ["Adoption plénière", "Oui (depuis 2013)", "Oui"],
              ["Formalités", "Mairie ou notaire", "Mairie (+ notaire pour contrat de mariage)"],
            ].map(([crit, pacs, mar], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3 font-semibold text-[var(--color-text-strong)] border border-[var(--color-border)]">{crit}</td>
                <td className="p-3 text-[var(--color-muted)] border border-[var(--color-border)]">{pacs}</td>
                <td className="p-3 text-[var(--color-muted)] border border-[var(--color-border)]">{mar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La différence cruciale : la succession</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        C'est sur la <strong className="text-[var(--color-text-strong)]">succession</strong> que PACS et mariage divergent le plus radicalement. En l'absence de testament, le conjoint marié est un héritier légal protégé : en présence d'enfants, il hérite d'un quart de la succession en pleine propriété ; sans enfants ni ascendants, il peut hériter de la totalité. Il bénéficie également d'un <strong className="text-[var(--color-text-strong)]">droit temporaire puis viager au logement</strong>.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le partenaire pacsé, en revanche, n'est pas héritier légal. Sans testament, il ne perçoit rien de la succession. Pour le protéger, il est donc indispensable de rédiger un <strong className="text-[var(--color-text-strong)]">testament</strong> (olographe ou authentique chez le notaire). Si le défunt a des enfants, ces derniers disposent d'une réserve héréditaire qui limite la quotité disponible que l'on peut léguer au partenaire.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Sur le plan fiscal, les deux statuts sont identiques : depuis 2007, <strong className="text-[var(--color-text-strong)]">le conjoint marié et le partenaire pacsé sont exonérés de droits de succession</strong> sur les biens reçus du défunt.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La pension de réversion : un avantage exclusif du mariage</h2>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">pension de réversion</strong> est versée par les caisses de retraite au conjoint survivant d'un assuré décédé (généralement 50 à 60 % de la retraite du défunt). Elle est réservée exclusivement aux conjoints mariés. Les partenaires pacsés n'y ont pas droit, ce qui peut représenter une perte financière très significative pour des couples âgés.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Quand faire appel à un notaire ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Plusieurs situations nécessitent l'intervention d'un notaire pour les couples pacsés ou mariés :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6 text-sm">
        {[
          "Rédaction d'un testament pour protéger le partenaire pacsé en cas de décès.",
          "Rédaction d'une convention de PACS notariée, permettant de choisir la communauté de biens (régime d'indivision des acquêts).",
          "Rédaction d'un contrat de mariage pour adapter le régime légal à votre situation patrimoniale.",
          "Achat immobilier en couple, pour définir les quotes-parts de propriété et les clauses de tontiné.",
          "Donation entre partenaires ou conjoints pour avantager le survivant au-delà des règles légales.",
        ].map((item, i) => (
          <li key={i} className="flex gap-2 p-4 bg-[var(--color-tint-blue)] rounded-xl">
            <span className="text-[var(--color-accent)] font-bold shrink-0">→</span>
            <span className="text-[var(--color-muted)]">{item}</span>
          </li>
        ))}
      </ul>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Pour toutes ces démarches, <a href="/notaire-mariage-pacs" className="text-[var(--color-accent)] font-semibold hover:underline">un notaire spécialisé en mariage et PACS</a> est disponible sur Notaires.io.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Article 5 ────────────────────────────────────────────────────────────── */

function Article5() {
  return (
    <>
      <KeyPoints
        points={[
          "Le premier rendez-vous notaire est offert chez Notaires.io : 30 minutes en visio ou au cabinet, sans engagement.",
          "Vous pouvez aborder tout projet nécessitant l'intervention d'un notaire : immobilier, succession, mariage, donation, société.",
          "Pour optimiser votre consultation, préparez vos documents et vos questions à l'avance.",
          "Après la consultation gratuite, le notaire vous proposera un devis transparent si votre projet nécessite un suivi.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment fonctionne l'offre Notaires.io ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Chez Notaires.io, nous sommes convaincus que tout projet patrimonial ou juridique mérite d'abord une bonne information. C'est pourquoi nous offrons un <strong className="text-[var(--color-text-strong)]">premier rendez-vous de 30 minutes</strong> avec un notaire en exercice — sans frais, sans engagement, et sans surprise.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le fonctionnement est simple :
      </p>
      <ol className="list-none flex flex-col gap-3 mb-6 text-sm">
        {[
          ["Vous décrivez votre projet", "En répondant à 3 questions sur notre plateforme, vous nous indiquez votre besoin (immobilier, succession, mariage, etc.) et votre localisation."],
          ["Nous vous proposons un notaire", "Notre algorithme sélectionne le notaire le plus adapté à votre situation parmi notre réseau de professionnels certifiés."],
          ["Vous prenez rendez-vous", "Choisissez un créneau dans l'agenda du notaire, en visio (Zoom, Teams ou notre outil intégré) ou en présentiel à son cabinet."],
          ["La consultation a lieu", "30 minutes d'échange privilégié avec un professionnel. Vous posez toutes vos questions, il vous éclaire sur vos options."],
          ["Un devis vous est remis si nécessaire", "Si votre projet requiert un acte notarié, le notaire vous remet un devis détaillé et transparent."],
        ].map(([titre, desc], i) => (
          <li key={i} className="flex gap-3 p-4 bg-[var(--color-tint-blue)] rounded-xl">
            <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
            <div>
              <strong className="text-[var(--color-text-strong)] block mb-0.5">{titre}</strong>
              <span className="text-[var(--color-muted)]">{desc}</span>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Ce qu'on peut aborder en 30 minutes</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Une consultation de 30 minutes est suffisante pour obtenir un premier cadrage de la plupart des situations notariales courantes :
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {[
          { cat: "Immobilier", items: ["Comprendre les frais d'un achat", "Sécuriser un compromis", "Régulariser une vente de gré à gré", "Droits liés à un héritage immobilier"] },
          { cat: "Famille", items: ["Choisir son régime matrimonial", "Comparer PACS et mariage", "Protéger son concubin", "Rédiger un testament simple"] },
          { cat: "Succession", items: ["Évaluer les droits de succession", "Comprendre les étapes du règlement", "Savoir si renoncer est judicieux", "Anticiper une succession complexe"] },
          { cat: "Donation & Patrimoine", items: ["Connaître les abattements fiscaux", "Choisir entre donation simple et partage", "Optimiser la transmission d'une entreprise", "Transmettre en nue-propriété"] },
        ].map((bloc) => (
          <div key={bloc.cat} className="border border-[var(--color-border)] rounded-2xl p-5">
            <p className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">{bloc.cat}</p>
            <ul className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
              {bloc.items.map((item, i) => <li key={i}>→ {item}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment se préparer à votre consultation ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Pour tirer le maximum de vos 30 minutes, voici quelques conseils pratiques :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6 text-sm">
        {[
          "Listez vos questions par ordre de priorité. Un notaire peut aborder 3 à 5 questions en profondeur en 30 minutes.",
          "Rassemblez les documents pertinents selon votre projet : titre de propriété, acte de décès, contrat de mariage, statuts de société.",
          "Notez les chiffres clés : valeur du bien immobilier, montant de l'épargne, répartition du patrimoine, âge des enfants.",
          "Si c'est pour un projet en couple, venez à deux (ou connectez-vous en visio en même temps) pour que chacun puisse poser ses questions.",
        ].map((item, i) => (
          <li key={i} className="flex gap-2 p-4 bg-[var(--color-tint-blue)] rounded-xl">
            <span className="text-[var(--color-accent)] font-bold shrink-0">✓</span>
            <span className="text-[var(--color-muted)]">{item}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Questions fréquentes</h2>
      <div className="flex flex-col gap-4 mb-6">
        {[
          ["Est-ce vraiment gratuit ?", "Oui, la première consultation est entièrement offerte, sans aucune condition d'achat ou de signature d'acte par la suite."],
          ["Le notaire consulté sera-t-il celui qui traite mon dossier ?", "Pas nécessairement, mais nous faisons en sorte que le notaire choisi pour votre consultation soit disponible pour suivre votre dossier si vous le souhaitez."],
          ["Puis-je consulter sur plusieurs sujets ?", "Oui, à condition de le mentionner lors de votre prise de rendez-vous pour que le notaire puisse se préparer."],
          ["La consultation visio est-elle aussi complète qu'en présentiel ?", "Oui. Les notaires de notre réseau sont habitués aux consultations en visio et peuvent vous conseiller efficacement à distance."],
        ].map(([q, r], i) => (
          <div key={i} className="border border-[var(--color-border)] rounded-2xl p-5">
            <p className="font-bold text-[var(--color-text-strong)] mb-2">{q}</p>
            <p className="text-sm text-[var(--color-muted)]">{r}</p>
          </div>
        ))}
      </div>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Prêt à vous lancer ? <a href="/#hero" className="text-[var(--color-accent)] font-semibold hover:underline">Prenez rendez-vous directement sur notre page d'accueil</a> ou <a href="/annuaire" className="text-[var(--color-accent)] font-semibold hover:underline">parcourez notre annuaire de notaires</a> pour choisir le vôtre.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Article 6 ────────────────────────────────────────────────────────────── */

function Article6() {
  return (
    <>
      <KeyPoints
        points={[
          "Chaque enfant bénéficie d'un abattement de 100 000 € tous les 15 ans sur les donations reçues de chacun de ses parents.",
          "La donation en nue-propriété permet de transmettre un bien en conservant l'usufruit (droit d'usage et de jouissance) jusqu'au décès.",
          "La donation-partage fige la valeur des biens au jour de la donation, évitant les litiges lors du règlement de la succession.",
          "L'assurance-vie reste un des outils les plus efficaces pour transmettre jusqu'à 152 500 € par bénéficiaire hors droits de succession.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Pourquoi donner de son vivant ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La transmission du patrimoine en France est soumise à des droits de succession qui peuvent atteindre <strong className="text-[var(--color-text-strong)]">45 % pour les montants les plus élevés en ligne directe</strong>. Donner de son vivant permet de réduire significativement la facture fiscale grâce à des abattements renouvelables, tout en voyant ses proches profiter de la transmission.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        C'est aussi l'occasion d'<strong className="text-[var(--color-text-strong)]">organiser de son vivant la répartition de son patrimoine</strong>, d'éviter les conflits entre héritiers et de s'assurer que les biens vont là où on le souhaite. Le notaire joue un rôle central dans ce processus, tant pour la rédaction des actes que pour le conseil patrimonial.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les abattements fiscaux en ligne directe</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        L'abattement principal est de <strong className="text-[var(--color-text-strong)]">100 000 € par enfant et par parent, renouvelable tous les 15 ans</strong>. Cela signifie qu'un couple avec deux enfants peut transmettre 400 000 € sans aucun droit de donation (100 000 × 2 parents × 2 enfants), si les donations sont espacées de 15 ans.
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--color-tint-blue)]">
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Lien avec le donateur</th>
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Abattement</th>
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Renouvellement</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Enfant", "100 000 €", "Tous les 15 ans"],
              ["Petit-enfant", "31 865 €", "Tous les 15 ans"],
              ["Arrière-petit-enfant", "5 310 €", "Tous les 15 ans"],
              ["Conjoint / partenaire pacsé", "80 724 €", "Tous les 15 ans"],
              ["Frère ou sœur", "15 932 €", "Tous les 15 ans"],
              ["Don familial (espèces, 18–80 ans)", "+ 31 865 € (enfant/petit-enfant/neveu)", "Tous les 15 ans"],
            ].map(([lien, aba, ren], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3 text-[var(--color-muted)] border border-[var(--color-border)]">{lien}</td>
                <td className="p-3 text-[var(--color-text-strong)] font-bold border border-[var(--color-border)]">{aba}</td>
                <td className="p-3 text-[var(--color-muted)] border border-[var(--color-border)]">{ren}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La donation en nue-propriété : transmettre sans se dépouiller</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le <strong className="text-[var(--color-text-strong)]">démembrement de propriété</strong> consiste à séparer l'usufruit (droit d'utiliser le bien et d'en percevoir les revenus) de la nue-propriété (droit de disposer du bien). En donnant la nue-propriété à ses enfants et en conservant l'usufruit, le donateur peut continuer à habiter son logement ou à percevoir les loyers jusqu'à son décès.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        L'avantage fiscal est double : d'une part, la donation n'est taxée que sur la <strong className="text-[var(--color-text-strong)]">valeur de la nue-propriété</strong> (qui dépend de l'âge du donateur — plus il est jeune, plus la nue-propriété est faible), et d'autre part, au décès de l'usufruitier, les enfants récupèrent la pleine propriété <strong className="text-[var(--color-text-strong)]">sans aucun droit de succession supplémentaire</strong>.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        À titre d'exemple, si un parent de 65 ans donne la nue-propriété d'un appartement valorisé à 400 000 €, la nue-propriété représente 60 % de la valeur (soit 240 000 €). Après l'abattement de 100 000 €, les droits de donation ne porteront que sur 140 000 €.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La donation-partage : prévenir les conflits successoraux</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">donation-partage</strong> (anciennement « licitation ») permet de distribuer son patrimoine entre ses héritiers présomptifs (enfants, petits-enfants) de son vivant, en présence d'un notaire. Son principal avantage est de <strong className="text-[var(--color-text-strong)]">geler la valeur des biens au jour de la donation</strong> pour le calcul de la part réservataire : si un bien donné prend de la valeur par la suite, cette plus-value n'est pas prise en compte lors de la succession.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        La donation-partage peut inclure des donations déjà effectuées (dite « donation-partage cumulative »), permettant d'intégrer dans le partage des avantages antérieurs. Elle est particulièrement adaptée aux familles dont l'un des enfants a reçu davantage (transmission d'entreprise familiale, aide à l'achat immobilier) : elle neutralise les demandes de rapport lors de la succession et préserve la paix familiale.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">L'assurance-vie : le couteau suisse de la transmission</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        L'<strong className="text-[var(--color-text-strong)]">assurance-vie</strong> reste l'outil de transmission hors succession le plus utilisé en France. Les capitaux versés au décès au(x) bénéficiaire(s) désigné(s) dans la clause bénéficiaire échappent aux règles successorales classiques. Pour les versements effectués avant 70 ans, l'abattement est de <strong className="text-[var(--color-text-strong)]">152 500 € par bénéficiaire</strong> (tous contrats confondus, au-delà : prélèvement forfaitaire de 20 % puis 31,25 %).
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Attention : l'assurance-vie ne peut pas être utilisée pour avantager un bénéficiaire au-delà de la quotité disponible si cela aboutit à priver les enfants de leur réserve héréditaire (le concept de « primes manifestement exagérées » peut être invoqué devant les tribunaux).
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle central du notaire</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Toute donation d'un bien immobilier doit obligatoirement être réalisée par <strong className="text-[var(--color-text-strong)]">acte notarié</strong>. Pour les donations en numéraire ou en valeurs mobilières, l'acte notarié n'est pas obligatoire mais fortement conseillé pour sa valeur probante et la sécurité juridique qu'il offre.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le notaire assure la conformité de la donation avec les règles de réserve héréditaire, calcule l'optimisation fiscale, rédige les actes et procède à la publication au fichier immobilier si nécessaire. Il conseille également sur l'articulation entre les différents outils (donation directe, assurance-vie, démembrement) pour maximiser l'efficacité de la stratégie patrimoniale.
      </p>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Pour un conseil sur mesure, <a href="/notaire-donation" className="text-[var(--color-accent)] font-semibold hover:underline">consultez un notaire spécialisé en donation</a> ou un <a href="/notaire-succession" className="text-[var(--color-accent)] font-semibold hover:underline">notaire expert en succession</a> via Notaires.io.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Registry ─────────────────────────────────────────────────────────────── */

const CONTENT_MAP: Record<string, () => ReactNode> = {
  "contrat-de-mariage-separation-de-biens-ou-communaute": () => <Article1 />,
  "frais-de-notaire-achat-immobilier": () => <Article2 />,
  "delai-succession-notaire": () => <Article3 />,
  "pacs-ou-mariage-difference-notaire": () => <Article4 />,
  "premier-rendez-vous-notaire-gratuit": () => <Article5 />,
  "donation-enfants-avant-deces": () => <Article6 />,
  "testament-olographe-notarie": () => <Article7 />,
  "assurance-vie-succession-notaire": () => <Article8 />,
  "heritiers-reservataires-quotite": () => <Article9 />,
  "declaration-succession-delais": () => <Article10 />,
  "succession-sans-testament": () => <Article11 />,
  "desheriter-enfant-possible": () => <Article12 />,
  "droits-succession-calcul": () => <Article13 />,
  "acte-notoriete-succession": () => <Article14 />,
  "partage-succession-indivision": () => <Article15 />,
};


/* ── Article 7 ─────────────────────────────────────────────────────────── */

function Article7() {
  return (
    <>
      <>
  <p className="lead">Choisir entre un testament olographe ou notarié est une décision essentielle pour organiser sa succession et protéger ses proches. Ces deux formes de testament reconnues par le droit français présentent des avantages et inconvénients spécifiques qu&apos;il convient de bien comprendre avant de se décider.</p>

  <KeyPoints points={[
    "Le testament olographe est rédigé seul, à la main, sans coût mais avec un risque de contestation plus élevé",
    "Le testament notarié (authentique) est rédigé par un notaire devant témoins, offrant une sécurité juridique maximale",
    "Les deux ont la même valeur juridique mais diffèrent en termes de conservation, coût et fiabilité",
    "Le testament notarié coûte environ 115 à 140 € HT et est automatiquement inscrit au fichier central des dispositions de dernières volontés"
  ]} />

  <h2>Le testament olographe : simplicité et liberté</h2>
  <p>Le testament olographe est la forme la plus répandue en France en raison de sa simplicité de rédaction et de son coût nul. Pour être valide, il doit respecter trois conditions strictes prévues par l&apos;article 970 du Code civil : être entièrement écrit à la main par le testateur, daté précisément (jour, mois, année) et signé de sa main.</p>

  <p>Aucune intervention extérieure n&apos;est requise. Vous pouvez le rédiger chez vous, sur papier libre, à tout moment. Cette liberté constitue son principal atout, mais aussi sa principale faiblesse. En effet, un testament olographe mal rédigé ou imprécis peut être source de contestations longues et coûteuses pour vos héritiers.</p>

  <p>Les risques sont nombreux : perte du document, destruction accidentelle, contestation de l&apos;écriture ou de la signature, formulations ambiguës entraînant des interprétations divergentes, voire annulation pure et simple si une condition de forme n&apos;est pas respectée. Pour limiter ces risques, il est fortement recommandé de déposer votre testament olographe chez un notaire, qui l&apos;inscrira au fichier central des dispositions de dernières volontés (FCDDV) pour environ 30 €.</p>

  <h2>Le testament notarié : sécurité juridique maximale</h2>
  <p>Le testament notarié, également appelé testament authentique, est rédigé par un notaire en présence de deux témoins ou d&apos;un second notaire. Le testateur dicte ses volontés au notaire qui les retranscrit dans un acte authentique, puis lit le testament au testateur avant signature de toutes les parties.</p>

  <p>Cette forme offre une sécurité juridique inégalée. Le notaire vous conseille sur la validité de vos dispositions, vérifie leur conformité avec les règles successorales (notamment la réserve héréditaire), et s&apos;assure que vos volontés sont exprimées de manière claire et exécutable. Il garantit également votre consentement libre et éclairé, ce qui rend le testament quasi impossible à contester pour vice de forme ou incapacité.</p>

  <p>Le testament authentique est conservé en l&apos;étude notariale et automatiquement inscrit au FCDDV, garantissant qu&apos;il sera retrouvé au moment de la succession. Il est particulièrement recommandé dans les situations complexes : familles recomposées, présence d&apos;un héritier handicapé, transmission d&apos;entreprise, ou volonté de déshériter partiellement un héritier non réservataire.</p>

  <h2>Comparatif : olographe ou notarié, comment choisir ?</h2>
  <p>Le choix entre un testament olographe ou notarié dépend de votre situation patrimoniale et familiale. Voici les critères déterminants :</p>

  <ul>
    <li><strong>Coût</strong> : l&apos;olographe est gratuit, le notarié coûte 115 à 140 € HT (hors frais d&apos;inscription au FCDDV).</li>
    <li><strong>Sécurité juridique</strong> : le notarié est quasi incontestable, l&apos;olographe peut être attaqué pour vice de forme ou interprétation.</li>
    <li><strong>Conservation</strong> : le notarié est conservé en l&apos;étude, l&apos;olographe peut être perdu ou détruit.</li>
    <li><strong>Conseil juridique</strong> : seul le notarié bénéficie de l&apos;expertise du notaire pour valider les dispositions.</li>
    <li><strong>Confidentialité</strong> : l&apos;olographe reste totalement secret, le notarié est connu du notaire et des témoins.</li>
  </ul>

  <p>Pour un patrimoine modeste et des dispositions simples (par exemple léguer un bien précis à un proche), un testament olographe bien rédigé peut suffire. En revanche, dès que la situation se complique ou que les enjeux financiers sont importants, le testament notarié s&apos;impose comme la solution la plus prudente.</p>

  <h2>Les cas où le testament notarié est indispensable</h2>
  <p>Certaines dispositions ne peuvent légalement être prises que par testament authentique. C&apos;est notamment le cas de la reconnaissance d&apos;un enfant naturel, de la révocation d&apos;une reconnaissance, ou encore du mandat à effet posthume permettant de désigner un mandataire pour gérer la succession.</p>

  <p>Le testament notarié est également obligatoire lorsque le testateur ne peut pas écrire (handicap, maladie) ou ne parle pas français. Dans ces situations, le notaire adapte la procédure (interprète, témoins supplémentaires) pour garantir la validité de l&apos;acte.</p>

  <p>Enfin, si vous souhaitez prévoir des legs complexes (legs graduels ou résiduels, legs à des associations avec conditions particulières, démembrement de propriété), le recours au notaire est vivement conseillé pour éviter toute ambiguïté qui pourrait conduire à l&apos;invalidation partielle du testament.</p>

  <InternalCTA
    title="Besoin de conseils pour rédiger votre testament ?"
    description="Nos notaires partenaires vous accompagnent dans le choix de la forme adaptée et la rédaction de vos dispositions de dernières volontés. Premier rendez-vous offert, en visio ou au cabinet."
    buttonText="Prendre rendez-vous"
  />
</>
    </>
  );
}

/* ── Article 8 ─────────────────────────────────────────────────────────── */

function Article8() {
  return (
    <>
      <>
  <p className="lead">L&apos;assurance vie succession notaire est un sujet incontournable pour quiconque souhaite transmettre un patrimoine de manière optimisée. Bien que l&apos;assurance vie soit juridiquement hors succession, le notaire joue un rôle essentiel dans sa déclaration, sa fiscalité et la protection des héritiers réservataires.</p>

  <KeyPoints items={[
    "L&apos;assurance vie est hors succession civile mais doit être déclarée au notaire",
    "Abattement de 152 500 € par bénéficiaire pour les versements avant 70 ans",
    "Le notaire vérifie l&apos;absence de primes manifestement exagérées",
    "La clause bénéficiaire conditionne la transmission et la fiscalité"
  ]} />

  <h2>Le rôle du notaire dans la transmission d&apos;une assurance vie</h2>
  <p>Contrairement à une idée répandue, l&apos;assurance vie ne fait pas partie de la succession civile du défunt. Les capitaux sont versés directement aux bénéficiaires désignés dans la clause bénéficiaire, sans passer par le notaire. Pourtant, ce dernier conserve un rôle central dans plusieurs situations.</p>
  <p>Le notaire doit être informé de l&apos;existence des contrats d&apos;assurance vie afin de :</p>
  <ul>
    <li>Vérifier que les primes versées ne sont pas <strong>manifestement exagérées</strong> au regard du patrimoine et des revenus du défunt</li>
    <li>Contrôler le respect de la <strong>réserve héréditaire</strong> des enfants ou du conjoint</li>
    <li>Établir la <strong>déclaration fiscale</strong> nécessaire au calcul des droits éventuels</li>
    <li>Délivrer aux bénéficiaires une <strong>attestation</strong> pour la compagnie d&apos;assurance</li>
  </ul>
  <p>En cas de litige entre héritiers, le notaire peut être amené à proposer une réintégration des primes dans la succession si elles sont jugées excessives par rapport au train de vie du défunt.</p>

  <h2>La fiscalité de l&apos;assurance vie en succession</h2>
  <p>La fiscalité dépend essentiellement de l&apos;âge du souscripteur au moment des versements. Cette distinction est fondamentale pour anticiper la transmission.</p>

  <h3>Versements effectués avant 70 ans (article 990 I du CGI)</h3>
  <p>Chaque bénéficiaire profite d&apos;un abattement individuel de <strong>152 500 €</strong>. Au-delà :</p>
  <ul>
    <li>Taxation à <strong>20%</strong> jusqu&apos;à 700 000 € après abattement</li>
    <li>Taxation à <strong>31,25%</strong> au-delà de 700 000 €</li>
  </ul>
  <p>Cet avantage explique pourquoi l&apos;assurance vie reste l&apos;un des outils de transmission les plus utilisés en France.</p>

  <h3>Versements effectués après 70 ans (article 757 B du CGI)</h3>
  <p>L&apos;abattement est cette fois <strong>global</strong> de 30 500 € à partager entre tous les bénéficiaires. La fraction des primes excédant ce seuil est réintégrée dans l&apos;actif successoral et soumise aux droits de succession classiques. En revanche, les <strong>intérêts et plus-values</strong> restent totalement exonérés.</p>

  <h2>La clause bénéficiaire : un élément stratégique</h2>
  <p>La rédaction de la clause bénéficiaire conditionne toute la transmission. Une clause mal rédigée peut entraîner des conséquences fiscales lourdes ou des conflits familiaux. Le notaire peut vous aider à rédiger une clause adaptée à votre situation :</p>
  <ul>
    <li><strong>Clause standard</strong> : &quot;mon conjoint, à défaut mes enfants nés ou à naître, vivants ou représentés, à défaut mes héritiers&quot;</li>
    <li><strong>Clause démembrée</strong> : usufruit au conjoint, nue-propriété aux enfants — optimise la fiscalité</li>
    <li><strong>Clause à options</strong> : permet au bénéficiaire principal de choisir la quotité qu&apos;il accepte</li>
  </ul>
  <p>Il est également possible de déposer la clause bénéficiaire chez le notaire pour garantir sa confidentialité et éviter qu&apos;elle soit modifiée frauduleusement.</p>

  <h2>Primes manifestement exagérées : attention au piège</h2>
  <p>L&apos;article L132-13 du Code des assurances permet aux héritiers réservataires de demander la <strong>réintégration des primes</strong> dans la succession si elles sont jugées disproportionnées. Les juges apprécient ce caractère au cas par cas en fonction de :</p>
  <ul>
    <li>L&apos;âge du souscripteur au moment des versements</li>
    <li>Sa situation patrimoniale et familiale</li>
    <li>L&apos;utilité économique de l&apos;opération</li>
  </ul>
  <p>Si la disproportion est avérée, les primes excessives réintègrent l&apos;actif successoral et sont soumises aux règles de la <strong>réserve héréditaire</strong> et aux droits de succession. Un conseil notarial préventif évite ce risque.</p>

  <InternalCTA
    title="Optimisez la transmission de votre assurance vie"
    description="Nos notaires partenaires vous conseillent sur la rédaction de votre clause bénéficiaire et la fiscalité applicable. 1er rendez-vous offert."
    buttonText="Prendre rendez-vous"
  />
</>
    </>
  );
}

/* ── Article 9 ─────────────────────────────────────────────────────────── */

function Article9() {
  return (
    <>
      <>
<p>Les <strong>héritiers réservataires et la quotité disponible</strong> constituent deux notions fondamentales du droit successoral français. Elles déterminent la part de votre patrimoine que vous êtes libre de transmettre à qui vous le souhaitez, et celle que la loi réserve obligatoirement à certains proches. Comprendre ces règles est essentiel pour anticiper sereinement la transmission de vos biens.</p>

<KeyPoints items={[
  &quot;Les enfants sont toujours héritiers réservataires : on ne peut pas les déshériter.&quot;,
  &quot;La quotité disponible varie selon le nombre d&apos;enfants : 1/2, 1/3 ou 1/4.&quot;,
  &quot;Le conjoint survivant est réservataire uniquement en l&apos;absence d&apos;enfants.&quot;,
  &quot;Le notaire est indispensable pour sécuriser une donation ou un testament.&quot;
]} />

<h2>Qu&apos;est-ce qu&apos;un héritier réservataire ?</h2>
<p>Un héritier réservataire est une personne à qui la loi garantit une part minimale de la succession, appelée <strong>réserve héréditaire</strong>. Cette protection, héritée du Code civil napoléonien, vise à préserver la solidarité familiale et à éviter qu&apos;un défunt ne déshérite ses descendants directs au profit de tiers.</p>
<p>En droit français, les héritiers réservataires sont :</p>
<ul>
  <li><strong>Les enfants du défunt</strong> (légitimes, naturels ou adoptifs), ainsi que leurs descendants par représentation en cas de prédécès ;</li>
  <li><strong>Le conjoint survivant</strong>, mais uniquement en l&apos;absence d&apos;enfants ou de descendants.</li>
</ul>
<p>Depuis la réforme du 23 juin 2006, les ascendants (parents, grands-parents) ne sont plus réservataires. Les frères, sœurs, neveux et nièces ne le sont pas non plus : on peut donc parfaitement les écarter de sa succession par testament.</p>

<h2>Comment se calcule la quotité disponible ?</h2>
<p>La <strong>quotité disponible</strong> est la part de votre patrimoine que vous pouvez librement transmettre par testament ou donation à la personne de votre choix. Son montant dépend directement du nombre d&apos;héritiers réservataires.</p>
<h3>En présence d&apos;enfants</h3>
<p>Le Code civil (article 913) fixe les proportions suivantes :</p>
<ul>
  <li><strong>1 enfant</strong> : réserve = 1/2 ; quotité disponible = 1/2 ;</li>
  <li><strong>2 enfants</strong> : réserve = 2/3 (soit 1/3 chacun) ; quotité disponible = 1/3 ;</li>
  <li><strong>3 enfants ou plus</strong> : réserve = 3/4 ; quotité disponible = 1/4.</li>
</ul>
<h3>En l&apos;absence d&apos;enfants</h3>
<p>Si le défunt n&apos;a pas de descendants mais laisse un conjoint, ce dernier bénéficie d&apos;une réserve de <strong>1/4 de la succession</strong>. La quotité disponible s&apos;élève alors à 3/4.</p>
<h3>Exemple concret</h3>
<p>Marie laisse à son décès un patrimoine de 400 000 €. Elle a deux enfants. La réserve héréditaire est de 2/3, soit environ 266 666 € à partager entre ses enfants (133 333 € chacun). La quotité disponible est de 1/3, soit 133 333 €, que Marie pouvait léguer librement, par exemple à son conjoint, un ami ou une association.</p>

<h2>Que faire si la quotité disponible est dépassée ?</h2>
<p>Lorsque le défunt a consenti des libéralités (donations de son vivant ou legs par testament) qui excèdent la quotité disponible, les héritiers réservataires lésés peuvent exercer une <strong>action en réduction</strong>. Cette procédure permet de reconstituer la réserve héréditaire en réduisant les libéralités excessives.</p>
<p>Le notaire procède alors à un calcul rigoureux :</p>
<ol>
  <li>Reconstitution de la masse successorale (biens existants + donations antérieures rapportables) ;</li>
  <li>Calcul de la réserve et de la quotité disponible ;</li>
  <li>Vérification du non-dépassement ;</li>
  <li>Réduction éventuelle des libéralités excessives, en commençant par les plus récentes.</li>
</ol>
<p>Les héritiers réservataires peuvent toutefois renoncer à l&apos;action en réduction par une <strong>renonciation anticipée à l&apos;action en réduction (RAAR)</strong>, un acte notarié solennel qui permet d&apos;organiser des transmissions atypiques (par exemple au profit d&apos;un enfant handicapé ou d&apos;un beau-fils).</p>

<h2>Comment optimiser sa transmission avec un notaire ?</h2>
<p>Plusieurs outils permettent d&apos;optimiser la transmission tout en respectant la réserve héréditaire :</p>
<ul>
  <li><strong>La donation-partage</strong> : fige la valeur des biens au jour de la donation et évite les conflits futurs ;</li>
  <li><strong>Le testament</strong> : permet d&apos;utiliser la quotité disponible au profit d&apos;un proche ou d&apos;une œuvre ;</li>
  <li><strong>L&apos;assurance-vie</strong> : hors succession dans la plupart des cas, elle permet de transmettre au-delà de la quotité disponible ;</li>
  <li><strong>La SCI familiale</strong> : facilite la gestion et la transmission d&apos;un patrimoine immobilier.</li>
</ul>
<p>Chaque situation familiale étant unique, l&apos;accompagnement d&apos;un notaire est essentiel pour choisir les outils adaptés et éviter les écueils juridiques ou fiscaux.</p>

<InternalCTA
  title="Anticipez votre succession avec un notaire"
  description="Réservez un premier rendez-vous gratuit, en visio ou en cabinet, pour faire le point sur votre situation familiale et patrimoniale."
  buttonText="Prendre rendez-vous"
/>
</>
    </>
  );
}

/* ── Article 10 ─────────────────────────────────────────────────────────── */

function Article10() {
  return (
    <>
      <>
<p className="lead">La <strong>déclaration de succession</strong> doit être déposée auprès de l&apos;administration fiscale dans un <strong>délai de 6 mois</strong> suivant le décès en France (12 mois à l&apos;étranger). Ce document obligatoire recense l&apos;actif et le passif du défunt et permet de calculer les droits de succession dus par chaque héritier. Respecter ce délai est essentiel pour éviter pénalités et intérêts de retard.</p>

<KeyPoints points={[
  "Délai de 6 mois pour déposer la déclaration (12 mois si décès à l&apos;étranger)",
  "Pénalités de 0,20 % par mois de retard + majoration jusqu&apos;à 40 %",
  "Abattement de 100 000 € par enfant et exonération totale entre époux",
  "Le notaire prépare la déclaration et calcule les droits dus"
]} />

<h2>Quels sont les délais légaux pour déclarer une succession ?</h2>
<p>Le Code général des impôts impose un calendrier strict pour la <strong>déclaration de succession</strong>. Le délai principal est de <strong>6 mois à compter du jour du décès</strong> lorsque celui-ci survient en France métropolitaine. Ce délai est porté à <strong>12 mois</strong> si le décès a lieu à l&apos;étranger ou dans certains DOM-TOM.</p>
<p>La déclaration doit être déposée au service des impôts du domicile du défunt, accompagnée du paiement des droits de succession. En pratique, c&apos;est le notaire chargé du règlement qui s&apos;occupe de la rédaction et du dépôt de ce document complexe.</p>
<p>Certains héritiers sont dispensés de déclaration : c&apos;est le cas si l&apos;actif brut successoral est inférieur à 50 000 € pour les héritiers en ligne directe et le conjoint survivant (à condition qu&apos;il n&apos;y ait pas eu de donation antérieure non enregistrée), ou inférieur à 3 000 € pour les autres héritiers.</p>

<h2>Comment sont calculés les impôts de succession ?</h2>
<p>Les droits de succession dépendent de deux éléments principaux : le <strong>lien de parenté</strong> avec le défunt et le <strong>montant de la part héritée</strong>. Chaque héritier bénéficie d&apos;un abattement personnel avant application du barème progressif.</p>
<p>Les principaux abattements sont les suivants :</p>
<ul>
  <li><strong>Conjoint survivant ou partenaire de PACS</strong> : exonération totale</li>
  <li><strong>Enfant ou parent</strong> : abattement de 100 000 €</li>
  <li><strong>Frère ou sœur</strong> : abattement de 15 932 €</li>
  <li><strong>Neveu ou nièce</strong> : abattement de 7 967 €</li>
  <li><strong>Personne handicapée</strong> : abattement supplémentaire de 159 325 €</li>
</ul>
<p>Après application de l&apos;abattement, un barème progressif s&apos;applique, allant de 5 % à 45 % en ligne directe, 35 % à 45 % entre frères et sœurs, et jusqu&apos;à 60 % entre personnes non parentes.</p>

<InternalCTA title="Besoin d&apos;aide pour votre déclaration de succession ?" description="Nos notaires partenaires vous accompagnent dans toutes les démarches successorales. Premier rendez-vous offert, en visio ou en cabinet." />

<h2>Quelles sont les pénalités en cas de retard ?</h2>
<p>Le non-respect du <strong>délai de déclaration de succession</strong> entraîne des sanctions financières qui peuvent rapidement s&apos;accumuler. Les conséquences sont les suivantes :</p>
<ul>
  <li><strong>Intérêt de retard</strong> : 0,20 % par mois (soit 2,4 % par an) dès le 7ème mois suivant le décès</li>
  <li><strong>Majoration de 10 %</strong> à partir du 13ème mois (7ème mois de retard)</li>
  <li><strong>Majoration de 40 %</strong> en cas de dépôt tardif après mise en demeure restée sans réponse pendant 90 jours</li>
  <li><strong>Majoration de 80 %</strong> en cas de découverte d&apos;une activité occulte ou de manœuvres frauduleuses</li>
</ul>
<p>Il est possible de demander un <strong>paiement fractionné</strong> (sur 1 à 3 ans) ou <strong>différé</strong> (jusqu&apos;à 15 ans en cas de nue-propriété) des droits de succession, sous certaines conditions et moyennant le versement d&apos;intérêts.</p>

<h2>Comment préparer sereinement sa déclaration de succession ?</h2>
<p>Pour respecter les délais et éviter les erreurs coûteuses, il est vivement recommandé de <strong>consulter un notaire dès les premières semaines suivant le décès</strong>. Celui-ci se charge de :</p>
<ul>
  <li>Établir l&apos;<strong>acte de notoriété</strong> identifiant les héritiers</li>
  <li>Réaliser l&apos;<strong>inventaire</strong> du patrimoine du défunt (biens, comptes, dettes)</li>
  <li>Évaluer les biens immobiliers et mobiliers</li>
  <li>Rédiger la <strong>déclaration de succession</strong> sur le formulaire Cerfa 2705</li>
  <li>Calculer les droits dus par chaque héritier</li>
  <li>Effectuer le dépôt auprès du service des impôts</li>
</ul>
<p>Anticiper la transmission de son patrimoine par une <strong>donation</strong>, un <strong>testament</strong> ou la souscription d&apos;une <strong>assurance-vie</strong> permet souvent de réduire significativement la facture fiscale pour les héritiers.</p>

<h2>En résumé</h2>
<p>La <strong>déclaration de succession</strong> est une démarche obligatoire à effectuer dans un délai de 6 mois après le décès. Les droits dus dépendent du lien de parenté et de la part héritée, après application d&apos;abattements. Les retards entraînent des pénalités importantes, d&apos;où l&apos;intérêt de confier rapidement le dossier à un notaire qui sécurisera l&apos;ensemble des opérations.</p>
</>
    </>
  );
}

/* ── Article 11 ─────────────────────────────────────────────────────────── */

function Article11() {
  return (
    <>
      <>
  <p className="lead">Une <strong>succession sans testament héritiers</strong> légaux est régie entièrement par la loi française. Lorsqu&apos;une personne décède sans avoir rédigé de testament, on parle de succession &quot;ab intestat&quot;. Le Code civil prévoit alors un ordre précis pour désigner les héritiers et déterminer leurs parts respectives. Comprendre ces règles est essentiel pour anticiper les conséquences patrimoniales d&apos;un décès et éviter les conflits familiaux.</p>

  <KeyPoints items={[
    "Sans testament, la loi désigne automatiquement les héritiers selon 4 ordres successoraux",
    "Les enfants héritent en priorité, à parts égales entre eux",
    "Le conjoint survivant a des droits spécifiques selon la situation familiale",
    "Le notaire est obligatoire pour régler la succession dès qu&apos;il y a un bien immobilier"
  ]} />

  <h2>L&apos;ordre légal des héritiers en l&apos;absence de testament</h2>
  <p>Le Code civil français classe les héritiers en quatre ordres successifs. Chaque ordre exclut le suivant : tant qu&apos;il existe un héritier dans un ordre, les ordres suivants ne reçoivent rien.</p>

  <h3>Premier ordre : les descendants</h3>
  <p>Les enfants du défunt héritent en premier, à parts égales, qu&apos;ils soient issus du mariage, hors mariage ou adoptés. Si un enfant est prédécédé, ses propres enfants (les petits-enfants du défunt) viennent en représentation et se partagent la part de leur parent.</p>

  <h3>Deuxième ordre : ascendants et collatéraux privilégiés</h3>
  <p>En l&apos;absence de descendants, la succession revient aux parents du défunt et à ses frères et sœurs. Les parents reçoivent chacun 1/4, le reste étant partagé entre les frères et sœurs (ou leurs descendants par représentation).</p>

  <h3>Troisième et quatrième ordres</h3>
  <p>S&apos;il n&apos;y a ni descendants, ni parents, ni frères et sœurs, on remonte aux autres ascendants (grands-parents) puis aux collatéraux ordinaires (oncles, tantes, cousins) jusqu&apos;au 6e degré. Au-delà, la succession revient à l&apos;État.</p>

  <h2>Les droits du conjoint survivant sans testament</h2>
  <p>Le conjoint marié bénéficie de droits légaux importants, même sans testament. Attention : le partenaire de PACS et le concubin ne sont <strong>pas héritiers légaux</strong>. Seul un testament peut leur transmettre des biens.</p>

  <p>En présence d&apos;enfants tous communs au couple, le conjoint choisit entre :</p>
  <ul>
    <li><strong>1/4 de la succession en pleine propriété</strong></li>
    <li><strong>La totalité en usufruit</strong> (les enfants reçoivent la nue-propriété)</li>
  </ul>

  <p>En présence d&apos;enfants d&apos;une précédente union, le conjoint reçoit obligatoirement 1/4 en pleine propriété, sans option d&apos;usufruit. Sans enfants mais avec parents du défunt vivants, le conjoint recueille la moitié ou les trois quarts selon les cas. Sans descendants ni parents, il hérite de la totalité.</p>

  <InternalCTA
    title="Une succession à régler ?"
    description="Nos notaires partenaires vous accompagnent dans le règlement complet de la succession, du bilan patrimonial au partage final."
    buttonText="Prendre RDV avec un notaire"
    href="/notaires"
  />

  <h2>Le rôle du notaire dans une succession sans testament</h2>
  <p>Le recours au notaire est <strong>obligatoire</strong> dès lors que la succession comprend un bien immobilier, dépasse 5 000 € ou qu&apos;il existe un contrat de mariage. Dans la pratique, presque toutes les successions passent par un notaire.</p>

  <h3>Les étapes du règlement</h3>
  <ol>
    <li><strong>Acte de notoriété</strong> : le notaire identifie officiellement les héritiers</li>
    <li><strong>Bilan du patrimoine</strong> : inventaire des biens, comptes, dettes</li>
    <li><strong>Déclaration de succession</strong> : à déposer dans les 6 mois auprès de l&apos;administration fiscale</li>
    <li><strong>Paiement des droits</strong> de succession selon le lien de parenté</li>
    <li><strong>Partage</strong> entre héritiers (à l&apos;amiable ou judiciaire)</li>
  </ol>

  <h3>Les droits de succession applicables</h3>
  <p>Sans testament, les abattements et taux dépendent du lien de parenté : 100 000 € d&apos;abattement par enfant, exonération totale pour le conjoint survivant, 15 932 € entre frères et sœurs. Les neveux, cousins et tiers subissent une fiscalité bien plus lourde (jusqu&apos;à 60%).</p>

  <h2>Comment anticiper une succession sans testament ?</h2>
  <p>Si la loi prévoit tout, elle ne reflète pas toujours vos volontés. Plusieurs outils permettent d&apos;aménager la transmission sans rédiger un testament classique :</p>
  <ul>
    <li><strong>La donation entre époux</strong> (ou &quot;donation au dernier vivant&quot;) augmente la part du conjoint</li>
    <li><strong>La donation-partage</strong> permet de transmettre de son vivant à ses enfants</li>
    <li><strong>L&apos;assurance-vie</strong> échappe en grande partie aux règles successorales</li>
    <li><strong>La SCI familiale</strong> facilite la transmission d&apos;un patrimoine immobilier</li>
  </ul>

  <p>Consulter un notaire en amont permet d&apos;identifier la stratégie la plus adaptée à votre situation familiale et patrimoniale, tout en optimisant la fiscalité pour vos héritiers.</p>

  <h2>Questions fréquentes</h2>
  <p>Vous trouverez ci-dessous les réponses aux questions les plus courantes sur les successions sans testament. Pour une analyse personnalisée, un échange avec un notaire reste indispensable.</p>

  <InternalCTA
    title="Besoin de conseils sur votre succession ?"
    description="Premier rendez-vous offert avec un notaire de notre réseau, en visio ou en cabinet. Réponses claires et accompagnement personnalisé."
    buttonText="Consulter un notaire"
    href="/notaires"
  />
</>
    </>
  );
}

/* ── Article 12 ─────────────────────────────────────────────────────────── */

function Article12() {
  return (
    <>
      <>
  <p className="lead">Peut-on déshériter un enfant en France ? La réponse courte est non : le droit français protège les enfants par un mécanisme appelé la réserve héréditaire. Toutefois, il existe des solutions légales pour organiser votre succession différemment et, dans des cas exceptionnels, écarter un enfant indigne. Cet article fait le point sur vos droits et options.</p>

  <KeyPoints items={[
    "En France, il est impossible de déshériter totalement un enfant grâce à la réserve héréditaire",
    "La part réservée varie selon le nombre d&apos;enfants : 1/2 pour 1 enfant, 2/3 pour 2, 3/4 pour 3 ou plus",
    "L&apos;indignité successorale permet d&apos;écarter un enfant en cas de faute grave",
    "La quotité disponible et l&apos;assurance-vie offrent des marges de manœuvre pour avantager d&apos;autres héritiers"
  ]} />

  <h2>La réserve héréditaire : une protection incontournable</h2>
  <p>Le Code civil français consacre le principe de la <strong>réserve héréditaire</strong>, qui rend impossible le fait de déshériter un enfant. Les enfants sont des héritiers dits « réservataires » : la loi leur garantit obligatoirement une portion du patrimoine du défunt, quelles que soient les volontés exprimées dans un testament.</p>
  <p>Cette protection s&apos;applique à tous les enfants, qu&apos;ils soient légitimes, naturels, adoptés ou nés hors mariage. La répartition de la réserve dépend du nombre d&apos;enfants :</p>
  <ul>
    <li><strong>1 enfant</strong> : la réserve représente 1/2 du patrimoine</li>
    <li><strong>2 enfants</strong> : la réserve représente 2/3 du patrimoine (1/3 chacun)</li>
    <li><strong>3 enfants ou plus</strong> : la réserve représente 3/4 du patrimoine, partagés à parts égales</li>
  </ul>
  <p>Le reste, appelé <strong>quotité disponible</strong>, peut être librement attribué par testament ou donation à toute personne de votre choix.</p>

  <h2>L&apos;indignité successorale : la seule véritable exception</h2>
  <p>Le seul moyen d&apos;écarter totalement un enfant de la succession est de le faire déclarer <strong>indigne</strong> de succéder. Cette procédure est strictement encadrée par les articles 726 et 727 du Code civil.</p>
  <p>L&apos;indignité peut être <strong>de plein droit</strong> en cas de :</p>
  <ul>
    <li>Condamnation pour meurtre ou tentative de meurtre du défunt</li>
    <li>Condamnation pour coups mortels portés au défunt</li>
  </ul>
  <p>Elle peut également être <strong>prononcée par le juge</strong> en cas de :</p>
  <ul>
    <li>Violences volontaires graves envers le défunt</li>
    <li>Faux témoignage dans une procédure criminelle contre lui</li>
    <li>Dénonciation calomnieuse ayant entraîné une condamnation criminelle</li>
  </ul>
  <p>Il s&apos;agit de cas exceptionnels qui nécessitent une décision de justice. Un simple conflit familial, même profond, ne suffit jamais à justifier l&apos;indignité.</p>

  <InternalCTA />

  <h2>Comment réduire légalement la part d&apos;un enfant ?</h2>
  <p>Si vous ne pouvez pas déshériter un enfant, plusieurs outils permettent de moduler votre succession et d&apos;avantager d&apos;autres personnes :</p>
  <h3>1. Utiliser la quotité disponible</h3>
  <p>Vous pouvez librement transmettre la quotité disponible (entre 1/4 et 1/2 selon le nombre d&apos;enfants) à votre conjoint, un autre enfant, un tiers ou une association via un testament authentique.</p>
  <h3>2. Souscrire une assurance-vie</h3>
  <p>L&apos;<strong>assurance-vie</strong> bénéficie d&apos;un régime juridique particulier : les capitaux versés au bénéficiaire désigné échappent en principe à la succession et donc à la réserve héréditaire, sauf primes manifestement exagérées.</p>
  <h3>3. Réaliser des donations</h3>
  <p>Des donations de votre vivant à d&apos;autres héritiers ou tiers permettent d&apos;anticiper la transmission. Attention : elles seront réintégrées au calcul de la réserve si elles excèdent la quotité disponible.</p>
  <h3>4. Recourir au mandat à effet posthume</h3>
  <p>Cet outil permet de confier la gestion d&apos;une partie de la succession à un tiers pour protéger un enfant vulnérable ou éviter une mauvaise gestion.</p>

  <h2>Que faire en cas de conflit familial grave ?</h2>
  <p>Si vos relations avec un enfant sont gravement détériorées, sachez que vous pouvez toujours :</p>
  <ul>
    <li>Limiter sa part à la stricte réserve héréditaire</li>
    <li>Avantager vos autres enfants ou votre conjoint via la quotité disponible</li>
    <li>Choisir un bénéficiaire d&apos;assurance-vie distinct</li>
    <li>Préciser dans votre testament les motifs de votre décision</li>
  </ul>
  <p>Un <strong>notaire</strong> est l&apos;interlocuteur indispensable pour sécuriser votre démarche, rédiger un testament authentique opposable et éviter les contestations futures.</p>

  <h2>Conclusion</h2>
  <p>En France, déshériter un enfant est juridiquement impossible, sauf cas d&apos;indignité successorale prononcée par un juge. Toutefois, la loi offre des marges de manœuvre réelles pour organiser votre succession selon vos souhaits, via la quotité disponible, l&apos;assurance-vie et les donations. Pour éviter tout litige et optimiser la transmission de votre patrimoine, l&apos;accompagnement d&apos;un notaire est essentiel.</p>

  <InternalCTA />
</>
    </>
  );
}

/* ── Article 13 ─────────────────────────────────────────────────────────── */

function Article13() {
  return (
    <>
      <>
  <p className="lead">Le calcul des droits de succession selon le barème 2026 repose sur trois éléments clés : la valeur de l&apos;actif net taxable, le lien de parenté avec le défunt et les abattements applicables. Comprendre ce mécanisme permet d&apos;anticiper la facture fiscale et d&apos;optimiser la transmission de votre patrimoine.</p>

  <KeyPoints points={[
    "Abattement de 100 000 € par enfant, renouvelable tous les 15 ans",
    "Barème progressif de 5 % à 45 % en ligne directe",
    "Conjoint et partenaire de PACS totalement exonérés",
    "Déclaration et paiement dans les 6 mois suivant le décès"
  ]} />

  <h2>Les abattements applicables avant calcul</h2>
  <p>Avant d&apos;appliquer le barème, l&apos;administration fiscale déduit un abattement personnel sur la part nette revenant à chaque héritier. En 2026, ces montants restent stables :</p>
  <ul>
    <li><strong>Enfants, parents :</strong> 100 000 €</li>
    <li><strong>Petits-enfants (en représentation) :</strong> 100 000 € (part du parent prédécédé)</li>
    <li><strong>Frères et sœurs :</strong> 15 932 €</li>
    <li><strong>Neveux et nièces :</strong> 7 967 €</li>
    <li><strong>Personnes handicapées :</strong> 159 325 € cumulable</li>
    <li><strong>Autres héritiers :</strong> 1 594 €</li>
  </ul>
  <p>Ces abattements se renouvellent tous les 15 ans, ce qui ouvre une stratégie d&apos;optimisation par les donations anticipées.</p>

  <h2>Le barème 2026 en ligne directe</h2>
  <p>Une fois l&apos;abattement déduit, le solde taxable est soumis à un barème progressif par tranches. Pour les transmissions entre parents et enfants (ou ascendants), les taux applicables sont :</p>
  <ul>
    <li>Jusqu&apos;à 8 072 € : <strong>5 %</strong></li>
    <li>De 8 072 € à 12 109 € : <strong>10 %</strong></li>
    <li>De 12 109 € à 15 932 € : <strong>15 %</strong></li>
    <li>De 15 932 € à 552 324 € : <strong>20 %</strong></li>
    <li>De 552 324 € à 902 838 € : <strong>30 %</strong></li>
    <li>De 902 838 € à 1 805 677 € : <strong>40 %</strong></li>
    <li>Au-delà de 1 805 677 € : <strong>45 %</strong></li>
  </ul>
  <p><strong>Exemple concret :</strong> un enfant hérite de 300 000 €. Après abattement de 100 000 €, la base taxable est de 200 000 €. Les droits s&apos;élèvent à environ 38 194 € après application du barème par tranches.</p>

  <h2>Les barèmes spécifiques selon le lien de parenté</h2>
  <p>Pour les <strong>frères et sœurs</strong>, deux tranches s&apos;appliquent après abattement : 35 % jusqu&apos;à 24 430 € et 45 % au-delà. Pour les <strong>neveux, nièces et parents jusqu&apos;au 4e degré</strong>, le taux unique est de 55 %. Enfin, pour les <strong>tiers ou parents au-delà du 4e degré</strong>, le taux atteint 60 %, ce qui rend toute transmission hors famille particulièrement coûteuse.</p>
  <p>Le conjoint survivant marié et le partenaire de PACS bénéficient d&apos;une exonération totale depuis la loi TEPA de 2007. Le concubin, en revanche, est traité comme un tiers et taxé à 60 %.</p>

  <InternalCTA
    title="Besoin d&apos;une simulation précise ?"
    description="Un notaire calcule vos droits de succession et vous conseille sur les stratégies d&apos;optimisation. 1er rendez-vous offert."
    buttonText="Consulter un notaire"
  />

  <h2>Comment optimiser ses droits de succession</h2>
  <p>Plusieurs leviers permettent de réduire la facture fiscale de vos héritiers :</p>
  <ul>
    <li><strong>Donations anticipées :</strong> profitez du renouvellement de l&apos;abattement tous les 15 ans</li>
    <li><strong>Assurance-vie :</strong> abattement de 152 500 € par bénéficiaire pour les versements avant 70 ans</li>
    <li><strong>Démembrement de propriété :</strong> transmettre la nue-propriété en conservant l&apos;usufruit</li>
    <li><strong>Pacte Dutreil :</strong> abattement de 75 % sur la transmission d&apos;entreprise</li>
    <li><strong>Dons familiaux de sommes d&apos;argent :</strong> exonération supplémentaire de 31 865 € sous conditions</li>
  </ul>
  <p>La déclaration de succession doit être déposée dans les <strong>6 mois suivant le décès</strong> (12 mois si décès à l&apos;étranger). Le paiement peut être fractionné ou différé sous conditions, notamment en cas de transmission d&apos;entreprise ou de nue-propriété.</p>

  <h2>Foire aux questions</h2>
  <div className="faq">
    <h3>Quel est l&apos;abattement entre parent et enfant en 2026 ?</h3>
    <p>L&apos;abattement reste fixé à 100 000 € par parent et par enfant, renouvelable tous les 15 ans.</p>
    <h3>Le conjoint survivant paie-t-il des droits de succession ?</h3>
    <p>Non, le conjoint marié ou pacsé est totalement exonéré de droits de succession depuis la loi TEPA de 2007.</p>
    <h3>Quand faut-il payer les droits de succession ?</h3>
    <p>Les droits doivent être réglés dans les 6 mois suivant le décès (12 mois si décès à l&apos;étranger), en même temps que la déclaration.</p>
  </div>
</>
    </>
  );
}

/* ── Article 14 ─────────────────────────────────────────────────────────── */

function Article14() {
  return (
    <>
      <>
  <p className="lead">L&apos;acte de notoriété succession établi par un notaire est le document officiel qui prouve votre qualité d&apos;héritier après un décès. Indispensable pour débloquer les comptes bancaires, vendre un bien immobilier ou percevoir une pension de réversion, cet acte authentique constitue la première étape incontournable du règlement successoral.</p>

  <KeyPoints items={[
    "L&apos;acte de notoriété prouve officiellement la qualité d&apos;héritier",
    "Obligatoire pour les successions supérieures à 5 910 € ou comportant un bien immobilier",
    "Tarif réglementé : environ 200 à 400 € TTC tout compris",
    "Délai d&apos;obtention : 1 à 3 mois selon la complexité",
    "Seul un notaire est habilité à le rédiger depuis 2015"
  ]} />

  <h2>Qu&apos;est-ce qu&apos;un acte de notoriété succession ?</h2>
  <p>L&apos;acte de notoriété est un acte authentique rédigé par le notaire qui identifie le défunt et désigne les personnes appelées à recueillir sa succession. Il établit la dévolution successorale, c&apos;est-à-dire la liste des héritiers et leurs droits respectifs dans l&apos;héritage.</p>
  <p>Ce document, prévu par l&apos;article 730-1 du Code civil, fait foi jusqu&apos;à preuve du contraire. Depuis la loi du 16 février 2015, seul un notaire peut le délivrer : les anciens certificats d&apos;hérédité délivrés par les mairies ont été progressivement supprimés.</p>
  <p>L&apos;acte mentionne notamment :</p>
  <ul>
    <li>L&apos;état civil complet du défunt et la date du décès</li>
    <li>L&apos;existence ou non d&apos;un testament ou d&apos;une donation entre époux</li>
    <li>L&apos;identité de chaque héritier et son lien de parenté</li>
    <li>La quote-part revenant à chacun (en pleine propriété, usufruit ou nue-propriété)</li>
    <li>L&apos;option successorale exercée (acceptation pure et simple, à concurrence de l&apos;actif net, ou renonciation)</li>
  </ul>

  <h2>Quand et pourquoi recourir à cet acte ?</h2>
  <p>L&apos;acte de notoriété succession est nécessaire dans la majorité des dossiers. Il devient obligatoire dès lors que :</p>
  <ul>
    <li><strong>Le patrimoine bancaire dépasse 5 910,57 €</strong> : les banques exigent l&apos;acte pour débloquer les comptes du défunt</li>
    <li><strong>La succession comporte un bien immobilier</strong> : indispensable pour l&apos;attestation immobilière et toute future vente</li>
    <li><strong>Des prestations sociales doivent être perçues</strong> : pension de réversion, capital décès, assurance-vie</li>
    <li><strong>Un testament existe</strong> : pour authentifier les volontés du défunt et leurs effets</li>
  </ul>
  <p>En pratique, dès qu&apos;une démarche officielle nécessite de prouver votre qualité d&apos;héritier, l&apos;acte de notoriété sera réclamé. Sans lui, impossible d&apos;agir au nom de la succession.</p>

  <InternalCTA
    title="Besoin d&apos;un notaire pour votre succession ?"
    description="Obtenez votre acte de notoriété rapidement. Premier rendez-vous offert avec un notaire partenaire, en visio ou en cabinet."
    buttonText="Prendre rendez-vous"
    href="/rendez-vous"
  />

  <h2>Comment se déroule la rédaction chez le notaire ?</h2>
  <p>La procédure d&apos;établissement de l&apos;acte se déroule en plusieurs étapes structurées par le notaire.</p>

  <h3>1. Réunion des pièces nécessaires</h3>
  <p>Vous devrez fournir au notaire :</p>
  <ul>
    <li>L&apos;acte de décès du défunt</li>
    <li>Son livret de famille (et celui de ses précédentes unions le cas échéant)</li>
    <li>Son acte de naissance et son contrat de mariage éventuel</li>
    <li>Les pièces d&apos;identité de tous les héritiers</li>
    <li>Les testaments, donations ou donations entre époux connus</li>
  </ul>

  <h3>2. Recherches et vérifications</h3>
  <p>Le notaire interroge le <strong>Fichier central des dispositions de dernières volontés (FCDDV)</strong> pour vérifier l&apos;existence d&apos;un testament. Il analyse la situation familiale du défunt et identifie l&apos;ensemble des héritiers selon les règles légales de la dévolution successorale.</p>

  <h3>3. Signature de l&apos;acte</h3>
  <p>Tous les héritiers signent l&apos;acte chez le notaire (présence physique ou procuration). Chacun y déclare sa qualité et exerce son option successorale. Le notaire remet ensuite des copies authentiques que vous utiliserez auprès des banques, des administrations et des organismes sociaux.</p>

  <h2>Tarifs et délais à prévoir</h2>
  <p>Le tarif de l&apos;acte de notoriété est <strong>réglementé</strong> par décret. L&apos;émolument fixe du notaire s&apos;élève à environ 58 € HT. À cela s&apos;ajoutent :</p>
  <ul>
    <li>Les frais de formalités et débours (consultation du FCDDV, copies d&apos;actes d&apos;état civil)</li>
    <li>La TVA de 20 %</li>
    <li>Les éventuelles copies authentiques supplémentaires</li>
  </ul>
  <p>Au total, comptez généralement <strong>entre 200 € et 400 € TTC</strong> pour un acte standard. Ce coût est intégré dans les frais globaux de la succession et payé par la succession elle-même.</p>
  <p>Côté délais, l&apos;acte est généralement disponible <strong>dans les 1 à 3 mois</strong> après votre première rencontre avec le notaire, en fonction du temps nécessaire pour réunir l&apos;ensemble des pièces d&apos;état civil et identifier tous les héritiers.</p>

  <h2>Acte de notoriété ou attestation des héritiers ?</h2>
  <p>Pour les petites successions de moins de 5 910,57 € sans bien immobilier, une <strong>attestation signée par l&apos;ensemble des héritiers</strong> peut suffire à débloquer les comptes bancaires. Elle est gratuite mais limitée dans son usage.</p>
  <p>Dès que le patrimoine dépasse ce seuil ou qu&apos;un bien immobilier est en jeu, l&apos;acte de notoriété notarial devient incontournable. Il offre une sécurité juridique bien supérieure et reste valable pour toutes les démarches futures liées à la succession.</p>

  <InternalCTA
    title="Démarrez votre succession sereinement"
    description="Nos notaires partenaires vous accompagnent à chaque étape : acte de notoriété, déclaration fiscale, partage. Consultation initiale offerte."
    buttonText="Contacter un notaire"
    href="/rendez-vous"
  />
</>
    </>
  );
}

/* ── Article 15 ─────────────────────────────────────────────────────────── */

function Article15() {
  return (
    <>
      <>
  <p className="lead">Le partage succession indivision notaire est l&apos;étape qui met fin à l&apos;indivision successorale entre héritiers et attribue à chacun sa part définitive. Souvent perçu comme complexe, ce processus encadré par le Code civil permet pourtant à chaque héritier de devenir pleinement propriétaire des biens qui lui reviennent. Que le partage soit amiable ou judiciaire, l&apos;intervention du notaire est essentielle, particulièrement lorsque la succession comporte un bien immobilier.</p>

  <KeyPoints points={[
    "Le partage met fin à l&apos;indivision et attribue à chaque héritier ses biens propres",
    "Le notaire est obligatoire dès qu&apos;il existe un bien immobilier dans la succession",
    "Le droit de partage s&apos;élève à 2,5% de l&apos;actif net partagé",
    "En cas de désaccord, le partage judiciaire devient la seule solution"
  ]} />

  <h2>Comprendre l&apos;indivision successorale et son partage</h2>
  <p>Au décès d&apos;une personne, les héritiers se retrouvent automatiquement en indivision sur l&apos;ensemble des biens de la succession. Chacun détient une quote-part abstraite (par exemple 1/3 ou 1/2) sur la totalité du patrimoine, sans qu&apos;aucun bien ne lui appartienne individuellement. Cette situation, encadrée par les articles 815 et suivants du Code civil, est conçue comme provisoire.</p>

  <p>L&apos;indivision présente plusieurs inconvénients : les décisions importantes nécessitent l&apos;unanimité, les frais d&apos;entretien sont partagés, et tout héritier peut à tout moment demander le partage selon l&apos;adage &quot;nul ne peut être contraint à demeurer dans l&apos;indivision&quot;. C&apos;est pourquoi la majorité des successions débouche tôt ou tard sur un acte de partage.</p>

  <p>Le partage transforme les droits abstraits en droits concrets : chaque héritier se voit attribuer des biens déterminés (un appartement, un compte bancaire, des meubles) en pleine propriété, à hauteur de sa part dans la succession.</p>

  <h2>Les étapes du partage amiable chez le notaire</h2>
  <p>Le partage amiable est la voie privilégiée lorsque tous les héritiers sont d&apos;accord. Il se déroule en plusieurs étapes auprès du notaire chargé de la succession.</p>

  <h3>1. L&apos;inventaire et l&apos;évaluation des biens</h3>
  <p>Le notaire dresse la liste exhaustive de l&apos;actif (biens immobiliers, comptes bancaires, placements, véhicules, mobilier) et du passif (dettes, impôts) de la succession. Chaque bien est évalué à sa valeur vénale au jour du partage, ce qui peut nécessiter l&apos;intervention d&apos;experts immobiliers.</p>

  <h3>2. La composition des lots</h3>
  <p>Le notaire constitue des lots de valeur équivalente correspondant aux droits de chaque héritier. Si certains biens ne peuvent être divisés (un immeuble, par exemple), une soulte peut être versée par l&apos;héritier qui reçoit le bien le plus important aux autres cohéritiers.</p>

  <h3>3. La signature de l&apos;acte de partage</h3>
  <p>L&apos;acte de partage est rédigé sous forme authentique par le notaire et signé par tous les héritiers. Il mentionne les biens attribués à chacun, les éventuelles soultes, et procède au calcul du droit de partage. Une fois signé, l&apos;acte est publié au service de la publicité foncière pour les biens immobiliers.</p>

  <InternalCTA />

  <h2>Coûts et fiscalité du partage successoral</h2>
  <p>Le partage successoral engendre plusieurs catégories de frais qu&apos;il convient d&apos;anticiper :</p>

  <ul>
    <li><strong>Le droit de partage</strong> : taxe de 2,5% calculée sur l&apos;actif net partagé (valeur des biens diminuée des dettes). C&apos;est généralement le poste le plus important.</li>
    <li><strong>Les émoluments du notaire</strong> : tarifs réglementés dégressifs selon la valeur, environ 1 à 2% de l&apos;actif partagé.</li>
    <li><strong>La contribution de sécurité immobilière</strong> : 0,10% pour la publication foncière.</li>
    <li><strong>Les débours</strong> : frais avancés par le notaire (cadastre, état hypothécaire, etc.).</li>
  </ul>

  <p>Pour une succession de 300 000 € sans dette, comptez environ 12 000 à 15 000 € de frais totaux. Une planification successorale anticipée (donation-partage, par exemple) permet souvent de réduire considérablement ces coûts.</p>

  <h2>Que faire en cas de désaccord entre héritiers ?</h2>
  <p>Lorsque les héritiers ne parviennent pas à s&apos;entendre sur la composition des lots ou la valeur des biens, plusieurs solutions existent avant d&apos;en arriver au contentieux.</p>

  <p><strong>La médiation notariale</strong> : le notaire joue un rôle de conciliateur et propose des arrangements équitables. Sa neutralité et son expertise permettent souvent de débloquer les situations tendues.</p>

  <p><strong>Le partage judiciaire</strong> : si aucun accord n&apos;est trouvé, un héritier peut saisir le tribunal judiciaire. Le juge ordonne alors l&apos;ouverture des opérations de partage et désigne un notaire pour les conduire. Cette procédure est longue (1 à 3 ans en moyenne) et coûteuse.</p>

  <p><strong>La vente par licitation</strong> : lorsqu&apos;un bien immobilier ne peut être attribué à un seul héritier et que personne ne souhaite l&apos;acquérir, le tribunal peut ordonner sa vente aux enchères. Le prix est ensuite réparti entre les héritiers.</p>

  <p>Pour éviter ces situations conflictuelles, il est vivement recommandé de consulter un notaire dès l&apos;ouverture de la succession afin d&apos;être conseillé sur la meilleure stratégie de partage.</p>

  <InternalCTA />
</>
    </>
  );
}
export function getPostContent(slug: string): ReactNode {
  const fn = CONTENT_MAP[slug];
  if (!fn) return null;
  return fn();
}
