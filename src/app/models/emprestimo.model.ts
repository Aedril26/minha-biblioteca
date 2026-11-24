export type StatusEmprestimo = 'EM ANDAMENTO' | 'DEVOLVIDO' | 'ATRASADO';

export interface Emprestimo {
  id: number;
  livroId: number;
  livroTitulo: string;
  usuarioNome: string;
  dataEmprestimo: string; // yyyy-MM-dd
  dataDevolucao: string;  // yyyy-MM-dd
  status: StatusEmprestimo;
}

export interface VolumeMensal {
  mes: string;
  emprestimos: number;
  devolucoes: number;
}
