// Client minimal pour l'API de commande Gelato (impression à la demande).
// Aucun SDK : de simples appels HTTP authentifiés par la clé X-API-KEY, qui
// ne doit jamais quitter le serveur.

const ORDERS_API = "https://order.gelatoapis.com/v4/orders";

export type GelatoAdresse = {
  firstName: string;
  lastName: string;
  companyName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postCode: string;
  country: string; // code ISO à 2 lettres, "FR"
  email: string;
  phone?: string;
};

export type GelatoCommande = {
  orderReferenceId: string;
  productUid: string;
  fileUrl: string;
  quantity: number;
  shippingAddress: GelatoAdresse;
};

export type GelatoResultat =
  | { ok: true; orderId: string; orderType: string }
  | { ok: false; error: string };

/**
 * Tant que GELATO_ORDER_TYPE ne vaut pas explicitement "order", les commandes
 * partent en brouillon : elles apparaissent dans le tableau de bord Gelato,
 * on peut vérifier l'aperçu du fichier, mais rien n'est imprimé ni facturé.
 * C'est le garde-fou qui évite d'envoyer 500 cartes en production par erreur.
 */
export function gelatoOrderType(): "draft" | "order" {
  return process.env.GELATO_ORDER_TYPE === "order" ? "order" : "draft";
}

export async function creerCommandeGelato(cmd: GelatoCommande): Promise<GelatoResultat> {
  const apiKey = process.env.GELATO_API_KEY;
  if (!apiKey) return { ok: false, error: "GELATO_API_KEY manquante" };

  const orderType = gelatoOrderType();

  const res = await fetch(ORDERS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({
      orderType,
      orderReferenceId: cmd.orderReferenceId,
      customerReferenceId: cmd.shippingAddress.email,
      currency: "EUR",
      items: [
        {
          itemReferenceId: `${cmd.orderReferenceId}-carte`,
          productUid: cmd.productUid,
          fileUrl: cmd.fileUrl,
          quantity: cmd.quantity,
        },
      ],
      shippingAddress: cmd.shippingAddress,
    }),
  });

  const data = (await res.json().catch(() => null)) as
    | { id?: string; message?: string; error?: string }
    | null;

  if (!res.ok) {
    return {
      ok: false,
      error: data?.message ?? data?.error ?? `Gelato a répondu ${res.status}`,
    };
  }

  if (!data?.id) return { ok: false, error: "Réponse Gelato sans identifiant de commande" };

  return { ok: true, orderId: data.id, orderType };
}

/** Découpe « Maître Marie Laurent » en prénom / nom pour l'adresse de livraison. */
export function decouperNom(complet: string): { firstName: string; lastName: string } {
  const propre = complet.replace(/^(Maître|Maitre|Me)\s+/i, "").trim();
  const parts = propre.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "—", lastName: "—" };
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}
