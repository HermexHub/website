'use client'

import React, { useState, useEffect } from 'react'
import {
  SlidersHorizontal,
  RotateCcw,
  Check,
  Box,
  ChevronRight,
  Headphones,
  MessageSquare
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
  const { t, locale } = useTranslation()

  const [localMin, setLocalMin] = useState(minPrice)
  const [localMax, setLocalMax] = useState(maxPrice)

  useEffect(() => {
    setLocalMin(minPrice)
    setLocalMax(maxPrice)
  }, [minPrice, maxPrice])

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault()
    onPriceChange(localMin, localMax)
  }

  const handlePricePreset = (min: string, max: string) => {
    setLocalMin(min)
    setLocalMax(max)
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

  return (
    <aside className="w-full space-y-5">
      {/* Top Filter Header with Reset */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
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
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t.catalog.clearFilters}</span>
          </button>
        )}
      </div>

      {/* Availability Filter (Custom iOS-style toggle) */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {locale === 'ua' ? 'Наявність товару' : 'Availability'}
        </span>

        <div
          onClick={() => onInStockChange(!inStockOnly)}
          className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors select-none"
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
            aria-checked={inStockOnly}
            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              inStockOnly ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                inStockOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {locale === 'ua' ? 'Категорії товарів' : 'Product Categories'}
        </span>

        <div className="space-y-1">
          {categoryOptions.map((cat) => {
            const isSelected = selectedCategory === cat.id

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
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
      </div>

      {/* Price Range Filter (Compact inline inputs with clean electric-blue OK button) */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {t.catalog.priceRange} (грн)
        </span>

        {/* Inline Price Form with Застосувати Button */}
        <form onSubmit={handleApplyPrice} className="space-y-2.5">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              placeholder="0"
              aria-label="Min price"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
            <span className="text-slate-300 text-xs font-bold">—</span>
            <input
              type="number"
              min="0"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              placeholder="100 000"
              aria-label="Max price"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            title="Застосувати фільтр ціни"
          >
            <span>{locale === 'ua' ? 'Застосувати' : 'Apply'}</span>
          </button>

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
              5 000 - 15 000 ₴
            </button>
            <button
              type="button"
              onClick={() => handlePricePreset('15000', '45000')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              15 000 - 45 000 ₴
            </button>
            <button
              type="button"
              onClick={() => handlePricePreset('45000', '')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              45 000+ ₴
            </button>
          </div>
        </form>
      </div>

      {/* Support Promo Banner inside Sidebar */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-2 shadow-xs">
        <div className="flex items-center gap-1.5 text-blue-200 text-xs font-bold uppercase tracking-wide">
          <Headphones className="h-3.5 w-3.5" />
          <span>{locale === 'ua' ? 'Потрібна консультація?' : 'Need Guidance?'}</span>
        </div>
        <p className="text-xs text-blue-100 leading-relaxed">
          {locale === 'ua'
            ? 'Наші фахівці допоможуть підібрати пристрій та оформити розстрочку.'
            : 'Our specialists will help you choose devices and arrange installments.'}
        </p>
        <div className="pt-1">
          <button
            type="button"
            onClick={() => alert(locale === 'ua' ? 'Чат підтримки Helmex підключається...' : 'Helmex Support chat connecting...')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold transition-colors cursor-pointer"
          >
            <MessageSquare className="h-3 w-3" />
            <span>{locale === 'ua' ? 'Почати чат' : 'Start Chat'}</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
