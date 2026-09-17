'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check, ShoppingCart, Star, Box, ShieldCheck } from 'lucide-react'
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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300">
      {/* Product Image Link with Clean Light Frame */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square w-full overflow-hidden bg-slate-50 flex items-center justify-center p-6 border-b border-slate-100"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 text-xs font-semibold">
            No Image Available
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-3 left-3">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500 border border-slate-200 shadow-2xs">
              {t.catalog.outOfStock}
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200/80 shadow-2xs">
              {t.catalog.lowStock.replace('{{count}}', String(product.stockQuantity))}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200/80 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>{t.catalog.inStock}</span>
            </span>
          )}
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 right-3">
            <span className="rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase text-slate-600 border border-slate-200 shadow-2xs">
              {product.category}
            </span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* SKU & Star Rating */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-mono text-[11px] font-medium text-slate-400 uppercase">
            {product.sku}
          </span>
          <div className="flex items-center gap-1 text-amber-500 text-xs">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-700">4.9</span>
            <span className="text-slate-400 text-[10px]">(48)</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/products/${product.id}`} className="group-hover:text-blue-600 transition-colors">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Description snippet */}
        {product.description && (
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price & Action Row */}
        <div className="mt-auto pt-5 flex items-center justify-between gap-3 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Price
            </span>
            <span className="text-xl font-black text-slate-900 tracking-tight font-mono">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-xs active:scale-95 ${
              isOutOfStock
                ? 'cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200'
                : added
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md cursor-pointer'
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
