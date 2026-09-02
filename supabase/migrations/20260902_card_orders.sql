-- Commandes de cartes de visite.
--
-- Une ligne est créée par le webhook Stripe APRÈS confirmation du paiement,
-- puis enrichie par le webhook de l'imprimeur (statut de production, suivi).
-- Le notaire consulte ses commandes depuis son espace ; personne d'autre.

create table if not exists public.card_orders (
  id                uuid primary key default gen_random_uuid(),
  notaire_id        text not null,
  -- Référence de la session Stripe : sert de clé d'idempotence, un webhook
  -- Stripe pouvant être rejoué plusieurs fois pour un même paiement.
  stripe_session_id text not null unique,
  card_type         text not null,
  quantity          integer not null,
  amount_cents      integer not null,
  -- Coordonnées imprimées et adresse de livraison, figées au moment de l'achat
  nom               text not null,
  etude             text not null,
  livraison         jsonb not null,
  pdf_url           text,
  -- Côté imprimeur
  gelato_order_id   text,
  gelato_order_type text,
  status            text not null default 'paid',
  tracking_url      text,
  error             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists card_orders_notaire_idx on public.card_orders (notaire_id);
create index if not exists card_orders_gelato_idx  on public.card_orders (gelato_order_id);

alter table public.card_orders enable row level security;

-- Le notaire lit ses propres commandes. Les routes serveur utilisent la clé
-- service role et contournent le RLS pour écrire.
drop policy if exists "Le notaire lit ses commandes de cartes" on public.card_orders;
create policy "Le notaire lit ses commandes de cartes"
  on public.card_orders for select
  to authenticated
  using (
    exists (
      select 1 from public.notaire_profiles p
      where p.id = card_orders.notaire_id
        and p.user_id = auth.uid()
    )
  );

-- Bucket privé où sont déposés les PDF print-ready. L'imprimeur y accède par
-- une URL signée à durée limitée, jamais par un lien public permanent :
-- le fichier porte les coordonnées complètes du notaire.
insert into storage.buckets (id, name, public)
values ('cartes', 'cartes', false)
on conflict (id) do nothing;
