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
      admin_users: {
        Row: {
          id: string
          auth_id: string
          role: string
          permissions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id: string
          role?: string
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string
          role?: string
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
      }
      business_inquiries: {
        Row: {
          id: string
          company_name: string
          business_type: string
          contact_name: string
          email: string
          phone: string
          additional_info: string | null
          requirements: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          business_type: string
          contact_name: string
          email: string
          phone: string
          additional_info?: string | null
          requirements?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          business_type?: string
          contact_name?: string
          email?: string
          phone?: string
          additional_info?: string | null
          requirements?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string
          icon: string | null
          sequence: number
          status: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon?: string | null
          sequence?: number
          status?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string | null
          sequence?: number
          status?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      custom_price_quotes: {
        Row: {
          id: string
          user_id: string
          item_name: string
          description: string
          image_url: string[]
          suggested_price: number | null
          status: string
          urgency: string
          created_at: string
          facility_note: string | null
          admin_price: number | null
          admin_note: string | null
          admin_quoted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          item_name: string
          description: string
          image_url?: string[]
          suggested_price?: number | null
          status?: string
          urgency?: string
          created_at?: string
          facility_note?: string | null
          admin_price?: number | null
          admin_note?: string | null
          admin_quoted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          item_name?: string
          description?: string
          image_url?: string[]
          suggested_price?: number | null
          status?: string
          urgency?: string
          created_at?: string
          facility_note?: string | null
          admin_price?: number | null
          admin_note?: string | null
          admin_quoted_at?: string | null
        }
      }
      driver_packages: {
        Row: {
          id: string
          shift_id: string | null
          driver_id: string | null
          facility_id: string | null
          package_date: string
          start_time: string
          end_time: string
          total_orders: number
          status: string
          route_overview: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shift_id?: string | null
          driver_id?: string | null
          facility_id?: string | null
          package_date: string
          start_time: string
          end_time: string
          total_orders?: number
          status?: string
          route_overview?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shift_id?: string | null
          driver_id?: string | null
          facility_id?: string | null
          package_date?: string
          start_time?: string
          end_time?: string
          total_orders?: number
          status?: string
          route_overview?: Json
          created_at?: string
          updated_at?: string
        }
      }
      driver_shifts: {
        Row: {
          id: string
          driver_id: string | null
          start_time: string
          end_time: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          driver_id?: string | null
          start_time: string
          end_time?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          driver_id?: string | null
          start_time?: string
          end_time?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      drivers: {
        Row: {
          id: string
          user_id: string | null
          driver_code: number
          name: string
          email: string | null
          contact_number: string | null
          address: string | null
          license_number: string
          vehicle_type: string
          vehicle_number: string
          status: boolean | null
          notes: string | null
          profile_image: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          driver_code: number
          name: string
          email?: string | null
          contact_number?: string | null
          address?: string | null
          license_number: string
          vehicle_type: string
          vehicle_number: string
          status?: boolean | null
          notes?: string | null
          profile_image?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          driver_code?: number
          name?: string
          email?: string | null
          contact_number?: string | null
          address?: string | null
          license_number?: string
          vehicle_type?: string
          vehicle_number?: string
          status?: boolean | null
          notes?: string | null
          profile_image?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      facilities: {
        Row: {
          id: string
          facility_code: number
          user_identifier: number
          facility_name: string
          logo: string | null
          house_number: string | null
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          zipcode: string | null
          location: string
          latitude: string
          longitude: string
          opening_hour: string | null
          close_hour: string | null
          services_offered: string | null
          contact_number: string | null
          email: string | null
          password: string | null
          owner_name: string | null
          notes: string | null
          radius: number | null
          status: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          facility_code: number
          user_identifier: number
          facility_name: string
          logo?: string | null
          house_number?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          zipcode?: string | null
          location: string
          latitude: string
          longitude: string
          opening_hour?: string | null
          close_hour?: string | null
          services_offered?: string | null
          contact_number?: string | null
          email?: string | null
          password?: string | null
          owner_name?: string | null
          notes?: string | null
          radius?: number | null
          status?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          facility_code?: number
          user_identifier?: number
          facility_name?: string
          logo?: string | null
          house_number?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          zipcode?: string | null
          location?: string
          latitude?: string
          longitude?: string
          opening_hour?: string | null
          close_hour?: string | null
          services_offered?: string | null
          contact_number?: string | null
          email?: string | null
          password?: string | null
          owner_name?: string | null
          notes?: string | null
          radius?: number | null
          status?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      facility_drivers: {
        Row: {
          id: string
          facility_id: string | null
          driver_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          facility_id?: string | null
          driver_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          facility_id?: string | null
          driver_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      items: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string
          price: number | null
          is_custom_price: boolean | null
          is_popular: boolean | null
          sequence: number
          status: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          description: string
          price?: number | null
          is_custom_price?: boolean | null
          is_popular?: boolean | null
          sequence?: number
          status?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          description?: string
          price?: number | null
          is_custom_price?: boolean | null
          is_popular?: boolean | null
          sequence?: number
          status?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          product_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_status_logs: {
        Row: {
          id: string
          order_id: string | null
          status: string
          notes: string | null
          logged_by: string | null
          created_at: string | null
          photos: string[] | null
        }
        Insert: {
          id?: string
          order_id?: string | null
          status: string
          notes?: string | null
          logged_by?: string | null
          created_at?: string | null
          photos?: string[] | null
        }
        Update: {
          id?: string
          order_id?: string | null
          status?: string
          notes?: string | null
          logged_by?: string | null
          created_at?: string | null
          photos?: string[] | null
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          customer_name: string
          email: string
          phone: string | null
          shipping_address: string
          order_date: string | null
          status: string
          payment_method: string | null
          payment_status: string | null
          transaction_id: string | null
          shipping_method: string
          estimated_delivery: string
          special_instructions: string | null
          subtotal: number
          tax: number
          shipping_fee: number
          total_amount: number
          created_at: string | null
          updated_at: string | null
          qr_code: string | null
          assigned_driver_id: string | null
          last_status_update: string | null
          type: string | null
          facility_id: string | null
          latitude: string
          longitude: string
          is_pickup_completed: boolean | null
          is_facility_processing: boolean | null
          is_dropoff_completed: boolean | null
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          customer_name: string
          email: string
          phone?: string | null
          shipping_address: string
          order_date?: string | null
          status?: string
          payment_method?: string | null
          payment_status?: string | null
          transaction_id?: string | null
          shipping_method: string
          estimated_delivery: string
          special_instructions?: string | null
          subtotal: number
          tax?: number
          shipping_fee?: number
          total_amount: number
          created_at?: string | null
          updated_at?: string | null
          qr_code?: string | null
          assigned_driver_id?: string | null
          last_status_update?: string | null
          type?: string | null
          facility_id?: string | null
          latitude: string
          longitude: string
          is_pickup_completed?: boolean | null
          is_facility_processing?: boolean | null
          is_dropoff_completed?: boolean | null
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          customer_name?: string
          email?: string
          phone?: string | null
          shipping_address?: string
          order_date?: string | null
          status?: string
          payment_method?: string | null
          payment_status?: string | null
          transaction_id?: string | null
          shipping_method?: string
          estimated_delivery?: string
          special_instructions?: string | null
          subtotal?: number
          tax?: number
          shipping_fee?: number
          total_amount?: number
          created_at?: string | null
          updated_at?: string | null
          qr_code?: string | null
          assigned_driver_id?: string | null
          last_status_update?: string | null
          type?: string | null
          facility_id?: string | null
          latitude?: string
          longitude?: string
          is_pickup_completed?: boolean | null
          is_facility_processing?: boolean | null
          is_dropoff_completed?: boolean | null
        }
      }
      package_logs: {
        Row: {
          id: string
          package_id: string | null
          event_type: string
          details: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          package_id?: string | null
          event_type: string
          details?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          package_id?: string | null
          event_type?: string
          details?: Json | null
          created_at?: string | null
        }
      }
      package_orders: {
        Row: {
          id: string
          package_id: string | null
          order_id: string | null
          sequence_number: number
          estimated_arrival: string | null
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          package_id?: string | null
          order_id?: string | null
          sequence_number: number
          estimated_arrival?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          package_id?: string | null
          order_id?: string | null
          sequence_number?: number
          estimated_arrival?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          preferences: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          preferences?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          preferences?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      scans: {
        Row: {
          id: string
          order_id: string | null
          scan_type: string
          scanned_by: string | null
          driver_id: string | null
          scan_location: unknown | null
          created_at: string | null
        }
        Insert: {
          id?: string
          order_id?: string | null
          scan_type: string
          scanned_by?: string | null
          driver_id?: string | null
          scan_location?: unknown | null
          created_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string | null
          scan_type?: string
          scanned_by?: string | null
          driver_id?: string | null
          scan_location?: unknown | null
          created_at?: string | null
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string
          short_description: string
          icon: string
          image_url: string | null
          price_starts_at: number
          price_unit: string
          features: string[]
          benefits: string[]
          service_identifier: string
          color_scheme: Json
          sequence: number
          is_popular: boolean | null
          status: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          short_description: string
          icon: string
          image_url?: string | null
          price_starts_at: number
          price_unit: string
          features: string[]
          benefits: string[]
          service_identifier: string
          color_scheme?: Json
          sequence?: number
          is_popular?: boolean | null
          status?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          short_description?: string
          icon?: string
          image_url?: string | null
          price_starts_at?: number
          price_unit?: string
          features?: string[]
          benefits?: string[]
          service_identifier?: string
          color_scheme?: Json
          sequence?: number
          is_popular?: boolean | null
          status?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_addresses: {
        Row: {
          id: string
          user_id: string
          name: string
          street: string
          house_number: string
          additional_info: string | null
          city: string
          postal_code: string
          is_default: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          street: string
          house_number: string
          additional_info?: string | null
          city: string
          postal_code: string
          is_default?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          street?: string
          house_number?: string
          additional_info?: string | null
          city?: string
          postal_code?: string
          is_default?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      user_devices: {
        Row: {
          id: string
          user_id: string | null
          device_id: string | null
          device_os: string | null
          fcm_token: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          device_id?: string | null
          device_os?: string | null
          fcm_token?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          device_id?: string | null
          device_os?: string | null
          fcm_token?: string | null
          created_at?: string | null
          updated_at?: string | null
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

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type UserAddress = Database['public']['Tables']['user_addresses']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Item = Database['public']['Tables']['items']['Row']
export type AdminUser = Database['public']['Tables']['admin_users']['Row']
export type BusinessInquiry = Database['public']['Tables']['business_inquiries']['Row']