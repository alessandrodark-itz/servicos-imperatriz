import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

export async function GET() {
  const supabase = createAdmin() as any
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .order('position', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createAdmin() as any

    const { data, error } = await supabase
      .from('ads')
      .insert({
        title:                body.title,
        description:          body.description          ?? null,
        slogan:               body.slogan               ?? null,
        brand_category:       body.brand_category       ?? null,
        image_url:            body.image_url,
        link_url:             body.link_url             ?? null,
        phone:                body.phone                ?? null,
        link_type:            body.link_type            ?? 'whatsapp',
        button_text:          body.button_text          ?? 'Saiba Mais',
        badge_type:           body.badge_type           ?? 'patrocinado',
        plan_type:            body.plan_type            ?? 'bronze',
        is_active:            body.is_active            ?? true,
        is_lifetime:          body.is_lifetime          ?? false,
        position:             body.position             ?? 0,
        starts_at:            body.starts_at            ?? null,
        expires_at:           body.is_lifetime ? null : (body.expires_at ?? null),
        // CTA independentes por plataforma
        cta_type_active:      body.cta_type_active      ?? 'whatsapp',
        cta_whatsapp_number:  body.cta_whatsapp_number  ?? null,
        cta_whatsapp_message: body.cta_whatsapp_message ?? null,
        cta_external_url:     body.cta_external_url     ?? null,
        cta_instagram_url:    body.cta_instagram_url    ?? null,
        cta_phone_number:     body.cta_phone_number     ?? null,
        cta_location_url:     body.cta_location_url     ?? null,
        cta_coupon_code:      body.cta_coupon_code      ?? null,
        cta_coupon_url:       body.cta_coupon_url       ?? null,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }
}
