import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X } from 'lucide-react';

export interface Task {
  id: string;
  titulo: string;
  descricao: string;
  dataEntrega: string;
  prioridade: 'baixa' | 'media' | 'alta';
  concluida: boolean;
}

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'concluida'>) => void;
  onCancel: () => void;
  editingTask?: Task;
}

export function TaskForm({ onSubmit, onCancel, editingTask }: TaskFormProps) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [prioridade, setPrioridade] = useState<'baixa' | 'media' | 'alta'>('media');

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
      alert('Por favor, preencha o título da tarefa.');
      return;
    }

    onSubmit({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      dataEntrega,
      prioridade,
    });

    // Limpar formulário
    setTitulo('');
    setDescricao('');
    setDataEntrega('');
    setPrioridade('media');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="titulo">Título *</Label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Digite o título da tarefa"
            required
          />
        </div>

        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite uma descrição (opcional)"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dataEntrega">Data de Entrega</Label>
            <Input
              id="dataEntrega"
              type="date"
              value={dataEntrega}
              onChange={(e) => setDataEntrega(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select value={prioridade} onValueChange={(value: 'baixa' | 'media' | 'alta') => setPrioridade(value)}>
              <SelectTrigger id="prioridade">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1">
            {editingTask ? 'Salvar Alterações' : 'Adicionar Tarefa'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
