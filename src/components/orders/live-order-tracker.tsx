'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Radio,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react'
import { getOrderSseUrl } from '@/lib/api/client'
import { OrderDetails } from '@/lib/api/types'
import { useTranslation } from '@/lib/i18n/i18n-context'

interface LiveOrderTrackerProps {
  orderId: string
  initialOrder?: OrderDetails | null
}

interface StreamEventMessage {
  eventType?: string
  status?: string
  orderId?: string
  timestamp?: string
  message?: string
}

export function LiveOrderTracker({
  orderId,
  initialOrder
}: LiveOrderTrackerProps) {
  const { t } = useTranslation()
  const [order, setOrder] = useState<OrderDetails | null>(initialOrder || null)
  const [currentStatus, setCurrentStatus] = useState<string>(
    initialOrder?.status || 'PENDING'
  )
  const [isConnected, setIsConnected] = useState(false)
  const [eventsLog, setEventsLog] = useState<StreamEventMessage[]>([])

  useEffect(() => {
    if (!orderId) return

    const sseUrl = getOrderSseUrl(orderId)
    const eventSource = new EventSource(sseUrl)

    eventSource.onopen = () => {
      setIsConnected(true)
    }

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        setEventsLog((prev) => [data, ...prev.slice(0, 9)])

        if (data.status) {
          setCurrentStatus(data.status)
        }
        if (data.order) {
          setOrder(data.order)
        }
      } catch (err) {
        console.warn('Error parsing SSE event:', err)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
    }

    return () => {
      eventSource.close()
    }
  }, [orderId])

  const isConfirmed = currentStatus === 'CONFIRMED'
  const isCancelled = currentStatus === 'CANCELLED'
  const isPending = currentStatus === 'PENDING'

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {t.tracker.title}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  isConnected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                <Radio className={`h-3 w-3 ${isConnected ? 'animate-pulse' : ''}`} />
                {isConnected ? t.tracker.liveConnected : t.tracker.connecting}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {t.tracker.orderId}: <span className="font-mono text-slate-800 font-bold">{orderId}</span>
            </p>
          </div>

          <div className="shrink-0">
            {isConfirmed && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold">
                <CheckCircle2 className="h-4 w-4" />
                {t.tracker.statusConfirmed}
              </span>
            )}
            {isCancelled && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-sm font-bold">
                <XCircle className="h-4 w-4" />
                {t.tracker.statusCancelled}
              </span>
            )}
            {isPending && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-sm font-bold animate-pulse">
                <Clock className="h-4 w-4" />
                {t.tracker.statusPending}
              </span>
            )}
          </div>
        </div>

        {/* Timeline Stepper */}
        <div className="pt-8 pb-4">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {/* Step 1: Created */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Package className="h-5 w-5" />
              </div>
              <span className="font-bold text-slate-900">{t.tracker.stepCreated}</span>
            </div>

            {/* Step 2: Stock */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-colors ${
                  isConfirmed || isCancelled
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-600 text-white shadow-xs'
                }`}
              >
                <Truck className="h-5 w-5" />
              </div>
              <span className="font-bold text-slate-900">{t.tracker.stepStockReserved}</span>
            </div>

            {/* Step 3: Payment */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-colors ${
                  isConfirmed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isCancelled
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-amber-500 text-white animate-pulse'
                }`}
              >
                <CreditCard className="h-5 w-5" />
              </div>
              <span
                className={`font-bold ${
                  isConfirmed
                    ? 'text-emerald-700'
                    : isCancelled
                    ? 'text-rose-700'
                    : 'text-amber-700'
                }`}
              >
                {t.tracker.stepPayment}
              </span>
            </div>

            {/* Step 4: Final State */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-colors ${
                  isConfirmed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isCancelled
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isCancelled ? (
                  <RotateCcw className="h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
              </div>
              <span
                className={`font-bold ${
                  isConfirmed
                    ? 'text-emerald-700'
                    : isCancelled
                    ? 'text-rose-700'
                    : 'text-slate-400'
                }`}
              >
                {isCancelled ? 'Cancelled' : t.tracker.stepConfirmed}
              </span>
            </div>
          </div>
        </div>

        {/* Notice if Cancelled */}
        {isCancelled && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-start gap-3">
            <RotateCcw className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900 mb-1">
                Order Processing Stopped
              </h4>
              <p className="leading-relaxed text-rose-700">
                {t.tracker.orderCancelledNotice}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Order Updates Log */}
      {eventsLog.length > 0 && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-blue-600" />
              Live Order Timeline
            </span>
            <span className="text-slate-400 font-normal">Auto-refreshing</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs max-h-48 overflow-y-auto">
            {eventsLog.map((ev, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-slate-900 font-semibold">
                  {ev.message || ev.status || ev.eventType || 'Order updated'}
                </span>
                <span className="text-slate-400 text-[11px] font-mono">
                  {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : 'Just now'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Summary Breakdown */}
      {order && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            {t.tracker.orderSummary}
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">{item.productId}</span>
                  <span className="text-slate-500">Qty: {item.quantity}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Total Paid</span>
            <span className="font-mono text-xl text-blue-600 font-black">
              ${Number(order.totalAmount || 0).toFixed(2)}
            </span>
          </div>

          {order.deliveryAddress && (
            <div className="border-t border-slate-100 pt-3 text-xs text-slate-600">
              <span className="font-bold text-slate-900 block mb-0.5">
                {t.tracker.deliveryAddress}:
              </span>
              <span>{order.deliveryAddress}</span>
            </div>
          )}
        </div>
      )}

      <div className="text-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.common.backToCatalog}</span>
        </Link>
      </div>
    </div>
  )
}
