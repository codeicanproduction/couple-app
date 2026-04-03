import { createServerSupabaseClient } from '@/lib/supabase-server'
import { daysSince } from '@/lib/dates'
import { getTodayQuestion } from '@/data/dailyQuestions'
import CoupleProfileHero from '@/components/app/CoupleProfileHero'
import MissYouButton from '@/components/app/MissYouButton'
import LettersBanner from '@/components/app/LettersBanner'
import DailyQuestionCard from '@/components/app/DailyQuestionCard'
import QuickAccessGrid from '@/components/app/QuickAccessGrid'
import AIDailyQuestionCard from '@/components/app/AIDailyQuestionCard'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const { data: myMembership } = await supabase
    .from('couple_members').select('couple_id').eq('profile_id', user.id).single()

  let partnerName: string | null = null
  let partnerAvatar: string | null = null
  let partnerId: string | null = null

  if (myMembership?.couple_id) {
    const { data: allMembers } = await supabase
      .from('couple_members').select('profile_id')
      .eq('couple_id', myMembership.couple_id).neq('profile_id', user.id)
    if (allMembers?.[0]) {
      partnerId = allMembers[0].profile_id
      const { data: p } = await supabase
        .from('profiles').select('name, avatar_url').eq('id', allMembers[0].profile_id).single()
      partnerName = p?.name ?? null
      partnerAvatar = p?.avatar_url ?? null
    }
  }

  const daysTogether = profile?.relationship_start_date
    ? daysSince(profile.relationship_start_date) : 0

  const { question, index } = getTodayQuestion()

  return (
    <div className="animate-fade-in">
      {/* ===== COUPLE HERO (big avatars) + KANGEN BUTTON ===== */}
      <CoupleProfileHero
        myName={profile?.name ?? null}
        partnerName={partnerName}
        myAvatarUrl={profile?.avatar_url ?? null}
        partnerAvatarUrl={partnerAvatar}
        daysTogether={daysTogether}
        relationshipStartDate={profile?.relationship_start_date ?? null}
      >
        <MissYouButton
          myId={user.id}
          myName={profile?.name ?? 'Seseorang'}
          partnerId={partnerId}
          coupleId={myMembership?.couple_id ?? null}
        />
      </CoupleProfileHero>

      <div className="space-y-5 pb-6 pt-4">
        {/* ===== SURAT RAHASIA (with notification badge when unread) ===== */}
        <LettersBanner myId={user.id} coupleId={myMembership?.couple_id ?? null} />

        {/* ===== AI DAILY QUESTION ===== */}
        <AIDailyQuestionCard coupleId={myMembership?.couple_id ?? null} />

        {/* ===== DAILY QUESTION (static) ===== */}
        <DailyQuestionCard
          question={question}
          questionIndex={index}
          coupleId={myMembership?.couple_id ?? null}
          userId={user.id}
          userName={profile?.name ?? null}
          partnerId={partnerId}
          partnerName={partnerName}
        />

        {/* ===== QUICK ACCESS 2x2 GRID ===== */}
        <div>
          <p className="mb-2 px-6 text-[10px] font-bold uppercase tracking-widest text-ink-muted/50">
            Akses Cepat
          </p>
          <QuickAccessGrid />
        </div>
      </div>
    </div>
  )
}
