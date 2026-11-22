import { Emprestimo, VolumeMensal } from '../models/emprestimo.model';

export const EMPRESTIMOS_MOCK: Emprestimo[] = [
  { id: 1, livroId: 6, livroTitulo: 'O Pequeno Príncipe', usuarioNome: 'Ana Silva', dataEmprestimo: '2026-10-10', dataDevolucao: '2026-10-20', status: 'DEVOLVIDO' },
  { id: 2, livroId: 1, livroTitulo: 'O Nome do Vento', usuarioNome: 'Carlos Souza', dataEmprestimo: '2026-10-25', dataDevolucao: '2026-11-08', status: 'EM ANDAMENTO' },
  { id: 3, livroId: 2, livroTitulo: 'Duna', usuarioNome: 'Marina Lopes', dataEmprestimo: '2026-10-02', dataDevolucao: '2026-10-16', status: 'ATRASADO' },
  { id: 4, livroId: 5, livroTitulo: 'Clean Code', usuarioNome: 'João Pereira', dataEmprestimo: '2026-10-28', dataDevolucao: '2026-11-11', status: 'EM ANDAMENTO' },
  { id: 5, livroId: 7, livroTitulo: 'Dom Casmurro', usuarioNome: 'Ana Silva', dataEmprestimo: '2026-09-15', dataDevolucao: '2026-09-29', status: 'ATRASADO' },
  { id: 6, livroId: 4, livroTitulo: 'Sapiens', usuarioNome: 'Pedro Alves', dataEmprestimo: '2026-10-18', dataDevolucao: '2026-11-01', status: 'DEVOLVIDO' },
  { id: 7, livroId: 3, livroTitulo: 'Fundação', usuarioNome: 'Lucas Rocha', dataEmprestimo: '2026-10-30', dataDevolucao: '2026-11-13', status: 'EM ANDAMENTO' },
  { id: 8, livroId: 8, livroTitulo: 'Steve Jobs', usuarioNome: 'Marina Lopes', dataEmprestimo: '2026-08-20', dataDevolucao: '2026-09-03', status: 'DEVOLVIDO' }
];

export const VOLUME_MENSAL_MOCK: VolumeMensal[] = [
  { mes: 'JAN', emprestimos: 120, devolucoes: 90 },
  { mes: 'FEV', emprestimos: 95, devolucoes: 100 },
  { mes: 'MAR', emprestimos: 140, devolucoes: 110 },
  { mes: 'ABR', emprestimos: 110, devolucoes: 105 },
  { mes: 'MAI', emprestimos: 130, devolucoes: 125 },
  { mes: 'JUN', emprestimos: 150, devolucoes: 120 }
];
