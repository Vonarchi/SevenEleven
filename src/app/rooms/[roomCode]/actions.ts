"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function joinRoom(formData: FormData) {
  const supabase = await createClient();
  const roomCode = String(formData.get("roomCode") ?? "");

  if (!supabase) {
    redirect(`/rooms/${encodeURIComponent(roomCode)}?error=Supabase%20is%20not%20configured`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth?next=/rooms/${encodeURIComponent(roomCode)}`);
  }

  const { data: room } = await supabase
    .from("rooms")
    .select("id, max_players")
    .ilike("room_code", roomCode)
    .maybeSingle();

  if (!room) {
    redirect("/rooms");
  }

  const { count } = await supabase
    .from("room_players")
    .select("id", { count: "exact", head: true })
    .eq("room_id", room.id);

  if ((count ?? 0) >= room.max_players) {
    redirect(`/rooms/${encodeURIComponent(roomCode)}?error=Room%20is%20full`);
  }

  const { error } = await supabase.from("room_players").upsert(
    {
      room_id: room.id,
      user_id: user.id,
      status: "joined",
    },
    { onConflict: "room_id,user_id" },
  );

  if (error) {
    redirect(`/rooms/${encodeURIComponent(roomCode)}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/rooms");
  revalidatePath(`/rooms/${roomCode}`);
  redirect(`/rooms/${encodeURIComponent(roomCode)}/play`);
}
