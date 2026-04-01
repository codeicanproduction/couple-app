import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function InvitePage({ params }: { params: { code: string } }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const code = params.code.toUpperCase()

  if (!user) {
    redirect(`/auth/signup?invite=${code}`)
  }

  // User is authed — check if already in a couple
  const { data: membership } = await supabase
    .from('couple_members')
    .select('id')
    .eq('profile_id', user.id)
    .limit(1)
    .single()

  if (membership) {
    // Already in a couple, go home
    redirect('/app/home')
  }

  // Redirect to onboarding couple step with invite code pre-filled
  redirect(`/onboarding/couple?code=${code}`)
}
