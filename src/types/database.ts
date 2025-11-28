export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string
          id: string
          partner_id: string
          task_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          partner_id: string
          task_id: string
        }
        Update: {
          created_at?: string
          id?: string
          partner_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_partner_id_fkey"
            columns: ["partner_id"]
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          }
        ]
      }
      households: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          avatar_url: string | null
          created_at: string
          household_id: string
          id: string
          name: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          household_id: string
          id?: string
          name: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          household_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "partners_household_id_fkey"
            columns: ["household_id"]
            referencedRelation: "households"
            referencedColumns: ["id"]
          }
        ]
      }
      task_completions: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          partner_id: string
          points_earned: number
          task_id: string
        }
        Insert: {
          completed_at: string
          created_at?: string
          id?: string
          partner_id: string
          points_earned: number
          task_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          partner_id?: string
          points_earned?: number
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_completions_partner_id_fkey"
            columns: ["partner_id"]
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_completions_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          }
        ]
      }
      task_points_history: {
        Row: {
          apply_retroactive: boolean
          changed_at: string
          id: string
          new_points: number
          old_points: number
          task_id: string
        }
        Insert: {
          apply_retroactive: boolean
          changed_at?: string
          id?: string
          new_points: number
          old_points: number
          task_id: string
        }
        Update: {
          apply_retroactive?: boolean
          changed_at?: string
          id?: string
          new_points?: number
          old_points?: number
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_points_history_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          created_at: string
          household_id: string
          id: string
          is_deleted: boolean | null
          is_template: boolean | null
          name: string
          points: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          household_id: string
          id?: string
          is_deleted?: boolean | null
          is_template?: boolean | null
          name: string
          points: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          household_id?: string
          id?: string
          is_deleted?: boolean | null
          is_template?: boolean | null
          name?: string
          points?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_household_id_fkey"
            columns: ["household_id"]
            referencedRelation: "households"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
