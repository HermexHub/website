'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Scale, ShoppingBag, Check } from 'lucide-react'
import { useUserStore } from '@/lib/store/use-user-store'
import { useCartStore } from '@/lib/store/use-cart-store'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { fetchProductById } from '@/lib/api/client'
import { Product } from '@/lib/api/types'
import { formatPrice } from '@/lib/utils/format'
import { getProductSpecs } from '@/lib/utils/specs'

export function CompareModal() {
  const { locale } = useTranslation()
  const { isCompareOpen, setCompareOpen, compareProductIds, toggleCompare, clearCompare } = useUserStore()
  const { addItem } = useCartStore()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!isCompareOpen || compareProductIds.length === 0) {
      setProducts([])
      return
    }

    let active = true
    setLoading(true)

    Promise.all(
      compareProductIds.map(async (id) => {
        try {
          const res = await fetchProductById(id)
          return res.product
        } catch {
          return null
        }
      })
    ).then((items) => {
      if (active) {
        setProducts(items.filter((p): p is Product => Boolean(p)))
        setLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [isCompareOpen, compareProductIds])

  if (!isCompareOpen) return null

  const handleAddToCart = (p: Product) => {
    addItem(p, 1)
    setAddedMap((prev) => ({ ...prev, [p.id]: true }))
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [p.id]: false }))
    }, 1500)
  }

  // Collect all unique spec keys across all products being compared
  const allSpecKeysMap = new Map<string, string>()
  products.forEach((p) => {
    const specs = getProductSpecs(p, locale)
    specs.forEach((s) => {
      if (!allSpecKeysMap.has(s.key)) {
        allSpecKeysMap.set(s.key, s.label)
      }
    })
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setCompareOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {locale === 'ua' ? 'Порівняння товарів' : 'Product Comparison'}
              </h2>
              <p className="text-xs text-slate-500">
                {locale === 'ua'
                  ? `Обрано для порівняння: ${compareProductIds.length} з 4`
                  : `Comparing ${compareProductIds.length} of 4 items`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareProductIds.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors px-2 py-1 cursor-pointer"
              >
                {locale === 'ua' ? 'Очистити все' : 'Clear all'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setCompareOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-100 animate-pulse space-y-3">
                  <div className="h-36 rounded-xl bg-slate-100" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-5 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-4 text-2xl">
                <Scale className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {locale === 'ua' ? 'Немає товарів для порівняння' : 'No items to compare'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-6">
                {locale === 'ua'
                  ? 'Додавайте товари для детального порівняння характеристик, натиснувши на іконку ⚖️ у картці товару.'
                  : 'Add up to 4 products to compare their detailed specifications side by side.'}
              </p>
              <button
                type="button"
                onClick={() => setCompareOpen(false)}
                className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                {locale === 'ua' ? 'Перейти до каталогу' : 'Explore Catalog'}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[580px]">
                {/* Product Header Cards Row */}
                <div
                  className="grid gap-4 pb-6 border-b border-slate-200"
                  style={{ gridTemplateColumns: `160px repeat(${products.length}, minmax(180px, 1fr))` }}
                >
                  <div className="flex flex-col justify-end pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {locale === 'ua' ? 'Параметр' : 'Specification'}
                    </span>
                  </div>

                  {products.map((product) => {
                    const isOutOfStock = product.stockQuantity <= 0
                    const isAdded = addedMap[product.id]

                    return (
                      <div
                        key={product.id}
                        className="relative flex flex-col justify-between p-4 rounded-2xl border border-slate-200/90 bg-white shadow-xs"
                      >
                        <button
                          type="button"
                          onClick={() => toggleCompare(product.id)}
                          className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer z-10"
                          title={locale === 'ua' ? 'Видалити' : 'Remove'}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>

                        <div className="space-y-2">
                          <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
                            {product.imageUrl ? (
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                sizes="180px"
                                className="object-contain p-2"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-slate-300">
                                📦
                              </div>
                            )}
                          </div>

                          <Link
                            href={`/products/${product.id}`}
                            onClick={() => setCompareOpen(false)}
                            className="block text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
                          >
                            {product.name}
                          </Link>

                          <div className="text-sm font-extrabold text-blue-600">
                            {formatPrice(product.price)}
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => handleAddToCart(product)}
                          className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-xs'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>{locale === 'ua' ? 'Додано' : 'Added'}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="h-3.5 w-3.5" />
                              <span>{locale === 'ua' ? 'В кошик' : 'Add to cart'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>

                {/* Common Attributes */}
                <div
                  className="grid gap-4 py-3 border-b border-slate-100 items-center text-xs"
                  style={{ gridTemplateColumns: `160px repeat(${products.length}, minmax(180px, 1fr))` }}
                >
                  <span className="font-bold text-slate-700">{locale === 'ua' ? 'Категорія' : 'Category'}</span>
                  {products.map((p) => (
                    <span key={p.id} className="text-slate-600 font-medium">
                      {p.category}
                    </span>
                  ))}
                </div>

                <div
                  className="grid gap-4 py-3 border-b border-slate-100 items-center text-xs"
                  style={{ gridTemplateColumns: `160px repeat(${products.length}, minmax(180px, 1fr))` }}
                >
                  <span className="font-bold text-slate-700">{locale === 'ua' ? 'Наявність' : 'Availability'}</span>
                  {products.map((p) => (
                    <div key={p.id}>
                      {p.stockQuantity > 0 ? (
                        <span className="inline-flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                          {locale === 'ua' ? `В наявності (${p.stockQuantity} шт.)` : `In stock (${p.stockQuantity})`}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-bold text-[11px]">
                          {locale === 'ua' ? 'Немає на складі' : 'Out of stock'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Detailed Dynamic Specifications Rows */}
                {Array.from(allSpecKeysMap.entries()).map(([key, label]) => (
                  <div
                    key={key}
                    className="grid gap-4 py-3.5 border-b border-slate-100 items-center text-xs hover:bg-slate-50/50 transition-colors"
                    style={{ gridTemplateColumns: `160px repeat(${products.length}, minmax(180px, 1fr))` }}
                  >
                    <span className="font-bold text-slate-800">{label}</span>
                    {products.map((p) => {
                      const specs = getProductSpecs(p, locale)
                      const matched = specs.find((s) => s.key === key)
                      return (
                        <div key={p.id} className="text-slate-600 text-xs font-medium leading-relaxed">
                          {matched ? matched.value : '—'}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
