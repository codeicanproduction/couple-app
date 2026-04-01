'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, MessageCircle, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'

export default function OnboardingInvitePage() {
  const router = useRouter()
  const [inviteCode, setInviteCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInviteCode() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data } = await supabase
        .from('couples')
        .select('invite_code')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data) setInviteCode(data.invite_code)
      setLoading(false)
    }
    loadInviteCode()
  }, [router])

  function copyCode() {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(
      `Bergabunglah denganku di CoupleApp! 💕\nGunakan kode undangan: ${inviteCode}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Undang Pasangan</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Bagikan kode ini ke pasanganmu agar bisa bergabung
        </p>
      </div>

      {/* Invite code display */}
      <div className="mb-6 rounded-2xl border border-rose/20 bg-rose-50 p-6 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Kode Undangan
        </p>
        <p className="font-mono text-4xl font-bold tracking-[0.3em] text-rose">
          {inviteCode}
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={copyCode}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-white py-3.5 text-sm font-semibold text-ink transition-colors hover:border-rose hover:text-rose"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-sage-dark" />
              Tersalin!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Salin Kode
            </>
          )}
        </button>

        <button
          onClick={shareWhatsApp}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" />
          Bagikan via WhatsApp
        </button>
      </div>

      <div className="mt-8">
        <Button onClick={() => router.push('/onboarding/assessment')} variant="secondary" size="lg">
          Lanjut Tanpa Menunggu
        </Button>
      </div>
    </div>
  )
}
