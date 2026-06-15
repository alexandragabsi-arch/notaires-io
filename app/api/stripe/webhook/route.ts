import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, emailLayout, emailButton, SITE, ADMIN_EMAIL } from "@/lib/email";

// Client Supabase créé à la demande (pas au chargement du module) pour éviter
// que le build n'échoue si une variable d'env manque au moment de la compilation.
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// Webhook Stripe : envoie les e-mails APRÈS confirmation du paiement.
// C'est le seul endroit fiable pour confirmer un achat (ni /api/subscribe ni
// /api/checkout ne savent si le paiement a réellement abouti).
//
// Couvre deux flux :
//   - mode "subscription" → abonnement notaire (bienvenue + notif admin)
//   - mode "payment"      → commande de cartes physiques (confirmation + notif admin à expédier)
//
// Configuration requise :
//   1. Dashboard Stripe → Developers → Webhooks → add endpoint
//      URL : https://notaires.io/api/stripe/webhook  · event : checkout.session.completed
//   2. Copier le "Signing secret" (whsec_…) dans STRIPE_WEBHOOK_SECRET (Vercel).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface StripeSession {
  mode?: string;
  customer?: string | null;
  customer_email?: string | null;
  customer_details?: { email?: string | null; name?: string | null } | null;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: Record<string, string> | null;
}

// Vérifie la signature Stripe (HMAC-SHA256 de `${t}.${rawBody}`) sans SDK.
function verifyStripeSignature(raw: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=").map((s) => s.trim()) as [string, string]),
  );
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  // Tolérance anti-rejeu : 5 minutes
  const age = Math.abs(Date.now() / 1000 - Number(t));
  if (!Number.isFinite(age) || age > 300) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${t}.${raw}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}

function formatAmount(cents?: number | null, currency?: string | null): string {
  if (cents == null) return "";
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: (currency || "eur").toUpperCase(),
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} €`;
  }
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();

  // Sécurité : sans secret configuré, on refuse (sinon endpoint falsifiable).
  if (!secret) {
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 500 });
  }
  if (!verifyStripeSignature(raw, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: StripeSession } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Payload illisible" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // On accuse réception des autres événements sans rien faire.
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const s = event.data?.object ?? {};
  const email = s.customer_details?.email || s.customer_email || null;
  const name = s.customer_details?.name || "";
  const meta = s.metadata ?? {};
  const amount = formatAmount(s.amount_total, s.currency);

  if (s.mode === "subscription") {
    // ── Abonnement notaire ──────────────────────────────────────────────────
    // Lie le compte notaire au client Stripe → factures visibles dans l'espace.
    const customerId = typeof s.customer === "string" ? s.customer : null;
    if (customerId && meta.notaireId) {
      await supabase
        .from("notaire_profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", meta.notaireId);
    }
    if (email) {
      await sendEmail(
        email,
        "Bienvenue sur Notaires.io — votre abonnement est actif ✓",
        emailLayout(`
          <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;color:#1a1a2e">
            Bienvenue sur Notaires.io 🎉
          </h1>
          <p style="color:#5a6a8a;margin-bottom:24px">
            ${name ? `Bonjour ${name},` : "Bonjour,"} votre abonnement est confirmé.
            Votre profil, votre agenda en ligne, la visio et les rappels automatiques
            sont désormais actifs.
          </p>
          <div style="margin-bottom:24px">${emailButton(`${SITE}/espace-notaire`, "Accéder à mon tableau de bord")}</div>
          <p style="font-size:13px;color:#5a6a8a">
            Une question ? Répondez simplement à cet e-mail.
          </p>
        `),
      );
    }
    await sendEmail(
      ADMIN_EMAIL,
      `[Notaires.io] Nouvel abonnement notaire${amount ? ` — ${amount}/mois` : ""}`,
      emailLayout(`
        <h2 style="font-size:18px;font-weight:700;margin-bottom:16px">Nouvel abonnement</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left">
          <tr><td style="padding:6px 0;color:#5a6a8a;width:140px">Notaire</td><td style="font-weight:600">${meta.notaire || name || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#5a6a8a">Étude</td><td>${meta.etude || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#5a6a8a">CRPCEN</td><td>${meta.crpcen || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#5a6a8a">Email</td><td>${email || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#5a6a8a">Montant</td><td>${amount || "—"}</td></tr>
        </table>
      `),
    );
    return NextResponse.json({ received: true, handled: "subscription" });
  }

  if (s.mode === "payment") {
    // ── Commande de cartes physiques ────────────────────────────────────────
    if (email) {
      await sendEmail(
        email,
        "Votre commande de cartes Notaires.io est confirmée ✓",
        emailLayout(`
          <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;color:#1a1a2e">
            Commande confirmée ✓
          </h1>
          <p style="color:#5a6a8a;margin-bottom:24px">
            ${name ? `Bonjour ${name},` : "Bonjour,"} merci pour votre commande
            ${amount ? `(${amount})` : ""}. Vos cartes seront imprimées et expédiées
            à l'adresse indiquée.
          </p>
          ${meta.livraison ? `<div style="background:#f8f9fa;border-radius:12px;padding:20px;margin-bottom:24px"><div style="font-size:13px;font-weight:700;color:#1a1a2e;margin-bottom:4px">Livraison</div><div style="font-size:14px;color:#5a6a8a">${meta.livraison}</div></div>` : ""}
        `),
      );
    }
    await sendEmail(
      ADMIN_EMAIL,
      `[Notaires.io] Commande de cartes à expédier${amount ? ` — ${amount}` : ""}`,
      emailLayout(`
        <h2 style="font-size:18px;font-weight:700;margin-bottom:16px">Commande de cartes</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left">
          <tr><td style="padding:6px 0;color:#5a6a8a;width:140px">Notaire</td><td style="font-weight:600">${meta.notaire || name || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#5a6a8a">Étude</td><td>${meta.etude || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#5a6a8a">Modèle</td><td>${meta.cardType || "—"} × ${meta.quantity || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#5a6a8a">Montant</td><td>${amount || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#5a6a8a">Email</td><td>${email || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#5a6a8a">Livraison</td><td>${meta.livraison || "—"}</td></tr>
        </table>
      `),
    );
    return NextResponse.json({ received: true, handled: "payment" });
  }

  return NextResponse.json({ received: true, handled: "none" });
}
