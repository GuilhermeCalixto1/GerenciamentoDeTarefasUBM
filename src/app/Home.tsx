import { useState, useEffect, useMemo } from "react";
import { TaskForm, Task } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { FilterBar } from "./components/FilterBar";
import { Button } from "./components/ui/button";
import { Plus, ClipboardList } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [statusFilter, setStatusFilter] = useState<
    "todas" | "pendentes" | "concluidas"
  >("todas");
  const [priorityFilter, setPriorityFilter] = useState<
    "todas" | "baixa" | "media" | "alta"
  >("todas");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Carregar tarefas do localStorage ao iniciar
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

  // Salvar tarefas no localStorage quando houver mudanças
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem("tasks")) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleAddTask = (taskData: Omit<Task, "id" | "concluida">) => {
    if (editingTask) {
      // Editar tarefa existente
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...taskData } : task,
        ),
      );
      setEditingTask(undefined);
    } else {
      // Adicionar nova tarefa
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        concluida: false,
      };
      setTasks([...tasks, newTask]);
    }
    setShowForm(false);
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
    setShowForm(true);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  // Função para limpar todos os filtros de uma vez
  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("todas");
    setPriorityFilter("todas");
    setDateFilter("");
  };

  // Filtrar tarefas
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Filtro de busca por título
        if (
          searchQuery &&
          !task.titulo.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        // Filtro por status
        if (statusFilter === "pendentes" && task.concluida) return false;
        if (statusFilter === "concluidas" && !task.concluida) return false;

        // Filtro por prioridade
        if (priorityFilter !== "todas" && task.prioridade !== priorityFilter)
          return false;

        // Filtro por data
        if (dateFilter && task.dataEntrega !== dateFilter) return false;

        return true;
      })
      .sort((a, b) => {
        // Ordenar: não concluídas primeiro, depois por prioridade, depois por data
        if (a.concluida !== b.concluida) {
          return a.concluida ? 1 : -1;
        }

        const priorityOrder = { alta: 0, media: 1, baixa: 2 };
        if (a.prioridade !== b.prioridade) {
          return priorityOrder[a.prioridade] - priorityOrder[b.prioridade];
        }

        if (a.dataEntrega && b.dataEntrega) {
          return (
            new Date(a.dataEntrega).getTime() -
            new Date(b.dataEntrega).getTime()
          );
        }

        return 0;
      });
  }, [tasks, searchQuery, statusFilter, priorityFilter, dateFilter]);

  // Contadores para filtros
  const taskCounts = useMemo(
    () => ({
      todas: tasks.length,
      pendentes: tasks.filter((t) => !t.concluida).length,
      concluidas: tasks.filter((t) => t.concluida).length,
    }),
    [tasks],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-3 rounded-lg shadow-md">
                <ClipboardList size={32} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gerenciador de Tarefas
                </h1>
                <p className="text-gray-600">
                  Organize suas tarefas e aumente sua produtividade
                </p>
              </div>
            </div>

            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                className="gap-2"
              >
                <Plus size={20} />
                Nova Tarefa
              </Button>
            )}
          </div>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {taskCounts.todas}
              </div>
              <div className="text-sm text-gray-600">Total de Tarefas</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {taskCounts.pendentes}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {taskCounts.concluidas}
              </div>
              <div className="text-sm text-gray-600">Concluídas</div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={handleCancelForm}
            editingTask={editingTask}
          />
        )}

        {/* Filtros */}
        <FilterBar
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          dateFilter={dateFilter}
          onSearchQueryChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
          onPriorityFilterChange={setPriorityFilter}
          onDateFilterChange={setDateFilter}
          onClearFilters={handleClearFilters}
          taskCounts={taskCounts}
        />

        {/* Lista de Tarefas */}
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
}
