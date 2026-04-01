'use client'

import { useState } from 'react'
import { Heart, MapPin, Users, Calendar, TrendingUp, ArrowRight, Check } from 'lucide-react'
import { WEDDING_COSTS, SCALE_LABELS, getEstimate, type WeddingScale } from '@/data/weddingCosts'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'

interface SavingsWizardProps {
  coupleId: string
  onComplete: () => void
}

type Step = 'city' | 'scale' | 'date' | 'savings' | 'result'

function fmtRp(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}jt`
  return `Rp ${n.toLocaleString('id-ID')}`
}

export default function SavingsWizard({ coupleId, onComplete }: SavingsWizardProps) {
  const [step, setStep] = useState<Step>('city')
  const [city, setCity] = useState('')
  const [scale, setScale] = useState<WeddingScale | ''>('')
  const [targetDate, setTargetDate] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [loading, setLoading] = useState(false)

  const estimate = city && scale ? getEstimate(city, scale) : null
  const parsedSavings = parseInt(currentSavings.replace(/\D/g, ''), 10) || 0

  const monthsUntilWedding = targetDate
    ? Math.max(1, Math.ceil((new Date(targetDate).getTime() - Date.now()) / (30.44 * 86400000)))
    : 24

  const remaining = estimate ? Math.max(0, estimate.midpoint - parsedSavings) : 0
  const monthlyNeeded = Math.ceil(remaining / monthsUntilWedding)

  async function handleCreate() {
    if (!estimate) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('savings_goals').insert({
      couple_id: coupleId,
      name: `Dana Nikah (${city})`,
      target_amount: estimate.midpoint,
      current_amount: parsedSavings,
      target_date: targetDate || null,
    })
    setLoading(false)
    onComplete()
  }

  return (
    <div className="animate-fade-in">
      {/* Step: City */}
      {step === 'city' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose/10">
              <Heart className="h-8 w-8 text-rose" fill="currentColor" fillOpacity={0.2} />
            </div>
            <h2 className="text-xl font-extrabold text-ink">Yuk, hitung biaya nikah</h2>
            <p className="mt-1 text-sm text-ink-muted">Biar tahu berapa yang perlu ditabung berdua</p>
          </div>

          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted">
              <MapPin className="h-3.5 w-3.5" /> Mau nikahan di mana?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {WEDDING_COSTS.map(c => (
                <button
                  key={c.city}
                  onClick={() => { setCity(c.city); setStep('scale') }}
                  className={`rounded-2xl border bg-white px-4 py-3.5 text-left transition-all ${
                    city === c.city
                      ? 'border-rose bg-rose-50 shadow-sm'
                      : 'border-border hover:border-rose'
                  }`}
                >
                  <p className="text-sm font-semibold text-ink">{c.city}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step: Scale */}
      {step === 'scale' && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-ink-muted">
              Nikah di {city}
            </p>
            <h2 className="text-xl font-extrabold text-ink">Skala nikahan?</h2>
          </div>

          <div className="space-y-3">
            {(Object.entries(SCALE_LABELS) as [WeddingScale, { label: string; desc: string }][]).map(([key, val]) => {
              const est = getEstimate(city, key)
              return (
                <button
                  key={key}
                  onClick={() => { setScale(key); setStep('date') }}
                  className={`flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition-all ${
                    scale === key ? 'border-rose bg-rose-50' : 'border-border hover:border-rose'
                  }`}
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-rose/10">
                    <Users className="h-5 w-5 text-rose" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-ink">{val.label}</p>
                    <p className="text-xs text-ink-muted">{val.desc}</p>
                  </div>
                  <p className="text-xs font-semibold text-ink-muted">
                    {fmtRp(est.low)} - {fmtRp(est.high)}
                  </p>
                </button>
              )
            })}
          </div>

          <button onClick={() => setStep('city')} className="w-full py-2 text-sm text-ink-muted hover:text-ink">
            Kembali
          </button>
        </div>
      )}

      {/* Step: Target Date */}
      {step === 'date' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-ink">Kapan target nikah?</h2>
            <p className="mt-1 text-sm text-ink-muted">Biar dihitung kebutuhan per bulan</p>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted">
              <Calendar className="h-3.5 w-3.5" /> Target Tanggal
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-sm text-ink focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setStep('savings')} size="lg">
              Lanjut
            </Button>
          </div>
          <button onClick={() => setStep('scale')} className="w-full py-2 text-sm text-ink-muted hover:text-ink">
            Kembali
          </button>
        </div>
      )}

      {/* Step: Current Savings */}
      {step === 'savings' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-ink">Sudah punya tabungan?</h2>
            <p className="mt-1 text-sm text-ink-muted">Kalau sudah nabung sebelumnya, masukkan di sini</p>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-ink-muted">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={currentSavings}
              onChange={e => {
                const num = e.target.value.replace(/\D/g, '')
                setCurrentSavings(num ? parseInt(num, 10).toLocaleString('id-ID') : '')
              }}
              className="w-full rounded-2xl border border-border bg-white py-4 pl-12 pr-4 text-xl font-bold text-ink focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20"
            />
          </div>

          <button
            onClick={() => setStep('result')}
            className="w-full text-sm font-medium text-ink-muted hover:text-rose"
          >
            Belum punya, lewati
          </button>

          <div className="flex gap-2">
            <Button onClick={() => setStep('result')} size="lg">
              Lihat Perhitungan
            </Button>
          </div>
          <button onClick={() => setStep('date')} className="w-full py-2 text-sm text-ink-muted hover:text-ink">
            Kembali
          </button>
        </div>
      )}

      {/* Step: Result */}
      {step === 'result' && estimate && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage/20">
              <Check className="h-7 w-7 text-sage-dark" />
            </div>
            <h2 className="text-xl font-extrabold text-ink">Perhitungan Siap!</h2>
          </div>

          {/* Summary card */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm text-ink-muted">Nikah di</span>
              <span className="text-sm font-bold text-ink">{city}, {SCALE_LABELS[scale as WeddingScale]?.label}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm text-ink-muted">Estimasi biaya</span>
              <span className="text-sm font-bold text-ink">{fmtRp(estimate.low)} - {fmtRp(estimate.high)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm text-ink-muted">Target yang ditetapkan</span>
              <span className="text-sm font-bold text-rose">{fmtRp(estimate.midpoint)}</span>
            </div>
            {parsedSavings > 0 && (
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm text-ink-muted">Sudah terkumpul</span>
                <span className="text-sm font-bold text-sage-dark">{fmtRp(parsedSavings)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm text-ink-muted">Masih perlu</span>
              <span className="text-sm font-bold text-ink">{fmtRp(remaining)}</span>
            </div>
            {targetDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-muted">Waktu tersisa</span>
                <span className="text-sm font-bold text-ink">{monthsUntilWedding} bulan</span>
              </div>
            )}
          </div>

          {/* Monthly target highlight */}
          <div className="flex items-center gap-3 rounded-2xl bg-rose/10 px-5 py-4">
            <TrendingUp className="h-6 w-6 flex-shrink-0 text-rose" />
            <div>
              <p className="text-lg font-extrabold text-ink">{fmtRp(monthlyNeeded)}<span className="text-sm font-normal text-ink-muted">/bulan</span></p>
              <p className="text-xs text-ink-muted">Kebutuhan tabungan berdua per bulan</p>
            </div>
          </div>

          <Button onClick={handleCreate} loading={loading} size="lg">
            <span className="flex items-center gap-2">
              Mulai Nabung!
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>

          <button onClick={() => setStep('savings')} className="w-full py-2 text-sm text-ink-muted hover:text-ink">
            Kembali
          </button>
        </div>
      )}
    </div>
  )
}
