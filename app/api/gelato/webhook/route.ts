import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Webhook de l'imprimeur : suit la vie d'une commande après son envoi
// (en production, expédiée, numéro de suivi) et met à jour l'espace notaire.
//
// Configuration : dans le tableau de bord Gelato → Developer → Webhooks,
// déclarer l'URL  https://notaires.io/api/gelato/webhook?token=<GELATO_WEBHOOK_SECRET>
// Gelato ne signe pas ses appels : le jeton dans l'URL est le seul contrôle
// possible, il doit donc être long et aléatoire.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

type GelatoEvent = {
  event?: string;
  orderReferenceId?: string;
  orderId?: string;
  fulfillmentStatus?: string;
  items?: {
    fulfillments?: { trackingUrl?: string; trackingCode?: string }[];
  }[];
};

export async function POST(req: NextRequest) {
  const attendu = process.env.GELATO_WEBHOOK_SECRET;
  if (!attendu) {
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 500 });
  }
  if (req.nextUrl.searchParams.get("token") !== attendu) {
    return NextResponse.json({ error: "Jeton invalide" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as GelatoEvent | null;
  if (!body) return NextResponse.json({ error: "Corps illisible" }, { status: 400 });

  // orderReferenceId est l'identifiant de notre propre ligne card_orders,
  // transmis à la création de la commande.
  const reference = body.orderReferenceId;
  if (!reference) {
    return NextResponse.json({ received: true, ignored: "sans référence" });
  }

  const suivi = body.items
    ?.flatMap((i) => i.fulfillments ?? [])
    .map((f) => f.trackingUrl)
    .find(Boolean);

  const maj: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.fulfillmentStatus) maj.status = body.fulfillmentStatus;
  if (suivi) maj.tracking_url = suivi;

  const supabase = getSupabase();
  const { error } = await supabase.from("card_orders").update(maj).eq("id", reference);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true, reference, status: maj.status ?? null });
}
