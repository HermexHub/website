'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  loginUser,
  registerUser,
  refreshTokenApi,
  logoutUser,
  LoginCredentials,
  RegisterCredentials,
  UserResponse
} from '@/lib/api/auth'
import { setAccessToken, setOnTokenUpdateListener } from '@/lib/api/client'
import { formatUserName } from '@/lib/utils/format'

function cleanUser(user: UserResponse | null): UserResponse | null {
  if (!user) return null
  return {
    ...user,
    fullName: formatUserName(user.fullName, user.email)
  }
}

interface UserStore {
  // Auth state
  user: UserResponse | null
  accessToken: string | null
  isLoading: boolean
  authError: string | null
  isAuthModalOpen: boolean

  setAuthModalOpen: (open: boolean) => void
  setAuthError: (err: string | null) => void

  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (credentials: RegisterCredentials) => Promise<boolean>
  quickLogin: () => Promise<boolean>
  logout: () => Promise<void>
  restoreSession: () => Promise<boolean>

  // Wishlist state
  isWishlistOpen: boolean
  wishlistProductIds: string[]
  setWishlistOpen: (open: boolean) => void
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  getWishlistCount: () => number
  clearWishlist: () => void

  // Compare state
  isCompareOpen: boolean
  compareProductIds: string[]
  setCompareOpen: (open: boolean) => void
  toggleCompare: (productId: string) => void
  isInCompare: (productId: string) => boolean
  getCompareCount: () => number
  clearCompare: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => {
      // Sync client token setter if token changes externally
      setOnTokenUpdateListener((token) => {
        if (token !== get().accessToken) {
          set({ accessToken: token })
        }
      })

      return {
        user: null,
        accessToken: null,
        isLoading: false,
        authError: null,
        isAuthModalOpen: false,

        setAuthModalOpen: (open) => set({ isAuthModalOpen: open, authError: null }),
        setAuthError: (err) => set({ authError: err }),

        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, authError: null })
          try {
            const res = await loginUser(credentials)
            setAccessToken(res.accessToken)
            set({
              user: cleanUser(res.user),
              accessToken: res.accessToken,
              isLoading: false,
              isAuthModalOpen: false
            })
            return true
          } catch (err) {
            const msg = (err as Error).message || 'Invalid email or password'
            set({ authError: msg, isLoading: false })
            return false
          }
        },

        register: async (credentials: RegisterCredentials) => {
          set({ isLoading: true, authError: null })
          try {
            const res = await registerUser(credentials)
            setAccessToken(res.accessToken)
            set({
              user: cleanUser(res.user),
              accessToken: res.accessToken,
              isLoading: false,
              isAuthModalOpen: false
            })
            return true
          } catch (err) {
            const msg = (err as Error).message || 'Failed to register account'
            set({ authError: msg, isLoading: false })
            return false
          }
        },

        quickLogin: async () => {
          set({ isLoading: true, authError: null })
          try {
            // First attempt to login with known demo credentials
            const res = await loginUser({
              email: 'test@gmail.com',
              password: '123456'
            })
            setAccessToken(res.accessToken)
            set({
              user: cleanUser(res.user),
              accessToken: res.accessToken,
              isLoading: false,
              isAuthModalOpen: false
            })
            return true
          } catch {
            // If user doesn't exist, auto-register then login
            try {
              const regRes = await registerUser({
                email: 'test@gmail.com',
                password: '123456',
                fullName: 'Тестовий Користувач'
              })
              setAccessToken(regRes.accessToken)
              set({
                user: cleanUser(regRes.user),
                accessToken: regRes.accessToken,
                isLoading: false,
                isAuthModalOpen: false
              })
              return true
            } catch (err) {
              const msg = (err as Error).message || 'Quick login failed'
              set({ authError: msg, isLoading: false })
              return false
            }
          }
        },

        logout: async () => {
          const token = get().accessToken
          set({ isLoading: true })
          try {
            await logoutUser(token)
          } catch (err) {
            console.warn('Logout API error:', err)
          } finally {
            setAccessToken(null)
            set({
              user: null,
              accessToken: null,
              isLoading: false
            })
          }
        },

        restoreSession: async () => {
          // If we already have a valid token, sync it to client
          const existingToken = get().accessToken
          if (existingToken) {
            setAccessToken(existingToken)
          }

          try {
            // Silent refresh using HttpOnly cookie
            const res = await refreshTokenApi()
            setAccessToken(res.accessToken)
            set({
              user: cleanUser(res.user),
              accessToken: res.accessToken
            })
            return true
          } catch {
            // Session expired or cookie missing
            if (get().accessToken) {
              setAccessToken(null)
              set({ user: null, accessToken: null })
            }
            return false
          }
        },

        isWishlistOpen: false,
        wishlistProductIds: [],

        setWishlistOpen: (open: boolean) => {
          set({ isWishlistOpen: open })
        },

        toggleWishlist: (productId: string) => {
          const current = get().wishlistProductIds
          if (current.includes(productId)) {
            set({ wishlistProductIds: current.filter((id) => id !== productId) })
          } else {
            set({ wishlistProductIds: [...current, productId] })
          }
        },

        isInWishlist: (productId: string) => {
          return get().wishlistProductIds.includes(productId)
        },

        getWishlistCount: () => {
          return get().wishlistProductIds.length
        },

        clearWishlist: () => {
          set({ wishlistProductIds: [] })
        },

        isCompareOpen: false,
        compareProductIds: [],

        setCompareOpen: (open: boolean) => {
          set({ isCompareOpen: open })
        },

        toggleCompare: (productId: string) => {
          const current = get().compareProductIds
          if (current.includes(productId)) {
            set({ compareProductIds: current.filter((id) => id !== productId) })
          } else {
            // Cap compare at 4 items
            if (current.length >= 4) {
              return
            }
            set({ compareProductIds: [...current, productId] })
          }
        },

        isInCompare: (productId: string) => {
          return get().compareProductIds.includes(productId)
        },

        getCompareCount: () => {
          return get().compareProductIds.length
        },

        clearCompare: () => {
          set({ compareProductIds: [] })
        }
      }
    },
    {
      name: 'hermex_user_store',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        wishlistProductIds: state.wishlistProductIds,
        compareProductIds: state.compareProductIds
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAccessToken(state.accessToken)
        }
      }
    }
  )
)
