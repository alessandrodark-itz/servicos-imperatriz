import { NextResponse, NextRequest } from 'next/server'
import { createAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/require-admin'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = requireAdmin(req)
  if (deny) return deny

  const { id } = await params
  const body = await req.json()
  const supabase = createAdmin()

  const { error } = await supabase
    .from('demo_providers')
    .update({
      name:             body.name,
      category:         body.category,
      category_slug:    body.category_slug,
      rating:           body.rating,
      reviews:          body.reviews,
      description:      body.description,
      image:            body.image,
      avatar_image:     body.avatar_image     ?? null,
      carousel_images:  body.carousel_images  ?? [],
      phone:            body.phone,
      whatsapp:         body.whatsapp,
      location:         body.location,
      vip_badge_type:   body.vip_badge_type,
      vip_theme_id:     body.vip_theme_id     ?? null,
      active:           body.active,
      updated_at:       new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
