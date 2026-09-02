import { createClient } from "@supabase/supabase-js";
import { genererCartePdf } from "@/lib/carte-pdf";
import { creerCommandeGelato, decouperNom } from "@/lib/gelato";
import { productUid, getCardType, type CardType } from "@/lib/cartes";

// Orchestration d'une commande de cartes, déclenchée par le webhook Stripe
// une fois le paiement confirmé — jamais depuis le navigateur.
//
//   paiement confirmé → PDF print-ready → dépôt Supabase Storage
//   → commande chez l'imprimeur → suivi enregistré en base

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://notaires.io";
const BUCKET = "cartes";
/** Durée de validité du lien remis à l'imprimeur (30 jours). */
const SIGNED_URL_TTL = 60 * 60 * 24 * 30;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export type MetaCommande = Record<string, string>;

export type ResultatCommande =
  | { ok: true; orderId: string; gelatoOrderId: string; orderType: string; deja?: boolean }
  | { ok: false; error: string; orderId?: string };

export async function traiterCommandeCartes(
  sessionId: string,
  meta: MetaCommande,
  amountCents: number,
): Promise<ResultatCommande> {
  const supabase = getSupabase();

  const cardType = meta.cardType as CardType;
  const type = getCardType(cardType);
  const quantity = Number(meta.quantity);
  if (!type || !Number.isFinite(quantity) || quantity <= 0) {
    return { ok: false, error: "Modèle ou quantité illisible dans les métadonnées" };
  }

  const livraison = {
    destinataire: meta.livDestinataire || meta.etude,
    rue: meta.livRue || meta.rue,
    codePostal: meta.livCodePostal || meta.codePostal,
    ville: meta.livVille || meta.ville,
  };

  // 1. Idempotence — Stripe rejoue les webhooks, on ne commande qu'une fois.
  const { data: existante } = await supabase
    .from("card_orders")
    .select("id, gelato_order_id, gelato_order_type")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (existante?.gelato_order_id) {
    return {
      ok: true,
      deja: true,
      orderId: existante.id,
      gelatoOrderId: existante.gelato_order_id,
      orderType: existante.gelato_order_type ?? "",
    };
  }

  // 2. Trace la commande avant tout appel externe : si la suite échoue, elle
  //    reste visible et rejouable au lieu de disparaître.
  let orderId = existante?.id as string | undefined;
  if (!orderId) {
    const { data: creee, error: erreurInsert } = await supabase
      .from("card_orders")
      .insert({
        notaire_id: meta.notaireId,
        stripe_session_id: sessionId,
        card_type: cardType,
        quantity,
        amount_cents: amountCents,
        nom: meta.nom,
        etude: meta.etude,
        livraison,
        status: "paid",
      })
      .select("id")
      .single();

    if (erreurInsert || !creee) {
      return { ok: false, error: `Enregistrement impossible : ${erreurInsert?.message ?? "inconnu"}` };
    }
    orderId = creee.id;
  }

  const echec = async (message: string): Promise<ResultatCommande> => {
    await supabase
      .from("card_orders")
      .update({ status: "error", error: message, updated_at: new Date().toISOString() })
      .eq("id", orderId!);
    return { ok: false, error: message, orderId };
  };

  const uid = productUid(cardType);
  if (!uid) return echec(`Référence produit absente (${type.productUidEnv} non renseignée)`);

  // 3. Fichier print-ready
  let pdf: Uint8Array;
  try {
    pdf = await genererCartePdf({
      nom: meta.nom,
      etude: meta.etude,
      rue: meta.rue,
      codePostal: meta.codePostal,
      ville: meta.ville,
      tel: meta.tel ?? "",
      email: meta.email,
      qrUrl: `${SITE}/notaires/${meta.notaireId}#agenda`,
    });
  } catch (e) {
    return echec(`Génération du PDF impossible : ${(e as Error).message}`);
  }

  // 4. Dépôt et lien signé pour l'imprimeur
  const chemin = `${orderId}.pdf`;
  const { error: erreurUpload } = await supabase.storage
    .from(BUCKET)
    .upload(chemin, pdf, { contentType: "application/pdf", upsert: true });
  if (erreurUpload) return echec(`Dépôt du PDF impossible : ${erreurUpload.message}`);

  const { data: signee, error: erreurSignature } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(chemin, SIGNED_URL_TTL);
  if (erreurSignature || !signee?.signedUrl) {
    return echec(`Lien de fichier impossible : ${erreurSignature?.message ?? "inconnu"}`);
  }

  // 5. Commande chez l'imprimeur
  const { firstName, lastName } = decouperNom(meta.nom);
  const resultat = await creerCommandeGelato({
    orderReferenceId: orderId!,
    productUid: uid,
    fileUrl: signee.signedUrl,
    quantity,
    shippingAddress: {
      firstName,
      lastName,
      companyName: livraison.destinataire,
      addressLine1: livraison.rue,
      city: livraison.ville,
      postCode: livraison.codePostal,
      country: "FR",
      email: meta.email,
      phone: meta.tel || undefined,
    },
  });

  if (!resultat.ok) {
    await supabase
      .from("card_orders")
      .update({ pdf_url: chemin, updated_at: new Date().toISOString() })
      .eq("id", orderId!);
    return echec(`Imprimeur : ${resultat.error}`);
  }

  await supabase
    .from("card_orders")
    .update({
      pdf_url: chemin,
      gelato_order_id: resultat.orderId,
      gelato_order_type: resultat.orderType,
      // Une commande partie en brouillon n'est pas en production : on le dit.
      status: resultat.orderType === "order" ? "sent_to_printer" : "draft",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId!);

  return { ok: true, orderId: orderId!, gelatoOrderId: resultat.orderId, orderType: resultat.orderType };
}
