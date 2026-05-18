import { NextRequest, NextResponse } from "next/server";

const ALLOWED_IPS = [
  "192.168.1.34",
  "::1",
];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  let ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "";

  console.log("IP detectada:", ip);

  if (!ALLOWED_IPS.includes(ip)) {
    return NextResponse.redirect(new URL("/no-autorizado", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};