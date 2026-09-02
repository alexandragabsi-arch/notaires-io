// Source unique de vérité pour les cartes de visite : tarifs, libellés et
// références produit chez l'imprimeur. Le prix N'EST JAMAIS calculé côté client :
// le navigateur envoie seulement un modèle et une quantité, le serveur en déduit
// le montant à encaisser.

export type CardType = "standard" | "premium";
export type Qty = 100 | 200 | 500;

export const QUANTITIES: Qty[] = [100, 200, 500];

export type CardTypeInfo = {
  id: CardType;
  label: string;
  grammage: string;
  finish: string;
  /** Prix de vente TTC en centimes, livraison incluse */
  prix: Record<Qty, number>;
  /** Référence catalogue chez l'imprimeur, surchargeable par variable d'env */
  productUidEnv: string;
  /** Référence relevée dans le catalogue Gelato — format 85 × 55 mm */
  productUidDefaut: string;
};

export const CARD_TYPES: CardTypeInfo[] = [
  {
    id: "standard",
    label: "Standard",
    grammage: "350 g",
    finish: "Pelliculage mat",
    // Coût imprimeur constaté en France : 18,10 / 24,75 / 43,05 € + 5,78 € de port.
    prix: { 100: 3900, 200: 4900, 500: 7900 },
    productUidEnv: "GELATO_PRODUCT_UID_STANDARD",
    productUidDefaut: "cards_pf_bd_pt_350-gsm-coated-silk_cl_4-4_ct_matt-protection_hor",
  },
  {
    id: "premium",
    label: "Premium",
    grammage: "350 g",
    finish: "Papier naturel non couché",
    // Papier non couché : plus cher à produire (34,34 / 54,59 / 109,26 €), et
    // le seul du catalogue sur lequel on peut écrire au stylo.
    prix: { 100: 6900, 200: 9900, 500: 16900 },
    productUidEnv: "GELATO_PRODUCT_UID_PREMIUM",
    productUidDefaut: "cards_pf_bd_pt_350-gsm-uncoated_cl_4-4_hor",
  },
];

export function getCardType(id: string): CardTypeInfo | null {
  return CARD_TYPES.find((t) => t.id === id) ?? null;
}

export function isQty(n: unknown): n is Qty {
  return QUANTITIES.includes(n as Qty);
}

/** Montant TTC en centimes, ou null si la combinaison est invalide. */
export function prixCents(cardType: string, quantity: unknown): number | null {
  const type = getCardType(cardType);
  if (!type || !isQty(quantity)) return null;
  return type.prix[quantity];
}

export function formatPrix(cents: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

/** Référence catalogue du modèle. La valeur par défaut est celle relevée dans
 *  le catalogue Gelato ; une variable d'env la remplace, pour changer de papier
 *  ou d'imprimeur sans toucher au code. */
export function productUid(cardType: CardType): string | null {
  const type = getCardType(cardType);
  if (!type) return null;
  return process.env[type.productUidEnv] || type.productUidDefaut;
}
