import Link from "next/link";
import { notFound } from "next/navigation";
import { getTaskById } from "../../../lib/data/tasks";
import { getProjectsByUserId } from "../../../lib/data/projects";
import { TaskForm } from "../../../components/tasks/TaskForm";

// 仮のユーザーID
const TEMP_USER_ID = "ebf4a9d7-a7ef-4566-a838-e437d6f27bb7";

type Props = {
  params: Promise<{ taskId: string }>;
};

export default async function TaskEditPage({ params }: Props) {
  const { taskId } = await params;

  const [task, projects] = await Promise.all([
    getTaskById(taskId),
    getProjectsByUserId(TEMP_USER_ID),
  ]);

  if (!task) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-6">
          <Link
            href={`/tasks/${taskId}`}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← タスク詳細に戻る
          </Link>
        </div>

        <h1 className="mb-6 text-3xl font-bold text-gray-900">タスク編集</h1>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <TaskForm projects={projects} task={task} />
        </div>
      </div>
    </div>
  );
}
