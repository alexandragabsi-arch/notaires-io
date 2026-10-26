-- notaire_profiles.transports : arrêts de transport autour du cabinet.
--
-- Pourquoi stocker plutôt que calculer à l'affichage : la source est Overpass
-- (OpenStreetMap), un service bénévole. Interroger leurs serveurs à chaque
-- consultation de fiche les surcharge — et ils bloquent. L'adresse IP qui a
-- préparé cette migration s'est fait refuser après quelques centaines de
-- requêtes le 26 octobre 2026.
--
-- Le champ est rempli par scripts/fetch-transports.mjs, qui tourne lentement et
-- une seule fois par adresse. L'affichage lit la base : instantané, fiable, et
-- sans dépendance au moment du rendu.
--
-- Forme attendue — un tableau, du mode le plus structurant au moins :
--   [{"mode":"Métro","noms":["Gare de Lyon","Reuilly-Diderot"]},
--    {"mode":"Bus","noms":["Rambouillet","Gare de Lyon"]}]
--
-- Tableau vide = vérifié, aucun arrêt à proximité (cela arrive en périphérie).
-- NULL = jamais calculé. La distinction compte : on n'affiche la rubrique que
-- lorsqu'elle a du contenu, et on sait lesquels restent à traiter.

alter table public.notaire_profiles
  add column if not exists transports jsonb;

comment on column public.notaire_profiles.transports is
  'Arrêts à 400 m du cabinet, depuis OpenStreetMap. [{mode, noms[]}]. '
  'Tableau vide = aucun arrêt trouvé ; NULL = pas encore calculé. '
  'Rempli par scripts/fetch-transports.mjs, jamais à l''affichage.';
