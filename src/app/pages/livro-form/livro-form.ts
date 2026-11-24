import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LivroService } from '../../services/livro.service';
import { isbnValido, mensagemErro } from '../../shared/validacao';

type Campo = 'titulo' | 'autor' | 'categoria' | 'isbn' | 'anoPublicacao' | 'exemplares' | 'sinopse';

@Component({
  selector: 'app-livro-form',
  standalone: false,
  templateUrl: './livro-form.html',
  styleUrl: './livro-form.css'
})
export class LivroForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private livroService = inject(LivroService);
  private cdr = inject(ChangeDetectorRef);

  anoAtual = new Date().getFullYear();

  form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    autor: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    categoria: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    isbn: ['', [Validators.required, isbnValido]],
    anoPublicacao: [
      this.anoAtual,
      [Validators.required, Validators.pattern(/^\d{4}$/), Validators.min(1000), Validators.max(this.anoAtual)]
    ],
    exemplares: [1, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(999)]],
    sinopse: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(600)]],
    capaUrl: ['']
  });

  id?: number;
  salvando = false;
  aviso = '';

  get editando(): boolean {
    return this.id !== undefined;
  }

  get capaUrl(): string {
    return this.form.controls.capaUrl.value;
  }

  msg(campo: Campo): string {
    return mensagemErro(this.form.controls[campo]);
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (!param) return;
    this.livroService.buscarPorId(Number(param)).subscribe({
      next: livro => {
        this.id = livro.id;
        const { id, ...dados } = livro;
        this.form.patchValue({ ...dados, capaUrl: dados.capaUrl ?? '' });
        this.cdr.markForCheck();
      },
      error: () => {
        this.aviso = 'Não foi possível carregar o livro para edição.';
        this.cdr.markForCheck();
      }
    });
  }

  selecionarCapa(evento: Event): void {
    const arquivo = (evento.target as HTMLInputElement).files?.[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith('image/')) {
      this.aviso = 'Escolha um arquivo de imagem.';
      return;
    }
    if (arquivo.size > 1024 * 1024) {
      this.aviso = 'A imagem deve ter no máximo 1 MB.';
      return;
    }
    const leitor = new FileReader();
    leitor.onload = () => {
      this.form.patchValue({ capaUrl: leitor.result as string });
      this.aviso = '';
      this.cdr.markForCheck();
    };
    leitor.readAsDataURL(arquivo);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.aviso = 'Corrija os campos destacados antes de salvar.';
      return;
    }
    this.aviso = '';
    this.salvando = true;
    const dados = this.form.getRawValue();
    const requisicao =
      this.id !== undefined
        ? this.livroService.editar({ id: this.id, ...dados })
        : this.livroService.cadastrar(dados);

    requisicao.subscribe({
      next: () => this.router.navigate(['/livros']),
      error: () => {
        this.salvando = false;
        this.aviso = 'Não foi possível salvar. Verifique se a API está rodando (npm run api).';
        this.cdr.markForCheck();
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/livros']);
  }
}
