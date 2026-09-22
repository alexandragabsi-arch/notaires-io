-- Bucket des photos de profil notaire (référencé par lib/notaire-profiles.ts
-- mais jamais créé : tous les uploads échouaient en silence).
-- Public en lecture (affiché sur les fiches), 5 Mo max, JPG/PNG/WebP.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('notaire-photos', 'notaire-photos', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Écriture réservée au notaire connecté, dans son propre dossier <auth.uid()>/.
-- La lecture publique passe par l'URL publique du bucket ; la policy SELECT
-- ci-dessous sert uniquement à l'upsert (remplacer sa propre photo).
create policy notaire_photos_select_own on storage.objects
  for select to authenticated
  using (bucket_id = 'notaire-photos'
         and (storage.foldername(name))[1] = auth.uid()::text);

create policy notaire_photos_insert_own on storage.objects
  for insert to authenticated
  with check (bucket_id = 'notaire-photos'
              and (storage.foldername(name))[1] = auth.uid()::text);

create policy notaire_photos_update_own on storage.objects
  for update to authenticated
  using (bucket_id = 'notaire-photos'
         and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'notaire-photos'
              and (storage.foldername(name))[1] = auth.uid()::text);

create policy notaire_photos_delete_own on storage.objects
  for delete to authenticated
  using (bucket_id = 'notaire-photos'
         and (storage.foldername(name))[1] = auth.uid()::text);
