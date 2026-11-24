import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Dashboard } from './pages/dashboard/dashboard';
import { Livros } from './pages/livros/livros';
import { LivroDetalhe } from './pages/livro-detalhe/livro-detalhe';
import { LivroForm } from './pages/livro-form/livro-form';
import { Relatorios } from './pages/relatorios/relatorios';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'dashboard', component: Dashboard },
  { path: 'livros', component: Livros },
  { path: 'livros/novo', component: LivroForm },
  { path: 'livros/:id', component: LivroDetalhe },
  { path: 'livros/:id/editar', component: LivroForm },
  { path: 'relatorios', component: Relatorios },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}