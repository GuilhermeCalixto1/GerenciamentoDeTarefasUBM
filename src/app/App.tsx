import { useEffect, useMemo, useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { TaskForm, type Task } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";

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
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<
    "todas" | "pendentes" | "concluidas"
  >("todas");
  const [priorityFilter, setPriorityFilter] = useState<
    "todas" | "baixa" | "media" | "alta"
  >("todas");
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const salvas = localStorage.getItem("tarefas");
      if (!salvas) return [];

      const parsed = JSON.parse(salvas);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .map((item) => normalizarTarefa(item as SavedTask))
        .filter((item): item is Task => item !== null);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tasks));
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    const prioridadeOrdem: Record<Task["prioridade"], number> = {
      alta: 0,
      media: 1,
      baixa: 2,
    };

    return [...tasks].sort((a, b) => {
      const diffPrioridade =
        prioridadeOrdem[a.prioridade] - prioridadeOrdem[b.prioridade];
      if (diffPrioridade !== 0) return diffPrioridade;

      if (!a.dataEntrega && !b.dataEntrega) return 0;
      if (!a.dataEntrega) return 1;
      if (!b.dataEntrega) return -1;

      return (
        new Date(a.dataEntrega).getTime() - new Date(b.dataEntrega).getTime()
      );
    });
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return sortedTasks.filter((task) => {
      const statusOk =
        statusFilter === "todas" ||
        (statusFilter === "pendentes" && !task.concluida) ||
        (statusFilter === "concluidas" && task.concluida);

      const prioridadeOk =
        priorityFilter === "todas" || task.prioridade === priorityFilter;

      return statusOk && prioridadeOk;
    });
  }, [sortedTasks, statusFilter, priorityFilter]);

  const taskCounts = useMemo(
    () => ({
      todas: tasks.length,
      pendentes: tasks.filter((task) => !task.concluida).length,
      concluidas: tasks.filter((task) => task.concluida).length,
    }),
    [tasks],
  );

  function handleSaveTask(taskData: Omit<Task, "id" | "concluida">) {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                ...taskData,
              }
            : task,
        ),
      );
      setEditingTask(undefined);
      return;
    }

    const newTask: Task = {
      id: gerarId(),
      ...taskData,
      concluida: false,
    };

    setTasks((prev) => [...prev, newTask]);
  }

  function handleCancelForm() {
    setEditingTask(undefined);
  }

  function handleToggleComplete(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, concluida: !task.concluida } : task,
      ),
    );
  }

  function handleDeleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));

    if (editingTask?.id === id) {
      setEditingTask(undefined);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f4f4] p-5 font-[Arial,sans-serif]">
      <div className="mx-auto w-full max-w-[500px] rounded-lg bg-white p-[30px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <h1 className="mb-5 text-2xl font-bold text-[#333333]">
          Cadastro de Tarefas
        </h1>

        <TaskForm
          onSubmit={handleSaveTask}
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
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </main>
  );
}
