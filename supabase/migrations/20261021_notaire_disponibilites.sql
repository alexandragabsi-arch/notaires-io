-- Disponibilités libres des notaires (éditeur de « Mon espace »).
--
-- Remplace, pour les fiches qui l'ont renseignée, l'ancienne `slot_matrix`
-- (jours numérotés « à partir de demain », qui se décalaient chaque jour et
-- n'offraient que 7 horaires fixes). Format, validé par /api/profil-notaire
-- (lib/disponibilites.ts) :
--   { "duree": 60,
--     "semaine": [[{"de":"09:00","a":"12:00"}], …],   -- 7 jours, lundi d'abord
--     "exceptions": { "2026-12-24": [] } }           -- [] = fermé ce jour
--
-- Ajout seul : `slot_matrix` reste en place pour les fiches pas encore
-- passées au nouvel éditeur. Écriture uniquement via la route serveur
-- (aucun droit d'écriture ajouté pour anon / authenticated).
alter table public.notaire_profiles
  add column if not exists disponibilites jsonb;
