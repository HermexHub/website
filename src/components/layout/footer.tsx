'use client'

import React from 'react'
import Link from 'next/link'
import { Truck, ShieldCheck, RotateCcw, Headphones, Zap, CheckCircle2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/i18n-context'

export function Footer() {
  const { t, locale } = useTranslation()

  return (
    <footer className="border-t border-slate-200 bg-white mt-20">
      {/* 4 Core Value Propositions / Trust Cards (Approved by User) */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Швидка доставка */}
            <div className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-200 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{t.footer.trustShippingTitle}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.footer.trustShippingDesc}</p>
              </div>
            </div>

            {/* 2. Офіційна гарантія */}
            <div className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{t.footer.trustWarrantyTitle}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.footer.trustWarrantyDesc}</p>
              </div>
            </div>

            {/* 3. 30 днів повернення */}
            <div className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-200 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <RotateCcw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{t.footer.trustReturnsTitle}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.footer.trustReturnsDesc}</p>
              </div>
            </div>

            {/* 4. Підтримка 24/7 */}
            <div className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-200 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{t.footer.trustSupportTitle}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.footer.trustSupportDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info (Redesigned from Screenshot 4) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group select-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
                <Zap className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-blue-600 font-sans">
                Helmex
              </span>
            </Link>

            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              {locale === 'ua'
                ? 'Helmex — офіційний онлайн-ритейлер сертифікованої електроніки, комп’ютерної техніки та розумних гаджетів із гарантією від виробника.'
                : 'Helmex is your trusted destination for cutting-edge electronics, flagship tech gadgets, and reliable express delivery.'}
            </p>

            <div className="flex items-center gap-3 pt-1 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50/80 px-3 py-1.5 rounded-xl border border-blue-100">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                <span>{locale === 'ua' ? '100% Офіційна техніка' : '100% Certified Devices'}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.footer.shopSection}
            </h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{locale === 'ua' ? 'Смартфони та гаджети' : 'Smartphones & Gadgets'}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{locale === 'ua' ? 'Ноутбуки та компʼютери' : 'Laptops & Computers'}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{locale === 'ua' ? 'Бездротові навушники' : 'Wireless Audio'}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{locale === 'ua' ? 'Смарт-годинники' : 'Smartwatches'}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{locale === 'ua' ? 'Павербанки та станції' : 'Power Banks & Batteries'}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.footer.supportSection}
            </h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/cart" className="hover:text-blue-600 transition-colors">{t.nav.cart}</Link></li>
              <li><Link href="/orders" className="hover:text-blue-600 transition-colors">{locale === 'ua' ? 'Відстеження замовлення' : 'Track Your Order'}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{t.footer.shippingInfo}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{t.footer.returns}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{t.footer.faq}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.footer.legalSection}
            </h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{t.footer.privacyPolicy}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{t.footer.termsOfService}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{locale === 'ua' ? 'Гарантійні зобовʼязання' : 'Warranty Terms'}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright Only (Payment methods removed per user instruction) */}
      <div className="border-t border-slate-100 bg-slate-50 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Helmex Inc. {t.common.allRightsReserved}
          </p>

          <p className="text-xs text-slate-400">
            {locale === 'ua'
              ? 'Офіційна гарантія та якість у кожній деталі'
              : 'Official warranty and quality in every detail'}
          </p>
        </div>
      </div>
    </footer>
  )
}
