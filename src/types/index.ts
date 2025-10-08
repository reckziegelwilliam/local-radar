// Buzzy Type Definitions

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
export type ReportReasonId = 'spam' | 'inappropriate' | 'fake' | 'other';
