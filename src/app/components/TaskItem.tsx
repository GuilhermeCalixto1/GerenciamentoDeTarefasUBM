import { Task } from './TaskForm';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Pencil, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  baixa: 'bg-blue-100 text-blue-800 border-blue-200',
  media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  alta: 'bg-red-100 text-red-800 border-red-200',
};

const priorityLabels = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const isOverdue = task.dataEntrega && new Date(task.dataEntrega) < new Date() && !task.concluida;

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg ${task.concluida ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="pt-1">
          <Checkbox
            checked={task.concluida}
            onCheckedChange={() => onToggleComplete(task.id)}
            id={`task-${task.id}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className={`font-semibold text-lg ${
                task.concluida ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {task.titulo}
            </h3>
            <Badge className={priorityColors[task.prioridade]}>
              {priorityLabels[task.prioridade]}
            </Badge>
          </div>

          {task.descricao && (
            <p className={`text-sm mb-3 ${task.concluida ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.descricao}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm">
            {task.dataEntrega && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                {isOverdue && <AlertCircle size={16} />}
                <Calendar size={16} />
                <span>
                  {format(new Date(task.dataEntrega), "dd/MM/yyyy", { locale: ptBR })}
                </span>
                {isOverdue && <span className="text-xs">(Atrasada)</span>}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
