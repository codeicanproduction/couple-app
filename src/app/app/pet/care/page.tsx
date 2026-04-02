import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import PetCareScreen from '@/components/app/PetCareScreen'

export default async function CarePage() {
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

  // Get all care roles
  const { data: careRoles } = await supabase
    .from('pet_care_roles')
    .select('*')
    .eq('pet_id', pet.id)

  // Get partner profile
  const { data: partnerMember } = await supabase
    .from('couple_members')
    .select('profile_id')
    .eq('couple_id', membership.couple_id)
    .neq('profile_id', user.id)
    .single()

  let partnerName = 'Partner'
  if (partnerMember) {
    const { data: partnerProfile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', partnerMember.profile_id)
      .single()
    partnerName = partnerProfile?.name || 'Partner'
  }

  return (
    <PetCareScreen
      pet={pet}
      careRoles={careRoles || []}
      userId={user.id}
      partnerId={partnerMember?.profile_id || null}
      partnerName={partnerName}
    />
  )
}
