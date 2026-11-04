import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  senha = '';
  erro = '';

  constructor(private auth: AuthService, private router: Router) {}

  entrar(): void {
    if (this.auth.login(this.email, this.senha)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.erro = 'E-mail ou senha inválidos.';
    }
  }
}
