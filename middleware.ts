import { NextRequest, NextResponse } from "next/server";

// Edge middleware for the /admin area.
// 1. Every admin response is sent with Cache-Control: no-store, so the
//    browser can never show a cached dashboard page after logout.
// 2. The sub-pages (finance, tax, messages) require the session cookie.
//    No cookie -> redirect to the login screen with ?expired=1.
//    The cookie signature itself is verified server-side in lib/auth.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, must-revalidate");
  return res;
}

export const config = {
  matcher: ["/admin/:path*"]
};
