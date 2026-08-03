import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, emailLayout, emailButton, ADMIN_EMAIL, SITE } from "@/lib/email";

// Client Supabase créé à la demande (voir app/api/booking/route.ts).
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

interface ParcoursLead {
  parcours: string;
  parcoursLabel: string;
  email: string;
  ville?: string;
  specialite?: string;
  answers?: Record<string, string | string[]>;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ParcoursLead;
  const { parcours, parcoursLabel, email, ville, specialite, answers } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  // ── Enregistrement best-effort (la table peut ne pas exister encore) ──────────
  // On n'échoue jamais la requête : la capture d'email + la redirection annuaire
  // priment sur le stockage.
  try {
    const supabase = getSupabase();
    await supabase.from("parcours_leads").insert({
      parcours,
      email,
      ville: ville || null,
      specialite: specialite || null,
      answers: answers ?? {},
    });
  } catch {
    /* table absente ou clé manquante — on continue */
  }

  const annuaireUrl = `${SITE}/annuaire?${new URLSearchParams({
    ...(ville ? { ville } : {}),
    ...(specialite ? { specialite } : {}),
  }).toString()}`;

  // ── Email de confirmation au client ──────────────────────────────────────────
  const clientHtml = emailLayout(`
    <h1 style="font-size:22px;font-weight:800;margin:0 0 12px;color:#1C4587">
      Votre parcours ${parcoursLabel ?? ""} est bien enregistré ✓
    </h1>
    <p style="font-size:15px;line-height:1.7;color:#3f5a86;margin:0 0 24px">
      Merci ! Voici les notaires compétents${ville ? ` à ${ville}` : ""} pour votre projet.
      Choisissez un créneau qui vous convient, en visio ou au cabinet.
    </p>
    <div style="margin:0 0 8px">${emailButton(annuaireUrl, "Voir les notaires disponibles")}</div>
  `);
  await sendEmail(email, `Votre parcours ${parcoursLabel ?? "notarial"} — Notaires.io`, clientHtml);

  // ── Notification interne ──────────────────────────────────────────────────────
  const adminHtml = emailLayout(`
    <h2 style="font-size:18px;font-weight:700;margin:0 0 14px;color:#1C4587">
      Nouveau lead parcours — ${parcoursLabel ?? parcours}
    </h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left;color:#1C4587">
      <tr><td style="padding:6px 0;color:#7588a8;width:120px">Parcours</td><td style="font-weight:600">${parcoursLabel ?? parcours}</td></tr>
      <tr><td style="padding:6px 0;color:#7588a8">Email</td><td>${email}</td></tr>
      <tr><td style="padding:6px 0;color:#7588a8">Ville</td><td>${ville ?? "—"}</td></tr>
      <tr><td style="padding:6px 0;color:#7588a8">Spécialité</td><td>${specialite ?? "—"}</td></tr>
      <tr><td style="padding:6px 0;color:#7588a8;vertical-align:top">Réponses</td><td>${
        answers
          ? Object.entries(answers)
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
              .join("<br>")
          : "—"
      }</td></tr>
    </table>
  `);
  await sendEmail(ADMIN_EMAIL, `[Notaires.io] Lead parcours — ${parcoursLabel ?? parcours}`, adminHtml);

  return NextResponse.json({ success: true });
}
