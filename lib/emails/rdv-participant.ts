// E-mails des participants d'un rendez-vous autres que celui qui l'a pris.
//
// Seul le premier participant (le client) était prévenu : les autres n'apprenaient
// le rendez-vous que s'il leur transmettait lui-même les informations.
// Ces e-mails ne contiennent ni lien d'annulation ni lien vers l'espace client :
// ces actions restent réservées à la personne qui a pris le rendez-vous.

import { emailButton, emailLayout, sendEmail } from "@/lib/email";
import { dateLongue, echapper } from "@/lib/emails/confirmation-rdv";
import { lienVisio } from "@/lib/emails/rappel-notaire";
import { lienDepotPieces } from "@/lib/lien-rdv";
import { OUVERTURE_SALLE_MIN } from "@/lib/visio";

export interface ParticipantAPrevenir {
  prenom: string;
  nom: string;
  email: string;
}

// Plafond contre l'envoi en masse à des tiers via le formulaire de réservation.
const MAX_PARTICIPANTS = 10;
// Resend limite le nombre d'envois par seconde : un refus ferait perdre le message.
const PAUSE_ENTRE_ENVOIS_MS = 600;
const FORMAT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Participants à prévenir : ni le client, ni adresse invalide, ni doublon. */
export function participantsAPrevenir(participants: unknown, clientEmail: string | null | undefined): ParticipantAPrevenir[] {
  if (!Array.isArray(participants)) return [];
  const dejaVus = new Set([(clientEmail ?? "").trim().toLowerCase()]);
  const liste: ParticipantAPrevenir[] = [];
  // Le premier participant est le client, prévenu par ailleurs.
  for (const p of participants.slice(1)) {
    const email = String(p?.email ?? "").trim();
    const cle = email.toLowerCase();
    if (!FORMAT_EMAIL.test(email) || dejaVus.has(cle)) continue;
    dejaVus.add(cle);
    liste.push({ prenom: String(p?.prenom ?? "").trim(), nom: String(p?.nom ?? "").trim(), email });
  }
  return liste.slice(0, MAX_PARTICIPANTS);
}

/** Envoie un message à chacun, un par un : les adresses ne sont pas partagées entre participants. */
export async function envoyerAuxParticipants(
  liste: ParticipantAPrevenir[],
  sujet: string,
  html: (p: ParticipantAPrevenir) => string,
): Promise<number> {
  let envoyes = 0;
  for (const p of liste) {
    await new Promise((fin) => setTimeout(fin, PAUSE_ENTRE_ENVOIS_MS));
    if (await sendEmail(p.email, sujet, html(p))) envoyes++;
  }
  return envoyes;
}

const paragraphe = (texte: string) =>
  `<p style="font-size:15px;color:#3d4a66;margin:0 0 18px;text-align:justify;line-height:1.5">${texte}</p>`;
const salutation = (p: ParticipantAPrevenir) =>
  paragraphe(`Bonjour${p.prenom || p.nom ? ` ${echapper(`${p.prenom} ${p.nom}`.trim())}` : ""},`);
const ligne = (libelle: string, valeur: string) =>
  `<tr><td style="padding:5px 12px 5px 0;color:#7588a8;font-size:14px;vertical-align:top">${libelle}</td><td style="padding:5px 0;font-size:15px;color:#1C4587;vertical-align:top">${valeur}</td></tr>`;

interface Rdv {
  bookingId: string;
  slotKey: string;
  modalite: string | null;
  notaireNom: string;
  dossier: string | null;
  clientNom: string | null;
  /** Lieu déjà lisible : étude et adresse du cabinet, si connues. */
  etude?: string | null;
  adresse?: string | null;
}

function recapitulatif(r: Rdv): string {
  const quand = dateLongue(r.slotKey);
  const cabinet = [r.etude, r.adresse].filter(Boolean).map((v) => echapper(v)).join("<br>");
  const lieu = r.modalite === "visio" ? "En visioconférence" : `Au cabinet${cabinet ? `<br>${cabinet}` : ""}`;
  return `<table role="presentation" style="margin:0 auto 24px;background:#f0f4ff;border-radius:12px;padding:16px 22px;text-align:left;border-collapse:separate">
    ${ligne("Date", `<strong>${quand.charAt(0).toUpperCase() + quand.slice(1)}</strong>`)}
    ${ligne("Lieu", lieu)}
    ${ligne("Notaire", echapper(r.notaireNom))}
    ${r.dossier ? ligne("Objet", echapper(r.dossier)) : ""}
  </table>`;
}

