import type { Metadata, Viewport } from 'next'
import './globals.css'
import PWARegister from '@/components/PWARegister'

export const metadata: Metadata = {
  title: 'Couple App - Kesiapan Assessment',
  description: 'Cek kesiapan hubungan kamu dan pasangan. Assessment komprehensif untuk pasangan Indonesia.',
  keywords: ['couple', 'relationship', 'assessment', 'indonesia', 'kesiapan'],
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
      <body className="min-h-screen bg-cream antialiased">
        <main className="mx-auto max-w-lg">
          {children}
        </main>
        <PWARegister />
      </body>
    </html>
  )
}
