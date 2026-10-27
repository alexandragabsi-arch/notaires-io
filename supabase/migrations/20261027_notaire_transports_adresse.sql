-- notaire_profiles.transports : à recalculer quand l'adresse change.
--
-- Les arrêts sont calculés une fois pour toutes par le cron /api/cron/transports
-- (fiches vérifiées dont transports est null). Si le notaire déménage, les
-- anciens arrêts resteraient affichés : on les efface pour que le cron les
-- recalcule au passage suivant.

create or replace function public.notaire_profiles_transports_adresse()
returns trigger
language plpgsql
as $$
begin
  if new.address is distinct from old.address or new.city is distinct from old.city then
    new.transports := null;
  end if;
  return new;
end;
$$;

drop trigger if exists notaire_profiles_transports_adresse on public.notaire_profiles;
create trigger notaire_profiles_transports_adresse
  before update of address, city on public.notaire_profiles
  for each row execute function public.notaire_profiles_transports_adresse();

revoke execute on function public.notaire_profiles_transports_adresse() from public, anon, authenticated;
