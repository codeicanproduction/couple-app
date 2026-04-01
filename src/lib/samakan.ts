'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { RoundResult, RoundType, BroadcastPayload, GameSession } from '@/types/samakan'
import type { Json } from '@/types/database'
import type { RealtimeChannel } from '@supabase/supabase-js'

// ─── SCORING ───

export function scorePilihSama(a: string, b: string): number {
  return a === b ? 20 : 0
}

export function scoreKetikSama(a: string, b: string): number {
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
  return normalize(a) === normalize(b) ? 20 : 0
}

export function scoreHitungBareng(total: number, target: number): number {
  return total === target ? 20 : 0
}

export function scoreTebakPasangan(
  aReal: string, aGuess: string, bReal: string, bGuess: string
): number {
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
  const match1 = norm(aReal) === norm(bGuess) ? 1 : 0
  const match2 = norm(bReal) === norm(aGuess) ? 1 : 0
  if (match1 + match2 === 2) return 20
  if (match1 + match2 === 1) return 10
  return 0
}

export function scoreTapBareng(tsA: number, tsB: number): number {
  const diff = Math.abs(tsA - tsB)
  if (diff < 200) return 20
  if (diff < 500) return 15
  if (diff < 1000) return 10
  return 5
}

export function getScoreForRound(type: RoundType, hostAnswer: unknown, guestAnswer: unknown): number {
  switch (type) {
    case 'pilih_sama': return scorePilihSama(hostAnswer as string, guestAnswer as string)
    case 'ketik_sama': return scoreKetikSama(hostAnswer as string, guestAnswer as string)
    case 'hitung_bareng': return scoreHitungBareng(hostAnswer as number, guestAnswer as number)
    case 'tebak_pasangan': {
      const h = hostAnswer as { real: string; guess: string }
      const g = guestAnswer as { real: string; guess: string }
      return scoreTebakPasangan(h.real, h.guess, g.real, g.guess)
    }
    case 'tap_bareng': return scoreTapBareng(hostAnswer as number, guestAnswer as number)
    default: return 0
  }
}

// ─── DB OPERATIONS ───

export async function createGameSession(
  coupleId: string, createdBy: string, partnerId: string, chapterId: string, roundTypes: string[]
): Promise<string | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from('game_sessions').insert({
    couple_id: coupleId,
    created_by: createdBy,
    partner_id: partnerId,
    chapter_id: chapterId,
    round_types: roundTypes,
    status: 'waiting',
  }).select('id').single()
  if (error) { console.error('createGameSession error:', error); return null }
  return data.id
}

export async function getGameSession(sessionId: string): Promise<GameSession | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()
  return data as GameSession | null
}

export async function updateSessionPlaying(sessionId: string) {
  const supabase = createClient()
  await supabase.from('game_sessions').update({
    status: 'playing',
    started_at: new Date().toISOString(),
  }).eq('id', sessionId)
}

export async function updateSessionRound(sessionId: string, roundResult: RoundResult) {
  const supabase = createClient()
  // Fetch current rounds, append new result
  const { data: session } = await supabase.from('game_sessions').select('rounds').eq('id', sessionId).single()
  const rounds = [...((session?.rounds as unknown as RoundResult[]) ?? []), roundResult]
  await supabase.from('game_sessions').update({ rounds: rounds as unknown as Json[] }).eq('id', sessionId)
}

export async function completeGameSession(sessionId: string, totalScore: number, results: RoundResult[]) {
  const supabase = createClient()
  await supabase.from('game_sessions').update({
    status: 'completed',
    total_score: totalScore,
    rounds: results as unknown as Json[],
    completed_at: new Date().toISOString(),
  }).eq('id', sessionId)
}

export async function getGameHistory(coupleId: string, limit = 10): Promise<GameSession[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('couple_id', coupleId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as unknown as GameSession[]
}

export async function expireStaleSession(coupleId: string) {
  const supabase = createClient()
  const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  await supabase.from('game_sessions').update({ status: 'expired' })
    .eq('couple_id', coupleId)
    .eq('status', 'waiting')
    .lt('created_at', tenMinAgo)
}

// ─── REALTIME HOOK ───

export function useGameChannel(sessionId: string, userId: string) {
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)
  const [isPartnerConnected, setIsPartnerConnected] = useState(false)
  const eventHandlerRef = useRef<((payload: BroadcastPayload) => void) | null>(null)

  useEffect(() => {
    const channel = supabase.channel(`game:${sessionId}`, {
      config: { broadcast: { self: false } },
    })

    channel
      .on('broadcast', { event: 'game_event' }, ({ payload }) => {
        if (eventHandlerRef.current) {
          eventHandlerRef.current(payload as BroadcastPayload)
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const keys = Object.keys(state)
        setIsPartnerConnected(keys.length >= 2)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: userId, online_at: Date.now() })
        }
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId, userId, supabase])

  const broadcast = useCallback((payload: BroadcastPayload) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'game_event',
      payload,
    })
  }, [])

  const onEvent = useCallback((handler: (payload: BroadcastPayload) => void) => {
    eventHandlerRef.current = handler
  }, [])

  return { broadcast, onEvent, isPartnerConnected }
}
