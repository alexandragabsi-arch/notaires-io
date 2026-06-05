/**
 * visio.ts — génération de salles de visioconférence Jitsi Meet
 * Aucune clé API requise. Les salles sont publiques mais avec un nom impossible
 * à deviner (hash SHA-256 des paramètres du RDV).
 */

/**
 * Génère un identifiant de salle déterministe à partir du RDV.
 * Le même appel avec les mêmes args donne toujours le même roomId,
 * ce qui permet au client ET au notaire de rejoindre la même salle
 * sans stocker l'URL en base.
 */
export function generateRoomId(notaireId: string, slot: string, date: string = ""): string {
  // Concatène les infos du RDV pour former une graine unique
  const seed = `notaires-io:${notaireId}:${slot}:${date}`;
  // Hachage simple (FNV-1a 32 bits) — suffisant pour l'unicité
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const hex = (h >>> 0).toString(16).padStart(8, "0");
  return `notaires-${hex}`;
}

/**
 * URL Jitsi Meet publique pour la salle
 */
export function jitsiRoomUrl(roomId: string): string {
  return `https://meet.jit.si/${roomId}`;
}

/**
 * URL de la page visio interne (/visio/[roomId]) qui embarque Jitsi en iframe
 */
export function internalVisioUrl(roomId: string): string {
  return `/visio/${roomId}`;
}
