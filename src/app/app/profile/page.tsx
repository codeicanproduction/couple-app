'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Heart, CalendarDays, ClipboardList, ChevronRight, Brain } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { daysSince, formatDateID, getRelationshipLevel } from '@/lib/dates'
import { Button } from '@/components/ui/Button'
import NotificationToggle from '@/components/app/NotificationToggle'
import AvatarUpload from '@/components/app/AvatarUpload'
import MbtiCard from '@/components/app/MbtiCard'
import type { MbtiScores } from '@/data/mbtiQuestions'

interface ProfileData {
  name: string | null
  birthday: string | null
  relationship_start_date: string | null
  avatar_url: string | null
}

interface AssessmentScore {
  dimension: string
  score: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [assessmentScores, setAssessmentScores] = useState<AssessmentScore[]>([])
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [myMbti, setMyMbti] = useState<{ mbti_type: string; scores: MbtiScores } | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    const { data: prof } = await supabase
      .from('profiles')
      .select('name, birthday, relationship_start_date, avatar_url')
      .eq('id', user.id)
      .single()
    setProfile(prof)

    const { data: membership } = await supabase
      .from('couple_members').select('couple_id').eq('profile_id', user.id).single()

    if (membership?.couple_id) {
      const { data: couple } = await supabase
        .from('couples').select('invite_code').eq('id', membership.couple_id).single()
      setInviteCode(couple?.invite_code ?? null)

      const { data: assessment } = await supabase
        .from('assessment_results').select('scores')
        .eq('couple_id', membership.couple_id).eq('profile_id', user.id)
        .order('taken_at', { ascending: false }).limit(1).maybeSingle()

      if (assessment?.scores && typeof assessment.scores === 'object') {
        const scores = assessment.scores as Record<string, number>
        setAssessmentScores(Object.entries(scores).map(([dimension, score]) => ({ dimension, score })))
      }
    }

    // Get own MBTI
    const { data: mbtiData } = await supabase
      .from('mbti_results').select('mbti_type, scores')
      .eq('profile_id', user.id).order('taken_at', { ascending: false }).limit(1).maybeSingle()
    if (mbtiData) setMyMbti(mbtiData as unknown as { mbti_type: string; scores: MbtiScores })

    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-rose border-t-transparent" /></div>
  }

  const daysTogether = profile?.relationship_start_date ? daysSince(profile.relationship_start_date) : null
  const level = daysTogether !== null ? getRelationshipLevel(daysTogether) : null

  return (
    <div className="animate-fade-in pb-6">
      <div className="border-b border-border bg-white px-6 py-5">
        <h1 className="text-xl font-bold text-ink">Profil</h1>
      </div>

      <div className="space-y-4 px-6 pt-6">
        {/* Profile card with avatar upload */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="flex items-center gap-4">
            {userId && (
              <AvatarUpload
                userId={userId}
                currentUrl={profile?.avatar_url ?? null}
                name={profile?.name ?? null}
                size="md"
                editable
                onUploaded={(url) => setProfile(p => p ? { ...p, avatar_url: url } : p)}
              />
            )}
            <div>
              <p className="text-lg font-bold text-ink">{profile?.name ?? 'Pengguna'}</p>
              {profile?.birthday && (
                <p className="text-xs text-ink-muted">Lahir: {formatDateID(profile.birthday)}</p>
              )}
            </div>
          </div>

          {daysTogether !== null && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-rose-50 px-4 py-3">
              <Heart className="h-4 w-4 text-rose" strokeWidth={2} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{daysTogether} hari bersama</p>
                {profile?.relationship_start_date && (
                  <p className="text-xs text-ink-muted">Sejak {formatDateID(profile.relationship_start_date)}</p>
                )}
              </div>
              {level && (
                <span className="rounded-full bg-rose/10 px-3 py-1 text-xs font-bold text-rose">{level}</span>
              )}
            </div>
          )}
        </div>

        {/* Invite code */}
        {inviteCode && (
          <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">Kode Undangan Pasangan</p>
            <p className="font-mono text-lg font-bold tracking-wider text-rose">{inviteCode}</p>
          </div>
        )}

        {/* Assessment results */}
        {assessmentScores.length > 0 && (
          <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <ClipboardList className="h-4 w-4 text-rose" strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Hasil Assessment Terakhir</span>
            </div>
            <div className="p-4 space-y-3">
              {assessmentScores.map(({ dimension, score }) => (
                <div key={dimension}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-ink">{dimension}</span>
                    <span className="text-sm font-bold text-ink">{score}/5</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-rose transition-all" style={{ width: `${(score / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MBTI Result */}
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Kepribadian MBTI</h2>
          {myMbti ? (
            <MbtiCard mbtiType={myMbti.mbti_type} scores={myMbti.scores}
              showLink linkHref="/app/partner/mbti" />
          ) : (
            <button onClick={() => router.push('/app/partner/mbti')}
              className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-purple-200 bg-purple-50/30 p-5 text-left transition-all hover:bg-purple-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100">
                <Brain className="h-6 w-6 text-purple-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">Tes MBTI</p>
                <p className="text-xs text-ink-muted">20 pertanyaan, kenali kepribadianmu</p>
              </div>
              <ChevronRight className="h-4 w-4 text-purple-400" />
            </button>
          )}
        </div>

        <NotificationToggle />

        {/* Quick links */}
        <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
          <button onClick={() => router.push('/app/partner/mbti')}
            className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left hover:bg-cream">
            <div className="flex items-center gap-3">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-ink">{myMbti ? 'Tes Ulang MBTI' : 'Tes MBTI'}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-ink-muted" />
          </button>
          <button onClick={() => router.push('/app/assessment')}
            className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left hover:bg-cream">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-4 w-4 text-ink-muted" />
              <span className="text-sm font-medium text-ink">{assessmentScores.length > 0 ? 'Ulangi Assessment' : 'Mulai Assessment'}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-ink-muted" />
          </button>
          <button onClick={() => router.push('/app/calendar')}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-cream">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-ink-muted" />
              <span className="text-sm font-medium text-ink">Kelola Tanggal Penting</span>
            </div>
            <ChevronRight className="h-4 w-4 text-ink-muted" />
          </button>
        </div>

        <Button onClick={handleSignOut} loading={signingOut} variant="danger" size="lg">
          <span className="flex items-center gap-2"><LogOut className="h-4 w-4" /> Keluar</span>
        </Button>
      </div>
    </div>
  )
}
