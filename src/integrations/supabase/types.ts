export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      parts_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          location: string
          part_number: string
          quantity: number
          requester: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          location: string
          part_number: string
          quantity: number
          requester: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          location?: string
          part_number?: string
          quantity?: number
          requester?: string
          status?: string
        }
        Relationships: []
      }
      product_entries: {
        Row: {
          created_at: string
          created_by: string
          date: string
          id: string
          inspector: string
          nota_fiscal: string
          part_number: string
          quantity: number
          supplier: string
        }
        Insert: {
          created_at?: string
          created_by: string
          date: string
          id?: string
          inspector: string
          nota_fiscal: string
          part_number: string
          quantity: number
          supplier: string
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          id?: string
          inspector?: string
          nota_fiscal?: string
          part_number?: string
          quantity?: number
          supplier?: string
        }
        Relationships: []
      }
      product_exits: {
        Row: {
          created_at: string
          created_by: string
          date: string
          document_number: string | null
          document_type: string | null
          id: string
          order_number: string | null
          part_number: string
          purchase_responsible: string | null
          quantity: number
          reason: string
          responsible: string
          sector: string[] | null
          vehicle_name: string | null
          vehicle_plate: string | null
          withdrawal_responsible: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          date: string
          document_number?: string | null
          document_type?: string | null
          id?: string
          order_number?: string | null
          part_number: string
          purchase_responsible?: string | null
          quantity: number
          reason: string
          responsible: string
          sector?: string[] | null
          vehicle_name?: string | null
          vehicle_plate?: string | null
          withdrawal_responsible?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          document_number?: string | null
          document_type?: string | null
          id?: string
          order_number?: string | null
          part_number?: string
          purchase_responsible?: string | null
          quantity?: number
          reason?: string
          responsible?: string
          sector?: string[] | null
          vehicle_name?: string | null
          vehicle_plate?: string | null
          withdrawal_responsible?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      tracking: {
        Row: {
          created_at: string
          customer: string
          date: string
          id: string
          nota_fiscal: string
          order_number: string
          order_value: number
          sale_location: string
          tracking_code: string
          tracking_link: string | null
          transport: string
        }
        Insert: {
          created_at?: string
          customer: string
          date: string
          id?: string
          nota_fiscal: string
          order_number: string
          order_value: number
          sale_location: string
          tracking_code: string
          tracking_link?: string | null
          transport: string
        }
        Update: {
          created_at?: string
          customer?: string
          date?: string
          id?: string
          nota_fiscal?: string
          order_number?: string
          order_value?: number
          sale_location?: string
          tracking_code?: string
          tracking_link?: string | null
          transport?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
