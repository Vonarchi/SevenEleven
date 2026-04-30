import { CosmeticGrid } from "@/components/cosmetics/CosmeticGrid";
import { WalletSummary } from "@/components/wallet/WalletSummary";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { getCosmetics, getSupabaseUser, getWalletBalance } from "@/lib/data";
import { checkoutCatalog } from "@/lib/store/catalog";
import { unlockCosmetic } from "@/app/store/actions";

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { user } = await getSupabaseUser();
  const [balance, cosmetics] = user
    ? await Promise.all([getWalletBalance(user.id), getCosmetics(user.id)])
    : [0, { items: [], ownedIds: new Set<string>() }];
  const coinPacks = checkoutCatalog.filter((item) => item.kind === "coin_pack");

  return (
    <PageShell
      title="Store & wallet"
      subtitle="Coin packs power room entry and cosmetics. Coins are for in-app use only."
    >
      {error ? <ErrorState title="Store action failed" message={error} /> : null}
      <WalletSummary balance={balance} />
      <div className="grid gap-4 md:grid-cols-3">
        {coinPacks.map((pack) => (
          <div
            key={pack.name}
            className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900/50 p-5"
          >
            <p className="text-sm font-semibold text-zinc-100">{pack.name}</p>
            <p className="mt-2 text-2xl font-semibold text-amber-200">
              {pack.coinAmount?.toLocaleString()} coins
            </p>
            <p className="mt-1 text-sm text-zinc-500">{pack.priceLabel}</p>
            <form action="/api/checkout" method="post" className="mt-4">
              <input type="hidden" name="itemKey" value={pack.key} />
              <Button type="submit" className="w-full py-3">
                Buy with Stripe
              </Button>
            </form>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Cosmetics</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Dice skins, table themes, and profile frames.
        </p>
        <div className="mt-4">
          {cosmetics.items.length === 0 ? (
            <EmptyState title="No cosmetics yet" description="Add active cosmetics in Supabase to populate the store." />
          ) : (
            <CosmeticGrid
              items={cosmetics.items}
              ownedIds={cosmetics.ownedIds}
              unlockAction={unlockCosmetic}
            />
          )}
        </div>
      </div>
    </PageShell>
  );
}
