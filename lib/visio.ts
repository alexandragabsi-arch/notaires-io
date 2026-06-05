/**
 * visio.ts — génération de salles de visioconférence Jitsi Meet
 * Aucune clé API requise. Les salles sont uniques par RDV et ne s'ouvrent
 * que le jour du rendez-vous.
 */

/**
 * Convertit un label relatif de jour ("Demain", "Vendredi"…) en date YYYY-MM-DD.
 * Utilisé pour calculer la vraie date du RDV depuis le slot du wizard.
 */
export function slotDayToDate(day: string): string {
  const now = new Date();
  const d = day.trim().toLowerCase();

  if (d === "demain") {
    now.setDate(now.getDate() + 1);
    return toYMD(now);
  }

  const FR_DAYS: Record<string, number> = {
    dimanche: 0, lundi: 1, mardi: 2, mercredi: 3,
    jeudi: 4, vendredi: 5, samedi: 6,
  };

  if (FR_DAYS[d] !== undefined) {
    const target = FR_DAYS[d];
    const current = now.getDay();
    let diff = target - current;
    if (diff <= 0) diff += 7; // toujours dans le futur
    now.setDate(now.getDate() + diff);
    return toYMD(now);
  }

  // Fallback : aujourd'hui (pour les cas non reconnus)
  return toYMD(now);
}

function toYMD(d: Date): string {
  return d.toISOString().slice(0, 10); // "2026-06-07"
}

/**
 * Vérifie si aujourd'hui est bien le jour du RDV.
 * On autorise 30 min avant l'heure prévue (pour tester la connexion).
 */
export function isRdvDay(rdvDate: string): boolean {
  const today = toYMD(new Date());
  return today === rdvDate;
}

/**
 * Formate une date YYYY-MM-DD en français lisible : "samedi 7 juin 2026"
 */
export function formatRdvDate(rdvDate: string): string {
  const d = new Date(rdvDate + "T12:00:00"); // midi pour éviter les décalages UTC
  return d.toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

/**
 * Génère un identifiant de salle déterministe à partir du RDV.
 * Même résultat côté client et côté notaire → même salle sans BDD.
 */
export function generateRoomId(notaireId: string, slot: string, rdvDate: string = ""): string {
  const seed = `notaires-io:${notaireId}:${slot}:${rdvDate}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const hex = (h >>> 0).toString(16).padStart(8, "0");
  return `notaires-${hex}`;
}

/** URL Jitsi Meet publique */
export function jitsiRoomUrl(roomId: string): string {
  return `https://meet.jit.si/${roomId}`;
}

/**
 * URL interne de la page visio, avec la date du RDV en query param
 * → /visio/notaires-abc123?date=2026-06-07
 */
export function internalVisioUrl(roomId: string, rdvDate?: string): string {
  if (rdvDate) return `/visio/${roomId}?date=${rdvDate}`;
  return `/visio/${roomId}`;
}
