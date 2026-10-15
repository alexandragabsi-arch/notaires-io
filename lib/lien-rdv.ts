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
