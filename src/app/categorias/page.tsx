'use client'

import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoryCard from '@/components/CategoryCard'
import SectionHeader from '@/components/SectionHeader'
import { categories } from '@/lib/mock-data'
import { Search } from 'lucide-react'

export default function CategoriasPage() {
  const router = useRouter()

  const handleCategoryClick = (slug: string) => {
    router.push(`/categorias/${slug}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header da Página */}
        <section className="relative overflow-hidden px-4 py-12 sm:py-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-fuchsia-600/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-400">
              Explore por categoria
            </p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Categorias de{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                Serviços
              </span>
            </h1>
            <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
              Encontre o profissional ideal navegando por nossas categorias
            </p>

            {/* Busca */}
            <div className="mt-8 flex justify-center">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar categoria..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:border-violet-500/50 focus:bg-white/10 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Grid de Categorias */}
        <section className="px-4 py-8 pb-16">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              title="Todas as Categorias"
              subtitle={`${categories.length} categorias disponíveis`}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="text-left"
                >
                  <CategoryCard category={category} />
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
