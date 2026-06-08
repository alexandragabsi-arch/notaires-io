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
  "renoncer-succession-notaire": () => <Article16 />,
  "succession-concubin-non-marie": () => <Article17 />,
  "optimisation-fiscale-succession": () => <Article18 />,
  "rapport-donation-succession": () => <Article19 />,
  "legs-testament-notaire": () => <Article20 />,
  "succession-internationale": () => <Article21 />,
  "compromis-acte-de-vente-difference": () => <Article22 />,
  "plus-value-immobiliere-exoneration": () => <Article23 />,
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

/* ── Article 16 ─────────────────────────────────────────────────────────── */

function Article16() {
  return (
    <>
      <>
  <p className="lead">Renoncer à une succession devant notaire est une décision lourde de conséquences, souvent envisagée lorsque le défunt laisse plus de dettes que d&apos;actifs. Cette procédure encadrée par le Code civil vous permet de refuser totalement votre part d&apos;héritage et d&apos;échapper aux créanciers. Voici tout ce qu&apos;il faut savoir pour renoncer en toute sécurité.</p>

  <KeyPoints items={[
    "La renonciation est gratuite au greffe du tribunal, payante chez le notaire (15-30 €)",
    "Vous disposez de 10 ans pour renoncer, mais un créancier peut vous obliger à choisir en 4 mois",
    "Le renonçant est considéré comme n&apos;ayant jamais été héritier : ses enfants peuvent hériter par représentation",
    "La renonciation est révocable tant que la succession n&apos;a pas été acceptée par d&apos;autres héritiers"
  ]} />

  <h2>Pourquoi renoncer à une succession ?</h2>
  <p>La renonciation à succession est l&apos;une des trois options successorales offertes à l&apos;héritier, aux côtés de l&apos;acceptation pure et simple et de l&apos;acceptation à concurrence de l&apos;actif net. Elle se justifie principalement dans plusieurs situations.</p>

  <p>Le cas le plus fréquent est celui de la <strong>succession déficitaire</strong> : le défunt laisse plus de dettes (prêts bancaires, dettes fiscales, crédits à la consommation) que d&apos;actifs (immobilier, comptes, mobilier). Accepter la succession reviendrait alors à payer ces dettes sur votre propre patrimoine.</p>

  <p>D&apos;autres motifs peuvent justifier la renonciation :</p>
  <ul>
    <li>Favoriser ses propres enfants qui hériteront par représentation</li>
    <li>Éviter des conflits familiaux complexes</li>
    <li>Refuser un bien grevé de contraintes (indivision difficile, bien immobilier coûteux)</li>
    <li>Optimiser une transmission patrimoniale entre générations</li>
  </ul>

  <p>Attention : renoncer signifie renoncer à <strong>tout</strong>. Vous ne pouvez pas choisir de garder certains biens et refuser les dettes. C&apos;est pourquoi un bilan complet de la succession avec un notaire est indispensable avant toute décision.</p>

  <h2>La procédure de renonciation chez le notaire</h2>
  <p>Renoncer à une succession nécessite une démarche formelle. Deux options s&apos;offrent à vous : la déclaration au greffe du tribunal judiciaire du lieu d&apos;ouverture de la succession, ou l&apos;acte authentique chez un notaire.</p>

  <h3>Étape 1 : le bilan successoral</h3>
  <p>Avant toute renonciation, le notaire dresse un inventaire précis de l&apos;actif et du passif successoral. Il consulte le fichier FICOBA pour identifier les comptes bancaires, interroge les organismes de crédit et vérifie les éventuelles dettes fiscales. Cette analyse vous permet de prendre une décision éclairée.</p>

  <h3>Étape 2 : la rédaction de l&apos;acte de renonciation</h3>
  <p>Si vous décidez de renoncer, le notaire rédige un acte authentique de renonciation. Vous devez fournir :</p>
  <ul>
    <li>Une pièce d&apos;identité en cours de validité</li>
    <li>Un acte de naissance de moins de 3 mois</li>
    <li>L&apos;acte de décès du défunt</li>
    <li>Le formulaire Cerfa n°15828*05 dûment rempli</li>
  </ul>

  <h3>Étape 3 : l&apos;enregistrement officiel</h3>
  <p>L&apos;acte est ensuite transmis au tribunal judiciaire pour enregistrement. La renonciation devient alors opposable aux tiers, notamment aux créanciers du défunt qui ne pourront plus vous poursuivre.</p>

  <InternalCTA 
    title="Besoin d&apos;un notaire pour renoncer à une succession ?"
    description="Nos notaires partenaires vous accompagnent dans toute la procédure de renonciation. Premier rendez-vous offert en visio ou en cabinet."
    buttonText="Prendre rendez-vous"
    buttonLink="/rendez-vous"
  />

  <h2>Délais et conséquences de la renonciation</h2>
  <p>Le délai légal pour exercer votre option successorale est de <strong>10 ans</strong> à compter de l&apos;ouverture de la succession (date du décès). Passé ce délai sans manifestation de votre part, vous êtes réputé avoir renoncé.</p>

  <p>Cependant, ce délai peut être considérablement raccourci. Tout intéressé (créancier, cohéritier, État) peut vous sommer de prendre parti après l&apos;expiration d&apos;un délai de 4 mois suivant le décès. Vous disposez alors de <strong>2 mois supplémentaires</strong> pour vous décider, sous peine d&apos;être considéré comme acceptant purement et simplement la succession.</p>

  <h3>Les effets juridiques de la renonciation</h3>
  <p>Le renonçant est considéré comme n&apos;ayant <em>jamais été héritier</em>. Cette fiction juridique entraîne plusieurs conséquences importantes :</p>
  <ul>
    <li><strong>Aucune dette ne peut vous être réclamée</strong> au titre de la succession</li>
    <li><strong>Vos enfants peuvent hériter par représentation</strong> (depuis la loi du 23 juin 2006)</li>
    <li>Votre part accroît celle des autres héritiers de même rang</li>
    <li>Vous ne pouvez plus revendiquer aucun bien de la succession</li>
  </ul>

  <p>Attention aux <strong>actes équivalant à acceptation tacite</strong> : prélever de l&apos;argent sur les comptes du défunt, vendre un bien ou même payer une dette successorale peuvent être interprétés comme une acceptation, vous empêchant ensuite de renoncer.</p>

  <h2>Coût et révocation de la renonciation</h2>
  <p>La déclaration de renonciation directement au greffe du tribunal est <strong>gratuite</strong>. Toutefois, passer par un notaire offre plusieurs avantages : sécurité juridique, conseil personnalisé et accompagnement dans les démarches connexes (déclaration fiscale, information des autres héritiers).</p>

  <p>Les frais notariaux pour un acte de renonciation s&apos;élèvent généralement entre <strong>15 et 30 euros</strong>, auxquels peuvent s&apos;ajouter des honoraires de conseil si une analyse approfondie de la succession est nécessaire.</p>

  <h3>Peut-on revenir sur sa décision ?</h3>
  <p>La renonciation n&apos;est pas définitive. L&apos;article 807 du Code civil permet la <strong>révocation de la renonciation</strong> sous deux conditions cumulatives :</p>
  <ul>
    <li>Le délai de 10 ans pour accepter ne doit pas être écoulé</li>
    <li>La succession ne doit pas avoir été acceptée par un autre héritier</li>
  </ul>

  <p>Cette révocation se fait par déclaration au greffe ou par acte notarié. L&apos;héritier devient alors acceptant pur et simple ou à concurrence de l&apos;actif net, selon son choix.</p>
</>
    </>
  );
}

