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
        "rounded-2xl border px-5 py-4 shadow-[inset_0_1px_rgba(255,255,255,0.04)]",
        phase === "resolved"
          ? "border-emerald-500/30 bg-emerald-950/30"
          : "border-amber-200/10 bg-gradient-to-r from-amber-400/[0.06] to-transparent",
      )}
    >
      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-300/55">
        Match status
      </p>
      <p className="mt-2 text-lg font-medium text-stone-50">
        {message ?? defaultMessage}
      </p>
    </div>
  );
}
