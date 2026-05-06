import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BuscarContent from './BuscarContent'

export default function BuscarPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={<BuscarLoading />}>
        <BuscarContent />
      </Suspense>
      <Footer />
    </div>
  )
}

function BuscarLoading() {
  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
        <p className="mt-4 text-white/60">Carregando...</p>
      </div>
    </main>
  )
}
