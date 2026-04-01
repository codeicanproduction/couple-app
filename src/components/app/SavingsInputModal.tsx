'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toMonthKey } from '@/lib/dates'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface SavingsInputModalProps {
  isOpen: boolean
  onClose: () => void
  goalId: string
  coupleId: string
  onSuccess: () => void
}

const QUICK_AMOUNTS = [500_000, 1_000_000, 2_000_000, 5_000_000]

function fmtRp(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}jt`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`
  return `${n}`
}

export default function SavingsInputModal({
  isOpen,
  onClose,
  goalId,
  coupleId,
  onSuccess,
}: SavingsInputModalProps) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const numAmount = parseInt(amount.replace(/\D/g, ''), 10)
    if (!numAmount || numAmount <= 0) {
      setError('Masukkan jumlah yang valid')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const month = toMonthKey()

    const { error: entryError } = await supabase
      .from('savings_entries')
      .upsert(
        { goal_id: goalId, couple_id: coupleId, month, amount: numAmount, note: note || null },
        { onConflict: 'goal_id,month' }
      )

    if (entryError) {
      setError(entryError.message)
      setLoading(false)
      return
    }

    // Recalculate total
    const { data: existing } = await supabase
      .from('savings_entries')
      .select('amount')
      .eq('goal_id', goalId)

    const total = (existing ?? []).reduce((sum, e) => sum + Number(e.amount ?? 0), 0)

    await supabase
      .from('savings_goals')
      .update({ current_amount: total })
      .eq('id', goalId)

    setAmount('')
    setNote('')
    setLoading(false)
    onSuccess()
    onClose()
  }

  function formatInput(val: string) {
    const num = val.replace(/\D/g, '')
    setAmount(num ? parseInt(num, 10).toLocaleString('id-ID') : '')
  }

  function selectQuickAmount(amt: number) {
    setAmount(amt.toLocaleString('id-ID'))
  }

  return (
    <Modal open={isOpen} onClose={onClose} title="Catat Tabungan Bulan Ini">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Jumlah (Rp)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-muted">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={e => formatInput(e.target.value)}
              className="w-full rounded-2xl border border-border bg-white py-3.5 pl-10 pr-4 text-lg font-bold text-ink focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20"
              required
            />
          </div>
          {/* Quick presets */}
          <div className="flex gap-2 pt-1">
            {QUICK_AMOUNTS.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => selectQuickAmount(amt)}
                className="flex-1 rounded-lg bg-cream py-1.5 text-xs font-semibold text-ink-muted hover:bg-rose-50 hover:text-rose transition-colors"
              >
                {fmtRp(amt)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Catatan (Opsional)
          </label>
          <input
            type="text"
            placeholder="Contoh: Gaji bulan Maret"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-ink focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" loading={loading} size="lg">
          Simpan
        </Button>
      </form>
    </Modal>
  )
}
