'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Wand2, Loader2, RefreshCw } from 'lucide-react'

interface AIDailyQuestionCardProps {
  coupleId: string | null
}

export default function AIDailyQuestionCard({ coupleId }: AIDailyQuestionCardProps) {
  const [question, setQuestion] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)
  const [error, setError] = useState(false)

  // Check if today's AI question already exists
  useEffect(() => {
    if (!coupleId) return
    fetch('/api/ai/daily-question')
      .then(r => r.json())
      .then(data => {
        if (data.question) setQuestion(data.question)
        setChecked(true)
      })
      .catch(() => setChecked(true))
  }, [coupleId])

  async function generate() {
    if (loading || question) return
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/ai/daily-question', { method: 'POST' })
      const data = await res.json()
      if (data.question) {
        setQuestion(data.question)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    }
    setLoading(false)
  }

  if (!coupleId || !checked) return null

  // Already has today's AI question — show it
  if (question) {
    return (
      <div className="mx-6 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-rose-50 p-4 shadow-card overflow-hidden">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-100">
            <Sparkles className="h-3.5 w-3.5 text-purple-600" strokeWidth={2} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-500">
            AI Question
          </span>
          <span className="ml-auto text-[10px] text-purple-400">personalized</span>
        </div>
        <p className="text-sm font-medium leading-relaxed text-ink">
          {question}
        </p>
      </div>
    )
  }

  // No question yet — show generate button
  return (
    <div className="mx-6">
      <button
        onClick={generate}
        disabled={loading}
        className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-purple-300 bg-gradient-to-r from-purple-50/50 to-rose-50/50 p-4 text-left transition-all hover:border-purple-400 hover:shadow-card active:scale-[0.98] disabled:opacity-60"
      >
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
          ) : error ? (
            <RefreshCw className="h-5 w-5 text-purple-500" />
          ) : (
            <Wand2 className="h-5 w-5 text-purple-600" strokeWidth={1.5} />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-ink">
            {loading ? 'Generating...' : error ? 'Coba lagi' : 'AI Question Hari Ini'}
          </p>
          <p className="text-xs text-ink-muted">
            {loading
              ? 'Claude sedang buat pertanyaan khusus buat kalian'
              : error
              ? 'Gagal generate, tap untuk coba lagi'
              : 'Tap untuk generate pertanyaan personal dari AI'
            }
          </p>
        </div>
        {!loading && (
          <Sparkles className="h-4 w-4 flex-shrink-0 text-purple-400" />
        )}
      </button>
    </div>
  )
}
