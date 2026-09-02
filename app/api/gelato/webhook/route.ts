import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, emailLayout, emailButton, SITE, ADMIN_EMAIL } from "@/lib/email";

// Webhook de l'imprimeur : suit la vie d'une commande après son envoi
// (en production, expédiée, numéro de suivi), met à jour l'espace notaire et
// prévient le notaire — puis contact@notaires.io — dès que le colis part.
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

type Commande = {
  id: string;
  nom: string | null;
  etude: string | null;
  email: string | null;
  quantity: number | null;
  card_type: string | null;
  tracking_url: string | null;
  livraison: { destinataire?: string; rue?: string; codePostal?: string; ville?: string } | null;
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

  const supabase = getSupabase();

  // On lit l'état AVANT mise à jour : c'est le passage de « sans suivi » à
  // « avec suivi » qui déclenche l'e-mail, et lui seul. Gelato peut renvoyer
  // plusieurs fois le même événement, le client ne doit pas recevoir de doublon.
  const { data: avant } = await supabase
    .from("card_orders")
    .select("id, nom, etude, email, quantity, card_type, tracking_url, livraison")
    .eq("id", reference)
    .maybeSingle<Commande>();

  const maj: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.fulfillmentStatus) maj.status = body.fulfillmentStatus;
  if (suivi) maj.tracking_url = suivi;

  const { error } = await supabase.from("card_orders").update(maj).eq("id", reference);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const premierSuivi = Boolean(suivi) && !avant?.tracking_url;
  if (premierSuivi && avant) {
    await previenirExpedition(avant, suivi!);
  }

  return NextResponse.json({
    received: true,
    reference,
    status: maj.status ?? null,
    notified: premierSuivi,
  });
}

async function previenirExpedition(cmd: Commande, suivi: string) {
  const adresse = [cmd.livraison?.rue, `${cmd.livraison?.codePostal ?? ""} ${cmd.livraison?.ville ?? ""}`.trim()]
    .filter(Boolean)
    .join(", ");
  const quoi = `${cmd.quantity ?? ""} cartes${cmd.card_type ? ` ${cmd.card_type}` : ""}`.trim();

  if (cmd.email) {
    await sendEmail(
      cmd.email,
      "Vos cartes de visite sont en route 📦",
      emailLayout(`
        <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;color:#1a1a2e">
          Vos cartes sont expédiées
        </h1>
        <p style="color:#5a6a8a;margin-bottom:24px">
          ${cmd.nom ? `Bonjour ${cmd.nom},` : "Bonjour,"} vos ${quoi} viennent de quitter
          l'imprimerie. Livraison prévue sous 2 à 6 jours ouvrés.
        </p>
        ${adresse ? `<div style="background:#f8f9fa;border-radius:12px;padding:20px;margin-bottom:24px"><div style="font-size:13px;font-weight:700;color:#1a1a2e;margin-bottom:4px">Livraison</div><div style="font-size:14px;color:#5a6a8a">${adresse}</div></div>` : ""}
        <div style="margin-bottom:24px">${emailButton(suivi, "Suivre mon colis")}</div>
        <p style="font-size:13px;color:#5a6a8a">
          Pensez à vérifier que le QR code de vos cartes ouvre bien votre page de
          rendez-vous — un simple scan avec l'appareil photo de votre téléphone suffit.
        </p>
      `),
    );
  }

  await sendEmail(
    ADMIN_EMAIL,
    `[Notaires.io] Cartes expédiées — ${cmd.etude || cmd.nom || "commande"}`,
    emailLayout(`
      <h2 style="font-size:18px;font-weight:700;margin-bottom:16px">Commande de cartes expédiée</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left">
        <tr><td style="padding:6px 0;color:#5a6a8a;width:140px">Notaire</td><td style="font-weight:600">${cmd.nom || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#5a6a8a">Étude</td><td>${cmd.etude || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#5a6a8a">Commande</td><td>${quoi || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#5a6a8a">E-mail</td><td>${cmd.email || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#5a6a8a">Livraison</td><td>${adresse || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#5a6a8a">Suivi</td><td><a href="${suivi}" style="color:#4980E6">${suivi}</a></td></tr>
      </table>
      <p style="font-size:13px;color:#5a6a8a;margin-top:16px">
        Référence interne : ${cmd.id} · <a href="${SITE}/espace-notaire" style="color:#4980E6">espace notaire</a>
      </p>
    `),
  );
}
