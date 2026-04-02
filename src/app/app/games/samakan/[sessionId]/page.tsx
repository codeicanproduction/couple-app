'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { getChapter } from '@/data/samakan'
import {
  getGameSession,
  useGameChannel,
  updateSessionPlaying,
  updateSessionRound,
  completeGameSession,
  getScoreForRound,
} from '@/lib/samakan'
import type {
  GamePhase,
  GameSession,
  PlayerRole,
  RoundResult,
  BroadcastPayload,
  Chapter,
  RoundConfig,
} from '@/types/samakan'

import StoryCard from '@/components/game/StoryCard'
import SamakanLobby from '@/components/game/SamakanLobby'
import SamakanCountdown from '@/components/game/SamakanCountdown'
import SamakanScoreBar from '@/components/game/SamakanScoreBar'
import RoundPilihSama from '@/components/game/RoundPilihSama'
import RoundKetikSama from '@/components/game/RoundKetikSama'
import RoundHitungBareng from '@/components/game/RoundHitungBareng'
import RoundTebakPasangan from '@/components/game/RoundTebakPasangan'
import RoundTapBareng from '@/components/game/RoundTapBareng'
import SamakanReveal from '@/components/game/SamakanReveal'
import SamakanResults from '@/components/game/SamakanResults'

