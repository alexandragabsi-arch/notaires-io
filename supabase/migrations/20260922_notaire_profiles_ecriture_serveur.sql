-- notaire_profiles : fin des écritures publiques.
--
-- Avant : policies « Inscription publique » (INSERT) et « Upsert publique »
-- (UPDATE, using true) → n'importe quel visiteur, même sans compte, pouvait
-- modifier n'importe quelle fiche (e-mail, photo, statut d'abonnement…).
--
-- Après : toutes les écritures passent par les routes serveur (clé service),
-- en particulier /api/profil-notaire qui vérifie le compte @notaires.fr et le
-- rattachement de la fiche. Seule exception côté navigateur : le notaire
-- connecté peut basculer ses préférences de rappel sur SA fiche.

-- Colonnes utilisées par le code mais jamais créées : chaque enregistrement
-- de fiche échouait en silence (PostgREST refuse une colonne inconnue).
alter table public.notaire_profiles
  add column if not exists website text,
  add column if not exists slot_matrix jsonb;

drop policy if exists "Inscription publique" on public.notaire_profiles;
drop policy if exists "Upsert publique" on public.notaire_profiles;

revoke insert, update, delete, truncate, references, trigger
  on public.notaire_profiles from anon, authenticated;

grant update (remind_eve, remind_2h) on public.notaire_profiles to authenticated;

create policy notaire_profiles_rappels_proprietaire on public.notaire_profiles
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
