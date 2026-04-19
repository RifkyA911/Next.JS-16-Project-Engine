import { NextRequest, NextResponse } from "next/server";
import { SignOptions } from "jsonwebtoken";
import { logRequest, logError } from "@/lib/logger";
import { signJWTToken } from "@/lib/jwt";
import { comparePassword, DEMO_USERS } from "@/lib/auth-utils";
import { createRateLimitMiddleware, authLimiter } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  const start = Date.now();
  let status = 200;

  // Rate limiting check
  const rateLimitResponse = await createRateLimitMiddleware(authLimiter)(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await req.json();
    const { username, email, password, recaptchaToken } = body;

    if ((!email && !username) || !password) {
      status = 400;
      return NextResponse.json({ error: "Bad Request Data" }, { status });
    }

    // Validate reCAPTCHA token
    if (!recaptchaToken) {
      status = 400;
      return NextResponse.json({ error: "reCAPTCHA token is required" }, { status });
    }

    // Verify reCAPTCHA token (you would need to implement this with Google's API)
    // For demo purposes, we'll skip actual verification
    // In production, you should verify with Google's reCAPTCHA API

    // Find the user
    const user = DEMO_USERS.find(
      (u: typeof DEMO_USERS[0]) => u.username === username || u.email === email
    );
    if (!user) {
      status = 401;
      return NextResponse.json({ error: "User does not exist" }, { status });
    }

    // ✅ Secure password check with bcrypt
    if (
      (user.username === username || user.email === email) &&
      await comparePassword(password, user.password)
    ) {
      const responsePayload = {
        user,
      };
      const options: SignOptions = {
        expiresIn: (process.env.NEXT_PUBLIC_JWT_EXPIRES_IN ||
          "1h") as SignOptions["expiresIn"],
      };
      const token = signJWTToken(responsePayload, options);

      const response = NextResponse.json(
        {
          message: "Login successful",
          token,
          data: responsePayload,
        },
        { status }
      );

      // Set cookie
      let maxAge = 3600; // default 1h
      const jwtExpiresIn = process.env.NEXT_PUBLIC_JWT_EXPIRES_IN ?? "1h";
      const match = jwtExpiresIn.match(/^(\d+)([smhd])$/);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
        switch (unit) {
          case "s":
            maxAge = value;
            break;
          case "m":
            maxAge = value * 60;
            break;
          case "h":
            maxAge = value * 60 * 60;
            break;
          case "d":
            maxAge = value * 60 * 60 * 24;
            break;
        }
      }
      response.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge,
        path: "/",
      });

      return response;
    }

    // Invalid credentials
    status = 401;
    logError(`Failed login attempt for ${email || username}`, 'login');
    return NextResponse.json({ error: "Invalid credentials" }, { status });
  } catch (err: any) {
    status = 500;
    logError(err, 'login');
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status }
    );
  } finally {
    logRequest(req, status, start);
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "GET /example/auth/login method not supported" },
    { status: 405 }
  );
}
