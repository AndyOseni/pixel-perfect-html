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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string | null
          date: string | null
          id: string
          ip: string | null
        }
        Insert: {
          action?: string | null
          date?: string | null
          id: string
          ip?: string | null
        }
        Update: {
          action?: string | null
          date?: string | null
          id?: string
          ip?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          member_name: string | null
          member_number: string | null
          read_by_trustee: boolean
          sender_name: string
          sender_role: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          member_name?: string | null
          member_number?: string | null
          read_by_trustee?: boolean
          sender_name: string
          sender_role: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          member_name?: string | null
          member_number?: string | null
          read_by_trustee?: boolean
          sender_name?: string
          sender_role?: string
        }
        Relationships: []
      }
      commodities: {
        Row: {
          category: string | null
          description: string | null
          duration: number | null
          id: string
          name: string
          price: number
          stock: number | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          duration?: number | null
          id: string
          name: string
          price: number
          stock?: number | null
        }
        Update: {
          category?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          name?: string
          price?: number
          stock?: number | null
        }
        Relationships: []
      }
      commodity_items: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          stock: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          stock?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          stock?: number | null
        }
        Relationships: []
      }
      commodity_orders: {
        Row: {
          commodity_id: string | null
          created_at: string | null
          duration: number | null
          id: string
          member_id: string | null
          monthly_amount: number | null
          order_date: string | null
          outstanding: number | null
          paid_months: number | null
          quantity: number | null
          start_month: string | null
          status: string | null
          total_amount: number | null
        }
        Insert: {
          commodity_id?: string | null
          created_at?: string | null
          duration?: number | null
          id: string
          member_id?: string | null
          monthly_amount?: number | null
          order_date?: string | null
          outstanding?: number | null
          paid_months?: number | null
          quantity?: number | null
          start_month?: string | null
          status?: string | null
          total_amount?: number | null
        }
        Update: {
          commodity_id?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          member_id?: string | null
          monthly_amount?: number | null
          order_date?: string | null
          outstanding?: number | null
          paid_months?: number | null
          quantity?: number | null
          start_month?: string | null
          status?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "commodity_orders_commodity_id_fkey"
            columns: ["commodity_id"]
            isOneToOne: false
            referencedRelation: "commodities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commodity_orders_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      commodity_requests: {
        Row: {
          created_at: string | null
          id: string
          item_id: string | null
          member_id: string | null
          quantity: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          member_id?: string | null
          quantity?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          member_id?: string | null
          quantity?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commodity_requests_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "commodity_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commodity_requests_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      guarantor_requests: {
        Row: {
          amount: number
          created_at: string | null
          guarantor_id: string | null
          id: string
          requester_id: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          guarantor_id?: string | null
          id?: string
          requester_id?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          guarantor_id?: string | null
          id?: string
          requester_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guarantor_requests_guarantor_id_fkey"
            columns: ["guarantor_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guarantor_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          created_at: string | null
          duration: number
          guarantor_approvals: Json | null
          guarantor_ids: string[] | null
          id: string
          interest_rate: number | null
          member_id: string | null
          monthly_repayment: number | null
          net_pay: number | null
          outstanding: number | null
          payslip_data_url: string | null
          payslip_name: string | null
          payslip_size: number | null
          payslip_type: string | null
          principal: number
          purpose: string | null
          status: string | null
          total_repayment: number | null
        }
        Insert: {
          created_at?: string | null
          duration: number
          guarantor_approvals?: Json | null
          guarantor_ids?: string[] | null
          id: string
          interest_rate?: number | null
          member_id?: string | null
          monthly_repayment?: number | null
          net_pay?: number | null
          outstanding?: number | null
          payslip_data_url?: string | null
          payslip_name?: string | null
          payslip_size?: number | null
          payslip_type?: string | null
          principal: number
          purpose?: string | null
          status?: string | null
          total_repayment?: number | null
        }
        Update: {
          created_at?: string | null
          duration?: number
          guarantor_approvals?: Json | null
          guarantor_ids?: string[] | null
          id?: string
          interest_rate?: number | null
          member_id?: string | null
          monthly_repayment?: number | null
          net_pay?: number | null
          outstanding?: number | null
          payslip_data_url?: string | null
          payslip_name?: string | null
          payslip_size?: number | null
          payslip_type?: string | null
          principal?: number
          purpose?: string | null
          status?: string | null
          total_repayment?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          created_at: string | null
          employer_number: string | null
          id: string
          ip: string | null
          success: boolean | null
        }
        Insert: {
          created_at?: string | null
          employer_number?: string | null
          id?: string
          ip?: string | null
          success?: boolean | null
        }
        Update: {
          created_at?: string | null
          employer_number?: string | null
          id?: string
          ip?: string | null
          success?: boolean | null
        }
        Relationships: []
      }
      members: {
        Row: {
          created_at: string | null
          email: string | null
          employer_number: string
          grade: string | null
          id: string
          is_first_login: boolean | null
          join_date: string | null
          monthly_savings: number | null
          name: string
          payslip_data_url: string | null
          payslip_date: string | null
          payslip_name: string | null
          payslip_size: number | null
          payslip_type: string | null
          phone: string | null
          pin: string | null
          school: string | null
          status: string | null
          total_savings: number | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          employer_number: string
          grade?: string | null
          id: string
          is_first_login?: boolean | null
          join_date?: string | null
          monthly_savings?: number | null
          name: string
          payslip_data_url?: string | null
          payslip_date?: string | null
          payslip_name?: string | null
          payslip_size?: number | null
          payslip_type?: string | null
          phone?: string | null
          pin?: string | null
          school?: string | null
          status?: string | null
          total_savings?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          employer_number?: string
          grade?: string | null
          id?: string
          is_first_login?: boolean | null
          join_date?: string | null
          monthly_savings?: number | null
          name?: string
          payslip_data_url?: string | null
          payslip_date?: string | null
          payslip_name?: string | null
          payslip_size?: number | null
          payslip_type?: string | null
          phone?: string | null
          pin?: string | null
          school?: string | null
          status?: string | null
          total_savings?: number | null
        }
        Relationships: []
      }
      savings: {
        Row: {
          id: string
          loan_portion: number | null
          member_id: string | null
          month: string
          savings_portion: number | null
          source: string | null
          value: number
        }
        Insert: {
          id: string
          loan_portion?: number | null
          member_id?: string | null
          month: string
          savings_portion?: number | null
          source?: string | null
          value: number
        }
        Update: {
          id?: string
          loan_portion?: number | null
          member_id?: string | null
          month?: string
          savings_portion?: number | null
          source?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "savings_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_history: {
        Row: {
          changed_by: string | null
          date: string | null
          id: string
          member_id: string | null
          new_amount: number | null
          old_amount: number | null
        }
        Insert: {
          changed_by?: string | null
          date?: string | null
          id: string
          member_id?: string | null
          new_amount?: number | null
          old_amount?: number | null
        }
        Update: {
          changed_by?: string | null
          date?: string | null
          id?: string
          member_id?: string | null
          new_amount?: number | null
          old_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "savings_history_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      test: {
        Row: {
          Age: number | null
          id: string
          Name: string
        }
        Insert: {
          Age?: number | null
          id?: string
          Name: string
        }
        Update: {
          Age?: number | null
          id?: string
          Name?: string
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
