// Performance Monitoring Service
// Abstraction layer for performance monitoring (Firebase Performance, etc.)

import { Platform } from 'react-native';
import { getEnvironment } from '../config/environment';

interface PerformanceConfig {
  enabled?: boolean;
  sampleRate?: number;
}

interface TraceAttributes {
  [key: string]: string | number;
}

class PerformanceTrace {
  private name: string;
  private startTime: number;
  private attributes: TraceAttributes = {};
  private metrics: { [key: string]: number } = {};

  constructor(name: string) {
    this.name = name;
    this.startTime = Date.now();
  }

  putAttribute(key: string, value: string | number): void {
    this.attributes[key] = value;
  }

  putMetric(key: string, value: number): void {
    this.metrics[key] = value;
  }

  incrementMetric(key: string, value: number = 1): void {
    this.metrics[key] = (this.metrics[key] || 0) + value;
  }

  stop(): void {
    const duration = Date.now() - this.startTime;
    
    if (__DEV__) {
      console.log(`[Performance] ${this.name}: ${duration}ms`, {
        attributes: this.attributes,
        metrics: this.metrics,
      });
    }

    // TODO: Send to your performance monitoring service
    // Example for Firebase Performance:
    /*
    import perf from '@react-native-firebase/perf';
    
    const trace = await perf().startTrace(this.name);
    Object.entries(this.attributes).forEach(([key, value]) => {
      trace.putAttribute(key, String(value));
    });
    Object.entries(this.metrics).forEach(([key, value]) => {
      trace.putMetric(key, value);
    });
    await trace.stop();
    */
  }
}

class PerformanceMonitoringService {
  private isInitialized: boolean = false;
  private config: PerformanceConfig = {};
  private traces: Map<string, PerformanceTrace> = new Map();

  /**
   * Initialize performance monitoring
   */
  initialize(config?: PerformanceConfig): void {
    const enabled =
      config?.enabled !== undefined
        ? config.enabled
        : process.env.EXPO_PUBLIC_PERFORMANCE_MONITORING_ENABLED === 'true';

    if (!enabled) {
      console.log('[Performance] Performance monitoring disabled');
      return;
    }

    this.config = {
      enabled,
      sampleRate: config?.sampleRate || 0.1, // Monitor 10% of sessions by default
    };

    // Randomly decide if this session should be monitored
    const shouldMonitor = Math.random() < (this.config.sampleRate || 0.1);
    if (!shouldMonitor) {
      console.log('[Performance] Session not sampled for monitoring');
      return;
    }

    // TODO: Initialize your performance monitoring service
    // Example for Firebase Performance:
    /*
    import perf from '@react-native-firebase/perf';
    
    await perf().setPerformanceCollectionEnabled(true);
    */

    this.isInitialized = true;
    console.log('[Performance] Initialized');
  }

  /**
   * Start a trace
   */
  startTrace(name: string): PerformanceTrace {
    if (!this.isInitialized || !this.config.enabled) {
      return new PerformanceTrace(name); // Return dummy trace
    }

    const trace = new PerformanceTrace(name);
    this.traces.set(name, trace);
    return trace;
  }

  /**
   * Stop and remove a trace
   */
  stopTrace(name: string): void {
    const trace = this.traces.get(name);
    if (trace) {
      trace.stop();
      this.traces.delete(name);
    }
  }

  /**
   * Measure async function execution time
   */
  async measure<T>(name: string, fn: () => Promise<T>, attributes?: TraceAttributes): Promise<T> {
    const trace = this.startTrace(name);
    
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        trace.putAttribute(key, value);
      });
    }

    try {
      const result = await fn();
      trace.stop();
      return result;
    } catch (error) {
      trace.putAttribute('error', 'true');
      trace.stop();
      throw error;
    }
  }

  /**
   * Measure synchronous function execution time
   */
  measureSync<T>(name: string, fn: () => T, attributes?: TraceAttributes): T {
    const trace = this.startTrace(name);
    
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        trace.putAttribute(key, value);
      });
    }

    try {
      const result = fn();
      trace.stop();
      return result;
    } catch (error) {
      trace.putAttribute('error', 'true');
      trace.stop();
      throw error;
    }
  }

  /**
   * Record a custom metric
   */
  recordMetric(name: string, value: number, attributes?: TraceAttributes): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    if (__DEV__) {
      console.log(`[Performance] Metric: ${name} = ${value}`, attributes);
    }

    // TODO: Send to your performance monitoring service
  }

  /**
   * Mark an event (e.g., screen view, user action)
   */
  mark(name: string, attributes?: TraceAttributes): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    if (__DEV__) {
      console.log(`[Performance] Mark: ${name}`, attributes);
    }

    // TODO: Send to your performance monitoring service
  }

  /**
   * Track screen render time
   */
  trackScreenRender(screenName: string): () => void {
    const trace = this.startTrace(`screen_${screenName}`);
    trace.putAttribute('screen', screenName);
    trace.putAttribute('platform', Platform.OS);
    
    // Return a function to call when rendering is complete
    return () => {
      trace.stop();
    };
  }

  /**
   * Track API call performance
   */
  trackAPICall(endpoint: string, method: string = 'GET'): PerformanceTrace {
    const trace = this.startTrace(`api_${method}_${endpoint}`);
    trace.putAttribute('endpoint', endpoint);
    trace.putAttribute('method', method);
    return trace;
  }

  /**
   * Track database query performance
   */
  trackDBQuery(tableName: string, operation: string): PerformanceTrace {
    const trace = this.startTrace(`db_${operation}_${tableName}`);
    trace.putAttribute('table', tableName);
    trace.putAttribute('operation', operation);
    return trace;
  }
}

// Export singleton instance
export const PerformanceMonitoring = new PerformanceMonitoringService();

// Convenience exports
export const startTrace = (name: string) => PerformanceMonitoring.startTrace(name);
export const stopTrace = (name: string) => PerformanceMonitoring.stopTrace(name);
export const measure = <T,>(name: string, fn: () => Promise<T>, attributes?: TraceAttributes) =>
  PerformanceMonitoring.measure(name, fn, attributes);
export const measureSync = <T,>(name: string, fn: () => T, attributes?: TraceAttributes) =>
  PerformanceMonitoring.measureSync(name, fn, attributes);
export const recordMetric = (name: string, value: number, attributes?: TraceAttributes) =>
  PerformanceMonitoring.recordMetric(name, value, attributes);
export const trackScreenRender = (screenName: string) =>
  PerformanceMonitoring.trackScreenRender(screenName);
export const trackAPICall = (endpoint: string, method?: string) =>
  PerformanceMonitoring.trackAPICall(endpoint, method);

