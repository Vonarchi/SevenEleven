/**
 * Pure, deterministic 7–11 rules for server-side validation.
 * Client animations must reflect outcomes produced here (or equivalent server logic).
 */

export type OpeningOutcome =
  | { phase: "opening"; kind: "win"; reason: "seven_or_eleven" }
  | { phase: "opening"; kind: "loss"; reason: "craps" }
  | { phase: "point_set"; point: number };

export type PointPhaseOutcome =
  | { phase: "point"; kind: "win"; point: number }
  | { phase: "point"; kind: "loss"; reason: "seven_out"; point: number }
  | { phase: "point"; kind: "continue"; point: number; total: number };

export function rollDicePair(): { dieOne: number; dieTwo: number } {
  const dieOne = 1 + Math.floor(Math.random() * 6);
  const dieTwo = 1 + Math.floor(Math.random() * 6);
  return { dieOne, dieTwo };
}

export function totalRoll(dieOne: number, dieTwo: number): number {
  return dieOne + dieTwo;
}

export function resolveOpeningRoll(total: number): OpeningOutcome {
  if (total === 7 || total === 11) {
    return { phase: "opening", kind: "win", reason: "seven_or_eleven" };
  }
  if (total === 2 || total === 3 || total === 12) {
    return { phase: "opening", kind: "loss", reason: "craps" };
  }
  return { phase: "point_set", point: total };
}

export function resolvePointPhaseRoll(
  total: number,
  point: number,
): PointPhaseOutcome {
  if (total === point) {
    return { phase: "point", kind: "win", point };
  }
  if (total === 7) {
    return { phase: "point", kind: "loss", reason: "seven_out", point };
  }
  return { phase: "point", kind: "continue", point, total };
}
