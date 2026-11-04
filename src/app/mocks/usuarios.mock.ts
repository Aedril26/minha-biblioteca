import { Usuario } from '../models/usuario.model';

export const USUARIOS_MOCK: Usuario[] = [
  { id: 1, nome: 'Administrador', email: 'admin@biblioteca.com', senha: '123456' },
  { id: 2, nome: 'Ana Silva', email: 'ana@exemplo.com', senha: '123456' },
  { id: 3, nome: 'Carlos Souza', email: 'carlos@exemplo.com', senha: '123456' }
];