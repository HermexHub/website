'use client'

import React, { useState } from 'react'
import {
  SlidersHorizontal,
  RotateCcw,
  Check,
  Tag,
  DollarSign,
  Box,
  Truck,
  ShieldCheck,
  ChevronDown
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/i18n-context'

interface SidebarFiltersProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  inStockOnly: boolean
  onInStockChange: (inStock: boolean) => void
  minPrice: string
  maxPrice: string
  onPriceChange: (min: string, max: string) => void
  onReset: () => void
  hasActiveFilters: boolean
}

export function SidebarFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  inStockOnly,
  onInStockChange,
  minPrice,
  maxPrice,
  onPriceChange,
  onReset,
  hasActiveFilters
}: SidebarFiltersProps) {
  const { t } = useTranslation()

  const [localMin, setLocalMin] = useState(minPrice)
  const [localMax, setLocalMax] = useState(maxPrice)

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault()
    onPriceChange(localMin, localMax)
  }

  const handlePricePreset = (min: string, max: string) => {
    setLocalMin(min)
    setLocalMax(max)
    onPriceChange(min, max)
  }

  const allCategories = [
    'All Categories',
    'Laptops',
    'Audio',
    'Keyboards',
    'Peripherals',
    'Monitors',
    'Wearables',
    'Appliances'
  ]

  return (
    <aside className="w-full space-y-6">
      {/* Top Filter Header with Reset */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            {t.catalog.categories}
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setLocalMin('')
              setLocalMax('')
              onReset()
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t.catalog.clearFilters}</span>
          </button>
        )}
      </div>

      {/* Availability Filter (Custom Switch - No raw checkboxes!) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Availability
        </span>

        <div
          onClick={() => onInStockChange(!inStockOnly)}
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors select-none"
        >
          <div className="flex items-center gap-2.5">
            <Box className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-800">
              {t.catalog.inStockOnly}
            </span>
          </div>

          {/* Custom iOS-style toggle switch */}
          <button
            type="button"
            role="switch"
            aria-checked={inStockOnly}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              inStockOnly ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                inStockOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Product Categories
        </span>

        <div className="space-y-1">
          {allCategories.map((cat) => {
            const isAll = cat === 'All Categories'
            const isSelected = isAll ? !selectedCategory : selectedCategory === cat

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(isAll ? '' : cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/70 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          {t.catalog.priceRange} ($)
        </span>

        <form onSubmit={handleApplyPrice} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                {t.catalog.minPrice}
              </label>
              <input
                type="number"
                min="0"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                {t.catalog.maxPrice}
              </label>
              <input
                type="number"
                min="0"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                placeholder="4000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handlePricePreset('0', '200')}
              className="px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Under $200
            </button>
            <button
              type="button"
              onClick={() => handlePricePreset('200', '500')}
              className="px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              $200 - $500
            </button>
            <button
              type="button"
              onClick={() => handlePricePreset('500', '1500')}
              className="px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              $500 - $1.5k
            </button>
            <button
              type="button"
              onClick={() => handlePricePreset('1500', '')}
              className="px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              $1.5k+
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            {t.catalog.applyPrice}
          </button>
        </form>
      </div>

      {/* Support Promo Banner inside Sidebar */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-2 shadow-xs">
        <span className="text-xs font-black tracking-wide uppercase opacity-80">
          Need Guidance?
        </span>
        <p className="text-xs text-blue-100 leading-relaxed">
          Speak with our certified tech specialists for custom setups and compatibility.
        </p>
        <p className="text-sm font-bold pt-1">
          +1 (800) 555-0199
        </p>
      </div>
    </aside>
  )
}
