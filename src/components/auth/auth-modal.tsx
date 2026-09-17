'use client'

import React, { useState } from 'react'
import { X, Lock, Mail, User as UserIcon, ArrowRight, Zap, AlertCircle, Loader2 } from 'lucide-react'
import { useUserStore } from '@/lib/store/use-user-store'
import { useTranslation } from '@/lib/i18n/i18n-context'

export function AuthModal() {
  const { locale } = useTranslation()
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    login,
    register,
    isLoading,
    authError,
    setAuthError
  } = useUserStore()

  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  if (!isAuthModalOpen) return null

  const handleTabSwitch = (newTab: 'signin' | 'signup') => {
    setTab(newTab)
    setAuthError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    if (tab === 'signin') {
      await login({ email: email.trim(), password })
    } else {
      await register({
        email: email.trim(),
        password,
        fullName: name.trim() || undefined
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => !isLoading && setAuthModalOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm font-bold">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Helmex</span>
          </div>

          <h3 className="text-lg font-bold">
            {tab === 'signin'
              ? (locale === 'ua' ? 'Вхід до особистого кабінету' : 'Sign in to your account')
              : (locale === 'ua' ? 'Створення облікового запису' : 'Create a new account')}
          </h3>
          <p className="text-xs text-blue-100 mt-0.5">
            {locale === 'ua'
              ? 'Відстежуйте замовлення, накопичуйте знижки та керуйте гарантією'
              : 'Track orders, manage warranty and enjoy personalized perks'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleTabSwitch('signin')}
            className={`flex-1 py-3 text-xs font-bold transition-all cursor-pointer ${
              tab === 'signin'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {locale === 'ua' ? 'Вхід' : 'Sign In'}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleTabSwitch('signup')}
            className={`flex-1 py-3 text-xs font-bold transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {locale === 'ua' ? 'Реєстрація' : 'Register'}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {authError && (
            <div className="flex items-center gap-2 p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {locale === 'ua' ? 'Ваше імʼя' : 'Full Name'}
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={locale === 'ua' ? 'Введіть ваше імʼя' : 'Enter your name'}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {locale === 'ua' ? 'Електронна пошта' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {locale === 'ua' ? 'Пароль' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>
                  {tab === 'signin'
                    ? (locale === 'ua' ? 'Увійти' : 'Sign In')
                    : (locale === 'ua' ? 'Створити профіль' : 'Create Account')}
                </span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
