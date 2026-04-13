import Link from "next/link";
import type { RoomListItem } from "@/types/rooms";

export function RoomList({ rooms }: { rooms: RoomListItem[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {rooms.map((room) => (
        <li key={room.id}>
          <Link
            href={`/rooms/${room.roomCode}`}
            className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900/50 p-4 transition hover:border-amber-400/30 hover:bg-zinc-900"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm text-amber-200/90">
                {room.roomCode}
              </span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
                {room.mode}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Entry {room.entryFee} coins · {room.playerCount}/{room.maxPlayers}{" "}
              players
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
