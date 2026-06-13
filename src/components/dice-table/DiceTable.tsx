"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./DiceTable.module.css";

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

type MotionPermissionState = "idle" | "enabled" | "denied" | "unsupported";

type DeviceMotionEventWithPermission = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<PermissionState>;
};

const SHAKE_ROLL_THRESHOLD = 26;
const SHAKE_COOLDOWN_MS = 1400;
const SHAKE_IDLE_RESET_MS = 160;

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

const dieFaces = [
  { value: 1, className: styles.front },
  { value: 6, className: styles.back },
  { value: 3, className: styles.right },
  { value: 4, className: styles.left },
  { value: 2, className: styles.top },
  { value: 5, className: styles.bottom },
];

const restingRotations: Record<number, { rotateX: number; rotateY: number }> = {
  1: { rotateX: -14, rotateY: 18 },
  2: { rotateX: -104, rotateY: 18 },
  3: { rotateX: -14, rotateY: -72 },
  4: { rotateX: -14, rotateY: 108 },
  5: { rotateX: 76, rotateY: 18 },
  6: { rotateX: -14, rotateY: 198 },
};

function PipFace({ value, className }: { value: number; className: string }) {
  return (
    <div className={`${styles.face} ${className}`} aria-hidden="true">
      {pipPositions[value].map((position) => (
        <span
          key={position}
          className={`${styles.pip} ${pipClasses[position]}`}
        />
      ))}
    </div>
  );
}

