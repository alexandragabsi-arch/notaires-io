// Format commun des créneaux entre le site et l'app iOS.
//
// `bookings.slot_key` contient l'instant du RDV en ISO UTC sans millisecondes
// (« 2026-10-12T15:00:00Z »). Les notaires raisonnent en heure de Paris : on
// convertit à l'écriture (heure murale Paris → ISO) et à la lecture (ISO →
// heure murale Paris), quel que soit le fuseau du navigateur ou du serveur.

export const TZ_PARIS = "Europe/Paris";

export interface PartiesParis {
  y: number;
  mo: number; // 0-11
  day: number;
  h: number;
  min: number;
}

// Composantes « horloge murale » Paris d'un instant donné.
export function parisParts(d: Date): PartiesParis {
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    timeZone: TZ_PARIS,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
  const p: Record<string, string> = {};
  for (const part of fmt.formatToParts(d)) p[part.type] = part.value;
  return {
    y: Number(p.year),
    mo: Number(p.month) - 1,
    day: Number(p.day),
    h: Number(p.hour === "24" ? "0" : p.hour),
    min: Number(p.minute),
  };
}

function murale(p: PartiesParis): number {
  return Date.UTC(p.y, p.mo, p.day, p.h, p.min);
}

// Instant réel correspondant à une heure murale de Paris (gère l'heure d'été).
export function instantParis(y: number, mo: number, day: number, h: number, min: number): Date {
  const cible = Date.UTC(y, mo, day, h, min);
  let t = cible;
  // Deux passes suffisent : la seconde corrige le cas où le décalage change
  // entre l'estimation et l'instant visé (nuit du changement d'heure).
  for (let i = 0; i < 2; i++) t += cible - murale(parisParts(new Date(t)));
  return new Date(t);
}

// ISO canonique, identique à celui de l'app et à celui que normalise la base.
export function isoCreneau(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

// Créneau du site : jour du calendrier affiché + heure « HH:MM » à Paris.
export function slotKeyDepuisJour(jour: Date, heure: string): string {
  const [h, m = "0"] = heure.split(":");
  return isoCreneau(
    instantParis(jour.getFullYear(), jour.getMonth(), jour.getDate(), Number(h), Number(m)),
  );
}

const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

export function estSlotKeyIso(slotKey: string | null | undefined): slotKey is string {
  return !!slotKey && ISO_RE.test(slotKey) && !Number.isNaN(Date.parse(slotKey));
}

// Repère « heure murale Paris » (Date.UTC des composantes Paris) d'un slot_key ISO.
export function msMuralDepuisSlotKey(slotKey: string): number | null {
  if (!estSlotKeyIso(slotKey)) return null;
  return murale(parisParts(new Date(slotKey)));
}
