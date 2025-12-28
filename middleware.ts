import NextAuth from "next-auth";
import { authConfig } from "./app/lib/auth.config";

/**
 * Middleware用の認証チェック
 * ※ authConfigのみを使用（Prisma不使用でEdge互換）
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // 静的ファイル以外のすべてのパスに適用
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
