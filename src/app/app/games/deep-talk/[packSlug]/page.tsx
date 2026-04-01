'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Lock, CheckCircle2, Play, RotateCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { getPackBySlug, getLevelsForPack, getProgress } from '@/lib/deep-talk'
import type { DeepTalkPack, DeepTalkLevel, DeepTalkProgress } from '@/lib/deep-talk'

const LEVEL_COLORS = [
  { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', ring: 'ring-emerald-200' },
  { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', ring: 'ring-amber-200' },
  { bg: 'bg-rose/5', text: 'text-rose', badge: 'bg-rose/10 text-rose', ring: 'ring-rose/20' },
]

const LEVEL_EMOJIS = ['🌱', '🌿', '🔥']

export default function PackDetailPage() {
  const router = useRouter()
  const { packSlug } = useParams<{ packSlug: string }>()

  const [coupleId, setCoupleId] = useState<string | null>(null)
  const [pack, setPack] = useState<DeepTalkPack | null>(null)
  const [levels, setLevels] = useState<DeepTalkLevel[]>([])
  const [progress, setProgress] = useState<DeepTalkProgress | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: membership } = await supabase
      .from('couple_members').select('couple_id').eq('profile_id', user.id).single()
    if (membership?.couple_id) {
      setCoupleId(membership.couple_id)
    }

    const p = await getPackBySlug(packSlug)
    if (!p) { setLoading(false); return }
    setPack(p)

    const [lvls, prog] = await Promise.all([
      getLevelsForPack(p.id),
      membership?.couple_id ? getProgress(membership.couple_id, p.id) : Promise.resolve(null),
    ])
    setLevels(lvls)
    setProgress(prog)
    setLoading(false)
  }, [packSlug])

  useEffect(() => { loadData() }, [loadData])

  function isLevelUnlocked(levelNumber: number): boolean {
    if (levelNumber === 1) return true
    if (!progress) return false
    // Level N unlocked if level N-1 is completed
    return progress.level_number > levelNumber - 1 ||
      (progress.level_number === levelNumber - 1 && progress.is_completed === true) ||
      progress.level_number >= levelNumber
  }

  function getLevelStatus(level: DeepTalkLevel) {
    if (!progress) return 'locked_but_first' as const
    if (progress.level_number > level.level_number) return 'completed' as const
    if (progress.level_number === level.level_number) {
      if (progress.is_completed) return 'completed' as const
      if (progress.current_question_index > 0) return 'in_progress' as const
    }
    return 'available' as const
  }

  function getButtonLabel(level: DeepTalkLevel, status: string, unlocked: boolean) {
    if (!unlocked) return 'Terkunci'
    if (status === 'completed') return 'Main Lagi'
    if (status === 'in_progress') return `Lanjut (${progress?.current_question_index}/${level.question_count})`
    return 'Mulai'
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-rose border-t-transparent" /></div>
  }

  if (!pack) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <p className="text-sm text-ink-muted">Pack tidak ditemukan</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-rose">Kembali</button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in pb-6">
      {/* Header */}
      <div
        className="px-6 pb-8 pt-6 text-white"
        style={{ background: `linear-gradient(135deg, ${pack.color ?? '#E07A9E'}, ${pack.color ?? '#E07A9E'}cc)` }}
      >
        <button onClick={() => router.back()} className="mb-4 flex items-center gap-1 text-sm text-white/80">
          <ArrowLeft className="h-4 w-4" /> Deep Talk
        </button>
        <div className="text-4xl mb-2">
          {pack.sort_order === 1 && '💬'}
          {pack.sort_order === 2 && '🚀'}
          {pack.sort_order === 3 && '❤️'}
          {pack.sort_order === 4 && '🛡️'}
          {pack.sort_order === 5 && '✨'}
        </div>
        <h1 className="text-2xl font-bold">{pack.title}</h1>
        <p className="mt-1 text-sm text-white/80">{pack.description}</p>
      </div>

      {/* Levels */}
      <div className="space-y-3 px-6 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Pilih Level</p>

        {levels.map((level, idx) => {
          const unlocked = isLevelUnlocked(level.level_number)
          const status = unlocked ? getLevelStatus(level) : 'locked'
          const colors = LEVEL_COLORS[idx] ?? LEVEL_COLORS[0]
          const label = getButtonLabel(level, status, unlocked)
          const isCompleted = status === 'completed'

          return (
            <div
              key={level.id}
              className={`rounded-2xl border p-4 transition-all ${
                unlocked ? 'border-border bg-white shadow-card' : 'border-border bg-cream/30 opacity-70'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-xl ${
                  unlocked ? colors.bg : 'bg-cream'
                }`}>
                  {unlocked ? LEVEL_EMOJIS[idx] : '🔒'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${unlocked ? 'text-ink' : 'text-ink-muted'}`}>
                      Level {level.level_number}: {level.title}
                    </p>
                    {isCompleted && <CheckCircle2 className="h-4 w-4 text-sage" />}
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted">{level.description}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${unlocked ? colors.badge : 'bg-cream text-ink-muted'}`}>
                      {level.question_count} pertanyaan
                    </span>
                    {status === 'in_progress' && (
                      <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-yellow-700">
                        Sedang berlangsung
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {unlocked && (
                <button
                  onClick={() => {
                    if (!coupleId) return
                    router.push(`/app/games/deep-talk/${packSlug}/${level.level_number}`)
                  }}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-[0.98] ${
                    isCompleted
                      ? 'bg-cream text-ink-muted hover:bg-cream/80'
                      : `text-white shadow-sm`
                  }`}
                  style={!isCompleted ? { background: pack.color ?? '#E07A9E' } : {}}
                >
                  {isCompleted ? (
                    <><RotateCcw className="h-4 w-4" /> {label}</>
                  ) : (
                    <><Play className="h-4 w-4" /> {label}</>
                  )}
                </button>
              )}

              {!unlocked && (
                <div className="mt-3 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-ink-muted" />
                  <p className="text-xs text-ink-muted">Selesaikan Level {level.level_number - 1} untuk membuka</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
