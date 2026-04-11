import { Task } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { CheckCircle2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-md border border-[#dddddd] bg-[#f8f8f8] px-[14px] py-6 text-center text-[0.9rem] text-[#777777]">
        <CheckCircle2 size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-gray-500">
          Adicione uma nova tarefa ou ajuste os filtros.
        </p>
      </div>
    );
  }

  return (
    <ul id="listaTarefas" className="flex list-none flex-col gap-2.5 p-0">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
