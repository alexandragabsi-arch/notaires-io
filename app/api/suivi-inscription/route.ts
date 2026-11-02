import { NextRequest, NextResponse } from "next/server";
import { limiter, ipDe } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/notaire-email-serveur";
import { EVENEMENTS_INSCRIPTION, PARCOURS_INSCRIPTION } from "@/lib/suivi-inscription";

// POST /api/suivi-inscription — enregistre une étape franchie sur /inscription.
//
// Route publique : seuls un identifiant de visite et deux valeurs de liste
// fermée sont acceptés. Le pays vient de l'en-tête Vercel ; l'adresse IP ne
// sert qu'à la limite de débit et n'est pas stockée.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  const limite = limiter(`suivi-inscription:${ipDe(req)}`, 30, 60_000);
  if (!limite.autorise) return new NextResponse(null, { status: 429 });

  const body = (await req.json().catch(() => null)) as
    | { sessionId?: unknown; evenement?: unknown; parcours?: unknown }
    | null;
  const { sessionId, evenement, parcours } = body ?? {};

  if (
    typeof sessionId !== "string" ||
    !UUID.test(sessionId) ||
    !(EVENEMENTS_INSCRIPTION as readonly unknown[]).includes(evenement) ||
    !(PARCOURS_INSCRIPTION as readonly unknown[]).includes(parcours)
  ) {
    return new NextResponse(null, { status: 400 });
  }

  const pays = req.headers.get("x-vercel-ip-country");

  // Un doublon est ignoré. Une panne du suivi ne doit jamais gêner l'inscription :
  // on la journalise et le navigateur n'attend de toute façon pas la réponse.
  const { error } = await supabaseAdmin().from("inscription_events").upsert(
    {
      session_id: sessionId,
      evenement,
      parcours,
      pays: pays && /^[A-Z]{2}$/.test(pays) ? pays : null,
    },
    { onConflict: "session_id,evenement", ignoreDuplicates: true },
  );
  if (error) console.error("[suivi-inscription]", error.message);

  return new NextResponse(null, { status: 204 });
}
