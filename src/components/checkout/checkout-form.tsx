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
      <div className="flex flex-col items-center justify-center p-16 text-center rounded-3xl border border-slate-200 bg-white shadow-xs">
        <ShoppingBag className="h-12 w-12 text-slate-400 mb-3" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">{t.cart.empty}</h3>
        <button
          onClick={() => router.push('/')}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
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
        className="lg:col-span-7 space-y-6 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs"
      >
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t.checkout.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.checkout.subtitle}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.checkout.fullNameLabel}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.checkout.fullNamePlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.checkout.emailLabel}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.checkout.emailPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.checkout.addressLabel}
            </label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t.checkout.addressPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-4 text-sm font-bold text-white shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
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

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          {t.checkout.securityNotice}
        </p>
      </form>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-5 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center justify-between">
          <span>{t.checkout.orderSummary}</span>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {items.length} {t.checkout.itemsCount}
          </span>
        </h3>

        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.productId} className="py-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 truncate">{item.name}</div>
                <div className="text-slate-500 font-medium">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</div>
              </div>
              <div className="font-mono font-bold text-slate-900 shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 font-medium">
            <span>{t.cart.subtotal}</span>
            <span className="text-slate-900 font-bold font-mono">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600 font-medium">
            <span>{t.checkout.delivery}</span>
            <span className="text-emerald-600 font-bold">{t.checkout.free}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-100">
            <span>{t.checkout.total}</span>
            <span className="text-xl text-blue-600 font-black font-mono">${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3 text-xs text-emerald-800 font-medium">
          <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>Official 2-Year Warranty & Certified Storefront Guaranteed.</span>
        </div>
      </div>
    </div>
  )
}
