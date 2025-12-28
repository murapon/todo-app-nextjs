"use server";

import {
  getTasksByUserIdPaginated,
  TASKS_PER_PAGE,
} from "../data/tasks";

// 仮のユーザーID
const TEMP_USER_ID = "ebf4a9d7-a7ef-4566-a838-e437d6f27bb7";

export async function loadMoreTasks(page: number) {
  const result = await getTasksByUserIdPaginated(
    TEMP_USER_ID,
    page,
    TASKS_PER_PAGE
  );

  return result;
}

