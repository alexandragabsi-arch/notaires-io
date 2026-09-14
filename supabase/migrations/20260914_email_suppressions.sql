-- Liste de désabonnement de la prospection notaires.io.
--
-- Contexte : la campagne du 08/09/2026 est partie en spam chez les études.
-- Il manquait le désabonnement « un clic » (RFC 8058) : sans lui, le seul
-- recours du destinataire est le bouton « courrier indésirable », qui abîme
-- durablement la réputation du domaine expéditeur. Le gabarit ne proposait
-- qu'un « répondez stop », que les filtres ne savent pas lire.
--
-- ⚠️ La table ne stocke AUCUNE adresse e-mail — uniquement un jeton opaque,
-- HMAC-SHA256 de l'adresse avec UNSUB_SECRET. Le serveur ne peut donc pas
-- remonter à l'adresse : c'est le script d'envoi qui, localement, recalcule le
-- jeton de chaque destinataire et écarte ceux qui figurent ici.
-- Conséquence voulue : une fuite de cette table ne révélerait aucune adresse.

CREATE TABLE IF NOT EXISTS public.email_suppressions (
  token      text PRIMARY KEY,
  source     text NOT NULL DEFAULT 'un-clic',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS activé SANS aucune policy : ni `anon` ni `authenticated` n'ont d'accès.
-- Seule la service role (route /api/desabonnement et script d'envoi) peut lire
-- et écrire. C'est la leçon de la fuite de lecture publique sur `bookings`
-- (voir 20260821_bookings_rls_close_public_read.sql) : on n'ouvre rien par défaut.
ALTER TABLE public.email_suppressions ENABLE ROW LEVEL SECURITY;

-- Contrôle après exécution — doit renvoyer 0 ligne :
--   select policyname, cmd, roles::text from pg_policies
--   where schemaname='public' and tablename='email_suppressions';
