import { type NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { getSessionFromMiddleware } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = [
  "/lobby",
  "/rooms",
  "/store",
  "/leaderboard",
  "/profile",
  "/vip",
];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  const session = await getSessionFromMiddleware(request);
  if (!session) {
    return NextResponse.next();
  }

  const { response, user } = session;

  if (!user && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
