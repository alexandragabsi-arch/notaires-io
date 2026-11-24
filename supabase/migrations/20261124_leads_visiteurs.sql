-- Demandes « Être recontacté par un notaire » laissées sur la fiche d'un
-- notaire NON inscrit (fiche issue des annuaires publics, sans agenda).
--
-- Le formulaire de la fiche appelle /api/leads-visiteurs, qui valide, insère
-- la ligne avec la clé service role et prévient contact@notaires.io.
-- Aucun mail automatique n'est envoyé au visiteur.
--
-- Migration purement additive : elle ne crée qu'une table et ses index, et ne
-- touche aucune table existante.

CREATE TABLE IF NOT EXISTS public.leads_visiteurs (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cree_le               timestamptz NOT NULL DEFAULT now(),
  prenom                text NOT NULL,
  nom                   text NOT NULL,
  email                 text NOT NULL,
  telephone             text,
  objet                 text NOT NULL CHECK (objet IN ('achat_vente', 'succession', 'donation', 'mariage_pacs', 'societe', 'autre')),
  ville                 text,
  message               text,
  notaire_fiche_id      text,                 -- fiche d'origine (/notaires/[id])
  page_url              text,
  consentement          boolean NOT NULL CHECK (consentement),
  consentement_le       timestamptz NOT NULL DEFAULT now(),
  statut                text NOT NULL DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'traite')),
  -- Notaire de la fiche d'origine, figé au moment de la demande, pour la
  -- prospection (« vous avez reçu N demandes sur votre fiche »). Copié par la
  -- route depuis l'annuaire importé et le profil notaire_profiles de même id.
  -- Jamais affiché au visiteur.
  notaire_nom           text,
  notaire_office        text,
  notaire_ville         text,
  notaire_email         text,
  notaire_telephone     text
);

-- Colonnes ajoutées après une première application (idempotent).
ALTER TABLE public.leads_visiteurs
  ADD COLUMN IF NOT EXISTS notaire_nom       text,
  ADD COLUMN IF NOT EXISTS notaire_office    text,
  ADD COLUMN IF NOT EXISTS notaire_ville     text,
  ADD COLUMN IF NOT EXISTS notaire_email     text,
  ADD COLUMN IF NOT EXISTS notaire_telephone text;

CREATE INDEX IF NOT EXISTS leads_visiteurs_cree_le_idx
  ON public.leads_visiteurs (cree_le DESC);
CREATE INDEX IF NOT EXISTS leads_visiteurs_email_idx
  ON public.leads_visiteurs (lower(email));
-- Récapitulatif « demandes par notaire ».
CREATE INDEX IF NOT EXISTS leads_visiteurs_fiche_idx
  ON public.leads_visiteurs (notaire_fiche_id);
--   select notaire_fiche_id, notaire_nom, notaire_ville, count(*) as demandes
--   from public.leads_visiteurs group by 1, 2, 3 order by demandes desc;

-- RLS activé SANS aucune policy : seules les routes serveur (service role)
-- lisent et écrivent. Rien n'est ouvert à `anon` ni à `authenticated`.
ALTER TABLE public.leads_visiteurs ENABLE ROW LEVEL SECURITY;

-- Contrôle après exécution — doit renvoyer 0 ligne :
--   select policyname from pg_policies
--   where schemaname='public' and tablename='leads_visiteurs';
