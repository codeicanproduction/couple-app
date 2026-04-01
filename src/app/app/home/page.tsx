import { createServerSupabaseClient } from '@/lib/supabase-server'
import { daysSince } from '@/lib/dates'
import { getTodayQuestion } from '@/data/dailyQuestions'
import CoupleHeader from '@/components/app/CoupleHeader'
import DailyQuestionCard from '@/components/app/DailyQuestionCard'
import SavingsMiniCard from '@/components/app/SavingsMiniCard'
import UpcomingDates from '@/components/app/UpcomingDates'
import WelcomeGuide from '@/components/app/WelcomeGuide'
import DatePlanCard from '@/components/app/DatePlanCard'
import DeepTalkBanner from '@/components/app/DeepTalkBanner'
import MissYouButton from '@/components/app/MissYouButton'
import MissYouToast from '@/components/app/MissYouToast'
import LettersBanner from '@/components/app/LettersBanner'
import { daysUntil, getNextOccurrence } from '@/lib/dates'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch couple members to find partner
  const { data: myMembership } = await supabase
    .from('couple_members')
    .select('couple_id')
    .eq('profile_id', user.id)
    .single()

  let partnerProfile = null
  let partnerMemberId: string | null = null
  let coupleEvents: Array<{ id: string; title: string; event_date: string; event_type: string; is_recurring: boolean }> = []
  let topSavingsGoal = null
  let hasAssessment = false

  if (myMembership?.couple_id) {
    // Get partner
    const { data: allMembers } = await supabase
      .from('couple_members')
      .select('profile_id')
      .eq('couple_id', myMembership.couple_id)
      .neq('profile_id', user.id)

    if (allMembers && allMembers.length > 0) {
      partnerMemberId = allMembers[0].profile_id
      const { data: partner } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', allMembers[0].profile_id)
        .single()
      partnerProfile = partner
    }

    // Get upcoming events
    const { data: events } = await supabase
      .from('couple_events')
      .select('id, title, event_date, event_type, is_recurring')
      .eq('couple_id', myMembership.couple_id)

    coupleEvents = events ?? []

    // Get top savings goal
    const { data: goals } = await supabase
      .from('savings_goals')
      .select('name, current_amount, target_amount')
      .eq('couple_id', myMembership.couple_id)
      .order('target_amount', { ascending: false })
      .limit(1)

    topSavingsGoal = goals?.[0] ?? null

    // Check if user has done assessment
    const { count } = await supabase
      .from('assessment_results')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', user.id)
      .eq('couple_id', myMembership.couple_id)

    hasAssessment = (count ?? 0) > 0
  }

  const daysTogether = profile?.relationship_start_date
    ? daysSince(profile.relationship_start_date)
    : 0

  const { question, index } = getTodayQuestion()

  const hasSavingsGoal = topSavingsGoal !== null
  const hasEvents = coupleEvents.length > 0
  const isNewUser = !hasAssessment && !hasSavingsGoal && !hasEvents

  // Find next upcoming date plan
  const nextDatePlan = coupleEvents
    .filter(e => e.event_type === 'date_plan')
    .map(e => {
      const next = e.is_recurring ? getNextOccurrence(e.event_date) : e.event_date
      return { title: e.title, daysLeft: daysUntil(next) }
    })
    .filter(e => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0] ?? null

  return (
    <div className="animate-fade-in">
      <CoupleHeader
        myName={profile?.name ?? null}
        partnerName={partnerProfile?.name ?? null}
        myAvatarUrl={profile?.avatar_url ?? null}
        partnerAvatarUrl={partnerProfile?.avatar_url ?? null}
        daysTogether={daysTogether}
        relationshipStartDate={profile?.relationship_start_date ?? null}
      />

      <div className="space-y-4 py-5">
        {/* Welcome guide for new users */}
        {isNewUser && (
          <WelcomeGuide
            userName={profile?.name ?? null}
            hasAssessment={hasAssessment}
            hasSavingsGoal={hasSavingsGoal}
            hasEvents={hasEvents}
          />
        )}

        {/* Miss You received toast */}
        <MissYouToast
          myId={user.id}
          myName={profile?.name ?? 'Kamu'}
          partnerId={partnerMemberId}
          partnerName={partnerProfile?.name ?? null}
          coupleId={myMembership?.couple_id ?? null}
        />

        {/* Tombol Kangen */}
        <MissYouButton
          myId={user.id}
          myName={profile?.name ?? 'Seseorang'}
          partnerId={partnerMemberId}
          coupleId={myMembership?.couple_id ?? null}
        />

        <LettersBanner myId={user.id} coupleId={myMembership?.couple_id ?? null} />

        <DeepTalkBanner />

        <DailyQuestionCard
          question={question}
          questionIndex={index}
          coupleId={myMembership?.couple_id ?? null}
          userId={user.id}
          userName={profile?.name ?? null}
          partnerName={partnerProfile?.name ?? null}
        />

        {/* Date plan card — trigger engagement */}
        <DatePlanCard nextDatePlan={nextDatePlan} />

        <SavingsMiniCard
          goalName={topSavingsGoal?.name ?? null}
          currentAmount={topSavingsGoal?.current_amount ?? 0}
          targetAmount={topSavingsGoal?.target_amount ?? 0}
        />

        <UpcomingDates events={coupleEvents} />
      </div>
    </div>
  )
}
