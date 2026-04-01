import { createClient } from './supabase'

/** Generate a random 8-character alphanumeric invite code */
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/** Create a new couple and add the creator as first member */
export async function createCouple(userId: string) {
  const supabase = createClient()

  // Retry up to 3 times on invite code collision (unique constraint)
  let couple = null
  let lastError: string | null = null
  for (let attempt = 0; attempt < 3; attempt++) {
    const invite_code = generateInviteCode()
    const { data, error: coupleError } = await supabase
      .from('couples')
      .insert({ created_by: userId, invite_code })
      .select()
      .single()

    if (!coupleError && data) { couple = data; break }
    lastError = coupleError?.message ?? 'Failed to create couple'
    // Only retry on unique violation (code 23505)
    if (coupleError?.code !== '23505') break
  }

  if (!couple) throw new Error(lastError ?? 'Failed to create couple')

  const { error: memberError } = await supabase
    .from('couple_members')
    .insert({ couple_id: couple.id, profile_id: userId })

  if (memberError) throw new Error(memberError.message)

  // Auto-seed calendar events from profile data
  await seedCalendarEvents(userId, couple.id)

  return couple
}

/** Join an existing couple via invite code */
export async function joinCouple(inviteCode: string, userId: string) {
  const supabase = createClient()

  const { data: couple, error: findError } = await supabase
    .from('couples')
    .select('id')
    .eq('invite_code', inviteCode.toUpperCase())
    .single()

  if (findError || !couple) throw new Error('Kode undangan tidak ditemukan')

  const { data: existing } = await supabase
    .from('couple_members')
    .select('id')
    .eq('couple_id', couple.id)
    .eq('profile_id', userId)
    .single()

  if (existing) throw new Error('Kamu sudah bergabung dengan pasangan ini')

  const { count } = await supabase
    .from('couple_members')
    .select('*', { count: 'exact', head: true })
    .eq('couple_id', couple.id)

  if ((count ?? 0) >= 2) throw new Error('Pasangan ini sudah penuh')

  const { error: joinError } = await supabase
    .from('couple_members')
    .insert({ couple_id: couple.id, profile_id: userId })

  if (joinError) throw new Error(joinError.message)

  // Auto-seed calendar events from this user's profile too
  await seedCalendarEvents(userId, couple.id)

  return couple
}

/** Auto-create birthday + anniversary events from user profile */
async function seedCalendarEvents(userId: string, coupleId: string) {
  const supabase = createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, birthday, relationship_start_date')
    .eq('id', userId)
    .single()

  if (!profile) return

  const events: Array<{
    couple_id: string
    title: string
    event_date: string
    event_type: string
    is_recurring: boolean
    event_scope: string
    created_by: string
  }> = []

  if (profile.birthday) {
    events.push({
      couple_id: coupleId,
      title: `Ulang Tahun ${profile.name ?? 'Pasangan'}`,
      event_date: profile.birthday,
      event_type: 'birthday',
      is_recurring: true,
      event_scope: 'couple',
      created_by: userId,
    })
  }

  if (profile.relationship_start_date) {
    // Only add anniversary if not already seeded by the other partner
    const { count } = await supabase
      .from('couple_events')
      .select('*', { count: 'exact', head: true })
      .eq('couple_id', coupleId)
      .eq('event_type', 'anniversary')

    if ((count ?? 0) === 0) {
      events.push({
        couple_id: coupleId,
        title: 'Anniversary',
        event_date: profile.relationship_start_date,
        event_type: 'anniversary',
        is_recurring: true,
        event_scope: 'couple',
        created_by: userId,
      })
    }
  }

  if (events.length > 0) {
    await supabase.from('couple_events').insert(events)
  }
}
