'use client'

import { toMonthKey } from '@/lib/dates'

interface SavingsEntry {
  month: string
  amount: number
}

interface SavingsGridProps {
  entries: SavingsEntry[]
}

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export default function SavingsGrid({ entries }: SavingsGridProps) {
  const now = new Date()

  // Build 12 months back from current month
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
    return {
      key: toMonthKey(d),
      label: MONTHS_ID[d.getMonth()],
      year: d.getFullYear(),
    }
  })

  const entryMap = new Map(entries.map(e => [e.month, e.amount]))

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        Riwayat 12 Bulan
      </p>
      <div className="grid grid-cols-6 gap-2">
        {months.map(({ key, label }) => {
          const amount = entryMap.get(key) ?? 0
          const hasSaved = amount > 0
          return (
            <div key={key} className="flex flex-col items-center gap-1">
              <div
                className={`h-10 w-full rounded-xl transition-colors ${
                  hasSaved
                    ? 'bg-rose'
                    : 'bg-border'
                }`}
                title={hasSaved ? `Rp ${amount.toLocaleString('id-ID')}` : 'Belum menabung'}
              />
              <span className="text-[10px] text-ink-muted">{label}</span>
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        {entries.length} dari 12 bulan sudah menabung
      </p>
    </div>
  )
}
