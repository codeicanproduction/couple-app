'use client'

import { useState, useEffect } from 'react'
import type { TapBarengConfig } from '@/types/samakan'

interface RoundTapBarengProps {
  config: TapBarengConfig
  onSubmit: (timestamp: number) => void
}

export default function RoundTapBareng({ config, onSubmit }: RoundTapBarengProps) {
  const [phase, setPhase] = useState<'intro' | 'countdown' | 'tap' | 'done'>('intro')
  const [count, setCount] = useState(3)

  // Auto-start countdown after intro
  useEffect(() => {
    const t = setTimeout(() => setPhase('countdown'), 1500)
    return () => clearTimeout(t)
  }, [])

  // Countdown timer
  useEffect(() => {
    if (phase !== 'countdown') return
    if (count === 0) {
      setPhase('tap')
      return
    }
    const t = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, count])

  const handleTap = () => {
    if (phase !== 'tap') return
    setPhase('done')
    onSubmit(Date.now())
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 pt-14">
      <p className="mb-8 text-center text-lg font-medium text-white/90 leading-relaxed max-w-sm">
        {config.storyPrompt}
      </p>

      {phase === 'intro' && (
        <p className="text-white/50 text-sm animate-pulse">Bersiap...</p>
      )}

      {phase === 'countdown' && (
        <div className="animate-scale-in" key={count}>
          <span className="text-7xl font-black text-white">{count}</span>
        </div>
      )}

      {phase === 'tap' && (
        <button
          onClick={handleTap}
          className="h-36 w-36 rounded-full bg-rose shadow-lg shadow-rose/40 flex items-center justify-center active:scale-90 transition-transform animate-pulse"
        >
          <span className="text-3xl font-black text-white">TAP!</span>
        </button>
      )}

      {phase === 'done' && (
        <div className="flex flex-col items-center gap-4">
          <div className="h-36 w-36 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
            <span className="text-4xl">👆</span>
          </div>
          <p className="text-sm text-white/40 animate-pulse">Menunggu pasangan...</p>
        </div>
      )}
    </div>
  )
}
