import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isUserRoute  = path.startsWith("/users");

  // Not logged in → block protected areas
  if (!user && (isAdminRoute || isUserRoute)) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  if (user) {
    const role = (user.app_metadata as any)?.role ?? "user";

    // Wrong area → bounce to correct dashboard
    if (isAdminRoute && role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/users/dashboard";
      return NextResponse.redirect(url);
    }
    if (isUserRoute && role === "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }

    // Optional: prevent logged-in users visiting /auth/*
    if (path.startsWith("/auth")) {
      const url = req.nextUrl.clone();
      url.pathname = role === "admin" ? "/admin/dashboard" : "/users/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/users/:path*", "/auth/:path*"],
};
