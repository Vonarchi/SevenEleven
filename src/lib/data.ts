import type { CosmeticItem } from "@/components/cosmetics/CosmeticCard";
import type { LeaderboardRow } from "@/components/leaderboard/LeaderboardList";
import type { RoomListItem } from "@/types/rooms";
import { createClient } from "@/lib/supabase/server";

type SupabaseClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

type RoomRow = {
  id: string;
  room_code: string;
  mode: string;
  status: string;
  entry_fee: number;
  max_players: number;
  host_user_id: string;
  is_private: boolean;
};

export type RoomDetail = RoomListItem & {
  hostUserId: string;
  isPrivate: boolean;
  isCurrentUserMember: boolean;
};

export async function getSupabaseUser() {
  const supabase = await createClient();
  if (!supabase) {
    return { supabase: null, user: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

async function countRoomPlayers(supabase: SupabaseClient, roomId: string) {
  const { count } = await supabase
    .from("room_players")
    .select("id", { count: "exact", head: true })
    .eq("room_id", roomId);

  return count ?? 0;
}

function mapRoom(row: RoomRow, playerCount: number): RoomListItem {
  return {
    id: row.id,
    roomCode: row.room_code,
    mode: row.mode,
    status: row.status,
    entryFee: row.entry_fee,
    maxPlayers: row.max_players,
    playerCount,
  };
}

export async function getPublicRooms(): Promise<RoomListItem[]> {
  const { supabase } = await getSupabaseUser();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("rooms")
    .select("id, room_code, mode, status, entry_fee, max_players, host_user_id, is_private")
    .eq("is_private", false)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    return [];
  }

  const rooms = data as RoomRow[];
  const counts = await Promise.all(
    rooms.map((room) => countRoomPlayers(supabase, room.id)),
  );

  return rooms.map((room, index) => mapRoom(room, counts[index] ?? 0));
}

export async function getRoomByCode(roomCode: string): Promise<RoomDetail | null> {
  const { supabase, user } = await getSupabaseUser();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("rooms")
    .select("id, room_code, mode, status, entry_fee, max_players, host_user_id, is_private")
    .ilike("room_code", decodeURIComponent(roomCode))
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const room = data as RoomRow;
  const [playerCount, membership] = await Promise.all([
    countRoomPlayers(supabase, room.id),
    user
      ? supabase
          .from("room_players")
          .select("id")
          .eq("room_id", room.id)
          .eq("user_id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return {
    ...mapRoom(room, playerCount),
    hostUserId: room.host_user_id,
    isPrivate: room.is_private,
    isCurrentUserMember: Boolean(membership.data),
  };
}

export async function getWalletBalance(userId: string) {
  const { supabase } = await getSupabaseUser();
  if (!supabase) {
    return 0;
  }

  const { data } = await supabase
    .from("wallets")
    .select("coin_balance")
    .eq("user_id", userId)
    .maybeSingle();

  return Number(data?.coin_balance ?? 0);
}

export async function getCosmetics(userId: string) {
  const { supabase } = await getSupabaseUser();
  if (!supabase) {
    return { items: [] as CosmeticItem[], ownedIds: new Set<string>() };
  }

  const [cosmeticsResult, ownedResult] = await Promise.all([
    supabase
      .from("cosmetics")
      .select("id, name, rarity, price_coins")
      .eq("is_active", true)
      .order("price_coins", { ascending: true }),
    supabase
      .from("user_cosmetics")
      .select("cosmetic_id")
      .eq("user_id", userId),
  ]);

  const items = (cosmeticsResult.data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    rarity: item.rarity,
    priceCoins: item.price_coins,
  })) as CosmeticItem[];

  const ownedIds = new Set(
    (ownedResult.data ?? []).map((item) => item.cosmetic_id as string),
  );

  return { items, ownedIds };
}

export async function getDailyLeaderboard(currentUserId?: string) {
  const { supabase } = await getSupabaseUser();
  if (!supabase) {
    return [] as LeaderboardRow[];
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("leaderboards_daily")
    .select("user_id, wins, streak, ranking_score, profiles(username)")
    .eq("date", today)
    .order("ranking_score", { ascending: false })
    .limit(50);

  if (error || !data) {
    return [];
  }

  return data.map((row, index) => {
    const profile = Array.isArray(row.profiles)
      ? row.profiles[0]
      : row.profiles;

    return {
      rank: index + 1,
      username: profile?.username ?? `Player ${row.user_id.slice(0, 8)}`,
      wins: row.wins,
      streak: row.streak,
      highlight: row.user_id === currentUserId,
    };
  });
}

export async function getProfile(userId: string) {
  const { supabase } = await getSupabaseUser();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("username, avatar_url, level, xp, vip_status")
    .eq("id", userId)
    .maybeSingle();

  return data;
}
