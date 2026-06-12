import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/Button";

const tableStats = [
  { value: "24/7", label: "Open tables" },
  { value: "< 1s", label: "Verified rolls" },
  { value: "0", label: "Cash-out mechanics" },
];

const features = [
  {
    number: "01",
    title: "A table with presence",
    body: "Tactile dice, rich sound, responsive motion, and the suspense of a live result without the clutter of a sportsbook.",
  },
  {
    number: "02",
    title: "Bring your circle",
    body: "Host public or private rooms, share a short code, and turn every point into a social moment.",
  },
  {
    number: "03",
    title: "Status worth chasing",
    body: "Daily rankings, streaks, collectible dice, table themes, and VIP identity built around play.",
  },
];

function HeroDie({
  value,
  className,
}: {
  value: "seven" | "eleven";
  className: string;
}) {
  const pips =
    value === "seven"
      ? [
          ["left-[23%] top-[23%]", "right-[23%] bottom-[23%]"],
          [
            "left-[23%] top-[23%]",
            "right-[23%] top-[23%]",
            "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "left-[23%] bottom-[23%]",
            "right-[23%] bottom-[23%]",
          ],
        ]
      : [
          [
            "left-[23%] top-[23%]",
            "right-[23%] top-[23%]",
            "left-[23%] bottom-[23%]",
            "right-[23%] bottom-[23%]",
            "left-[23%] top-1/2 -translate-y-1/2",
            "right-[23%] top-1/2 -translate-y-1/2",
          ],
          [
            "left-[23%] top-[23%]",
            "right-[23%] top-[23%]",
            "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "left-[23%] bottom-[23%]",
            "right-[23%] bottom-[23%]",
          ],
        ];

  return (
    <div className={`flex gap-3 ${className}`}>
      {pips.map((face, index) => (
        <div
          key={index}
          className="relative h-24 w-24 rounded-[1.4rem] border border-white/80 bg-gradient-to-br from-white via-stone-100 to-stone-300 shadow-[inset_0_2px_white,inset_0_-6px_12px_rgba(70,45,10,0.18),0_25px_50px_rgba(0,0,0,0.5)] sm:h-32 sm:w-32"
        >
          {face.map((position) => (
            <span
              key={position}
              className={`absolute h-[15%] w-[15%] rounded-full bg-[#111713] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] ${position}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col overflow-hidden">
      <SiteHeader variant="marketing" />
      <main className="flex flex-1 flex-col">
        <section className="relative isolate px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:pt-24">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[42rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(12,92,65,0.28),transparent_65%)]" />
          <div className="pointer-events-none absolute right-[-12rem] top-10 -z-10 h-96 w-96 rounded-full border border-amber-200/10" />
          <div className="pointer-events-none absolute right-[-8rem] top-14 -z-10 h-80 w-80 rounded-full border border-amber-200/[0.06]" />

          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
            <div>
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-10 bg-amber-300/60" />
                <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-amber-200/70">
                  The social dice club
                </p>
              </div>
              <h1 className="display-type max-w-3xl text-6xl leading-[0.92] text-stone-50 sm:text-7xl lg:text-[6.6rem]">
                Make every
                <span className="gold-text block italic">roll a moment.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-stone-400 sm:text-lg">
                A cinematic 7–11 table built for friends, rivals, and late-night
                streaks. Server-verified rolls. Live rooms. Pure social play.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/solo">
                  <Button className="w-full px-8 py-3.5 text-sm uppercase tracking-[0.12em] sm:w-auto">
                    Play instantly
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button
                    variant="ghost"
                    className="w-full px-8 py-3.5 text-sm sm:w-auto"
                  >
                    Join live rooms
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/[0.07] pt-6">
                {tableStats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-lg font-semibold text-stone-100">
                      {stat.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-stone-600">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-14 -z-10 rounded-full bg-emerald-800/10 blur-3xl" />
              <div className="glass-panel relative aspect-[5/4] overflow-hidden rounded-[2.5rem] p-4 sm:p-6">
                <div className="felt-surface relative flex h-full items-center justify-center overflow-hidden rounded-[2rem] border border-amber-100/15">
                  <div className="absolute inset-5 rounded-[40%] border border-amber-100/20" />
                  <div className="absolute inset-9 rounded-[40%] border border-white/[0.06]" />
                  <div className="absolute left-1/2 top-10 -translate-x-1/2 text-center opacity-20">
                    <p className="display-type text-5xl text-amber-100">7 · 11</p>
                    <p className="text-[8px] font-bold uppercase tracking-[0.42em] text-amber-100">
                      Private table
                    </p>
                  </div>
                  <HeroDie value="seven" className="float-slow relative z-10" />
                  <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.2em] text-stone-300">
                      Table open
                    </span>
                  </div>
                </div>
              </div>
              <div className="casino-chip absolute -bottom-5 -right-3 h-20 w-20 rotate-12 border-amber-50/70 bg-gradient-to-br from-red-500 to-red-950 text-sm font-black text-white sm:-right-8 sm:h-24 sm:w-24">
                7·11
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.06] bg-black/20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300/65">
                Built for the room
              </p>
              <h2 className="display-type mt-4 text-4xl text-stone-100 sm:text-5xl">
                The energy of a premium table,
                <span className="text-stone-500"> wherever you are.</span>
              </h2>
            </div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.number}
                  className="group bg-[#080a08] p-7 transition hover:bg-[#0c100d] sm:p-9"
                >
                  <p className="font-mono text-xs text-amber-300/50">
                    {feature.number}
                  </p>
                  <h3 className="mt-10 text-xl font-semibold text-stone-100">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-stone-500">
                    {feature.body}
                  </p>
                  <div className="mt-8 h-px w-10 bg-amber-300/30 transition-all group-hover:w-20 group-hover:bg-amber-300/70" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 sm:py-28">
          <div className="felt-surface relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-amber-200/15 px-6 py-14 text-center shadow-[0_30px_100px_rgba(0,0,0,0.3)] sm:px-12 sm:py-20">
            <div className="absolute inset-5 rounded-[2rem] border border-white/[0.05]" />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-200/65">
                Your seat is open
              </p>
              <h2 className="display-type mx-auto mt-4 max-w-2xl text-5xl text-stone-50 sm:text-6xl">
                Learn the table in one roll.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-emerald-50/55">
                Start in private practice, then take your streak into live rooms
                when you are ready.
              </p>
              <Link href="/solo" className="mt-8 inline-block">
                <Button className="px-9 py-3.5 uppercase tracking-[0.12em]">
                  Take your seat
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] px-4 py-7 text-center text-xs text-stone-600 sm:px-6">
        Seven Eleven is social entertainment using virtual coins with no cash value
        or redemption.
      </footer>
    </div>
  );
}
