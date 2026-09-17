'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { LiveOrderTracker } from '@/components/orders/live-order-tracker'
import { fetchOrderDetails } from '@/lib/api/client'
import { OrderDetails } from '@/lib/api/types'
import { useTranslation } from '@/lib/i18n/i18n-context'

export default function OrderTrackingPage() {
  const { t } = useTranslation()
  const params = useParams()
  const orderId = params?.id as string

  const [initialOrder, setInitialOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return

    async function loadOrder() {
      try {
        const data = await fetchOrderDetails(orderId)
        setInitialOrder(data)
      } catch (err) {
        // If order not fetched via REST, SSE will still connect and stream updates
        console.warn('Initial order fetch note:', err)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  if (!orderId) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Order ID missing</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.nav.catalog}</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Connecting to order stream...</p>
        </div>
      ) : (
        <LiveOrderTracker orderId={orderId} initialOrder={initialOrder} />
      )}
    </div>
  )
}
