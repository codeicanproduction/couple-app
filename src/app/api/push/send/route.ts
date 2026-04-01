import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  // Set VAPID details inside handler so env vars are available at runtime (not build time)
  webpush.setVapidDetails(
    'mailto:admin@coupleapp.id',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { recipientId, title, body, url } = await req.json()
  if (!recipientId || !title || !body) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Fetch all push subscriptions for the recipient
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth_key')
    .eq('profile_id', recipientId)

  if (!subs || subs.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No subscriptions found' })
  }

  const payload = JSON.stringify({ title, body, url: url ?? '/app/home' })
  let sent = 0
  const staleEndpoints: string[] = []

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
          payload
        )
        sent++
      } catch (err: unknown) {
        const status = (err as { statusCode?: number })?.statusCode
        if (status === 404 || status === 410) {
          staleEndpoints.push(sub.endpoint)
        }
      }
    })
  )

  // Clean up stale subscriptions
  if (staleEndpoints.length > 0) {
    await supabase
      .from('push_subscriptions')
      .delete()
      .eq('profile_id', recipientId)
      .in('endpoint', staleEndpoints)
  }

  return NextResponse.json({ sent })
}