export default function SamakanGamePage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  const supabase = createClient()

  // Core state
  const [session, setSession] = useState<GameSession | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [role, setRole] = useState<PlayerRole>('guest')
  const [myName, setMyName] = useState('')
  const [myAvatar, setMyAvatar] = useState<string | null>(null)
  const [partnerName, setPartnerName] = useState('')
  const [partnerAvatar, setPartnerAvatar] = useState<string | null>(null)
  const [partnerUserId, setPartnerUserId] = useState<string | null>(null)

  // Game state
  const [phase, setPhase] = useState<GamePhase>('connecting')
  const [currentRound, setCurrentRound] = useState(0)
  const [roundResults, setRoundResults] = useState<RoundResult[]>([])
  const [totalScore, setTotalScore] = useState(0)
  const [myAnswer, setMyAnswer] = useState<unknown>(null)
  const [partnerAnswer, setPartnerAnswer] = useState<unknown>(null)

  // Lobby state
  const [isMyReady, setIsMyReady] = useState(false)
  const [isPartnerReady, setIsPartnerReady] = useState(false)

  // HitungBareng state
  const [hitungTotal, setHitungTotal] = useState(0)
  const [hitungTurn, setHitungTurn] = useState<'host' | 'guest'>('host')

  // Refs for callback stability
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  const currentRoundRef = useRef(currentRound)
  currentRoundRef.current = currentRound
  const myAnswerRef = useRef(myAnswer)
  myAnswerRef.current = myAnswer
  const partnerAnswerRef = useRef(partnerAnswer)
  partnerAnswerRef.current = partnerAnswer
  const roundResultsRef = useRef(roundResults)
  roundResultsRef.current = roundResults
  const totalScoreRef = useRef(totalScore)
  totalScoreRef.current = totalScore
  const roleRef = useRef(role)
  roleRef.current = role
  const chapterRef = useRef(chapter)
  chapterRef.current = chapter
  const sessionRef = useRef(session)
  sessionRef.current = session

  // Realtime channel
  const { broadcast, onEvent, isPartnerConnected } = useGameChannel(sessionId, userId || 'init')

  // ─── INIT ───
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)

      // Load profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', user.id)
        .single()
      setMyName(profile?.name ?? 'Kamu')
      setMyAvatar(profile?.avatar_url ?? null)

      // Load session
      const sess = await getGameSession(sessionId)
      if (!sess) { router.push('/app/games/samakan'); return }
      setSession(sess)

      // Determine role
      const isHost = sess.created_by === user.id
      setRole(isHost ? 'host' : 'guest')

      // Load chapter
      const ch = getChapter(sess.chapter_id)
      if (!ch) { router.push('/app/games/samakan'); return }
      setChapter(ch)

      // Load partner profile
      const partnerId = isHost ? sess.partner_id : sess.created_by
      setPartnerUserId(partnerId ?? null)
      if (partnerId) {
        const { data: partnerProfile } = await supabase
          .from('profiles')
          .select('name, avatar_url')
          .eq('id', partnerId)
          .single()
        setPartnerName(partnerProfile?.name ?? 'Pasangan')
        setPartnerAvatar(partnerProfile?.avatar_url ?? null)
      }

      // If session already completed, jump to results
      if (sess.status === 'completed') {
        setRoundResults((sess.rounds ?? []) as RoundResult[])
        setTotalScore(sess.total_score ?? 0)
        setPhase('results')
        return
      }

      // Enter lobby
      setPhase('lobby')

      // Announce self
      broadcast({
        type: 'player_joined',
        playerId: user.id,
        name: profile?.name ?? 'Kamu',
        avatarUrl: profile?.avatar_url ?? null,
      })
    }
    init()
  }, [sessionId])

  // ─── HOST: both ready → start game ───
  useEffect(() => {
    if (role !== 'host' || phase !== 'lobby') return
    if (isMyReady && isPartnerReady && chapter) {
      setPhase('countdown')
      broadcast({
        type: 'game_start',
        rounds: chapter.rounds,
        startAt: Date.now() + 4000,
      })
      updateSessionPlaying(sessionId)
    }
  }, [isMyReady, isPartnerReady, role, phase, chapter])

  // ─── SCORE ROUND (host only) ───
  const scoreAndReveal = useCallback(
    (hostAns: unknown, guestAns: unknown) => {
      const ch = chapterRef.current
      if (!ch) return
      const round = currentRoundRef.current
      const config = ch.rounds[round]
      const score = getScoreForRound(config.type, hostAns, guestAns)
      const result: RoundResult = {
        type: config.type,
        roundIndex: round,
        config,
        hostAnswer: hostAns,
        guestAnswer: guestAns,
        score,
      }

      const newResults = [...roundResultsRef.current, result]
      const newTotal = totalScoreRef.current + score
      setRoundResults(newResults)
      setTotalScore(newTotal)
      setPhase('reveal')

      broadcast({ type: 'round_reveal', roundIndex: round, result })
      updateSessionRound(sessionId, result)

      // After reveal, advance
      setTimeout(() => {
        setMyAnswer(null)
        setPartnerAnswer(null)
        setHitungTotal(0)
        setHitungTurn('host')

        const nextRound = round + 1
        if (nextRound >= ch.rounds.length) {
          // Game complete
          setPhase('story_ending')
          broadcast({ type: 'game_complete', totalScore: newTotal, results: newResults })
          completeGameSession(sessionId, newTotal, newResults)
        } else {
          // Story bridge between rounds
          setCurrentRound(nextRound)
          setPhase('story_bridge')
          broadcast({ type: 'round_start', roundIndex: nextRound })
        }
      }, 3500)
    },
    [sessionId, broadcast],
  )

  // ─── HANDLE MY ANSWER ───
  const handleMyAnswer = useCallback(
    (answer: unknown) => {
      setMyAnswer(answer)
      broadcast({
        type: 'player_answer',
        playerId: userId,
        roundIndex: currentRoundRef.current,
        answer,
      })

      if (roleRef.current === 'host') {
        // Host: check if partner already answered
        const pa = partnerAnswerRef.current
        if (pa !== null) {
          scoreAndReveal(answer, pa)
        }
      }
    },
    [userId, broadcast, scoreAndReveal],
  )

  // ─── HITUNG BARENG MOVE ───
  const handleHitungMove = useCallback(
    (value: number) => {
      const newTotal = hitungTotal + value
      setHitungTotal(newTotal)
      setHitungTurn((t) => (t === 'host' ? 'guest' : 'host'))
      broadcast({ type: 'hitung_move', playerId: userId, value, runningTotal: newTotal })

      const ch = chapterRef.current
      if (!ch) return
      const config = ch.rounds[currentRoundRef.current]
      if (config.type === 'hitung_bareng' && newTotal >= config.target) {
        // Round over — both "answers" are the final total
        setTimeout(() => {
          if (roleRef.current === 'host') {
            scoreAndReveal(newTotal, newTotal)
          }
        }, 1000)
      }
    },
    [hitungTotal, userId, broadcast, scoreAndReveal],
  )

  // ─── BROADCAST EVENT HANDLER ───
  useEffect(() => {
    onEvent((payload: BroadcastPayload) => {
      switch (payload.type) {
        case 'player_joined':
          setPartnerName(payload.name)
          setPartnerAvatar(payload.avatarUrl)
          break

        case 'player_ready':
          setIsPartnerReady(true)
          break

        case 'game_start':
          setPhase('countdown')
          break

        case 'round_start':
          setCurrentRound(payload.roundIndex)
          setMyAnswer(null)
          setPartnerAnswer(null)
          setHitungTotal(0)
          setHitungTurn('host')
          if (phaseRef.current !== 'story_bridge') {
            setPhase('story_bridge')
          }
          break

        case 'player_answer':
          setPartnerAnswer(payload.answer)
          // Host: if I already answered, score
          if (roleRef.current === 'host' && myAnswerRef.current !== null) {
            scoreAndReveal(myAnswerRef.current, payload.answer)
          }
          break

        case 'round_reveal':
          setRoundResults((prev) => {
            if (prev.some((r) => r.roundIndex === payload.roundIndex)) return prev
            return [...prev, payload.result]
          })
          setTotalScore((prev) => prev + payload.result.score)
          setPhase('reveal')
          break

        case 'game_complete':
          setTotalScore(payload.totalScore)
          setRoundResults(payload.results)
          // Will transition to story_ending from reveal timeout for guest
          break

        case 'hitung_move':
          setHitungTotal(payload.runningTotal)
          setHitungTurn((t) => (t === 'host' ? 'guest' : 'host'))
          break

        case 'tap_timestamp':
          setPartnerAnswer(payload.timestamp)
          if (roleRef.current === 'host' && myAnswerRef.current !== null) {
            scoreAndReveal(myAnswerRef.current, payload.timestamp)
          }
          break

        case 'story_next':
          // Host broadcasts this when story card is tapped; guest advances
          advanceFromStory()
          break

        case 'sync_state':
          setPhase(payload.phase)
          setCurrentRound(payload.currentRound)
          setRoundResults(payload.results)
          break
      }
    })
  }, [onEvent, scoreAndReveal])

  // ─── STORY ADVANCE ───
  const advanceFromStory = useCallback(() => {
    const p = phaseRef.current
    if (p === 'story_intro') {
      setPhase('challenge')
    } else if (p === 'story_bridge') {
      setPhase('challenge')
    } else if (p === 'story_ending') {
      setPhase('results')
    }
  }, [])

  const handleStoryNext = useCallback(() => {
    if (roleRef.current === 'host') {
      advanceFromStory()
      broadcast({ type: 'story_next' })
    }
    // Guest taps are ignored; only host drives
  }, [broadcast, advanceFromStory])

  // ─── CLOSE GAME ───
  const handleClose = useCallback(() => {
    router.push('/app/games/samakan')
  }, [router])

  // ─── TAP BARENG HANDLER ───
  const handleTapSubmit = useCallback(
    (timestamp: number) => {
      setMyAnswer(timestamp)
      broadcast({ type: 'tap_timestamp', playerId: userId, timestamp })

      if (roleRef.current === 'host') {
        const pa = partnerAnswerRef.current
        if (pa !== null) {
          scoreAndReveal(timestamp, pa)
        }
      }
    },
    [userId, broadcast, scoreAndReveal],
  )

  // ─── RENDER ───
  if (phase === 'connecting' || !chapter) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-ink to-gray-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
          <p className="text-sm text-white/40">Menghubungkan...</p>
        </div>
      </div>
    )
  }

  if (phase === 'lobby') {
    return (
      <SamakanLobby
        myName={myName}
        myAvatar={myAvatar}
        partnerName={partnerName}
        partnerAvatar={partnerAvatar}
        isPartnerConnected={isPartnerConnected}
        isMyReady={isMyReady}
        isPartnerReady={isPartnerReady}
        sessionId={sessionId}
        partnerId={partnerUserId}
        onReady={() => {
          setIsMyReady(true)
          broadcast({ type: 'player_ready', playerId: userId })
        }}
      />
    )
  }

  if (phase === 'countdown') {
    return (
      <SamakanCountdown
        onComplete={() => {
          setPhase('story_intro')
        }}
      />
    )
  }

  if (phase === 'story_intro') {
    return (
      <StoryCard
        text={chapter.intro}
        gradient={chapter.bgClass}
        onNext={handleStoryNext}
      />
    )
  }

  if (phase === 'story_bridge') {
    const bridgeIndex = currentRound - 1
    const bridgeText = chapter.bridges[bridgeIndex] ?? chapter.bridges[chapter.bridges.length - 1]
    return (
      <StoryCard
        text={bridgeText}
        gradient={chapter.bgClass}
        onNext={handleStoryNext}
      />
    )
  }

  if (phase === 'story_ending') {
    const maxScore = chapter.rounds.length * 20
    const pct = maxScore > 0 ? (totalScore / maxScore) * 100 : 0
    const endingText =
      pct >= 80 ? chapter.endings.high : pct >= 50 ? chapter.endings.mid : chapter.endings.low
    return (
      <StoryCard
        text={endingText}
        gradient={chapter.bgClass}
        onNext={handleStoryNext}
      />
    )
  }

  if (phase === 'reveal' && roundResults.length > 0) {
    const lastResult = roundResults[roundResults.length - 1]
    return (
      <SamakanReveal
        result={lastResult}
        myName={role === 'host' ? myName : partnerName}
        partnerName={role === 'host' ? partnerName : myName}
        onNext={() => {
          // Advance is handled by scoreAndReveal timeout for host,
          // and by broadcast events for guest
        }}
      />
    )
  }

  if (phase === 'results') {
    const maxScore = chapter.rounds.length * 20
    const pct = maxScore > 0 ? (totalScore / maxScore) * 100 : 0
    const endingText =
      pct >= 80 ? chapter.endings.high : pct >= 50 ? chapter.endings.mid : chapter.endings.low
    return (
      <SamakanResults
        totalScore={totalScore}
        results={roundResults}
        ending={endingText}
        chapterTitle={chapter.title}
        onPlayAgain={() => router.push('/app/games/samakan')}
        onBack={() => router.push('/app/games')}
      />
    )
  }

  // ─── CHALLENGE PHASE ───
  if (phase === 'challenge') {
    const config = chapter.rounds[currentRound]
    if (!config) return null

    return (
      <div className={`fixed inset-0 z-50 ${chapter.bgClass}`}>
        <SamakanScoreBar
          currentRound={currentRound}
          totalRounds={chapter.rounds.length}
          totalScore={totalScore}
          onClose={handleClose}
        />

        {config.type === 'pilih_sama' && (
          <RoundPilihSama
            config={config}
            onSubmit={handleMyAnswer}
            disabled={myAnswer !== null}
          />
        )}

        {config.type === 'ketik_sama' && (
          <RoundKetikSama config={config} onSubmit={handleMyAnswer} />
        )}

        {config.type === 'hitung_bareng' && (
          <RoundHitungBareng
            config={config}
            isMyTurn={
              (role === 'host' && hitungTurn === 'host') ||
              (role === 'guest' && hitungTurn === 'guest')
            }
            runningTotal={hitungTotal}
            onMove={handleHitungMove}
          />
        )}

        {config.type === 'tebak_pasangan' && (
          <RoundTebakPasangan
            config={config}
            role={role}
            onSubmit={handleMyAnswer}
          />
        )}

        {config.type === 'tap_bareng' && (
          <RoundTapBareng config={config} onSubmit={handleTapSubmit} />
        )}
      </div>
    )
  }

  // Fallback: waiting partner
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${chapter.bgClass}`}>
      <SamakanScoreBar
        currentRound={currentRound}
        totalRounds={chapter.rounds.length}
        totalScore={totalScore}
        onClose={handleClose}
      />
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-white/60" />
        <p className="text-sm text-white/40">Menunggu pasangan...</p>
      </div>
    </div>
  )
}
