import { NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'
import { getChapter } from '@/data/samakan'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { chapterId } = await req.json()
    const chapter = getChapter(chapterId)
    if (!chapter) return NextResponse.json({ error: 'Chapter not found' }, { status: 400 })

    // Get couple info
    const { data: membership } = await supabase
      .from('couple_members').select('couple_id').eq('profile_id', user.id).single()
    if (!membership?.couple_id) return NextResponse.json({ error: 'No couple' }, { status: 400 })

    const { data: partners } = await supabase
      .from('couple_members').select('profile_id')
      .eq('couple_id', membership.couple_id).neq('profile_id', user.id)
    const partnerId = partners?.[0]?.profile_id
    if (!partnerId) return NextResponse.json({ error: 'No partner' }, { status: 400 })

    // Expire stale sessions
    const admin = createServiceRoleClient()
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    await admin.from('game_sessions').update({ status: 'expired' })
      .eq('couple_id', membership.couple_id).eq('status', 'waiting').lt('created_at', tenMinAgo)

    // Check no active session
    const { data: active } = await supabase.from('game_sessions')
      .select('id').eq('couple_id', membership.couple_id)
      .in('status', ['waiting', 'playing']).limit(1)
    if (active && active.length > 0) {
      return NextResponse.json({ sessionId: active[0].id, existing: true })
    }

    // Create session
    const roundTypes = chapter.rounds.map(r => r.type)
    const { data: session, error } = await supabase.from('game_sessions').insert({
      couple_id: membership.couple_id,
      created_by: user.id,
      partner_id: partnerId,
      chapter_id: chapterId,
      round_types: roundTypes,
    }).select('id').single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Get user name for push
    const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single()

    // Push notify partner
    try {
      const webpush = (await import('web-push')).default
      const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      const vapidPrivate = process.env.VAPID_PRIVATE_KEY
      if (vapidPublic && vapidPrivate) {
        webpush.setVapidDetails('mailto:admin@coupleapp.id', vapidPublic, vapidPrivate)
        const { data: subs } = await admin.from('push_subscriptions').select('endpoint, p256dh, auth_key').eq('profile_id', partnerId)
        if (subs) {
          const payload = JSON.stringify({
            title: 'CoupleApp',
            body: `${profile?.name ?? 'Pasanganmu'} ngajak main Samakan!`,
            url: `/app/games/samakan/${session.id}`,
          })
          await Promise.allSettled(subs.map(sub =>
            webpush.sendNotification(
              { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
              payload
            ).catch(() => {})
          ))
        }
      }
    } catch { /* push optional */ }

    return NextResponse.json({ sessionId: session.id })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
