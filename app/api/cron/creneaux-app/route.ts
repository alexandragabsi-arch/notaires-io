import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/notaire-email-serveur";
import { lireDisponibilites, matriceAgenda, depuisMatrice, aujourdhuiParis } from "@/lib/disponibilites";

// Cron quotidien (peu après minuit à Paris) — créneaux lus par l'app iOS.
//
// L'app lit encore l'ancienne colonne `slot_matrix` (jour 0 = demain). Pour
// les notaires passés au nouvel éditeur, on la recalcule chaque nuit à partir
// de leurs disponibilités : les créneaux restent aux bonnes dates dans l'app
// au lieu de se décaler d'un jour. À retirer quand l'app lira `disponibilites`.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function bearerValide(header: string | null, secret: string): boolean {
  if (!header) return false;
  const attendu = Buffer.from(`Bearer ${secret}`);
  const recu = Buffer.from(header);
  if (attendu.length !== recu.length) return false;
  return crypto.timingSafeEqual(attendu, recu);
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "Cron non configuré" }, { status: 503 });
  if (!bearerValide(req.headers.get("authorization"), secret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const db = supabaseAdmin();

  // Fiches encore à l'ancienne saisie : passage au format daté (semaine type),
  // pour que leurs créneaux cessent de se décaler d'un jour chaque nuit.
  // L'app ne peut pas écrire `slot_matrix` (écritures réservées aux routes
  // serveur depuis le 22/09/2026) : rien n'est écrasé de son côté.
  const { data: anciennes } = await db
    .from("notaire_profiles")
    .select("id, slot_matrix")
    .is("disponibilites", null)
    .not("slot_matrix", "is", null);
  const demain = aujourdhuiParis();
  demain.setDate(demain.getDate() + 1);
  let converties = 0;
  for (const n of anciennes ?? []) {
    if (!Array.isArray(n.slot_matrix)) continue;
    const disponibilites = depuisMatrice(n.slot_matrix as string[][], demain);
    if (!disponibilites) continue;
    const { error: e } = await db.from("notaire_profiles").update({ disponibilites }).eq("id", n.id);
    if (e) console.error(`[creneaux-app] conversion ${n.id}:`, e.message);
    else converties++;
  }

  const { data, error } = await db
    .from("notaire_profiles")
    .select("id, disponibilites")
    .not("disponibilites", "is", null);
  if (error) {
    console.error("[creneaux-app] lecture impossible:", error.message);
    return NextResponse.json({ error: "Lecture impossible" }, { status: 500 });
  }

  let maj = 0;
  for (const n of data ?? []) {
    const disponibilites = lireDisponibilites(n.disponibilites);
    if (!disponibilites) continue;
    const { error: e } = await db
      .from("notaire_profiles")
      .update({ slot_matrix: matriceAgenda({ disponibilites }) })
      .eq("id", n.id);
    if (e) console.error(`[creneaux-app] ${n.id}:`, e.message);
    else maj++;
  }
  return NextResponse.json({ ok: true, notaires: maj, converties });
}
