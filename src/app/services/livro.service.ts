import { Injectable } from '@angular/core';
import { Livro } from '../models/livro.model';
import { LIVROS_MOCK } from '../mocks/livros.mock';

@Injectable({ providedIn: 'root' })
export class LivroService {
  private livros: Livro[] = LIVROS_MOCK.map(l => ({ ...l }));

  listar(): Livro[] {
    return [...this.livros];
  }

  buscarPorId(id: number): Livro | undefined {
    return this.livros.find(l => l.id === id);
  }

  /** status: '' (todos) | 'disponivel' | 'indisponivel' */
  pesquisar(termo = '', categoria = '', status = ''): Livro[] {
    const t = termo.trim().toLowerCase();
    return this.livros.filter(l => {
      const bateTermo = !t ||
        l.titulo.toLowerCase().includes(t) ||
        l.autor.toLowerCase().includes(t) ||
        l.isbn.toLowerCase().includes(t);
      const bateCategoria = !categoria || l.categoria === categoria;
      const bateStatus = !status ||
        (status === 'disponivel' ? l.exemplares > 0 : l.exemplares === 0);
      return bateTermo && bateCategoria && bateStatus;
    });
  }

  cadastrar(dados: Omit<Livro, 'id'>): Livro {
    const novo: Livro = { ...dados, id: this.proximoId() };
    this.livros.push(novo);
    return novo;
  }

  editar(livro: Livro): boolean {
    const i = this.livros.findIndex(l => l.id === livro.id);
    if (i === -1) return false;
    this.livros[i] = { ...livro };
    return true;
  }

  excluir(id: number): boolean {
    const antes = this.livros.length;
    this.livros = this.livros.filter(l => l.id !== id);
    return this.livros.length < antes;
  }

  categorias(): string[] {
    return [...new Set(this.livros.map(l => l.categoria))].sort();
  }

  totalExemplares(): number {
    return this.livros.reduce((soma, l) => soma + l.exemplares, 0);
  }

  distribuicaoPorCategoria(limite = 3): { categoria: string; percentual: number }[] {
    const total = this.livros.length;
    if (!total) return [];
    const contagem = new Map<string, number>();
    this.livros.forEach(l => contagem.set(l.categoria, (contagem.get(l.categoria) ?? 0) + 1));
    return [...contagem.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limite)
      .map(([categoria, qtd]) => ({ categoria, percentual: Math.round((qtd / total) * 100) }));
  }

  private proximoId(): number {
    return this.livros.length ? Math.max(...this.livros.map(l => l.id)) + 1 : 1;
  }
}
