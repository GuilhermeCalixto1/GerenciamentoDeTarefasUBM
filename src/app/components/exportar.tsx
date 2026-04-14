//CSV

// src/app/utils/exporting.ts

import { Task } from './TaskForm';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ==========================================
// EXPORTAÇÃO PARA CSV
// ==========================================
export const exportToCSV = (tasks: Task[]) => {
  // Cabeçalho do arquivo
  const headers = ["ID", "Titulo", "Status", "Prioridade"].join(",");
  
  // Linhas de dados
  const rows = tasks.map(task => [
    task.id,
    `"${task.titulo}"`, // Aspas para evitar erro com vírgulas no título
    task.concluida ? "Concluida" : "Pendente",
    task.prioridade || "N/A"
  ].join(","));

  // O '\uFEFF' garante que o Excel abra o arquivo com a codificação UTF-8 correta (mantém os acentos)
  const csvContent = "\uFEFF" + [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Link invisível para download
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "tarefas_ubm.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ==========================================
// EXPORTAÇÃO PARA PDF
// ==========================================
export const exportToPDF = (tasks: Task[]) => {
  const doc = new jsPDF();

  doc.text("Gerenciamento de Tarefas UBM", 14, 15);
  
  const tableData = tasks.map(t => [
    t.titulo,
    t.concluida ? "Sim" : "Não",
    t.prioridade || "Normal"
  ]);

  // Usando a função autoTable injetando o doc e forçando a tipagem 
  // para evitar qualquer erro "No overload matches this call" no TypeScript
  autoTable(doc, {
    head: [['Tarefa', 'Concluída', 'Prioridade']],
    body: tableData as any[], 
    startY: 25,
  });

  doc.save("tarefas_ubm.pdf");
};