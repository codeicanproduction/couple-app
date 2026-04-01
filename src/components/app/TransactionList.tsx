'use client'

import { ArrowDownLeft, ArrowUpRight, Heart, ShoppingBag, Utensils, Gift, HelpCircle } from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  type: string
  category: string | null
  note: string | null
  created_by: string
  created_at: string | null
}

interface TransactionListProps {
  transactions: Transaction[]
  userId: string
  partnerName: string | null
  userName: string | null
}

const CATEGORY_META: Record<string, { icon: typeof Heart; label: string; color: string }> = {
  tabungan: { icon: ArrowDownLeft, label: 'Tabungan', color: 'bg-sage/10 text-sage-dark' },
  date_night: { icon: Utensils, label: 'Date Night', color: 'bg-purple-50 text-purple-600' },
  anniversary: { icon: Heart, label: 'Anniversary', color: 'bg-rose/10 text-rose' },
  belanja: { icon: ShoppingBag, label: 'Belanja', color: 'bg-gold/20 text-yellow-700' },
  persiapan_nikah: { icon: Gift, label: 'Persiapan Nikah', color: 'bg-blue-50 text-blue-600' },
  lainnya: { icon: HelpCircle, label: 'Lainnya', color: 'bg-ink/5 text-ink-muted' },
}

function fmtRp(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `Rp${(abs / 1_000_000).toFixed(1)}jt`
  if (abs >= 1_000) return `Rp${(abs / 1_000).toFixed(0)}rb`
  return `Rp${abs.toLocaleString('id-ID')}`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)

  if (diffDays === 0) return 'Hari ini'
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) return `${diffDays} hari lalu`

  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

export default function TransactionList({ transactions, userId, partnerName, userName }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-ink-muted">Belum ada transaksi</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {transactions.map(tx => {
        const isDeposit = tx.type === 'deposit'
        const meta = CATEGORY_META[tx.category ?? 'lainnya'] ?? CATEGORY_META.lainnya
        const Icon = isDeposit ? ArrowDownLeft : meta.icon
        const iconColor = isDeposit ? 'bg-sage/10 text-sage-dark' : meta.color
        const isMe = tx.created_by === userId
        const whoLabel = isMe ? (userName ?? 'Kamu') : (partnerName ?? 'Pasangan')

        return (
          <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-ink truncate">
                  {tx.note ?? (isDeposit ? 'Tabungan' : meta.label)}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isMe ? 'bg-rose/10 text-rose' : 'bg-sage/10 text-sage-dark'
                }`}>
                  {whoLabel}
                </span>
                <span className="text-[10px] text-ink-muted">{formatDate(tx.created_at ?? '')}</span>
              </div>
            </div>
            <span className={`text-sm font-bold ${isDeposit ? 'text-sage-dark' : 'text-rose'}`}>
              {isDeposit ? '+' : '-'}{fmtRp(Number(tx.amount))}
            </span>
          </div>
        )
      })}
    </div>
  )
}
