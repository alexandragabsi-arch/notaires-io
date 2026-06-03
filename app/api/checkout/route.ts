import { NextRequest, NextResponse } from "next/server";

// Appel direct à l'API Stripe REST — pas de SDK nécessaire.
// Requiert STRIPE_SECRET_KEY dans les variables d'environnement Vercel.

const STRIPE_API = "https://api.stripe.com/v1/checkout/sessions";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://notaires.io";

function toForm(obj: Record<string, string>): string {
  return Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe non configuré (STRIPE_SECRET_KEY manquant)" },
      { status: 500 },
    );
  }

  const body = await req.json() as {
    cardType: "standard" | "premium";
    quantity: number;
    totalCents: number;
    productName: string;
    productDesc: string;
    // métadonnées notaire + livraison (visibles dans le dashboard Stripe)
    notaire: string;
    etude: string;
    deliveryNom: string;
    deliveryAdresse: string;
    deliveryCp: string;
    deliveryVille: string;
  };

  const params = toForm({
    mode: "payment",
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(body.totalCents),
    "line_items[0][price_data][product_data][name]": body.productName,
    "line_items[0][price_data][product_data][description]": body.productDesc,
    "line_items[0][quantity]": "1",
    "metadata[notaire]": body.notaire,
    "metadata[etude]": body.etude,
    "metadata[cardType]": body.cardType,
    "metadata[quantity]": String(body.quantity),
    "metadata[livraison]": [
      body.deliveryNom,
      body.deliveryAdresse,
      body.deliveryCp,
      body.deliveryVille,
    ]
      .filter(Boolean)
      .join(", "),
    success_url: `${SITE_URL}/notaires?commande=ok`,
    cancel_url: `${SITE_URL}/notaires#cartes`,
  });

  const res = await fetch(STRIPE_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const session = (await res.json()) as { url?: string; error?: { message: string } };

  if (!res.ok || !session.url) {
    return NextResponse.json(
      { error: session.error?.message ?? "Erreur Stripe" },
      { status: 400 },
    );
  }

  return NextResponse.json({ url: session.url });
}
