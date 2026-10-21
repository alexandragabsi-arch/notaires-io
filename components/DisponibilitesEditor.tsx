"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Plus, X, Check, Loader2, ChevronLeft, ChevronRight, Repeat, CalendarOff, Eye, ExternalLink } from "lucide-react";
import {
  JOURS_SEMAINE,
  DUREE_MIN,
  DUREE_MAX,
  aujourdhuiParis,
  cleJour,
  disponibilitesParDefaut,
  erreurPlages,
  heuresDuJour,
  indexSemaine,
  nettoyerPlages,
  plagesDuJour,
  type Disponibilites,
  type Plage,
} from "@/lib/disponibilites";
import { enregistrerDisponibilites } from "@/lib/notaire-profiles";
import type { ListingNotaire } from "@/lib/notaires-listing";

const DUREES = [15, 30, 45, 60, 90];
const JOURNEE: Plage[] = [{ de: "09:00", a: "12:00" }, { de: "14:00", a: "18:00" }];

function copie(plages: Plage[]): Plage[] {
  return plages.map((p) => ({ ...p }));
}

/* ── Une ligne = un jour : case ouvert/fermé + horaires ────────────────── */
function LigneJour({
  libelle, plages, onChange, desactive, modifie, onRetablir,
}: {
  libelle: string;
  plages: Plage[];
  onChange: (p: Plage[]) => void;
  desactive?: boolean;
  modifie?: boolean;
  onRetablir?: () => void;
}) {
  const ouvert = plages.length > 0;
  const erreur = erreurPlages(plages);
  const maj = (i: number, champ: keyof Plage, v: string) =>
    onChange(plages.map((p, j) => (j === i ? { ...p, [champ]: v } : p)));
  function ajouter() {
    const [h] = (plages[plages.length - 1]?.a ?? "13:00").split(":").map(Number);
    onChange([...plages, { de: `${String(Math.min(h + 1, 22)).padStart(2, "0")}:00`, a: `${String(Math.min(h + 3, 23)).padStart(2, "0")}:00` }]);
  }

  return (
    <div className={`py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 ${desactive ? "opacity-40 pointer-events-none" : ""}`}>
      <label className="sm:w-[170px] shrink-0 inline-flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={ouvert}
          disabled={desactive}
          onChange={() => onChange(ouvert ? [] : copie(JOURNEE))}
          className="w-5 h-5 accent-[var(--color-accent)]"
        />
        <span className="font-semibold text-[15px] text-[var(--color-text-strong)] first-letter:uppercase">{libelle}</span>
      </label>

      <div className="flex-1 flex flex-wrap items-center gap-x-3 gap-y-2">
        {!ouvert ? (
          <span className="text-[14px] text-[var(--color-muted)]">Fermé</span>
        ) : (
          <>
            {plages.map((p, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-xl bg-[var(--color-tint-blue)] pl-2 pr-1 py-1">
                <input type="time" step={60} value={p.de} onChange={(e) => maj(i, "de", e.target.value)} aria-label="Début"
                  className="bg-transparent text-[14px] font-semibold text-[var(--color-text-strong)] focus:outline-none" />
                <span className="text-[var(--color-muted)]">–</span>
                <input type="time" step={60} value={p.a} onChange={(e) => maj(i, "a", e.target.value)} aria-label="Fin"
                  className="bg-transparent text-[14px] font-semibold text-[var(--color-text-strong)] focus:outline-none" />
                <button type="button" onClick={() => onChange(plages.filter((_, j) => j !== i))} aria-label="Retirer"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-danger)] hover:bg-white">
                  <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              </span>
            ))}
            <button type="button" onClick={ajouter} aria-label="Ajouter des horaires"
              className="w-8 h-8 rounded-full border-2 border-dashed border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </>
        )}
        {modifie && onRetablir && (
          <button type="button" onClick={onRetablir} className="text-[12px] font-semibold text-[var(--color-accent)] hover:underline">
            Remettre comme d&apos;habitude
          </button>
        )}
        {erreur && <span className="w-full text-[12px] text-[var(--color-danger)]">{erreur}</span>}
      </div>
    </div>
  );
}

