'use client'

import React, { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/i18n-context'

interface FilterBarProps {
  search: string
  onSearchChange: (search: string) => void
  inStockOnly: boolean
  onInStockChange: (inStock: boolean) => void
  sortBy: string
  onSortByChange: (sortBy: string) => void
  totalCount: number
}

export function FilterBar({
  search,
  onSearchChange,
  inStockOnly,
  onInStockChange,
  sortBy,
  onSortByChange,
  totalCount
}: FilterBarProps) {
  const { t } = useTranslation()
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
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={t.catalog.searchPlaceholder}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('')
                onSearchChange('')
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* In Stock Toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2 hover:bg-slate-800/40 transition-colors">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onInStockChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-medium text-slate-200">
              {t.catalog.inStockOnly}
            </span>
          </label>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="createdAt_DESC" className="bg-slate-900 text-white">
                {t.catalog.sortNewest}
              </option>
              <option value="price_ASC" className="bg-slate-900 text-white">
                {t.catalog.sortPriceAsc}
              </option>
              <option value="price_DESC" className="bg-slate-900 text-white">
                {t.catalog.sortPriceDesc}
              </option>
              <option value="name_ASC" className="bg-slate-900 text-white">
                {t.catalog.sortName}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Counter bar */}
      <div className="text-xs text-slate-400 font-medium">
        {totalCount} {t.catalog.itemsFound}
      </div>
    </div>
  )
}
