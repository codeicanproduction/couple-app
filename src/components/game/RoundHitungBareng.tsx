'use client'

import type { HitungBarengConfig } from '@/types/samakan'

interface RoundHitungBarengProps {
  config: HitungBarengConfig
  isMyTurn: boolean
  runningTotal: number
  onMove: (value: number) => void
}

export default function RoundHitungBareng({
  config,
  isMyTurn,
  runningTotal,
  onMove,
}: RoundHitungBarengProps) {
  const isOver = runningTotal >= config.target
  const progress = Math.min(runningTotal / config.target, 1)

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 pt-14">
      <p className="mb-6 text-center text-lg font-medium text-white/90 leading-relaxed max-w-sm">
        {config.storyPrompt}
      </p>

      {/* Target display */}
      <div className="mb-2 text-sm text-white/50">Target</div>
      <div className="mb-8 text-4xl font-black text-white">{config.target}</div>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-4">
        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOver && runningTotal === config.target
                ? 'bg-emerald-400'
                : isOver
                ? 'bg-red-400'
                : 'bg-rose'
            }`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Running total */}
      <div
        className={`mb-8 text-6xl font-black transition-colors ${
          runningTotal === config.target
            ? 'text-emerald-400'
            : runningTotal > config.target
            ? 'text-red-400'
            : 'text-white'
        }`}
      >
        {runningTotal}
      </div>

      {/* Turn indicator */}
      {!isOver && (
        <p className={`mb-4 text-sm font-bold ${isMyTurn ? 'text-rose' : 'text-white/40'}`}>
          {isMyTurn ? 'Giliranmu!' : 'Giliran pasangan...'}
        </p>
      )}

      {/* Action buttons */}
      {!isOver && isMyTurn && (
        <div className="flex gap-3">
          {[1, 2, 3].map((val) => (
            <button
              key={val}
              onClick={() => onMove(val)}
              className="h-16 w-16 rounded-2xl bg-white/10 border-2 border-white/20 text-xl font-bold text-white active:scale-90 active:bg-rose/30 transition-all hover:border-white/40"
            >
              +{val}
            </button>
          ))}
        </div>
      )}

      {isOver && (
        <div className="text-center animate-scale-in">
          {runningTotal === config.target ? (
            <p className="text-lg font-bold text-emerald-400">Pas!</p>
          ) : (
            <p className="text-lg font-bold text-red-400">Kelewatan!</p>
          )}
        </div>
      )}
    </div>
  )
}
