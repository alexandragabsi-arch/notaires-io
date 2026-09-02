// Source unique de vérité pour les cartes de visite : tarifs, libellés et
// références produit chez l'imprimeur. Le prix N'EST JAMAIS calculé côté client :
// le navigateur envoie seulement un modèle et une quantité, le serveur en déduit
// le montant à encaisser.

export type CardType = "standard" | "premium";
export type Qty = 100 | 250 | 500;

export const QUANTITIES: Qty[] = [100, 250, 500];

export type CardTypeInfo = {
  id: CardType;
  label: string;
  grammage: string;
  finish: string;
  /** Prix de vente TTC en centimes, livraison incluse */
  prix: Record<Qty, number>;
  /** Référence catalogue chez l'imprimeur, injectée par variable d'env */
  productUidEnv: string;
};

export const CARD_TYPES: CardTypeInfo[] = [
  {
    id: "standard",
    label: "Standard",
    grammage: "350 g",
    finish: "Mat ou brillant",
    prix: { 100: 3900, 250: 4900, 500: 6900 },
    productUidEnv: "GELATO_PRODUCT_UID_STANDARD",
  },
  {
    id: "premium",
    label: "Premium",
    grammage: "600 g",
    finish: "Soft-touch",
    prix: { 100: 5900, 250: 7900, 500: 10900 },
    productUidEnv: "GELATO_PRODUCT_UID_PREMIUM",
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

/** Le productUid dépend du modèle ; il vit en variable d'env pour pouvoir
 *  changer de papier ou d'imprimeur sans redéployer de code. */
export function productUid(cardType: CardType): string | null {
  const type = getCardType(cardType);
  if (!type) return null;
  return process.env[type.productUidEnv] ?? null;
}
