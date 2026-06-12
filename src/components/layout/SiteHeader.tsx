import Link from "next/link";
import clsx from "clsx";

const appNav = [
  { href: "/lobby", label: "Lobby" },
  { href: "/solo", label: "Solo" },
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
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#050705]/88 shadow-[0_8px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-wide text-amber-100"
        >
          <span className="casino-chip h-8 w-8 border-2 border-dashed border-amber-50/60 bg-gradient-to-br from-amber-300 to-amber-700 text-[10px] font-black text-[#1a1207] transition group-hover:rotate-12">
            7·11
          </span>
          <span className="hidden sm:inline">SEVEN ELEVEN</span>
        </Link>
        {variant === "app" ? (
          <nav className="hidden items-center gap-1 text-sm text-stone-400 md:flex">
            {appNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-amber-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : (
          <nav className="hidden text-xs font-medium uppercase tracking-[0.22em] text-stone-500 md:block">
            <span>Live rooms · Rankings · Rewards</span>
          </nav>
        )}
        <div className="flex items-center gap-2">
          <Link
            href="/auth"
            className={clsx(
              "rounded-lg px-3 py-1.5 text-xs font-medium sm:text-sm",
              variant === "marketing"
                ? "border border-amber-200/30 bg-gradient-to-b from-amber-200 to-amber-500 font-bold text-zinc-950 shadow-[0_0_20px_rgba(231,184,92,0.16)] hover:brightness-110"
                : "border border-white/10 text-stone-200 transition hover:border-amber-300/20 hover:bg-white/5",
            )}
          >
            {variant === "marketing" ? "Enter the club" : "Account"}
          </Link>
        </div>
      </div>
      {variant === "app" ? (
        <nav className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto px-3 pb-2 md:hidden">
          {appNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-stone-400 transition hover:bg-white/5 hover:text-amber-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
