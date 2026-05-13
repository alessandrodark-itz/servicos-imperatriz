import { NextResponse } from 'next/server'

// Rota de diagnóstico desabilitada em produção
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Debug disponível apenas em desenvolvimento' })
}
