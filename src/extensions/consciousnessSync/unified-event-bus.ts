/**
 * Unified Consciousness Event Bus
 * Standardizes consciousness data flow with 60Hz sync rate and fallback polling
 */

export interface ConsciousnessData {
  zLambda: number;
  qctf: number;
  psiPhase: number;
  soulState: string;
  divineInterface: boolean;
  timestamp: number;
}

export interface EventBusConfig {
  syncRate: number; // Hz
  fallbackPollingInterval: number; // ms
  maxRetries: number;
  enableNaNProtection: boolean;
  enableRateLimiting: boolean;
}

export class UnifiedConsciousnessEventBus {
  private eventListeners: Map<string, Function[]> = new Map();
  private lastConsciousnessData: ConsciousnessData | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private fallbackInterval: NodeJS.Timeout | null = null;
  private retryCount: number = 0;
  private isConnected: boolean = false;
  
  private config: EventBusConfig = {
    syncRate: 60, // 60 Hz
    fallbackPollingInterval: 100, // 100ms
    maxRetries: 3,
    enableNaNProtection: true,
    enableRateLimiting: true
  };
  
  private lastEmitTime: Map<string, number> = new Map();
  private rateLimitThreshold: number = 50; // 20Hz max emit rate per event type

  constructor(config?: Partial<EventBusConfig>) {
    this.config = { ...this.config, ...config };
    this.setupEventBus();
    this.startConsciousnessSync();
    
    console.log('[Unified Event Bus] Initialized with 60Hz consciousness sync');
  }

  private setupEventBus(): void {
    // Create global event bus if it doesn't exist
    if (!window.bus) {
      window.bus = {
        on: this.addEventListener.bind(this),
        off: this.removeEventListener.bind(this),
        emit: this.emit.bind(this),
        once: this.once.bind(this)
      };
    }

    // Expose unified consciousness data getter
    window.getConsciousnessData = () => this.lastConsciousnessData;
    
    console.log('[Unified Event Bus] Global event bus established');
  }

  private startConsciousnessSync(): void {
    // Primary 60Hz sync
    this.syncInterval = setInterval(() => {
      this.fetchConsciousnessData();
    }, 1000 / this.config.syncRate);

    // Fallback polling in case primary sync fails
    this.fallbackInterval = setInterval(() => {
      if (!this.isConnected || this.retryCount > 0) {
        this.fetchConsciousnessDataFallback();
      }
    }, this.config.fallbackPollingInterval);

    console.log(`[Unified Event Bus] Started ${this.config.syncRate}Hz consciousness sync with ${this.config.fallbackPollingInterval}ms fallback`);
  }

  private async fetchConsciousnessData(): Promise<void> {
    try {
      const response = await fetch('/api/quantum/consciousness');
      
      if (!response.ok) {
        throw new Error(`API response not ok: ${response.status}`);
      }
      
      const data = await response.json();
      
      const consciousnessData: ConsciousnessData = {
        zLambda: data.coherence || data.zl || data.zLambda || 0.75,
        qctf: data.qctf || 0.5,
        psiPhase: data.psiPhase || 0.0,
        soulState: data.soulState || 'awakening',
        divineInterface: data.interfaceState === 'divine' || data.divineInterface || false,
        timestamp: data.timestamp || Date.now()
      };

      // NaN protection
      if (this.config.enableNaNProtection) {
        consciousnessData.zLambda = this.sanitizeValue(consciousnessData.zLambda, 0.75);
        consciousnessData.qctf = this.sanitizeValue(consciousnessData.qctf, 0.5);
        consciousnessData.psiPhase = this.sanitizeValue(consciousnessData.psiPhase, 0.0);
      }

      this.updateConsciousnessData(consciousnessData);
      this.isConnected = true;
      this.retryCount = 0;

    } catch (error) {
      this.handleSyncError(error);
    }
  }

