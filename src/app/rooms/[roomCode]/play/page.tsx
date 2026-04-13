import { DiceTable } from "@/components/dice-table/DiceTable";
import { MatchStatusBanner } from "@/components/match-status/MatchStatusBanner";
import { PageShell } from "@/components/ui/PageShell";
import { mockRooms } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default async function PlayPage({
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
      title="Table"
      subtitle="Cinematic dice surface with server-confirmed outcomes."
    >
      <MatchStatusBanner phase="opening" />
      <DiceTable roomCode={room.roomCode} />
    </PageShell>
  );
}
