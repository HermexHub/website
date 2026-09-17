'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { useCartStore } from '@/lib/store/use-cart-store'
import { CartValidationAlert } from './cart-validation-alert'

export function CartDrawer() {
  const { t } = useTranslation()
  const {
    items,
    isOpen,
    setOpen,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    validationReport,
    applyAdjustments
  } = useCartStore()

  const subtotal = getSubtotal()
  const freeShippingThreshold = 500
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100)
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-400" />
              <h2 className="text-base font-semibold text-white">
                {t.cart.title}
              </h2>
              <span className="text-xs font-mono text-slate-400">
                ({items.length})
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free shipping banner */}
          <div className="px-6 py-3 bg-slate-900/80 border-b border-slate-800 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-slate-300">
                {t.cart.freeDeliveryProgress.replace(
                  '${{amount}}',
                  remainingForFreeShipping.toFixed(2)
                )}
              </p>
            ) : (
              <p className="text-emerald-400 font-medium">
                {t.cart.freeDeliveryAchieved}
              </p>
            )}
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Real-time Validation Alerts */}
            {validationReport && (
              <CartValidationAlert
                report={validationReport}
                onApply={applyAdjustments}
              />
            )}

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  {t.cart.empty}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  {t.cart.emptyPrompt}
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-semibold text-white transition-all shadow-md shadow-blue-600/20"
                >
                  {t.cart.startShopping}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="h-16 w-16 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400">
                          Hermex
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-white truncate">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-slate-400 hover:text-rose-400 transition-colors p-0.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {item.sku}
                        </span>
                      </div>

                      {/* Stepper and Price */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950/80">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.stockQuantity}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-slate-400 hover:text-rose-400 transition-colors pt-2"
                  >
                    {t.cart.clear}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {items.length > 0 && (
            <div className="border-t border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{t.cart.subtotal}</span>
                <span className="text-lg font-bold text-white tracking-tight">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 active:scale-[0.99] transition-all"
              >
                <span>{t.cart.checkout}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Authoritative stock & server price validation</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
