import clsx from "clsx";

export type MatchPhase = "waiting" | "opening" | "point" | "resolved";

export function MatchStatusBanner({
  phase,
  point,
  message,
}: {
  phase: MatchPhase;
  point?: number | null;
  message?: string;
}) {
  const defaultMessage =
    phase === "waiting"
      ? "Waiting for players…"
      : phase === "opening"
        ? "Opening roll — 7 or 11 wins instantly."
        : phase === "point"
          ? point != null
            ? `Point is ${point}. Hit the point to win; seven ends the round.`
            : "Point phase"
          : "Round complete";

  return (
    <div
      className={clsx(
        "rounded-2xl border px-5 py-4",
        phase === "resolved"
          ? "border-emerald-500/30 bg-emerald-950/30"
          : "border-white/10 bg-zinc-900/60",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Match status
      </p>
      <p className="mt-2 text-lg font-medium text-zinc-50">
        {message ?? defaultMessage}
      </p>
    </div>
  );
}