/* ── Article 17 ─────────────────────────────────────────────────────────── */

function Article17() {
  return (
    <>
      <>
<p className="lead">La succession d&apos;un concubin non marié soulève des enjeux majeurs en France : juridiquement, le concubin survivant est considéré comme un parfait étranger par la loi successorale. Sans anticipation chez un notaire, il risque de ne rien recevoir du patrimoine commun, voire d&apos;être expulsé du logement familial. Voici les solutions concrètes pour protéger votre partenaire.</p>

<KeyPoints points={[
  "Le concubin n&apos;a aucun droit successoral légal en France",
  "La fiscalité est de 60% après un abattement de seulement 1 594 €",
  "Le testament, la donation et l&apos;assurance-vie sont les principaux outils de protection",
  "Un rendez-vous notaire permet de bâtir une stratégie sur-mesure"
]} />

<h2>Concubinage et succession : un vide juridique total</h2>
<p>Contrairement aux époux ou aux partenaires de PACS, les concubins n&apos;ont aucun lien juridique reconnu en matière successorale. L&apos;article 515-8 du Code civil définit le concubinage comme une simple « union de fait », ce qui exclut tout droit à la succession.</p>
<p>Concrètement, si votre concubin décède sans avoir pris de dispositions, l&apos;intégralité de son patrimoine reviendra à ses héritiers légaux : enfants, parents, frères et sœurs. Vous ne recevrez rien, même après des décennies de vie commune.</p>
<p>Cette situation peut avoir des conséquences dramatiques, notamment concernant le logement. Si la résidence principale appartenait à votre concubin, ses héritiers peuvent exiger votre départ ou le rachat de leur part.</p>

<h2>Une fiscalité successorale très lourde pour le concubin</h2>
<p>Même lorsque le concubin reçoit quelque chose par testament ou donation, la fiscalité applicable est particulièrement punitive :</p>
<ul>
  <li><strong>Abattement :</strong> seulement 1 594 € (contre 100 000 € entre parent et enfant)</li>
  <li><strong>Taux d&apos;imposition :</strong> 60% sur la totalité de la part nette</li>
  <li><strong>Aucun barème progressif :</strong> contrairement aux héritiers en ligne directe</li>
</ul>
<p>Exemple : pour un legs de 200 000 € à votre concubin, les droits de succession s&apos;élèvent à environ 119 044 €. Votre partenaire ne touche en réalité que 80 956 €.</p>
<p>Cette fiscalité confiscatoire impose de structurer la transmission avec un notaire pour limiter au maximum l&apos;impact fiscal.</p>

<InternalCTA />

<h2>Les solutions notariales pour protéger son concubin</h2>
<p>Heureusement, plusieurs outils juridiques permettent d&apos;organiser efficacement la transmission au profit du concubin survivant.</p>

<h3>Le testament authentique</h3>
<p>Rédigé devant notaire, le testament permet de léguer à votre concubin la quotité disponible de votre patrimoine. Si vous avez des enfants, vous devez respecter leur réserve héréditaire, mais vous pouvez transmettre 1/2, 1/3 ou 1/4 selon le nombre d&apos;enfants.</p>

<h3>L&apos;assurance-vie : l&apos;outil le plus efficace</h3>
<p>L&apos;assurance-vie échappe aux règles successorales classiques. Vous pouvez désigner votre concubin comme bénéficiaire et lui transmettre jusqu&apos;à 152 500 € en franchise totale d&apos;impôt (pour les primes versées avant 70 ans).</p>

<h3>La donation au dernier vivant : impossible</h3>
<p>Attention, contrairement aux époux, les concubins ne peuvent pas bénéficier d&apos;une donation au dernier vivant. C&apos;est une raison majeure d&apos;envisager le mariage ou le PACS.</p>

<h3>La SCI familiale</h3>
<p>Créer une SCI permet d&apos;organiser la détention du logement et de prévoir des clauses statutaires protectrices (démembrement croisé des parts, droit de préemption).</p>

<h2>PACS ou mariage : pourquoi y penser ?</h2>
<p>Avant d&apos;engager des stratégies complexes, il faut savoir que le PACS et le mariage offrent des avantages successoraux considérables :</p>
<ul>
  <li><strong>Mariage :</strong> exonération totale des droits de succession entre époux + droits légaux du conjoint survivant</li>
  <li><strong>PACS :</strong> exonération totale des droits de succession (mais nécessite un testament pour hériter)</li>
</ul>
<p>Le simple fait de signer un PACS et de rédiger un testament chez le notaire suffit à transformer radicalement la situation patrimoniale du survivant.</p>

<h2>Pourquoi consulter un notaire ?</h2>
<p>Chaque situation de concubinage est unique : enfants d&apos;une précédente union, patrimoine immobilier en indivision, entreprise familiale, écart de patrimoine entre concubins... Seul un notaire peut bâtir une stratégie patrimoniale adaptée combinant testament, assurance-vie, donations et structures juridiques.</p>
<p>Le premier rendez-vous chez nos notaires partenaires est offert et permet d&apos;identifier les leviers prioritaires pour protéger votre concubin.</p>

<InternalCTA />
</>
    </>
  );
}

