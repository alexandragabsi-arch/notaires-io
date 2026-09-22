import { NextRequest, NextResponse } from "next/server";
import { limiter, ipDe, piegeDeclenche, reponsePiege } from "@/lib/rate-limit";
import { compteEstNotaire, identifierNotaire, supabaseAdmin, MESSAGE_EMAIL_NON_NOTAIRE } from "@/lib/notaire-email-serveur";
import { estEssaiSansCarte, dateFr } from "@/lib/offres";

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
    mode?: string;
  };

  // Champ piège : voir /api/booking. Réponse volontairement anodine.
  if (piegeDeclenche(body)) return reponsePiege("subscribe");

  // Valeurs de la session : inscription (par défaut) ou ajout de carte.
  let trialEnd: number | null = finEssaiUnix();
  let meta = {
    notaire: body.notaire ?? "",
    etude: body.etude ?? "",
    crpcen: body.crpcen ?? "",
    notaireId: body.notaireId ?? "",
    userId: body.userId ?? "",
    email: body.email ?? "",
  };
  let successUrl = `${SITE_URL}/espace-notaire?bienvenue=1`;
  let cancelUrl = `${SITE_URL}/notaires#tarifs`;
  let ajoutCarte = false;

  if (body.mode === "carte") {
    // ── Ajout de carte depuis l'espace notaire (essai sans carte, ou expiré) ─
    // Notaire connecté obligatoire ; tout est relu en base, rien n'est pris
    // du navigateur (ni la fiche, ni la date de fin d'essai).
    const db = supabaseAdmin();
    const user = await identifierNotaire(req, db, undefined);
    if (!user) {
      return NextResponse.json({ error: "Connectez-vous à votre espace notaire." }, { status: 401 });
    }
    const { data: fiche } = await db
      .from("notaire_profiles")
      .select("id, name, office_name, crpcen, subscription_status, subscription_renewal_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!fiche) {
      return NextResponse.json({ error: "Aucune fiche rattachée à votre compte." }, { status: 404 });
    }
    if (fiche.subscription_status === "actif" || fiche.subscription_status === "active") {
      return NextResponse.json({ error: "Votre abonnement est déjà actif." }, { status: 409 });
    }
    // L'essai en cours va jusqu'à son terme : premier prélèvement à cette date.
    // Stripe exige une fin d'essai à plus de 48 h ; en deçà (ou essai expiré),
    // le premier mois est prélevé tout de suite.
    const fin = fiche.subscription_renewal_at ? Date.parse(fiche.subscription_renewal_at) / 1000 : 0;
    trialEnd = estEssaiSansCarte(fiche.subscription_status) && fin > Date.now() / 1000 + 49 * 3600
      ? Math.floor(fin)
      : null;
    meta = {
      notaire: fiche.name ?? "",
      etude: fiche.office_name ?? "",
      crpcen: fiche.crpcen ?? "",
      notaireId: fiche.id,
      userId: user.id,
      email: user.email ?? "",
    };
    successUrl = `${SITE_URL}/espace-notaire?carte=ok`;
    cancelUrl = `${SITE_URL}/espace-notaire`;
    ajoutCarte = true;
  } else if (!(await compteEstNotaire(body.userId))) {
    // Domaine notarial revérifié côté serveur sur l'e-mail réel du compte.
    return NextResponse.json({ error: MESSAGE_EMAIL_NON_NOTAIRE }, { status: 403 });
  }

  // ── Créer la session Checkout ────────────────────────────────────────────
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

    // Période offerte : rien n'est débité avant cette date. Sans moyen de
    // paiement valide à la fin, l'abonnement s'annule (filet de sécurité : la
    // carte est de toute façon collectée ci-dessous).
    ...(trialEnd
      ? {
          "subscription_data[trial_end]": String(trialEnd),
          "subscription_data[trial_settings][end_behavior][missing_payment_method]": "cancel",
        }
      : {}),
    // Carte demandée dès l'inscription, malgré un montant dû de 0 €.
    payment_method_collection: "always",

    // Métadonnées (sur l'abonnement ET sur la session, pour le webhook)
    "subscription_data[metadata][notaire]": meta.notaire,
    "subscription_data[metadata][etude]": meta.etude,
    "subscription_data[metadata][crpcen]": meta.crpcen,
    "metadata[notaire]": meta.notaire,
    "metadata[etude]": meta.etude,
    "metadata[crpcen]": meta.crpcen,
    "subscription_data[metadata][formule]": formule,
    "metadata[formule]": formule,
    "subscription_data[metadata][finEssai]": trialEnd ? String(trialEnd) : "",
    "metadata[finEssai]": trialEnd ? String(trialEnd) : "",
    "subscription_data[metadata][notaireId]": meta.notaireId,
    "metadata[notaireId]": meta.notaireId,
    "metadata[userId]": meta.userId,
    "metadata[ajoutCarte]": ajoutCarte ? "1" : "",

    // Redirection
    success_url: successUrl,
    cancel_url: cancelUrl,

    // Pré-remplir l'email si fourni
    ...(meta.email ? { customer_email: meta.email } : {}),

    // TVA 20% calculée automatiquement par Stripe Tax
    "automatic_tax[enabled]": "true",

    // Checkbox consentement prélèvement automatique sur cette carte
    "consent_collection[payment_method_reuse_agreement][position]": "auto",
    "consent_collection[terms_of_service]": "required",
    "custom_text[terms_of_service_acceptance][message]":
      trialEnd
        ? `Aucun débit aujourd'hui : le premier prélèvement aura lieu le ${dateFr(new Date(trialEnd * 1000).toISOString())}. J'accepte le prélèvement mensuel automatique de ${montant / 100} € HT (TVA en sus) sur cette carte à partir de cette date, conformément aux [CGV](https://notaires.io/cgv).`
        : `J'accepte le prélèvement mensuel automatique de ${montant / 100} € HT (TVA en sus) sur cette carte, à compter d'aujourd'hui, conformément aux [CGV](https://notaires.io/cgv).`,

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
