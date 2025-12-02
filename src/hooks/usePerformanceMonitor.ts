// usePerformanceMonitor Hook
// React hook for tracking component render performance

import { useEffect, useRef } from 'react';
import { PerformanceMonitoring } from '../services/PerformanceService';

/**
 * Hook to track screen render performance
 * 
 * Usage:
 * ```tsx
 * function MyScreen() {
 *   usePerformanceMonitor('MyScreen');
 *   // ... rest of component
 * }
 * ```
 */
export function usePerformanceMonitor(screenName: string) {
  const mountTimeRef = useRef<number>(Date.now());
  const stopTraceRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Start tracking when component mounts
    stopTraceRef.current = PerformanceMonitoring.trackScreenRender(screenName);

    // Calculate time to interactive
    const timeToInteractive = Date.now() - mountTimeRef.current;
    PerformanceMonitoring.recordMetric(`${screenName}_time_to_interactive`, timeToInteractive);

    return () => {
      // Stop tracking when component unmounts
      if (stopTraceRef.current) {
        stopTraceRef.current();
      }
    };
  }, [screenName]);
}

/**
 * Hook to track async operation performance
 * 
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   const trackOperation = useOperationTracker();
 *   
 *   const handleAction = async () => {
 *     await trackOperation('user_action', async () => {
 *       // ... async operation
 *     });
 *   };
 * }
 * ```
 */
export function useOperationTracker() {
  return async <T,>(name: string, operation: () => Promise<T>): Promise<T> => {
    return PerformanceMonitoring.measure(name, operation);
  };
}

/**
 * Hook to track render count (useful for detecting unnecessary re-renders)
 * 
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   useRenderCount('MyComponent');
 *   // ... rest of component
 * }
 * ```
 */
export function useRenderCount(componentName: string) {
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;

    if (__DEV__ && renderCountRef.current > 10) {
      console.warn(
        `[Performance] ${componentName} has rendered ${renderCountRef.current} times. ` +
        'Consider using React.memo or optimizing dependencies.'
      );
    }
  });

  return renderCountRef.current;
}

