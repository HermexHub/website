import {
  CreateOrderRequest,
  CreateOrderResponse,
  GetProductsResponse,
  OrderDetails,
  Product,
  ValidateCartResponse
} from './types'

const API_BASE = '/api/v1'

function generateCorrelationId(): string {
  return 'web-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now()
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (!headers.has('x-correlation-id')) {
    headers.set('x-correlation-id', generateCorrelationId())
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`
    try {
      const errJson = await response.json()
      if (errJson.message) {
        errorMsg = Array.isArray(errJson.message) ? errJson.message.join(', ') : errJson.message
      }
    } catch {
      // Use fallback errorMsg
    }
    throw new Error(errorMsg)
  }

  return response.json() as Promise<T>
}

export async function fetchProducts(params: {
  page?: number
  limit?: number
  inStockOnly?: boolean
  search?: string
  sortBy?: string
  sortOrder?: string
} = {}): Promise<GetProductsResponse> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.inStockOnly !== undefined) query.set('inStockOnly', String(params.inStockOnly))
  if (params.search) query.set('search', params.search)
  if (params.sortBy) query.set('sortBy', params.sortBy)
  if (params.sortOrder) query.set('sortOrder', params.sortOrder)

  const qs = query.toString() ? `?${query.toString()}` : ''
  return request<GetProductsResponse>(`/products${qs}`)
}

export async function fetchProductById(id: string): Promise<{ product: Product }> {
  return request<{ product: Product }>(`/products/${id}`)
}

export async function validateCartApi(
  items: { productId: string; quantity: number; expectedPrice?: number }[]
): Promise<ValidateCartResponse> {
  return request<ValidateCartResponse>('/cart/validate', {
    method: 'POST',
    body: JSON.stringify({ items })
  })
}

export async function createOrderApi(
  data: CreateOrderRequest
): Promise<CreateOrderResponse> {
  const idempotencyKey = 'order-idem-' + Math.random().toString(36).substring(2, 15)
  return request<CreateOrderResponse>('/orders', {
    method: 'POST',
    headers: {
      'X-Idempotency-Key': idempotencyKey
    },
    body: JSON.stringify(data)
  })
}

export async function fetchOrderDetails(orderId: string): Promise<OrderDetails> {
  return request<OrderDetails>(`/orders/${orderId}`)
}


export function getOrderSseUrl(orderId: string): string {
  return `${API_BASE}/orders/${orderId}/live`
}
