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
      id: "credentials",
      name: "credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "reCAPTCHA Token", type: "text" },
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
              recaptchaToken: credentials?.recaptchaToken,
            },
          });

          const res = req.data;
          console.log("API Response:", res);

          const user = res.data?.user;

          if (res && user) {
            const result = {
              ...user,
              accessToken: res.token,
            };
            console.log("NextAuth will return:", result);
            return result;
          }
          
          console.log("No user found in response");
          return null;
        } catch (err) {
          console.error("Login error:", err);
          return null;
        }
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
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
