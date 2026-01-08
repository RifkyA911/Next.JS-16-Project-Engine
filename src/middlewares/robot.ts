import { NextRequest, NextResponse } from "next/server";

export function robotConfig(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Block search engine indexing for /dashboard and sub-paths via X-Robots-Tag
  if (pathname.startsWith("/dashboard")) {
    const res = NextResponse.next();
    res.headers.set("x-robots-tag", "noindex, nofollow");
    return res;
  }

  return NextResponse.next();
}
