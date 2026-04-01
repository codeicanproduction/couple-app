export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      assessment_results: {
        Row: {
          answers: Json
          couple_id: string | null
          id: string
          profile_id: string
          scores: Json
          taken_at: string
        }
        Insert: {
          answers: Json
          couple_id?: string | null
          id?: string
          profile_id: string
          scores: Json
          taken_at?: string
        }
        Update: {
          answers?: Json
          couple_id?: string | null
          id?: string
          profile_id?: string
          scores?: Json
          taken_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_results_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_events: {
        Row: {
          budget: number | null
          couple_id: string
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string
          event_scope: string | null
          event_type: string
          id: string
          is_completed: boolean | null
          is_recurring: boolean
          location: string | null
          title: string
        }
        Insert: {
          budget?: number | null
          couple_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date: string
          event_scope?: string | null
          event_type: string
          id?: string
          is_completed?: boolean | null
          is_recurring?: boolean
          location?: string | null
          title: string
        }
        Update: {
          budget?: number | null
          couple_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string
          event_scope?: string | null
          event_type?: string
          id?: string
          is_completed?: boolean | null
          is_recurring?: boolean
          location?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_events_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "couple_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_members: {
        Row: {
          couple_id: string
          id: string
          joined_at: string
          profile_id: string
        }
        Insert: {
          couple_id: string
          id?: string
          joined_at?: string
          profile_id: string
        }
        Update: {
          couple_id?: string
          id?: string
          joined_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_members_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "couple_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_transactions: {
        Row: {
          amount: number
          category: string | null
          couple_id: string
          created_at: string | null
          created_by: string
          goal_id: string | null
          id: string
          note: string | null
          type: string
        }
        Insert: {
          amount: number
          category?: string | null
          couple_id: string
          created_at?: string | null
          created_by: string
          goal_id?: string | null
          id?: string
          note?: string | null
          type: string
        }
        Update: {
          amount?: number
          category?: string | null
          couple_id?: string
          created_at?: string | null
          created_by?: string
          goal_id?: string | null
          id?: string
          note?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_transactions_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "couple_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "couple_transactions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "savings_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      couples: {
        Row: {
          created_at: string
          created_by: string
          id: string
          invite_code: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          invite_code: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          invite_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "couples_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_responses: {
        Row: {
          answer: string
          answered_date: string
          couple_id: string
          created_at: string | null
          id: string
          profile_id: string
          question_index: number
        }
        Insert: {
          answer: string
          answered_date?: string
          couple_id: string
          created_at?: string | null
          id?: string
          profile_id: string
          question_index: number
        }
        Update: {
          answer?: string
          answered_date?: string
          couple_id?: string
          created_at?: string | null
          id?: string
          profile_id?: string
          question_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "daily_responses_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_responses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deep_talk_levels: {
        Row: {
          description: string | null
          id: string
          level_number: number
          pack_id: string
          question_count: number | null
          title: string
        }
        Insert: {
          description?: string | null
          id?: string
          level_number: number
          pack_id: string
          question_count?: number | null
          title: string
        }
        Update: {
          description?: string | null
          id?: string
          level_number?: number
          pack_id?: string
          question_count?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "deep_talk_levels_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "deep_talk_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      deep_talk_packs: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_published: boolean | null
          slug: string
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_published?: boolean | null
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_published?: boolean | null
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      deep_talk_progress: {
        Row: {
          couple_id: string
          current_question_index: number
          id: string
          is_completed: boolean | null
          last_played_at: string | null
          level_number: number
          pack_id: string
          started_at: string | null
        }
        Insert: {
          couple_id: string
          current_question_index?: number
          id?: string
          is_completed?: boolean | null
          last_played_at?: string | null
          level_number?: number
          pack_id: string
          started_at?: string | null
        }
        Update: {
          couple_id?: string
          current_question_index?: number
          id?: string
          is_completed?: boolean | null
          last_played_at?: string | null
          level_number?: number
          pack_id?: string
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deep_talk_progress_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deep_talk_progress_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "deep_talk_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      deep_talk_questions: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          level_id: string
          question_text: string
          sort_order: number | null
          target_partner: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          level_id: string
          question_text: string
          sort_order?: number | null
          target_partner?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          level_id?: string
          question_text?: string
          sort_order?: number | null
          target_partner?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deep_talk_questions_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "deep_talk_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      mbti_results: {
        Row: {
          answers: Json
          couple_id: string | null
          id: string
          mbti_type: string
          profile_id: string
          scores: Json
          taken_at: string | null
        }
        Insert: {
          answers: Json
          couple_id?: string | null
          id?: string
          mbti_type: string
          profile_id: string
          scores: Json
          taken_at?: string | null
        }
        Update: {
          answers?: Json
          couple_id?: string | null
          id?: string
          mbti_type?: string
          profile_id?: string
          scores?: Json
          taken_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mbti_results_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mbti_results_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birthday: string | null
          created_at: string
          id: string
          name: string | null
          onboarding_complete: boolean
          relationship_start_date: string | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          birthday?: string | null
          created_at?: string
          id: string
          name?: string | null
          onboarding_complete?: boolean
          relationship_start_date?: string | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          birthday?: string | null
          created_at?: string
          id?: string
          name?: string | null
          onboarding_complete?: boolean
          relationship_start_date?: string | null
          role?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string
          profile_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh: string
          profile_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_entries: {
        Row: {
          amount: number
          couple_id: string
          created_at: string
          goal_id: string
          id: string
          month: string
          note: string | null
        }
        Insert: {
          amount: number
          couple_id: string
          created_at?: string
          goal_id: string
          id?: string
          month: string
          note?: string | null
        }
        Update: {
          amount?: number
          couple_id?: string
          created_at?: string
          goal_id?: string
          id?: string
          month?: string
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "savings_entries_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "savings_entries_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "savings_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_goals: {
        Row: {
          couple_id: string
          created_at: string
          current_amount: number
          id: string
          name: string
          target_amount: number
          target_date: string | null
        }
        Insert: {
          couple_id: string
          created_at?: string
          current_amount?: number
          id?: string
          name: string
          target_amount: number
          target_date?: string | null
        }
        Update: {
          couple_id?: string
          created_at?: string
          current_amount?: number
          id?: string
          name?: string
          target_amount?: number
          target_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "savings_goals_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      letters: {
        Row: {
          content: string
          couple_id: string
          created_at: string | null
          id: string
          is_opened: boolean | null
          occasion: string | null
          occasion_label: string | null
          opened_at: string | null
          receiver_id: string
          sender_id: string
          unlock_date: string  // timestamptz ISO string
        }
        Insert: {
          content: string
          couple_id: string
          created_at?: string | null
          id?: string
          is_opened?: boolean | null
          occasion?: string | null
          occasion_label?: string | null
          opened_at?: string | null
          receiver_id: string
          sender_id: string
          unlock_date: string  // timestamptz ISO string
        }
        Update: {
          content?: string
          couple_id?: string
          created_at?: string | null
          id?: string
          is_opened?: boolean | null
          occasion?: string | null
          occasion_label?: string | null
          opened_at?: string | null
          receiver_id?: string
          sender_id?: string
          unlock_date?: string  // timestamptz ISO string
        }
        Relationships: [
          {
            foreignKeyName: "letters_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "letters_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "letters_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      miss_you: {
        Row: {
          couple_id: string
          created_at: string
          id: string
          receiver_id: string | null
          responded: boolean | null
          responded_at: string | null
          sender_id: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          id?: string
          receiver_id?: string | null
          responded?: boolean | null
          responded_at?: string | null
          sender_id: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          id?: string
          receiver_id?: string | null
          responded?: boolean | null
          responded_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "miss_you_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miss_you_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          id: string
          couple_id: string
          created_by: string
          partner_id: string | null
          chapter_id: string
          status: string
          rounds: Json
          round_types: string[]
          total_score: number
          created_at: string
          started_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          couple_id: string
          created_by: string
          partner_id?: string | null
          chapter_id?: string
          status?: string
          rounds?: Json
          round_types?: string[]
          total_score?: number
          created_at?: string
          started_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          couple_id?: string
          created_by?: string
          partner_id?: string | null
          chapter_id?: string
          status?: string
          rounds?: Json
          round_types?: string[]
          total_score?: number
          created_at?: string
          started_at?: string | null
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_budget_items: {
        Row: {
          id: string
          couple_id: string
          category: string
          name: string
          estimated_cost: number
          actual_cost: number | null
          is_paid: boolean
          notes: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          category: string
          name: string
          estimated_cost?: number
          actual_cost?: number | null
          is_paid?: boolean
          notes?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          category?: string
          name?: string
          estimated_cost?: number
          actual_cost?: number | null
          is_paid?: boolean
          notes?: string | null
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_budget_items_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_items: {
        Row: {
          couple_id: string
          created_at: string
          id: string
          image_url: string | null
          is_purchased: boolean
          link: string | null
          name: string
          owner_id: string | null
          owner_type: string | null
          price: number | null
        }
        Insert: {
          couple_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_purchased?: boolean
          link?: string | null
          name: string
          owner_id?: string | null
          owner_type?: string | null
          price?: number | null
        }
        Update: {
          couple_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_purchased?: boolean
          link?: string | null
          name?: string
          owner_id?: string | null
          owner_type?: string | null
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_couple_id: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
