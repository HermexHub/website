export interface Product {
  id: string
  name: string
  sku: string
  price: number
  oldPrice?: number
  stockQuantity: number
  maxOrderQuantity?: number
  description?: string
  descriptionJson?: string
  category?: string
  imageUrl?: string
  images?: string[]
  brand?: string
  model?: string
  color?: string
  colorHex?: string
  specs?: Record<string, string>
  specsJson?: string
  rating?: number
  reviewsCount?: number
  warrantyMonths?: number
  weightGrams?: number
  badge?: string
  createdAt?: string
  updatedAt?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface GetProductsResponse {
  items: Product[]
  meta: PaginationMeta
}

export interface CartItemInput {
  productId: string
  quantity: number
  expectedPrice?: number
}

export type CartStockStatus =
  | 'IN_STOCK'
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  | 'PARTIALLY_AVAILABLE'

export interface CartItemValidationResult {
  productId: string
  name: string
  sku: string
  currentPrice: number
  expectedPrice?: number
  priceChanged: boolean
  requestedQuantity: number
  availableQuantity: number
  effectiveQuantity: number
  stockStatus: CartStockStatus | string
  itemTotal: number
  hasIssue: boolean
  issueReason?: string
}

export interface ValidateCartResponse {
  isValid: boolean
  canProceed: boolean
  items: CartItemValidationResult[]
  subtotal: number
  currency: string
}

export interface CreateOrderRequest {
  items: {
    productId: string
    quantity: number
    price?: number
  }[]
  deliveryAddress?: string
}

export interface CreateOrderResponse {
  orderId: string
  status: string
  totalAmount: number
  currency: string
  createdAt: string
}

export interface OrderDetails {
  orderId: string
  userId: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | string
  totalAmount: number
  currency: string
  items: {
    productId: string
    quantity: number
    price: number
  }[]
  deliveryAddress?: string
  createdAt: string
  updatedAt: string
}
