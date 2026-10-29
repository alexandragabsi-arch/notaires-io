"use client";

import { useMemo, useState } from "react";
import { Calculator, ChevronDown, Info } from "lucide-react";
import {
  DEPARTEMENTS_FRAIS,
  FORFAIT_FORMALITES_TTC,
  calculerFrais,
  formatEuros,
  formatPourcent,
  type TypeBien,
} from "@/lib/frais-notaire";

/** Lit un montant saisi librement (« 250 000 », « 250000 € »). */
function lireMontant(saisie: string): number {
  const n = Number(saisie.replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const formatSaisie = (n: number) => (n > 0 ? n.toLocaleString("fr-FR") : "");

export default function SimulateurFraisNotaire() {
  const [prix, setPrix] = useState(250_000);
  const [type, setType] = useState<TypeBien>("ancien");
  const [codeDepartement, setCodeDepartement] = useState("75");
  const [primoAccedant, setPrimoAccedant] = useState(false);
  const [mobilier, setMobilier] = useState(0);
  const [detailOuvert, setDetailOuvert] = useState(false);

  const dep = DEPARTEMENTS_FRAIS.find((d) => d.code === codeDepartement)!;
  // La majoration à 5 % ne concerne que l'ancien et les départements qui l'ont votée.
  const primoUtile = type === "ancien" && dep.taux > dep.tauxPrimo;
  const r = useMemo(
    () => calculerFrais({ prix, type, codeDepartement, primoAccedant: primoAccedant && primoUtile, mobilier }),
    [prix, type, codeDepartement, primoAccedant, primoUtile, mobilier],
  );
  const mobilierTropEleve = prix > 0 && mobilier > prix * 0.1;

  const champ =
    "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-[15px] text-[var(--color-text-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]";
  const libelle = "block text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5";

  const lignes: [string, number, string][] = [
    ["Droits de mutation (impôts)", r.droitsMutation, `${formatPourcent(r.tauxDroits)} de ${formatEuros(r.assiette)}`],
    ["Émoluments du notaire (TTC)", r.emolumentsTTC, "Barème fixé par l'État, identique chez tous les notaires"],
    ["Contribution de sécurité immobilière", r.csi, "0,10 % du prix, 15 € minimum"],
    ["Formalités et débours (estimation)", r.formalites, "Cadastre, hypothèques, urbanisme, syndic…"],
  ];

  return (
    <section
      id="simulateur"
      aria-labelledby="simulateur-titre"
      className="rounded-2xl border border-[var(--color-border-soft)] bg-white shadow-[var(--shadow-strong)] overflow-hidden"
    >
      <div className="grid lg:grid-cols-[1fr_1.05fr]">
        {/* ── Saisie ── */}
        <form className="p-6 sm:p-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
          <h2 id="simulateur-titre" className="flex items-center gap-2 font-serif text-[22px] text-[var(--color-text-strong)]">
            <Calculator className="w-5 h-5 text-[var(--color-primary)]" aria-hidden />
            Simulateur de frais de notaire
          </h2>

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
            <p className="mt-1 text-[12px] text-[var(--color-muted)]">Prix net vendeur, sans les frais d&apos;agence s&apos;ils sont à votre charge.</p>
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
        </form>

        {/* ── Résultat ── */}
        <div className="bg-[var(--color-tint-blue)] p-6 sm:p-8 flex flex-col" aria-live="polite">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">Frais de notaire estimés</p>
          <p className="mt-1 font-serif text-[40px] leading-tight text-[var(--color-text-strong)] tabular-nums">{formatEuros(r.total)}</p>
          <p className="text-[14px] text-[var(--color-muted)]">
            soit <strong className="text-[var(--color-text-strong)]">{formatPourcent(r.pourcentage, 1)}</strong> du prix d&apos;achat
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

          <div className="mt-4 rounded-xl bg-white p-4 text-[13px] text-[var(--color-text-strong)] flex gap-3">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-primary)]" aria-hidden />
            <p>
              Le notaire ne garde que <strong>{formatEuros(r.partNotaire)} HT</strong> de ses émoluments, soit environ{" "}
              {formatPourcent(r.total > 0 ? (r.partNotaire / r.total) * 100 : 0, 0)} de la somme : l&apos;essentiel est reversé à l&apos;État et aux collectivités.
              {r.remiseMaxTTC > 0 &&
                ` Il peut accorder une remise de 20 % au plus sur la part de ses émoluments calculée au-delà de 100 000 €, soit jusqu'à ${formatEuros(r.remiseMaxTTC)} ici.`}
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
                Formalités et débours : forfait indicatif de {formatEuros(FORFAIT_FORMALITES_TTC)}, le montant exact dépend du dossier.
                Taux départementaux : barème officiel de la DGFiP au 1er juin 2026.
              </p>
            </div>
          )}

          <a
            href="/notaire-immobilier"
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-[image:var(--gradient-cta)] px-5 py-3.5 text-[15px] font-semibold text-white shadow-[var(--shadow-cta)] hover:shadow-[var(--shadow-cta-hover)] transition-shadow"
          >
            Prendre rendez-vous avec un notaire immobilier
          </a>
        </div>
      </div>
    </section>
  );
}
