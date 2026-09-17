'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Zap, ShieldCheck, Cpu, ArrowRight } from 'lucide-react'
import { fetchProducts } from '@/lib/api/client'
import { Product, PaginationMeta } from '@/lib/api/types'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { ProductCard } from '@/components/catalog/product-card'
import { FilterBar } from '@/components/catalog/filter-bar'
import { Pagination } from '@/components/catalog/pagination'

export default function HomePage() {
  const { t } = useTranslation()

  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  })

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortKey, setSortKey] = useState('createdAt_DESC')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [sortBy, sortOrder] = sortKey.split('_')

    try {
      const response = await fetchProducts({
        page,
        limit: 12,
        search: search || undefined,
        inStockOnly: inStockOnly || undefined,
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'DESC'
      })

      setProducts(response.items || [])
      if (response.meta) {
        setMeta(response.meta)
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to load catalog')
    } finally {
      setLoading(false)
    }
  }, [page, search, inStockOnly, sortKey])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    setPage(1)
  }

  const handleInStockChange = (checked: boolean) => {
    setInStockOnly(checked)
    setPage(1)
  }

  const handleSortChange = (newSort: string) => {
    setSortKey(newSort)
    setPage(1)
  }

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 p-8 sm:p-12 backdrop-blur-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
            <Zap className="h-3.5 w-3.5" />
            <span>High-Speed Event-Driven Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.catalog.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.catalog.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Zero Phantom Stock</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Cpu className="h-4 w-4 text-blue-400" />
              <span>Saga Rollback Guarantee</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      </section>

      {/* Catalog Filter Controls */}
      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        inStockOnly={inStockOnly}
        onInStockChange={handleInStockChange}
        sortBy={sortKey}
        onSortByChange={handleSortChange}
        totalCount={meta.totalItems}
      />

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-4 shimmer-bg min-h-[380px]"
            >
              <div className="aspect-square w-full rounded-xl bg-slate-800/60" />
              <div className="h-4 w-3/4 rounded bg-slate-800" />
              <div className="h-3 w-1/2 rounded bg-slate-800/60" />
              <div className="mt-auto pt-4 flex justify-between items-center">
                <div className="h-5 w-16 rounded bg-slate-800" />
                <div className="h-8 w-24 rounded-xl bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-center space-y-3">
          <p className="text-sm text-rose-300">{error}</p>
          <button
            onClick={loadProducts}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-500 transition-colors"
          >
            {t.common.retry}
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <p className="text-sm text-slate-400">{t.catalog.noProductsFound}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  )
}
