import { createClient } from '@/lib/supabase'
import { CARE_ACTION_META } from '@/types/pet'
import type { CareAction, PetType, PetMood, PetWithMood, PetMoodState } from '@/types/pet'

const supabase = createClient()

export async function getCouplePet(coupleId: string): Promise<PetWithMood | null> {
  const { data: pet } = await supabase
    .from('couple_pets')
    .select('*')
    .eq('couple_id', coupleId)
    .single()

  if (!pet) return null

  const { data: moodState } = await supabase
    .from('pet_mood_state')
    .select('*')
    .eq('pet_id', pet.id)
    .single()

  if (!moodState) return null

  return { ...pet, mood_state: moodState } as PetWithMood
}

export async function getCareRoles(petId: string) {
  const { data } = await supabase
    .from('pet_care_roles')
    .select('*')
    .eq('pet_id', petId)
  return data || []
}

export async function getCareLogsToday(petId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data } = await supabase
    .from('pet_care_logs')
    .select('*')
    .eq('pet_id', petId)
    .gte('done_at', today.toISOString())
    .order('done_at', { ascending: false })

  return data || []
}

export async function getLastCareAction(petId: string, actionType: CareAction) {
  const { data } = await supabase
    .from('pet_care_logs')
    .select('done_at')
    .eq('pet_id', petId)
    .eq('action_type', actionType)
    .order('done_at', { ascending: false })
    .limit(1)
    .single()

  return data?.done_at ? new Date(data.done_at) : null
}

export async function adoptPet(
  coupleId: string,
  petType: PetType,
  name: string,
  userId: string,
  partnerId: string | null
) {
  // Check if couple already has a pet (race condition guard)
  const { data: existing } = await supabase
    .from('couple_pets')
    .select('id')
    .eq('couple_id', coupleId)
    .maybeSingle()

  if (existing) throw new Error('Couple already has a pet')

  // Insert pet
  const { data: pet, error: petError } = await supabase
    .from('couple_pets')
    .insert({ couple_id: coupleId, pet_type: petType, name })
    .select()
    .single()

  if (petError || !pet) throw petError || new Error('Failed to create pet')

  // Insert mood state with explicit updated_at
  const { error: moodError } = await supabase
    .from('pet_mood_state')
    .insert({ pet_id: pet.id, updated_at: new Date().toISOString() })

  if (moodError) {
    // Cleanup pet if mood state fails
    await supabase.from('couple_pets').delete().eq('id', pet.id)
    throw moodError
  }

  // Assign care roles — split 6 actions between partners
  const allActions: CareAction[] = ['feed', 'play', 'bath', 'treat', 'walk', 'cuddle']
  const shuffled = [...allActions].sort(() => Math.random() - 0.5)

  if (partnerId) {
    // Both partners: 3 actions each
    await supabase.from('pet_care_roles').insert([
      { couple_id: coupleId, pet_id: pet.id, profile_id: userId, actions: shuffled.slice(0, 3) },
      { couple_id: coupleId, pet_id: pet.id, profile_id: partnerId, actions: shuffled.slice(3) },
    ])
  } else {
    // Solo user: gets all 6 actions
    await supabase.from('pet_care_roles').insert({
      couple_id: coupleId, pet_id: pet.id, profile_id: userId, actions: allActions,
    })
  }

  return pet
}

export async function performCareAction(
  petId: string,
  actionType: CareAction,
  profileId: string,
  meta: typeof CARE_ACTION_META[CareAction]
) {
  // Server-side cooldown check
  const lastAction = await getLastCareAction(petId, actionType)
  if (lastAction) {
    const cooldownEnd = lastAction.getTime() + meta.cooldownMinutes * 60000
    if (Date.now() < cooldownEnd) {
      throw new Error('Action still on cooldown')
    }
  }

  // Insert care log
  const { error: logError } = await supabase
    .from('pet_care_logs')
    .insert({ pet_id: petId, action_type: actionType, done_by: profileId })

  if (logError) throw logError

  // Get current mood state
  const { data: mood } = await supabase
    .from('pet_mood_state')
    .select('*')
    .eq('pet_id', petId)
    .single()

  if (!mood) return

  // Calculate new stat value
  const stat = meta.stat
  const currentVal = mood[stat] as number
  const newVal = Math.min(100, currentVal + meta.restoreAmount)

  const newHunger = stat === 'hunger' ? newVal : mood.hunger
  const newHappiness = stat === 'happiness' ? newVal : mood.happiness
  const newCleanliness = stat === 'cleanliness' ? newVal : mood.cleanliness
  const newMood = calculateMood(newHunger, newHappiness, newCleanliness)

  // Check thriving_since
  let thrivingSince = mood.thriving_since
  if (newMood === 'thriving' && mood.mood !== 'thriving') {
    thrivingSince = new Date().toISOString()
  } else if (newMood !== 'thriving') {
    thrivingSince = null
  }

  await supabase
    .from('pet_mood_state')
    .update({
      [stat]: newVal,
      mood: newMood,
      thriving_since: thrivingSince,
      updated_at: new Date().toISOString(),
    })
    .eq('pet_id', petId)

  // Add XP to pet
  const { data: pet } = await supabase
    .from('couple_pets')
    .select('xp, level')
    .eq('id', petId)
    .single()

  if (pet) {
    const newXp = pet.xp + 10
    const newLevel = Math.floor(newXp / 100) + 1
    await supabase
      .from('couple_pets')
      .update({ xp: newXp, level: newLevel })
      .eq('id', petId)
  }
}

export function calculateMood(hunger: number, happiness: number, cleanliness: number): PetMood {
  const avg = (hunger + happiness + cleanliness) / 3
  if (avg >= 80) return 'thriving'
  if (avg >= 60) return 'happy'
  if (avg >= 40) return 'neutral'
  if (avg >= 20) return 'lonely'
  return 'sad'
}

export function getDecayedStats(moodState: Pick<PetMoodState, 'hunger' | 'happiness' | 'cleanliness' | 'updated_at'>): {
  hunger: number
  happiness: number
  cleanliness: number
  mood: PetMood
} {
  const now = Date.now()
  const lastUpdate = new Date(moodState.updated_at).getTime()
  const hoursPassed = (now - lastUpdate) / (1000 * 60 * 60)
  const decay = Math.max(0, Math.floor(hoursPassed * 5)) // 5 points per hour, clamped to non-negative

  const hunger = Math.max(0, moodState.hunger - decay)
  const happiness = Math.max(0, moodState.happiness - decay)
  const cleanliness = Math.max(0, moodState.cleanliness - decay)
  const mood = calculateMood(hunger, happiness, cleanliness)

  return { hunger, happiness, cleanliness, mood }
}
