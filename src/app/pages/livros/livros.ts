import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { catchError, debounceTime, of, startWith, switchMap, tap } from 'rxjs';
import { Livro } from '../../models/livro.model';
import { LivroService } from '../../services/livro.service';

@Component({
  selector: 'app-livros',
  standalone: false,
  templateUrl: './livros.html',
  styleUrl: './livros.css'
})
export class Livros implements OnInit {
  private livroService = inject(LivroService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  filtros = this.fb.nonNullable.group({ termo: '', categoria: '', status: '' });

  livros: Livro[] = [];
  categorias: string[] = [];
  carregando = true;
  erroApi = false;

  ngOnInit(): void {
    this.livroService.categorias().subscribe({
      next: c => {
        this.categorias = c;
        this.cdr.markForCheck();
      },
      error: () => {
        this.erroApi = true;
        this.cdr.markForCheck();
      }
    });

    // cada mudança nos filtros dispara uma nova requisição GET à API
    this.filtros.valueChanges
      .pipe(
        startWith(this.filtros.getRawValue()),
        debounceTime(250),
        tap(() => {
          this.carregando = true;
          this.cdr.markForCheck();
        }),
        switchMap(f =>
          this.livroService.pesquisar(f.termo ?? '', f.categoria ?? '', f.status ?? '').pipe(
            catchError(() => {
              this.erroApi = true;
              return of([] as Livro[]);
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(livros => {
        this.livros = livros;
        this.carregando = false;
        this.cdr.markForCheck();
      });
  }
}
