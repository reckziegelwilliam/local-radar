// Analytics Service
// Abstraction layer for analytics services (Amplitude, Firebase, Mixpanel, etc.)

import { Platform } from 'react-native';
import Constants from 'expo-constants';

interface AnalyticsConfig {
  enabled?: boolean;
  apiKey?: string;
  trackScreenViews?: boolean;
}

interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

interface UserProperties {
  [key: string]: string | number | boolean | null | undefined;
}

class AnalyticsService {
  private isInitialized: boolean = false;
  private config: AnalyticsConfig = {};
  private userId: string | null = null;

  /**
   * Initialize analytics service
   */
  initialize(config?: AnalyticsConfig): void {
    // Get configuration from environment or passed config
    const enabled =
      config?.enabled !== undefined
        ? config.enabled
        : process.env.EXPO_PUBLIC_ANALYTICS_ENABLED === 'true';
    const apiKey = config?.apiKey || process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY;

    // Don't initialize if disabled or no API key provided
    if (!enabled || !apiKey) {
      console.log('[Analytics] Analytics disabled or no API key provided');
      return;
    }

    this.config = {
      enabled,
      apiKey,
      trackScreenViews: config?.trackScreenViews !== false, // Default true
    };

    // TODO: Initialize your analytics service here
    // Example for Amplitude:
    /*
    import { Amplitude } from '@amplitude/react-native';
    
    const amplitude = Amplitude.getInstance();
    amplitude.init(this.config.apiKey);
    
    // Set default properties
    const defaultProps = {
      platform: Platform.OS,
      appVersion: Constants.expoConfig?.version,
      deviceModel: Platform.OS === 'ios' ? 'iOS' : 'Android',
    };
    amplitude.setVersionName(Constants.expoConfig?.version || '1.0.0');
    */

    this.isInitialized = true;
    console.log('[Analytics] Initialized');
  }

  /**
   * Track an event
   */
  track(eventName: string, properties?: EventProperties): void {
    if (!this.isInitialized || !this.config.enabled) {
      if (__DEV__) {
        console.log(`[Analytics] Track: ${eventName}`, properties);
      }
      return;
    }

    // TODO: Send to your analytics service
    // Example for Amplitude:
    /*
    import { Amplitude } from '@amplitude/react-native';
    
    const amplitude = Amplitude.getInstance();
    amplitude.logEvent(eventName, properties);
    */

    console.log(`[Analytics] Tracked: ${eventName}`, properties);
  }

  /**
   * Track a screen view
   */
  screen(screenName: string, properties?: EventProperties): void {
    if (!this.isInitialized || !this.config.enabled) {
      if (__DEV__) {
        console.log(`[Analytics] Screen: ${screenName}`, properties);
      }
      return;
    }

    // Track as a regular event with screen_ prefix
    this.track(`screen_${screenName}`, {
      screen: screenName,
      ...properties,
    });
  }

  /**
   * Identify a user
   */
  identify(userId: string, properties?: UserProperties): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    this.userId = userId;

    // TODO: Send to your analytics service
    // Example for Amplitude:
    /*
    import { Amplitude } from '@amplitude/react-native';
    
    const amplitude = Amplitude.getInstance();
    amplitude.setUserId(userId);
    
    if (properties) {
      const identify = new Amplitude.Identify();
      Object.entries(properties).forEach(([key, value]) => {
        identify.set(key, value);
      });
      amplitude.identify(identify);
    }
    */

    console.log('[Analytics] User identified:', userId);
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    // TODO: Send to your analytics service
    // Example for Amplitude:
    /*
    import { Amplitude } from '@amplitude/react-native';
    
    const amplitude = Amplitude.getInstance();
    const identify = new Amplitude.Identify();
    Object.entries(properties).forEach(([key, value]) => {
      identify.set(key, value);
    });
    amplitude.identify(identify);
    */

    console.log('[Analytics] User properties set:', properties);
  }

  /**
   * Increment a user property
   */
  incrementUserProperty(property: string, value: number = 1): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    // TODO: Send to your analytics service
    // Example for Amplitude:
    /*
    import { Amplitude } from '@amplitude/react-native';
    
    const amplitude = Amplitude.getInstance();
    const identify = new Amplitude.Identify();
    identify.add(property, value);
    amplitude.identify(identify);
    */

    console.log(`[Analytics] Incremented ${property} by ${value}`);
  }

  /**
   * Clear user identity (on logout)
   */
  reset(): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    this.userId = null;

    // TODO: Send to your analytics service
    // Example for Amplitude:
    /*
    import { Amplitude } from '@amplitude/react-native';
    
    const amplitude = Amplitude.getInstance();
    amplitude.clearUserProperties();
    amplitude.setUserId(null);
    amplitude.regenerateDeviceId();
    */

    console.log('[Analytics] User session reset');
  }

  /**
   * Set session properties (for all subsequent events)
   */
  setSuperProperties(properties: EventProperties): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    // TODO: Set super properties in your analytics service
    // Note: Amplitude doesn't have direct super properties,
    // but you can use user properties or include in each event
  }

  /**
   * Enable/disable analytics tracking
   */
  setEnabled(enabled: boolean): void {
    if (!this.isInitialized) {
      return;
    }

    this.config.enabled = enabled;

    // TODO: Update your analytics service
    // Example for Amplitude:
    /*
    import { Amplitude } from '@amplitude/react-native';
    
    const amplitude = Amplitude.getInstance();
    amplitude.setOptOut(!enabled);
    */

    console.log(`[Analytics] Tracking ${enabled ? 'enabled' : 'disabled'}`);
  }
}

// Export singleton instance
export const Analytics = new AnalyticsService();

// Convenience exports
export const track = (eventName: string, properties?: EventProperties) =>
  Analytics.track(eventName, properties);
export const screen = (screenName: string, properties?: EventProperties) =>
  Analytics.screen(screenName, properties);
export const identify = (userId: string, properties?: UserProperties) =>
  Analytics.identify(userId, properties);
export const setUserProperties = (properties: UserProperties) =>
  Analytics.setUserProperties(properties);
export const reset = () => Analytics.reset();

