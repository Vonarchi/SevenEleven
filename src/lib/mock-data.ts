import type { RoomListItem } from "@/types/rooms";
import type { CosmeticItem } from "@/components/cosmetics/CosmeticCard";
import type { LeaderboardRow } from "@/components/leaderboard/LeaderboardList";

/** Placeholder data until Supabase queries wire up. */
export const mockRooms: RoomListItem[] = [
  {
    id: "1",
    roomCode: "GOLD-42",
    mode: "classic",
    status: "waiting",
    entryFee: 50,
    maxPlayers: 4,
    playerCount: 2,
  },
  {
    id: "2",
    roomCode: "VIP-909",
    mode: "classic",
    status: "in_progress",
    entryFee: 200,
    maxPlayers: 6,
    playerCount: 5,
  },
];

export const mockLeaderboard: LeaderboardRow[] = [
  { rank: 1, username: "DiceQueen", wins: 42, streak: 7 },
  { rank: 2, username: "LuckyFox", wins: 38, streak: 3 },
  { rank: 3, username: "RoomHost", wins: 31, streak: 0, highlight: true },
];

export const mockCosmetics: CosmeticItem[] = [
  {
    id: "c1",
    name: "Obsidian dice",
    rarity: "rare",
    priceCoins: 1200,
  },
  {
    id: "c2",
    name: "Championship table",
    rarity: "legendary",
    priceCoins: 4500,
  },
  {
    id: "c3",
    name: "Neon pips",
    rarity: "common",
    priceCoins: 350,
  },
];
