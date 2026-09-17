import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { validateCartApi } from '../api/client'
import { Product, ValidateCartResponse } from '../api/types'

export interface CartStoreItem {
  productId: string
  name: string
  sku: string
  price: number
  stockQuantity: number
  imageUrl?: string
  quantity: number
  category?: string
}

interface CartState {
  items: CartStoreItem[]
  isOpen: boolean
  isValidating: boolean
  validationReport: ValidateCartResponse | null

  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setOpen: (open: boolean) => void
  validateCurrentCart: () => Promise<ValidateCartResponse | null>
  applyAdjustments: () => void

  // Computed helpers
  getTotalCount: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isValidating: false,
      validationReport: null,

      addItem: (product, quantity = 1) => {
        const currentItems = get().items
        const existingIndex = currentItems.findIndex(
          (i) => i.productId === product.id
        )

        let updatedItems: CartStoreItem[]

        if (existingIndex > -1) {
          const existing = currentItems[existingIndex]
          const newQty = Math.min(
            existing.quantity + quantity,
            product.stockQuantity
          )
          updatedItems = [...currentItems]
          updatedItems[existingIndex] = {
            ...existing,
            quantity: newQty,
            price: product.price,
            stockQuantity: product.stockQuantity
          }
        } else {
          const newQty = Math.min(quantity, product.stockQuantity)
          if (newQty <= 0) return
          updatedItems = [
            ...currentItems,
            {
              productId: product.id,
              name: product.name,
              sku: product.sku,
              price: product.price,
              stockQuantity: product.stockQuantity,
              imageUrl: product.imageUrl,
              quantity: newQty,
              category: product.category
            }
          ]
        }

        set({ items: updatedItems, isOpen: true, validationReport: null })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
          validationReport: null
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId === productId) {
              const safeQty = Math.min(quantity, item.stockQuantity)
              return { ...item, quantity: safeQty }
            }
            return item
          }),
          validationReport: null
        }))
      },

      clearCart: () => {
        set({ items: [], validationReport: null })
      },

      setOpen: (open) => {
        set({ isOpen: open })
        if (open && get().items.length > 0) {
          get().validateCurrentCart()
        }
      },

      validateCurrentCart: async () => {
        const { items } = get()
        if (items.length === 0) {
          set({ validationReport: null })
          return null
        }

        set({ isValidating: true })
        try {
          const report = await validateCartApi(
            items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              expectedPrice: item.price
            }))
          )
          set({ validationReport: report })
          return report
        } catch (error) {
          console.warn('Cart validation network warning:', error)
          return null
        } finally {
          set({ isValidating: false })
        }
      },

      applyAdjustments: () => {
        const { validationReport, items } = get()
        if (!validationReport) return

        const validatedMap = new Map(
          validationReport.items.map((res) => [res.productId, res])
        )

        const adjustedItems: CartStoreItem[] = []

        for (const item of items) {
          const validated = validatedMap.get(item.productId)
          if (!validated) continue

          // If out of stock, skip (remove)
          if (validated.stockStatus === 'OUT_OF_STOCK' || validated.availableQuantity <= 0) {
            continue
          }

          adjustedItems.push({
            ...item,
            price: validated.currentPrice,
            stockQuantity: validated.availableQuantity,
            quantity: validated.effectiveQuantity
          })
        }

        set({ items: adjustedItems, validationReport: null })
      },

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
    }),
    {
      name: 'hermex_cart_v1',
      partialize: (state) => ({ items: state.items })
    }
  )
)
