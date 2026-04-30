import { NextResponse } from "next/server";
import {
  resolveOpeningRoll,
  resolvePointPhaseRoll,
  rollDicePair,
  totalRoll,
} from "@/domain/game/sevenEleven";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

type MatchRow = {
  id: string;
  point_value: number | null;
  round_number: number;
};

async function recordLeaderboardResult(
  userId: string,
  result: "win" | "loss",
) {
  const service = createServiceClient();
  if (!service) {
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data: row } = await service
    .from("leaderboards_daily")
    .select("wins, losses, streak")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  const wins = Number(row?.wins ?? 0) + (result === "win" ? 1 : 0);
  const losses = Number(row?.losses ?? 0) + (result === "loss" ? 1 : 0);
  const streak = result === "win" ? Number(row?.streak ?? 0) + 1 : 0;

  await service.from("leaderboards_daily").upsert(
    {
      user_id: userId,
      date: today,
      wins,
      losses,
      streak,
      ranking_score: wins * 100 + streak * 15 - losses * 10,
    },
    { onConflict: "user_id,date" },
  );
}

function resultMessage(result: {
  phase: string;
  kind?: string;
  reason?: string;
  point?: number;
}) {
  if (result.phase === "point_set") {
    return `Point is ${result.point}. Keep rolling to hit it before a 7.`;
  }

  if (result.kind === "win") {
    return "Winner. The round resolved on the server.";
  }

  if (result.kind === "loss" && result.reason === "seven_out") {
    return "Seven out. The round resolved on the server.";
  }

  if (result.kind === "loss") {
    return "Craps. The round resolved on the server.";
  }

  return "Roll recorded. Keep going.";
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ roomCode: string }> },
) {
  const supabase = await createClient();
  const service = createServiceClient();

  if (!supabase || !service) {
    return NextResponse.json(
      { error: "Supabase is not fully configured." },
      { status: 501 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to roll." }, { status: 401 });
  }

  const { roomCode } = await params;
  const { data: room } = await supabase
    .from("rooms")
    .select("id, room_code")
    .ilike("room_code", decodeURIComponent(roomCode))
    .maybeSingle();

  if (!room) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }

  const { data: membership } = await supabase
    .from("room_players")
    .select("id")
    .eq("room_id", room.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json(
      { error: "Join the room before rolling." },
      { status: 403 },
    );
  }

  const { data: currentMatch } = await service
    .from("matches")
    .select("id, point_value, round_number")
    .eq("room_id", room.id)
    .neq("status", "resolved")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let match = currentMatch as MatchRow | null;

  if (!match) {
    const { data: createdMatch, error } = await service
      .from("matches")
      .insert({
        room_id: room.id,
        status: "in_progress",
        current_turn_user_id: user.id,
        round_number: 1,
      })
      .select("id, point_value, round_number")
      .single();

    if (error || !createdMatch) {
      return NextResponse.json(
        { error: error?.message ?? "Unable to create match." },
        { status: 500 },
      );
    }

    match = createdMatch as MatchRow;
  }

  const { count } = await service
    .from("rolls")
    .select("id", { count: "exact", head: true })
    .eq("match_id", match.id);

  const rollIndex = (count ?? 0) + 1;
  const dice = rollDicePair();
  const total = totalRoll(dice.dieOne, dice.dieTwo);
  const outcome =
    match.point_value == null
      ? resolveOpeningRoll(total)
      : resolvePointPhaseRoll(total, match.point_value);

  const { error: rollError } = await service.from("rolls").insert({
    match_id: match.id,
    user_id: user.id,
    die_one: dice.dieOne,
    die_two: dice.dieTwo,
    total,
    roll_index: rollIndex,
  });

  if (rollError) {
    return NextResponse.json({ error: rollError.message }, { status: 500 });
  }

  const update =
    outcome.phase === "point_set"
      ? { status: "in_progress", point_value: outcome.point }
      : outcome.kind === "win"
        ? {
            status: "resolved",
            winner_user_id: user.id,
            updated_at: new Date().toISOString(),
          }
        : outcome.kind === "loss"
          ? {
              status: "resolved",
              winner_user_id: null,
              updated_at: new Date().toISOString(),
            }
          : {
              status: "in_progress",
              updated_at: new Date().toISOString(),
            };

  await service.from("matches").update(update).eq("id", match.id);

  if ("kind" in outcome && outcome.kind === "win") {
    await recordLeaderboardResult(user.id, "win");
  } else if ("kind" in outcome && outcome.kind === "loss") {
    await recordLeaderboardResult(user.id, "loss");
  }

  return NextResponse.json({
    roomCode: room.room_code,
    dieOne: dice.dieOne,
    dieTwo: dice.dieTwo,
    total,
    outcome,
    message: resultMessage(outcome),
  });
}
