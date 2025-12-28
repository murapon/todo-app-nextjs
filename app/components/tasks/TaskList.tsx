import type { TaskWithProject } from "../../lib/data/tasks";
import { TaskItem } from "./TaskItem";

type Props = {
  tasks: TaskWithProject[];
};

export function TaskList({ tasks }: Props) {
  if (tasks.length === 0) {
    return <p className="text-gray-500">タスクがありません</p>;
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

