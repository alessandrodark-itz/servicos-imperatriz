import { NextResponse } from 'next/server'
import { verifyPassword, createSessionToken } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password || !verifyPassword(password)) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
    }

    const token = createSessionToken()
    const response = NextResponse.json({ ok: true })

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
