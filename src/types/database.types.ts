export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          primary_color: string | null
          accent_color: string | null
          background_url: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          primary_color?: string | null
          accent_color?: string | null
          background_url?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          primary_color?: string | null
          accent_color?: string | null
          background_url?: string | null
          user_id?: string
          updated_at?: string
        }
      }
      form_sections: {
        Row: {
          id: string
          event_id: string
          title: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          title: string
          description?: string | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          title?: string
          description?: string | null
          order_index?: number
        }
      }
      form_fields: {
        Row: {
          id: string
          section_id: string
          type: string
          label: string
          placeholder: string | null
          required: boolean
          options: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          section_id: string
          type: string
          label: string
          placeholder?: string | null
          required?: boolean
          options?: string | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          type?: string
          label?: string
          placeholder?: string | null
          required?: boolean
          options?: string | null
          order_index?: number
        }
      }
      form_responses: {
        Row: {
          id: string
          event_id: string
          respondent_name: string
          responses: string
          checked_in: boolean
          checked_in_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          respondent_name: string
          responses: string
          checked_in?: boolean
          checked_in_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          respondent_name?: string
          responses?: string
          checked_in?: boolean
          checked_in_at?: string | null
        }
      }
    }
  }
}