import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, SITE } from "@/lib/email";
import { limiter, ipDe, piegeDeclenche, reponsePiege } from "@/lib/rate-limit";
import { estSlotKeyIso, isoCreneau } from "@/lib/creneau";
import { emailConfirmationClient, dateLongue, echapper } from "@/lib/emails/confirmation-rdv";

// Client Supabase créé à la demande (pas au chargement du module) pour éviter
// que le build n'échoue si une variable d'env manque au moment de la compilation.
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

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
  smsReminder?: boolean;
}

export async function POST(req: NextRequest) {
  // Une réservation écrit en base et déclenche des e-mails : c'est la route la
  // plus coûteuse à laisser ouverte. 5 tentatives par minute et par adresse.
  const limite = limiter(`booking:${ipDe(req)}`, 5, 60_000);
  if (!limite.autorise) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez dans un instant." },
      { status: 429, headers: { "Retry-After": String(limite.attendreSec) } },
    );
  }

  const supabase = getSupabase();
  const body = await req.json() as BookingPayload;

  // Champ piège : rempli, la requête vient d'un robot de formulaire. On répond
  // comme si tout allait bien pour ne pas lui signaler qu'il est repéré.
  if (piegeDeclenche(body)) return reponsePiege("booking");
  const { notaireId, notaireNom, slotKey, slotLabel, dossier, modalite, participants, documents, userId, smsReminder } = body;

  if (!notaireId || !slotLabel || !participants?.length) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  // Le créneau doit être un instant ISO (format partagé avec l'app iOS) et à
  // venir : c'est sur lui que repose l'unicité « un RDV par créneau ».
  if (!estSlotKeyIso(slotKey) || Date.parse(slotKey) <= Date.now()) {
    return NextResponse.json({ error: "Créneau invalide ou passé" }, { status: 400 });
  }
  if (modalite !== "visio" && modalite !== "cabinet") {
    return NextResponse.json({ error: "Modalité invalide" }, { status: 400 });
  }

  const client = participants[0];
  const clientNom = `${client.civilite} ${client.prenom} ${client.nom.toUpperCase()}`.trim();

  // ── Sauvegarde Supabase ──────────────────────────────────────────────────────
  const { data, error } = await supabase.from("bookings").insert({
    notaire_id: notaireId,
    notaire_nom: notaireNom,
    slot_key: isoCreneau(new Date(slotKey)),
    slot_label: slotLabel,
    dossier,
    modalite,
    mode: modalite,
    participants,
    documents: Array.isArray(documents) ? documents : [],
    client_nom: clientNom,
    client_email: client.email || null,
    // Rappel SMS : envoyé par le serveur de l'app (Twilio), comme pour les RDV pris dans l'app.
    client_phone: client.telephone?.trim() || null,
    sms_reminder: !!smsReminder && !!client.telephone?.trim(),
    user_id: userId || null,
    status: "confirmed",
  }).select("id").single();

  // 23505 = index bookings_creneau_unique : le créneau vient d'être pris,
  // depuis le site ou depuis l'app.
  if (error?.code === "23505") {
    return NextResponse.json(
      { error: "Ce créneau vient d'être réservé. Choisissez-en un autre.", code: "slot_taken" },
      { status: 409 },
    );
  }
  if (error) {
    console.error("Booking insert error:", error);
    return NextResponse.json({ error: "Erreur de réservation" }, { status: 500 });
  }

  const bookingId = data?.id as string;

  // ── Coordonnées du notaire (adresse du cabinet, e-mail de notification) ────
  const { data: notaireRow } = await supabase
    .from("notaire_profiles")
    .select("email, address, office_name")
    .eq("id", notaireId)
    .maybeSingle();

  // ── Email client ─────────────────────────────────────────────────────────────
  if (client.email) {
    await sendEmail(
      client.email,
      `Votre rendez-vous du ${dateLongue(slotKey)} avec ${notaireNom} est confirmé`,
      emailConfirmationClient({
        bookingId,
        client,
        notaireNom,
        etude: (notaireRow?.office_name as string | null) ?? null,
        adresse: (notaireRow?.address as string | null) ?? null,
        slotKey,
        modalite,
        dossier,
        participants,
      }),
    );
  }

  const notaireEmail = (notaireRow?.email as string | null) || "contact@notaires.io";

  // ── Email notification notaire ────────────────────────────────────────────────
  const notifHtml = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;color:#1a1a2e">
      <h2 style="font-size:18px;font-weight:700;margin-bottom:16px">
        Nouvelle réservation — ${echapper(slotLabel)}
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left">
        <tr><td style="padding:6px 0;color:#5a6a8a;width:140px">Notaire</td><td style="font-weight:600">${echapper(notaireNom)} (${echapper(notaireId)})</td></tr>
        <tr><td style="padding:6px 0;color:#5a6a8a">Créneau</td><td>${echapper(slotLabel)}</td></tr>
        <tr><td style="padding:6px 0;color:#5a6a8a">Modalité</td><td>${echapper(modalite)}</td></tr>
        <tr><td style="padding:6px 0;color:#5a6a8a">Dossier</td><td>${echapper(dossier)}</td></tr>
        <tr><td style="padding:6px 0;color:#5a6a8a">Client</td><td>${echapper(clientNom)}</td></tr>
        ${client.email ? `<tr><td style="padding:6px 0;color:#5a6a8a">Email client</td><td>${echapper(client.email)}</td></tr>` : ""}
        ${client.telephone ? `<tr><td style="padding:6px 0;color:#5a6a8a">Tél. client</td><td>${echapper(client.telephone)}</td></tr>` : ""}
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
