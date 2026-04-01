'use client'

import Link from 'next/link'
import { Wallet, CalendarDays, ArrowRight, X } from 'lucide-react'
import { useState } from 'react'

interface GuideAction {
  icon: typeof Wallet
  title: string
  desc: string
  href: string
  color: string
  done: boolean
}

interface WelcomeGuideProps {
  userName: string | null
  hasSavingsGoal: boolean
  hasEvents: boolean
}

export default function WelcomeGuide({
  userName,
  hasSavingsGoal,
  hasEvents,
}: WelcomeGuideProps) {
  const [dismissed, setDismissed] = useState(false)

  const allDone = hasSavingsGoal && hasEvents
  if (allDone || dismissed) return null

  const actions: GuideAction[] = [
    {
      icon: Wallet,
      title: 'Buat target tabungan',
      desc: 'Mulai perencanaan keuangan',
      href: '/app/finance',
      color: 'bg-gold/20 text-yellow-700',
      done: hasSavingsGoal,
    },
    {
      icon: CalendarDays,
      title: 'Tambah tanggal penting',
      desc: 'Anniversary, ulang tahun',
      href: '/app/calendar',
      color: 'bg-sage/20 text-sage-dark',
      done: hasEvents,
    },
  ]

  const completedCount = actions.filter(a => a.done).length

  return (
    <div className="mx-6 rounded-2xl border border-rose/20 bg-gradient-to-b from-rose-50 to-white p-5 shadow-card">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-ink">
            Hai {userName ?? 'kamu'}! Mulai dari sini
          </h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            {completedCount}/{actions.length} langkah selesai
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="rounded-lg p-1 text-ink-muted/40 hover:text-ink-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-rose transition-all duration-500"
          style={{ width: `${(completedCount / actions.length) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {actions.map(action => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              href={action.href}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                action.done
                  ? 'border-sage/30 bg-sage/5 opacity-60'
                  : 'border-border bg-white hover:border-rose'
              }`}
            >
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${action.color}`}>
                <Icon className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${action.done ? 'line-through text-ink-muted' : 'text-ink'}`}>
                  {action.title}
                </p>
                <p className="text-xs text-ink-muted">{action.desc}</p>
              </div>
              {!action.done && <ArrowRight className="h-4 w-4 text-ink-muted" />}
              {action.done && (
                <span className="rounded-full bg-sage/20 px-2 py-0.5 text-[10px] font-bold text-sage-dark">
                  Done
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
