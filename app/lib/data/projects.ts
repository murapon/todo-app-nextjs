import { prisma } from "../prisma";

/**
 * ユーザーに紐づくプロジェクト一覧を取得
 */
export async function getProjectsByUserId(userId: string) {
  return prisma.project.findMany({
    where: {
      userId: userId,
      deletedAt: null,
    },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * プロジェクトIDからプロジェクトを取得
 */
export async function getProjectById(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
  });
}

// 取得結果の型をエクスポート
export type Project = NonNullable<Awaited<ReturnType<typeof getProjectById>>>;

