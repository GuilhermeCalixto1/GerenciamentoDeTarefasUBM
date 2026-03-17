import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  statusFilter: 'todas' | 'pendentes' | 'concluidas';
  priorityFilter: 'todas' | 'baixa' | 'media' | 'alta';
  onStatusFilterChange: (value: 'todas' | 'pendentes' | 'concluidas') => void;
  onPriorityFilterChange: (value: 'todas' | 'baixa' | 'media' | 'alta') => void;
  taskCounts: {
    todas: number;
    pendentes: number;
    concluidas: number;
  };
}

export function FilterBar({
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  taskCounts,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'todas' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusFilterChange('todas')}
              className="flex-1"
            >
              Todas ({taskCounts.todas})
            </Button>
            <Button
              variant={statusFilter === 'pendentes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusFilterChange('pendentes')}
              className="flex-1"
            >
              Pendentes ({taskCounts.pendentes})
            </Button>
            <Button
              variant={statusFilter === 'concluidas' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusFilterChange('concluidas')}
              className="flex-1"
            >
              Concluídas ({taskCounts.concluidas})
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Prioridade</label>
          <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Prioridades</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
