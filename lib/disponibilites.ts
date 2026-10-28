// Disponibilités d'un notaire, saisies librement dans « Mon espace ».
//
// Le notaire décrit une semaine type (plages horaires libres, jour par jour,
// week-end compris), la durée de ses rendez-vous, et peut modifier n'importe
// quelle date à part (jour fermé, ou horaires différents ce jour-là). Les
// créneaux réservables sont calculés à la volée, sur de vraies dates :
// contrairement à l'ancienne `slot_matrix` (jours numérotés « à partir de
// demain »), rien ne se décale d'un jour à l'autre.
//
// Convention de dates du site : un `Date` dont les composantes locales
// (getFullYear, getMonth, getDate) désignent le jour à Paris, comme dans
// `slotKeyDepuisJour`.

import { parisParts, slotKeyDepuisJour } from "@/lib/creneau";

/** Plage horaire « HH:MM » → « HH:MM » (fin exclue). */
export interface Plage {
  de: string;
  a: string;
}

export interface Disponibilites {
  /** Durée d'un rendez-vous, en minutes. */
  duree: number;
  /** Semaine type : 7 entrées, 0 = lundi … 6 = dimanche. */
  semaine: Plage[][];
  /** Dates modifiées (« AAAA-MM-JJ ») : remplacent la semaine type ce jour-là ; [] = fermé. */
  exceptions: Record<string, Plage[]>;
}

/** Réservation possible jusqu'à 3 mois à l'avance. */
export const HORIZON_JOURS = 91;
export const DUREE_MIN = 5;
export const DUREE_MAX = 480;
export const JOURS_SEMAINE = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const HEURE_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function minutes(h: string): number {
  const [hh, mm] = h.split(":").map(Number);
  return hh * 60 + mm;
}

