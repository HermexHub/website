'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  SlidersHorizontal,
  RotateCcw,
  Check,
  Box,
  ChevronRight,
  ChevronDown,
  Headphones,
  MessageSquare,
  Cpu,
  HardDrive,
  Layers,
  Tag
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { Product } from '@/lib/api/types'
import {
  extractProductBrand,
  extractProductCpu,
  extractProductRam,
  extractProductStorage
} from '@/lib/utils/specs'

export interface AppliedFilters {
  category: string
  inStockOnly: boolean
  minPrice: string
  maxPrice: string
  brands: string[]
  cpus: string[]
  rams: string[]
  storages: string[]
}

export interface SidebarFiltersProps {
  allProducts: Product[]
  appliedFilters: AppliedFilters
  onApply: (filters: AppliedFilters) => void
  onReset: () => void
  onCloseMobile?: () => void
}

export function SidebarFilters({
  allProducts,
  appliedFilters,
  onApply,
  onReset,
  onCloseMobile
}: SidebarFiltersProps) {
  const { t, locale } = useTranslation()

  // 1. Local Draft Filter States (Staging)
  const [draftCategory, setDraftCategory] = useState(appliedFilters.category)
  const [draftInStockOnly, setDraftInStockOnly] = useState(appliedFilters.inStockOnly)
  const [draftMinPrice, setDraftMinPrice] = useState(appliedFilters.minPrice)
  const [draftMaxPrice, setDraftMaxPrice] = useState(appliedFilters.maxPrice)
  const [draftBrands, setDraftBrands] = useState<string[]>(appliedFilters.brands)
  const [draftCpus, setDraftCpus] = useState<string[]>(appliedFilters.cpus)
  const [draftRams, setDraftRams] = useState<string[]>(appliedFilters.rams)
  const [draftStorages, setDraftStorages] = useState<string[]>(appliedFilters.storages)

  // 2. Sync draft state whenever appliedFilters changes externally (e.g. pill click ✕ or reset)
  useEffect(() => {
    setDraftCategory(appliedFilters.category)
    setDraftInStockOnly(appliedFilters.inStockOnly)
    setDraftMinPrice(appliedFilters.minPrice)
    setDraftMaxPrice(appliedFilters.maxPrice)
    setDraftBrands(appliedFilters.brands)
    setDraftCpus(appliedFilters.cpus)
    setDraftRams(appliedFilters.rams)
    setDraftStorages(appliedFilters.storages)
  }, [appliedFilters])

  // Collapsible accordion sections
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    cpus: true,
    ram: true,
    storage: true,
    price: true
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const categoryOptions = [
    { id: '', name: locale === 'ua' ? 'Усі категорії' : 'All Categories' },
    { id: 'Smartphones', name: locale === 'ua' ? 'Смартфони та гаджети' : 'Smartphones & Gadgets' },
    { id: 'Laptops', name: locale === 'ua' ? 'Ноутбуки та ПК' : 'Laptops & Computers' },
    { id: 'Audio', name: locale === 'ua' ? 'Навушники та акустика' : 'Audio & Headphones' },
    { id: 'Wearables', name: locale === 'ua' ? 'Смарт-годинники' : 'Smartwatches' },
    { id: 'Keyboards', name: locale === 'ua' ? 'Клавіатури та миші' : 'Keyboards & Mice' },
    { id: 'Power Banks', name: locale === 'ua' ? 'Павербанки та живлення' : 'Power Banks & Batteries' }
  ]

  // Predicate function for matching products against draft criteria
  const matchesFilter = (
    p: Product,
    options: {
      category?: string
      inStockOnly?: boolean
      minPrice?: string
      maxPrice?: string
      brands?: string[]
      cpus?: string[]
      rams?: string[]
      storages?: string[]
    }
  ) => {
    if (options.inStockOnly && p.stockQuantity <= 0) return false
    if (options.category && p.category?.toLowerCase() !== options.category.toLowerCase()) return false
    if (options.minPrice && p.price < Number(options.minPrice)) return false
    if (options.maxPrice && p.price > Number(options.maxPrice)) return false
    if (options.brands && options.brands.length > 0) {
      const brand = extractProductBrand(p)
      if (!options.brands.includes(brand)) return false
    }
    if (options.cpus && options.cpus.length > 0) {
      const cpu = extractProductCpu(p)
      if (!cpu || !options.cpus.includes(cpu)) return false
    }
    if (options.rams && options.rams.length > 0) {
      const ram = extractProductRam(p)
      if (!ram || !options.rams.includes(ram)) return false
    }
    if (options.storages && options.storages.length > 0) {
      const storage = extractProductStorage(p)
      if (!storage || !options.storages.includes(storage)) return false
    }
    return true
  }

  // Live count of products matching ALL current draft filters
  const draftMatchedCount = useMemo(() => {
    return allProducts.filter((p) =>
      matchesFilter(p, {
        category: draftCategory,
        inStockOnly: draftInStockOnly,
        minPrice: draftMinPrice,
        maxPrice: draftMaxPrice,
        brands: draftBrands,
        cpus: draftCpus,
        rams: draftRams,
        storages: draftStorages
      })
    ).length
  }, [
    allProducts,
    draftCategory,
    draftInStockOnly,
    draftMinPrice,
    draftMaxPrice,
    draftBrands,
    draftCpus,
    draftRams,
    draftStorages
  ])

  // Recalculated dynamic Brand facet options
  const availableBrands = useMemo(() => {
    const baseList = draftCategory
      ? allProducts.filter((p) => p.category?.toLowerCase() === draftCategory.toLowerCase())
      : allProducts

    const allBrandNames = Array.from(new Set(baseList.map(extractProductBrand).filter(Boolean)))

    return allBrandNames
      .map((brand) => {
        const count = allProducts.filter((p) =>
          matchesFilter(p, {
            category: draftCategory,
            inStockOnly: draftInStockOnly,
            minPrice: draftMinPrice,
            maxPrice: draftMaxPrice,
            brands: [brand],
            cpus: draftCpus,
            rams: draftRams,
            storages: draftStorages
          })
        ).length
        return { value: brand, count }
      })
      .filter((b) => b.count > 0 || draftBrands.includes(b.value))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
  }, [
    allProducts,
    draftCategory,
    draftInStockOnly,
    draftMinPrice,
    draftMaxPrice,
    draftBrands,
    draftCpus,
    draftRams,
    draftStorages
  ])

  // Recalculated dynamic CPU facet options
  const availableCpus = useMemo(() => {
    const baseList = draftCategory
      ? allProducts.filter((p) => p.category?.toLowerCase() === draftCategory.toLowerCase())
      : allProducts

    const allCpuNames = Array.from(
      new Set(baseList.map(extractProductCpu).filter((c): c is string => Boolean(c)))
    )

    return allCpuNames
      .map((cpu) => {
        const count = allProducts.filter((p) =>
          matchesFilter(p, {
            category: draftCategory,
            inStockOnly: draftInStockOnly,
            minPrice: draftMinPrice,
            maxPrice: draftMaxPrice,
            brands: draftBrands,
            cpus: [cpu],
            rams: draftRams,
            storages: draftStorages
          })
        ).length
        return { value: cpu, count }
      })
      .filter((c) => c.count > 0 || draftCpus.includes(c.value))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
  }, [
    allProducts,
    draftCategory,
    draftInStockOnly,
    draftMinPrice,
    draftMaxPrice,
    draftBrands,
    draftCpus,
    draftRams,
    draftStorages
  ])

  // Recalculated dynamic RAM facet options
  const availableRams = useMemo(() => {
    const baseList = draftCategory
      ? allProducts.filter((p) => p.category?.toLowerCase() === draftCategory.toLowerCase())
      : allProducts

    const allRamNames = Array.from(
      new Set(baseList.map(extractProductRam).filter((r): r is string => Boolean(r)))
    )

    return allRamNames
      .map((ram) => {
        const count = allProducts.filter((p) =>
          matchesFilter(p, {
            category: draftCategory,
            inStockOnly: draftInStockOnly,
            minPrice: draftMinPrice,
            maxPrice: draftMaxPrice,
            brands: draftBrands,
            cpus: draftCpus,
            rams: [ram],
            storages: draftStorages
          })
        ).length
        return { value: ram, count }
      })
      .filter((r) => r.count > 0 || draftRams.includes(r.value))
      .sort((a, b) => {
        const numA = parseInt(a.value, 10) || 0
        const numB = parseInt(b.value, 10) || 0
        return numA - numB
      })
  }, [
    allProducts,
    draftCategory,
    draftInStockOnly,
    draftMinPrice,
    draftMaxPrice,
    draftBrands,
    draftCpus,
    draftRams,
    draftStorages
  ])

  // Recalculated dynamic Storage facet options
  const availableStorages = useMemo(() => {
    const baseList = draftCategory
      ? allProducts.filter((p) => p.category?.toLowerCase() === draftCategory.toLowerCase())
      : allProducts

    const allStorageNames = Array.from(
      new Set(baseList.map(extractProductStorage).filter((s): s is string => Boolean(s)))
    )

    return allStorageNames
      .map((storage) => {
        const count = allProducts.filter((p) =>
          matchesFilter(p, {
            category: draftCategory,
            inStockOnly: draftInStockOnly,
            minPrice: draftMinPrice,
            maxPrice: draftMaxPrice,
            brands: draftBrands,
            cpus: draftCpus,
            rams: draftRams,
            storages: [storage]
          })
        ).length
        return { value: storage, count }
      })
      .filter((s) => s.count > 0 || draftStorages.includes(s.value))
      .sort((a, b) => {
        const getGb = (val: string) => {
          if (val.includes('TB')) return (parseFloat(val) || 1) * 1024
          return parseFloat(val) || 0
        }
        return getGb(a.value) - getGb(b.value)
      })
  }, [
    allProducts,
    draftCategory,
    draftInStockOnly,
    draftMinPrice,
    draftMaxPrice,
    draftBrands,
    draftCpus,
    draftRams,
    draftStorages
  ])

  // Check if draft differs from currently applied filters
  const hasDraftChanges = useMemo(() => {
    return (
      draftCategory !== appliedFilters.category ||
      draftInStockOnly !== appliedFilters.inStockOnly ||
      draftMinPrice !== appliedFilters.minPrice ||
      draftMaxPrice !== appliedFilters.maxPrice ||
      draftBrands.length !== appliedFilters.brands.length ||
      draftBrands.some((b) => !appliedFilters.brands.includes(b)) ||
      draftCpus.length !== appliedFilters.cpus.length ||
      draftCpus.some((c) => !appliedFilters.cpus.includes(c)) ||
      draftRams.length !== appliedFilters.rams.length ||
      draftRams.some((r) => !appliedFilters.rams.includes(r)) ||
      draftStorages.length !== appliedFilters.storages.length ||
      draftStorages.some((s) => !appliedFilters.storages.includes(s))
    )
  }, [
    draftCategory,
    draftInStockOnly,
    draftMinPrice,
    draftMaxPrice,
    draftBrands,
    draftCpus,
    draftRams,
    draftStorages,
    appliedFilters
  ])

  const hasDraftFilters = Boolean(
    draftCategory ||
      draftInStockOnly ||
      draftMinPrice ||
      draftMaxPrice ||
      draftBrands.length > 0 ||
      draftCpus.length > 0 ||
      draftRams.length > 0 ||
      draftStorages.length > 0
  )

  // Toggle handlers for draft state
  const handleToggleBrand = (brand: string) => {
    setDraftBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
  }

  const handleToggleCpu = (cpu: string) => {
    setDraftCpus((prev) =>
      prev.includes(cpu) ? prev.filter((c) => c !== cpu) : [...prev, cpu]
    )
  }

  const handleToggleRam = (ram: string) => {
    setDraftRams((prev) =>
      prev.includes(ram) ? prev.filter((r) => r !== ram) : [...prev, ram]
    )
  }

  const handleToggleStorage = (storage: string) => {
    setDraftStorages((prev) =>
      prev.includes(storage) ? prev.filter((s) => s !== storage) : [...prev, storage]
    )
  }

  const handleSelectCategory = (catId: string) => {
    setDraftCategory(catId)
    // Clear sub-facets if changing category
    setDraftBrands([])
    setDraftCpus([])
    setDraftRams([])
    setDraftStorages([])
  }

  const handlePricePreset = (min: string, max: string) => {
    setDraftMinPrice(min)
    setDraftMaxPrice(max)
  }

  // Commit and apply filters
  const handleApply = () => {
    onApply({
      category: draftCategory,
      inStockOnly: draftInStockOnly,
      minPrice: draftMinPrice,
      maxPrice: draftMaxPrice,
      brands: draftBrands,
      cpus: draftCpus,
      rams: draftRams,
      storages: draftStorages
    })
    if (onCloseMobile) onCloseMobile()
  }

  // Reset all filters
  const handleResetAll = () => {
    setDraftCategory('')
    setDraftInStockOnly(false)
    setDraftMinPrice('')
    setDraftMaxPrice('')
    setDraftBrands([])
    setDraftCpus([])
    setDraftRams([])
    setDraftStorages([])
    onReset()
    if (onCloseMobile) onCloseMobile()
  }

  return (
    <aside className="w-full rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col max-h-[calc(100vh-140px)] sticky top-28 overflow-hidden">
      {/* 1. Sticky Top Header: Title & Reset Button */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            {locale === 'ua' ? 'Фільтри' : 'Filters'}
          </h3>
        </div>

        {hasDraftFilters && (
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{locale === 'ua' ? 'Скинути' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* 2. Scrollable Middle Body: Self-contained scroll so the entire page does NOT scroll */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 divide-y divide-slate-100">
        {/* Availability Filter */}
        <div className="space-y-2.5">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {locale === 'ua' ? 'Наявність товару' : 'Availability'}
          </span>

          <div
            onClick={() => setDraftInStockOnly(!draftInStockOnly)}
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors select-none"
          >
            <div className="flex items-center gap-2.5">
              <Box className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-800">
                {t.catalog.inStockOnly}
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={draftInStockOnly}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                draftInStockOnly ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  draftInStockOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="pt-4 space-y-2.5">
          <button
            type="button"
            onClick={() => toggleSection('categories')}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {locale === 'ua' ? 'Категорії товарів' : 'Product Categories'}
            </span>
            {openSections.categories ? (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            )}
          </button>

          {openSections.categories && (
            <div className="space-y-1 pt-1">
              {categoryOptions.map((cat) => {
                const isSelected = draftCategory === cat.id

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/70 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {isSelected ? (
                      <Check className="h-3.5 w-3.5 text-blue-600" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-slate-300" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="pt-4 space-y-3">
          <button
            type="button"
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.catalog.priceRange} (грн)
            </span>
            {openSections.price ? (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            )}
          </button>

          {openSections.price && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={draftMinPrice}
                  onChange={(e) => setDraftMinPrice(e.target.value)}
                  placeholder="0"
                  aria-label="Min price"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
                <span className="text-slate-300 text-xs font-bold">—</span>
                <input
                  type="number"
                  min="0"
                  value={draftMaxPrice}
                  onChange={(e) => setDraftMaxPrice(e.target.value)}
                  placeholder="100 000"
                  aria-label="Max price"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Quick presets in UAH */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handlePricePreset('0', '5000')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  До 5 000 ₴
                </button>
                <button
                  type="button"
                  onClick={() => handlePricePreset('5000', '15000')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  5-15 тис ₴
                </button>
                <button
                  type="button"
                  onClick={() => handlePricePreset('15000', '45000')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  15-45 тис ₴
                </button>
                <button
                  type="button"
                  onClick={() => handlePricePreset('45000', '')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  45 000+ ₴
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Brand Filter */}
        {availableBrands.length > 0 && (
          <div className="pt-4 space-y-2.5">
            <button
              type="button"
              onClick={() => toggleSection('brands')}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {locale === 'ua' ? 'Бренд' : 'Brand'}
                </span>
              </div>
              {openSections.brands ? (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {openSections.brands && (
              <div className="space-y-1 pt-1 max-h-48 overflow-y-auto pr-1">
                {availableBrands.map((brand) => {
                  const isSelected = draftBrands.includes(brand.value)

                  return (
                    <button
                      key={brand.value}
                      type="button"
                      onClick={() => handleToggleBrand(brand.value)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/90 text-blue-700 font-bold border border-blue-200/70'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span>{brand.value}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                          isSelected
                            ? 'bg-blue-200/80 text-blue-800'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {brand.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Processor / CPU Filter */}
        {availableCpus.length > 0 && (
          <div className="pt-4 space-y-2.5">
            <button
              type="button"
              onClick={() => toggleSection('cpus')}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-indigo-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {locale === 'ua' ? 'Процесор (CPU)' : 'Processor'}
                </span>
              </div>
              {openSections.cpus ? (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {openSections.cpus && (
              <div className="space-y-1 pt-1 max-h-48 overflow-y-auto pr-1">
                {availableCpus.map((cpu) => {
                  const isSelected = draftCpus.includes(cpu.value)

                  return (
                    <button
                      key={cpu.value}
                      type="button"
                      onClick={() => handleToggleCpu(cpu.value)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/90 text-indigo-700 font-bold border border-indigo-200/70'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="truncate max-w-[130px] text-left">{cpu.value}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                          isSelected
                            ? 'bg-indigo-200/80 text-indigo-800'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {cpu.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* RAM (Оперативна пам'ять) */}
        {availableRams.length > 0 && (
          <div className="pt-4 space-y-2.5">
            <button
              type="button"
              onClick={() => toggleSection('ram')}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {locale === 'ua' ? "Оперативна пам'ять" : 'RAM'}
                </span>
              </div>
              {openSections.ram ? (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {openSections.ram && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {availableRams.map((ram) => {
                  const isSelected = draftRams.includes(ram.value)

                  return (
                    <button
                      key={ram.value}
                      type="button"
                      onClick={() => handleToggleRam(ram.value)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                      }`}
                    >
                      <span>{ram.value}</span>
                      <span
                        className={`text-[10px] px-1 py-0.2 rounded-md ${
                          isSelected ? 'bg-blue-700 text-white' : 'bg-white text-slate-500'
                        }`}
                      >
                        {ram.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Storage (Вбудована пам'ять / Накопичувач) */}
        {availableStorages.length > 0 && (
          <div className="pt-4 space-y-2.5">
            <button
              type="button"
              onClick={() => toggleSection('storage')}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <HardDrive className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {locale === 'ua' ? 'Накопичувач / Памʼять' : 'Storage / SSD'}
                </span>
              </div>
              {openSections.storage ? (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {openSections.storage && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {availableStorages.map((storage) => {
                  const isSelected = draftStorages.includes(storage.value)

                  return (
                    <button
                      key={storage.value}
                      type="button"
                      onClick={() => handleToggleStorage(storage.value)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                      }`}
                    >
                      <span>{storage.value}</span>
                      <span
                        className={`text-[10px] px-1 py-0.2 rounded-md ${
                          isSelected ? 'bg-emerald-700 text-white' : 'bg-white text-slate-500'
                        }`}
                      >
                        {storage.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Support Promo Banner inside Scroll */}
        <div className="pt-4 pb-2">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-1.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-blue-200 text-xs font-bold uppercase tracking-wide">
              <Headphones className="h-3.5 w-3.5" />
              <span>{locale === 'ua' ? 'Консультація' : 'Support'}</span>
            </div>
            <p className="text-[11px] text-blue-100 leading-relaxed">
              {locale === 'ua'
                ? 'Допоможемо підібрати пристрій та оформити розстрочку.'
                : 'We will help select devices and arrange installments.'}
            </p>
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() =>
                  alert(
                    locale === 'ua'
                      ? 'Чат підтримки Hermex підключається...'
                      : 'Hermex Support chat connecting...'
                  )
                }
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-[11px] font-bold transition-colors cursor-pointer"
              >
                <MessageSquare className="h-3 w-3" />
                <span>{locale === 'ua' ? 'Чат' : 'Chat'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sticky Bottom Footer: Live Apply Button with Matched Count */}
      <div className="p-4 border-t border-slate-100 shrink-0 bg-white/95 backdrop-blur-xs shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.08)] z-10">
        <button
          type="button"
          onClick={handleApply}
          disabled={draftMatchedCount === 0}
          className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-between cursor-pointer ${
            draftMatchedCount === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : hasDraftChanges
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25 hover:shadow-md active:scale-[0.98]'
              : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.98]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 stroke-[2.5]" />
            <span>{locale === 'ua' ? 'Застосувати' : 'Apply Filters'}</span>
          </span>

          <span
            className={`px-2 py-0.5 rounded-lg text-xs font-black tracking-wide ${
              draftMatchedCount === 0
                ? 'bg-slate-200 text-slate-500'
                : 'bg-white/20 text-white'
            }`}
          >
            {draftMatchedCount}{' '}
            {locale === 'ua'
              ? draftMatchedCount === 1
                ? 'товар'
                : draftMatchedCount < 5
                ? 'товари'
                : 'товарів'
              : 'items'}
          </span>
        </button>
      </div>
    </aside>
  )
}
