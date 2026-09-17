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
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 mb-4 shadow-2xs">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1 text-xs">
          <h4 className="font-bold text-amber-900 mb-1">
            Store Catalog & Price Notice
          </h4>
          <ul className="space-y-1 text-amber-800">
            {issueItems.map((item) => (
              <li key={item.productId} className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">{item.name}:</span>
                <span className="text-amber-700 font-medium">
                  {item.issueReason || 'Updated based on stock availability'}
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={onApply}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t.cart.applyAdjustments}
          </button>
        </div>
      </div>
    </div>
  )
}
