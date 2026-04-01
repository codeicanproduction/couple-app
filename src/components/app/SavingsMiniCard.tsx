import Link from 'next/link'
import { Wallet, ArrowRight } from 'lucide-react'

interface SavingsMiniCardProps {
  goalName: string | null
  currentAmount: number
  targetAmount: number
}

function formatRupiah(amount: number): string {
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}jt`
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}rb`
  return `Rp ${amount}`
}

export default function SavingsMiniCard({ goalName, currentAmount, targetAmount }: SavingsMiniCardProps) {
  const progress = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0

  if (!goalName) {
    return (
      <Link
        href="/app/finance"
        className="mx-6 flex items-center justify-between rounded-2xl border border-dashed border-border bg-white p-4 shadow-card"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/20">
            <Wallet className="h-4.5 w-4.5 text-yellow-600" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Buat Target Tabungan</p>
            <p className="text-xs text-ink-muted">Mulai rencanakan masa depan</p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-ink-muted" />
      </Link>
    )
  }

  return (
    <Link href="/app/finance" className="mx-6 block rounded-2xl border border-border bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gold/20">
            <Wallet className="h-3.5 w-3.5 text-yellow-600" strokeWidth={2} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            {goalName}
          </span>
        </div>
        <ArrowRight className="h-4 w-4 text-ink-muted" />
      </div>

      <div className="mb-1.5 h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-rose transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-muted">{formatRupiah(currentAmount)}</span>
        <span className="text-xs font-semibold text-ink">{Math.round(progress)}%</span>
        <span className="text-xs text-ink-muted">{formatRupiah(targetAmount)}</span>
      </div>
    </Link>
  )
}
