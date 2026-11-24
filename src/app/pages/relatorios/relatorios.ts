import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { catchError, debounceTime, forkJoin, of, startWith, switchMap } from 'rxjs';
import { Emprestimo, VolumeMensal } from '../../models/emprestimo.model';
import { EmprestimoService } from '../../services/emprestimo.service';
import { LivroService } from '../../services/livro.service';

@Component({
  selector: 'app-relatorios',
  standalone: false,
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.css'
})
export class Relatorios implements OnInit {
  private emprestimoService = inject(EmprestimoService);
  private livroService = inject(LivroService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  filtros = this.fb.nonNullable.group({ termo: '', periodo: 30 });

  volume: VolumeMensal[] = [];
  maxVolume = 1;
  categorias: { categoria: string; percentual: number }[] = [];
  movimentacoes: Emprestimo[] = [];
  erroApi = false;
  readonly cores = ['#233d32', '#476b55', '#d9a66f'];

  ngOnInit(): void {
    forkJoin({
      volume: this.emprestimoService.volumeMensal(),
      categorias: this.livroService.distribuicaoPorCategoria(3)
    }).subscribe({
      next: r => {
        this.volume = r.volume;
        this.maxVolume = Math.max(1, ...r.volume.map(v => Math.max(v.emprestimos, v.devolucoes)));
        this.categorias = r.categorias;
        this.cdr.markForCheck();
      },
      error: () => {
        this.erroApi = true;
        this.cdr.markForCheck();
      }
    });

    this.filtros.valueChanges
      .pipe(
        startWith(this.filtros.getRawValue()),
        debounceTime(250),
        switchMap(f =>
          this.emprestimoService.pesquisar(f.termo ?? '', Number(f.periodo ?? 0)).pipe(
            catchError(() => {
              this.erroApi = true;
              return of([] as Emprestimo[]);
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(lista => {
        this.movimentacoes = lista;
        this.cdr.markForCheck();
      });
  }

  altura(valor: number): number {
    return Math.round((valor / this.maxVolume) * 140);
  }

  get gradiente(): string {
    let acumulado = 0;
    const partes = this.categorias.map((c, i) => {
      const inicio = acumulado;
      acumulado += c.percentual;
      return `${this.cores[i]} ${inicio}% ${acumulado}%`;
    });
    if (acumulado < 100) partes.push(`#e5dfd0 ${acumulado}% 100%`);
    return `conic-gradient(${partes.join(', ')})`;
  }

  classeStatus(status: string): string {
    return 'status-' + status.toLowerCase().replace(' ', '-');
  }

  exportarCsv(): void {
    const linhas: (string | number)[][] = [
      ['ID', 'Livro', 'Utilizador', 'Data de empréstimo', 'Devolução', 'Status'],
      ...this.movimentacoes.map(m => [m.id, m.livroTitulo, m.usuarioNome, m.dataEmprestimo, m.dataDevolucao, m.status])
    ];
    const csv = linhas.map(l => l.map(c => `"${c}"`).join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-movimentacoes.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
