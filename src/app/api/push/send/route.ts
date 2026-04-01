import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  // Set VAPID details inside handler so env vars are available at runtime (not build time)
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY

  if (!vapidPublic || !vapidPrivate) {
    console.error('[push/send] Missing VAPID env vars')
    return NextResponse.json({ error: 'Push not configured' }, { status: 500 })
  }

  webpush.setVapidDetails('mailto:admin@coupleapp.id', vapidPublic, vapidPrivate)

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.warn('[push/send] Unauthorized request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { recipientId, title, body, url } = await req.json()
  if (!recipientId || !title || !body) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Fetch all push subscriptions for the recipient
  const { data: subs, error: subsError } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth_key')
    .eq('profile_id', recipientId)

  if (subsError) {
    console.error('[push/send] DB error fetching subs:', subsError.message)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  if (!subs || subs.length === 0) {
    console.log(`[push/send] No subscriptions for recipient ${recipientId}`)
    return NextResponse.json({ sent: 0, message: 'No subscriptions found' })
  }

  console.log(`[push/send] Sending to ${subs.length} subscription(s) for ${recipientId}`)

  const payload = JSON.stringify({ title, body, url: url ?? '/app/home' })
  let sent = 0
  const staleEndpoints: string[] = []

  await Promise.all(
    subs.map(async (sub) => {
      try {
        const result = await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
          payload
        )
        console.log(`[push/send] Delivered to ${sub.endpoint.substring(0, 50)}... status: ${result.statusCode}`)
        sent++
      } catch (err: unknown) {
        const status = (err as { statusCode?: number })?.statusCode
        const body = (err as { body?: string })?.body
        console.error(`[push/send] Failed to ${sub.endpoint.substring(0, 50)}...: ${status} ${body}`)
        if (status === 404 || status === 410) {
          staleEndpoints.push(sub.endpoint)
        }
      }
    })
  )

  // Clean up stale subscriptions
  if (staleEndpoints.length > 0) {
    console.log(`[push/send] Removing ${staleEndpoints.length} stale subscriptions`)
    await supabase
      .from('push_subscriptions')
      .delete()
      .eq('profile_id', recipientId)
      .in('endpoint', staleEndpoints)
  }

  console.log(`[push/send] Done. sent=${sent}, stale=${staleEndpoints.length}`)
  return NextResponse.json({ sent, stale: staleEndpoints.length })
}
