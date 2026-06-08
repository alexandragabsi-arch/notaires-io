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
export function getPostContent(slug: string): ReactNode {
  const fn = CONTENT_MAP[slug];
  if (!fn) return null;
  return fn();
}
