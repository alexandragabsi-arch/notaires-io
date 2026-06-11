-- Stockage des pièces jointes des rendez-vous (espace client → téléchargement).
--
-- Bucket privé : les fichiers ne sont accessibles que via une URL signée,
-- et un utilisateur ne peut lire/écrire QUE ses propres pièces. Le chemin
-- des objets est préfixé par l'id du compte :
--     booking-documents/{user_id}/{dossier_id}/{doc_id}-{nom_fichier}
-- → la 1re partie du chemin doit correspondre à auth.uid().

-- 1) Bucket privé (idempotent)
insert into storage.buckets (id, name, public)
values ('booking-documents', 'booking-documents', false)
on conflict (id) do nothing;

-- 2) Policies RLS sur storage.objects, limitées à ce bucket.
--    storage.foldername(name) renvoie le tableau des segments du chemin ;
--    le 1er segment ([1]) doit être l'id du compte connecté.

-- Lecture (génération d'URL signées dans l'espace client)
drop policy if exists "booking_docs_select_own" on storage.objects;
create policy "booking_docs_select_own"
on storage.objects for select
to authenticated
using (
  bucket_id = 'booking-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Écriture (upload au moment de la réservation)
drop policy if exists "booking_docs_insert_own" on storage.objects;
create policy "booking_docs_insert_own"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'booking-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Mise à jour (remplacement d'une pièce, upsert)
drop policy if exists "booking_docs_update_own" on storage.objects;
create policy "booking_docs_update_own"
on storage.objects for update
to authenticated
using (
  bucket_id = 'booking-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'booking-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Suppression (au cas où l'utilisateur retire une pièce)
drop policy if exists "booking_docs_delete_own" on storage.objects;
create policy "booking_docs_delete_own"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'booking-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);
