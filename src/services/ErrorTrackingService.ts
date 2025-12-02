// Error Tracking Service
// Abstraction layer for error tracking services (Sentry, Bugsnag, etc.)

import { Platform } from 'react-native';
import Constants from 'expo-constants';

interface ErrorTrackingConfig {
  dsn?: string;
  enabled?: boolean;
  environment?: string;
  release?: string;
}

interface ErrorContext {
  [key: string]: any;
}

interface UserInfo {
  id?: string;
  email?: string;
  username?: string;
}

class ErrorTrackingService {
  private isInitialized: boolean = false;
  private config: ErrorTrackingConfig = {};

  /**
   * Initialize error tracking service
   */
  initialize(config?: ErrorTrackingConfig): void {
    // Get configuration from environment or passed config
    const dsn = config?.dsn || process.env.EXPO_PUBLIC_SENTRY_DSN;
    const enabled =
      config?.enabled !== undefined
        ? config.enabled
        : process.env.EXPO_PUBLIC_SENTRY_ENABLED === 'true';
    const environment =
      config?.environment ||
      process.env.EXPO_PUBLIC_APP_ENV ||
      __DEV__ ? 'development' : 'production';

    // Don't initialize if disabled or no DSN provided
    if (!enabled || !dsn) {
      console.log('[ErrorTracking] Error tracking disabled or no DSN provided');
      return;
    }

    this.config = {
      dsn,
      enabled,
      environment,
      release: Constants.expoConfig?.version || '1.0.0',
    };

    // TODO: Initialize your error tracking service here
    // Example for Sentry:
    /*
    import * as Sentry from '@sentry/react-native';
    
    Sentry.init({
      dsn: this.config.dsn,
      environment: this.config.environment,
      release: this.config.release,
      enableInExpoDevelopment: false,
      debug: __DEV__,
      integrations: [
        new Sentry.ReactNativeTracing({
          tracingOrigins: ['localhost', /^\//],
          routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),
        }),
      ],
      tracesSampleRate: 1.0,
    });
    */

    this.isInitialized = true;
    console.log(`[ErrorTracking] Initialized for ${environment}`);
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: ErrorContext): void {
    if (!this.isInitialized || !this.config.enabled) {
      // Fallback to console in development
      if (__DEV__) {
        console.error('[ErrorTracking] Exception:', error, context);
      }
      return;
    }

    // TODO: Send to your error tracking service
    // Example for Sentry:
    /*
    import * as Sentry from '@sentry/react-native';
    
    if (context) {
      Sentry.captureException(error, {
        contexts: { custom: context },
      });
    } else {
      Sentry.captureException(error);
    }
    */

    console.log('[ErrorTracking] Captured exception:', error.message);
  }

  /**
   * Capture a message
   */
  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    context?: ErrorContext
  ): void {
    if (!this.isInitialized || !this.config.enabled) {
      if (__DEV__) {
        console.log(`[ErrorTracking] Message (${level}):`, message, context);
      }
      return;
    }

    // TODO: Send to your error tracking service
    // Example for Sentry:
    /*
    import * as Sentry from '@sentry/react-native';
    
    Sentry.captureMessage(message, {
      level: level === 'warning' ? 'warning' : level === 'error' ? 'error' : 'info',
      contexts: context ? { custom: context } : undefined,
    });
    */

    console.log(`[ErrorTracking] Captured message (${level}):`, message);
  }

  /**
   * Set user context
   */
  setUser(user: UserInfo | null): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    // TODO: Set user in your error tracking service
    // Example for Sentry:
    /*
    import * as Sentry from '@sentry/react-native';
    
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.username,
      });
    } else {
      Sentry.setUser(null);
    }
    */

    console.log('[ErrorTracking] User context set:', user?.id || 'none');
  }

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(
    message: string,
    category?: string,
    data?: ErrorContext
  ): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    // TODO: Add breadcrumb to your error tracking service
    // Example for Sentry:
    /*
    import * as Sentry from '@sentry/react-native';
    
    Sentry.addBreadcrumb({
      message,
      category: category || 'custom',
      data,
      level: 'info',
    });
    */

    if (__DEV__) {
      console.log(`[ErrorTracking] Breadcrumb [${category}]:`, message);
    }
  }

  /**
   * Set custom context/tags
   */
  setContext(key: string, value: ErrorContext): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    // TODO: Set context in your error tracking service
    // Example for Sentry:
    /*
    import * as Sentry from '@sentry/react-native';
    
    Sentry.setContext(key, value);
    */
  }

  /**
   * Set a tag
   */
  setTag(key: string, value: string): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    // TODO: Set tag in your error tracking service
    // Example for Sentry:
    /*
    import * as Sentry from '@sentry/react-native';
    
    Sentry.setTag(key, value);
    */
  }

  /**
   * Wrap an async function to catch errors
   */
  wrapAsync<T>(fn: () => Promise<T>): Promise<T> {
    return fn().catch((error) => {
      this.captureException(error);
      throw error;
    });
  }
}

// Export singleton instance
export const ErrorTracking = new ErrorTrackingService();

// Convenience exports
export const captureException = (error: Error, context?: ErrorContext) =>
  ErrorTracking.captureException(error, context);
export const captureMessage = (
  message: string,
  level?: 'info' | 'warning' | 'error',
  context?: ErrorContext
) => ErrorTracking.captureMessage(message, level, context);
export const setUser = (user: UserInfo | null) => ErrorTracking.setUser(user);
export const addBreadcrumb = (message: string, category?: string, data?: ErrorContext) =>
  ErrorTracking.addBreadcrumb(message, category, data);

