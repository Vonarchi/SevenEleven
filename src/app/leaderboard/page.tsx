import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";
import { PageShell } from "@/components/ui/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { getDailyLeaderboard, getSupabaseUser } from "@/lib/data";

export default async function LeaderboardPage() {
  const { user } = await getSupabaseUser();
  const rows = await getDailyLeaderboard(user?.id);

  return (
    <PageShell
      title="Rankings"
      subtitle="Daily wins, streaks, and leaderboard scores — social status without cash prizes."
    >
      {rows.length === 0 ? (
        <EmptyState title="No rankings yet" description="Play matches to populate today's board." />
      ) : (
        <LeaderboardList rows={rows} />
      )}
    </PageShell>
  );
}
