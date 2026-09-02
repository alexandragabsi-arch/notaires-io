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
  // On ne bloque jamais l'appelant, mais on laisse une trace : sans ce log,
  // une clé absente ou refusée se traduit par des e-mails qui ne partent
  // jamais, sans la moindre erreur visible dans les logs Vercel.
  if (!key) {
    console.warn(`[email] RESEND_API_KEY absente — e-mail « ${subject} » non envoyé`);
    return false;
  }
  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[email] Resend a refusé « ${subject} » (${res.status}) ${detail.slice(0, 300)}`);
    }
    return res.ok;
  } catch (e) {
    console.error(`[email] Envoi impossible « ${subject} » : ${(e as Error).message}`);
    return false;
  }
}

// Gabarit commun aux couleurs du site : fond bleu, bandeau dégradé + wordmark,
// carte blanche pour le contenu, pied de page. `inner` = HTML du corps.
// Couleurs : palette notaires.io (accent #4980E6, texte #1C4587, tint #f0f4ff).
export function emailLayout(inner: string): string {
  return `
    <div style="background:#ffffff;margin:0;padding:32px 16px;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,Arial,sans-serif">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e3ebfb;box-shadow:0 10px 32px rgba(28,69,135,0.10)">
        <!-- Bandeau d'en-tête bleu -->
        <div style="background:linear-gradient(135deg,#509BF8 0%,#4980E6 100%);padding:30px 36px">
          <a href="${SITE}" style="font-size:24px;font-weight:800;letter-spacing:-0.02em;text-decoration:none;color:#ffffff">Notaires<span style="color:#cfe0ff">.io</span></a>
        </div>
        <!-- Contenu (centré) -->
        <div style="padding:38px 36px;color:#1C4587;text-align:center">
          ${inner}
        </div>
        <!-- Pied de page -->
        <div style="background:#ffffff;border-top:1px solid #e3ebfb;padding:22px 36px">
          <p style="font-size:12px;color:#7588a8;text-align:center;margin:0;line-height:1.6">
            <a href="${SITE}" style="color:#4980E6;text-decoration:none;font-weight:600">Notaires.io</a> · Plateforme de prise de rendez-vous notariale
          </p>
        </div>
      </div>
    </div>
  `;
}

// Bouton d'action réutilisable (CTA dégradé bleu, comme le site).
export function emailButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#509BF8 0%,#4980E6 100%);color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 28px;border-radius:12px;box-shadow:0 4px 14px rgba(73,128,230,0.32)">${label}</a>`;
}
