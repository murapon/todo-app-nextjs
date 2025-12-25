import { prisma } from "../prisma";

/**
 * ユーザーに紐づくタスク一覧を取得
 */
export async function getTasksByUserId(userId: string) {
  return prisma.task.findMany({
    where: {
      project: {
        userId: userId,
      },
      deletedAt: null,
    },
    include: {
      project: true,
    },
    orderBy: [{ priority: "asc" }, { dueDate: "asc" }],
  });
}

/**
 * タスクIDからタスクを取得
 */
export async function getTaskById(taskId: string) {
  return prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: true,
    },
  });
}

// 取得結果の型をエクスポート
export type TaskWithProject = NonNullable<
  Awaited<ReturnType<typeof getTaskById>>
>;

