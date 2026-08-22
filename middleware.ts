// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   const isLoggedIn = req.cookies.get("isLoggedIn")?.value;

//   // 1) Protect admin routes
//   if (pathname.startsWith("/admin")) {
//     if (!isLoggedIn) {
//       const url = req.nextUrl.clone();
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }
//   }

//   // 2) Prevent logged-in users from visiting /login (or /register if you add it later)
//   if (pathname === "/login" || pathname === "/register") {
//     if (isLoggedIn) {
//       const url = req.nextUrl.clone();
//       url.pathname = "/admin";
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/login", "/register"]
// };

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";

  // 1) Protect admin routes (e.g., /admin, /admin/dashboard, /admin/users)
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      // Use absolute URLs for redirects in Next.js
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 2) Redirect authenticated users away from auth pages
  const authPages = ["/login", "/register"];
  if (authPages.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Ensure we match the exact /admin path AND its children
  matcher: ["/admin", "/admin/:path*", "/login", "/register"],
};
