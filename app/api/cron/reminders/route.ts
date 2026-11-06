import { emailDuNotaire } from "@/lib/email-notaire";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, SITE } from "@/lib/email";
import { parisParts, msMuralDepuisSlotKey } from "@/lib/creneau";
import { emailRappelNotaire, sujetRappelNotaire } from "@/lib/emails/rappel-notaire";
import { emailFinVisio, sujetFinVisio } from "@/lib/emails/fin-visio";
import {
  emailRappelParticipant,
  envoyerAuxParticipants,
  participantsAPrevenir,
  sujetRappelParticipant,
} from "@/lib/emails/rdv-participant";

// Cron Vercel : envoie les rappels de RDV par e-mail.
// Déclenché toutes les heures (voir vercel.json → crons).
// Deux rappels par réservation : la veille à 18h (heure de Paris) et 2h avant.
// Le rappel de 2h avant part aussi au notaire, avec le lien de la visio.
// Les autres participants reçoivent les deux rappels, en même temps que le client.
// L'anti-doublon repose sur les colonnes bookings.reminder_eve_sent / _2h_sent.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Client Supabase créé à la demande (pas au chargement du module) pour éviter
// que le build n'échoue si une variable d'env manque au moment de la compilation.
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

type Kind = "eve" | "2h";

interface BookingRow {
  id: string;
  notaire_id: string | null;
  notaire_nom: string | null;
  slot_key: string | null;
  slot_label: string | null;
  dossier: string | null;
  modalite: string | null;
  client_nom: string | null;
  client_email: string | null;
  client_phone: string | null;
  participants: unknown;
  created_at: string;
  reminder_eve_sent: boolean;
  reminder_2h_sent: boolean;
}

// Mois courts français (toLocaleDateString month:"short") → index 0-11.
function parseMonth(s: string): number {
  const norm = s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const months = [
    "janv", "fevr", "mars", "avr", "mai", "juin",
    "juil", "aout", "sept", "oct", "nov", "dec",
  ];
  for (let i = 0; i < months.length; i++) {
    if (norm.includes(months[i])) return i;
  }
  return -1;
}

// Reconstruit l'instant du RDV (en composantes Paris) depuis le slotLabel
// ("Lun. 14 juin · 10h00") + l'année déduite de la date de réservation.
// Renvoie un repère numérique comparable (Date.UTC des composantes Paris).
function rdvWallMs(slotLabel: string, createdAt: string): number | null {
  if (!slotLabel) return null;
  const [datePart, timePart = ""] = slotLabel.split("·").map((s) => s.trim());
  const dayMatch = datePart.match(/(\d{1,2})/);
  if (!dayMatch) return null;
  const day = parseInt(dayMatch[1], 10);
  const monthIdx = parseMonth(datePart.slice((dayMatch.index ?? 0) + dayMatch[1].length));
  if (monthIdx < 0) return null;
  const timeMatch = timePart.match(/(\d{1,2})\s*h\s*(\d{2})?/i);
  const hours = timeMatch ? parseInt(timeMatch[1], 10) : 9;
  const minutes = timeMatch && timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;

  const created = parisParts(new Date(createdAt));
  let year = created.y;
  let ms = Date.UTC(year, monthIdx, day, hours, minutes);
  const createdMs = Date.UTC(created.y, created.mo, created.day, created.h, created.min);
  // Si le RDV tombe nettement avant la réservation → année suivante.
  if (ms < createdMs - 2 * 24 * 3600 * 1000) {
    year += 1;
    ms = Date.UTC(year, monthIdx, day, hours, minutes);
  }
  return ms;
}

