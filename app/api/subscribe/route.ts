import { NextRequest, NextResponse } from "next/server";
import { limiter, ipDe, piegeDeclenche, reponsePiege } from "@/lib/rate-limit";

/**
 * POST /api/subscribe
 * Crée une session Stripe Checkout en mode "subscription" avec :
 *   - Période d'essai : 2 mois offerts (aucun débit)
 *   - Puis 119 € HT/mois (99 € pour la formule « jeune notaire »),
 *     prélevé automatiquement
 *
 * La carte est demandée dès l'inscription (payment_method_collection: always) :
 * Stripe gère seul le rappel avant le premier débit et la bascule en payant.
 *
 * Body JSON attendu :
 *   { notaire: string, etude: string, email: string, formule?: "standard" | "jeune-pro" }
 */

const STRIPE_API = "https://api.stripe.com/v1";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://notaires.io";

function toForm(obj: Record<string, string>): string {
  return Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

/**
 * Formules d'abonnement. Le client n'envoie qu'un identifiant : le montant est
 * choisi ici. Accepter un prix transmis par le navigateur reviendrait à laisser
 * n'importe qui s'abonner à 1 €.
 *
 * « jeune-pro » est déclaratif — installé depuis moins de trois ans — et tracé
 * dans les métadonnées Stripe pour contrôle a posteriori.
 */
const FORMULES = {
  standard: {
    montant: 11900,
    nom: "Notaires.io — Abonnement mensuel HT",
  },
  "jeune-pro": {
    montant: 9900,
    nom: "Notaires.io — Abonnement jeune notaire HT",
  },
} as const;

type Formule = keyof typeof FORMULES;

/**
 * Fin de la période d'essai : 2 mois calendaires à compter d'aujourd'hui.
 * On n'utilise pas trial_period_days (60 jours ne font pas 2 mois selon les
 * mois traversés) — un notaire inscrit le 15 mars est débité le 15 mai.
 */
function finEssaiUnix(): number {
  const d = new Date();
  const jour = d.getDate();
  d.setMonth(d.getMonth() + 2);
  // Débordement (31 décembre + 2 mois → 3 mars) : on recale sur le dernier
  // jour du mois visé.
  if (d.getDate() !== jour) d.setDate(0);
  return Math.floor(d.getTime() / 1000);
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
    formule?: string;
  };

  // Champ piège : voir /api/booking. Réponse volontairement anodine.
  if (piegeDeclenche(body)) return reponsePiege("subscribe");

  // ── Créer la session Checkout : 2 mois offerts, puis le tarif de la formule ─
  const trialEnd = finEssaiUnix();
  const formule: Formule = body.formule === "jeune-pro" ? "jeune-pro" : "standard";
  const { montant, nom } = FORMULES[formule];
  const params: Record<string, string> = {
    mode: "subscription",

    // Prix de base : 119 € HT/mois (inline, pas besoin de Price pré-créé)
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(montant),
    "line_items[0][price_data][recurring][interval]": "month",
    "line_items[0][price_data][product_data][name]": nom,
    // Sans tax_behavior, Stripe traite le montant comme TTC et extrait la TVA
    // au lieu de l'ajouter : le prix annoncé HT devenait le total payé.
    "line_items[0][price_data][tax_behavior]": "exclusive",
    "line_items[0][price_data][product_data][description]":
      "Prix HT · TVA 20% en sus · Plateforme de prise de RDV notariale · Profil, agenda en ligne, visio, rappels automatiques",
    "line_items[0][quantity]": "1",

    // 2 mois offerts : rien n'est débité avant cette date.
    "subscription_data[trial_end]": String(trialEnd),
    // Sans moyen de paiement valide à la fin de l'essai, l'abonnement s'annule
    // (filet de sécurité : la carte est de toute façon collectée ci-dessous).
    "subscription_data[trial_settings][end_behavior][missing_payment_method]": "cancel",
    // Carte demandée dès l'inscription, malgré un montant dû de 0 €.
    payment_method_collection: "always",

    // Métadonnées (sur l'abonnement ET sur la session, pour le webhook)
    "subscription_data[metadata][notaire]": body.notaire ?? "",
    "subscription_data[metadata][etude]": body.etude ?? "",
    "subscription_data[metadata][crpcen]": body.crpcen ?? "",
    "metadata[notaire]": body.notaire ?? "",
    "metadata[etude]": body.etude ?? "",
    "metadata[crpcen]": body.crpcen ?? "",
    "subscription_data[metadata][formule]": formule,
    "metadata[formule]": formule,
    "subscription_data[metadata][finEssai]": String(trialEnd),
    "metadata[finEssai]": String(trialEnd),
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
      `Les 2 premiers mois sont offerts : aucun débit aujourd'hui. J'accepte le prélèvement mensuel automatique de ${montant / 100} € HT (TVA en sus) sur cette carte à l'issue de cette période, conformément aux [CGV](https://notaires.io/cgv).`,

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
