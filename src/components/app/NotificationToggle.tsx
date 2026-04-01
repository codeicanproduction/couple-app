'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff } from 'lucide-react'
import {
  isPushSupported,
  getNotificationPermission,
  enablePushNotifications,
  removePushSubscription,
} from '@/lib/notifications'

export default function NotificationToggle() {
  const [supported, setSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    isPushSupported().then(setSupported)
    getNotificationPermission().then(setPermission)
  }, [])

  async function handleToggle() {
    if (permission === 'granted') {
      // Disable
      setLoading(true)
      await removePushSubscription()
      setPermission('default')
      setLoading(false)
    } else {
      // Enable
      setLoading(true)
      const success = await enablePushNotifications()
      setPermission(success ? 'granted' : 'denied')
      setLoading(false)
    }
  }

  if (!supported) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3.5">
        <div className="flex items-center gap-3">
          <BellOff className="h-4 w-4 text-ink-muted" />
          <div>
            <p className="text-sm font-medium text-ink-muted">Notifikasi</p>
            <p className="text-xs text-ink-muted/60">Tidak didukung browser ini</p>
          </div>
        </div>
      </div>
    )
  }

  const isEnabled = permission === 'granted'
  const isDenied = permission === 'denied'

  return (
    <button
      onClick={handleToggle}
      disabled={loading || isDenied}
      className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3.5 text-left transition-colors hover:bg-cream disabled:opacity-50"
    >
      <div className="flex items-center gap-3">
        {isEnabled
          ? <Bell className="h-4 w-4 text-rose" />
          : <BellOff className="h-4 w-4 text-ink-muted" />
        }
        <div>
          <p className="text-sm font-medium text-ink">Notifikasi Push</p>
          <p className="text-xs text-ink-muted">
            {isDenied
              ? 'Diblokir — aktifkan di pengaturan browser'
              : isEnabled
              ? 'Aktif — pengingat harian & acara penting'
              : 'Aktifkan untuk pengingat tabungan & acara'}
          </p>
        </div>
      </div>

      <div className={`flex h-7 w-12 items-center rounded-full px-0.5 transition-colors ${
        isEnabled ? 'bg-rose' : 'bg-border'
      }`}>
        <div className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
          isEnabled ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </div>
    </button>
  )
}
