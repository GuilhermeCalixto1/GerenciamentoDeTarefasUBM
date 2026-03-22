import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Filter, Search, X } from "lucide-react";
import { Input } from "./ui/input";

interface FilterBarProps {
  searchQuery: string;
  statusFilter: "todas" | "pendentes" | "concluidas";
  priorityFilter: "todas" | "baixa" | "media" | "alta";
  dateFilter: string;
  onSearchQueryChange: (value: string) => void;
  onStatusFilterChange: (value: "todas" | "pendentes" | "concluidas") => void;
  onPriorityFilterChange: (value: "todas" | "baixa" | "media" | "alta") => void;
  onDateFilterChange: (value: string) => void;
  onClearFilters: () => void;
  taskCounts: {
    todas: number;
    pendentes: number;
    concluidas: number;
  };
}

export function FilterBar({
  searchQuery,
  statusFilter,
  priorityFilter,
  dateFilter,
  onSearchQueryChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onDateFilterChange,
  onClearFilters,
  taskCounts,
}: FilterBarProps) {
  // Verifica se há algum filtro ativo
  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "todas" ||
    priorityFilter !== "todas" ||
    dateFilter !== "";

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtros & Busca</h3>
        </div>

        {/* Botão para limpar tudo só aparece se houver filtros ativos */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-red-600 transition-colors h-8 px-2"
          >
            <X size={16} className="mr-1" /> Limpar tudo
          </Button>
        )}
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            type="text"
            placeholder="Buscar tarefas por título..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "todas" ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusFilterChange("todas")}
              className="flex-1"
            >
              Todas ({taskCounts.todas})
            </Button>
            <Button
              variant={statusFilter === "pendentes" ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusFilterChange("pendentes")}
              className="flex-1"
            >
              Pendentes ({taskCounts.pendentes})
            </Button>
            <Button
              variant={statusFilter === "concluidas" ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusFilterChange("concluidas")}
              className="flex-1"
            >
              Concluídas ({taskCounts.concluidas})
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Prioridade
          </label>
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Data de Entrega
          </label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
