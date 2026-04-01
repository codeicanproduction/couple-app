'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronRight, Play, CheckCircle2, MessageCircleHeart } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { getPacksWithProgress } from '@/lib/deep-talk'
import type { DeepTalkPack, DeepTalkProgress } from '@/lib/deep-talk'

const PACK_GRADIENTS: Record<string, string> = {
  '#E07A9E': 'from-rose to-rose-dark',
  '#7C6FF7': 'from-purple-500 to-purple-700',
  '#F4A261': 'from-orange-400 to-orange-600',
  '#2A9D8F': 'from-teal-500 to-teal-700',
  '#E76F51': 'from-orange-500 to-red-500',
}

const PACK_BG: Record<string, string> = {
  '#E07A9E': 'bg-rose/10',
  '#7C6FF7': 'bg-purple-50',
  '#F4A261': 'bg-orange-50',
  '#2A9D8F': 'bg-teal-50',
  '#E76F51': 'bg-orange-50',
}

export default function DeepTalkHubPage() {
  const router = useRouter()
  const [coupleId, setCoupleId] = useState<string | null>(null)
  const [packs, setPacks] = useState<DeepTalkPack[]>([])
  const [progresses, setProgresses] = useState<DeepTalkProgress[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: membership } = await supabase
      .from('couple_members').select('couple_id').eq('profile_id', user.id).single()
    if (!membership?.couple_id) { setLoading(false); return }
    setCoupleId(membership.couple_id)

    const { packs: p, progresses: pr } = await getPacksWithProgress(membership.couple_id)
    setPacks(p)
    setProgresses(pr)
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  function getProgress(packId: string) {
    return progresses.find(p => p.pack_id === packId) ?? null
  }

  function getProgressLabel(progress: DeepTalkProgress | null) {
    if (!progress) return null
    if (progress.is_completed) return 'Selesai'
    return `Level ${progress.level_number} · ${progress.current_question_index} pertanyaan`
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-rose border-t-transparent" /></div>
  }

  return (
    <div className="animate-fade-in pb-6">
      <div className="border-b border-border bg-white px-6 py-5">
        <button onClick={() => router.back()} className="mb-3 flex items-center gap-1 text-sm text-ink-muted">
          <ArrowLeft className="h-4 w-4" /> Games
        </button>
        <h1 className="text-xl font-bold text-ink">Obrolan Bareng</h1>
        <p className="text-sm text-ink-muted">Pertanyaan untuk saling kenal lebih dalam</p>
      </div>

      <div className="space-y-3 px-6 pt-5">
        {packs.map(pack => {
          const progress = getProgress(pack.id)
          const progressLabel = getProgressLabel(progress)
          const color = pack.color ?? '#E07A9E'
          const gradient = PACK_GRADIENTS[color] ?? 'from-rose to-rose-dark'
          const bg = PACK_BG[color] ?? 'bg-rose/10'
          const isCompleted = progress?.is_completed

          return (
            <button
              key={pack.id}
              onClick={() => router.push(`/app/games/deep-talk/${pack.slug}`)}
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white p-4 text-left shadow-card transition-all hover:border-rose/30 active:scale-[0.99]"
            >
              <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient}`}>
                <MessageCircleHeart className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-ink">{pack.title}</p>
                  {isCompleted && <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-sage" />}
                </div>
                <p className="mt-0.5 text-xs text-ink-muted line-clamp-1">{pack.description}</p>
                {progressLabel && (
                  <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isCompleted ? 'bg-sage/10 text-sage-dark' : bg + ' text-ink-muted'
                  }`}>
                    {progressLabel}
                  </span>
                )}
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-ink-muted" />
            </button>
          )
        })}

        {!coupleId && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-ink-muted">Hubungkan akun dengan pasanganmu dulu untuk mulai</p>
          </div>
        )}
      </div>

      <div className="mx-6 mt-5 rounded-2xl bg-rose/5 border border-rose/20 p-4">
        <div className="flex items-start gap-3">
          <Play className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose" />
          <div>
            <p className="text-xs font-semibold text-ink">Cara main</p>
            <p className="mt-1 text-xs text-ink-muted">Buka bareng pasangan, baca pertanyaannya bergantian, terus jawab apa adanya. Bebas, santai, yang penting jujur.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
