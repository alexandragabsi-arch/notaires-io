-- Sous-spécialités des notaires (filtre fin dans l'annuaire).
-- Saisies par le notaire à l'inscription (wizard /inscription) et stockées
-- en plus des grandes spécialités. Tableau de libellés (cf. lib/sous-specialites.ts).
-- À exécuter dans Supabase Dashboard → SQL Editor (projet stgbcjvklljoqlpzoagu).

ALTER TABLE notaire_profiles
  ADD COLUMN IF NOT EXISTS sub_specialties text[] NOT NULL DEFAULT '{}';
