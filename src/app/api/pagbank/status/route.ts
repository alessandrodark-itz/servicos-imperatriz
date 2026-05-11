import { NextRequest, NextResponse } from 'next/server'

const PAGBANK_API   = process.env.PAGBANK_API_URL ?? 'https://sandbox.api.pagseguro.com'
const PAGBANK_TOKEN = process.env.PAGBANK_TOKEN   ?? ''

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('orderId')
  if (!orderId) {
    return NextResponse.json({ error: 'orderId obrigatório' }, { status: 400 })
  }

  try {
    const res = await fetch(`${PAGBANK_API}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${PAGBANK_TOKEN}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ isPaid: false, status: 'unknown' })
    }

    const data = await res.json()
    const isPaid = (data.charges ?? []).some(
      (c: { status: string }) => c.status === 'PAID',
    )

    return NextResponse.json({ isPaid, status: data.status ?? 'unknown' })

  } catch {
    return NextResponse.json({ isPaid: false, status: 'error' })
  }
}
