import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Export types for TypeScript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          handle: string;
          push_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          push_token?: string | null;
        };
        Update: {
          push_token?: string | null;
        };
      };
      events: {
        Row: {
          id: string;
          creator: string | null;
          title: string;
          category: string;
          starts_at: string;
          ends_at: string;
          location: unknown; // PostGIS geography type
          created_at: string;
          updated_at: string;
          photo_url: string | null;
          rsvp_count: number;
          reported_count: number;
          is_hidden: boolean;
        };
        Insert: {
          creator: string;
          title: string;
          category: string;
          starts_at: string;
          ends_at: string;
          location: string; // Will be converted to PostGIS
          photo_url?: string | null;
        };
        Update: {
          title?: string;
          category?: string;
          starts_at?: string;
          ends_at?: string;
          photo_url?: string | null;
        };
      };
      event_rsvps: {
        Row: {
          event_id: string;
          profile_id: string;
          created_at: string;
        };
        Insert: {
          event_id: string;
          profile_id: string;
        };
        Update: never;
      };
      event_reports: {
        Row: {
          id: number;
          event_id: string;
          profile_id: string | null;
          reason: string | null;
          details: string | null;
          created_at: string;
        };
        Insert: {
          event_id: string;
          profile_id: string;
          reason: string;
          details?: string | null;
        };
        Update: never;
      };
    };
    Functions: {
      events_nearby: {
        Args: {
          lat: number;
          lng: number;
          radius_m?: number;
          now_cutoff?: string;
        };
        Returns: Array<{
          id: string;
          creator: string | null;
          title: string;
          category: string;
          starts_at: string;
          ends_at: string;
          latitude: number;
          longitude: number;
          created_at: string;
          updated_at: string;
          photo_url: string | null;
          rsvp_count: number;
          reported_count: number;
          distance_m: number;
        }>;
      };
      get_event_with_location: {
        Args: {
          event_id_param: string;
        };
        Returns: Array<{
          id: string;
          creator: string | null;
          title: string;
          category: string;
          starts_at: string;
          ends_at: string;
          latitude: number;
          longitude: number;
          created_at: string;
          updated_at: string;
          photo_url: string | null;
          rsvp_count: number;
          reported_count: number;
          is_hidden: boolean;
        }>;
      };
      toggle_event_rsvp: {
        Args: {
          event_id_param: string;
        };
        Returns: {
          is_rsvped: boolean;
          rsvp_count: number;
        };
      };
      report_event: {
        Args: {
          event_id_param: string;
          reason_param: string;
          details_param?: string;
        };
        Returns: void;
      };
      create_event: {
        Args: {
          title_param: string;
          category_param: string;
          starts_at_param: string;
          ends_at_param: string;
          lat_param: number;
          lng_param: number;
          photo_url_param?: string;
        };
        Returns: string; // event ID
      };
    };
  };
};
