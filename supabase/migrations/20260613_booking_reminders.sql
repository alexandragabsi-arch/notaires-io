-- Rappels de rendez-vous automatiques (cron Vercel → /api/cron/reminders)
-- À exécuter dans Supabase Dashboard → SQL Editor AVANT le déploiement.
--
-- Deux rappels par RDV : la veille à 18h, et 2h avant.
-- Les colonnes *_sent servent d'anti-doublon (le cron tourne toutes les heures).
-- Les préférences remind_* (par notaire) persistent les interrupteurs du dashboard.

-- Anti-doublon sur chaque réservation
alter table public.bookings
  add column if not exists reminder_eve_sent boolean not null default false,
  add column if not exists reminder_2h_sent  boolean not null default false;

-- Préférences de rappel par notaire (interrupteurs du tableau de bord)
alter table public.notaire_profiles
  add column if not exists remind_eve boolean not null default true,
  add column if not exists remind_2h  boolean not null default true;

-- Index partiel : le cron ne lit que les RDV confirmés pas encore totalement rappelés
create index if not exists bookings_reminders_pending_idx
  on public.bookings (created_at desc)
  where status = 'confirmé' and (reminder_eve_sent = false or reminder_2h_sent = false);
