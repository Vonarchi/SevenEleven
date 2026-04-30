-- Connection wiring for room counts and idempotent Stripe wallet credits.

create policy "room_players_select_public_rooms" on public.room_players
  for select using (
    exists (
      select 1 from public.rooms r
      where r.id = room_players.room_id and r.is_private = false
    )
  );

create unique index if not exists subscriptions_stripe_subscription_id_key
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

create or replace function public.credit_wallet(
  p_user_id uuid,
  p_amount integer,
  p_type text,
  p_source text,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_amount <= 0 then
    raise exception 'credit amount must be positive';
  end if;

  if p_metadata ? 'stripe_event_id' and exists (
    select 1
    from public.wallet_transactions wt
    where wt.metadata ->> 'stripe_event_id' = p_metadata ->> 'stripe_event_id'
  ) then
    return;
  end if;

  insert into public.wallets (user_id, coin_balance, updated_at)
  values (p_user_id, p_amount, now())
  on conflict (user_id)
  do update set
    coin_balance = public.wallets.coin_balance + excluded.coin_balance,
    updated_at = now();

  insert into public.wallet_transactions (user_id, type, amount, source, metadata)
  values (p_user_id, p_type, p_amount, p_source, p_metadata);
end;
$$;
