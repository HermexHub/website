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
  Star,
  AlertCircle,
  Heart,
  Scale
} from 'lucide-react'
import { fetchProductById } from '@/lib/api/client'
import { Product } from '@/lib/api/types'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { useCartStore } from '@/lib/store/use-cart-store'
import { useUserStore } from '@/lib/store/use-user-store'
import { formatPrice, formatInstallment } from '@/lib/utils/format'
import { getProductSpecs } from '@/lib/utils/specs'

export default function ProductDetailPage() {
  const { t, locale } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string

  const { addItem } = useCartStore()
  const { isInWishlist, toggleWishlist, isInCompare, toggleCompare } = useUserStore()

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
        <div className="h-6 w-32 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-slate-200 rounded-lg" />
            <div className="h-4 w-1/4 bg-slate-200 rounded" />
            <div className="h-20 bg-slate-200 rounded-xl" />
            <div className="h-12 w-full bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This product does not exist in our catalog.'}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition-colors"
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
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t.product.backToCatalog}</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Product Image Card */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-slate-200/90 bg-white p-8 shadow-xs flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain object-center"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400 text-xs font-semibold">
              No Image Preview
            </div>
          )}

          {/* Floating Category */}
          {product.category && (
            <div className="absolute top-4 left-4">
              <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                {product.category}
              </span>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>SKU: {product.sku}</span>
              <div className="flex items-center gap-1 text-amber-500 font-sans">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800">4.9</span>
                <span className="text-slate-400 text-xs">(48 reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-3xl font-black font-sans text-slate-900 tracking-tight">
              {formatPrice(product.price)}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/80">
              💳 {formatInstallment(product.price, 12)}
            </span>

            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200">
                {t.catalog.outOfStock}
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                {t.catalog.lowStock.replace('{{count}}', String(product.stockQuantity))}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t.catalog.inStock}</span>
              </span>
            )}
          </div>

          {product.description && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 text-sm text-slate-600 leading-relaxed shadow-2xs">
              {product.description}
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-2">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">
                  {t.product.quantity}:
                </span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2 text-slate-600 hover:text-slate-900 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold text-slate-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                    }
                    className="px-3.5 py-2 text-slate-600 hover:text-slate-900 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold transition-all shadow-sm ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : added
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30 scale-[1.02]'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-[0.99] cursor-pointer'
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

              {/* Compare Button */}
              <button
                type="button"
                onClick={() => toggleCompare(product.id)}
                title={isInCompare(product.id) ? (locale === 'ua' ? 'Видалити з порівняння' : 'Remove from compare') : (locale === 'ua' ? 'Додати до порівняння' : 'Add to compare')}
                className={`flex h-13 w-13 items-center justify-center rounded-2xl border transition-all cursor-pointer ${
                  isInCompare(product.id)
                    ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 border-slate-200'
                }`}
              >
                <Scale className="h-5 w-5" />
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                title={isInWishlist(product.id) ? (locale === 'ua' ? 'Видалити з бажаного' : 'Remove from wishlist') : (locale === 'ua' ? 'Додати до бажаного' : 'Add to wishlist')}
                className={`flex h-13 w-13 items-center justify-center rounded-2xl border transition-all cursor-pointer ${
                  isInWishlist(product.id)
                    ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-xs'
                    : 'bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 border-slate-200'
                }`}
              >
                <Heart
                  className={`h-5 w-5 transition-all ${
                    isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Value Props & Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Official 2-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
              <Truck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>1-2 Day Express Delivery</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
              <RotateCcw className="h-4 w-4 text-amber-600 shrink-0" />
              <span>30-Day Hassle-Free Return</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0" />
              <span>Original Certified Tech</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Technical Specifications Table */}
      <div className="pt-10 border-t border-slate-200 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {locale === 'ua' ? 'Технічні характеристики' : 'Technical Specifications'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {locale === 'ua'
              ? 'Повні апаратні параметри та особливості пристрою від офіційного виробника.'
              : 'Full hardware specifications and parameters from the official manufacturer.'}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs divide-y divide-slate-100">
          {getProductSpecs(product, locale as 'ua' | 'en').map((spec, index) => (
            <div
              key={spec.key}
              className={`grid grid-cols-1 sm:grid-cols-3 p-4 text-xs transition-colors ${
                index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'
              }`}
            >
              <span className="font-bold text-slate-500 mb-1 sm:mb-0">
                {spec.label}
              </span>
              <span className="sm:col-span-2 font-medium text-slate-900">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