/* ── Article 18 ─────────────────────────────────────────────────────────── */

function Article18() {
  return (
    <>
      <>
  <p className="lead">L&apos;optimisation fiscale succession notaire est une démarche stratégique pour transmettre votre patrimoine dans les meilleures conditions. En France, les droits de succession peuvent atteindre 45 % en ligne directe et jusqu&apos;à 60 % entre non-parents. Anticiper avec un notaire permet de réduire significativement cette charge fiscale tout en respectant le cadre légal.</p>

  <KeyPoints points={[
    "Abattement de 100 000 € par enfant et par parent, renouvelable tous les 15 ans",
    "L&apos;assurance-vie reste l&apos;outil le plus efficace de transmission hors succession",
    "Le démembrement de propriété permet de transmettre à moindre coût fiscal",
    "Une planification précoce avec un notaire maximise les économies fiscales"
  ]} />

  <h2>Comprendre les droits de succession en France</h2>
  <p>Les droits de succession sont calculés selon un barème progressif qui dépend du lien de parenté entre le défunt et l&apos;héritier. En ligne directe (enfants, parents), le taux varie de 5 % à 45 % après application d&apos;un abattement de 100 000 € par héritier. Entre frères et sœurs, le taux atteint 35 % à 45 %, et entre personnes non parentes, il grimpe à 60 %.</p>
  <p>Sans préparation, votre famille peut se retrouver avec une facture fiscale considérable, parfois supérieure aux liquidités disponibles. C&apos;est pourquoi l&apos;optimisation fiscale succession avec un notaire est essentielle pour préserver le patrimoine que vous avez constitué.</p>
  <p>Le notaire dispose d&apos;une vision globale de votre situation : composition du patrimoine, situation familiale, objectifs de transmission. Il peut ainsi proposer une stratégie sur mesure combinant plusieurs outils juridiques et fiscaux.</p>

  <h2>Les donations : un levier d&apos;optimisation puissant</h2>
  <p>La donation est l&apos;outil principal d&apos;optimisation fiscale successorale. Chaque parent peut donner jusqu&apos;à 100 000 € à chaque enfant en franchise de droits, et ce tous les 15 ans. Un couple avec deux enfants peut donc transmettre 400 000 € sans fiscalité, et renouveler l&apos;opération après 15 ans.</p>
  <p>Plusieurs formes de donation existent :</p>
  <ul>
    <li><strong>La donation simple</strong> : transmission immédiate d&apos;un bien ou d&apos;une somme d&apos;argent</li>
    <li><strong>La donation-partage</strong> : permet de répartir équitablement entre héritiers et de figer les valeurs au jour de la donation</li>
    <li><strong>Le don familial de somme d&apos;argent</strong> : abattement supplémentaire de 31 865 € si le donateur a moins de 80 ans et le donataire plus de 18 ans</li>
    <li><strong>La donation avec réserve d&apos;usufruit</strong> : vous transmettez la nue-propriété tout en conservant l&apos;usage du bien</li>
  </ul>

  <InternalCTA
    title="Préparez votre succession avec un notaire"
    description="Bénéficiez d&apos;un premier rendez-vous offert pour analyser votre situation patrimoniale et identifier les meilleures stratégies d&apos;optimisation fiscale."
    buttonText="Prendre rendez-vous"
    href="/rendez-vous"
  />

  <h2>L&apos;assurance-vie et le démembrement : les stratégies avancées</h2>
  <p>L&apos;assurance-vie reste l&apos;outil de transmission le plus avantageux fiscalement. Les capitaux versés avant 70 ans bénéficient d&apos;un abattement de 152 500 € par bénéficiaire, puis d&apos;une taxation forfaitaire de 20 % jusqu&apos;à 700 000 € et 31,25 % au-delà. Pour les versements après 70 ans, l&apos;abattement global est de 30 500 €, mais les intérêts restent exonérés.</p>
  <p>Le démembrement de propriété consiste à séparer la nue-propriété de l&apos;usufruit. En donnant la nue-propriété de votre vivant, vous transmettez à un coût fiscal réduit : la valeur taxable est calculée selon un barème lié à votre âge. À 60 ans, la nue-propriété ne représente que 50 % de la valeur du bien.</p>
  <p>Au décès de l&apos;usufruitier, le nu-propriétaire récupère la pleine propriété sans aucun droit supplémentaire à payer. C&apos;est une stratégie particulièrement efficace pour transmettre l&apos;immobilier.</p>

  <h2>Structures juridiques et stratégies patrimoniales</h2>
  <p>Pour les patrimoines importants ou immobiliers, la création d&apos;une SCI (Société Civile Immobilière) facilite la transmission. Les parts sociales peuvent être données progressivement, en profitant des abattements renouvelables, et le démembrement des parts amplifie l&apos;effet fiscal.</p>
  <p>Le pacte Dutreil, quant à lui, permet de transmettre une entreprise familiale avec une exonération de 75 % de sa valeur, sous conditions d&apos;engagement de conservation. Combiné à une donation en pleine propriété avant 70 ans avec réduction de 50 %, l&apos;économie peut être spectaculaire.</p>
  <p>Enfin, le changement de régime matrimonial vers une communauté universelle avec clause d&apos;attribution intégrale peut protéger le conjoint survivant, même si cette stratégie reporte la fiscalité sur la génération suivante. Votre notaire évaluera son opportunité selon votre situation.</p>

  <h2>Conclusion</h2>
  <p>L&apos;optimisation fiscale d&apos;une succession ne s&apos;improvise pas. Elle nécessite une analyse approfondie de votre patrimoine, de votre situation familiale et de vos objectifs. Les outils existent : donations, assurance-vie, démembrement, structures sociétaires. Encore faut-il les combiner intelligemment et anticiper.</p>
  <p>Le notaire est votre interlocuteur privilégié pour bâtir une stratégie cohérente, sécurisée juridiquement et optimisée fiscalement. Plus vous anticipez, plus les économies seront importantes pour vos héritiers.</p>

  <InternalCTA
    title="Optimisez votre succession dès aujourd&apos;hui"
    description="Nos notaires partenaires vous accompagnent dans la planification de votre transmission patrimoniale. Premier rendez-vous offert, en visio ou au cabinet."
    buttonText="Consulter un notaire"
    href="/rendez-vous"
  />
</>
    </>
  );
}

