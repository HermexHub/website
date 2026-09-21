'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Check,
  ShoppingCart,
  Star,
  Heart,
  Scale
} from 'lucide-react'
import { Product } from '@/lib/api/types'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { useCartStore } from '@/lib/store/use-cart-store'
import { useUserStore } from '@/lib/store/use-user-store'
import { formatPrice } from '@/lib/utils/format'
import { getHighlightSpecs } from '@/lib/utils/specs'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, locale } = useTranslation()
  const { addItem } = useCartStore()
  const { isInWishlist, toggleWishlist, isInCompare, toggleCompare } = useUserStore()
  const [added, setAdded] = useState(false)

  const isOutOfStock = product.stockQuantity <= 0
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5
  const isFavorite = isInWishlist(product.id)
  const isCompared = isInCompare(product.id)
  const highlights = getHighlightSpecs(product)

  const priceNum = Number(product.price) || 0
  const monoMonthly = Math.round(priceNum / 12)
  const privatMonthly = Math.round(priceNum / 10)
  const hasDiscount = product.oldPrice && Number(product.oldPrice) > priceNum
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.oldPrice) - priceNum) / Number(product.oldPrice)) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return

    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleCompare(product.id)
  }

  return (
    <div className="group relative flex flex-col h-full rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300">
      {/* 1. Top action row: Low stock / Badge / Brand & Compare / Wishlist buttons */}
      <div className="flex items-center justify-between z-10 h-7 mb-2 gap-2">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {product.badge ? (
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-2xs shrink-0">
              {product.badge}
            </span>
          ) : product.brand ? (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200 shrink-0">
              {product.brand}
            </span>
          ) : null}

          {isOutOfStock ? (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200 shrink-0">
              {t.catalog.outOfStock}
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200 shrink-0">
              {locale === 'ua' ? `${product.stockQuantity} шт.` : `${product.stockQuantity} left`}
            </span>
          ) : null}
        </div>

        {/* Action icons: Compare & Wishlist */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Compare Button */}
          <button
            onClick={handleToggleCompare}
            type="button"
            aria-label="Add to Compare"
            title={
              isCompared
                ? (locale === 'ua' ? 'Видалити з порівняння' : 'Remove from compare')
                : (locale === 'ua' ? 'Додати до порівняння' : 'Add to compare')
            }
            className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all cursor-pointer ${
              isCompared
                ? 'bg-blue-50 border-blue-200 text-blue-600 scale-105 shadow-xs'
                : 'bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 border-slate-100'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
          </button>

          {/* Wishlist Heart Button */}
          <button
            onClick={handleToggleFavorite}
            type="button"
            aria-label="Add to Wishlist"
            title={
              isFavorite
                ? (locale === 'ua' ? 'Видалити з бажаного' : 'Remove from wishlist')
                : (locale === 'ua' ? 'Додати до бажаного' : 'Add to wishlist')
            }
            className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-500 scale-105 shadow-xs'
                : 'bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 border-slate-100'
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 transition-all ${
                isFavorite
                  ? 'fill-rose-500 text-rose-500'
                  : 'text-slate-400 hover:scale-105'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Product Gallery Canvas (Modern rounded full-bleed studio showcase) */}
      <Link
        href={`/products/${product.id}`}
        className="relative w-full h-48 overflow-hidden rounded-2xl bg-slate-100/80 border border-slate-200/60 group-hover:border-blue-200 transition-all block"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400 text-xs font-semibold">
            {locale === 'ua' ? 'Немає фото' : 'No Image'}
          </div>
        )}

        {/* Color swatch pill on image */}
        {product.colorHex && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200/80 shadow-2xs">
            <span
              className="h-2.5 w-2.5 rounded-full border border-slate-300 shrink-0"
              style={{ backgroundColor: product.colorHex }}
            />
            <span className="truncate max-w-[80px]">{product.color}</span>
          </div>
        )}
      </Link>

      {/* 3. SKU & Star Rating (Fixed h-5) */}
      <div className="flex items-center justify-between text-xs h-5 mt-3">
        <span className="font-mono text-[10px] text-slate-400 uppercase">
          {product.sku}
        </span>
        <div className="flex items-center gap-1 text-amber-500 text-xs">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="font-bold text-slate-700 text-[11px]">
            {product.rating ? Number(product.rating).toFixed(1) : '4.9'}
          </span>
          <span className="text-slate-400 text-[10px]">
            ({product.reviewsCount ?? 24})
          </span>
        </div>
      </div>

      {/* 4. Product Title (Fixed h-10 with 2-line clamp to prevent shifts) */}
      <div className="h-10 mt-1">
        <Link href={`/products/${product.id}`} className="group-hover:text-blue-600 transition-colors">
          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>
      </div>

      {/* 4.1 Key Spec Highlights */}
      <div className="mt-2 flex flex-wrap gap-1 min-h-[46px] content-start">
        {highlights.slice(0, 2).map((highlight, idx) => (
          <span
            key={idx}
            className="inline-flex items-center text-[10px] font-medium text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-md line-clamp-1 border border-slate-200/60"
            title={highlight}
          >
            {highlight}
          </span>
        ))}
      </div>

      {/* 5. Authentic Banking Installment Widgets (Exact match to Screenshot 3) */}
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {/* PrivatBank (Screenshot 3: Pie chart icon + PrivatBank + amount) */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/60 transition-colors">
          <div className="h-5 w-5 rounded-full bg-amber-400 relative overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
            {/* Green pie slice */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-emerald-600 rounded-tl-full" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-medium text-slate-600 truncate leading-tight">
              ПриватБанк
            </span>
            <span className="block text-[11px] font-bold text-slate-900 tracking-tight leading-tight">
              від {privatMonthly.toLocaleString('uk-UA')} ₴ × 10
            </span>
          </div>
        </div>

        {/* monobank (Screenshot 3: Cat paw icon + monobank + amount) */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/60 transition-colors">
          <span className="text-sm shrink-0 leading-none">🐾</span>
          <div className="min-w-0">
            <span className="block text-[10px] font-medium text-slate-600 truncate leading-tight">
              monobank
            </span>
            <span className="block text-[11px] font-bold text-slate-900 tracking-tight leading-tight">
              від {monoMonthly.toLocaleString('uk-UA')} ₴ × 12
            </span>
          </div>
        </div>
      </div>

      {/* 6. Price & Action Row (mt-auto locks this to the exact same baseline across all cards) */}
      <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-slate-100">
        <div className="flex flex-col">
          {hasDiscount && (
            <div className="flex items-center gap-1.5 leading-none mb-0.5">
              <span className="text-xs text-slate-400 line-through font-medium font-sans">
                {formatPrice(product.oldPrice!)}
              </span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1 py-0.2 rounded">
                -{discountPercent}%
              </span>
            </div>
          )}
          <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all shadow-xs active:scale-95 ${
            isOutOfStock
              ? 'cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200'
              : added
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
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
  )
}
