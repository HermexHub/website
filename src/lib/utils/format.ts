/**
 * Price & currency formatting utilities for Hermex Storefront (UAH / грн)
 */

export function formatPrice(amount: number | string | null | undefined): string {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : Number(amount)
  if (isNaN(numeric)) {
    return '0 грн'
  }
  const rounded = Math.round(numeric)
  // Format with space as thousand separator (standard Ukrainian retail style: 54 999 грн)
  return `${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} грн`
}

export function formatInstallment(amount: number | string | null | undefined, months = 12): string {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : Number(amount)
  if (isNaN(numeric) || numeric <= 0) {
    return 'від 0 грн/міс'
  }
  const monthly = Math.round(numeric / months)
  return `від ${monthly.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} грн/міс`
}

export function formatNumber(num: number | string): string {
  const numeric = typeof num === 'string' ? parseFloat(num) : Number(num)
  if (isNaN(numeric)) return '0'
  return numeric.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function formatUserName(name?: string | null, email?: string | null): string {
  if (!name || name.includes('?') || /^[\?\s\._-]+$/.test(name.trim())) {
    if (email && email.includes('@')) {
      const prefix = email.split('@')[0].replace(/[\._-]/g, ' ')
      return prefix.charAt(0).toUpperCase() + prefix.slice(1)
    }
    return 'Користувач'
  }
  return name.trim()
}
