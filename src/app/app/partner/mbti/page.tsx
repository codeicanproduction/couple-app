'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Brain } from 'lucide-react'
import { mbtiQuestions, calculateMbtiType } from '@/data/mbtiQuestions'
import { getMbtiDescription } from '@/data/mbtiDescriptions'
import { createClient } from '@/lib/supabase'
import type { Json } from '@/types/database'
import MbtiCard from '@/components/app/MbtiCard'
import type { MbtiScores } from '@/data/mbtiQuestions'

type Phase = 'intro' | 'test' | 'result'

export default function MbtiTestPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<{ type: string; scores: MbtiScores } | null>(null)
  const [saving, setSaving] = useState(false)

  const question = mbtiQuestions[currentQ]
  const progress = ((currentQ) / mbtiQuestions.length) * 100

  function selectAnswer(choice: 'A' | 'B') {
    const newAnswers = { ...answers, [question.id]: choice }
    setAnswers(newAnswers)

    if (currentQ < mbtiQuestions.length - 1) {
      setTimeout(() => setCurrentQ(c => c + 1), 300)
    } else {
      // Done — calculate result
      const res = calculateMbtiType(newAnswers)
      setResult(res)
      setPhase('result')
      saveResult(newAnswers, res)
    }
  }

  async function saveResult(ans: Record<number, string>, res: { type: string; scores: MbtiScores }) {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    const { data: membership } = await supabase
      .from('couple_members').select('couple_id').eq('profile_id', user.id).single()

    await supabase.from('mbti_results').insert({
      profile_id: user.id,
      couple_id: membership?.couple_id ?? null,
      mbti_type: res.type,
      answers: ans as unknown as Json,
      scores: res.scores as unknown as Json,
    })
    setSaving(false)
  }

  function restart() {
    setAnswers({}); setCurrentQ(0); setResult(null); setPhase('intro')
  }

  // ===== INTRO =====
  if (phase === 'intro') {
    return (
      <div className="animate-fade-in min-h-screen px-6 py-8">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-1 text-sm text-ink-muted">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-100 to-rose-100">
            <Brain className="h-10 w-10 text-purple-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-ink">Tes MBTI</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Kenali kepribadianmu dengan 20 pertanyaan singkat.
            Hasilnya bisa dilihat pasanganmu di halaman Pasangan.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 w-full">
            {[
              { label: '20 Pertanyaan', sub: 'Pilih A atau B' },
              { label: '4 Dimensi', sub: 'E/I, S/N, T/F, J/P' },
              { label: '16 Tipe', sub: 'Kepribadian unikmu' },
              { label: '~3 Menit', sub: 'Cepat dan seru' },
            ].map(item => (
              <div key={item.label} className="rounded-xl bg-purple-50 p-3 text-center">
                <p className="text-sm font-bold text-purple-700">{item.label}</p>
                <p className="text-[10px] text-purple-500">{item.sub}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setPhase('test')}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-rose py-4 text-sm font-bold text-white shadow-elevated transition-all active:scale-[0.98]">
            Mulai Tes
          </button>
        </div>
      </div>
    )
  }

  // ===== RESULT =====
  if (phase === 'result' && result) {
    const info = getMbtiDescription(result.type)
    return (
      <div className="animate-fade-in min-h-screen px-6 py-8">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Tipe Kepribadianmu</p>
          <div className="mt-2 text-5xl">{info?.emoji}</div>
          <h1 className="mt-2 text-3xl font-extrabold text-ink">{result.type}</h1>
          <p className="mt-1 text-sm font-semibold text-purple-600">{info?.title}</p>
        </div>

        <MbtiCard mbtiType={result.type} scores={result.scores} />

        {saving && (
          <p className="mt-3 text-center text-xs text-ink-muted animate-pulse">Menyimpan hasil...</p>
        )}

        <div className="mt-6 space-y-3">
          <button onClick={() => router.push('/app/partner')}
            className="w-full rounded-2xl bg-rose py-3.5 text-sm font-bold text-white shadow-elevated transition-all active:scale-[0.98]">
            Lihat Profil Pasangan
          </button>
          <button onClick={restart}
            className="w-full rounded-2xl border border-border bg-white py-3.5 text-sm font-semibold text-ink-muted transition-all active:scale-[0.98]">
            Tes Ulang
          </button>
        </div>
      </div>
    )
  }

  // ===== TEST FLOW =====
  return (
    <div className="animate-fade-in min-h-screen px-6 py-6">
      {/* Progress */}
      <div className="mb-2 flex items-center justify-between">
        <button onClick={() => currentQ > 0 ? setCurrentQ(c => c - 1) : setPhase('intro')}
          className="text-ink-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-xs font-semibold text-ink-muted">{currentQ + 1} / {mbtiQuestions.length}</span>
      </div>
      <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-cream">
        <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-rose transition-all duration-500"
          style={{ width: `${progress}%` }} />
      </div>

      {/* Dichotomy label */}
      <div className="mb-4 text-center">
        <span className="rounded-full bg-purple-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-600">
          {{ EI: 'Extrovert vs Introvert', SN: 'Sensing vs Intuition', TF: 'Thinking vs Feeling', JP: 'Judging vs Perceiving' }[question.dichotomy]}
        </span>
      </div>

      {/* Question */}
      <p className="mb-8 text-center text-sm font-semibold text-ink-muted">Mana yang lebih menggambarkan dirimu?</p>

      {/* Options */}
      <div className="space-y-3">
        <button
          onClick={() => selectAnswer('A')}
          className={`w-full rounded-2xl border-2 p-5 text-left transition-all active:scale-[0.98] ${
            answers[question.id] === 'A'
              ? 'border-purple-500 bg-purple-50'
              : 'border-border bg-white hover:border-purple-200'
          }`}
        >
          <span className="mb-1.5 inline-block rounded-lg bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-600">A</span>
          <p className="text-sm font-medium text-ink">{question.optionA.text}</p>
        </button>

        <button
          onClick={() => selectAnswer('B')}
          className={`w-full rounded-2xl border-2 p-5 text-left transition-all active:scale-[0.98] ${
            answers[question.id] === 'B'
              ? 'border-rose bg-rose-50'
              : 'border-border bg-white hover:border-rose/30'
          }`}
        >
          <span className="mb-1.5 inline-block rounded-lg bg-rose/10 px-2 py-0.5 text-[10px] font-bold text-rose">B</span>
          <p className="text-sm font-medium text-ink">{question.optionB.text}</p>
        </button>
      </div>
    </div>
  )
}
