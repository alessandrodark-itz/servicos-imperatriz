'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

type Props = {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const labels = ['', 'Ruim', 'Regular', 'Bom', 'Ótimo', 'Excelente']

export default function StarRating({ value, onChange, readonly = false, size = 'md' }: Props) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value

  const sizeClass =
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-9 w-9' : 'h-6 w-6'

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-all duration-150 ${
              !readonly ? 'cursor-pointer hover:scale-125' : 'cursor-default'
            }`}
          >
            <Star
              className={`${sizeClass} transition-all duration-150 ${
                star <= active
                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]'
                  : 'fill-white/10 text-white/20'
              }`}
            />
          </button>
        ))}
      </div>
      {!readonly && hovered > 0 && (
        <span className="text-xs font-medium text-yellow-400">{labels[hovered]}</span>
      )}
    </div>
  )
}
