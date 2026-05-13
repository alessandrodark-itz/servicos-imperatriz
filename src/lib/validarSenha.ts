export function validarSenhaForte(senha: string): { valida: boolean; erros: string[] } {
  const erros: string[] = []

  if (senha.length < 10)            erros.push('Mínimo de 10 caracteres.')
  if (!/[A-Z]/.test(senha))         erros.push('Pelo menos uma letra maiúscula.')
  if (!/[a-z]/.test(senha))         erros.push('Pelo menos uma letra minúscula.')
  if (!/[0-9]/.test(senha))         erros.push('Pelo menos um número.')
  if (!/[^A-Za-z0-9]/.test(senha))  erros.push('Pelo menos um caractere especial (!@#$%...).')

  return { valida: erros.length === 0, erros }
}