/* ── Article 19 ─────────────────────────────────────────────────────────── */

function Article19() {
  return (
    <>
      <>
<p className="lead">Le rapport des donations à la succession est un mécanisme juridique essentiel qui garantit l&apos;égalité entre les héritiers lors du règlement d&apos;une succession. Lorsqu&apos;un défunt a consenti des donations de son vivant à certains de ses héritiers, ces libéralités doivent en principe être réintégrées dans la masse successorale pour assurer un partage équitable.</p>

<KeyPoints items={[
  "Le rapport civil concerne les donations faites aux héritiers, sauf mention contraire dans l&apos;acte",
  "Les biens sont évalués à leur valeur au jour du partage, dans leur état au jour de la donation",
  "Les présents d&apos;usage et donations hors part successorale échappent au rapport",
  "Le notaire calcule le rapport et veille à l&apos;équilibre entre cohéritiers"
]} />

<h2>Qu&apos;est-ce que le rapport des donations à la succession ?</h2>
<p>Le rapport des donations est une opération juridique prévue par les articles 843 et suivants du Code civil. Il consiste à reconstituer fictivement le patrimoine du défunt en y réintégrant les donations consenties de son vivant à ses héritiers. L&apos;objectif est d&apos;assurer l&apos;égalité du partage entre les cohéritiers.</p>
<p>Concrètement, un héritier qui a reçu une donation devra, lors de la succession, en tenir compte sur sa part d&apos;héritage. Si la donation dépasse la part qui lui revient, il pourra être amené à verser une indemnité de rapport aux autres héritiers.</p>
<p>Ce mécanisme repose sur une présomption : sauf disposition contraire, une donation faite à un héritier est considérée comme une avance sur sa part d&apos;héritage, et non comme un avantage destiné à le favoriser.</p>

<h2>Quelles donations sont rapportables à la succession ?</h2>
<p>Toutes les donations ne sont pas soumises à l&apos;obligation de rapport. Plusieurs critères permettent de déterminer si une libéralité doit être réintégrée à la masse successorale.</p>

<h3>Les donations rapportables</h3>
<p>Sont rapportables les donations consenties à un héritier acceptant la succession, qu&apos;il s&apos;agisse :</p>
<ul>
  <li>Des donations notariées (donation simple, donation-partage incluse dans certains cas)</li>
  <li>Des dons manuels (somme d&apos;argent, objets, bijoux)</li>
  <li>Des donations indirectes (vente à prix minoré, abandon de créance)</li>
  <li>Des donations déguisées</li>
</ul>

<h3>Les donations non rapportables</h3>
<p>Certaines libéralités échappent au rapport :</p>
<ul>
  <li><strong>Les donations hors part successorale</strong> : expressément stipulées comme un avantage en plus de la part d&apos;héritage, elles s&apos;imputent sur la quotité disponible</li>
  <li><strong>Les présents d&apos;usage</strong> : cadeaux remis lors d&apos;occasions particulières (mariage, anniversaire) dont la valeur reste proportionnée au train de vie du donateur</li>
  <li><strong>Les donations faites à un non-héritier</strong> (un ami, par exemple)</li>
  <li><strong>Les donations-partages</strong>, qui sont en principe définitives et non soumises au rapport</li>
</ul>

<h2>Comment évaluer une donation rapportable ?</h2>
<p>L&apos;évaluation du rapport est une étape délicate qui obéit à des règles précises fixées par l&apos;article 860 du Code civil.</p>

<h3>Le principe de la double référence</h3>
<p>Le bien donné est évalué selon deux références :</p>
<ul>
  <li><strong>Sa valeur au jour du partage</strong> : pour tenir compte de l&apos;évolution du marché et de l&apos;inflation</li>
  <li><strong>Son état au jour de la donation</strong> : les améliorations apportées par le donataire ne sont pas prises en compte dans le rapport</li>
</ul>
<p>Cette règle protège l&apos;équité : un héritier qui aurait reçu un terrain construit ensuite par ses soins ne sera pas pénalisé par la valeur ajoutée qu&apos;il a personnellement créée.</p>

<h3>Cas particulier des sommes d&apos;argent</h3>
<p>Pour les dons de sommes d&apos;argent, le rapport est en principe égal au montant nominal donné. Toutefois, si la somme a servi à acquérir un bien, le rapport est calculé sur la valeur de ce bien au jour du partage.</p>

<h2>Le rôle du notaire dans le calcul du rapport</h2>
<p>Le notaire joue un rôle central dans l&apos;application des règles de rapport. Il est chargé de :</p>
<ul>
  <li>Recenser toutes les donations consenties par le défunt</li>
  <li>Qualifier juridiquement chaque libéralité (rapportable ou non)</li>
  <li>Évaluer les biens donnés selon les règles légales</li>
  <li>Calculer la masse successorale reconstituée</li>
  <li>Déterminer les parts de chaque héritier et les éventuelles indemnités de rapport</li>
</ul>
<p>Cette mission requiert une grande rigueur, surtout lorsque les donations sont anciennes ou que des contestations surgissent entre cohéritiers. Le notaire veille également à vérifier que la réserve héréditaire de chaque héritier réservataire est respectée.</p>

<InternalCTA
  title="Besoin d&apos;un notaire pour votre succession ?"
  description="Le rapport des donations est une opération technique qui demande l&apos;expertise d&apos;un professionnel. Échangez avec un notaire de Notaires.io, premier rendez-vous offert."
  buttonText="Prendre rendez-vous"
  buttonLink="/prendre-rendez-vous"
/>
</>
    </>
  );
}

