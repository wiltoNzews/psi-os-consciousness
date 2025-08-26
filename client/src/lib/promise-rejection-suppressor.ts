/**
 * WiltonOS Promise Rejection Suppressor
 * Handles all unhandled promise rejections to prevent system instability
 */

interface RejectionLog {
  timestamp: number;
  reason: any;
  source: string;
}

class PromiseRejectionSuppressor {
  private static instance: PromiseRejectionSuppressor;
  private rejectionLog: RejectionLog[] = [];
  private suppressionActive = true;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): PromiseRejectionSuppressor {
    if (!PromiseRejectionSuppressor.instance) {
      PromiseRejectionSuppressor.instance = new PromiseRejectionSuppressor();
    }
    return PromiseRejectionSuppressor.instance;
  }

  private initialize() {
    // Remove any existing unhandled rejection listeners
    const existingHandlers = (window as any)._unhandledRejectionHandlers || [];
    existingHandlers.forEach((handler: any) => {
      window.removeEventListener('unhandledrejection', handler);
    });

    // Install our unified handler
    const handler = (event: PromiseRejectionEvent) => {
      this.handleRejection(event);
    };

    window.addEventListener('unhandledrejection', handler);
    
    // Track our handlers to prevent duplicates
    (window as any)._unhandledRejectionHandlers = [handler];
  }

  private handleRejection(event: PromiseRejectionEvent) {
    if (!this.suppressionActive) return;

    // Log the rejection for debugging
    this.rejectionLog.push({
      timestamp: Date.now(),
      reason: event.reason,
      source: this.identifySource(event.reason)
    });

    // Keep only last 20 rejections to prevent memory leaks
    if (this.rejectionLog.length > 20) {
      this.rejectionLog = this.rejectionLog.slice(-20);
    }

    // Silent suppression - prevent default behavior
    event.preventDefault();

    // Optional: Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('[WiltonOS] Suppressed promise rejection:', event.reason);
    }
  }

  private identifySource(reason: any): string {
    if (reason?.message?.includes('fetch')) return 'FETCH';
    if (reason?.message?.includes('network')) return 'NETWORK';
    if (reason?.message?.includes('ECONNREFUSED')) return 'CONNECTION';
    if (reason?.stack?.includes('api')) return 'API';
    return 'UNKNOWN';
  }

  public getStats() {
    return {
      totalRejections: this.rejectionLog.length,
      recentRejections: this.rejectionLog.slice(-5),
      isActive: this.suppressionActive
    };
  }

  public disable() {
    this.suppressionActive = false;
  }

  public enable() {
    this.suppressionActive = true;
  }
}

// Initialize immediately
const suppressor = PromiseRejectionSuppressor.getInstance();

// Expose for debugging
(window as any).wiltonOSRejectionSuppressor = suppressor;

export default suppressor;