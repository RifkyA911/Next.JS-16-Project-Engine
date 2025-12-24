import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const { method, url, ip, status, duration, ts } = await req.json();

    // Format log
    logger.info(`[${ip}] ${method} ${url} [${status}] ${duration}ms @ ${ts}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Pastikan error logging juga tercatat
    logger.error(`Logger API error: ${(err as Error).message}`);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
export async function GET() {
  return NextResponse.json({ ok: true });
}
