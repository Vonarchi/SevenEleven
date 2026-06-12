import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export default async function LobbyPage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <PageShell
      title="Lobby"
      subtitle="Choose your table. Warm up alone, join the floor, or host a room for your circle."
    >
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="felt-surface relative flex min-h-80 flex-col justify-between overflow-hidden rounded-[2rem] border border-amber-200/15 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.3)] sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full border border-amber-200/10" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-200/80">
              Instant table
            </span>
            <h2 className="display-type mt-6 text-4xl text-stone-50">
              Private practice
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-emerald-50/60">
              Learn the rhythm, build a streak, and hear the dice hit the felt.
              No room code, entry fee, or wait.
            </p>
          </div>
          <Link href="/solo" className="relative mt-8">
            <Button className="w-full py-3 sm:w-auto sm:px-8">
              Open private table
            </Button>
          </Link>
        </div>

        <div className="glass-panel flex flex-col justify-between rounded-[2rem] p-7 sm:p-9">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-stone-500">
                Live floor
              </p>
            </div>
            <h2 className="display-type mt-6 text-4xl text-stone-50">
              Social rooms
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-400">
              Find an open public table or create a private room with a code for
              friends.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3">
                <p className="text-xl font-semibold text-stone-100">Classic</p>
                <p className="text-xs text-stone-600">Featured mode</p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3">
                <p className="text-xl font-semibold text-amber-200">2–12</p>
                <p className="text-xs text-stone-600">Players per room</p>
              </div>
            </div>
          </div>
          <Link href="/rooms" className="mt-6">
            <Button variant="ghost" className="w-full py-3">
              Browse live rooms
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-white/[0.07] bg-black/20 px-5 py-4 text-sm text-stone-500 sm:flex-row sm:items-center">
        <p>
          Playing as{" "}
          <span className="font-medium text-stone-200">
            {user?.email ?? "Guest preview"}
          </span>
        </p>
        <p className="text-xs text-stone-600">
          Virtual coins only · No cash value or redemption
        </p>
      </div>
    </PageShell>
  );
}
