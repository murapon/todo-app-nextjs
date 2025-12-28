"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteTask } from "../../lib/actions/tasks";

type Props = {
  taskId: string;
  taskTitle: string;
};

export function DeleteTaskButton({ taskId, taskTitle }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTask(taskId);
      if (result.success) {
        router.push("/");
      } else {
        alert(result.error || "削除に失敗しました");
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-red-100 px-4 py-2 text-sm text-red-700 hover:bg-red-200"
      >
        削除
      </button>

      {/* 削除確認ダイアログ */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">タスクを削除</h3>
            <p className="mt-2 text-gray-600">
              「{taskTitle}」を削除しますか？
            </p>
            <p className="mt-1 text-sm text-gray-500">
              この操作は取り消せません。
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-400"
              >
                {isPending ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

