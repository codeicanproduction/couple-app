'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface KangenWrapperProps {
  myId: string
  myName: string
  partnerId: string | null
  coupleId: string | null
}

export default function KangenWrapper({ myId, myName, partnerId, coupleId }: KangenWrapperProps) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  if (!coupleId || !partnerId) return null

  async function handleTap() {
    if (sending || sent) return
    setSending(true)

    try {
      const supabase = createClient()
      await supabase.from('miss_you').insert({
        couple_id: coupleId!,
        sender_id: myId,
        receiver_id: partnerId!,
      })

      // Try push notification
      try {
        await fetch('/api/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientId: partnerId,
            title: 'CoupleApp',
            body: `${myName} lagi kangen kamu`,
            url: '/app/home',
          }),
        })
      } catch { /* optional */ }

      setSent(true)
      setTimeout(() => setSent(false), 4000)
    } catch { /* ignore */ }

    setSending(false)
  }

  return (
    <button
      onClick={handleTap}
      disabled={sending}
      className={`group flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all active:scale-95 ${
        sent
          ? 'bg-rose text-white shadow-glow'
          : 'border border-rose/30 bg-white text-rose hover:bg-rose-50'
      }`}
    >
      <Heart
        className={`h-4 w-4 transition-transform ${sent ? 'fill-white scale-110' : 'group-hover:scale-110'}`}
        fill={sent ? 'currentColor' : 'none'}
        strokeWidth={2}
      />
      {sent ? 'Terkirim!' : sending ? '...' : 'Kangen'}
    </button>
  )
}
