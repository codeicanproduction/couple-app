'use client'

import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import type { RoundResult } from '@/types/samakan'

interface SinkronisasiRevealProps {
  result: RoundResult
  myName: string
  partnerName: string
  onNext: () => void
}

function formatAnswer(answer: unknown): string {
  if (answer == null) return '...'
  if (typeof answer === 'string') return answer
  if (typeof answer === 'number') return String(answer)
  if (typeof answer === 'object' && answer !== null) {
    const obj = answer as Record<string, unknown>
    if ('real' in obj && 'guess' in obj) {
      return `${obj.real} / ${obj.guess}`
    }
  }
  return String(answer)
}

export default function SinkronisasiReveal({ result, myName, partnerName, onNext }: SinkronisasiRevealProps) {
  const [showScore, setShowScore] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowScore(true), 600)
    const t2 = setTimeout(onNext, 3500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onNext])

  const isMatch = result.score >= 15
  const scoreLabel =
    result.score === 20
      ? '+20'
      : result.score === 15
      ? '+15'
      : result.score === 10
      ? '+10'
      : result.score === 5
      ? '+5'
      : '+0'

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-ink to-gray-900 px-6">
      {/* Match indicator */}
      <div
        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full animate-scale-in ${
          isMatch ? 'bg-emerald-500/20' : 'bg-red-500/20'
        }`}
      >
        {isMatch ? (
          <Check className="h-8 w-8 text-emerald-400" strokeWidth={3} />
        ) : (
          <X className="h-8 w-8 text-red-400" strokeWidth={3} />
        )}
      </div>

      <p className="mb-8 text-sm font-medium text-white/50">
        {isMatch ? 'Kompak!' : 'Belum sama...'}
      </p>

      {/* Answers side by side */}
      <div className="flex w-full max-w-sm gap-3 mb-8">
        <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
          <p className="text-xs text-white/40 mb-2">{myName}</p>
          <p className="text-base font-semibold text-white break-words">
            {formatAnswer(result.hostAnswer)}
          </p>
        </div>
        <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
          <p className="text-xs text-white/40 mb-2">{partnerName}</p>
          <p className="text-base font-semibold text-white break-words">
            {formatAnswer(result.guestAnswer)}
          </p>
        </div>
      </div>

      {/* Score */}
      {showScore && (
        <div className="animate-scale-in">
          <span
            className={`text-4xl font-black ${
              result.score >= 15 ? 'text-emerald-400' : result.score >= 5 ? 'text-amber-400' : 'text-red-400'
            }`}
          >
            {scoreLabel}
          </span>
        </div>
      )}
    </div>
  )
}
