"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

/**
 * Premium dice table shell.
 * TODO: Replace placeholder dice with React Three Fiber + Rapier/Cannon physics.
 * TODO: Cinematic camera rig, slow-mo settle, suspense delay before reveal.
 * TODO: Win particles + haptics (where supported).
 */
export function DiceTable({
  roomCode,
  onRoll,
}: {
  roomCode: string;
  onRoll?: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-[0_0_80px_rgba(0,0,0,0.45)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(251,191,36,0.12), transparent 40%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.06), transparent 35%)",
        }}
      />
      <div className="relative flex flex-col gap-8 px-6 py-10 sm:px-10 sm:py-14">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Room
            </p>
            <p className="font-mono text-lg text-amber-100/90">{roomCode}</p>
          </div>
          <p className="text-sm text-zinc-400">
            Server-validated rolls · Social multiplayer dice
          </p>
        </div>

        <div className="mx-auto flex aspect-[16/9] w-full max-w-3xl items-center justify-center rounded-2xl border border-emerald-900/40 bg-[radial-gradient(ellipse_at_center,_#0f2922_0%,_#050806_70%)]">
          <motion.div
            className="flex h-32 w-32 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/80 text-4xl shadow-xl"
            animate={{ rotateX: [0, 18, -10, 0], rotateY: [0, -22, 14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            🎲
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button
            className="min-w-[200px] px-8 py-3 text-base"
            onClick={onRoll}
          >
            Roll
          </Button>
          <p className="max-w-md text-center text-xs text-zinc-500">
            Official outcomes and coin changes are applied on the server after
            validation. The client animates the confirmed result.
          </p>
        </div>
      </div>
    </div>
  );
}
