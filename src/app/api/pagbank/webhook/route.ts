import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const MIN_AMOUNT_CENTS = 700

function verifyMPSignature(req: NextRequest, paymentId: string): boolean {
  const sigKey = process.env.MERCADOPAGO_SIGNATURE_KEY
  if (!sigKey) return true

  const signature  = req.headers.get('x-signature')
  const requestId  = req.headers.get('x-request-id') ?? ''
  if (!signature) return false

  const parts: Record<string, string> = {}
  signature.split(',').forEach(p => {
    const [k, v] = p.split('=')
    if (k && v) parts[k.trim()] = v.trim()
  })

  const ts = parts['ts']
  const v1 = parts['v1']
  if (!ts || !v1) return false

  const manifest = `id:${paymentId};request-id:${requestId};ts:${ts};`
  const hash = crypto.createHmac('sha256', sigKey).update(manifest).digest('hex')
  return hash === v1
}

export async function POST(req: NextRequest) {
  try {
    // Chave compartilhada — enviada via ?key= na notification_url
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
    if (secret) {
      const provided = req.nextUrl.searchParams.get('key')
      if (!provided || provided !== secret) {
        console.warn('[webhook] chave inválida ou ausente')
        return NextResponse.json({ ok: true })
      }
    }

    const rawBody = await req.text()
    let data: Record<string, unknown> = {}
    if (rawBody) {
      try { data = JSON.parse(rawBody) } catch { /* ignora */ }
    }

    console.log('[MP webhook]', JSON.stringify(data))

    // Extrai payment ID do body JSON ou dos query params (IPN)
    const paymentId: string =
      (data?.data as { id?: string })?.id ??
      req.nextUrl.searchParams.get('data.id') ??
      req.nextUrl.searchParams.get('id') ??
      ''

    const topic = (data as { type?: string })?.type ?? req.nextUrl.searchParams.get('topic') ?? ''

    if (!paymentId || (topic && topic !== 'payment')) {
      return NextResponse.json({ ok: true })
    }

    if (!verifyMPSignature(req, paymentId)) {
      console.warn('[webhook] assinatura Mercado Pago inválida')
      return NextResponse.json({ ok: true })
    }

    // Confirma o status real do pagamento na API do Mercado Pago
    const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN ?? ''
    const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpToken}` },
      cache:   'no-store',
    })

    if (!payRes.ok) {
      console.error(`[webhook] falha ao buscar payment ${paymentId}: ${payRes.status}`)
      return NextResponse.json({ ok: true })
    }

    const payment = await payRes.json()

    const referenceId: string = payment.external_reference ?? ''
    if (!referenceId.startsWith('VIP_')) {
      return NextResponse.json({ ok: true })
    }

    if (payment.status !== 'approved') {
      console.log(`[webhook] status ${payment.status} para ${referenceId} — ignorando`)
      return NextResponse.json({ ok: true })
    }

    const amountCents = Math.round((payment.transaction_amount ?? 0) * 100)
    if (amountCents < MIN_AMOUNT_CENTS) {
      console.error(`[webhook] valor insuficiente: ${amountCents}¢ (mínimo ${MIN_AMOUNT_CENTS}¢) — ref: ${referenceId}`)
      return NextResponse.json({ ok: true })
    }

    const parts = referenceId.split('_')
    const userId = parts[1]
    if (!userId) {
      console.error('[webhook] userId não encontrado em reference_id:', referenceId)
      return NextResponse.json({ ok: true })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Idempotência — evita ativar VIP duas vezes para o mesmo pagamento
    const { data: existing } = await supabase
      .from('vip_payments')
      .select('id')
      .eq('reference_id', referenceId)
      .maybeSingle()

    if (existing) {
      console.log(`[webhook] já processado: ${referenceId}`)
      return NextResponse.json({ ok: true })
    }

    const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: providerData } = await supabase
      .from('providers')
      .select('name, slug')
      .eq('user_id', userId)
      .single()

    const { error } = await supabase
      .from('providers')
      .update({ plan: 'vip', plan_expires_at: planExpiresAt })
      .eq('user_id', userId)

    if (error) {
      console.error('[webhook] Supabase update error:', error)
    } else {
      console.log(`[webhook] VIP ativado userId=${userId} | ${amountCents}¢ | ref=${referenceId}`)

      const { error: pe } = await supabase.from('vip_payments').insert({
        user_id:         userId,
        provider_name:   providerData?.name ?? null,
        provider_slug:   providerData?.slug ?? null,
        amount_cents:    amountCents,
        reference_id:    referenceId,
        charge_id:       String(paymentId),
        status:          'paid',
        paid_at:         new Date().toISOString(),
        plan_expires_at: planExpiresAt,
      })

      if (pe) console.warn('[webhook] vip_payments insert error:', pe.message)
    }

    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('[webhook] erro:', err)
    return NextResponse.json({ ok: true })
  }
}
