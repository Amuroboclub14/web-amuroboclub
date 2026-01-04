import { NextResponse } from "next/server";

export function middleware(req) {
  const isAuth = req.cookies.get("auth")?.value;

  // Protect /admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (isAuth !== "true") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Redirect logged-in users away from login page
  if (req.nextUrl.pathname === "/login" && isAuth === "true") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

// Only run middleware on these routes
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
