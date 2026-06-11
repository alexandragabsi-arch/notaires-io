import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, SITE } from "@/lib/email";

// Cron Vercel : envoie les rappels de RDV par e-mail.
// Déclenché toutes les heures (voir vercel.json → crons).
// Deux rappels par réservation : la veille à 18h (heure de Paris) et 2h avant.
// L'anti-doublon repose sur les colonnes bookings.reminder_eve_sent / _2h_sent.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const TZ = "Europe/Paris";

type Kind = "eve" | "2h";

interface BookingRow {
  id: string;
  notaire_id: string | null;
  notaire_nom: string | null;
  slot_label: string | null;
  dossier: string | null;
  modalite: string | null;
  client_nom: string | null;
  client_email: string | null;
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

// Composantes "horloge murale" Paris d'un instant donné.
function parisParts(d: Date): { y: number; mo: number; day: number; h: number; min: number } {
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    timeZone: TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
  const p: Record<string, string> = {};
  for (const part of fmt.formatToParts(d)) p[part.type] = part.value;
  return {
    y: Number(p.year),
    mo: Number(p.month) - 1,
    day: Number(p.day),
    h: Number(p.hour === "24" ? "0" : p.hour),
    min: Number(p.minute),
  };
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
      <img src="${SITE}/logo-notaires-io.png" alt="Notaires.io" style="height:32px;margin-bottom:32px" />
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

export async function GET(req: NextRequest) {
  // Authentification du cron : Vercel envoie « Authorization: Bearer $CRON_SECRET ».
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, notaire_id, notaire_nom, slot_label, dossier, modalite, client_nom, client_email, created_at, reminder_eve_sent, reminder_2h_sent",
    )
    .eq("status", "confirmé")
    .not("client_email", "is", null)
    .or("reminder_eve_sent.eq.false,reminder_2h_sent.eq.false");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as BookingRow[];

  // Préférences de rappel par notaire (interrupteurs du dashboard).
  const notaireIds = [...new Set(rows.map((r) => r.notaire_id).filter(Boolean))] as string[];
  const prefs: Record<string, { eve: boolean; h2: boolean }> = {};
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
  }

  const now = Date.now();
  const nowParis = parisParts(new Date());
  const nowMs = Date.UTC(nowParis.y, nowParis.mo, nowParis.day, nowParis.h, nowParis.min);

  let sentEve = 0;
  let sent2h = 0;

  for (const b of rows) {
    if (!b.client_email) continue;
    const rdvMs = rdvWallMs(b.slot_label ?? "", b.created_at);
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
      }
    }
  }

  return NextResponse.json({
    success: true,
    scanned: rows.length,
    sentEve,
    sent2h,
    ranAt: new Date(now).toISOString(),
  });
}
