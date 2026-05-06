import { v2 as cloudinary } from 'cloudinary'

let configured = false
function ensureConfigured() {
  if (configured) return
  configured = true
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key:    process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  })
}

export { cloudinary }

export interface UploadResult {
  publicId:    string
  url:         string
  thumbUrl:    string
  blurDataUrl: string
  width:       number
  height:      number
}

export async function uploadBuffer(buffer: Buffer, folder: string): Promise<UploadResult> {
  ensureConfigured()
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          eager: [
            { width: 300,  crop: 'limit', format: 'webp', quality: 'auto:good' },
            { width: 1200, crop: 'limit', format: 'webp', quality: 'auto:best' },
          ],
          eager_async: false,
        },
        (err, result) => {
          if (err || !result) { reject(err ?? new Error('Upload failed')); return }

          const thumbUrl    = result.eager?.[0]?.secure_url ?? result.secure_url
          const fullUrl     = result.eager?.[1]?.secure_url ?? result.secure_url
          const blurDataUrl = cloudinary.url(result.public_id, {
            width: 10, quality: 1, format: 'webp',
            effect: 'blur:200', crop: 'scale', secure: true,
          })

          resolve({ publicId: result.public_id, url: fullUrl, thumbUrl, blurDataUrl, width: result.width, height: result.height })
        }
      )
      .end(buffer)
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  ensureConfigured()
  await cloudinary.uploader.destroy(publicId)
}

export async function listFolderAssets(folder: string): Promise<Array<{ publicId: string; createdAt: string }>> {
  ensureConfigured()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await (cloudinary.search as any)
    .expression(`folder:${folder}/*`)
    .with_field('created_at')
    .max_results(500)
    .execute() as { resources: Array<{ public_id: string; created_at: string }> }

  return res.resources.map(r => ({ publicId: r.public_id, createdAt: r.created_at }))
}
