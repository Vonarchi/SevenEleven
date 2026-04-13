export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-zinc-400">
      <span
        className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400"
        aria-hidden
      />
      <p className="text-sm">{label}</p>
    </div>
  );
}
