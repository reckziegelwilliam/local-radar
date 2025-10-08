import { useState, useEffect, useCallback } from 'react';
import { LocationService } from '../services/LocationService';
import { Location, MapRegion } from '../types';
import { DEFAULT_LOCATION } from '../utils/constants';

interface UseLocationResult {
  location: Location | null;
  region: MapRegion;
  loading: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
  hasPermission: boolean;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<Location | null>(null);
  const [region, setRegion] = useState<MapRegion>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const requestLocationPermission = useCallback(async () => {
    try {
      const permission = await LocationService.requestPermissions();
      setHasPermission(permission);
      return permission;
    } catch (err) {
      console.error('Error requesting location permission:', err);
      setError('Failed to request location permission');
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentLocation = await LocationService.getCurrentLocation();
      setLocation(currentLocation);
      
      const newRegion: MapRegion = {
        ...currentLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(newRegion);
    } catch (err) {
      console.error('Error getting current location:', err);
      setError('Failed to get current location');
      // Use default location on error
      setLocation(DEFAULT_LOCATION);
      setRegion(DEFAULT_LOCATION);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    await getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    const initializeLocation = async () => {
      const permission = await requestLocationPermission();
      if (permission) {
        await getCurrentLocation();
      } else {
        // Use default location if permission denied
        setLocation(DEFAULT_LOCATION);
        setRegion(DEFAULT_LOCATION);
        setLoading(false);
      }
    };

    initializeLocation();
  }, [requestLocationPermission, getCurrentLocation]);

  return {
    location,
    region,
    loading,
    error,
    refreshLocation,
    hasPermission,
  };
}
