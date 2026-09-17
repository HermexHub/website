'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, ShoppingCart, AlertCircle } from 'lucide-react'
import { Product } from '@/lib/api/types'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { useCartStore } from '@/lib/store/use-cart-store'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation()
  const { addItem } = useCartStore()
  const [added, setAdded] = useState(false)

  const isOutOfStock = product.stockQuantity <= 0
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return

    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10">
      {/* Product Image Link */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square w-full overflow-hidden bg-slate-950/80"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-800/40 text-slate-400">
            No Image
          </div>
        )}

        {/* Stock Badge Overlay */}
        <div className="absolute top-3 left-3">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-400 border border-rose-500/30 backdrop-blur-md">
              {t.catalog.outOfStock}
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/30 backdrop-blur-md animate-pulse">
              {t.catalog.lowStock}: {product.stockQuantity}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
              {t.catalog.inStock}: {product.stockQuantity}
            </span>
          )}
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 right-3">
            <span className="rounded-md bg-slate-950/80 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700/50 backdrop-blur-md">
              {product.category}
            </span>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="text-[11px] font-mono text-slate-400 mb-1">
          {product.sku}
        </div>

        <Link href={`/products/${product.id}`} className="group-hover:text-blue-400 transition-colors">
          <h3 className="text-base font-semibold text-white line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price & Action Row */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Price</span>
            <span className="text-lg font-bold text-white tracking-tight">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              isOutOfStock
                ? 'cursor-not-allowed bg-slate-800/50 text-slate-400 border border-slate-700/50'
                : added
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                <span>{t.catalog.addedToCart}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>{t.catalog.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
