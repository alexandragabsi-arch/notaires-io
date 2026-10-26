// E-mail de confirmation envoyé au client après une réservation sur le site.
//
// Rédigé pour être lu sur téléphone, d'un coup d'œil : la date complète, le
// lieu (lien visio ou adresse du cabinet), ce qu'il faut préparer, et comment
// modifier ou annuler. Les champs saisis par le client sont échappés.

import { SITE } from "@/lib/email";
import { TZ_PARIS, parisParts } from "@/lib/creneau";
import { generateRoomId, internalVisioUrl, OUVERTURE_SALLE_MIN } from "@/lib/visio";
import { lienGestionRdv } from "@/lib/lien-rdv";

export function echapper(s: string | null | undefined): string {
  return (s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** « vendredi 16 octobre 2026 à 15h00 », à l'heure de Paris. */
export function dateLongue(slotKey: string): string {
  const d = new Date(slotKey);
  const jour = d.toLocaleDateString("fr-FR", {
    timeZone: TZ_PARIS, weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const p = parisParts(d);
  return `${jour} à ${p.h}h${String(p.min).padStart(2, "0")}`;
}

/** « Madame Gabsi », « Monsieur Martin », ou le prénom si la civilité manque. */
function appellation(civilite: string, prenom: string, nom: string): string {
  const c = civilite.trim().toLowerCase().replace(/\./g, "");
  const titre = c === "mme" || c === "madame" ? "Madame" : c === "m" || c === "monsieur" ? "Monsieur" : "";
  const nomPropre = nom.trim().toLowerCase().replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase());
  return titre && nomPropre ? `${titre} ${nomPropre}` : prenom.trim() || "";
}

interface Personne {
  civilite: string;
  prenom: string;
  nom: string;
  role: string;
}

export function emailConfirmationClient(o: {
  bookingId: string;
  client: Personne;
  notaireNom: string;
  etude: string | null;
  adresse: string | null;
  slotKey: string;
  modalite: "visio" | "cabinet";
  dossier: string;
  participants: Personne[];
}): string {
  const quand = dateLongue(o.slotKey);
  const dateIso = (() => {
    const p = parisParts(new Date(o.slotKey));
    return `${p.y}-${String(p.mo + 1).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
  })();
  const visio = `${SITE}${internalVisioUrl(generateRoomId(o.bookingId), dateIso, o.slotKey)}`;
  // Lien signé : le client gère ou annule son RDV sans se connecter.
  const espace = lienGestionRdv(o.bookingId);
  const reference = o.bookingId.slice(0, 8).toUpperCase();
  const salut = appellation(o.client.civilite, o.client.prenom, o.client.nom);

  const lieu =
    o.modalite === "visio"
      ? `En visioconférence. La salle ouvre ${OUVERTURE_SALLE_MIN} minutes avant le rendez-vous.`
      : `Au cabinet${o.etude ? ` — ${echapper(o.etude)}` : ""}${o.adresse ? `<br>${echapper(o.adresse)}` : ""}`;

  const autres = o.participants.slice(1);
  const ligne = (libelle: string, valeur: string) => `
    <tr>
      <td style="padding:6px 0;color:#5a6a8a;font-size:14px;width:120px;vertical-align:top">${libelle}</td>
      <td style="padding:6px 0;color:#1a1a2e;font-size:15px;vertical-align:top">${valeur}</td>
    </tr>`;
  const bouton = (href: string, texte: string, plein: boolean) =>
    `<a href="${href}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 22px;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none;${
      plein ? "background:#2d5dbf;color:#ffffff" : "background:#ffffff;color:#2d5dbf;border:1px solid #2d5dbf"
    }">${texte}</a>`;

  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a2e;line-height:1.5">
    <!-- Chemin réel du fichier : /logo-notaires-io.png n'a jamais existé, tous
         les e-mails partaient avec un logo cassé. Largeur explicite : plusieurs
         clients de messagerie n'appliquent pas le ratio à partir de la hauteur. -->
    <img src="${SITE}/images/logo-carre-notaires-io.png" alt="Notaires.io" width="30" height="30" style="width:30px;height:30px;margin-bottom:28px;display:block;border:0" />
    <p style="font-size:16px;margin:0 0 6px">Bonjour${salut ? ` ${echapper(salut)}` : ""},</p>
    <h1 style="font-size:21px;font-weight:700;margin:0 0 20px;color:#1a1a2e">
      Votre rendez-vous avec ${echapper(o.notaireNom)} est confirmé.
    </h1>

    <div style="background:#f0f4ff;border-radius:12px;padding:18px 20px;margin-bottom:22px">
      <table style="width:100%;border-collapse:collapse">
        ${ligne("Date", `<strong>${quand.charAt(0).toUpperCase() + quand.slice(1)}</strong>`)}
        ${ligne("Lieu", lieu)}
        ${ligne("Notaire", echapper(o.notaireNom))}
        ${o.dossier ? ligne("Objet", echapper(o.dossier)) : ""}
        ${autres.length ? ligne(autres.length > 1 ? "Autres participants" : "Autre participant", autres.map((p) => `${echapper(p.prenom)} ${echapper(p.nom)} (${echapper(p.role)})`).join("<br>")) : ""}
      </table>
    </div>

    <div style="margin-bottom:22px">
      ${o.modalite === "visio" ? bouton(visio, "Rejoindre la visio", true) : ""}
      ${bouton(espace, "Gérer ou annuler", o.modalite !== "visio")}
    </div>
    ${o.modalite === "visio" ? `
    <div style="border:1px solid #e0e8f5;border-radius:12px;padding:14px 16px;margin-bottom:22px">
      <p style="font-size:14px;font-weight:700;margin:0 0 4px">Lien de la visio pour les autres participants</p>
      <p style="font-size:13px;color:#3d4a66;margin:0 0 8px">Transmettez-leur ce lien : il ouvre la même salle, ${OUVERTURE_SALLE_MIN} minutes avant le rendez-vous.</p>
      <a href="${visio}" style="font-size:13px;color:#2d5dbf;word-break:break-all">${visio}</a>
    </div>` : ""}

    <h2 style="font-size:15px;font-weight:700;margin:0 0 6px">À préparer</h2>
    <p style="font-size:14px;color:#3d4a66;margin:0 0 18px">
      Une pièce d'identité en cours de validité et les documents liés à votre dossier
      (titre de propriété, livret de famille, contrat de mariage…). Vous pouvez les déposer
      à l'avance dans votre espace : le notaire les consultera avant le rendez-vous.
    </p>

    <h2 style="font-size:15px;font-weight:700;margin:0 0 6px">Un empêchement ?</h2>
    <p style="font-size:14px;color:#3d4a66;margin:0 0 24px">
      Vous pouvez <a href="${espace}" style="color:#2d5dbf">annuler votre rendez-vous en un clic</a>,
      ou répondre simplement à cet e-mail. Merci de prévenir au moins 24 heures à l'avance.
    </p>

    <p style="font-size:12px;color:#8a9ab0;margin:0 0 20px">Référence du rendez-vous : ${reference}</p>
    <hr style="border:none;border-top:1px solid #e8edf5;margin:0 0 16px" />
    <p style="font-size:12px;color:#8a9ab0;text-align:center;margin:0">
      <a href="${SITE}" style="color:#2d5dbf;text-decoration:none">Notaires.io</a> —
      la prise de rendez-vous en ligne avec un notaire. Service gratuit.
    </p>
  </div>`;
}
