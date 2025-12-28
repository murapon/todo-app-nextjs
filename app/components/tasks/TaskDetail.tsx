import Link from "next/link";
import type { TaskWithProject } from "../../lib/data/tasks";
import { DeleteTaskButton } from "./DeleteTaskButton";

type Props = {
  task: TaskWithProject;
};

export function TaskDetail({ task }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* ヘッダー */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <StatusBadge status={task.status} />
          <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/tasks/${task.id}/edit`}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            編集
          </Link>
          <DeleteTaskButton taskId={task.id} taskTitle={task.title} />
        </div>
      </div>

      {/* 詳細情報 */}
      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-gray-500">プロジェクト</dt>
          <dd className="mt-1 text-gray-900">{task.project.name}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-500">ステータス</dt>
          <dd className="mt-1">
            <StatusLabel status={task.status} />
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-500">優先度</dt>
          <dd className="mt-1 text-gray-900">
            <PriorityLabel priority={task.priority} />
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-500">期限</dt>
          <dd className="mt-1 text-gray-900">
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString("ja-JP")
              : "未設定"}
          </dd>
        </div>
      </dl>

      {/* 説明 */}
      {task.description && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-500">詳細メモ</h3>
          <p className="mt-2 whitespace-pre-wrap text-gray-900">
            {task.description}
          </p>
        </div>
      )}

      {/* メタ情報 */}
      <div className="mt-6 border-t border-gray-200 pt-6 text-xs text-gray-400">
        <p>作成日時: {new Date(task.createdAt).toLocaleString("ja-JP")}</p>
        <p>更新日時: {new Date(task.updatedAt).toLocaleString("ja-JP")}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorClass =
    status === "done"
      ? "bg-green-500"
      : status === "doing"
        ? "bg-yellow-500"
        : "bg-gray-300";

  return <span className={`inline-block h-4 w-4 rounded-full ${colorClass}`} />;
}

function StatusLabel({ status }: { status: string }) {
  const labels: Record<string, { text: string; className: string }> = {
    todo: { text: "未着手", className: "bg-gray-100 text-gray-700" },
    doing: { text: "進行中", className: "bg-yellow-100 text-yellow-700" },
    done: { text: "完了", className: "bg-green-100 text-green-700" },
  };
  const label = labels[status] || labels.todo;

  return (
    <span className={`rounded-full px-3 py-1 text-sm ${label.className}`}>
      {label.text}
    </span>
  );
}

function PriorityLabel({ priority }: { priority: number }) {
  const labels: Record<number, { text: string; bgClass: string; dotClass: string }> = {
    1: { text: "最高", bgClass: "bg-red-100 text-red-700", dotClass: "bg-red-500" },
    2: { text: "高", bgClass: "bg-orange-100 text-orange-700", dotClass: "bg-orange-500" },
    3: { text: "中", bgClass: "bg-yellow-100 text-yellow-700", dotClass: "bg-yellow-500" },
    4: { text: "低", bgClass: "bg-green-100 text-green-700", dotClass: "bg-green-500" },
    5: { text: "最低", bgClass: "bg-gray-100 text-gray-500", dotClass: "bg-gray-400" },
  };
  const label = labels[priority] || { text: `${priority}`, bgClass: "bg-gray-100 text-gray-700", dotClass: "bg-gray-400" };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm ${label.bgClass}`}>
      <span className={`h-2 w-2 rounded-full ${label.dotClass}`} />
      {label.text}
    </span>
  );
}

