import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Dashboard } from './pages/dashboard/dashboard';
import { Livros } from './pages/livros/livros';
import { LivroDetalhe } from './pages/livro-detalhe/livro-detalhe';
import { LivroForm } from './pages/livro-form/livro-form';
import { Relatorios } from './pages/relatorios/relatorios';

@NgModule({
  declarations: [App, Login, Registro, Dashboard, Livros, LivroDetalhe, LivroForm, Relatorios],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}