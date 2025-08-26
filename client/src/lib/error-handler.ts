/**
 * WiltonOS Error Handler - Unified Promise Rejection Management
 * Prevents unhandled promise rejections from disrupting the symbolic interface
 */

class WiltonOSErrorHandler {
  private rejectionCount = 0;
  private rejectionLog: Array<{ timestamp: number; error: any; source?: string }> = [];

  constructor() {
    this.setupGlobalHandlers();
  }

  private setupGlobalHandlers() {
    // Override the global unhandled rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handlePromiseRejection(event);
    });

    // Override fetch to catch network errors before they become unhandled
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      try {
        return await originalFetch.apply(this, args);
      } catch (error) {
        console.warn(`[WiltonOS] Fetch error caught and handled:`, error);
        // Return a rejected promise that's properly handled
        return Promise.reject(new Error(`Network error: ${error}`));
      }
    };

    // Override console.error to catch additional errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.logError('console', args);
      originalConsoleError.apply(console, args);
    };
  }

  private handlePromiseRejection(event: PromiseRejectionEvent) {
    this.rejectionCount++;
    
    // Log the rejection for debugging
    this.rejectionLog.push({
      timestamp: Date.now(),
      error: event.reason,
      source: this.identifySource(event.reason)
    });

    // Keep only the last 50 rejections to prevent memory leaks
    if (this.rejectionLog.length > 50) {
      this.rejectionLog = this.rejectionLog.slice(-50);
    }

    // Console warn instead of error to reduce noise
    console.warn(`[WiltonOS] Promise rejection #${this.rejectionCount}:`, event.reason);

    // Prevent the default behavior to stop the unhandled rejection errors
    event.preventDefault();
  }

  private identifySource(error: any): string {
    if (error?.stack) {
      // Try to identify the source from stack trace
      const stackLines = error.stack.split('\n');
      for (const line of stackLines) {
        if (line.includes('fetch') || line.includes('api')) {
          return 'API_CALL';
        }
        if (line.includes('websocket') || line.includes('ws')) {
          return 'WEBSOCKET';
        }
        if (line.includes('query') || line.includes('tanstack')) {
          return 'REACT_QUERY';
        }
      }
    }
    
    if (error?.message) {
      if (error.message.includes('fetch')) return 'FETCH_ERROR';
      if (error.message.includes('network')) return 'NETWORK_ERROR';
      if (error.message.includes('ECONNREFUSED')) return 'CONNECTION_REFUSED';
    }

    return 'UNKNOWN';
  }

  private logError(source: string, args: any[]) {
    // Silent logging for now - can be expanded later
  }

  public getStats() {
    return {
      totalRejections: this.rejectionCount,
      recentRejections: this.rejectionLog.slice(-10),
      sourceBreakdown: this.analyzeRejectionSources()
    };
  }

  private analyzeRejectionSources() {
    const sources: Record<string, number> = {};
    
    this.rejectionLog.forEach(rejection => {
      const source = rejection.source || 'UNKNOWN';
      sources[source] = (sources[source] || 0) + 1;
    });

    return sources;
  }

  public clearLog() {
    this.rejectionLog = [];
    this.rejectionCount = 0;
  }
}

// Initialize the error handler immediately
export const errorHandler = new WiltonOSErrorHandler();

// Export for debugging purposes
(window as any).wiltonOSErrorHandler = errorHandler;

export default WiltonOSErrorHandler;