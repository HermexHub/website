'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Zap, Search, PhoneCall, ShieldCheck } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { useCartStore } from '@/lib/store/use-cart-store'

export function Navbar() {
  const { t, locale, setLocale } = useTranslation()
  const { getTotalCount, getSubtotal, setOpen } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartCount = mounted ? getTotalCount() : 0
  const cartSubtotal = mounted ? getSubtotal() : 0

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top micro-bar for trust & contact */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Official Manufacturer Warranty on All Products</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Free Express Delivery from $150</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span>Customer Support: <strong>+1 (800) 555-0199</strong></span>
            <span className="text-slate-600">|</span>
            <Link href="/orders" className="hover:text-white transition-colors">
              {t.nav.orders}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Tag */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Hermex
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200">
                  TECH
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 hidden sm:block -mt-0.5">
                Flagship Electronics
              </span>
            </div>
          </Link>

          {/* Quick Category / Shop Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              {t.nav.catalog}
            </Link>
            <Link
              href="/cart"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              {t.nav.cart}
            </Link>
          </nav>
        </div>

        {/* Right Actions: Lang + Cart */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
            <button
              onClick={() => setLocale('en')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                locale === 'en'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale('ua')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                locale === 'ua'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              UA
            </button>
          </div>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline font-bold">{t.nav.cart}</span>
            {mounted && cartSubtotal > 0 && (
              <span className="hidden md:inline font-mono font-normal opacity-90 pl-1 border-l border-white/30">
                ${cartSubtotal.toFixed(2)}
              </span>
            )}
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-blue-700 text-xs font-black shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
