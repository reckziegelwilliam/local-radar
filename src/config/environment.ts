// Environment Configuration
// Central configuration based on environment detection

import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Environment types
 */
export type Environment = 'development' | 'staging' | 'production';

/**
 * Get current environment
 */
export function getEnvironment(): Environment {
  // Check if running in development mode
  if (__DEV__) {
    return 'development';
  }

  // Check environment variable
  const envVar = process.env.EXPO_PUBLIC_APP_ENV as Environment;
  if (envVar === 'staging' || envVar === 'production') {
    return envVar;
  }

  // Default to production for safety
  return 'production';
}

/**
 * Environment-specific configuration
 */
const config = {
  development: {
    apiTimeout: 30000, // 30 seconds
    enableDebugLogs: true,
    enableAnalytics: false,
    enableErrorTracking: false,
    enablePerformanceMonitoring: false,
    mapUpdateInterval: 5000, // 5 seconds
    eventRefreshInterval: 10000, // 10 seconds
  },
  staging: {
    apiTimeout: 15000, // 15 seconds
    enableDebugLogs: true,
    enableAnalytics: true,
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
    mapUpdateInterval: 10000, // 10 seconds
    eventRefreshInterval: 30000, // 30 seconds
  },
  production: {
    apiTimeout: 10000, // 10 seconds
    enableDebugLogs: false,
    enableAnalytics: true,
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
    mapUpdateInterval: 15000, // 15 seconds
    eventRefreshInterval: 30000, // 30 seconds
  },
};

/**
 * Get environment-specific configuration
 */
export function getConfig() {
  const env = getEnvironment();
  return config[env];
}

/**
 * Platform information
 */
export const platform = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isWeb: Platform.OS === 'web',
  os: Platform.OS,
  osVersion: Platform.Version,
};

/**
 * App information
 */
export const appInfo = {
  name: Constants.expoConfig?.name || 'Buzzy',
  version: Constants.expoConfig?.version || '1.0.0',
  buildNumber: Constants.expoConfig?.ios?.buildNumber || 
                Constants.expoConfig?.android?.versionCode || '1',
  bundleId: platform.isIOS 
    ? Constants.expoConfig?.ios?.bundleIdentifier
    : Constants.expoConfig?.android?.package,
};

/**
 * Feature flags
 */
export const features = {
  enablePushNotifications: true,
  enablePhotoUpload: true,
  enableEventReporting: true,
  enableRSVP: true,
  maxEventPhotos: 1,
  maxEventsPerUser: 5, // per hour
  maxEventRadius: 5000, // 5km in meters
  eventGracePeriod: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
};

/**
 * API configuration
 */
export const api = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
  timeout: getConfig().apiTimeout,
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof features): boolean {
  return features[feature] as boolean;
}

/**
 * Get a configuration value
 */
export function getConfigValue<T>(key: keyof ReturnType<typeof getConfig>): T {
  return getConfig()[key] as T;
}

/**
 * Development helpers
 */
export const dev = {
  isDevelopment: __DEV__,
  isStaging: getEnvironment() === 'staging',
  isProduction: getEnvironment() === 'production',
  logLevel: getConfig().enableDebugLogs ? 'debug' : 'error',
};

// Export everything
export default {
  environment: getEnvironment(),
  config: getConfig(),
  platform,
  appInfo,
  features,
  api,
  dev,
  isFeatureEnabled,
  getConfigValue,
};

