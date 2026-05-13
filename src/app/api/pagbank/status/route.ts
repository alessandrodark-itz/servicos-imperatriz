import { NextRequest, NextResponse } from 'next/server'

const MP_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN ?? ''

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('orderId')
  if (!orderId) {
    return NextResponse.json({ error: 'orderId obrigatório' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${orderId}`, {
      headers: { Authorization: `Bearer ${MP_TOKEN}` },
      cache:   'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ isPaid: false, status: 'unknown' })
    }

    const data = await res.json()
    const isPaid = data.status === 'approved'

    return NextResponse.json({ isPaid, status: data.status ?? 'unknown' })

  } catch {
    return NextResponse.json({ isPaid: false, status: 'error' })
  }
}
