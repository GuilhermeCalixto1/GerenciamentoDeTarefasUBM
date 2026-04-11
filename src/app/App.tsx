<<<<<<< Updated upstream
import { useState, useEffect, useMemo } from 'react';
import { TaskForm, Task } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { FilterBar } from './components/FilterBar';
import { Button } from './components/ui/button';
import { Plus, ClipboardList } from 'lucide-react';
=======
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
>>>>>>> Stashed changes

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [statusFilter, setStatusFilter] = useState<'todas' | 'pendentes' | 'concluidas'>('todas');
  const [priorityFilter, setPriorityFilter] = useState<'todas' | 'baixa' | 'media' | 'alta'>('todas');

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'concluida'>) => {
    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? { ...task, ...taskData } : task
      ));
      setEditingTask(undefined);
    } else {
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
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, concluida: !task.concluida } : task
    ));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (statusFilter === 'pendentes' && task.concluida) return false;
      if (statusFilter === 'concluidas' && !task.concluida) return false;
      if (priorityFilter !== 'todas' && task.prioridade !== priorityFilter) return false;
      return true;
    }).sort((a, b) => {
      if (a.concluida !== b.concluida) return a.concluida ? 1 : -1;
      const priorityOrder = { alta: 0, media: 1, baixa: 2 };
      if (a.prioridade !== b.prioridade) return priorityOrder[a.prioridade] - priorityOrder[b.prioridade];
      return 0;
    });
  }, [tasks, statusFilter, priorityFilter]);

<<<<<<< Updated upstream
  const taskCounts = useMemo(() => ({
    todas: tasks.length,
    pendentes: tasks.filter(t => !t.concluida).length,
    concluidas: tasks.filter(t => t.concluida).length,
  }), [tasks]);
=======
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
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    const checkDeadlines = () => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); 

      tasks.forEach(task => {
        if (!task.dataEntrega) return;

        const dataVencimento = new Date(task.dataEntrega);
        dataVencimento.setMinutes(dataVencimento.getMinutes() + dataVencimento.getTimezoneOffset());
        dataVencimento.setHours(0, 0, 0, 0);

        const diferencaTempo = dataVencimento.getTime() - hoje.getTime();
        const diasRestantes = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

        if (diasRestantes <= 3 && diasRestantes >= 0) {
          if (!notifiedTasks.current.has(task.id)) {
            
            const mensagem = diasRestantes === 0 
              ? `A tarefa "${task.titulo}" encerra HOJE!` 
              : `A tarefa "${task.titulo}" encerra em ${diasRestantes} dia(s).`;

            if (Notification.permission === 'granted') {
              new Notification('⚠️ Prazo Próximo!', {
                body: mensagem,
              });
              notifiedTasks.current.add(task.id);
            } else if (Notification.permission === 'denied') {
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
>>>>>>> Stashed changes

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
       {/* Conteúdo do Header e Lista - Com título atualizado UBM */}
       <div className="container mx-auto max-w-5xl">
          <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex gap-2 items-center">
          <ClipboardList /> Gerenciador
          </h1>
            
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className="flex gap-2">
                <Plus size={20} /> Nova Tarefa
              </Button>
            )}
          </div>

          {showForm && (
            <TaskForm 
              onSubmit={handleAddTask} 
              onCancel={handleCancelForm} 
              editingTask={editingTask} 
            />
          )}
          
          <FilterBar 
            statusFilter={statusFilter} 
            priorityFilter={priorityFilter} 
            onStatusFilterChange={setStatusFilter} 
            onPriorityFilterChange={setPriorityFilter} 
            taskCounts={taskCounts} 
          />

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