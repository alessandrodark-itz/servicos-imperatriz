import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import QRCode from 'qrcode'

const MP_TOKEN  = process.env.MERCADOPAGO_ACCESS_TOKEN ?? ''
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.servitz.com.br'
const VIP_AMOUNT = 7.99 // R$ 7,99

export async function POST(req: NextRequest) {
  console.log('[create-pix] token prefix:', MP_TOKEN.slice(0, 15), '| len:', MP_TOKEN.length)
  try {
    const { customerName, customerCpf, userId } = await req.json()

    if (!customerName?.trim() || !userId) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const cpf = customerCpf?.replace(/\D/g, '')
    if (!cpf || cpf.length !== 11) {
      return NextResponse.json({ error: 'CPF inválido' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    const { data: authUser } = await supabase.auth.admin.getUserById(userId)
    const email = authUser?.user?.email ?? `pay${Date.now()}@servitz.com.br`

    const referenceId = `VIP_${userId}_${Date.now()}`
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    const nameParts = customerName.trim().split(' ')
    const firstName = nameParts[0]
    const lastName  = nameParts.slice(1).join(' ') || firstName

    const notificationUrl = process.env.MERCADOPAGO_WEBHOOK_SECRET
      ? `${SITE_URL}/api/pagbank/webhook?key=${process.env.MERCADOPAGO_WEBHOOK_SECRET}`
      : `${SITE_URL}/api/pagbank/webhook`

    const paymentBody = {
      transaction_amount: VIP_AMOUNT,
      payment_method_id:  'pix',
      payer: {
        email,
        first_name: firstName,
        last_name:  lastName,
        identification: { type: 'CPF', number: cpf },
      },
      description:        'Plano VIP Serv-Itz — 30 dias',
      external_reference: referenceId,
      notification_url:   notificationUrl,
      date_of_expiration: expiresAt,
    }

    const res = await fetch('https://api.mercadopago.com/v1/payments', {
      method:  'POST',
      headers: {
        Authorization:       `Bearer ${MP_TOKEN}`,
        'Content-Type':      'application/json',
        'X-Idempotency-Key': referenceId,
      },
      body: JSON.stringify(paymentBody),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Mercado Pago error:', JSON.stringify(data))
      const msg = data?.message ?? data?.cause?.[0]?.description ?? 'Erro ao gerar cobrança PIX'
      return NextResponse.json({ error: msg }, { status: 500 })
    }

    const pixCode  = data.point_of_interaction?.transaction_data?.qr_code
    const qrBase64 = data.point_of_interaction?.transaction_data?.qr_code_base64

    if (!pixCode) {
      return NextResponse.json({ error: 'PIX não retornado pelo Mercado Pago' }, { status: 500 })
    }

    const qrCodeDataUrl = qrBase64
      ? `data:image/png;base64,${qrBase64}`
      : await QRCode.toDataURL(pixCode, {
          width:  280,
          margin: 2,
          color:  { dark: '#0d0520', light: '#ffffff' },
        })

    return NextResponse.json({
      orderId:      String(data.id),
      referenceId,
      pixCode,
      qrCodeDataUrl,
      expiresAt:    data.date_of_expiration ?? expiresAt,
    })

  } catch (err) {
    console.error('create-pix error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
