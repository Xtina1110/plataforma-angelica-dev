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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      articulos_blog: {
        Row: {
          autor: string
          contenido: string
          created_at: string | null
          fecha: string
          id: number
          imagen: string | null
          resumen: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          autor: string
          contenido: string
          created_at?: string | null
          fecha?: string
          id?: number
          imagen?: string | null
          resumen: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          autor?: string
          contenido?: string
          created_at?: string | null
          fecha?: string
          id?: number
          imagen?: string | null
          resumen?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          created_at: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          operation: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      availability_schedules: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
          therapist_id: string | null
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
          therapist_id?: string | null
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
          therapist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_schedules_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_reminders: {
        Row: {
          booking_id: string | null
          created_at: string
          error_message: string | null
          id: string
          message: string
          reminder_type: string
          scheduled_time: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          message: string
          reminder_type: string
          scheduled_time: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          message?: string
          reminder_type?: string
          scheduled_time?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_reminders_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          created_at: string
          duration: number
          end_time: string
          id: string
          notes: string | null
          payment_id: string | null
          payment_status: string | null
          reminder_preferences: Json | null
          service_id: string | null
          start_time: string
          status: string | null
          therapist_id: string | null
          therapist_notes: string | null
          total_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_date: string
          created_at?: string
          duration: number
          end_time: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string | null
          reminder_preferences?: Json | null
          service_id?: string | null
          start_time: string
          status?: string | null
          therapist_id?: string | null
          therapist_notes?: string | null
          total_price: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          created_at?: string
          duration?: number
          end_time?: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string | null
          reminder_preferences?: Json | null
          service_id?: string | null
          start_time?: string
          status?: string | null
          therapist_id?: string | null
          therapist_notes?: string | null
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      episodios_podcast: {
        Row: {
          created_at: string | null
          descripcion: string
          fecha_publicacion: string
          id: number
          imagen: string | null
          link_youtube: string
          numero: number
          titulo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion: string
          fecha_publicacion?: string
          id?: number
          imagen?: string | null
          link_youtube: string
          numero: number
          titulo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string
          fecha_publicacion?: string
          id?: number
          imagen?: string | null
          link_youtube?: string
          numero?: number
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          benefits: string[] | null
          category: string
          created_at: string
          description: string | null
          duration: number
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          benefits?: string[] | null
          category: string
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          benefits?: string[] | null
          category?: string
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      therapists: {
        Row: {
          bio: string | null
          created_at: string
          experience_years: number | null
          hourly_rate: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          languages: string[] | null
          name: string
          rating: number | null
          specialties: string[] | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          languages?: string[] | null
          name: string
          rating?: number | null
          specialties?: string[] | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          languages?: string[] | null
          name?: string
          rating?: number | null
          specialties?: string[] | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          apellidos: string | null
          ciudad: string | null
          codigo_postal: string | null
          contacto_preferido: string | null
          created_at: string
          direccion: string | null
          email: string | null
          estado: string | null
          id: string
          idioma: string | null
          nacimiento: string | null
          nombre: string | null
          pais: string | null
          rol: string
          telefono: string | null
        }
        Insert: {
          apellidos?: string | null
          ciudad?: string | null
          codigo_postal?: string | null
          contacto_preferido?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          estado?: string | null
          id?: string
          idioma?: string | null
          nacimiento?: string | null
          nombre?: string | null
          pais?: string | null
          rol?: string
          telefono?: string | null
        }
        Update: {
          apellidos?: string | null
          ciudad?: string | null
          codigo_postal?: string | null
          contacto_preferido?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          estado?: string | null
          id?: string
          idioma?: string | null
          nacimiento?: string | null
          nombre?: string | null
          pais?: string | null
          rol?: string
          telefono?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_role: {
        Args: { new_role: string; target_user_id: string }
        Returns: boolean
      }
      get_user_role: {
        Args: { user_id?: string }
        Returns: string
      }
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
