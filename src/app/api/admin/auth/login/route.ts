import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createSessionToken } from '@/lib/admin-auth'

// IP -> { count, resetAt }
const attempts = new Map<string, { count: number; resetAt: number }>()

const MAX_ATTEMPTS = 5
const WINDOW_MS    = 15 * 60 * 1000 // 15 minutos

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function checkRateLimit(ip: string): { blocked: boolean; remaining: number; retryAfter: number } {
  const now   = Date.now()
  const entry = attempts.get(ip)

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { blocked: false, remaining: MAX_ATTEMPTS - 1, retryAfter: 0 }
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { blocked: true, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  return { blocked: false, remaining: MAX_ATTEMPTS - entry.count, retryAfter: 0 }
}

function clearAttempts(ip: string) {
  attempts.delete(ip)
}

export async function POST(request: NextRequest) {
  const ip = getIp(request)
  const { blocked, remaining, retryAfter } = checkRateLimit(ip)

  if (blocked) {
    return NextResponse.json(
      { error: `Muitas tentativas. Aguarde ${Math.ceil(retryAfter / 60)} minutos.` },
      {
        status: 429,
        headers: {
          'Retry-After':          String(retryAfter),
          'X-RateLimit-Limit':    String(MAX_ATTEMPTS),
          'X-RateLimit-Remaining':'0',
        },
      }
    )
  }

  try {
    const { password } = await request.json()

    if (!password || !verifyPassword(password)) {
      return NextResponse.json(
        { error: `Senha incorreta. Tentativas restantes: ${remaining}` },
        {
          status: 401,
          headers: {
            'X-RateLimit-Limit':     String(MAX_ATTEMPTS),
            'X-RateLimit-Remaining': String(remaining),
          },
        }
      )
    }

    clearAttempts(ip)

    const token    = createSessionToken()
    const response = NextResponse.json({ ok: true })

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   60 * 60 * 24,
      path:     '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
