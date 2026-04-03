'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { SPENDING_QUESTIONS } from '@/lib/spending-assessment/questions'
import { calculateSpendingType } from '@/lib/spending-assessment/calculate'
import type { SpendingAnswer } from '@/lib/spending-assessment/types'

const STORAGE_KEY = 'nantikita_spending_answers'

export default function SpendingQuestionsPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, SpendingAnswer>>({})
  const [animating, setAnimating] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const question = SPENDING_QUESTIONS[current]
  const progress = ((current + 1) / SPENDING_QUESTIONS.length) * 100

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setAnswers(parsed.answers ?? {})
        setCurrent(parsed.current ?? 0)
      } catch { /* ignore */ }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, current }))
    }
  }, [answers, current])

  async function handleAnswer(key: SpendingAnswer) {
    const newAnswers = { ...answers, [`q${question.id}`]: key }
    setAnswers(newAnswers)

    if (current < SPENDING_QUESTIONS.length - 1) {
      setAnimating(true)
      setTimeout(() => {
        setCurrent(c => c + 1)
        setAnimating(false)
      }, 250)
    } else {
      // Last question — calculate and save
      setSubmitting(true)
      const result = calculateSpendingType(newAnswers)

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: membership } = await supabase
        .from('couple_members').select('couple_id').eq('profile_id', user.id).single()

      if (membership?.couple_id) {
        await supabase.from('spending_results').upsert({
          couple_id: membership.couple_id,
          profile_id: user.id,
          spending_type: result.spendingType,
          scores: result.scores,
          answers: newAnswers,
        }, { onConflict: 'couple_id,profile_id' })

        // Notify partner
        const { data: partnerMembers } = await supabase
          .from('couple_members').select('profile_id')
          .eq('couple_id', membership.couple_id).neq('profile_id', user.id)

        const { data: myProfile } = await supabase
          .from('profiles').select('name').eq('id', user.id).single()

        if (partnerMembers?.[0]) {
          try {
            await fetch('/api/push/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipientId: partnerMembers[0].profile_id,
                title: 'Nanti Kita',
                body: `${myProfile?.name ?? 'Pasanganmu'} baru selesai tes Spending Habits! Cek hasilnya dan tes kamu juga`,
                url: '/app/about-me/spending-habits',
              }),
            })
          } catch { /* optional */ }
        }
      }

      localStorage.removeItem(STORAGE_KEY)
      router.push('/app/about-me/spending-habits/result')
    }
  }

  if (submitting) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-amber-200 border-t-amber-600" />
        <p className="mt-4 text-sm text-ink-muted">Lagi analisa pola spending kamu...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-ink-muted">{current + 1} dari {SPENDING_QUESTIONS.length}</span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Spending Habits</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className={`flex flex-1 flex-col justify-center transition-all duration-250 ${
        animating ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'
      }`}>
        <h2 className="mb-8 text-xl font-semibold leading-relaxed text-ink text-balance">
          {question.question}
        </h2>

        <div className="space-y-2.5">
          {question.options.map(opt => {
            const isSelected = answers[`q${question.id}`] === opt.key
            return (
              <button
                key={opt.key}
                onClick={() => handleAnswer(opt.key)}
                className={`flex w-full items-center justify-between rounded-2xl border px-5 py-3.5 text-left text-sm font-medium transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-card'
                    : 'border-border bg-white text-ink-muted hover:border-amber-200 hover:bg-amber-50/50'
                }`}
              >
                <span>{opt.text}</span>
                {isSelected && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Back */}
      {current > 0 && (
        <button
          onClick={() => { setAnimating(true); setTimeout(() => { setCurrent(c => c - 1); setAnimating(false) }, 200) }}
          className="mt-6 flex items-center justify-center gap-1.5 text-sm text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali
        </button>
      )}
    </div>
  )
}
