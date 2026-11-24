import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Livro } from '../../models/livro.model';
import { AuthService } from '../../services/auth.service';
import { EmprestimoService } from '../../services/emprestimo.service';
import { LivroService } from '../../services/livro.service';

@Component({
  selector: 'app-livro-detalhe',
  standalone: false,
  templateUrl: './livro-detalhe.html',
  styleUrl: './livro-detalhe.css'
})
export class LivroDetalhe implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private livroService = inject(LivroService);
  private emprestimoService = inject(EmprestimoService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  livro?: Livro;
  carregando = true;
  erroApi = false;
  mensagem = '';

  ngOnInit(): void {
    this.carregar(Number(this.route.snapshot.paramMap.get('id')));
  }

  private carregar(id: number): void {
    this.livroService.buscarPorId(id).subscribe({
      next: livro => {
        this.livro = livro;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: erro => {
        this.livro = undefined;
        this.erroApi = erro.status !== 404; // 404 = livro não existe
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  solicitarEmprestimo(): void {
    if (!this.livro) return;
    const nome = this.auth.usuarioLogado?.nome ?? 'Visitante';
    this.emprestimoService.solicitar(this.livro, nome).subscribe({
      next: () => {
        this.mensagem = 'Empréstimo solicitado! Devolução prevista em 14 dias.';
        this.carregar(this.livro!.id);
      },
      error: () => {
        this.mensagem = 'Não foi possível solicitar o empréstimo.';
        this.cdr.markForCheck();
      }
    });
  }

  excluir(): void {
    if (!this.livro) return;
    if (!confirm(`Excluir "${this.livro.titulo}" do acervo?`)) return;
    this.livroService.excluir(this.livro.id).subscribe({
      next: () => this.router.navigate(['/livros']),
      error: () => {
        this.mensagem = 'Não foi possível excluir o livro.';
        this.cdr.markForCheck();
      }
    });
  }
}
