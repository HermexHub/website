'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Zap, ShieldCheck, Truck, RotateCcw, Award, ArrowRight } from 'lucide-react'
import { fetchProducts } from '@/lib/api/client'
import { Product, PaginationMeta } from '@/lib/api/types'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { ProductCard } from '@/components/catalog/product-card'
import { SidebarFilters } from '@/components/catalog/sidebar-filters'
import { TopFilterBar } from '@/components/catalog/top-filter-bar'
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

  // Filter states
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortKey, setSortKey] = useState('createdAt_DESC')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

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

      let items = response.items || []

      // Client-side category & price filters if API hasn't exposed them yet
      if (category) {
        items = items.filter(
          (p) => p.category?.toLowerCase() === category.toLowerCase()
        )
      }
      if (minPrice) {
        items = items.filter((p) => p.price >= Number(minPrice))
      }
      if (maxPrice) {
        items = items.filter((p) => p.price <= Number(maxPrice))
      }

      setProducts(items)
      if (response.meta) {
        setMeta({
          ...response.meta,
          totalItems: items.length
        })
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to load catalog')
    } finally {
      setLoading(false)
    }
  }, [page, search, category, inStockOnly, minPrice, maxPrice, sortKey])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    setPage(1)
  }

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat)
    setPage(1)
  }

  const handleInStockChange = (checked: boolean) => {
    setInStockOnly(checked)
    setPage(1)
  }

  const handlePriceChange = (min: string, max: string) => {
    setMinPrice(min)
    setMaxPrice(max)
    setPage(1)
  }

  const handleResetFilters = () => {
    setSearch('')
    setCategory('')
    setInStockOnly(false)
    setMinPrice('')
    setMaxPrice('')
    setSortKey('createdAt_DESC')
    setPage(1)
  }

  const hasActiveFilters = Boolean(
    search || category || inStockOnly || minPrice || maxPrice
  )

  return (
    <div className="space-y-10">
      {/* Promotional Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-8 sm:p-12 shadow-md">
        {/* Background Subtle Gradient Blobs */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Award className="h-3.5 w-3.5 text-amber-300" />
            <span>Official Flagship Tech Store</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {t.catalog.title}
          </h1>

          <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">
            {t.catalog.subtitle}
          </p>

          {/* Quick value props */}
          <div className="flex flex-wrap gap-4 pt-3 text-xs font-semibold text-blue-50">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <Truck className="h-4 w-4 text-emerald-300" />
              <span>Express 1-2 Day Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-blue-300" />
              <span>2-Year Full Warranty</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <RotateCcw className="h-4 w-4 text-amber-300" />
              <span>30-Day Easy Returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Storefront: Left Sidebar Filters + Right Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Left Sidebar (3 cols) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <SidebarFilters
            categories={[]}
            selectedCategory={category}
            onSelectCategory={handleCategoryChange}
            inStockOnly={inStockOnly}
            onInStockChange={handleInStockChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            onReset={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Mobile Filter Drawer Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <div className="relative ml-auto w-full max-w-xs bg-white p-6 shadow-2xl overflow-y-auto h-full space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="font-bold text-slate-900">Filters</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  ✕
                </button>
              </div>
              <SidebarFilters
                categories={[]}
                selectedCategory={category}
                onSelectCategory={(cat) => {
                  handleCategoryChange(cat)
                  setMobileFilterOpen(false)
                }}
                inStockOnly={inStockOnly}
                onInStockChange={handleInStockChange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={(min, max) => {
                  handlePriceChange(min, max)
                  setMobileFilterOpen(false)
                }}
                onReset={() => {
                  handleResetFilters()
                  setMobileFilterOpen(false)
                }}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>
        )}

        {/* Right Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Search & Sort Bar */}
          <TopFilterBar
            search={search}
            onSearchChange={handleSearchChange}
            sortBy={sortKey}
            onSortByChange={(newSort) => {
              setSortKey(newSort)
              setPage(1)
            }}
            totalCount={products.length}
            onToggleMobileFilter={() => setMobileFilterOpen(true)}
          />

          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-400">
                Active filters:
              </span>
              {category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Category: {category}
                  <button onClick={() => setCategory('')} className="ml-1 hover:text-blue-900">✕</button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)} className="ml-1 hover:text-emerald-900">✕</button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Price: ${minPrice || '0'} - ${maxPrice || '∞'}
                  <button onClick={() => { setMinPrice(''); setMaxPrice('') }} className="ml-1 hover:text-slate-900">✕</button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Search: "{search}"
                  <button onClick={() => setSearch('')} className="ml-1 hover:text-slate-900">✕</button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid Area */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4 shadow-xs"
                >
                  <div className="aspect-square w-full rounded-xl shimmer-bg" />
                  <div className="h-4 w-1/3 rounded shimmer-bg" />
                  <div className="h-5 w-4/5 rounded shimmer-bg" />
                  <div className="h-4 w-full rounded shimmer-bg" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 w-20 rounded shimmer-bg" />
                    <div className="h-9 w-24 rounded-xl shimmer-bg" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-rose-700">{error}</p>
              <button
                onClick={() => loadProducts()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-all shadow-xs"
              >
                {t.common.retry}
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center rounded-3xl border border-dashed border-slate-200 bg-white">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                🔍
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {t.catalog.noProductsFound}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-6">
                Try resetting applied filters or search for another model.
              </p>
              <button
                onClick={handleResetFilters}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
              >
                {t.catalog.clearFilters}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
