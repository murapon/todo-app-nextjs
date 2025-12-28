import { prisma } from "../prisma";

// 1ページあたりの件数
export const TASKS_PER_PAGE = 20;

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
 * ユーザーに紐づくタスク一覧をページネーション付きで取得
 */
export async function getTasksByUserIdPaginated(
  userId: string,
  page: number = 1,
  perPage: number = TASKS_PER_PAGE
) {
  const skip = (page - 1) * perPage;

  const [tasks, totalCount] = await Promise.all([
    prisma.task.findMany({
      where: {
        project: {
          userId: userId,
        },
        deletedAt: null,
      },
      include: {
        project: true,
      },
      // IDでもソートして順序を安定させる（ページング用）
      orderBy: [{ priority: "asc" }, { dueDate: "asc" }, { id: "asc" }],
      skip,
      take: perPage,
    }),
    prisma.task.count({
      where: {
        project: {
          userId: userId,
        },
        deletedAt: null,
      },
    }),
  ]);

  return {
    tasks,
    totalCount,
    hasMore: skip + tasks.length < totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / perPage),
  };
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

