'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, Wallet, CalendarDays, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const leftTabs = [
  { href: '/app/home',     icon: Home,     label: 'Beranda' },
  { href: '/app/partner',   icon: Heart,    label: 'Pasangan' },
]

const rightTabs = [
  { href: '/app/calendar', icon: CalendarDays, label: 'Kalender' },
  { href: '/app/profile',  icon: User,         label: 'Profil' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 border-t border-border bg-surface">
      <div className="flex items-center justify-around px-2 pb-safe pt-1">
        {/* Left tabs */}
        {leftTabs.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-0.5 py-2"
            >
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-xl transition-colors',
                active ? 'bg-rose-50' : ''
              )}>
                <Icon
                  className={cn('h-5 w-5 transition-colors', active ? 'text-rose' : 'text-ink-muted')}
                  strokeWidth={active ? 2.5 : 1.5}
                />
              </div>
              <span className={cn(
                'text-[10px] font-medium leading-none',
                active ? 'text-rose' : 'text-ink-muted'
              )}>
                {label}
              </span>
            </Link>
          )
        })}

        {/* Center floating button — Finance */}
        <div className="flex flex-1 flex-col items-center -mt-5">
          <Link
            href="/app/finance"
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full shadow-elevated transition-all active:scale-95',
              pathname.startsWith('/app/finance')
                ? 'bg-rose-dark'
                : 'bg-rose'
            )}
          >
            <Wallet className="h-6 w-6 text-white" strokeWidth={2} />
          </Link>
          <span className={cn(
            'mt-1 text-[10px] font-medium leading-none',
            pathname.startsWith('/app/finance') ? 'text-rose' : 'text-ink-muted'
          )}>
            Keuangan
          </span>
        </div>

        {/* Right tabs */}
        {rightTabs.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-0.5 py-2"
            >
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-xl transition-colors',
                active ? 'bg-rose-50' : ''
              )}>
                <Icon
                  className={cn('h-5 w-5 transition-colors', active ? 'text-rose' : 'text-ink-muted')}
                  strokeWidth={active ? 2.5 : 1.5}
                />
              </div>
              <span className={cn(
                'text-[10px] font-medium leading-none',
                active ? 'text-rose' : 'text-ink-muted'
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
