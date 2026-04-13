# 7–11 Multiplayer Dice — architecture handoff

This document maps the scaffolded Next.js + Supabase application to the product blueprint: social multiplayer dice, closed-loop coins, server-authoritative outcomes, and Stripe for purchases only (no cash-out).

## App architecture

- **Next.js App Router (TypeScript, strict)** hosts marketing pages, authenticated shell pages, and API routes.
- **Supabase** provides Auth, Postgres, Realtime channels, Storage for cosmetics assets, and Edge Functions for authoritative gameplay and wallet mutations.
- **Stripe** fulfills coin packs and VIP subscriptions via Checkout/Billing webhooks that write to Postgres using the service role.
- **Client UI** animates dice and room state optimistically where safe, but **official rolls, match resolution, and coin debits/credits** must come from Edge Functions or RPC executed with validation logic shared with `src/domain/game/sevenEleven.ts`.

## Route map

| Path | Purpose |
| --- | --- |
| `/` | Landing — marketing, CTA to auth |
| `/auth` | Sign-in/up shell (wire Supabase Auth) |
| `/lobby` | **Protected** — solo vs multiplayer entry |
| `/rooms` | **Protected** — public room browser |
| `/rooms/new` | **Protected** — host creation form |
| `/rooms/[roomCode]` | **Protected** — room detail + match banner |
| `/rooms/[roomCode]/play` | **Protected** — dice table shell |
| `/store` | **Protected** — wallet + coin packs + cosmetics |
| `/leaderboard` | **Protected** — daily rankings |
| `/profile` | **Protected** — player card |
| `/vip` | **Protected** — subscription benefits |
| `/api/stripe/webhook` | Stripe events → fulfillment (coins/VIP) |

Middleware in `src/middleware.ts` guards the **Protected** routes when `NEXT_PUBLIC_SUPABASE_*` is configured.

## Component tree (modular)

```
src/components/
  layout/SiteHeader.tsx          # Marketing vs app nav
  ui/{Button,PageShell,EmptyState,ErrorState,LoadingState}.tsx
  room-list/{RoomList,RoomListSkeleton}.tsx
  wallet/WalletSummary.tsx
  dice-table/DiceTable.tsx       # TODO: R3F + physics + audio
  leaderboard/{LeaderboardList,LeaderboardCard}.tsx
  cosmetics/{CosmeticGrid,CosmeticCard}.tsx
  match-status/MatchStatusBanner.tsx
```

Domain rules live in `src/domain/game/sevenEleven.ts` (pure functions for unit tests + server parity).

## Supabase schema

SQL migration: `supabase/migrations/000001_initial_schema.sql`

Includes `profiles`, `wallets`, `wallet_transactions`, `rooms`, `room_players`, `matches`, `rolls`, `cosmetics`, `user_cosmetics`, `daily_rewards`, `leaderboards_daily`, `subscriptions`, `reactions`, starter-coin trigger on signup, and baseline RLS. **Tighten policies** before production (especially room visibility and match writes).

## Stripe integration flow

1. Client requests Checkout Session from a **server route** (not implemented in scaffold) with price IDs for packs or VIP.
2. User completes payment on Stripe-hosted pages.
3. `POST /api/stripe/webhook` verifies `stripe-signature`, handles `checkout.session.completed` / `invoice.paid`, and **uses service role** to append `wallet_transactions`, bump `wallets.coin_balance`, and upsert `subscriptions`.
4. Idempotency: store Stripe `event.id` in `wallet_transactions.metadata` or a dedicated table to prevent double credits.

## Room / match state management

- **Authoritative state** in Postgres: `rooms`, `matches`, `rolls`, `room_players`.
- **Realtime**: subscribe to `matches` and `room_players` filtered by `room_id` for UI updates.
- **Roll flow**: client requests roll → Edge Function draws cryptographically secure dice (or server RNG), writes `rolls`, advances `matches`, resolves win/loss, applies wallet + XP + leaderboard aggregation in a **single transaction**.

## Telemetry hooks

`src/lib/telemetry.ts` exposes `trackEvent` with typed event names. TODO: initialize PostHog client in a provider; add Sentry for API/Edge.

## Polish TODOs (non-blocking for scaffold)

- Sound design, particle bursts on wins, slow-motion settle, suspense delay before reveal.
- Spectator mode, reactions, tournaments, streak mode (Phase 2+).
- Admin/moderation console.

## Legal / product guardrails

- Copy uses **coins, rewards, rooms, rankings, cosmetics, streaks, leaderboard, creator rooms**.
- Avoid **gambling, betting, wager, cash out, casino, real money winnings** framing.
- Coins are **in-app utility only** with **no redeemable cash value**.
