'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  ArrowRight,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Keyboard,
  BatteryCharging
} from 'lucide-react'
import { fetchProducts } from '@/lib/api/client'
import { Product, PaginationMeta } from '@/lib/api/types'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { ProductCard } from '@/components/catalog/product-card'
import { SidebarFilters, AppliedFilters } from '@/components/catalog/sidebar-filters'
import { TopFilterBar } from '@/components/catalog/top-filter-bar'
import { Pagination } from '@/components/catalog/pagination'
import { formatPrice } from '@/lib/utils/format'
import {
  extractProductBrand,
  extractProductCpu,
  extractProductRam,
  extractProductStorage
} from '@/lib/utils/specs'

export default function HomePage() {
  const { t, locale } = useTranslation()

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

  // Facet filter states
  const [rawProducts, setRawProducts] = useState<Product[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCpus, setSelectedCpus] = useState<string[]>([])
  const [selectedRams, setSelectedRams] = useState<string[]>([])
  const [selectedStorages, setSelectedStorages] = useState<string[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const handleApplyFilters = (filters: AppliedFilters) => {
    setCategory(filters.category)
    setInStockOnly(filters.inStockOnly)
    setMinPrice(filters.minPrice)
    setMaxPrice(filters.maxPrice)
    setSelectedBrands(filters.brands)
    setSelectedCpus(filters.cpus)
    setSelectedRams(filters.rams)
    setSelectedStorages(filters.storages)
    setPage(1)
    setMobileFilterOpen(false)
  }

  const handleRemoveBrand = (brand: string) => {
    setSelectedBrands((prev) => prev.filter((b) => b !== brand))
    setPage(1)
  }

  const handleRemoveCpu = (cpu: string) => {
    setSelectedCpus((prev) => prev.filter((c) => c !== cpu))
    setPage(1)
  }

  const handleRemoveRam = (ram: string) => {
    setSelectedRams((prev) => prev.filter((r) => r !== ram))
    setPage(1)
  }

  const handleRemoveStorage = (storage: string) => {
    setSelectedStorages((prev) => prev.filter((s) => s !== storage))
    setPage(1)
  }

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [sortBy, sortOrder] = sortKey.split('_')

    try {
      const response = await fetchProducts({
        page: 1,
        limit: 100
      })

      const rawItems = response.items || []
      setRawProducts(rawItems)

      let items = [...rawItems]

      // Availability filter
      if (inStockOnly) {
        items = items.filter((p) => p.stockQuantity > 0)
      }

      // Category filter
      if (category) {
        items = items.filter(
          (p) => p.category?.toLowerCase() === category.toLowerCase()
        )
      }

      // Search filter
      if (search && search.trim()) {
        const q = search.trim().toLowerCase()
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.sku?.toLowerCase().includes(q)
        )
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        items = items.filter((p) => selectedBrands.includes(extractProductBrand(p)))
      }

      // CPU filter
      if (selectedCpus.length > 0) {
        items = items.filter((p) => {
          const cpu = extractProductCpu(p)
          return cpu ? selectedCpus.includes(cpu) : false
        })
      }

      // RAM filter
      if (selectedRams.length > 0) {
        items = items.filter((p) => {
          const ram = extractProductRam(p)
          return ram ? selectedRams.includes(ram) : false
        })
      }

      // Storage filter
      if (selectedStorages.length > 0) {
        items = items.filter((p) => {
          const storage = extractProductStorage(p)
          return storage ? selectedStorages.includes(storage) : false
        })
      }

      // Price filters
      if (minPrice) {
        items = items.filter((p) => p.price >= Number(minPrice))
      }
      if (maxPrice) {
        items = items.filter((p) => p.price <= Number(maxPrice))
      }

      // Sorting
      if (sortBy === 'price') {
        items.sort((a, b) =>
          sortOrder === 'ASC' ? a.price - b.price : b.price - a.price
        )
      } else if (sortBy === 'name') {
        items.sort((a, b) =>
          sortOrder === 'ASC'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        )
      } else if (sortBy === 'brand') {
        items.sort((a, b) => {
          const brandA = extractProductBrand(a)
          const brandB = extractProductBrand(b)
          return sortOrder === 'ASC'
            ? brandA.localeCompare(brandB)
            : brandB.localeCompare(brandA)
        })
      } else if (sortBy === 'stockQuantity') {
        items.sort((a, b) =>
          sortOrder === 'ASC'
            ? a.stockQuantity - b.stockQuantity
            : b.stockQuantity - a.stockQuantity
        )
      }

      const pageSize = 12
      const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
      const safePage = Math.min(Math.max(1, page), totalPages)
      const paginatedItems = items.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
      )

      setProducts(paginatedItems)
      setMeta({
        page: safePage,
        limit: pageSize,
        totalItems: items.length,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1
      })
    } catch (err) {
      setError((err as Error).message || 'Failed to load catalog')
    } finally {
      setLoading(false)
    }
  }, [
    page,
    search,
    category,
    inStockOnly,
    selectedBrands,
    selectedCpus,
    selectedRams,
    selectedStorages,
    minPrice,
    maxPrice,
    sortKey
  ])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    setPage(1)
  }

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat)
    setSelectedBrands([])
    setSelectedCpus([])
    setSelectedRams([])
    setSelectedStorages([])
    setPage(1)
  }

  const handleResetFilters = () => {
    setSearch('')
    setCategory('')
    setInStockOnly(false)
    setMinPrice('')
    setMaxPrice('')
    setSelectedBrands([])
    setSelectedCpus([])
    setSelectedRams([])
    setSelectedStorages([])
    setSortKey('createdAt_DESC')
    setPage(1)
  }

  const hasActiveFilters = Boolean(
    search ||
      category ||
      inStockOnly ||
      minPrice ||
      maxPrice ||
      selectedBrands.length > 0 ||
      selectedCpus.length > 0 ||
      selectedRams.length > 0 ||
      selectedStorages.length > 0
  )

  // 6 Visual Category Quick Cards
  const quickCategories = [
    {
      id: 'Smartphones',
      name: locale === 'ua' ? 'Смартфони' : 'Smartphones',
      desc: locale === 'ua' ? 'iPhone, Samsung, Xiaomi' : 'iPhone, Samsung & more',
      icon: Smartphone,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      id: 'Laptops',
      name: locale === 'ua' ? 'Ноутбуки' : 'Laptops',
      desc: locale === 'ua' ? 'MacBook, ROG, ThinkPad' : 'MacBook, Asus ROG',
      icon: Laptop,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
    },
    {
      id: 'Audio',
      name: locale === 'ua' ? 'Навушники' : 'Audio Gear',
      desc: locale === 'ua' ? 'Sony, AirPods, Marshall' : 'AirPods, Sony ANC',
      icon: Headphones,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      id: 'Wearables',
      name: locale === 'ua' ? 'Смарт-годинники' : 'Wearables',
      desc: locale === 'ua' ? 'Apple Watch, Garmin' : 'Apple Watch & Garmin',
      icon: Watch,
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      id: 'Keyboards',
      name: locale === 'ua' ? 'Клавіатури' : 'Keyboards',
      desc: locale === 'ua' ? 'Механічні та миші' : 'Mechanical & Custom',
      icon: Keyboard,
      color: 'bg-purple-50 text-purple-600 border-purple-100'
    },
    {
      id: 'Power Banks',
      name: locale === 'ua' ? 'Павербанки' : 'Power Banks',
      desc: locale === 'ua' ? 'EcoFlow, Baseus, Anker' : 'Power stations & packs',
      icon: BatteryCharging,
      color: 'bg-rose-50 text-rose-600 border-rose-100'
    }
  ]

  // Brand partners strip
  const brandLogos = [
    'Apple',
    'Samsung',
    'Xiaomi',
    'Asus',
    'Sony',
    'Lenovo',
    'Dell',
    'Anker'
  ]

  return (
    <div className="space-y-10">
      {/* 1. Seamless Flagship Promo Banner (Identical layout for UA and EN) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-800/80">
        {/* Subtle Ambient Backlight */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Banner Left Info */}
          <div className="lg:col-span-7 space-y-5">
            {/* Minimalist Apple-Style Status Tag (No generic AI gradient pills) */}
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-blue-400">
              <Zap className="h-3.5 w-3.5 text-blue-400 fill-blue-400" />
              <span>
                {locale === 'ua'
                  ? 'APPLE AUTHORIZED • 2 РОКИ ОФІЦІЙНОЇ ГАРАНТІЇ'
                  : 'APPLE AUTHORIZED • 2-YEAR OFFICIAL WARRANTY'}
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                iPhone 15 Pro Max
              </h1>
              <p className="text-xl sm:text-2xl font-bold mt-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-white">
                {locale === 'ua' ? 'Титанова міць. Досконалість у деталях.' : 'Titanium Strength. Pure Precision.'}
              </p>
            </div>

            {/* Feature specs chips */}
            <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10">
                A17 Pro 3nm
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10">
                Титан Grade 5
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10">
                Камера 48 Мп • 5x Zoom
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10">
                120Hz ProMotion
              </span>
            </div>

            {/* Price & Bank Installments (Screenshot 3 widgets) + Buy Button (Identical in UA & EN) */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Left Column: Price + CTA Button directly below (Ukrainian layout approved by user) */}
              <div className="space-y-3 shrink-0">
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                    {locale === 'ua' ? 'Спеціальна ціна' : 'Special Price'}
                  </span>
                  <span className="text-3xl sm:text-4xl font-bold text-white font-sans tracking-tight">
                    54 999 грн
                  </span>
                </div>

                <div>
                  <button
                    onClick={() => {
                      handleCategoryChange('Smartphones')
                      const el = document.getElementById('catalog-section')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 text-sm font-bold shadow-lg shadow-blue-600/35 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>{locale === 'ua' ? 'Купити зараз' : 'Buy Now'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Vertical divider */}
              <div className="h-16 w-px bg-slate-800 hidden sm:block" />

              {/* Right Column: Authentic Banking Installments (Exact match to Screenshot 3) */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                {/* PrivatBank (Screenshot 3: Yellow circle with green quadrant pie) */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-sm transition-colors">
                  <div className="h-7 w-7 rounded-full bg-amber-400 relative overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                    <div className="absolute top-0 left-0 w-3.5 h-3.5 bg-emerald-600 rounded-tl-full" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-300 leading-tight">
                      ПриватБанк
                    </span>
                    <span className="block text-xs font-bold text-white tracking-normal mt-0.5 leading-tight">
                      від 5 499 ₴ × 10
                    </span>
                  </div>
                </div>

                {/* monobank (Screenshot 3: Cat paw icon + amount) */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-sm transition-colors">
                  <span className="text-xl shrink-0 leading-none">🐾</span>
                  <div>
                    <span className="block text-xs font-semibold text-slate-300 leading-tight">
                      monobank
                    </span>
                    <span className="block text-xs font-bold text-white tracking-normal mt-0.5 leading-tight">
                      від 4 583 ₴ × 12
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Right: High-Res Close-Up Phone Showcase */}
          <div className="lg:col-span-5 flex items-center justify-center p-2">
            <img
              src="https://i.namu.wiki/i/aOMk-BAxRzsMkQa7FWQqd47K09oliNg9cASgImzgLNjuGBPDV26ChorqL1s5Qx9alUr9bl5NWa0cXfHVeGAl4g.webp"
              alt="iPhone 15 Pro Max Natural Titanium"
              className="w-full max-w-[460px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,102,255,0.4)] transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* 2. Visual Category Quick Cards (6 Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
            {locale === 'ua' ? 'Популярні категорії' : 'Featured Categories'}
          </h2>
          {category && (
            <button
              onClick={() => handleCategoryChange('')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              {locale === 'ua' ? 'Показати всі' : 'Show All'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {quickCategories.map((cat) => {
            const Icon = cat.icon
            const isSelected = category.toLowerCase() === cat.id.toLowerCase()

            return (
              <button
                key={cat.id}
                onClick={() => {
                  handleCategoryChange(isSelected ? '' : cat.id)
                  const el = document.getElementById('catalog-section')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`flex flex-col items-start p-4 rounded-3xl border text-left transition-all duration-200 cursor-pointer ${isSelected
                  ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-600/20'
                  : 'border-slate-200/90 bg-white hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5'
                  }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${cat.color} mb-3`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {cat.desc}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* 3. Main Storefront: Left Sticky Sidebar + Right Product Grid */}
      <div id="catalog-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Desktop Left Sidebar (3 cols) */}
        <div className="hidden lg:block lg:col-span-3">
          <SidebarFilters
            allProducts={rawProducts}
            appliedFilters={{
              category,
              inStockOnly,
              minPrice,
              maxPrice,
              brands: selectedBrands,
              cpus: selectedCpus,
              rams: selectedRams,
              storages: selectedStorages
            }}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <div className="relative ml-auto w-full max-w-xs bg-white p-4 shadow-2xl overflow-hidden h-full flex flex-col">
              <div className="flex items-center justify-between border-b pb-3 mb-2">
                <span className="font-bold text-slate-900">
                  {locale === 'ua' ? 'Фільтри товарів' : 'Filters'}
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <SidebarFilters
                  allProducts={rawProducts}
                  appliedFilters={{
                    category,
                    inStockOnly,
                    minPrice,
                    maxPrice,
                    brands: selectedBrands,
                    cpus: selectedCpus,
                    rams: selectedRams,
                    storages: selectedStorages
                  }}
                  onApply={handleApplyFilters}
                  onReset={handleResetFilters}
                  onCloseMobile={() => setMobileFilterOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Right Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Search, Count & Sort Bar */}
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
                {locale === 'ua' ? 'Активні фільтри:' : 'Active filters:'}
              </span>
              {category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <span>{category}</span>
                  <button onClick={() => setCategory('')} className="hover:text-blue-900 cursor-pointer">✕</button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span>{locale === 'ua' ? 'Тільки в наявності' : 'In Stock Only'}</span>
                  <button onClick={() => setInStockOnly(false)} className="hover:text-emerald-900 cursor-pointer">✕</button>
                </span>
              )}
              {selectedBrands.map((brand) => (
                <span key={brand} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <span>{brand}</span>
                  <button onClick={() => handleRemoveBrand(brand)} className="hover:text-blue-900 cursor-pointer">✕</button>
                </span>
              ))}
              {selectedCpus.map((cpu) => (
                <span key={cpu} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <span>{cpu}</span>
                  <button onClick={() => handleRemoveCpu(cpu)} className="hover:text-indigo-900 cursor-pointer">✕</button>
                </span>
              ))}
              {selectedRams.map((ram) => (
                <span key={ram} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <span>RAM: {ram}</span>
                  <button onClick={() => handleRemoveRam(ram)} className="hover:text-blue-900 cursor-pointer">✕</button>
                </span>
              ))}
              {selectedStorages.map((storage) => (
                <span key={storage} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span>{storage}</span>
                  <button onClick={() => handleRemoveStorage(storage)} className="hover:text-emerald-900 cursor-pointer">✕</button>
                </span>
              ))}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <span>
                    {minPrice ? formatPrice(minPrice) : '0 грн'} — {maxPrice ? formatPrice(maxPrice) : '∞'}
                  </span>
                  <button onClick={() => { setMinPrice(''); setMaxPrice('') }} className="hover:text-slate-900 cursor-pointer">✕</button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <span>"{search}"</span>
                  <button onClick={() => setSearch('')} className="hover:text-slate-900 cursor-pointer">✕</button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 ml-2 cursor-pointer"
              >
                {locale === 'ua' ? 'Скинути все' : 'Clear all'}
              </button>
            </div>
          )}

          {/* Product Grid Area */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-200 bg-white p-4 space-y-4 shadow-xs animate-pulse"
                >
                  <div className="h-48 w-full rounded-2xl bg-slate-100" />
                  <div className="h-4 w-1/3 rounded bg-slate-100" />
                  <div className="h-5 w-4/5 rounded bg-slate-100" />
                  <div className="h-12 w-full rounded bg-slate-100" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 w-20 rounded bg-slate-100" />
                    <div className="h-9 w-24 rounded-2xl bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-rose-700">{error}</p>
              <button
                onClick={() => loadProducts()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-all shadow-xs cursor-pointer"
              >
                {t.common.retry}
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center rounded-3xl border border-dashed border-slate-200 bg-white">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl text-slate-400 mb-4">
                🔍
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {t.catalog.noProductsFound}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-6">
                {locale === 'ua'
                  ? 'Спробуйте скинути фільтри або змінити пошуковий запит.'
                  : 'Try resetting applied filters or search for another model.'}
              </p>
              <button
                onClick={handleResetFilters}
                className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-sm cursor-pointer"
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

      {/* 4. Brand Partners Strip */}
      <section className="pt-6 border-t border-slate-100">
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {locale === 'ua' ? 'Офіційні бренди та техніка' : 'Official Brands & Partners'}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-4 opacity-75 hover:opacity-100 transition-opacity">
          {brandLogos.map((brand) => (
            <span
              key={brand}
              className="text-base sm:text-lg font-black tracking-wider text-slate-400 hover:text-slate-900 transition-colors select-none"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
