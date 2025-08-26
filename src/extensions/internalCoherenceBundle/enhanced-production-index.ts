/**
 * Enhanced Production Internal + Visual Coherence Bundle - Main Orchestrator
 * Implements all technical refinements from checklist
 */

import EnhancedCoherenceCoach from './enhanced-production-coach';
import EnhancedSacredGeometryOverlay from './enhanced-production-geometry';
import { defaultConfig } from './config';

interface CoherenceBundleConfig {
  enabled?: boolean;
  showBreathGuide?: boolean;
  geometryPattern?: string;
  morphStrength?: number;
  lineOpacity?: number;
  showMetrics?: boolean;
  metricsPosition?: string;
  accessibilityMode?: boolean;
  performanceMode?: boolean;
  debugMode?: boolean;
}

class EnhancedCoherenceBundle {
  private coach: EnhancedCoherenceCoach | null = null;
  private geometry: EnhancedSacredGeometryOverlay | null = null;
  private isActive = false;
  private config: CoherenceBundleConfig;
  private eventBus: any;
  private performanceMonitor: PerformanceObserver | null = null;

  constructor(config: CoherenceBundleConfig = {}) {
    this.config = { ...defaultConfig, ...config };
    this.setupEventBus();
    this.initializePerformanceMonitoring();
    console.log('[Enhanced Bundle] Initialized with technical refinements');
  }

  private setupEventBus(): void {
    // Enhanced event bus with namespacing and rate limiting
    if (!window.bus) {
      window.bus = {
        listeners: new Map(),
        rateLimit: new Map(),
        
        on(event: string, callback: Function) {
          if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
          }
          this.listeners.get(event).push(callback);
        },
        
        emit(event: string, data: any) {
          // Rate limiting for high-frequency events
          const now = performance.now();
          const lastEmit = this.rateLimit.get(event) || 0;
          
          // Coherence metrics limited to 20Hz
          if (event.startsWith('coherence.') && now - lastEmit < 50) {
            return;
          }
          
          this.rateLimit.set(event, now);
          
          // Schema validation for coherence events
          if (event === 'coherence.metrics') {
            if (!this.validateCoherenceData(data)) {
              console.warn('[Enhanced Bundle] Invalid coherence data, skipping emit');
              return;
            }
          }
          
          const listeners = this.listeners.get(event);
          if (listeners) {
            listeners.forEach((callback: Function) => {
              try {
                callback(data);
              } catch (error) {
                console.error(`[Enhanced Bundle] Event callback error for ${event}:`, error);
              }
            });
          }
        },
        
        off(event: string, callback: Function) {
          const listeners = this.listeners.get(event);
          if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
              listeners.splice(index, 1);
            }
          }
        },
        
