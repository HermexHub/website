'use client'

import React, { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, X, ArrowDownUp } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/i18n-context'

interface TopFilterBarProps {
  search: string
  onSearchChange: (search: string) => void
  sortBy: string
  onSortByChange: (sortBy: string) => void
  totalCount: number
  onToggleMobileFilter?: () => void
}

export function TopFilterBar({
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  totalCount,
  onToggleMobileFilter
}: TopFilterBarProps) {
  const { t, locale } = useTranslation()
  const [localSearch, setLocalSearch] = useState(search)

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch)
      }
    }, 300)
    return () => clearTimeout(handler)
  }, [localSearch, search, onSearchChange])

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
      {/* Search Input with Debounce */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder={t.catalog.searchPlaceholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
        {localSearch && (
          <button
            onClick={() => {
              setLocalSearch('')
              onSearchChange('')
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Right Controls: Sort & Mobile Filter Toggle */}
      <div className="flex items-center justify-between sm:justify-end gap-3">
        {/* Mobile Filter Button */}
        {onToggleMobileFilter && (
          <button
            type="button"
            onClick={onToggleMobileFilter}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            <span>Filters</span>
          </button>
        )}

        {/* Counter Badge */}
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden md:inline">
          {totalCount} {t.catalog.itemsFound}
        </span>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <ArrowDownUp className="h-3.5 w-3.5 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="createdAt_DESC">{t.catalog.sortNewest}</option>
            <option value="price_ASC">{t.catalog.sortPriceAsc}</option>
            <option value="price_DESC">{t.catalog.sortPriceDesc}</option>
            <option value="name_ASC">{t.catalog.sortName}</option>
            <option value="brand_ASC">{locale === 'ua' ? 'За брендом (Apple, Asus...)' : 'By Brand (Apple, Asus...)'}</option>
            <option value="stockQuantity_DESC">{locale === 'ua' ? 'За наявністю' : 'In Stock First'}</option>
          </select>
        </div>
      </div>
    </div>
  )
}
