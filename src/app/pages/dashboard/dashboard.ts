import { Component } from '@angular/core';
import { Emprestimo } from '../../models/emprestimo.model';
import { AuthService } from '../../services/auth.service';
import { EmprestimoService } from '../../services/emprestimo.service';
import { LivroService } from '../../services/livro.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  totalLivros = 0;
  emprestados = 0;
  pendentes = 0;
  usuariosAtivos = 0;
  ultimos: Emprestimo[] = [];

  constructor(
    private livroService: LivroService,
    private emprestimoService: EmprestimoService,
    private auth: AuthService
  ) {
    this.totalLivros = this.livroService.totalExemplares();
    this.emprestados = this.emprestimoService.emprestados();
    this.pendentes = this.emprestimoService.devolucoesPendentes();
    this.usuariosAtivos = this.auth.totalUsuarios();
    this.ultimos = this.emprestimoService.ultimos(4);
  }

  get cards() {
    return [
      { titulo: 'Total de livros', valor: this.totalLivros },
      { titulo: 'Livros emprestados', valor: this.emprestados },
      { titulo: 'Devoluções pendentes', valor: this.pendentes },
      { titulo: 'Utilizadores ativos', valor: this.usuariosAtivos }
    ];
  }
}