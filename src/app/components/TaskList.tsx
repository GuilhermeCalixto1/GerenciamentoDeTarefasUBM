import { Task } from './TaskForm';
import { TaskItem } from './TaskItem';
import { CheckCircle2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggleComplete, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
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
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
