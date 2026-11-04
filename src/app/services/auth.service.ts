import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { USUARIOS_MOCK } from '../mocks/usuarios.mock';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarios: Usuario[] = USUARIOS_MOCK.map(u => ({ ...u }));
  usuarioLogado?: Usuario;

  login(email: string, senha: string): boolean {
    const u = this.usuarios.find(
      x => x.email.toLowerCase() === email.trim().toLowerCase() && x.senha === senha
    );
    this.usuarioLogado = u;
    return !!u;
  }

  logout(): void {
    this.usuarioLogado = undefined;
  }

  registrar(nome: string, email: string, senha: string): { ok: boolean; erro?: string } {
    if (this.usuarios.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, erro: 'Já existe uma conta com esse e-mail.' };
    }
    const id = Math.max(0, ...this.usuarios.map(u => u.id)) + 1;
    this.usuarios.push({ id, nome: nome.trim(), email: email.trim(), senha });
    return { ok: true };
  }

  totalUsuarios(): number {
    return this.usuarios.length;
  }
}