import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const authMiddleware = withAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    signOut: "/auth/signout",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
});

import type { NextRequest } from "next/server";

export async function accessPageMiddleware(req: NextRequest) {
  const url = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    raw: true, // optional, kalau mau token asli
  });

  if (token && url.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
