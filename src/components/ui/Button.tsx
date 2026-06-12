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
        "inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold tracking-[0.01em] transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-45",
        variant === "primary" &&
          "shine border border-amber-200/40 bg-gradient-to-b from-[#ffe2a0] via-[#e9b956] to-[#b87a27] text-[#1a1207] shadow-[inset_0_1px_rgba(255,255,255,0.65),0_8px_28px_rgba(185,122,39,0.2)] hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-amber-300 active:translate-y-0",
        variant === "ghost" &&
          "border border-white/12 bg-white/[0.045] text-stone-100 shadow-[inset_0_1px_rgba(255,255,255,0.05)] hover:-translate-y-0.5 hover:border-amber-200/25 hover:bg-white/[0.08] focus-visible:outline-white/30 active:translate-y-0",
        variant === "danger" &&
          "border border-red-500/40 bg-red-950/40 text-red-100 hover:bg-red-950/60 focus-visible:outline-red-400",
        className,
      )}
      {...props}
    />
  );
}
