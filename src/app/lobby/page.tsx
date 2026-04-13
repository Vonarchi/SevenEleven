import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export default async function LobbyPage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <PageShell
      title="Lobby"
      subtitle="Pick solo practice or jump into a live room. Entry uses virtual coins only."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
          <div>
            <h2 className="text-xl font-semibold">Solo practice</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Learn the flow with no room dependency. Official rolls still route
              through server validation in production.
            </p>
          </div>
          <Link href="/rooms" className="mt-6">
            <Button className="w-full py-3">Open solo table</Button>
          </Link>
          <p className="mt-2 text-xs text-zinc-500">
            {/* TODO: Dedicated /solo route + server roll endpoint */}
            Temporary: routes to rooms index until solo mode ships.
          </p>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
          <div>
            <h2 className="text-xl font-semibold">Multiplayer rooms</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Join public rooms or create a private code for friends and
              creators.
            </p>
          </div>
          <Link href="/rooms" className="mt-6">
            <Button variant="ghost" className="w-full py-3">
              Browse rooms
            </Button>
          </Link>
        </div>
      </div>
      <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-950/40 p-5 text-sm text-zinc-400">
        Signed in as{" "}
        <span className="font-mono text-zinc-200">
          {user?.email ?? "unknown"}
        </span>
        . Profile sync will pull from Supabase once schema is applied.
      </div>
    </PageShell>
  );
}
