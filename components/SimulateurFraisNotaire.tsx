"use client";

import { useState } from "react";
import { Calculator, Check, ChevronDown, Info, PiggyBank } from "lucide-react";
import {
  DEPARTEMENTS_FRAIS,
  FORMALITES,
  GARANTIES,
  calculerFrais,
  economies,
  economieTotale,
  formatEuros,
  formatPourcent,
  sommeAVerser,
  type Garantie,
  type TypeBien,
} from "@/lib/frais-notaire";
import SimulateurAutresActes, { type ActeGratuit } from "@/components/SimulateurAutresActes";

/** Lit un montant saisi librement (« 250 000 », « 250000 € »). */
function lireMontant(saisie: string): number {
  const n = Number(saisie.replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const formatSaisie = (n: number) => (n > 0 ? n.toLocaleString("fr-FR") : "");

const ACTES: [Acte, string][] = [
  ["achat", "Achat"],
  ["donation", "Donation"],
  ["succession", "Succession"],
  ["partage", "Partage, divorce"],
];
type Acte = "achat" | ActeGratuit;

export default function SimulateurFraisNotaire({ acteInitial = "achat" }: { acteInitial?: Acte }) {
  const [acte, setActe] = useState<Acte>(acteInitial);
  const [prix, setPrix] = useState(250_000);
  const [type, setType] = useState<TypeBien>("ancien");
  const [codeDepartement, setCodeDepartement] = useState("75");
  const [primoAccedant, setPrimoAccedant] = useState(false);
  const [mobilier, setMobilier] = useState(0);
  const [fraisAgence, setFraisAgence] = useState(0);
  const [pret, setPret] = useState(0);
  const [garantie, setGarantie] = useState<Garantie>("caution");
  const [taxeFonciere, setTaxeFonciere] = useState(0);
  const [dateSignature, setDateSignature] = useState("");
  const [depotGarantie, setDepotGarantie] = useState(0);
  const [detailOuvert, setDetailOuvert] = useState(false);

  const dep = DEPARTEMENTS_FRAIS.find((d) => d.code === codeDepartement)!;
  // La majoration à 5 % ne concerne que l'ancien et les départements qui l'ont votée.
  const primoUtile = type === "ancien" && dep.taux > dep.tauxPrimo;
  const entree = { prix, type, codeDepartement, primoAccedant: primoAccedant && primoUtile, mobilier, fraisAgence };
  // Calcul instantané : pas besoin de mémoïser.
  const r = calculerFrais(entree);
  const leviers = economies(entree, primoUtile);
  const economieAppliquee = economieTotale(entree);
  const mobilierTropEleve = prix > 0 && mobilier > prix * 0.1;
  const g = GARANTIES[garantie];
  const versement = sommeAVerser(entree, { pret, garantie, taxeFonciere, dateSignature, depotGarantie });
  const fourchette = (min: number, max: number) =>
    min === max ? formatEuros(min) : `${formatEuros(min)} à ${formatEuros(max)}`;

  const champ =
    "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-[15px] text-[var(--color-text-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]";
  const libelle = "block text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5";

  const lignes: [string, number, string][] = [
    ["Droits de mutation (impôts)", r.droitsMutation, `${formatPourcent(r.tauxDroits)} de ${formatEuros(r.assiette)}`],
    ["Émoluments du notaire (TTC)", r.emolumentsTTC, "Barème fixé par l'État, identique chez tous les notaires"],
    ["Contribution de sécurité immobilière", r.csi, "0,10 % du prix, 15 € minimum"],
    ...FORMALITES.map((f) => [`${f.libelle.replace(" (TTC)", "")} (estimation)`, f.montant, f.detail] as [string, number, string]),
  ];

  return (
    <section
      id="simulateur"
      aria-labelledby="simulateur-titre"
      className="rounded-2xl border border-[var(--color-border-soft)] bg-white shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-[var(--color-border-soft)]">
        <h2 id="simulateur-titre" className="flex items-center gap-2 serif font-bold tracking-tight text-[22px] text-[var(--color-text-strong)]">
          <Calculator className="w-5 h-5 text-[var(--color-primary)]" aria-hidden />
          Simulateur de frais de notaire
        </h2>
        <div role="tablist" aria-label="Type d'acte" className="mt-4 flex flex-wrap gap-2">
          {ACTES.map(([valeur, titre]) => (
            <button
              key={valeur}
              type="button"
              role="tab"
              aria-selected={acte === valeur}
              onClick={() => setActe(valeur)}
              className={`rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
                acte === valeur
                  ? "bg-[var(--color-primary)] text-white"
                  : "border border-[var(--color-border)] text-[var(--color-text-strong)] hover:border-[var(--color-primary)]"
              }`}
            >
              {titre}
            </button>
          ))}
        </div>
      </div>
      {acte !== "achat" ? (
        <SimulateurAutresActes acte={acte} />
      ) : (
      <div className="grid lg:grid-cols-[1fr_1.05fr]">
        {/* ── Saisie ── */}
        <form className="p-6 sm:p-8 space-y-5" onSubmit={(e) => e.preventDefault()}>

          <div>
            <label htmlFor="sim-prix" className={libelle}>Prix d&apos;achat du bien</label>
            <div className="relative">
              <input
                id="sim-prix"
                inputMode="numeric"
                autoComplete="off"
                className={`${champ} pr-10`}
                value={formatSaisie(prix)}
                onChange={(e) => setPrix(lireMontant(e.target.value))}
                placeholder="250 000"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">€</span>
            </div>
            <p className="mt-1 text-[12px] text-[var(--color-muted)]">Prix affiché, frais d&apos;agence compris s&apos;ils sont à votre charge.</p>
          </div>

          <fieldset>
            <legend className={libelle}>Type de bien</legend>
            <div className="grid grid-cols-2 gap-2">
              {([
                ["ancien", "Ancien", "Plus de 5 ans ou déjà revendu"],
                ["neuf", "Neuf / VEFA", "Vente soumise à TVA"],
              ] as const).map(([valeur, titre, aide]) => (
                <label
                  key={valeur}
                  className={`cursor-pointer rounded-xl border px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-primary)] ${
                    type === valeur
                      ? "border-[var(--color-primary)] bg-[var(--color-accent-soft)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="sim-type"
                    value={valeur}
                    checked={type === valeur}
                    onChange={() => setType(valeur)}
                    className="sr-only"
                  />
                  <span className="block text-[14px] font-semibold text-[var(--color-text-strong)]">{titre}</span>
                  <span className="block text-[12px] text-[var(--color-muted)]">{aide}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="sim-dep" className={libelle}>Département du bien</label>
            <select
              id="sim-dep"
              className={champ}
              value={codeDepartement}
              onChange={(e) => setCodeDepartement(e.target.value)}
            >
              {DEPARTEMENTS_FRAIS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.code} · {d.nom}
                </option>
              ))}
            </select>
            {type === "ancien" && (
              <p className="mt-1 text-[12px] text-[var(--color-muted)]">
                Taux départemental : {formatPourcent(dep.taux)}
                {dep.taux < 5 && " (ce département n'a pas voté la hausse à 5 %)"}
              </p>
            )}
          </div>

          <label
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
              primoUtile ? "cursor-pointer border-[var(--color-border)]" : "border-[var(--color-border-soft)] opacity-60"
            }`}
          >
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
              checked={primoAccedant && primoUtile}
              disabled={!primoUtile}
              onChange={(e) => setPrimoAccedant(e.target.checked)}
            />
            <span>
              <span className="block text-[14px] font-semibold text-[var(--color-text-strong)]">
                Primo-accédant, pour ma résidence principale
              </span>
              <span className="block text-[12px] text-[var(--color-muted)]">
                {primoUtile
                  ? "Pas propriétaire de votre résidence principale ces 2 dernières années : vous restez à 4,50 % au lieu de 5 %."
                  : type === "neuf"
                    ? "Sans effet dans le neuf : le taux réduit s'applique déjà."
                    : "Sans effet ici : ce département n'applique pas la hausse à 5 %."}
              </span>
            </span>
          </label>

          <div>
            <label htmlFor="sim-mobilier" className={libelle}>
              Mobilier vendu avec le bien <span className="font-normal text-[var(--color-muted)]">(facultatif)</span>
            </label>
            <div className="relative">
              <input
                id="sim-mobilier"
                inputMode="numeric"
                autoComplete="off"
                className={`${champ} pr-10`}
                value={formatSaisie(mobilier)}
                onChange={(e) => setMobilier(lireMontant(e.target.value))}
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">€</span>
            </div>
            <p className={`mt-1 text-[12px] ${mobilierTropEleve ? "text-[var(--color-danger)]" : "text-[var(--color-muted)]"}`}>
              {mobilierTropEleve
                ? "Une valeur élevée attire l'attention de l'administration fiscale : gardez une estimation réaliste, justifiée par une liste détaillée."
                : "Cuisine équipée, électroménager, meubles : listés et estimés à leur valeur réelle, ils sortent du calcul des droits."}
            </p>
          </div>

          <div>
            <label htmlFor="sim-agence" className={libelle}>
              Frais d&apos;agence à votre charge <span className="font-normal text-[var(--color-muted)]">(facultatif)</span>
            </label>
            <div className="relative">
              <input
                id="sim-agence"
                inputMode="numeric"
                autoComplete="off"
                className={`${champ} pr-10`}
                value={formatSaisie(fraisAgence)}
                onChange={(e) => setFraisAgence(lireMontant(e.target.value))}
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">€</span>
            </div>
            <p className="mt-1 text-[12px] text-[var(--color-muted)]">
              Compris dans le prix ci-dessus et mentionnés à votre charge dans le compromis : ils ne supportent pas les droits.
            </p>
          </div>

          <div>
            <label htmlFor="sim-pret" className={libelle}>
              Montant emprunté <span className="font-normal text-[var(--color-muted)]">(facultatif)</span>
            </label>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <div className="relative">
                <input
                  id="sim-pret"
                  inputMode="numeric"
                  autoComplete="off"
                  className={`${champ} pr-10`}
                  value={formatSaisie(pret)}
                  onChange={(e) => setPret(lireMontant(e.target.value))}
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">€</span>
              </div>
              <select
                aria-label="Garantie du prêt"
                className={champ}
                value={garantie}
                onChange={(e) => setGarantie(e.target.value as Garantie)}
              >
                <option value="caution">Caution</option>
                <option value="hypotheque">Hypothèque</option>
              </select>
            </div>
            <p className="mt-1 text-[12px] text-[var(--color-muted)]">Pour estimer les frais de garantie du prêt, facturés en plus.</p>
          </div>

          <fieldset className="rounded-xl border border-[var(--color-border-soft)] p-4 space-y-4">
            <legend className="px-1 text-[13px] font-bold text-[var(--color-text-strong)]">
              Pour la somme à verser au notaire <span className="font-normal text-[var(--color-muted)]">(facultatif)</span>
            </legend>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="sim-tf" className={libelle}>Taxe foncière annuelle</label>
                <div className="relative">
                  <input
                    id="sim-tf"
                    inputMode="numeric"
                    autoComplete="off"
                    className={`${champ} pr-10`}
                    value={formatSaisie(taxeFonciere)}
                    onChange={(e) => setTaxeFonciere(lireMontant(e.target.value))}
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">€</span>
                </div>
              </div>
              <div>
                <label htmlFor="sim-date" className={libelle}>Date de signature prévue</label>
                <input
                  id="sim-date"
                  type="date"
                  className={champ}
                  value={dateSignature}
                  onChange={(e) => setDateSignature(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="sim-depot" className={libelle}>Dépôt de garantie versé au compromis</label>
              <div className="relative">
                <input
                  id="sim-depot"
                  inputMode="numeric"
                  autoComplete="off"
                  className={`${champ} pr-10`}
                  value={formatSaisie(depotGarantie)}
                  onChange={(e) => setDepotGarantie(lireMontant(e.target.value))}
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">€</span>
              </div>
              <p className="mt-1 text-[12px] text-[var(--color-muted)]">En général 5 à 10 % du prix, déjà entre les mains du notaire.</p>
            </div>
          </fieldset>
        </form>

        {/* ── Résultat ── */}
        <div className="bg-white border-t lg:border-t-0 lg:border-l border-[var(--color-border-soft)] p-6 sm:p-8 flex flex-col" aria-live="polite">
          <p className="text-[13px] font-bold tracking-[1.5px] uppercase text-[var(--color-accent)]">Frais de notaire estimés</p>
          <p className="mt-1 serif font-extrabold text-[42px] leading-tight tracking-tight text-[var(--color-text-strong)] tabular-nums">{formatEuros(r.total)}</p>
          <p className="text-[14px] text-[var(--color-muted)]">
            soit <strong className="text-[var(--color-text-strong)]">{formatPourcent(r.pourcentage, 1)}</strong> du prix d&apos;achat
            {economieAppliquee > 0 && (
              <>
                {" · "}
                <span className="font-semibold text-[var(--color-success)]">{formatEuros(economieAppliquee)} économisés</span>
              </>
            )}
          </p>

          <dl className="mt-6 space-y-3 text-[14px]">
            {lignes.map(([titre, montant, aide]) => (
              <div key={titre} className="flex items-start justify-between gap-4 border-b border-[var(--color-border-soft)] pb-3">
                <div>
                  <dt className="font-semibold text-[var(--color-text-strong)]">{titre}</dt>
                  <dd className="text-[12px] text-[var(--color-muted)]">{aide}</dd>
                </div>
                <dd className="font-semibold tabular-nums text-[var(--color-text-strong)] whitespace-nowrap">{formatEuros(montant)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5">
            <p className="flex items-center gap-2 text-[14px] font-bold text-[var(--color-text-strong)]">
              <PiggyBank className="w-4 h-4 text-[var(--color-success)]" aria-hidden />
              Ce qui réduit votre note
            </p>
            <ul className="mt-2 space-y-2 text-[13px]">
              {leviers.map((l) => (
                <li key={l.levier} className="flex items-start justify-between gap-4">
                  <span>
                    <span className="flex items-center gap-1.5 font-semibold text-[var(--color-text-strong)]">
                      {l.appliquee && <Check className="w-3.5 h-3.5 text-[var(--color-success)]" aria-label="Déjà déduit" />}
                      {l.levier}
                    </span>
                    <span className="block text-[12px] text-[var(--color-muted)]">{l.explication}</span>
                  </span>
                  <span className={`font-semibold tabular-nums whitespace-nowrap ${l.appliquee ? "text-[var(--color-success)]" : "text-[var(--color-muted)]"}`}>
                    {l.appliquee ? "− " : "jusqu'à − "}{formatEuros(l.montant)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {pret > 0 && (
            <div className="mt-5 rounded-xl border border-[var(--color-border-soft)] p-4 text-[13px]">
              <p className="font-bold text-[var(--color-text-strong)]">Hors frais de notaire : garantie du prêt</p>
              <p className="mt-1 flex items-start justify-between gap-4">
                <span className="text-[var(--color-muted)]">{g.libelle}, {formatPourcent(g.min, 0)} à {formatPourcent(g.max, 1)} du montant emprunté. {g.note}</span>
                <span className="font-semibold tabular-nums whitespace-nowrap text-[var(--color-text-strong)]">
                  {formatEuros((pret * g.min) / 100)} à {formatEuros((pret * g.max) / 100)}
                </span>
              </p>
            </div>
          )}

          {prix > 0 && (
            <div className="mt-5 rounded-xl border-2 border-[var(--color-primary)] p-4 text-[13px]">
              <p className="text-[13px] font-bold tracking-[1.5px] uppercase text-[var(--color-accent)]">Somme à verser au notaire</p>
              <p className="mt-1 serif font-extrabold text-[28px] leading-tight tracking-tight tabular-nums text-[var(--color-text-strong)]">
                {fourchette(versement.totalMin, versement.totalMax)}
              </p>
              <ul className="mt-3 space-y-2">
                {versement.lignes.map((l) => (
                  <li key={l.libelle} className="flex items-start justify-between gap-4">
                    <span>
                      <span className="block font-semibold text-[var(--color-text-strong)]">{l.libelle}</span>
                      <span className="block text-[12px] text-[var(--color-muted)]">{l.detail}</span>
                    </span>
                    <span className="font-semibold tabular-nums whitespace-nowrap text-[var(--color-text-strong)]">
                      {l.min < 0 ? `− ${formatEuros(-l.min)}` : fourchette(l.min, l.max)}
                    </span>
                  </li>
                ))}
              </ul>
              {pret > 0 && (
                <p className="mt-3 border-t border-[var(--color-border-soft)] pt-3 flex items-start justify-between gap-4">
                  <span>
                    <span className="block font-semibold text-[var(--color-text-strong)]">Apport à prévoir</span>
                    <span className="block text-[12px] text-[var(--color-muted)]">
                      Une fois les {formatEuros(pret)} du prêt versés par la banque au notaire
                      {depotGarantie > 0 && `, en plus des ${formatEuros(depotGarantie)} déjà versés au compromis`}
                      {garantie === "caution" && " (la caution se règle à part, via la banque)"}.
                    </span>
                  </span>
                  <span className="font-bold tabular-nums whitespace-nowrap text-[var(--color-text-strong)]">
                    {fourchette(versement.apportMin, versement.apportMax)}
                  </span>
                </p>
              )}
              <p className="mt-3 text-[12px] text-[var(--color-muted)]">
                Le notaire appelle souvent une provision un peu supérieure et rembourse le trop-perçu après le décompte définitif.
                {taxeFonciere > 0 && !dateSignature && " Indiquez la date de signature pour calculer le prorata de taxe foncière."}
              </p>
            </div>
          )}

          <div className="mt-4 rounded-xl bg-[var(--color-accent-soft)] p-4 text-[13px] text-[var(--color-text-strong)] flex gap-3">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-primary)]" aria-hidden />
            <p>
              Le notaire ne garde que <strong>{formatEuros(r.partNotaire)} HT</strong> d&apos;émoluments, soit environ{" "}
              {formatPourcent(r.total > 0 ? (r.partNotaire / r.total) * 100 : 0, 0)} de la somme : l&apos;essentiel est reversé à l&apos;État et aux collectivités.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDetailOuvert((o) => !o)}
            aria-expanded={detailOuvert}
            aria-controls="simulateur-detail"
            className="mt-4 inline-flex items-center gap-1 self-start text-[13px] font-semibold text-[var(--color-primary)] hover:underline"
          >
            Voir le détail du calcul
            <ChevronDown className={`w-4 h-4 transition-transform ${detailOuvert ? "rotate-180" : ""}`} aria-hidden />
          </button>

          {detailOuvert && (
            <div id="simulateur-detail" className="mt-3 space-y-4 text-[13px] text-[var(--color-text-strong)]">
              <table className="w-full">
                <caption className="text-left font-semibold mb-1">Droits de mutation</caption>
                <tbody className="tabular-nums">
                  {type === "ancien" ? (
                    <>
                      <tr><td>Taxe départementale ({formatPourcent(r.tauxDepartement)})</td><td className="text-right">{formatEuros(r.droitsDepartement, 2)}</td></tr>
                      <tr><td>Taxe communale (1,20 %)</td><td className="text-right">{formatEuros(r.droitsCommune, 2)}</td></tr>
                      <tr><td>Frais d&apos;assiette (2,37 % de la taxe départementale)</td><td className="text-right">{formatEuros(r.fraisAssiette, 2)}</td></tr>
                    </>
                  ) : (
                    <>
                      <tr><td>Taxe de publicité foncière (0,70 %)</td><td className="text-right">{formatEuros(r.droitsDepartement, 2)}</td></tr>
                      <tr><td>Frais d&apos;assiette (2,14 % de la taxe)</td><td className="text-right">{formatEuros(r.fraisAssiette, 2)}</td></tr>
                    </>
                  )}
                </tbody>
              </table>
              <table className="w-full">
                <caption className="text-left font-semibold mb-1">Émoluments proportionnels (barème réglementé)</caption>
                <tbody className="tabular-nums">
                  {r.detailEmoluments.map((l) => (
                    <tr key={l.tranche}>
                      <td>{l.tranche} × {formatPourcent(l.taux, 3)}</td>
                      <td className="text-right">{formatEuros(l.montant, 2)}</td>
                    </tr>
                  ))}
                  <tr><td>TVA 20 %</td><td className="text-right">{formatEuros(r.tvaEmoluments, 2)}</td></tr>
                </tbody>
              </table>
              <p className="text-[12px] text-[var(--color-muted)]">
                Assiette des droits : {formatEuros(r.assiette)} (prix moins mobilier et frais d&apos;agence à votre charge).
                Formalités et débours : ordres de grandeur, le montant exact dépend du dossier.
                Taux départementaux : barème officiel de la DGFiP au 1er juin 2026.
              </p>
            </div>
          )}

          <a
            href="/notaire-immobilier"
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-5 py-3.5 text-[15px] font-bold text-white shadow-[var(--shadow-cta)] hover:shadow-[var(--shadow-cta-hover)] transition-shadow"
          >
            Prendre rendez-vous avec un notaire immobilier
          </a>
        </div>
      </div>
      )}
    </section>
  );
}
