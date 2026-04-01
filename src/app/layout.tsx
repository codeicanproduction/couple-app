import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import PWARegister from '@/components/PWARegister'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'CoupleApp',
  description: 'Aplikasi untuk pasangan Indonesia. Tabungan bersama, kalender, surat rahasia, dan obrolan seru.',
  keywords: ['couple', 'relationship', 'indonesia', 'pasangan', 'tabungan'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FFF8F0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${dmSans.className} min-h-screen bg-cream antialiased`}>
        <main className="mx-auto max-w-lg">
          {children}
        </main>
        <PWARegister />
      </body>
    </html>
  )
}
