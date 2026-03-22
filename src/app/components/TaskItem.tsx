import { Task } from "./TaskForm";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const navigate = useNavigate();

  // Mapeamento de cores para as badges de prioridade
  const priorityColors = {
    baixa: "bg-blue-100 text-blue-700",
    media: "bg-orange-100 text-orange-700",
    alta: "bg-red-100 text-red-700",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 transition-all ${task.concluida ? "opacity-75 bg-gray-50" : "hover:shadow-md"}`}
    >
      <div className="flex items-start gap-4">
        {/* Botão de Concluir Tarefa */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className="mt-1 flex-shrink-0 text-gray-400 hover:text-blue-600 transition-colors"
          title={
            task.concluida ? "Marcar como pendente" : "Marcar como concluída"
          }
        >
          {task.concluida ? (
            <CheckCircle2 size={24} className="text-green-500" />
          ) : (
            <Circle size={24} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            {/* Título e Descrição */}
            <div>
              <h3
                className={`font-semibold text-lg truncate cursor-pointer hover:text-blue-600 transition-colors ${task.concluida ? "text-gray-500 line-through" : "text-gray-900"}`}
                onClick={() => navigate(`/tarefa/${task.id}`)}
                title="Clique para ver os detalhes"
              >
                {task.titulo}
              </h3>
              {task.descricao && (
                <p
                  className={`mt-1 text-sm line-clamp-2 ${task.concluida ? "text-gray-400" : "text-gray-600"}`}
                >
                  {task.descricao}
                </p>
              )}
            </div>

            {/* Badge de Prioridade */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${priorityColors[task.prioridade]}`}
            >
              {task.prioridade.charAt(0).toUpperCase() +
                task.prioridade.slice(1)}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            {/* Data de Entrega */}
            <div className="flex items-center text-sm text-gray-500">
              {task.dataEntrega ? (
                <>
                  <Calendar size={16} className="mr-1.5" />
                  {new Date(task.dataEntrega).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                </>
              ) : (
                <span className="text-gray-400">Sem data definida</span>
              )}
            </div>

            {/* Ações (Ver Detalhes, Editar, Excluir) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/tarefa/${task.id}`)}
                className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                title="Ver detalhes"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-gray-400 hover:text-yellow-600 transition-colors"
                title="Editar tarefa"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                title="Excluir tarefa"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
