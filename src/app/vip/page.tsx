import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { getCheckoutItem } from "@/lib/store/catalog";

const perks = [
  "Daily coin drops",
  "Exclusive rooms",
  "Enhanced profile styling & VIP badge",
  "Premium dice and table skins",
  "Reduced cooldowns on social actions",
];

export default function VipPage() {
  const vip = getCheckoutItem("vip-monthly");

  return (
    <PageShell
      title="VIP membership"
      subtitle="Subscription benefits for hosts and grinders — still a closed-loop coin economy."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-zinc-950 p-8 shadow-[0_0_60px_rgba(251,191,36,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/80">
            VIP
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Roll with the house style</h2>
          <p className="mt-3 text-sm text-zinc-300">
            Stripe Billing manages renewals. Coins from VIP drops are credited via
            server webhooks — never trust the client wallet.
          </p>
          <form action="/api/checkout" method="post" className="mt-8">
            <input type="hidden" name="itemKey" value={vip?.key ?? "vip-monthly"} />
            <Button type="submit" className="px-8 py-3 text-base">
              Start VIP checkout
            </Button>
          </form>
        </div>
        <ul className="space-y-3 rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
          {perks.map((perk) => (
            <li key={perk} className="flex gap-3 text-sm text-zinc-200">
              <span className="text-amber-300">✦</span>
              <span>{perk}</span>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
