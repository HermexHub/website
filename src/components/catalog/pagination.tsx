'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/i18n-context'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  const { t } = useTranslation()

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">{t.catalog.previous}</span>
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
          const isCurrent = p === currentPage
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-9 w-9 rounded-xl text-xs font-semibold transition-all ${
                isCurrent
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              {p}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <span className="hidden sm:inline">{t.catalog.next}</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
