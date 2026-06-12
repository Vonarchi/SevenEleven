"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type Outcome =
  | { phase: "opening"; kind: "win" | "loss"; reason: string }
  | { phase: "point_set"; point: number }
  | {
      phase: "point";
      kind: "win" | "loss" | "continue";
      point: number;
      total?: number;
      reason?: string;
    };

type RollResult = {
  dieOne: number;
  dieTwo: number;
  total: number;
  outcome: Outcome;
  message: string;
};

type RollHistory = RollResult & { id: number };

const pipPositions: Record<number, string[]> = {
  1: ["center"],
  2: ["top-left", "bottom-right"],
  3: ["top-left", "center", "bottom-right"],
  4: ["top-left", "top-right", "bottom-left", "bottom-right"],
  5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
  6: [
    "top-left",
    "top-right",
    "middle-left",
    "middle-right",
    "bottom-left",
    "bottom-right",
  ],
};

const pipClasses: Record<string, string> = {
  "top-left": "left-[22%] top-[22%]",
  "top-right": "right-[22%] top-[22%]",
  "middle-left": "left-[22%] top-1/2 -translate-y-1/2",
  "middle-right": "right-[22%] top-1/2 -translate-y-1/2",
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  "bottom-left": "bottom-[22%] left-[22%]",
  "bottom-right": "bottom-[22%] right-[22%]",
};

function DiceFace({
  value,
  rolling,
  delay = 0,
}: {
  value: number;
  rolling: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className="relative h-24 w-24 rounded-[1.45rem] border border-white/80 bg-gradient-to-br from-white via-stone-100 to-stone-300 shadow-[inset_0_2px_2px_white,inset_0_-5px_10px_rgba(90,70,35,0.18),0_22px_35px_rgba(0,0,0,0.4)] sm:h-32 sm:w-32 sm:rounded-[1.8rem]"
      animate={
        rolling
          ? {
              rotate: [0, 90, 190, 300, 360],
              rotateX: [0, 180, 330, 540, 720],
              rotateY: [0, -160, -340, -520, -720],
              y: [0, -42, -18, -5, 0],
              scale: [1, 0.92, 1.06, 0.98, 1],
            }
          : { rotate: 0, rotateX: 0, rotateY: 0, y: 0, scale: 1 }
      }
      transition={{ duration: 0.9, delay, ease: [0.2, 0.75, 0.25, 1] }}
    >
      {pipPositions[value].map((position) => (
        <span
          key={position}
          className={`absolute h-[15%] w-[15%] rounded-full bg-gradient-to-br from-[#1a211e] to-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] ${pipClasses[position]}`}
        />
      ))}
    </motion.div>
  );
}

function playTone(kind: "roll" | "win" | "loss") {
  const AudioContextClass =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = kind === "roll" ? "triangle" : "sine";
  oscillator.frequency.setValueAtTime(
    kind === "win" ? 520 : kind === "loss" ? 180 : 110,
    now,
  );
  oscillator.frequency.exponentialRampToValueAtTime(
    kind === "win" ? 880 : kind === "loss" ? 90 : 70,
    now + (kind === "roll" ? 0.18 : 0.4),
  );
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.11, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + (kind === "roll" ? 0.2 : 0.45),
  );

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.5);
}

