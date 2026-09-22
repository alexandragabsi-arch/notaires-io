import { NextRequest, NextResponse } from "next/server";
import { limiter, ipDe } from "@/lib/rate-limit";
import { identifierNotaire, supabaseAdmin } from "@/lib/notaire-email-serveur";
import { OFFRES, offreValide, finAccesIso, dateFr } from "@/lib/offres";
import { sendEmail, emailLayout, emailButton, ADMIN_EMAIL, SITE } from "@/lib/email";

// POST /api/offre — active un essai sans carte (lien /inscription?offre=…).
//
// Appelée à la place de /api/subscribe, une fois la fiche enregistrée.
// Le serveur revérifie tout : offre encore ouverte, compte @notaires.fr,
// fiche rattachée à CE compte, et aucune offre ni abonnement déjà en place
// (un seul essai par fiche).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const limite = limiter(`offre:${ipDe(req)}`, 10, 60_000);
  if (!limite.autorise) {
    return NextResponse.json({ error: "Trop de tentatives, réessayez dans une minute." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as
    | { offre?: string; notaireId?: string; userId?: string }
    | null;
  if (!body?.notaireId) {
    return NextResponse.json({ error: "Requête incomplète." }, { status: 400 });
  }

  const code = offreValide(body.offre);
  if (!code) {
    return NextResponse.json(
      { error: "Cette offre n'est plus disponible. Vous pouvez vous inscrire avec les 2 mois offerts habituels (carte demandée, aucun débit avant 2 mois)." },
      { status: 410 },
    );
  }

  const db = supabaseAdmin();
  const user = await identifierNotaire(req, db, body.userId);
  if (!user) {
    return NextResponse.json({ error: "Connectez-vous à votre espace notaire pour activer l'offre." }, { status: 401 });
  }

  const fin = finAccesIso(OFFRES[code].mois);

  // Activation atomique : ne passe que si la fiche est à ce compte ET n'a
  // encore ni offre ni abonnement. Deux clics simultanés → un seul succès.
  const { data, error } = await db
    .from("notaire_profiles")
    .update({ subscription_status: "essai_offert", subscription_renewal_at: fin, offre: code })
    .eq("id", body.notaireId)
    .eq("user_id", user.id)
    .is("subscription_status", null)
    .select("name, city");

  if (error) {
    console.error("[offre] échec activation:", error.message);
    return NextResponse.json({ error: "Erreur technique, réessayez." }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "Cette fiche a déjà bénéficié d'une offre ou d'un abonnement. Écrivez-nous à contact@notaires.io." },
      { status: 409 },
    );
  }

  const echap = (v: unknown) => String(v ?? "").replace(/[<>&"]/g, (c) => `&#${c.charCodeAt(0)};`);
  await sendEmail(
    ADMIN_EMAIL,
    `🎁 ${OFFRES[code].libelle} — ${echap(data[0].name)} vient de s'inscrire`,
    emailLayout(`
      <h1 style="margin:0 0 6px;font-size:22px;color:#1c4587">Nouvel essai sans carte</h1>
      <p style="margin:0 0 18px;color:#54617a;font-size:15px;line-height:1.6">
        <strong style="color:#1a2233">${echap(data[0].name)}</strong>${data[0].city ? ` · ${echap(data[0].city)}` : ""}
        (${echap(user.email)}) — ${echap(OFFRES[code].libelle)}.<br>
        Accès offert jusqu'au <strong>${dateFr(fin)}</strong>. Rappels automatiques à J-7 et J-1.
      </p>
      ${emailButton(`${SITE}/notaires/${encodeURIComponent(body.notaireId)}`, "Voir la fiche")}
    `),
  );

  return NextResponse.json({ ok: true, finAcces: fin });
}
