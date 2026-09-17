export interface UserResponse {
  id: string
  email: string
  fullName?: string
  role: string
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  user: UserResponse
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  fullName?: string
}

const API_BASE = '/api/v1'

function generateCorrelationId(): string {
  return 'web-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now()
}

async function authFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (!headers.has('x-correlation-id')) {
    headers.set('x-correlation-id', generateCorrelationId())
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
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

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  return authFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export async function registerUser(credentials: RegisterCredentials): Promise<AuthResponse> {
  return authFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export async function refreshTokenApi(): Promise<AuthResponse> {
  return authFetch<AuthResponse>('/auth/refresh', {
    method: 'POST'
  })
}

export async function logoutUser(accessToken?: string | null): Promise<{ message: string }> {
  const headers: Record<string, string> = {}
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }
  return authFetch<{ message: string }>('/auth/logout', {
    method: 'POST',
    headers
  })
}
