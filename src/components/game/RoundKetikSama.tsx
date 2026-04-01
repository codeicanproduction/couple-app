'use client'

import { useState, useEffect, useRef } from 'react'
import type { KetikSamaConfig } from '@/types/samakan'

interface RoundKetikSamaProps {
  config: KetikSamaConfig
  onSubmit: (answer: string) => void
}

export default function RoundKetikSama({ config, onSubmit }: RoundKetikSamaProps) {
  const [value, setValue] = useState('')
  const [timeLeft, setTimeLeft] = useState(config.timeLimit)
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const submittedRef = useRef(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (submitted) return
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, submitted])

  const handleSubmit = () => {
    if (submittedRef.current) return
    submittedRef.current = true
    setSubmitted(true)
    const answer = value.trim() || '...'
    onSubmit(answer)
  }

  const progress = timeLeft / config.timeLimit
  const circumference = 2 * Math.PI * 28

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 pt-14">
      <p className="mb-2 text-center text-lg font-medium text-white/90 leading-relaxed max-w-sm">
        {config.storyPrompt}
      </p>
      <p className="mb-8 text-sm text-white/50">{config.category}</p>

      {/* Timer circle */}
      <div className="relative mb-8">
        <svg width="64" height="64" className="-rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke={timeLeft <= 3 ? '#f43f5e' : '#ffffff'}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${
            timeLeft <= 3 ? 'text-rose' : 'text-white'
          }`}
        >
          {timeLeft}
        </span>
      </div>

      {/* Input */}
      <div className="w-full max-w-xs">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim()) handleSubmit()
          }}
          disabled={submitted}
          placeholder="Ketik jawabanmu..."
          className="w-full rounded-xl border-2 border-white/20 bg-white/10 px-4 py-3 text-center text-lg text-white placeholder-white/30 outline-none focus:border-rose transition-colors"
          autoComplete="off"
        />
      </div>

      {!submitted && value.trim() && (
        <button
          onClick={handleSubmit}
          className="mt-4 rounded-full bg-rose px-8 py-2.5 text-sm font-bold text-white active:scale-95 transition-transform"
        >
          Kirim
        </button>
      )}

      {submitted && (
        <p className="mt-6 text-sm text-white/40 animate-pulse">Menunggu pasangan...</p>
      )}
    </div>
  )
}
