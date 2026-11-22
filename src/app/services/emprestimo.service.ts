import { Injectable } from '@angular/core';
import { Emprestimo, VolumeMensal } from '../models/emprestimo.model';
import { Livro } from '../models/livro.model';
import { EMPRESTIMOS_MOCK, VOLUME_MENSAL_MOCK } from '../mocks/emprestimos.mock';
import { LivroService } from './livro.service';

@Injectable({ providedIn: 'root' })
export class EmprestimoService {
  private emprestimos: Emprestimo[] = EMPRESTIMOS_MOCK.map(e => ({ ...e }));

  constructor(private livroService: LivroService) {}

  listar(): Emprestimo[] {
    return [...this.emprestimos];
  }

  ultimos(qtd = 4): Emprestimo[] {
    return [...this.emprestimos]
      .sort((a, b) => b.dataEmprestimo.localeCompare(a.dataEmprestimo))
      .slice(0, qtd);
  }

  /** Busca por ID, livro ou utilizador. dias = 0 significa sem filtro de período. */
  pesquisar(termo = '', dias = 0): Emprestimo[] {
    const t = termo.trim().toLowerCase();
    const limite = new Date();
    limite.setDate(limite.getDate() - dias);
    return this.emprestimos.filter(e => {
      const bateTermo = !t ||
        String(e.id).includes(t) ||
        e.usuarioNome.toLowerCase().includes(t) ||
        e.livroTitulo.toLowerCase().includes(t);
      const batePeriodo = !dias || new Date(e.dataEmprestimo) >= limite;
      return bateTermo && batePeriodo;
    });
  }

  emprestados(): number {
    return this.emprestimos.filter(e => e.status !== 'DEVOLVIDO').length;
  }

  devolucoesPendentes(): number {
    return this.emprestimos.filter(e => e.status === 'ATRASADO').length;
  }

  volumeMensal(): VolumeMensal[] {
    return VOLUME_MENSAL_MOCK;
  }

  solicitar(livro: Livro, usuarioNome: string): Emprestimo | null {
    if (livro.exemplares < 1) return null;
    const hoje = new Date();
    const devolucao = new Date();
    devolucao.setDate(hoje.getDate() + 14);
    const novo: Emprestimo = {
      id: Math.max(0, ...this.emprestimos.map(e => e.id)) + 1,
      livroId: livro.id,
      livroTitulo: livro.titulo,
      usuarioNome,
      dataEmprestimo: hoje.toISOString().slice(0, 10),
      dataDevolucao: devolucao.toISOString().slice(0, 10),
      status: 'EM ANDAMENTO'
    };
    this.emprestimos.push(novo);
    this.livroService.editar({ ...livro, exemplares: livro.exemplares - 1 });
    return novo;
  }
}
