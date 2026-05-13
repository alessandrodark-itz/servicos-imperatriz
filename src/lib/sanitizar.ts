export function sanitizarTexto(valor: string, maxLen = 1000): string {
  return valor
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, maxLen)
}

export function sanitizarSlug(valor: string): string {
  return valor
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 100)
}
