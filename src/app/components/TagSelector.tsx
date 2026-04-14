export type Priority = 'baixa' | 'media' | 'alta';

export interface Task {
  id: string;
  titulo: string;
  concluida: boolean;
  
  //categorias fixas
  
  categoria: 'Trabalho' | 'Estudos' | 'Pessoal' | 'Lazer' | 'Outros'; 
  tags: string[]; 
  prioridade: Priority;
  dataCriacao: number; 
}


export type NewTaskData = Omit<Task, 'id' | 'concluida' | 'dataCriacao'>;