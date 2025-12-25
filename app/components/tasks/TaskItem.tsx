import Link from "next/link";
import type { TaskWithProject } from "@/app/lib/data/tasks";

type Props = {
  task: TaskWithProject;
};

export function TaskItem({ task }: Props) {
  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <Link href={`/tasks/${task.id}`} className="block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge status={task.status} />
            <span className="font-medium text-gray-900">{task.title}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="rounded bg-gray-100 px-2 py-1">
              {task.project.name}
            </span>
            <span>優先度: {task.priority}</span>
            {task.dueDate && (
              <span>
                期限: {new Date(task.dueDate).toLocaleDateString("ja-JP")}
              </span>
            )}
          </div>
        </div>
        {task.description && (
          <p className="mt-2 text-sm text-gray-600">{task.description}</p>
        )}
      </Link>
    </li>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorClass =
    status === "done"
      ? "bg-green-500"
      : status === "doing"
        ? "bg-yellow-500"
        : "bg-gray-300";

  return <span className={`inline-block h-3 w-3 rounded-full ${colorClass}`} />;
}

