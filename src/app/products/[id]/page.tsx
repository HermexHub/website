'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
  AlertCircle
} from 'lucide-react'
import { fetchProductById } from '@/lib/api/client'
import { Product } from '@/lib/api/types'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { useCartStore } from '@/lib/store/use-cart-store'

export default function ProductDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string

  const { addItem } = useCartStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!productId) return

    async function loadProduct() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetchProductById(productId)
        setProduct(response.product)
      } catch (err) {
        setError((err as Error).message || 'Product not found')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (!product || product.stockQuantity <= 0) return
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-slate-800 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-slate-800 rounded-lg" />
            <div className="h-4 w-1/4 bg-slate-800 rounded" />
            <div className="h-20 bg-slate-800/60 rounded-xl" />
            <div className="h-12 w-full bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'This product does not exist in our catalog.'}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.product.backToCatalog}</span>
        </Link>
      </div>
    )
  }

  const isOutOfStock = product.stockQuantity <= 0
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t.product.backToCatalog}</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-500">
              No Image Preview
            </div>
          )}

          {/* Floating Category */}
          {product.category && (
            <div className="absolute top-4 left-4">
              <span className="rounded-xl bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-200 border border-slate-700/60 backdrop-blur-md">
                {product.category}
              </span>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <div className="text-xs font-mono text-slate-400 mb-1">
              SKU: {product.sku}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              ${Number(product.price).toFixed(2)}
            </span>

            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-500/30">
                {t.catalog.outOfStock}
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/30 animate-pulse">
                {t.catalog.lowStock}: {product.stockQuantity}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                {t.catalog.inStock}: {product.stockQuantity}
              </span>
            )}
          </div>

          {product.description && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-300 leading-relaxed">
              {product.description}
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-2">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-300">
                  {t.product.quantity}:
                </span>
                <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold text-white font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                    }
                    className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold transition-all shadow-xl ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : added
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30 scale-[1.02]'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/20 active:scale-[0.99]'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>{t.catalog.addedToCart}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  <span>{t.catalog.addToCart}</span>
                </>
              )}
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/30 p-3">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Saga Stock Reservation</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/30 p-3">
              <Truck className="h-4 w-4 text-blue-400 shrink-0" />
              <span>Express Hub Dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
