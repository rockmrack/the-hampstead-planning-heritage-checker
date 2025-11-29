/**
 * Database Type Definitions
 * Generated types for Supabase database schema
 */

export interface Database {
  public: {
    Tables: {
      listed_buildings: {
        Row: {
          id: number;
          list_entry_number: string;
          name: string;
          grade: 'I' | 'II*' | 'II';
          location: unknown; // PostGIS geography type
          hyperlink: string | null;
          description: string | null;
          borough: string | null;
          date_designated: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          list_entry_number: string;
          name: string;
          grade: 'I' | 'II*' | 'II';
          location: unknown;
          hyperlink?: string | null;
          description?: string | null;
          borough?: string | null;
          date_designated?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          list_entry_number?: string;
          name?: string;
          grade?: 'I' | 'II*' | 'II';
          location?: unknown;
          hyperlink?: string | null;
          description?: string | null;
          borough?: string | null;
          date_designated?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      conservation_areas: {
        Row: {
          id: number;
          name: string;
          borough: string;
          boundary: unknown; // PostGIS geography type
          has_article_4: boolean;
          article_4_details: string | null;
          designation_date: string | null;
          character_appraisal_url: string | null;
          management_plan_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          borough: string;
          boundary: unknown;
          has_article_4?: boolean;
          article_4_details?: string | null;
          designation_date?: string | null;
          character_appraisal_url?: string | null;
          management_plan_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          borough?: string;
          boundary?: unknown;
          has_article_4?: boolean;
          article_4_details?: string | null;
          designation_date?: string | null;
          character_appraisal_url?: string | null;
          management_plan_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      search_logs: {
        Row: {
          id: string;
          address_input: string;
          postcode: string | null;
          result_status: 'RED' | 'AMBER' | 'GREEN';
          user_email: string | null;
          latitude: number | null;
          longitude: number | null;
          borough: string | null;
          conservation_area_id: number | null;
          listed_building_id: number | null;
          user_agent: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          address_input: string;
          postcode?: string | null;
          result_status: 'RED' | 'AMBER' | 'GREEN';
          user_email?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          borough?: string | null;
          conservation_area_id?: number | null;
          listed_building_id?: number | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          address_input?: string;
          postcode?: string | null;
          result_status?: 'RED' | 'AMBER' | 'GREEN';
          user_email?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          borough?: string | null;
          conservation_area_id?: number | null;
          listed_building_id?: number | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          search_id: string | null;
          source: string;
          property_address: string | null;
          property_status: 'RED' | 'AMBER' | 'GREEN' | null;
          marketing_consent: boolean;
          created_at: string;
          converted: boolean;
          converted_at: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          search_id?: string | null;
          source: string;
          property_address?: string | null;
          property_status?: 'RED' | 'AMBER' | 'GREEN' | null;
          marketing_consent: boolean;
          created_at?: string;
          converted?: boolean;
          converted_at?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          phone?: string | null;
          search_id?: string | null;
          source?: string;
          property_address?: string | null;
          property_status?: 'RED' | 'AMBER' | 'GREEN' | null;
          marketing_consent?: boolean;
          created_at?: string;
          converted?: boolean;
          converted_at?: string | null;
          notes?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_listed_building_proximity: {
        Args: {
          lng: number;
          lat: number;
          radius_meters: number;
        };
        Returns: {
          id: number;
          list_entry_number: string;
          name: string;
          grade: string;
          hyperlink: string;
          distance_meters: number;
        }[];
      };
      check_conservation_area: {
        Args: {
          lng: number;
          lat: number;
        };
        Returns: {
          id: number;
          name: string;
          borough: string;
          has_article_4: boolean;
          article_4_details: string;
        }[];
      };
      get_conservation_area_geojson: {
        Args: {
          area_id: number;
        };
        Returns: string;
      };
    };
    Enums: {
      property_status: 'RED' | 'AMBER' | 'GREEN';
      listed_grade: 'I' | 'II*' | 'II';
    };
  };
}
