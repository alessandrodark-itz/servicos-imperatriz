'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createBrowser } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Loader2 } from 'lucide-react'

export default function PrestadoresLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<'checking' | 'ok' | 'redirecting'>('checking')

  useEffect(() => {
    createBrowser()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (!session) {
          setStatus('redirecting')
          router.replace(`/login?next=${encodeURIComponent(pathname)}`)
        } else {
          setStatus('ok')
        }
      })
      .catch(() => {
        setStatus('redirecting')
        router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      })
  }, [router, pathname])

  if (status !== 'ok') {
    return (
      <div className="flex min-h-screen flex-col" style={{ background: '#04000f' }}>
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            <p className="text-sm text-white/40">Verificando acesso...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return <>{children}</>
}
