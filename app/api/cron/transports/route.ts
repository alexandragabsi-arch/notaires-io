import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/notaire-email-serveur";
import { geocoder, arretsAutour } from "@/lib/transports-osm";

// Cron horaire — transports à proximité des fiches vérifiées.
//
// `verifie` passe à true dans la base (trigger sur la confirmation d'e-mail),
// sans passer par le code de l'app : on ne peut donc pas calculer les arrêts
// « au moment » de la vérification. Ce cron rattrape chaque heure les fiches
// vérifiées dont `transports` est null — nouvelles inscriptions, adresse
// modifiée (remise à null par trigger) ou Overpass muet la fois précédente.
//
// Peu de fiches par passage, une pause entre chaque : Overpass est bénévole,
// et une adresse IP s'est déjà fait bloquer pour l'avoir trop sollicité.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

const PAR_PASSAGE = 3;
const PAUSE = 5000;
const BUDGET_MS = 200_000; // marge sous maxDuration

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
  const { data: fiches, error } = await db
    .from("notaire_profiles")
    .select("id, address, city")
    .eq("verifie", true)
    .is("transports", null)
    .not("address", "is", null)
    .limit(PAR_PASSAGE);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const debut = Date.now();
  const bilan = { remplies: 0, echecs: 0 };
  for (const n of fiches ?? []) {
    if (Date.now() - debut > BUDGET_MS) break;
    const p = await geocoder(`${n.address}, ${n.city ?? ""}`).catch(() => null);
    // Échec : la fiche reste à null et sera reprise au prochain passage.
    const arrets = p ? await arretsAutour(p[0], p[1], 25_000) : null;
    if (arrets === null) {
      bilan.echecs++;
    } else {
      const { error: e } = await db.from("notaire_profiles").update({ transports: arrets }).eq("id", n.id);
      if (e) bilan.echecs++;
      else bilan.remplies++;
    }
    await new Promise((r) => setTimeout(r, PAUSE));
  }

  return NextResponse.json({ ok: true, ...bilan });
}
