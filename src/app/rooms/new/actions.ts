"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function createRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const parts = Array.from({ length: 6 }, () => {
    const index = Math.floor(Math.random() * alphabet.length);
    return alphabet[index];
  });

  return parts.join("");
}

export async function createRoom(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/rooms/new?error=Supabase%20is%20not%20configured");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/rooms/new");
  }

  const isPrivate = formData.get("visibility") === "private";
  const mode = String(formData.get("mode") ?? "classic");
  const entryFee = Math.max(0, Number(formData.get("entryFee") ?? 0));
  const maxPlayers = Math.min(12, Math.max(2, Number(formData.get("maxPlayers") ?? 2)));

  let lastError: string | null = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const roomCode = createRoomCode();
    const { data: room, error } = await supabase
      .from("rooms")
      .insert({
        room_code: roomCode,
        host_user_id: user.id,
        mode,
        is_private: isPrivate,
        entry_fee: entryFee,
        max_players: maxPlayers,
      })
      .select("id, room_code")
      .single();

    if (error) {
      lastError = error.message;
      continue;
    }

    await supabase.from("room_players").insert({
      room_id: room.id,
      user_id: user.id,
      status: "joined",
    });

    redirect(`/rooms/${encodeURIComponent(room.room_code)}`);
  }

  redirect(`/rooms/new?error=${encodeURIComponent(lastError ?? "Unable to create room")}`);
}
