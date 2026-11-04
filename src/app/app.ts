import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private router: Router, private auth: AuthService) {}

  get mostrarMenu(): boolean {
    const url = this.router.url;
    return !(url === '/' || url.startsWith('/login') || url.startsWith('/registro'));
  }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}