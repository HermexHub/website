'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Zap,
  UserCheck,
  Lock
} from 'lucide-react'
import { createOrderApi } from '@/lib/api/client'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { useCartStore } from '@/lib/store/use-cart-store'
import { useUserStore } from '@/lib/store/use-user-store'
import { formatPrice, formatUserName } from '@/lib/utils/format'

export function CheckoutForm() {
  const { t, locale } = useTranslation()
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCartStore()
  const { user, accessToken, quickLogin, setAuthModalOpen } = useUserStore()

  const [fullName, setFullName] = useState(() =>
    user ? formatUserName(user.fullName || (user as any)?.name, user.email) : ''
  )
  const [email, setEmail] = useState(user?.email || '')
  const [address, setAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const cleanName = formatUserName(user.fullName || (user as any).name, user.email)
      setFullName(cleanName)
      if (user.email) {
        setEmail(user.email)
      }
    }
  }, [user])

  const subtotal = getSubtotal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Ensure user is authenticated before creating order
      if (!accessToken && !user) {
        const loggedIn = await quickLogin()
        if (!loggedIn) {
          throw new Error('Для оформлення замовлення потрібна авторизація. Будь ласка, увійдіть.')
        }
      }

      const currentToken = accessToken || useUserStore.getState().accessToken

      const order = await createOrderApi({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: Number(item.price) || 0
        })),
        deliveryAddress: address
      })

      // Clear cart once order is created in PENDING status
      clearCart()

      const paymentPortalUrl =
        process.env.NEXT_PUBLIC_PAYMENT_PORTAL_URL || 'http://localhost:3001'
      const tokenQuery = currentToken ? `?token=${encodeURIComponent(currentToken)}` : ''
      window.location.href = `${paymentPortalUrl}/pay/${order.orderId}${tokenQuery}`
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
          className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-sm cursor-pointer"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t.checkout.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.checkout.subtitle}
            </p>
          </div>

          {user ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
              <UserCheck className="h-3.5 w-3.5 text-blue-600" />
              <span className="truncate max-w-[140px]">{user.email}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-blue-600" />
              <span>{locale === 'ua' ? 'Увійти в кабінет' : 'Sign In'}</span>
            </button>
          )}
        </div>

        {/* Guest prompt banner if not signed in */}
        {!user && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-blue-600" />
                <span>{locale === 'ua' ? 'Безпечне оформлення замовлення' : 'Secure Order Placement'}</span>
              </p>
              <p className="text-slate-600">
                {locale === 'ua'
                  ? 'Замовлення автоматично прив’яжеться до вашого облікового запису.'
                  : 'Your order will be linked to your account for live tracking.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="shrink-0 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs cursor-pointer"
            >
              {locale === 'ua' ? 'Увійти' : 'Sign In'}
            </button>
          </div>
        )}

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
                <div className="text-slate-500 font-medium">Qty: {item.quantity} × {formatPrice(item.price)}</div>
              </div>
              <div className="font-sans font-bold text-slate-900 shrink-0">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 font-medium">
            <span>{t.cart.subtotal}</span>
            <span className="text-slate-900 font-bold font-sans">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600 font-medium">
            <span>{t.checkout.delivery}</span>
            <span className="text-emerald-600 font-bold">{t.checkout.free}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-100">
            <span>{t.checkout.total}</span>
            <span className="text-xl text-blue-600 font-black font-sans">{formatPrice(subtotal)}</span>
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
