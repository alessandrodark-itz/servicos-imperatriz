import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

function verifyToken(token: string): boolean {
  try {
    const dot = token.lastIndexOf('.')
    if (dot === -1) return false
    const exp = token.slice(0, dot)
    const sig  = token.slice(dot + 1)
    if (parseInt(exp) < Date.now()) return false
    const expected = crypto
      .createHmac('sha256', process.env.ADMIN_JWT_SECRET!)
      .update(exp)
      .digest('hex')
    if (expected.length !== sig.length) return false
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  } catch {
    return false
  }
}

/**
 * Verifica autenticação admin dentro de route handlers.
 * Retorna NextResponse 401 se não autorizado, null se ok.
 *
 * Usage:
 *   const deny = requireAdmin(request)
 *   if (deny) return deny
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const token = req.cookies.get('admin_session')?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  return null
}

/**
 * Registra ação administrativa na tabela logs_admin.
 * Fire-and-forget — não lança erro se a tabela não existir.
 */
export async function logAdminAction(
  action: string,
  details?: Record<string, unknown>,
  req?: NextRequest,
): Promise<void> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )
    const ip = req
      ? (req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? req.headers.get('x-real-ip') ?? null)
      : null

    await supabase.from('logs_admin').insert({
      action,
      details: details ?? null,
      ip,
      created_at: new Date().toISOString(),
    })
  } catch {
    // silencioso — log não deve quebrar a operação principal
  }
}
