import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Rate limit simples por IP — 5 confirmações por IP por minuto
const attempts = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= 5) return true
  entry.count++
  return false
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Muitas tentativas' }, { status: 429 })
    }

    const { userId } = await request.json()

    // Valida formato UUID v4
    if (!userId || !UUID_RE.test(userId)) {
      return NextResponse.json({ error: 'userId inválido' }, { status: 400 })
    }

    // Verifica se o usuário foi criado nos últimos 10 minutos (janela de cadastro)
    const { data: userData } = await adminClient.auth.admin.getUserById(userId)
    if (!userData?.user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const createdAt = new Date(userData.user.created_at).getTime()
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000
    if (createdAt < tenMinutesAgo) {
      return NextResponse.json({ error: 'Janela de confirmação expirada' }, { status: 403 })
    }

    const { error } = await adminClient.auth.admin.updateUserById(userId, {
      email_confirm: true,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
