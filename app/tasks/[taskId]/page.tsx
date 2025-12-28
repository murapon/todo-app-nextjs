import Link from "next/link";
import { notFound } from "next/navigation";
import { getTaskById } from "../../lib/data/tasks";
import { TaskDetail } from "../../components/tasks/TaskDetail";

type Props = {
  params: Promise<{ taskId: string }>;
};

export default async function TaskDetailPage({ params }: Props) {
  const { taskId } = await params;
  const task = await getTaskById(taskId);

  if (!task) {
    notFound();
  }

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

        <h1 className="mb-6 text-3xl font-bold text-gray-900">タスク詳細</h1>

        <TaskDetail task={task} />
      </div>
    </div>
  );
}
