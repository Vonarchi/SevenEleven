/**
 * Central place for public env reads. Server-only secrets stay in route handlers.
 * When Supabase is not configured, auth middleware becomes a no-op so `npm run dev` works.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export const appName = "7–11 Multiplayer Dice";
