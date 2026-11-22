import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { API_URL } from '../api.config';
import { Usuario } from '../models/usuario.model';

export interface ResultadoRegistro {
  ok: boolean;
  erro?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${API_URL}/usuarios`;
  usuarioLogado?: Usuario;

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<boolean> {
    const params = new HttpParams()
      .set('email', email.trim().toLowerCase())
      .set('senha', senha);
    return this.http.get<Usuario[]>(this.url, { params }).pipe(
      map(lista => lista[0]),
      tap(usuario => (this.usuarioLogado = usuario)),
      map(usuario => !!usuario)
    );
  }

  logout(): void {
    this.usuarioLogado = undefined;
  }

  registrar(nome: string, email: string, senha: string): Observable<ResultadoRegistro> {
    const emailNormalizado = email.trim().toLowerCase();
    const params = new HttpParams().set('email', emailNormalizado);
    return this.http.get<Usuario[]>(this.url, { params }).pipe(
      switchMap(existentes => {
        if (existentes.length > 0) {
          return of<ResultadoRegistro>({ ok: false, erro: 'Já existe uma conta com esse e-mail.' });
        }
        return this.http
          .post<Usuario>(this.url, { nome: nome.trim(), email: emailNormalizado, senha })
          .pipe(map((): ResultadoRegistro => ({ ok: true })));
      })
    );
  }

  totalUsuarios(): Observable<number> {
    return this.http.get<Usuario[]>(this.url).pipe(map(lista => lista.length));
  }
}
