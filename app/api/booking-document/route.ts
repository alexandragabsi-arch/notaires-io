import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const RESEND_API = "https://api.resend.com/emails";
const FROM = "Notaires.io <contact@notaires.io>";
const SITE = "https://notaires.io";

interface Payload {
  bookingId: string;
  fileName: string;
}

async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return; // pas encore configuré — on ne bloque pas l'envoi du document
  await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
}

// Notifie le client par e-mail qu'une pièce vient d'être déposée par le notaire
// dans son espace. On ne joint pas le fichier : le client se connecte et le
// télécharge via une URL signée (bucket privé).
export async function POST(req: NextRequest) {
  const { bookingId, fileName } = (await req.json()) as Payload;
  if (!bookingId) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("client_email, client_nom, notaire_nom, slot_label")
    .eq("id", bookingId)
    .maybeSingle();

  if (error || !booking) {
    return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
  }

  const clientEmail = booking.client_email as string | null;
  if (!clientEmail) {
    // Réservation anonyme : pas d'e-mail à notifier, ce n'est pas une erreur.
    return NextResponse.json({ success: true, notified: false });
  }

  const notaireNom = (booking.notaire_nom as string | null) || "votre notaire";
  const slotLabel = (booking.slot_label as string | null) || "";
  const clientNom = (booking.client_nom as string | null) || "";

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;color:#1a1a2e">
      <img src="${SITE}/logo-notaires-io.png" alt="Notaires.io" style="height:32px;margin-bottom:32px" />
      <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;color:#1a1a2e">
        Un nouveau document est disponible 📄
      </h1>
      <p style="color:#5a6a8a;margin-bottom:24px">
        ${clientNom ? `Bonjour ${clientNom},` : "Bonjour,"}
      </p>
      <div style="background:#f0f4ff;border-radius:12px;padding:20px;margin-bottom:24px">
        <div style="font-size:14px;color:#2d5dbf;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Document transmis</div>
        <div style="font-size:16px;font-weight:600;color:#1a1a2e">${fileName || "Pièce jointe"}</div>
        <div style="font-size:14px;color:#5a6a8a;margin-top:4px">Par ${notaireNom}${slotLabel ? ` · ${slotLabel}` : ""}</div>
      </div>
      <p style="color:#5a6a8a;margin-bottom:24px">
        Retrouvez cette pièce dans votre espace, onglet <strong>« Reçus »</strong>.
      </p>
      <a href="${SITE}/espace-client"
         style="display:inline-block;background:#2d5dbf;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:10px">
        Voir mon document
      </a>
      <hr style="border:none;border-top:1px solid #e8edf5;margin:32px 0" />
      <p style="font-size:12px;color:#8a9ab0;text-align:center">
        <a href="${SITE}" style="color:#2d5dbf;text-decoration:none">Notaires.io</a> ·
        Service gratuit d'orientation et de prise de rendez-vous notariale
      </p>
    </div>
  `;

  await sendEmail(
    clientEmail,
    `Nouveau document de ${notaireNom} — Notaires.io`,
    html,
  );

  return NextResponse.json({ success: true, notified: true });
}
