import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import QRCode from 'qrcode'

const PAGBANK_API   = process.env.PAGBANK_API_URL  ?? 'https://sandbox.api.pagseguro.com'
const PAGBANK_TOKEN = process.env.PAGBANK_TOKEN    ?? ''
const SITE_URL      = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.servitz.com.br'
const VIP_CENTS     = 799 // R$ 7,99

export async function POST(req: NextRequest) {
  try {
    const { customerName, customerCpf, userId } = await req.json()

    if (!customerName?.trim() || !userId) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const cpf = customerCpf?.replace(/\D/g, '')
    if (!cpf || cpf.length !== 11) {
      return NextResponse.json({ error: 'CPF inválido' }, { status: 400 })
    }

    // Busca e-mail real do usuário via service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    const { data: authUser } = await supabase.auth.admin.getUserById(userId)
    const email = authUser?.user?.email ?? `pay${Date.now()}@servitz.com.br`

    // Expira em 1 hora
    const expiration = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    // reference_id: VIP_{userId}_{timestamp}  — sem conflito pois UUID usa "-" e nós usamos "_"
    const referenceId = `VIP_${userId}_${Date.now()}`

    const orderBody = {
      reference_id: referenceId,
      customer: {
        name:   customerName.trim(),
        email,
        tax_id: cpf,
      },
      items: [{
        reference_id: 'vip-30d',
        name:         'Plano VIP Serv-Itz — 30 dias',
        quantity:     1,
        unit_amount:  VIP_CENTS,
      }],
      qr_codes: [{
        amount:          { value: VIP_CENTS },
        expiration_date: expiration,
      }],
      notification_urls: [`${SITE_URL}/api/pagbank/webhook`],
    }

    const res = await fetch(`${PAGBANK_API}/orders`, {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${PAGBANK_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderBody),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('PagBank error:', JSON.stringify(data))
      const msg = data?.error_messages?.[0]?.description ?? 'Erro ao gerar cobrança PIX'
      return NextResponse.json({ error: msg }, { status: 500 })
    }

    const qr = data.qr_codes?.[0]
    if (!qr?.text) {
      return NextResponse.json({ error: 'PIX não retornado pelo PagBank' }, { status: 500 })
    }

    // Gera QR code como base64 (evita dependência de URL com auth)
    const qrCodeDataUrl = await QRCode.toDataURL(qr.text, {
      width:  280,
      margin: 2,
      color:  { dark: '#0d0520', light: '#ffffff' },
    })

    return NextResponse.json({
      orderId:      data.id,
      referenceId:  data.reference_id,
      pixCode:      qr.text,
      qrCodeDataUrl,
      expiresAt:    qr.expiration_date,
    })

  } catch (err) {
    console.error('create-pix error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
