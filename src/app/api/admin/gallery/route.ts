import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

export async function GET() {
  const supabase = createAdmin()

  const buckets = ['covers', 'avatars']
  const allImages: {
    name: string; url: string; bucket: string; created_at: string; size: number
  }[] = []

  for (const bucket of buckets) {
    const { data: files } = await supabase.storage.from(bucket).list('', {
      limit: 200,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    for (const file of files ?? []) {
      if (!file.name || file.name === '.emptyFolderPlaceholder') continue
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(file.name)
      allImages.push({
        name:       file.name,
        url:        urlData.publicUrl,
        bucket,
        created_at: file.created_at ?? new Date().toISOString(),
        size:       file.metadata?.size ?? 0,
      })
    }
  }

  // também lista subpastas comuns (ex: userId/avatar)
  const bucketsWithFolders = ['covers', 'avatars']
  for (const bucket of bucketsWithFolders) {
    const { data: folders } = await supabase.storage.from(bucket).list('')
    for (const folder of folders ?? []) {
      if (!folder.id) {
        // é uma pasta
        const { data: subFiles } = await supabase.storage.from(bucket).list(folder.name, { limit: 50 })
        for (const file of subFiles ?? []) {
          if (!file.name || file.name === '.emptyFolderPlaceholder') continue
          const path = `${folder.name}/${file.name}`
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
          const exists = allImages.some(img => img.url === urlData.publicUrl)
          if (!exists) {
            allImages.push({
              name:       path,
              url:        urlData.publicUrl,
              bucket,
              created_at: file.created_at ?? new Date().toISOString(),
              size:       file.metadata?.size ?? 0,
            })
          }
        }
      }
    }
  }

  return NextResponse.json(allImages)
}
