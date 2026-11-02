-- inscription_events : où s'arrêtent les visiteurs de /inscription.
--
-- Le 1er novembre 2026, 21 des 22 visiteurs de la page venaient de Chine (très
-- probablement des robots) et rien ne disait où les vrais visiteurs
-- abandonnaient. Chaque ligne est une étape franchie par une visite.
--
-- Aucune donnée personnelle : ni e-mail, ni nom, ni adresse IP. session_id est
-- tiré au hasard à chaque ouverture de la page et n'est conservé nulle part
-- côté navigateur (donc une visite rechargée compte pour deux).

create table if not exists public.inscription_events (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  evenement text not null,
  parcours text not null,
  pays text,
  created_at timestamptz not null default now(),
  -- Un événement ne compte qu'une fois par visite : un robot qui rejoue la même
  -- requête ne peut pas gonfler la table.
  unique (session_id, evenement)
);

create index if not exists inscription_events_created_idx
  on public.inscription_events (created_at desc);

-- Écriture réservée au serveur (clé service_role) : aucune politique RLS.
alter table public.inscription_events enable row level security;
revoke all on public.inscription_events from anon, authenticated;

-- L'entonnoir, sans la Chine. security_invoker : la vue respecte le RLS de la
-- table au lieu de le contourner avec les droits de son propriétaire.
create or replace view public.inscription_entonnoir
with (security_invoker = true) as
select
  evenement,
  count(*) as visites,
  count(*) filter (where created_at >= now() - interval '7 days') as visites_7_jours,
  max(created_at) as derniere
from public.inscription_events
where pays is distinct from 'CN'
group by evenement;

revoke all on public.inscription_entonnoir from anon, authenticated;
