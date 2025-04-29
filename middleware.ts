// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Optional: define secret or get from env
const secret = process.env.AUTH_SECRET;
const protectedPrefixes = ["/docs", "/admin"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  
  console.log(token, "token")
  const isAuth = !!token;
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    req.nextUrl.pathname.startsWith(prefix)
  );

  if (isProtectedRoute && !isAuth) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/docs/:path*", "/admin/:path*"],
};