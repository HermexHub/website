'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Check } from 'lucide-react'
import { useUserStore } from '@/lib/store/use-user-store'
import { useCartStore } from '@/lib/store/use-cart-store'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { fetchProductById } from '@/lib/api/client'
import { Product } from '@/lib/api/types'
import { formatPrice } from '@/lib/utils/format'

export function WishlistModal() {
  const { locale } = useTranslation()
  const { isWishlistOpen, setWishlistOpen, wishlistProductIds, toggleWishlist, clearWishlist } = useUserStore()
  const { addItem, setOpen: setCartOpen } = useCartStore()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!isWishlistOpen || wishlistProductIds.length === 0) {
      setProducts([])
      return
    }

    let active = true
    setLoading(true)

    Promise.all(
      wishlistProductIds.map(async (id) => {
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
  }, [isWishlistOpen, wishlistProductIds])

  if (!isWishlistOpen) return null

  const handleAddToCart = (p: Product) => {
    addItem(p, 1)
    setAddedMap((prev) => ({ ...prev, [p.id]: true }))
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [p.id]: false }))
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setWishlistOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <Heart className="h-5 w-5 fill-rose-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {locale === 'ua' ? 'Список бажаного' : 'Wishlist'}
              </h2>
              <p className="text-xs text-slate-500">
                {locale === 'ua'
                  ? `Збережено товарів: ${wishlistProductIds.length}`
                  : `${wishlistProductIds.length} items saved`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {wishlistProductIds.length > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors px-2 py-1 cursor-pointer"
              >
                {locale === 'ua' ? 'Очистити все' : 'Clear all'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setWishlistOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-100 animate-pulse">
                  <div className="h-20 w-20 rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                    <div className="h-5 bg-slate-100 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-400 mb-4 text-2xl">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {locale === 'ua' ? 'Ваш список бажаного порожній' : 'Your wishlist is empty'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-6">
                {locale === 'ua'
                  ? 'Додавайте товари, які вам сподобалися, натиснувши на іконку серця в картці товару.'
                  : 'Save items you love by clicking the heart icon on any product card.'}
              </p>
              <button
                type="button"
                onClick={() => setWishlistOpen(false)}
                className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                {locale === 'ua' ? 'Перейти до каталогу' : 'Explore Catalog'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => {
                const isOutOfStock = product.stockQuantity <= 0
                const isAdded = addedMap[product.id]

                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-200 transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="72px"
                            className="object-contain p-1.5"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-300">
                            📦
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <Link
                          href={`/products/${product.id}`}
                          onClick={() => setWishlistOpen(false)}
                          className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          SKU: {product.sku}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-extrabold text-blue-600">
                            {formatPrice(product.price)}
                          </span>
                          {isOutOfStock ? (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                              {locale === 'ua' ? 'Немає' : 'Out of stock'}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {locale === 'ua' ? 'В наявності' : 'In stock'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => handleAddToCart(product)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer shrink-0"
                        title={locale === 'ua' ? 'Видалити зі списку' : 'Remove from wishlist'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {products.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {locale === 'ua' ? 'Товари зберігаються у вашому браузері' : 'Items are saved in your browser'}
            </span>
            <button
              type="button"
              onClick={() => {
                setWishlistOpen(false)
                setCartOpen(true)
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <span>{locale === 'ua' ? 'Перейти до кошика' : 'View Cart'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
