import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import {
  ArrowLeft,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Task } from "./components/TaskForm";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    // Busca as tarefas salvas no navegador e encontra a específica pelo ID
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const tasks: Task[] = JSON.parse(storedTasks);
      const foundTask = tasks.find((t) => t.id === id);
      if (foundTask) {
        setTask(foundTask);
      }
    }
  }, [id]);

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Tarefa não encontrada
        </h2>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2" size={20} /> Voltar para o início
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="container mx-auto max-w-3xl">
        {/* Botão de voltar */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-gray-600 hover:bg-white/50"
        >
          <ArrowLeft className="mr-2" size={20} /> Voltar para as tarefas
        </Button>

        {/* Card Principal */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {task.titulo}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                  task.concluida
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {task.concluida ? (
                  <CheckCircle size={16} />
                ) : (
                  <Clock size={16} />
                )}
                {task.concluida ? "Concluída" : "Pendente"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.prioridade === "alta"
                    ? "bg-red-100 text-red-700"
                    : task.prioridade === "media"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                }`}
              >
                Prioridade:{" "}
                {task.prioridade.charAt(0).toUpperCase() +
                  task.prioridade.slice(1)}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Descrição */}
            <div>
              <div className="flex items-center gap-2 text-gray-700 mb-2 font-semibold">
                <FileText size={20} />
                <h3>Descrição</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap min-h-[100px] border border-gray-100">
                {task.descricao || (
                  <span className="text-gray-400 italic">
                    Nenhuma descrição fornecida para esta tarefa.
                  </span>
                )}
              </div>
            </div>

            {/* Data de Entrega */}
            <div>
              <div className="flex items-center gap-2 text-gray-700 mb-2 font-semibold">
                <Calendar size={20} />
                <h3>Data de Entrega</h3>
              </div>
              <p className="text-gray-800 pl-7">
                {task.dataEntrega
                  ? new Date(task.dataEntrega).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Sem data definida"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
