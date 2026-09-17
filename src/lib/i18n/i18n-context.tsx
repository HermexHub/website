'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { enDictionary } from './locales/en'
import { uaDictionary } from './locales/ua'
import { Locale, TranslationDictionary } from './types'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationDictionary
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const dictionaries: Record<Locale, TranslationDictionary> = {
  en: enDictionary,
  ua: uaDictionary
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem('hermex_locale') as Locale | null
      if (savedLocale === 'en' || savedLocale === 'ua') {
        setLocaleState(savedLocale)
      }
    } catch {
      // Ignore localStorage read errors
    }
    setMounted(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem('hermex_locale', newLocale)
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    } catch {
      // Ignore storage write errors
    }
  }

  const value: I18nContextType = {
    locale: mounted ? locale : 'en',
    setLocale,
    t: dictionaries[mounted ? locale : 'en']
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation(): I18nContextType {
  const context = useContext(I18nContext)
  if (!context) {
    return {
      locale: 'en',
      setLocale: () => {},
      t: enDictionary
    }
  }
  return context
}
