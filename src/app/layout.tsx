import type { Metadata } from 'next'
import { I18nProvider } from '@/lib/i18n/i18n-context'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartDrawer } from '@/components/cart/cart-drawer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hermex • Premium Electronics & Tech Store',
  description:
    'Discover flagship tech gadgets, laptops, audio gear and accessories with express delivery and official warranty.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <I18nProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  )
}
