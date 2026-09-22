import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/notaire-email-serveur";
import { sendEmail, emailLayout, emailButton, ADMIN_EMAIL, SITE } from "@/lib/email";
import { dateFr } from "@/lib/offres";

// Cron quotidien — fin des essais sans carte (offre LinkedIn, codes d'invitation).
//   J-7 et J-1 : e-mail « ajoutez votre carte pour continuer » ;
//   échéance   : statut « expire » → la fiche redevient une fiche d'annuaire
//                de base (rien n'est supprimé, réactivation en un clic).
// Chaque rappel est horodaté en base : deux passages du cron n'envoient
// jamais deux fois le même e-mail.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const JOUR = 24 * 60 * 60 * 1000;

function bearerValide(header: string | null, secret: string): boolean {
  if (!header) return false;
  const attendu = Buffer.from(`Bearer ${secret}`);
  const recu = Buffer.from(header);
  if (attendu.length !== recu.length) return false;
  return crypto.timingSafeEqual(attendu, recu);
}

function emailRappel(nom: string, fin: string, joursRestants: number): string {
  const quand = joursRestants <= 1 ? "demain" : `dans ${joursRestants} jours`;
  return emailLayout(`
    <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;color:#1a1a2e">
      Votre accès offert se termine ${quand}
    </h1>
    <p style="color:#5a6a8a;margin-bottom:20px;line-height:1.6">
      ${nom ? `Bonjour ${nom},` : "Bonjour,"} votre accès offert à Notaires.io prend fin le
      <strong style="color:#1a1a2e">${fin}</strong>.
      Pour garder votre fiche complète, votre agenda en ligne et les rappels automatiques
      de vos clients, ajoutez votre carte : aucun prélèvement avant cette date,
      puis 119 € HT/mois, sans engagement.
    </p>
    <div style="margin-bottom:20px">${emailButton(`${SITE}/espace-notaire?carte=1`, "Ajouter ma carte et continuer")}</div>
    <p style="font-size:13px;color:#5a6a8a;line-height:1.6">
      Sans carte, votre fiche reste dans l'annuaire dans sa version de base, et vous pourrez
      réactiver votre abonnement à tout moment depuis votre espace.
      Une question ? Répondez simplement à cet e-mail.
    </p>
  `);
}

function emailFin(nom: string): string {
  return emailLayout(`
    <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;color:#1a1a2e">Votre période offerte est terminée</h1>
    <p style="color:#5a6a8a;margin-bottom:20px;line-height:1.6">
      ${nom ? `Bonjour ${nom},` : "Bonjour,"} merci d'avoir essayé Notaires.io. Votre fiche reste
      visible dans l'annuaire dans sa version de base ; la prise de rendez-vous en ligne,
      votre photo et votre présentation sont suspendues. Tout est conservé : vous pouvez
      réactiver en un clic.
    </p>
    <div style="margin-bottom:20px">${emailButton(`${SITE}/espace-notaire?carte=1`, "Réactiver mon abonnement")}</div>
  `);
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "Cron non configuré" }, { status: 503 });
  if (!bearerValide(req.headers.get("authorization"), secret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const db = supabaseAdmin();
  const { data: essais, error } = await db
    .from("notaire_profiles")
    .select("id, name, user_id, subscription_status, subscription_renewal_at, rappel_j7_at, rappel_j1_at")
    .in("subscription_status", ["essai_offert", "offert"])
    .not("subscription_renewal_at", "is", null);
  if (error) {
    console.error("[fin-essai] lecture:", error.message);
    return NextResponse.json({ error: "Lecture impossible" }, { status: 500 });
  }

  const bilan = { j7: 0, j1: 0, expires: 0 };
  const maintenant = Date.now();

  for (const e of essais ?? []) {
    const finMs = Date.parse(e.subscription_renewal_at as string);
    if (!Number.isFinite(finMs)) continue;
    const joursRestants = Math.ceil((finMs - maintenant) / JOUR);

    // Destinataire : l'e-mail du compte (celui qui a reçu la confirmation).
    let email: string | undefined;
    if (e.user_id) {
      const { data } = await db.auth.admin.getUserById(e.user_id as string);
      email = data.user?.email ?? undefined;
    }
    const nom = (e.name as string | null) ?? "";

    if (joursRestants <= 0) {
      // Échéance atteinte : bascule conditionnelle (un passage concurrent ou un
      // ajout de carte entre-temps ne sont pas écrasés).
      const { data: maj } = await db
        .from("notaire_profiles")
        .update({ subscription_status: "expire" })
        .eq("id", e.id)
        .eq("subscription_status", e.subscription_status)
        .select("id");
      if (maj?.length) {
        bilan.expires++;
        if (email) await sendEmail(email, "Votre période offerte Notaires.io est terminée", emailFin(nom));
      }
      continue;
    }

    const creneau = joursRestants <= 1 ? "rappel_j1_at" : joursRestants <= 7 ? "rappel_j7_at" : null;
    if (!creneau || e[creneau] || !email) continue;

    // On marque d'abord (condition « pas encore envoyé ») puis on envoie :
    // au pire un rappel perdu, jamais deux.
    const { data: marque } = await db
      .from("notaire_profiles")
      .update({ [creneau]: new Date().toISOString() })
      .eq("id", e.id)
      .is(creneau, null)
      .select("id");
    if (!marque?.length) continue;

    await sendEmail(
      email,
      joursRestants <= 1
        ? "Dernier jour : votre accès offert Notaires.io se termine demain"
        : `Votre accès offert Notaires.io se termine le ${dateFr(e.subscription_renewal_at as string)}`,
      emailRappel(nom, dateFr(e.subscription_renewal_at as string), joursRestants),
    );
    if (creneau === "rappel_j1_at") bilan.j1++;
    else bilan.j7++;
  }

  if (bilan.j7 + bilan.j1 + bilan.expires > 0) {
    await sendEmail(
      ADMIN_EMAIL,
      `[Notaires.io] Fins d'essai : ${bilan.j7} rappel(s) J-7, ${bilan.j1} J-1, ${bilan.expires} expiré(s)`,
      emailLayout(`<p style="font-size:14px">Rappels J-7 : ${bilan.j7} · J-1 : ${bilan.j1} · Essais expirés : ${bilan.expires}</p>`),
    );
  }

  return NextResponse.json({ ok: true, ...bilan });
}
