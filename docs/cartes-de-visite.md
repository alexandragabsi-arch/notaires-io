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
| `GELATO_PRODUCT_UID_STANDARD` | Facultatif — surcharge la référence par défaut. |
| `GELATO_PRODUCT_UID_PREMIUM` | Facultatif — surcharge la référence par défaut. |
| `GELATO_ORDER_TYPE` | `draft` (défaut) ou `order`. Voir ci-dessous. |
| `GELATO_WEBHOOK_SECRET` | Jeton attendu dans l'URL du webhook imprimeur. |
| `SUPABASE_SERVICE_ROLE_KEY` | Écriture serveur dans `card_orders` et le bucket. |

## Le garde-fou `GELATO_ORDER_TYPE`

Tant que la variable ne vaut pas exactement `order`, **toutes les commandes
partent en brouillon** : elles apparaissent dans le tableau de bord Gelato, on
peut y vérifier l'aperçu du fichier, mais rien n'est imprimé ni facturé.

Ne passer à `order` qu'après avoir vérifié un brouillon de bout en bout.

## Catalogue et coûts, relevés le 2 septembre 2026

Format retenu : **`bd` = 85 × 55 mm**, le standard européen, celui du PDF
généré. Les autres formats du catalogue (`bb` 90×50, `bc` 90×55, `bx` 88,9×50,8)
ne correspondent pas.

**Le catalogue Gelato ne propose pas de 600 g soft-touch** : 350 g est
l'épaisseur maximale. Les deux modèles ont donc été redéfinis sur ce qui existe
réellement.

Coûts imprimeur en France, hors port (**5,78 €**, DPD, 2 jours) :

| Modèle | Référence | 100 | 200 | 500 |
|---|---|---|---|---|
| Standard — pelliculage mat | `cards_pf_bd_pt_350-gsm-coated-silk_cl_4-4_ct_matt-protection_hor` | 18,10 € | 24,75 € | 43,05 € |
| Premium — papier naturel | `cards_pf_bd_pt_350-gsm-uncoated_cl_4-4_hor` | 34,34 € | 54,59 € | 109,26 € |

Le palier **250 n'existe pas** pour le pelliculé : les quantités sont 100 / 200 / 500.

## À faire avant la première commande réelle

1. ~~Relever les `productUid`~~ — fait, valeurs par défaut dans `lib/cartes.ts`.
2. ~~Relever les prix et calibrer la grille~~ — fait.
3. ~~Jouer la migration~~ — appliquée en production le 2 septembre 2026.
4. **Déclarer le webhook imprimeur** dans Gelato :
   `https://notaires.io/api/gelato/webhook?token=<GELATO_WEBHOOK_SECRET>`
5. **Commander un brouillon**, vérifier l'aperçu du PDF dans le tableau de bord,
   puis basculer `GELATO_ORDER_TYPE=order` — c'est cette variable, et elle seule,
   qui ouvre la commande au public.

## Reste à construire

- L'affichage des commandes et du suivi dans l'espace notaire (`card_orders`
  est alimentée, rien ne la lit encore).
- Le verso de la carte : le PDF ne contient qu'un recto.
