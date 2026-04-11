import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Filter } from "lucide-react";

interface FilterBarProps {
  statusFilter: "todas" | "pendentes" | "concluidas";
  priorityFilter: "todas" | "baixa" | "media" | "alta";
  onStatusFilterChange: (value: "todas" | "pendentes" | "concluidas") => void;
  onPriorityFilterChange: (value: "todas" | "baixa" | "media" | "alta") => void;
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
    <div className="mb-4 rounded-md border border-[#e5e7eb] bg-[#fafafa] p-3">
      <div className="mb-3 flex items-center gap-2">
        <Filter size={18} className="text-[#6b7280]" />
        <h3 className="text-sm font-semibold text-[#374151]">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.6fr_1fr] md:items-end">
        <div className="min-w-0 space-y-2">
          <label className="text-[0.85rem] font-semibold text-[#555555]">
            Status
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Button
              variant={statusFilter === "todas" ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusFilterChange("todas")}
              className="min-w-0 text-xs"
            >
              Todas ({taskCounts.todas})
            </Button>
            <Button
              variant={statusFilter === "pendentes" ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusFilterChange("pendentes")}
              className="min-w-0 text-xs"
            >
              Pendentes ({taskCounts.pendentes})
            </Button>
            <Button
              variant={statusFilter === "concluidas" ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusFilterChange("concluidas")}
              className="min-w-0 text-xs"
            >
              Concluídas ({taskCounts.concluidas})
            </Button>
          </div>
        </div>

        <div className="min-w-0 space-y-2">
          <label className="text-[0.85rem] font-semibold text-[#555555]">
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
      </div>
    </div>
  );
}
