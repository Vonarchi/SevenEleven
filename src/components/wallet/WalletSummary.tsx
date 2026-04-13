import clsx from "clsx";

export function WalletSummary({
  balance,
  className,
}: {
  balance: number;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-zinc-950 px-5 py-4",
        className,
      )}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-amber-200/70">
          Coin balance
        </p>
        <p className="mt-1 text-3xl font-semibold tabular-nums text-zinc-50">
          {balance.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Virtual coins for rooms, cosmetics, and rewards. No cash value.
        </p>
      </div>
    </div>
  );
}
