'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Search, Heart, User } from 'lucide-react'

const items = [
  { href: '/',           icon: Home,        label: 'Início' },
  { href: '/categorias', icon: LayoutGrid,  label: 'Categorias' },
  { href: '/buscar',     icon: Search,      label: 'Buscar' },
  { href: '/favoritos',  icon: Heart,       label: 'Favoritos' },
  { href: '/perfil',     icon: User,        label: 'Perfil' },
]

export default function BottomNav() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around px-1 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
      style={{
        background: 'rgba(5,1,10,0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(138,92,255,0.18)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.5), 0 -1px 0 rgba(138,92,255,0.12)',
      }}
    >
      {items.map(({ href, icon: Icon, label }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 min-w-[56px] px-2 py-1 rounded-2xl transition-all duration-200 active:scale-90"
            style={{
              color: active ? '#B18CFF' : 'rgba(255,255,255,0.35)',
              background: active ? 'rgba(138,92,255,0.1)' : 'transparent',
            }}
          >
            <div className="relative flex items-center justify-center h-6 w-6">
              <Icon
                className="h-5 w-5 transition-all duration-200"
                style={{
                  filter: active
                    ? 'drop-shadow(0 0 6px rgba(177,140,255,0.9))'
                    : 'none',
                  strokeWidth: active ? 2.5 : 1.8,
                }}
              />
            </div>
            <span
              className="text-[9px] font-semibold tracking-wide leading-none transition-all duration-200"
              style={{ opacity: active ? 1 : 0.7 }}
            >
              {label}
            </span>
            {active && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                style={{ background: 'linear-gradient(90deg, #7b2ff7, #B18CFF)' }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
