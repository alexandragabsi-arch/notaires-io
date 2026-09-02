import { NextRequest, NextResponse } from "next/server";
import { prixCents, getCardType, formatPrix, productUid } from "@/lib/cartes";
import { gelatoOrderType } from "@/lib/gelato";

// Crée la session de paiement pour une commande de cartes de visite.
// Appel direct à l'API Stripe REST — pas de SDK nécessaire.
// Requiert STRIPE_SECRET_KEY dans les variables d'environnement Vercel.
//
// Le montant est TOUJOURS recalculé ici à partir du modèle et de la quantité :
// un prix envoyé par le navigateur serait trivialement modifiable.

const STRIPE_API = "https://api.stripe.com/v1/checkout/sessions";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://notaires.io";

const CP = /^\d{5}$/;

function toForm(obj: Record<string, string>): string {
  return Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

type Corps = {
  cardType: string;
  quantity: number;
  notaireId: string;
  // Ce qui est imprimé sur la carte
  nom: string;
  etude: string;
  rue: string;
  codePostal: string;
  ville: string;
  tel: string;
  email: string;
  // Adresse de livraison si elle diffère de celle de l'étude
  livraisonDestinataire?: string;
  livraisonRue?: string;
  livraisonCodePostal?: string;
  livraisonVille?: string;
};

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe non configuré (STRIPE_SECRET_KEY manquant)" },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => null)) as Corps | null;
  if (!body) return NextResponse.json({ error: "Requête illisible" }, { status: 400 });

  const type = getCardType(body.cardType);
  const total = prixCents(body.cardType, body.quantity);
  if (!type || total === null) {
    return NextResponse.json({ error: "Modèle ou quantité invalide" }, { status: 400 });
  }

  // Garde-fou : tant que l'intégration imprimeur n'est pas passée en production
  // (GELATO_ORDER_TYPE=order), une commande payée partirait en brouillon et ne
  // serait jamais imprimée. On refuse avant d'encaisser. Idem si la référence
  // produit venait à manquer.
  if (gelatoOrderType() !== "order" || !productUid(type.id)) {
    return NextResponse.json(
      { error: "La commande de cartes est momentanément indisponible. Réessayez plus tard." },
      { status: 503 },
    );
  }

  if (!body.notaireId) {
    return NextResponse.json(
      { error: "Connectez-vous à votre espace notaire pour commander vos cartes." },
      { status: 401 },
    );
  }

  // Champs indispensables à l'impression et à l'expédition
  const manquants = (["nom", "etude", "rue", "codePostal", "ville", "email"] as const).filter(
    (k) => !String(body[k] ?? "").trim(),
  );
  if (manquants.length > 0) {
    return NextResponse.json(
      { error: `Champs manquants : ${manquants.join(", ")}` },
      { status: 400 },
    );
  }
  if (!CP.test(body.codePostal)) {
    return NextResponse.json({ error: "Code postal invalide" }, { status: 400 });
  }

  // Adresse de livraison : celle de l'étude par défaut
  const livraisonRenseignee = Boolean(
    body.livraisonRue && body.livraisonCodePostal && body.livraisonVille,
  );
  const livraison = livraisonRenseignee
    ? {
        destinataire: body.livraisonDestinataire?.trim() || body.etude,
        rue: body.livraisonRue!.trim(),
        codePostal: body.livraisonCodePostal!.trim(),
        ville: body.livraisonVille!.trim(),
      }
    : {
        destinataire: body.etude,
        rue: body.rue,
        codePostal: body.codePostal,
        ville: body.ville,
      };

  if (!CP.test(livraison.codePostal)) {
    return NextResponse.json({ error: "Code postal de livraison invalide" }, { status: 400 });
  }

  const params = toForm({
    mode: "payment",
    customer_email: body.email,
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(total),
    "line_items[0][price_data][product_data][name]":
      `Cartes de visite ${type.label} — ${body.quantity} exemplaires`,
    "line_items[0][price_data][product_data][description]":
      `${type.grammage} · ${type.finish} · QR code de prise de rendez-vous · livraison incluse`,
    "line_items[0][quantity]": "1",

    // Métadonnées reprises telles quelles par le webhook pour fabriquer le PDF
    // et passer la commande à l'imprimeur.
    "metadata[type]": "cartes",
    "metadata[notaireId]": body.notaireId,
    "metadata[cardType]": type.id,
    "metadata[quantity]": String(body.quantity),
    "metadata[nom]": body.nom,
    "metadata[etude]": body.etude,
    "metadata[rue]": body.rue,
    "metadata[codePostal]": body.codePostal,
    "metadata[ville]": body.ville,
    "metadata[tel]": body.tel ?? "",
    "metadata[email]": body.email,
    "metadata[livDestinataire]": livraison.destinataire,
    "metadata[livRue]": livraison.rue,
    "metadata[livCodePostal]": livraison.codePostal,
    "metadata[livVille]": livraison.ville,

    success_url: `${SITE_URL}/espace-notaire?commande=ok`,
    cancel_url: `${SITE_URL}/notaires/cartes`,
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

  return NextResponse.json({ url: session.url, total: formatPrix(total) });
}
