import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import PetMoodScreen from '@/components/app/PetMoodScreen'

export default async function MoodPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: membership } = await supabase
    .from('couple_members')
    .select('couple_id')
    .eq('profile_id', user.id)
    .single()

  if (!membership) redirect('/app/home')

  const { data: pet } = await supabase
    .from('couple_pets')
    .select('*')
    .eq('couple_id', membership.couple_id)
    .single()

  if (!pet) redirect('/app/pet/adopt')

  const { data: moodState } = await supabase
    .from('pet_mood_state')
    .select('*')
    .eq('pet_id', pet.id)
    .single()

  return (
    <PetMoodScreen
      pet={pet}
      moodState={moodState}
    />
  )
}
