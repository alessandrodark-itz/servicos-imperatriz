import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const supabase = createAdmin()

  const { error } = await supabase
    .from('categories')
    .update({
      name:        body.name,
      slug:        body.slug,
      icon:        body.icon,
      description: body.description ?? null,
      color:       body.color ?? null,
      active:      body.active ?? true,
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdmin()

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
