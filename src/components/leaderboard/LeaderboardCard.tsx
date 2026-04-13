import clsx from "clsx";

export function LeaderboardCard({
  rank,
  username,
  wins,
  streak,
  highlight,
}: {
  rank: number;
  username: string;
  wins: number;
  streak: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between rounded-xl border px-4 py-3",
        highlight
          ? "border-amber-400/40 bg-amber-500/10"
          : "border-white/10 bg-zinc-900/40",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="w-8 text-center text-sm font-semibold text-zinc-500">
          #{rank}
        </span>
        <div>
          <p className="font-medium text-zinc-100">{username}</p>
          <p className="text-xs text-zinc-500">{wins} wins</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Streak</p>
        <p className="text-lg font-semibold tabular-nums text-amber-200">
          {streak}
        </p>
      </div>
    </div>
  );
}
