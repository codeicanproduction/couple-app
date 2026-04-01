import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'

// GET /api/push/test — sends a test notification to the current user
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY
    if (!vapidPublic || !vapidPrivate) {
      return NextResponse.json({ error: 'VAPID not configured' }, { status: 500 })
    }
    webpush.setVapidDetails('mailto:admin@coupleapp.id', vapidPublic, vapidPrivate)

    const admin = createServiceRoleClient()
    const { data: subs } = await admin
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth_key')
      .eq('profile_id', user.id)

    if (!subs || subs.length === 0) {
      return NextResponse.json({ error: 'No subscription found. Enable notifications in Profile first.' }, { status: 404 })
    }

    const results = []
    for (const sub of subs) {
      try {
        const r = await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
          JSON.stringify({ title: '🔔 Test Notifikasi', body: 'Notifikasi berhasil! CoupleApp works.', url: '/app/home' })
        )
        results.push({ endpoint: sub.endpoint.substring(0, 40) + '...', status: r.statusCode })
      } catch (e: unknown) {
        results.push({ endpoint: sub.endpoint.substring(0, 40) + '...', error: (e as { statusCode?: number })?.statusCode })
      }
    }

    return NextResponse.json({ userId: user.id, results })
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Internal error', detail: String(err) }, { status: 500 })
  }
}
