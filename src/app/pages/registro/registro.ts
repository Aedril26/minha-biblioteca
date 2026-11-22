import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { igualA, mensagemErro } from '../../shared/validacao';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmar: ['', [Validators.required, igualA('senha')]]
  });

  erro = '';
  carregando = false;

  constructor() {
    // se a senha mudar, a confirmação precisa ser validada de novo
    this.form.controls.senha.valueChanges.subscribe(() =>
      this.form.controls.confirmar.updateValueAndValidity()
    );
  }

  msg(campo: 'nome' | 'email' | 'senha' | 'confirmar'): string {
    return mensagemErro(this.form.controls[campo]);
  }

  criarConta(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.erro = 'Corrija os campos destacados para continuar.';
      return;
    }
    this.erro = '';
    this.carregando = true;
    const { nome, email, senha } = this.form.getRawValue();
    this.auth.registrar(nome, email, senha).subscribe({
      next: resultado => {
        this.carregando = false;
        if (resultado.ok) {
          this.router.navigate(['/login']);
        } else {
          this.erro = resultado.erro ?? 'Não foi possível criar a conta.';
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.carregando = false;
        this.erro = 'Não foi possível conectar à API. Rode "npm run api" em outro terminal.';
        this.cdr.markForCheck();
      }
    });
  }
}
