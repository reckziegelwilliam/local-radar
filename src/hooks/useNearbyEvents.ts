import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Event, Location } from '../types';
import { MAP_CONFIG } from '../utils/constants';

interface UseNearbyEventsResult {
  events: Event[];
  loading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
}

export function useNearbyEvents(
  location: Location | null,
  radius: number = MAP_CONFIG.defaultRadius
): UseNearbyEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.rpc('events_nearby', {
        lat: location.latitude,
        lng: location.longitude,
        radius_m: radius,
      });

      if (fetchError) {
        throw fetchError;
      }

      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching nearby events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [location, radius]);

  const refreshEvents = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refreshEvents,
  };
}
