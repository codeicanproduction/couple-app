'use client'

import { useState, useRef, useEffect } from 'react'
import type { TebakPasanganConfig, PlayerRole } from '@/types/samakan'

interface RoundTebakPasanganProps {
  config: TebakPasanganConfig
  role: PlayerRole
  onSubmit: (answer: { real: string; guess: string }) => void
}

export default function RoundTebakPasangan({
  config,
  role,
  onSubmit,
}: RoundTebakPasanganProps) {
  const [phase, setPhase] = useState<1 | 2>(1)
  const [selfAnswer, setSelfAnswer] = useState('')
  const [guessAnswer, setGuessAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [phase])

  const handlePhase1Submit = () => {
    if (!selfAnswer.trim()) return
    setPhase(2)
  }

  const handlePhase2Submit = () => {
    if (!guessAnswer.trim()) return
    setSubmitted(true)
    onSubmit({ real: selfAnswer.trim(), guess: guessAnswer.trim() })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 pt-14">
        <p className="mb-4 text-center text-lg font-medium text-white/90">{config.storyPrompt}</p>
        <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-6 w-full max-w-xs">
          <div className="mb-3">
            <p className="text-xs text-white/40 mb-1">Jawabanmu</p>
            <p className="text-base text-white font-medium">{selfAnswer}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Tebakanmu</p>
            <p className="text-base text-white font-medium">{guessAnswer}</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-white/40 animate-pulse">Menunggu pasangan...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 pt-14">
      <p className="mb-6 text-center text-lg font-medium text-white/90 leading-relaxed max-w-sm">
        {config.storyPrompt}
      </p>

      {/* Phase indicator */}
      <div className="flex gap-2 mb-6">
        <div className={`h-1.5 w-8 rounded-full ${phase >= 1 ? 'bg-rose' : 'bg-white/20'}`} />
        <div className={`h-1.5 w-8 rounded-full ${phase >= 2 ? 'bg-rose' : 'bg-white/20'}`} />
      </div>

      {phase === 1 ? (
        <>
          <p className="mb-4 text-center text-sm text-white/60 max-w-xs">
            {config.questionForSelf}
          </p>
          <div className="w-full max-w-xs">
            <input
              ref={inputRef}
              type="text"
              value={selfAnswer}
              onChange={(e) => setSelfAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && selfAnswer.trim()) handlePhase1Submit()
              }}
              placeholder="Jawabanmu..."
              className="w-full rounded-xl border-2 border-white/20 bg-white/10 px-4 py-3 text-center text-lg text-white placeholder-white/30 outline-none focus:border-rose transition-colors"
              autoComplete="off"
            />
          </div>
          {selfAnswer.trim() && (
            <button
              onClick={handlePhase1Submit}
              className="mt-4 rounded-full bg-rose px-8 py-2.5 text-sm font-bold text-white active:scale-95 transition-transform"
            >
              Lanjut
            </button>
          )}
        </>
      ) : (
        <>
          <p className="mb-4 text-center text-sm text-white/60 max-w-xs">
            {config.questionForPartner}
          </p>
          <div className="w-full max-w-xs">
            <input
              ref={inputRef}
              type="text"
              value={guessAnswer}
              onChange={(e) => setGuessAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && guessAnswer.trim()) handlePhase2Submit()
              }}
              placeholder="Tebakanmu..."
              className="w-full rounded-xl border-2 border-white/20 bg-white/10 px-4 py-3 text-center text-lg text-white placeholder-white/30 outline-none focus:border-rose transition-colors"
              autoComplete="off"
            />
          </div>
          {guessAnswer.trim() && (
            <button
              onClick={handlePhase2Submit}
              className="mt-4 rounded-full bg-rose px-8 py-2.5 text-sm font-bold text-white active:scale-95 transition-transform"
            >
              Kirim
            </button>
          )}
        </>
      )}
    </div>
  )
}
