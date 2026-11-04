import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  nome = '';
  email = '';
  senha = '';
  confirmar = '';
  erro = '';

  constructor(private auth: AuthService, private router: Router) {}

  criarConta(): void {
    if (this.senha !== this.confirmar) {
      this.erro = 'As senhas não conferem.';
      return;
    }
    const resultado = this.auth.registrar(this.nome, this.email, this.senha);
    if (!resultado.ok) {
      this.erro = resultado.erro ?? 'Não foi possível criar a conta.';
      return;
    }
    this.router.navigate(['/login']);
  }
}
