import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'
import { deleteImage } from '@/lib/cloudinary'

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data: { user }, error: authErr } = await createAdmin().auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })

  let body: { publicId?: string }
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Body inválido' }, { status: 400 }) }

  const { publicId } = body
  if (!publicId) return NextResponse.json({ error: 'publicId obrigatório' }, { status: 400 })

  if (!publicId.startsWith(`providers/${user.id}/`))
    return NextResponse.json({ error: 'Proibido' }, { status: 403 })

  try {
    await deleteImage(publicId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[delete-image]', err)
    return NextResponse.json({ error: 'Falha ao deletar imagem' }, { status: 500 })
  }
}
