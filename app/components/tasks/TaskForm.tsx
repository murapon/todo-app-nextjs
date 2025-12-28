"use client";

import { useActionState } from "react";
import {
  createTask,
  updateTask,
  type TaskFormState,
} from "../../lib/actions/tasks";
import type { Project } from "../../lib/data/projects";
import type { TaskWithProject } from "../../lib/data/tasks";

type Props = {
  projects: Project[];
  task?: TaskWithProject; // 編集時は既存タスクを渡す
};

const initialState: TaskFormState = {};

export function TaskForm({ projects, task }: Props) {
  const isEditMode = !!task;

  // 編集時はupdateTask、新規時はcreateTaskを使用
  const actionWithId = isEditMode
    ? updateTask.bind(null, task.id)
    : createTask;

  const [state, formAction, isPending] = useActionState(
    actionWithId,
    initialState
  );

  // 日付をYYYY-MM-DD形式に変換
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* 一般エラー */}
      {state.errors?.general && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {state.errors.general.join(", ")}
        </div>
      )}

      {/* タイトル */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={task?.title || ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="タスクのタイトルを入力"
        />
        {state.errors?.title && (
          <p className="mt-1 text-sm text-red-600">{state.errors.title[0]}</p>
        )}
      </div>

      {/* 詳細メモ */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          詳細メモ
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={task?.description || ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="タスクの詳細を入力（任意）"
        />
      </div>

      {/* プロジェクト */}
      <div>
        <label
          htmlFor="projectId"
          className="block text-sm font-medium text-gray-700"
        >
          プロジェクト <span className="text-red-500">*</span>
        </label>
        <select
          id="projectId"
          name="projectId"
          defaultValue={task?.projectId || ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {state.errors?.projectId && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.projectId[0]}
          </p>
        )}
      </div>

      {/* ステータスと優先度 */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* ステータス */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            ステータス
          </label>
          <select
            id="status"
            name="status"
            defaultValue={task?.status || "todo"}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="todo">未着手</option>
            <option value="doing">進行中</option>
            <option value="done">完了</option>
          </select>
          {state.errors?.status && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.status[0]}
            </p>
          )}
        </div>

        {/* 優先度 */}
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            優先度
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={task?.priority?.toString() || "3"}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="1">最高</option>
            <option value="2">高</option>
            <option value="3">中</option>
            <option value="4">低</option>
            <option value="5">最低</option>
          </select>
          {state.errors?.priority && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.priority[0]}
            </p>
          )}
        </div>
      </div>

      {/* 期限 */}
      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700"
        >
          期限
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          defaultValue={formatDate(task?.dueDate)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-end gap-3">
        <a
          href={isEditMode ? `/tasks/${task.id}` : "/"}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          キャンセル
        </a>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isPending
            ? isEditMode
              ? "更新中..."
              : "作成中..."
            : isEditMode
              ? "更新"
              : "作成"}
        </button>
      </div>
    </form>
  );
}
