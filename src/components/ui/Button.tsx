import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50",
        variant === "primary" &&
          "bg-gradient-to-b from-amber-300 to-amber-500 text-zinc-950 shadow-[0_0_24px_rgba(251,191,36,0.25)] hover:from-amber-200 hover:to-amber-400 focus-visible:outline-amber-300",
        variant === "ghost" &&
          "border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10 focus-visible:outline-white/30",
        variant === "danger" &&
          "border border-red-500/40 bg-red-950/40 text-red-100 hover:bg-red-950/60 focus-visible:outline-red-400",
        className,
      )}
      {...props}
    />
  );
}