/* ── Article 20 ─────────────────────────────────────────────────────────── */

function Article20() {
  return (
    <>
      <>
<p className="lead">Le <strong>legs particulier, universel ou à titre universel inscrit dans un testament rédigé chez le notaire</strong> permet d&apos;organiser sereinement la transmission de votre patrimoine. Comprendre ces trois catégories est essentiel pour exprimer vos volontés avec précision et éviter tout litige successoral.</p>

<KeyPoints items={[
  "Le legs universel transmet l&apos;intégralité du patrimoine à un ou plusieurs bénéficiaires",
  "Le legs à titre universel attribue une quote-part ou une catégorie de biens",
  "Le legs particulier vise un bien précis identifié dans le testament",
  "Le testament authentique notarié offre la sécurité juridique maximale"
]} />

<h2>Comprendre les trois types de legs dans un testament</h2>
<p>En droit français, le Code civil distingue trois formes de legs que vous pouvez intégrer dans votre testament. Chacune répond à un objectif patrimonial différent et entraîne des conséquences juridiques spécifiques pour vos héritiers et légataires.</p>

<h3>Le legs universel</h3>
<p>Le legs universel désigne un ou plusieurs bénéficiaires destinés à recevoir <strong>l&apos;ensemble des biens</strong> que vous laisserez à votre décès. Le légataire universel est traité comme un véritable héritier : il reçoit l&apos;actif, mais doit aussi assumer le passif (dettes, charges). En présence d&apos;héritiers réservataires (enfants, conjoint dans certains cas), le legs universel ne peut porter que sur la quotité disponible.</p>

<h3>Le legs à titre universel</h3>
<p>Le legs à titre universel porte sur <strong>une fraction du patrimoine</strong> : la moitié, le tiers, tous les immeubles, ou tous les meubles. Le légataire reçoit donc une quote-part proportionnelle de l&apos;actif et du passif. C&apos;est une solution intermédiaire utile pour répartir précisément votre succession entre plusieurs personnes.</p>

<h3>Le legs particulier</h3>
<p>Le legs particulier concerne <strong>un ou plusieurs biens identifiés</strong> : une somme d&apos;argent, un appartement, un véhicule, une œuvre d&apos;art, des bijoux. Contrairement aux autres legs, le légataire particulier n&apos;est pas tenu des dettes successorales (sauf clause contraire) et n&apos;a pas la qualité d&apos;héritier.</p>

<h2>Pourquoi rédiger son testament devant un notaire ?</h2>
<p>Si le testament olographe (entièrement écrit, daté et signé de votre main) reste valable, le <strong>testament authentique reçu par un notaire</strong> présente des avantages décisifs. Il garantit le respect des règles de forme, évite les contestations sur l&apos;état mental du testateur et sécurise l&apos;interprétation des volontés.</p>
<p>Le notaire vérifie également que vos legs respectent la réserve héréditaire, conseille sur les conséquences fiscales et inscrit le testament au <strong>Fichier Central des Dispositions de Dernières Volontés (FCDDV)</strong>, garantissant qu&apos;il sera retrouvé et exécuté.</p>

<InternalCTA 
  title="Rédigez votre testament avec un notaire"
  description="Sécurisez la transmission de votre patrimoine. Premier rendez-vous offert, en visio ou en cabinet."
  buttonText="Prendre rendez-vous"
  href="/rendez-vous"
/>

<h2>Fiscalité des legs : ce qu&apos;il faut anticiper</h2>
<p>Les droits de succession applicables aux legs dépendent du lien de parenté entre vous et le légataire. Voici les principaux barèmes à connaître :</p>
<ul>
  <li><strong>Enfants et parents</strong> : abattement de 100 000 €, puis barème progressif de 5 % à 45 %</li>
  <li><strong>Frères et sœurs</strong> : abattement de 15 932 €, taux de 35 % ou 45 %</li>
  <li><strong>Neveux et nièces</strong> : abattement de 7 967 €, taux de 55 %</li>
  <li><strong>Tiers (non parents)</strong> : abattement de 1 594 €, taux de 60 %</li>
  <li><strong>Conjoint et partenaire de PACS</strong> : exonération totale</li>
  <li><strong>Associations reconnues d&apos;utilité publique</strong> : exonération possible</li>
</ul>
<p>Un notaire vous aidera à structurer vos legs pour optimiser la transmission, par exemple en démembrant la propriété ou en combinant donations du vivant et legs testamentaires.</p>

<h2>Conseils pratiques pour rédiger vos legs</h2>
<p>Pour que vos volontés soient pleinement respectées, suivez ces recommandations :</p>
<ul>
  <li><strong>Identifiez précisément les bénéficiaires</strong> : nom, prénom, date et lieu de naissance pour éviter toute ambiguïté</li>
  <li><strong>Décrivez les biens avec exactitude</strong> dans le cas d&apos;un legs particulier (références cadastrales, numéros de compte)</li>
  <li><strong>Prévoyez un légataire de substitution</strong> au cas où le premier décède avant vous ou renonce au legs</li>
  <li><strong>Anticipez les charges et conditions</strong> éventuelles attachées au legs</li>
  <li><strong>Mettez à jour régulièrement</strong> votre testament en cas d&apos;évolution familiale ou patrimoniale</li>
</ul>
<p>N&apos;oubliez pas que vous pouvez révoquer ou modifier votre testament à tout moment, tant que vous êtes vivant et capable juridiquement.</p>

<h2>En résumé</h2>
<p>Choisir entre legs particulier, universel ou à titre universel dépend de vos objectifs : transmettre l&apos;ensemble de votre patrimoine, en répartir une part, ou attribuer un bien précis. Le recours au <strong>notaire pour rédiger un testament authentique</strong> est la meilleure garantie pour que vos volontés soient respectées, dans le strict cadre légal et fiscal.</p>
</>
    </>
  );
}

