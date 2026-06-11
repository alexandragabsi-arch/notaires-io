import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Liste les factures Stripe d'un notaire pour son espace.
// Sécurité : le client envoie son jeton Supabase (Authorization: Bearer <access_token>).
// On vérifie que le notaire demandé appartient bien à l'utilisateur connecté
// AVANT d'appeler Stripe — un notaire ne peut voir que ses propres factures.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STRIPE_API = "https://api.stripe.com/v1";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface StripeInvoice {
  id: string;
  number: string | null;
  created: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  status: string | null;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
}

export async function GET(req: NextRequest) {
  const notaireId = req.nextUrl.searchParams.get("notaireId");
  if (!notaireId) {
    return NextResponse.json({ error: "notaireId manquant" }, { status: 400 });
  }

  // 1. Authentifie l'utilisateur via son jeton Supabase
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  const uid = userData?.user?.id;
  if (userErr || !uid) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }

  // 2. Vérifie que ce notaire appartient à l'utilisateur + récupère le client Stripe
  const { data: profile } = await supabase
    .from("notaire_profiles")
    .select("user_id, stripe_customer_id")
    .eq("id", notaireId)
    .maybeSingle();

  if (!profile || profile.user_id !== uid) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const customerId = profile.stripe_customer_id as string | null;
  if (!customerId) {
    // Pas encore de client Stripe rattaché (abonnement non finalisé) → liste vide.
    return NextResponse.json({ invoices: [] });
  }

  // 3. Liste les factures Stripe du client
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 500 });
  }
  const res = await fetch(
    `${STRIPE_API}/invoices?customer=${encodeURIComponent(customerId)}&limit=24`,
    { headers: { Authorization: `Bearer ${secret}` } },
  );
  const json = (await res.json()) as { data?: StripeInvoice[]; error?: { message: string } };
  if (!res.ok) {
    return NextResponse.json(
      { error: json.error?.message ?? "Erreur Stripe" },
      { status: 502 },
    );
  }

  const invoices = (json.data ?? []).map((inv) => ({
    id: inv.id,
    number: inv.number,
    created: inv.created * 1000, // → ms
    amount: inv.amount_paid || inv.amount_due,
    currency: inv.currency,
    status: inv.status,
    url: inv.hosted_invoice_url,
    pdf: inv.invoice_pdf,
  }));

  return NextResponse.json({ invoices });
}
