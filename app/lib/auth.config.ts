import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Middleware用の認証設定（Edgeランタイム互換）
 * ※ PrismaなどのNode.js専用モジュールは使用しない
 */
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublicPath =
        nextUrl.pathname === "/login" ||
        nextUrl.pathname.startsWith("/api/auth");

      if (!isLoggedIn && !isPublicPath) {
        return false; // ログインページにリダイレクト
      }

      return true;
    },
  },
};

