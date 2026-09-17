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
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t.tracker.title}
              </h2>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  isConnected
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                <Radio className={`h-3 w-3 ${isConnected ? 'animate-pulse' : ''}`} />
                {isConnected ? t.tracker.liveConnected : t.tracker.connecting}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.tracker.orderId}: <span className="font-mono text-slate-300">{orderId}</span>
            </p>
          </div>

          <div className="shrink-0">
            {isConfirmed && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                {t.tracker.statusConfirmed}
              </span>
            )}
            {isCancelled && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 text-sm font-semibold">
                <XCircle className="h-4 w-4" />
                {t.tracker.statusCancelled}
              </span>
            )}
            {isPending && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 text-sm font-semibold animate-pulse">
                <Clock className="h-4 w-4" />
                {t.tracker.statusPending}
              </span>
            )}
          </div>
        </div>

        {/* Timeline Stepper */}
        <div className="pt-6 pb-2">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {/* Step 1: Created */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
                <Package className="h-5 w-5" />
              </div>
              <span className="font-semibold text-white">{t.tracker.stepCreated}</span>
            </div>

            {/* Step 2: Stock */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                  isConfirmed || isCancelled
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                }`}
              >
                <Truck className="h-5 w-5" />
              </div>
              <span className="font-semibold text-white">{t.tracker.stepStockReserved}</span>
            </div>

            {/* Step 3: Payment */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                  isConfirmed
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : isCancelled
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-amber-600 text-white animate-pulse'
                }`}
              >
                <CreditCard className="h-5 w-5" />
              </div>
              <span
                className={`font-semibold ${
                  isConfirmed
                    ? 'text-emerald-400'
                    : isCancelled
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                {t.tracker.stepPayment}
              </span>
            </div>

            {/* Step 4: Final State */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                  isConfirmed
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : isCancelled
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isCancelled ? (
                  <RotateCcw className="h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
              </div>
              <span
                className={`font-semibold ${
                  isConfirmed
                    ? 'text-emerald-400'
                    : isCancelled
                    ? 'text-rose-400'
                    : 'text-slate-500'
                }`}
              >
                {isCancelled ? 'Rollback' : t.tracker.stepConfirmed}
              </span>
            </div>
          </div>
        </div>

        {/* Saga Compensation Notice if Cancelled */}
        {isCancelled && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-start gap-3">
            <RotateCcw className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-rose-200 mb-1">
                Saga Rollback & Compensation Completed
              </h4>
              <p className="leading-relaxed text-slate-300">
                {t.tracker.sagaFailedNotice}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Live Choreography Events Log */}
      {eventsLog.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-blue-400" />
              Choreography Event Stream
            </span>
            <span className="font-mono text-slate-500">RabbitMQ AMQP</span>
          </div>

          <div className="divide-y divide-slate-800/60 font-mono text-xs max-h-48 overflow-y-auto">
            {eventsLog.map((ev, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between gap-4">
                <span className="text-blue-400 font-medium">
                  {ev.eventType || 'amqp.event'}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : 'Just now'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Summary Breakdown */}
      {order && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight">
            {t.tracker.orderSummary}
          </h3>

          <div className="divide-y divide-slate-800 text-xs">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-medium text-white block">{item.productId}</span>
                  <span className="text-slate-400">Quantity: {item.quantity}</span>
                </div>
                <span className="font-mono font-semibold text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-sm font-bold text-white">
            <span>Total Amount</span>
            <span className="font-mono text-lg text-emerald-400">
              ${Number(order.totalAmount || 0).toFixed(2)}
            </span>
          </div>

          {order.deliveryAddress && (
            <div className="border-t border-slate-800 pt-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 block mb-0.5">
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
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.common.backToCatalog}</span>
        </Link>
      </div>
    </div>
  )
}
