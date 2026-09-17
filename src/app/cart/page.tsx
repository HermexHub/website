'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { useCartStore } from '@/lib/store/use-cart-store'
import { CartValidationAlert } from '@/components/cart/cart-validation-alert'

export default function CartPage() {
  const { t } = useTranslation()
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    validationReport,
    applyAdjustments,
    validateCurrentCart
  } = useCartStore()

  useEffect(() => {
    if (items.length > 0) {
      validateCurrentCart()
    }
  }, [items.length, validateCurrentCart])

  const subtotal = getSubtotal()

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <div className="h-24 w-24 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="h-12 w-12 text-slate-400" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">{t.cart.empty}</h1>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          {t.cart.emptyPrompt}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm font-bold text-white transition-all shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.cart.startShopping}</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.cart.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {items.length} items currently in your shopping bag
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
        >
          {t.cart.clear}
        </button>
      </div>

      {validationReport && (
        <CartValidationAlert
          report={validationReport}
          onApply={applyAdjustments}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={item.productId}
                className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-200 p-2 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="text-xs text-slate-400">
                        Hermex
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.name}
                    </h3>
                    <div className="text-xs font-mono text-slate-400 uppercase">
                      {item.sku}
                    </div>
                    <div className="text-xs text-slate-600 font-semibold mt-1">
                      ${Number(item.price).toFixed(2)} each
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-end sm:self-auto">
                  {/* Stepper */}
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-900"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stockQuantity}
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <span className="text-base font-black text-slate-900 font-mono min-w-[80px] text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {t.checkout.orderSummary}
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{t.cart.subtotal}</span>
              <span className="text-slate-900 font-bold font-mono">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{t.checkout.delivery}</span>
              <span className="text-emerald-600 font-bold">FREE</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-slate-900">
              <span>{t.checkout.total}</span>
              <span className="text-xl text-blue-600 font-black font-mono">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-4 text-sm font-bold text-white shadow-sm hover:shadow-md active:scale-[0.99] transition-all"
          >
            <span>{t.cart.checkout}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Safe & secure checkout with official warranty.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
