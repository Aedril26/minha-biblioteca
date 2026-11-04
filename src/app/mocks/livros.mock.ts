import { Livro } from '../models/livro.model';

export const LIVROS_MOCK: Livro[] = [
  { id: 1, titulo: 'O Nome do Vento', autor: 'Patrick Rothfuss', categoria: 'Fantasia', isbn: '978-85-7657-134-7', anoPublicacao: 2007, exemplares: 4, sinopse: 'A história de Kvothe, um jovem músico e arcanista que se torna uma lenda, contada por ele mesmo.' },
  { id: 2, titulo: 'Duna', autor: 'Frank Herbert', categoria: 'Ficção Científica', isbn: '978-85-7657-250-4', anoPublicacao: 1965, exemplares: 3, sinopse: 'No deserto do planeta Arrakis, a família Atreides luta pelo controle da especiaria mais valiosa do universo.' },
  { id: 3, titulo: 'Fundação', autor: 'Isaac Asimov', categoria: 'Ficção Científica', isbn: '978-85-7657-301-3', anoPublicacao: 1951, exemplares: 0, sinopse: 'Hari Seldon cria a psico-história para prever o futuro e tentar salvar a civilização da queda do Império.' },
  { id: 4, titulo: 'Sapiens', autor: 'Yuval Noah Harari', categoria: 'História & Biografia', isbn: '978-85-254-3149-8', anoPublicacao: 2011, exemplares: 2, sinopse: 'Uma breve história da humanidade, da Idade da Pedra até a era digital.' },
  { id: 5, titulo: 'Clean Code', autor: 'Robert C. Martin', categoria: 'Tecnologia', isbn: '978-85-7608-047-8', anoPublicacao: 2008, exemplares: 5, sinopse: 'Princípios e boas práticas para escrever código limpo, legível e fácil de manter.' },
  { id: 6, titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', categoria: 'Romance', isbn: '978-85-220-0156-0', anoPublicacao: 1943, exemplares: 6, sinopse: 'Um piloto perdido no deserto encontra um pequeno príncipe vindo de outro planeta.' },
  { id: 7, titulo: 'Dom Casmurro', autor: 'Machado de Assis', categoria: 'Romance', isbn: '978-85-359-0277-4', anoPublicacao: 1899, exemplares: 0, sinopse: 'Bentinho relembra sua vida e a dúvida eterna sobre a fidelidade de Capitu.' },
  { id: 8, titulo: 'Steve Jobs', autor: 'Walter Isaacson', categoria: 'História & Biografia', isbn: '978-85-359-1999-4', anoPublicacao: 2011, exemplares: 2, sinopse: 'A biografia autorizada do cofundador da Apple, baseada em dezenas de entrevistas.' }
];
