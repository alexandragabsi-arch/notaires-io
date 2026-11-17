import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/notaire-email-serveur";
import { sendEmail, emailLayout, ADMIN_EMAIL, SITE } from "@/lib/email";

// Cron quotidien — relance des inscriptions commencées et non terminées.
//
// Une seule relance par adresse, envoyée le lendemain de la saisie (au moins
// 20 h après, au plus 7 jours après). Pas de relance si :
//   - l'inscription est allée au bout (termine_at, ou profil existant à cette adresse) ;
//   - l'adresse s'est désabonnée (jeton HMAC dans email_suppressions) ;
//   - une relance est déjà partie pour cette adresse.
// La relance est marquée AVANT l'envoi : au pire une relance perdue, jamais deux.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HEURE = 60 * 60 * 1000;

function bearerValide(header: string | null, secret: string): boolean {
  if (!header) return false;
  const attendu = Buffer.from(`Bearer ${secret}`);
  const recu = Buffer.from(header);
  if (attendu.length !== recu.length) return false;
  return crypto.timingSafeEqual(attendu, recu);
}

// Même jeton que le script de prospection (HMAC-SHA256 de l'adresse, 32 car.).
function jetonDesabonnement(email: string): string | null {
  const secret = process.env.UNSUB_SECRET;
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update(email.toLowerCase()).digest("hex").slice(0, 32);
}

