// ─── Profile ─────────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  name: string | null
  birthday: string | null          // ISO date string: "YYYY-MM-DD"
  relationship_start_date: string | null
  avatar_url: string | null
  onboarding_complete: boolean
  created_at: string
}

// ─── Couple ───────────────────────────────────────────────────────────────────

export interface Couple {
  id: string
  created_by: string
  invite_code: string
  created_at: string
}

export interface CoupleMember {
  id: string
  couple_id: string
  profile_id: string
  joined_at: string
}

// Full couple context — both partners
export interface CoupleContext {
  couple: Couple
  myProfile: Profile
  partnerProfile: Profile | null   // null if partner hasn't joined yet
}

// ─── Assessment ───────────────────────────────────────────────────────────────

export interface AssessmentResult {
  id: string
  profile_id: string
  couple_id: string
  answers: Record<number, number | string>
  scores: Record<string, number>   // { komunikasi: 80, nilai_visi: 73, ... }
  taken_at: string
}

// ─── Finance ──────────────────────────────────────────────────────────────────

export interface SavingsGoal {
  id: string
  couple_id: string
  name: string
  target_amount: number
  current_amount: number
  target_date: string | null       // ISO date string
  created_at: string
}

export interface SavingsEntry {
  id: string
  goal_id: string
  couple_id: string
  amount: number
  month: string                    // ISO date string, always first-of-month: "YYYY-MM-01"
  note: string | null
  created_at: string
}

export interface WishlistItem {
  id: string
  couple_id: string
  name: string
  price: number | null
  is_purchased: boolean
  created_at: string
}

// ─── Events / Calendar ────────────────────────────────────────────────────────

export type EventType =
  | 'birthday_partner1'
  | 'birthday_partner2'
  | 'anniversary'
  | 'custom'

export interface CoupleEvent {
  id: string
  couple_id: string
  title: string
  event_date: string               // ISO date string: "YYYY-MM-DD"
  event_type: EventType
  is_recurring: boolean            // true = repeats annually
  created_at: string
}

// ─── Gamification ─────────────────────────────────────────────────────────────

export type RelationshipLevel = 'Benih' | 'Tumbuh' | 'Mekar' | 'Abadi'
