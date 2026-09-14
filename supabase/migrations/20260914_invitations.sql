-- Codes d'invitation : accès offert sans carte bancaire ni abonnement Stripe.
--
-- Pourquoi ne pas passer par un coupon Stripe : même avec un essai gratuit,
-- Stripe Checkout réclame la carte, et à l'échéance il tente un prélèvement,
-- échoue, puis relance le notaire pour impayé. Pour un testeur ou un confrère
-- invité, c'est inacceptable. Ici, aucune donnée bancaire n'est demandée et
-- rien ne peut se déclencher : à l'échéance, l'accès expire, point.

CREATE TABLE IF NOT EXISTS public.invitations (
  code          text PRIMARY KEY,
  mois_offerts  int  NOT NULL DEFAULT 3,
  -- Consommation : ces trois colonnes passent de NULL à renseignées en une
  -- seule écriture conditionnelle (voir /api/invitation). C'est ce qui garantit
  -- l'usage unique même si le code est soumis deux fois simultanément.
  utilise_par   uuid,
  utilise_le    timestamptz,
  notaire_id    text,
  -- Date limite pour UTILISER le code (distincte de la fin de l'accès offert).
  -- Un code qui traîne est un code qui fuite.
  expire_le     timestamptz,
  note          text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- RLS activé SANS aucune policy : ni anon ni authenticated n'y accèdent.
-- Seule la service role (route serveur) lit et écrit. Un code lisible depuis
-- le navigateur serait un abonnement gratuit en libre-service.
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Contrôle après exécution — doit renvoyer 0 ligne :
--   select policyname from pg_policies
--   where schemaname='public' and tablename='invitations';
