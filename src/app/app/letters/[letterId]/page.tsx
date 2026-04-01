'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Letter {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  occasion: string | null
  occasion_label: string | null
  unlock_date: string
  is_opened: boolean | null
  opened_at: string | null
  created_at: string | null
}

const OCCASION_LABELS: Record<string, string> = {
  anniversary: '💍 Anniversary',
  birthday: '🎂 Ulang Tahun',
  wedding_day: '💒 Hari Nikah',
  milestone: '🌟 Milestone',
  new_year: '🎆 Tahun Baru',
  custom: '✉️ Surat Spesial',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function daysUntil(dateStr: string): number {
  const unlock = new Date(dateStr)
  unlock.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((unlock.getTime() - today.getTime()) / 86400000)
}

export default function LetterDetailPage() {
  const router = useRouter()
  const { letterId } = useParams<{ letterId: string }>()

  const [letter, setLetter] = useState<Letter | null>(null)
  const [myId, setMyId] = useState<string | null>(null)
  const [senderName, setSenderName] = useState('Pasangan')
  const [loading, setLoading] = useState(true)
  const [opening, setOpening] = useState(false)
  const [justOpened, setJustOpened] = useState(false)
  const [confetti, setConfetti] = useState(false)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setMyId(user.id)

    const { data } = await supabase.from('letters').select('*').eq('id', letterId).single()
    if (!data) { setLoading(false); return }
    setLetter(data as Letter)

    const { data: sp } = await supabase.from('profiles').select('name').eq('id', data.sender_id).single()
    if (sp?.name) setSenderName(sp.name)
    setLoading(false)
  }, [letterId])

  useEffect(() => { loadData() }, [loadData])

  async function openLetter() {
    if (!letter || !myId || letter.is_opened) return
    setOpening(true)

    const supabase = createClient()
    await supabase.from('letters').update({
      is_opened: true,
      opened_at: new Date().toISOString(),
    }).eq('id', letter.id)

    setLetter(prev => prev ? { ...prev, is_opened: true, opened_at: new Date().toISOString() } : prev)
    setJustOpened(true)
    setConfetti(true)
    setTimeout(() => setConfetti(false), 3000)
    setOpening(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-rose border-t-transparent" /></div>
  }

  if (!letter) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <p className="text-sm text-ink-muted">Surat tidak ditemukan</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-rose">Kembali</button>
      </div>
    )
  }

  const days = daysUntil(letter.unlock_date)
  const isUnlocked = days <= 0
  const isMine = letter.sender_id === myId
  const isOpened = letter.is_opened
  const occasion = letter.occasion ? (OCCASION_LABELS[letter.occasion] ?? '✉️') : '✉️ Surat Rahasia'

  // Sender view: sealed letter preview
  if (isMine && !isOpened) {
    return (
      <div className="animate-fade-in pb-8">
        <div className="border-b border-border bg-white px-6 py-5">
          <button onClick={() => router.back()} className="mb-3 flex items-center gap-1 text-sm text-ink-muted">
            <ArrowLeft className="h-4 w-4" /> Kotak Surat
          </button>
          <h1 className="text-xl font-bold text-ink">Suratmu</h1>
        </div>
        <div className="px-6 pt-8 flex flex-col items-center text-center">
          <div className="mb-4 text-7xl">📬</div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ink-muted">{occasion}</p>
          <p className="mt-2 text-lg font-bold text-ink">Untuk {senderName === (myId ? 'aku' : senderName) ? 'Pasangan' : senderName}</p>
          <div className="mt-4 rounded-2xl border border-border bg-cream px-6 py-4 text-center">
            <Lock className="mx-auto mb-2 h-5 w-5 text-ink-muted" />
            <p className="text-sm text-ink-muted">Bisa dibuka mulai</p>
            <p className="mt-1 text-base font-bold text-ink">{formatDate(letter.unlock_date)}</p>
            {days > 0 && <p className="mt-1 text-xs text-rose font-semibold">{days} hari lagi</p>}
          </div>
          <p className="mt-6 text-xs text-ink-muted max-w-xs">
            Surat sudah dikirim. Pasangan akan menerima notifikasi saat surat terbuka.
          </p>
        </div>
      </div>
    )
  }

  // Receiver view — locked
  if (!isMine && !isUnlocked) {
    return (
      <div className="animate-fade-in pb-8">
        <div className="border-b border-border bg-white px-6 py-5">
          <button onClick={() => router.back()} className="mb-3 flex items-center gap-1 text-sm text-ink-muted">
            <ArrowLeft className="h-4 w-4" /> Kotak Surat
          </button>
        </div>
        <div className="px-6 pt-8 flex flex-col items-center text-center">
          <div
            className="relative mb-4 text-8xl"
            style={{ filter: days <= 7 ? 'drop-shadow(0 0 12px rgba(224,122,158,0.6))' : undefined }}
          >
            🔒
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ink-muted">{occasion}</p>
          <p className="mt-2 text-lg font-bold text-ink">Dari {senderName}</p>
          <div className="mt-4 w-full rounded-2xl bg-rose/5 border border-rose/20 px-6 py-5 text-center">
            <p className="text-sm text-ink-muted">Terkunci sampai</p>
            <p className="mt-1 text-xl font-bold text-ink">{formatDate(letter.unlock_date)}</p>
            <p className="mt-2 text-2xl font-extrabold text-rose">{days} hari lagi</p>
          </div>
          {days <= 7 && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
              <p className="text-sm font-semibold text-amber-700">✨ Hampir terbuka!</p>
              <p className="text-xs text-amber-600 mt-0.5">Surat ini akan terbuka dalam {days} hari</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Open / read state
  return (
    <div className={`animate-fade-in pb-8 ${confetti ? 'relative overflow-hidden' : ''}`}>
      {/* Celebration */}
      {justOpened && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-2">💌</div>
            <p className="text-lg font-bold text-white bg-rose/80 px-4 py-2 rounded-full backdrop-blur-sm">Surat terbuka!</p>
          </div>
        </div>
      )}

      <div className="border-b border-border bg-white px-6 py-5">
        <button onClick={() => router.back()} className="mb-3 flex items-center gap-1 text-sm text-ink-muted">
          <ArrowLeft className="h-4 w-4" /> Kotak Surat
        </button>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{occasion}</p>
        <h1 className="text-xl font-bold text-ink mt-1">
          {isMine ? `Suratmu untuk Pasangan` : `Dari ${senderName}`}
        </h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Ditulis {formatDate(letter.created_at!)} · Dibuka {formatDate(letter.unlock_date)}
        </p>
      </div>

      {/* Unlock prompt if receiver and just unlocked and not yet opened */}
      {!isMine && isUnlocked && !isOpened && (
        <div className="mx-6 mt-6 rounded-2xl bg-gradient-to-br from-rose/10 to-rose/5 border border-rose/30 p-6 text-center">
          <div className="mb-3 text-5xl">💌</div>
          <p className="text-base font-bold text-ink">Surat sudah bisa dibuka!</p>
          <p className="mt-1 text-sm text-ink-muted">Dari {senderName} — untukmu</p>
          <button
            onClick={openLetter}
            disabled={opening}
            className="mt-4 w-full rounded-2xl bg-rose py-3.5 text-sm font-bold text-white shadow-elevated transition-all active:scale-[0.98]"
          >
            {opening ? 'Membuka...' : '💌 Buka Surat'}
          </button>
        </div>
      )}

      {/* Letter content */}
      {(isMine || isOpened) && (
        <div className="mx-6 mt-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink font-[Georgia,serif]">
              {letter.content}
            </p>
          </div>
          {letter.opened_at && !isMine && (
            <p className="mt-3 text-center text-xs text-ink-muted">
              Dibaca pada {formatDate(letter.opened_at)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
