import Link from "next/link";
import { getTasksByUserIdPaginated } from "./lib/data/tasks";
import { TaskListInfinite } from "./components/tasks/TaskListInfinite";

// 仮のユーザーID
const TEMP_USER_ID = "ebf4a9d7-a7ef-4566-a838-e437d6f27bb7";

export default async function TaskListPage() {
  const { tasks, hasMore, totalCount } = await getTasksByUserIdPaginated(
    TEMP_USER_ID,
    1
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">タスク一覧</h1>
          <Link
            href="/tasks/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            新規タスク
          </Link>
        </div>

        <TaskListInfinite
          initialTasks={tasks}
          initialHasMore={hasMore}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
