'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { useTranslation } from '@/lib/i18n/i18n-context'

export default function CheckoutPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.cart.backToCart}</span>
        </Link>
        <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>256-bit SSL Encrypted Checkout</span>
        </div>
      </div>

      {/* Main Checkout Form */}
      <CheckoutForm />
    </div>
  )
}
