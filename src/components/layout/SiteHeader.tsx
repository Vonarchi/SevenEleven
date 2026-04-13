import Link from "next/link";
import clsx from "clsx";

const appNav = [
  { href: "/lobby", label: "Lobby" },
  { href: "/rooms", label: "Rooms" },
  { href: "/store", label: "Store" },
  { href: "/leaderboard", label: "Rankings" },
  { href: "/profile", label: "Profile" },
  { href: "/vip", label: "VIP" },
];

export function SiteHeader({
  variant = "app",
}: {
  variant?: "marketing" | "app";
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-amber-200/90"
        >
          7–11 Dice
        </Link>
        {variant === "app" ? (
          <nav className="hidden items-center gap-1 text-sm text-zinc-400 md:flex">
            {appNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-1.5 hover:bg-white/5 hover:text-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : (
          <nav className="hidden text-sm text-zinc-400 md:block">
            <span className="text-zinc-500">Social rooms · Rankings · Cosmetics</span>
          </nav>
        )}
        <div className="flex items-center gap-2">
          <Link
            href="/auth"
            className={clsx(
              "rounded-lg px-3 py-1.5 text-xs font-medium sm:text-sm",
              variant === "marketing"
                ? "bg-gradient-to-b from-amber-300 to-amber-500 font-semibold text-zinc-950 shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:from-amber-200 hover:to-amber-400"
                : "border border-white/10 text-zinc-200 hover:bg-white/5",
            )}
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
