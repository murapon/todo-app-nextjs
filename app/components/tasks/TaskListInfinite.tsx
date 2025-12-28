"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TaskWithProject } from "../../lib/data/tasks";
import { loadMoreTasks } from "../../lib/actions/loadMoreTasks";
import { TaskItem } from "./TaskItem";

type Props = {
  initialTasks: TaskWithProject[];
  initialHasMore: boolean;
  totalCount: number;
};

export function TaskListInfinite({
  initialTasks,
  initialHasMore,
  totalCount,
}: Props) {
  const [tasks, setTasks] = useState<TaskWithProject[]>(initialTasks);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Intersection Observer用のref
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 追加読み込み処理
  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const result = await loadMoreTasks(nextPage);

      // 重複を除去して追加
      setTasks((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newTasks = result.tasks.filter((t) => !existingIds.has(t.id));
        return [...prev, ...newTasks];
      });
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page]);

  // Intersection Observerの設定
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, handleLoadMore]);

  if (tasks.length === 0) {
    return <p className="text-gray-500">タスクがありません</p>;
  }

  return (
    <div>
      {/* 件数表示 */}
      <p className="mb-4 text-sm text-gray-500">
        {tasks.length} / {totalCount} 件表示中
      </p>

      {/* タスク一覧 */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>

      {/* ローディング / 追加読み込みトリガー */}
      <div ref={loadMoreRef} className="py-8 text-center">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>読み込み中...</span>
          </div>
        )}
        {!hasMore && tasks.length > 0 && (
          <p className="text-sm text-gray-400">すべてのタスクを表示しました</p>
        )}
      </div>
    </div>
  );
}

