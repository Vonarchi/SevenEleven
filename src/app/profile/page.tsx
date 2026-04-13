import { PageShell } from "@/components/ui/PageShell";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <PageShell
      title="Profile"
      subtitle="Showcase level, cosmetics, VIP badge, and lifetime stats."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Player</p>
          <p className="mt-2 text-2xl font-semibold">
            {user?.user_metadata?.full_name ?? user?.email ?? "Player"}
          </p>
          <p className="mt-1 font-mono text-xs text-zinc-500">{user?.id}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Progression</p>
          <p className="mt-3 text-sm text-zinc-400">
            Level, XP, and equipped dice skin will load from `profiles` and
            `user_cosmetics`.
          </p>
          <p className="mt-4 text-xs text-zinc-500">
            {/* TODO: Graph wins/losses/streaks from matches + leaderboards_daily */}
          </p>
        </div>
      </div>
    </PageShell>
  );
}
