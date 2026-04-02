import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import PetRoom from '@/components/app/PetRoom'

export default async function PetPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Get couple
  const { data: membership } = await supabase
    .from('couple_members')
    .select('couple_id')
    .eq('profile_id', user.id)
    .single()

  if (!membership) redirect('/app/home')

  // Get pet
  const { data: pet } = await supabase
    .from('couple_pets')
    .select('*')
    .eq('couple_id', membership.couple_id)
    .single()

  if (!pet) redirect('/app/pet/adopt')

  // Get mood state
  const { data: moodState } = await supabase
    .from('pet_mood_state')
    .select('*')
    .eq('pet_id', pet.id)
    .single()

  // Get care roles for current user
  const { data: myRoles } = await supabase
    .from('pet_care_roles')
    .select('actions')
    .eq('pet_id', pet.id)
    .eq('profile_id', user.id)
    .single()

  return (
    <PetRoom
      pet={pet}
      moodState={moodState}
      myActions={myRoles?.actions || []}
      userId={user.id}
      coupleId={membership.couple_id}
    />
  )
}