const echapper = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Gabarit des envois Notaires.io (bandeau bleu, signature « L'équipe Notaires.io »).
function emailRelance(nom: string | null, lien: string, jeton: string | null): string {
  const salut = nom ? `Bonjour Maître ${echapper(nom)},` : "Bonjour Maître,";
  const desabo = jeton
    ? `<a href="${SITE}/api/desabonnement?t=${jeton}" style="color:#777;">Ne plus recevoir nos messages</a>`
    : "Si vous ne souhaitez plus recevoir nos messages, répondez simplement « STOP ».";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:24px 0;"><tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;font-family:Arial,Helvetica,sans-serif;color:#222;font-size:15px;line-height:1.6;"><tr><td style="background:#1C4587;padding:20px 32px;border-radius:8px 8px 0 0;"><span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#ffffff;font-weight:bold;">Notaires.io</span></td></tr><tr><td style="padding:28px 32px 8px 32px;"><p style="margin:0 0 16px 0;">${salut}</p><p style="margin:0 0 16px 0;text-align:justify;">Vous avez commencé votre inscription sur Notaires.io sans la terminer. Il ne vous reste que quelques minutes pour activer votre profil : vos clients pourront prendre rendez-vous en ligne à toute heure, et vous gérerez votre agenda et vos rappels depuis un seul outil.</p><p style="margin:0 0 16px 0;text-align:justify;">L'essai est <strong>gratuit pendant 2 mois, sans carte bancaire</strong> et sans engagement.</p></td></tr><tr><td align="center" style="padding:8px 32px 20px 32px;"><a href="${lien}" style="display:inline-block;background:#4980E6;color:#ffffff;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:6px;">Terminer mon inscription</a></td></tr><tr><td style="padding:0 32px 8px 32px;"><p style="margin:0 0 16px 0;text-align:justify;">Une question ou une difficulté pendant l'inscription ? Répondez simplement à cet e-mail, nous vous aidons volontiers.</p><p style="margin:0 0 4px 0;">Bien cordialement,</p><p style="margin:0 0 4px 0;"><strong>L'équipe Notaires.io</strong></p><p style="margin:0 0 16px 0;"><a href="mailto:contact@notaires.io" style="color:#1C4587;">contact@notaires.io</a> &nbsp;·&nbsp; 07 56 83 33 61</p><p style="margin:0 0 20px 0;">Suivez-nous : <a href="https://www.linkedin.com/company/notaires-io/" style="color:#1C4587;">LinkedIn</a> &nbsp;·&nbsp; <a href="https://www.instagram.com/notaires.io/" style="color:#1C4587;">Instagram</a></p></td></tr><tr><td style="padding:12px 32px 20px 32px;border-top:1px solid #e5e8ef;font-size:12px;color:#777;">${desabo}</td></tr></table></td></tr></table>`;
}

type Ligne = {
  session_id: string;
  email: string;
  nom: string | null;
  fiche_id: string | null;
  created_at: string;
};

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "Cron non configuré" }, { status: 503 });
  if (!bearerValide(req.headers.get("authorization"), secret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const db = supabaseAdmin();
  const maintenant = Date.now();
  const { data, error } = await db
    .from("inscriptions_commencees")
    .select("session_id, email, nom, fiche_id, created_at")
    .is("termine_at", null)
    .is("relance_at", null)
    .lt("created_at", new Date(maintenant - 20 * HEURE).toISOString())
    .gt("created_at", new Date(maintenant - 7 * 24 * HEURE).toISOString())
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[relances-inscription] lecture:", error.message);
    return NextResponse.json({ error: "Lecture impossible" }, { status: 500 });
  }

  // Une relance par adresse : on garde la visite la plus récente.
  const parEmail = new Map<string, Ligne>();
  for (const l of (data ?? []) as Ligne[]) {
    const cle = l.email.toLowerCase();
    if (!parEmail.has(cle)) parEmail.set(cle, l);
  }

  const bilan = { relances: [] as string[], deja_inscrits: 0, desabonnes: 0 };

  for (const [email, l] of parEmail) {
    // Toutes les visites de cette adresse sont traitées ensemble.
    const marquer = (champ: "relance_at" | "termine_at") =>
      db
        .from("inscriptions_commencees")
        .update({ [champ]: new Date().toISOString() })
        .eq("email", email)
        .is(champ, null)
        .select("session_id");

    // Déjà inscrit (par une autre visite ou un autre appareil) ?
    const { data: profil } = await db.from("notaire_profiles").select("id").ilike("email", email.replace(/[\\%_]/g, (c) => `\\${c}`)).limit(1);
    if (profil?.length) {
      await marquer("termine_at");
      bilan.deja_inscrits++;
      continue;
    }

    // Relance déjà partie pour cette adresse lors d'une visite précédente ?
    const { data: dejaRelance } = await db
      .from("inscriptions_commencees")
      .select("session_id")
      .eq("email", email)
      .not("relance_at", "is", null)
      .limit(1);
    if (dejaRelance?.length) {
      await marquer("relance_at");
      continue;
    }

    const jeton = jetonDesabonnement(email);
    if (jeton) {
      const { data: supp } = await db.from("email_suppressions").select("token").eq("token", jeton).limit(1);
      if (supp?.length) {
        await marquer("relance_at");
        bilan.desabonnes++;
        continue;
      }
    }

    const { data: marque } = await marquer("relance_at");
    if (!marque?.length) continue;

    const lien = `${SITE}/inscription?${l.fiche_id ? `claim=${encodeURIComponent(l.fiche_id)}&` : ""}utm_source=email&utm_medium=relance&utm_campaign=inscription-commencee`;
    const ok = await sendEmail(
      email,
      "Votre inscription sur Notaires.io n'est pas terminée",
      emailRelance(l.nom, lien, jeton),
    );
    if (ok) bilan.relances.push(email);
  }

  if (bilan.relances.length) {
    await sendEmail(
      ADMIN_EMAIL,
      `[Notaires.io] ${bilan.relances.length} relance(s) d'inscription envoyée(s)`,
      emailLayout(
        `<p style="font-size:14px;line-height:1.7">Relances envoyées à :<br>${bilan.relances.map(echapper).join("<br>")}</p>`,
      ),
    );
  }

  return NextResponse.json({ ok: true, relances: bilan.relances.length, deja_inscrits: bilan.deja_inscrits, desabonnes: bilan.desabonnes });
}
