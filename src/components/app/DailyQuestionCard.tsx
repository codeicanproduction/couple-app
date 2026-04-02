'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send, Check, Heart, Flame } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface DailyQuestionCardProps {
  question: string
  questionIndex: number
  coupleId: string | null
  userId: string | null
  userName: string | null
  partnerId: string | null
  partnerName: string | null
}

interface DailyResponse {
  profile_id: string
  answer: string
}

export default function DailyQuestionCard({
  question, questionIndex, coupleId, userId, userName, partnerId, partnerName,
}: DailyQuestionCardProps) {
  const [myAnswer, setMyAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [responses, setResponses] = useState<DailyResponse[]>([])
  const [loaded, setLoaded] = useState(false)
  const [streak, setStreak] = useState(0)

  const myResponse = responses.find(r => r.profile_id === userId)
  const partnerResponse = responses.find(r => r.profile_id !== userId)
  const bothAnswered = !!myResponse && !!partnerResponse

  useEffect(() => {
    if (!coupleId || !userId) { setLoaded(true); return }
    loadResponses()
    loadStreak()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coupleId, userId])

  async function loadResponses() {
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('daily_responses')
      .select('profile_id, answer')
      .eq('couple_id', coupleId!)
      .eq('answered_date', today)
    setResponses(data ?? [])
    setLoaded(true)
  }

  async function loadStreak() {
    const supabase = createClient()
    // Count consecutive days where BOTH partners answered
    const { data } = await supabase
      .from('daily_responses')
      .select('answered_date, profile_id')
      .eq('couple_id', coupleId!)
      .order('answered_date', { ascending: false })
      .limit(60) // check last 60 days max

    if (!data || data.length === 0) { setStreak(0); return }

    // Group by date
    const byDate = new Map<string, Set<string>>()
    data.forEach(r => {
      const existing = byDate.get(r.answered_date) ?? new Set()
      existing.add(r.profile_id)
      byDate.set(r.answered_date, existing)
    })

    // Count consecutive days where 2+ people answered
    let count = 0
    const today = new Date()
    for (let i = 0; i < 60; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      const answerers = byDate.get(key)
      if (answerers && answerers.size >= 2) {
        count++
      } else if (i === 0) {
        // Today might not be complete yet, skip
        continue
      } else {
        break
      }
    }
    setStreak(count)
  }

  async function handleSubmit() {
    if (!myAnswer.trim() || !coupleId || !userId) return
    setSubmitting(true)
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]

    await supabase.from('daily_responses').upsert({
      couple_id: coupleId,
      profile_id: userId,
      question_index: questionIndex,
      answer: myAnswer.trim(),
      answered_date: today,
    }, { onConflict: 'couple_id,profile_id,answered_date' })

    await loadResponses()
    setSubmitting(false)
    setMyAnswer('')

    // Notify partner
    if (partnerId) {
      try {
        await fetch('/api/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientId: partnerId,
            title: 'CoupleApp',
            body: `${userName ?? 'Pasanganmu'} sudah jawab pertanyaan hari ini! Giliranmu`,
            url: '/app/home',
          }),
        })
      } catch { /* optional */ }
    }
  }

  if (!loaded) return null

  return (
    <div className="mx-6 rounded-2xl border border-border bg-white shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose/10">
            <MessageCircle className="h-3.5 w-3.5 text-rose" strokeWidth={2} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Pertanyaan Hari Ini
          </span>
        </div>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-500">
              <Flame className="h-3 w-3" /> {streak} hari
            </span>
          )}
          <span className="text-xs text-ink-muted/60">#{questionIndex + 1}</span>
        </div>
      </div>

      {/* Question */}
      <div className="px-4 pb-3">
        <p className="text-sm font-medium leading-relaxed text-ink">{question}</p>
      </div>

      {/* Response area */}
      {coupleId && userId ? (
        <div className="border-t border-border">
          {/* My answer input or display */}
          {!myResponse ? (
            <div className="flex items-end gap-2 p-3">
              <textarea
                value={myAnswer}
                onChange={e => setMyAnswer(e.target.value)}
                placeholder="Tulis jawabanmu..."
                rows={2}
                className="flex-1 resize-none rounded-xl border border-border bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose/20"
              />
              <button
                onClick={handleSubmit}
                disabled={!myAnswer.trim() || submitting}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-rose text-white disabled:opacity-40 transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {/* My answer */}
              <div className="flex items-start gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-rose/10 mt-0.5">
                  <span className="text-[10px] font-bold text-rose">
                    {(userName ?? 'K')[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 rounded-xl rounded-tl-sm bg-rose-50 px-3 py-2">
                  <p className="text-xs font-semibold text-rose">{userName ?? 'Kamu'}</p>
                  <p className="mt-0.5 text-sm text-ink">{myResponse.answer}</p>
                </div>
              </div>

              {/* Partner answer */}
              {partnerResponse ? (
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sage/20 mt-0.5">
                    <span className="text-[10px] font-bold text-sage-dark">
                      {(partnerName ?? 'P')[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 rounded-xl rounded-tl-sm bg-sage/10 px-3 py-2">
                    <p className="text-xs font-semibold text-sage-dark">{partnerName ?? 'Pasangan'}</p>
                    <p className="mt-0.5 text-sm text-ink">{partnerResponse.answer}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2.5">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-gold" />
                  <p className="text-xs text-ink-muted">
                    Menunggu jawaban {partnerName ?? 'pasangan'}...
                  </p>
                </div>
              )}

              {/* Both answered celebration */}
              {bothAnswered && (
                <div className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 py-2">
                  <Heart className="h-3.5 w-3.5 text-rose" fill="currentColor" />
                  <span className="text-xs font-semibold text-rose">
                    Kalian sudah menjawab hari ini!
                  </span>
                  <Check className="h-3.5 w-3.5 text-rose" />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Not logged in / no couple — show discuss prompt */
        <div className="border-t border-border bg-cream/50 px-4 py-3">
          <p className="text-xs text-ink-muted">
            Diskusikan pertanyaan ini bersama pasanganmu
          </p>
        </div>
      )}
    </div>
  )
}
