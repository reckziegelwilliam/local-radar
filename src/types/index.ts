// Buzzy Type Definitions

// Event Spotting Types
export type SourceType = 'user_created' | 'flyer_spotted';
export type HostRole = 'organizer' | 'performer' | 'staff' | 'venue' | 'other';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface Event {
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
  distance_m?: number;
  
  // Event Spotting fields
  source_type: SourceType;
  spotter_id?: string | null;
  spotter_handle?: string | null;
  host_profile_id?: string | null;
  host_handle?: string | null;
  host_role?: HostRole | null;
  host_contact?: string | null;
  claim_note?: string | null;
  claimed_at?: string | null;
  flyer_photo_url?: string | null;
  confidence_level?: ConfidenceLevel;
  ai_parsed?: boolean;
  needs_confirmation?: string[] | null;
  location_name?: string | null;
  address?: string | null;
}

export interface Profile {
  id: string;
  handle: string;
  push_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRSVP {
  event_id: string;
  profile_id: string;
  created_at: string;
}

export interface EventReport {
  id: number;
  event_id: string;
  profile_id: string | null;
  reason: string | null;
  details: string | null;
  created_at: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface MapRegion extends Location {
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface Category {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

export interface ReportReason {
  id: string;
  label: string;
}

export interface CreateEventData {
  title: string;
  category: string;
  starts_at: string;
  ends_at: string;
  latitude: number;
  longitude: number;
  photo_url?: string;
}

export interface RSVPResponse {
  is_rsvped: boolean;
  rsvp_count: number;
}

export type CategoryId = 'music' | 'cafe' | 'yard' | 'food' | 'wellness' | 'art' | 'sports' | 'other';
export type ReportReasonId = 'spam' | 'inappropriate' | 'fake' | 'wrong_info' | 'other';

// Event Spotting Types

export interface SpotterStats {
  user_id: string;
  events_spotted: number;
  events_claimed_by_organizers: number;
  rsvps_on_spotted_events: number;
  spot_score: number;
  badges: string[];
  rank?: number;
  handle?: string;
  created_at: string;
  updated_at: string;
}

export interface FlyerEventDraft {
  title: string;
  subtitle?: string;
  category: CategoryId;
  starts_at_raw: string;
  ends_at_raw?: string;
  starts_at?: string | null;  // ISO timestamp
  ends_at?: string | null;    // ISO timestamp
  location_name?: string;
  address?: string;
  city_hint?: string;
  price?: string;
  notes?: string;
  confidence: ConfidenceLevel;
  needs_confirmation: ('date' | 'time' | 'location')[];
  category_candidates?: string[];
}

export interface ClaimEventData {
  event_id: string;
  role: HostRole;
  contact?: string;
  note?: string;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requirement: {
    events_spotted?: number;
    events_claimed_by_organizers?: number;
    spot_score?: number;
    custom?: string;
  };
}
