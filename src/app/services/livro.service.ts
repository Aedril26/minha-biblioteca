import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_URL } from '../api.config';
import { Livro } from '../models/livro.model';

@Injectable({ providedIn: 'root' })
export class LivroService {
  private url = `${API_URL}/livros`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Livro[]> {
    return this.http.get<Livro[]>(this.url);
  }

  buscarPorId(id: number): Observable<Livro> {
    return this.http.get<Livro>(`${this.url}/${id}`);
  }

  /** status: '' (todos) | 'disponivel' | 'indisponivel' */
  pesquisar(termo = '', categoria = '', status = ''): Observable<Livro[]> {
    let params = new HttpParams();
    if (termo.trim()) params = params.set('q', termo.trim());
    if (categoria) params = params.set('categoria', categoria);
    if (status === 'disponivel') params = params.set('exemplares_gte', '1');
    if (status === 'indisponivel') params = params.set('exemplares', '0');
    return this.http.get<Livro[]>(this.url, { params });
  }

  cadastrar(dados: Omit<Livro, 'id'>): Observable<Livro> {
    return this.http.post<Livro>(this.url, dados);
  }

  editar(livro: Livro): Observable<Livro> {
    return this.http.put<Livro>(`${this.url}/${livro.id}`, livro);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  categorias(): Observable<string[]> {
    return this.listar().pipe(
      map(livros => [...new Set(livros.map(l => l.categoria))].sort())
    );
  }

  totalExemplares(): Observable<number> {
    return this.listar().pipe(
      map(livros => livros.reduce((soma, l) => soma + l.exemplares, 0))
    );
  }

  distribuicaoPorCategoria(limite = 3): Observable<{ categoria: string; percentual: number }[]> {
    return this.listar().pipe(
      map(livros => {
        const total = livros.length;
        if (!total) return [];
        const contagem = new Map<string, number>();
        livros.forEach(l => contagem.set(l.categoria, (contagem.get(l.categoria) ?? 0) + 1));
        return [...contagem.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, limite)
          .map(([categoria, qtd]) => ({ categoria, percentual: Math.round((qtd / total) * 100) }));
      })
    );
  }
}
