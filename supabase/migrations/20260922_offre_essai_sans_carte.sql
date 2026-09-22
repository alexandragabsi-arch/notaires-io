-- Essai « sans carte » (offre LinkedIn, codes d'invitation) : suivi des
-- rappels de fin d'essai et de l'offre d'origine.
--
-- Statuts utilisés dans subscription_status :
--   essai_offert  offre sans carte en cours (lien /inscription?offre=…)
--   offert        code d'invitation en cours
--   actif         abonnement Stripe (carte enregistrée)
--   expire        fin d'essai sans carte, ou abonnement Stripe résilié
--                 → la fiche redevient une fiche d'annuaire de base
-- Fin de l'accès offert : subscription_renewal_at (ISO 8601, déjà utilisé).

alter table public.notaire_profiles
  add column if not exists offre text,
  add column if not exists rappel_j7_at timestamptz,
  add column if not exists rappel_j1_at timestamptz;

-- Le cron de fin d'essai ne parcourt que les essais en cours.
create index if not exists notaire_profiles_essais_idx
  on public.notaire_profiles (subscription_status)
  where subscription_status in ('essai_offert', 'offert');
