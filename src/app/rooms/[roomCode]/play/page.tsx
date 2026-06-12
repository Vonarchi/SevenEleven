import { DiceTable } from "@/components/dice-table/DiceTable";
import { MatchStatusBanner } from "@/components/match-status/MatchStatusBanner";
import { PageShell } from "@/components/ui/PageShell";
import { getRoomByCode } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";
import { notFound } from "next/navigation";

export default async function PlayPage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode } = await params;
  const room = await getRoomByCode(roomCode);

  if (!room) {
    notFound();
  }

  return (
    <PageShell
      title="Table"
      subtitle="Cinematic dice surface with server-confirmed outcomes."
    >
      <MatchStatusBanner phase="opening" />
      <DiceTable
        roomCode={room.roomCode}
        endpoint={isSupabaseConfigured() ? undefined : "/api/solo/roll"}
      />
    </PageShell>
  );
}
