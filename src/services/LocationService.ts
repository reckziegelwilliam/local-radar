import * as Location from 'expo-location';
import { DEFAULT_LOCATION } from '../utils/constants';
import { Location as LocationType } from '../types';

export class LocationService {
  private static currentLocation: LocationType | null = null;
  private static hasPermission: boolean = false;

  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      this.hasPermission = status === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  static async getCurrentLocation(): Promise<LocationType> {
    if (!this.hasPermission) {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Location permission denied, using default location');
        return DEFAULT_LOCATION;
      }
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      const coords: LocationType = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      this.currentLocation = coords;
      return coords;
    } catch (error) {
      console.error('Error getting current location:', error);
      return this.currentLocation || DEFAULT_LOCATION;
    }
  }

  static async watchLocation(
    callback: (location: LocationType) => void,
    options?: {
      accuracy?: Location.Accuracy;
      timeInterval?: number;
      distanceInterval?: number;
    }
  ): Promise<{ remove: () => void } | null> {
    if (!this.hasPermission) {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }
    }

    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: options?.accuracy || Location.Accuracy.Balanced,
          timeInterval: options?.timeInterval || 10000,
          distanceInterval: options?.distanceInterval || 50,
        },
        (location) => {
          const coords: LocationType = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          this.currentLocation = coords;
          callback(coords);
        }
      );

      return subscription;
    } catch (error) {
      console.error('Error watching location:', error);
      return null;
    }
  }

  static getCachedLocation(): LocationType | null {
    return this.currentLocation;
  }

  static calculateDistance(
    location1: LocationType,
    location2: LocationType
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (location1.latitude * Math.PI) / 180;
    const φ2 = (location2.latitude * Math.PI) / 180;
    const Δφ = ((location2.latitude - location1.latitude) * Math.PI) / 180;
    const Δλ = ((location2.longitude - location1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  static formatDistance(distanceInMeters: number): string {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)}m`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(1)}km`;
    }
  }
}
