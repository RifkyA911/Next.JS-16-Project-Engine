import { NextRequest, NextResponse } from "next/server";
import { SignOptions } from "jsonwebtoken";
import { logRequest } from "@/lib/logger";
import { signJWTToken } from "@/lib/jwt";

const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    username: "admin",
    role: "administrator",
    name: "Admin User",
    password: "123456",
    image:
      "https://wallpapers.com/images/high/anime-profile-picture-jioug7q8n43yhlwn.jpg",
    bio: "I am the admin user.",
    is_active: true,
    is_verified: true,
    created_at: new Date(),
    updated_at: new Date(),
    last_login: new Date(),
  },
  {
    id: "2",
    email: "user@example.com",
    username: "user",
    role: "user",
    name: "Dummy User",
    password: "123456",
    image:
      "https://wallpapers.com/images/high/anime-profile-picture-jioug7q8n43yhlwn.jpg",
    bio: "I am the user.",
    is_active: true,
    is_verified: true,
    created_at: new Date(),
    updated_at: new Date(),
    last_login: new Date(),
  },
];

export async function POST(req: NextRequest) {
  const start = Date.now();
  let status = 200;

  try {
    const body = await req.json();
    const { username, email, password } = body;

    if ((!email && !username) || !password) {
      status = 400;
      return NextResponse.json({ error: "Bad Request Data" }, { status });
    }

    // Find the user
    const user = mockUsers.find(
      (u) => u.username === username || u.email === email
    );
    if (!user) {
      status = 401;
      return NextResponse.json({ error: "User does not exist" }, { status });
    }

    // ✅ Dummy password check
    if (
      (user.username === username || user.email === email) &&
      user.password === password
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
    return NextResponse.json({ error: "Invalid credentials" }, { status });
  } catch (err: any) {
    status = 500;
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
