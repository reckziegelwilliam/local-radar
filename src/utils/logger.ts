// Production-safe logger utility
// In production, console.log is disabled, but console.error remains for critical issues

import { ErrorTracking } from '../services/ErrorTrackingService';

const isDevelopment = __DEV__;
const isProduction = !__DEV__;

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

// Current log level (can be configured via environment)
const currentLogLevel = isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;

/**
 * Safe JSON stringifier that handles circular references
 */
function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return '[Circular or Non-Serializable Object]';
  }
}

/**
 * Format log message with timestamp and context
 */
function formatMessage(level: string, args: any[]): string {
  const timestamp = new Date().toISOString();
  const formattedArgs = args.map(arg => 
    typeof arg === 'object' ? safeStringify(arg) : String(arg)
  ).join(' ');
  
  return `[${timestamp}] [${level}] ${formattedArgs}`;
}

export const logger = {
  /**
   * Debug logs - Only in development
   */
  debug: (...args: any[]) => {
    if (currentLogLevel <= LogLevel.DEBUG && isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Info logs - Development and some production
   */
  log: (...args: any[]) => {
    if (currentLogLevel <= LogLevel.INFO && isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Same as log() for compatibility
   */
  info: (...args: any[]) => {
    if (currentLogLevel <= LogLevel.INFO && isDevelopment) {
      console.info(...args);
    }
  },
  
  /**
   * Warning logs - Development and production
   */
  warn: (...args: any[]) => {
    if (currentLogLevel <= LogLevel.WARN) {
      console.warn(...args);
      
      // In production, send warnings to error tracking
      if (isProduction) {
        ErrorTracking.captureMessage(
          formatMessage('WARN', args),
          'warning'
        );
      }
    }
  },
  
  /**
   * Error logs - Always enabled
   */
  error: (...args: any[]) => {
    if (currentLogLevel <= LogLevel.ERROR) {
      console.error(...args);
      
      // Send errors to error tracking service
      const errorArg = args.find(arg => arg instanceof Error);
      if (errorArg) {
        ErrorTracking.captureException(errorArg, {
          additionalInfo: args.filter(arg => arg !== errorArg),
        });
      } else {
        ErrorTracking.captureMessage(
          formatMessage('ERROR', args),
          'error'
        );
      }
    }
  },

  /**
   * Log a breadcrumb (for debugging context in error reports)
   */
  breadcrumb: (message: string, category?: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[Breadcrumb ${category || 'general'}]`, message, data);
    }
    ErrorTracking.addBreadcrumb(message, category, data);
  },

  /**
   * Group related logs (development only)
   */
  group: (label: string) => {
    if (isDevelopment) {
      console.group(label);
    }
  },

  /**
   * End a log group
   */
  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },
};

// Export for backwards compatibility
export default logger;
