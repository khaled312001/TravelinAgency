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
      packages: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          duration_days: number
          destination: string
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          duration_days: number
          destination: string
          image_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          duration_days?: number
          destination?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      package_inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          package_id: string
          package_name: string
          message: string
          created_at: string
          locale: string
          notification_sent: boolean
          notification_id: string | null
          notification_error: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          package_id: string
          package_name: string
          message: string
          created_at?: string
          locale?: string
          notification_sent?: boolean
          notification_id?: string | null
          notification_error?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          package_id?: string
          package_name?: string
          message?: string
          created_at?: string
          locale?: string
          notification_sent?: boolean
          notification_id?: string | null
          notification_error?: string | null
        }
      }
      destination_inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          destination_name: string
          message: string
          created_at: string
          updated_at: string
          locale: string
          notification_sent: boolean
          notification_error: string | null
          notification_attempts: number
        }
        Insert: {
          id?: string
          name: string
          email?: string
          phone: string
          destination_name: string
          message: string
          created_at?: string
          updated_at?: string
          locale?: string
          notification_sent?: boolean
          notification_error?: string | null
          notification_attempts?: number
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          destination_name?: string
          message?: string
          created_at?: string
          updated_at?: string
          locale?: string
          notification_sent?: boolean
          notification_error?: string | null
          notification_attempts?: number
        }
      }
      package_dates: {
        Row: {
          id: string
          package_id: string
          start_date: string
          end_date: string
          available_spots: number
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          start_date: string
          end_date: string
          available_spots: number
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          start_date?: string
          end_date?: string
          available_spots?: number
          created_at?: string
        }
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
  }
}