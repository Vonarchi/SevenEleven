import { LeaderboardList, type LeaderboardRow } from "@/components/leaderboard/LeaderboardList";
import { PageShell } from "@/components/ui/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { mockLeaderboard } from "@/lib/mock-data";

export default function LeaderboardPage() {
  const rows: LeaderboardRow[] = mockLeaderboard;

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
