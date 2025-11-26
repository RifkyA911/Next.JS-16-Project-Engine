import { axiosReq } from "@/utils/api";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google" // (for future OAuth)

declare module "next-auth" {
  interface User {
    accessToken?: string;
    role?: string;
  }
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      role?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize called with:", credentials);

        try {
          const req = await axiosReq({
            method: "POST",
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            url: "/api/example/auth/login",
            data: {
              email: credentials?.email,
              password: credentials?.password,
            },
          });

          const res = req.data; //req.data?.data ||

          const user = res.data.user;

          // console.log("res", res);
          if (res) {
            const result = {
              ...user,
              accessToken: res.token,
            };
            // console.log("result", result);
            return result;
          }
          return null;
        } catch (err) {
          console.error("Login error:", err);
          return null;
        }
        // throw new Error("Email atau password salah x");
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      // console.log("callback jwt", token);
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        // accessToken: token.accessToken as string,
        role: token.role as string,
        image:
          session.user?.image ||
          `https://ui-avatars.com/api/?name=${session.user?.name}&background=random&size=128`,
      };
      // console.log("callback session", session);
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
