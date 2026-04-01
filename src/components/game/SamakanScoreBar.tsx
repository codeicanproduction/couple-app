'use client'

import { X } from 'lucide-react'

interface SamakanScoreBarProps {
  currentRound: number
  totalRounds: number
  totalScore: number
  onClose: () => void
}

export default function SamakanScoreBar({
  currentRound,
  totalRounds,
  totalScore,
  onClose,
}: SamakanScoreBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between bg-black/40 backdrop-blur-sm px-4 py-3">
      {/* Round dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalRounds }).map((_, i) => (
          <div
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              i < currentRound
                ? 'bg-rose'
                : i === currentRound
                ? 'bg-rose animate-pulse scale-125'
                : 'bg-white/20 border border-white/30'
            }`}
          />
        ))}
      </div>

      {/* Score */}
      <div className="rounded-full bg-white/10 px-3 py-1">
        <span className="text-sm font-bold text-white">{totalScore}</span>
      </div>

      {/* Close */}
      <button onClick={onClose} className="rounded-full p-1 hover:bg-white/10 transition-colors">
        <X className="h-5 w-5 text-white/60" />
      </button>
    </div>
  )
}
