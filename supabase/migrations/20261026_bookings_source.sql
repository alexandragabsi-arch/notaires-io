-- bookings.source : d'où vient la réservation.
--
-- Jusqu'ici rien ne distinguait un rendez-vous pris sur le site, dans l'app iOS
-- ou depuis le connecteur MCP. Impossible, donc, de savoir ce que le connecteur
-- rapporte réellement — la question s'est posée dès la première réservation
-- venue de l'annuaire Claude, le 26 octobre 2026.
--
-- Valeur par défaut « inconnu » et non « site » : l'app iOS insère directement
-- dans cette table sans passer par lib/reservation.ts, et la marquer « site »
-- fausserait le comptage. Les lignes « inconnu » signalent précisément les
-- écritures qui ne renseignent pas encore leur provenance.

alter table public.bookings
  add column if not exists source text not null default 'inconnu';

comment on column public.bookings.source is
  'Canal de la réservation : site | mcp | app | inconnu. Renseigné par lib/reservation.ts ; les insertions directes (app iOS) retombent sur « inconnu ».';

-- Les réservations antérieures au connecteur ne peuvent venir que du site ou de
-- l'app. On ne les réécrit pas : « inconnu » dit la vérité, « site » serait une
-- invention.

create index if not exists bookings_source_created_idx
  on public.bookings (source, created_at desc);
