import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function hexToUint8Array(hex: string): Uint8Array {
  const pairs = hex.match(/.{1,2}/g) ?? []
  return new Uint8Array(pairs.map((b) => parseInt(b, 16)))
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const dot = token.lastIndexOf('.')
    if (dot === -1) return false

    const exp = token.slice(0, dot)
    const sig = token.slice(dot + 1)

    if (parseInt(exp) < Date.now()) return false

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(process.env.ADMIN_JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    return await crypto.subtle.verify(
      'HMAC',
      key,
      hexToUint8Array(sig).buffer as ArrayBuffer,
      new TextEncoder().encode(exp).buffer as ArrayBuffer
    )
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') return NextResponse.next()

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('admin_session')?.value
    if (!token || !(await verifyToken(token))) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
