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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          category_id: string | null
          description: string | null
          image_url: string | null
          phone: string | null
          whatsapp: string | null
          location: string | null
          rating: number
          reviews_count: number
          featured: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          category_id?: string | null
          description?: string | null
          image_url?: string | null
          phone?: string | null
          whatsapp?: string | null
          location?: string | null
          rating?: number
          reviews_count?: number
          featured?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          category_id?: string | null
          description?: string | null
          image_url?: string | null
          phone?: string | null
          whatsapp?: string | null
          location?: string | null
          rating?: number
          reviews_count?: number
          featured?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ads: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          link_url: string | null
          button_text: string | null
          phone: string | null
          is_active: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          link_url?: string | null
          button_text?: string | null
          phone?: string | null
          is_active?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          link_url?: string | null
          button_text?: string | null
          phone?: string | null
          is_active?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          provider_id: string
          user_id: string
          reviewer_name: string | null
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          user_id: string
          reviewer_name?: string | null
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          user_id?: string
          reviewer_name?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_reviews: {
        Row: {
          id: string
          provider_id: string
          provider_name: string | null
          user_id: string
          client_name: string | null
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          provider_name?: string | null
          user_id: string
          client_name?: string | null
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          provider_name?: string | null
          user_id?: string
          client_name?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
