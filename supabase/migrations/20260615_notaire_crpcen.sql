-- Numéro CRPCEN de l'étude (identifiant officiel à 4-6 chiffres), saisi à l'inscription.
-- Renseigné par lib/notaire-profiles.ts (addProfile / claimProfile).
-- À exécuter dans Supabase Dashboard → SQL Editor AVANT le déploiement.

alter table public.notaire_profiles
  add column if not exists crpcen text;

create index if not exists notaire_profiles_crpcen_idx
  on public.notaire_profiles (crpcen);
