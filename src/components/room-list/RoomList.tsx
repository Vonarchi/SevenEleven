import Link from "next/link";
import type { RoomListItem } from "@/types/rooms";

export function RoomList({ rooms }: { rooms: RoomListItem[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <li key={room.id}>
          <Link
            href={`/rooms/${room.roomCode}`}
            className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.045] to-transparent p-5 shadow-[inset_0_1px_rgba(255,255,255,0.04)] transition duration-200 hover:-translate-y-1 hover:border-amber-300/25 hover:bg-white/[0.05]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-semibold text-amber-200/90">
                {room.roomCode}
              </span>
              <span className="rounded-full border border-white/[0.06] bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-stone-400">
                {room.mode}
              </span>
            </div>
            <div className="my-5 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-stone-600">
                  Entry
                </p>
                <p className="mt-1 text-xl font-semibold text-stone-100">
                  {room.entryFee.toLocaleString()}{" "}
                  <span className="text-xs font-normal text-stone-500">coins</span>
                </p>
              </div>
              <span className="casino-chip h-11 w-11 border-2 border-amber-50/60 bg-gradient-to-br from-amber-300 to-amber-700 text-[10px] font-black text-stone-950">
                7·11
              </span>
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
              <span className="flex items-center gap-2 text-xs text-stone-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {room.playerCount}/{room.maxPlayers} seated
              </span>
              <span className="text-xs text-amber-200/60 transition group-hover:translate-x-1 group-hover:text-amber-200">
                Enter table →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