/* ── Article 21 ─────────────────────────────────────────────────────────── */

function Article21() {
  return (
    <>
      <>
  <p className="lead">La succession internationale avec un notaire français concerne toute succession comportant un élément d&apos;extranéité : défunt résidant à l&apos;étranger, héritiers expatriés ou biens situés hors de France. Ces dossiers complexes nécessitent une expertise juridique pointue pour déterminer la loi applicable, organiser le règlement et optimiser la fiscalité.</p>

  <KeyPoints items={[
    "Le règlement européen n°650/2012 régit les successions ouvertes depuis le 17 août 2015",
    "La loi applicable est celle du dernier domicile du défunt, sauf choix contraire",
    "Le certificat successoral européen facilite les démarches dans toute l&apos;UE",
    "Des conventions fiscales évitent la double imposition dans 30+ pays",
    "Le notaire français coordonne avec ses confrères étrangers"
  ]} />

  <h2>Quelle loi s&apos;applique à une succession internationale ?</h2>
  <p>Depuis l&apos;entrée en vigueur du règlement européen du 4 juillet 2012, la règle a été profondément simplifiée. Auparavant, la France appliquait un système dualiste : la loi du domicile du défunt pour les biens mobiliers et la loi du lieu de situation pour les biens immobiliers. Désormais, une seule loi régit l&apos;ensemble de la succession.</p>

  <p>Le principe est simple : la loi applicable est celle de la <strong>résidence habituelle du défunt</strong> au moment de son décès. Cette règle s&apos;applique à toutes les successions ouvertes depuis le 17 août 2015, même si le défunt n&apos;était pas ressortissant d&apos;un État membre.</p>

  <p>Toutefois, toute personne peut, par testament, choisir que la loi de sa nationalité régisse sa succession. Ce choix, appelé <em>professio juris</em>, doit être explicite et formalisé. Pour un Français vivant à l&apos;étranger, cela permet par exemple de conserver les règles françaises de la réserve héréditaire qui protègent les enfants.</p>

  <h2>Le rôle central du notaire français dans une succession transfrontalière</h2>
  <p>Le notaire français intervient dès lors qu&apos;un élément rattache la succession à la France : nationalité française du défunt, biens immobiliers sur le territoire, héritier résidant en France ou compte bancaire français. Son rôle est multiple.</p>

  <p><strong>Identification de la loi applicable :</strong> le notaire analyse le dossier pour déterminer la résidence habituelle du défunt, vérifier l&apos;existence d&apos;un choix de loi testamentaire et identifier les règles successorales à appliquer.</p>

  <p><strong>Coordination internationale :</strong> il établit le contact avec les notaires, avocats ou autorités étrangères compétentes. Cette coordination est essentielle pour éviter les conflits de procédures et accélérer le règlement.</p>

  <p><strong>Délivrance du certificat successoral européen :</strong> ce document, créé par le règlement européen, prouve la qualité d&apos;héritier, de légataire ou d&apos;exécuteur testamentaire dans tous les États membres (sauf Danemark et Irlande). Il évite des démarches longues et coûteuses dans chaque pays.</p>

  <h2>La fiscalité d&apos;une succession internationale</h2>
  <p>La question fiscale est souvent la plus complexe. Contrairement au règlement civil unifié, la fiscalité reste régie par le droit interne de chaque État. En France, le Code général des impôts prévoit une imposition large.</p>

  <p>Les droits de succession français s&apos;appliquent si :</p>
  <ul>
    <li>Le défunt avait son domicile fiscal en France ;</li>
    <li>L&apos;héritier est domicilié fiscalement en France (et l&apos;a été au moins 6 ans sur les 10 dernières années) ;</li>
    <li>Les biens transmis sont situés en France (immeubles, comptes bancaires, parts de SCI, etc.).</li>
  </ul>

  <p>Pour éviter la double imposition, la France a signé des conventions fiscales bilatérales avec une trentaine de pays (États-Unis, Royaume-Uni, Allemagne, Italie, Belgique, Suisse, etc.). Ces conventions attribuent le droit d&apos;imposer à l&apos;un ou l&apos;autre État, ou prévoient un crédit d&apos;impôt.</p>

  <p>En l&apos;absence de convention, l&apos;article 784 A du CGI permet d&apos;imputer l&apos;impôt étranger payé sur les biens situés hors de France sur les droits français correspondants. Une analyse fine est indispensable pour optimiser la transmission.</p>

  <h2>Les étapes du règlement d&apos;une succession internationale</h2>
  <p>Le règlement d&apos;une succession internationale suit plusieurs étapes coordonnées par le notaire.</p>

  <p><strong>1. Ouverture du dossier :</strong> recueil des documents (acte de décès, livret de famille, testament éventuel, titres de propriété), identification des héritiers et inventaire du patrimoine mondial.</p>

  <p><strong>2. Détermination de la loi applicable :</strong> analyse de la résidence habituelle, recherche d&apos;un choix de loi et qualification des biens.</p>

  <p><strong>3. Établissement des actes :</strong> acte de notoriété, attestation immobilière pour les biens français, certificat successoral européen si nécessaire.</p>

  <p><strong>4. Déclaration fiscale :</strong> dépôt de la déclaration de succession dans les 6 mois (12 mois si le défunt est décédé à l&apos;étranger) et paiement des droits.</p>

  <p><strong>5. Partage :</strong> répartition des biens entre les héritiers selon la loi applicable, avec éventuellement un partage transfrontalier coordonné.</p>

  <InternalCTA />
</>
    </>
  );
}

