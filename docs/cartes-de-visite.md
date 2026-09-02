# Cartes de visite — mise en service

Chaîne complète : le notaire commande depuis son espace, paie par Stripe, et
l'imprimeur reçoit automatiquement un PDF print-ready avec le QR code de sa
page de rendez-vous.

## Le trajet d'une commande

1. `components/CardDesigner.tsx` — le notaire saisit ses informations et choisit
   modèle et quantité. La commande exige d'être connecté : le QR pointe vers
   `/notaires/{id}#agenda`, il faut donc un profil.
2. `app/api/checkout/route.ts` — **recalcule le prix côté serveur** à partir de
   `lib/cartes.ts`, valide les champs, crée la session Stripe et range toutes les
   données de la commande dans les métadonnées.
3. `app/api/stripe/webhook/route.ts` — sur `checkout.session.completed`, appelle
   `traiterCommandeCartes`. C'est le seul déclencheur : rien ne part sans
   paiement encaissé.
4. `lib/carte-commande.ts` — enregistre la commande, génère le PDF, le dépose sur
   Supabase Storage, obtient une URL signée et passe commande chez l'imprimeur.
5. `app/api/gelato/webhook/route.ts` — reçoit les statuts de production et le
   numéro de suivi, met à jour `card_orders`.

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `STRIPE_SECRET_KEY` | Encaissement. Compte **LegalCorners**. |
| `STRIPE_WEBHOOK_SECRET` | Signature du webhook Stripe — doit venir du **même** compte que la clé ci-dessus. |
| `GELATO_API_KEY` | Clé imprimeur. Serveur uniquement, **jamais** préfixée `NEXT_PUBLIC_`. |
| `GELATO_PRODUCT_UID_STANDARD` | Référence catalogue du modèle 350 g. |
| `GELATO_PRODUCT_UID_PREMIUM` | Référence catalogue du modèle 600 g. |
| `GELATO_ORDER_TYPE` | `draft` (défaut) ou `order`. Voir ci-dessous. |
| `GELATO_WEBHOOK_SECRET` | Jeton attendu dans l'URL du webhook imprimeur. |
| `SUPABASE_SERVICE_ROLE_KEY` | Écriture serveur dans `card_orders` et le bucket. |

## Le garde-fou `GELATO_ORDER_TYPE`

Tant que la variable ne vaut pas exactement `order`, **toutes les commandes
partent en brouillon** : elles apparaissent dans le tableau de bord Gelato, on
peut y vérifier l'aperçu du fichier, mais rien n'est imprimé ni facturé.

Ne passer à `order` qu'après avoir vérifié un brouillon de bout en bout.

## À faire avant la première commande réelle

1. **Relever les `productUid`** dans le catalogue Gelato (format, papier,
   recto/verso, orientation) et les mettre en variables d'environnement.
2. **Relever les prix Gelato** par palier :
   `curl -s "https://product.gelatoapis.com/v3/products/UID/prices" -H "X-API-KEY: $GELATO_API_KEY"`
   puis ajuster la grille de vente dans `lib/cartes.ts` — les montants actuels
   sont des valeurs de départ, pas des prix calibrés sur un coût réel.
3. **Jouer la migration** `supabase/migrations/20260902_card_orders.sql`
   (table `card_orders`, RLS, bucket `cartes`).
4. **Déclarer le webhook imprimeur** dans Gelato :
   `https://notaires.io/api/gelato/webhook?token=<GELATO_WEBHOOK_SECRET>`
5. **Commander un brouillon**, vérifier l'aperçu du PDF dans le tableau de bord,
   puis basculer `GELATO_ORDER_TYPE=order`.

## Reste à construire

- L'affichage des commandes et du suivi dans l'espace notaire (`card_orders`
  est alimentée, rien ne la lit encore).
- Le verso de la carte : le PDF ne contient qu'un recto.
