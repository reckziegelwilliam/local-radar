// Error Tracking Service
// Abstraction layer for error tracking with Sentry integration

import Constants from 'expo-constants';
import * as Sentry from '@sentry/react-native';

const isDevelopment = __DEV__;
const isProduction = !__DEV__;

export interface ErrorTrackingConfig {
  enabled: boolean;
  dsn?: string;
  environment?: string;
  sampleRate?: number;
  tracesSampleRate?: number;
}

export interface ErrorContext {
  [key: string]: any;
}

interface UserInfo {
  id?: string;
  email?: string;
  username?: string;
}

class ErrorTrackingService {
  private isInitialized: boolean = false;
  private config: ErrorTrackingConfig = {
    enabled: false,
  };

  /**
   * Initialize error tracking service with Sentry
   */
  initialize(config?: ErrorTrackingConfig): void {
    const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
    const enabled = process.env.EXPO_PUBLIC_SENTRY_ENABLED === 'true';
    const environment = process.env.EXPO_PUBLIC_APP_ENV || (isDevelopment ? 'development' : 'production');

    this.config = {
      enabled: enabled && !!dsn && isProduction,
      dsn,
      environment,
      sampleRate: 1.0,
      tracesSampleRate: isProduction ? 1.0 : 0,
      ...config,
    };

    if (!this.config.enabled || !this.config.dsn) {
      if (isDevelopment) {
        console.log('[ErrorTracking] Disabled - no DSN configured or not in production');
      }
      this.isInitialized = true;
      return;
    }

    try {
      Sentry.init({
        dsn: this.config.dsn,
        environment: this.config.environment,
        release: Constants.expoConfig?.version || '1.0.0',
        // enableInExpoDevelopment: false,
        debug: isDevelopment,
        sampleRate: this.config.sampleRate,
        tracesSampleRate: this.config.tracesSampleRate,
        integrations: [
          // new Sentry.ReactNativeTracing({
          //   routingInstrumentation: new Sentry.RoutingInstrumentation(),
          // }),
        ],
        beforeSend(event, hint) {
          // Filter out sensitive information
          if (event.request) {
            delete event.request.cookies;
          }
          return event;
        },
      });

      this.isInitialized = true;
      console.log(`[ErrorTracking] Sentry initialized for ${environment}`);
    } catch (error) {
      console.error('[ErrorTracking] Failed to initialize Sentry:', error);
    }
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: ErrorContext): void {
    if (!this.isInitialized || !this.config.enabled) {
      if (isDevelopment) {
        console.error('[ErrorTracking] Exception:', error, context);
      }
      return;
    }

    try {
      if (context) {
        Sentry.captureException(error, {
          contexts: { custom: context },
        });
      } else {
        Sentry.captureException(error);
      }
    } catch (err) {
      console.error('[ErrorTracking] Failed to capture exception:', err);
    }
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
      if (isDevelopment) {
        console.log(`[ErrorTracking] Message (${level}):`, message, context);
      }
      return;
    }

    try {
      const sentryLevel: Sentry.SeverityLevel = 
        level === 'info' ? 'info' :
        level === 'warning' ? 'warning' : 'error';

      if (context) {
        Sentry.captureMessage(message, {
          level: sentryLevel,
          contexts: { custom: context },
        });
      } else {
        Sentry.captureMessage(message, sentryLevel);
      }
    } catch (err) {
      console.error('[ErrorTracking] Failed to capture message:', err);
    }
  }

  /**
   * Set user context
   */
  setUser(user: UserInfo | null): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    try {
      if (user) {
        Sentry.setUser({
          id: user.id,
          email: user.email,
          username: user.username,
        });
      } else {
        Sentry.setUser(null);
      }
    } catch (error) {
      console.error('[ErrorTracking] Failed to set user:', error);
    }
  }

  /**
   * Add breadcrumb for debugging context
   */
  addBreadcrumb(message: string, category?: string, data?: any): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    try {
      Sentry.addBreadcrumb({
        message,
        category: category || 'general',
        data,
        level: 'info',
      });
    } catch (error) {
      console.error('[ErrorTracking] Failed to add breadcrumb:', error);
    }
  }

  /**
   * Set custom tag
   */
  setTag(key: string, value: string): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    try {
      Sentry.setTag(key, value);
    } catch (error) {
      console.error('[ErrorTracking] Failed to set tag:', error);
    }
  }

  /**
   * Set custom context
   */
  setContext(key: string, context: any): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    try {
      Sentry.setContext(key, context);
    } catch (error) {
      console.error('[ErrorTracking] Failed to set context:', error);
    }
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
