'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Globe, Zap, Radio, Layers } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { useCartStore } from '@/lib/store/use-cart-store'

export function Navbar() {
  const { t, locale, setLocale } = useTranslation()
  const { getTotalCount, setOpen } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartCount = mounted ? getTotalCount() : 0

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                {t.common.brandName}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SAGA HUB
                </span>
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              {t.nav.catalog}
            </Link>
            <Link
              href="/cart"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              {t.nav.cart}
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setLocale('en')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                locale === 'en'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale('ua')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                locale === 'ua'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              UA
            </button>
          </div>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 px-3.5 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-all hover:scale-105 active:scale-95"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">{t.nav.cart}</span>
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow-md shadow-blue-600/30 animate-bounce-subtle">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
