'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ShieldCheck, ShoppingBag, Loader2, AlertCircle } from 'lucide-react'
import { createOrderApi } from '@/lib/api/client'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { useCartStore } from '@/lib/store/use-cart-store'

export function CheckoutForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCartStore()

  const [fullName, setFullName] = useState('Alex Mercer')
  const [email, setEmail] = useState('alex.mercer@example.com')
  const [address, setAddress] = useState('742 Evergreen Terrace, Springfield, OR 97477')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = getSubtotal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setIsSubmitting(true)
    setError(null)

    try {
      const order = await createOrderApi({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        deliveryAddress: address
      })

      // Clear cart once order is created in PENDING status
      clearCart()

      const paymentPortalUrl = process.env.NEXT_PUBLIC_PAYMENT_PORTAL_URL
      window.location.href = `${paymentPortalUrl}/pay/${order.orderId}`
    } catch (err) {
      setError((err as Error).message || 'Failed to initialize order')
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
        <ShoppingBag className="h-12 w-12 text-slate-500 mb-3" />
        <h3 className="text-lg font-semibold text-white mb-2">{t.cart.empty}</h3>
        <button
          onClick={() => router.push('/')}
          className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all shadow-md shadow-blue-600/20"
        >
          {t.cart.startShopping}
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-7 space-y-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-md"
      >
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {t.checkout.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.checkout.subtitle}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.checkout.fullNameLabel}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.checkout.fullNamePlaceholder}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.checkout.emailLabel}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.checkout.emailPlaceholder}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.checkout.addressLabel}
            </label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t.checkout.addressPlaceholder}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-600/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t.checkout.placingOrder}</span>
            </>
          ) : (
            <>
              <span>{t.checkout.placeOrder}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          {t.checkout.idempotencyNotice}
        </p>
      </form>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
          <span>{t.checkout.orderSummary}</span>
          <span className="text-xs font-mono text-slate-400">
            {items.length} {t.checkout.itemsCount}
          </span>
        </h3>

        <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.productId} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white truncate">{item.name}</div>
                <div className="text-slate-400">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</div>
              </div>
              <div className="font-bold text-white shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>{t.cart.subtotal}</span>
            <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>{t.checkout.delivery}</span>
            <span className="text-emerald-400 font-semibold">{t.checkout.free}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800/80">
            <span>{t.checkout.total}</span>
            <span className="text-lg text-blue-400 font-mono">${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 flex items-center gap-2.5 text-xs text-emerald-300">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>Server-authoritative pricing strictly verified against database.</span>
        </div>
      </div>
    </div>
  )
}
