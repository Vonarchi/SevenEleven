import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/Button";

export default function RoomNotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader variant="app" />
      <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          404
        </p>
        <h1 className="text-3xl font-semibold">Room not found</h1>
        <p className="text-sm text-zinc-400">
          That code may be private, expired, or mistyped. Try another room from the
          browser.
        </p>
        <Link href="/rooms">
          <Button className="px-8 py-3">Back to rooms</Button>
        </Link>
      </main>
    </div>
  );
}
