import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, SITE } from "@/lib/email";
import { limiter, ipDe } from "@/lib/rate-limit";
import { jetonValide } from "@/lib/lien-rdv";
import { dateLongue, echapper } from "@/lib/emails/confirmation-rdv";

// Annulation d'un rendez-vous par le client, depuis :
//   - le lien signé de l'e-mail de confirmation (/rdv/<id>?t=…) : { id, t } ;
//   - son espace client connecté : { id } + en-tête Authorization: Bearer <jeton Supabase>.
// Le RDV passe en « cancelled » (le créneau redevient libre, sur le site comme
// dans l'app) ; le client et le notaire sont prévenus par e-mail.

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function POST(req: NextRequest) {
  const limite = limiter(`rdv-annuler:${ipDe(req)}`, 10, 60_000);
  if (!limite.autorise) {
    return NextResponse.json({ error: "Trop de demandes. Réessayez dans un instant." }, { status: 429 });
  }

  const { id, t } = (await req.json().catch(() => ({}))) as { id?: string; t?: string };
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Rendez-vous introuvable." }, { status: 400 });
  }

  const db = admin();
  const { data: b } = await db
    .from("bookings")
    .select("id, status, slot_key, notaire_id, notaire_nom, client_nom, client_email, user_id, dossier, modalite")
    .eq("id", id)
    .maybeSingle();
  if (!b) return NextResponse.json({ error: "Rendez-vous introuvable." }, { status: 404 });

  // Autorisation : lien signé, ou compte connecté propriétaire du RDV.
  let autorise = jetonValide(id, t);
  if (!autorise) {
    const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (bearer) {
      const { data: u } = await db.auth.getUser(bearer);
      const email = u.user?.email?.toLowerCase();
      autorise =
        !!u.user &&
        (b.user_id === u.user.id || (!!email && email === (b.client_email ?? "").toLowerCase()));
    }
  }
  if (!autorise) return NextResponse.json({ error: "Lien invalide ou expiré." }, { status: 403 });

  if (b.status === "cancelled") return NextResponse.json({ success: true, dejaAnnule: true });
  if (b.slot_key && Date.parse(b.slot_key) <= Date.now()) {
    return NextResponse.json({ error: "Ce rendez-vous est déjà passé." }, { status: 409 });
  }

  const { error } = await db.from("bookings").update({ status: "cancelled" }).eq("id", id);
  if (error) {
    console.error("[rdv/annuler]", error);
    return NextResponse.json({ error: "L'annulation n'a pas pu être enregistrée." }, { status: 500 });
  }

  const quand = b.slot_key ? dateLongue(b.slot_key) : "";
  const notaire = echapper(b.notaire_nom || "votre notaire");

  if (b.client_email) {
    await sendEmail(
      b.client_email,
      `Votre rendez-vous${quand ? ` du ${quand}` : ""} est annulé`,
      `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a2e;line-height:1.5">
        <img src="${SITE}/images/logo-carre-notaires-io.png" alt="Notaires.io" width="30" height="30" style="width:30px;height:30px;margin-bottom:28px;display:block;border:0" />
        <h1 style="font-size:20px;font-weight:700;margin:0 0 12px">Votre rendez-vous est annulé.</h1>
        <p style="font-size:15px;margin:0 0 20px">Le rendez-vous${quand ? ` du ${quand}` : ""} avec ${notaire} est annulé. Le notaire a été prévenu.</p>
        <a href="${SITE}/annuaire" style="display:inline-block;padding:12px 22px;border-radius:10px;background:#2d5dbf;color:#fff;font-weight:600;text-decoration:none">Prendre un nouveau rendez-vous</a>
        <hr style="border:none;border-top:1px solid #e8edf5;margin:28px 0 14px" />
        <p style="font-size:12px;color:#8a9ab0;text-align:center;margin:0"><a href="${SITE}" style="color:#2d5dbf;text-decoration:none">Notaires.io</a> — la prise de rendez-vous en ligne avec un notaire.</p>
      </div>`,
    );
  }

  const { data: n } = await db.from("notaire_profiles").select("email").eq("id", b.notaire_id).maybeSingle();
  await sendEmail(
    (n?.email as string | null) || "contact@notaires.io",
    `[Notaires.io] Rendez-vous annulé${quand ? ` — ${quand}` : ""}`,
    `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a2e">
      <h2 style="font-size:18px;margin:0 0 12px">Rendez-vous annulé par le client</h2>
      <p style="margin:0 0 6px"><strong>Client :</strong> ${echapper(b.client_nom)}</p>
      <p style="margin:0 0 6px"><strong>Créneau :</strong> ${echapper(quand)}</p>
      <p style="margin:0 0 6px"><strong>Objet :</strong> ${echapper(b.dossier)}</p>
      <p style="margin:12px 0 0;color:#5a6a8a">Le créneau est de nouveau disponible à la réservation.</p>
    </div>`,
  );

  return NextResponse.json({ success: true });
}
