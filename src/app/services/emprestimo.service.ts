import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap, throwError } from 'rxjs';
import { API_URL } from '../api.config';
import { Emprestimo, VolumeMensal } from '../models/emprestimo.model';
import { Livro } from '../models/livro.model';
import { LivroService } from './livro.service';

@Injectable({ providedIn: 'root' })
export class EmprestimoService {
  private url = `${API_URL}/emprestimos`;

  constructor(private http: HttpClient, private livroService: LivroService) {}

  listar(): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(this.url);
  }

  ultimos(qtd = 4): Observable<Emprestimo[]> {
    const params = new HttpParams()
      .set('_sort', 'dataEmprestimo')
      .set('_order', 'desc')
      .set('_limit', String(qtd));
    return this.http.get<Emprestimo[]>(this.url, { params });
  }

  /** Busca por ID, livro ou utilizador. dias = 0 significa sem filtro de período. */
  pesquisar(termo = '', dias = 0): Observable<Emprestimo[]> {
    const t = termo.trim().toLowerCase();
    const limite = new Date();
    limite.setDate(limite.getDate() - dias);
    return this.listar().pipe(
      map(lista =>
        lista
          .filter(e => {
            const bateTermo =
              !t ||
              String(e.id).includes(t) ||
              e.usuarioNome.toLowerCase().includes(t) ||
              e.livroTitulo.toLowerCase().includes(t);
            const batePeriodo = !dias || new Date(e.dataEmprestimo) >= limite;
            return bateTermo && batePeriodo;
          })
          .sort((a, b) => b.dataEmprestimo.localeCompare(a.dataEmprestimo))
      )
    );
  }

  emprestados(): Observable<number> {
    return this.listar().pipe(map(l => l.filter(e => e.status !== 'DEVOLVIDO').length));
  }

  devolucoesPendentes(): Observable<number> {
    return this.listar().pipe(map(l => l.filter(e => e.status === 'ATRASADO').length));
  }

  volumeMensal(): Observable<VolumeMensal[]> {
    return this.http.get<VolumeMensal[]>(`${API_URL}/volumeMensal`);
  }

  /** Cria o empréstimo e baixa 1 exemplar do livro. */
  solicitar(livro: Livro, usuarioNome: string): Observable<Emprestimo> {
    if (livro.exemplares < 1) {
      return throwError(() => new Error('Sem exemplares disponíveis.'));
    }
    const hoje = new Date();
    const devolucao = new Date();
    devolucao.setDate(hoje.getDate() + 14);
    const novo: Omit<Emprestimo, 'id'> = {
      livroId: livro.id,
      livroTitulo: livro.titulo,
      usuarioNome,
      dataEmprestimo: this.iso(hoje),
      dataDevolucao: this.iso(devolucao),
      status: 'EM ANDAMENTO'
    };
    return this.http.post<Emprestimo>(this.url, novo).pipe(
      switchMap(criado =>
        this.livroService
          .editar({ ...livro, exemplares: livro.exemplares - 1 })
          .pipe(map(() => criado))
      )
    );
  }

  private iso(d: Date): string {
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
  }
}