function enHeure(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

/** Clé « AAAA-MM-JJ » d'un jour (composantes locales = jour à Paris). */
export function cleJour(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Jour d'une clé « AAAA-MM-JJ », à minuit local. */
export function jourDeCle(cle: string): Date {
  const [y, m, d] = cle.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Aujourd'hui à Paris, à minuit local (utile côté serveur, en UTC). */
export function aujourdhuiParis(): Date {
  const p = parisParts(new Date());
  return new Date(p.y, p.mo, p.day);
}

/** Index dans la semaine type : 0 = lundi … 6 = dimanche. */
export function indexSemaine(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/** Proposition de départ pour un notaire qui n'a encore rien saisi. */
export function disponibilitesParDefaut(): Disponibilites {
  const ouvre = [{ de: "09:00", a: "12:00" }, { de: "14:00", a: "18:00" }];
  return {
    duree: 30,
    semaine: [ouvre, ouvre, ouvre, ouvre, ouvre, [], []].map((j) => j.map((p) => ({ ...p }))),
    exceptions: {},
  };
}

/** Plages triées, fusionnées si elles se chevauchent, sans plage vide. */
export function nettoyerPlages(plages: Plage[]): Plage[] {
  const tri = plages
    .filter((p) => HEURE_RE.test(p.de) && HEURE_RE.test(p.a) && minutes(p.a) > minutes(p.de))
    .sort((x, y) => minutes(x.de) - minutes(y.de));
  const out: Plage[] = [];
  for (const p of tri) {
    const der = out[out.length - 1];
    if (der && minutes(p.de) <= minutes(der.a)) {
      if (minutes(p.a) > minutes(der.a)) der.a = p.a;
    } else {
      out.push({ ...p });
    }
  }
  return out;
}

/** Plages qui se chevauchent ou dont la fin précède le début (message pour l'éditeur). */
export function erreurPlages(plages: Plage[]): string | null {
  for (const p of plages) {
    if (!HEURE_RE.test(p.de) || !HEURE_RE.test(p.a)) return "Heure incomplète.";
    if (minutes(p.a) <= minutes(p.de)) return "La fin doit être après le début.";
  }
  const tri = [...plages].sort((x, y) => minutes(x.de) - minutes(y.de));
  for (let i = 1; i < tri.length; i++) {
    if (minutes(tri[i].de) < minutes(tri[i - 1].a)) return "Deux plages se chevauchent.";
  }
  return null;
}

/** Validation stricte d'une valeur reçue (API) ; null = invalide. */
export function validerDisponibilites(v: unknown): Disponibilites | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const duree = Number(o.duree);
  if (!Number.isInteger(duree) || duree < DUREE_MIN || duree > DUREE_MAX) return null;
  const plages = (x: unknown): Plage[] | null => {
    if (!Array.isArray(x) || x.length > 12) return null;
    const l: Plage[] = [];
    for (const p of x) {
      if (!p || typeof p !== "object") return null;
      const { de, a } = p as Record<string, unknown>;
      if (typeof de !== "string" || typeof a !== "string") return null;
      l.push({ de, a });
    }
    return nettoyerPlages(l);
  };
  if (!Array.isArray(o.semaine) || o.semaine.length !== 7) return null;
  const semaine: Plage[][] = [];
  for (const j of o.semaine) {
    const p = plages(j);
    if (!p) return null;
    semaine.push(p);
  }
  const exceptions: Record<string, Plage[]> = {};
  const brutes = o.exceptions && typeof o.exceptions === "object" ? (o.exceptions as Record<string, unknown>) : {};
  const entrees = Object.entries(brutes);
  if (entrees.length > 400) return null;
  for (const [date, j] of entrees) {
    if (!DATE_RE.test(date)) return null;
    const p = plages(j);
    if (!p) return null;
    exceptions[date] = p;
  }
  return { duree, semaine, exceptions };
}

/** Plages en vigueur un jour donné (exception de date, sinon semaine type). */
export function plagesDuJour(dispo: Disponibilites, jour: Date): Plage[] {
  return dispo.exceptions[cleJour(jour)] ?? dispo.semaine[indexSemaine(jour)] ?? [];
}

/** Heures de début des rendez-vous d'un jour (« HH:MM »), créneaux passés exclus. */
export function heuresDuJour(dispo: Disponibilites, jour: Date, maintenant: number = Date.now()): string[] {
  const debut = aujourdhuiParis();
  const ecart = Math.round((new Date(jour.getFullYear(), jour.getMonth(), jour.getDate()).getTime() - debut.getTime()) / 86_400_000);
  if (ecart < 0 || ecart > HORIZON_JOURS) return [];
  const pas = Math.max(DUREE_MIN, dispo.duree);
  const heures: string[] = [];
  // Plages fusionnées : jamais deux fois la même heure, même pendant une saisie incomplète.
  for (const p of nettoyerPlages(plagesDuJour(dispo, jour))) {
    for (let t = minutes(p.de); t + pas <= minutes(p.a); t += pas) {
      const h = enHeure(t);
      if (Date.parse(slotKeyDepuisJour(jour, h)) > maintenant) heures.push(h);
    }
  }
  return heures;
}

/** Notaire tel que lu pour l'affichage : nouvelles disponibilités ou ancienne matrice. */
export interface AvecDisponibilites {
  disponibilites?: Disponibilites;
  slotMatrix?: string[][];
}

/** Heures d'un jour pour l'affichage. `indexAncien` sert aux fiches encore sur l'ancienne matrice. */
export function heuresPour(
  n: AvecDisponibilites,
  jour: Date,
  indexAncien: number,
  maintenant: number = Date.now(),
): string[] {
  if (n.disponibilites) return heuresDuJour(n.disponibilites, jour, maintenant);
  // Ancienne matrice : mêmes règles que heuresDuJour pour les heures déjà
  // passées. Un « 09:00 » du jour restait proposé jusqu'au soir (27/10/2026).
  return (n.slotMatrix?.[indexAncien] ?? []).filter((h) => {
    const t = Date.parse(slotKeyDepuisJour(jour, h.trim().replace("h", ":").padStart(5, "0")));
    return Number.isNaN(t) || t > maintenant;
  });
}

/** Matrice « jour 0 = demain » calculée maintenant, au format attendu par l'agenda de la fiche. */
export function matriceAgenda(n: AvecDisponibilites): string[][] | undefined {
  if (!n.disponibilites) return n.slotMatrix;
  const out: string[][] = [];
  const d = aujourdhuiParis();
  for (let i = 0; i < HORIZON_JOURS; i++) {
    d.setDate(d.getDate() + 1);
    out.push(heuresDuJour(n.disponibilites, new Date(d)));
  }
  return out;
}

/** Le notaire propose-t-il au moins un créneau ? */
export function aDesCreneaux(n: AvecDisponibilites): boolean {
  if (n.disponibilites) {
    const d = aujourdhuiParis();
    for (let i = 0; i <= HORIZON_JOURS; i++) {
      if (heuresDuJour(n.disponibilites, d).length) return true;
      d.setDate(d.getDate() + 1);
    }
    return false;
  }
  return (n.slotMatrix ?? []).some((j) => (j?.length ?? 0) > 0);
}

/** Lecture tolérante d'une ligne Supabase (colonne `disponibilites`). */
export function lireDisponibilites(v: unknown): Disponibilites | undefined {
  return validerDisponibilites(v) ?? undefined;
}

/**
 * Conversion d'une ancienne `slot_matrix` (jour 0 = demain) en semaine type.
 * Chaque jour de la semaine reprend les heures du premier jour de la matrice
 * qui tombe ce jour-là, tel que la fiche l'affiche au moment de la conversion.
 * La durée est le plus petit écart entre deux heures (30 min à défaut) : chaque
 * heure d'origine reste un créneau, rien n'est ajouté entre elles.
 */
export function depuisMatrice(matrice: string[][], demain: Date): Disponibilites | null {
  const norm = (h: string) => h.trim().replace("h", ":").padStart(5, "0");
  const jours = matrice.map((j) => [...new Set((j ?? []).map(norm).filter((h) => HEURE_RE.test(h)))].sort());
  if (!jours.some((j) => j.length)) return null;
  let ecart = Infinity;
  for (const j of jours) for (let i = 1; i < j.length; i++) ecart = Math.min(ecart, minutes(j[i]) - minutes(j[i - 1]));
  const duree = Math.max(DUREE_MIN, Math.min(120, Number.isFinite(ecart) ? ecart : 30));
  const semaine: Plage[][] = Array.from({ length: 7 }, () => []);
  const vu = new Set<number>();
  jours.forEach((heures, i) => {
    const d = new Date(demain);
    d.setDate(d.getDate() + i);
    const k = indexSemaine(d);
    if (vu.has(k)) return;
    vu.add(k);
    semaine[k] = nettoyerPlages(heures.map((h) => ({ de: h, a: enHeure(minutes(h) + duree) })));
  });
  return validerDisponibilites({ duree, semaine, exceptions: {} });
}
