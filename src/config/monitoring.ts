// Monitoring Configuration
// Central configuration for error tracking, analytics, and performance monitoring

import { Platform } from 'react-native';

export const MonitoringConfig = {
  // Error Tracking (e.g., Sentry)
  errorTracking: {
    enabled: process.env.EXPO_PUBLIC_SENTRY_ENABLED === 'true',
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: process.env.EXPO_PUBLIC_APP_ENV || (__DEV__ ? 'development' : 'production'),
    tracesSampleRate: __DEV__ ? 0 : 1.0, // 100% in production, 0% in development
    sampleRate: 1.0, // Capture 100% of errors
    beforeSend: (event: any) => {
      // Filter out sensitive information
      if (event.request) {
        delete event.request.cookies;
      }
      return event;
    },
  },

  // Analytics (e.g., Amplitude, Firebase)
  analytics: {
    enabled: process.env.EXPO_PUBLIC_ANALYTICS_ENABLED === 'true',
    amplitudeApiKey: process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY,
    trackingConsent: true, // Set based on user preference
    trackScreenViews: true,
    trackAppLifecycle: true,
  },

  // Performance Monitoring
  performance: {
    enabled: process.env.EXPO_PUBLIC_PERFORMANCE_MONITORING_ENABLED === 'true',
    sampleRate: 0.1, // Monitor 10% of sessions
    trackSlowFrames: true,
    trackNetworkRequests: true,
    slowFrameThreshold: 16, // ms (60 FPS = 16.67ms per frame)
  },

  // Platform-specific settings
  platform: {
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    isWeb: Platform.OS === 'web',
  },

  // Debug settings
  debug: {
    logToConsole: __DEV__,
    verboseLogging: false,
  },
};

// Environment detection helper
export const getEnvironment = (): 'development' | 'staging' | 'production' => {
  if (__DEV__) return 'development';
  
  const envVar = process.env.EXPO_PUBLIC_APP_ENV;
  if (envVar === 'staging') return 'staging';
  if (envVar === 'production') return 'production';
  
  return 'production'; // Default to production for safety
};

// Check if monitoring should be enabled
export const shouldEnableMonitoring = (): boolean => {
  const env = getEnvironment();
  // Enable in staging and production, disable in development
  return env !== 'development';
};

