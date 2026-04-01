'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageCircleHeart, Users, BarChart3, ChevronRight, Heart } from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/deep-talk', label: 'Deep Talk', icon: MessageCircleHeart, exact: false },
  { href: '/admin/users', label: 'Pengguna', icon: Users, exact: false },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <aside className="hidden w-56 flex-shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-100 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose">
          <Heart className="h-4 w-4 text-white" fill="currentColor" />
        </div>
        <div>
          <p className="text-sm font-bold text-ink">Couple App</p>
          <p className="text-[10px] text-ink-muted">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3">
        {NAV.map(item => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-rose/10 text-rose'
                  : 'text-ink-muted hover:bg-gray-50 hover:text-ink'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {item.label}
              {active && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <Link href="/app/home" className="text-xs text-ink-muted hover:text-ink transition-colors">
          ← Kembali ke App
        </Link>
      </div>
    </aside>
  )
}
