import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuth = req.cookies.get("skilp_auth")?.value === "1";

  const publicPaths = ["/login", "/api/login", "/api/logout", "/api/health"];
  const isPublic = publicPaths.some(p => pathname.startsWith(p));

  if (!isAuth && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};