"use client";

import { useEffect } from 'react';

// Performance optimization: Preload critical resources
export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical API endpoints
    const preloadApis = [
      '/api/trading/portfolio',
      '/api/trading/market-data',
    ];

    const preloadPromises = preloadApis.map(url => 
      fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'max-age=30',
        },
      }).catch(() => {
        // Ignore errors in preloading
      })
    );

    // Preload in background without blocking
    Promise.allSettled(preloadPromises);

    // Preload next.js dynamic imports for better performance
    const preloadComponents = [
      () => import('@/components/trading-order-form'),
      () => import('@/components/portfolio-overview'),
    ];

    preloadComponents.forEach(importFn => {
      // Delay to avoid blocking initial render
      setTimeout(() => {
        importFn().catch(() => {
          // Ignore preload errors
        });
      }, 100);
    });

    // Optimize browser caching
    if (typeof window !== 'undefined') {
      // Set up service worker for caching (if available)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Service worker registration failed - ignore
        });
      }

      // Prefetch DNS for external resources
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = '//fonts.googleapis.com';
      document.head.appendChild(dnsPrefetch);
    }
  }, []);

  return null; // This component doesn't render anything
}

// Hook for optimizing component rendering
export function useRenderOptimization() {
  useEffect(() => {
    // Optimize requestAnimationFrame for smooth animations
    let rafId: number;
    
    const optimizeRender = () => {
      // Batch DOM updates
      if (document.readyState === 'complete') {
        // DOM is ready, optimize further operations
        requestIdleCallback?.(() => {
          // Perform non-critical operations during idle time
        });
      }
    };

    rafId = requestAnimationFrame(optimizeRender);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);
}

// Memory optimization utilities
export const memoryOptimizer = {
  // Cleanup function for component unmounting
  cleanup: (cleanupFunctions: (() => void)[]) => {
    cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        // Ignore cleanup errors
      }
    });
  },

  // Debounce function for expensive operations
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function for frequent events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};
