-- Table des profils notaires créés via /inscription
create table if not exists notaire_profiles (
  id          text primary key,
  name        text not null,
  initials    text,
  color       text default 'default',
  city        text not null,
  office_name text,
  address     text,
  phone       text,
  role        text,          -- 'associé' | 'salarié' | null
  specialties jsonb default '[]'::jsonb,
  languages   jsonb default '[]'::jsonb,
  bio         text,
  photo       text,
  created_at  timestamptz default now()
);

-- Accès public en lecture + écriture (pas d'auth pour l'instant)
alter table notaire_profiles enable row level security;

create policy "Lecture publique"
  on notaire_profiles for select
  using (true);

create policy "Inscription publique"
  on notaire_profiles for insert
  with check (true);
