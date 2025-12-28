import Link from "next/link";
import { getProjectsByUserId } from "../../lib/data/projects";
import { TaskForm } from "../../components/tasks/TaskForm";

// 仮のユーザーID
const TEMP_USER_ID = "ebf4a9d7-a7ef-4566-a838-e437d6f27bb7";

export default async function TaskNewPage() {
  const projects = await getProjectsByUserId(TEMP_USER_ID);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← タスク一覧に戻る
          </Link>
        </div>

        <h1 className="mb-6 text-3xl font-bold text-gray-900">タスク作成</h1>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <TaskForm projects={projects} />
        </div>
      </div>
    </div>
  );
}
