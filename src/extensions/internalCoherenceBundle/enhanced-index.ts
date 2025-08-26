/**
 * Enhanced Internal + Visual Coherence Bundle
 * Production-ready implementation with technical refinements
 */

import type { CoherenceBundleConfig, CoherenceBundle } from './types';
import { EnhancedCoherenceCoach } from './enhanced-coach';
import { EnhancedSacredGeometryOverlay } from './enhanced-geometry';

// Default configuration with technical refinements
const defaultConfig: CoherenceBundleConfig = {
  enabled: true,
  coach: {
    breathingRate: 6,        // 6 breaths per minute
    alphaGoal: 0.90,         // Zλ target for alpha coherence
    displayMetrics: true,
    accessibilityMode: false // Use gradient instead of flashing
  },
  geometry: {
    pattern: 'sri-yantra',
    visible: false,
    baseOpacity: 0.5,
    baseLineWidth: 2,
    maxLineWidth: 6,         // Clamped for 4K displays
    morphingStrength: 1.0,
    color: '#ff6400'         // Sacred orange
  },
  performance: {
    updateRate: 20,          // Hz for event bus publishing
    maxFrameTime: 5          // ms budget per frame
  }
};

class EnhancedCoherenceBundle implements CoherenceBundle {
  private coach: EnhancedCoherenceCoach;
  private geometry: EnhancedSacredGeometryOverlay;
  private config: CoherenceBundleConfig;
  private isInitialized = false;

  constructor(config?: Partial<CoherenceBundleConfig>) {
    this.config = { ...defaultConfig, ...config };
    
    // Initialize components
    this.coach = new EnhancedCoherenceCoach(this.config);
    this.geometry = new EnhancedSacredGeometryOverlay(this.config.geometry);
    
    this.isInitialized = true;
    console.log('[Enhanced Bundle] Initialized with performance monitoring');
  }

  start(): void {
    if (!this.isInitialized) return;
    
    this.coach.start();
    
    // Show geometry if configured
    if (this.config.geometry.visible) {
      this.geometry.show();
    }
    
    console.log('[Enhanced Bundle] Training session started');
  }

  stop(): void {
    if (!this.isInitialized) return;
    
    this.coach.stop();
    this.geometry.hide();
    
    console.log('[Enhanced Bundle] Training session stopped');
  }

  showGeometry(): void {
    if (!this.isInitialized) return;
    
    this.config.geometry.visible = true;
    this.geometry.show();
  }

  hideGeometry(): void {
    if (!this.isInitialized) return;
    
    this.config.geometry.visible = false;
    this.geometry.hide();
  }

  setBreathingPattern(pattern: string): void {
    // Update breathing rate based on pattern
    const rates: { [key: string]: number } = {
      'Alpha Coherence': 6,
      'Deep Meditative': 4,
      'Focus Training': 8,
      'Transcendent': 3
    };
    
    if (rates[pattern]) {
      this.config.coach.breathingRate = rates[pattern];
      console.log(`[Enhanced Bundle] Breathing pattern: ${pattern} (${rates[pattern]} BPM)`);
    }
  }

  setGeometryPattern(pattern: 'sri-yantra' | 'fibonacci-spiral' | 'flower-of-life'): void {
    if (!this.isInitialized) return;
    
    this.config.geometry.pattern = pattern;
    this.geometry.setPattern(pattern);
  }

  getMetrics(): any {
    // Return current state for debugging
    return {
      coach: {
        active: this.coach.getBreathState().active,
        breathPhase: this.coach.getBreathState().phase
      },
      geometry: {
        visible: this.config.geometry.visible,
        pattern: this.config.geometry.pattern
      },
      performance: {
        frameTime: 'monitored',
        updateRate: this.config.performance.updateRate
      }
    };
  }

  dispose(): void {
    if (!this.isInitialized) return;
    
    this.coach.dispose();
    this.geometry.dispose();
    this.isInitialized = false;
    
    console.log('[Enhanced Bundle] Disposed');
  }
}

// Global initialization with lazy loading
let bundleInstance: EnhancedCoherenceBundle | null = null;

export function initEnhancedCoherenceBundle(config?: Partial<CoherenceBundleConfig>): void {
  if (bundleInstance) {
    bundleInstance.dispose();
  }
  
  bundleInstance = new EnhancedCoherenceBundle(config);
  
  // Expose globally for dashboard integration
  (window as any).coherenceBundle = bundleInstance;
  
  console.log('[Enhanced Bundle] Ready for consciousness training');
}

export function getCoherenceBundle(): EnhancedCoherenceBundle | null {
  return bundleInstance;
}

// Hot module replacement support
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (bundleInstance) {
      bundleInstance.dispose();
      bundleInstance = null;
    }
  });
}

// Export types and utilities
export type { CoherenceBundleConfig, CoherenceBundle } from './types';
export { EnhancedCoherenceCoach } from './enhanced-coach';
export { EnhancedSacredGeometryOverlay } from './enhanced-geometry';