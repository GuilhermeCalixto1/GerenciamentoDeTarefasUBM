import { useState, useEffect } from "react";

export interface Task {
  id: string;
  titulo: string;
  descricao: string;
  dataEntrega: string;
  prioridade: "baixa" | "media" | "alta";
  concluida: boolean;
}

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "concluida">) => void;
  onCancel: () => void;
  editingTask?: Task;
}

export function TaskForm({ onSubmit, onCancel, editingTask }: TaskFormProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [prioridade, setPrioridade] = useState<"baixa" | "media" | "alta">(
    "media",
  );

  useEffect(() => {
    if (editingTask) {
      setTitulo(editingTask.titulo);
      setDescricao(editingTask.descricao);
      setDataEntrega(editingTask.dataEntrega);
      setPrioridade(editingTask.prioridade);
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim()) {
      alert("Por favor, preencha o título da tarefa.");
      return;
    }

    onSubmit({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      dataEntrega,
      prioridade,
    });

    // Limpar formulário
    setTitulo("");
    setDescricao("");
    setDataEntrega("");
    setPrioridade("media");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2.5">
      <label
        htmlFor="titulo"
        className="text-[0.9rem] font-bold text-[#555555]"
      >
        Titulo
      </label>
      <input
        id="titulo"
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Digite o titulo da tarefa"
        required
        className="w-full rounded-md border border-[#cccccc] px-2.5 py-2 text-[0.95rem] text-[#333333] outline-none box-border"
      />

      <label
        htmlFor="descricao"
        className="text-[0.9rem] font-bold text-[#555555]"
      >
        Descricao
      </label>
      <textarea
        id="descricao"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Digite a descricao da tarefa"
        className="min-h-20 w-full resize-y rounded-md border border-[#cccccc] px-2.5 py-2 text-[0.95rem] text-[#333333] outline-none box-border"
      />

      <label
        htmlFor="dataEntrega"
        className="text-[0.9rem] font-bold text-[#555555]"
      >
        Data
      </label>
      <input
        id="dataEntrega"
        type="date"
        value={dataEntrega}
        onChange={(e) => setDataEntrega(e.target.value)}
        className="w-full rounded-md border border-[#cccccc] px-2.5 py-2 text-[0.95rem] text-[#333333] outline-none box-border"
      />

      <label
        htmlFor="prioridade"
        className="text-[0.9rem] font-bold text-[#555555]"
      >
        Prioridade
      </label>
      <select
        id="prioridade"
        value={prioridade}
        onChange={(e) =>
          setPrioridade(e.target.value as "baixa" | "media" | "alta")
        }
        className="w-full rounded-md border border-[#cccccc] px-2.5 py-2 text-[0.95rem] text-[#333333] outline-none box-border"
      >
        <option value="baixa">Baixa</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>

      <button
        type="submit"
        className="mt-1.5 cursor-pointer rounded-md border-none bg-[#4f46e5] p-2.5 text-base text-white hover:bg-[#4338ca]"
      >
        {editingTask ? "Atualizar Tarefa" : "Salvar Tarefa"}
      </button>

      {editingTask ? (
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-md border border-[#d1d5db] bg-white p-2.5 text-base text-[#374151] hover:bg-[#f9fafb]"
        >
          Cancelar Edicao
        </button>
      ) : null}
    </form>
  );
}
