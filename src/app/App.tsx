import { useEffect, useMemo, useState } from 'react';

type Tarefa = {
  titulo: string;
  descricao: string;
  data: string;
  prioridade: 'baixa' | 'media' | 'alta';
};

export default function App() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [prioridade, setPrioridade] = useState<Tarefa['prioridade']>('media');
  const [tarefas, setTarefas] = useState<Tarefa[]>(() => {
    try {
      const salvas = localStorage.getItem('tarefas');
      return salvas ? JSON.parse(salvas) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  const tarefasOrdenadas = useMemo(() => {
    const ordemPrioridade: Record<Tarefa['prioridade'], number> = {
      alta: 0,
      media: 1,
      baixa: 2,
    };

    return [...tarefas].sort((a, b) => {
      const diffPrioridade = ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade];
      if (diffPrioridade !== 0) return diffPrioridade;

      if (!a.data && !b.data) return 0;
      if (!a.data) return 1;
      if (!b.data) return -1;

      return new Date(a.data).getTime() - new Date(b.data).getTime();
    });
  }, [tarefas]);

  function salvarTarefa() {
    const tituloLimpo = titulo.trim();
    const descricaoLimpa = descricao.trim();

    if (!tituloLimpo) {
      alert('Por favor, informe o titulo da tarefa.');
      return;
    }

    const novaTarefa: Tarefa = {
      titulo: tituloLimpo,
      descricao: descricaoLimpa,
      data,
      prioridade,
    };

    setTarefas(prev => [...prev, novaTarefa]);
    setTitulo('');
    setDescricao('');
    setData('');
    setPrioridade('media');
  }

  return (
    <main className="min-h-screen bg-[#f4f4f4] p-5 font-[Arial,sans-serif]">
      <div className="mx-auto w-full max-w-[500px] rounded-lg bg-white p-[30px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <h1 className="mb-5 text-2xl font-bold text-[#333333]">Cadastro de Tarefas</h1>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="inputTitulo" className="text-[0.9rem] font-bold text-[#555555]">Titulo</label>
        <input
          type="text"
          id="inputTitulo"
          placeholder="Digite o titulo da tarefa"
          value={titulo}
          onChange={event => setTitulo(event.target.value)}
          className="w-full rounded-md border border-[#cccccc] px-2.5 py-2 text-[0.95rem] text-[#333333] outline-none box-border"
        />

          <label htmlFor="inputDescricao" className="text-[0.9rem] font-bold text-[#555555]">Descricao</label>
        <textarea
          id="inputDescricao"
          placeholder="Digite a descricao da tarefa"
          value={descricao}
          onChange={event => setDescricao(event.target.value)}
          className="min-h-20 w-full resize-y rounded-md border border-[#cccccc] px-2.5 py-2 text-[0.95rem] text-[#333333] outline-none box-border"
        />

          <label htmlFor="inputData" className="text-[0.9rem] font-bold text-[#555555]">Data</label>
        <input
          type="date"
          id="inputData"
          value={data}
          onChange={event => setData(event.target.value)}
          className="w-full rounded-md border border-[#cccccc] px-2.5 py-2 text-[0.95rem] text-[#333333] outline-none box-border"
        />

          <label htmlFor="inputPrioridade" className="text-[0.9rem] font-bold text-[#555555]">Prioridade</label>
        <select
          id="inputPrioridade"
          value={prioridade}
          onChange={event => setPrioridade(event.target.value as Tarefa['prioridade'])}
          className="w-full rounded-md border border-[#cccccc] px-2.5 py-2 text-[0.95rem] text-[#333333] outline-none box-border"
        >
          <option value="baixa">Baixa</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>

          <button
            id="btnSalvar"
            onClick={salvarTarefa}
            className="mt-1.5 cursor-pointer rounded-md border-none bg-[#4f46e5] p-2.5 text-base text-white hover:bg-[#4338ca]"
          >
            Salvar Tarefa
          </button>
        </div>

        <h2 className="mb-2.5 mt-[30px] text-[1.1rem] font-bold text-[#333333]">Tarefas Salvas</h2>
        <ul id="listaTarefas" className="flex list-none flex-col gap-2.5 p-0">
          {tarefasOrdenadas.map((tarefa, indice) => {
            const dataFormatada = tarefa.data
              ? new Date(`${tarefa.data}T00:00:00`).toLocaleDateString('pt-BR')
              : 'Sem data';

            const prioridadeClasses = {
              alta: {
                item: 'border-l-4 border-l-red-500 bg-red-50',
                badge: 'bg-red-100 text-red-800',
                label: 'Alta',
              },
              media: {
                item: 'border-l-4 border-l-amber-500 bg-amber-50',
                badge: 'bg-amber-100 text-amber-800',
                label: 'Media',
              },
              baixa: {
                item: 'border-l-4 border-l-emerald-500 bg-emerald-50',
                badge: 'bg-emerald-100 text-emerald-800',
                label: 'Baixa',
              },
            }[tarefa.prioridade];

            return (
              <li
                key={`${tarefa.titulo}-${indice}`}
                className={`rounded-md border border-[#dddddd] px-[14px] py-3 text-[0.9rem] text-[#333333] ${prioridadeClasses.item}`}
              >
                <strong className="mb-1 block text-base">{tarefa.titulo}</strong>
                {tarefa.descricao ? (
                  <span className="mt-0.5 block text-[0.82rem] text-[#777777]">{tarefa.descricao}</span>
                ) : null}
                <span className="mt-1 inline-flex rounded-full px-2.5 py-1 text-[0.75rem] font-semibold uppercase tracking-wide">
                  <span className={`rounded-full px-2 py-0.5 ${prioridadeClasses.badge}`}>
                    {prioridadeClasses.label}
                  </span>
                </span>
                <span className="mt-1 block text-[0.82rem] text-[#777777]">
                  Data: {dataFormatada}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
