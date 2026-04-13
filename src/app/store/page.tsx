import { CosmeticGrid } from "@/components/cosmetics/CosmeticGrid";
import { WalletSummary } from "@/components/wallet/WalletSummary";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { mockCosmetics } from "@/lib/mock-data";

export default function StorePage() {
  return (
    <PageShell
      title="Store & wallet"
      subtitle="Coin packs power room entry and cosmetics. Coins are for in-app use only."
    >
      <WalletSummary balance={2500} />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { name: "Starter pack", coins: 500, price: "$4.99" },
          { name: "Popular pack", coins: 1500, price: "$9.99" },
          { name: "High roller pack", coins: 4000, price: "$19.99" },
        ].map((pack) => (
          <div
            key={pack.name}
            className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900/50 p-5"
          >
            <p className="text-sm font-semibold text-zinc-100">{pack.name}</p>
            <p className="mt-2 text-2xl font-semibold text-amber-200">
              {pack.coins.toLocaleString()} coins
            </p>
            <p className="mt-1 text-sm text-zinc-500">{pack.price}</p>
            <Button className="mt-4 w-full py-3">Buy with Stripe</Button>
            <p className="mt-2 text-xs text-zinc-500">
              {/* TODO: Stripe Checkout session via /api/checkout */}
              Checkout session route not wired in this scaffold.
            </p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Cosmetics</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Dice skins, table themes, and profile frames.
        </p>
        <div className="mt-4">
          <CosmeticGrid items={mockCosmetics} ownedIds={new Set(["c3"])} />
        </div>
      </div>
    </PageShell>
  );
}
