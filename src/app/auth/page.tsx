import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { isSupabaseConfigured } from "@/lib/env";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader variant="marketing" />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-12">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to claim daily rewards, join rooms, and sync your wallet.
          </p>
        </div>
        {!configured ? (
          <ErrorState
            title="Supabase is not configured"
            message="Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local (see .env.local.example). Without keys, middleware skips auth and protected routes stay reachable for local UI work."
          />
        ) : null}
        <form className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-zinc-300">Email</span>
            <input
              type="email"
              name="email"
              required
              disabled={!configured}
              className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-amber-400/0 transition focus:ring-2 focus:ring-amber-400/40 disabled:opacity-50"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-zinc-300">Password</span>
            <input
              type="password"
              name="password"
              disabled={!configured}
              className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-amber-400/0 transition focus:ring-2 focus:ring-amber-400/40 disabled:opacity-50"
              placeholder="••••••••"
            />
          </label>
          <Button type="submit" className="mt-2 w-full py-3" disabled={!configured}>
            Continue
          </Button>
          <p className="text-center text-xs text-zinc-500">
            {/* TODO: Wire Supabase Auth (magic link or password) via server action */}
            Form submit is not yet connected to Supabase in this scaffold.
          </p>
        </form>
        <p className="text-center text-sm text-zinc-500">
          After sign-in you&apos;ll return to{" "}
          <span className="font-mono text-zinc-300">{next ?? "/lobby"}</span>.
        </p>
        <p className="text-center text-sm">
          <Link href="/" className="text-amber-200/90 hover:underline">
            Back to landing
          </Link>
        </p>
      </main>
    </div>
  );
}
