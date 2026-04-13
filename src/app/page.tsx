import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader variant="marketing" />
      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(251,191,36,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.08), transparent 35%)",
            }}
          />
          <div className="relative mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/80">
                Social multiplayer dice
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Roll, react, rise on the{" "}
                <span className="text-amber-200">leaderboard</span>
              </h1>
              <p className="max-w-xl text-lg text-zinc-400">
                Live party rooms, cinematic dice moments, and a closed-loop coin
                economy for cosmetics, room entry, and rewards. Coins stay
                in-app — designed for suspense, status, and social play.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/auth">
                  <Button className="w-full px-8 py-3 text-base sm:w-auto">
                    Start rolling
                  </Button>
                </Link>
                <Link
                  href="/auth"
                  className="text-center text-sm text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline sm:text-left"
                >
                  Browse rooms after sign-in
                </Link>
              </div>
            </div>
            <div className="flex flex-1 justify-center lg:justify-end">
              <div className="relative aspect-square w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 shadow-[0_0_120px_rgba(251,191,36,0.12)]">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Hero dice
                </p>
                <div className="mt-8 flex h-64 items-center justify-center text-8xl">
                  🎲
                </div>
                <p className="mt-6 text-center text-sm text-zinc-500">
                  {/* TODO: Replace with R3F dice stage + subtle parallax */}
                  Placeholder for cinematic 3D dice animation
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 bg-zinc-950/80 px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">
            {[
              {
                title: "Creator rooms",
                body: "Hosts set modes, entry fees, and privacy. Spectators and reactions land in Phase 2.",
              },
              {
                title: "Rankings & streaks",
                body: "Climb daily leaderboards, flex cosmetics, and chase streak bonuses without real-money play.",
              },
              {
                title: "Rewards, not cash-out",
                body: "Earn coins from daily rewards, wins, and milestones. Spend on cosmetics and premium tables.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6"
              >
                <h3 className="text-lg font-semibold text-zinc-50">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
