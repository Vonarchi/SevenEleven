import { PageShell } from "@/components/ui/PageShell";
import { getProfile, getSupabaseUser, getWalletBalance } from "@/lib/data";

export default async function ProfilePage() {
  const { user } = await getSupabaseUser();
  const [profile, balance] = user
    ? await Promise.all([getProfile(user.id), getWalletBalance(user.id)])
    : [null, 0] as const;

  return (
    <PageShell
      title="Profile"
      subtitle="Showcase level, cosmetics, VIP badge, and lifetime stats."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Player</p>
          <p className="mt-2 text-2xl font-semibold">
            {profile?.username ?? user?.user_metadata?.full_name ?? user?.email ?? "Player"}
          </p>
          <p className="mt-1 font-mono text-xs text-zinc-500">{user?.id}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Progression</p>
          <p className="mt-3 text-3xl font-semibold text-amber-100">
            Level {profile?.level ?? 1}
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            {profile?.xp ?? 0} XP · {balance.toLocaleString()} coins ·{" "}
            {profile?.vip_status ? "VIP active" : "Standard profile"}
          </p>
        </div>
      </div>
    </PageShell>
  );
}
