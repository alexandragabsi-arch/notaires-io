-- Mail « comment s'est passée votre visio ? », envoyé par le cron des rappels
-- une heure après le début d'une visio (notaire, client et autres participants).
-- feedback_sent sert d'anti-doublon : le cron tourne toutes les heures.
-- À exécuter AVANT le déploiement.

alter table public.bookings
  add column if not exists feedback_sent boolean not null default false;

-- Les rendez-vous déjà passés ne reçoivent pas de mail rétroactif.
update public.bookings
  set feedback_sent = true
  where slot_key is not null and slot_key::timestamptz < now();
