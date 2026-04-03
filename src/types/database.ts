/* eslint-disable @typescript-eslint/no-explicit-any */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Permissive table type — allows any column access without type errors
type AnyTable = {
  Row: any
  Insert: any
  Update: any
  Relationships: []
}

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      profiles: AnyTable
      couples: AnyTable
      couple_members: AnyTable
      assessment_results: AnyTable
      couple_events: AnyTable
      savings_goals: AnyTable
      savings_entries: AnyTable
      couple_transactions: AnyTable
      wishlist_items: AnyTable
      couple_pets: AnyTable
      pet_mood_state: AnyTable
      pet_care_roles: AnyTable
      pet_care_logs: AnyTable
      miss_you: AnyTable
      letters: AnyTable
      mbti_results: AnyTable
      game_sessions: AnyTable
      daily_responses: AnyTable
      deep_talk_packs: AnyTable
      deep_talk_levels: AnyTable
      deep_talk_questions: AnyTable
      deep_talk_progress: AnyTable
      push_subscriptions: AnyTable
      wedding_budget_items: AnyTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_couple_id: {
        Args: Record<string, never>
        Returns: string
      }
      [key: string]: any
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
