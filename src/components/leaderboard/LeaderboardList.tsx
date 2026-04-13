import { LeaderboardCard } from "@/components/leaderboard/LeaderboardCard";

export type LeaderboardRow = {
  rank: number;
  username: string;
  wins: number;
  streak: number;
  highlight?: boolean;
};

export function LeaderboardList({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <LeaderboardCard key={`${row.rank}-${row.username}`} {...row} />
      ))}
    </div>
  );
}
