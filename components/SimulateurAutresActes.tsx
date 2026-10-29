"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import {
  LIENS,
  calculerDonation,
  calculerPartage,
  calculerSuccession,
  partNuePropriete,
  type Lien,
  type ResultatActe,
} from "@/lib/frais-actes";
import { formatEuros } from "@/lib/frais-notaire";

export type ActeGratuit = "donation" | "succession" | "partage";

function lireMontant(saisie: string): number {
  const n = Number(saisie.replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
const formatSaisie = (n: number) => (n > 0 ? n.toLocaleString("fr-FR") : "");

const champ =
  "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-[15px] text-[var(--color-text-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]";
const libelle = "block text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5";

function ChampMontant({ id, label, aide, valeur, onChange }: { id: string; label: string; aide?: string; valeur: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label htmlFor={id} className={libelle}>{label}</label>
      <div className="relative">
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          className={`${champ} pr-10`}
          value={formatSaisie(valeur)}
          onChange={(e) => onChange(lireMontant(e.target.value))}
          placeholder="0"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">€</span>
      </div>
      {aide && <p className="mt-1 text-[12px] text-[var(--color-muted)] text-justify hyphens-auto">{aide}</p>}
    </div>
  );
}

function ChoixLien({ id, valeur, onChange, label }: { id: string; valeur: Lien; onChange: (l: Lien) => void; label: string }) {
  return (
    <div>
      <label htmlFor={id} className={libelle}>{label}</label>
      <select id={id} className={champ} value={valeur} onChange={(e) => onChange(e.target.value as Lien)}>
        {LIENS.map((l) => (
          <option key={l.valeur} value={l.valeur}>{l.libelle}</option>
        ))}
      </select>
    </div>
  );
}

function Resultat({ titre, r, entete }: { titre: string; r: ResultatActe; entete?: React.ReactNode }) {
  return (
    <div className="bg-white border-t lg:border-t-0 lg:border-l border-[var(--color-border-soft)] p-6 sm:p-8 flex flex-col" aria-live="polite">
      <p className="text-[13px] font-bold tracking-[1.5px] uppercase text-[var(--color-accent)]">{titre}</p>
      <p className="mt-1 serif font-extrabold text-[42px] leading-tight tracking-tight text-[var(--color-text-strong)] tabular-nums">{formatEuros(r.total)}</p>
      <p className="text-[14px] text-[var(--color-muted)]">
        dont <strong className="text-[var(--color-text-strong)]">{formatEuros(r.impots)}</strong> d&apos;impôts et taxes
      </p>
      {entete}
      <dl className="mt-6 space-y-3 text-[14px]">
        {r.lignes.map((l) => (
          <div key={l.libelle} className="flex items-start justify-between gap-4 border-b border-[var(--color-border-soft)] pb-3">
            <div>
              <dt className="font-semibold text-[var(--color-text-strong)]">{l.libelle}</dt>
              <dd className="text-[12px] text-[var(--color-muted)] text-justify hyphens-auto">{l.detail}</dd>
            </div>
            <dd className="font-semibold tabular-nums text-[var(--color-text-strong)] whitespace-nowrap">{formatEuros(l.montant)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 rounded-xl bg-[var(--color-accent-soft)] p-4 text-[13px] text-[var(--color-text-strong)] flex gap-3 text-justify hyphens-auto">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-primary)]" aria-hidden />
        <ul className="space-y-1.5">
          <li>Le notaire garde <strong>{formatEuros(r.partNotaireHT)} HT</strong> d&apos;émoluments ; le reste est reversé à l&apos;État.</li>
          {r.notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      </div>
      <a
        href="/notaire-succession"
        className="mt-6 flex w-full items-center justify-center rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-5 py-3.5 text-[15px] font-bold text-white shadow-[var(--shadow-cta)] transition-colors"
      >
        Prendre rendez-vous avec un notaire
      </a>
    </div>
  );
}

function Donation() {
  const [valeur, setValeur] = useState(300_000);
  const [lien, setLien] = useState<Lien>("enfant");
  const [nuePropriete, setNuePropriete] = useState(false);
  const [age, setAge] = useState(65);
  const [handicap, setHandicap] = useState(false);
  const [dejaUtilise, setDejaUtilise] = useState(0);
  const r = calculerDonation({ valeur, lien, nuePropriete, ageDonateur: age, handicap, abattementDejaUtilise: dejaUtilise });
  return (
    <>
      <form className="p-6 sm:p-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <ChampMontant id="don-valeur" label="Valeur du bien donné" aide="Valeur vénale au jour de la donation, pour un donateur." valeur={valeur} onChange={setValeur} />
        <ChoixLien id="don-lien" label="Le bénéficiaire est votre…" valeur={lien} onChange={setLien} />
        <label className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3 cursor-pointer">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--color-primary)]" checked={nuePropriete} onChange={(e) => setNuePropriete(e.target.checked)} />
          <span>
            <span className="block text-[14px] font-semibold text-[var(--color-text-strong)]">Je garde l&apos;usufruit (donation de la nue-propriété)</span>
            <span className="block text-[12px] text-[var(--color-muted)] text-justify hyphens-auto">Vous continuez d&apos;habiter le bien ou d&apos;en percevoir les loyers ; les droits portent sur la seule nue-propriété.</span>
          </span>
        </label>
        {nuePropriete && (
          <div>
            <label htmlFor="don-age" className={libelle}>Âge du donateur</label>
            <input id="don-age" type="number" min={18} max={110} className={champ} value={age} onChange={(e) => setAge(Number(e.target.value) || 0)} />
            <p className="mt-1 text-[12px] text-[var(--color-muted)] text-justify hyphens-auto">Nue-propriété : {partNuePropriete(age)} % de la valeur du bien (art. 669 du CGI).</p>
          </div>
        )}
        <ChampMontant id="don-deja" label="Déjà donné à cette personne depuis moins de 15 ans" aide="Ces donations consomment l'abattement." valeur={dejaUtilise} onChange={setDejaUtilise} />
        <label className="flex items-center gap-3 text-[14px] text-[var(--color-text-strong)] cursor-pointer">
          <input type="checkbox" className="h-4 w-4 accent-[var(--color-primary)]" checked={handicap} onChange={(e) => setHandicap(e.target.checked)} />
          Bénéficiaire en situation de handicap (abattement supplémentaire de 159 325 €)
        </label>
      </form>
      <Resultat
        titre="Coût total de la donation"
        r={r}
        entete={
          <p className="mt-2 text-[13px] text-[var(--color-muted)] text-justify hyphens-auto">
            Valeur taxable {formatEuros(r.valeurTaxable)} · abattement {formatEuros(r.droits.abattement)} · part taxable {formatEuros(r.droits.baseTaxable)}
          </p>
        }
      />
    </>
  );
}

function Succession() {
  const [actifBrut, setActifBrut] = useState(400_000);
  const [immobilier, setImmobilier] = useState(300_000);
  const [passif, setPassif] = useState(0);
  const [nb, setNb] = useState(2);
  const [lien, setLien] = useState<Lien>("enfant");
  const r = calculerSuccession({ actifBrut, immobilier, passif, nbHeritiers: nb, lien });
  return (
    <>
      <form className="p-6 sm:p-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <ChampMontant id="suc-actif" label="Patrimoine total du défunt" aide="Biens immobiliers, comptes, placements, véhicules… (hors assurance-vie)." valeur={actifBrut} onChange={setActifBrut} />
        <ChampMontant id="suc-immo" label="Dont biens immobiliers" valeur={immobilier} onChange={setImmobilier} />
        <ChampMontant id="suc-passif" label="Dettes à déduire" aide="Prêts restant dus, impôts dus, frais d'obsèques (1 500 € au plus)." valeur={passif} onChange={setPassif} />
        <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
          <ChoixLien id="suc-lien" label="Les héritiers sont…" valeur={lien} onChange={setLien} />
          <div>
            <label htmlFor="suc-nb" className={libelle}>Nombre</label>
            <input id="suc-nb" type="number" min={1} max={20} className={`${champ} w-24`} value={nb} onChange={(e) => setNb(Math.max(1, Number(e.target.value) || 1))} />
          </div>
        </div>
      </form>
      <Resultat
        titre="Coût total de la succession"
        r={r}
        entete={
          <p className="mt-2 text-[13px] text-[var(--color-muted)] text-justify hyphens-auto">
            Part de chaque héritier {formatEuros(r.partNette)} · abattement {formatEuros(r.droitsParHeritier.abattement)} · droits par héritier {formatEuros(r.droitsParHeritier.droits)}
          </p>
        }
      />
    </>
  );
}

function Partage() {
  const [actifBrut, setActifBrut] = useState(350_000);
  const [immobilier, setImmobilier] = useState(350_000);
  const [passif, setPassif] = useState(120_000);
  const [divorce, setDivorce] = useState(true);
  const r = calculerPartage({ actifBrut, immobilier, passif, divorce });
  return (
    <>
      <form className="p-6 sm:p-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className={libelle}>Situation</legend>
          <div className="grid grid-cols-2 gap-2">
            {([
              [true, "Divorce ou fin de PACS", "Droit de partage à 1,10 %"],
              [false, "Succession, indivision", "Droit de partage à 2,50 %"],
            ] as const).map(([valeur, titre, aide]) => (
              <label
                key={titre}
                className={`cursor-pointer rounded-xl border px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-primary)] ${
                  divorce === valeur ? "border-[var(--color-primary)] bg-[var(--color-accent-soft)]" : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                }`}
              >
                <input type="radio" name="partage-situation" className="sr-only" checked={divorce === valeur} onChange={() => setDivorce(valeur)} />
                <span className="block text-[14px] font-semibold text-[var(--color-text-strong)]">{titre}</span>
                <span className="block text-[12px] text-[var(--color-muted)] text-justify hyphens-auto">{aide}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <ChampMontant id="par-actif" label="Valeur des biens partagés" aide="Valeur totale du logement et des autres biens à partager." valeur={actifBrut} onChange={setActifBrut} />
        <ChampMontant id="par-immo" label="Dont biens immobiliers" valeur={immobilier} onChange={setImmobilier} />
        <ChampMontant id="par-passif" label="Dettes reprises dans le partage" aide="Le capital restant dû du prêt immobilier, par exemple." valeur={passif} onChange={setPassif} />
      </form>
      <Resultat
        titre="Coût total du partage"
        r={r}
        entete={<p className="mt-2 text-[13px] text-[var(--color-muted)] text-justify hyphens-auto">Actif net partagé {formatEuros(r.actifNet)} · droit de partage {r.tauxPartage.toLocaleString("fr-FR")} %</p>}
      />
    </>
  );
}

export default function SimulateurAutresActes({ acte }: { acte: ActeGratuit }) {
  return (
    <div className="grid lg:grid-cols-[1fr_1.05fr]">
      {acte === "donation" && <Donation />}
      {acte === "succession" && <Succession />}
      {acte === "partage" && <Partage />}
    </div>
  );
}
