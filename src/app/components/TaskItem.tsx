import { Task } from './TaskForm';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  
  // Cores das etiquetas de prioridade
  const priorityColors = {
    baixa: '#dbeafe',
    media: '#fef9c3',
    alta: '#fee2e2',
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
    <div 
      style={{ 
        backgroundColor: task.concluida ? '#f3f4f6' : '#ffffff',
        opacity: task.concluida ? 0.6 : 1,
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'all 0.2s ease'
      }}
    >
      {/* 1. CHECKBOX (Caixinha que sempre aparece) */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input 
          type="checkbox" 
          checked={task.concluida} 
          onChange={() => onToggleComplete(task.id)}
          style={{ 
            width: '22px', 
            height: '22px', 
            cursor: 'pointer',
            accentColor: '#2563eb' 
          }} 
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          {/* 3. TEXTO COM RISCO (Garantido pelo textDecoration) */}
          <h3 
            style={{ 
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              textDecoration: task.concluida ? 'line-through' : 'none',
              color: task.concluida ? '#6b7280' : '#111827',
              transition: 'all 0.2s ease'
            }}
          >
            {task.titulo}
          </h3>
          
          <span style={{ 
            backgroundColor: priorityColors[task.prioridade], 
            fontSize: '12px', 
            padding: '2px 8px', 
            borderRadius: '99px',
            color: '#1f2937',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            {task.prioridade.toUpperCase()}
          </span>
        </div>
        
        {task.descricao && (
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: task.concluida ? '#9ca3af' : '#4b5563' }}>
            {task.descricao}
          </p>
        )}

        {task.dataEntrega && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#9ca3af' }}>
            <Calendar size={14} />
            <span>{format(new Date(task.dataEntrega), "dd/MM/yyyy", { locale: ptBR })}</span>
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => onEdit(task)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          <Pencil size={18} color="#2563eb" />
        </button>
        <button 
          onClick={() => { if(confirm('Excluir?')) onDelete(task.id) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          <Trash2 size={18} color="#ef4444" />
        </button>
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