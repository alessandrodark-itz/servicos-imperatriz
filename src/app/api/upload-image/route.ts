import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

export const maxDuration = 60 // Vercel Pro: até 60s

const ALLOWED = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const MAX_BYTES = 10 * 1024 * 1024
const BUCKET = 'provider-gallery'

async function ensureBucket(supabase: ReturnType<typeof createAdmin>) {
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
  // Ignora "already exists" — qualquer outro erro propaga
  if (error && !error.message.includes('already exist')) throw error
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const supabase = createAdmin()
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })

  let form: FormData
  try { form = await req.formData() }
  catch { return NextResponse.json({ error: 'Payload inválido' }, { status: 400 }) }

  const file = form.get('file') as File | null
  if (!file)                   return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: 'Formato inválido. Use JPG, PNG ou WEBP' }, { status: 400 })
  if (file.size > MAX_BYTES)   return NextResponse.json({ error: 'Arquivo muito grande. Máximo 10 MB' }, { status: 400 })

  try {
    const ext    = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path   = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    // Tenta upload direto; se bucket não existir, cria e tenta de novo
    let { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false })

    if (uploadErr?.message?.includes('not found') || uploadErr?.message?.includes('does not exist')) {
      await ensureBucket(supabase)
      ;({ error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, { contentType: file.type, upsert: false }))
    }

    if (uploadErr) throw new Error(uploadErr.message)

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    console.error('[upload-image]', err)
    return NextResponse.json({ error: 'Falha no upload. Tente novamente.' }, { status: 500 })
  }
}
