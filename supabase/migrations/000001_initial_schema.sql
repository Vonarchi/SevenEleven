-- 7–11 Multiplayer Dice — initial schema (closed-loop virtual coins)
-- Apply with Supabase CLI or SQL editor. Tune RLS before production launch.

create extension if not exists "pgcrypto";

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  avatar_url text,
  level integer not null default 1,
  xp integer not null default 0,
  vip_status boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.wallets (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  coin_balance integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  amount integer not null,
  source text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists wallet_transactions_user_id_created_at_idx
  on public.wallet_transactions (user_id, created_at desc);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  host_user_id uuid not null references public.profiles (id) on delete cascade,
  mode text not null default 'classic',
  status text not null default 'waiting',
  is_private boolean not null default false,
  entry_fee integer not null default 0,
  max_players integer not null default 2,
  created_at timestamptz not null default now()
);

create table if not exists public.room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'joined',
  joined_at timestamptz not null default now(),
  unique (room_id, user_id)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  status text not null default 'pending',
  round_number integer not null default 1,
  current_turn_user_id uuid references public.profiles (id),
  point_value integer,
  winner_user_id uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rolls (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  die_one integer not null,
  die_two integer not null,
  total integer not null,
  roll_index integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.cosmetics (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  name text not null,
  rarity text not null,
  price_coins integer not null default 0,
  asset_url text,
  is_active boolean not null default true
);

create table if not exists public.user_cosmetics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  cosmetic_id uuid not null references public.cosmetics (id) on delete cascade,
  is_equipped boolean not null default false,
  acquired_at timestamptz not null default now(),
  unique (user_id, cosmetic_id)
);

create table if not exists public.daily_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  claimed_on date not null,
  reward_amount integer not null,
  unique (user_id, claimed_on)
);

create table if not exists public.leaderboards_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  wins integer not null default 0,
  losses integer not null default 0,
  streak integer not null default 0,
  ranking_score integer not null default 0,
  date date not null,
  unique (user_id, date)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null,
  status text not null,
  current_period_end timestamptz
);

create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  reaction text not null,
  created_at timestamptz not null default now()
);

-- Starter wallet on profile insert
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.wallets (user_id, coin_balance)
  values (new.id, 500);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.rooms enable row level security;
alter table public.room_players enable row level security;
alter table public.matches enable row level security;
alter table public.rolls enable row level security;
alter table public.cosmetics enable row level security;
alter table public.user_cosmetics enable row level security;
alter table public.daily_rewards enable row level security;
alter table public.leaderboards_daily enable row level security;
alter table public.subscriptions enable row level security;
alter table public.reactions enable row level security;

-- Profiles: read broadly, write own
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Wallets: read own; mutations only via service role / Edge Functions
create policy "wallets_select_own" on public.wallets for select using (auth.uid() = user_id);

-- Wallet transactions: read own
create policy "wallet_tx_select_own" on public.wallet_transactions for select using (auth.uid() = user_id);

-- Rooms
create policy "rooms_insert_host" on public.rooms for insert with check (auth.uid() = host_user_id);
create policy "rooms_select_visible" on public.rooms for select using (
  is_private = false
  or auth.uid() = host_user_id
  or exists (
    select 1 from public.room_players rp
    where rp.room_id = rooms.id and rp.user_id = auth.uid()
  )
);

-- Room players
create policy "room_players_select_members" on public.room_players for select using (
  exists (
    select 1 from public.room_players rp
    where rp.room_id = room_players.room_id and rp.user_id = auth.uid()
  )
  or exists (select 1 from public.rooms r where r.id = room_players.room_id and r.host_user_id = auth.uid())
);
create policy "room_players_insert_self" on public.room_players for insert with check (auth.uid() = user_id);

-- Matches & rolls
create policy "matches_select_room" on public.matches for select using (
  exists (
    select 1 from public.room_players rp
    where rp.room_id = matches.room_id and rp.user_id = auth.uid()
  )
  or exists (select 1 from public.rooms r where r.id = matches.room_id and r.host_user_id = auth.uid())
);

create policy "rolls_select_room" on public.rolls for select using (
  exists (
    select 1 from public.matches m
    join public.room_players rp on rp.room_id = m.room_id
    where m.id = rolls.match_id and rp.user_id = auth.uid()
  )
);

-- Cosmetics
create policy "cosmetics_select_active" on public.cosmetics for select using (is_active = true);
create policy "user_cosmetics_select_own" on public.user_cosmetics for select using (auth.uid() = user_id);

-- Daily rewards / leaderboard / subscriptions
create policy "daily_rewards_select_own" on public.daily_rewards for select using (auth.uid() = user_id);
create policy "leaderboards_select_own_or_public" on public.leaderboards_daily for select using (true);
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);

-- Reactions
create policy "reactions_select_room" on public.reactions for select using (
  exists (
    select 1 from public.room_players rp
    where rp.room_id = reactions.room_id and rp.user_id = auth.uid()
  )
);
create policy "reactions_insert_self" on public.reactions for insert with check (auth.uid() = user_id);

-- NOTE: Gameplay state (matches/rolls/wallets) should be updated by Edge Functions
-- using the service role after server-side validation.
