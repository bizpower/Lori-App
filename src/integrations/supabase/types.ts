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
      billing_profiles: {
        Row: {
          cap: string | null
          citta: string | null
          codice_fiscale: string | null
          codice_sdi: string | null
          cognome: string | null
          created_at: string
          id: string
          indirizzo: string | null
          nome: string | null
          partita_iva: string | null
          pec: string | null
          provincia: string | null
          ragione_sociale: string | null
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cap?: string | null
          citta?: string | null
          codice_fiscale?: string | null
          codice_sdi?: string | null
          cognome?: string | null
          created_at?: string
          id?: string
          indirizzo?: string | null
          nome?: string | null
          partita_iva?: string | null
          pec?: string | null
          provincia?: string | null
          ragione_sociale?: string | null
          tipo?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cap?: string | null
          citta?: string | null
          codice_fiscale?: string | null
          codice_sdi?: string | null
          cognome?: string | null
          created_at?: string
          id?: string
          indirizzo?: string | null
          nome?: string | null
          partita_iva?: string | null
          pec?: string | null
          provincia?: string | null
          ragione_sociale?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_access: {
        Row: {
          access_type: string
          created_at: string
          granted_by: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          access_type?: string
          created_at?: string
          granted_by: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          access_type?: string
          created_at?: string
          granted_by?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      etichette: {
        Row: {
          colore: string
          created_at: string
          id: string
          is_default: boolean
          nome: string
          user_id: string | null
        }
        Insert: {
          colore?: string
          created_at?: string
          id?: string
          is_default?: boolean
          nome: string
          user_id?: string | null
        }
        Update: {
          colore?: string
          created_at?: string
          id?: string
          is_default?: boolean
          nome?: string
          user_id?: string | null
        }
        Relationships: []
      }
      etichette_tabelle: {
        Row: {
          etichetta_id: string
          id: string
          tabella_id: string
        }
        Insert: {
          etichetta_id: string
          id?: string
          tabella_id: string
        }
        Update: {
          etichetta_id?: string
          id?: string
          tabella_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "etichette_tabelle_etichetta_id_fkey"
            columns: ["etichetta_id"]
            isOneToOne: false
            referencedRelation: "etichette"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etichette_tabelle_tabella_id_fkey"
            columns: ["tabella_id"]
            isOneToOne: false
            referencedRelation: "tabelle"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          azienda: string
          created_at: string
          edit_timestamp: string
          etichetta_id: string | null
          id: string
          link_azienda: string | null
          link_profilo: string | null
          lista_id: string
          messaggio_contatto: string | null
          messaggio_retargeting: string | null
          nome: string
          note_contatto: string | null
          note_retargeting: string | null
          user_id: string
        }
        Insert: {
          azienda: string
          created_at?: string
          edit_timestamp?: string
          etichetta_id?: string | null
          id?: string
          link_azienda?: string | null
          link_profilo?: string | null
          lista_id: string
          messaggio_contatto?: string | null
          messaggio_retargeting?: string | null
          nome: string
          note_contatto?: string | null
          note_retargeting?: string | null
          user_id: string
        }
        Update: {
          azienda?: string
          created_at?: string
          edit_timestamp?: string
          etichetta_id?: string | null
          id?: string
          link_azienda?: string | null
          link_profilo?: string | null
          lista_id?: string
          messaggio_contatto?: string | null
          messaggio_retargeting?: string | null
          nome?: string
          note_contatto?: string | null
          note_retargeting?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_etichetta_id_fkey"
            columns: ["etichetta_id"]
            isOneToOne: false
            referencedRelation: "etichette"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_lista_id_fkey"
            columns: ["lista_id"]
            isOneToOne: false
            referencedRelation: "liste"
            referencedColumns: ["id"]
          },
        ]
      }
      liste: {
        Row: {
          created_at: string
          id: string
          nome: string
          operatore_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          operatore_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          operatore_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "liste_operatore_id_fkey"
            columns: ["operatore_id"]
            isOneToOne: false
            referencedRelation: "operatori"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      operatori: {
        Row: {
          created_at: string
          email: string
          id: string
          image_url: string | null
          nome: string
          ruolo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          image_url?: string | null
          nome: string
          ruolo?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          image_url?: string | null
          nome?: string
          ruolo?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_extensions: {
        Row: {
          auto_renew_enabled: boolean
          created_at: string
          extension_trial_end_date: string | null
          extension_trial_start_date: string | null
          extension_trial_used: boolean
          id: string
          next_plan_after_trial: string | null
          payment_method_saved: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew_enabled?: boolean
          created_at?: string
          extension_trial_end_date?: string | null
          extension_trial_start_date?: string | null
          extension_trial_used?: boolean
          id?: string
          next_plan_after_trial?: string | null
          payment_method_saved?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew_enabled?: boolean
          created_at?: string
          extension_trial_end_date?: string | null
          extension_trial_start_date?: string | null
          extension_trial_used?: boolean
          id?: string
          next_plan_after_trial?: string | null
          payment_method_saved?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          admin_reply: string | null
          categoria: string
          created_at: string
          descrizione: string
          id: string
          oggetto: string
          status: string
          updated_at: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          admin_reply?: string | null
          categoria: string
          created_at?: string
          descrizione: string
          id?: string
          oggetto: string
          status?: string
          updated_at?: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          admin_reply?: string | null
          categoria?: string
          created_at?: string
          descrizione?: string
          id?: string
          oggetto?: string
          status?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tabelle: {
        Row: {
          created_at: string
          id: string
          nome: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id: string
          nome: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          user_id?: string | null
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
