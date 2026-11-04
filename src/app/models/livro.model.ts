export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  isbn: string;
  anoPublicacao: number;
  exemplares: number;
  sinopse: string;
  capaUrl?: string;
}
