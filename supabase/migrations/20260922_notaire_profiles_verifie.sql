-- Publication d'une fiche complétée réservée aux comptes à l'e-mail confirmé.
--
-- Juste après l'inscription, le serveur accepte le compte pendant 2 h sans
-- session (e-mail pas encore confirmé) pour enregistrer la fiche et la photo.
-- Sans ce garde-fou, quelqu'un pouvait s'inscrire avec l'adresse @notaires.fr
-- d'un autre notaire (sans y avoir accès), revendiquer sa fiche et en changer
-- le téléphone ou la photo, affichés publiquement.
--
-- verifie = le compte rattaché a confirmé son e-mail. Tenu à jour par la base
-- elle-même (aucun code applicatif ne peut le forcer) :
--   - à chaque écriture du rattachement (user_id) sur la fiche ;
--   - quand l'utilisateur confirme son e-mail (trigger sur auth.users).

alter table public.notaire_profiles
  add column if not exists verifie boolean not null default false;

create or replace function public.notaire_profiles_calcul_verifie()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  new.verifie := new.user_id is not null and exists (
    select 1 from auth.users u where u.id = new.user_id and u.email_confirmed_at is not null
  );
  return new;
end;
$$;

drop trigger if exists notaire_profiles_verifie on public.notaire_profiles;
create trigger notaire_profiles_verifie
  before insert or update on public.notaire_profiles
  for each row execute function public.notaire_profiles_calcul_verifie();

create or replace function public.auth_users_email_confirme()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if new.email_confirmed_at is not null and old.email_confirmed_at is null then
    update public.notaire_profiles set verifie = true where user_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists notaire_profiles_email_confirme on auth.users;
create trigger notaire_profiles_email_confirme
  after update of email_confirmed_at on auth.users
  for each row execute function public.auth_users_email_confirme();

-- Fonctions internes aux triggers : pas d'appel direct via l'API.
revoke execute on function public.notaire_profiles_calcul_verifie() from public, anon, authenticated;
revoke execute on function public.auth_users_email_confirme() from public, anon, authenticated;

-- État initial des fiches déjà rattachées.
update public.notaire_profiles p
   set verifie = exists (select 1 from auth.users u where u.id = p.user_id and u.email_confirmed_at is not null)
 where p.user_id is not null;
