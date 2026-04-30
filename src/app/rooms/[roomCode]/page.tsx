import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchStatusBanner } from "@/components/match-status/MatchStatusBanner";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { getRoomByCode } from "@/lib/data";
import { joinRoom } from "@/app/rooms/[roomCode]/actions";

export default async function RoomDetailPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ error?: string }>;
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode } = await params;
  const { error } = await searchParams;
  const room = await getRoomByCode(roomCode);

  if (!room) {
    notFound();
  }

  return (
    <PageShell
      title={`Room ${room.roomCode}`}
      subtitle="Invite players, confirm entry, and start when everyone is ready."
    >
      <MatchStatusBanner phase="waiting" />
      {error ? <ErrorState title="Room action failed" message={error} /> : null}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5 text-sm text-zinc-300">
        <p>
          Entry {room.entryFee} coins · {room.playerCount}/{room.maxPlayers} players ·{" "}
          {room.isPrivate ? "Private" : "Public"} · {room.status}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        {room.isCurrentUserMember ? (
          <Link href={`/rooms/${encodeURIComponent(room.roomCode)}/play`}>
            <Button className="w-full px-8 py-3 sm:w-auto">Enter table</Button>
          </Link>
        ) : (
          <form action={joinRoom}>
            <input type="hidden" name="roomCode" value={room.roomCode} />
            <Button type="submit" className="w-full px-8 py-3 sm:w-auto">
              Join room
            </Button>
          </form>
        )}
        <Button variant="ghost" className="w-full sm:w-auto">
          Copy room code
        </Button>
      </div>
    </PageShell>
  );
}
