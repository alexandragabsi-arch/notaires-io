// Centralisation de l'envoi d'e-mails transactionnels via Resend.
// Toutes les routes (booking, booking-document, reminders, stripe/webhook…)
// passent par ce module — une seule source pour la clé, l'expéditeur, le layout.
//
// Si RESEND_API_KEY n'est pas configuré, sendEmail renvoie `false` sans throw :
// l'appelant reste fonctionnel (la réservation/le paiement ne sont jamais bloqués).

const RESEND_API = "https://api.resend.com/emails";

export const FROM = "Notaires.io <contact@notaires.io>";
export const SITE = "https://notaires.io";

// Destinataire des notifications internes (nouvelles réservations, abonnements,
// commandes de cartes…). Surchargé par ADMIN_EMAIL en prod si besoin.
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "contact@notaires.io";

export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false; // pas encore configuré — on ne bloque jamais l'appelant
  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Gabarit commun : en-tête logo + contenu + pied de page.
// `inner` est le HTML du corps (titres, blocs, boutons…).
export function emailLayout(inner: string): string {
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;color:#1a1a2e">
      <img src="${SITE}/logo-notaires-io.png" alt="Notaires.io" style="height:32px;margin-bottom:32px" />
      ${inner}
      <hr style="border:none;border-top:1px solid #e8edf5;margin:32px 0" />
      <p style="font-size:12px;color:#8a9ab0;text-align:center">
        <a href="${SITE}" style="color:#2d5dbf;text-decoration:none">Notaires.io</a> ·
        Service gratuit d'orientation et de prise de rendez-vous notariale
      </p>
    </div>
  `;
}

// Bouton d'action réutilisable (CTA bleu).
export function emailButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#2d5dbf;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:10px">${label}</a>`;
}
