'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  ShoppingBag,
  Zap,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Truck,
  Sun,
  Moon,
  Scale,
  Heart,
  User as UserIcon,
  PackageCheck,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { useCartStore } from '@/lib/store/use-cart-store'
import { useUserStore } from '@/lib/store/use-user-store'
import { formatPrice, formatUserName } from '@/lib/utils/format'
import { AuthModal } from '@/components/auth/auth-modal'
import { WishlistModal } from '@/components/wishlist/wishlist-modal'
import { CompareModal } from '@/components/compare/compare-modal'

export function Navbar() {
  const { t, locale, setLocale } = useTranslation()
  const { getTotalCount, getSubtotal, setOpen } = useCartStore()
  const {
    user,
    setAuthModalOpen,
    logout,
    restoreSession,
    getWishlistCount,
    getCompareCount,
    setWishlistOpen,
    setCompareOpen
  } = useUserStore()

  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    restoreSession()

    const saved = localStorage.getItem('hermex_theme') as 'light' | 'dark' | null
    if (saved) {
      setTheme(saved)
      if (saved === 'dark') document.documentElement.classList.add('dark')
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [restoreSession])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('hermex_theme', next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const cartCount = mounted ? getTotalCount() : 0
  const cartSubtotal = mounted ? getSubtotal() : 0
  const wishlistCount = mounted ? getWishlistCount() : 0
  const compareCount = mounted ? getCompareCount() : 0
  const displayName = formatUserName(user?.fullName || (user as any)?.name, user?.email)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs transition-colors">
        {/* Top micro-bar: Location, Trust, Support Chat, Language & Theme */}
        <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left: Location & Official Warranty & Delivery */}
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                <MapPin className="h-3.5 w-3.5 text-blue-400" />
                <span>{t.nav.storeLocation}</span>
              </span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{locale === 'ua' ? 'Офіційна гарантія 24 місяці' : '24 Months Official Warranty'}</span>
              </span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Truck className="h-3.5 w-3.5 text-amber-400" />
                <span>{locale === 'ua' ? 'Безкоштовна доставка від 2 000 грн' : 'Free Delivery from 2 000 грн'}</span>
              </span>
            </div>

            {/* Right: Support Chat + Language + Theme Switchers */}
            <div className="flex items-center gap-4 text-[11px] text-slate-300">
              {/* Online Support Chat Link */}
              <button
                type="button"
                onClick={() => alert(locale === 'ua' ? 'Оператор підтримки Helmex онлайн! Чат підключається...' : 'Helmex Support is online! Connecting chat...')}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-semibold text-slate-200">{t.nav.supportChat}</span>
              </button>

              <span className="text-slate-700">|</span>

              {/* Language Switcher in Top Bar */}
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-[10px]">
                <button
                  onClick={() => setLocale('ua')}
                  className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    locale === 'ua'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  UA
                </button>
                <button
                  onClick={() => setLocale('en')}
                  className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    locale === 'en'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              <span className="text-slate-700">|</span>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center h-6 w-6 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={theme === 'light' ? 'Увімкнути темну тему' : 'Увімкнути світлу тему'}
              >
                {theme === 'light' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5 text-amber-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-transform active:scale-95 shrink-0"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/30 group-hover:bg-blue-700 transition-colors">
                <Zap className="h-5 w-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-[#0066FF] leading-none">
                  Helmex
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Tech Store
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-600">
              <Link
                href="/#catalog-section"
                className="px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 transition-colors"
              >
                {t.nav.catalog}
              </Link>
            </nav>
          </div>

          {/* Right Action Stack: Compare -> Wishlist -> Cart -> Sign In (Far Right) */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* 1. Compare Button */}
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              className="flex flex-col items-center justify-center group cursor-pointer px-1 py-1"
            >
              <div className="relative">
                <Scale className="h-5 w-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
                {compareCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-black shadow-xs">
                    {compareCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-slate-600 group-hover:text-blue-600 transition-colors mt-0.5">
                {locale === 'ua' ? 'Порівняння' : 'Compare'}
              </span>
            </button>

            {/* 2. Wishlist Button */}
            <button
              type="button"
              onClick={() => setWishlistOpen(true)}
              className="flex flex-col items-center justify-center group cursor-pointer px-1 py-1"
            >
              <div className="relative">
                <Heart className="h-5 w-5 text-slate-700 group-hover:text-rose-600 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-white text-[10px] font-black shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-slate-600 group-hover:text-rose-600 transition-colors mt-0.5">
                {locale === 'ua' ? 'Бажане' : 'Wishlist'}
              </span>
            </button>

            {/* 3. Cart Trigger Button */}
            <button
              onClick={() => setOpen(true)}
              className="relative flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">{t.nav.cart}</span>
              {mounted && cartSubtotal > 0 && (
                <span className="hidden md:inline font-mono font-medium opacity-95 pl-1.5 border-l border-white/30 text-xs">
                  {formatPrice(cartSubtotal)}
                </span>
              )}
              {cartCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-blue-700 text-xs font-black shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 4. User Auth Widget */}
            <div className="relative pl-1 border-l border-slate-200" ref={dropdownRef}>
              {user ? (
                /* Authenticated State */
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  type="button"
                  className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-50 border border-slate-200/80 transition-all cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-xs">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="text-left hidden md:block pr-1">
                    <span className="block text-[10px] text-slate-400 font-medium leading-none">
                      {locale === 'ua' ? 'Кабінет' : 'Account'}
                    </span>
                    <span className="block text-xs font-bold text-slate-900 mt-0.5 max-w-[120px] truncate leading-none">
                      {displayName}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              ) : (
                /* Guest State */
                <button
                  onClick={() => setAuthModalOpen(true)}
                  type="button"
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="block text-[10px] text-slate-500 font-medium leading-none">
                      {locale === 'ua' ? 'Вітаємо' : 'Welcome'}
                    </span>
                    <span className="block text-xs font-bold text-slate-900 mt-0.5 leading-none">
                      {locale === 'ua' ? 'Увійти' : 'Sign In'}
                    </span>
                  </div>
                </button>
              )}

              {/* User Dropdown Menu */}
              {user && userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setUserDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    <span>{locale === 'ua' ? 'Вийти з кабінету' : 'Sign Out'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <AuthModal />
      <WishlistModal />
      <CompareModal />
    </>
  )
}
