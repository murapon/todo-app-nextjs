import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { prisma } from "./prisma";

/**
 * 完全な認証設定（Node.jsランタイム用）
 * ※ DBアクセスを含むcallbacksはここに記述
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        // ユーザーをDBに保存（存在しなければ作成）
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name || "",
            googleId: account.providerAccountId,
          },
          create: {
            email: user.email,
            name: user.name || "",
            googleId: account.providerAccountId,
          },
        });
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        // セッションにユーザーIDを追加
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },
  },
});
