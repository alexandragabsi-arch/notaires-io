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
        Besoin de l'avis d'un notaire ?
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
  "viager-notaire-guide": () => <Article24 />,
  "sci-familiale-creation-notaire": () => <Article25 />,
  "achat-immobilier-indivision": () => <Article26 />,
  "servitude-passage-notaire": () => <Article27 />,
  "promesse-vente-unilaterale": () => <Article28 />,
  "frais-notaire-neuf-vefa": () => <Article29 />,
  "droit-preemption-mairie-notaire": () => <Article30 />,
  "mainlevee-hypotheque-notaire": () => <Article31 />,
  "cession-parts-sci-notaire": () => <Article32 />,
  "dissolution-sci-notaire": () => <Article33 />,
  "achat-terrain-constructible": () => <Article34 />,
  "vefa-garanties-acheteur": () => <Article35 />,
  "donation-bien-immobilier": () => <Article36 />,
  "bail-notarie-avantages": () => <Article37 />,
  "sci-is-ou-ir": () => <Article38 />,
  "donation-partage-guide": () => <Article39 />,
  "abattement-donation-enfant-2026": () => <Article40 />,
  "donation-usufruit-nue-propriete": () => <Article41 />,
  "demembrement-propriete-notaire": () => <Article42 />,
  "donation-simple-enfants": () => <Article43 />,
  "don-manuel-declaration": () => <Article44 />,
  "donation-temporaire-usufruit": () => <Article45 />,
  "pacte-tontine-notaire": () => <Article46 />,
  "assurance-vie-clause-beneficiaire": () => <Article47 />,
  "donation-avant-deces": () => <Article48 />,
  "divorce-notaire-role": () => <Article49 />,
  "mandat-protection-future": () => <Article50 />,
  "adoption-notaire-procedure": () => <Article51 />,
  "divorce-partage-biens": () => <Article52 />,
  "tutelle-curatelle-notaire": () => <Article53 />,
  "procuration-achat-immobilier": () => <Article54 />,
  "changement-regime-matrimonial": () => <Article55 />,
  "pacs-notaire-avantages": () => <Article56 />,
  "contrat-mariage-communaute-acquets": () => <Article57 />,
  "separation-de-biens-avantages": () => <Article58 />,
  "donation-entre-epoux": () => <Article59 />,

  "holding-familiale-notaire": () => <Article60 />,
  "transmission-entreprise-notaire": () => <Article61 />,
  "pacte-dutreil-transmission": () => <Article62 />,
  "donation-cession-entreprise": () => <Article63 />,
  "optimisation-patrimoniale": () => <Article64 />,
  "notaire-visio-comment-ca-marche": () => <Article65 />,
  "tarifs-honoraires-notaire": () => <Article66 />,
  "acte-notarie-force-executoire": () => <Article67 />,
  "comment-choisir-son-notaire": () => <Article68 />,
  "negocier-frais-notaire": () => <Article69 />,
  "acte-sous-seing-prive-vs-notarie": () => <Article70 />,
  "delai-signature-acte-notarie": () => <Article71 />,
  "notaire-en-ligne-legalite": () => <Article72 />,
  "remuneration-notaire-emoluments": () => <Article73 />,
  "assurance-vie-hors-succession": () => <Article74 />,
  "prendre-rdv-notaire-en-ligne": () => <Article75 />,
  "premier-rdv-notaire-gratuit": () => <Article76 />,
  "rdv-notaire-urgent-rapide": () => <Article77 />,
  "rdv-notaire-en-visio": () => <Article78 />,
  "rdv-notaire-succession": () => <Article79 />,
  "rdv-notaire-achat-immobilier": () => <Article80 />,
  "rdv-notaire-mariage-pacs": () => <Article81 />,
  "rdv-notaire-divorce": () => <Article82 />,
  "rdv-notaire-donation": () => <Article83 />,
  "consultation-notaire-prix": () => <Article84 />,
  "notaire-sans-rendez-vous": () => <Article85 />,
  "notaire-rapide-delai": () => <Article86 />,
  "notaire-disponible-weekend": () => <Article87 />,
  "combien-temps-rdv-notaire": () => <Article88 />,
  "notaire-urgence-succession": () => <Article89 />,
  "notaire-urgence-achat": () => <Article90 />,
};


/* ── Article 7 ─────────────────────────────────────────────────────────── */

function Article7() {
  return (
    <>
      <>
  <p className="lead">Choisir entre un testament olographe ou notarié est une décision essentielle pour organiser sa succession et protéger ses proches. Ces deux formes de testament reconnues par le droit français présentent des avantages et inconvénients spécifiques qu'il convient de bien comprendre avant de se décider.</p>

  <KeyPoints points={[
    "Le testament olographe est rédigé seul, à la main, sans coût mais avec un risque de contestation plus élevé",
    "Le testament notarié (authentique) est rédigé par un notaire devant témoins, offrant une sécurité juridique maximale",
    "Les deux ont la même valeur juridique mais diffèrent en termes de conservation, coût et fiabilité",
    "Le testament notarié coûte environ 115 à 140 € HT et est automatiquement inscrit au fichier central des dispositions de dernières volontés"
  ]} />

  <h2>Le testament olographe : simplicité et liberté</h2>
  <p>Le testament olographe est la forme la plus répandue en France en raison de sa simplicité de rédaction et de son coût nul. Pour être valide, il doit respecter trois conditions strictes prévues par l'article 970 du Code civil : être entièrement écrit à la main par le testateur, daté précisément (jour, mois, année) et signé de sa main.</p>

  <p>Aucune intervention extérieure n'est requise. Vous pouvez le rédiger chez vous, sur papier libre, à tout moment. Cette liberté constitue son principal atout, mais aussi sa principale faiblesse. En effet, un testament olographe mal rédigé ou imprécis peut être source de contestations longues et coûteuses pour vos héritiers.</p>

  <p>Les risques sont nombreux : perte du document, destruction accidentelle, contestation de l'écriture ou de la signature, formulations ambiguës entraînant des interprétations divergentes, voire annulation pure et simple si une condition de forme n'est pas respectée. Pour limiter ces risques, il est fortement recommandé de déposer votre testament olographe chez un notaire, qui l'inscrira au fichier central des dispositions de dernières volontés (FCDDV) pour environ 30 €.</p>

  <h2>Le testament notarié : sécurité juridique maximale</h2>
  <p>Le testament notarié, également appelé testament authentique, est rédigé par un notaire en présence de deux témoins ou d'un second notaire. Le testateur dicte ses volontés au notaire qui les retranscrit dans un acte authentique, puis lit le testament au testateur avant signature de toutes les parties.</p>

  <p>Cette forme offre une sécurité juridique inégalée. Le notaire vous conseille sur la validité de vos dispositions, vérifie leur conformité avec les règles successorales (notamment la réserve héréditaire), et s'assure que vos volontés sont exprimées de manière claire et exécutable. Il garantit également votre consentement libre et éclairé, ce qui rend le testament quasi impossible à contester pour vice de forme ou incapacité.</p>

  <p>Le testament authentique est conservé en l'étude notariale et automatiquement inscrit au FCDDV, garantissant qu'il sera retrouvé au moment de la succession. Il est particulièrement recommandé dans les situations complexes : familles recomposées, présence d'un héritier handicapé, transmission d'entreprise, ou volonté de déshériter partiellement un héritier non réservataire.</p>

  <h2>Comparatif : olographe ou notarié, comment choisir ?</h2>
  <p>Le choix entre un testament olographe ou notarié dépend de votre situation patrimoniale et familiale. Voici les critères déterminants :</p>

  <ul>
    <li><strong>Coût</strong> : l'olographe est gratuit, le notarié coûte 115 à 140 € HT (hors frais d'inscription au FCDDV).</li>
    <li><strong>Sécurité juridique</strong> : le notarié est quasi incontestable, l'olographe peut être attaqué pour vice de forme ou interprétation.</li>
    <li><strong>Conservation</strong> : le notarié est conservé en l'étude, l'olographe peut être perdu ou détruit.</li>
    <li><strong>Conseil juridique</strong> : seul le notarié bénéficie de l'expertise du notaire pour valider les dispositions.</li>
    <li><strong>Confidentialité</strong> : l'olographe reste totalement secret, le notarié est connu du notaire et des témoins.</li>
  </ul>

  <p>Pour un patrimoine modeste et des dispositions simples (par exemple léguer un bien précis à un proche), un testament olographe bien rédigé peut suffire. En revanche, dès que la situation se complique ou que les enjeux financiers sont importants, le testament notarié s'impose comme la solution la plus prudente.</p>

  <h2>Les cas où le testament notarié est indispensable</h2>
  <p>Certaines dispositions ne peuvent légalement être prises que par testament authentique. C'est notamment le cas de la reconnaissance d'un enfant naturel, de la révocation d'une reconnaissance, ou encore du mandat à effet posthume permettant de désigner un mandataire pour gérer la succession.</p>

  <p>Le testament notarié est également obligatoire lorsque le testateur ne peut pas écrire (handicap, maladie) ou ne parle pas français. Dans ces situations, le notaire adapte la procédure (interprète, témoins supplémentaires) pour garantir la validité de l'acte.</p>

  <p>Enfin, si vous souhaitez prévoir des legs complexes (legs graduels ou résiduels, legs à des associations avec conditions particulières, démembrement de propriété), le recours au notaire est vivement conseillé pour éviter toute ambiguïté qui pourrait conduire à l'invalidation partielle du testament.</p>

  <InternalCTA />
</>
    </>
  );
}

/* ── Article 8 ─────────────────────────────────────────────────────────── */

function Article8() {
  return (
    <>
      <>
  <p className="lead">L'assurance vie succession notaire est un sujet incontournable pour quiconque souhaite transmettre un patrimoine de manière optimisée. Bien que l'assurance vie soit juridiquement hors succession, le notaire joue un rôle essentiel dans sa déclaration, sa fiscalité et la protection des héritiers réservataires.</p>

  <KeyPoints points={[
    "L'assurance vie est hors succession civile mais doit être déclarée au notaire",
    "Abattement de 152 500 € par bénéficiaire pour les versements avant 70 ans",
    "Le notaire vérifie l'absence de primes manifestement exagérées",
    "La clause bénéficiaire conditionne la transmission et la fiscalité"
  ]} />

  <h2>Le rôle du notaire dans la transmission d'une assurance vie</h2>
  <p>Contrairement à une idée répandue, l'assurance vie ne fait pas partie de la succession civile du défunt. Les capitaux sont versés directement aux bénéficiaires désignés dans la clause bénéficiaire, sans passer par le notaire. Pourtant, ce dernier conserve un rôle central dans plusieurs situations.</p>
  <p>Le notaire doit être informé de l'existence des contrats d'assurance vie afin de :</p>
  <ul>
    <li>Vérifier que les primes versées ne sont pas <strong>manifestement exagérées</strong> au regard du patrimoine et des revenus du défunt</li>
    <li>Contrôler le respect de la <strong>réserve héréditaire</strong> des enfants ou du conjoint</li>
    <li>Établir la <strong>déclaration fiscale</strong> nécessaire au calcul des droits éventuels</li>
    <li>Délivrer aux bénéficiaires une <strong>attestation</strong> pour la compagnie d'assurance</li>
  </ul>
  <p>En cas de litige entre héritiers, le notaire peut être amené à proposer une réintégration des primes dans la succession si elles sont jugées excessives par rapport au train de vie du défunt.</p>

  <h2>La fiscalité de l'assurance vie en succession</h2>
  <p>La fiscalité dépend essentiellement de l'âge du souscripteur au moment des versements. Cette distinction est fondamentale pour anticiper la transmission.</p>

  <h3>Versements effectués avant 70 ans (article 990 I du CGI)</h3>
  <p>Chaque bénéficiaire profite d'un abattement individuel de <strong>152 500 €</strong>. Au-delà :</p>
  <ul>
    <li>Taxation à <strong>20%</strong> jusqu'à 700 000 € après abattement</li>
    <li>Taxation à <strong>31,25%</strong> au-delà de 700 000 €</li>
  </ul>
  <p>Cet avantage explique pourquoi l'assurance vie reste l'un des outils de transmission les plus utilisés en France.</p>

  <h3>Versements effectués après 70 ans (article 757 B du CGI)</h3>
  <p>L'abattement est cette fois <strong>global</strong> de 30 500 € à partager entre tous les bénéficiaires. La fraction des primes excédant ce seuil est réintégrée dans l'actif successoral et soumise aux droits de succession classiques. En revanche, les <strong>intérêts et plus-values</strong> restent totalement exonérés.</p>

  <h2>La clause bénéficiaire : un élément stratégique</h2>
  <p>La rédaction de la clause bénéficiaire conditionne toute la transmission. Une clause mal rédigée peut entraîner des conséquences fiscales lourdes ou des conflits familiaux. Le notaire peut vous aider à rédiger une clause adaptée à votre situation :</p>
  <ul>
    <li><strong>Clause standard</strong> : "mon conjoint, à défaut mes enfants nés ou à naître, vivants ou représentés, à défaut mes héritiers"</li>
    <li><strong>Clause démembrée</strong> : usufruit au conjoint, nue-propriété aux enfants — optimise la fiscalité</li>
    <li><strong>Clause à options</strong> : permet au bénéficiaire principal de choisir la quotité qu'il accepte</li>
  </ul>
  <p>Il est également possible de déposer la clause bénéficiaire chez le notaire pour garantir sa confidentialité et éviter qu'elle soit modifiée frauduleusement.</p>

  <h2>Primes manifestement exagérées : attention au piège</h2>
  <p>L'article L132-13 du Code des assurances permet aux héritiers réservataires de demander la <strong>réintégration des primes</strong> dans la succession si elles sont jugées disproportionnées. Les juges apprécient ce caractère au cas par cas en fonction de :</p>
  <ul>
    <li>L'âge du souscripteur au moment des versements</li>
    <li>Sa situation patrimoniale et familiale</li>
    <li>L'utilité économique de l'opération</li>
  </ul>
  <p>Si la disproportion est avérée, les primes excessives réintègrent l'actif successoral et sont soumises aux règles de la <strong>réserve héréditaire</strong> et aux droits de succession. Un conseil notarial préventif évite ce risque.</p>

  <InternalCTA />
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

<KeyPoints points={[
  "Les enfants sont toujours héritiers réservataires : on ne peut pas les déshériter.",
  "La quotité disponible varie selon le nombre d'enfants : 1/2, 1/3 ou 1/4.",
  "Le conjoint survivant est réservataire uniquement en l'absence d'enfants.",
  "Le notaire est indispensable pour sécuriser une donation ou un testament."
]} />

<h2>Qu'est-ce qu'un héritier réservataire ?</h2>
<p>Un héritier réservataire est une personne à qui la loi garantit une part minimale de la succession, appelée <strong>réserve héréditaire</strong>. Cette protection, héritée du Code civil napoléonien, vise à préserver la solidarité familiale et à éviter qu'un défunt ne déshérite ses descendants directs au profit de tiers.</p>
<p>En droit français, les héritiers réservataires sont :</p>
<ul>
  <li><strong>Les enfants du défunt</strong> (légitimes, naturels ou adoptifs), ainsi que leurs descendants par représentation en cas de prédécès ;</li>
  <li><strong>Le conjoint survivant</strong>, mais uniquement en l'absence d'enfants ou de descendants.</li>
</ul>
<p>Depuis la réforme du 23 juin 2006, les ascendants (parents, grands-parents) ne sont plus réservataires. Les frères, sœurs, neveux et nièces ne le sont pas non plus : on peut donc parfaitement les écarter de sa succession par testament.</p>

<h2>Comment se calcule la quotité disponible ?</h2>
<p>La <strong>quotité disponible</strong> est la part de votre patrimoine que vous pouvez librement transmettre par testament ou donation à la personne de votre choix. Son montant dépend directement du nombre d'héritiers réservataires.</p>
<h3>En présence d'enfants</h3>
<p>Le Code civil (article 913) fixe les proportions suivantes :</p>
<ul>
  <li><strong>1 enfant</strong> : réserve = 1/2 ; quotité disponible = 1/2 ;</li>
  <li><strong>2 enfants</strong> : réserve = 2/3 (soit 1/3 chacun) ; quotité disponible = 1/3 ;</li>
  <li><strong>3 enfants ou plus</strong> : réserve = 3/4 ; quotité disponible = 1/4.</li>
</ul>
<h3>En l'absence d'enfants</h3>
<p>Si le défunt n'a pas de descendants mais laisse un conjoint, ce dernier bénéficie d'une réserve de <strong>1/4 de la succession</strong>. La quotité disponible s'élève alors à 3/4.</p>
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
<p>Les héritiers réservataires peuvent toutefois renoncer à l'action en réduction par une <strong>renonciation anticipée à l'action en réduction (RAAR)</strong>, un acte notarié solennel qui permet d'organiser des transmissions atypiques (par exemple au profit d'un enfant handicapé ou d'un beau-fils).</p>

<h2>Comment optimiser sa transmission avec un notaire ?</h2>
<p>Plusieurs outils permettent d'optimiser la transmission tout en respectant la réserve héréditaire :</p>
<ul>
  <li><strong>La donation-partage</strong> : fige la valeur des biens au jour de la donation et évite les conflits futurs ;</li>
  <li><strong>Le testament</strong> : permet d'utiliser la quotité disponible au profit d'un proche ou d'une œuvre ;</li>
  <li><strong>L'assurance-vie</strong> : hors succession dans la plupart des cas, elle permet de transmettre au-delà de la quotité disponible ;</li>
  <li><strong>La SCI familiale</strong> : facilite la gestion et la transmission d'un patrimoine immobilier.</li>
</ul>
<p>Chaque situation familiale étant unique, l'accompagnement d'un notaire est essentiel pour choisir les outils adaptés et éviter les écueils juridiques ou fiscaux.</p>

<InternalCTA />
</>
    </>
  );
}

/* ── Article 10 ─────────────────────────────────────────────────────────── */

function Article10() {
  return (
    <>
      <>
<p className="lead">La <strong>déclaration de succession</strong> doit être déposée auprès de l'administration fiscale dans un <strong>délai de 6 mois</strong> suivant le décès en France (12 mois à l'étranger). Ce document obligatoire recense l'actif et le passif du défunt et permet de calculer les droits de succession dus par chaque héritier. Respecter ce délai est essentiel pour éviter pénalités et intérêts de retard.</p>

<KeyPoints points={[
  "Délai de 6 mois pour déposer la déclaration (12 mois si décès à l'étranger)",
  "Pénalités de 0,20 % par mois de retard + majoration jusqu'à 40 %",
  "Abattement de 100 000 € par enfant et exonération totale entre époux",
  "Le notaire prépare la déclaration et calcule les droits dus"
]} />

<h2>Quels sont les délais légaux pour déclarer une succession ?</h2>
<p>Le Code général des impôts impose un calendrier strict pour la <strong>déclaration de succession</strong>. Le délai principal est de <strong>6 mois à compter du jour du décès</strong> lorsque celui-ci survient en France métropolitaine. Ce délai est porté à <strong>12 mois</strong> si le décès a lieu à l'étranger ou dans certains DOM-TOM.</p>
<p>La déclaration doit être déposée au service des impôts du domicile du défunt, accompagnée du paiement des droits de succession. En pratique, c'est le notaire chargé du règlement qui s'occupe de la rédaction et du dépôt de ce document complexe.</p>
<p>Certains héritiers sont dispensés de déclaration : c'est le cas si l'actif brut successoral est inférieur à 50 000 € pour les héritiers en ligne directe et le conjoint survivant (à condition qu'il n'y ait pas eu de donation antérieure non enregistrée), ou inférieur à 3 000 € pour les autres héritiers.</p>

<h2>Comment sont calculés les impôts de succession ?</h2>
<p>Les droits de succession dépendent de deux éléments principaux : le <strong>lien de parenté</strong> avec le défunt et le <strong>montant de la part héritée</strong>. Chaque héritier bénéficie d'un abattement personnel avant application du barème progressif.</p>
<p>Les principaux abattements sont les suivants :</p>
<ul>
  <li><strong>Conjoint survivant ou partenaire de PACS</strong> : exonération totale</li>
  <li><strong>Enfant ou parent</strong> : abattement de 100 000 €</li>
  <li><strong>Frère ou sœur</strong> : abattement de 15 932 €</li>
  <li><strong>Neveu ou nièce</strong> : abattement de 7 967 €</li>
  <li><strong>Personne handicapée</strong> : abattement supplémentaire de 159 325 €</li>
</ul>
<p>Après application de l'abattement, un barème progressif s'applique, allant de 5 % à 45 % en ligne directe, 35 % à 45 % entre frères et sœurs, et jusqu'à 60 % entre personnes non parentes.</p>

<InternalCTA />

<h2>Quelles sont les pénalités en cas de retard ?</h2>
<p>Le non-respect du <strong>délai de déclaration de succession</strong> entraîne des sanctions financières qui peuvent rapidement s'accumuler. Les conséquences sont les suivantes :</p>
<ul>
  <li><strong>Intérêt de retard</strong> : 0,20 % par mois (soit 2,4 % par an) dès le 7ème mois suivant le décès</li>
  <li><strong>Majoration de 10 %</strong> à partir du 13ème mois (7ème mois de retard)</li>
  <li><strong>Majoration de 40 %</strong> en cas de dépôt tardif après mise en demeure restée sans réponse pendant 90 jours</li>
  <li><strong>Majoration de 80 %</strong> en cas de découverte d'une activité occulte ou de manœuvres frauduleuses</li>
</ul>
<p>Il est possible de demander un <strong>paiement fractionné</strong> (sur 1 à 3 ans) ou <strong>différé</strong> (jusqu'à 15 ans en cas de nue-propriété) des droits de succession, sous certaines conditions et moyennant le versement d'intérêts.</p>

<h2>Comment préparer sereinement sa déclaration de succession ?</h2>
<p>Pour respecter les délais et éviter les erreurs coûteuses, il est vivement recommandé de <strong>consulter un notaire dès les premières semaines suivant le décès</strong>. Celui-ci se charge de :</p>
<ul>
  <li>Établir l'<strong>acte de notoriété</strong> identifiant les héritiers</li>
  <li>Réaliser l'<strong>inventaire</strong> du patrimoine du défunt (biens, comptes, dettes)</li>
  <li>Évaluer les biens immobiliers et mobiliers</li>
  <li>Rédiger la <strong>déclaration de succession</strong> sur le formulaire Cerfa 2705</li>
  <li>Calculer les droits dus par chaque héritier</li>
  <li>Effectuer le dépôt auprès du service des impôts</li>
</ul>
<p>Anticiper la transmission de son patrimoine par une <strong>donation</strong>, un <strong>testament</strong> ou la souscription d'une <strong>assurance-vie</strong> permet souvent de réduire significativement la facture fiscale pour les héritiers.</p>

<h2>En résumé</h2>
<p>La <strong>déclaration de succession</strong> est une démarche obligatoire à effectuer dans un délai de 6 mois après le décès. Les droits dus dépendent du lien de parenté et de la part héritée, après application d'abattements. Les retards entraînent des pénalités importantes, d'où l'intérêt de confier rapidement le dossier à un notaire qui sécurisera l'ensemble des opérations.</p>
</>
    </>
  );
}

/* ── Article 11 ─────────────────────────────────────────────────────────── */

function Article11() {
  return (
    <>
      <>
  <p className="lead">Une <strong>succession sans testament héritiers</strong> légaux est régie entièrement par la loi française. Lorsqu'une personne décède sans avoir rédigé de testament, on parle de succession "ab intestat". Le Code civil prévoit alors un ordre précis pour désigner les héritiers et déterminer leurs parts respectives. Comprendre ces règles est essentiel pour anticiper les conséquences patrimoniales d'un décès et éviter les conflits familiaux.</p>

  <KeyPoints points={[
    "Sans testament, la loi désigne automatiquement les héritiers selon 4 ordres successoraux",
    "Les enfants héritent en priorité, à parts égales entre eux",
    "Le conjoint survivant a des droits spécifiques selon la situation familiale",
    "Le notaire est obligatoire pour régler la succession dès qu'il y a un bien immobilier"
  ]} />

  <h2>L'ordre légal des héritiers en l'absence de testament</h2>
  <p>Le Code civil français classe les héritiers en quatre ordres successifs. Chaque ordre exclut le suivant : tant qu'il existe un héritier dans un ordre, les ordres suivants ne reçoivent rien.</p>

  <h3>Premier ordre : les descendants</h3>
  <p>Les enfants du défunt héritent en premier, à parts égales, qu'ils soient issus du mariage, hors mariage ou adoptés. Si un enfant est prédécédé, ses propres enfants (les petits-enfants du défunt) viennent en représentation et se partagent la part de leur parent.</p>

  <h3>Deuxième ordre : ascendants et collatéraux privilégiés</h3>
  <p>En l'absence de descendants, la succession revient aux parents du défunt et à ses frères et sœurs. Les parents reçoivent chacun 1/4, le reste étant partagé entre les frères et sœurs (ou leurs descendants par représentation).</p>

  <h3>Troisième et quatrième ordres</h3>
  <p>S'il n'y a ni descendants, ni parents, ni frères et sœurs, on remonte aux autres ascendants (grands-parents) puis aux collatéraux ordinaires (oncles, tantes, cousins) jusqu'au 6e degré. Au-delà, la succession revient à l'État.</p>

  <h2>Les droits du conjoint survivant sans testament</h2>
  <p>Le conjoint marié bénéficie de droits légaux importants, même sans testament. Attention : le partenaire de PACS et le concubin ne sont <strong>pas héritiers légaux</strong>. Seul un testament peut leur transmettre des biens.</p>

  <p>En présence d'enfants tous communs au couple, le conjoint choisit entre :</p>
  <ul>
    <li><strong>1/4 de la succession en pleine propriété</strong></li>
    <li><strong>La totalité en usufruit</strong> (les enfants reçoivent la nue-propriété)</li>
  </ul>

  <p>En présence d'enfants d'une précédente union, le conjoint reçoit obligatoirement 1/4 en pleine propriété, sans option d'usufruit. Sans enfants mais avec parents du défunt vivants, le conjoint recueille la moitié ou les trois quarts selon les cas. Sans descendants ni parents, il hérite de la totalité.</p>

  <InternalCTA />

  <h2>Le rôle du notaire dans une succession sans testament</h2>
  <p>Le recours au notaire est <strong>obligatoire</strong> dès lors que la succession comprend un bien immobilier, dépasse 5 000 € ou qu'il existe un contrat de mariage. Dans la pratique, presque toutes les successions passent par un notaire.</p>

  <h3>Les étapes du règlement</h3>
  <ol>
    <li><strong>Acte de notoriété</strong> : le notaire identifie officiellement les héritiers</li>
    <li><strong>Bilan du patrimoine</strong> : inventaire des biens, comptes, dettes</li>
    <li><strong>Déclaration de succession</strong> : à déposer dans les 6 mois auprès de l'administration fiscale</li>
    <li><strong>Paiement des droits</strong> de succession selon le lien de parenté</li>
    <li><strong>Partage</strong> entre héritiers (à l'amiable ou judiciaire)</li>
  </ol>

  <h3>Les droits de succession applicables</h3>
  <p>Sans testament, les abattements et taux dépendent du lien de parenté : 100 000 € d'abattement par enfant, exonération totale pour le conjoint survivant, 15 932 € entre frères et sœurs. Les neveux, cousins et tiers subissent une fiscalité bien plus lourde (jusqu'à 60%).</p>

  <h2>Comment anticiper une succession sans testament ?</h2>
  <p>Si la loi prévoit tout, elle ne reflète pas toujours vos volontés. Plusieurs outils permettent d'aménager la transmission sans rédiger un testament classique :</p>
  <ul>
    <li><strong>La donation entre époux</strong> (ou "donation au dernier vivant") augmente la part du conjoint</li>
    <li><strong>La donation-partage</strong> permet de transmettre de son vivant à ses enfants</li>
    <li><strong>L'assurance-vie</strong> échappe en grande partie aux règles successorales</li>
    <li><strong>La SCI familiale</strong> facilite la transmission d'un patrimoine immobilier</li>
  </ul>

  <p>Consulter un notaire en amont permet d'identifier la stratégie la plus adaptée à votre situation familiale et patrimoniale, tout en optimisant la fiscalité pour vos héritiers.</p>

  <h2>Questions fréquentes</h2>
  <p>Vous trouverez ci-dessous les réponses aux questions les plus courantes sur les successions sans testament. Pour une analyse personnalisée, un échange avec un notaire reste indispensable.</p>

  <InternalCTA />
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

  <KeyPoints points={[
    "En France, il est impossible de déshériter totalement un enfant grâce à la réserve héréditaire",
    "La part réservée varie selon le nombre d'enfants : 1/2 pour 1 enfant, 2/3 pour 2, 3/4 pour 3 ou plus",
    "L'indignité successorale permet d'écarter un enfant en cas de faute grave",
    "La quotité disponible et l'assurance-vie offrent des marges de manœuvre pour avantager d'autres héritiers"
  ]} />

  <h2>La réserve héréditaire : une protection incontournable</h2>
  <p>Le Code civil français consacre le principe de la <strong>réserve héréditaire</strong>, qui rend impossible le fait de déshériter un enfant. Les enfants sont des héritiers dits « réservataires » : la loi leur garantit obligatoirement une portion du patrimoine du défunt, quelles que soient les volontés exprimées dans un testament.</p>
  <p>Cette protection s'applique à tous les enfants, qu'ils soient légitimes, naturels, adoptés ou nés hors mariage. La répartition de la réserve dépend du nombre d'enfants :</p>
  <ul>
    <li><strong>1 enfant</strong> : la réserve représente 1/2 du patrimoine</li>
    <li><strong>2 enfants</strong> : la réserve représente 2/3 du patrimoine (1/3 chacun)</li>
    <li><strong>3 enfants ou plus</strong> : la réserve représente 3/4 du patrimoine, partagés à parts égales</li>
  </ul>
  <p>Le reste, appelé <strong>quotité disponible</strong>, peut être librement attribué par testament ou donation à toute personne de votre choix.</p>

  <h2>L'indignité successorale : la seule véritable exception</h2>
  <p>Le seul moyen d'écarter totalement un enfant de la succession est de le faire déclarer <strong>indigne</strong> de succéder. Cette procédure est strictement encadrée par les articles 726 et 727 du Code civil.</p>
  <p>L'indignité peut être <strong>de plein droit</strong> en cas de :</p>
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
  <p>Il s'agit de cas exceptionnels qui nécessitent une décision de justice. Un simple conflit familial, même profond, ne suffit jamais à justifier l'indignité.</p>

  <InternalCTA />

  <h2>Comment réduire légalement la part d'un enfant ?</h2>
  <p>Si vous ne pouvez pas déshériter un enfant, plusieurs outils permettent de moduler votre succession et d'avantager d'autres personnes :</p>
  <h3>1. Utiliser la quotité disponible</h3>
  <p>Vous pouvez librement transmettre la quotité disponible (entre 1/4 et 1/2 selon le nombre d'enfants) à votre conjoint, un autre enfant, un tiers ou une association via un testament authentique.</p>
  <h3>2. Souscrire une assurance-vie</h3>
  <p>L'<strong>assurance-vie</strong> bénéficie d'un régime juridique particulier : les capitaux versés au bénéficiaire désigné échappent en principe à la succession et donc à la réserve héréditaire, sauf primes manifestement exagérées.</p>
  <h3>3. Réaliser des donations</h3>
  <p>Des donations de votre vivant à d'autres héritiers ou tiers permettent d'anticiper la transmission. Attention : elles seront réintégrées au calcul de la réserve si elles excèdent la quotité disponible.</p>
  <h3>4. Recourir au mandat à effet posthume</h3>
  <p>Cet outil permet de confier la gestion d'une partie de la succession à un tiers pour protéger un enfant vulnérable ou éviter une mauvaise gestion.</p>

  <h2>Que faire en cas de conflit familial grave ?</h2>
  <p>Si vos relations avec un enfant sont gravement détériorées, sachez que vous pouvez toujours :</p>
  <ul>
    <li>Limiter sa part à la stricte réserve héréditaire</li>
    <li>Avantager vos autres enfants ou votre conjoint via la quotité disponible</li>
    <li>Choisir un bénéficiaire d'assurance-vie distinct</li>
    <li>Préciser dans votre testament les motifs de votre décision</li>
  </ul>
  <p>Un <strong>notaire</strong> est l'interlocuteur indispensable pour sécuriser votre démarche, rédiger un testament authentique opposable et éviter les contestations futures.</p>

  <h2>Conclusion</h2>
  <p>En France, déshériter un enfant est juridiquement impossible, sauf cas d'indignité successorale prononcée par un juge. Toutefois, la loi offre des marges de manœuvre réelles pour organiser votre succession selon vos souhaits, via la quotité disponible, l'assurance-vie et les donations. Pour éviter tout litige et optimiser la transmission de votre patrimoine, l'accompagnement d'un notaire est essentiel.</p>

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
  <p className="lead">Le calcul des droits de succession selon le barème 2026 repose sur trois éléments clés : la valeur de l'actif net taxable, le lien de parenté avec le défunt et les abattements applicables. Comprendre ce mécanisme permet d'anticiper la facture fiscale et d'optimiser la transmission de votre patrimoine.</p>

  <KeyPoints points={[
    "Abattement de 100 000 € par enfant, renouvelable tous les 15 ans",
    "Barème progressif de 5 % à 45 % en ligne directe",
    "Conjoint et partenaire de PACS totalement exonérés",
    "Déclaration et paiement dans les 6 mois suivant le décès"
  ]} />

  <h2>Les abattements applicables avant calcul</h2>
  <p>Avant d'appliquer le barème, l'administration fiscale déduit un abattement personnel sur la part nette revenant à chaque héritier. En 2026, ces montants restent stables :</p>
  <ul>
    <li><strong>Enfants, parents :</strong> 100 000 €</li>
    <li><strong>Petits-enfants (en représentation) :</strong> 100 000 € (part du parent prédécédé)</li>
    <li><strong>Frères et sœurs :</strong> 15 932 €</li>
    <li><strong>Neveux et nièces :</strong> 7 967 €</li>
    <li><strong>Personnes handicapées :</strong> 159 325 € cumulable</li>
    <li><strong>Autres héritiers :</strong> 1 594 €</li>
  </ul>
  <p>Ces abattements se renouvellent tous les 15 ans, ce qui ouvre une stratégie d'optimisation par les donations anticipées.</p>

  <h2>Le barème 2026 en ligne directe</h2>
  <p>Une fois l'abattement déduit, le solde taxable est soumis à un barème progressif par tranches. Pour les transmissions entre parents et enfants (ou ascendants), les taux applicables sont :</p>
  <ul>
    <li>Jusqu'à 8 072 € : <strong>5 %</strong></li>
    <li>De 8 072 € à 12 109 € : <strong>10 %</strong></li>
    <li>De 12 109 € à 15 932 € : <strong>15 %</strong></li>
    <li>De 15 932 € à 552 324 € : <strong>20 %</strong></li>
    <li>De 552 324 € à 902 838 € : <strong>30 %</strong></li>
    <li>De 902 838 € à 1 805 677 € : <strong>40 %</strong></li>
    <li>Au-delà de 1 805 677 € : <strong>45 %</strong></li>
  </ul>
  <p><strong>Exemple concret :</strong> un enfant hérite de 300 000 €. Après abattement de 100 000 €, la base taxable est de 200 000 €. Les droits s'élèvent à environ 38 194 € après application du barème par tranches.</p>

  <h2>Les barèmes spécifiques selon le lien de parenté</h2>
  <p>Pour les <strong>frères et sœurs</strong>, deux tranches s'appliquent après abattement : 35 % jusqu'à 24 430 € et 45 % au-delà. Pour les <strong>neveux, nièces et parents jusqu'au 4e degré</strong>, le taux unique est de 55 %. Enfin, pour les <strong>tiers ou parents au-delà du 4e degré</strong>, le taux atteint 60 %, ce qui rend toute transmission hors famille particulièrement coûteuse.</p>
  <p>Le conjoint survivant marié et le partenaire de PACS bénéficient d'une exonération totale depuis la loi TEPA de 2007. Le concubin, en revanche, est traité comme un tiers et taxé à 60 %.</p>

  <InternalCTA />

  <h2>Comment optimiser ses droits de succession</h2>
  <p>Plusieurs leviers permettent de réduire la facture fiscale de vos héritiers :</p>
  <ul>
    <li><strong>Donations anticipées :</strong> profitez du renouvellement de l'abattement tous les 15 ans</li>
    <li><strong>Assurance-vie :</strong> abattement de 152 500 € par bénéficiaire pour les versements avant 70 ans</li>
    <li><strong>Démembrement de propriété :</strong> transmettre la nue-propriété en conservant l'usufruit</li>
    <li><strong>Pacte Dutreil :</strong> abattement de 75 % sur la transmission d'entreprise</li>
    <li><strong>Dons familiaux de sommes d'argent :</strong> exonération supplémentaire de 31 865 € sous conditions</li>
  </ul>
  <p>La déclaration de succession doit être déposée dans les <strong>6 mois suivant le décès</strong> (12 mois si décès à l'étranger). Le paiement peut être fractionné ou différé sous conditions, notamment en cas de transmission d'entreprise ou de nue-propriété.</p>

  <h2>Foire aux questions</h2>
  <div className="faq">
    <h3>Quel est l'abattement entre parent et enfant en 2026 ?</h3>
    <p>L'abattement reste fixé à 100 000 € par parent et par enfant, renouvelable tous les 15 ans.</p>
    <h3>Le conjoint survivant paie-t-il des droits de succession ?</h3>
    <p>Non, le conjoint marié ou pacsé est totalement exonéré de droits de succession depuis la loi TEPA de 2007.</p>
    <h3>Quand faut-il payer les droits de succession ?</h3>
    <p>Les droits doivent être réglés dans les 6 mois suivant le décès (12 mois si décès à l'étranger), en même temps que la déclaration.</p>
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
  <p className="lead">L'acte de notoriété succession établi par un notaire est le document officiel qui prouve votre qualité d'héritier après un décès. Indispensable pour débloquer les comptes bancaires, vendre un bien immobilier ou percevoir une pension de réversion, cet acte authentique constitue la première étape incontournable du règlement successoral.</p>

  <KeyPoints points={[
    "L'acte de notoriété prouve officiellement la qualité d'héritier",
    "Obligatoire pour les successions supérieures à 5 910 € ou comportant un bien immobilier",
    "Tarif réglementé : environ 200 à 400 € TTC tout compris",
    "Délai d'obtention : 1 à 3 mois selon la complexité",
    "Seul un notaire est habilité à le rédiger depuis 2015"
  ]} />

  <h2>Qu'est-ce qu'un acte de notoriété succession ?</h2>
  <p>L'acte de notoriété est un acte authentique rédigé par le notaire qui identifie le défunt et désigne les personnes appelées à recueillir sa succession. Il établit la dévolution successorale, c'est-à-dire la liste des héritiers et leurs droits respectifs dans l'héritage.</p>
  <p>Ce document, prévu par l'article 730-1 du Code civil, fait foi jusqu'à preuve du contraire. Depuis la loi du 16 février 2015, seul un notaire peut le délivrer : les anciens certificats d'hérédité délivrés par les mairies ont été progressivement supprimés.</p>
  <p>L'acte mentionne notamment :</p>
  <ul>
    <li>L'état civil complet du défunt et la date du décès</li>
    <li>L'existence ou non d'un testament ou d'une donation entre époux</li>
    <li>L'identité de chaque héritier et son lien de parenté</li>
    <li>La quote-part revenant à chacun (en pleine propriété, usufruit ou nue-propriété)</li>
    <li>L'option successorale exercée (acceptation pure et simple, à concurrence de l'actif net, ou renonciation)</li>
  </ul>

  <h2>Quand et pourquoi recourir à cet acte ?</h2>
  <p>L'acte de notoriété succession est nécessaire dans la majorité des dossiers. Il devient obligatoire dès lors que :</p>
  <ul>
    <li><strong>Le patrimoine bancaire dépasse 5 910,57 €</strong> : les banques exigent l'acte pour débloquer les comptes du défunt</li>
    <li><strong>La succession comporte un bien immobilier</strong> : indispensable pour l'attestation immobilière et toute future vente</li>
    <li><strong>Des prestations sociales doivent être perçues</strong> : pension de réversion, capital décès, assurance-vie</li>
    <li><strong>Un testament existe</strong> : pour authentifier les volontés du défunt et leurs effets</li>
  </ul>
  <p>En pratique, dès qu'une démarche officielle nécessite de prouver votre qualité d'héritier, l'acte de notoriété sera réclamé. Sans lui, impossible d'agir au nom de la succession.</p>

  <InternalCTA />

  <h2>Comment se déroule la rédaction chez le notaire ?</h2>
  <p>La procédure d'établissement de l'acte se déroule en plusieurs étapes structurées par le notaire.</p>

  <h3>1. Réunion des pièces nécessaires</h3>
  <p>Vous devrez fournir au notaire :</p>
  <ul>
    <li>L'acte de décès du défunt</li>
    <li>Son livret de famille (et celui de ses précédentes unions le cas échéant)</li>
    <li>Son acte de naissance et son contrat de mariage éventuel</li>
    <li>Les pièces d'identité de tous les héritiers</li>
    <li>Les testaments, donations ou donations entre époux connus</li>
  </ul>

  <h3>2. Recherches et vérifications</h3>
  <p>Le notaire interroge le <strong>Fichier central des dispositions de dernières volontés (FCDDV)</strong> pour vérifier l'existence d'un testament. Il analyse la situation familiale du défunt et identifie l'ensemble des héritiers selon les règles légales de la dévolution successorale.</p>

  <h3>3. Signature de l'acte</h3>
  <p>Tous les héritiers signent l'acte chez le notaire (présence physique ou procuration). Chacun y déclare sa qualité et exerce son option successorale. Le notaire remet ensuite des copies authentiques que vous utiliserez auprès des banques, des administrations et des organismes sociaux.</p>

  <h2>Tarifs et délais à prévoir</h2>
  <p>Le tarif de l'acte de notoriété est <strong>réglementé</strong> par décret. L'émolument fixe du notaire s'élève à environ 58 € HT. À cela s'ajoutent :</p>
  <ul>
    <li>Les frais de formalités et débours (consultation du FCDDV, copies d'actes d'état civil)</li>
    <li>La TVA de 20 %</li>
    <li>Les éventuelles copies authentiques supplémentaires</li>
  </ul>
  <p>Au total, comptez généralement <strong>entre 200 € et 400 € TTC</strong> pour un acte standard. Ce coût est intégré dans les frais globaux de la succession et payé par la succession elle-même.</p>
  <p>Côté délais, l'acte est généralement disponible <strong>dans les 1 à 3 mois</strong> après votre première rencontre avec le notaire, en fonction du temps nécessaire pour réunir l'ensemble des pièces d'état civil et identifier tous les héritiers.</p>

  <h2>Acte de notoriété ou attestation des héritiers ?</h2>
  <p>Pour les petites successions de moins de 5 910,57 € sans bien immobilier, une <strong>attestation signée par l'ensemble des héritiers</strong> peut suffire à débloquer les comptes bancaires. Elle est gratuite mais limitée dans son usage.</p>
  <p>Dès que le patrimoine dépasse ce seuil ou qu'un bien immobilier est en jeu, l'acte de notoriété notarial devient incontournable. Il offre une sécurité juridique bien supérieure et reste valable pour toutes les démarches futures liées à la succession.</p>

  <InternalCTA />
</>
    </>
  );
}

/* ── Article 15 ─────────────────────────────────────────────────────────── */

function Article15() {
  return (
    <>
      <>
  <p className="lead">Le partage succession indivision notaire est l'étape qui met fin à l'indivision successorale entre héritiers et attribue à chacun sa part définitive. Souvent perçu comme complexe, ce processus encadré par le Code civil permet pourtant à chaque héritier de devenir pleinement propriétaire des biens qui lui reviennent. Que le partage soit amiable ou judiciaire, l'intervention du notaire est essentielle, particulièrement lorsque la succession comporte un bien immobilier.</p>

  <KeyPoints points={[
    "Le partage met fin à l'indivision et attribue à chaque héritier ses biens propres",
    "Le notaire est obligatoire dès qu'il existe un bien immobilier dans la succession",
    "Le droit de partage s'élève à 2,5% de l'actif net partagé",
    "En cas de désaccord, le partage judiciaire devient la seule solution"
  ]} />

  <h2>Comprendre l'indivision successorale et son partage</h2>
  <p>Au décès d'une personne, les héritiers se retrouvent automatiquement en indivision sur l'ensemble des biens de la succession. Chacun détient une quote-part abstraite (par exemple 1/3 ou 1/2) sur la totalité du patrimoine, sans qu'aucun bien ne lui appartienne individuellement. Cette situation, encadrée par les articles 815 et suivants du Code civil, est conçue comme provisoire.</p>

  <p>L'indivision présente plusieurs inconvénients : les décisions importantes nécessitent l'unanimité, les frais d'entretien sont partagés, et tout héritier peut à tout moment demander le partage selon l'adage "nul ne peut être contraint à demeurer dans l'indivision". C'est pourquoi la majorité des successions débouche tôt ou tard sur un acte de partage.</p>

  <p>Le partage transforme les droits abstraits en droits concrets : chaque héritier se voit attribuer des biens déterminés (un appartement, un compte bancaire, des meubles) en pleine propriété, à hauteur de sa part dans la succession.</p>

  <h2>Les étapes du partage amiable chez le notaire</h2>
  <p>Le partage amiable est la voie privilégiée lorsque tous les héritiers sont d'accord. Il se déroule en plusieurs étapes auprès du notaire chargé de la succession.</p>

  <h3>1. L'inventaire et l'évaluation des biens</h3>
  <p>Le notaire dresse la liste exhaustive de l'actif (biens immobiliers, comptes bancaires, placements, véhicules, mobilier) et du passif (dettes, impôts) de la succession. Chaque bien est évalué à sa valeur vénale au jour du partage, ce qui peut nécessiter l'intervention d'experts immobiliers.</p>

  <h3>2. La composition des lots</h3>
  <p>Le notaire constitue des lots de valeur équivalente correspondant aux droits de chaque héritier. Si certains biens ne peuvent être divisés (un immeuble, par exemple), une soulte peut être versée par l'héritier qui reçoit le bien le plus important aux autres cohéritiers.</p>

  <h3>3. La signature de l'acte de partage</h3>
  <p>L'acte de partage est rédigé sous forme authentique par le notaire et signé par tous les héritiers. Il mentionne les biens attribués à chacun, les éventuelles soultes, et procède au calcul du droit de partage. Une fois signé, l'acte est publié au service de la publicité foncière pour les biens immobiliers.</p>

  <InternalCTA />

  <h2>Coûts et fiscalité du partage successoral</h2>
  <p>Le partage successoral engendre plusieurs catégories de frais qu'il convient d'anticiper :</p>

  <ul>
    <li><strong>Le droit de partage</strong> : taxe de 2,5% calculée sur l'actif net partagé (valeur des biens diminuée des dettes). C'est généralement le poste le plus important.</li>
    <li><strong>Les émoluments du notaire</strong> : tarifs réglementés dégressifs selon la valeur, environ 1 à 2% de l'actif partagé.</li>
    <li><strong>La contribution de sécurité immobilière</strong> : 0,10% pour la publication foncière.</li>
    <li><strong>Les débours</strong> : frais avancés par le notaire (cadastre, état hypothécaire, etc.).</li>
  </ul>

  <p>Pour une succession de 300 000 € sans dette, comptez environ 12 000 à 15 000 € de frais totaux. Une planification successorale anticipée (donation-partage, par exemple) permet souvent de réduire considérablement ces coûts.</p>

  <h2>Que faire en cas de désaccord entre héritiers ?</h2>
  <p>Lorsque les héritiers ne parviennent pas à s'entendre sur la composition des lots ou la valeur des biens, plusieurs solutions existent avant d'en arriver au contentieux.</p>

  <p><strong>La médiation notariale</strong> : le notaire joue un rôle de conciliateur et propose des arrangements équitables. Sa neutralité et son expertise permettent souvent de débloquer les situations tendues.</p>

  <p><strong>Le partage judiciaire</strong> : si aucun accord n'est trouvé, un héritier peut saisir le tribunal judiciaire. Le juge ordonne alors l'ouverture des opérations de partage et désigne un notaire pour les conduire. Cette procédure est longue (1 à 3 ans en moyenne) et coûteuse.</p>

  <p><strong>La vente par licitation</strong> : lorsqu'un bien immobilier ne peut être attribué à un seul héritier et que personne ne souhaite l'acquérir, le tribunal peut ordonner sa vente aux enchères. Le prix est ensuite réparti entre les héritiers.</p>

  <p>Pour éviter ces situations conflictuelles, il est vivement recommandé de consulter un notaire dès l'ouverture de la succession afin d'être conseillé sur la meilleure stratégie de partage.</p>

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
  <p className="lead">Renoncer à une succession devant notaire est une décision lourde de conséquences, souvent envisagée lorsque le défunt laisse plus de dettes que d'actifs. Cette procédure encadrée par le Code civil vous permet de refuser totalement votre part d'héritage et d'échapper aux créanciers. Voici tout ce qu'il faut savoir pour renoncer en toute sécurité.</p>

  <KeyPoints points={[
    "La renonciation est gratuite au greffe du tribunal, payante chez le notaire (15-30 €)",
    "Vous disposez de 10 ans pour renoncer, mais un créancier peut vous obliger à choisir en 4 mois",
    "Le renonçant est considéré comme n'ayant jamais été héritier : ses enfants peuvent hériter par représentation",
    "La renonciation est révocable tant que la succession n'a pas été acceptée par d'autres héritiers"
  ]} />

  <h2>Pourquoi renoncer à une succession ?</h2>
  <p>La renonciation à succession est l'une des trois options successorales offertes à l'héritier, aux côtés de l'acceptation pure et simple et de l'acceptation à concurrence de l'actif net. Elle se justifie principalement dans plusieurs situations.</p>

  <p>Le cas le plus fréquent est celui de la <strong>succession déficitaire</strong> : le défunt laisse plus de dettes (prêts bancaires, dettes fiscales, crédits à la consommation) que d'actifs (immobilier, comptes, mobilier). Accepter la succession reviendrait alors à payer ces dettes sur votre propre patrimoine.</p>

  <p>D'autres motifs peuvent justifier la renonciation :</p>
  <ul>
    <li>Favoriser ses propres enfants qui hériteront par représentation</li>
    <li>Éviter des conflits familiaux complexes</li>
    <li>Refuser un bien grevé de contraintes (indivision difficile, bien immobilier coûteux)</li>
    <li>Optimiser une transmission patrimoniale entre générations</li>
  </ul>

  <p>Attention : renoncer signifie renoncer à <strong>tout</strong>. Vous ne pouvez pas choisir de garder certains biens et refuser les dettes. C'est pourquoi un bilan complet de la succession avec un notaire est indispensable avant toute décision.</p>

  <h2>La procédure de renonciation chez le notaire</h2>
  <p>Renoncer à une succession nécessite une démarche formelle. Deux options s'offrent à vous : la déclaration au greffe du tribunal judiciaire du lieu d'ouverture de la succession, ou l'acte authentique chez un notaire.</p>

  <h3>Étape 1 : le bilan successoral</h3>
  <p>Avant toute renonciation, le notaire dresse un inventaire précis de l'actif et du passif successoral. Il consulte le fichier FICOBA pour identifier les comptes bancaires, interroge les organismes de crédit et vérifie les éventuelles dettes fiscales. Cette analyse vous permet de prendre une décision éclairée.</p>

  <h3>Étape 2 : la rédaction de l'acte de renonciation</h3>
  <p>Si vous décidez de renoncer, le notaire rédige un acte authentique de renonciation. Vous devez fournir :</p>
  <ul>
    <li>Une pièce d'identité en cours de validité</li>
    <li>Un acte de naissance de moins de 3 mois</li>
    <li>L'acte de décès du défunt</li>
    <li>Le formulaire Cerfa n°15828*05 dûment rempli</li>
  </ul>

  <h3>Étape 3 : l'enregistrement officiel</h3>
  <p>L'acte est ensuite transmis au tribunal judiciaire pour enregistrement. La renonciation devient alors opposable aux tiers, notamment aux créanciers du défunt qui ne pourront plus vous poursuivre.</p>

  <InternalCTA />

  <h2>Délais et conséquences de la renonciation</h2>
  <p>Le délai légal pour exercer votre option successorale est de <strong>10 ans</strong> à compter de l'ouverture de la succession (date du décès). Passé ce délai sans manifestation de votre part, vous êtes réputé avoir renoncé.</p>

  <p>Cependant, ce délai peut être considérablement raccourci. Tout intéressé (créancier, cohéritier, État) peut vous sommer de prendre parti après l'expiration d'un délai de 4 mois suivant le décès. Vous disposez alors de <strong>2 mois supplémentaires</strong> pour vous décider, sous peine d'être considéré comme acceptant purement et simplement la succession.</p>

  <h3>Les effets juridiques de la renonciation</h3>
  <p>Le renonçant est considéré comme n'ayant <em>jamais été héritier</em>. Cette fiction juridique entraîne plusieurs conséquences importantes :</p>
  <ul>
    <li><strong>Aucune dette ne peut vous être réclamée</strong> au titre de la succession</li>
    <li><strong>Vos enfants peuvent hériter par représentation</strong> (depuis la loi du 23 juin 2006)</li>
    <li>Votre part accroît celle des autres héritiers de même rang</li>
    <li>Vous ne pouvez plus revendiquer aucun bien de la succession</li>
  </ul>

  <p>Attention aux <strong>actes équivalant à acceptation tacite</strong> : prélever de l'argent sur les comptes du défunt, vendre un bien ou même payer une dette successorale peuvent être interprétés comme une acceptation, vous empêchant ensuite de renoncer.</p>

  <h2>Coût et révocation de la renonciation</h2>
  <p>La déclaration de renonciation directement au greffe du tribunal est <strong>gratuite</strong>. Toutefois, passer par un notaire offre plusieurs avantages : sécurité juridique, conseil personnalisé et accompagnement dans les démarches connexes (déclaration fiscale, information des autres héritiers).</p>

  <p>Les frais notariaux pour un acte de renonciation s'élèvent généralement entre <strong>15 et 30 euros</strong>, auxquels peuvent s'ajouter des honoraires de conseil si une analyse approfondie de la succession est nécessaire.</p>

  <h3>Peut-on revenir sur sa décision ?</h3>
  <p>La renonciation n'est pas définitive. L'article 807 du Code civil permet la <strong>révocation de la renonciation</strong> sous deux conditions cumulatives :</p>
  <ul>
    <li>Le délai de 10 ans pour accepter ne doit pas être écoulé</li>
    <li>La succession ne doit pas avoir été acceptée par un autre héritier</li>
  </ul>

  <p>Cette révocation se fait par déclaration au greffe ou par acte notarié. L'héritier devient alors acceptant pur et simple ou à concurrence de l'actif net, selon son choix.</p>
</>
    </>
  );
}

/* ── Article 17 ─────────────────────────────────────────────────────────── */

function Article17() {
  return (
    <>
      <>
<p className="lead">La succession d'un concubin non marié soulève des enjeux majeurs en France : juridiquement, le concubin survivant est considéré comme un parfait étranger par la loi successorale. Sans anticipation chez un notaire, il risque de ne rien recevoir du patrimoine commun, voire d'être expulsé du logement familial. Voici les solutions concrètes pour protéger votre partenaire.</p>

<KeyPoints points={[
  "Le concubin n'a aucun droit successoral légal en France",
  "La fiscalité est de 60% après un abattement de seulement 1 594 €",
  "Le testament, la donation et l'assurance-vie sont les principaux outils de protection",
  "Un rendez-vous notaire permet de bâtir une stratégie sur-mesure"
]} />

<h2>Concubinage et succession : un vide juridique total</h2>
<p>Contrairement aux époux ou aux partenaires de PACS, les concubins n'ont aucun lien juridique reconnu en matière successorale. L'article 515-8 du Code civil définit le concubinage comme une simple « union de fait », ce qui exclut tout droit à la succession.</p>
<p>Concrètement, si votre concubin décède sans avoir pris de dispositions, l'intégralité de son patrimoine reviendra à ses héritiers légaux : enfants, parents, frères et sœurs. Vous ne recevrez rien, même après des décennies de vie commune.</p>
<p>Cette situation peut avoir des conséquences dramatiques, notamment concernant le logement. Si la résidence principale appartenait à votre concubin, ses héritiers peuvent exiger votre départ ou le rachat de leur part.</p>

<h2>Une fiscalité successorale très lourde pour le concubin</h2>
<p>Même lorsque le concubin reçoit quelque chose par testament ou donation, la fiscalité applicable est particulièrement punitive :</p>
<ul>
  <li><strong>Abattement :</strong> seulement 1 594 € (contre 100 000 € entre parent et enfant)</li>
  <li><strong>Taux d'imposition :</strong> 60% sur la totalité de la part nette</li>
  <li><strong>Aucun barème progressif :</strong> contrairement aux héritiers en ligne directe</li>
</ul>
<p>Exemple : pour un legs de 200 000 € à votre concubin, les droits de succession s'élèvent à environ 119 044 €. Votre partenaire ne touche en réalité que 80 956 €.</p>
<p>Cette fiscalité confiscatoire impose de structurer la transmission avec un notaire pour limiter au maximum l'impact fiscal.</p>

<InternalCTA />

<h2>Les solutions notariales pour protéger son concubin</h2>
<p>Heureusement, plusieurs outils juridiques permettent d'organiser efficacement la transmission au profit du concubin survivant.</p>

<h3>Le testament authentique</h3>
<p>Rédigé devant notaire, le testament permet de léguer à votre concubin la quotité disponible de votre patrimoine. Si vous avez des enfants, vous devez respecter leur réserve héréditaire, mais vous pouvez transmettre 1/2, 1/3 ou 1/4 selon le nombre d'enfants.</p>

<h3>L'assurance-vie : l'outil le plus efficace</h3>
<p>L'assurance-vie échappe aux règles successorales classiques. Vous pouvez désigner votre concubin comme bénéficiaire et lui transmettre jusqu'à 152 500 € en franchise totale d'impôt (pour les primes versées avant 70 ans).</p>

<h3>La donation au dernier vivant : impossible</h3>
<p>Attention, contrairement aux époux, les concubins ne peuvent pas bénéficier d'une donation au dernier vivant. C'est une raison majeure d'envisager le mariage ou le PACS.</p>

<h3>La SCI familiale</h3>
<p>Créer une SCI permet d'organiser la détention du logement et de prévoir des clauses statutaires protectrices (démembrement croisé des parts, droit de préemption).</p>

<h2>PACS ou mariage : pourquoi y penser ?</h2>
<p>Avant d'engager des stratégies complexes, il faut savoir que le PACS et le mariage offrent des avantages successoraux considérables :</p>
<ul>
  <li><strong>Mariage :</strong> exonération totale des droits de succession entre époux + droits légaux du conjoint survivant</li>
  <li><strong>PACS :</strong> exonération totale des droits de succession (mais nécessite un testament pour hériter)</li>
</ul>
<p>Le simple fait de signer un PACS et de rédiger un testament chez le notaire suffit à transformer radicalement la situation patrimoniale du survivant.</p>

<h2>Pourquoi consulter un notaire ?</h2>
<p>Chaque situation de concubinage est unique : enfants d'une précédente union, patrimoine immobilier en indivision, entreprise familiale, écart de patrimoine entre concubins... Seul un notaire peut bâtir une stratégie patrimoniale adaptée combinant testament, assurance-vie, donations et structures juridiques.</p>
<p>Le premier rendez-vous chez nos notaires partenaires est offert et permet d'identifier les leviers prioritaires pour protéger votre concubin.</p>

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
  <p className="lead">L'optimisation fiscale succession notaire est une démarche stratégique pour transmettre votre patrimoine dans les meilleures conditions. En France, les droits de succession peuvent atteindre 45 % en ligne directe et jusqu'à 60 % entre non-parents. Anticiper avec un notaire permet de réduire significativement cette charge fiscale tout en respectant le cadre légal.</p>

  <KeyPoints points={[
    "Abattement de 100 000 € par enfant et par parent, renouvelable tous les 15 ans",
    "L'assurance-vie reste l'outil le plus efficace de transmission hors succession",
    "Le démembrement de propriété permet de transmettre à moindre coût fiscal",
    "Une planification précoce avec un notaire maximise les économies fiscales"
  ]} />

  <h2>Comprendre les droits de succession en France</h2>
  <p>Les droits de succession sont calculés selon un barème progressif qui dépend du lien de parenté entre le défunt et l'héritier. En ligne directe (enfants, parents), le taux varie de 5 % à 45 % après application d'un abattement de 100 000 € par héritier. Entre frères et sœurs, le taux atteint 35 % à 45 %, et entre personnes non parentes, il grimpe à 60 %.</p>
  <p>Sans préparation, votre famille peut se retrouver avec une facture fiscale considérable, parfois supérieure aux liquidités disponibles. C'est pourquoi l'optimisation fiscale succession avec un notaire est essentielle pour préserver le patrimoine que vous avez constitué.</p>
  <p>Le notaire dispose d'une vision globale de votre situation : composition du patrimoine, situation familiale, objectifs de transmission. Il peut ainsi proposer une stratégie sur mesure combinant plusieurs outils juridiques et fiscaux.</p>

  <h2>Les donations : un levier d'optimisation puissant</h2>
  <p>La donation est l'outil principal d'optimisation fiscale successorale. Chaque parent peut donner jusqu'à 100 000 € à chaque enfant en franchise de droits, et ce tous les 15 ans. Un couple avec deux enfants peut donc transmettre 400 000 € sans fiscalité, et renouveler l'opération après 15 ans.</p>
  <p>Plusieurs formes de donation existent :</p>
  <ul>
    <li><strong>La donation simple</strong> : transmission immédiate d'un bien ou d'une somme d'argent</li>
    <li><strong>La donation-partage</strong> : permet de répartir équitablement entre héritiers et de figer les valeurs au jour de la donation</li>
    <li><strong>Le don familial de somme d'argent</strong> : abattement supplémentaire de 31 865 € si le donateur a moins de 80 ans et le donataire plus de 18 ans</li>
    <li><strong>La donation avec réserve d'usufruit</strong> : vous transmettez la nue-propriété tout en conservant l'usage du bien</li>
  </ul>

  <InternalCTA />

  <h2>L'assurance-vie et le démembrement : les stratégies avancées</h2>
  <p>L'assurance-vie reste l'outil de transmission le plus avantageux fiscalement. Les capitaux versés avant 70 ans bénéficient d'un abattement de 152 500 € par bénéficiaire, puis d'une taxation forfaitaire de 20 % jusqu'à 700 000 € et 31,25 % au-delà. Pour les versements après 70 ans, l'abattement global est de 30 500 €, mais les intérêts restent exonérés.</p>
  <p>Le démembrement de propriété consiste à séparer la nue-propriété de l'usufruit. En donnant la nue-propriété de votre vivant, vous transmettez à un coût fiscal réduit : la valeur taxable est calculée selon un barème lié à votre âge. À 60 ans, la nue-propriété ne représente que 50 % de la valeur du bien.</p>
  <p>Au décès de l'usufruitier, le nu-propriétaire récupère la pleine propriété sans aucun droit supplémentaire à payer. C'est une stratégie particulièrement efficace pour transmettre l'immobilier.</p>

  <h2>Structures juridiques et stratégies patrimoniales</h2>
  <p>Pour les patrimoines importants ou immobiliers, la création d'une SCI (Société Civile Immobilière) facilite la transmission. Les parts sociales peuvent être données progressivement, en profitant des abattements renouvelables, et le démembrement des parts amplifie l'effet fiscal.</p>
  <p>Le pacte Dutreil, quant à lui, permet de transmettre une entreprise familiale avec une exonération de 75 % de sa valeur, sous conditions d'engagement de conservation. Combiné à une donation en pleine propriété avant 70 ans avec réduction de 50 %, l'économie peut être spectaculaire.</p>
  <p>Enfin, le changement de régime matrimonial vers une communauté universelle avec clause d'attribution intégrale peut protéger le conjoint survivant, même si cette stratégie reporte la fiscalité sur la génération suivante. Votre notaire évaluera son opportunité selon votre situation.</p>

  <h2>Conclusion</h2>
  <p>L'optimisation fiscale d'une succession ne s'improvise pas. Elle nécessite une analyse approfondie de votre patrimoine, de votre situation familiale et de vos objectifs. Les outils existent : donations, assurance-vie, démembrement, structures sociétaires. Encore faut-il les combiner intelligemment et anticiper.</p>
  <p>Le notaire est votre interlocuteur privilégié pour bâtir une stratégie cohérente, sécurisée juridiquement et optimisée fiscalement. Plus vous anticipez, plus les économies seront importantes pour vos héritiers.</p>

  <InternalCTA />
</>
    </>
  );
}

/* ── Article 19 ─────────────────────────────────────────────────────────── */

function Article19() {
  return (
    <>
      <>
<p className="lead">Le rapport des donations à la succession est un mécanisme juridique essentiel qui garantit l'égalité entre les héritiers lors du règlement d'une succession. Lorsqu'un défunt a consenti des donations de son vivant à certains de ses héritiers, ces libéralités doivent en principe être réintégrées dans la masse successorale pour assurer un partage équitable.</p>

<KeyPoints points={[
  "Le rapport civil concerne les donations faites aux héritiers, sauf mention contraire dans l'acte",
  "Les biens sont évalués à leur valeur au jour du partage, dans leur état au jour de la donation",
  "Les présents d'usage et donations hors part successorale échappent au rapport",
  "Le notaire calcule le rapport et veille à l'équilibre entre cohéritiers"
]} />

<h2>Qu'est-ce que le rapport des donations à la succession ?</h2>
<p>Le rapport des donations est une opération juridique prévue par les articles 843 et suivants du Code civil. Il consiste à reconstituer fictivement le patrimoine du défunt en y réintégrant les donations consenties de son vivant à ses héritiers. L'objectif est d'assurer l'égalité du partage entre les cohéritiers.</p>
<p>Concrètement, un héritier qui a reçu une donation devra, lors de la succession, en tenir compte sur sa part d'héritage. Si la donation dépasse la part qui lui revient, il pourra être amené à verser une indemnité de rapport aux autres héritiers.</p>
<p>Ce mécanisme repose sur une présomption : sauf disposition contraire, une donation faite à un héritier est considérée comme une avance sur sa part d'héritage, et non comme un avantage destiné à le favoriser.</p>

<h2>Quelles donations sont rapportables à la succession ?</h2>
<p>Toutes les donations ne sont pas soumises à l'obligation de rapport. Plusieurs critères permettent de déterminer si une libéralité doit être réintégrée à la masse successorale.</p>

<h3>Les donations rapportables</h3>
<p>Sont rapportables les donations consenties à un héritier acceptant la succession, qu'il s'agisse :</p>
<ul>
  <li>Des donations notariées (donation simple, donation-partage incluse dans certains cas)</li>
  <li>Des dons manuels (somme d'argent, objets, bijoux)</li>
  <li>Des donations indirectes (vente à prix minoré, abandon de créance)</li>
  <li>Des donations déguisées</li>
</ul>

<h3>Les donations non rapportables</h3>
<p>Certaines libéralités échappent au rapport :</p>
<ul>
  <li><strong>Les donations hors part successorale</strong> : expressément stipulées comme un avantage en plus de la part d'héritage, elles s'imputent sur la quotité disponible</li>
  <li><strong>Les présents d'usage</strong> : cadeaux remis lors d'occasions particulières (mariage, anniversaire) dont la valeur reste proportionnée au train de vie du donateur</li>
  <li><strong>Les donations faites à un non-héritier</strong> (un ami, par exemple)</li>
  <li><strong>Les donations-partages</strong>, qui sont en principe définitives et non soumises au rapport</li>
</ul>

<h2>Comment évaluer une donation rapportable ?</h2>
<p>L'évaluation du rapport est une étape délicate qui obéit à des règles précises fixées par l'article 860 du Code civil.</p>

<h3>Le principe de la double référence</h3>
<p>Le bien donné est évalué selon deux références :</p>
<ul>
  <li><strong>Sa valeur au jour du partage</strong> : pour tenir compte de l'évolution du marché et de l'inflation</li>
  <li><strong>Son état au jour de la donation</strong> : les améliorations apportées par le donataire ne sont pas prises en compte dans le rapport</li>
</ul>
<p>Cette règle protège l'équité : un héritier qui aurait reçu un terrain construit ensuite par ses soins ne sera pas pénalisé par la valeur ajoutée qu'il a personnellement créée.</p>

<h3>Cas particulier des sommes d'argent</h3>
<p>Pour les dons de sommes d'argent, le rapport est en principe égal au montant nominal donné. Toutefois, si la somme a servi à acquérir un bien, le rapport est calculé sur la valeur de ce bien au jour du partage.</p>

<h2>Le rôle du notaire dans le calcul du rapport</h2>
<p>Le notaire joue un rôle central dans l'application des règles de rapport. Il est chargé de :</p>
<ul>
  <li>Recenser toutes les donations consenties par le défunt</li>
  <li>Qualifier juridiquement chaque libéralité (rapportable ou non)</li>
  <li>Évaluer les biens donnés selon les règles légales</li>
  <li>Calculer la masse successorale reconstituée</li>
  <li>Déterminer les parts de chaque héritier et les éventuelles indemnités de rapport</li>
</ul>
<p>Cette mission requiert une grande rigueur, surtout lorsque les donations sont anciennes ou que des contestations surgissent entre cohéritiers. Le notaire veille également à vérifier que la réserve héréditaire de chaque héritier réservataire est respectée.</p>

<InternalCTA />
</>
    </>
  );
}

/* ── Article 20 ─────────────────────────────────────────────────────────── */

function Article20() {
  return (
    <>
      <>
<p className="lead">Le <strong>legs particulier, universel ou à titre universel inscrit dans un testament rédigé chez le notaire</strong> permet d'organiser sereinement la transmission de votre patrimoine. Comprendre ces trois catégories est essentiel pour exprimer vos volontés avec précision et éviter tout litige successoral.</p>

<KeyPoints points={[
  "Le legs universel transmet l'intégralité du patrimoine à un ou plusieurs bénéficiaires",
  "Le legs à titre universel attribue une quote-part ou une catégorie de biens",
  "Le legs particulier vise un bien précis identifié dans le testament",
  "Le testament authentique notarié offre la sécurité juridique maximale"
]} />

<h2>Comprendre les trois types de legs dans un testament</h2>
<p>En droit français, le Code civil distingue trois formes de legs que vous pouvez intégrer dans votre testament. Chacune répond à un objectif patrimonial différent et entraîne des conséquences juridiques spécifiques pour vos héritiers et légataires.</p>

<h3>Le legs universel</h3>
<p>Le legs universel désigne un ou plusieurs bénéficiaires destinés à recevoir <strong>l'ensemble des biens</strong> que vous laisserez à votre décès. Le légataire universel est traité comme un véritable héritier : il reçoit l'actif, mais doit aussi assumer le passif (dettes, charges). En présence d'héritiers réservataires (enfants, conjoint dans certains cas), le legs universel ne peut porter que sur la quotité disponible.</p>

<h3>Le legs à titre universel</h3>
<p>Le legs à titre universel porte sur <strong>une fraction du patrimoine</strong> : la moitié, le tiers, tous les immeubles, ou tous les meubles. Le légataire reçoit donc une quote-part proportionnelle de l'actif et du passif. C'est une solution intermédiaire utile pour répartir précisément votre succession entre plusieurs personnes.</p>

<h3>Le legs particulier</h3>
<p>Le legs particulier concerne <strong>un ou plusieurs biens identifiés</strong> : une somme d'argent, un appartement, un véhicule, une œuvre d'art, des bijoux. Contrairement aux autres legs, le légataire particulier n'est pas tenu des dettes successorales (sauf clause contraire) et n'a pas la qualité d'héritier.</p>

<h2>Pourquoi rédiger son testament devant un notaire ?</h2>
<p>Si le testament olographe (entièrement écrit, daté et signé de votre main) reste valable, le <strong>testament authentique reçu par un notaire</strong> présente des avantages décisifs. Il garantit le respect des règles de forme, évite les contestations sur l'état mental du testateur et sécurise l'interprétation des volontés.</p>
<p>Le notaire vérifie également que vos legs respectent la réserve héréditaire, conseille sur les conséquences fiscales et inscrit le testament au <strong>Fichier Central des Dispositions de Dernières Volontés (FCDDV)</strong>, garantissant qu'il sera retrouvé et exécuté.</p>

<InternalCTA />

<h2>Fiscalité des legs : ce qu'il faut anticiper</h2>
<p>Les droits de succession applicables aux legs dépendent du lien de parenté entre vous et le légataire. Voici les principaux barèmes à connaître :</p>
<ul>
  <li><strong>Enfants et parents</strong> : abattement de 100 000 €, puis barème progressif de 5 % à 45 %</li>
  <li><strong>Frères et sœurs</strong> : abattement de 15 932 €, taux de 35 % ou 45 %</li>
  <li><strong>Neveux et nièces</strong> : abattement de 7 967 €, taux de 55 %</li>
  <li><strong>Tiers (non parents)</strong> : abattement de 1 594 €, taux de 60 %</li>
  <li><strong>Conjoint et partenaire de PACS</strong> : exonération totale</li>
  <li><strong>Associations reconnues d'utilité publique</strong> : exonération possible</li>
</ul>
<p>Un notaire vous aidera à structurer vos legs pour optimiser la transmission, par exemple en démembrant la propriété ou en combinant donations du vivant et legs testamentaires.</p>

<h2>Conseils pratiques pour rédiger vos legs</h2>
<p>Pour que vos volontés soient pleinement respectées, suivez ces recommandations :</p>
<ul>
  <li><strong>Identifiez précisément les bénéficiaires</strong> : nom, prénom, date et lieu de naissance pour éviter toute ambiguïté</li>
  <li><strong>Décrivez les biens avec exactitude</strong> dans le cas d'un legs particulier (références cadastrales, numéros de compte)</li>
  <li><strong>Prévoyez un légataire de substitution</strong> au cas où le premier décède avant vous ou renonce au legs</li>
  <li><strong>Anticipez les charges et conditions</strong> éventuelles attachées au legs</li>
  <li><strong>Mettez à jour régulièrement</strong> votre testament en cas d'évolution familiale ou patrimoniale</li>
</ul>
<p>N'oubliez pas que vous pouvez révoquer ou modifier votre testament à tout moment, tant que vous êtes vivant et capable juridiquement.</p>

<h2>En résumé</h2>
<p>Choisir entre legs particulier, universel ou à titre universel dépend de vos objectifs : transmettre l'ensemble de votre patrimoine, en répartir une part, ou attribuer un bien précis. Le recours au <strong>notaire pour rédiger un testament authentique</strong> est la meilleure garantie pour que vos volontés soient respectées, dans le strict cadre légal et fiscal.</p>
</>
    </>
  );
}

/* ── Article 21 ─────────────────────────────────────────────────────────── */

function Article21() {
  return (
    <>
      <>
  <p className="lead">La succession internationale avec un notaire français concerne toute succession comportant un élément d'extranéité : défunt résidant à l'étranger, héritiers expatriés ou biens situés hors de France. Ces dossiers complexes nécessitent une expertise juridique pointue pour déterminer la loi applicable, organiser le règlement et optimiser la fiscalité.</p>

  <KeyPoints points={[
    "Le règlement européen n°650/2012 régit les successions ouvertes depuis le 17 août 2015",
    "La loi applicable est celle du dernier domicile du défunt, sauf choix contraire",
    "Le certificat successoral européen facilite les démarches dans toute l'UE",
    "Des conventions fiscales évitent la double imposition dans 30+ pays",
    "Le notaire français coordonne avec ses confrères étrangers"
  ]} />

  <h2>Quelle loi s'applique à une succession internationale ?</h2>
  <p>Depuis l'entrée en vigueur du règlement européen du 4 juillet 2012, la règle a été profondément simplifiée. Auparavant, la France appliquait un système dualiste : la loi du domicile du défunt pour les biens mobiliers et la loi du lieu de situation pour les biens immobiliers. Désormais, une seule loi régit l'ensemble de la succession.</p>

  <p>Le principe est simple : la loi applicable est celle de la <strong>résidence habituelle du défunt</strong> au moment de son décès. Cette règle s'applique à toutes les successions ouvertes depuis le 17 août 2015, même si le défunt n'était pas ressortissant d'un État membre.</p>

  <p>Toutefois, toute personne peut, par testament, choisir que la loi de sa nationalité régisse sa succession. Ce choix, appelé <em>professio juris</em>, doit être explicite et formalisé. Pour un Français vivant à l'étranger, cela permet par exemple de conserver les règles françaises de la réserve héréditaire qui protègent les enfants.</p>

  <h2>Le rôle central du notaire français dans une succession transfrontalière</h2>
  <p>Le notaire français intervient dès lors qu'un élément rattache la succession à la France : nationalité française du défunt, biens immobiliers sur le territoire, héritier résidant en France ou compte bancaire français. Son rôle est multiple.</p>

  <p><strong>Identification de la loi applicable :</strong> le notaire analyse le dossier pour déterminer la résidence habituelle du défunt, vérifier l'existence d'un choix de loi testamentaire et identifier les règles successorales à appliquer.</p>

  <p><strong>Coordination internationale :</strong> il établit le contact avec les notaires, avocats ou autorités étrangères compétentes. Cette coordination est essentielle pour éviter les conflits de procédures et accélérer le règlement.</p>

  <p><strong>Délivrance du certificat successoral européen :</strong> ce document, créé par le règlement européen, prouve la qualité d'héritier, de légataire ou d'exécuteur testamentaire dans tous les États membres (sauf Danemark et Irlande). Il évite des démarches longues et coûteuses dans chaque pays.</p>

  <h2>La fiscalité d'une succession internationale</h2>
  <p>La question fiscale est souvent la plus complexe. Contrairement au règlement civil unifié, la fiscalité reste régie par le droit interne de chaque État. En France, le Code général des impôts prévoit une imposition large.</p>

  <p>Les droits de succession français s'appliquent si :</p>
  <ul>
    <li>Le défunt avait son domicile fiscal en France ;</li>
    <li>L'héritier est domicilié fiscalement en France (et l'a été au moins 6 ans sur les 10 dernières années) ;</li>
    <li>Les biens transmis sont situés en France (immeubles, comptes bancaires, parts de SCI, etc.).</li>
  </ul>

  <p>Pour éviter la double imposition, la France a signé des conventions fiscales bilatérales avec une trentaine de pays (États-Unis, Royaume-Uni, Allemagne, Italie, Belgique, Suisse, etc.). Ces conventions attribuent le droit d'imposer à l'un ou l'autre État, ou prévoient un crédit d'impôt.</p>

  <p>En l'absence de convention, l'article 784 A du CGI permet d'imputer l'impôt étranger payé sur les biens situés hors de France sur les droits français correspondants. Une analyse fine est indispensable pour optimiser la transmission.</p>

  <h2>Les étapes du règlement d'une succession internationale</h2>
  <p>Le règlement d'une succession internationale suit plusieurs étapes coordonnées par le notaire.</p>

  <p><strong>1. Ouverture du dossier :</strong> recueil des documents (acte de décès, livret de famille, testament éventuel, titres de propriété), identification des héritiers et inventaire du patrimoine mondial.</p>

  <p><strong>2. Détermination de la loi applicable :</strong> analyse de la résidence habituelle, recherche d'un choix de loi et qualification des biens.</p>

  <p><strong>3. Établissement des actes :</strong> acte de notoriété, attestation immobilière pour les biens français, certificat successoral européen si nécessaire.</p>

  <p><strong>4. Déclaration fiscale :</strong> dépôt de la déclaration de succession dans les 6 mois (12 mois si le défunt est décédé à l'étranger) et paiement des droits.</p>

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
  <p className="lead">La différence entre <strong>compromis vs acte de vente notaire</strong> est essentielle à comprendre avant tout achat immobilier. Ces deux documents jalonnent la transaction mais n'ont ni la même portée juridique, ni les mêmes effets. Le compromis engage les parties à conclure la vente, tandis que l'acte authentique signé chez le notaire transfère effectivement la propriété. Décryptage complet pour sécuriser votre projet immobilier.</p>

  <KeyPoints points={[
    "Le compromis de vente est un avant-contrat qui engage vendeur et acheteur",
    "L'acte de vente notarié officialise le transfert de propriété",
    "Le délai moyen entre les deux signatures est de 3 à 4 mois",
    "Seul l'acte authentique a force exécutoire et est publié au service de la publicité foncière"
  ]} />

  <h2>Qu'est-ce que le compromis de vente ?</h2>
  <p>Le compromis de vente, ou promesse synallagmatique de vente, est un avant-contrat par lequel le vendeur s'engage à vendre son bien et l'acheteur à l'acquérir, à un prix convenu. Juridiquement, il vaut vente : "promesse de vente vaut vente" selon l'article 1589 du Code civil.</p>
  <p>Ce document contient des informations essentielles : identité des parties, description précise du bien, prix, conditions suspensives (obtention du prêt, absence de servitude, droit de préemption), date prévisionnelle de signature de l'acte authentique et montant du dépôt de garantie (généralement 5 à 10 % du prix).</p>
  <p>L'acheteur bénéficie d'un <strong>délai de rétractation de 10 jours</strong> à compter du lendemain de la première présentation de la notification. Passé ce délai, l'engagement devient ferme.</p>

  <h2>L'acte de vente notarié : la concrétisation</h2>
  <p>L'acte de vente, dit aussi acte authentique, est le document signé chez le notaire qui formalise définitivement la transaction. Contrairement au compromis, il transfère la propriété du bien et donne lieu au paiement intégral du prix ainsi qu'au versement des frais de notaire.</p>
  <p>Le notaire procède à plusieurs vérifications cruciales avant la signature :</p>
  <ul>
    <li>Contrôle de l'origine de propriété sur 30 ans</li>
    <li>Purge des droits de préemption (commune, SAFER)</li>
    <li>Vérification des hypothèques et servitudes</li>
    <li>Conformité urbanistique et diagnostics techniques</li>
    <li>Capacité juridique des parties</li>
  </ul>
  <p>Une fois signé, l'acte est publié au service de la publicité foncière, ce qui le rend opposable aux tiers. Le notaire conserve la minute pendant 75 ans avant son transfert aux Archives nationales.</p>

  <h2>Compromis vs acte de vente notaire : les différences essentielles</h2>
  <p>Plusieurs points distinguent fondamentalement ces deux étapes :</p>
  <p><strong>Force juridique :</strong> le compromis est un contrat sous seing privé (sauf s'il est notarié), tandis que l'acte de vente est authentique et a force exécutoire. En cas de litige, l'acte authentique fait foi sans nécessité d'autres preuves.</p>
  <p><strong>Transfert de propriété :</strong> le compromis crée une obligation de conclure la vente, mais ne transfère pas la propriété. Seul l'acte de vente opère ce transfert effectif, accompagné de la remise des clés.</p>
  <p><strong>Paiement et fiscalité :</strong> au compromis, seul le dépôt de garantie est versé. À l'acte authentique, le prix total est payé ainsi que les frais de notaire (7 à 8 % dans l'ancien, 2 à 3 % dans le neuf).</p>
  <p><strong>Délai :</strong> entre les deux signatures, comptez généralement 3 à 4 mois. Ce délai permet d'obtenir le financement, de purger les conditions suspensives et de réunir tous les documents requis.</p>

  <h2>Pourquoi faire signer son compromis chez le notaire ?</h2>
  <p>Bien que non obligatoire, la signature du compromis chez un notaire présente de nombreux avantages. Le notaire rédige un acte sur mesure, intègre toutes les conditions suspensives adaptées à votre situation et vérifie en amont la situation juridique du bien.</p>
  <p>Cette sécurité juridique évite de mauvaises surprises lors de la signature de l'acte authentique. De plus, faire intervenir le notaire dès le compromis n'entraîne généralement pas de surcoût : ses émoluments sont calculés globalement sur la transaction.</p>
  <p>En cas de litige, de désaccord sur les conditions ou de complexité particulière (indivision, succession en cours, bien démembré), l'accompagnement notarial dès le compromis est vivement recommandé.</p>

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
  <p className="lead">La plus-value immobilière et l'exonération de la résidence principale constituent un avantage fiscal majeur en France : la vente de votre logement principal échappe totalement à l'imposition. Mais cette exonération obéit à des conditions strictes qu'il faut maîtriser pour éviter un redressement fiscal.</p>

  <KeyPoints points={[
    "Exonération totale de plus-value pour la vente de la résidence principale",
    "Le bien doit être votre habitation effective au jour de la cession",
    "Délai toléré d'environ 12 mois entre départ et vente",
    "Autres exonérations possibles : durée de détention, montant, première cession"
  ]} />

  <h2>Qu'est-ce que la plus-value immobilière ?</h2>
  <p>La plus-value immobilière correspond à la différence entre le prix de vente d'un bien et son prix d'acquisition. Lorsqu'elle est positive, elle est en principe soumise à l'impôt sur le revenu au taux de 19 % et aux prélèvements sociaux de 17,2 %, soit une taxation globale de 36,2 %.</p>
  <p>Heureusement, plusieurs cas d'exonération existent, et le plus connu concerne la résidence principale. Cette règle vise à ne pas pénaliser les ménages qui changent de logement au cours de leur vie.</p>

  <h2>L'exonération de la résidence principale : conditions</h2>
  <p>L'article 150 U-II-1° du Code général des impôts prévoit une exonération totale de plus-value pour la cession de la résidence principale. Trois conditions doivent être réunies.</p>

  <h3>1. Le bien doit être votre habitation principale</h3>
  <p>La résidence principale est définie comme le lieu où vous résidez habituellement et effectivement pendant la majeure partie de l'année. L'administration vérifie cette qualité à partir de plusieurs indices : déclarations fiscales, factures de consommation (eau, électricité), adresse de domiciliation bancaire, scolarisation des enfants, etc.</p>
  <p>Une simple déclaration ne suffit pas : il faut prouver une occupation réelle. Un bien loué meublé ou vide ne peut pas être qualifié de résidence principale.</p>

  <h3>2. L'occupation au jour de la cession</h3>
  <p>Le bien doit constituer votre résidence principale au jour de la vente. Si vous avez déménagé avant la signature de l'acte authentique, l'exonération peut être remise en cause.</p>
  <p>Toutefois, l'administration fiscale admet une tolérance : si le logement est mis en vente immédiatement après votre départ et reste inoccupé, l'exonération est maintenue pendant un délai raisonnable, généralement estimé à 12 mois.</p>

  <h3>3. Les dépendances immédiates</h3>
  <p>L'exonération s'étend aux dépendances immédiates et nécessaires (garage, cave, jardin) vendues en même temps que la résidence principale. Un garage situé à moins d'un kilomètre est généralement considéré comme une dépendance.</p>

  <InternalCTA />

  <h2>Les autres cas d'exonération de plus-value</h2>
  <p>Si votre bien n'est pas votre résidence principale, d'autres dispositifs peuvent vous exonérer totalement ou partiellement.</p>

  <h3>Exonération pour durée de détention</h3>
  <p>La plus-value bénéficie d'abattements progressifs selon la durée de détention :</p>
  <ul>
    <li>Exonération totale d'impôt sur le revenu après 22 ans de détention</li>
    <li>Exonération totale des prélèvements sociaux après 30 ans</li>
  </ul>

  <h3>Première cession d'une résidence secondaire</h3>
  <p>Si vous n'avez pas été propriétaire de votre résidence principale au cours des 4 années précédentes et que vous réinvestissez le prix de vente dans l'achat de votre résidence principale dans les 24 mois, vous bénéficiez d'une exonération.</p>

  <h3>Petites cessions et situations particulières</h3>
  <p>Sont également exonérées : les ventes inférieures à 15 000 €, les cessions par des retraités ou invalides à revenus modestes, les ventes au profit d'organismes de logement social.</p>

  <h2>Comment calculer la plus-value imposable ?</h2>
  <p>Si votre bien n'est pas exonéré, le calcul s'effectue ainsi :</p>
  <ul>
    <li><strong>Prix de cession</strong> : prix de vente diminué des frais (diagnostics, mainlevée d'hypothèque)</li>
    <li><strong>Prix d'acquisition</strong> : prix d'achat majoré des frais de notaire (forfait 7,5 % possible) et des travaux (forfait 15 % après 5 ans de détention)</li>
    <li><strong>Abattements pour durée de détention</strong> appliqués sur la différence</li>
  </ul>
  <p>Le notaire calcule et déclare la plus-value lors de la signature de l'acte authentique. L'impôt est prélevé directement sur le prix de vente.</p>

  <h2>Les pièges à éviter</h2>
  <p>Plusieurs situations peuvent compromettre l'exonération :</p>
  <ul>
    <li><strong>Vente après déménagement</strong> : si vous attendez trop longtemps, l'exonération tombe</li>
    <li><strong>Bien loué récemment</strong> : la location, même brève, peut requalifier le bien</li>
    <li><strong>Double résidence</strong> : un seul logement peut être qualifié de résidence principale</li>
    <li><strong>Construction non terminée</strong> : un bien inachevé ne peut être une résidence principale</li>
  </ul>
  <p>En cas de doute, consultez un notaire avant la mise en vente. Une analyse préalable de votre situation permet d'anticiper et de sécuriser l'exonération.</p>

  <InternalCTA />
</>
    </>
  );
}

/* ── Article 24 ─────────────────────────────────────────────────────────── */

function Article24() {
  return (
    <>
      <>
<p className="lead">Le viager bouquet rente notaire est un montage immobilier qui permet à un propriétaire de vendre son bien tout en percevant un capital initial (le bouquet) puis une rente viagère jusqu'à son décès. Encadrée par le notaire, cette opération sécurise vendeur et acquéreur grâce à un acte authentique aux clauses précises.</p>

<KeyPoints points={[
  "Le viager se compose d'un bouquet (capital versé au comptant) et d'une rente viagère mensuelle ou trimestrielle.",
  "L'acte authentique chez le notaire est obligatoire pour sécuriser la vente.",
  "Le calcul dépend de l'âge du crédirentier, de la valeur du bien et de son occupation.",
  "Le viager occupé décote le prix de 30 à 50 % par rapport à la valeur libre."
]} />

<h2>Comprendre le viager : bouquet et rente expliqués</h2>
<p>La vente en viager repose sur un principe simple : le vendeur (appelé <strong>crédirentier</strong>) cède son bien immobilier à un acquéreur (le <strong>débirentier</strong>) qui s'engage à lui verser une rente jusqu'à son décès. À cela s'ajoute généralement un capital initial, le bouquet, payé le jour de la signature de l'acte chez le notaire.</p>
<p>Il existe deux grandes formes de viager :</p>
<ul>
  <li><strong>Le viager occupé</strong> : le vendeur conserve un droit d'usage et d'habitation (DUH) ou un usufruit sur le bien. C'est la formule la plus courante (environ 95 % des viagers).</li>
  <li><strong>Le viager libre</strong> : l'acquéreur dispose immédiatement du bien, qu'il peut habiter ou louer. La rente est alors plus élevée.</li>
</ul>
<p>Le notaire joue un rôle central : il vérifie la capacité des parties, calcule la rente conformément aux barèmes en vigueur, intègre les clauses de revalorisation et de résolution, puis publie l'acte au service de la publicité foncière.</p>

<h2>Comment se calculent le bouquet et la rente ?</h2>
<p>Le calcul du viager bouquet rente notaire s'appuie sur plusieurs paramètres objectifs :</p>
<ul>
  <li><strong>La valeur vénale</strong> du bien (estimation au prix du marché libre).</li>
  <li><strong>L'âge et l'espérance de vie</strong> du crédirentier, selon les tables de mortalité de l'INSEE.</li>
  <li><strong>L'occupation du bien</strong> : un viager occupé subit une décote de 30 à 50 % (valeur du DUH).</li>
  <li><strong>Le rendement attendu</strong> appliqué à la valeur restante après bouquet.</li>
</ul>
<p>Exemple simplifié : pour un bien estimé 300 000 € avec un vendeur de 75 ans en viager occupé, la décote d'occupation peut représenter environ 40 %, soit une valeur économique de 180 000 €. Si le bouquet est fixé à 60 000 €, la rente viagère sera calculée sur les 120 000 € restants, soit environ 700 à 900 € par mois selon les barèmes.</p>
<p>La rente est ensuite <strong>indexée annuellement</strong>, généralement sur l'indice des prix à la consommation publié par l'INSEE, pour préserver le pouvoir d'achat du vendeur.</p>

<h2>Le rôle protecteur du notaire dans la vente en viager</h2>
<p>Le notaire intervient à chaque étape pour sécuriser l'opération :</p>
<ol>
  <li><strong>Estimation et conseil</strong> : il vérifie la cohérence économique du montage et conseille sur la répartition optimale entre bouquet et rente.</li>
  <li><strong>Rédaction de l'acte authentique</strong> : il insère les clauses essentielles (résolutoire en cas de non-paiement, privilège du vendeur, interdiction de revente sans accord, indexation).</li>
  <li><strong>Vérification de l'aléa</strong> : le viager doit comporter un aléa réel sur la durée de vie du vendeur. Si celui-ci décède dans les 20 jours suivant la vente d'une maladie connue, le contrat peut être annulé (article 1975 du Code civil).</li>
  <li><strong>Publication et formalités fiscales</strong> : enregistrement, calcul des droits de mutation et déclarations.</li>
</ol>
<p>Côté fiscalité, le bouquet est exonéré d'impôt pour le vendeur s'il s'agit de sa résidence principale. La rente bénéficie d'un abattement selon l'âge du crédirentier au premier versement : 70 % d'abattement après 69 ans, 60 % entre 60 et 69 ans.</p>

<h2>Avantages et points de vigilance</h2>
<p>Le viager présente des intérêts forts pour les deux parties :</p>
<ul>
  <li><strong>Pour le vendeur</strong> : un complément de retraite régulier, le maintien dans son logement et une fiscalité allégée.</li>
  <li><strong>Pour l'acheteur</strong> : l'acquisition d'un bien à prix décoté, sans recours bancaire systématique, avec un effet de levier patrimonial.</li>
</ul>
<p>Quelques précautions s'imposent toutefois : bien évaluer sa capacité à verser la rente sur le long terme, anticiper la répartition des charges et travaux (généralement l'acheteur prend en charge le gros œuvre, le vendeur les charges d'entretien courant), et faire attention aux clauses de réversion en cas de couple vendeur.</p>

<InternalCTA />
</>
    </>
  );
}

/* ── Article 25 ─────────────────────────────────────────────────────────── */

function Article25() {
  return (
    <>
      <>
<p className="lead">La SCI familiale création notaire est une démarche stratégique pour organiser, protéger et transmettre un patrimoine immobilier en famille. Cette structure juridique séduit de plus en plus de Français souhaitant optimiser la gestion de leurs biens tout en anticipant leur succession dans un cadre sécurisé.</p>

<KeyPoints points={[
  "La SCI familiale facilite la transmission du patrimoine immobilier aux héritiers",
  "Le recours au notaire est obligatoire en cas d'apport d'un bien immobilier",
  "Les statuts notariés offrent une sécurité juridique optimale",
  "Avantages fiscaux : abattements sur les donations de parts tous les 15 ans"
]} />

<h2>Qu'est-ce qu'une SCI familiale et pourquoi la créer ?</h2>
<p>La Société Civile Immobilière (SCI) familiale est une structure juridique permettant à plusieurs membres d'une même famille de détenir et gérer ensemble un ou plusieurs biens immobiliers. Contrairement à l'indivision, qui peut générer des blocages, la SCI offre un cadre souple et stable pour la gestion patrimoniale.</p>
<p>Les motivations principales sont multiples : faciliter la transmission aux enfants, éviter les conflits successoraux, optimiser la fiscalité ou encore protéger le conjoint survivant. La SCI permet également de séparer le patrimoine immobilier du patrimoine personnel, offrant ainsi une meilleure organisation financière.</p>
<p>Le notaire joue un rôle central dans la création de la SCI familiale, particulièrement lorsqu'un bien immobilier est apporté au capital. Son intervention garantit la sécurité juridique de l'opération et l'adaptation des statuts aux objectifs familiaux.</p>

<h2>Les avantages majeurs de la SCI familiale</h2>
<p>La SCI familiale présente de nombreux atouts qui en font un outil patrimonial particulièrement prisé :</p>
<ul>
  <li><strong>Transmission facilitée</strong> : les parents peuvent donner progressivement des parts sociales à leurs enfants, en profitant des abattements fiscaux de 100 000 € par parent et par enfant, renouvelables tous les 15 ans.</li>
  <li><strong>Réduction des droits de succession</strong> : la valorisation des parts peut intégrer une décote pour absence de liquidité, réduisant ainsi l'assiette taxable.</li>
  <li><strong>Gestion simplifiée</strong> : le gérant désigné dans les statuts dispose des pouvoirs nécessaires pour administrer les biens sans avoir à solliciter chaque associé.</li>
  <li><strong>Protection du conjoint</strong> : grâce au démembrement de propriété ou aux clauses statutaires spécifiques, le conjoint survivant peut être protégé.</li>
  <li><strong>Évitement de l'indivision</strong> : la SCI permet de contourner les règles contraignantes de l'indivision successorale.</li>
</ul>
<p>Ces avantages sont d'autant plus efficaces lorsque les statuts sont rédigés sur mesure par un notaire, en tenant compte de la situation familiale et patrimoniale précise.</p>

<InternalCTA />

<h2>Les étapes de création d'une SCI familiale chez le notaire</h2>
<p>Créer une SCI familiale avec l'assistance d'un notaire suit un processus structuré, garantissant la solidité juridique de la société :</p>
<ol>
  <li><strong>Définition du projet</strong> : objectifs patrimoniaux, identité des associés, biens à apporter, répartition des parts.</li>
  <li><strong>Rédaction des statuts</strong> : le notaire élabore les statuts en intégrant les clauses adaptées (gérance, cession de parts, agrément, démembrement).</li>
  <li><strong>Apports au capital</strong> : numéraire ou immobilier. En cas d'apport d'un bien, l'acte notarié est obligatoire.</li>
  <li><strong>Publication d'un avis de constitution</strong> dans un journal d'annonces légales.</li>
  <li><strong>Immatriculation au RCS</strong> : dépôt du dossier complet au greffe du tribunal de commerce pour obtenir le Kbis.</li>
  <li><strong>Déclaration fiscale</strong> : enregistrement auprès des impôts et choix du régime fiscal (IR ou IS).</li>
</ol>
<p>L'accompagnement notarial est précieux pour anticiper les évolutions futures : entrée de nouveaux associés, cession de parts, donation progressive ou même dissolution.</p>

<h2>Fiscalité et choix stratégiques de la SCI familiale</h2>
<p>Le choix du régime fiscal est une décision cruciale lors de la création. La SCI familiale peut opter pour l'impôt sur le revenu (IR), régime par défaut, ou pour l'impôt sur les sociétés (IS), qui peut être plus avantageux dans certains cas de location meublée ou de revenus importants.</p>
<p>À l'IR, les associés sont imposés directement sur leur quote-part des revenus fonciers. À l'IS, la SCI paie l'impôt sur ses bénéfices, mais perd certains avantages comme les abattements pour durée de détention en cas de revente. Le notaire saura vous orienter vers le régime le plus adapté à votre situation.</p>
<p>La transmission des parts bénéficie d'une fiscalité attractive : donations échelonnées, démembrement (usufruit/nue-propriété), pacte Dutreil dans certains cas. Une stratégie bien pensée peut considérablement réduire la charge fiscale lors de la transmission.</p>

<h2>FAQ : vos questions sur la SCI familiale</h2>
<div className="faq">
  <h3>Faut-il obligatoirement un notaire pour créer une SCI familiale ?</h3>
  <p>Le notaire n'est pas obligatoire si la SCI ne reçoit aucun apport immobilier. En revanche, dès qu'un bien immobilier est apporté au capital, l'acte notarié devient impératif.</p>

  <h3>Quel est le coût de création d'une SCI familiale ?</h3>
  <p>Comptez entre 1 500 € et 3 000 € avec un notaire, incluant la rédaction des statuts, les frais d'enregistrement et la publication légale. Le coût varie selon les apports.</p>

  <h3>Combien d'associés faut-il pour créer une SCI familiale ?</h3>
  <p>Une SCI requiert au minimum deux associés, souvent des membres d'une même famille (parents, enfants, conjoints). Aucun capital minimum n'est imposé par la loi.</p>
</div>

<InternalCTA />
</>
    </>
  );
}

/* ── Article 26 ─────────────────────────────────────────────────────────── */

function Article26() {
  return (
    <>
      <>
  <p className="lead">L'achat immobilier en indivision avec un notaire est une solution courante pour acquérir un bien à plusieurs, que ce soit en couple non marié, entre amis, en famille ou avec des investisseurs. Cette formule juridique souple permet de partager la propriété d'un bien selon des quotes-parts définies, mais elle nécessite une préparation rigoureuse pour éviter les conflits futurs.</p>

  <KeyPoints points={[
    "L'indivision permet à plusieurs personnes d'acquérir un bien ensemble avec des quotes-parts définies",
    "Le notaire rédige l'acte authentique et conseille sur la répartition des droits",
    "Une convention d'indivision sécurise les rapports entre coïndivisaires",
    "Chaque indivisaire peut sortir de l'indivision, ce qui constitue son principal risque"
  ]} />

  <h2>Qu'est-ce que l'achat en indivision ?</h2>
  <p>L'indivision est la situation juridique dans laquelle plusieurs personnes, appelées indivisaires, sont propriétaires d'un même bien immobilier. Chacun détient une quote-part, exprimée en pourcentage ou en fraction, qui correspond généralement à sa participation financière dans l'acquisition.</p>
  <p>Cette formule est particulièrement adaptée aux couples non mariés ou non pacsés, aux fratries héritant d'un bien, ou encore aux groupes d'amis ou d'investisseurs souhaitant acquérir un bien commun. Contrairement à la SCI, l'indivision ne crée pas de personne morale : chaque indivisaire reste directement propriétaire d'une fraction du bien.</p>
  <p>Le notaire joue un rôle central dans ce dispositif. Il rédige l'acte authentique de vente, mentionne précisément les quotes-parts de chaque acquéreur et procède aux formalités de publicité foncière.</p>

  <h2>Le rôle du notaire dans l'achat en indivision</h2>
  <p>Le notaire intervient à plusieurs niveaux lors d'un achat immobilier en indivision. Sa mission ne se limite pas à la rédaction de l'acte de vente : il vous conseille en amont sur la structuration juridique de votre acquisition.</p>
  <h3>La détermination des quotes-parts</h3>
  <p>Le notaire vérifie que la répartition des quotes-parts correspond bien aux apports financiers de chaque indivisaire. Une répartition inéquitable par rapport aux apports réels peut être qualifiée de donation déguisée par l'administration fiscale, avec des conséquences lourdes en termes de droits de mutation.</p>
  <h3>La sécurisation par une convention d'indivision</h3>
  <p>Au-delà de l'acte de vente, le notaire peut rédiger une convention d'indivision. Ce document, conclu pour une durée maximale de 5 ans renouvelable, organise les rapports entre indivisaires : gestion du bien, répartition des charges, désignation d'un gérant, conditions de cession des parts, etc.</p>
  <h3>Le financement et les garanties</h3>
  <p>Si l'achat est financé par un prêt, le notaire s'assure de la cohérence entre les emprunts souscrits et les quotes-parts détenues. Il peut également conseiller sur la souscription d'assurances décès croisées entre concubins pour protéger le survivant.</p>

  <h2>Avantages et inconvénients de l'indivision</h2>
  <p>L'achat en indivision présente plusieurs avantages : simplicité de mise en place, coûts réduits par rapport à une SCI, souplesse dans la répartition des droits. C'est la formule la plus rapide pour acquérir à plusieurs.</p>
  <p>Cependant, l'indivision comporte des risques bien identifiés. Le principal réside dans l'adage juridique « nul n'est tenu de rester dans l'indivision » : tout indivisaire peut, à tout moment, demander le partage du bien et donc forcer sa vente. De plus, les décisions importantes nécessitent l'accord unanime ou à la majorité des deux tiers selon les actes concernés, ce qui peut bloquer la gestion en cas de désaccord.</p>
  <p>En cas de décès d'un indivisaire, sa quote-part est transmise à ses héritiers, qui deviennent à leur tour indivisaires. Cette situation peut créer des configurations complexes, notamment pour les couples non mariés.</p>

  <h2>Indivision ou SCI : que choisir ?</h2>
  <p>Le choix entre indivision et SCI dépend de votre projet et de votre situation. L'indivision convient parfaitement pour un achat simple, entre personnes proches, avec une vision à court ou moyen terme. La SCI sera préférable pour un investissement locatif structuré, une transmission patrimoniale optimisée ou un projet impliquant plusieurs investisseurs sur le long terme.</p>
  <p>Votre notaire est le mieux placé pour vous orienter vers la solution adaptée à vos objectifs patrimoniaux, fiscaux et familiaux. Un entretien préalable permet d'analyser votre situation et de comparer les implications de chaque option.</p>

  <InternalCTA />
</>
    </>
  );
}

/* ── Article 27 ─────────────────────────────────────────────────────────── */

function Article27() {
  return (
    <>
      <>
<p className="lead">La <strong>servitude de passage notaire</strong> est un droit réel immobilier qui permet au propriétaire d'un terrain enclavé d'accéder à la voie publique en traversant le fonds voisin. Son établissement, sa modification ou sa suppression nécessitent l'intervention d'un notaire pour garantir sa validité juridique et son opposabilité aux tiers.</p>

<KeyPoints points={[
  "La servitude de passage est régie par les articles 682 à 685-1 du Code civil",
  "L'acte notarié est obligatoire pour les servitudes conventionnelles",
  "La publication au service de la publicité foncière la rend opposable aux tiers",
  "Le notaire vérifie l'enclavement et négocie l'indemnité éventuelle",
  "Les frais oscillent entre 800 et 2 000 € selon la complexité du dossier"
]} />

<h2>Qu'est-ce qu'une servitude de passage ?</h2>
<p>La servitude de passage est une charge imposée à un fonds (le fonds servant) au profit d'un autre fonds (le fonds dominant). Elle permet au propriétaire du terrain enclavé de circuler sur la propriété voisine pour rejoindre la voie publique.</p>

<p>On distingue trois types de servitudes de passage :</p>
<ul>
  <li><strong>La servitude légale</strong> : imposée par la loi en cas d'enclavement total (article 682 du Code civil)</li>
  <li><strong>La servitude conventionnelle</strong> : créée par accord entre les propriétaires, même sans enclavement</li>
  <li><strong>La servitude par destination du père de famille</strong> : résultant d'une division d'un fonds initialement unique</li>
</ul>

<p>Dans tous les cas, le recours à un notaire est fortement recommandé, voire obligatoire, pour formaliser le droit et le rendre opposable aux futurs propriétaires.</p>

<h2>Le rôle du notaire dans l'établissement d'une servitude de passage</h2>
<p>Le notaire intervient à plusieurs niveaux pour sécuriser la création d'une servitude de passage :</p>

<h3>Vérification préalable</h3>
<p>Avant la rédaction de l'acte, le notaire procède à plusieurs vérifications essentielles : analyse du titre de propriété des deux fonds, consultation du cadastre, examen du plan local d'urbanisme et vérification de l'existence d'un véritable enclavement le cas échéant.</p>

<h3>Rédaction de l'acte authentique</h3>
<p>Le notaire rédige l'acte de servitude en précisant : l'identification précise des fonds servant et dominant, l'assiette exacte du passage (tracé, largeur, longueur), les modalités d'usage (piéton, véhicule, engins agricoles), l'indemnité éventuelle versée au propriétaire du fonds servant, ainsi que les obligations d'entretien.</p>

<h3>Publication foncière</h3>
<p>Une fois signé, l'acte est publié au service de la publicité foncière. Cette formalité est cruciale : elle rend la servitude opposable aux tiers, notamment aux futurs acquéreurs des deux propriétés.</p>

<InternalCTA />

<h2>Les modalités pratiques et le coût</h2>
<p>L'établissement d'une servitude de passage chez le notaire suit plusieurs étapes. Tout commence par un rendez-vous au cours duquel les parties exposent leur situation. Le notaire analyse la faisabilité juridique et propose une rédaction adaptée.</p>

<p>Les frais à prévoir comprennent :</p>
<ul>
  <li><strong>Les émoluments du notaire</strong> : proportionnels à la valeur de la servitude ou forfaitaires</li>
  <li><strong>Les droits d'enregistrement</strong> : généralement de 125 € pour un acte de servitude</li>
  <li><strong>Les frais de publication foncière</strong> : environ 0,10 % de la valeur</li>
  <li><strong>L'indemnité au propriétaire du fonds servant</strong> : variable selon la gêne occasionnée</li>
</ul>

<p>En cas d'enclavement, l'indemnité est obligatoire et calculée en fonction du préjudice subi : perte de surface utile, dépréciation du bien, nuisances liées au passage. À l'inverse, une servitude conventionnelle peut être gratuite si les parties en conviennent.</p>

<h2>Modifier ou supprimer une servitude de passage</h2>
<p>Une servitude de passage n'est pas figée dans le temps. Plusieurs situations peuvent justifier sa modification ou son extinction.</p>

<p><strong>La modification</strong> peut intervenir pour déplacer l'assiette du passage, élargir ou restreindre son usage. Elle nécessite l'accord des deux propriétaires et un nouvel acte notarié, lui-même publié au service de la publicité foncière.</p>

<p><strong>L'extinction</strong> peut résulter de plusieurs causes : la réunion des deux fonds dans le patrimoine d'un même propriétaire, le non-usage pendant 30 ans, la cessation de l'état d'enclavement (création d'une nouvelle voie publique par exemple) ou un accord amiable entre les parties.</p>

<p>Dans tous les cas, le passage devant notaire reste indispensable pour officialiser ces changements et mettre à jour la situation juridique des biens concernés.</p>

<h2>Conseils pratiques pour éviter les litiges</h2>
<p>Les conflits liés aux servitudes de passage sont fréquents. Pour les prévenir, plusieurs précautions s'imposent. Faites établir un plan précis annexé à l'acte notarié, idéalement par un géomètre-expert. Définissez clairement les usages autorisés (véhicules légers uniquement, engins agricoles, piétons) et les horaires éventuels.</p>

<p>Précisez les obligations d'entretien : qui finance la réfection du chemin, le déneigement, l'élagage ? Anticipez également les évolutions futures : que se passe-t-il en cas de division parcellaire, de construction nouvelle, de changement d'activité ?</p>

<p>Un acte notarié bien rédigé constitue votre meilleure protection juridique. N'hésitez pas à consulter un notaire dès les premières discussions avec votre voisin.</p>

<InternalCTA />
</>
    </>
  );
}

/* ── Article 28 ─────────────────────────────────────────────────────────── */

function Article28() {
  return (
    <>
      <>
  <p className="lead">La <strong>promesse de vente unilatérale notaire</strong> est un avant-contrat immobilier par lequel le vendeur s'engage seul à vendre son bien à un acquéreur potentiel, qui dispose d'une option d'achat pendant une durée déterminée. Cet acte, souvent rédigé par un notaire, sécurise la transaction tout en laissant à l'acheteur le temps de finaliser son projet.</p>

  <KeyPoints points={[
    "La promesse unilatérale engage uniquement le vendeur, l'acheteur dispose d'une option",
    "L'acquéreur verse une indemnité d'immobilisation (5 à 10 % du prix)",
    "La rédaction par notaire offre une sécurité juridique maximale",
    "Délai de rétractation légal de 10 jours pour l'acquéreur particulier",
    "Enregistrement obligatoire dans les 10 jours auprès des impôts"
  ]} />

  <h2>Qu'est-ce qu'une promesse de vente unilatérale ?</h2>
  <p>La promesse unilatérale de vente, parfois appelée "option d'achat", est un contrat par lequel un propriétaire (le promettant) s'engage à vendre son bien immobilier à un bénéficiaire désigné, à un prix fixé, pendant un délai déterminé. Contrairement au compromis de vente, l'acheteur n'est pas tenu d'acquérir le bien : il dispose simplement d'une faculté de l'acheter, qu'il peut lever ou non.</p>
  <p>Cet avant-contrat est particulièrement utile lorsque l'acquéreur souhaite se donner le temps de la réflexion, d'obtenir un financement ou de vérifier certains éléments du bien (urbanisme, servitudes, diagnostics) avant de s'engager définitivement.</p>
  <p>En contrepartie de l'immobilisation du bien, l'acheteur verse une <strong>indemnité d'immobilisation</strong>, généralement comprise entre 5 % et 10 % du prix de vente. Cette somme est conservée par le notaire jusqu'à la levée d'option ou son abandon.</p>

  <h2>Pourquoi faire rédiger sa promesse unilatérale par un notaire ?</h2>
  <p>Bien que la promesse unilatérale puisse être rédigée sous seing privé, l'intervention d'un notaire présente plusieurs avantages déterminants :</p>
  <ul>
    <li><strong>Sécurité juridique</strong> : le notaire vérifie la situation du bien, son urbanisme, l'absence de servitudes cachées et la capacité juridique des parties.</li>
    <li><strong>Force exécutoire</strong> : l'acte authentique a la même valeur qu'un jugement, ce qui facilite son exécution forcée en cas de litige.</li>
    <li><strong>Conseil personnalisé</strong> : le notaire rédige des clauses sur-mesure (conditions suspensives, modalités de financement, état du bien).</li>
    <li><strong>Enregistrement automatique</strong> : le notaire se charge de toutes les formalités fiscales et administratives.</li>
  </ul>
  <p>Par ailleurs, la promesse unilatérale supérieure à 18 mois doit obligatoirement être conclue par acte authentique notarié, sous peine de nullité (article L. 290-1 du Code de la construction).</p>

  <h2>Le fonctionnement de l'indemnité d'immobilisation</h2>
  <p>L'indemnité d'immobilisation est la contrepartie financière de l'engagement du vendeur. Son sort dépend de la suite donnée à la promesse :</p>
  <ul>
    <li>Si l'acquéreur <strong>lève l'option</strong> et achète le bien, l'indemnité s'impute sur le prix de vente.</li>
    <li>Si l'acquéreur <strong>renonce</strong> sans motif légitime à l'expiration du délai, l'indemnité reste acquise au vendeur à titre de dédommagement.</li>
    <li>Si une <strong>condition suspensive</strong> ne se réalise pas (refus de prêt, droit de préemption exercé), l'indemnité est restituée à l'acheteur.</li>
    <li>En cas de <strong>rétractation</strong> dans les 10 jours (acquéreur particulier), l'indemnité est intégralement remboursée.</li>
  </ul>
  <p>Cette somme est en principe consignée chez le notaire, garantissant ainsi la neutralité et la sécurité des fonds pendant toute la durée de la promesse.</p>

  <h2>Délais, formalités et coûts à prévoir</h2>
  <p>La promesse unilatérale doit être <strong>enregistrée auprès de l'administration fiscale dans les 10 jours</strong> suivant sa signature, sous peine de nullité. Cette formalité est systématiquement assurée par le notaire lorsqu'il rédige l'acte.</p>
  <p>La durée d'option est librement fixée entre les parties, généralement entre 2 et 4 mois, le temps pour l'acquéreur d'obtenir son financement et de réaliser les vérifications nécessaires.</p>
  <p>Côté budget, prévoyez :</p>
  <ul>
    <li>Les <strong>frais de rédaction</strong> du notaire : entre 250 et 500 € en moyenne</li>
    <li>Les <strong>droits d'enregistrement</strong> : 125 € forfaitaires</li>
    <li>Ces frais sont traditionnellement à la charge de l'acquéreur, sauf accord contraire</li>
  </ul>
  <p>À la levée d'option, l'acte authentique de vente sera signé dans un délai de 2 à 3 mois, et les frais de notaire classiques (7 à 8 % dans l'ancien) s'appliqueront.</p>

  <InternalCTA />
</>
    </>
  );
}

/* ── Article 29 ─────────────────────────────────────────────────────────── */

function Article29() {
  return (
    <>
      <>
  <p className="lead">Les <strong>frais de notaire achat neuf VEFA</strong> (Vente en l'État Futur d'Achèvement) bénéficient d'un régime fiscal avantageux : ils s'élèvent à seulement 2 à 3% du prix du bien, contre 7 à 8% dans l'ancien. Cette réduction représente une économie substantielle pour les acquéreurs d'un logement neuf, mais leur calcul reste complexe et mérite d'être bien compris avant de signer.</p>

  <KeyPoints points={[
    "Frais de notaire réduits : 2 à 3% du prix d'achat en VEFA",
    "Composés d'émoluments, droits d'enregistrement et débours",
    "Payés intégralement à la signature de l'acte authentique",
    "TVA à 20% incluse dans le prix mais hors assiette de calcul"
  ]} />

  <h2>Pourquoi les frais de notaire sont-ils réduits en VEFA ?</h2>
  <p>L'achat d'un logement neuf en VEFA bénéficie de frais de notaire réduits car les <strong>droits de mutation</strong> sont allégés. Dans l'ancien, ces droits représentent environ 5,80% du prix de vente et constituent la majeure partie des frais de notaire. En VEFA, ils sont remplacés par une taxe de publicité foncière limitée à 0,715%.</p>
  <p>Cette différence s'explique par le fait que la TVA à 20% est déjà perçue par l'État sur le prix de vente du logement neuf. Pour éviter une double imposition, le législateur a instauré ce régime fiscal favorable. Concrètement, sur un appartement neuf à 300 000 €, vous économiserez environ 15 000 € de frais de notaire par rapport à un bien ancien équivalent.</p>

  <h2>Composition détaillée des frais de notaire en VEFA</h2>
  <p>Les <strong>frais de notaire achat neuf VEFA</strong> se décomposent en quatre éléments principaux :</p>
  <ul>
    <li><strong>Les émoluments du notaire</strong> (environ 1% HT) : rémunération réglementée calculée selon un barème dégressif fixé par décret.</li>
    <li><strong>Les droits d'enregistrement et taxe de publicité foncière</strong> (0,715%) : versés à l'État et aux collectivités locales.</li>
    <li><strong>La contribution de sécurité immobilière</strong> (0,10%) : finance les services de publicité foncière.</li>
    <li><strong>Les débours et frais divers</strong> (quelques centaines d'euros) : avances faites par le notaire pour obtenir des documents administratifs.</li>
  </ul>
  <p>Pour un bien neuf à 250 000 €, comptez environ 5 500 à 7 500 € de frais de notaire, soit 2,2 à 3% du prix.</p>

  <h2>Exemples de calcul concrets pour votre achat VEFA</h2>
  <p>Voici trois exemples chiffrés pour vous aider à estimer vos <strong>frais de notaire en VEFA</strong> :</p>
  <ul>
    <li><strong>Studio à 150 000 €</strong> : frais de notaire d'environ 4 500 € (3%)</li>
    <li><strong>Appartement T3 à 300 000 €</strong> : frais de notaire d'environ 7 800 € (2,6%)</li>
    <li><strong>Maison neuve à 500 000 €</strong> : frais de notaire d'environ 12 500 € (2,5%)</li>
  </ul>
  <p>Plus le prix du bien augmente, plus le pourcentage des frais diminue grâce à la dégressivité des émoluments. Notez également que les frais de garantie hypothécaire (PPD ou hypothèque) liés à votre prêt immobilier viennent s'ajouter à ces frais.</p>

  <h2>Comment optimiser les frais de notaire en VEFA ?</h2>
  <p>Plusieurs leviers permettent de réduire la facture finale :</p>
  <ul>
    <li><strong>Négocier les meubles et équipements</strong> : la valeur du mobilier (cuisine équipée, placards) peut être déduite de l'assiette de calcul si elle est mentionnée séparément.</li>
    <li><strong>Bénéficier de la remise notariale</strong> : depuis 2021, les notaires peuvent accorder jusqu'à 20% de remise sur leurs émoluments pour les biens de plus de 100 000 €.</li>
    <li><strong>Vérifier l'éligibilité au PTZ</strong> : le prêt à taux zéro peut financer une partie des frais annexes.</li>
    <li><strong>Comparer les offres de garantie</strong> : la caution mutuelle est souvent moins coûteuse que l'hypothèque.</li>
  </ul>
  <p>Un notaire expérimenté saura vous conseiller sur les meilleures options selon votre situation patrimoniale et le projet immobilier envisagé.</p>

  <InternalCTA />
</>
    </>
  );
}

/* ── Article 30 ─────────────────────────────────────────────────────────── */

function Article30() {
  return (
    <>
      <KeyPoints
        points={[
          "Le droit de préemption urbain (DPU) permet à une commune d'acheter un bien avant tout acheteur privé dans les zones définies par le PLU.",
          "Le vendeur doit déposer une déclaration d'intention d'aliéner (DIA) en mairie avant tout compromis définitif.",
          "La commune dispose de 2 mois pour répondre ; son silence vaut renonciation.",
          "Le notaire rédige la DIA, vérifie la légalité de la préemption et accompagne le vendeur en cas de contestation.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qu'est-ce que le droit de préemption urbain ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le <strong className="text-[var(--color-text-strong)]">droit de préemption urbain</strong> (DPU) est une prérogative accordée aux communes par le Code de l'urbanisme (articles L 211-1 et suivants). Il permet à la collectivité locale de se substituer à tout acquéreur potentiel et d'acheter en priorité un bien immobilier mis en vente, à des fins d'intérêt général : création d'équipements publics, lutte contre l'insalubrité, construction de logements sociaux, aménagement urbain.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Ce droit ne s'applique pas partout. La commune doit avoir institué le DPU par délibération municipale, dans les zones définies par le Plan Local d'Urbanisme (PLU). Un bien situé hors zone DPU est libre de toute préemption communale. La première étape pour un vendeur est donc de vérifier auprès de sa mairie ou via son notaire si le bien est soumis au DPU.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Il existe également des droits de préemption spécifiques : le droit de préemption dans les espaces naturels sensibles (pour les départements), le droit de préemption commercial (sur les fonds de commerce), et le droit de préemption renforcé dans certains périmètres de sauvegarde. Le notaire identifie lequel s'applique à votre situation.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La déclaration d'intention d'aliéner (DIA)</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Dès lors qu'un bien est situé en zone DPU, le vendeur a l'obligation de déposer une <strong className="text-[var(--color-text-strong)]">déclaration d'intention d'aliéner (DIA)</strong> en mairie avant de signer tout avant-contrat définitif avec un acheteur privé. Cette déclaration est rédigée par le notaire sur un formulaire réglementaire (Cerfa n° 10072).
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La DIA doit mentionner avec précision : l'identité du vendeur, la description du bien (adresse, superficie, références cadastrales), le prix et les conditions de la vente envisagée, ainsi que l'identité de l'acquéreur pressenti si elle est connue. Toute omission ou inexactitude peut entraîner la nullité de la vente ou exposer le vendeur à des sanctions.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        La DIA est transmise en mairie par lettre recommandée avec accusé de réception, ou par voie dématérialisée dans les communes équipées. La date de réception fait courir le délai de réponse de la commune.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le délai et la procédure de réponse de la mairie</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        À compter de la réception de la DIA, la commune dispose d'un délai de <strong className="text-[var(--color-text-strong)]">2 mois</strong> pour exercer son droit de préemption ou y renoncer. Pendant ce délai, la vente à l'acheteur privé est suspendue. Passé ce délai sans réponse, la commune est réputée avoir renoncé et la vente peut se poursuivre normalement.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Si la commune souhaite préempter, elle doit notifier sa décision au vendeur par écrit. Elle peut proposer d'acquérir le bien au prix indiqué dans la DIA, ou à un prix différent qu'elle estime plus conforme à la valeur vénale. En cas de désaccord sur le prix, le tribunal judiciaire compétent (anciennement tribunal de grande instance) peut être saisi pour fixer la valeur.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Le vendeur a alors le choix : accepter le prix proposé par la commune, saisir le juge pour contester la valorisation, ou renoncer à vendre. Cette dernière option est toujours possible : la préemption ne peut forcer un vendeur à vendre à un prix qu'il estime insuffisant.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Rôle du notaire et recours possibles</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le notaire joue un rôle central dans la procédure de préemption. Il rédige et transmet la DIA, s'assure de la régularité formelle de la démarche, et informe l'acheteur privé de la suspension temporaire de la vente. En cas d'exercice du droit de préemption par la commune, il accompagne le vendeur dans la négociation du prix ou dans la procédure judiciaire si nécessaire.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La légalité d'une décision de préemption peut être contestée devant le tribunal administratif dans un délai de 2 mois suivant la notification. Les motifs de recours les plus fréquents sont l'absence de motivation suffisante, le détournement de pouvoir (la commune préempte sans réel projet d'intérêt général), ou la violation des règles de procédure. Un recours fructueux peut annuler la préemption et permettre la vente à l'acheteur initial.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        À noter : si la commune, après avoir préempté, revend le bien dans les 5 ans sans réaliser l'opération d'intérêt général mentionnée, le vendeur initial dispose d'un <strong className="text-[var(--color-text-strong)]">droit de rétrocession</strong> : il peut racheter son bien au prix de vente initial, revalorisé.
      </p>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Pour sécuriser votre projet de vente et anticiper d'éventuelles procédures de préemption, consultez un notaire spécialisé en droit immobilier via Notaires.io dès la mise en vente de votre bien.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Article 31 ─────────────────────────────────────────────────────────── */

function Article31() {
  return (
    <>
      <KeyPoints
        points={[
          "La main levée d'hypothèque est nécessaire pour vendre un bien avant l'extinction automatique de l'hypothèque (1 an après la fin du prêt).",
          "Les frais de main levée représentent entre 0,7 % et 1,5 % du capital initialement garanti.",
          "L'acte de main levée est établi par un notaire et publié au service de la publicité foncière.",
          "Une alternative moins coûteuse existe : le privilège de prêteur de deniers (PPD), qui s'éteint automatiquement sans frais supplémentaires.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qu'est-ce qu'une hypothèque et pourquoi la lever ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Lorsque vous contractez un prêt immobilier, votre banque exige généralement une <strong className="text-[var(--color-text-strong)]">garantie réelle</strong> sur le bien financé. L'hypothèque conventionnelle est l'une d'elles : elle confère à l'établissement prêteur un droit sur votre immeuble, qui peut le faire vendre aux enchères si vous ne remboursez pas. Cette garantie est publiée au service de la publicité foncière (ex-conservation des hypothèques) et est donc visible par tout acquéreur potentiel.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Après le remboursement intégral de votre crédit, l'hypothèque ne disparaît pas immédiatement. En droit français, elle s'éteint automatiquement <strong className="text-[var(--color-text-strong)]">1 an après le terme du prêt</strong>, sans aucune formalité. Si vous souhaitez vendre votre bien avant ce délai, ou si une hypothèque obsolète figure encore sur vos registres, vous devez procéder à une <strong className="text-[var(--color-text-strong)]">main levée anticipée</strong>.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        La main levée est un acte notarié par lequel la banque constate officiellement l'extinction de sa garantie hypothécaire et autorise la radiation de l'inscription au registre de la publicité foncière. Sans cet acte, aucun acquéreur sérieux n'acceptera d'acheter le bien, et aucun notaire ne pourra procéder à la vente en toute sécurité.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La procédure de main levée étape par étape</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La procédure commence par la <strong className="text-[var(--color-text-strong)]">demande de main levée auprès de votre banque</strong>. Celle-ci doit attester par écrit qu'elle consent à lever l'hypothèque, généralement après remboursement complet du capital restant dû. Dans le cadre d'une vente immobilière, ce remboursement anticipé s'effectue le jour de la signature de l'acte authentique chez le notaire.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le notaire rédige ensuite l'<strong className="text-[var(--color-text-strong)]">acte de main levée</strong>, qui reprend les références de l'inscription hypothécaire initiale (date, volume, numéro), le montant garanti et la déclaration de consentement de la banque. Cet acte est signé par un représentant habilité de l'établissement prêteur, puis transmis au service de la publicité foncière pour publication.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        La publication au service de la publicité foncière entraîne la <strong className="text-[var(--color-text-strong)]">radiation de l'inscription</strong> hypothécaire des registres officiels. Le bien est alors libre de toute charge hypothécaire et peut être cédé sans restriction. Le délai total, de la demande à la radiation effective, est généralement de 2 à 4 semaines.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le coût de la main levée</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les frais de main levée se décomposent en plusieurs éléments :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6">
        {[
          ["Émoluments du notaire", "Calculés selon un barème dégressif sur le capital garanti, généralement entre 0,5 % et 0,8 % du montant de l'hypothèque initiale."],
          ["Taxe de publicité foncière", "0,05 % du capital garanti, perçue par l'État lors de la publication de l'acte."],
          ["Débours", "Frais de dossier, copies authentiques, frais d'envoi : entre 50 et 150 € selon la complexité."],
          ["TVA", "Applicable aux émoluments du notaire au taux de 20 %."],
        ].map(([item, desc], i) => (
          <li key={i} className="flex gap-3 p-4 bg-[var(--color-tint-blue)] rounded-xl text-sm">
            <span className="shrink-0 font-bold text-[var(--color-accent)]">→</span>
            <div>
              <strong className="text-[var(--color-text-strong)] block mb-0.5">{item}</strong>
              <span className="text-[var(--color-muted)]">{desc}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Pour un prêt immobilier de 200 000 €, les frais de main levée se situent généralement entre 500 € et 900 € TTC. Dans la grande majorité des ventes immobilières, ces frais sont prélevés sur le prix de vente le jour de la signature, avant reversement du solde au vendeur.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Alternatives à l'hypothèque</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Pour les acquisitions dans l'immobilier ancien, le <strong className="text-[var(--color-text-strong)]">privilège de prêteur de deniers (PPD)</strong> est souvent préféré à l'hypothèque. Il offre une garantie équivalente mais présente deux avantages majeurs : il est moins coûteux à la mise en place (pas de taxe de publicité foncière de 0,715 %), et il s'éteint automatiquement à l'expiration du prêt sans nécessiter d'acte de main levée spécifique.
      </p>
      <p className="text-[var(--color-muted)] leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">caution mutuelle</strong> (Crédit Logement, CAMCA, etc.) est une autre alternative : une société se porte caution pour vous auprès de la banque. Elle est souvent moins coûteuse globalement et ne génère aucun frais de main levée. Le notaire peut vous conseiller sur la garantie la plus adaptée à votre profil d'emprunteur et à votre projet.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Article 32 ─────────────────────────────────────────────────────────── */

function Article32() {
  return (
    <>
      <KeyPoints
        points={[
          "La cession de parts sociales de SCI doit respecter la clause d'agrément prévue dans les statuts avant tout transfert.",
          "L'acte peut être rédigé sous seing privé, mais un acte notarié est recommandé si la SCI détient des biens immobiliers.",
          "La plus-value de cession est imposable selon le régime immobilier (SCI à l'IR) ou mobilier (SCI à l'IS).",
          "L'enregistrement fiscal de l'acte de cession est obligatoire dans le mois suivant la signature.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Pourquoi céder des parts de SCI ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">cession de parts sociales de SCI</strong> intervient dans de nombreuses situations : restructuration patrimoniale, entrée d'un nouvel associé, sortie d'un membre de la famille, transmission à titre onéreux dans le cadre d'une succession anticipée, ou encore cession à un tiers dans le cadre d'une vente indirecte d'immeuble. Contrairement à la vente directe d'un immeuble, la cession de parts sociales peut offrir des avantages fiscaux notables dans certains cas.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Il est important de distinguer la cession de parts de SCI de la vente du bien immobilier détenu par la SCI. Dans le premier cas, c'est la société elle-même qui reste propriétaire de l'immeuble, et seule la composition de l'actionnariat change. Cette subtilité a des conséquences importantes sur la fiscalité applicable et sur les formalités requises.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Le notaire est l'interlocuteur privilégié pour toute opération de cession de parts, notamment pour vérifier la conformité avec les statuts, calculer la fiscalité applicable et sécuriser la transaction par un acte authentique.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La procédure de cession : étapes clés</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La première étape est la <strong className="text-[var(--color-text-strong)]">consultation des statuts</strong>. La quasi-totalité des SCI familiales comportent une clause d'agrément qui impose l'accord préalable des associés pour toute cession à un tiers, et parfois même entre associés. Le cédant doit notifier son projet de cession aux autres associés (et au gérant) par lettre recommandée avec accusé de réception.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les associés disposent alors du délai prévu par les statuts (généralement 3 mois) pour délibérer et agréer ou refuser le cessionnaire. En cas de refus, ils sont tenus, selon les statuts, soit de racheter eux-mêmes les parts au prix proposé, soit de trouver un autre acquéreur agréé, soit de procéder au rachat par la société (avec réduction de capital).
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Une fois l'agrément obtenu, l'acte de cession est rédigé. Il peut prendre la forme d'un acte sous seing privé, mais le notaire est vivement recommandé. L'acte doit comporter le prix de cession, les références des parts cédées, les modalités de paiement et les représentations et garanties des parties.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        L'acte doit ensuite être <strong className="text-[var(--color-text-strong)]">enregistré auprès des services fiscaux</strong> dans le délai d'un mois suivant la signature. Le droit d'enregistrement est de 5 % du prix de cession (ou de la valeur vénale des parts si elle est supérieure). La mise à jour du registre des associés et le dépôt éventuel au greffe complètent la procédure.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La fiscalité de la cession de parts de SCI</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le régime fiscal applicable à la plus-value réalisée lors de la cession dépend du régime d'imposition de la SCI :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6">
        {[
          ["SCI à l'IR (régime général)", "La plus-value est taxée selon le régime des plus-values immobilières des particuliers : 19 % d'impôt sur le revenu + 17,2 % de prélèvements sociaux, avec des abattements pour durée de détention (exonération totale après 30 ans)."],
          ["SCI à l'IS", "La plus-value est intégrée au résultat de la société et taxée à l'IS (15 % ou 25 %). La distribution aux associés génère ensuite une imposition sur dividendes (30 % de flat tax ou barème progressif)."],
          ["Droit d'enregistrement", "À la charge de l'acquéreur : 5 % du prix de cession, quel que soit le régime fiscal de la SCI, avec un minimum de perception."],
        ].map(([item, desc], i) => (
          <li key={i} className="flex gap-3 p-4 bg-[var(--color-tint-blue)] rounded-xl text-sm">
            <span className="shrink-0 font-bold text-[var(--color-accent)]">→</span>
            <div>
              <strong className="text-[var(--color-text-strong)] block mb-0.5">{item}</strong>
              <span className="text-[var(--color-muted)]">{desc}</span>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle du notaire dans la cession</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le notaire sécurise l'ensemble de la transaction : il vérifie la conformité de la cession avec les statuts, s'assure de l'absence de nantissement sur les parts, calcule la plus-value taxable et les droits d'enregistrement, et rédige un acte authentique qui protège les deux parties. Si la SCI détient un bien immobilier, l'acte notarié permet également d'assurer la publicité foncière indirecte de l'opération.
      </p>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Pour toute cession de parts de SCI, prenez rendez-vous avec un notaire spécialisé en droit des sociétés immobilières via Notaires.io, afin de bénéficier d'un accompagnement personnalisé et d'éviter les pièges fiscaux et juridiques.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Article 33 ─────────────────────────────────────────────────────────── */

function Article33() {
  return (
    <>
      <KeyPoints
        points={[
          "La dissolution d'une SCI peut être volontaire (décision des associés) ou de plein droit (expiration de la durée, objet accompli, perte du capital).",
          "La procédure comprend dissolution, liquidation et radiation, avec publication légale à chaque étape.",
          "Si la SCI détient un bien immobilier à partager, un acte notarié est obligatoire pour la publicité foncière.",
          "Le droit de partage de 2,5 % s'applique sur l'actif net partagé entre les associés.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les causes de dissolution d'une SCI</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Une <strong className="text-[var(--color-text-strong)]">société civile immobilière (SCI)</strong> peut être dissoute pour plusieurs raisons prévues par les articles 1844-7 et suivants du Code civil. La dissolution volontaire, décidée par les associés en assemblée générale, est la cause la plus fréquente. Elle peut résulter d'un accord unanime ou d'une majorité qualifiée selon les statuts, notamment lorsque le projet immobilier qui justifiait la création de la SCI est achevé ou abandonné.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les causes de dissolution de plein droit comprennent l'arrivée du terme de la société (les SCI sont créées pour une durée maximale de 99 ans), la réalisation ou l'impossibilité de l'objet social, et la réunion de toutes les parts en une seule main pendant plus d'un an (car une société nécessite au moins deux associés). La dissolution judiciaire peut être prononcée par le tribunal en cas de mésentente grave entre associés paralysant le fonctionnement de la société.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Avant d'engager une procédure de dissolution, le notaire peut vous proposer des alternatives : restructuration de la SCI, rachat de parts, ou cession de l'immeuble par la société. Ces solutions évitent parfois les coûts et délais d'une dissolution complète.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La procédure de dissolution en 3 étapes</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        <strong className="text-[var(--color-text-strong)]">Étape 1 : La décision de dissolution.</strong> Les associés se réunissent en assemblée générale extraordinaire et votent la dissolution de la SCI. Un procès-verbal est rédigé, signé par tous les associés présents, et un liquidateur est désigné (souvent le gérant actuel). La décision doit être publiée dans un journal d'annonces légales du département du siège social.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        <strong className="text-[var(--color-text-strong)]">Étape 2 : La liquidation.</strong> Le liquidateur procède à la réalisation de l'actif (vente des biens immobiliers ou partage en nature entre associés) et au paiement des dettes. Si la SCI détient un immeuble, sa vente nécessite un acte authentique chez le notaire. Le partage en nature (attribution de l'immeuble à un associé) requiert également un acte notarié, obligatoire pour la publicité foncière.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        <strong className="text-[var(--color-text-strong)]">Étape 3 : La clôture de liquidation et la radiation.</strong> Une seconde assemblée générale approuve les comptes de liquidation et constate la clôture. Un nouveau procès-verbal est publié dans un journal d'annonces légales, puis la demande de radiation est déposée au greffe du tribunal de commerce ou du tribunal judiciaire selon le cas. La SCI est officiellement dissoute à compter de la radiation au Registre du Commerce et des Sociétés (RCS).
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La fiscalité de la dissolution</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La dissolution d'une SCI entraîne des conséquences fiscales à plusieurs niveaux. Si des plus-values sont réalisées lors de la cession ou du partage des actifs immobiliers, elles sont imposées selon le régime applicable à la SCI (plus-values immobilières pour une SCI à l'IR, impôt sur les sociétés pour une SCI à l'IS).
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le <strong className="text-[var(--color-text-strong)]">droit de partage</strong> de 2,5 % s'applique sur l'actif net partagé entre les associés (actif total moins les dettes). Pour une SCI détenant un immeuble de 500 000 € sans dette, le droit de partage représente 12 500 €. C'est un coût souvent sous-estimé lors de la planification d'une dissolution.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Les boni de liquidation (sommes distribuées aux associés au-delà de leurs apports initiaux) sont imposables comme des revenus de capitaux mobiliers, soumis au prélèvement forfaitaire unique (PFU) de 30 % ou, sur option, au barème progressif de l'impôt sur le revenu.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Rôle du notaire dans la dissolution</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le notaire intervient à plusieurs stades de la procédure. Il conseille les associés sur l'opportunité et le calendrier de la dissolution, rédige les actes nécessaires au partage ou à la cession des biens immobiliers, calcule les droits de partage et les éventuelles plus-values taxables, et coordonne les formalités de publicité foncière.
      </p>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Une dissolution bien préparée, accompagnée par un notaire dès l'origine, permet d'éviter les litiges entre associés et d'optimiser la fiscalité de l'opération. Contactez un notaire spécialisé via Notaires.io pour obtenir un bilan personnalisé avant d'engager la procédure.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Article 34 ─────────────────────────────────────────────────────────── */

function Article34() {
  return (
    <>
      <KeyPoints
        points={[
          "Vérifiez la constructibilité du terrain via le PLU et un certificat d'urbanisme avant tout engagement.",
          "Le notaire vérifie les servitudes, le bornage, les raccordements et les risques naturels ou technologiques.",
          "Les frais de notaire sur un terrain constructible sont identiques à ceux de l'immobilier ancien : 7 à 8 % du prix.",
          "Le compromis de vente peut comporter des conditions suspensives spécifiques : obtention du permis de construire, résultats du géotechnique.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment vérifier la constructibilité d'un terrain ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Avant tout achat de terrain, la première démarche est de consulter le <strong className="text-[var(--color-text-strong)]">Plan Local d'Urbanisme (PLU)</strong> de la commune concernée. Ce document, disponible en mairie ou sur le géoportail de l'urbanisme, définit le zonage de chaque parcelle : zone U (urbaine, constructible), AU (à urbaniser), N (naturelle, inconstructible) ou A (agricole, inconstructible en général). Un terrain en zone U n'est pas nécessairement constructible dans toutes ses parties : des reculs, gabarits ou densités maximaux s'appliquent.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La démarche la plus sûre est de demander un <strong className="text-[var(--color-text-strong)]">certificat d'urbanisme opérationnel (CUb)</strong> en mairie avant de signer tout avant-contrat. Ce document, délivré dans un délai de 2 mois, indique avec précision si le terrain est constructible pour votre projet, les règles applicables, et l'état des équipements publics (voirie, eau, électricité, assainissement) desservant la parcelle. Sa validité est de 18 mois, prorogeable.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Le notaire peut vous accompagner dans la lecture et l'interprétation du PLU et du certificat d'urbanisme, et vous alerter sur d'éventuelles contraintes réglementaires qui pourraient compromettre votre projet de construction.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les vérifications essentielles avant l'achat</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Au-delà de la constructibilité, plusieurs points doivent être vérifiés avant de s'engager :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6">
        {[
          ["Le bornage", "Un terrain non borné comporte des risques de litiges avec les voisins sur les limites de propriété. Le notaire peut exiger un bornage contradictoire effectué par un géomètre-expert avant la signature."],
          ["Les servitudes", "Des servitudes de passage, de vue ou de réseaux peuvent grever le terrain et limiter votre usage. Le notaire les identifie dans les actes et au service de la publicité foncière."],
          ["Les risques", "Le plan de prévention des risques naturels (PPRn) et technologiques (PPRt) peut interdire ou encadrer la construction dans certaines zones (inondation, glissement de terrain, séisme, radon)."],
          ["L'étude géotechnique", "Une étude de sol (type G1 ou G2) est fortement recommandée, voire obligatoire pour certaines zones argileuses, afin d'adapter les fondations et d'éviter les désordres structurels."],
        ].map(([item, desc], i) => (
          <li key={i} className="flex gap-3 p-4 bg-[var(--color-tint-blue)] rounded-xl text-sm">
            <span className="shrink-0 font-bold text-[var(--color-accent)]">→</span>
            <div>
              <strong className="text-[var(--color-text-strong)] block mb-0.5">{item}</strong>
              <span className="text-[var(--color-muted)]">{desc}</span>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le compromis de vente d'un terrain</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le <strong className="text-[var(--color-text-strong)]">compromis de vente d'un terrain à bâtir</strong> présente des spécificités par rapport à un bien bâti. Il comporte souvent des conditions suspensives supplémentaires adaptées au projet de construction : obtention d'un permis de construire conforme aux plans du futur propriétaire, résultats satisfaisants de l'étude géotechnique, absence de servitudes rédhibitoires, et confirmation du raccordement aux réseaux.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Ces conditions protègent l'acheteur : si le permis de construire est refusé ou si l'étude de sol révèle des contraintes incompatibles avec le projet, l'acheteur peut se rétracter sans pénalité et récupérer son dépôt de garantie. La rédaction de ces clauses suspensives par un notaire est donc cruciale pour protéger les intérêts de l'acquéreur.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Pour les terrains issus d'un lotissement, le vendeur (lotisseur) est tenu de fournir un certain nombre de documents obligatoires : règlement de lotissement, cahier des charges, plan de masse, état des équipements collectifs. Le notaire vérifie la conformité de ces pièces avant la signature.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les frais de notaire sur un terrain constructible</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les frais de notaire pour l'acquisition d'un terrain constructible sont calculés de la même manière que pour un bien immobilier ancien : entre <strong className="text-[var(--color-text-strong)]">7 et 8 % du prix d'achat</strong>. Ils comprennent les droits de mutation (5,80 % perçus par l'État et les collectivités), les émoluments réglementés du notaire, la taxe de publicité foncière et les débours.
      </p>
      <p className="text-[var(--color-muted)] leading-relaxed">
        À noter : si vous achetez un terrain à un promoteur ou à un aménageur assujetti à la TVA, la vente est soumise à la TVA immobilière (20 %) et les droits de mutation sont réduits à 0,715 %. Cette situation, plus rare pour les particuliers, mérite d'être vérifiée avec le notaire pour optimiser la fiscalité de l'acquisition.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Article 35 ─────────────────────────────────────────────────────────── */

function Article35() {
  return (
    <>
      <KeyPoints
        points={[
          "La VEFA (vente en l'état futur d'achèvement) est encadrée par des garanties légales obligatoires protégeant l'acheteur.",
          "La garantie financière d'achèvement (GFA) assure la livraison du programme même en cas de défaillance du promoteur.",
          "Les garanties après livraison couvrent les défauts pendant 1 an (parfait achèvement), 2 ans (biennale) et 10 ans (décennale).",
          "Le notaire vérifie la présence et la validité de toutes les garanties avant la signature de l'acte authentique.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qu'est-ce que la VEFA ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">vente en l'état futur d'achèvement (VEFA)</strong>, communément appelée "achat sur plan", est le contrat par lequel un promoteur s'engage à livrer un logement neuf à un acheteur à une date future, en échange d'un paiement échelonné au fur et à mesure de l'avancement des travaux. Ce régime, régi par les articles 1601-1 à 1601-4 du Code civil et L. 261-1 et suivants du Code de la construction, offre un cadre légal très protecteur pour l'acquéreur.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        L'acheteur en VEFA bénéficie d'un calendrier de paiement réglementé par décret : 35 % à l'achèvement des fondations, 70 % hors d'eau, 95 % à l'achèvement et 5 % à la remise des clés. Ces pourcentages sont des maximums légaux ; le promoteur ne peut pas les dépasser. En pratique, si des réserves sont émises à la livraison, l'acheteur peut consigner le solde de 5 % jusqu'à leur levée.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Le notaire intervient à deux moments clés : lors de la signature du <strong className="text-[var(--color-text-strong)]">contrat de réservation préliminaire</strong> (conseil et relecture), et lors de la signature de <strong className="text-[var(--color-text-strong)]">l'acte authentique de vente</strong>, qui officialise le transfert de propriété du terrain et des fondations.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La garantie financière d'achèvement (GFA)</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">garantie financière d'achèvement (GFA)</strong> est la garantie la plus importante en VEFA. Obligatoire depuis la loi du 3 janvier 1967, elle engage un établissement financier (banque ou assureur) à financer l'achèvement de la construction si le promoteur se retrouve dans l'impossibilité de l'assumer (faillite, difficultés financières). Sans cette garantie, le promoteur ne peut légalement commercialiser son programme.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Il existe deux formes de GFA : la garantie intrinsèque (fonds propres suffisants du promoteur, très rare aujourd'hui) et la garantie extrinsèque (engagement d'un garant externe, la plus courante). L'attestation de la GFA doit être annexée à l'acte authentique de vente. Le notaire vérifie systématiquement sa présence et sa validité avant la signature.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        En cas de défaillance du promoteur, le garant prend en charge le financement de l'achèvement du programme ou, dans certains cas, rembourse les acquéreurs des sommes versées. Cette garantie est un filet de sécurité essentiel pour tout acheteur en VEFA.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les garanties après livraison</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Une fois le logement livré, trois garanties légales successives protègent l'acquéreur contre les malfaçons et désordres :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6">
        {[
          ["Garantie de parfait achèvement (1 an)", "Le promoteur est tenu de réparer tous les désordres signalés par l'acquéreur dans le procès-verbal de livraison ou notifiés dans l'année suivante, quelle que soit leur nature ou leur importance."],
          ["Garantie biennale (2 ans)", "Elle couvre les éléments d'équipement dissociables de la construction (volets, robinetterie, chaudière, climatisation) qui présentent un défaut de fonctionnement dans les 2 ans suivant la réception."],
          ["Garantie décennale (10 ans)", "Elle protège contre les désordres graves qui compromettent la solidité de l'ouvrage ou le rendent impropre à sa destination (fissures structurelles, infiltrations, problèmes de fondations) pendant 10 ans."],
        ].map(([item, desc], i) => (
          <li key={i} className="flex gap-3 p-4 bg-[var(--color-tint-blue)] rounded-xl text-sm">
            <span className="shrink-0 font-bold text-[var(--color-accent)]">→</span>
            <div>
              <strong className="text-[var(--color-text-strong)] block mb-0.5">{item}</strong>
              <span className="text-[var(--color-muted)]">{desc}</span>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle du notaire en VEFA</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le notaire examine attentivement l'ensemble des documents annexés au contrat : attestation de la GFA, police d'assurance dommages-ouvrage (obligatoire pour le promoteur), descriptif technique détaillé (DTD), plan de masse et plan du bien vendu. Il s'assure que le programme est régulièrement autorisé (permis de construire obtenu et purgé de tout recours), et que les clauses du contrat respectent le cadre légal protecteur de la VEFA.
      </p>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Avant de signer tout contrat de réservation, il est vivement conseillé de consulter un notaire pour analyser les documents précontractuels et vérifier la solidité du promoteur. Cette démarche, prise en charge dans le premier rendez-vous gratuit proposé par Notaires.io, peut vous éviter de nombreuses déconvenues.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Article 36 ─────────────────────────────────────────────────────────── */

function Article36() {
  return (
    <>
      <KeyPoints
        points={[
          "La donation d'un bien immobilier est un acte notarié obligatoire, à peine de nullité absolue.",
          "L'abattement fiscal est de 100 000 € par parent et par enfant, renouvelable tous les 15 ans.",
          "La donation en nue-propriété réduit considérablement la base taxable en conservant l'usufruit jusqu'au décès.",
          "La donation-partage gèle la valeur des biens au jour de la donation et évite les conflits entre héritiers lors de la succession.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Pourquoi donner un bien immobilier de son vivant ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">donation immobilière</strong> est l'un des outils de transmission patrimoniale les plus efficaces sur le plan fiscal. Donner un bien immobilier de son vivant plutôt que de le laisser à sa succession permet de bénéficier des abattements légaux et de réduire la base taxable, notamment lorsque le bien est susceptible de prendre de la valeur avec le temps. En transmettant tôt, vous figez la valeur du bien et protégez vos enfants d'une fiscalité successorale plus lourde.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La donation immobilière peut également répondre à des objectifs familiaux : aider un enfant à acquérir sa résidence principale, transmettre un bien locatif pour assurer un revenu à un héritier, ou organiser équitablement la transmission entre plusieurs enfants via une donation-partage. Dans tous les cas, l'intervention d'un notaire est obligatoire.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Contrairement aux idées reçues, donner un bien immobilier ne vous oblige pas à vous en dessaisir totalement. La <strong className="text-[var(--color-text-strong)]">donation avec réserve d'usufruit</strong> vous permet de continuer à l'habiter ou à percevoir les loyers jusqu'à votre décès, tout en transmettant la nue-propriété à vos enfants à un coût fiscal réduit.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La fiscalité de la donation immobilière</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les droits de donation sont calculés sur la <strong className="text-[var(--color-text-strong)]">valeur vénale du bien au jour de la donation</strong>, après application des abattements légaux. Entre parents et enfants, l'abattement est de 100 000 € par parent et par enfant, renouvelable tous les 15 ans. Au-delà, le barème progressif s'applique :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6">
        {[
          ["Jusqu'à 8 072 €", "5 % de droits de donation"],
          ["De 8 072 € à 12 109 €", "10 %"],
          ["De 12 109 € à 15 932 €", "15 %"],
          ["De 15 932 € à 552 324 €", "20 %"],
          ["De 552 324 € à 902 838 €", "30 %"],
          ["Au-delà de 1 805 677 €", "45 %"],
        ].map(([tranche, taux], i) => (
          <li key={i} className="flex gap-3 p-4 bg-[var(--color-tint-blue)] rounded-xl text-sm">
            <span className="shrink-0 font-bold text-[var(--color-accent)]">→</span>
            <div>
              <strong className="text-[var(--color-text-strong)] block mb-0.5">{tranche}</strong>
              <span className="text-[var(--color-muted)]">{taux}</span>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La donation en nue-propriété : l'outil d'optimisation par excellence</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">donation en nue-propriété avec réserve d'usufruit</strong> est la technique la plus utilisée en matière de transmission immobilière. Le donateur (le parent) conserve l'usufruit du bien — c'est-à-dire le droit de l'habiter ou d'en percevoir les loyers — jusqu'à son décès, tandis qu'il donne la nue-propriété à ses enfants.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        L'avantage fiscal est considérable : les droits de donation sont calculés sur la <strong className="text-[var(--color-text-strong)]">seule valeur de la nue-propriété</strong>, qui est inférieure à la valeur en pleine propriété selon un barème fiscal lié à l'âge du donateur. Par exemple, si le donateur a entre 61 et 70 ans, la nue-propriété est évaluée à 60 % de la valeur totale. Au décès du donateur, les héritiers récupèrent la pleine propriété sans aucun droit de succession supplémentaire.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Cette technique est particulièrement efficace lorsqu'elle est mise en place tôt, car plus le donateur est jeune, plus la valeur de la nue-propriété (et donc les droits) est faible. Le notaire calcule précisément les droits applicables et peut simuler plusieurs scénarios pour optimiser la transmission.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La donation-partage immobilière</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">donation-partage</strong> permet de transmettre et de répartir simultanément tout ou partie de son patrimoine entre ses héritiers présomptifs. Elle présente un avantage majeur : les biens donnés sont évalués au jour de la donation (et non au jour du décès pour le calcul de la réserve héréditaire), ce qui évite les litiges liés à la réévaluation des biens lors de la succession.
      </p>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Pour un bien immobilier destiné à être transmis à plusieurs enfants, la donation-partage garantit l'équité entre héritiers et prévient les conflits familiaux. Le notaire rédige l'acte, calcule les droits, et s'assure que la réserve héréditaire de chaque enfant est respectée. Consultez un notaire spécialisé via Notaires.io pour concevoir la stratégie de transmission la plus adaptée à votre patrimoine.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Article 37 ─────────────────────────────────────────────────────────── */

function Article37() {
  return (
    <>
      <KeyPoints
        points={[
          "Le bail notarié est un acte authentique qui vaut titre exécutoire : le propriétaire peut recouvrer les loyers impayés sans jugement préalable.",
          "Il offre une date certaine et une preuve irréfutable du contenu du contrat, opposable aux tiers.",
          "Les émoluments sont partagés entre propriétaire et locataire selon un barème réglementé.",
          "Il est particulièrement recommandé pour les baux de longue durée, les baux commerciaux et les baux à construction.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qu'est-ce qu'un bail notarié ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Un <strong className="text-[var(--color-text-strong)]">bail notarié</strong>, ou bail authentique, est un contrat de location rédigé par un notaire en tant qu'officier public. Contrairement au bail sous seing privé (le plus courant), signé directement entre les parties ou via une agence immobilière, le bail notarié bénéficie de la force de l'acte authentique : il fait foi jusqu'à inscription de faux, sa date est certaine, et surtout, il vaut <strong className="text-[var(--color-text-strong)]">titre exécutoire</strong>.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Cette force exécutoire est l'avantage principal pour le propriétaire : en cas de loyers impayés, il peut directement mandater un huissier de justice pour saisir les biens du locataire ou engager une procédure d'expulsion, sans devoir au préalable obtenir un jugement du tribunal. Cette économie procédurale représente souvent plusieurs mois de délai et des milliers d'euros de frais judiciaires évités.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Le bail notarié n'est pas obligatoire pour la grande majorité des locations d'habitation (régies par la loi du 6 juillet 1989), mais il est fortement recommandé pour sécuriser la relation locative dans les cas complexes ou à enjeux financiers importants.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Avantages pour le propriétaire</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Pour le bailleur, le bail notarié présente plusieurs avantages décisifs au-delà de la force exécutoire :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6">
        {[
          ["Sécurité juridique renforcée", "Le notaire vérifie l'identité et la capacité juridique des parties, s'assure de la conformité du bail avec la législation en vigueur et intègre les clauses indispensables pour protéger le bailleur."],
          ["Preuve irréfutable", "L'acte authentique fait foi jusqu'à inscription de faux : le locataire ne peut pas contester la date, le contenu ou la signature du bail devant un tribunal."],
          ["Conservation sécurisée", "L'original (la minute) est conservé en l'étude notariale pendant 75 ans minimum. En cas de perte de leur exemplaire, les parties peuvent obtenir une copie authentique à tout moment."],
          ["Opposabilité aux tiers", "Le bail notarié publié au service de la publicité foncière est opposable à tout acquéreur du bien, garantissant la continuité du bail en cas de vente."],
        ].map(([item, desc], i) => (
          <li key={i} className="flex gap-3 p-4 bg-[var(--color-tint-blue)] rounded-xl text-sm">
            <span className="shrink-0 font-bold text-[var(--color-accent)]">→</span>
            <div>
              <strong className="text-[var(--color-text-strong)] block mb-0.5">{item}</strong>
              <span className="text-[var(--color-muted)]">{desc}</span>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Avantages pour le locataire</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le bail notarié n'est pas uniquement protecteur pour le propriétaire. Le locataire y trouve également des garanties importantes. La date certaine du bail protège le locataire contre toute contestation ultérieure de la durée de location ou du montant du loyer initial. Le contenu du bail, vérifié par le notaire, garantit qu'aucune clause abusive ou illégale ne figure dans le contrat.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Pour les baux de longue durée (supérieurs à 12 ans), la publication au service de la publicité foncière est obligatoire. Elle protège le locataire : si le propriétaire vend le bien loué, l'acquéreur est tenu de respecter le bail, et le locataire ne peut pas être expulsé arbitrairement. Cette protection est particulièrement importante pour les baux commerciaux ou les baux emphytéotiques (durée de 18 à 99 ans).
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Par ailleurs, un bail notarié peut faciliter l'accès au financement pour le locataire souhaitant développer son activité commerciale, car les banques considèrent le bail authentique comme une garantie de pérennité de l'occupation des locaux.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Coût et cas d'usage recommandés</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les émoluments du notaire pour la rédaction d'un bail sont réglementés et calculés selon la durée du bail et le loyer annuel. Ils sont partagés par moitié entre bailleur et locataire. Pour un bail d'habitation de 3 ans avec un loyer annuel de 12 000 €, les émoluments sont d'environ 250 à 350 € TTC au total. Pour un bail commercial, les montants sont proportionnellement plus élevés.
      </p>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Le bail notarié est particulièrement recommandé dans les situations suivantes : baux de longue durée ou à fort enjeu financier, baux commerciaux et baux professionnels, baux à construction ou baux emphytéotiques, location à une société ou à un professionnel, ou encore lorsque les parties souhaitent une sécurité maximale et une preuve incontestable de leurs engagements réciproques. Consultez un notaire via Notaires.io pour choisir le dispositif le plus adapté à votre situation.
      </p>

      <InternalCTA />
    </>
  );
}

/* ── Article 38 ─────────────────────────────────────────────────────────── */

function Article38() {
  return (
    <>
      <KeyPoints
        points={[
          "La SCI à l'IR est transparente fiscalement : chaque associé est imposé sur sa quote-part de revenus fonciers à son taux marginal.",
          "La SCI à l'IS permet d'amortir les immeubles, réduisant le résultat imposable, mais génère une double imposition lors de la distribution.",
          "Le choix IS/IR impacte fortement la fiscalité de la transmission et de la cession des parts.",
          "L'option pour l'IS est irrévocable : seule une dissolution peut permettre un retour à l'IR.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le régime par défaut : la SCI à l'IR</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Par défaut, une <strong className="text-[var(--color-text-strong)]">société civile immobilière (SCI)</strong> est soumise au régime de l'impôt sur le revenu (IR), également appelé régime de transparence fiscale. Cela signifie que la SCI ne paie pas elle-même l'impôt : les revenus (loyers) et les charges sont directement imposés au niveau de chaque associé, proportionnellement à sa quote-part dans le capital social.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Concrètement, si vous détenez 60 % des parts d'une SCI qui perçoit 20 000 € de loyers annuels (nets de charges), vous déclarez 12 000 € de revenus fonciers dans votre déclaration personnelle d'impôt sur le revenu. Ces revenus sont imposés à votre taux marginal d'imposition (TMI), augmenté des prélèvements sociaux (17,2 %). Pour un contribuable dans la tranche à 41 %, la fiscalité globale atteint donc 58,2 % sur les revenus fonciers nets.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        La SCI à l'IR est le régime le plus simple à gérer comptablement (pas de comptabilité commerciale obligatoire, juste une déclaration fiscale 2072). Elle est particulièrement adaptée aux patrimoines familiaux destinés à être transmis, car les plus-values de cession bénéficient du régime des plus-values immobilières avec les abattements pour durée de détention (exonération totale après 30 ans).
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La SCI à l'IS : avantages et contraintes</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">SCI soumise à l'impôt sur les sociétés (IS)</strong> est imposée au niveau de la société, et non des associés. Le taux est de 15 % sur les 42 500 premiers euros de bénéfice (taux réduit pour les PME), puis de 25 % au-delà. Cela peut sembler avantageux pour des contribuables dans les tranches élevées de l'IR.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        L'avantage décisif de la SCI à l'IS est la possibilité d'<strong className="text-[var(--color-text-strong)]">amortir les immeubles</strong> comptablement. L'amortissement réduit chaque année le résultat imposable d'un montant correspondant à la dépréciation théorique du bien (généralement entre 1,5 % et 3 % de la valeur hors terrain par an). Ce mécanisme peut réduire substantiellement, voire annuler, l'impôt dû pendant de nombreuses années.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Mais la SCI à l'IS présente des contraintes importantes. La comptabilité doit être tenue selon les règles du plan comptable général, ce qui implique souvent le recours à un expert-comptable. Plus grave : lors de la cession de l'immeuble, la plus-value est calculée sur la valeur nette comptable (valeur d'acquisition moins les amortissements), ce qui peut générer une plus-value imposable très importante. Et les dividendes distribués aux associés sont soumis à une seconde imposition (30 % de flat tax), créant une double imposition.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comparatif IS / IR : quel régime choisir ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le choix entre IS et IR dépend de vos objectifs patrimoniaux et de votre horizon de détention :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6">
        {[
          ["SCI à l'IR — idéale si...", "Vous prévoyez de transmettre le bien à vos enfants, de le détenir sur le très long terme (bénéfice des abattements), ou si vos revenus fonciers sont modestes (TMI faible)."],
          ["SCI à l'IS — idéale si...", "Vous avez un TMI élevé (41 % ou 45 %), vous souhaitez réinvestir les bénéfices dans la SCI sans les distribuer, et vous n'envisagez pas de céder le bien dans les 20 prochaines années."],
          ["Transmission du patrimoine", "La SCI à l'IR est généralement plus favorable : les parts peuvent être données en bénéficiant des abattements fiscaux, et la plus-value de cession sera exonérée après 30 ans."],
          ["Gestion locative intensive", "La SCI à l'IS peut être intéressante pour des investisseurs souhaitant développer un parc immobilier important en réinvestissant les bénéfices sans imposition immédiate."],
        ].map(([item, desc], i) => (
          <li key={i} className="flex gap-3 p-4 bg-[var(--color-tint-blue)] rounded-xl text-sm">
            <span className="shrink-0 font-bold text-[var(--color-accent)]">→</span>
            <div>
              <strong className="text-[var(--color-text-strong)] block mb-0.5">{item}</strong>
              <span className="text-[var(--color-muted)]">{desc}</span>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle du notaire dans le choix IS/IR</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le notaire travaille en synergie avec l'expert-comptable et le conseiller en gestion de patrimoine pour vous aider à choisir le régime fiscal le plus adapté à votre situation. Il analyse votre profil fiscal, vos objectifs de transmission, votre horizon d'investissement et la nature des biens détenus, puis formule une recommandation argumentée.
      </p>
      <p className="text-[var(--color-muted)] leading-relaxed">
        Attention : si la SCI a opté pour l'IS, ce choix est <strong className="text-[var(--color-text-strong)]">définitif et irrévocable</strong>. Un retour à l'IR n'est possible qu'après dissolution et recréation d'une nouvelle société, ce qui entraîne des coûts fiscaux et juridiques importants. Il est donc impératif de bien réfléchir à ce choix dès la création de la SCI, en consultant un notaire spécialisé via Notaires.io.
      </p>

      <InternalCTA />
    </>
  );
}


/* ── Article 39 ─────────────────────────────────────────────────────────── */

function Article39() {
  return (
    <>
      <KeyPoints
        points={[
          "La donation-partage est un acte notarié qui organise la transmission du patrimoine de votre vivant en répartissant les biens entre vos héritiers.",
          "Elle gèle les valeurs au jour de l'acte, évitant les réévaluations au moment de la succession et les conflits entre héritiers.",
          "Chaque bénéficiaire peut recevoir des biens différents, y compris en nature, ce qui facilite la répartition de biens immobiliers ou d'entreprises.",
          "Les abattements fiscaux de 100 000 € par enfant s'appliquent, et le délai de 15 ans repart à zéro dès la signature de l'acte.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qu'est-ce qu'une donation-partage ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">donation-partage</strong> est un acte notarié par lequel une personne — le donateur — distribue tout ou partie de son patrimoine entre ses héritiers présomptifs de son vivant. Elle combine deux opérations juridiques : la donation (transfert gratuit de propriété) et le partage (répartition des biens entre plusieurs bénéficiaires). Régie par les articles 1075 et suivants du Code civil, elle constitue l'un des outils les plus efficaces de transmission patrimoniale anticipée en droit français.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Contrairement à une série de donations simples, la donation-partage règle définitivement la répartition des biens entre les héritiers au moment de l'acte. Les valeurs sont cristallisées au jour de la signature chez le notaire, ce qui signifie qu'elles ne seront pas réévaluées au moment de la succession. Si un bien immobilier donné double de valeur entre la donation et le décès, c'est la valeur au jour de la donation qui sera retenue pour le calcul des droits des héritiers.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Ce mécanisme protège les bénéficiaires contre les aléas de valorisation et prévient les querelles successorales. Il est particulièrement adapté aux familles qui souhaitent organiser la transmission d'une entreprise familiale, d'un bien immobilier ou d'un patrimoine diversifié tout en maintenant l'harmonie entre les enfants.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les avantages de la donation-partage</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La donation-partage présente de nombreux avantages par rapport aux autres formes de transmission :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6">
        {[
          ["Gel des valeurs", "Les biens sont évalués une fois pour toutes au jour de l'acte, évitant les réévaluations au décès qui peuvent créer des déséquilibres."],
          ["Irrévocabilité relative", "Une fois acceptée par les bénéficiaires, la donation-partage est stable, sauf causes légales de révocation (ingratitude, inexécution des charges)."],
          ["Prévention des conflits", "En organisant la répartition de votre vivant, vous réduisez considérablement le risque de litiges entre héritiers après votre décès."],
          ["Efficacité fiscale", "Chaque bénéficiaire profite de son abattement personnel (100 000 € par enfant par parent) et le délai de 15 ans repart dès la signature."],
        ].map(([titre, texte], i) => (
          <li key={i} className="flex gap-3 p-4 bg-[var(--color-tint-blue)] rounded-xl text-sm">
            <span className="shrink-0 font-bold text-[var(--color-accent)]">→</span>
            <div>
              <strong className="text-[var(--color-text-strong)] block mb-0.5">{titre}</strong>
              <span className="text-[var(--color-muted)]">{texte}</span>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qui peut bénéficier d'une donation-partage ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        En principe, la donation-partage doit inclure <strong className="text-[var(--color-text-strong)]">tous les héritiers présomptifs</strong> du donateur, c'est-à-dire toutes les personnes qui seraient appelées à la succession si le donateur décédait au moment de l'acte. Pour un donateur avec trois enfants, les trois doivent être parties à l'acte, même si les biens ne sont pas répartis à parts égales.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La loi du 23 juin 2006 a étendu la donation-partage aux familles recomposées. Il est désormais possible de réaliser une <strong className="text-[var(--color-text-strong)]">donation-partage conjonctive</strong> (par deux parents ensemble) ou une <strong className="text-[var(--color-text-strong)]">donation-partage transgénérationnelle</strong> (incluant des petits-enfants avec le consentement des enfants concernés). Cette souplesse permet d'adapter l'acte à des situations familiales complexes.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Un enfant peut également recevoir un bien différent de ses frères et sœurs, à condition que tous acceptent la répartition. Si un enfant refuse, la donation-partage reste possible mais ne le concernera pas ; ses droits seront préservés dans la succession ultérieure.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Fiscalité et coût</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les droits de donation s'appliquent sur la valeur nette des biens transmis, après déduction des abattements. Pour un enfant, l'abattement est de <strong className="text-[var(--color-text-strong)]">100 000 € par parent</strong>, renouvelable tous les 15 ans. Au-delà, le barème progressif des droits de donation s'applique (de 5 % à 45 % selon les tranches).
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les émoluments du notaire sont calculés sur la valeur des biens transmis selon un barème réglementé. Il convient d'y ajouter la contribution de sécurité immobilière (0,10 % pour les biens immobiliers), les frais de publication et les débours. Pour une donation-partage portant sur un immeuble de 300 000 €, comptez globalement entre 3 000 et 6 000 € de frais notariés.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Une stratégie fréquente consiste à réaliser une première donation-partage à 50-55 ans, puis une seconde 15 ans plus tard pour profiter à nouveau des abattements. Ce calendrier permet de transmettre un patrimoine important en franchise quasi totale de droits.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle central du notaire</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La donation-partage est un acte authentique : <strong className="text-[var(--color-text-strong)]">le passage devant notaire est obligatoire</strong>, sans exception. Le notaire joue un rôle bien au-delà de la simple rédaction de l'acte. Il vérifie la capacité du donateur et des donataires, s'assure du respect des règles de la réserve héréditaire, évalue les biens si nécessaire et conseille les parties sur la meilleure structuration possible.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Il est recommandé de consulter le notaire en amont de toute décision, idéalement plusieurs mois avant l'acte souhaité, pour permettre une réflexion approfondie sur les objectifs patrimoniaux, fiscaux et familiaux. Une donation-partage bien préparée peut transformer une future succession conflictuelle en un règlement serein et équitable.
      </p>

      <InternalCTA />
    </>
  );
}


/* ── Article 40 ─────────────────────────────────────────────────────────── */

function Article40() {
  return (
    <>
      <KeyPoints
        points={[
          "Chaque parent peut donner 100 000 € à chaque enfant sans droits de donation, soit 200 000 € pour un couple par enfant.",
          "L'abattement de 100 000 € se renouvelle tous les 15 ans, permettant des transmissions successives en franchise de droits.",
          "Des abattements supplémentaires existent pour les dons de sommes d'argent : 31 865 € tous les 15 ans sous conditions d'âge.",
          "Au-delà des abattements, le barème progressif des droits de donation s'applique, de 5 % à 45 %.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">L'abattement de 100 000 € : le pilier de la donation aux enfants</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        En 2026, l'abattement fiscal applicable aux donations entre parents et enfants reste fixé à <strong className="text-[var(--color-text-strong)]">100 000 € par parent et par enfant</strong>. Cela signifie qu'un père peut donner 100 000 € à son fils sans aucun droit à payer, et la mère peut faire de même, indépendamment. Pour une famille avec deux enfants, un couple peut ainsi transmettre jusqu'à 400 000 € en totale franchise fiscale.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Cet abattement est propre à chaque ligne de parenté : il ne se confond pas et ne se cumule pas entre frères et sœurs. L'enfant bénéficie de 100 000 € de son père et de 100 000 € de sa mère, soit 200 000 € au total de ses deux parents. Ces deux abattements s'appliquent indépendamment l'un de l'autre.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        La principale règle à connaître est le <strong className="text-[var(--color-text-strong)]">délai de rappel fiscal de 15 ans</strong> : toutes les donations consenties par un même donateur à un même donataire dans les 15 années précédentes sont prises en compte pour apprécier le dépassement éventuel de l'abattement. Il faut donc échelonner les donations pour optimiser leur régime fiscal.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le don de sommes d'argent : un abattement supplémentaire</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        En plus de l'abattement général de 100 000 €, un <strong className="text-[var(--color-text-strong)]">abattement spécifique de 31 865 €</strong> s'applique aux dons de sommes d'argent (chèques, virements, espèces), sous deux conditions cumulatives : le donateur doit être âgé de moins de 80 ans au jour du don, et le donataire doit être majeur ou émancipé.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Cet abattement est également renouvelable tous les 15 ans et se cumule avec l'abattement général de 100 000 €. Un parent de moins de 80 ans peut donc donner jusqu'à <strong className="text-[var(--color-text-strong)]">131 865 €</strong> à chaque enfant sans aucun droit de donation, à condition que la part correspondant aux 31 865 € soit un don de somme d'argent.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Attention : pour bénéficier de cet abattement supplémentaire, le don de somme d'argent doit être déclaré spontanément au service des impôts via le formulaire 2735, dans le mois suivant le don. Cette déclaration fait partir le délai de 15 ans et sécurise l'abattement.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le barème des droits au-delà des abattements</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Lorsque la donation dépasse les abattements disponibles, les droits de donation sont calculés selon un <strong className="text-[var(--color-text-strong)]">barème progressif</strong> appliqué à la fraction taxable, après déduction des abattements :
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--color-tint-blue)]">
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Fraction taxable (après abattements)</th>
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Taux</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Jusqu'à 8 072 €", "5 %"],
              ["De 8 072 € à 12 109 €", "10 %"],
              ["De 12 109 € à 15 932 €", "15 %"],
              ["De 15 932 € à 552 324 €", "20 %"],
              ["De 552 324 € à 902 838 €", "30 %"],
              ["De 902 838 € à 1 805 677 €", "40 %"],
              ["Au-delà de 1 805 677 €", "45 %"],
            ].map(([tranche, taux], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[var(--color-tint-blue)]"}>
                <td className="p-3 border border-[var(--color-border)] text-[var(--color-muted)]">{tranche}</td>
                <td className="p-3 border border-[var(--color-border)] font-semibold text-[var(--color-text-strong)]">{taux}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Stratégies pour optimiser les abattements</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Pour tirer le meilleur parti des abattements disponibles, plusieurs stratégies s'offrent à vous. La première consiste à <strong className="text-[var(--color-text-strong)]">étaler les donations dans le temps</strong>, en réalisant une première donation le plus tôt possible, puis une seconde 15 ans plus tard. Cette approche permet de doubler les montants transmis en franchise de droits sur une vie.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La seconde stratégie est le <strong className="text-[var(--color-text-strong)]">démembrement de propriété</strong> : en donnant la nue-propriété d'un bien immobilier tout en conservant l'usufruit, vous transmettez une valeur inférieure à la pleine propriété (selon un barème lié à votre âge), ce qui réduit l'assiette taxable. Vos enfants récupèrent la pleine propriété gratuitement à votre décès.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Enfin, la <strong className="text-[var(--color-text-strong)]">donation-partage</strong> permet de cristalliser les valeurs et de s'assurer que tous les abattements sont bien utilisés pour chaque enfant simultanément. Un notaire pourra vous élaborer un plan de transmission sur mesure, optimisant à la fois les abattements fiscaux et la sérénité familiale.
      </p>

      <InternalCTA />
    </>
  );
}


/* ── Article 41 ─────────────────────────────────────────────────────────── */

function Article41() {
  return (
    <>
      <KeyPoints
        points={[
          "La donation en nue-propriété permet de transmettre un bien à moindre coût fiscal, les droits étant calculés sur la seule valeur de la nue-propriété.",
          "Le donateur conserve l'usufruit : il continue d'habiter le bien ou d'en percevoir les loyers jusqu'à son décès.",
          "À l'extinction de l'usufruit (décès du donateur), le nu-propriétaire récupère la pleine propriété sans droits supplémentaires.",
          "Un barème fiscal officiel (art. 669 CGI) fixe la valeur de l'usufruit selon l'âge du donateur.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le démembrement de propriété en bref</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La pleine propriété d'un bien peut être divisée en deux droits distincts : l'<strong className="text-[var(--color-text-strong)]">usufruit</strong> (droit d'user du bien et d'en percevoir les fruits, c'est-à-dire les revenus) et la <strong className="text-[var(--color-text-strong)]">nue-propriété</strong> (titre de propriété sans droit de jouissance). Cette division s'appelle le démembrement de propriété.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Dans le cadre d'une donation, les parents donnent généralement la nue-propriété de leur bien à leurs enfants tout en conservant l'usufruit. Concrètement, si vous donnez la nue-propriété de votre appartement à votre fils, vous pouvez continuer à y vivre ou à le louer. À votre décès, l'usufruit s'éteint automatiquement et votre fils devient plein propriétaire sans avoir à payer de droits supplémentaires, quelle que soit la valeur atteinte par le bien.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Ce mécanisme est particulièrement puissant car il combine deux avantages : la transmission anticipée du patrimoine et la conservation de ses revenus par le donateur jusqu'à son décès.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le barème fiscal de l'usufruit</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        L'article 669 du Code général des impôts fixe un barème fiscal qui détermine la valeur respective de l'usufruit et de la nue-propriété en fonction de l'âge de l'usufruitier au moment de la donation :
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--color-tint-blue)]">
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Âge de l'usufruitier</th>
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Valeur de l'usufruit</th>
              <th className="text-left p-3 font-bold text-[var(--color-text-strong)] border border-[var(--color-border)]">Valeur de la nue-propriété</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Moins de 21 ans", "90 %", "10 %"],
              ["De 21 à 30 ans", "80 %", "20 %"],
              ["De 31 à 40 ans", "70 %", "30 %"],
              ["De 41 à 50 ans", "60 %", "40 %"],
              ["De 51 à 60 ans", "50 %", "50 %"],
              ["De 61 à 70 ans", "40 %", "60 %"],
              ["De 71 à 80 ans", "30 %", "70 %"],
              ["De 81 à 90 ans", "20 %", "80 %"],
              ["Plus de 91 ans", "10 %", "90 %"],
            ].map(([age, usu, nu], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[var(--color-tint-blue)]"}>
                <td className="p-3 border border-[var(--color-border)] text-[var(--color-muted)]">{age}</td>
                <td className="p-3 border border-[var(--color-border)] text-[var(--color-muted)]">{usu}</td>
                <td className="p-3 border border-[var(--color-border)] font-semibold text-[var(--color-text-strong)]">{nu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Exemple concret : un donateur de 62 ans donne la nue-propriété d'un appartement valant 300 000 €. La nue-propriété représente 60 % = 180 000 €. Après abattement de 100 000 €, la base taxable n'est que de 80 000 €, soit environ 12 194 € de droits de donation (au lieu de 40 000 € sur la pleine propriété).
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Obligations des parties et charges</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        L'usufruit et la nue-propriété créent des droits et obligations réciproques. L'<strong className="text-[var(--color-text-strong)]">usufruitier</strong> est tenu d'user du bien en bon père de famille, d'entretenir le bien (réparations courantes) et de payer les charges courantes (taxe d'habitation, charges de copropriété). Le <strong className="text-[var(--color-text-strong)]">nu-propriétaire</strong> supporte les grosses réparations (article 605 et 606 du Code civil) et la taxe foncière.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        En cas de vente du bien démembré, les deux parties doivent s'accorder. Le produit de la vente est réparti selon les mêmes clés de valorisation (barème fiscal), à moins que les parties ne conviennent du remploi des fonds pour reconstituer un bien démembré ou de la conversion de l'usufruit en rente viagère.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle indispensable du notaire</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Toute donation portant sur un bien immobilier — qu'il s'agisse de la pleine propriété, de l'usufruit ou de la nue-propriété — doit être réalisée par <strong className="text-[var(--color-text-strong)]">acte authentique devant notaire</strong>. Le notaire vérifie la régularité de l'opération, calcule les droits de donation, rédige l'acte et le publie au service de la publicité foncière.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Il est également le conseiller idéal pour déterminer si le démembrement de propriété est adapté à votre situation : âge, valeur du bien, situation fiscale, existence d'autres héritiers. Une consultation en amont permet de structurer l'opération de façon optimale et d'éviter les pièges fiscaux ou civils.
      </p>

      <InternalCTA />
    </>
  );
}


/* ── Article 42 ─────────────────────────────────────────────────────────── */

function Article42() {
  return (
    <>
      <KeyPoints
        points={[
          "Le démembrement de propriété divise un bien en usufruit (droit de jouissance) et nue-propriété (titre de propriété), chacun ayant une valeur fiscale distincte.",
          "Il permet de transmettre un patrimoine à moindre coût fiscal tout en conservant l'usage du bien ou ses revenus.",
          "Le barème fiscal de l'article 669 du CGI fixe la valeur de l'usufruit selon l'âge de l'usufruitier.",
          "À l'extinction de l'usufruit, le nu-propriétaire récupère la pleine propriété sans droits supplémentaires.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comprendre le démembrement de propriété</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        En droit français, la propriété d'un bien est un droit absolu qui peut être <strong className="text-[var(--color-text-strong)]">démembré</strong>, c'est-à-dire divisé entre plusieurs titulaires aux droits distincts. Ce démembrement crée deux droits réels : l'<strong className="text-[var(--color-text-strong)]">usufruit</strong> et la <strong className="text-[var(--color-text-strong)]">nue-propriété</strong>. L'usufruitier a le droit de se servir du bien (y habiter, le louer) et d'en percevoir les revenus. Le nu-propriétaire est propriétaire du bien mais ne peut ni l'utiliser ni en percevoir les fruits tant que l'usufruit existe.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le démembrement est temporaire : il prend fin à l'extinction de l'usufruit, ce qui se produit soit par le décès de l'usufruitier (usufruit viager), soit à l'échéance prévue (usufruit temporaire). À ce moment, les deux droits se reunissent automatiquement dans les mains du nu-propriétaire qui devient plein propriétaire sans aucune formalité ni droit supplémentaire.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Le démembrement peut naître de plusieurs façons : par donation (les parents donnent la nue-propriété à leurs enfants), par voie de succession (le conjoint hérite de l'usufruit, les enfants de la nue-propriété), ou par convention entre particuliers dans un cadre d'investissement.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les applications patrimoniales du démembrement</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le démembrement trouve ses applications les plus fréquentes dans trois domaines :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6">
        {[
          ["Transmission familiale", "Les parents donnent la nue-propriété de leur résidence principale ou d'un bien locatif à leurs enfants tout en conservant l'usufruit viager. Les droits de donation sont calculés sur la seule valeur de la nue-propriété."],
          ["Investissement immobilier", "L'achat en nue-propriété (sans usufruit) permet d'acquérir un bien à prix réduit (de 30 à 40 % selon la durée du démembrement) sans en gérer la location pendant la période de démembrement."],
          ["Protection du conjoint", "La succession légale prévoit souvent l'attribution de l'usufruit au conjoint survivant et de la nue-propriété aux enfants, assurant des revenus au conjoint sans priver les enfants de leur héritage."],
        ].map(([titre, texte], i) => (
          <li key={i} className="flex gap-3 p-4 bg-[var(--color-tint-blue)] rounded-xl text-sm">
            <span className="shrink-0 font-bold text-[var(--color-accent)]">→</span>
            <div>
              <strong className="text-[var(--color-text-strong)] block mb-0.5">{titre}</strong>
              <span className="text-[var(--color-muted)]">{texte}</span>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Droits et obligations des parties</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le Code civil répartit clairement les droits et obligations entre usufruitier et nu-propriétaire. L'<strong className="text-[var(--color-text-strong)]">usufruitier</strong> doit conserver la substance du bien, effectuer les réparations d'entretien (article 605 du Code civil), payer les charges courantes et les impôts liés à la jouissance (taxe d'habitation, charges de copropriété). Il peut librement louer le bien, mais pour des baux de longue durée, l'accord du nu-propriétaire peut être requis.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le <strong className="text-[var(--color-text-strong)]">nu-propriétaire</strong> supporte les grosses réparations définies à l'article 606 du Code civil (gros murs, voûtes, toitures, poutres maîtresses) et la taxe foncière. Il ne peut pas vendre le bien en pleine propriété sans l'accord de l'usufruitier, ni accomplir d'actes de disposition qui porteraient atteinte aux droits de l'usufruitier.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        En cas de désaccord sur la gestion du bien ou la répartition des charges, le notaire peut être sollicité pour rédiger une convention de démembrement précisant les règles applicables entre les parties.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le notaire, acteur clé du démembrement</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le notaire intervient à plusieurs étapes du démembrement. Lors de la constitution, il rédige l'acte authentique si le bien est immobilier, calcule les droits de donation ou de succession, et conseille sur la structuration optimale. Lors de l'extinction de l'usufruit, il peut établir un acte constatant la réunion de l'usufruit et de la nue-propriété, ce qui est recommandé pour la publicité foncière même si la réunion est automatique.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        En matière de démembrement d'un portefeuille financier ou de parts sociales, le notaire conseille sur les modalités et la rédaction des actes de cession ou de donation, en veillant aux règles fiscales spécifiques à ces actifs (traitement des dividendes, droits de vote, etc.).
      </p>

      <InternalCTA />
    </>
  );
}


/* ── Article 43 ─────────────────────────────────────────────────────────── */

function Article43() {
  return (
    <>
      <KeyPoints
        points={[
          "La donation simple permet de transmettre un bien ou une somme d'argent à ses enfants de son vivant, avec les abattements fiscaux disponibles.",
          "Un acte notarié est obligatoire pour toute donation portant sur un bien immobilier.",
          "La donation simple est en principe rapportable à la succession pour maintenir l'égalité entre héritiers, sauf dispense du donateur.",
          "Les droits de donation sont calculés sur la valeur du bien après abattements, selon un barème progressif de 5 % à 45 %.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Pourquoi faire une donation à ses enfants ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Transmettre une partie de son patrimoine à ses enfants de son vivant présente de nombreux avantages. Sur le plan fiscal, les <strong className="text-[var(--color-text-strong)]">abattements de 100 000 € par parent et par enfant</strong>, renouvelables tous les 15 ans, permettent de transmettre des sommes significatives sans droits à payer. Sur le plan familial, la donation anticipée permet de répondre à des besoins immédiats (achat d'un logement, financement des études, création d'entreprise) au moment où l'aide est la plus utile.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La donation évite également les aléas de la succession : en cas de décès brutal, le délai de règlement successoral peut paralyser les finances des héritiers pendant plusieurs mois. En anticipant la transmission, vous assurez à vos enfants une disponibilité immédiate des actifs donnés.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Enfin, pour les patrimoines importants, la donation permet d'optimiser la transmission sur le long terme en commençant tôt les transferts et en profitant plusieurs fois des abattements sur une vie.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Donation de somme d'argent ou de bien immobilier ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Il existe plusieurs types de donations simples selon la nature du bien transmis. La <strong className="text-[var(--color-text-strong)]">donation de somme d'argent</strong> (virement bancaire, chèque) est la plus simple. Si elle respecte les conditions d'âge (donateur de moins de 80 ans, donataire majeur), elle peut bénéficier d'un abattement supplémentaire de 31 865 €. Elle doit être déclarée au fisc via le formulaire 2735.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">donation immobilière</strong> est plus complexe : elle nécessite obligatoirement un acte notarié, une évaluation du bien, et le paiement des droits de donation sur la valeur vénale. Elle peut être réalisée en pleine propriété, en nue-propriété (le donateur conservant l'usufruit) ou en usufruit seul (plus rare).
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">donation de valeurs mobilières</strong> (actions, parts de société, parts de fonds) peut se faire par acte sous seing privé pour les titres au porteur, mais un acte notarié est recommandé pour la sécurité juridique. Les droits sont calculés sur la valeur des titres au jour de la donation.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La question du rapport à la succession</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La donation simple est soumise au <strong className="text-[var(--color-text-strong)]">rapport civil</strong> : à l'ouverture de la succession, chaque héritier doit "rapporter" les donations qu'il a reçues du défunt pour permettre un partage équitable. La valeur rapportée est celle du bien au jour du partage, selon son état au jour de la donation — ce qui peut créer des déséquilibres si le bien a fortement augmenté de valeur.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Pour éviter ce rapport, le donateur peut indiquer dans l'acte de donation que le bien est donné <strong className="text-[var(--color-text-strong)]">hors part successorale</strong> (c'est-à-dire en avancement sur la quotité disponible, pas sur la réserve). Dans ce cas, le bénéficiaire conserve la donation sans avoir à la rapporter, sous réserve que cela ne porte pas atteinte à la réserve héréditaire des autres héritiers.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        C'est ici que le rôle de conseil du notaire est crucial : il vous aide à choisir entre donation en avancement de part ou hors part, en fonction de votre situation familiale et de vos objectifs patrimoniaux.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Procédure et coût d'une donation notariée</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Pour une donation immobilière, le notaire réunit donateur et donataire pour recueillir leurs consentements, vérifie les titres de propriété, évalue le bien si nécessaire, rédige l'acte, le fait signer et le publie au service de la publicité foncière. Le délai entre la prise de rendez-vous et la signature est généralement de 4 à 8 semaines.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les frais comprennent les émoluments du notaire (barème réglementé, environ 1 à 2 % de la valeur du bien), les droits de donation (après abattements, selon le barème progressif), la contribution de sécurité immobilière (0,10 %) et les débours (extraits cadastraux, état hypothécaire, etc.). Pour une donation de 200 000 € (après abattement), comptez environ 2 500 à 4 000 € de frais totaux.
      </p>

      <InternalCTA />
    </>
  );
}


/* ── Article 44 ─────────────────────────────────────────────────────────── */

function Article44() {
  return (
    <>
      <KeyPoints
        points={[
          "Le don manuel est une remise directe de main en main d'un bien meuble (argent, objet, titres) sans acte notarié obligatoire.",
          "Il doit être déclaré à l'administration fiscale via le formulaire 2735, dans le mois suivant sa révélation.",
          "Les mêmes abattements qu'une donation notariée s'appliquent (100 000 € par parent et par enfant), renouvelables tous les 15 ans.",
          "Un don manuel non déclaré reste valable mais expose le bénéficiaire à des droits de donation et pénalités lors d'un contrôle fiscal.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qu'est-ce qu'un don manuel ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le <strong className="text-[var(--color-text-strong)]">don manuel</strong> est une donation réalisée par la remise directe d'un bien meuble corporel ou incorporel : billets de banque, chèque, virement bancaire, objets mobiliers, parts de société au porteur, bijoux ou oeuvres d'art. Contrairement aux donations immobilières, il ne requiert pas d'acte notarié pour être valable. Sa validité repose sur la tradition réelle du bien, c'est-à-dire son transfert effectif au bénéficiaire.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le don manuel est très courant au sein des familles : il peut s'agir d'une aide pour l'achat d'un véhicule, d'un apport pour un premier logement, d'un financement d'études à l'étranger, ou simplement d'un cadeau important à l'occasion d'un mariage ou d'une naissance. Sa simplicité pratique en fait l'outil de transmission le plus spontané, mais il comporte des règles fiscales à respecter.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Attention à ne pas confondre le don manuel avec le <strong className="text-[var(--color-text-strong)]">présent d'usage</strong> : les cadeaux offerts à l'occasion d'un événement particulier (anniversaire, fête, mariage) et dont le montant est proportionné aux revenus du donateur sont exonérés de toute obligation déclarative. Un cadeau de 500 € à Noël n'est pas un don manuel soumis à déclaration.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">L'obligation de déclaration fiscale</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Tout don manuel doit être déclaré à l'administration fiscale dès lors qu'il est "révélé". La révélation peut être <strong className="text-[var(--color-text-strong)]">volontaire</strong> (le bénéficiaire dépose lui-même le formulaire 2735 auprès du service des impôts de son domicile) ou <strong className="text-[var(--color-text-strong)]">forcée</strong> (en cas de contrôle fiscal, de découverte lors d'une succession, ou de demande de l'administration).
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La déclaration doit intervenir dans le <strong className="text-[var(--color-text-strong)]">mois suivant la révélation</strong> du don. Elle doit mentionner l'identité du donateur et du bénéficiaire, la nature et la valeur du don, et la date de sa réalisation. L'administration applique alors les droits de donation éventuels après déduction des abattements disponibles.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Il est fortement recommandé de déclarer spontanément les dons manuels importants plutôt d'attendre un contrôle fiscal. La déclaration volontaire fait partir le délai de 15 ans pour le renouvellement des abattements et sécurise la situation fiscale du bénéficiaire.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Abattements et droits applicables</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les <strong className="text-[var(--color-text-strong)]">mêmes abattements</strong> qu'une donation notariée s'appliquent aux dons manuels déclarés. Entre parent et enfant, l'abattement est de 100 000 € par ligne de parenté, renouvelable tous les 15 ans. Pour les dons de sommes d'argent répondant aux conditions d'âge (donateur de moins de 80 ans, donataire majeur), un abattement supplémentaire de 31 865 € s'applique.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Les abattements entre autres membres de la famille sont moins favorables : 31 865 € entre grands-parents et petits-enfants, 7 967 € entre frères et sœurs, 5 310 € entre oncles/tantes et neveux/nièces, et seulement 1 594 € entre personnes sans lien de parenté. Au-delà des abattements, le barème progressif des droits de donation s'applique.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Attention : les dons manuels consentis dans les 15 années précédant une succession sont rapportés fiscalement à la succession pour calculer les droits. Un don manuel bien déclaré avec ses abattements peut donc réduire significativement les droits de succession futurs.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Quand consulter un notaire pour un don manuel ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Bien que le don manuel ne nécessite pas d'acte notarié, le recours au notaire est conseillé dans plusieurs situations. Lorsque la somme est importante (plusieurs dizaines de milliers d'euros), le notaire peut établir un acte authentique pour sécuriser la preuve du don et préciser les conditions (rapport ou non à la succession, charges éventuelles).
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Lorsque le don accompagne un projet particulier (aide à l'achat immobilier, financement d'une entreprise), le notaire peut intégrer le don dans un cadre juridique plus large, en lien avec les autres actes concernés. Il vérifie également la cohérence du don avec la stratégie patrimoniale globale et s'assure que la réserve héréditaire des autres héritiers n'est pas menacée.
      </p>

      <InternalCTA />
    </>
  );
}


/* ── Article 45 ─────────────────────────────────────────────────────────── */

function Article45() {
  return (
    <>
      <KeyPoints
        points={[
          "La donation temporaire d'usufruit transfère le droit de jouissance d'un bien pour une durée limitée, sans en céder la propriété.",
          "Elle permet au donateur de réduire son assiette à l'IFI et son revenu imposable pendant la durée du transfert.",
          "L'enfant bénéficiaire perçoit les revenus du bien (loyers) pendant la durée convenue, sans droits de succession au terme.",
          "Une durée minimale de 3 ans est recommandée pour que l'administration fiscale valide le caractère non fictif de l'opération.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Fonctionnement de la donation temporaire d'usufruit</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La <strong className="text-[var(--color-text-strong)]">donation temporaire d'usufruit</strong> est un mécanisme par lequel le propriétaire d'un bien transfère à un bénéficiaire le droit de jouir de ce bien pendant une période déterminée, tout en conservant la nue-propriété. À l'expiration de la durée convenue, l'usufruit revient automatiquement au donateur, qui retrouve sa pleine propriété sans aucune formalité ni droit supplémentaire.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Cette technique est particulièrement appréciée des parents souhaitant aider un enfant étudiant ou en début de carrière en lui versant des revenus locatifs sur quelques années, sans lui transmettre définitivement la propriété du bien. Elle peut également s'appliquer à un portefeuille financier, permettant à l'enfant de percevoir les dividendes et intérêts pendant la durée de l'usufruit.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Sur le plan civil, la donation temporaire d'usufruit est régie par les articles 578 et suivants du Code civil relatifs à l'usufruit, combinés avec les règles générales de la donation. Elle doit être acceptée par le bénéficiaire et, si elle porte sur un bien immobilier, réalisée par acte authentique devant notaire.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les avantages fiscaux pour le donateur</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Pour le donateur, la donation temporaire d'usufruit présente deux avantages fiscaux majeurs. Premièrement, les <strong className="text-[var(--color-text-strong)]">revenus du bien sortent de son assiette imposable</strong> pendant la durée du transfert. Si vous possédez un appartement locatif générant 12 000 € de loyers annuels, vous n'êtes plus imposé sur ces revenus pendant la durée de l'usufruit temporaire accordé à votre enfant.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Deuxièmement, la valeur de l'usufruit temporaire sort de l'assiette de l'<strong className="text-[var(--color-text-strong)]">Impôt sur la Fortune Immobilière (IFI)</strong> pendant toute la durée du démembrement. Pour un donateur soumis à l'IFI disposant d'un patrimoine immobilier important, cette économie peut être substantielle.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Les droits de donation sont calculés sur la valeur de l'usufruit temporaire transmis, elle-même déterminée fiscalement à 23 % de la valeur de la pleine propriété par période de 10 ans (ou fraction de 10 ans). Pour un bien valant 200 000 €, un usufruit temporaire de 5 ans est évalué à 23 % x 200 000 € = 46 000 €, soit bien en dessous de l'abattement de 100 000 €.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les précautions à respecter</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        L'administration fiscale surveille attentivement les donations temporaires d'usufruit pour s'assurer qu'elles ne sont pas fictives. Pour être valide et opposable au fisc, l'opération doit respecter plusieurs conditions : la durée doit être réelle et significative (au moins 3 ans est recommandé), le bénéficiaire doit effectivement jouir du bien pendant cette période (percevoir les loyers ou y habiter), et l'acte doit être régulier sur le plan formel.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Si l'administration considère que l'opération est fictive ou contraire aux faits, elle peut la requalifier en abus de droit et appliquer les droits de donation sur la valeur de la pleine propriété, assortis de pénalités pouvant atteindre 80 %.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Le notaire joue un rôle essentiel pour structurer correctement la donation temporaire d'usufruit, rédiger l'acte avec toutes les clauses nécessaires et vous conseiller sur la durée et les conditions optimales selon votre situation.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">À qui s'adresse cette technique ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La donation temporaire d'usufruit convient particulièrement aux parents disposant d'un patrimoine locatif significatif qui souhaitent aider un enfant pendant ses études ou son installation professionnelle, tout en réduisant leur propre imposition. Elle est aussi intéressante pour les contribuables soumis à l'IFI qui cherchent à réduire leur assiette taxable sans vendre leurs biens.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        En revanche, elle est moins adaptée si le donateur a besoin lui-même des revenus du bien pour financer sa retraite ou ses dépenses courantes. Le notaire analysera votre situation globale pour déterminer si cette technique est opportune et en définira les modalités précises.
      </p>

      <InternalCTA />
    </>
  );
}


/* ── Article 46 ─────────────────────────────────────────────────────────── */

function Article46() {
  return (
    <>
      <KeyPoints
        points={[
          "La clause tontinière stipule que le survivant des deux acquéreurs est réputé avoir été seul propriétaire du bien depuis l'origine.",
          "Elle permet à un concubin survivant de recueillir un bien immobilier avec une fiscalité limitée, sans droits successoraux ordinaires.",
          "Le bien est inaliénable sans l'accord des deux parties, ce qui peut devenir un inconvénient en cas de séparation.",
          "La tontine est irréversible après la signature de l'acte ; elle ne peut être modifiée qu'avec l'accord des deux parties.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qu'est-ce que le pacte tontine ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le <strong className="text-[var(--color-text-strong)]">pacte tontine</strong> (ou clause tontinière) est une stipulation contractuelle insérée dans un acte d'achat immobilier par lequel deux acquéreurs conviennent que le survivant d'entre eux sera réputé avoir été seul propriétaire du bien dès l'origine. En cas de décès de l'un d'eux, l'autre recueille la totalité du bien sans qu'il entre dans la succession du défunt.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Cette technique est particulièrement utilisée par les couples non mariés (concubins) qui souhaitent se protéger mutuellement en cas de décès, sans pour autant se marier ni conclure un PACS. Pour les concubins, la tontine offre une alternative aux droits de succession très défavorables (60 % après abattement de 1 594 €) qui s'appliqueraient normalement à l'héritier testamentaire.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Juridiquement, la clause tontine est fondée sur le principe de l'aléa : personne ne sait à l'avance lequel des deux survivra à l'autre. En l'absence d'aléa réel (par exemple si l'un est gravement malade au moment de l'achat), l'administration fiscale peut requalifier la tontine en donation déguisée et appliquer les droits correspondants.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La fiscalité de la clause tontinière</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La fiscalité dépend de la valeur du bien au décès du premier des deux acquéreurs. Si la valeur du bien est <strong className="text-[var(--color-text-strong)]">inférieure à 76 000 €</strong>, la transmission est soumise aux droits de succession selon le lien de parenté entre les parties. Pour les concubins, cela représente 60 % de droits sur la valeur transmise (après abattement de 1 594 €).
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Si la valeur du bien est <strong className="text-[var(--color-text-strong)]">supérieure à 76 000 €</strong> (seuil le plus fréquent en immobilier), la transmission est traitée comme une vente : le survivant est réputé avoir acheté la part du défunt. Les droits de mutation à titre onéreux (environ 5,80 %) s'appliquent alors sur la valeur de la moitié du bien. Pour un appartement de 300 000 €, cela représente 5,80 % x 150 000 € ≈ 8 700 €, soit bien moins que les 60 % de droits de succession ordinaires.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Pour les époux mariés, la tontine présente moins d'intérêt fiscal puisque le conjoint survivant est exonéré de droits de succession depuis 2007. En revanche, elle peut présenter un intérêt civil pour simplifier la transmission sans passer par la succession.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les inconvénients à connaître</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La clause tontinière présente plusieurs contraintes importantes à prendre en compte avant de s'engager. Premièrement, le bien est <strong className="text-[var(--color-text-strong)]">inaliénable sans l'accord des deux parties</strong> : vous ne pouvez pas vendre, donner ou hypothéquer le bien sans le consentement de l'autre. En cas de séparation conflictuelle, cette situation peut devenir problématique car, contrairement à l'indivision classique, nul ne peut demander le partage unilatéralement.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Deuxièmement, la tontine est <strong className="text-[var(--color-text-strong)]">irréversible</strong> après la signature : elle ne peut être supprimée qu'avec l'accord des deux parties, par acte notarié. De plus, le bien tontinier ne peut pas être transmis par testament à ses propres héritiers : le survivant prend tout, même si le défunt avait des enfants d'une autre relation.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Troisièmement, si l'un des acquéreurs décède peu après l'achat après avoir contribué davantage au financement, ses héritiers n'ont aucun recours pour récupérer le surplus, sauf à démontrer l'absence d'aléa ou une fraude.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle du notaire</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La clause tontinière doit être rédigée dans l'acte d'achat authentique par le notaire. Elle ne peut pas être ajoutée après coup sans vendre et racheter le bien. Le notaire vérifie l'existence d'un aléa réel, s'assure que la clause est conforme à la réglementation fiscale en vigueur et vous informe de toutes ses conséquences juridiques et fiscales avant la signature.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Il est recommandé de consulter le notaire avant de décider d'opter pour une tontine plutôt que pour d'autres mécanismes de protection (PACS, testament, assurance-vie). Chaque situation est différente, et le notaire pourra vous aider à choisir l'outil le mieux adapté à vos besoins et votre contexte familial.
      </p>

      <InternalCTA />
    </>
  );
}


/* ── Article 47 ─────────────────────────────────────────────────────────── */

function Article47() {
  return (
    <>
      <KeyPoints
        points={[
          "La clause bénéficiaire détermine qui recevra le capital de votre assurance vie à votre décès, hors succession.",
          "Une clause mal rédigée (trop vague, contradictoire ou non mise à jour) peut entraîner des conflits ou réintégrer les capitaux dans la succession.",
          "Le notaire peut conserver la clause bénéficiaire sous forme de testament authentique, garantissant sa confidentialité et sa sécurité.",
          "La clause peut être démembrée (usufruit au conjoint, nue-propriété aux enfants) pour optimiser la transmission.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">L'importance capitale de la clause bénéficiaire</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        L'assurance vie est l'outil de transmission patrimoniale le plus utilisé en France, avec plus de 1 800 milliards d'euros d'encours. Son principal atout successoral est la <strong className="text-[var(--color-text-strong)]">clause bénéficiaire</strong> : cette stipulation désigne la ou les personnes qui recevront le capital de l'assurance vie au décès de l'assuré, en dehors de la succession et donc sans droits de succession habituels (sous réserve des abattements fiscaux propres à l'assurance vie).
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Pourtant, la clause bénéficiaire est souvent négligée ou mal rédigée. Beaucoup de souscripteurs se contentent de la clause standard proposée par l'assureur ("mon conjoint, à défaut mes enfants nés ou à naître, à défaut mes héritiers") sans prendre le temps d'adapter cette formule à leur situation personnelle et familiale. Or, une clause inadaptée peut produire des effets contraires à ceux souhaités.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        La loi impose à l'assureur de verser le capital au(x) bénéficiaire(s) désigné(s) selon les termes exacts de la clause. Si la clause est imprécise, l'assureur peut avoir du mal à identifier les bénéficiaires, et le capital risque de rester bloqué ou d'être réparti de façon non souhaitée.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Rédiger une clause bénéficiaire efficace</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Une clause bénéficiaire efficace doit être <strong className="text-[var(--color-text-strong)]">précise, complète et à jour</strong>. Quelques règles essentielles :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6">
        {[
          ["Désigner les bénéficiaires nommément", "Indiquer nom, prénom, date et lieu de naissance plutôt que 'mon conjoint' qui peut désigner une personne différente en cas de divorce et remariage."],
          ["Prévoir des bénéficiaires de second rang", "En cas de prédécès du bénéficiaire principal, désigner un ou plusieurs remplaçants pour éviter que le capital revienne dans la succession."],
          ["Préciser les parts", "Si plusieurs bénéficiaires sont désignés, indiquer leur quote-part respective (par exemple 50/50, ou des proportions inégales selon vos souhaits)."],
          ["Mettre à jour régulièrement", "Tout événement familial majeur (mariage, divorce, naissance, décès) doit conduire à réviser la clause."],
        ].map(([titre, texte], i) => (
          <li key={i} className="flex gap-3 p-4 bg-[var(--color-tint-blue)] rounded-xl text-sm">
            <span className="shrink-0 font-bold text-[var(--color-accent)]">→</span>
            <div>
              <strong className="text-[var(--color-text-strong)] block mb-0.5">{titre}</strong>
              <span className="text-[var(--color-muted)]">{texte}</span>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La clause démembrée : usufruit et nue-propriété</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Une technique avancée consiste à <strong className="text-[var(--color-text-strong)]">démembrer la clause bénéficiaire</strong> : le conjoint reçoit l'usufruit du capital (il peut le consommer et perçoit les intérêts), tandis que les enfants reçoivent la nue-propriété. Au décès du conjoint, les enfants héritent du reliquat sans droits supplémentaires.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Cette technique permet d'optimiser la transmission en protégeant d'abord le conjoint (qui bénéficie des revenus du capital) tout en assurant la transmission finale aux enfants. Elle est particulièrement adaptée aux familles recomposées ou aux patrimoines importants. Sa mise en place requiert une rédaction très précise de la clause, que le notaire peut prendre en charge.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Attention : en cas de clause démembrée, une convention de quasi-usufruit entre l'usufruitier et les nus-propriétaires est vivement recommandée pour préciser les droits et obligations de chacun et éviter les conflits à terme.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle du notaire dans la clause bénéficiaire</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Le notaire peut intervenir de deux façons. D'abord, en <strong className="text-[var(--color-text-strong)]">rédigeant la clause bénéficiaire</strong> sous forme de testament authentique : cette forme offre la garantie d'une rédaction juridiquement parfaite, d'une conservation sécurisée au rang des minutes (archives notariales), et d'une inscription au Fichier Central des Dispositions de Dernières Volontés (FCDDV).
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Ensuite, le notaire intervient lors du règlement de la succession pour s'assurer que les capitaux d'assurance vie ont bien été versés aux bénéficiaires désignés et pour vérifier l'absence de primes manifestement exagérées pouvant conduire à leur réintégration dans la succession. Il est également consulté en cas de litige entre héritiers et bénéficiaires sur l'interprétation de la clause.
      </p>

      <InternalCTA />
    </>
  );
}


/* ── Article 48 ─────────────────────────────────────────────────────────── */

function Article48() {
  return (
    <>
      <KeyPoints
        points={[
          "Donner avant son décès permet de profiter des abattements fiscaux renouvelables tous les 15 ans, réduisant la future succession.",
          "La donation avec réserve d'usufruit est la stratégie la plus utilisée : vous transmettez la nue-propriété tout en conservant l'usage du bien.",
          "La donation-partage règle définitivement la répartition entre héritiers et fige les valeurs au jour de l'acte.",
          "Toute donation de bien immobilier doit être réalisée par acte notarié ; les dons de sommes d'argent peuvent être faits directement avec déclaration fiscale.",
        ]}
      />

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Pourquoi anticiper la transmission de son patrimoine ?</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La transmission du patrimoine à la génération suivante s'effectue généralement au décès, dans le cadre de la succession. Mais attendre ce moment prive les familles de nombreux avantages fiscaux et peut générer des conflits entre héritiers. Faire des donations de son vivant est une stratégie patrimoniale qui présente des avantages considérables sur les plans fiscal, civil et familial.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Sur le plan fiscal, les <strong className="text-[var(--color-text-strong)]">abattements renouvelables tous les 15 ans</strong> permettent de transmettre des sommes importantes en franchise de droits. Un couple avec deux enfants peut donner jusqu'à 400 000 € sans aucun droit de donation. En commençant les donations à 50 ans, il est possible de répéter l'opération à 65 ans, puis à 80 ans — soit jusqu'à 1 200 000 € transmis en franchise fiscale pour ce même couple.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Sur le plan civil, la donation anticipée permet de gérer sereinement la répartition du patrimoine entre ses enfants et d'éviter les conflits successoraux. Lorsque les héritiers ont déjà reçu leur part de leur vivant et dans de bonnes conditions, la succession se règle généralement plus facilement.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les principales stratégies de donation avant décès</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Plusieurs outils sont à votre disposition pour organiser votre transmission de votre vivant :
      </p>
      <ul className="list-none flex flex-col gap-3 mb-6">
        {[
          ["Donation en pleine propriété", "Le bien est transmis intégralement à l'enfant, qui en devient propriétaire immédiatement. Idéale pour aider un enfant qui a besoin d'un bien ou de liquidités maintenant."],
          ["Donation avec réserve d'usufruit", "Vous donnez la nue-propriété à vos enfants mais conservez l'usufruit (usage et revenus) jusqu'à votre décès. Droits calculés sur la seule valeur de la nue-propriété."],
          ["Donation-partage", "Vous répartissez votre patrimoine entre tous vos enfants en un seul acte. Les valeurs sont figées au jour de l'acte, prévenant les conflits futurs."],
          ["Don de sommes d'argent", "Simple, rapide et sans acte notarié obligatoire. Bénéficie d'abattements spécifiques (jusqu'à 131 865 € par enfant avec l'abattement complémentaire)."],
        ].map(([titre, texte], i) => (
          <li key={i} className="flex gap-3 p-4 bg-[var(--color-tint-blue)] rounded-xl text-sm">
            <span className="shrink-0 font-bold text-[var(--color-accent)]">→</span>
            <div>
              <strong className="text-[var(--color-text-strong)] block mb-0.5">{titre}</strong>
              <span className="text-[var(--color-muted)]">{texte}</span>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Donation et réserve héréditaire : les limites à respecter</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Toute donation doit respecter la <strong className="text-[var(--color-text-strong)]">réserve héréditaire</strong>, c'est-à-dire la part minimale garantie à chaque enfant par la loi. En présence d'un enfant, la réserve est de la moitié du patrimoine ; avec deux enfants, elle est des deux tiers ; avec trois enfants ou plus, des trois quarts. La quotité disponible (le reste) peut être transmise librement.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Si les donations consenties dépassent la quotité disponible et empiètent sur la réserve d'un héritier, celui-ci peut agir en <strong className="text-[var(--color-text-strong)]">réduction des libéralités</strong> après le décès du donateur. L'excédent peut alors lui être restitué en valeur ou en nature. Il est donc essentiel de calibrer les donations en tenant compte de la réserve héréditaire.
      </p>
      <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
        Le notaire calcule précisément la quotité disponible en fonction de la composition de votre famille et de la valeur de votre patrimoine. Il s'assure que vos projets de donation respectent les droits de chacun et vous propose des solutions pour atteindre vos objectifs dans le cadre légal.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Planifier sa succession avec un notaire</h2>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        La planification successorale est une démarche globale qui nécessite une vision d'ensemble de votre patrimoine, de votre situation familiale et de vos objectifs. Le notaire est le professionnel idéal pour vous accompagner : il analyse votre patrimoine, simule les différents scénarios de transmission, chiffre les droits dans chaque hypothèse et vous recommande la stratégie la mieux adaptée.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        Il peut combiner plusieurs outils : donations, testament, assurance-vie, SCI familiale, démembrement de propriété, donation-partage. Chacun a ses avantages et ses contraintes, et c'est leur combinaison intelligente qui permet d'atteindre l'optimum fiscal et familial.
      </p>
      <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
        N'attendez pas d'être contraint par l'urgence ou la maladie pour organiser votre succession. Plus vous anticipez, plus vous avez de marge de manœuvre pour optimiser la transmission et accompagner vos enfants au bon moment.
      </p>

      <InternalCTA />
    </>
  );
}


/* ── Article 49 ─────────────────────────────────────────────────────────── */

function Article49() {
  return (
    <>
<p className="lead">Le <strong>divorce notaire consentement mutuel</strong> est depuis 2017 la voie la plus rapide et la plus apaisée pour mettre fin à un mariage en France. Sans juge, sans audience, deux avocats et un notaire suffisent pour officialiser la séparation. Comprendre le rôle de chacun permet de vivre cette étape difficile avec plus de sérénité.</p>

<KeyPoints points={[
  "Depuis le 1er janvier 2017, le divorce par consentement mutuel ne passe plus par le juge mais par le notaire.",
  "Chaque époux doit avoir son propre avocat : c'est une condition impérative de validité.",
  "Le notaire dépose et conserve la convention de divorce signée, lui donnant force exécutoire.",
  "La procédure dure en général 2 à 4 mois pour un coût global souvent inférieur à un divorce contentieux."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le divorce par consentement mutuel sans juge depuis 2017</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La loi J21 du 18 novembre 2016 a profondément réformé le divorce par consentement mutuel en France. Depuis le 1er janvier 2017, les époux qui s'accordent sur tous les aspects de leur séparation — garde des enfants, prestation compensatoire, partage des biens — n'ont plus besoin de passer devant un juge. Le tribunal judiciaire est remplacé par le notaire, qui dépôse et conserve la convention de divorce, lui conférant force exécutoire.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Cette déjudiciarisation du divorce répond à une logique de désengorgement des tribunaux et de simplification pour les couples. Elle ne concerne cependant que les divorces véritablement consensuels : si l'un des époux est en désaccord sur un seul point, la procédure judiciaire reste obligatoire.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Exception notable : si un enfant mineur demande à être entendu par un juge, le divorce doit obligatoirement être prononcé par le tribunal judiciaire, même en cas d'accord total entre les parents.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle précis du notaire dans le divorce par consentement mutuel</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le notaire n'est pas le négociateur du divorce : ce rôle appartient aux avocats. Son intervention se situe en aval, une fois la convention rédigée et signée par les parties et leurs avocats.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Concrètement, le notaire reçoit la convention de divorce après l'expiration d'un délai de réflexion de 15 jours minimum accordé aux époux. Il vérifie la régularité formelle de l'acte et procède à son <strong className="text-[var(--color-text-strong)]">dépôt au rang de ses minutes</strong>. Ce dépôt transforme un document privé en acte authentique, qui a la même force exécutoire qu'un jugement.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le notaire se charge ensuite de transmettre l'information au service central d'état civil de Nantes, qui mentionne le divorce en marge de l'acte de mariage et de chacun des actes de naissance des ex-époux. C'est à cette date que le divorce est opposable aux tiers.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Ses émoluments pour cette mission sont fixés par décret : <strong className="text-[var(--color-text-strong)]">50 € HT par époux</strong>, soit 60 € TTC chacun. Ce montant modique s'explique par le fait que la valeur ajoutée de la procédure réside dans le travail des avocats, et non dans celui du notaire à ce stade.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le notaire et le partage des biens immobiliers lors du divorce</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Si les époux possèdent un bien immobilier commun, le notaire intervient également pour la <strong className="text-[var(--color-text-strong)]">liquidation du régime matrimonial</strong>. La convention de divorce peut prévoir le partage du bien — attribution à l'un des époux, vente amiable ou maintien en indivision — mais cet aspect requiert un acte notarié séparé.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">En cas d'attribution d'un bien immobilier à l'un des époux, ce dernier doit généralement procéder à un <strong className="text-[var(--color-text-strong)]">rachat de soulte</strong> pour compenser l'autre. Le notaire calcule ce montant et rédige l'acte authentique de partage, soumis à un droit de partage de 2,5 % sur la valeur nette du bien.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Cette liquidation immobilière peut avoir lieu avant ou après le dépôt de la convention de divorce. Le notaire coordonne ces deux volets pour garantir la cohérence juridique et fiscale de l'ensemble de la séparation patrimoniale.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La procédure pas à pas</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Voici les grandes étapes d'un divorce par consentement mutuel avec notaire :</p>
<ol className="list-decimal list-inside flex flex-col gap-3 mb-6 text-[var(--color-muted)]">
  <li className="leading-relaxed"><strong className="text-[var(--color-text-strong)]">Chaque époux choisit son avocat :</strong> ils négocient et rédigent ensemble la convention de divorce.</li>
  <li className="leading-relaxed"><strong className="text-[var(--color-text-strong)]">Signature de la convention :</strong> les deux époux signent après avoir reçu le projet depuis au moins 15 jours.</li>
  <li className="leading-relaxed"><strong className="text-[var(--color-text-strong)]">Dépôt chez le notaire :</strong> les avocats transmettent la convention signée au notaire qui procède au dépôt dans les 7 jours.</li>
  <li className="leading-relaxed"><strong className="text-[var(--color-text-strong)]">Transcription à l'état civil :</strong> le divorce est mentionné sur les actes d'état civil des ex-époux.</li>
  <li className="leading-relaxed"><strong className="text-[var(--color-text-strong)]">Partage des biens :</strong> si besoin, le notaire rédige l'acte de liquidation-partage du régime matrimonial.</li>
</ol>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">La durée totale de la procédure est généralement de <strong className="text-[var(--color-text-strong)]">2 à 4 mois</strong>, bien inférieure à celle d'un divorce judiciaire qui peut prendre 1 à 2 ans.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Coût global et avantages de la procédure</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le coût d'un divorce par consentement mutuel comprend principalement les honoraires des deux avocats (librement fixés, souvent entre 1 500 € et 3 000 € pour chacun, selon la complexité), les émoluments du notaire (60 € TTC par époux) et, le cas échéant, les frais de partage immobilier.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Malgré ces honoraires d'avocats, la procédure reste souvent moins onéreuse et surtout moins longue et moins éprouvante qu'un divorce judiciaire. Elle permet aux ex-époux de garder la maîtrise de leur séparation et de préserver de meilleures relations futures, notamment pour la coparentalité.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Pour toute question sur le partage de vos biens ou la liquidation de votre régime matrimonial, un notaire peut vous accompagner dès les premières réflexions sur votre divorce.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 50 ─────────────────────────────────────────────────────────── */

function Article50() {
  return (
    <>
<p className="lead">Le <strong>mandat de protection future notaire</strong> est un acte préventif qui vous permet de désigner dès aujourd'hui la personne qui gérera vos affaires si vous perdez un jour votre autonomie. Cet outil méconnu mais puissant vous donne la liberté d'organiser votre protection selon votre volonté, avant toute altération de vos facultés.</p>

<KeyPoints points={[
  "Le mandat de protection future se prépare quand vous êtes encore en pleine capacité, pour anticiper l'avenir.",
  "La forme notariée permet de couvrir aussi bien la protection de la personne que la gestion du patrimoine.",
  "Le mandat n'entre en vigueur qu'en cas d'altération médicalement constatée de vos facultés.",
  "C'est une alternative préférable à la tutelle ou curatelle, car vous en définissez librement les contours."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qu'est-ce que le mandat de protection future ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Institué par la loi du 5 mars 2007, le mandat de protection future (MPF) est un contrat par lequel une personne (le mandant) désigne par avance une autre personne (le mandataire) pour la représenter et gérer ses intérêts si elle devient incapable de le faire elle-même. Cette incapacité peut résulter d'une maladie dégénérative, d'un accident, d'un handicap grave ou du vieillissement.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">L'originalité du MPF est de permettre à chacun d'organiser librement sa propre protection, en choisissant son mandataire (conjoint, enfant, ami proche ou professionnel), en définissant l'étendue de ses pouvoirs et en précisant ses souhaits personnels concernant sa vie quotidienne.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Le mandat demeure dormant tant que le mandant conserve ses facultés. Il n'entre en vigueur que sur présentation d'un certificat médical établi par un médecin inscrit sur la liste du procureur de la République, attestant de l'altération des facultés du mandant. Ce mécanisme garantit qu'aucune mise sous protection ne peut intervenir à l'insu ou contre la volonté du mandant.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Mandat notarié ou sous seing privé : quelle différence ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le mandat de protection future peut être établi sous deux formes :</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Le mandat sous seing privé</strong> est rédigé sur un formulaire homologué, contresigné par un avocat. Il couvre uniquement la protection de la personne : choix du lieu de résidence, décisions médicales, organisation de la vie quotidienne. La gestion du patrimoine en est exclue.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Le mandat notarié</strong> offre une protection complète : il englobe à la fois la personne et le patrimoine. Le mandataire pourra accomplir tous les actes d'administration courante (payer les factures, percevoir les loyers, gérer les comptes), mais aussi certains actes de disposition (vendre un bien, faire une donation) si le mandat lui en confère expressément le pouvoir. Pour les actes les plus importants, une autorisation judiciaire reste nécessaire.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Le notaire conseille systématiquement la forme authentique pour une protection patrimoniale réelle. Il adapte les clauses à la situation personnelle du mandant : composition de son patrimoine, fragilités particulières, personnes à protéger.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment rédiger un mandat de protection future chez le notaire ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La rédaction du mandat de protection future notarié suit plusieurs étapes. Lors du premier rendez-vous, le notaire recueille vos souhaits et analyse votre situation patrimoniale et familiale. Il vous guide dans le choix du mandataire — une décision cruciale qui doit tenir compte de la confiance, de la disponibilité et des compétences de la personne désignée.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le mandat précise ensuite l'étendue des pouvoirs confiés : pouvoirs d'administration simple, pouvoirs de disposition, possibilité de délégation. Il peut également intégrer des dispositions relatives à la protection de la personne : souhait d'être maintenu à domicile, instructions médicales, désignation d'une personne de confiance au sens du Code de la santé publique.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Le coût d'un mandat de protection future notarié est modéré : comptez environ 150 à 300 € TTC pour la rédaction et l'enregistrement, selon la complexité des dispositions souhaitées.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">MPF et mesures judiciaires : quelle articulation ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le mandat de protection future est une alternative aux mesures de protection judiciaire que sont la sauvegarde de justice, la curatelle et la tutelle. Si un MPF est en place, le juge des tutelles n'a pas à intervenir, sauf si le mandat se révèle insuffisant ou si le mandataire faillit à sa mission.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">En revanche, si aucun mandat n'a été établi, la famille devra saisir le tribunal judiciaire pour faire ouvrir une mesure de protection. Cette procédure est plus longue, plus coûteuse et surtout moins personnalisée que le MPF, qui reflète vos propres choix.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Le mandataire rend compte de sa gestion chaque année au notaire (dans le cadre du mandat notarié) ou au greffe du tribunal. Cette supervision garantit la transparence et la protection des intérêts du mandant.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 51 ─────────────────────────────────────────────────────────── */

function Article51() {
  return (
    <>
<p className="lead">L'<strong>adoption notaire procédure</strong> soulève de nombreuses questions : quand le notaire intervient-il, quels actes doit-il rédiger, quelles sont les conséquences successorales ? Que vous envisagiez une adoption simple ou plénière, comprendre le rôle du notaire vous aidera à sécuriser cette démarche profondément humaine et juridiquement complexe.</p>

<KeyPoints points={[
  "L'adoption est prononcée par le tribunal judiciaire, mais le notaire intervient pour le consentement et les aspects successoraux.",
  "L'adoption plénière est irrévocable et rompt tous liens avec la famille d'origine.",
  "L'adoption simple maintient les liens biologiques et peut être révoquée sous conditions strictes.",
  "L'adopté plénièrement hérite comme un enfant biologique avec les mêmes droits et abattements fiscaux."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le cadre juridique de l'adoption en France</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">L'adoption est régie par les articles 343 à 370-5 du Code civil. La loi du 21 février 2022 relative à la protection des enfants a modernisé le droit de l'adoption français, notamment en relevant l'âge minimum de l'adoptant de 28 à 26 ans et en ouvrant l'adoption plénière à de nouvelles situations.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">On distingue deux formes d'adoption : l'<strong className="text-[var(--color-text-strong)]">adoption plénière</strong>, qui substitue entièrement la filiation adoptive à la filiation d'origine, et l'<strong className="text-[var(--color-text-strong)]">adoption simple</strong>, qui crée un nouveau lien de filiation sans supprimer l'ancien. La première est irrévocable, la seconde peut être révoquée par le tribunal pour motifs graves.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Dans tous les cas, c'est le tribunal judiciaire qui prononce l'adoption. Le notaire n'est pas l'acteur principal de la procédure d'adoption elle-même, mais il intervient à des étapes cruciales de la démarche.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Quand le notaire intervient-il dans une adoption ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Pour le consentement à l'adoption :</strong> lorsque les parents biologiques d'un enfant consentent à son adoption, ce consentement peut être recueilli par acte notarié. Cette forme authentique garantit la réalité et la liberté du consentement, et lui confère une force probante supérieure à un acte sous seing privé. Le consentement est rétractable pendant 2 mois.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Pour l'adoption d'un majeur :</strong> l'adoption d'une personne majeure requiert son consentement personnel et celui de ses parents s'il est âgé de moins de 21 ans. Le notaire peut rédiger l'acte de consentement de l'adopté majeur, formalisant son accord libre et éclairé à être adopté.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Pour les aspects patrimoniaux :</strong> après le prononcé de l'adoption, le notaire intervient pour organiser la transmission du patrimoine de l'adoptant vers l'adopté, qu'il s'agisse d'une donation ou de la rédaction d'un testament. Il explique également les conséquences de l'adoption sur la succession en cours ou à venir.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed"><strong className="text-[var(--color-text-strong)]">En adoption internationale :</strong> le notaire peut être sollicité pour authentifier des documents français destinés à être utilisés à l'étranger, ou pour apostiller des actes étrangers afin de les rendre valides en France.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Conséquences successorales de l'adoption</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les conséquences successorales diffèrent fondamentalement selon le type d'adoption :</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">En <strong className="text-[var(--color-text-strong)]">adoption plénière</strong>, l'adopté acquiert le même statut qu'un enfant biologique dans la famille adoptive. Il bénéficie de la réserve héréditaire, de l'abattement fiscal de 100 000 € par parent pour les donations et les successions, et il perd tout droit dans sa famille d'origine (sauf succession entre l'adopté et ses descendants et ascendants biologiques directs pour les liens antérieurs).</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">En <strong className="text-[var(--color-text-strong)]">adoption simple</strong>, l'adopté hérite dans les deux familles. Il est héritier réservataire de l'adoptant et conserve ses droits dans sa famille d'origine. Fiscalement, il bénéficie également de l'abattement de 100 000 € dans la famille adoptive. Si l'adoptant décède sans autre descendant, l'adopté simple peut se voir imposer un droit de retour légal des biens donnés par les parents biologiques.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Ces règles complexes nécessitent une analyse personnalisée par un notaire, notamment lorsque l'adoptant a des enfants d'une précédente union ou un patrimoine important à organiser.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Adoption et protection du patrimoine familial</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">L'adoption peut susciter des inquiétudes légitimes chez les autres membres de la famille, notamment les enfants biologiques de l'adoptant qui voient leur part d'héritage potentiellement réduite. Le notaire joue ici un rôle pédagogique essentiel : il explique à chacun les conséquences réelles et organise, si nécessaire, des donations anticipées pour maintenir l'équité familiale.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Il peut également rédiger un testament prenant en compte la nouvelle configuration familiale, ou conseiller sur l'utilisation de l'assurance-vie pour avantager certains bénéficiaires sans impact sur les droits successoraux des héritiers réservataires.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Que vous soyez à l'initiative d'une adoption ou que vous souhaitiez en comprendre les conséquences pour votre famille, un notaire spécialisé en droit de la famille est votre interlocuteur idéal pour anticiper sereinement toutes les implications juridiques et patrimoniales.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 52 ─────────────────────────────────────────────────────────── */

function Article52() {
  return (
    <>
<p className="lead">Le <strong>partage des biens après divorce notaire</strong> est souvent la partie la plus complexe et la plus onéreuse d'une séparation. Liquidation du régime matrimonial, partage immobilier, soulte, droit de partage : autant de notions techniques que le notaire maîtrise et vous explique pour que vous puissiez aborder cette étape avec clarté et sérénité.</p>

<KeyPoints points={[
  "La liquidation du régime matrimonial doit intervenir après le divorce, souvent devant notaire.",
  "Dès qu'un bien immobilier est en jeu, le recours au notaire est obligatoire pour l'acte de partage.",
  "Un droit de partage de 2,5 % s'applique sur l'actif net partagé.",
  "Le rachat de soulte permet à un époux de conserver le logement familial en rachetant la part de l'autre."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qu'est-ce que la liquidation du régime matrimonial ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Lorsqu'un couple divorce, il ne suffit pas de prononcer la dissolution du mariage. Il faut également procéder à la <strong className="text-[var(--color-text-strong)]">liquidation du régime matrimonial</strong>, c'est-à-dire déterminer quels biens appartiennent à chaque époux et comment les biens communs (ou indivis) doivent être répartis. Cette opération peut prendre des semaines ou des mois selon la complexité du patrimoine.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La nature et le contenu de cette liquidation dépendent directement du régime matrimonial des époux. En <strong className="text-[var(--color-text-strong)]">communauté légale</strong>, tous les biens acquis pendant le mariage sont communs et doivent être partagés. En <strong className="text-[var(--color-text-strong)]">séparation de biens</strong>, chaque époux reprend ses biens personnels, mais des créances peuvent exister entre eux. En <strong className="text-[var(--color-text-strong)]">communauté universelle</strong>, l'intégralité du patrimoine est à partager.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Cette opération est souvent concomitante au divorce en cas de consentement mutuel : la convention de divorce intègre ou anticipe les modalités de liquidation. En cas de divorce contentieux, la liquidation intervient souvent après le prononcé du divorce.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle central du notaire dans le partage des biens</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le notaire est obligatoire dès lors que le patrimoine à partager comprend un bien immobilier. Il dresse l'<strong className="text-[var(--color-text-strong)]">acte liquidatif</strong>, document synthétique qui récapitule l'ensemble des biens communs, les éventuelles récompenses (sommes dues entre époux pour des apports de biens propres dans la communauté ou inversement), et la répartition finale.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Il procède à l'estimation des biens immobiliers, généralement en s'appuyant sur une expertise ou une étude du marché local. Il vérifie la situation hypothécaire des biens et l'existence d'éventuels prêts en cours qui conditionnent la faisabilité du partage.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">L'acte de partage immobilier est ensuite publié au service de la publicité foncière, pour être opposable aux tiers. Sans cette publication, le partage ne peut être invoqué contre les créanciers ou les futurs acquéreurs des biens.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rachat de soulte : conserver le logement familial</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Lorsqu'un époux souhaite conserver le logement familial, il doit racheter la quote-part de l'autre. Cette opération s'appelle le <strong className="text-[var(--color-text-strong)]">rachat de soulte</strong>. Le notaire calcule le montant de la soulte sur la base de la valeur vénale du bien, déduction faite du capital restant dû sur les prêts immobiliers.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Exemple : pour un appartement valant 400 000 € avec un prêt restant de 100 000 €, l'actif net est de 300 000 €. La soulte à verser à l'ex-conjoint représente 150 000 € (la moitié de l'actif net en régime de communauté égale).</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Le rachat de soulte peut être financé par un nouveau prêt immobilier que l'époux qui conserve le bien devra contracter à titre personnel. Le notaire accompagne cette restructuration et rédige les actes nécessaires à la sortie de l'indivision.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le droit de partage et les coûts à prévoir</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le partage des biens est soumis à un <strong className="text-[var(--color-text-strong)]">droit de partage de 2,5 %</strong> (article 746 du Code général des impôts) calculé sur l'actif net partagé. Ce droit fiscal s'applique à la valeur des biens partagés, qu'il s'agisse d'un immeuble, d'un portefeuille de valeurs mobilières ou d'une liquidité.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Aux côtés de ce droit, les émoluments du notaire sont calculés selon un barème dégressif réglementé. Pour un partage portant sur un actif net de 300 000 €, les frais totaux (droit de partage + émoluments + débours) avoisinent 12 000 à 18 000 €.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Il est important d'anticiper ces coûts lors de la négociation de la convention de divorce. Un notaire peut vous établir une simulation précise des frais de partage avant même l'ouverture de la procédure de divorce, pour vous permettre de prendre des décisions éclairées.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 53 ─────────────────────────────────────────────────────────── */

function Article53() {
  return (
    <>
<p className="lead">La <strong>tutelle curatelle notaire procédure</strong> : deux mesures de protection judiciaire pour les majeurs vulnérables, et un notaire souvent indispensable pour gérer leur patrimoine. Comprendre ces dispositifs permet d'anticiper et de protéger efficacement un proche en perte d'autonomie.</p>

<KeyPoints points={[
  "La curatelle accompagne le majeur pour les actes importants sans le représenter entièrement.",
  "La tutelle représente le majeur pour tous les actes, c'est la mesure la plus contraignante.",
  "Le notaire intervient obligatoirement pour les actes patrimoniaux importants sous mesure de protection.",
  "Le mandat de protection future notarié permet d'anticiper et d'éviter ces procédures judiciaires."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Curatelle et tutelle : deux mesures différentes</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">curatelle</strong> est la mesure de protection intermédiaire. Le majeur sous curatelle conserve sa capacité juridique pour les actes courants de la vie (achats quotidiens, décisions médicales ordinaires), mais doit être assisté par son curateur pour les actes plus importants comme vendre un bien immobilier, contracter un emprunt ou ouvrir un compte bancaire. Il s'agit d'une mesure d'assistance, non de représentation.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">tutelle</strong> est la mesure la plus protectrice et la plus restrictive. Le majeur sous tutelle est représenté par son tuteur pour tous les actes de la vie civile. Il perd sa capacité juridique générale, sous réserve des actes strictement personnels (mariage, divorce, testament, reconnaissance d'un enfant) qu'il peut encore accomplir seul ou avec l'autorisation du juge.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Entre ces deux mesures existe également la <strong className="text-[var(--color-text-strong)]">sauvegarde de justice</strong>, mesure temporaire et légère, et la <strong className="text-[var(--color-text-strong)]">habilitation familiale</strong>, permettant à un proche d'agir sans procédure lourde dans les situations les plus simples.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La procédure d'ouverture d'une mesure de protection</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La procédure est déclenchée par une requête adressée au juge des contentieux de la protection (anciennement juge des tutelles) du tribunal judiciaire du lieu de résidence de la personne à protéger. Cette requête peut être déposée par la personne elle-même, un proche parent (conjoint, enfant, frère ou sœur), le procureur de la République ou un médecin.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le juge ordonne une expertise médicale par un médecin inscrit sur une liste spéciale. Après examen du rapport médical et audition de la personne concernée, il prononce la mesure de protection adaptée à la situation et désigne le tuteur ou curateur.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">La mesure est révisée périodiquement — tous les 5 ans pour la curatelle et la tutelle, mais le juge peut fixer une durée plus longue (jusqu'à 20 ans) si l'état de la personne le justifie. Elle peut être allégée, renforcée ou levée selon l'évolution de la situation.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle du notaire sous mesure de protection</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le notaire n'est pas le tuteur ou curateur, mais il est régulièrement sollicité par les personnes exerçant ces fonctions pour accomplir certains actes. Son rôle est essentiel dans la gestion du patrimoine du majeur protégé.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">vente d'un bien immobilier</strong> appartenant à un majeur protégé nécessite obligatoirement l'autorisation du juge des tutelles ET la rédaction d'un acte notarié. Le notaire vérifie que l'autorisation judiciaire est bien obtenue avant de procéder à la vente, protégeant ainsi les intérêts du majeur et du vendeur.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">De même, toute <strong className="text-[var(--color-text-strong)]">donation consentie par le tuteur</strong> au nom du majeur protégé nécessite une autorisation du juge, puis un acte notarié. Le notaire s'assure de la conformité de l'opération avec les intérêts de la personne protégée et les exigences légales.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Le <strong className="text-[var(--color-text-strong)]">testament d'un majeur protégé</strong> est un cas particulier : même sous tutelle, le majeur peut tester s'il bénéficiait d'une lucidité au moment de la rédaction. Le notaire est l'interlocuteur privilégié pour sécuriser cet acte et attester de la réalité du consentement.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Anticiper avec le mandat de protection future</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La meilleure protection reste celle que l'on organise soi-même, avant d'en avoir besoin. Le <strong className="text-[var(--color-text-strong)]">mandat de protection future notarié</strong> permet de désigner par avance la personne de confiance qui gèrera votre patrimoine et prendra soin de votre personne si vous perdez un jour votre autonomie.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Ce mandat entre en vigueur uniquement en cas d'altération médicalement constatée de vos facultés. Tant que vous êtes en pleine capacité, il reste dormant. Il évite le recours aux mesures judiciaires contraignantes que sont la tutelle et la curatelle, tout en offrant une protection sur mesure, adaptée à votre situation personnelle et patrimoniale.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Prendre rendez-vous avec un notaire pour établir un mandat de protection future est une démarche de prévoyance responsable, que ce soit pour vous-même ou pour anticiper la situation d'un parent vieillissant.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 54 ─────────────────────────────────────────────────────────── */

function Article54() {
  return (
    <>
<p className="lead">La <strong>procuration notaire achat immobilier</strong> est la solution pour signer un acte de vente lorsque vous ne pouvez pas être physiquement présent. Qu'il s'agisse d'un déplacement professionnel, d'une expatriation ou d'une impossibilité temporaire, la procuration authentique permet de mener votre projet immobilier à terme sans délai.</p>

<KeyPoints points={[
  "Une procuration pour acte notarié doit elle-même être un acte notarié authentique.",
  "Le mandataire désigné signe en votre nom et pour votre compte, avec les mêmes effets juridiques.",
  "La procuration doit être suffisamment précise pour couvrir tous les aspects de l'acte de vente.",
  "Son coût est modique (75 à 150 € TTC) au regard de la sécurité qu'elle procure."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Pourquoi une procuration notariée est-elle nécessaire ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Un acte d'achat immobilier est un acte authentique notarié. Pour qu'une personne puisse signer cet acte à votre place, elle doit disposer d'une <strong className="text-[var(--color-text-strong)]">procuration elle-même authentique</strong>, c'est-à-dire rédigée devant notaire. Une procuration sous seing privé (simple lettre signée) ne suffit pas pour signer un acte de vente immobilière.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Cette exigence d'authenticité garantit plusieurs choses : la réalité de votre consentement (le notaire a vérifié votre identité et recueilli votre accord), la portée exacte des pouvoirs conférés (l'acte précise ce que le mandataire peut et ne peut pas faire), et la date certaine de la procuration.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">La procuration peut être établie chez n'importe quel notaire français ou, à l'étranger, devant un notaire local ou un consulat français habilité. Dans ce dernier cas, un apostille peut être nécessaire pour la faire reconnaître en France.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment rédiger une procuration efficace pour un achat immobilier ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La procuration doit être suffisamment <strong className="text-[var(--color-text-strong)]">précise et complète</strong> pour couvrir toutes les opérations liées à l'achat. Un notaire expérimenté saura rédiger une procuration adaptée qui autorise le mandataire à :</p>
<ul className="list-disc list-inside flex flex-col gap-2 mb-6 text-[var(--color-muted)]">
  <li className="leading-relaxed">Signer l'acte authentique de vente aux prix, charges et conditions convenus</li>
  <li className="leading-relaxed">Accepter tous les diagnostics techniques et l'état des risques du bien</li>
  <li className="leading-relaxed">Payer le prix de vente et les frais d'acte</li>
  <li className="leading-relaxed">Prendre possession du bien et recevoir les clés</li>
  <li className="leading-relaxed">Signer tout document annexe nécessaire à la validité de l'acte</li>
</ul>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Une procuration trop vague risque d'être refusée par le notaire instrumentant l'acte de vente. À l'inverse, une procuration trop restrictive peut bloquer la signature si un document imprévu doit être signé le jour J.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Il est donc recommandé de contacter en amont le notaire rédacteur de l'acte de vente pour lui demander un modèle de procuration adapté à la transaction envisagée. Certains notaires transmettent directement le projet de procuration à leur confrère chargé de la recevoir.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qui peut être mandataire dans une procuration immobilière ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le mandataire peut être toute personne majeure et capable, que vous désignez librement : un membre de votre famille (conjoint, enfant, parent, frère ou sœur), un ami de confiance, ou même un professionnel comme un agent immobilier ou un avocat. Il n'y a pas de lien familial requis.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">En pratique, les époux se donnent souvent mutuellement procuration, chacun pouvant ainsi agir seul si l'autre est indisponible. Cette solution présente l'avantage d'être simple et de reposer sur une relation de confiance préexistante.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Attention : le mandataire ne peut pas signer une procuration à son propre profit. Il agit strictement en votre nom et pour votre compte. Les effets juridiques de l'acte signé par procuration sont identiques à ceux d'un acte signé en personne.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Coût, durée de validité et précautions pratiques</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le coût d'une procuration notariée pour achat immobilier est modeste : comptez entre <strong className="text-[var(--color-text-strong)]">75 et 150 € TTC</strong> en France, selon le notaire et la complexité de l'acte. Si la procuration est établie à l'étranger, des frais supplémentaires s'appliquent (frais consulaires, traduction assermentée, apostille).</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Aucune durée légale de validité n'est imposée, mais les notaires recommandent de ne pas laisser s'écouler plus de <strong className="text-[var(--color-text-strong)]">3 mois</strong> entre la signature de la procuration et l'acte de vente. Une procuration ancienne peut susciter des doutes sur la persistance de votre consentement et de votre capacité.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Prenez soin de transmettre l'original ou une copie authentique de la procuration au notaire rédacteur de l'acte de vente bien avant la date de signature, pour lui permettre de vérifier sa conformité et d'anticiper tout problème éventuel.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 55 ─────────────────────────────────────────────────────────── */

function Article55() {
  return (
    <>
<p className="lead"><strong>Changer de régime matrimonial chez le notaire</strong> est une démarche de plus en plus fréquente. Que vous souhaitiez passer de la séparation de biens à la communauté pour mieux protéger votre conjoint, ou l'inverse pour sécuriser votre activité professionnelle, le notaire est votre guide indispensable dans cette procédure.</p>

<KeyPoints points={[
  "Le changement de régime matrimonial est possible après 2 ans d'application du régime actuel.",
  "L'acte notarié est obligatoire : le notaire rédige la convention modificatrice.",
  "Depuis 2007, l'homologation judiciaire n'est plus requise sauf en cas d'opposition.",
  "Les créanciers et enfants majeurs doivent être informés et peuvent s'opposer au changement."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Pourquoi changer de régime matrimonial ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les raisons de modifier son régime matrimonial sont nombreuses et reflètent souvent l'évolution de la situation personnelle ou professionnelle du couple. La modification la plus fréquente est le passage de la <strong className="text-[var(--color-text-strong)]">séparation de biens à la communauté universelle</strong>, souvent motivé par le désir de protéger le conjoint survivant lorsque les enfants sont grands et que la problématique de séparation ne se pose plus.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">À l'inverse, un entrepreneur ou un professionnel libéral qui a contracté des dettes ou qui craint une procédure de liquidation peut souhaiter passer à la <strong className="text-[var(--color-text-strong)]">séparation de biens</strong> pour protéger le patrimoine personnel de son conjoint des aléas professionnels.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">D'autres situations courantes incluent l'ajout d'une clause d'attribution intégrale au conjoint survivant, la création d'une société d'acquêts limitée, ou le passage à la participation aux acquêts pour mieux refléter les contributions réelles de chacun tout en maintenant l'indépendance au quotidien.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les conditions pour changer de régime matrimonial</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Trois conditions cumulatives sont requises pour modifier son régime matrimonial :</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Le délai de 2 ans :</strong> le régime actuel doit avoir été appliqué pendant au moins deux ans. Cette condition vise à éviter les changements opportunistes réalisés pour frauder les créanciers. Elle s'applique que le régime soit d'origine légale (absence de contrat) ou contractuelle.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">L'accord des deux époux :</strong> le changement est une décision commune. Aucun époux ne peut imposer à l'autre un changement de régime matrimonial. La convention modificatrice doit être signée par les deux parties devant notaire.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed"><strong className="text-[var(--color-text-strong)]">L'intérêt de la famille :</strong> le changement doit être justifié par l'intérêt de la famille, condition appréciée par le notaire. Il doit notamment vérifier que la modification ne lèse pas indûment les créanciers ou les enfants.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La procédure devant notaire</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le changement de régime matrimonial suit une procédure précise. Le notaire reçoit les deux époux lors d'un premier rendez-vous pour analyser la situation patrimoniale, comprendre les objectifs du couple et rédiger la convention de changement de régime.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le notaire adresse ensuite une <strong className="text-[var(--color-text-strong)]">notification aux créanciers</strong> connus des époux, qui disposent de 3 mois pour s'opposer au changement. Cette opposition n'est possible que si elle est fondée sur la crainte de préjudice pour les droits du créancier.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les <strong className="text-[var(--color-text-strong)]">enfants majeurs</strong> doivent également être informés et peuvent s'opposer. En cas d'opposition non réglée à l'amiable, le juge est saisi pour statuer sur le bien-fondé du changement.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">En l'absence d'opposition, la convention est signée et publiée dans un journal d'annonces légales pour être opposable aux tiers. Le notaire procède aux formalités de publicité foncière si des immeubles sont concernés par le changement de régime.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Coût et implications fiscales</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les frais d'un changement de régime matrimonial comprennent les émoluments réglementés du notaire (environ 510 € HT), les frais de publicité légale (50 à 150 €) et les éventuels droits de mutation si des biens immobiliers sont transférés d'un patrimoine à l'autre dans le cadre du changement.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le passage à la communauté universelle peut déclencher un droit d'apport de biens propres dans la communauté, taxé à hauteur de 2,5 %. Une planification rigoureuse avec votre notaire permet d'optimiser ce coût fiscal.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Le changement de régime peut également avoir des conséquences sur l'impôt sur le revenu, la taxe foncière, les droits de succession ou les obligations déclaratives vis-à-vis de l'administration fiscale. Votre notaire coordonnera ces aspects avec votre conseiller fiscal pour une cohérence d'ensemble.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 56 ─────────────────────────────────────────────────────────── */

function Article56() {
  return (
    <>
<p className="lead">Le <strong>PACS chez le notaire avantages fiscaux</strong> : de plus en plus de couples choisissent le Pacte Civil de Solidarité plutôt que le mariage pour ses souplesses et ses bénéfices fiscaux. Mais qu'offre réellement le PACS en termes de protection patrimoniale et fiscale ? Et pourquoi le faire chez un notaire plutôt qu'en mairie ?</p>

<KeyPoints points={[
  "Le PACS offre l'imposition commune dès l'année de sa conclusion, un avantage fiscal immédiat.",
  "Les partenaires pacsés sont exonérés de droits de succession sur les legs mutuels.",
  "Sans testament, le partenaire pacsé n'hérite de rien : le testament est indispensable.",
  "Le PACS notarié permet une convention sur mesure avec des clauses patrimoniales adaptées."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qu'est-ce que le PACS et comment le conclure ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le Pacte Civil de Solidarité (PACS), créé par la loi du 15 novembre 1999, est un contrat conclu entre deux personnes majeures, de sexe différent ou de même sexe, pour organiser leur vie commune. Depuis le 1er novembre 2017, l'enregistrement du PACS relève des officiers d'état civil en mairie, et non plus du greffe du tribunal judiciaire.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le PACS peut également être conclu chez un notaire. Bien que cette voie ne soit pas obligatoire, elle présente des avantages significatifs : le notaire peut rédiger une convention de PACS sur mesure, intégrant des dispositions patrimoniales personnalisées (indivision des biens, quote-parts différentes, etc.), ce que le formulaire standard de mairie ne permet pas.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Le PACS conclu en mairie est gratuit. Chez le notaire, comptez environ 250 à 500 € TTC selon la complexité de la convention. Cet investissement est souvent justifié pour les couples ayant un patrimoine significatif ou des objectifs patrimoniaux spécifiques.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les avantages fiscaux du PACS</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le PACS offre plusieurs avantages fiscaux importants qui le rapprochent du mariage :</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">L'imposition commune :</strong> dès l'année de conclusion du PACS, les partenaires sont soumis à une imposition commune sur leurs revenus. Ce quotient familial peut générer une économie d'impôt significative lorsque les revenus des deux partenaires sont déséquilibrés.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Les donations entre partenaires :</strong> elles bénéficient d'un abattement de 80 724 € (renouvelable tous les 15 ans), identique à celui du mariage. Au-delà, le barème applicable est le même que pour les époux.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">La succession et les legs :</strong> les partenaires pacsés sont totalement exonérés de droits de succession sur les legs reçus l'un de l'autre, au même titre que les époux mariés. Cette exonération est cependant conditionnée à l'existence d'un testament : sans testament, le partenaire pacsé ne reçoit rien.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed"><strong className="text-[var(--color-text-strong)]">L'ISF/IFI :</strong> les partenaires pacsés sont soumis à l'Impôt sur la Fortune Immobilière (IFI) sur la base de leurs patrimoines combinés, comme les époux mariés.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La protection du partenaire survivant : le rôle clé du testament</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">C'est la limite fondamentale du PACS : contrairement au mariage, le PACS ne confère aucun droit successoral légal au partenaire survivant. En l'absence de testament, le partenaire pacsé ne reçoit absolument rien du patrimoine de son partenaire décédé, même après de nombreuses années de vie commune.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Il est donc impératif, pour les partenaires souhaitant se protéger mutuellement, de rédiger chacun un <strong className="text-[var(--color-text-strong)]">testament</strong>. Le testament permet de léguer tout ou partie de la quotité disponible (la part non réservée aux héritiers réservataires) au partenaire survivant.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">L'<strong className="text-[var(--color-text-strong)]">assurance-vie</strong> constitue un autre outil complémentaire puissant : en désignant le partenaire comme bénéficiaire, les sommes versées bénéficient d'une fiscalité très avantageuse et ne font pas partie de la succession civile. Le notaire peut vous guider sur la combinaison optimale testament + assurance-vie pour votre situation.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">PACS ou mariage : quelle différence pour la protection ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Sur le plan fiscal, PACS et mariage sont aujourd'hui quasi identiques : imposition commune, mêmes abattements pour les donations et successions, même exonération de droits de succession. La différence principale reste la protection légale automatique du conjoint marié (droit au logement, usufruit légal, droits successoraux légaux) que le PACS ne prévoit pas.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le PACS est plus facile à dissoudre que le mariage : il suffit d'une déclaration conjointe ou d'une décision unilatérale notifiée à l'autre partenaire. Cette souplesse peut être un avantage ou un inconvénient selon les situations.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Le notaire peut vous aider à évaluer objectivement les avantages respectifs du PACS et du mariage au regard de votre situation patrimoniale, familiale et professionnelle, pour faire le choix le mieux adapté à votre projet de vie commun.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 57 ─────────────────────────────────────────────────────────── */

function Article57() {
  return (
    <>
<p className="lead">Le <strong>contrat de mariage communauté réduite aux acquêts</strong> est le régime matrimonial légal en France. Sans contrat de mariage chez le notaire, vous êtes automatiquement soumis à ce régime. Comprendre son fonctionnement détaillé vous permettra de mieux gérer votre patrimoine conjugal et d'anticiper les conséquences d'un éventuel divorce ou d'un décès.</p>

<KeyPoints points={[
  "La communauté réduite aux acquêts est le régime par défaut : tout bien acquis pendant le mariage est commun.",
  "Les biens propres (antérieurs au mariage, donations, héritages) restent la propriété exclusive de chaque époux.",
  "Un époux peut racheter un bien propre mis dans la communauté grâce à la clause de remploi.",
  "Les dettes ménagères sont solidaires ; les dettes professionnelles personnelles restent en principe propres."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le principe : biens propres et biens communs</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La communauté réduite aux acquêts, régie par les articles 1401 à 1491 du Code civil, repose sur une distinction fondamentale entre deux masses de biens coexistant pendant le mariage.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les <strong className="text-[var(--color-text-strong)]">biens propres</strong> de chaque époux comprennent : les biens possédés avant le mariage, ceux reçus par donation ou succession pendant le mariage (même de valeur importante), les biens achetés avec des fonds propres (sous réserve d'une déclaration de remploi), les biens personnels comme les vêtements, les instruments de travail, et les créances et droits exclusivement attachés à la personne (indemnités pour préjudice corporel).</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les <strong className="text-[var(--color-text-strong)]">biens communs</strong> comprennent tous les revenus des époux (salaires, loyers, dividendes), tous les biens acquis à titre onéreux pendant le mariage, et les biens dont on ne peut pas prouver le caractère propre. La règle est claire : tout ce qui n'est pas prouvé propre est présumé commun.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Cette présomption de communauté est une règle de fond essentielle à comprendre : en cas de doute, le bien est commun. La preuve du caractère propre incombe à l'époux qui le revendique.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La gestion des biens communs et la solidarité ménagère</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Chaque époux peut accomplir seul les <strong className="text-[var(--color-text-strong)]">actes d'administration</strong> des biens communs (louer un bien commun, engager un artisan pour des réparations ordinaires, ouvrir un compte bancaire joint). En revanche, les actes de disposition les plus importants — vendre ou hypothéquer un bien immobilier commun — requièrent le consentement des deux époux.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">solidarité ménagère</strong> est un mécanisme essentiel du régime légal : les deux époux sont solidairement responsables des dettes contractées par l'un d'eux pour les besoins du ménage ou l'éducation des enfants. En pratique, un créancier peut poursuivre indifféremment l'un ou l'autre époux pour des dettes de ménage, même si seul l'un d'eux a contracté la dette.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Cette solidarité ne s'applique pas aux dettes excessives au regard du train de vie du ménage ni aux achats à tempérament non consentis par les deux époux. Le notaire peut vous aider à identifier les limites de cette solidarité dans votre situation concrète.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La technique du remploi : protéger ses fonds propres</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Si vous souhaitez acheter un bien immobilier pendant le mariage avec des fonds propres (héritage, donation, épargne antérieure), le bien risque d'être qualifié de commun si vous ne prenez aucune précaution. La technique du <strong className="text-[var(--color-text-strong)]">remploi</strong> permet d'éviter cet écueil.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Dans l'acte notarié d'achat, vous devez insérer une <strong className="text-[var(--color-text-strong)]">déclaration de remploi</strong> précisant que les fonds utilisés pour l'acquisition ont une origine propre (donation reçue le X, héritage de tel parent, épargne constituée avant le mariage). Le notaire est le garant de la validité de cette déclaration.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Si l'achat est financé à la fois par des fonds propres et des fonds communs, le bien sera acquis en partie en propre et en partie en commun, avec des récompenses à calculer lors de la dissolution du régime. Là encore, la précision de l'acte notarié est déterminante.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La dissolution et le partage de la communauté</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La communauté se dissout en cas de décès d'un époux, de divorce, de séparation de corps ou de changement de régime matrimonial. Lors de cette dissolution, chaque époux reprend ses biens propres, et les biens communs sont partagés par moitié entre les deux époux (ou leurs héritiers en cas de décès).</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le partage est précédé d'une opération de liquidation conduite par le notaire : il dresse l'inventaire de l'actif commun, calcule les récompenses dues entre les patrimoines propres et la communauté, et établit l'acte de partage. Cette liquidation peut être complexe lorsque le patrimoine est important ou lorsque les mouvements entre patrimoines propres et commun ont été nombreux.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Si vous souhaitez adapter votre régime légal à votre situation personnelle sans changer entièrement de régime, le notaire peut vous proposer des aménagements contractuels : clause de préciput, clause d'attribution intégrale, adjonction d'une société d'acquêts pour certains biens.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 58 ─────────────────────────────────────────────────────────── */

function Article58() {
  return (
    <>
<p className="lead">La <strong>séparation de biens avantages inconvénients</strong> : ce régime matrimonial est plébiscité par les entrepreneurs, les professions libérales et les couples souhaitant une totale indépendance patrimoniale. Mais il n'est pas adapté à toutes les situations. Faisons le point sur ses atouts réels et ses limites souvent sous-estimées.</p>

<KeyPoints points={[
  "La séparation de biens protège le patrimoine de chaque époux des dettes professionnelles de l'autre.",
  "Chaque époux est seul propriétaire de ce qu'il acquiert : revenus, épargne, biens immobiliers.",
  "Elle peut désavantager le conjoint ayant mis sa carrière en retrait pour la famille.",
  "Des aménagements comme la société d'acquêts permettent de combiner indépendance et équité."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le fonctionnement de la séparation de biens</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le régime de séparation de biens, régi par les articles 1536 à 1543 du Code civil, repose sur un principe simple : chaque époux conserve la propriété exclusive, la jouissance et la libre administration de ses biens personnels. Il n'existe pas de patrimoine commun.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Concrètement, les revenus professionnels, l'épargne, les placements, les biens immobiliers achetés pendant le mariage appartiennent exclusivement à celui qui les a acquis. Même les revenus issus d'un bien propre (loyers d'un appartement acheté avant le mariage) restent la propriété de l'époux qui en est propriétaire, contrairement à la communauté légale où ces revenus deviendraient communs.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Lorsque les deux époux achètent ensemble un bien immobilier, ils deviennent co-propriétaires en indivision, selon les quotes-parts correspondant à leur participation financière respective. Le notaire précise ces quotes-parts dans l'acte de vente.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les avantages de la séparation de biens</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Protection contre les dettes professionnelles :</strong> c'est l'avantage cardinal. Les créanciers professionnels d'un époux — banques, fournisseurs, État — ne peuvent pas saisir les biens personnels de l'autre conjoint. Cette protection est particulièrement précieuse pour les entrepreneurs, artisans, commerçants, professions libérales ou gérants de société soumis à un risque financier professionnel.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Simplicité en cas de divorce :</strong> chaque époux repart avec ses biens propres, sans partage long et coûteux. Il n'y a pas de masse commune à liquider, ce qui simplifie et accélère la séparation patrimoniale. Les conflits sur l'évaluation des biens communs sont évités.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Indépendance patrimoniale totale :</strong> chaque époux gère librement ses biens et ses dettes. Aucune autorisation de l'autre n'est requise pour vendre un bien immobilier propre, contracter un emprunt personnel ou réaliser un placement.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Transmission optimisée :</strong> en combinant la séparation de biens avec des donations ou une assurance-vie, chaque époux peut organiser librement la transmission de son patrimoine propre.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les inconvénients et limites de la séparation de biens</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">L'inéquité pour le conjoint économiquement faible :</strong> c'est le principal reproche adressé à ce régime. Si l'un des époux a mis sa carrière en retrait pour s'occuper des enfants ou du foyer, il n'acquiert aucun droit sur les biens accumulés par l'autre pendant ce temps. En cas de divorce, il repart sans rien, ou presque, malgré sa contribution indirecte à l'enrichissement du foyer.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">La difficulté de preuve :</strong> en séparation de biens, chaque époux doit être en mesure de prouver la propriété de chaque bien. Si la preuve fait défaut (argent mélangé, compte joint utilisé sans distinction), le bien est réputé appartenir aux deux par moitié. Une comptabilité rigoureuse est donc nécessaire.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">La protection limitée du conjoint survivant :</strong> en l'absence de dispositions testamentaires ou d'une donation entre époux, le conjoint survivant n'a que les droits successoraux légaux, qui peuvent être faibles en présence d'enfants. Un testament ou une donation au dernier vivant est donc conseillé même en séparation de biens.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed"><strong className="text-[var(--color-text-strong)]">La solidarité ménagère subsiste :</strong> même en séparation de biens, les dettes contractées pour les besoins du ménage ou l'éducation des enfants engagent solidairement les deux époux. La protection n'est donc pas absolue pour toutes les catégories de dettes.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les aménagements possibles et le rôle du notaire</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La séparation de biens n'est pas un régime figé. Le notaire peut y apporter des aménagements sur mesure pour en corriger les aspects les moins adaptés à votre situation. L'adjonction d'une <strong className="text-[var(--color-text-strong)]">société d'acquêts</strong> crée une masse de biens communs limitée (par exemple, le logement familial ou un portefeuille de valeurs mobilières) tout en maintenant la séparation pour le reste du patrimoine.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Une <strong className="text-[var(--color-text-strong)]">clause de créance de participation</strong> peut être ajoutée pour que l'époux ayant moins accumulé perçoive une compensation en cas de divorce, calculée sur l'enrichissement différentiel pendant le mariage.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Enfin, la <strong className="text-[var(--color-text-strong)]">donation entre époux</strong> (donation au dernier vivant) permet de protéger efficacement le conjoint survivant en lui accordant des droits supplémentaires sur le patrimoine du prédécédé. Ces aménagements, rédigés par un notaire, permettent de construire un régime hybride parfaitement adapté à votre profil.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 59 ─────────────────────────────────────────────────────────── */

function Article59() {
  return (
    <>
<p className="lead">La <strong>donation entre époux avantage survivant notaire</strong>, aussi appelée "donation au dernier vivant", est l'un des actes notariaux les plus protecteurs et les plus sous-utilisés en France. Pour 163 € TTC environ, vous pouvez significativement améliorer la situation de votre conjoint lors de votre décès. Voici tout ce que vous devez savoir.</p>

<KeyPoints points={[
  "La donation entre époux augmente les droits légaux du conjoint survivant au-delà de la loi.",
  "Elle est révocable unilatéralement à tout moment, sans motif, et automatiquement révoquée par le divorce.",
  "Le conjoint bénéficiaire choisit entre trois options au décès, selon la composition de la succession.",
  "Son coût est réglementé et modique : environ 163 € TTC, soit l'acte notarié le plus accessible."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qu'est-ce que la donation entre époux ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La donation entre époux, réglementée par les articles 1094 et suivants du Code civil, est un acte par lequel un époux (le donateur) octroie à son conjoint (le bénéficiaire) des droits supplémentaires sur sa succession, au-delà de ceux que la loi lui attribue automatiquement. Elle est souvent appelée "donation au dernier vivant" car ses effets ne se produisent qu'au décès du donateur.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Sans cette donation, les droits légaux du conjoint survivant dépendent du régime matrimonial et de la composition de la famille. En présence d'enfants communs, il hérite soit d'un quart de la succession en pleine propriété, soit de la totalité en usufruit — à son choix. Ce choix, bien que déjà intéressant, peut s'avérer insuffisant selon la situation patrimoniale.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Avec la donation entre époux, le conjoint survivant dispose d'une option tripartite enrichie, lui permettant d'adapter sa stratégie successorale au moment du décès, en fonction de ses besoins et de la situation fiscale du moment.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les trois options offertes au conjoint survivant</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Grâce à la donation entre époux, le conjoint survivant peut choisir entre trois options, dont certaines dépassent ses droits légaux :</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Option 1 — La totalité en usufruit :</strong> le conjoint survivant perçoit les revenus de l'ensemble du patrimoine (loyers, dividendes, intérêts) sa vie durant, tandis que les enfants reçoivent la nue-propriété. Cette option est particulièrement adaptée aux conjoints ayant besoin de revenus réguliers mais disposant d'un niveau de vie déjà établi.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Option 2 — La quotité disponible en pleine propriété :</strong> le conjoint reçoit en pleine propriété la part maximale que la loi permet de transmettre librement (1/2 avec un enfant, 1/3 avec deux, 1/4 avec trois ou plus). Cette option est avantageuse lorsque le conjoint a besoin de liquidités immédiates ou souhaite gérer librement ses actifs.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Option 3 — Un panachage usufruit/pleine propriété :</strong> le conjoint peut combiner les deux options précédentes pour optimiser sa situation fiscale et patrimoniale. Par exemple, il peut recevoir un quart en pleine propriété et les trois quarts restants en usufruit.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Ce choix s'effectue au moment du règlement de la succession, après le décès. Le conjoint dispose ainsi d'une réelle flexibilité pour adapter sa décision aux circonstances du moment : présence d'enfants en bas âge, besoins de liquidités urgents, contexte fiscal particulier.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Révocabilité et sécurité de la donation</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La donation entre époux est unique en droit français par sa <strong className="text-[var(--color-text-strong)]">révocabilité totale</strong>. Contrairement aux donations ordinaires entre vifs, qui sont en principe irrévocables, la donation entre époux peut être retirée à tout moment, unilatéralement, sans motif et sans que le conjoint bénéficiaire puisse s'y opposer.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Cette révocabilité est automatique en cas de divorce prononcé. Lors d'une procédure de divorce, les donations entre époux deviennent caduques de plein droit, sauf disposition contraire expressément stipulée dans la convention de divorce (uniquement pour les divorces par consentement mutuel depuis 2017).</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">En pratique, les époux établissent généralement deux donations croisées : chacun fait une donation au profit de l'autre. Ces deux actes sont souvent rédigés en même temps par le notaire pour limiter les coûts.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Coût, fiscalité et combinaisons recommandées</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le coût d'une donation entre époux est l'un des moins élevés parmi les actes notariaux : les émoluments réglementés s'élèvent à environ <strong className="text-[var(--color-text-strong)]">136 € HT (163 € TTC)</strong> par acte. Si les deux époux font leur donation lors du même rendez-vous, comptez environ 300 à 350 € TTC pour les deux actes, auxquels s'ajoutent de légers débours.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Sur le plan fiscal, la donation entre époux n'est pas taxée au moment de sa rédaction. C'est lors du décès et du règlement de la succession que les droits éventuels s'appliquent — mais rappelons que le conjoint survivant est totalement exonéré de droits de succession en France depuis la loi TEPA de 2007.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Pour une protection optimale du conjoint survivant, le notaire recommande souvent de combiner la donation entre époux avec une donation-partage anticipée aux enfants et/ou une assurance-vie. Cette triple approche couvre les besoins du conjoint survivant tout en préparant la transmission du patrimoine aux générations suivantes dans les meilleures conditions fiscales.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 60 ─────────────────────────────────────────────────────────── */

function Article60() {
  return (
    <>
<p className="lead">La <strong>holding familiale</strong> s'est imposée comme l'outil phare de la structuration patrimoniale en France. Loin d'être réservée aux grandes fortunes, elle est aujourd'hui utilisée par des familles détenant un patrimoine immobilier, un portefeuille de valeurs mobilières ou des participations dans des entreprises. Le notaire joue un rôle central dans sa création et son fonctionnement.</p>

<KeyPoints points={[
  "La holding familiale centralise la détention du patrimoine sous une société mère.",
  "Elle optimise la fiscalité (régime mère-fille, intégration fiscale) et facilite la transmission.",
  "Le notaire rédige les statuts, les pactes d'associés et les apports de biens immobiliers.",
  "La création coûte entre 2 000 et 5 000 € selon la complexité des apports."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qu'est-ce qu'une holding familiale ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Une holding familiale est une société dont l'objet principal est de détenir des participations dans d'autres sociétés (filiales) et/ou des actifs patrimoniaux. La famille détient la holding, qui détient elle-même les actifs. Cette interposition d'une structure sociétaire crée plusieurs niveaux d'optimisation impossible à obtenir avec une détention directe.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le schéma classique est le suivant : les parents constituent la holding et y apportent leurs participations dans des sociétés opérationnelles ou leurs biens immobiliers. Les enfants reçoivent progressivement des parts de la holding via des donations successives. La direction reste entre les mains des parents tant qu'ils le souhaitent, grâce à une répartition des droits de vote adaptée.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">La holding peut être constituée sous forme de SAS (la plus flexible), de SARL ou de SA selon les besoins. Le notaire conseille sur la forme la plus adaptée et rédige les statuts ainsi que le pacte d'associés qui organise les relations entre les membres de la famille.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les avantages fiscaux de la holding familiale</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le premier avantage majeur est le <strong className="text-[var(--color-text-strong)]">régime mère-fille</strong> : les dividendes reçus par la holding de ses filiales sont exonérés d'impôt sur les sociétés à hauteur de 95 % (une quote-part de frais et charges de 5 % est réintégrée). Concrètement, sur 100 000 € de dividendes reçus, seuls 5 000 € sont taxés à 25 % soit 1 250 € d'IS, contre 25 000 € sans holding.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le second avantage est l'<strong className="text-[var(--color-text-strong)]">effet de levier sur la transmission</strong>. En donnant des parts de holding plutôt que des parts de sociétés opérationnelles, les parents transmettent progressivement en profitant des abattements légaux (100 000 € par enfant tous les 15 ans). Si les conditions du <strong className="text-[var(--color-text-strong)]">pacte Dutreil</strong> sont respectées, une exonération de 75 % sur la valeur des parts s'applique lors de la transmission.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Enfin, la holding permet de réinvestir les bénéfices dans de nouveaux projets en "logeant" les plus-values de cession dans la structure sans imposition immédiate, grâce au régime du sursis d'imposition lors des apports-cessions.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">L'intervention du notaire</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le notaire intervient à plusieurs étapes. Il rédige d'abord les <strong className="text-[var(--color-text-strong)]">statuts de la holding</strong> en intégrant les clauses spécifiques à l'organisation familiale : répartition des droits de vote, conditions de cession de parts, droit de préemption entre associés, clauses de sortie. Ces stipulations, essentielles pour éviter les conflits familiaux, doivent être rédigées avec soin.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Si la holding reçoit des <strong className="text-[var(--color-text-strong)]">biens immobiliers en apport</strong>, le notaire est obligatoirement compétent. Il rédige l'acte d'apport, calcule les droits de mutation réduits applicables (0,715 % au lieu de 5,8 %) et publie l'acte à la conservation des hypothèques. Pour les apports de parts sociales, un expert-comptable commissaire aux apports peut intervenir en complément.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Le notaire participe également à la rédaction des <strong className="text-[var(--color-text-strong)]">donations de parts</strong> successives aux enfants, en optimisant l'utilisation des abattements et en conseillant sur le démembrement de propriété (donation de la nue-propriété avec conservation de l'usufruit). Son rôle de conseil global en fait le pivot de l'ensemble du dispositif.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 61 ─────────────────────────────────────────────────────────── */

function Article61() {
  return (
    <>
<p className="lead">La <strong>transmission d'entreprise</strong> est l'une des opérations les plus complexes du droit patrimonial. Qu'il s'agisse d'une cession à un tiers, d'une donation à ses enfants ou d'une succession, le notaire apporte une sécurité juridique et fiscale indispensable pour que le patrimoine professionnel d'une vie soit transmis dans les meilleures conditions.</p>

<KeyPoints points={[
  "Trois modes principaux : la cession (vente), la donation (transmission familiale) et la succession.",
  "Le pacte Dutreil permet d'exonérer 75 % de la valeur taxable lors d'une donation ou succession.",
  "Le notaire rédige les actes, optimise la fiscalité et sécurise toutes les parties.",
  "Un accompagnement en amont (2 à 5 ans avant la transmission) est fortement recommandé."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les trois modes de transmission d'entreprise</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">cession à titre onéreux</strong> est la forme la plus courante. Le dirigeant vend ses parts ou son fonds de commerce à un tiers ou à ses salariés (LBO). Le notaire intervient pour rédiger ou vérifier la promesse de cession, la garantie d'actif et de passif, et l'acte définitif. Il calcule les conséquences fiscales pour le cédant (plus-value professionnelle) et propose des abattements applicables selon la durée de détention.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">donation</strong> permet de transmettre l'entreprise aux enfants tout en conservant éventuellement le contrôle. Combinée au pacte Dutreil, elle peut être quasi-exonérée de droits. Le notaire rédige l'acte de donation, vérifie les conditions Dutreil et conseille sur le démembrement (donation de la nue-propriété) pour que les parents conservent les revenus.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">succession</strong> représente souvent une transmission non anticipée, source de conflits et de difficultés. Les héritiers peuvent se retrouver co-propriétaires indivisés d'une entreprise sans en avoir la gestion. Le notaire règle la succession et conseille sur la meilleure manière de maintenir l'activité, notamment via une holding ou un pacte d'associés préparé en amont.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Pourquoi anticiper avec le notaire ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">L'anticipation est la clé d'une transmission réussie. Idéalement, le travail préparatoire commence 5 à 10 ans avant la transmission effective. Le notaire réalise d'abord un audit patrimonial : valeur de l'entreprise, composition du patrimoine personnel et professionnel, régime matrimonial, objectifs familiaux. Il identifie ensuite les leviers d'optimisation : pacte Dutreil, donation progressive, retraite et préretraite.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Cette anticipation permet notamment de purger les plus-values latentes par des donations successives sur plusieurs années, en utilisant pleinement les abattements légaux disponibles tous les 15 ans. Elle permet aussi de mettre en place les engagements collectifs de conservation requis par le pacte Dutreil dans les délais impartis.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Le notaire travaille en coordination avec l'expert-comptable, l'avocat fiscaliste et le conseiller en gestion de patrimoine. Son rôle d'officier public garantit l'authenticité et l'opposabilité des actes à toutes les parties, y compris l'administration fiscale.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 62 ─────────────────────────────────────────────────────────── */

function Article62() {
  return (
    <>
<p className="lead">Le <strong>pacte Dutreil</strong> est l'un des dispositifs fiscaux les plus puissants du droit patrimonial français. Il permet de transmettre une entreprise familiale avec une exonération de 75 % de la valeur des parts ou actions, ce qui peut représenter des centaines de milliers d'euros d'économie. Le notaire en est l'architecte indispensable.</p>

<KeyPoints points={[
  "Exonération de 75 % sur la valeur des parts transmises par donation ou succession.",
  "Conditions : engagement collectif de conservation de 2 ans + engagement individuel de 4 ans.",
  "Applicable aux entreprises industrielles, commerciales, artisanales, agricoles et libérales.",
  "Peut être combiné avec la donation en démembrement pour un effet de levier maximal."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le mécanisme du pacte Dutreil</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le pacte Dutreil, codifié à l'article 787 B du Code général des impôts, repose sur un engagement de conservation des titres pris par les associés. En contrepartie de cet engagement, l'État accorde une exonération de 75 % sur la base imposable des droits de mutation à titre gratuit (donation ou succession).</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le dispositif se déroule en deux phases. D'abord, un <strong className="text-[var(--color-text-strong)]">engagement collectif de conservation</strong> est signé entre plusieurs associés (au moins deux) portant sur au moins 17 % des droits financiers et 34 % des droits de vote pour les sociétés non cotées. Cet engagement dure au minimum 2 ans.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Ensuite, lors de la transmission (donation ou décès), les bénéficiaires prennent un <strong className="text-[var(--color-text-strong)]">engagement individuel de conservation</strong> de 4 ans supplémentaires. L'un des signataires de l'engagement collectif (ou un héritier) doit exercer une fonction de direction dans la société pendant l'engagement collectif et les 3 premières années de l'engagement individuel.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Calcul de l'économie fiscale</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Voici un exemple concret. Vous transmettez des parts d'une société évaluée à 2 000 000 € à deux enfants. Sans pacte Dutreil, la base taxable est de 2 000 000 €, soit 1 000 000 € par enfant après abattement légal de 100 000 €, taxés entre 20 % et 45 % selon le barème. Les droits peuvent dépasser 300 000 € par enfant.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Avec le pacte Dutreil, la base imposable est réduite de 75 % : 2 000 000 × 25 % = 500 000 €, soit 250 000 € par enfant, moins l'abattement de 100 000 €, soit 150 000 € taxables. Les droits tombent à moins de 30 000 € par enfant. L'économie est considérable.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Si la transmission se fait par donation en nue-propriété, la base taxable est encore réduite selon l'âge du donateur (abattement légal de 30 à 70 %). L'effet de levier peut ainsi dépasser 90 % d'exonération globale.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle du notaire dans la mise en place du pacte Dutreil</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le notaire rédige l'acte d'engagement collectif de conservation, qui doit respecter des conditions formelles précises. Il vérifie l'éligibilité de l'entreprise (activité opérationnelle, pas de holding pure), la quotité des droits concernés et les modalités de direction.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Au moment de la transmission, le notaire intègre dans l'acte de donation ou de déclaration de succession toutes les mentions requises par l'administration fiscale pour que l'exonération soit valablement revendiquée. Il assure le suivi des engagements dans le temps et alerte les parties en cas de risque de remise en cause du dispositif.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 63 ─────────────────────────────────────────────────────────── */

function Article63() {
  return (
    <>
<p className="lead">La <strong>donation avant cession d'entreprise</strong> est une stratégie fiscale puissante : en donnant ses parts à ses enfants avant de les vendre, le cédant peut légalement effacer la plus-value imposable. Le notaire est l'acteur central de cette opération qui, mal exécutée, peut être requalifiée par l'administration fiscale.</p>

<KeyPoints points={[
  "La donation avant cession permet d'effacer la plus-value en purgeant le prix de revient fiscal.",
  "Le donataire vend les parts à la valeur de la donation, générant une plus-value nulle ou faible.",
  "L'opération peut être requalifiée en abus de droit si la cession était préorganisée.",
  "Un délai raisonnable entre donation et cession + un vrai risque de marché est indispensable."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le mécanisme de la donation avant cession</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Lorsqu'un chef d'entreprise vend ses parts, il réalise une plus-value égale à la différence entre le prix de cession et le prix d'acquisition historique. Si les parts ont été acquises il y a 20 ans pour 50 000 € et sont cédées pour 2 000 000 €, la plus-value est de 1 950 000 €, imposable à 30 % (flat tax) soit 585 000 € d'impôt.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La donation avant cession contourne cette imposition : le cédant donne ses parts à ses enfants par acte notarié. Les parts sont alors valorisées à leur valeur vénale du jour de la donation (2 000 000 €). Cette valeur devient le <strong className="text-[var(--color-text-strong)]">nouveau prix de revient fiscal</strong> pour les donataires. Si ceux-ci vendent ensuite les parts à 2 000 000 €, la plus-value est nulle.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Des droits de donation s'appliquent sur la valeur des parts, mais ils sont généralement très inférieurs à l'impôt sur la plus-value, surtout si des abattements (pacte Dutreil, abattement légal parent-enfant) sont utilisés. L'économie nette peut être considérable.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les risques et conditions de validité</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">L'administration fiscale surveille attentivement ces opérations. Elle peut les requalifier en <strong className="text-[var(--color-text-strong)]">abus de droit</strong> si la donation n'est pas sincère — c'est-à-dire si elle n'est qu'un habillage juridique destiné à éluder l'impôt sur la plus-value sans transfert réel de la propriété économique des parts.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Pour sécuriser l'opération, le notaire s'assure que plusieurs conditions sont réunies : la donation est antérieure à tout accord de cession ; les donataires exercent leurs droits d'associés entre la donation et la cession (votes en assemblée, perception de dividendes) ; un délai raisonnable s'écoule entre la donation et la cession ; et la donation est irrévocable (pas de réserve de retour systématique).</p>
<p className="text-[var(--color-muted)] leading-relaxed">Le notaire réalise également l'évaluation des parts par un acte notarié opposable à l'administration, attestant de la valeur retenue au jour de la donation. Cette valorisation est un élément clé en cas de contrôle fiscal.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 64 ─────────────────────────────────────────────────────────── */

function Article64() {
  return (
    <>
<p className="lead">L'<strong>optimisation patrimoniale</strong> n'est pas réservée aux grandes fortunes. Avec un patrimoine de 300 000 €, des leviers significatifs existent pour réduire la fiscalité, protéger le conjoint et préparer la transmission. Le notaire est le conseiller naturel de cette démarche globale, complémentaire à l'expert-comptable et au conseiller financier.</p>

<KeyPoints points={[
  "Le notaire identifie les leviers adaptés à votre situation : démembrement, SCI, donation, testament.",
  "Le démembrement de propriété permet de transmettre à coût réduit tout en conservant l'usufruit.",
  "La SCI facilite la gestion et la transmission d'un patrimoine immobilier familial.",
  "Un bilan patrimonial notarial est recommandé dès 300 000 € de patrimoine net."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le bilan patrimonial notarial</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La première étape est le bilan patrimonial : un état des lieux exhaustif de votre situation. Le notaire recense l'ensemble de vos actifs (immobilier, placements, entreprise, assurance-vie), de vos passifs (crédits en cours), de votre régime matrimonial et de votre situation familiale. Cette photographie globale permet d'identifier les risques et les opportunités.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le notaire évalue ensuite la charge fiscale théorique en cas de décès ou de donation aujourd'hui, et projette différents scénarios d'optimisation. Cette approche prospective permet de choisir les outils les mieux adaptés à vos objectifs : transmettre à vos enfants, protéger votre conjoint, réduire vos impôts, préparer votre retraite.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Le coût d'une consultation d'optimisation patrimoniale auprès d'un notaire varie de 300 à 1 500 € selon la complexité. C'est un investissement très rentable au regard des économies fiscales potentielles sur des patrimoines de plusieurs centaines de milliers d'euros.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les principaux leviers d'optimisation</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Le démembrement de propriété</strong> sépare la nue-propriété (le droit de vendre) de l'usufruit (le droit d'utiliser et de percevoir les revenus). Donner la nue-propriété à ses enfants permet de transmettre à moindre coût fiscal : la base taxable est réduite selon l'âge du donateur (30 % avant 50 ans, 40 % entre 51 et 60 ans, 50 % entre 61 et 70 ans). À votre décès, vos enfants récupèrent la pleine propriété sans aucune fiscalité supplémentaire.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">La SCI familiale</strong> facilite la gestion collective d'un patrimoine immobilier et sa transmission progressive via des donations de parts. Elle permet aussi de déconnecter la gestion (qui détient les parts de gérant) de la propriété économique (qui détient les parts sociales), offrant une souplesse indisponible avec une détention directe.</p>
<p className="text-[var(--color-muted)] leading-relaxed"><strong className="text-[var(--color-text-strong)]">Les donations progressives</strong> utilisent les abattements légaux renouvelables tous les 15 ans : 100 000 € par enfant et par parent, soit 200 000 € pour un couple avec deux parents et deux enfants. Sur 30 ans, 400 000 € peuvent être transmis sans aucun droit de donation. Le notaire planifie ces donations dans le temps pour maximiser leur efficacité.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 65 ─────────────────────────────────────────────────────────── */

function Article65() {
  return (
    <>
<p className="lead">Le <strong>rendez-vous notarié en visioconférence</strong> est désormais une réalité juridique en France. Depuis le décret du 20 novembre 2020, le notaire peut recevoir ses clients à distance et signer des actes authentiques électroniques avec la même valeur juridique qu'un acte papier. Mais comment cela fonctionne-t-il concrètement ?</p>

<KeyPoints points={[
  "Depuis 2020, l'acte authentique électronique à distance a la même valeur qu'un acte papier.",
  "La visioconférence utilise une plateforme sécurisée agréée par le Conseil Supérieur du Notariat.",
  "La signature se fait via une identité numérique vérifiée (France Identité ou autre).",
  "Applicable à la majorité des actes : testament, donation, mandat de protection future, promesse de vente."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment se déroule un rendez-vous notarié en visio ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le processus commence comme pour un rendez-vous physique : vous contactez le notaire, lui exposez votre projet et transmettez les documents nécessaires. La différence intervient ensuite. Le notaire vous envoie un lien vers une plateforme de visioconférence sécurisée, homologuée par le Conseil Supérieur du Notariat (CSN).</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le jour du rendez-vous, vous vous connectez depuis votre ordinateur, tablette ou smartphone. Le notaire présente l'acte à l'écran, le lit et vous explique chaque clause. Il s'assure de votre compréhension et de votre consentement libre et éclairé, comme il le ferait en présentiel. Cette étape de lecture et d'explication est obligatoire et ne peut être raccourcie.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">La signature intervient ensuite : vous utilisez une <strong className="text-[var(--color-text-strong)]">identité numérique certifiée</strong> (France Identité, IDnow ou équivalent) pour signer électroniquement. Le notaire appose sa signature électronique qualifiée et son sceau numérique. L'acte est ensuite archivé dans le Minutier Central Électronique des Notaires de France (MICEN).</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Quels actes peuvent se faire en visio ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La grande majorité des actes notariés courants sont compatibles avec la visioconférence : testament authentique, donation, mandat de protection future, contrat de mariage, PACS, reconnaissance d'enfant, procuration authentique, promesse de vente immobilière.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les actes immobiliers de vente définitive nécessitent généralement la présence physique, car ils impliquent la remise des clés et la coordination entre plusieurs parties (vendeur, acheteur, banque). Cependant, la loi permet techniquement leur signature à distance si toutes les parties y consentent.</p>
<p className="text-[var(--color-muted)] leading-relaxed">La visioconférence notariale est particulièrement adaptée aux expatriés, aux personnes à mobilité réduite, aux clients éloignés géographiquement ou aux situations d'urgence où le déplacement est impossible. Elle ouvre le notariat à une clientèle plus large tout en maintenant la sécurité juridique propre à l'acte authentique.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 66 ─────────────────────────────────────────────────────────── */

function Article66() {
  return (
    <>
<p className="lead">La facture d'un notaire peut paraître opaque. Entre les <strong>émoluments réglementés</strong>, les honoraires libres, les débours et la TVA, il est difficile de s'y retrouver. Ce guide vous explique en détail la composition des frais de notaire pour que vous puissiez anticiper les coûts de votre projet.</p>

<KeyPoints points={[
  "Les émoluments sont fixés par décret et identiques dans toutes les études notariales.",
  "Les débours sont les frais avancés par le notaire pour votre compte (impôts, copies, diagnostics).",
  "Les honoraires libres couvrent les prestations de conseil non tarifées (consultation, expertise).",
  "Pour l'immobilier, les 'frais de notaire' représentent 7 à 8 % du prix, dont 5,8 % de taxes."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les émoluments : la rémunération réglementée</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les <strong className="text-[var(--color-text-strong)]">émoluments</strong> sont la rémunération du notaire stricto sensu. Ils sont fixés par le décret du 26 février 2016 et sont identiques dans toutes les études de France. Il n'existe pas de "notaire moins cher" pour les actes tarifés — la concurrence ne joue pas sur ce point.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">On distingue les <strong className="text-[var(--color-text-strong)]">émoluments proportionnels</strong>, calculés en pourcentage de la valeur de l'acte (vente immobilière, donation, succession), et les <strong className="text-[var(--color-text-strong)]">émoluments fixes</strong> pour les actes dont la valeur ne se prête pas à un calcul proportionnel (PACS, procuration, testament). Ces derniers varient de 70 à 200 € environ.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Pour les émoluments proportionnels, le taux dégressif s'applique par tranches : 3,870 % jusqu'à 6 500 €, 1,596 % de 6 500 à 17 000 €, 1,064 % de 17 000 à 60 000 €, et 0,799 % au-delà. Sur une vente à 300 000 €, les émoluments du notaire s'élèvent à environ 2 800 € HT.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les débours et les droits fiscaux</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les <strong className="text-[var(--color-text-strong)]">débours</strong> sont les sommes que le notaire avance pour votre compte et vous refacture au réel. Ils incluent : les droits d'enregistrement (impôts sur les successions, les donations), la taxe de publicité foncière (immatriculation de la vente), les frais de géomètre, les copies d'actes, les frais de demande de documents d'urbanisme.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Pour l'immobilier ancien, la <strong className="text-[var(--color-text-strong)]">taxe de publicité foncière</strong> représente à elle seule 5,09 % du prix de vente (en Île-de-France et dans la plupart des départements). Ajoutés à la contribution de sécurité immobilière (0,10 %) et aux frais d'assiette, les taxes représentent environ 5,8 % du prix. C'est la raison pour laquelle les "frais de notaire" pour l'ancien avoisinent 7 à 8 % : ce sont en réalité principalement des taxes.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Les <strong className="text-[var(--color-text-strong)]">honoraires libres</strong> couvrent les prestations intellectuelles non tarifées : consultation juridique, audit patrimonial, rédaction de documents sans acte. Ces honoraires sont librement négociables et doivent faire l'objet d'une convention préalable. Certains notaires proposent des forfaits de consultation à 150-300 €.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 67 ─────────────────────────────────────────────────────────── */

function Article67() {
  return (
    <>
<p className="lead">L'<strong>acte notarié et sa force exécutoire</strong> constituent l'une des originalités les plus précieuses du droit français. Contrairement à un contrat sous seing privé, un acte notarié vaut titre exécutoire : en cas d'impayé, votre créancier peut vous faire saisir sans attendre un jugement. Comprendre cette force est essentiel pour mesurer la valeur de l'acte authentique.</p>

<KeyPoints points={[
  "La force exécutoire permet l'intervention d'un huissier sans procès préalable.",
  "Elle s'applique aux obligations de payer des sommes d'argent définies dans l'acte.",
  "L'acte notarié a également la force probante : on ne peut nier sa signature.",
  "La valeur juridique est identique à celle d'un jugement de tribunal."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Qu'est-ce que la force exécutoire ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">force exécutoire</strong> est la propriété juridique qui permet à un document d'être mis à exécution par un huissier de justice sans qu'un juge n'ait préalablement à reconnaître la créance. Un acte notarié revêtu de la formule exécutoire (mention "En foi de quoi…") est un <strong className="text-[var(--color-text-strong)]">titre exécutoire</strong> au même titre qu'un jugement définitif.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">En pratique, cela signifie que si un emprunteur ne rembourse pas son prêt immobilier notarié, la banque peut mandater un huissier pour procéder à une saisie sur salaire ou sur compte bancaire sans passer par les tribunaux. Ce gain de temps (souvent 18 à 36 mois d'économisés) est considérable dans un contexte de recouvrement.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Cette force exécutoire s'applique à toutes les <strong className="text-[var(--color-text-strong)]">obligations de payer des sommes d'argent</strong> stipulées dans l'acte notarié : prix de vente, loyer, remboursement d'emprunt, pensions alimentaires fixées par acte notarié. Elle ne s'étend pas aux obligations de faire ou ne pas faire, qui nécessitent toujours un jugement.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La force probante : l'autre atout de l'acte notarié</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Complémentaire à la force exécutoire, la <strong className="text-[var(--color-text-strong)]">force probante absolue</strong> de l'acte notarié signifie qu'il fait foi jusqu'à inscription de faux. On ne peut contester le contenu d'un acte notarié qu'en engageant une procédure spécifique (procédure en inscription de faux) devant les juridictions pénales — procédure lourde, coûteuse et rarement couronnée de succès.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">En comparaison, un acte sous seing privé peut toujours être contesté par une partie qui nierait sa signature ou contesterait les dates. Cette fragilité rend les contrats sous seing privé moins sûrs pour des transactions importantes.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Pour les particuliers, la force exécutoire présente un intérêt concret dans les <strong className="text-[var(--color-text-strong)]">prêts entre particuliers</strong> notariés, les <strong className="text-[var(--color-text-strong)]">baux commerciaux</strong> authentiques ou les <strong className="text-[var(--color-text-strong)]">reconnaissances de dette</strong> notariées. Ces actes permettent un recouvrement rapide en cas d'impayé, sans les aléas d'une procédure judiciaire.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 68 ─────────────────────────────────────────────────────────── */

function Article68() {
  return (
    <>
<p className="lead">Choisir son notaire est une décision importante : c'est lui qui va sécuriser votre achat immobilier, organiser votre succession ou structurer votre patrimoine. Mais tous les notaires sont-ils équivalents ? Quels critères guident le bon choix ? Ce guide vous aide à trouver le notaire idéal pour votre projet.</p>

<KeyPoints points={[
  "Tous les notaires sont des officiers publics avec les mêmes garanties légales de sécurité.",
  "La spécialisation (immobilier, droit de la famille, droit des affaires) est un critère clé.",
  "La disponibilité et la réactivité sont essentielles pour les opérations complexes ou urgentes.",
  "Vous pouvez avoir votre propre notaire même si l'autre partie en a déjà un."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les critères essentiels du bon choix</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">La spécialisation</strong> est le premier critère. Si vous achetez un bien immobilier, un notaire spécialisé en droit immobilier sera plus efficace qu'un généraliste. Pour une succession complexe, un spécialiste du droit des successions apportera une valeur ajoutée différente. Les études de notaires importantes emploient souvent des clercs et des notaires spécialisés dans chaque domaine.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">La disponibilité et la réactivité</strong> sont cruciales dans l'immobilier où les délais sont contraints. Renseignez-vous sur les délais habituels de l'étude, la possibilité d'obtenir un rendez-vous rapidement et la réactivité du notaire ou de son clerc lors des phases de négociation.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed"><strong className="text-[var(--color-text-strong)]">La proximité géographique</strong> reste un avantage pratique même si les actes à distance sont possibles. Un notaire local connaît le marché immobilier, les usages locaux, les contraintes d'urbanisme spécifiques à votre commune — un atout réel pour les transactions immobilières.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment trouver et évaluer un notaire ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les recommandations restent le meilleur canal : un ami ayant eu une expérience positive avec un notaire pour un achat similaire au vôtre est un signal fiable. Le site notaires.fr, annuaire officiel de la profession, permet de rechercher un notaire par commune et de consulter les informations de l'étude.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Lors d'un premier contact, évaluez la qualité de l'accueil et la clarté des réponses apportées à vos premières questions. Un bon notaire prend le temps d'expliquer, reformule les termes juridiques et vous alerte sur les points de vigilance de votre opération sans que vous ayez à les demander.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Sachez enfin que vous pouvez <strong className="text-[var(--color-text-strong)]">avoir votre propre notaire</strong> même si l'autre partie en a déjà un. Dans une vente immobilière, chaque partie peut mandater son propre notaire. Les émoluments sont alors partagés entre les deux notaires — sans aucun surcoût pour vous. Votre notaire défend exclusivement vos intérêts, ce qui est un réel avantage dans les transactions complexes.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 69 ─────────────────────────────────────────────────────────── */

function Article69() {
  return (
    <>
<p className="lead">Peut-on négocier les <strong>frais de notaire</strong> ? La réponse est nuancée : les droits de mutation (impôts) sont strictement fixés et non négociables. En revanche, depuis la loi Macron de 2015, une <strong>remise de 20 % maximum</strong> est autorisée sur les émoluments pour les transactions dépassant 100 000 €. Voici ce que vous devez savoir pour négocier efficacement.</p>

<KeyPoints points={[
  "Les droits de mutation (environ 5,8 % du prix) sont des impôts non négociables.",
  "Les émoluments du notaire (environ 1 % du prix) peuvent faire l'objet d'une remise de 20 %.",
  "La remise n'est possible que pour les actes dont la valeur dépasse 100 000 €.",
  "La remise doit être appliquée de manière identique à tous les clients d'une même catégorie."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Ce qui est négociable et ce qui ne l'est pas</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les <strong className="text-[var(--color-text-strong)]">droits de mutation à titre onéreux</strong> — qui représentent environ 5,09 % du prix de vente dans la plupart des départements — sont des impôts perçus par le notaire pour le compte des collectivités et de l'État. Ils ne peuvent faire l'objet d'aucune négociation. Le notaire n'a aucun pouvoir sur ce montant.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">contribution de sécurité immobilière</strong> (0,10 %) est également un prélèvement au profit de l'État, non négociable. Les débours (frais de géomètre, copies d'actes, documents d'urbanisme) sont refacturés au réel, sans marge.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Seuls les <strong className="text-[var(--color-text-strong)]">émoluments propres du notaire</strong> — qui représentent environ 0,8 à 1 % du prix de vente selon les tranches — peuvent être l'objet d'une remise. Sur une vente à 400 000 €, les émoluments s'élèvent à environ 3 200 € HT. Une remise de 20 % représente 640 € d'économie — significatif, mais modeste par rapport aux taxes.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment demander la remise ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La demande de remise doit être formulée <strong className="text-[var(--color-text-strong)]">avant la signature de l'acte</strong>. Après signature, le montant des émoluments est définitivement fixé. Lors de votre premier contact avec l'étude, demandez directement : "Appliquez-vous la remise de 20 % sur les émoluments pour ce type d'acte ?"</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Notez que la remise doit être appliquée de manière <strong className="text-[var(--color-text-strong)]">identique à tous les clients</strong> dans une même catégorie d'actes. Le notaire ne peut pas faire de favoritisme individuel. S'il accorde une remise sur les ventes immobilières dépassant 100 000 €, il doit l'accorder à tous sans exception.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Pour les transactions très importantes (plus de 1 000 000 €), certaines études proposent des remises en deçà du plafond légal de 20 %, dans le cadre de conventions d'honoraires spécifiques pour les prestations de conseil qui accompagnent l'acte. N'hésitez pas à négocier le package global, en particulier si votre opération est complexe et nécessite de nombreuses diligences.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 70 ─────────────────────────────────────────────────────────── */

function Article70() {
  return (
    <>
<p className="lead">Faut-il passer chez un notaire ou un simple contrat privé suffit-il ? La réponse dépend de la nature de l'acte, de la valeur en jeu et du niveau de sécurité souhaité. Ce guide compare les deux formes d'actes et vous aide à choisir en connaissance de cause.</p>

<KeyPoints points={[
  "L'acte sous seing privé est valable mais n'a ni force probante absolue ni force exécutoire.",
  "L'acte notarié est obligatoire pour les ventes immobilières, donations et contrats de mariage.",
  "La force exécutoire de l'acte notarié permet le recouvrement sans procès.",
  "Pour les engagements importants, l'acte notarié est toujours recommandé même si non obligatoire."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">L'acte sous seing privé : simple mais limité</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">L'acte sous seing privé (ou acte privé) est un document rédigé et signé directement par les parties, sans intervention d'un officier public. Il peut être établi sur papier libre ou via des modèles en ligne. Sa validité juridique est réelle dès lors qu'il réunit les conditions essentielles du contrat : consentement, capacité des parties, objet licite et cause.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Cependant, l'acte sous seing privé présente plusieurs limites. Il n'a pas de <strong className="text-[var(--color-text-strong)]">date certaine</strong> opposable aux tiers (la date peut être contestée). Il n'a pas de <strong className="text-[var(--color-text-strong)]">force probante absolue</strong> : une partie peut contester sa signature ou le contenu. Et il n'a pas de <strong className="text-[var(--color-text-strong)]">force exécutoire</strong> : en cas d'impayé, un jugement est nécessaire avant toute mesure d'exécution forcée.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Ces limites sont acceptables pour des transactions courantes de faible valeur. Mais pour un prêt entre particuliers, la vente d'un véhicule de collection, un bail commercial ou une cession de parts sociales, elles peuvent devenir très coûteuses en cas de litige.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Quand le notaire est-il obligatoire ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La loi impose le recours au notaire pour un certain nombre d'actes : <strong className="text-[var(--color-text-strong)]">vente immobilière</strong> (obligation de publicité foncière), <strong className="text-[var(--color-text-strong)]">donation</strong> (sauf exception), <strong className="text-[var(--color-text-strong)]">contrat de mariage</strong>, <strong className="text-[var(--color-text-strong)]">PACS avec convention patrimoniale</strong>, hypothèque conventionnelle, apport d'immeuble en société.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Pour les actes non obligatoirement notariés mais à fort enjeu, le notaire est vivement recommandé : prêt entre particuliers important, cession de fonds de commerce, reconnaissance de dette élevée, testament (le testament authentique est plus sûr que le testament olographe).</p>
<p className="text-[var(--color-muted)] leading-relaxed">Le surcoût du notaire doit être mis en perspective avec le risque de litige. Sur un prêt de 50 000 € entre amis, une reconnaissance de dette notariée à 150 € est un investissement dérisoire comparé au coût d'un procès qui peut dépasser 5 000 € et durer 2 à 3 ans.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 71 ─────────────────────────────────────────────────────────── */

function Article71() {
  return (
    <>
<p className="lead">Vous avez signé un compromis de vente et votre banquier vous annonce un délai de 3 mois avant la signature définitive chez le notaire. Pourquoi si long ? Ce délai n'est pas arbitraire — il correspond à une série d'étapes légales et administratives incompressibles que ce guide vous détaille.</p>

<KeyPoints points={[
  "Le délai moyen entre compromis et acte est de 2 à 4 mois selon le financement.",
  "Le droit de rétractation de 10 jours est un délai légal incompressible pour l'acheteur.",
  "L'obtention du prêt immobilier (délai légal minimum de 30 jours) allonge significativement le délai.",
  "La purge du droit de préemption de la mairie peut ajouter 2 mois supplémentaires."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les délais légaux incompressibles</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Dès la signature du compromis, un premier délai légal commence : le <strong className="text-[var(--color-text-strong)]">droit de rétractation de 10 jours</strong> dont bénéficie l'acheteur (loi SRU). Pendant cette période, l'acheteur peut se désister sans pénalité ni justification. La remise du compromis doit être faite par lettre recommandée ou remise en main propre pour que ce délai commence à courir.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">En parallèle, le notaire procède aux <strong className="text-[var(--color-text-strong)]">vérifications préalables</strong> : état hypothécaire, situation urbanistique, état des servitudes, situation fiscale du vendeur, vérification des diagnostics. Ces recherches prennent généralement 4 à 8 semaines.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Si le bien est situé dans une zone de préemption, la mairie dispose d'un <strong className="text-[var(--color-text-strong)]">droit de préemption urbain</strong> qu'elle peut exercer dans un délai de 2 mois. Le notaire adresse une déclaration d'intention d'aliéner (DIA) à la mairie, et la signature définitive ne peut intervenir qu'après expiration ou renonciation de ce droit.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le financement : le facteur déterminant</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le délai de financement est souvent le facteur déterminant. La <strong className="text-[var(--color-text-strong)]">loi Scrivener</strong> impose un délai minimal de 10 jours entre la réception de l'offre de prêt et son acceptation. En pratique, l'obtention d'un accord de principe, puis de l'offre définitive de prêt, prend généralement 3 à 8 semaines selon les banques et la complexité du dossier.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le compromis prévoit généralement une <strong className="text-[var(--color-text-strong)]">condition suspensive d'obtention de prêt</strong> dans un délai de 45 à 60 jours. Si l'acheteur n'obtient pas son prêt dans ce délai, il peut se retirer sans pénalité et récupérer son dépôt de garantie.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Pour les achats comptants (sans prêt), le délai peut être ramené à 4 à 6 semaines, correspondant aux seules vérifications administratives. Le notaire peut dans certains cas réduire ce délai si les recherches sont accélérées et qu'il n'existe pas de droit de préemption à purger.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 72 ─────────────────────────────────────────────────────────── */

function Article72() {
  return (
    <>
<p className="lead">Les plateformes de <strong>notaires en ligne</strong> se multiplient en France. Mais sont-elles légales ? Offrent-elles les mêmes garanties qu'une étude traditionnelle ? Ce guide fait le point sur le cadre réglementaire, les actes réalisables à distance et les limites à connaître.</p>

<KeyPoints points={[
  "L'acte authentique électronique est légal depuis le décret du 20 novembre 2020.",
  "Les plateformes légales emploient de vrais notaires inscrits à la chambre des notaires.",
  "La valeur juridique est identique à un acte papier signé en présence physique.",
  "Attention aux sites proposant des 'actes' sans notaire — ils n'ont aucune valeur authentique."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le cadre légal du notaire en ligne</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le décret du <strong className="text-[var(--color-text-strong)]">20 novembre 2020</strong> a consacré l'acte authentique électronique à distance en droit français. Il permet au notaire de recevoir les parties à distance par visioconférence et de signer un acte authentique ayant la même valeur juridique qu'un acte papier. Ce décret a levé le dernier obstacle réglementaire au notariat numérique.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Pour être légale, une plateforme de notaire en ligne doit respecter plusieurs conditions : les notaires qui y exercent doivent être <strong className="text-[var(--color-text-strong)]">titulaires de leur office</strong> et inscrits à la chambre des notaires de leur ressort ; la plateforme de visioconférence doit être <strong className="text-[var(--color-text-strong)]">homologuée</strong> par le Conseil Supérieur du Notariat ; l'identité des parties doit être vérifiée via un processus agréé (France Identité, IDnow ou équivalent).</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Les actes sont enregistrés dans le <strong className="text-[var(--color-text-strong)]">Minutier Central Électronique des Notaires de France (MICEN)</strong>, avec la même conservation que les minutes papier. En cas de perte, l'acte est retrouvable à tout moment pendant la durée légale de conservation (75 à 100 ans).</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Distinguer le vrai notaire en ligne du faux</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Il existe une différence fondamentale entre un notaire exerçant en ligne et une LegalTech générant des documents juridiques automatisés. Un notaire en ligne est un <strong className="text-[var(--color-text-strong)]">officier public</strong> nommé par arrêté du garde des Sceaux. Il engage sa responsabilité professionnelle sur chaque acte et est couvert par une assurance professionnelle obligatoire.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Une LegalTech proposant des "contrats" ou des "actes" sans notaire produit des documents sous seing privé, quelle que soit la technologie utilisée (blockchain, signature électronique qualifiée). Ces documents ont une valeur contractuelle, mais pas la valeur d'un acte authentique : pas de force exécutoire, pas de force probante absolue.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Pour vérifier qu'une plateforme emploie bien un vrai notaire, demandez le nom de l'étude et consultez l'annuaire officiel notaires.fr. Vous devez pouvoir retrouver l'étude avec son adresse, ses notaires nommément désignés et le numéro de leur office.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 73 ─────────────────────────────────────────────────────────── */

function Article73() {
  return (
    <>
<p className="lead">La <strong>rémunération du notaire</strong> est souvent mal comprise. Derrière les "frais de notaire" payés par l'acheteur immobilier se cachent en réalité trois types de flux financiers très différents. Ce guide vous explique comment un notaire est réellement payé et ce que représentent ses revenus.</p>

<KeyPoints points={[
  "Les émoluments réglementés sont la seule rémunération vraiment acquise par le notaire.",
  "Les droits fiscaux (5,8 % du prix en immobilier) sont reversés à l'État et aux collectivités.",
  "Un notaire libéral gagne en moyenne 150 000 à 200 000 € brut selon l'étude.",
  "Les études fonctionnent comme des entreprises avec charges salariales, loyer et investissements."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les trois composantes des frais de notaire</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Quand vous payez 25 000 € de "frais de notaire" pour un appartement à 300 000 €, seuls environ 3 000 € reviennent réellement au notaire. La grande majorité — environ 17 500 € — correspond aux <strong className="text-[var(--color-text-strong)]">droits de mutation</strong> que le notaire collecte pour le compte de l'État et des collectivités locales. Les 4 500 € restants sont des débours (frais divers avancés).</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Ces 3 000 € d'émoluments constituent la rémunération brute de l'étude. Sur ce montant, le notaire doit déduire les charges : salaires des clercs et secrétaires (40 à 60 % du chiffre d'affaires dans une étude moyenne), loyer, informatique, assurances professionnelles, cotisations chambre. Le revenu net du notaire libéral représente généralement 30 à 40 % du chiffre d'affaires.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Les <strong className="text-[var(--color-text-strong)]">honoraires libres</strong> — pour les consultations, bilans patrimoniaux, rédaction de contrats hors tarif — constituent un complément de revenus non négligeable pour les études spécialisées, mais ils restent minoritaires dans le chiffre d'affaires global d'une étude généraliste.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Revenus et disparités au sein de la profession</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La profession notariale présente de fortes disparités de revenus. Un notaire parisien dans une grande étude spécialisée en droit des affaires peut générer un revenu bien supérieur à la moyenne. À l'inverse, un notaire rural dans un département peu dynamique immobilièrement peut avoir des revenus modestes compte tenu de ses charges fixes.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le <strong className="text-[var(--color-text-strong)]">notaire salarié</strong> (collaborateur d'une étude) perçoit un salaire fixe de 40 000 à 80 000 € brut annuel selon l'ancienneté et la région. Il ne supporte pas les risques liés à la gestion d'une étude, mais n'en percevra pas les fruits si elle prospère.</p>
<p className="text-[var(--color-muted)] leading-relaxed">L'achat d'un <strong className="text-[var(--color-text-strong)]">office notarial</strong> représente un investissement considérable — entre 500 000 et plusieurs millions d'euros selon la taille. L'amortissement de cet investissement pèse sur les revenus du notaire libéral les premières années. C'est pourquoi la profession est structurellement attachée au maintien des tarifs réglementés.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 74 ─────────────────────────────────────────────────────────── */

function Article74() {
  return (
    <>
<p className="lead">L'<strong>assurance-vie hors succession</strong> est l'un des piliers de la planification patrimoniale en France. Exonérée de droits de succession sous certaines conditions, elle permet de transmettre jusqu'à 152 500 € par bénéficiaire en franchise totale d'impôt. Mais son intégration dans une stratégie globale nécessite le conseil du notaire.</p>

<KeyPoints points={[
  "Jusqu'à 152 500 € par bénéficiaire sont transmis hors succession et hors droits pour les primes versées avant 70 ans.",
  "L'assurance-vie n'est pas soumise aux règles de la réserve héréditaire (sauf primes manifestement exagérées).",
  "La clause bénéficiaire doit être rédigée avec soin pour éviter les conflits post-décès.",
  "Le notaire coordonne l'assurance-vie avec l'ensemble de la succession pour éviter les déséquilibres."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le régime fiscal privilégié de l'assurance-vie</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Pour les primes versées avant les 70 ans du souscripteur, chaque bénéficiaire reçoit un <strong className="text-[var(--color-text-strong)]">abattement de 152 500 €</strong> sur le capital transmis. Au-delà, le taux d'imposition est de 20 % jusqu'à 700 000 € et 31,25 % au-delà — très inférieur aux droits de succession classiques entre personnes non parentes (60 %).</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Pour les primes versées après 70 ans, le régime est moins favorable : seule la fraction dépassant 30 500 € (tous bénéficiaires confondus) est taxable aux droits de succession normaux. Mais les produits (intérêts et plus-values) restent totalement exonérés, ce qui maintient un avantage fiscal significatif.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Contrairement aux biens successoraux classiques, l'assurance-vie n'est pas soumise aux règles de <strong className="text-[var(--color-text-strong)]">réserve héréditaire</strong>. Elle peut donc être utilisée pour avantager un bénéficiaire spécifique (conjoint non marié, enfant d'une autre union, ami, association) sans porter atteinte aux droits des héritiers réservataires — sauf si les primes sont "manifestement exagérées" par rapport au patrimoine global.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle du notaire dans votre stratégie assurance-vie</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le notaire ne souscrit pas d'assurance-vie — c'est le rôle du conseiller financier ou de la banque. Mais il joue un rôle crucial dans la <strong className="text-[var(--color-text-strong)]">coordination de l'assurance-vie avec la succession</strong>. Il analyse l'impact des contrats sur l'équilibre successoral et alerte sur les risques de réduction (primes manifestement exagérées) ou de rapport à succession.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le notaire conseille également sur la rédaction de la <strong className="text-[var(--color-text-strong)]">clause bénéficiaire</strong>. Une clause mal rédigée peut entraîner des conflits : "mes héritiers" désigne les héritiers au sens civil (pas toujours les mêmes que les héritiers au sens fiscal), "mes enfants" peut poser problème en cas de famille recomposée. Une clause notariée est irrévocable sans l'accord du bénéficiaire acceptant.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Enfin, le notaire inclut le capital assurance-vie dans le <strong className="text-[var(--color-text-strong)]">bilan patrimonial global</strong> pour construire une stratégie cohérente. Il peut recommander d'ajuster les montants ou les bénéficiaires pour équilibrer les transmissions entre les différents héritiers et réduire la pression fiscale globale sur la succession.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 75 ─────────────────────────────────────────────────────────── */

function Article75() {
  return (
    <>
<p className="lead">Prendre rendez-vous avec un notaire en ligne est désormais aussi simple que de réserver une table au restaurant. Plateformes dédiées, sites des études, applications mobiles : les options se multiplient. Ce guide vous explique comment trouver et réserver un créneau notarial en ligne efficacement.</p>

<KeyPoints points={[
  "Environ 40 % des études notariales proposent la prise de rendez-vous en ligne.",
  "Les plateformes spécialisées agrègent les disponibilités de centaines d'études.",
  "Précisez le motif du rendez-vous pour qu'on vous oriente vers le bon notaire.",
  "Pour un rendez-vous de conseil général, préparez les documents clés à l'avance."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les différents canaux de prise de rendez-vous</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le premier canal est le <strong className="text-[var(--color-text-strong)]">site de l'étude notariale</strong>. De plus en plus d'études intègrent un module de réservation en ligne (souvent via Doctolib for Business, Calendly ou un outil maison). Recherchez l'étude sur notaires.fr, visitez son site et cherchez un bouton "Prendre rendez-vous" ou "Réserver".</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Des <strong className="text-[var(--color-text-strong)]">plateformes spécialisées</strong> agrègent les disponibilités de nombreuses études. Elles permettent de filtrer par spécialité (immobilier, succession, droit de la famille), par localisation et par disponibilité dans les prochains jours. Elles proposent souvent aussi des rendez-vous en visioconférence.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">En dernier recours, l'<strong className="text-[var(--color-text-strong)]">appel téléphonique</strong> reste la méthode universelle. Le standard d'une étude notariale peut généralement proposer un rendez-vous dans la semaine pour une consultation simple, et dans les 48 heures pour les situations urgentes.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment bien préparer son premier rendez-vous</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Un rendez-vous notarial bien préparé est un rendez-vous court et efficace. Avant votre consultation, rassemblez les documents pertinents selon votre projet : pièce d'identité, livret de famille, titre de propriété, relevés bancaires récents, actes de succession existants, bail en cours.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Rédigez en amont une <strong className="text-[var(--color-text-strong)]">liste de vos questions</strong>. Un notaire facture souvent au temps passé pour les consultations libres — arriver avec des questions précises vous permettra d'aller à l'essentiel et d'éviter les oublis.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Indiquez clairement le <strong className="text-[var(--color-text-strong)]">motif du rendez-vous</strong> lors de la réservation : achat immobilier, succession, création de SCI, rédaction de testament, optimisation patrimoniale. Cela permet à l'étude de vous orienter vers le notaire ou le clerc spécialisé et d'allouer le temps approprié à votre dossier.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 76 ─────────────────────────────────────────────────────────── */

function Article76() {
  return (
    <>
<p className="lead">Une idée reçue tenace circule : la première consultation chez le notaire serait toujours gratuite. La réalité est plus nuancée. Certaines études offrent effectivement le premier rendez-vous, d'autres facturent des honoraires libres. Voici comment vous y retrouver.</p>

<KeyPoints points={[
  "Il n'existe aucune obligation légale de gratuité pour la première consultation.",
  "De nombreuses études offrent la première consultation dans l'espoir de décrocher un dossier.",
  "Pour les actes tarifés, le conseil lié à l'acte est inclus dans les émoluments.",
  "Une consultation facturée entre 150 et 300 € est raisonnable pour un bilan patrimonial d'une heure."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">La réalité des pratiques des études</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La réglementation notariale ne prévoit pas de première consultation obligatoirement gratuite. C'est une pratique commerciale adoptée par de nombreuses études pour attirer de nouveaux clients. En offrant un premier rendez-vous sans engagement, l'étude espère que vous lui confierez ensuite votre acte — dont les émoluments réglementés couvriront largement le temps offert.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">En pratique, si vous venez pour un projet concret (achat immobilier, succession, donation), la consultation initiale est généralement <strong className="text-[var(--color-text-strong)]">incluse dans les émoluments de l'acte</strong>. Le notaire ne facture pas séparément le temps passé à vous expliquer l'opération et à répondre à vos questions dans le cadre d'un acte qu'il va instrumenter.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">En revanche, si vous souhaitez une <strong className="text-[var(--color-text-strong)]">consultation patrimoniale pure</strong> — sans projet d'acte immédiat — l'étude est en droit de facturer des honoraires libres. Ces honoraires varient généralement entre 150 et 400 € pour une heure, selon la complexité et la région.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment savoir avant de prendre rendez-vous ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La transparence est la règle : demandez directement lors de votre prise de rendez-vous si la consultation est facturée et à quel tarif. Un notaire sérieux vous répondra clairement. Les honoraires libres doivent faire l'objet d'une <strong className="text-[var(--color-text-strong)]">convention d'honoraires préalable</strong> si le montant dépasse 150 € — demandez-la par écrit.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Pour les personnes aux revenus modestes, l'<strong className="text-[var(--color-text-strong)]">aide juridictionnelle</strong> peut couvrir les honoraires du notaire sous conditions de ressources. Les maisons de justice et du droit (MJD) proposent également des consultations juridiques gratuites avec des notaires bénévoles. Renseignez-vous auprès du tribunal judiciaire de votre arrondissement.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 77 ─────────────────────────────────────────────────────────── */

function Article77() {
  return (
    <>
<p className="lead">Une situation d'urgence peut nécessiter un acte notarié dans les 24 à 48 heures : testament d'urgence, procuration pour un proche hospitalisé, acte avant départ à l'étranger. Voici les solutions pour obtenir un <strong>rendez-vous notarial urgent</strong> rapidement.</p>

<KeyPoints points={[
  "La plupart des études peuvent accueillir une urgence réelle dans les 24 à 48 heures.",
  "Un service de garde notariale existe dans certains départements pour les urgences du week-end.",
  "Le testament olographe manuscrit est une alternative immédiate en attendant le notaire.",
  "La visioconférence permet d'accélérer les délais pour les actes réalisables à distance."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Que faire en cas d'urgence notariale ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Contactez en priorité <strong className="text-[var(--color-text-strong)]">votre notaire habituel</strong> ou une étude que vous connaissez. Expliquez clairement la nature de l'urgence — testament d'une personne en fin de vie, procuration urgente, acte avant départ imminent. Un bon notaire trouvera généralement une solution dans les 24 à 48 heures ouvrées.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Si aucun notaire de votre réseau n'est disponible, contactez la <strong className="text-[var(--color-text-strong)]">chambre départementale des notaires</strong>. Certaines chambres organisent un service de garde par roulement entre les études. La chambre peut vous orienter vers l'étude d'astreinte du jour.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Pour les urgences du week-end ou des jours fériés, le <strong className="text-[var(--color-text-strong)]">notaire de garde</strong> peut se déplacer au domicile ou à l'hôpital. Ce service existe dans la plupart des grandes villes. Les honoraires pour une intervention d'urgence hors horaires habituels peuvent être majorés par convention avec le client.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les alternatives en attendant le notaire</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Si l'urgence concerne un <strong className="text-[var(--color-text-strong)]">testament</strong>, le testament olographe (entièrement manuscrit, daté et signé) est immédiatement valable sans notaire. Rédigez-le à la main, datez-le et signez-le. Il peut être déposé chez un notaire ultérieurement pour conservation et enregistrement.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Pour une <strong className="text-[var(--color-text-strong)]">procuration simple</strong>, un acte sous seing privé signé devant deux témoins peut suffire pour des actes courants (retrait bancaire, gestion administrative). Pour les actes nécessitant une procuration authentique (vente immobilière), le notaire reste indispensable.</p>
<p className="text-[var(--color-muted)] leading-relaxed">La <strong className="text-[var(--color-text-strong)]">visioconférence</strong> accélère considérablement les délais pour les actes réalisables à distance. Si votre notaire est occupé physiquement mais disponible en visio, l'acte peut être signé depuis votre domicile ou depuis l'hôpital, avec un équipement minimal.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 78 ─────────────────────────────────────────────────────────── */

function Article78() {
  return (
    <>
<p className="lead">Le <strong>rendez-vous notarié en visioconférence</strong> est devenu une pratique courante depuis 2020. Que vous soyez expatrié, en déplacement ou simplement à l'aise avec les outils numériques, voici le mode d'emploi complet pour signer votre acte depuis chez vous.</p>

<KeyPoints points={[
  "Un ordinateur avec caméra, une bonne connexion internet et une pièce d'identité suffisent.",
  "La signature se fait via une identité numérique vérifiée (France Identité, Itsme ou équivalent).",
  "L'acte est immédiatement archivé au Minutier Central Électronique des Notaires.",
  "Les tarifs sont identiques à un rendez-vous physique (émoluments réglementés)."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Prérequis techniques et déroulement</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Pour participer à un rendez-vous notarié en visio, vous avez besoin d'un appareil avec caméra (ordinateur portable, tablette ou smartphone), d'une connexion internet stable (3 Mbps minimum en upload), et d'un navigateur récent. La plupart des plateformes fonctionnent directement dans le navigateur sans installation.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le notaire vous envoie un lien d'accès sécurisé avant le rendez-vous. À l'heure convenue, vous vous connectez et entrez dans une salle d'attente virtuelle. Le notaire vous accueille, vérifie votre identité (caméra orientée vers votre pièce d'identité), puis procède à la lecture de l'acte à l'écran, avec possibilité de partage d'écran pour que vous suiviez le document.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">signature électronique</strong> se fait en deux temps : vous recevez un code SMS ou validez via une application d'identité numérique (France Identité par exemple), puis vous signez électroniquement. Le notaire appose ensuite son sceau électronique. L'acte est immédiatement archivé au MICEN.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Avantages et situations idéales</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le rendez-vous en visio supprime les contraintes géographiques et temporelles. Il est particulièrement adapté aux <strong className="text-[var(--color-text-strong)]">expatriés français</strong> souhaitant régler des affaires en France sans rentrer physiquement (succession, donation, testament). La légalisation des documents peut être faite par l'ambassade ou le consulat en complément.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Il convient également aux <strong className="text-[var(--color-text-strong)]">personnes à mobilité réduite</strong>, aux actifs ayant des difficultés à se libérer pendant les heures de bureau, et aux clients dont le notaire est dans une autre ville que leur résidence actuelle (changement de domicile récent, notaire de famille historique).</p>
<p className="text-[var(--color-muted)] leading-relaxed">La limite principale reste les actes impliquant de nombreuses parties en présence physique simultanée, ou la remise de documents originaux. Pour une vente immobilière, la remise des clés nécessite tout de même une coordination logistique que la visio ne résout pas entièrement — mais la signature de l'acte, elle, peut se faire à distance.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 79 ─────────────────────────────────────────────────────────── */

function Article79() {
  return (
    <>
<p className="lead">Après un décès, le premier rendez-vous chez le notaire est souvent une étape redoutée. Documents à rassembler, questions complexes, émotions vives : comprendre à l'avance le déroulement de cette rencontre vous permettra d'aborder le règlement de la succession dans les meilleures conditions.</p>

<KeyPoints points={[
  "Le premier rendez-vous succession permet au notaire de faire l'inventaire et d'identifier les héritiers.",
  "Apportez : acte de décès, livret de famille, testament éventuel, titres de propriété, relevés bancaires.",
  "Le délai légal pour la déclaration de succession est de 6 mois en France métropolitaine.",
  "Les frais de notaire pour une succession sont proportionnels à l'actif net (environ 1,5 à 2 %)."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les documents à apporter au premier rendez-vous</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Rassembler les bons documents avant le premier rendez-vous vous fera gagner un temps précieux. L'essentiel : l'<strong className="text-[var(--color-text-strong)]">acte de décès</strong> (obtenu en mairie), le <strong className="text-[var(--color-text-strong)]">livret de famille</strong> du défunt (pour établir la filiation), les <strong className="text-[var(--color-text-strong)]">pièces d'identité</strong> de tous les héritiers présumés.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Si vous en avez connaissance : le <strong className="text-[var(--color-text-strong)]">testament</strong> (original ou enveloppe cachetée), les <strong className="text-[var(--color-text-strong)]">titres de propriété</strong> des biens immobiliers, les <strong className="text-[var(--color-text-strong)]">relevés bancaires</strong> récents, les <strong className="text-[var(--color-text-strong)]">contrats d'assurance-vie</strong>, les dettes connues (prêts en cours, factures impayées).</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Ne vous inquiétez pas si vous n'avez pas tous les documents. Le notaire dispose de moyens de recherche (FICOBA pour les comptes bancaires, AGIRA pour les assurances-vie, conservation des hypothèques pour l'immobilier). Il guidera les recherches nécessaires lors des premières semaines.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le déroulement du règlement successoral</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Lors du premier rendez-vous, le notaire établit un premier inventaire de la situation : identification des héritiers, patrimoine apparent du défunt, dettes connues, existence d'un testament ou d'une donation antérieure. Il vérifie également si le défunt avait un notaire habituel et si des actes antérieurs sont déposés.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les étapes suivantes sont : la recherche et valorisation des actifs successoraux, l'établissement de l'acte de notoriété (document officialisant la qualité d'héritier), la déclaration de succession auprès des impôts, et enfin le partage du patrimoine entre héritiers. Ce processus dure généralement 3 à 12 mois selon la complexité.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Les <strong className="text-[var(--color-text-strong)]">frais de notaire pour une succession</strong> sont réglementés et dégressifs selon l'actif net : 2,066 % jusqu'à 6 500 €, 1,033 % de 6 500 à 17 000 €, 0,689 % de 17 000 à 30 000 €, et 0,517 % au-delà. Pour une succession de 300 000 €, les émoluments s'élèvent à environ 1 700 € HT. S'y ajoutent les débours (frais de recherche) et la TVA.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 80 ─────────────────────────────────────────────────────────── */

function Article80() {
  return (
    <>
<p className="lead">Lors d'un achat immobilier, vous rencontrerez votre notaire à plusieurs reprises. Ces rendez-vous structurent votre acquisition et jalonnent les 2 à 4 mois entre la négociation et les clés. Voici ce qu'il se passe à chaque étape et comment vous y préparer.</p>

<KeyPoints points={[
  "Étape 1 — L'avant-contrat (compromis ou promesse) : engagement des deux parties.",
  "Étape 2 — Les vérifications et le financement : 2 à 3 mois de démarches.",
  "Étape 3 — La signature de l'acte authentique : remise des clés et paiement du prix.",
  "Vous pouvez avoir votre propre notaire même si le vendeur en a déjà un, sans surcoût."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Rendez-vous 1 : la signature du compromis</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le premier rendez-vous peut avoir lieu chez le notaire ou en agence. Si le compromis est signé chez un notaire, c'est un avant-contrat authentique — plus solide mais moins courant. En agence ou entre particuliers, c'est un acte sous seing privé — valide juridiquement mais moins protecteur.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">À ce stade, le notaire vérifie la capacité des parties, l'identité du vendeur et son titre de propriété. Il intègre les conditions suspensives (obtention du prêt, absence de servitudes cachées, conformité des diagnostics). L'acheteur verse un dépôt de garantie de 5 à 10 % du prix.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Après signature, l'acheteur dispose d'un <strong className="text-[var(--color-text-strong)]">droit de rétractation de 10 jours</strong>. Le vendeur, lui, est définitivement engagé dès la signature du compromis.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Rendez-vous 2 : la signature de l'acte authentique</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">C'est le rendez-vous le plus attendu — et souvent le plus stressant. Le notaire fait lire l'acte de vente à haute voix (ou en donne lecture résumée si les parties y consentent). Il explique chaque clause importante : prix, modalités de paiement, servitudes, garanties.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Prévoyez 1 à 2 heures pour ce rendez-vous. Les fonds ont généralement été virés à l'étude notariale quelques jours avant (le notaire les détient en séquestre). Au moment de la signature, le notaire procède au virement au vendeur et à la remise des clés.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Après signature, le notaire publie l'acte à la conservation des hypothèques dans les 3 mois. C'est cette publication qui rend la vente opposable aux tiers. Vous recevrez la copie authentique (minute) de l'acte environ 3 à 6 mois après la signature. Conservez-la précieusement — c'est le titre de propriété.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 81 ─────────────────────────────────────────────────────────── */

function Article81() {
  return (
    <>
<p className="lead">Le mariage et le PACS sont deux étapes clés de la vie qui ont des conséquences patrimoniales importantes. Consulter un notaire avant de vous unir vous permet de comprendre vos droits et d'adapter votre situation à votre projet de vie commun. Voici comment préparer ce rendez-vous.</p>

<KeyPoints points={[
  "Sans contrat de mariage, vous êtes soumis à la communauté réduite aux acquêts par défaut.",
  "Un contrat de mariage coûte entre 400 et 800 € chez le notaire.",
  "Le PACS notarié est plus personnalisable qu'un PACS en mairie.",
  "Le notaire vous explique les conséquences de chaque régime avant toute décision."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Mariage : le contrat ou le régime légal ?</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">En France, si vous ne signez pas de contrat de mariage avant votre union, vous êtes automatiquement soumis au régime de la <strong className="text-[var(--color-text-strong)]">communauté réduite aux acquêts</strong>. Dans ce régime, les biens acquis avant le mariage restent propres à chaque époux, tandis que les biens acquis pendant le mariage appartiennent aux deux époux à parts égales.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Ce régime convient à la majorité des couples, mais certaines situations justifient un contrat adapté. La <strong className="text-[var(--color-text-strong)]">séparation de biens</strong> est recommandée pour les entrepreneurs souhaitant protéger leur conjoint des risques professionnels. La <strong className="text-[var(--color-text-strong)]">communauté universelle</strong> convient aux couples souhaitant une mise en commun totale avec une protection maximale du conjoint survivant.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Le contrat de mariage doit être signé <strong className="text-[var(--color-text-strong)]">avant la cérémonie civile</strong>. Après le mariage, il est possible de changer de régime, mais la procédure est plus complexe (homologation judiciaire ou délai de 2 ans). Il est donc essentiel de se décider avant, avec l'aide du notaire.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le PACS notarié : une option plus complète</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Depuis 2017, le PACS peut être conclu en mairie gratuitement. Mais le <strong className="text-[var(--color-text-strong)]">PACS notarié</strong> offre une personnalisation patrimoniale plus poussée. Le notaire peut intégrer des clauses spécifiques concernant le logement commun, la gestion des dettes, les modalités de séparation des biens acquis ensemble.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le PACS notarié est également recommandé si vous êtes propriétaire d'un bien immobilier ou si votre partenaire l'est, car le notaire peut clarifier les droits de chacun sur ce bien. Il est aussi utile si vous souhaitez organiser votre protection mutuelle en cas de décès via des clauses testamentaires liées.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Le coût d'un PACS chez le notaire est d'environ <strong className="text-[var(--color-text-strong)]">200 à 400 €</strong> selon la complexité de la convention. La consultation préalable, qui peut durer 1 heure, est souvent incluse dans ce forfait.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 82 ─────────────────────────────────────────────────────────── */

function Article82() {
  return (
    <>
<p className="lead">Depuis 2017, le <strong>divorce par consentement mutuel sans juge</strong> est la procédure la plus utilisée en France. Dans ce cadre, le notaire joue un rôle obligatoire : il dépôse la convention de divorce pour lui donner force exécutoire. Voici ce que vous devez savoir sur ce rendez-vous particulier.</p>

<KeyPoints points={[
  "Depuis 2017, le divorce par consentement mutuel ne nécessite plus de juge mais un notaire.",
  "Les deux époux doivent avoir chacun leur propre avocat — la représentation commune est interdite.",
  "Le notaire dépose la convention au rang de ses minutes après un délai de réflexion de 15 jours.",
  "La convention doit prévoir le partage de tous les biens communs, y compris l'immobilier."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le rôle du notaire dans le divorce par consentement mutuel</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Dans le divorce par consentement mutuel "déjudiciarisé" (sans juge), les époux rédigent avec leurs avocats respectifs une <strong className="text-[var(--color-text-strong)]">convention de divorce</strong> qui règle tous les aspects de leur séparation : partage des biens, pension alimentaire, résidence des enfants, prestation compensatoire éventuelle.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Le notaire intervient à la fin de la procédure. Sa mission est de <strong className="text-[var(--color-text-strong)]">déposer la convention au rang de ses minutes</strong> après avoir vérifié l'identité des parties et leur consentement libre et éclairé. Ce dépôt confère à la convention la force exécutoire d'un acte authentique, sans décision judiciaire.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">La loi prévoit un <strong className="text-[var(--color-text-strong)]">délai de réflexion de 15 jours</strong> entre la communication du projet de convention aux époux et la signature définitive. Ce délai permet à chacun de reconsidérer sa décision. Le notaire ne peut déposer la convention qu'après l'expiration de ce délai.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le partage des biens immobiliers lors du divorce</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Si les époux possèdent des biens immobiliers communs, leur partage doit obligatoirement figurer dans la convention et faire l'objet d'un <strong className="text-[var(--color-text-strong)]">acte notarié de partage</strong>. Ce partage est soumis aux droits de partage (2,5 % de l'actif net partagé) perçus par le notaire pour le compte de l'État.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Si l'un des époux souhaite conserver le bien immobilier, il doit racheter la part de l'autre. Ce rachat nécessite généralement un financement bancaire. Le notaire rédige l'acte de licitation et procède au remboursement du crédit commun si nécessaire.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Pour les couples non mariés (concubins) se séparant avec un bien immobilier en indivision, la procédure est différente mais le notaire intervient également pour organiser la sortie d'indivision ou la vente du bien.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 83 ─────────────────────────────────────────────────────────── */

function Article83() {
  return (
    <>
<p className="lead">Transmettre une partie de son patrimoine de son vivant est une décision qui mérite réflexion et préparation. Le rendez-vous notarial pour une <strong>donation</strong> est l'occasion d'optimiser cette transmission sur les plans juridique, fiscal et familial. Voici comment vous y préparer.</p>

<KeyPoints points={[
  "La donation est irrévocable (sauf exceptions légales) — mûrissez votre décision avant le rendez-vous.",
  "L'abattement légal est de 100 000 € par enfant et par parent, renouvelable tous les 15 ans.",
  "La donation en nue-propriété réduit la base taxable selon l'âge du donateur.",
  "Apportez : pièces d'identité, titres de propriété, état civil des bénéficiaires."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Choisir le type de donation adapté</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">donation simple</strong> transfère immédiatement la propriété d'un bien (immeuble, somme d'argent, valeurs mobilières) à un bénéficiaire. Elle est irrévocable sauf causes légales (ingratitude du donataire, survenance d'enfant).</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">donation avec réserve d'usufruit</strong> (donation en nue-propriété) permet au donateur de conserver l'usage du bien et/ou ses revenus (loyers) jusqu'à son décès. Elle offre un double avantage : la base taxable est réduite selon l'âge du donateur, et à son décès, les donataires récupèrent la pleine propriété sans fiscalité supplémentaire.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">donation-partage</strong> organise la transmission anticipée de l'ensemble du patrimoine entre plusieurs enfants ou héritiers. Elle présente l'avantage de figer les valeurs au jour de la donation (pas de rapport à succession ultérieur) et de prévenir les conflits successoraux.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Déroulement du rendez-vous et documents à apporter</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Lors du premier rendez-vous, le notaire analyse votre situation familiale et patrimoniale globale. Il vous présente les différentes options et leurs conséquences fiscales. C'est le moment d'exprimer vos objectifs (protéger le conjoint, égaliser entre enfants, favoriser un projet particulier) et vos contraintes (liquidités nécessaires, revenus à maintenir).</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Documents à apporter : pièces d'identité du donateur et des donataires, titres de propriété des biens donnés, état civil complet des bénéficiaires (acte de naissance récent), livret de famille. Pour un bien immobilier, des justificatifs de valeur (estimation immobilière récente) peuvent être demandés.</p>
<p className="text-[var(--color-muted)] leading-relaxed">La signature de l'acte de donation intervient lors d'un second rendez-vous, après que le notaire a préparé l'acte. La présence physique du donateur et du donataire est en principe requise (ou une procuration authentique). Les droits de donation sont calculés par le notaire et payés lors de la signature.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 84 ─────────────────────────────────────────────────────────── */

function Article84() {
  return (
    <>
<p className="lead">Combien coûte une consultation chez le notaire en 2025 ? La réponse varie selon le type de consultation, la région et la complexité de votre situation. Ce guide vous donne les tarifs pratiqués et vous aide à estimer le budget d'un rendez-vous notarial.</p>

<KeyPoints points={[
  "Les honoraires libres pour une consultation varient de 150 à 400 € l'heure.",
  "Pour les actes tarifés, le conseil est inclus dans les émoluments de l'acte.",
  "La première consultation est souvent gratuite si elle mène à un acte notarié.",
  "Des consultations gratuites existent en maisons de justice et maisons des notaires."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les tarifs selon le type de consultation</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Consultation juridique simple (30 min) :</strong> 80 à 150 € HT. Pour une question précise (validité d'un contrat, droits d'un héritier, interprétation d'un texte). Ce type de consultation est souvent offert si l'étude espère décrocher un dossier.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Bilan patrimonial (1 à 2 heures) :</strong> 200 à 600 € HT. Analyse complète de votre situation (patrimoine, régime matrimonial, fiscalité, objectifs de transmission). Les études spécialisées en gestion de patrimoine peuvent facturer davantage.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Consultation successorale :</strong> souvent incluse dans les émoluments de règlement de succession si vous mandatez le notaire pour la gestion de la succession. Pour une consultation pure sans mandat de succession, comptez 150 à 300 € HT.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Conseil en droit des affaires :</strong> 200 à 500 € HT l'heure pour les opérations complexes (transmission d'entreprise, pacte Dutreil, restructuration sociétaire). Ces honoraires sont comparables à ceux des avocats d'affaires.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment optimiser le coût de votre consultation</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Préparez une liste de questions précises — évitez les questions vagues du type "qu'est-ce que je dois faire ?". Plus votre situation est documentée et vos questions ciblées, moins de temps (et donc d'honoraires) seront nécessaires.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Pour les personnes souhaitant une consultation gratuite, les <strong className="text-[var(--color-text-strong)]">maisons de justice et du droit</strong>, les <strong className="text-[var(--color-text-strong)]">points d'accès au droit</strong> et certaines <strong className="text-[var(--color-text-strong)]">mairies</strong> proposent des permanences notariales gratuites. Ces consultations sont limitées à des questions générales — pour un projet précis nécessitant un acte, l'étude notariale reste incontournable.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 85 ─────────────────────────────────────────────────────────── */

function Article85() {
  return (
    <>
<p className="lead">Peut-on se présenter chez un notaire sans rendez-vous ? Dans certains cas oui, mais c'est rarement la meilleure solution. Voici ce que proposent les études notariales en matière d'accueil spontané et comment obtenir une consultation rapide sans attendre des semaines.</p>

<KeyPoints points={[
  "Certaines études proposent des permanences d'accueil sans rendez-vous le matin.",
  "Les maisons de justice offrent des consultations notariales gratuites sans rdv.",
  "Pour toute signature d'acte, un rendez-vous préalable est indispensable.",
  "Un email ou appel rapide permet souvent d'obtenir un créneau sous 48-72 heures."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Ce que les études proposent sans rendez-vous</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les grandes études notariales, notamment en zones urbaines, proposent parfois des <strong className="text-[var(--color-text-strong)]">plages d'accueil sans rendez-vous</strong> le matin (souvent de 9h à 11h). Ces créneaux permettent de déposer des documents, poser une question simple à un clerc, ou demander un devis pour un futur acte. Ils ne sont pas adaptés aux consultations complexes.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">En dehors de ces plages, se présenter sans rendez-vous expose au risque d'attendre plusieurs heures ou de repartir sans avoir vu un notaire. Les études sont souvent chargées avec des rendez-vous programmés tout au long de la journée.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">La solution intermédiaire est d'appeler l'étude en avance pour vérifier si quelqu'un peut vous recevoir rapidement. Un passage "dans l'heure" est parfois possible si vous avez une question simple et que le notaire ou un clerc a un créneau libre entre deux rendez-vous.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les alternatives gratuites et accessibles sans rendez-vous</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les <strong className="text-[var(--color-text-strong)]">maisons de justice et du droit (MJD)</strong> proposent des consultations juridiques gratuites avec des notaires bénévoles, souvent sans rendez-vous lors des permanences. Les horaires et jours varient — consultez le site de votre tribunal judiciaire.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Le <strong className="text-[var(--color-text-strong)]">site notaires.fr</strong> dispose également d'une FAQ juridique en ligne permettant de répondre aux questions courantes sans se déplacer. Pour les questions urgentes, le service en ligne du Conseil Supérieur du Notariat peut orienter vers les ressources appropriées.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 86 ─────────────────────────────────────────────────────────── */

function Article86() {
  return (
    <>
<p className="lead">Les délais notariaux sont souvent sources d'incompréhension et de frustration. Entre le rendez-vous initial, la préparation de l'acte et sa signature, quels délais pouvez-vous réellement espérer ? Et comment les raccourcir ? Ce guide vous donne les chiffres réels.</p>

<KeyPoints points={[
  "Rendez-vous de consultation : 3 à 10 jours ouvrés en moyenne.",
  "Acte de vente immobilière : 2 à 4 mois incompressibles (vérifications + financement).",
  "Règlement de succession : 3 à 18 mois selon la complexité.",
  "Donation simple : 3 à 6 semaines après le premier rendez-vous."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Délais selon les types d'actes</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Testament :</strong> 1 à 2 semaines. C'est l'un des actes les plus rapides — le notaire prend votre dictée, rédige l'acte et vous le fait signer dans un délai court. En urgence (hospitalisation), il peut intervenir sous 24 à 48 heures.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Donation simple :</strong> 3 à 6 semaines. Le premier rendez-vous est suivi de la préparation de l'acte, du calcul des droits et de la signature. Le paiement des droits de donation peut intervenir le jour de la signature ou dans les 30 jours.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Vente immobilière :</strong> 2 à 4 mois. Ce délai est dicté par les vérifications obligatoires (état hypothécaire, situation fiscale du vendeur, purge du droit de préemption) et l'obtention du financement de l'acheteur. Un achat comptant peut descendre à 3 à 5 semaines.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Succession :</strong> 3 à 18 mois selon la complexité. La déclaration de succession doit être déposée dans les 6 mois. Le règlement complet (partage, vente éventuelle des biens immobiliers) peut prendre jusqu'à 2 ans dans les cas litigieux.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment accélérer votre dossier</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La principale cause de retard est l'incomplétion du dossier. Transmettez tous les documents demandés dans les 48 heures suivant la demande du clerc. Chaque document manquant peut retarder l'acte d'une à deux semaines.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Évitez les périodes de forte activité notariale : juillet-août (congés), décembre-janvier (fin d'exercice fiscal). En signalant votre contrainte de délai dès le premier contact, le notaire peut prioriser votre dossier et planifier les démarches en parallèle plutôt que séquentiellement.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 87 ─────────────────────────────────────────────────────────── */

function Article87() {
  return (
    <>
<p className="lead">Une urgence notariale un samedi ou un dimanche ? La situation est rare mais pas sans solution. Certaines études ouvrent le week-end, et des services de garde notariale existent dans la plupart des départements pour les véritables urgences.</p>

<KeyPoints points={[
  "Certaines études ouvrent le samedi matin sur rendez-vous.",
  "La chambre départementale des notaires peut orienter vers un notaire de garde.",
  "Le samedi, les actes courants (testament, procuration, donation) sont réalisables.",
  "Les urgences absolues du dimanche nécessitent de contacter la chambre ou le procureur."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les études ouvertes le samedi</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Les études notariales sont traditionnellement fermées le week-end. Cependant, de plus en plus d'études, notamment dans les grandes villes et les zones touristiques, proposent des <strong className="text-[var(--color-text-strong)]">créneaux le samedi matin</strong> sur rendez-vous. Ces créneaux répondent à la demande des actifs ne pouvant pas se libérer en semaine.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Pour trouver une étude ouverte le samedi dans votre secteur, consultez directement les sites des études locales ou appelez le lundi-vendredi pour demander si des créneaux du samedi sont disponibles. Certaines plateformes de prise de rendez-vous en ligne affichent les disponibilités du week-end.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">visioconférence</strong> a également élargi les possibilités : certains notaires proposent des rendez-vous à distance le samedi matin, depuis leur domicile ou depuis l'étude, pour les actes réalisables à distance (testament, procuration, consultation).</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Le service de garde pour les urgences du week-end</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Pour les véritables urgences du dimanche ou des jours fériés — personne mourante souhaitant tester, procuration urgente avant départ immédiat — certaines <strong className="text-[var(--color-text-strong)]">chambres départementales des notaires</strong> organisent un service de garde par roulement. Le notaire de garde peut intervenir au domicile ou à l'hôpital.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Pour contacter le notaire de garde, appelez la chambre des notaires de votre département (numéro disponible sur notaires.fr → votre département → chambre). En dehors des heures d'ouverture de la chambre, certains départements disposent d'un numéro d'urgence. Dans les cas extrêmes, le procureur de la République peut réquisitionner un notaire.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 88 ─────────────────────────────────────────────────────────── */

function Article88() {
  return (
    <>
<p className="lead">Avant de prendre un rendez-vous chez un notaire, il est utile de savoir combien de temps prévoir dans votre agenda. La durée varie considérablement selon le type d'acte et la complexité de votre situation. Voici les durées types pour les principaux rendez-vous notariaux.</p>

<KeyPoints points={[
  "Signature d'un acte de vente : 1 à 2 heures (lecture de l'acte + échanges + signature).",
  "Règlement de succession (premier rdv) : 30 à 60 minutes.",
  "Consultation patrimoniale : 1 à 2 heures selon la complexité.",
  "Testament simple : 20 à 45 minutes."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Durées types selon les actes</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Testament authentique :</strong> 20 à 45 minutes. Le notaire prend en note vos volontés, rédige l'acte séance tenante ou vous le présente préparé en avance, puis procède à la signature. Un testament complexe avec de nombreux legs particuliers peut prendre 1 heure.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Acte de vente immobilière :</strong> 1 à 2 heures. La lecture intégrale de l'acte (obligatoire) prend 30 à 45 minutes pour un appartement classique. Ajoutez les échanges, la vérification des identités, le paiement du prix et la remise des clés.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Donation simple :</strong> 45 minutes à 1h30. Selon la complexité du bien donné et le nombre de bénéficiaires, le temps de lecture et d'explication varie. Une donation-partage complexe peut nécessiter 2 à 3 heures.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed"><strong className="text-[var(--color-text-strong)]">Premier rendez-vous succession :</strong> 30 à 60 minutes pour collecter les informations et expliquer les grandes étapes. Le notaire ne peut pas finaliser le règlement en un seul rendez-vous — ce premier contact est avant tout informatif.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment réduire la durée de votre rendez-vous</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Demandez à recevoir l'acte par email 2 à 3 jours avant la signature. Une lecture préalable vous permet de poser vos questions par écrit, d'identifier les points bloquants et d'arriver prêt le jour J. Cette préparation peut réduire la durée du rendez-vous de 30 à 50 %.</p>
<p className="text-[var(--color-muted)] leading-relaxed">La loi permet de remplacer la lecture intégrale de l'acte par une <strong className="text-[var(--color-text-strong)]">lecture résumée</strong> si toutes les parties y consentent expressément. Cette option est de plus en plus utilisée pour les actes standardisés (vente d'appartement classique) et permet de gagner 20 à 30 minutes.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 89 ─────────────────────────────────────────────────────────── */

function Article89() {
  return (
    <>
<p className="lead">Un décès soudain place les proches dans une situation de double urgence : émotionnelle et administrative. La succession doit être organisée, des délais fiscaux courent, et des décisions importantes ne peuvent pas attendre. Voici comment trouver un notaire en urgence pour une succession et quelles sont les premières démarches prioritaires.</p>

<KeyPoints points={[
  "La déclaration de succession doit être déposée dans les 6 mois en France métropolitaine.",
  "Un acte de notoriété urgent peut être obtenu en quelques jours pour débloquer les comptes.",
  "Le notaire habituel de la famille est le premier à contacter.",
  "Les biens immobiliers ne peuvent pas être vendus sans le règlement préalable de la succession."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les premières 48 heures : prioriser</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Dans les premières 48 heures, les démarches administratives urgentes précèdent le notaire : déclaration de décès en mairie (dans les 24 heures), organisation des funérailles. Le notaire peut attendre 1 à 2 semaines pour le premier rendez-vous — sauf si des urgences spécifiques imposent une action notariale immédiate.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Ces urgences spécifiques incluent : une <strong className="text-[var(--color-text-strong)]">vente immobilière en cours</strong> au nom du défunt (qui peut nécessiter la désignation d'un mandataire successoral), une <strong className="text-[var(--color-text-strong)]">entreprise à diriger</strong> sans que les héritiers aient légalement le pouvoir d'agir, ou des <strong className="text-[var(--color-text-strong)]">comptes bancaires bloqués</strong> dont les héritiers ont immédiatement besoin.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Pour débloquer les comptes bancaires rapidement, le notaire peut établir en urgence un <strong className="text-[var(--color-text-strong)]">acte de notoriété</strong> : document officiel identifiant les héritiers et leurs droits. Cet acte permet aux héritiers de se présenter à la banque pour débloquer les avoirs (dans la limite de 5 000 € sans acte de notoriété pour les successions simples).</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Comment trouver un notaire rapidement pour une succession</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Si le défunt avait un notaire habituel, contactez-le en priorité. Son étude a peut-être déjà connaissance du dossier (testament en dépôt, actes antérieurs). Dans le cas contraire, contactez un notaire proche de votre domicile ou de celui du défunt en expliquant la situation d'urgence — les études accordent généralement la priorité aux successions.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Pensez également à contacter le <strong className="text-[var(--color-text-strong)]">Fichier Central des Dispositions de Dernières Volontés (FCDDV)</strong> via votre notaire pour vérifier si le défunt avait rédigé un testament. Cette vérification est indispensable avant tout règlement de succession.</p>

<InternalCTA />
    </>
  );
}

/* ── Article 90 ─────────────────────────────────────────────────────────── */

function Article90() {
  return (
    <>
<p className="lead">Une opportunité immobilière à saisir rapidement, un vendeur pressé, une offre de prêt expirant bientôt : parfois, un achat immobilier doit se conclure en urgence. Voici comment mobiliser efficacement un notaire pour accélérer votre transaction sans compromettre la sécurité juridique de l'opération.</p>

<KeyPoints points={[
  "L'achat comptant (sans crédit) permet de descendre sous les 4 semaines de délai.",
  "Certaines vérifications (état hypothécaire, purge préemption) sont incompressibles.",
  "Un notaire réactif et un dossier complet sont les deux leviers d'accélération.",
  "La visioconférence supprime les contraintes de déplacement pour signer plus vite."
]} />

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Les étapes accélérables et celles qui ne le sont pas</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Certaines étapes d'un achat immobilier sont <strong className="text-[var(--color-text-strong)]">incompressibles légalement</strong> : le droit de rétractation de 10 jours pour l'acheteur, le délai de réponse de la mairie sur le droit de préemption (2 mois). Il n'est pas possible d'y déroger, même avec l'accord des deux parties.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">En revanche, d'autres délais sont <strong className="text-[var(--color-text-strong)]">fortement dépendants de la réactivité des parties</strong> : la transmission des documents au notaire (identité, diagnostics, titre de propriété), l'obtention des relevés hypothécaires (1 à 2 semaines selon les services), la rédaction de l'acte par le clerc.</p>
<p className="text-[var(--color-muted)] mb-6 leading-relaxed">Pour un achat comptant, le délai peut théoriquement être ramené à <strong className="text-[var(--color-text-strong)]">3 à 4 semaines</strong> : 10 jours de rétractation + 7 à 10 jours de vérifications accélérées + quelques jours pour la rédaction et la signature. La mairie doit avoir renoncé à son droit de préemption ou la commune ne doit pas avoir de zone de préemption.</p>

<h2 className="text-2xl font-bold text-[var(--color-primary)] mt-10 mb-4">Mobiliser le bon notaire pour une urgence</h2>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">Expliquez dès le premier appel votre contrainte de délai. Un notaire qui sait qu'une offre de prêt expire dans 6 semaines priorisera votre dossier différemment de celui d'un achat standard. Précisez les dates butoirs et demandez explicitement si l'étude peut respecter ce délai.</p>
<p className="text-[var(--color-muted)] mb-4 leading-relaxed">La <strong className="text-[var(--color-text-strong)]">visioconférence</strong> supprime les contraintes de déplacement et d'agenda. Si l'une des parties est éloignée géographiquement, proposer une signature à distance peut décoincer un calendrier bloqué.</p>
<p className="text-[var(--color-muted)] leading-relaxed">Enfin, transmettez un dossier complet dès le premier contact : copie de la pièce d'identité, RIB, justificatif de domicile, attestation de l'offre de prêt ou relevés pour un achat comptant. Un dossier complet dès le départ supprime les allers-retours qui font perdre plusieurs jours précieux.</p>

<InternalCTA />
    </>
  );
}

export function getPostContent(slug: string): ReactNode {
  const fn = CONTENT_MAP[slug];
  if (!fn) return null;
  return fn();
}
