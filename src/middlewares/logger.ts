import { NextRequest, NextResponse, NextFetchEvent } from "next/server";

export async function logMiddleware(req: NextRequest, event: NextFetchEvent) {
  // const ip = req.headers.get("x-forwarded-for") || "::1";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // console.log("req.headers", req);

  // Skip internal logger & asset
  if (
    req.url.includes("/api/logger") ||
    req.url.includes("/_next") ||
    req.url.includes("/static") ||
    req.url.includes("favicon.ico") ||
    req.url.includes(".well-known")
  ) {
    return NextResponse.next();
  }

  const start = Date.now();
  const res = NextResponse.next();

  event.waitUntil(
    (async () => {
      const duration = Date.now() - start;
      await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/logger`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: req.method,
            url: req.url,
            ip,
            ts: new Date().toISOString(),
            status: res.status,
            duration,
          }),
        }
      ).catch(() => {});
    })()
  );

  return res;
}
