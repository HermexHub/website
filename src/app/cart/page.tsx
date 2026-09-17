'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
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
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="h-20 w-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <ShoppingBag className="h-10 w-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">{t.cart.empty}</h1>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          {t.cart.emptyPrompt}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-blue-600/20"
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
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t.cart.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {items.length} items in your order
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
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
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
          <div className="divide-y divide-slate-800">
            {items.map((item) => (
              <div
                key={item.productId}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">
                        Hermex
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {item.name}
                    </h3>
                    <div className="text-xs font-mono text-slate-400">
                      {item.sku}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      ${Number(item.price).toFixed(2)} each
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-end sm:self-auto">
                  {/* Stepper */}
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-2.5 py-1 text-slate-400 hover:text-white"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-xs font-bold text-white font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stockQuantity}
                      className="px-2.5 py-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <span className="text-sm font-bold text-white font-mono min-w-[70px] text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-6">
          <h2 className="text-base font-bold text-white tracking-tight">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>{t.cart.subtotal}</span>
              <span className="text-white font-medium font-mono">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span className="text-emerald-400 font-semibold">FREE</span>
            </div>
            <div className="border-t border-slate-800 pt-3 flex justify-between text-sm font-bold text-white">
              <span>Total</span>
              <span className="text-lg text-blue-400 font-mono">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-600/20 active:scale-[0.99] transition-all"
          >
            <span>{t.cart.checkout}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Authoritative warehouse stock verification before payment.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
