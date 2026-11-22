import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Texto de erro de um campo (só aparece depois que o usuário mexe no campo). */
export function mensagemErro(controle: AbstractControl | null): string {
  if (!controle || !controle.errors || !(controle.touched || controle.dirty)) return '';
  const e = controle.errors;
  if (e['required']) return 'Campo obrigatório.';
  if (e['email']) return 'Informe um e-mail válido.';
  if (e['minlength']) return `Mínimo de ${e['minlength'].requiredLength} caracteres.`;
  if (e['maxlength']) return `Máximo de ${e['maxlength'].requiredLength} caracteres.`;
  if (e['min']) return `O valor mínimo é ${e['min'].min}.`;
  if (e['max']) return `O valor máximo é ${e['max'].max}.`;
  if (e['senhasDiferentes']) return 'As senhas não conferem.';
  if (e['isbn']) return 'Informe um ISBN válido (10 ou 13 dígitos).';
  if (e['pattern']) return 'Formato inválido.';
  return 'Valor inválido.';
}

/** Validador: o valor do campo precisa ser igual ao de outro campo do mesmo formulário. */
export function igualA(outroCampo: string): ValidatorFn {
  return (controle: AbstractControl): ValidationErrors | null => {
    const outro = controle.parent?.get(outroCampo)?.value;
    return controle.value && controle.value !== outro ? { senhasDiferentes: true } : null;
  };
}

/** Validador: ISBN com 10 ou 13 dígitos (hífens e espaços são ignorados). */
export function isbnValido(controle: AbstractControl): ValidationErrors | null {
  const valor = String(controle.value ?? '').replace(/[-\s]/g, '');
  if (!valor) return null;
  return /^(\d{13}|\d{9}[\dXx])$/.test(valor) ? null : { isbn: true };
}
