import { NextRequest, NextResponse } from "next/server";
import { limiter, ipDe, piegeDeclenche, reponsePiege } from "@/lib/rate-limit";

/**
 * POST /api/subscribe
 * Crée une session Stripe Checkout en mode "subscription" avec :
 *   - Phase promo : 99 € HT/mois pendant 3 mois
 *   - Phase standard : 119 € HT/mois ensuite (via coupon -20 € × 3 mois)
 *
 * Body JSON attendu :
 *   { notaire: string, etude: string, email: string }
 */

const STRIPE_API = "https://api.stripe.com/v1";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://notaires.io";

function toForm(obj: Record<string, string>): string {
  return Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

async function stripePost(path: string, params: Record<string, string>, secret: string) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: toForm(params),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  const limite = limiter(`subscribe:${ipDe(req)}`, 5, 60_000);
  if (!limite.autorise) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez dans un instant." },
      { status: 429, headers: { "Retry-After": String(limite.attendreSec) } },
    );
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 500 });
  }

  const body = await req.json() as {
    notaire?: string;
    etude?: string;
    crpcen?: string;
    email?: string;
    notaireId?: string;
    userId?: string;
  };

  // Champ piège : voir /api/booking. Réponse volontairement anodine.
  if (piegeDeclenche(body)) return reponsePiege();

  // ── 1. Créer un coupon : -20 € pendant 3 mois (99€ → revient à 99€ sur 119€ base) ──
  // On utilise un coupon idempotent (même id = pas de doublon dans Stripe)
  const couponId = "promo-3mois-99ht";
  await stripePost("/coupons", {
    id: couponId,
    amount_off: "2000",        // 20 € en centimes
    currency: "eur",
    duration: "repeating",
    duration_in_months: "3",
    name: "Offre lancement 3 mois à 99€ HT",
  }, secret).catch(() => null); // Ignore si le coupon existe déjà

  // ── 2. Créer la session Checkout abonnement à 119 € HT/mois ─────────────────
  const params: Record<string, string> = {
    mode: "subscription",

    // Prix de base : 119 € HT/mois (inline, pas besoin de Price pré-créé)
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": "11900",  // 119 € en centimes
    "line_items[0][price_data][recurring][interval]": "month",
    "line_items[0][price_data][product_data][name]": "Notaires.io — Abonnement mensuel HT",
    "line_items[0][price_data][product_data][description]":
      "Prix HT · TVA 20% en sus · Plateforme de prise de RDV notariale · Profil, agenda en ligne, visio, rappels automatiques",
    "line_items[0][quantity]": "1",

    // Coupon promo 3 mois appliqué
    "discounts[0][coupon]": couponId,

    // Métadonnées (sur l'abonnement ET sur la session, pour le webhook)
    "subscription_data[metadata][notaire]": body.notaire ?? "",
    "subscription_data[metadata][etude]": body.etude ?? "",
    "subscription_data[metadata][crpcen]": body.crpcen ?? "",
    "metadata[notaire]": body.notaire ?? "",
    "metadata[etude]": body.etude ?? "",
    "metadata[crpcen]": body.crpcen ?? "",
    "metadata[notaireId]": body.notaireId ?? "",
    "metadata[userId]": body.userId ?? "",

    // Redirection
    success_url: `${SITE_URL}/espace-notaire?bienvenue=1`,
    cancel_url: `${SITE_URL}/notaires#tarifs`,

    // Pré-remplir l'email si fourni
    ...(body.email ? { customer_email: body.email } : {}),

    // TVA 20% calculée automatiquement par Stripe Tax
    "automatic_tax[enabled]": "true",

    // Checkbox consentement prélèvement automatique sur cette carte
    "consent_collection[payment_method_reuse_agreement][position]": "auto",
    "consent_collection[terms_of_service]": "required",
    "custom_text[terms_of_service_acceptance][message]":
      "J'accepte le prélèvement mensuel automatique sur cette carte conformément aux [CGV](https://notaires.io/cgv).",

    // Afficher le récap prix
    "payment_method_types[0]": "card",
    locale: "fr",
  };

  const session = await stripePost("/checkout/sessions", params, secret) as {
    url?: string;
    error?: { message: string };
  };

  if (!session.url) {
    return NextResponse.json(
      { error: session.error?.message ?? "Erreur Stripe" },
      { status: 400 }
    );
  }

  return NextResponse.json({ url: session.url });
}
