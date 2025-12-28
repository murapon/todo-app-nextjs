"use server";

import { redirect } from "next/navigation";
import { prisma } from "../prisma";

export type TaskFormState = {
  errors?: {
    title?: string[];
    projectId?: string[];
    status?: string[];
    priority?: string[];
    dueDate?: string[];
    general?: string[];
  };
  message?: string;
};

export async function createTask(
  prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  // フォームデータを取得
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const projectId = formData.get("projectId") as string;
  const status = formData.get("status") as string;
  const priority = parseInt(formData.get("priority") as string, 10);
  const dueDateStr = formData.get("dueDate") as string;

  // バリデーション
  const errors: TaskFormState["errors"] = {};

  if (!title || title.trim() === "") {
    errors.title = ["タイトルは必須です"];
  }

  if (!projectId) {
    errors.projectId = ["プロジェクトを選択してください"];
  }

  if (!["todo", "doing", "done"].includes(status)) {
    errors.status = ["無効なステータスです"];
  }

  if (isNaN(priority) || priority < 1 || priority > 5) {
    errors.priority = ["優先度は1〜5で指定してください"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // タスク作成
  try {
    await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        projectId,
        status,
        priority,
        dueDate: dueDateStr ? new Date(dueDateStr) : null,
      },
    });
  } catch (error) {
    console.error("Failed to create task:", error);
    return {
      errors: {
        general: ["タスクの作成に失敗しました"],
      },
    };
  }

  redirect("/");
}

export async function updateTask(
  taskId: string,
  prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  // フォームデータを取得
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const projectId = formData.get("projectId") as string;
  const status = formData.get("status") as string;
  const priority = parseInt(formData.get("priority") as string, 10);
  const dueDateStr = formData.get("dueDate") as string;

  // バリデーション
  const errors: TaskFormState["errors"] = {};

  if (!title || title.trim() === "") {
    errors.title = ["タイトルは必須です"];
  }

  if (!projectId) {
    errors.projectId = ["プロジェクトを選択してください"];
  }

  if (!["todo", "doing", "done"].includes(status)) {
    errors.status = ["無効なステータスです"];
  }

  if (isNaN(priority) || priority < 1 || priority > 5) {
    errors.priority = ["優先度は1〜5で指定してください"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // タスク更新
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        projectId,
        status,
        priority,
        dueDate: dueDateStr ? new Date(dueDateStr) : null,
      },
    });
  } catch (error) {
    console.error("Failed to update task:", error);
    return {
      errors: {
        general: ["タスクの更新に失敗しました"],
      },
    };
  }

  redirect(`/tasks/${taskId}`);
}

/**
 * タスクを削除（論理削除）
 */
export async function deleteTask(taskId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        deletedAt: new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { success: false, error: "タスクの削除に失敗しました" };
  }
}