function accesVisio(r: Rdv): string {
  if (r.modalite !== "visio") return "";
  return `<div style="margin:0 0 24px">${emailButton(lienVisio({ id: r.bookingId, slot_key: r.slotKey }), "Rejoindre la visio")}</div>
    ${paragraphe(`La salle ouvre ${OUVERTURE_SALLE_MIN} minutes avant le rendez-vous.`)}`;
}

function depotPieces(r: Rdv): string {
  const lien = lienDepotPieces(r.bookingId);
  if (!lien) return "";
  return `${paragraphe("Pour préparer le dossier, déposez vos documents ici, sans créer de compte : ils sont rattachés au rendez-vous et transmis au notaire.")}
    <div style="margin:0 0 24px">${emailButton(lien, "Déposer mes documents")}</div>`;
}

const organisateur = (r: Rdv) => (r.clientNom ? echapper(r.clientNom) : "La personne qui a pris le rendez-vous");

export function sujetConfirmationParticipant(r: Pick<Rdv, "slotKey" | "notaireNom">): string {
  return `Votre rendez-vous du ${dateLongue(r.slotKey)} avec ${r.notaireNom}`;
}

export function emailConfirmationParticipant(p: ParticipantAPrevenir, r: Rdv): string {
  return emailLayout(`
    <h1 style="font-size:22px;font-weight:700;margin:0 0 18px;color:#1C4587">Vous participez à un rendez-vous chez le notaire</h1>
    ${salutation(p)}
    ${paragraphe(`${organisateur(r)} a pris rendez-vous avec ${echapper(r.notaireNom)} et vous a indiqué comme participant.`)}
    ${recapitulatif(r)}
    ${accesVisio(r)}
    ${depotPieces(r)}
    ${paragraphe("Pensez à vous munir d'une pièce d'identité en cours de validité.")}
    ${paragraphe(`En cas d'empêchement, prévenez ${r.clientNom ? echapper(r.clientNom) : "la personne qui a pris le rendez-vous"} : c'est à elle de le déplacer ou de l'annuler. Si vous n'êtes pas concerné par ce rendez-vous, ignorez ce message.`)}
  `);
}

export function sujetRappelParticipant(r: Pick<Rdv, "notaireNom">, quand: "demain" | "dans 2h"): string {
  return `Rappel : rendez-vous ${quand} avec ${r.notaireNom}`;
}

export function emailRappelParticipant(p: ParticipantAPrevenir, r: Rdv, quand: "demain" | "dans 2 heures"): string {
  return emailLayout(`
    <h1 style="font-size:22px;font-weight:700;margin:0 0 18px;color:#1C4587">Rappel : votre rendez-vous ${quand}</h1>
    ${salutation(p)}
    ${recapitulatif(r)}
    ${accesVisio(r)}
    ${depotPieces(r)}
    ${paragraphe("Pensez à vous munir d'une pièce d'identité en cours de validité.")}
  `);
}

export function sujetAnnulationParticipant(r: Pick<Rdv, "slotKey">): string {
  return `Rendez-vous du ${dateLongue(r.slotKey)} annulé`;
}

export function emailAnnulationParticipant(p: ParticipantAPrevenir, r: Rdv): string {
  return emailLayout(`
    <h1 style="font-size:22px;font-weight:700;margin:0 0 18px;color:#1C4587">Le rendez-vous est annulé</h1>
    ${salutation(p)}
    ${paragraphe(`Le rendez-vous du ${dateLongue(r.slotKey)} avec ${echapper(r.notaireNom)} est annulé. Vous n'avez rien à faire. Pour toute question, contactez ${r.clientNom ? echapper(r.clientNom) : "la personne qui l'avait pris"}.`)}
  `);
}
