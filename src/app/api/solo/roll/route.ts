import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import {
  resolveOpeningRoll,
  resolvePointPhaseRoll,
  totalRoll,
} from "@/domain/game/sevenEleven";

function messageForOutcome(
  outcome:
    | ReturnType<typeof resolveOpeningRoll>
    | ReturnType<typeof resolvePointPhaseRoll>,
) {
  if (outcome.phase === "point_set") {
    return `Point established at ${outcome.point}. Hit it again before a 7.`;
  }
  if (outcome.kind === "win") {
    return outcome.phase === "opening"
      ? "Natural winner. 7 or 11 on the come-out."
      : `Point made. ${outcome.point} wins the round.`;
  }
  if (outcome.kind === "loss") {
    return outcome.reason === "seven_out"
      ? "Seven out. The round belongs to the house."
      : "Craps on the come-out. Reset and take another shot.";
  }
  return `${outcome.total} rolls through. The point is still ${outcome.point}.`;
}

export async function POST(request: Request) {
  let requestedPoint: unknown = null;

  try {
    const body = (await request.json()) as { point?: unknown };
    requestedPoint = body.point;
  } catch {
    requestedPoint = null;
  }

  const point =
    typeof requestedPoint === "number" &&
    Number.isInteger(requestedPoint) &&
    requestedPoint >= 4 &&
    requestedPoint <= 10 &&
    requestedPoint !== 7
      ? requestedPoint
      : null;

  const dieOne = randomInt(1, 7);
  const dieTwo = randomInt(1, 7);
  const total = totalRoll(dieOne, dieTwo);
  const outcome =
    point === null
      ? resolveOpeningRoll(total)
      : resolvePointPhaseRoll(total, point);

  return NextResponse.json({
    dieOne,
    dieTwo,
    total,
    outcome,
    message: messageForOutcome(outcome),
  });
}
