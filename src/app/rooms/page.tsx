import Link from "next/link";
import { RoomList } from "@/components/room-list/RoomList";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublicRooms } from "@/lib/data";

export default async function RoomsPage() {
  const rooms = await getPublicRooms();

  return (
    <PageShell
      title="Public rooms"
      subtitle="Match on codes, see live status, and join when seats open."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          Showing live public rooms from Supabase.
        </p>
        <Link href="/rooms/new">
          <Button className="w-full sm:w-auto">Create room</Button>
        </Link>
      </div>
      {rooms.length === 0 ? (
        <EmptyState
          title="No public rooms yet"
          description="Be the first host — set a mode, entry fee, and room code."
          action={
            <Link href="/rooms/new">
              <Button>Create room</Button>
            </Link>
          }
        />
      ) : (
        <RoomList rooms={rooms} />
      )}
    </PageShell>
  );
}
