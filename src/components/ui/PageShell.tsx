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
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader variant="app" />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-2xl text-base text-zinc-400">{subtitle}</p>
          ) : null}
        </header>
        {children}
      </main>
    </div>
  );
}
