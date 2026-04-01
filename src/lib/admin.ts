import { createClient } from '@/lib/supabase'

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  return data?.role === 'admin'
}

export async function getAdminStats() {
  const supabase = createClient()
  const [
    { count: totalUsers },
    { count: totalCouples },
    { count: totalSessions },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('couples').select('*', { count: 'exact', head: true }),
    supabase.from('deep_talk_progress').select('*', { count: 'exact', head: true }),
  ])
  return { totalUsers, totalCouples, totalSessions }
}
