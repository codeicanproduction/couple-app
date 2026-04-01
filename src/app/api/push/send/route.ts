import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    // Auth check — must be logged in
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // VAPID setup
    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY
    if (!vapidPublic || !vapidPrivate) {
      return NextResponse.json({ error: 'Push not configured' }, { status: 500 })
    }
    webpush.setVapidDetails('mailto:admin@coupleapp.id', vapidPublic, vapidPrivate)

    const { recipientId, title, body, url } = await req.json()
    if (!recipientId || !title || !body) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Use service role client to bypass RLS — needed to read any user's subscriptions
    const admin = createServiceRoleClient()

    const { data: subs, error: subsError } = await admin
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth_key')
      .eq('profile_id', recipientId)

    if (subsError) {
      console.error('[push/send] DB error:', subsError.message)
      return NextResponse.json({ error: 'DB error', detail: subsError.message }, { status: 500 })
    }

    if (!subs || subs.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No subscriptions found' })
    }

    const payload = JSON.stringify({ title, body, url: url ?? '/app/home' })
    let sent = 0
    const staleEndpoints: string[] = []

    await Promise.allSettled(
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

    // Clean stale
    if (staleEndpoints.length > 0) {
      await admin
        .from('push_subscriptions')
        .delete()
        .in('endpoint', staleEndpoints)
    }

    return NextResponse.json({ sent, stale: staleEndpoints.length })
  } catch (err: unknown) {
    console.error('[push/send] Unhandled error:', err)
    return NextResponse.json(
      { error: 'Internal error', detail: String(err) },
      { status: 500 }
    )
  }
}
