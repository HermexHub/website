'use client'

import React from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { ValidateCartResponse } from '@/lib/api/types'
import { useTranslation } from '@/lib/i18n/i18n-context'

interface CartValidationAlertProps {
  report: ValidateCartResponse
  onApply: () => void
}

export function CartValidationAlert({
  report,
  onApply
}: CartValidationAlertProps) {
  const { t } = useTranslation()

  const issueItems = report.items.filter((item) => item.hasIssue)
  if (issueItems.length === 0) return null

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 backdrop-blur-sm mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 text-xs">
          <h4 className="font-semibold text-amber-300 mb-1">
            Warehouse Inventory & Price Synchronization
          </h4>
          <ul className="space-y-1 text-slate-300">
            {issueItems.map((item) => (
              <li key={item.productId} className="flex items-center gap-1.5">
                <span className="font-medium text-white">{item.name}:</span>
                <span className="text-amber-200">
                  {item.issueReason || 'Updated from warehouse stock'}
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={onApply}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition-colors shadow-sm"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t.cart.applyAdjustments}
          </button>
        </div>
      </div>
    </div>
  )
}
