import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Couple App - Kesiapan Assessment',
  description: 'Cek kesiapan hubungan kamu dan pasangan. Assessment komprehensif untuk pasangan Indonesia.',
  keywords: ['couple', 'relationship', 'assessment', 'indonesia', 'kesiapan'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#f43f5e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white antialiased">
        <main className="mx-auto max-w-lg">
          {children}
        </main>
      </body>
    </html>
  )
}
