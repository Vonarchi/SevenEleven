import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";

export default function NewRoomPage() {
  return (
    <PageShell
      title="Create a room"
      subtitle="Hosts choose privacy, mode, entry fee, and player cap. Coins are reserved server-side when play begins."
    >
      <form className="flex max-w-xl flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
        <label className="flex flex-col gap-2 text-sm">
          <span>Visibility</span>
          <select className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-zinc-100">
            <option>Public</option>
            <option>Private (code)</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Mode</span>
          <select className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-zinc-100">
            <option>Classic 7–11</option>
            <option>Streak (Phase 2)</option>
            <option>King of the room (Phase 2)</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Entry fee (coins)</span>
          <input
            type="number"
            min={0}
            defaultValue={50}
            className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-zinc-100"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Max players</span>
          <input
            type="number"
            min={2}
            max={12}
            defaultValue={4}
            className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-zinc-100"
          />
        </label>
        <Button type="submit" className="mt-2 py-3">
          Generate room
        </Button>
        <p className="text-xs text-zinc-500">
          {/* TODO: POST to Edge Function: validate balance, insert rooms + room_players */}
          Submit handler not wired in this scaffold.
        </p>
      </form>
      <Link href="/rooms" className="text-sm text-amber-200/90 hover:underline">
        Back to rooms
      </Link>
    </PageShell>
  );
}
