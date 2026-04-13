import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-950/40 px-6 py-16 text-center">
      <p className="text-lg font-medium text-zinc-200">{title}</p>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-zinc-500">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
