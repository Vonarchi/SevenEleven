export function RoomListSkeleton() {
  return (
    <ul className="grid animate-pulse gap-3 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <li
          key={i}
          className="h-28 rounded-2xl border border-white/5 bg-zinc-900/40"
        />
      ))}
    </ul>
  );
}
