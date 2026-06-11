-- Lien notaire ↔ client Stripe, pour exposer ses factures dans l'espace notaire.
-- Renseigné par le webhook Stripe (checkout.session.completed, mode subscription).
-- À exécuter dans Supabase Dashboard → SQL Editor AVANT le déploiement.

alter table public.notaire_profiles
  add column if not exists stripe_customer_id text;

create index if not exists notaire_profiles_stripe_customer_idx
  on public.notaire_profiles (stripe_customer_id);
