import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, SITE } from "@/lib/email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface Participant {
  civilite: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  role: string;
  dateNaissance?: string;
  adresse?: string;
}

interface StoredDocument {
  id: string;
  label: string;
  fileName: string;
  path?: string;
}

interface BookingPayload {
  notaireId: string;
  notaireNom: string;
  slotKey: string;
  slotLabel: string;
  dossier: string;
  modalite: "visio" | "cabinet";
  participants: Participant[];
  documents?: StoredDocument[];
  userId?: string | null;
}

export async function POST(req: NextRequest) {
  const body = await req.json() as BookingPayload;
  const { notaireId, notaireNom, slotKey, slotLabel, dossier, modalite, participants, documents, userId } = body;

  if (!notaireId || !slotLabel || !participants?.length) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const client = participants[0];
  const clientNom = `${client.civilite} ${client.prenom} ${client.nom.toUpperCase()}`.trim();

  // ── Sauvegarde Supabase ──────────────────────────────────────────────────────
  const { data, error } = await supabase.from("bookings").insert({
    notaire_id: notaireId,
    notaire_nom: notaireNom,
    slot_key: slotKey,
    slot_label: slotLabel,
    dossier,
    modalite,
    participants,
    documents: Array.isArray(documents) ? documents : [],
    client_nom: clientNom,
    client_email: client.email || null,
    user_id: userId || null,
    status: "confirmé",
  }).select("id").single();

  if (error) {
    console.error("Booking insert error:", error);
    return NextResponse.json({ error: "Erreur de réservation" }, { status: 500 });
  }

  const bookingId = data?.id as string;

  // ── Email client ─────────────────────────────────────────────────────────────
  if (client.email) {
    const clientHtml = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;color:#1a1a2e">
        <img src="${SITE}/logo-notaires-io.png" alt="Notaires.io" style="height:32px;margin-bottom:32px" />
        <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;color:#1a1a2e">
          Votre rendez-vous est confirmé ✓
        </h1>
        <p style="color:#5a6a8a;margin-bottom:24px">
          Bonjour ${client.civilite} ${client.prenom},
        </p>
        <div style="background:#f0f4ff;border-radius:12px;padding:20px;margin-bottom:24px">
          <div style="font-size:14px;color:#2d5dbf;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Rendez-vous</div>
          <div style="font-size:16px;font-weight:600;color:#1a1a2e">${slotLabel}</div>
          <div style="font-size:14px;color:#5a6a8a;margin-top:4px">${modalite === "visio" ? "📹 En visioconférence" : "🏛 Au cabinet"} · ${dossier}</div>
        </div>
        <div style="background:#f8f9fa;border-radius:12px;padding:20px;margin-bottom:24px">
          <div style="font-size:13px;font-weight:700;color:#1a1a2e;margin-bottom:4px">Notaire</div>
          <div style="font-size:15px;font-weight:600;color:#2d5dbf">${notaireNom}</div>
        </div>
        ${participants.length > 1 ? `
        <div style="background:#f8f9fa;border-radius:12px;padding:20px;margin-bottom:24px">
          <div style="font-size:13px;font-weight:700;color:#1a1a2e;margin-bottom:8px">Participants (${participants.length})</div>
          ${participants.map((p, i) => `
            <div style="font-size:13px;color:#5a6a8a;margin-bottom:4px">
              ${i + 1}. ${p.civilite} ${p.prenom} ${p.nom.toUpperCase()} — <em>${p.role}</em>
            </div>
          `).join("")}
        </div>
        ` : ""}
        <p style="font-size:13px;color:#5a6a8a;margin-bottom:0">
          Référence : <code style="font-family:monospace;background:#f0f0f0;padding:2px 6px;border-radius:4px">${bookingId}</code>
        </p>
        <hr style="border:none;border-top:1px solid #e8edf5;margin:32px 0" />
        <p style="font-size:12px;color:#8a9ab0;text-align:center">
          <a href="${SITE}" style="color:#2d5dbf;text-decoration:none">Notaires.io</a> ·
          Service gratuit d'orientation et de prise de rendez-vous notariale
        </p>
      </div>
    `;
    await sendEmail(
      client.email,
      `Confirmation RDV — ${slotLabel} avec ${notaireNom}`,
      clientHtml,
    );
  }

  // ── Récupérer l'email du notaire ─────────────────────────────────────────────
  const { data: notaireRow } = await supabase
    .from("notaire_profiles")
    .select("email")
    .eq("id", notaireId)
    .maybeSingle();
  const notaireEmail = (notaireRow?.email as string | null) || "contact@notaires.io";

  // ── Email notification notaire ────────────────────────────────────────────────
  const notifHtml = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;color:#1a1a2e">
      <h2 style="font-size:18px;font-weight:700;margin-bottom:16px">
        Nouvelle réservation — ${slotLabel}
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left">
        <tr><td style="padding:6px 0;color:#5a6a8a;width:140px">Notaire</td><td style="font-weight:600">${notaireNom} (${notaireId})</td></tr>
        <tr><td style="padding:6px 0;color:#5a6a8a">Créneau</td><td>${slotLabel}</td></tr>
        <tr><td style="padding:6px 0;color:#5a6a8a">Modalité</td><td>${modalite}</td></tr>
        <tr><td style="padding:6px 0;color:#5a6a8a">Dossier</td><td>${dossier}</td></tr>
        <tr><td style="padding:6px 0;color:#5a6a8a">Client</td><td>${clientNom}</td></tr>
        ${client.email ? `<tr><td style="padding:6px 0;color:#5a6a8a">Email client</td><td>${client.email}</td></tr>` : ""}
        ${client.telephone ? `<tr><td style="padding:6px 0;color:#5a6a8a">Tél. client</td><td>${client.telephone}</td></tr>` : ""}
        <tr><td style="padding:6px 0;color:#5a6a8a">ID réservation</td><td><code>${bookingId}</code></td></tr>
      </table>
    </div>
  `;
  await sendEmail(
    notaireEmail,
    `[Notaires.io] Nouvelle réservation — ${slotLabel}`,
    notifHtml,
  );

  return NextResponse.json({ success: true, bookingId });
}