function DiceFace({
  value,
  rolling,
  delay = 0,
}: {
  value: number;
  rolling: boolean;
  delay?: number;
}) {
  const resting = restingRotations[value];

  return (
    <div
      className={styles.scene}
      role="img"
      aria-label={`Die showing ${value}`}
    >
      <motion.div
        className={styles.dieMotion}
        animate={
          rolling
            ? {
                y: [0, -46, -24, -7, 0],
                x: [0, 8, -7, 3, 0],
                scale: [1, 0.94, 1.05, 0.98, 1],
                rotateZ: [0, 12, -9, 5, 0],
              }
            : { y: 0, x: 0, scale: 1, rotateZ: 0 }
        }
        transition={{ duration: 0.9, delay, ease: [0.2, 0.75, 0.25, 1] }}
      >
        <motion.div
          className={styles.cube}
          animate={
            rolling
              ? {
                  rotateX: [
                    resting.rotateX,
                    resting.rotateX + 190,
                    resting.rotateX + 390,
                    resting.rotateX + 590,
                    resting.rotateX + 720,
                  ],
                  rotateY: [
                    resting.rotateY,
                    resting.rotateY - 170,
                    resting.rotateY - 350,
                    resting.rotateY - 540,
                    resting.rotateY - 720,
                  ],
                }
              : resting
          }
          transition={{
            duration: 0.9,
            delay,
            ease: [0.2, 0.75, 0.25, 1],
          }}
        >
          {dieFaces.map((face) => (
            <PipFace
              key={face.value}
              value={face.value}
              className={face.className}
            />
          ))}
        </motion.div>
      </motion.div>
      <motion.span
        className={styles.shadow}
        aria-hidden="true"
        animate={
          rolling
            ? {
                opacity: [0.5, 0.16, 0.28, 0.42, 0.5],
                scale: [1, 0.62, 0.72, 0.9, 1],
              }
            : { opacity: 0.5, scale: 1 }
        }
        transition={{ duration: 0.9, delay, ease: "easeOut" }}
      />
    </div>
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

function pulseHaptics(pattern: number | number[]) {
  if (!("vibrate" in navigator)) return;
  navigator.vibrate(pattern);
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
  const [motionPermission, setMotionPermission] =
    useState<MotionPermissionState>("idle");
  const [shakeEnabled, setShakeEnabled] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [shakeMessage, setShakeMessage] = useState(
    "Enable phone motion to shake the dice.",
  );
  const handleRollRef = useRef<() => void>(() => {});
  const rollingRef = useRef(false);
  const lastMotionRef = useRef<{
    x: number;
    y: number;
    z: number;
    at: number;
  } | null>(null);
  const lastShakeAtRef = useRef(0);

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

  const saveStats = useCallback((nextWins: number, nextStreak: number) => {
    if (!solo) return;
    window.localStorage.setItem(
      "seven-eleven-solo-stats",
      JSON.stringify({ wins: nextWins, streak: nextStreak }),
    );
  }, [solo]);

  const resetRound = useCallback(() => {
    setPoint(null);
    setResult(null);
    setError(null);
    setMessage("New round. Roll 7 or 11 to win on the come-out.");
  }, []);

  const handleRoll = useCallback(async () => {
    if (rolling) return;

    if (result) {
      resetRound();
      setShakeMessage("Round reset. Shake again to roll.");
      pulseHaptics(16);
      return;
    }

    setRolling(true);
    setError(null);
    setShakeIntensity(0);
    setShakeMessage("Dice are flying across the felt.");
    setDice({
      dieOne: 1 + Math.floor(Math.random() * 6),
      dieTwo: 1 + Math.floor(Math.random() * 6),
    });
    if (soundOn) playTone("roll");
    pulseHaptics(24);

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
          pulseHaptics([30, 45, 55]);
        } else if (payload.outcome.kind === "loss") {
          setStreak(0);
          setResult("loss");
          saveStats(wins, 0);
          if (soundOn) playTone("loss");
          pulseHaptics(80);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The table could not complete the roll.",
      );
    } finally {
      setRolling(false);
      setShakeMessage("Shake again when you are ready.");
    }
  }, [
    endpoint,
    point,
    resetRound,
    result,
    rolling,
    roomCode,
    saveStats,
    soundOn,
    streak,
    wins,
  ]);

  useEffect(() => {
    rollingRef.current = rolling;
  }, [rolling]);

  useEffect(() => {
    handleRollRef.current = () => {
      void handleRoll();
    };
  }, [handleRoll]);

  async function enableShakeToRoll() {
    if (!("DeviceMotionEvent" in window)) {
      setMotionPermission("unsupported");
      setShakeMessage("Motion controls are not available in this browser.");
      return;
    }

    const MotionEventClass =
      DeviceMotionEvent as DeviceMotionEventWithPermission;

    if (typeof MotionEventClass.requestPermission === "function") {
      try {
        const permission = await MotionEventClass.requestPermission();
        if (permission !== "granted") {
          setMotionPermission("denied");
          setShakeEnabled(false);
          setShakeMessage("Motion permission was denied. Use the roll button.");
          return;
        }
      } catch {
        setMotionPermission("denied");
        setShakeEnabled(false);
        setShakeMessage("Motion permission failed. Use the roll button.");
        return;
      }
    }

    lastMotionRef.current = null;
    lastShakeAtRef.current = 0;
    setMotionPermission("enabled");
    setShakeEnabled(true);
    setShakeMessage("Shake the phone like real dice in your hand.");
    pulseHaptics(18);
  }

  useEffect(() => {
    if (!shakeEnabled || motionPermission !== "enabled") return;

    let resetTimer: ReturnType<typeof window.setTimeout> | null = null;

    function onDeviceMotion(event: DeviceMotionEvent) {
      const acceleration =
        event.accelerationIncludingGravity ?? event.acceleration;
      if (!acceleration) return;

      const x = acceleration.x ?? 0;
      const y = acceleration.y ?? 0;
      const z = acceleration.z ?? 0;
      const now = Date.now();
      const previous = lastMotionRef.current;
      lastMotionRef.current = { x, y, z, at: now };

      if (!previous || now - previous.at > SHAKE_IDLE_RESET_MS) return;

      const delta =
        Math.abs(x - previous.x) +
        Math.abs(y - previous.y) +
        Math.abs(z - previous.z);
      const intensity = Math.min(100, Math.round((delta / 38) * 100));
      setShakeIntensity((current) => Math.max(current * 0.72, intensity));

      if (resetTimer) {
        window.clearTimeout(resetTimer);
      }
      resetTimer = window.setTimeout(() => setShakeIntensity(0), 260);

      if (
        delta >= SHAKE_ROLL_THRESHOLD &&
        now - lastShakeAtRef.current > SHAKE_COOLDOWN_MS
      ) {
        if (rollingRef.current) {
          setShakeMessage("Dice are already in motion.");
          return;
        }

        lastShakeAtRef.current = now;
        setShakeMessage("Shake detected. Rolling...");
        pulseHaptics([18, 28, 18]);
        handleRollRef.current();
      }
    }

    window.addEventListener("devicemotion", onDeviceMotion);

    return () => {
      window.removeEventListener("devicemotion", onDeviceMotion);
      if (resetTimer) {
        window.clearTimeout(resetTimer);
      }
    };
  }, [motionPermission, shakeEnabled]);

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
            <button
              type="button"
              onClick={() => {
                if (shakeEnabled) {
                  setShakeEnabled(false);
                  setShakeIntensity(0);
                  setShakeMessage("Shake controls are paused.");
                  return;
                }
                void enableShakeToRoll();
              }}
              className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                shakeEnabled
                  ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-100"
                  : "border-white/10 bg-white/5 text-stone-400 hover:text-stone-100"
              }`}
              aria-pressed={shakeEnabled}
            >
              Shake {shakeEnabled ? "on" : "off"}
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

            <div className="mt-5 w-full max-w-md rounded-2xl border border-white/[0.08] bg-black/25 p-4 text-center backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300/70">
                    Shake to roll
                  </p>
                  <p className="mt-1 text-xs text-stone-400">{shakeMessage}</p>
                </div>
                <span
                  className={`h-3 w-3 shrink-0 rounded-full ${
                    shakeEnabled
                      ? "animate-pulse bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]"
                      : motionPermission === "denied" ||
                          motionPermission === "unsupported"
                        ? "bg-red-300"
                        : "bg-stone-600"
                  }`}
                  aria-hidden="true"
                />
              </div>
              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]"
                aria-hidden="true"
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-red-300"
                  animate={{ width: `${shakeIntensity}%` }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                />
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-stone-600">
                Button stays active as fallback
              </p>
            </div>
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
