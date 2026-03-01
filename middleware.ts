// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoggedIn = req.cookies.get("isLoggedIn")?.value;

  // 1) Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // 2) Prevent logged-in users from visiting /login (or /register if you add it later)
  if (pathname === "/login" || pathname === "/register") {
    if (isLoggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"]
};
