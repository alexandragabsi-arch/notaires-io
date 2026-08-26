/**
 * visio.ts — salles de visioconférence Jitsi Meet
 * Aucune clé API requise.
 *
 * Principe : l'identifiant de salle dérive UNIQUEMENT de l'identifiant de la
 * réservation. Il est donc strictement identique côté client et côté notaire,
 * stable dans le temps, et insensible aux erreurs de calcul de date.
 * La date ne sert plus qu'à décider si la salle est ouverte.
 */

/** Retire les accents et met en minuscules. */
function deburr(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Index du mois (0-11) trouvé dans un libellé français, ou -1. */
function parseMonth(s: string): number {
  const norm = deburr(s);
  const mois = ["janv", "fevr", "mars", "avr", "mai", "juin",
                "juil", "aout", "sept", "oct", "nov", "dec"];
  for (let i = 0; i < mois.length; i++) if (norm.includes(mois[i])) return i;
  return -1;
}

const JOURS_FR: Record<string, number> = {
  dimanche: 0, lundi: 1, mardi: 2, mercredi: 3,
  jeudi: 4, vendredi: 5, samedi: 6,
};

function toYMD(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/**
 * Date + heure réelles d'un rendez-vous à partir de son libellé.
 * Gère les trois formes qu'on rencontre en base :
 *   « Mer. 11 juin · 10h00 »  (format des réservations)
 *   « Demain 09h30 », « Aujourd'hui 14h00 »
 *   « vendredi », « Vendredi 09h00 »
 * `createdAt` (ms) sert à trancher l'année : un « 11 juin » réservé en décembre
 * est l'année suivante. Renvoie null si le libellé est illisible.
 */
export function parseSlotDate(slotLabel: string, createdAt?: number): Date | null {
  if (!slotLabel) return null;
  const [datePart = "", timePart = ""] = slotLabel.split("·").map((s) => s.trim());
  const source = timePart ? datePart : slotLabel;

  // Heure : « 10h00 », « 9 h », « 14h30 »
  const heure = (timePart || slotLabel).match(/(\d{1,2})\s*h\s*(\d{2})?/i);
  const hh = heure ? parseInt(heure[1], 10) : 9;
  const mm = heure && heure[2] ? parseInt(heure[2], 10) : 0;

  const norm = deburr(source);
  const base = createdAt ? new Date(createdAt) : new Date();

  // 1. « Aujourd'hui » / « Demain »
  if (norm.startsWith("aujourd")) {
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    return d;
  }
  if (norm.startsWith("demain")) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(hh, mm, 0, 0);
    return d;
  }

  // 2. Date explicite « 11 juin »
  const jour = source.match(/(\d{1,2})/);
  if (jour) {
    const moisIdx = parseMonth(source.slice((jour.index ?? 0) + jour[1].length));
    if (moisIdx >= 0) {
      let annee = base.getFullYear();
      let d = new Date(annee, moisIdx, parseInt(jour[1], 10), hh, mm, 0, 0);
      // Antérieur de plus de 2 jours à la réservation → l'année suivante.
      if (d.getTime() < base.getTime() - 2 * 86_400_000) {
        annee += 1;
        d = new Date(annee, moisIdx, parseInt(jour[1], 10), hh, mm, 0, 0);
      }
      return d;
    }
  }

  // 3. Nom de jour seul → prochaine occurrence
  for (const [nom, idx] of Object.entries(JOURS_FR)) {
    if (norm.startsWith(nom)) {
      const d = new Date();
      let diff = idx - d.getDay();
      if (diff <= 0) diff += 7;
      d.setDate(d.getDate() + diff);
      d.setHours(hh, mm, 0, 0);
      return d;
    }
  }

  return null;
}

/** Date du RDV au format YYYY-MM-DD, ou "" si illisible. */
export function slotDayToDate(slotLabel: string, createdAt?: number): string {
  const d = parseSlotDate(slotLabel, createdAt);
  return d ? toYMD(d) : "";
}

/**
 * La salle est-elle accessible ?
 * Ouverte 30 min avant l'heure prévue et jusqu'à la fin de la journée.
 * Un libellé illisible laisse l'accès ouvert : mieux vaut une salle joignable
 * qu'un notaire et son client bloqués dehors.
 */
export function isRdvOpen(slotLabel: string, createdAt?: number): boolean {
  const d = parseSlotDate(slotLabel, createdAt);
  if (!d) return true;
  const ouverture = d.getTime() - 30 * 60_000;
  const fin = new Date(d);
  fin.setHours(23, 59, 59, 999);
  const now = Date.now();
  return now >= ouverture && now <= fin.getTime();
}

/** Aujourd'hui est-il le jour du rendez-vous ? */
export function isRdvDay(rdvDate: string): boolean {
  return !!rdvDate && toYMD(new Date()) === rdvDate;
}

/** Date lisible : « samedi 7 juin 2026 ». */
export function formatRdvDate(rdvDate: string): string {
  const d = new Date(rdvDate + "T12:00:00");
  return d.toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

/**
 * Identifiant de salle, dérivé du SEUL identifiant de réservation.
 * Client et notaire partent de la même valeur en base : la salle est donc
 * forcément la même, quelle que soit l'heure ou le jour de connexion.
 */
export function generateRoomId(bookingId: string): string {
  const seed = `notaires-io:${bookingId}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // 8 caractères ne laissent que 4 milliards de combinaisons : on hache une
  // seconde fois avec une graine différente pour obtenir 16 caractères et
  // rendre une salle non devinable.
  let h2 = 0x9e3779b9;
  for (let i = seed.length - 1; i >= 0; i--) {
    h2 ^= seed.charCodeAt(i);
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  return `notaires-${(h >>> 0).toString(16).padStart(8, "0")}${(h2 >>> 0).toString(16).padStart(8, "0")}`;
}

/** URL Jitsi Meet publique */
export function jitsiRoomUrl(roomId: string): string {
  return `https://meet.jit.si/${roomId}`;
}

/** URL interne de la salle : /visio/notaires-abc123?date=2026-06-07 */
export function internalVisioUrl(roomId: string, rdvDate?: string): string {
  return rdvDate ? `/visio/${roomId}?date=${rdvDate}` : `/visio/${roomId}`;
}
