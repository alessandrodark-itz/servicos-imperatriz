import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type Props = {
  title: string
  subtitle?: string
  href?: string
  linkText?: string
}

export default function SectionHeader({ title, subtitle, href, linkText = 'Ver todos' }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {subtitle && (
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-violet-400">
            {subtitle}
          </p>
        )}
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group flex items-center gap-1 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          {linkText}
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
