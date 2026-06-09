-- Ajouter la colonne website dans notaire_profiles
-- À exécuter dans Supabase Dashboard → SQL Editor

ALTER TABLE notaire_profiles
  ADD COLUMN IF NOT EXISTS website TEXT;