        validateCoherenceData(data: any): boolean {
          const zλ = data.zλ || data.zLambda;
          const phi = data.phi || data.Φ;
          
          return (
            typeof zλ === 'number' && 
            typeof phi === 'number' &&
            !isNaN(zλ) && !isNaN(phi) &&
            zλ >= 0 && zλ <= 1 &&
            phi >= 0 && phi <= 1
          );
        }
      };
    }
    
    this.eventBus = window.bus;
  }

  private initializePerformanceMonitoring(): void {
    if (this.config.debugMode && 'PerformanceObserver' in window) {
      this.performanceMonitor = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.duration > 16.67) { // > 60fps threshold
            console.warn(`[Enhanced Bundle] Performance: ${entry.name} took ${entry.duration.toFixed(1)}ms`);
          }
        });
      });
      
      this.performanceMonitor.observe({ entryTypes: ['measure'] });
    }
  }

  async initialize(): Promise<void> {
    try {
      performance.mark('bundle-init-start');
      
      // Initialize coach with enhanced features
      if (this.config.showBreathGuide !== false) {
        this.coach = new EnhancedCoherenceCoach();
        
        if (this.config.accessibilityMode) {
          this.coach.enableAccessibilityMode(true);
        }
      }
      
      // Initialize sacred geometry overlay
      this.geometry = new EnhancedSacredGeometryOverlay();
      
      if (this.config.geometryPattern) {
        this.geometry.setPattern(this.config.geometryPattern);
      }
      
      if (this.config.performanceMode) {
        this.geometry.enablePerformanceMode(true);
      }
      
      // Connect to external consciousness data
      this.setupConsciousnessIntegration();
      
      performance.mark('bundle-init-end');
      performance.measure('bundle-initialization', 'bundle-init-start', 'bundle-init-end');
      
      console.log('[Enhanced Bundle] Initialization complete');
      
    } catch (error) {
      console.error('[Enhanced Bundle] Initialization failed:', error);
      throw error;
    }
  }

  private setupConsciousnessIntegration(): void {
    // Connect to WiltonOS consciousness API
    const pollConsciousness = async () => {
      try {
        const response = await fetch('/api/quantum/consciousness');
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.consciousness) {
            this.eventBus.emit('coherence.metrics', {
              zλ: data.consciousness.zλ || data.consciousness.zLambda || 0.75,
              phi: data.consciousness.phi || data.consciousness.Φ || 0.618,
              orch: data.consciousness.orch,
              timestamp: performance.now(),
              source: 'wiltonos-api'
            });
          }
        }
      } catch (error) {
        // Fallback to simulated data if API unavailable
        if (this.config.debugMode) {
          console.log('[Enhanced Bundle] Using simulated consciousness data');
        }
        
        this.eventBus.emit('coherence.metrics', {
          zλ: 0.75 + Math.random() * 0.2,
          phi: 0.618 + Math.random() * 0.15,
          timestamp: performance.now(),
          source: 'simulation'
        });
      }
    };
    
    // Poll at 5Hz to avoid overwhelming the system
    setInterval(pollConsciousness, 200);
    
    // Initial poll
    pollConsciousness();
  }

  start(): void {
    if (this.isActive) return;
    
    performance.mark('bundle-start');
    
    this.isActive = true;
    
    if (this.coach) {
      this.coach.start();
    }
    
    if (this.geometry) {
      this.geometry.show();
    }
    
    // Emit activation event
    this.eventBus.emit('coherence.bundleActivated', {
      timestamp: performance.now(),
      config: this.config
    });
    
    console.log('[Enhanced Bundle] Training session started');
  }

  stop(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    if (this.coach) {
      this.coach.stop();
    }
    
    if (this.geometry) {
      this.geometry.hide();
    }
    
    this.eventBus.emit('coherence.bundleDeactivated', {
      timestamp: performance.now()
    });
    
    console.log('[Enhanced Bundle] Training session stopped');
  }

  // Public API methods
  showGeometry(): void {
    if (this.geometry) {
      this.geometry.show();
    }
  }

  hideGeometry(): void {
    if (this.geometry) {
      this.geometry.hide();
    }
  }

  setGeometryPattern(pattern: string): void {
    if (this.geometry) {
      this.geometry.setPattern(pattern);
    }
  }

  setBreathingPattern(pattern: string): void {
    if (this.coach) {
      this.coach.setBreathingPattern(pattern);
    }
  }

  updateConfig(newConfig: Partial<CoherenceBundleConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.coach && newConfig.accessibilityMode !== undefined) {
      this.coach.enableAccessibilityMode(newConfig.accessibilityMode);
    }
    
    if (this.geometry && newConfig.performanceMode !== undefined) {
      this.geometry.enablePerformanceMode(newConfig.performanceMode);
    }
    
    console.log('[Enhanced Bundle] Configuration updated');
  }

  // Memory leak prevention
  dispose(): void {
    this.stop();
    
    if (this.coach) {
      this.coach.dispose();
      this.coach = null;
    }
    
    if (this.geometry) {
      this.geometry.dispose();
      this.geometry = null;
    }
    
    if (this.performanceMonitor) {
      this.performanceMonitor.disconnect();
      this.performanceMonitor = null;
    }
    
    console.log('[Enhanced Bundle] Disposed and cleaned up');
  }

  // Debug utilities
  getPerformanceMetrics(): any {
    return {
      isActive: this.isActive,
      config: this.config,
      hasCoach: !!this.coach,
      hasGeometry: !!this.geometry,
      eventBusListeners: this.eventBus?.listeners?.size || 0
    };
  }
}

// Global instance management
let globalBundle: EnhancedCoherenceBundle | null = null;

export async function initCoherenceBundle(config?: CoherenceBundleConfig): Promise<EnhancedCoherenceBundle> {
  // Dispose existing instance
  if (globalBundle) {
    globalBundle.dispose();
  }
  
  globalBundle = new EnhancedCoherenceBundle(config);
  await globalBundle.initialize();
  
  // Expose to window for external access
  window.enhancedCoherenceBundle = globalBundle;
  
  return globalBundle;
}

export function getCoherenceBundle(): EnhancedCoherenceBundle | null {
  return globalBundle;
}

export function startCoherenceTraining(): void {
  if (globalBundle) {
    globalBundle.start();
  }
}

export function stopCoherenceTraining(): void {
  if (globalBundle) {
    globalBundle.stop();
  }
}

export function toggleSriYantra(): void {
  if (globalBundle) {
    // Toggle geometry visibility
    const isVisible = globalBundle.getPerformanceMetrics().isActive;
    if (isVisible) {
      globalBundle.hideGeometry();
    } else {
      globalBundle.showGeometry();
    }
  }
}

export function switchBreathingPattern(pattern: string): void {
  if (globalBundle) {
    globalBundle.setBreathingPattern(pattern);
  }
}

// Hot Module Replacement support
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (globalBundle) {
      globalBundle.dispose();
      globalBundle = null;
    }
  });
}

// Type exports
export type { CoherenceBundleConfig };
export { EnhancedCoherenceBundle };
export default initCoherenceBundle;