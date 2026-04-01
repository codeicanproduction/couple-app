'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Heart, Link2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { createCouple, joinCouple } from '@/lib/couple'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Suspense } from 'react'

type Mode = 'choose' | 'create' | 'join'

function CouplePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefilledCode = searchParams.get('code') ?? ''
  const [mode, setMode] = useState<Mode>(prefilledCode ? 'join' : 'choose')
  const [inviteCode, setInviteCode] = useState(prefilledCode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      await createCouple(user.id)
      router.push('/onboarding/invite')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : (e as { message?: string })?.message ?? 'Gagal membuat pasangan'
      setError(msg)
      setLoading(false)
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteCode.trim()) { setError('Masukkan kode undangan'); return }
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      await joinCouple(inviteCode.trim(), user.id)
      router.push('/onboarding/install')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal bergabung')
      setLoading(false)
    }
  }

  if (mode === 'choose') {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink">Hubungkan Pasangan</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Buat akun bersama atau bergabung dengan undangan
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setMode('create')}
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white p-4 text-left transition-colors hover:border-rose hover:bg-rose-50"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50">
              <Heart className="h-5 w-5 text-rose" strokeWidth={2} />
            </div>
            <div>
              <p className="font-semibold text-ink">Buat Pasangan Baru</p>
              <p className="text-sm text-ink-muted">Undang pasanganmu dengan kode</p>
            </div>
          </button>

          <button
            onClick={() => setMode('join')}
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white p-4 text-left transition-colors hover:border-rose hover:bg-rose-50"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-sage/20">
              <Link2 className="h-5 w-5 text-sage-dark" strokeWidth={2} />
            </div>
            <div>
              <p className="font-semibold text-ink">Gabung dengan Kode</p>
              <p className="text-sm text-ink-muted">Sudah punya kode undangan</p>
            </div>
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'create') {
    return (
      <div className="animate-fade-in">
        <button
          onClick={() => setMode('choose')}
          className="mb-6 text-sm font-medium text-ink-muted hover:text-ink"
        >
          ← Kembali
        </button>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink">Buat Pasangan Baru</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Kamu akan mendapat kode undangan untuk dibagikan ke pasangan
          </p>
        </div>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        <Button onClick={handleCreate} loading={loading} size="lg">
          Buat Sekarang
        </Button>
      </div>
    )
  }

  // mode === 'join'
  return (
    <div className="animate-fade-in">
      <button
        onClick={() => setMode('choose')}
        className="mb-6 text-sm font-medium text-ink-muted hover:text-ink"
      >
        ← Kembali
      </button>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Masukkan Kode</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Masukkan kode undangan dari pasanganmu
        </p>
      </div>

      <form onSubmit={handleJoin} className="space-y-4">
        <Input
          label="Kode Undangan"
          type="text"
          placeholder="Contoh: ABCD1234"
          value={inviteCode}
          onChange={e => setInviteCode(e.target.value.toUpperCase())}
          required
          autoComplete="off"
          error={error}
        />
        <div className="pt-2">
          <Button type="submit" loading={loading} size="lg">
            Gabung
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function OnboardingCouplePage() {
  return (
    <Suspense>
      <CouplePage />
    </Suspense>
  )
}
