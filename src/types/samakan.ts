export type GameStatus = 'waiting' | 'playing' | 'completed' | 'expired'
export type PlayerRole = 'host' | 'guest'
export type RoundType = 'pilih_sama' | 'ketik_sama' | 'hitung_bareng' | 'tebak_pasangan' | 'tap_bareng'

export type GamePhase =
  | 'connecting'
  | 'lobby'
  | 'countdown'
  | 'story_intro'
  | 'challenge'
  | 'waiting_partner'
  | 'reveal'
  | 'story_bridge'
  | 'story_ending'
  | 'results'

// --- Round Configs ---
export interface PilihSamaConfig {
  type: 'pilih_sama'
  storyPrompt: string
  options: string[] // 4 emoji/text options
}

export interface KetikSamaConfig {
  type: 'ketik_sama'
  storyPrompt: string
  category: string
  timeLimit: number // seconds
}

export interface HitungBarengConfig {
  type: 'hitung_bareng'
  storyPrompt: string
  target: number
}

export interface TebakPasanganConfig {
  type: 'tebak_pasangan'
  storyPrompt: string
  questionForSelf: string
  questionForPartner: string
}

export interface TapBarengConfig {
  type: 'tap_bareng'
  storyPrompt: string
}

export type RoundConfig =
  | PilihSamaConfig
  | KetikSamaConfig
  | HitungBarengConfig
  | TebakPasanganConfig
  | TapBarengConfig

// --- Round Result ---
export interface RoundResult {
  type: RoundType
  roundIndex: number
  config: RoundConfig
  hostAnswer: unknown
  guestAnswer: unknown
  score: number // 0-20
}

// --- Chapter ---
export interface Chapter {
  id: string
  title: string
  subtitle: string
  gradient: string // tailwind gradient classes
  bgClass: string  // dark bg class
  intro: string    // story intro narration
  bridges: string[] // story bridges between rounds (4 total, between 5 rounds)
  endings: {
    high: string   // 80-100%
    mid: string    // 50-79%
    low: string    // 0-49%
  }
  rounds: RoundConfig[]
}

// --- Broadcast Events ---
export type BroadcastPayload =
  | { type: 'player_joined'; playerId: string; name: string; avatarUrl: string | null }
  | { type: 'player_ready'; playerId: string }
  | { type: 'game_start'; rounds: RoundConfig[]; startAt: number }
  | { type: 'round_start'; roundIndex: number }
  | { type: 'player_answer'; playerId: string; roundIndex: number; answer: unknown }
  | { type: 'round_reveal'; roundIndex: number; result: RoundResult }
  | { type: 'game_complete'; totalScore: number; results: RoundResult[] }
  | { type: 'hitung_move'; playerId: string; value: number; runningTotal: number }
  | { type: 'tap_timestamp'; playerId: string; timestamp: number }
  | { type: 'sync_state'; phase: GamePhase; currentRound: number; results: RoundResult[] }
  | { type: 'story_next' }

// --- Game Session (DB row) ---
export interface GameSession {
  id: string
  couple_id: string
  created_by: string
  partner_id: string | null
  chapter_id: string
  status: GameStatus
  rounds: RoundResult[]
  round_types: string[]
  total_score: number
  created_at: string
  started_at: string | null
  completed_at: string | null
}