export function DiceTable({
  roomCode,
  endpoint,
  solo = false,
}: {
  roomCode: string;
  endpoint?: string;
  solo?: boolean;
}) {
  const [rolling, setRolling] = useState(false);
  const [dice, setDice] = useState({ dieOne: 5, dieTwo: 6 });
  const [point, setPoint] = useState<number | null>(null);
  const [message, setMessage] = useState(
    "The table is open. Roll 7 or 11 to win on the come-out.",
  );
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<"win" | "loss" | null>(null);
  const [history, setHistory] = useState<RollHistory[]>([]);
  const [wins, setWins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    if (!solo) return;
    const stored = window.localStorage.getItem("seven-eleven-solo-stats");
    if (!stored) return;

    try {
      const stats = JSON.parse(stored) as { wins?: number; streak?: number };
      setWins(Number(stats.wins ?? 0));
      setStreak(Number(stats.streak ?? 0));
    } catch {
      window.localStorage.removeItem("seven-eleven-solo-stats");
    }
  }, [solo]);

  function saveStats(nextWins: number, nextStreak: number) {
    if (!solo) return;
    window.localStorage.setItem(
      "seven-eleven-solo-stats",
      JSON.stringify({ wins: nextWins, streak: nextStreak }),
    );
  }

  function resetRound() {
    setPoint(null);
    setResult(null);
    setError(null);
    setMessage("New round. Roll 7 or 11 to win on the come-out.");
  }

  async function handleRoll() {
    if (result) {
      resetRound();
      return;
    }

    setRolling(true);
    setError(null);
    setDice({
      dieOne: 1 + Math.floor(Math.random() * 6),
      dieTwo: 1 + Math.floor(Math.random() * 6),
    });
    if (soundOn) playTone("roll");

    try {
      const responsePromise = fetch(
        endpoint ?? `/api/rooms/${encodeURIComponent(roomCode)}/roll`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ point }),
        },
      );
      const [response] = await Promise.all([
        responsePromise,
        new Promise((resolve) => setTimeout(resolve, 900)),
      ]);
      const payload = (await response.json()) as RollResult & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "The table could not complete the roll.");
      }

      setDice({ dieOne: payload.dieOne, dieTwo: payload.dieTwo });
      setMessage(payload.message);
      setHistory((current) =>
        [{ ...payload, id: Date.now() }, ...current].slice(0, 8),
      );

      if (payload.outcome.phase === "point_set") {
        setPoint(payload.outcome.point);
      }

      if (
        payload.outcome.phase === "opening" ||
        payload.outcome.phase === "point"
      ) {
        if (payload.outcome.kind === "win") {
          const nextWins = wins + 1;
          const nextStreak = streak + 1;
          setWins(nextWins);
          setStreak(nextStreak);
          setResult("win");
          saveStats(nextWins, nextStreak);
          if (soundOn) playTone("win");
        } else if (payload.outcome.kind === "loss") {
          setStreak(0);
          setResult("loss");
          saveStats(wins, 0);
          if (soundOn) playTone("loss");
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The table could not complete the roll.",
      );
    } finally {
      setRolling(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <section className="overflow-hidden rounded-[2rem] border border-amber-200/20 bg-[#080a08] shadow-[0_30px_100px_rgba(0,0,0,0.5),0_0_80px_rgba(12,90,64,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.025] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-stone-500">
                {solo ? "Private practice" : "Live room"}
              </p>
              <p className="font-mono text-sm font-semibold text-amber-100">
                {roomCode}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Server verified
            </span>
            <button
              type="button"
              onClick={() => setSoundOn((current) => !current)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 transition hover:text-stone-100"
              aria-label={soundOn ? "Mute table sounds" : "Enable table sounds"}
            >
              Sound {soundOn ? "on" : "off"}
            </button>
          </div>
        </div>

        <div className="felt-surface relative min-h-[32rem] overflow-hidden px-4 py-8 sm:px-8 sm:py-10">
          <div className="pointer-events-none absolute inset-4 rounded-[40%] border border-amber-200/15 sm:inset-6" />
          <div className="pointer-events-none absolute inset-7 rounded-[40%] border border-white/[0.045] sm:inset-10" />
          <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 text-center opacity-[0.13]">
            <p className="display-type text-5xl text-amber-100 sm:text-7xl">7 · 11</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.55em] text-amber-100">
              Social Dice Club
            </p>
          </div>

          <AnimatePresence>
            {result === "win" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-x-0 top-20 z-20 text-center"
              >
                <p className="display-type gold-text text-5xl sm:text-7xl">Winner</p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="relative z-10 flex min-h-[27rem] flex-col items-center justify-center">
            <div className="mb-7 flex min-h-16 items-center justify-center">
              {point ? (
                <div className="casino-chip h-16 w-16 border-amber-50/70 bg-gradient-to-br from-red-600 to-red-950 text-xl font-black text-white">
                  {point}
                </div>
              ) : (
                <div className="rounded-full border border-amber-200/20 bg-black/20 px-5 py-2 text-center backdrop-blur">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-200/60">
                    Come-out roll
                  </p>
                  <p className="mt-0.5 text-xs text-stone-300">7 or 11 wins</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 [perspective:900px] sm:gap-7">
              <DiceFace value={dice.dieOne} rolling={rolling} />
              <DiceFace value={dice.dieTwo} rolling={rolling} delay={0.06} />
            </div>

            <div className="mt-8 min-h-16 text-center">
              <p
                className={`mx-auto max-w-lg text-base font-medium leading-6 sm:text-lg ${
                  error
                    ? "text-red-200"
                    : result === "win"
                      ? "text-amber-100"
                      : result === "loss"
                        ? "text-red-200"
                        : "text-stone-200"
                }`}
              >
                {error ?? message}
              </p>
              {!error && history[0] ? (
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">
                  Last roll · {history[0].total}
                </p>
              ) : null}
            </div>

            <Button
              className="mt-3 min-w-52 px-10 py-3.5 text-base uppercase tracking-[0.14em]"
              onClick={handleRoll}
              disabled={rolling}
            >
              {rolling
                ? "Dice in motion"
                : result
                  ? "Play next round"
                  : point
                    ? `Roll for ${point}`
                    : "Roll the dice"}
            </Button>
          </div>
        </div>
      </section>

      <aside className="flex flex-col gap-4">
        <div className="glass-panel rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300/65">
            Session
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3">
              <p className="text-2xl font-semibold tabular-nums text-stone-50">
                {wins}
              </p>
              <p className="text-xs text-stone-500">Wins</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3">
              <p className="text-2xl font-semibold tabular-nums text-amber-200">
                {streak}
              </p>
              <p className="text-xs text-stone-500">Streak</p>
            </div>
          </div>
        </div>

        <div className="glass-panel min-h-64 flex-1 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300/65">
              Roll history
            </p>
            {history.length ? (
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-[10px] uppercase tracking-wider text-stone-600 hover:text-stone-300"
              >
                Clear
              </button>
            ) : null}
          </div>
          {history.length ? (
            <ol className="mt-4 space-y-2">
              {history.map((roll) => (
                <li
                  key={roll.id}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2"
                >
                  <span className="text-xs text-stone-500">
                    {roll.dieOne} + {roll.dieTwo}
                  </span>
                  <span className="font-mono text-sm font-bold text-stone-200">
                    {roll.total}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="flex h-48 items-center justify-center text-center">
              <p className="max-w-40 text-xs leading-5 text-stone-600">
                Your rolls will appear here once the dice hit the felt.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
          <p className="text-xs leading-5 text-stone-500">
            Opening 7 or 11 wins. A 2, 3, or 12 ends the round. Any other total
            becomes your point: hit it again before rolling 7.
          </p>
        </div>
      </aside>
    </div>
  );
}