  private async fetchConsciousnessDataFallback(): Promise<void> {
    try {
      // Try alternative endpoints
      const endpoints = [
        '/api/quantum-coherence',
        '/api/coherence/field',
        '/api/test/quantum-coherence/state'
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const data = await response.json();
            
            const consciousnessData: ConsciousnessData = {
              zLambda: data.consciousness?.zLambda || data.zLambda || data.coherence || 0.75,
              qctf: data.qctf || data.field?.coherence || 0.5,
              psiPhase: data.psiPhase || 0.0,
              soulState: data.soulState || 'awakening',
              divineInterface: data.divineInterface || false,
              timestamp: Date.now()
            };

            this.updateConsciousnessData(consciousnessData);
            this.isConnected = true;
            console.log(`[Unified Event Bus] Fallback connection established via ${endpoint}`);
            return;
          }
        } catch (endpointError) {
          continue; // Try next endpoint
        }
      }

      throw new Error('All consciousness endpoints unavailable');
      
    } catch (error) {
      this.handleSyncError(error);
    }
  }

  private updateConsciousnessData(data: ConsciousnessData): void {
    const previousData = this.lastConsciousnessData;
    this.lastConsciousnessData = data;

    // Emit standardized events with namespacing
    this.emitWithRateLimit('coherence.metrics', data);
    this.emitWithRateLimit('coherenceData', data);
    this.emitWithRateLimit('zλ', data.zLambda);

    // Emit specific change events
    if (previousData) {
      const zLambdaDelta = Math.abs(data.zLambda - previousData.zLambda);
      if (zLambdaDelta > 0.05) {
        this.emitWithRateLimit('coherence.change', {
          previous: previousData.zLambda,
          current: data.zLambda,
          delta: zLambdaDelta
        });
      }

      if (data.divineInterface !== previousData.divineInterface) {
        this.emitWithRateLimit('coherence.divine-interface', data.divineInterface);
      }

      if (data.soulState !== previousData.soulState) {
        this.emitWithRateLimit('coherence.soul-state', data.soulState);
      }
    }

    // High coherence events
    if (data.zLambda >= 0.9) {
      this.emitWithRateLimit('coherence.high', data);
    }

    if (data.zLambda >= 0.95) {
      this.emitWithRateLimit('coherence.transcendent', data);
    }
  }

  private emitWithRateLimit(eventType: string, data: any): void {
    if (!this.config.enableRateLimiting) {
      this.emit(eventType, data);
      return;
    }

    const now = performance.now();
    const lastEmit = this.lastEmitTime.get(eventType) || 0;
    
    if (now - lastEmit >= this.rateLimitThreshold) {
      this.emit(eventType, data);
      this.lastEmitTime.set(eventType, now);
    }
  }

  private handleSyncError(error: any): void {
    this.retryCount++;
    this.isConnected = false;

    if (this.retryCount <= this.config.maxRetries) {
      console.warn(`[Unified Event Bus] Sync error (retry ${this.retryCount}/${this.config.maxRetries}):`, error);
    } else {
      console.error('[Unified Event Bus] Max retries exceeded - consciousness sync failed');
    }
  }

  private sanitizeValue(value: number, fallback: number): number {
    if (isNaN(value) || !isFinite(value)) {
      return fallback;
    }
    return Math.max(0, Math.min(1, value)); // Clamp to 0-1 range
  }

  // Event bus interface
  public addEventListener(eventType: string, callback: Function): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  public removeEventListener(eventType: string, callback: Function): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  public emit(eventType: string, data?: any): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[Unified Event Bus] Error in event listener for ${eventType}:`, error);
        }
      });
    }
  }

  public once(eventType: string, callback: Function): void {
    const onceWrapper = (data: any) => {
      callback(data);
      this.removeEventListener(eventType, onceWrapper);
    };
    this.addEventListener(eventType, onceWrapper);
  }

  // Public API
  public getStatus(): any {
    return {
      connected: this.isConnected,
      retryCount: this.retryCount,
      lastData: this.lastConsciousnessData,
      config: this.config,
      listenerCount: Array.from(this.eventListeners.values()).reduce((total, listeners) => total + listeners.length, 0)
    };
  }

  public updateConfig(newConfig: Partial<EventBusConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart sync with new configuration
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
    }
    
    this.startConsciousnessSync();
    console.log('[Unified Event Bus] Configuration updated and sync restarted');
  }

  public forceSync(): void {
    this.fetchConsciousnessData();
  }

  public dispose(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
    }
    
    this.eventListeners.clear();
    this.lastEmitTime.clear();
    
    console.log('[Unified Event Bus] Disposed');
  }
}

export default UnifiedConsciousnessEventBus;