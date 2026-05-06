'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProviderCard from '@/components/ProviderCard'
import { searchProviders, providers, categories } from '@/lib/mock-data'
import { Search, SlidersHorizontal } from 'lucide-react'

export default function BuscarContent() {
  const searchParams = useSearchParams()
  const categoriaParam = searchParams.get('categoria')
  
  const [query, setQuery] = useState(categoriaParam || '')
  const [results, setResults] = useState(() => {
    if (categoriaParam) {
      return searchProviders(categoriaParam)
    }
    return []
  })
  const [hasSearched, setHasSearched] = useState(!!categoriaParam)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setResults(searchProviders(query.trim()))
      setHasSearched(true)
    }
  }

  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug)
    if (categorySlug) {
      const filtered = providers.filter(p => p.categorySlug === categorySlug)
      setResults(filtered)
      setHasSearched(true)
    } else {
      setResults([])
      setHasSearched(false)
    }
  }

  return (
    <main className="flex-1">
      {/* Header da Busca */}
      <section className="relative overflow-hidden px-4 py-12 sm:py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-400">
            Encontre o que precisa
          </p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Buscar{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Serviços
            </span>
          </h1>

          {/* Form de Busca */}
          <form onSubmit={handleSearch} className="mt-8">
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="O que você está procurando? Ex: encanador, eletricista..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-14 pr-32 text-lg text-white placeholder:text-white/40 focus:border-violet-500/50 focus:bg-white/10 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                >
                  Buscar
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Filtros */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 text-sm text-white/50 whitespace-nowrap">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtrar por:</span>
            </div>
            <button
              onClick={() => handleCategoryFilter('')}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-violet-500/20 text-violet-400'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.slug)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.slug
                    ? 'bg-violet-500/20 text-violet-400'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="px-4 py-8 pb-16">
        <div className="mx-auto max-w-7xl">
          {hasSearched ? (
            <>
              <div className="mb-6">
                <p className="text-white/60">
                  <span className="font-semibold text-white">{results.length}</span>{' '}
                  {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                  {query && (
                    <>
                      {' '}para <span className="text-violet-400">&quot;{query}&quot;</span>
                    </>
                  )}
                </p>
              </div>

              {results.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {results.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} variant="default" />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                  <Search className="mx-auto mb-4 h-12 w-12 text-white/20" />
                  <h3 className="text-lg font-semibold text-white">Nenhum resultado encontrado</h3>
                  <p className="mt-2 text-white/60">
                    Tente buscar com outros termos ou navegue por categorias
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto mb-4 h-16 w-16 text-white/20" />
              <h3 className="text-xl font-semibold text-white">Comece sua busca</h3>
              <p className="mt-2 text-white/60 max-w-md mx-auto">
                Digite o serviço que você precisa ou selecione uma categoria acima
              </p>

              {/* Categorias Sugeridas */}
              <div className="mt-8">
                <p className="mb-4 text-sm text-white/50">Categorias populares:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryFilter(category.slug)}
                      className="rounded-xl bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-violet-500/20 hover:text-violet-400"
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
