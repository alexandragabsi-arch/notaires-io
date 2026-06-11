-- Documents envoyés par le NOTAIRE au CLIENT (espace client → onglet « Reçus »).
--
-- Métadonnées : colonne bookings.notaire_documents (jsonb) → [{ id, label, fileName, path, sentAt }]
-- Fichiers    : même bucket privé `booking-documents`, mais sous le préfixe
--                   notaire/{booking_id}/{doc_id}-{nom_fichier}
--               (les pièces déposées par le client restent sous {user_id}/{dossier_id}/…)
--
-- Partage croisé : le notaire (propriétaire du RDV via notaire_profiles.user_id)
-- peut écrire/lire/supprimer ses envois ; le client (bookings.user_id) peut les lire.
--
-- ⚠️ À exécuter dans Supabase Dashboard → SQL Editor avant le déploiement.

-- 1) Colonne métadonnées
alter table public.bookings
  add column if not exists notaire_documents jsonb not null default '[]'::jsonb;

-- 2) Fonctions d'appartenance (SECURITY DEFINER → indépendantes du RLS des tables
--    sous-jacentes, donc robustes même après resserrage de la lecture publique).
create or replace function public.notaire_owns_booking(bid text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from bookings b
    join notaire_profiles p on p.id = b.notaire_id
    where b.id::text = bid
      and p.user_id = auth.uid()
  );
$$;

create or replace function public.client_owns_booking(bid text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from bookings b
    where b.id::text = bid
      and b.user_id = auth.uid()
  );
$$;

revoke all on function public.notaire_owns_booking(text) from public;
revoke all on function public.client_owns_booking(text) from public;
grant execute on function public.notaire_owns_booking(text) to authenticated;
grant execute on function public.client_owns_booking(text) to authenticated;

-- 3) Policies Storage sur le préfixe « notaire/{booking_id}/… »
--    foldername(name)[1] = 'notaire', foldername(name)[2] = booking_id

-- Le notaire gère (lecture + écriture + suppression) les pièces de SES RDV.
drop policy if exists "booking_docs_notaire_rw" on storage.objects;
create policy "booking_docs_notaire_rw"
on storage.objects for all
to authenticated
using (
  bucket_id = 'booking-documents'
  and (storage.foldername(name))[1] = 'notaire'
  and public.notaire_owns_booking((storage.foldername(name))[2])
)
with check (
  bucket_id = 'booking-documents'
  and (storage.foldername(name))[1] = 'notaire'
  and public.notaire_owns_booking((storage.foldername(name))[2])
);

-- Le client lit les pièces reçues sur SES RDV.
drop policy if exists "booking_docs_client_recus_select" on storage.objects;
create policy "booking_docs_client_recus_select"
on storage.objects for select
to authenticated
using (
  bucket_id = 'booking-documents'
  and (storage.foldername(name))[1] = 'notaire'
  and public.client_owns_booking((storage.foldername(name))[2])
);

-- 4) Le notaire peut mettre à jour SES réservations (pour enregistrer la liste
--    notaire_documents après upload). Limité à ses propres RDV.
drop policy if exists "Le notaire met à jour ses réservations" on public.bookings;
create policy "Le notaire met à jour ses réservations"
  on public.bookings for update
  to authenticated
  using (public.notaire_owns_booking(id::text))
  with check (public.notaire_owns_booking(id::text));