/* ── Article 22 ─────────────────────────────────────────────────────────── */

function Article22() {
  return (
    <>
      <>
  <p className="lead">La différence entre <strong>compromis vs acte de vente notaire</strong> est essentielle à comprendre avant tout achat immobilier. Ces deux documents jalonnent la transaction mais n&apos;ont ni la même portée juridique, ni les mêmes effets. Le compromis engage les parties à conclure la vente, tandis que l&apos;acte authentique signé chez le notaire transfère effectivement la propriété. Décryptage complet pour sécuriser votre projet immobilier.</p>

  <KeyPoints items={[
    "Le compromis de vente est un avant-contrat qui engage vendeur et acheteur",
    "L&apos;acte de vente notarié officialise le transfert de propriété",
    "Le délai moyen entre les deux signatures est de 3 à 4 mois",
    "Seul l&apos;acte authentique a force exécutoire et est publié au service de la publicité foncière"
  ]} />

  <h2>Qu&apos;est-ce que le compromis de vente ?</h2>
  <p>Le compromis de vente, ou promesse synallagmatique de vente, est un avant-contrat par lequel le vendeur s&apos;engage à vendre son bien et l&apos;acheteur à l&apos;acquérir, à un prix convenu. Juridiquement, il vaut vente : &quot;promesse de vente vaut vente&quot; selon l&apos;article 1589 du Code civil.</p>
  <p>Ce document contient des informations essentielles : identité des parties, description précise du bien, prix, conditions suspensives (obtention du prêt, absence de servitude, droit de préemption), date prévisionnelle de signature de l&apos;acte authentique et montant du dépôt de garantie (généralement 5 à 10 % du prix).</p>
  <p>L&apos;acheteur bénéficie d&apos;un <strong>délai de rétractation de 10 jours</strong> à compter du lendemain de la première présentation de la notification. Passé ce délai, l&apos;engagement devient ferme.</p>

  <h2>L&apos;acte de vente notarié : la concrétisation</h2>
  <p>L&apos;acte de vente, dit aussi acte authentique, est le document signé chez le notaire qui formalise définitivement la transaction. Contrairement au compromis, il transfère la propriété du bien et donne lieu au paiement intégral du prix ainsi qu&apos;au versement des frais de notaire.</p>
  <p>Le notaire procède à plusieurs vérifications cruciales avant la signature :</p>
  <ul>
    <li>Contrôle de l&apos;origine de propriété sur 30 ans</li>
    <li>Purge des droits de préemption (commune, SAFER)</li>
    <li>Vérification des hypothèques et servitudes</li>
    <li>Conformité urbanistique et diagnostics techniques</li>
    <li>Capacité juridique des parties</li>
  </ul>
  <p>Une fois signé, l&apos;acte est publié au service de la publicité foncière, ce qui le rend opposable aux tiers. Le notaire conserve la minute pendant 75 ans avant son transfert aux Archives nationales.</p>

  <h2>Compromis vs acte de vente notaire : les différences essentielles</h2>
  <p>Plusieurs points distinguent fondamentalement ces deux étapes :</p>
  <p><strong>Force juridique :</strong> le compromis est un contrat sous seing privé (sauf s&apos;il est notarié), tandis que l&apos;acte de vente est authentique et a force exécutoire. En cas de litige, l&apos;acte authentique fait foi sans nécessité d&apos;autres preuves.</p>
  <p><strong>Transfert de propriété :</strong> le compromis crée une obligation de conclure la vente, mais ne transfère pas la propriété. Seul l&apos;acte de vente opère ce transfert effectif, accompagné de la remise des clés.</p>
  <p><strong>Paiement et fiscalité :</strong> au compromis, seul le dépôt de garantie est versé. À l&apos;acte authentique, le prix total est payé ainsi que les frais de notaire (7 à 8 % dans l&apos;ancien, 2 à 3 % dans le neuf).</p>
  <p><strong>Délai :</strong> entre les deux signatures, comptez généralement 3 à 4 mois. Ce délai permet d&apos;obtenir le financement, de purger les conditions suspensives et de réunir tous les documents requis.</p>

  <h2>Pourquoi faire signer son compromis chez le notaire ?</h2>
  <p>Bien que non obligatoire, la signature du compromis chez un notaire présente de nombreux avantages. Le notaire rédige un acte sur mesure, intègre toutes les conditions suspensives adaptées à votre situation et vérifie en amont la situation juridique du bien.</p>
  <p>Cette sécurité juridique évite de mauvaises surprises lors de la signature de l&apos;acte authentique. De plus, faire intervenir le notaire dès le compromis n&apos;entraîne généralement pas de surcoût : ses émoluments sont calculés globalement sur la transaction.</p>
  <p>En cas de litige, de désaccord sur les conditions ou de complexité particulière (indivision, succession en cours, bien démembré), l&apos;accompagnement notarial dès le compromis est vivement recommandé.</p>

  <InternalCTA />
</>
    </>
  );
}

/* ── Article 23 ─────────────────────────────────────────────────────────── */

