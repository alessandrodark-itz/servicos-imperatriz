'use client'

import { useState, useRef } from 'react'
import { Plus, X, Camera, Loader2, AlertCircle, Upload } from 'lucide-react'
import { createBrowser } from '@/lib/supabase'

interface SlotState {
  url:       string | null
  uploading: boolean
  progress:  number
  error:     string | null
}

interface Props {
  images:    string[]
  onChange:  (images: string[]) => void
  maxImages?: number
}

const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_BYTES = 10 * 1024 * 1024

export default function ImageUpload({ images, onChange, maxImages = 4 }: Props) {
  const [slots, setSlots] = useState<SlotState[]>(() =>
    Array(maxImages).fill(null).map((_, i) => ({
      url:       images[i] ?? null,
      uploading: false,
      progress:  0,
      error:     null,
    }))
  )
  const [dragOver, setDragOver] = useState<number | null>(null)
  const fileRefs = useRef<Array<HTMLInputElement | null>>(Array(maxImages).fill(null))

  function patchSlot(i: number, patch: Partial<SlotState>) {
    setSlots(prev => {
      const next = [...prev]
      next[i] = { ...next[i], ...patch }
      return next
    })
  }

  async function handleFile(slot: number, file: File) {
    if (!ALLOWED.includes(file.type)) {
      patchSlot(slot, { error: 'Formato inválido. Use JPG, PNG ou WEBP' })
      return
    }
    if (file.size > MAX_BYTES) {
      patchSlot(slot, { error: 'Arquivo muito grande. Máximo 10 MB' })
      return
    }

    patchSlot(slot, { uploading: true, progress: 0, error: null })

    try {
      const { data: { session } } = await createBrowser().auth.getSession()
      if (!session) throw new Error('Sessão expirada. Faça login novamente.')

      const fd = new FormData()
      fd.append('file', file)

      const newUrl = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/upload-image')
        xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`)
        xhr.timeout = 60_000
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            patchSlot(slot, { progress: Math.round((e.loaded / e.total) * 90) })
        }
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText) as { url?: string; error?: string }
            if (xhr.status < 300 && data.url) resolve(data.url)
            else reject(new Error(data.error ?? `Erro ${xhr.status} no servidor.`))
          } catch {
            reject(new Error(`Erro ${xhr.status}: resposta inválida do servidor.`))
          }
        }
        xhr.ontimeout = () => reject(new Error('Tempo esgotado. Tente uma imagem menor.'))
        xhr.onerror   = () => reject(new Error('Erro de rede. Tente novamente.'))
        xhr.send(fd)
      })

      // Functional updater so we see the freshest state of all other slots
      setSlots(prev => {
        const next = prev.map((s, i) =>
          i === slot ? { url: newUrl, uploading: false, progress: 100, error: null } : s
        )
        onChange(next.map(s => s.url ?? '').filter(Boolean))
        return next
      })
    } catch (err) {
      patchSlot(slot, {
        uploading: false,
        error: err instanceof Error ? err.message : 'Erro ao fazer upload',
      })
    }
  }

  function removeSlot(slot: number) {
    setSlots(prev => {
      const next = prev.map((s, i) =>
        i === slot ? { url: null, uploading: false, progress: 0, error: null } : s
      )
      onChange(next.map(s => s.url ?? '').filter(Boolean))
      return next
    })
    // Reset file input so the same file can be re-selected
    if (fileRefs.current[slot]) fileRefs.current[slot]!.value = ''
  }

  function onDrop(slot: number, e: React.DragEvent) {
    e.preventDefault()
    setDragOver(null)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(slot, file)
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {slots.map((slot, i) => {
        const isMain  = i === 0
        const isDrag  = dragOver === i
        const isEmpty = !slot.url && !slot.uploading

        return (
          <div key={i}>
            {/* Hidden file input */}
            <input
              ref={el => { fileRefs.current[i] = el }}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(i, f) }}
            />

            {/* Slot container */}
            <div
              style={{ aspectRatio: '16/9' }}
              onDragOver={e => { e.preventDefault(); setDragOver(i) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => onDrop(i, e)}
              onClick={() => isEmpty || slot.uploading ? fileRefs.current[i]?.click() : undefined}
              className={[
                'group relative overflow-hidden rounded-2xl border-2 transition-all duration-300',
                slot.error
                  ? 'border-red-500/50 bg-red-500/5'
                  : isEmpty
                    ? isDrag
                      ? 'cursor-copy border-solid border-violet-500/60 bg-violet-500/10'
                      : 'cursor-pointer border-dashed border-white/15 bg-white/[0.02] hover:border-violet-500/50 hover:bg-violet-500/5'
                    : slot.uploading
                      ? 'cursor-wait border-violet-500/40 bg-black'
                      : 'border-white/10 cursor-default',
              ].join(' ')}
            >
              {/* ── Has image ── */}
              {slot.url && !slot.uploading && (
                <>
                  <img
                    src={slot.url}
                    alt={`Foto ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/45" />

                  {/* Replace button */}
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); fileRefs.current[i]?.click() }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[10px] font-semibold text-white drop-shadow">Alterar</span>
                  </button>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); removeSlot(i) }}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/70 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-red-500/80 hover:text-white group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>

                  {/* Slot badge */}
                  <div className={[
                    'absolute bottom-1.5 left-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold backdrop-blur-sm',
                    isMain ? 'bg-violet-600/90 text-white' : 'bg-black/55 text-white/60',
                  ].join(' ')}>
                    {isMain ? '★ Principal' : `Foto ${i + 1}`}
                  </div>
                </>
              )}

              {/* ── Uploading ── */}
              {slot.uploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0018]">
                  <Loader2 className="h-7 w-7 animate-spin text-violet-400" />
                  <div className="w-3/4">
                    <div className="mb-1 flex justify-between">
                      <span className="text-[10px] text-white/40">Enviando...</span>
                      <span className="text-[10px] font-bold text-violet-400">{slot.progress}%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-300"
                        style={{ width: `${slot.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Empty ── */}
              {isEmpty && !slot.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  {isDrag ? (
                    <>
                      <Upload className="h-7 w-7 text-violet-400" />
                      <span className="text-[10px] font-semibold text-violet-300">Soltar aqui</span>
                    </>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-all duration-300 group-hover:bg-violet-500/20">
                        <Plus className="h-5 w-5 text-white/25 transition-colors group-hover:text-violet-400" />
                      </div>
                      <span className="text-[10px] font-medium text-white/25 transition-colors group-hover:text-violet-400/70">
                        {isMain ? 'Foto principal' : `Foto ${i + 1}`}
                      </span>
                      <span className="text-[9px] text-white/15">ou arraste aqui</span>
                    </>
                  )}
                </div>
              )}

              {/* ── Error ── */}
              {slot.error && (
                <div
                  className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 p-3"
                  onClick={() => fileRefs.current[i]?.click()}
                >
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  <p className="text-center text-[10px] leading-tight text-red-400">{slot.error}</p>
                  <span className="text-[9px] text-red-400/60">Toque para tentar novamente</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
