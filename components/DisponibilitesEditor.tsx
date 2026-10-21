"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Plus, Trash2, Copy, Check, Clock, CalendarOff, Loader2 } from "lucide-react";
import {
  JOURS_SEMAINE,
  DUREE_MIN,
  DUREE_MAX,
  aujourdhuiParis,
  cleJour,
  jourDeCle,
  disponibilitesParDefaut,
  erreurPlages,
  heuresDuJour,
  nettoyerPlages,
  type Disponibilites,
  type Plage,
} from "@/lib/disponibilites";
import { enregistrerDisponibilites } from "@/lib/notaire-profiles";
import type { ListingNotaire } from "@/lib/notaires-listing";

const DUREES = [15, 20, 30, 45, 60, 90];

const champHeure =
  "w-[96px] px-2 py-1.5 rounded-lg border-2 border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] focus:outline-none focus:border-[var(--color-accent)] transition";

function libelleDate(cle: string): string {
  return jourDeCle(cle).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

/* ── Liste de plages éditables (une journée) ───────────────────────────── */
function EditeurPlages({ plages, onChange }: { plages: Plage[]; onChange: (p: Plage[]) => void }) {
  const erreur = erreurPlages(plages);
  function maj(i: number, champ: keyof Plage, v: string) {
    onChange(plages.map((p, j) => (j === i ? { ...p, [champ]: v } : p)));
  }
  function ajouter() {
    // Nouvelle plage à la suite de la dernière (ou 9h–12h pour la première).
    const der = plages[plages.length - 1];
    if (!der) return onChange([{ de: "09:00", a: "12:00" }]);
    const [h] = der.a.split(":").map(Number);
    const de = `${String(Math.min(h + 1, 22)).padStart(2, "0")}:00`;
    const a = `${String(Math.min(h + 4, 23)).padStart(2, "0")}:00`;
    onChange([...plages, { de, a }]);
  }
  return (
    <div className="flex flex-col gap-2">
      {plages.map((p, i) => (
        <div key={i} className="flex items-center gap-2 flex-wrap">
          <input type="time" step={60} value={p.de} onChange={(e) => maj(i, "de", e.target.value)} className={champHeure} aria-label="Début" />
          <span className="text-[13px] text-[var(--color-muted)]">à</span>
          <input type="time" step={60} value={p.a} onChange={(e) => maj(i, "a", e.target.value)} className={champHeure} aria-label="Fin" />
          <button
            type="button"
            onClick={() => onChange(plages.filter((_, j) => j !== i))}
            className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-tint-rose)] transition-colors"
            aria-label="Supprimer cette plage"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={ajouter}
        className="self-start inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        {plages.length ? "Ajouter une plage" : "Ajouter des horaires"}
      </button>
      {erreur && <p className="text-[12px] text-[var(--color-danger)]">{erreur}</p>}
    </div>
  );
}

/* ── Éditeur complet ───────────────────────────────────────────────────── */
export default function DisponibilitesEditor({ profile }: { profile: ListingNotaire }) {
  const [dispo, setDispo] = useState<Disponibilites>(() => profile.disponibilites ?? disponibilitesParDefaut());
  const [dureeLibre, setDureeLibre] = useState(!DUREES.includes(dispo.duree));
  const [modifie, setModifie] = useState(!profile.disponibilites);
  const [etat, setEtat] = useState<"repos" | "envoi" | "ok">("repos");
  const [erreur, setErreur] = useState("");

  // Ajout d'une date particulière
  const demain = useMemo(() => {
    const d = aujourdhuiParis();
    d.setDate(d.getDate() + 1);
    return cleJour(d);
  }, []);
  const [du, setDu] = useState(demain);
  const [au, setAu] = useState(demain);
  const [mode, setMode] = useState<"ferme" | "horaires">("ferme");

  function changer(next: Disponibilites) {
    setDispo(next);
    setModifie(true);
    setEtat("repos");
  }
  function changerJour(i: number, plages: Plage[]) {
    changer({ ...dispo, semaine: dispo.semaine.map((j, k) => (k === i ? plages : j)) });
  }
  function copierSurSemaine(i: number) {
    // Mêmes horaires du lundi au vendredi (le week-end reste tel quel).
    const modele = dispo.semaine[i];
    changer({ ...dispo, semaine: dispo.semaine.map((j, k) => (k < 5 ? modele.map((p) => ({ ...p })) : j)) });
  }
  function ajouterDates() {
    if (!du) return;
    const fin = au && au >= du ? au : du;
    const exceptions = { ...dispo.exceptions };
    const d = jourDeCle(du);
    // Une entrée par jour (366 au plus) : congés, fermeture exceptionnelle…
    for (let n = 0; n < 366 && cleJour(d) <= fin; n++) {
      const cle = cleJour(d);
      exceptions[cle] = mode === "ferme" ? [] : (dispo.semaine[(d.getDay() + 6) % 7] ?? []).map((p) => ({ ...p }));
      d.setDate(d.getDate() + 1);
    }
    changer({ ...dispo, exceptions });
  }
  function retirerDate(cle: string) {
    const exceptions = { ...dispo.exceptions };
    delete exceptions[cle];
    changer({ ...dispo, exceptions });
  }

  const aujourdhui = cleJour(aujourdhuiParis());
  const datesFutures = Object.keys(dispo.exceptions).filter((c) => c >= aujourdhui).sort();

  // Aperçu des 14 prochains jours : ce que verront les clients.
  const apercu = useMemo(() => {
    const out: { cle: string; heures: string[] }[] = [];
    const d = aujourdhuiParis();
    for (let i = 0; i < 14; i++) {
      d.setDate(d.getDate() + 1);
      out.push({ cle: cleJour(d), heures: heuresDuJour(dispo, new Date(d)) });
    }
    return out;
  }, [dispo]);

  const erreurSaisie =
    dispo.semaine.map(erreurPlages).find(Boolean) ??
    datesFutures.map((c) => erreurPlages(dispo.exceptions[c])).find(Boolean) ??
    (dispo.duree < DUREE_MIN || dispo.duree > DUREE_MAX ? `Durée entre ${DUREE_MIN} et ${DUREE_MAX} minutes.` : null);

  async function enregistrer() {
    if (erreurSaisie) return;
    setEtat("envoi");
    setErreur("");
    // Les dates passées ne servent plus : on ne les garde pas.
    const exceptions: Record<string, Plage[]> = {};
    for (const c of datesFutures) exceptions[c] = nettoyerPlages(dispo.exceptions[c]);
    const propre: Disponibilites = {
      duree: dispo.duree,
      semaine: dispo.semaine.map(nettoyerPlages),
      exceptions,
    };
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

  return (
    <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 flex flex-col gap-7">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-tint-green)] flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-[var(--color-success)]" strokeWidth={2} />
        </div>
        <div>
          <h2 className="font-bold text-[17px] text-[var(--color-text-strong)]">Mes disponibilités</h2>
          <p className="text-[13px] text-[var(--color-muted)]">
            Vos jours et vos horaires, librement. Les clients réservent dans ces plages, jusqu&apos;à 3 mois à l&apos;avance.
          </p>
        </div>
      </div>

      {/* Durée */}
      <div>
        <p className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
          Durée d&apos;un rendez-vous
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {DUREES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setDureeLibre(false); changer({ ...dispo, duree: m }); }}
              className={`px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-colors ${
                !dureeLibre && dispo.duree === m
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                  : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              }`}
            >
              {m < 60 ? `${m} min` : m === 60 ? "1 h" : "1 h 30"}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setDureeLibre(true)}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-colors ${
              dureeLibre
                ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            }`}
          >
            Autre
          </button>
          {dureeLibre && (
            <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-muted)]">
              <input
                type="number"
                min={DUREE_MIN}
                max={DUREE_MAX}
                value={dispo.duree}
                onChange={(e) => changer({ ...dispo, duree: Math.round(Number(e.target.value) || 0) })}
                className="w-[76px] px-2 py-1.5 rounded-lg border-2 border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] focus:outline-none focus:border-[var(--color-accent)]"
              />
              minutes
            </span>
          )}
        </div>
      </div>

      {/* Semaine type */}
      <div>
        <p className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-3">Ma semaine type</p>
        <div className="flex flex-col divide-y divide-[var(--color-border-soft)] border border-[var(--color-border-soft)] rounded-2xl">
          {JOURS_SEMAINE.map((nom, i) => {
            const plages = dispo.semaine[i] ?? [];
            const ouvert = plages.length > 0;
            return (
              <div key={nom} className="p-4 flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="sm:w-[150px] shrink-0 flex items-center justify-between sm:flex-col sm:items-start gap-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={ouvert}
                      onChange={() => changerJour(i, ouvert ? [] : [{ de: "09:00", a: "12:00" }, { de: "14:00", a: "18:00" }])}
                      className="w-4 h-4 accent-[var(--color-accent)]"
                    />
                    <span className="font-semibold text-[14px] text-[var(--color-text-strong)]">{nom}</span>
                  </label>
                  {ouvert && i < 5 && (
                    <button
                      type="button"
                      onClick={() => copierSurSemaine(i)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                      title="Mêmes horaires du lundi au vendredi"
                    >
                      <Copy className="w-3 h-3" strokeWidth={2.5} />
                      Copier lun.–ven.
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  {ouvert ? (
                    <EditeurPlages plages={plages} onChange={(p) => changerJour(i, p)} />
                  ) : (
                    <p className="text-[13px] text-[var(--color-muted)] py-1">Fermé</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dates particulières */}
      <div>
        <p className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-1 flex items-center gap-1.5">
          <CalendarOff className="w-3.5 h-3.5" strokeWidth={2.5} />
          Congés et dates particulières
        </p>
        <p className="text-[12px] text-[var(--color-muted)] mb-3">
          Fermez une date ou une période, ou donnez des horaires différents ce jour-là.
        </p>
        <div className="flex flex-wrap items-end gap-3 p-4 rounded-2xl bg-[var(--color-tint-blue)]">
          <label className="flex flex-col gap-1 text-[12px] font-semibold text-[var(--color-muted)]">
            Du
            <input type="date" min={demain} value={du} onChange={(e) => { setDu(e.target.value); if (!au || au < e.target.value) setAu(e.target.value); }}
              className="px-2 py-1.5 rounded-lg border-2 border-[var(--color-border)] bg-white text-[14px] text-[var(--color-text-strong)] focus:outline-none focus:border-[var(--color-accent)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-semibold text-[var(--color-muted)]">
            Au
            <input type="date" min={du || demain} value={au} onChange={(e) => setAu(e.target.value)}
              className="px-2 py-1.5 rounded-lg border-2 border-[var(--color-border)] bg-white text-[14px] text-[var(--color-text-strong)] focus:outline-none focus:border-[var(--color-accent)]" />
          </label>
          <div className="flex rounded-lg border-2 border-[var(--color-border)] bg-white overflow-hidden text-[13px] font-semibold">
            {(["ferme", "horaires"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={`px-3 py-1.5 transition-colors ${mode === m ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-accent)]"}`}>
                {m === "ferme" ? "Fermé" : "Horaires spéciaux"}
              </button>
            ))}
          </div>
          <button type="button" onClick={ajouterDates}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-[13px] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Ajouter
          </button>
        </div>

        {datesFutures.length > 0 && (
          <div className="mt-3 flex flex-col divide-y divide-[var(--color-border-soft)] border border-[var(--color-border-soft)] rounded-2xl">
            {datesFutures.map((cle) => {
              const plages = dispo.exceptions[cle];
              return (
                <div key={cle} className="p-4 flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="sm:w-[190px] shrink-0 flex items-center justify-between sm:flex-col sm:items-start gap-1">
                    <span className="font-semibold text-[14px] text-[var(--color-text-strong)] first-letter:uppercase">{libelleDate(cle)}</span>
                    <button type="button" onClick={() => retirerDate(cle)}
                      className="text-[11px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-danger)]">
                      Revenir à la semaine type
                    </button>
                  </div>
                  <div className="flex-1">
                    {plages.length === 0 ? (
                      <div className="flex items-center gap-3 py-1">
                        <span className="text-[13px] font-semibold text-[var(--color-danger)]">Fermé</span>
                        <button type="button" onClick={() => changer({ ...dispo, exceptions: { ...dispo.exceptions, [cle]: [{ de: "09:00", a: "12:00" }] } })}
                          className="text-[12px] font-semibold text-[var(--color-accent)] hover:underline">
                          Ouvrir avec des horaires
                        </button>
                      </div>
                    ) : (
                      <EditeurPlages plages={plages} onChange={(p) => changer({ ...dispo, exceptions: { ...dispo.exceptions, [cle]: p } })} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Aperçu */}
      <div>
        <p className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-3">
          Aperçu pour vos clients · 14 prochains jours
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {apercu.map(({ cle, heures }) => {
            const j = jourDeCle(cle);
            return (
              <div key={cle} className={`rounded-xl p-2 text-center border ${heures.length ? "border-[var(--color-border-soft)] bg-[var(--color-tint-green)]" : "border-[var(--color-border-soft)] bg-white opacity-60"}`}>
                <div className="text-[11px] font-bold text-[var(--color-muted)] uppercase">
                  {j.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" })}
                </div>
                <div className="text-[13px] font-bold text-[var(--color-text-strong)]">
                  {heures.length ? `${heures.length} RDV` : "—"}
                </div>
                {heures.length > 0 && (
                  <div className="text-[10px] text-[var(--color-muted)]">{heures[0]} → {heures[heures.length - 1]}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Enregistrer */}
      <div className="flex flex-col gap-2">
        {(erreurSaisie || erreur) && (
          <p className="text-[13px] text-[var(--color-danger)]">{erreurSaisie ?? erreur}</p>
        )}
        <button
          type="button"
          onClick={enregistrer}
          disabled={etat === "envoi" || !!erreurSaisie || (!modifie && etat !== "repos")}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3.5 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] disabled:opacity-60 transition"
        >
          {etat === "envoi" ? (
            <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} /> Enregistrement…</>
          ) : etat === "ok" && !modifie ? (
            <><Check className="w-4 h-4" strokeWidth={2.5} /> Disponibilités enregistrées</>
          ) : (
            "Enregistrer mes disponibilités"
          )}
        </button>
        {etat === "ok" && !modifie && (
          <p className="text-[12px] text-[var(--color-success)] text-center">Visibles tout de suite sur votre fiche et dans l&apos;annuaire.</p>
        )}
      </div>
    </div>
  );
}
