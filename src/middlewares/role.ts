import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const userForbiddenRoutes: Record<string, string[]> = {
  administrator: ["!"], // "!" berarti semua route diizinkan
  user: ["/dashboard/users"], // user dilarang akses ini
  guest: ["/dashboard"], // contoh tambahan (kalau nanti ada)
};

export async function rbacMiddleware(req: NextRequest) {
  const url = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const role = token.role as string;
  const forbiddenRoutes = userForbiddenRoutes[role] ?? [];

  // Kalau role punya akses penuh, skip
  if (forbiddenRoutes.includes("!")) {
    return NextResponse.next();
  }

  // Cek apakah route yang diakses termasuk yang dilarang
  const isForbidden = forbiddenRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  if (isForbidden) {
    return NextResponse.redirect(new URL("/errors/403", req.url));
  }

  // Lolos semua check
  return NextResponse.next();
}
