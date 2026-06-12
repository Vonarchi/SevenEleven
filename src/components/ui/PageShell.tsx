import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <SiteHeader variant="app" />
      <div className="pointer-events-none absolute left-1/2 top-12 -z-10 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full bg-emerald-950/20 blur-3xl" />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
        <header className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-amber-300/65">
            Seven Eleven Club
          </p>
          <h1 className="display-type text-4xl text-stone-50 sm:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-2xl text-sm leading-6 text-stone-400 sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </header>
        {children}
      </main>
    </div>
  );
}
