-- Inscriptions commencées sur /inscription mais pas terminées.
--
-- Le formulaire enregistre la ligne dès qu'une adresse @notaires.fr valide est
-- saisie (en quittant le champ). Le cron /api/cron/relances-inscription envoie
-- une seule relance le lendemain si l'inscription n'est pas allée au bout, et
-- adresse chaque matin la liste des nouvelles inscriptions commencées à l'admin.
--
-- Une ligne par visite (session_id, le même identifiant que inscription_events) :
-- l'inscription terminée est repérée par la route /api/suivi-inscription
-- (événements « profil_cree » / « termine ») et par l'adresse du profil créé.

CREATE TABLE IF NOT EXISTS public.inscriptions_commencees (
  session_id  uuid PRIMARY KEY,
  email       text NOT NULL,
  prenom      text,
  nom         text,
  ville       text,
  crpcen      text,
  fiche_id    text,                 -- fiche réclamée (parcours « activation »)
  parcours    text NOT NULL DEFAULT 'standard',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  termine_at  timestamptz,          -- inscription allée au bout
  relance_at  timestamptz           -- relance envoyée (une seule)
);

CREATE INDEX IF NOT EXISTS inscriptions_commencees_email_idx
  ON public.inscriptions_commencees (lower(email));
CREATE INDEX IF NOT EXISTS inscriptions_commencees_created_idx
  ON public.inscriptions_commencees (created_at);

-- RLS activé SANS aucune policy : seules les routes serveur (service role)
-- lisent et écrivent. Rien n'est ouvert à `anon` ni à `authenticated`.
ALTER TABLE public.inscriptions_commencees ENABLE ROW LEVEL SECURITY;

-- Contrôle après exécution — doit renvoyer 0 ligne :
--   select policyname from pg_policies
--   where schemaname='public' and tablename='inscriptions_commencees';
