export function ErrorState({
  title,
  message,
}: {
  title: string;
  message?: string;
}) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-500/30 bg-red-950/30 px-5 py-4 text-red-50"
    >
      <p className="font-semibold">{title}</p>
      {message ? <p className="mt-1 text-sm text-red-200/90">{message}</p> : null}
    </div>
  );
}
