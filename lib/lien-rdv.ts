// Lien « Gérer ou annuler mon rendez-vous » envoyé par e-mail.
//
// Le client ne se connecte pas : le lien porte une signature HMAC propre au
// RDV (/rdv/<id>?t=<signature>). Sans la clé serveur, impossible de fabriquer
// le lien d'un autre RDV. Clé : RDV_LIEN_SECRET, à défaut CRON_SECRET.
// Uniquement côté serveur.

import crypto from "node:crypto";
import { SITE } from "@/lib/email";

function cle(): string | null {
  return process.env.RDV_LIEN_SECRET ?? process.env.CRON_SECRET ?? null;
}

export function jetonRdv(bookingId: string): string | null {
  const k = cle();
  if (!k) return null;
  return crypto.createHmac("sha256", k).update(`rdv:${bookingId}`).digest("base64url").slice(0, 24);
}

export function jetonValide(bookingId: string, jeton: string | null | undefined): boolean {
  const attendu = jetonRdv(bookingId);
  if (!attendu || !jeton || jeton.length !== attendu.length) return false;
  return crypto.timingSafeEqual(Buffer.from(attendu), Buffer.from(jeton));
}

/** Lien de gestion du RDV, ou l'espace client si la clé manque. */
export function lienGestionRdv(bookingId: string): string {
  const t = jetonRdv(bookingId);
  return t ? `${SITE}/rdv/${bookingId}?t=${t}` : `${SITE}/espace-client`;
}

// Lien de dépôt de pièces, pour les autres participants. Sa signature est distincte
// de celle du lien de gestion : il ne permet ni de voir le détail, ni d'annuler.
// Clé dédiée : RDV_DEPOT_SECRET. Sans elle, pas de lien, et les e-mails n'affichent pas le bouton.
function jetonDepot(bookingId: string): string | null {
  const k = process.env.RDV_DEPOT_SECRET;
  if (!k) return null;
  return crypto.createHmac("sha256", k).update(`depot:${bookingId}`).digest("base64url").slice(0, 24);
}

export function jetonDepotValide(bookingId: string, jeton: string | null | undefined): boolean {
  const attendu = jetonDepot(bookingId);
  if (!attendu || !jeton || jeton.length !== attendu.length) return false;
  return crypto.timingSafeEqual(Buffer.from(attendu), Buffer.from(jeton));
}

/** Lien de dépôt de pièces, ou null si la clé manque. */
export function lienDepotPieces(bookingId: string): string | null {
  const t = jetonDepot(bookingId);
  return t ? `${SITE}/rdv/${bookingId}/pieces?t=${t}` : null;
}
