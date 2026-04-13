import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchStatusBanner } from "@/components/match-status/MatchStatusBanner";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { mockRooms } from "@/lib/mock-data";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode } = await params;
  const room = mockRooms.find(
    (r) => r.roomCode.toLowerCase() === decodeURIComponent(roomCode).toLowerCase(),
  );

  if (!room) {
    notFound();
  }

  return (
    <PageShell
      title={`Room ${room.roomCode}`}
      subtitle="Invite players, confirm entry, and start when everyone is ready."
    >
      <MatchStatusBanner phase="waiting" />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={`/rooms/${encodeURIComponent(room.roomCode)}/play`}>
          <Button className="w-full px-8 py-3 sm:w-auto">Enter table</Button>
        </Link>
        <Button variant="ghost" className="w-full sm:w-auto">
          Copy room code
        </Button>
      </div>
      <p className="text-sm text-zinc-500">
        {/* TODO: Supabase Realtime channel for room_players + match rows */}
        Live presence and host controls will subscribe here.
      </p>
    </PageShell>
  );
}
