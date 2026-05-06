import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'
import { listFolderAssets, deleteImage } from '@/lib/cloudinary'

// Vercel cron: every Sunday at 03:00 UTC (configured in vercel.json)
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const db = createAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: providers } = await (db as any)
    .from('providers')
    .select('images, cover_url')

  const referencedUrls = new Set<string>()
  for (const p of providers ?? []) {
    for (const url of p.images ?? []) { if (url) referencedUrls.add(url) }
    if (p.cover_url) referencedUrls.add(p.cover_url)
  }

  const assets = await listFolderAssets('providers')

  // Grace period: skip assets uploaded in the last 24 h (may not be saved to DB yet)
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  const orphans = assets.filter(a => {
    if (new Date(a.createdAt).getTime() > cutoff) return false
    return !Array.from(referencedUrls).some(url => url.includes(a.publicId))
  })

  const deleted: string[] = []
  for (const orphan of orphans) {
    try { await deleteImage(orphan.publicId); deleted.push(orphan.publicId) }
    catch (err) { console.error('[cleanup-images] failed to delete', orphan.publicId, err) }
  }

  return NextResponse.json({ checked: assets.length, deleted: deleted.length, ids: deleted })
}