/* ── Aperçu : l'agenda de réservation tel que le voient les clients ─────── */
function ApercuClient({ dispo, profileId }: { dispo: Disponibilites; profileId: string }) {
  const [page, setPage] = useState(0);
  // 7 jours par page à partir de demain, comme sur la fiche publique (3 mois).
  const jours = useMemo(() => {
    const d = aujourdhuiParis();
    return Array.from({ length: 7 }, (_, i) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1 + page * 7 + i));
  }, [page]);

  return (
    <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-tint-blue)] p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-2 text-[14px] font-bold text-[var(--color-text-strong)]">
          <Eye className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2.5} />
          Ce que voient vos clients
        </p>
        <a href={`/notaires/${profileId}?apercu=1`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-accent)] hover:underline">
          Voir ma fiche comme un client
          <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
        </a>
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} aria-label="Jours précédents"
          className="w-8 h-8 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] disabled:opacity-30">
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
        </button>
        <span className="text-[12px] font-semibold text-[var(--color-muted)]">
          {page === 0 ? "7 prochains jours" : `Du ${jours[0].toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`}
        </span>
        <button type="button" onClick={() => setPage((p) => Math.min(12, p + 1))} disabled={page === 12} aria-label="Jours suivants"
          className="w-8 h-8 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] disabled:opacity-30">
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
        <div className="grid grid-cols-7 gap-1.5 min-w-[490px]">
          {jours.map((d) => {
            const heures = heuresDuJour(dispo, d);
            return (
              <div key={cleJour(d)} className="flex flex-col gap-1.5">
                <div className="text-center pb-1">
                  <div className="text-[10px] font-bold uppercase text-[var(--color-muted)]">
                    {d.toLocaleDateString("fr-FR", { weekday: "short" })}
                  </div>
                  <div className="text-[13px] font-bold text-[var(--color-text-strong)]">{d.getDate()}</div>
                </div>
                {heures.length === 0 ? (
                  <div className="text-center text-[12px] text-[var(--color-muted)] py-1.5">—</div>
                ) : (
                  heures.map((h) => (
                    <span key={h} className="text-center py-1.5 rounded-lg bg-white text-[12px] font-semibold text-[var(--color-accent)] border border-[var(--color-border-soft)]">
                      {h}
                    </span>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Éditeur ───────────────────────────────────────────────────────────── */
export default function DisponibilitesEditor({ profile }: { profile: ListingNotaire }) {
  const [dispo, setDispo] = useState<Disponibilites>(() => profile.disponibilites ?? disponibilitesParDefaut());
  const [onglet, setOnglet] = useState<"habituelle" | "precise">("habituelle");
  const [semaineVue, setSemaineVue] = useState(0);
  const [modifie, setModifie] = useState(!profile.disponibilites);
  const [etat, setEtat] = useState<"repos" | "envoi" | "ok">("repos");
  const [erreur, setErreur] = useState("");

  function changer(next: Disponibilites) {
    setDispo(next);
    setModifie(true);
    setEtat("repos");
  }
  const aujourdhui = cleJour(aujourdhuiParis());

  // Les 7 jours de la semaine affichée (semaine en cours … +12 semaines).
  const jours = useMemo(() => {
    const lundi = aujourdhuiParis();
    lundi.setDate(lundi.getDate() - indexSemaine(lundi) + semaineVue * 7);
    return Array.from({ length: 7 }, (_, i) => new Date(lundi.getFullYear(), lundi.getMonth(), lundi.getDate() + i));
  }, [semaineVue]);

  function changerDate(cle: string, plages: Plage[]) {
    changer({ ...dispo, exceptions: { ...dispo.exceptions, [cle]: plages } });
  }
  function retablir(cle: string) {
    const exceptions = { ...dispo.exceptions };
    delete exceptions[cle];
    changer({ ...dispo, exceptions });
  }
  /** Cette semaine devient la semaine habituelle. */
  function reproduirePartout() {
    const semaine = jours.map((d) => copie(plagesDuJour(dispo, d)));
    const exceptions = { ...dispo.exceptions };
    for (const d of jours) delete exceptions[cleJour(d)];
    changer({ ...dispo, semaine, exceptions });
    setOnglet("habituelle");
  }
  function fermerSemaine() {
    const exceptions = { ...dispo.exceptions };
    for (const d of jours) if (cleJour(d) >= aujourdhui) exceptions[cleJour(d)] = [];
    changer({ ...dispo, exceptions });
  }

  const erreurSaisie =
    [...dispo.semaine, ...Object.values(dispo.exceptions)].map(erreurPlages).find(Boolean) ??
    (dispo.duree < DUREE_MIN || dispo.duree > DUREE_MAX ? `Durée entre ${DUREE_MIN} et ${DUREE_MAX} minutes.` : null);

  async function enregistrer() {
    if (erreurSaisie) return;
    setEtat("envoi");
    setErreur("");
    // Les dates passées ne servent plus : on ne les garde pas.
    const exceptions: Record<string, Plage[]> = {};
    for (const [c, p] of Object.entries(dispo.exceptions)) if (c >= aujourdhui) exceptions[c] = nettoyerPlages(p);
    const propre: Disponibilites = { duree: dispo.duree, semaine: dispo.semaine.map(nettoyerPlages), exceptions };
    try {
      await enregistrerDisponibilites(profile.id, propre);
      setDispo(propre);
      setModifie(false);
      setEtat("ok");
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "L'enregistrement a échoué. Réessayez.");
      setEtat("repos");
    }
  }

  const ongletCls = (actif: boolean) =>
    `flex-1 py-2 rounded-lg text-[14px] font-semibold transition-colors ${
      actif ? "bg-white text-[var(--color-text-strong)] shadow-sm" : "text-[var(--color-muted)] hover:text-[var(--color-text-strong)]"
    }`;

  return (
    <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 flex flex-col gap-5">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-tint-green)] flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-[var(--color-success)]" strokeWidth={2} />
        </div>
        <div>
          <h2 className="font-bold text-[17px] text-[var(--color-text-strong)]">Mes disponibilités</h2>
          <p className="text-[13px] text-[var(--color-muted)]">Cochez vos jours, indiquez vos horaires. C&apos;est tout.</p>
        </div>
      </div>

      {/* Durée */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[14px] text-[var(--color-muted)] mr-1">Un rendez-vous dure</span>
        {DUREES.map((m) => (
          <button key={m} type="button" onClick={() => changer({ ...dispo, duree: m })}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-colors ${
              dispo.duree === m
                ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            }`}>
            {m < 60 ? `${m} min` : m === 60 ? "1 h" : "1 h 30"}
          </button>
        ))}
        {!DUREES.includes(dispo.duree) && (
          <span className="px-3 py-1.5 rounded-full text-[13px] font-semibold bg-[var(--color-accent)] text-white">{dispo.duree} min</span>
        )}
      </div>

      {/* Onglets */}
      <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-tint-blue)]">
        <button type="button" onClick={() => setOnglet("habituelle")} className={ongletCls(onglet === "habituelle")}>
          Ma semaine habituelle
        </button>
        <button type="button" onClick={() => setOnglet("precise")} className={ongletCls(onglet === "precise")}>
          Une semaine précise
        </button>
      </div>

      {onglet === "habituelle" ? (
        <div className="divide-y divide-[var(--color-border-soft)]">
          {JOURS_SEMAINE.map((nom, i) => (
            <LigneJour key={nom} libelle={nom} plages={dispo.semaine[i] ?? []}
              onChange={(p) => changer({ ...dispo, semaine: dispo.semaine.map((j, k) => (k === i ? p : j)) })} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-[13px] text-[var(--color-muted)]">
            Une semaine différente (3 jours seulement, congés, horaires décalés) : changez-la ici, votre semaine habituelle ne bouge pas.
          </p>
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setSemaineVue((v) => Math.max(0, v - 1))} disabled={semaineVue === 0} aria-label="Semaine précédente"
              className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] disabled:opacity-30">
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <span className="text-[15px] font-bold text-[var(--color-text-strong)]">
              Semaine du {jours[0].toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
            </span>
            <button type="button" onClick={() => setSemaineVue((v) => Math.min(12, v + 1))} disabled={semaineVue === 12} aria-label="Semaine suivante"
              className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] disabled:opacity-30">
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
          <div className="divide-y divide-[var(--color-border-soft)]">
            {jours.map((d) => {
              const cle = cleJour(d);
              return (
                <LigneJour key={cle}
                  libelle={d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric" })}
                  plages={plagesDuJour(dispo, d)}
                  onChange={(p) => changerDate(cle, p)}
                  desactive={cle < aujourdhui}
                  modifie={cle in dispo.exceptions}
                  onRetablir={() => retablir(cle)} />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={reproduirePartout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-[var(--color-border)] text-[13px] font-semibold text-[var(--color-text-strong)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
              <Repeat className="w-4 h-4" strokeWidth={2.5} />
              Reproduire sur toutes les semaines
            </button>
            <button type="button" onClick={fermerSemaine}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-[var(--color-border)] text-[13px] font-semibold text-[var(--color-text-strong)] hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]">
              <CalendarOff className="w-4 h-4" strokeWidth={2.5} />
              Fermer cette semaine
            </button>
          </div>
        </div>
      )}

      {/* Aperçu en direct */}
      <ApercuClient dispo={dispo} profileId={profile.id} />

      {/* Enregistrer */}
      <div className="flex flex-col gap-2 pt-1">
        {(erreurSaisie || erreur) && <p className="text-[13px] text-[var(--color-danger)]">{erreurSaisie ?? erreur}</p>}
        <button type="button" onClick={enregistrer} disabled={etat === "envoi" || !!erreurSaisie || !modifie}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3.5 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] disabled:opacity-60 transition">
          {etat === "envoi" ? (
            <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} /> Enregistrement…</>
          ) : etat === "ok" && !modifie ? (
            <><Check className="w-4 h-4" strokeWidth={2.5} /> Enregistré, visible sur votre fiche</>
          ) : (
            "Enregistrer"
          )}
        </button>
      </div>
    </div>
  );
}
