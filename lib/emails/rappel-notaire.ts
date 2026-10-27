// Rappel envoyé au notaire deux heures avant un rendez-vous.
//
// Seul le client recevait des rappels (veille et 2h avant) : le notaire n'avait
// que l'avis de réservation, parfois plusieurs jours plus tôt, et devait
// retrouver le lien de la visio dans ce premier mail (27/10/2026).

import { emailButton, emailLayout, SITE } from "@/lib/email";
import { echapper } from "@/lib/emails/confirmation-rdv";
import { generateRoomId, internalVisioUrl, OUVERTURE_SALLE_MIN } from "@/lib/visio";
import { parisParts } from "@/lib/creneau";

export interface RdvPourRappel {
  id: string;
  notaire_nom: string | null;
  slot_key: string | null;
  slot_label: string | null;
  dossier: string | null;
  modalite: string | null;
  client_nom: string | null;
  client_email: string | null;
  client_phone: string | null;
}

/** Lien de la salle de visio : même calcul que la confirmation du client. */
export function lienVisio(b: Pick<RdvPourRappel, "id" | "slot_key">): string {
  if (!b.slot_key) return `${SITE}${internalVisioUrl(generateRoomId(b.id))}`;
  const p = parisParts(new Date(b.slot_key));
  const dateIso = `${p.y}-${String(p.mo + 1).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
  return `${SITE}${internalVisioUrl(generateRoomId(b.id), dateIso, b.slot_key)}`;
}

export function sujetRappelNotaire(b: RdvPourRappel): string {
  const qui = b.client_nom ? ` — ${b.client_nom}` : "";
  return `Rappel : rendez-vous dans 2h${b.modalite === "visio" ? " (visio)" : ""}${qui}`;
}

export function emailRappelNotaire(b: RdvPourRappel): string {
  const ligne = (libelle: string, valeur: string | null) =>
    valeur
      ? `<tr><td style="padding:5px 0;color:#7588a8;font-size:14px;width:110px;vertical-align:top">${libelle}</td><td style="padding:5px 0;color:#1C4587;font-size:15px;vertical-align:top">${echapper(valeur)}</td></tr>`
      : "";
  const visio = b.modalite === "visio";
  return emailLayout(`
    <h1 style="font-size:22px;font-weight:700;margin:0 0 10px;color:#1C4587">Votre rendez-vous dans 2 heures</h1>
    <p style="font-size:15px;color:#5a6a8a;margin:0 0 24px">${echapper(b.notaire_nom || "Maître")}, voici le récapitulatif.</p>
    <table role="presentation" style="margin:0 auto 26px;background:#f0f4ff;border-radius:12px;padding:16px 22px;text-align:left;border-collapse:separate">
      ${ligne("Créneau", b.slot_label)}
      ${ligne("Modalité", visio ? "Visioconférence" : "Au cabinet")}
      ${ligne("Dossier", b.dossier)}
      ${ligne("Client", b.client_nom)}
      ${ligne("Téléphone", b.client_phone)}
      ${ligne("E-mail", b.client_email)}
    </table>
    ${visio
      ? `${emailButton(lienVisio(b), "Rejoindre la visioconférence")}
         <p style="font-size:13px;color:#7588a8;margin:14px 0 0">La salle ouvre ${OUVERTURE_SALLE_MIN} minutes avant l'heure prévue. Aucun logiciel à installer.</p>`
      : ""}
    <p style="font-size:14px;color:#5a6a8a;margin:24px 0 0">
      Les pièces déposées par le client sont dans votre
      <a href="${SITE}/espace-notaire" style="color:#4980E6;font-weight:600;text-decoration:none">espace notaire</a>.
    </p>
  `);
}
