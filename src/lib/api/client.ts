import {
  CreateOrderRequest,
  CreateOrderResponse,
  GetProductsResponse,
  OrderDetails,
  Product,
  ValidateCartResponse
} from './types'
import { refreshTokenApi } from './auth'

export * from './types'
export * from './auth'

const API_BASE = '/api/v1'

let currentAccessToken: string | null = null
let onTokenUpdateListener: ((token: string | null) => void) | null = null

export function getAccessToken(): string | null {
  return currentAccessToken
}

export function setAccessToken(token: string | null): void {
  currentAccessToken = token
  if (onTokenUpdateListener) {
    onTokenUpdateListener(token)
  }
}

export function setOnTokenUpdateListener(listener: (token: string | null) => void): void {
  onTokenUpdateListener = listener
}

function generateCorrelationId(): string {
  return 'web-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now()
}

let refreshPromise: Promise<string | null> | null = null

async function silentRefresh(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    try {
      const auth = await refreshTokenApi()
      setAccessToken(auth.accessToken)
      return auth.accessToken
    } catch {
      setAccessToken(null)
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (!headers.has('x-correlation-id')) {
    headers.set('x-correlation-id', generateCorrelationId())
  }
  if (!headers.has('Authorization') && currentAccessToken) {
    headers.set('Authorization', `Bearer ${currentAccessToken}`)
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers
  })

  // Handle 401 Unauthorized with automatic token refresh
  if (
    response.status === 401 &&
    !isRetry &&
    !endpoint.startsWith('/auth/login') &&
    !endpoint.startsWith('/auth/register') &&
    !endpoint.startsWith('/auth/refresh')
  ) {
    const newToken = await silentRefresh()
    if (newToken) {
      const retryHeaders = new Headers(options.headers || {})
      if (!retryHeaders.has('Content-Type') && options.body) {
        retryHeaders.set('Content-Type', 'application/json')
      }
      retryHeaders.set('Authorization', `Bearer ${newToken}`)
      retryHeaders.set('x-correlation-id', generateCorrelationId())

      return request<T>(
        endpoint,
        {
          ...options,
          headers: retryHeaders
        },
        true
      )
    }
  }

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

export async function fetchOrderDetails(orderId: string, token?: string | null): Promise<OrderDetails> {
  const headers: Record<string, string> = {}
  const t = token || currentAccessToken
  if (t) {
    headers['Authorization'] = `Bearer ${t}`
  }
  return request<OrderDetails>(`/orders/${orderId}`, { headers })
}

export function getOrderSseUrl(orderId: string, token?: string | null): string {
  const t = token || currentAccessToken
  if (t) {
    return `${API_BASE}/orders/${orderId}/live?token=${encodeURIComponent(t)}`
  }
  return `${API_BASE}/orders/${orderId}/live`
}
