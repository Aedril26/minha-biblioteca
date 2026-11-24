import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
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
export class Dashboard implements OnInit {
  private livroService = inject(LivroService);
  private emprestimoService = inject(EmprestimoService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  cards: { titulo: string; valor: number }[] = [];
  ultimos: Emprestimo[] = [];
  carregando = true;
  erroApi = false;

  ngOnInit(): void {
    forkJoin({
      totalLivros: this.livroService.totalExemplares(),
      emprestados: this.emprestimoService.emprestados(),
      pendentes: this.emprestimoService.devolucoesPendentes(),
      usuarios: this.auth.totalUsuarios(),
      ultimos: this.emprestimoService.ultimos(4)
    }).subscribe({
      next: r => {
        this.cards = [
          { titulo: 'Total de livros', valor: r.totalLivros },
          { titulo: 'Livros emprestados', valor: r.emprestados },
          { titulo: 'Devoluções pendentes', valor: r.pendentes },
          { titulo: 'Utilizadores ativos', valor: r.usuarios }
        ];
        this.ultimos = r.ultimos;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.erroApi = true;
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
