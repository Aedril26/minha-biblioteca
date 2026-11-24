import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { mensagemErro } from '../../shared/validacao';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  erro = '';
  carregando = false;

  msg(campo: 'email' | 'senha'): string {
    return mensagemErro(this.form.controls[campo]);
  }

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.erro = 'Corrija os campos destacados para continuar.';
      return;
    }
    this.erro = '';
    this.carregando = true;
    const { email, senha } = this.form.getRawValue();
    this.auth.login(email, senha).subscribe({
      next: ok => {
        this.carregando = false;
        if (ok) {
          this.router.navigate(['/dashboard']);
        } else {
          this.erro = 'E-mail ou senha inválidos.';
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