function Article23() {
  return (
    <>
      <>
  <p className="lead">La plus-value immobilière et l&apos;exonération de la résidence principale constituent un avantage fiscal majeur en France : la vente de votre logement principal échappe totalement à l&apos;imposition. Mais cette exonération obéit à des conditions strictes qu&apos;il faut maîtriser pour éviter un redressement fiscal.</p>

  <KeyPoints points={[
    "Exonération totale de plus-value pour la vente de la résidence principale",
    "Le bien doit être votre habitation effective au jour de la cession",
    "Délai toléré d&apos;environ 12 mois entre départ et vente",
    "Autres exonérations possibles : durée de détention, montant, première cession"
  ]} />

  <h2>Qu&apos;est-ce que la plus-value immobilière ?</h2>
  <p>La plus-value immobilière correspond à la différence entre le prix de vente d&apos;un bien et son prix d&apos;acquisition. Lorsqu&apos;elle est positive, elle est en principe soumise à l&apos;impôt sur le revenu au taux de 19 % et aux prélèvements sociaux de 17,2 %, soit une taxation globale de 36,2 %.</p>
  <p>Heureusement, plusieurs cas d&apos;exonération existent, et le plus connu concerne la résidence principale. Cette règle vise à ne pas pénaliser les ménages qui changent de logement au cours de leur vie.</p>

  <h2>L&apos;exonération de la résidence principale : conditions</h2>
  <p>L&apos;article 150 U-II-1° du Code général des impôts prévoit une exonération totale de plus-value pour la cession de la résidence principale. Trois conditions doivent être réunies.</p>

  <h3>1. Le bien doit être votre habitation principale</h3>
  <p>La résidence principale est définie comme le lieu où vous résidez habituellement et effectivement pendant la majeure partie de l&apos;année. L&apos;administration vérifie cette qualité à partir de plusieurs indices : déclarations fiscales, factures de consommation (eau, électricité), adresse de domiciliation bancaire, scolarisation des enfants, etc.</p>
  <p>Une simple déclaration ne suffit pas : il faut prouver une occupation réelle. Un bien loué meublé ou vide ne peut pas être qualifié de résidence principale.</p>

  <h3>2. L&apos;occupation au jour de la cession</h3>
  <p>Le bien doit constituer votre résidence principale au jour de la vente. Si vous avez déménagé avant la signature de l&apos;acte authentique, l&apos;exonération peut être remise en cause.</p>
  <p>Toutefois, l&apos;administration fiscale admet une tolérance : si le logement est mis en vente immédiatement après votre départ et reste inoccupé, l&apos;exonération est maintenue pendant un délai raisonnable, généralement estimé à 12 mois.</p>

  <h3>3. Les dépendances immédiates</h3>
  <p>L&apos;exonération s&apos;étend aux dépendances immédiates et nécessaires (garage, cave, jardin) vendues en même temps que la résidence principale. Un garage situé à moins d&apos;un kilomètre est généralement considéré comme une dépendance.</p>

  <InternalCTA
    title="Vendez votre bien en toute sécurité fiscale"
    description="Nos notaires vous accompagnent pour sécuriser votre exonération de plus-value et éviter tout redressement."
    buttonText="Consulter un notaire"
    href="/trouver-notaire"
  />

  <h2>Les autres cas d&apos;exonération de plus-value</h2>
  <p>Si votre bien n&apos;est pas votre résidence principale, d&apos;autres dispositifs peuvent vous exonérer totalement ou partiellement.</p>

  <h3>Exonération pour durée de détention</h3>
  <p>La plus-value bénéficie d&apos;abattements progressifs selon la durée de détention :</p>
  <ul>
    <li>Exonération totale d&apos;impôt sur le revenu après 22 ans de détention</li>
    <li>Exonération totale des prélèvements sociaux après 30 ans</li>
  </ul>

  <h3>Première cession d&apos;une résidence secondaire</h3>
  <p>Si vous n&apos;avez pas été propriétaire de votre résidence principale au cours des 4 années précédentes et que vous réinvestissez le prix de vente dans l&apos;achat de votre résidence principale dans les 24 mois, vous bénéficiez d&apos;une exonération.</p>

  <h3>Petites cessions et situations particulières</h3>
  <p>Sont également exonérées : les ventes inférieures à 15 000 €, les cessions par des retraités ou invalides à revenus modestes, les ventes au profit d&apos;organismes de logement social.</p>

  <h2>Comment calculer la plus-value imposable ?</h2>
  <p>Si votre bien n&apos;est pas exonéré, le calcul s&apos;effectue ainsi :</p>
  <ul>
    <li><strong>Prix de cession</strong> : prix de vente diminué des frais (diagnostics, mainlevée d&apos;hypothèque)</li>
    <li><strong>Prix d&apos;acquisition</strong> : prix d&apos;achat majoré des frais de notaire (forfait 7,5 % possible) et des travaux (forfait 15 % après 5 ans de détention)</li>
    <li><strong>Abattements pour durée de détention</strong> appliqués sur la différence</li>
  </ul>
  <p>Le notaire calcule et déclare la plus-value lors de la signature de l&apos;acte authentique. L&apos;impôt est prélevé directement sur le prix de vente.</p>

  <h2>Les pièges à éviter</h2>
  <p>Plusieurs situations peuvent compromettre l&apos;exonération :</p>
  <ul>
    <li><strong>Vente après déménagement</strong> : si vous attendez trop longtemps, l&apos;exonération tombe</li>
    <li><strong>Bien loué récemment</strong> : la location, même brève, peut requalifier le bien</li>
    <li><strong>Double résidence</strong> : un seul logement peut être qualifié de résidence principale</li>
    <li><strong>Construction non terminée</strong> : un bien inachevé ne peut être une résidence principale</li>
  </ul>
  <p>En cas de doute, consultez un notaire avant la mise en vente. Une analyse préalable de votre situation permet d&apos;anticiper et de sécuriser l&apos;exonération.</p>

  <InternalCTA
    title="Une question sur votre plus-value immobilière ?"
    description="Premier rendez-vous offert avec un notaire en visio ou en cabinet pour analyser votre situation."
    buttonText="Prendre rendez-vous"
    href="/trouver-notaire"
  />
</>
    </>
  );
}
export function getPostContent(slug: string): ReactNode {
  const fn = CONTENT_MAP[slug];
  if (!fn) return null;
  return fn();
}
