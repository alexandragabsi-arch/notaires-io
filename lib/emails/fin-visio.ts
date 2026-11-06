// E-mail « comment s'est passée votre visio ? », envoyé une heure après le début
// d'une visio au notaire, au client et aux autres participants.
//
// Même contenu que le message envoyé à la main le 28/10/2026 : note de 1 à 5,
// « tout s'est bien passé ? » (oui / non) et une idée d'amélioration. Chaque
// réponse ouvre un e-mail pré-rempli vers contact@notaires.io : aucune page ni
// table de plus, et l'objet identifie le rendez-vous.

import { emailLayout, SITE } from "@/lib/email";
import { echapper } from "@/lib/emails/confirmation-rdv";
import type { ParticipantAPrevenir } from "@/lib/emails/rdv-participant";
import { parisParts } from "@/lib/creneau";

export type DestinataireFinVisio = "notaire" | "client" | "participant";

export interface RdvFinVisio {
  bookingId: string;
  slotKey: string;
  notaireNom: string;
  clientNom: string | null;
  dossier: string | null;
}

const CONTACT = "contact@notaires.io";
const TELEPHONE = "07 56 83 33 61";

function momentEtHeure(slotKey: string): string {
  const p = parisParts(new Date(slotKey));
  const quand = p.h < 12 ? "ce matin" : p.h < 18 ? "cet après-midi" : "ce soir";
  return `${quand} à ${p.h}h${String(p.min).padStart(2, "0")}`;
}

export function sujetFinVisio(r: RdvFinVisio): string {
  const p = parisParts(new Date(r.slotKey));
  const quand = p.h < 12 ? "de ce matin" : p.h < 18 ? "de cet après-midi" : "de ce soir";
  return `Votre visio ${quand} : comment s'est-elle passée ?`;
}

function mailto(r: RdvFinVisio, objet: string): string {
  return `mailto:${CONTACT}?subject=${encodeURIComponent(`${objet} [visio ${r.bookingId}]`)}`;
}

const bouton = (href: string, libelle: string, plein = false) =>
  `<a href="${href}" style="display:inline-block;margin:0 6px 8px 0;padding:11px 26px;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;${
    plein
      ? "background:linear-gradient(135deg,#509BF8 0%,#4980E6 100%);color:#fff"
      : "background:#fff;color:#1C4587;border:1px solid #cfdcf0"
  }">${libelle}</a>`;

const question = (texte: string) =>
  `<p style="font-size:16px;color:#1C4587;margin:22px 0 10px"><strong>${texte}</strong></p>`;

export function emailFinVisio(
  dest: DestinataireFinVisio,
  r: RdvFinVisio,
  p?: Pick<ParticipantAPrevenir, "prenom" | "nom">,
): string {
  const notaire = echapper(r.notaireNom);
  const client = r.clientNom ? echapper(r.clientNom) : "votre client";
  const objet = r.dossier ? `, ${echapper(r.dossier)}` : "";
  const quand = momentEtHeure(r.slotKey);

  const salut =
    dest === "notaire"
      ? `${notaire},`
      : dest === "participant" && p && (p.prenom || p.nom)
        ? `Bonjour ${echapper(`${p.prenom} ${p.nom}`.trim())},`
        : r.clientNom && dest === "client"
          ? `Bonjour ${client},`
          : "Bonjour,";

  const intro =
    dest === "notaire"
      ? `Vous avez reçu ${quand}, en visio, un rendez-vous pris via Notaires.io (${client}${objet}). Votre avis nous aide à améliorer le service.`
      : `Vous avez rencontré ${notaire} ${quand}, en visio, grâce à Notaires.io${r.dossier ? ` (${echapper(r.dossier)})` : ""}. Votre avis nous aide à améliorer le service.`;

  const q1 =
    dest === "notaire" ? "1. Tout s'est bien passé (visio, infos client) ?" : "1. Tout s'est bien passé (visio, échange avec le notaire) ?";

  const etoiles = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<a href="${mailto(r, `Note visio ${n}/5`)}" style="display:inline-block;width:56px;text-decoration:none;color:#7588a8;font-size:13px"><span style="display:block;font-size:40px;line-height:44px;color:#EDB43A">★</span>${n}</a>`,
    )
    .join("");

  return emailLayout(`
    <h1 style="font-size:24px;font-weight:700;margin:0 0 18px;color:#1C4587;line-height:1.25">${echapper(sujetFinVisio(r).replace(/ ?\?$/, ""))} ?</h1>
    <p style="font-size:15px;color:#3d4a66;margin:0 0 14px">${salut}</p>
    <p style="font-size:15px;color:#3d4a66;margin:0 0 6px;line-height:1.5">${intro}</p>
    ${question("Votre note <span style=\"font-weight:400;color:#7588a8\">(cliquez sur une étoile)</span>")}
    <div style="margin:0 0 4px">${etoiles}</div>
    <p style="font-size:13px;color:#7588a8;margin:0 0 4px">1 = à revoir · 5 = excellent</p>
    ${question(q1)}
    <div>${bouton(mailto(r, "Visio : tout s'est bien passé"), "Oui", true)}${bouton(mailto(r, "Visio : un souci"), "Non")}</div>
    ${question("2. Une chose à améliorer ou à ajouter ?")}
    <div>${bouton(mailto(r, "Mon idée pour Notaires.io"), "Donner mon idée")}</div>
    <p style="font-size:15px;color:#3d4a66;margin:28px 0 4px">Merci pour votre confiance,</p>
    <p style="font-size:16px;font-weight:700;color:#1C4587;margin:0 0 4px">L'équipe Notaires.io</p>
    <p style="font-size:14px;color:#7588a8;margin:0"><a href="tel:${TELEPHONE.replace(/ /g, "")}" style="color:#4980E6">${TELEPHONE}</a> · ${CONTACT}</p>
    <p style="font-size:12px;color:#9aa8c2;margin:18px 0 0"><a href="${SITE}" style="color:#4980E6;text-decoration:none">notaires.io</a></p>
  `);
}
