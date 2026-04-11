import { Task } from "./TaskForm";
import { AlertCircle } from "lucide-react";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  baixa: "bg-blue-100 text-blue-800 border-blue-200",
  media: "bg-yellow-100 text-yellow-800 border-yellow-200",
  alta: "bg-red-100 text-red-800 border-red-200",
};

const priorityLabels = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

export function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const dataFormatada = task.dataEntrega
    ? new Date(`${task.dataEntrega}T00:00:00`).toLocaleDateString("pt-BR")
    : "Sem data";

  const isOverdue =
    task.dataEntrega &&
    new Date(task.dataEntrega) < new Date() &&
    !task.concluida;

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      onDelete(task.id);
    }
  };

  const prioridadeClasses = {
    alta: {
      item: "border-l-4 border-l-red-500 bg-red-50",
      badge: "bg-red-100 text-red-800",
      label: "Alta",
    },
    media: {
      item: "border-l-4 border-l-amber-500 bg-amber-50",
      badge: "bg-amber-100 text-amber-800",
      label: "Media",
    },
    baixa: {
      item: "border-l-4 border-l-emerald-500 bg-emerald-50",
      badge: "bg-emerald-100 text-emerald-800",
      label: "Baixa",
    },
  }[task.prioridade];

  return (
    <li
      className={`rounded-md border border-[#dddddd] px-[14px] py-3 text-[0.9rem] text-[#333333] ${prioridadeClasses.item} ${
        task.concluida ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <label className="flex items-start gap-2.5">
          <input
            type="checkbox"
            checked={task.concluida}
            onChange={() => onToggleComplete(task.id)}
            className="mt-1 h-4 w-4 cursor-pointer accent-[#16a34a]"
          />
          <span>
            <strong
              className={`mb-1 block text-base ${task.concluida ? "line-through" : ""}`}
            >
              {task.titulo}
            </strong>
          </span>
        </label>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="cursor-pointer rounded-md border border-[#c7d2fe] bg-[#eef2ff] px-2.5 py-1 text-[0.78rem] font-semibold text-[#3730a3] hover:bg-[#e0e7ff]"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="cursor-pointer rounded-md border border-[#fecaca] bg-[#fef2f2] px-2.5 py-1 text-[0.78rem] font-semibold text-[#b91c1c] hover:bg-[#fee2e2]"
          >
            Excluir
          </button>
        </div>
      </div>

      {task.descricao ? (
        <span
          className={`mt-0.5 block text-[0.82rem] text-[#777777] ${
            task.concluida ? "line-through" : ""
          }`}
        >
          {task.descricao}
        </span>
      ) : null}

      <span className="mt-1 inline-flex rounded-full px-2.5 py-1 text-[0.75rem] font-semibold uppercase tracking-wide">
        <span className={`rounded-full px-2 py-0.5 ${prioridadeClasses.badge}`}>
          {prioridadeClasses.label}
        </span>
      </span>

      <span
        className={`mt-1 block text-[0.82rem] ${isOverdue ? "font-semibold text-[#b91c1c]" : "text-[#777777]"}`}
      >
        {isOverdue ? (
          <span className="inline-flex items-center gap-1">
            <AlertCircle size={14} />
            Data: {dataFormatada} (Atrasada)
          </span>
        ) : (
          <span>Data: {dataFormatada}</span>
        )}
      </span>
    </li>
  );
}
