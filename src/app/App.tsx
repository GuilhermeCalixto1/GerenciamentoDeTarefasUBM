import { useState, useEffect, useMemo, useRef } from "react";
import { TaskForm, Task } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { FilterBar } from "./components/FilterBar";

type SavedTask = Partial<Task> & {
  titulo?: unknown;
  descricao?: unknown;
  dataEntrega?: unknown;
  data?: unknown;
  prioridade?: unknown;
  concluida?: unknown;
};

function gerarId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizarTarefa(tarefa: SavedTask): Task | null {
  if (typeof tarefa.titulo !== "string" || tarefa.titulo.trim() === "") {
    return null;
  }

  const prioridadeValida =
    tarefa.prioridade === "alta" ||
    tarefa.prioridade === "media" ||
    tarefa.prioridade === "baixa"
      ? tarefa.prioridade
      : "media";

  const dataNormalizada =
    typeof tarefa.dataEntrega === "string"
      ? tarefa.dataEntrega
      : typeof tarefa.data === "string"
        ? tarefa.data
        : "";

  return {
    id: typeof tarefa.id === "string" && tarefa.id ? tarefa.id : gerarId(),
    titulo: tarefa.titulo.trim(),
    descricao: typeof tarefa.descricao === "string" ? tarefa.descricao : "",
    dataEntrega: dataNormalizada,
    prioridade: prioridadeValida,
    concluida: Boolean(tarefa.concluida),
  };
}
export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [statusFilter, setStatusFilter] = useState<
    "todas" | "pendentes" | "concluidas"
  >("todas");
  const [priorityFilter, setPriorityFilter] = useState<
    "todas" | "baixa" | "media" | "alta"
  >("todas");

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (taskData: Omit<Task, "id" | "concluida">) => {
    if (editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...taskData } : task,
        ),
      );
      setEditingTask(undefined);
    } else {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        concluida: false,
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, concluida: !task.concluida } : task,
      ),
    );
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleCancelForm = () => {
    setEditingTask(undefined);
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (statusFilter === "pendentes" && task.concluida) return false;
        if (statusFilter === "concluidas" && !task.concluida) return false;
        if (priorityFilter !== "todas" && task.prioridade !== priorityFilter)
          return false;
        return true;
      })
      .sort((a, b) => {
        if (a.concluida !== b.concluida) return a.concluida ? 1 : -1;
        const priorityOrder = { alta: 0, media: 1, baixa: 2 };
        if (a.prioridade !== b.prioridade)
          return priorityOrder[a.prioridade] - priorityOrder[b.prioridade];
        return 0;
      });
  }, [tasks, statusFilter, priorityFilter]);

  const taskCounts = useMemo(
    () => ({
      todas: tasks.length,
      pendentes: tasks.filter((t) => !t.concluida).length,
      concluidas: tasks.filter((t) => t.concluida).length,
    }),
    [tasks],
  );
  const notifiedTasks = useRef(new Set<string>());

  useEffect(() => {
    if (
      "Notification" in window &&
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }

    const checkDeadlines = () => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      tasks.forEach((task) => {
        if (!task.dataEntrega) return;

        const dataVencimento = new Date(task.dataEntrega);
        dataVencimento.setMinutes(
          dataVencimento.getMinutes() + dataVencimento.getTimezoneOffset(),
        );
        dataVencimento.setHours(0, 0, 0, 0);

        const diferencaTempo = dataVencimento.getTime() - hoje.getTime();
        const diasRestantes = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

        if (diasRestantes <= 3 && diasRestantes >= 0) {
          if (!notifiedTasks.current.has(task.id)) {
            const mensagem =
              diasRestantes === 0
                ? `A tarefa "${task.titulo}" encerra HOJE!`
                : `A tarefa "${task.titulo}" encerra em ${diasRestantes} dia(s).`;

            if (Notification.permission === "granted") {
              new Notification("⚠️ Prazo Próximo!", {
                body: mensagem,
              });
              notifiedTasks.current.add(task.id);
            } else if (Notification.permission === "denied") {
              alert(`Prazo Próximo!\n${mensagem}`);
              notifiedTasks.current.add(task.id);
            }
          }
        }
      });
    };

    checkDeadlines();

    const interval = setInterval(checkDeadlines, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <main className="min-h-screen bg-[#f4f4f4] p-5 font-[Arial,sans-serif]">
      <div className="mx-auto w-full max-w-[500px] rounded-lg bg-white p-[30px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <h1 className="mb-5 text-2xl font-bold text-[#333333]">
          Cadastro de Tarefas
        </h1>

        <TaskForm
          onSubmit={handleAddTask}
          onCancel={handleCancelForm}
          editingTask={editingTask}
        />

        <FilterBar
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onStatusFilterChange={setStatusFilter}
          onPriorityFilterChange={setPriorityFilter}
          taskCounts={taskCounts}
        />

        <h2 className="mb-2.5 mt-[30px] text-[1.1rem] font-bold text-[#333333]">
          Tarefas Salvas
        </h2>

        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </main>
  );
}