function reminderHtml(kind: Kind, b: BookingRow): string {
  const when = kind === "eve" ? "demain" : "dans 2 heures";
  const notaireNom = b.notaire_nom || "votre notaire";
  const slotLabel = b.slot_label || "";
  const clientNom = b.client_nom || "";
  const modalite = b.modalite === "visio" ? "📹 En visioconférence" : "🏛 Au cabinet";
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;color:#1a1a2e">
      <img src="${SITE}/images/logo-carre-notaires-io.png" alt="Notaires.io" width="32" height="32" style="width:32px;height:32px;margin-bottom:28px;display:block;border:0" />
      <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;color:#1a1a2e">
        Rappel : votre rendez-vous ${when} ⏰
      </h1>
      <p style="color:#5a6a8a;margin-bottom:24px">
        ${clientNom ? `Bonjour ${clientNom},` : "Bonjour,"}
      </p>
      <div style="background:#f0f4ff;border-radius:12px;padding:20px;margin-bottom:24px">
        <div style="font-size:14px;color:#2d5dbf;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Rendez-vous</div>
        <div style="font-size:16px;font-weight:600;color:#1a1a2e">${slotLabel}</div>
        <div style="font-size:14px;color:#5a6a8a;margin-top:4px">${modalite} avec ${notaireNom}${b.dossier ? ` · ${b.dossier}` : ""}</div>
      </div>
      <a href="${SITE}/espace-client"
         style="display:inline-block;background:#2d5dbf;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:10px">
        Voir mon rendez-vous
      </a>
      <hr style="border:none;border-top:1px solid #e8edf5;margin:32px 0" />
      <p style="font-size:12px;color:#8a9ab0;text-align:center">
        <a href="${SITE}" style="color:#2d5dbf;text-decoration:none">Notaires.io</a> ·
        Service gratuit d'orientation et de prise de rendez-vous notariale
      </p>
    </div>
  `;
}

// Rappel aux autres participants. Il ne part qu'après celui du client et porte le
// même drapeau anti-doublon. Sans date ISO (anciennes lignes), pas de rappel.
async function rappelerParticipants(b: BookingRow, kind: Kind): Promise<number> {
  if (!b.slot_key || !Number.isFinite(Date.parse(b.slot_key))) return 0;
  const rdv = {
    bookingId: b.id,
    slotKey: b.slot_key,
    modalite: b.modalite,
    notaireNom: b.notaire_nom || "votre notaire",
    dossier: b.dossier,
    clientNom: b.client_nom,
  };
  return envoyerAuxParticipants(
    participantsAPrevenir(b.participants, b.client_email),
    sujetRappelParticipant(rdv, kind === "eve" ? "demain" : "dans 2h"),
    (p) => emailRappelParticipant(p, rdv, kind === "eve" ? "demain" : "dans 2 heures"),
  );
}

// Comparaison à temps constant, comme pour la signature du webhook Stripe :
// une comparaison naïve laisse fuir la longueur du préfixe correct.
function bearerValide(header: string | null, secret: string): boolean {
  if (!header) return false;
  const attendu = Buffer.from(`Bearer ${secret}`);
  const recu = Buffer.from(header);
  if (attendu.length !== recu.length) return false;
  return crypto.timingSafeEqual(attendu, recu);
}

// Une heure après le début d'une visio, le notaire, le client et les autres
// participants reçoivent « comment s'est-elle passée ? ». On ne remonte pas au-delà
// de 24 h pour ne jamais envoyer un message tardif ; bookings.feedback_sent
// empêche le doublon.
const DELAI_FIN_VISIO_MS = 60 * 60 * 1000;
const FENETRE_FIN_VISIO_MS = 24 * 60 * 60 * 1000;

async function mailsFinVisio(supabase: ReturnType<typeof getSupabase>): Promise<number> {
  const maintenant = Date.now();
  const { data, error } = await supabase
    .from("bookings")
    .select("id, notaire_id, notaire_nom, slot_key, dossier, client_nom, client_email, participants")
    .in("status", ["confirmed", "confirmé"])
    .eq("modalite", "visio")
    .eq("feedback_sent", false)
    .gte("slot_key", new Date(maintenant - FENETRE_FIN_VISIO_MS).toISOString())
    .lte("slot_key", new Date(maintenant - DELAI_FIN_VISIO_MS).toISOString());
  if (error) {
    console.error(`[fin-visio] lecture impossible : ${error.message}`);
    return 0;
  }
  let envoyes = 0;
  for (const b of data ?? []) {
    if (!b.slot_key || !Number.isFinite(Date.parse(b.slot_key))) continue;
    // Marqué avant l'envoi : mieux vaut un mail manquant qu'un mail en double.
    const { data: pris } = await supabase
      .from("bookings")
      .update({ feedback_sent: true })
      .eq("id", b.id)
      .eq("feedback_sent", false)
      .select("id");
    if (!pris?.length) continue;
    const rdv = {
      bookingId: b.id as string,
      slotKey: b.slot_key as string,
      notaireNom: (b.notaire_nom as string | null) || "votre notaire",
      clientNom: b.client_nom as string | null,
      dossier: b.dossier as string | null,
    };
    const sujet = sujetFinVisio(rdv);
    const emailNotaire = b.notaire_id ? await emailDuNotaire(supabase, b.notaire_id as string) : null;
    if (emailNotaire && (await sendEmail(emailNotaire, sujet, emailFinVisio("notaire", rdv)))) envoyes++;
    if (b.client_email && (await sendEmail(b.client_email as string, sujet, emailFinVisio("client", rdv)))) envoyes++;
    envoyes += await envoyerAuxParticipants(
      participantsAPrevenir(b.participants, b.client_email as string | null),
      sujet,
      (p) => emailFinVisio("participant", rdv, p),
    );
  }
  return envoyes;
}

export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  // Authentification du cron : Vercel envoie « Authorization: Bearer $CRON_SECRET ».
  //
  // Le contrôle n'est plus conditionné à l'existence du secret. Tant qu'il
  // l'était, une variable d'environnement absente désactivait silencieusement
  // la protection : la route répondait 200 à n'importe qui, lisait la table
  // bookings et envoyait les rappels aux clients. Sans secret configuré, on
  // refuse désormais de servir.
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Cron non configuré" }, { status: 503 });
  }
  if (!bearerValide(req.headers.get("authorization"), secret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const finVisio = await mailsFinVisio(supabase);

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, notaire_id, notaire_nom, slot_key, slot_label, dossier, modalite, client_nom, client_email, client_phone, participants, created_at, reminder_eve_sent, reminder_2h_sent",
    )
    // « confirmé » : lignes écrites par une ancienne version du site.
    .in("status", ["confirmed", "confirmé"])
    .not("client_email", "is", null)
    .or("reminder_eve_sent.eq.false,reminder_2h_sent.eq.false");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as BookingRow[];

  // Préférences de rappel par notaire (interrupteurs du dashboard).
  const notaireIds = [...new Set(rows.map((r) => r.notaire_id).filter(Boolean))] as string[];
  const prefs: Record<string, { eve: boolean; h2: boolean }> = {};
  // E-mail du notaire, pour son propre rappel de 2h avant.
  const emailsNotaires: Record<string, string> = {};
  if (notaireIds.length) {
    const { data: profs } = await supabase
      .from("notaire_profiles")
      .select("id, remind_eve, remind_2h")
      .in("id", notaireIds);
    for (const p of profs ?? []) {
      prefs[p.id as string] = {
        eve: p.remind_eve !== false,
        h2: p.remind_2h !== false,
      };
    }
    await Promise.all(
      notaireIds.map(async (id) => {
        const email = await emailDuNotaire(supabase, id);
        if (email) emailsNotaires[id] = email;
      }),
    );
  }

  const now = Date.now();
  const nowParis = parisParts(new Date());
  const nowMs = Date.UTC(nowParis.y, nowParis.mo, nowParis.day, nowParis.h, nowParis.min);

  let sentEve = 0;
  let sent2h = 0;
  let sent2hNotaire = 0;
  let sentParticipants = 0;

  for (const b of rows) {
    if (!b.client_email) continue;
    // slot_key ISO (format commun site/app) en priorité ; le libellé ne sert
    // plus que pour d'anciennes lignes.
    const rdvMs =
      msMuralDepuisSlotKey(b.slot_key ?? "") ?? rdvWallMs(b.slot_label ?? "", b.created_at);
    if (rdvMs == null || rdvMs <= nowMs) continue; // RDV passé ou illisible

    const pref = (b.notaire_id && prefs[b.notaire_id]) || { eve: true, h2: true };
    const diffMin = (rdvMs - nowMs) / 60000;

    // Veille à 18h (Paris) : fenêtre = de [rdv jour-1 18:00] jusqu'au RDV.
    // rdvMs encode les composantes Paris → on dérive la veille via getUTC*.
    const rdv = new Date(rdvMs);
    const eveTrigger = Date.UTC(
      rdv.getUTCFullYear(),
      rdv.getUTCMonth(),
      rdv.getUTCDate() - 1,
      18, 0,
    );

    // Rappel veille
    if (!b.reminder_eve_sent && pref.eve && nowMs >= eveTrigger && nowMs < rdvMs) {
      const ok = await sendEmail(
        b.client_email,
        `Rappel : RDV demain avec ${b.notaire_nom || "votre notaire"} — Notaires.io`,
        reminderHtml("eve", b),
      );
      if (ok) {
        await supabase.from("bookings").update({ reminder_eve_sent: true }).eq("id", b.id);
        sentEve++;
        sentParticipants += await rappelerParticipants(b, "eve");
      }
    }

    // Rappel 2h avant
    if (!b.reminder_2h_sent && pref.h2 && diffMin > 0 && diffMin <= 120) {
      const ok = await sendEmail(
        b.client_email,
        `Rappel : RDV dans 2h avec ${b.notaire_nom || "votre notaire"} — Notaires.io`,
        reminderHtml("2h", b),
      );
      if (ok) {
        await supabase.from("bookings").update({ reminder_2h_sent: true }).eq("id", b.id);
        sent2h++;
        // Même rappel côté notaire, porté par le même drapeau : il part une
        // seule fois, en même temps que celui du client.
        const emailNotaire = b.notaire_id ? emailsNotaires[b.notaire_id] : undefined;
        if (emailNotaire && (await sendEmail(emailNotaire, sujetRappelNotaire(b), emailRappelNotaire(b)))) {
          sent2hNotaire++;
        }
        sentParticipants += await rappelerParticipants(b, "2h");
      }
    }
  }

  return NextResponse.json({
    success: true,
    scanned: rows.length,
    sentEve,
    sent2h,
    sent2hNotaire,
    sentParticipants,
    finVisio,
    ranAt: new Date(now).toISOString(),
  });
}
