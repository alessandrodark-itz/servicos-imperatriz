import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

const RESERVED = new Set([
  'admin', 'suporte', 'support', 'servicos imperatriz', 'serviços imperatriz',
  'moderador', 'administrador', 'sistema', 'official', 'oficial',
])

function normalize(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

function generateSuggestions(name: string): string[] {
  const base = name.trim().replace(/\s+/g, '')
  return [
    `${base}123`,
    `${base}Oficial`,
    `${base}Imperatriz`,
    `${base}Pro`,
    `${base}X`,
    `${base}2025`,
  ]
}

/* GET /api/check-name?name=Luis&exclude_id=uuid */
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') ?? ''
  const excludeId = req.nextUrl.searchParams.get('exclude_id') ?? ''

  const trimmed = name.trim()
  if (trimmed.length < 2) return NextResponse.json({ available: false, reason: 'Nome muito curto' })

  const normalized = normalize(trimmed)

  // Nomes reservados
  if (RESERVED.has(normalized))
    return NextResponse.json({ available: false, reason: 'Nome reservado pela plataforma', suggestions: generateSuggestions(trimmed) })

  const db = createAdmin()

  // Busca todos os full_name na tabela profiles (case/space insensitive)
  const { data: profiles } = await db.from('profiles').select('id, full_name')
  const taken = (profiles ?? []).find((p: { id: string; full_name: string | null }) => {
    if (p.id === excludeId) return false
    return p.full_name && normalize(p.full_name) === normalized
  })

  if (taken)
    return NextResponse.json({ available: false, reason: 'Nome já está em uso', suggestions: generateSuggestions(trimmed) })

  return NextResponse.json({ available: true })
}
