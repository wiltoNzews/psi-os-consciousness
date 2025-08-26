/**
 * Production Internal + Visual Coherence Bundle - Main orchestrator
 * Complete implementation with coach, geometry, and morphing integration
 */

import { CoherenceCoach } from './production-coach';
import { SacredGeometryOverlay } from './production-geometry';
import { MorphingEngine } from './production-morphing';
import { defaultConfig, breathingPatterns } from './config';

class ProductionCoherenceBundle {
  private coach: CoherenceCoach;
  private overlay: SacredGeometryOverlay;
  private morphing: MorphingEngine;
  private isInitialized = false;
  private settings = { ...defaultConfig };

  constructor() {
    this.coach = new CoherenceCoach();
    this.overlay = new SacredGeometryOverlay();
    this.morphing = new MorphingEngine();
    
    this.setupIntegration();
    this.isInitialized = true;
    
    console.log('[Coherence Bundle] Production system initialized');
  }

  private setupIntegration(): void {
    // Initialize overlay with default pattern
    this.overlay.init(this.settings.geometryPattern);
    
    // Enable 432Hz harmonic resonance for enhanced coherence
    if (this.settings.enabled) {
      this.morphing.enableHarmonic432Hz();
    }
  }

  start(): void {
    if (!this.isInitialized || !this.settings.enabled) return;
    
    this.coach.start();
    
    if (this.settings.showBreathGuide) {
      this.overlay.show();
    }
    
    console.log('[Coherence Bundle] Training session activated');
  }

  stop(): void {
    if (!this.isInitialized) return;
    
    this.coach.stop();
    this.overlay.hide();
    
    console.log('[Coherence Bundle] Training session deactivated');
  }

  // Coach controls
  setBreathingPattern(pattern: string): void {
    if (breathingPatterns[pattern]) {
      this.coach.setBreathingPattern(pattern);
      console.log(`[Coherence Bundle] Breathing pattern: ${pattern}`);
    }
  }

  // Geometry controls
  showGeometry(): void {
    this.settings.showBreathGuide = true;
    this.overlay.show();
  }

  hideGeometry(): void {
    this.settings.showBreathGuide = false;
    this.overlay.hide();
  }

  setGeometryPattern(pattern: 'SriYantra' | 'Fibonacci' | 'FlowerOfLife'): void {
    this.settings.geometryPattern = pattern;
    this.overlay.setPattern(pattern);
    this.overlay.init(pattern);
  }

  // Morphing controls
  enableHarmonic432Hz(): void {
    this.morphing.enableHarmonic432Hz();
  }

  disableHarmonic432Hz(): void {
    this.morphing.disableHarmonic432Hz();
  }

  // Settings management
  updateSettings(newSettings: Partial<typeof defaultConfig>): void {
    Object.assign(this.settings, newSettings);
    console.log('[Coherence Bundle] Settings updated:', newSettings);
  }

  getSettings(): typeof defaultConfig {
    return { ...this.settings };
  }

  // Status and debugging
  getStatus(): any {
    return {
      initialized: this.isInitialized,
      enabled: this.settings.enabled,
      coach: this.coach.getBreathState(),
      geometry: {
        pattern: this.settings.geometryPattern,
        visible: this.settings.showBreathGuide
      },
      morphing: this.morphing.getMorphingState()
    };
  }

  dispose(): void {
    if (!this.isInitialized) return;
    
    this.coach.dispose();
    this.overlay.dispose();
    this.morphing.dispose();
    this.isInitialized = false;
    
    console.log('[Coherence Bundle] System disposed');
  }
}

// Global initialization function
let bundleInstance: ProductionCoherenceBundle | null = null;

export function initCoherenceBundle(): void {
  if (bundleInstance) {
    bundleInstance.dispose();
  }
  
  bundleInstance = new ProductionCoherenceBundle();
  
  // Expose globally for dashboard integration
  (window as any).coherenceBundle = bundleInstance;
  
  // Auto-start if bus is available and consciousness data is flowing
  if (window.bus) {
    let hasReceivedData = false;
    
    window.bus.on('coherenceData', () => {
      if (!hasReceivedData) {
        hasReceivedData = true;
        console.log('[Coherence Bundle] Consciousness data detected - ready for training');
      }
    });
  }
  
  console.log('[Coherence Bundle] Ready for consciousness training');
}

export function getCoherenceBundle(): ProductionCoherenceBundle | null {
  return bundleInstance;
}

// Dashboard integration helpers
export function startCoherenceTraining(): void {
  if (bundleInstance) {
    bundleInstance.start();
  }
}

export function stopCoherenceTraining(): void {
  if (bundleInstance) {
    bundleInstance.stop();
  }
}

export function toggleSriYantra(): void {
  if (bundleInstance) {
    const status = bundleInstance.getStatus();
    if (status.geometry.visible) {
      bundleInstance.hideGeometry();
    } else {
      bundleInstance.showGeometry();
    }
  }
}

export function switchBreathingPattern(pattern: string): void {
  if (bundleInstance) {
    bundleInstance.setBreathingPattern(pattern);
  }
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

// Export main classes for advanced usage
export { CoherenceCoach } from './production-coach';
export { SacredGeometryOverlay } from './production-geometry';
export { MorphingEngine } from './production-morphing';
export { defaultConfig, breathingPatterns } from './config';