'use client'

import Link from 'next/link'
import { Gamepad2, Wallet, CalendarDays, User } from 'lucide-react'

const TILES = [
  {
    href: '/app/games',
    icon: Gamepad2,
    label: 'Games',
    desc: 'Main bareng pasangan',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    hoverBorder: 'hover:border-purple-300',
  },
  {
    href: '/app/finance',
    icon: Wallet,
    label: 'Keuangan',
    desc: 'Tabungan & wishlist',
    iconBg: 'bg-rose/10',
    iconColor: 'text-rose',
    hoverBorder: 'hover:border-rose',
  },
  {
    href: '/app/calendar',
    icon: CalendarDays,
    label: 'Kalender',
    desc: 'Tanggal penting',
    iconBg: 'bg-gold/15',
    iconColor: 'text-yellow-700',
    hoverBorder: 'hover:border-gold',
  },
  {
    href: '/app/about-me',
    icon: User,
    label: 'About Me',
    desc: 'MBTI, Love Language, dll',
    iconBg: 'bg-sage/15',
    iconColor: 'text-sage-dark',
    hoverBorder: 'hover:border-sage',
  },
]

export default function QuickAccessGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 px-6">
      {TILES.map(tile => {
        const Icon = tile.icon
        return (
          <Link
            key={tile.href}
            href={tile.href}
            className={`group flex flex-col justify-between rounded-2xl border border-border bg-white p-4 shadow-card transition-all ${tile.hoverBorder} hover:shadow-md active:scale-[0.98]`}
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${tile.iconBg}`}>
              <Icon className={`h-5 w-5 ${tile.iconColor}`} strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">{tile.label}</p>
              <p className="text-[11px] text-ink-muted">{tile.desc}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
