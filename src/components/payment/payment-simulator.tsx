'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, ShieldCheck, Lock, Loader2, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react'
import { confirmPaymentApi } from '@/lib/api/client'
import { PaymentScenario } from '@/lib/api/types'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { useCartStore } from '@/lib/store/use-cart-store'

interface PaymentSimulatorProps {
  orderId: string
  amount: number
}

interface TestScenarioOption {
  key: PaymentScenario
  label: string
  cardNumber: string
  badgeColor: string
}

const TEST_SCENARIOS: TestScenarioOption[] = [
  {
    key: 'SUCCESS',
    label: 'Success (Happy Path)',
    cardNumber: '4242 •••• •••• 4242',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  },
  {
    key: 'INSUFFICIENT_FUNDS',
    label: 'Insufficient Funds',
    cardNumber: '4000 •••• •••• 0116',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
  },
  {
    key: 'CARD_EXPIRED',
    label: 'Card Expired',
    cardNumber: '4000 •••• •••• 0069',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
  },
  {
    key: 'DECLINED_BY_BANK',
    label: 'Bank Declined',
    cardNumber: '4000 •••• •••• 0002',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
  },
  {
    key: 'GATEWAY_TIMEOUT',
    label: 'Gateway Timeout',
    cardNumber: '4000 •••• •••• 0003',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
  }
]

export function PaymentSimulator({ orderId, amount }: PaymentSimulatorProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { clearCart } = useCartStore()

  const [scenario, setScenario] = useState<PaymentScenario>('SUCCESS')
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242')
  const [cardHolder, setCardHolder] = useState('ALEX MERCER')
  const [expiry, setExpiry] = useState('12/28')
  const [cvv, setCvv] = useState('942')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectScenario = (opt: TestScenarioOption) => {
    setScenario(opt.key)
    setCardNumber(opt.cardNumber.replace(/•••• ••••/g, '0000 0000'))
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)

    try {
      await confirmPaymentApi(orderId, scenario, cardNumber.replace(/\s/g, ''))
      // Payment initiated, clear cart & navigate to live SSE tracking page
      clearCart()
      router.push(`/orders/${orderId}`)
    } catch (err) {
      setError((err as Error).message || 'Payment simulation failed')
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Test Controls Panel */}
      <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
          <Sparkles className="h-4 w-4" />
          <span>{t.payment.testScenariosTitle}</span>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">
          {t.payment.testScenariosSubtitle}
        </p>

        <div className="flex flex-wrap gap-2">
          {TEST_SCENARIOS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => selectScenario(opt)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium border transition-all ${
                scenario === opt.key
                  ? `${opt.badgeColor} ring-1 ring-white/20 shadow-md scale-105`
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Payment Form */}
      <form
        onSubmit={handlePay}
        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-6 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {t.payment.title}
            </h2>
            <p className="text-xs text-slate-400">
              {t.payment.orderId}: <span className="font-mono text-slate-300">{orderId}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">{t.payment.amountDue}</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              ${Number(amount || 0).toFixed(2)}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Card UI Mockup */}
        <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 p-6 border border-slate-700/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold tracking-widest uppercase">
              Hermex Bank Sandbox
            </div>
            <CreditCard className="h-6 w-6 text-blue-400" />
          </div>

          <div className="font-mono text-lg sm:text-xl tracking-widest text-white py-2">
            {cardNumber || '•••• •••• •••• ••••'}
          </div>

          <div className="flex justify-between items-end text-xs">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Cardholder</span>
              <span className="font-semibold text-white tracking-wide">{cardHolder || 'ALEX MERCER'}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Expires</span>
              <span className="font-semibold text-white">{expiry || '12/28'}</span>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.payment.cardNumberLabel}
            </label>
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm font-mono text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.payment.cardHolderLabel}
            </label>
            <input
              type="text"
              required
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm text-white uppercase focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.payment.expiryLabel}
              </label>
              <input
                type="text"
                required
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="12/28"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm font-mono text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.payment.cvvLabel}
              </label>
              <input
                type="password"
                required
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="•••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm font-mono text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-600/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t.payment.processing}</span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              <span>{t.payment.payButton} (${Number(amount || 0).toFixed(2)})</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>{t.payment.safeSimulationBadge}</span>
        </div>
      </form>
    </div>
  )
}
