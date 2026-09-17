'use client'

import React from 'react'
import Link from 'next/link'
import { Truck, ShieldCheck, RotateCcw, Headphones, CreditCard, Lock, Zap } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/i18n-context'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-slate-200 bg-white mt-20">
      {/* Top Value Propositions / Trust Bar */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{t.footer.trustShippingTitle}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.footer.trustShippingDesc}</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{t.footer.trustWarrantyTitle}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.footer.trustWarrantyDesc}</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <RotateCcw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{t.footer.trustReturnsTitle}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.footer.trustReturnsDesc}</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
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
          {/* Col 1: Brand Info (2 cols wide) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm font-bold">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Hermex<span className="text-blue-600">Store</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              {t.footer.brandDesc}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <Lock className="h-3.5 w-3.5" />
                <span>256-Bit SSL Encrypted</span>
              </span>
              <span className="text-slate-400">•</span>
              <span>100% Certified Goods</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.footer.shopSection}
            </h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Laptops & Ultrabooks</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Wireless Audio & ANC</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Mechanical Keyboards</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Ergonomic Mice & Mats</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">4K Displays & Monitors</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.footer.supportSection}
            </h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/cart" className="hover:text-blue-600 transition-colors">{t.nav.cart}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{t.footer.shippingInfo}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{t.footer.returns}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{t.footer.faq}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{t.footer.contact}</Link></li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.footer.legalSection}
            </h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{t.footer.privacyPolicy}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">{t.footer.termsOfService}</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Warranty Terms</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Cookie Preferences</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Payment Badges & Copyright */}
      <div className="border-t border-slate-100 bg-slate-50 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {t.common.brandName} Inc. {t.common.allRightsReserved}
          </p>

          {/* Payment Badges */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden md:inline">
              {t.footer.paymentMethods}:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-[10px] shadow-xs">
                VISA
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-[10px] shadow-xs">
                MasterCard
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-[10px] shadow-xs">
                Apple Pay
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-[10px] shadow-xs">
                Google Pay
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
