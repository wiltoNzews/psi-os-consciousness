/**
 * Internal + Visual Coherence Bundle - Main orchestration module
 * Initializes and coordinates all coherence training components
 */

import { CoherenceCoach } from './coachOverlay';
import { SacredGeometryOverlay } from './geometryOverlay';
import { ConsciousnessResponsiveMorpher } from './morphing';
import { ConfigManager, defaultConfig } from './config';
import type { CoherenceData, CoherenceBundleConfig } from './types';

export class InternalCoherenceBundle {
  private coach: CoherenceCoach;
  private geometryOverlay: SacredGeometryOverlay;
  private morpher: ConsciousnessResponsiveMorpher;
  private configManager: ConfigManager;
  private isInitialized = false;
  private eventListeners: (() => void)[] = [];

  constructor(initialConfig?: Partial<CoherenceBundleConfig>) {
    this.configManager = new ConfigManager(initialConfig);
    const config = this.configManager.get();
    
    // Initialize components
    this.coach = new CoherenceCoach(config);
    this.geometryOverlay = new SacredGeometryOverlay(config);
    this.morpher = new ConsciousnessResponsiveMorpher({
      scale: config.geometryScale,
      rotation: 0,
      opacity: config.lineOpacity,
      lineWidth: 2
    });
    
    this.setupEventBusIntegration();
    this.setupConfigSynchronization();
    
    console.log('[Internal Coherence Bundle] Initialized');
  }

  private setupEventBusIntegration(): void {
    // Check if ψOS event bus is available
    if (typeof window !== 'undefined' && (window as any).bus) {
      const bus = (window as any).bus;
      
      // Listen for coherence data from ψOS
      const coherenceListener = (data: CoherenceData) => {
        this.handleCoherenceUpdate(data);
      };
      
      const zλListener = (value: number) => {
        this.handleCoherenceUpdate({ zλ: value, phi: this.getCurrentΦ() });
      };
      
      const phiListener = (value: number) => {
        this.handleCoherenceUpdate({ zλ: this.getCurrentZλ(), phi: value });
      };
      
      bus.on('coherenceData', coherenceListener);
      bus.on('zλ', zλListener);
      bus.on('phi', phiListener);
      
      // Store cleanup functions
      this.eventListeners.push(() => {
        bus.off('coherenceData', coherenceListener);
        bus.off('zλ', zλListener);
        bus.off('phi', phiListener);
      });
      
      console.log('[Coherence Bundle] Connected to ψOS event bus');
    } else {
      console.warn('[Coherence Bundle] ψOS event bus not found, using fallback data');
      this.startFallbackDataGeneration();
    }
  }

  private setupConfigSynchronization(): void {
    this.configManager.onChange((config) => {
      this.coach.updateConfig(config);
      this.geometryOverlay.updateConfig(config);
      
      // Update morpher settings
      this.morpher.getMorphingEngine().setInterpolationSpeed(config.morphStrength * 2);
      this.morpher.setBreathSyncEnabled(config.showBreathGuide);
      
      console.log('[Coherence Bundle] Configuration updated');
    });
  }

  public start(): void {
    if (this.isInitialized) return;
    
    const config = this.configManager.get();
    
    if (config.enabled) {
      if (config.showBreathGuide) {
        this.coach.start();
      }
      
      this.geometryOverlay.init(config.geometryPattern);
      this.isInitialized = true;
      
      console.log('[Coherence Bundle] Training session started');
      this.emitEvent('bundle:started');
    }
  }

  public stop(): void {
    if (!this.isInitialized) return;
    
    this.coach.stop();
    this.geometryOverlay.hide();
    this.isInitialized = false;
    
    console.log('[Coherence Bundle] Training session stopped');
    this.emitEvent('bundle:stopped');
  }

  public toggle(): void {
    if (this.isInitialized) {
      this.stop();
    } else {
      this.start();
    }
  }

  private handleCoherenceUpdate(data: CoherenceData): void {
    // Update morpher with new data
    this.morpher.updateCoherence(data);
    
    // Get morphed state and apply to geometry
    const morphedState = this.morpher.getMorphedState(0.016); // Assume 60fps
    
    // Apply harmonic resonance for sacred frequencies
    this.morpher.applyHarmonicResonance(432); // 432Hz tuning
    
    // Emit processed coherence data
    this.emitEvent('bundle:coherence-processed', {
      original: data,
      morphed: morphedState,
      trend: this.morpher.getCoherenceTrend()
    });
  }

  private getCurrentZλ(): number {
    return this.coach.getCurrentState().currentZλ;
  }

  private getCurrentΦ(): number {
    return this.coach.getCurrentState().currentΦ;
  }

  private startFallbackDataGeneration(): void {
    // Generate realistic consciousness data when ψOS data unavailable
    let baseZλ = 0.75;
    let baseΦ = 0.50;
    
    const generateData = () => {
      // Natural drift with breathing influence
      const breathInfluence = this.coach.getCurrentState().breathState;
      let breathFactor = 0;
      
      if (breathInfluence.isActive) {
        switch (breathInfluence.phase) {
          case 'inhale':
            breathFactor = breathInfluence.progress * 0.1;
            break;
          case 'hold':
            breathFactor = 0.15;
            break;
          case 'exhale':
            breathFactor = (1 - breathInfluence.progress) * 0.1;
            break;
          case 'pause':
            breathFactor = 0.05;
            break;
        }
      }
      
      // Natural coherence drift
      baseZλ += (Math.random() - 0.5) * 0.02 + breathFactor * 0.1;
      baseΦ += (Math.random() - 0.5) * 0.015 + breathFactor * 0.08;
      
      // Keep within realistic bounds
      baseZλ = Math.max(0.6, Math.min(0.999, baseZλ));
      baseΦ = Math.max(0.3, Math.min(1.0, baseΦ));
      
      this.handleCoherenceUpdate({
        zλ: baseZλ,
        phi: baseΦ,
        coherence: (baseZλ + baseΦ) / 2,
        timestamp: Date.now()
      });
    };
    
    // Update at 30fps for smooth feedback
    setInterval(generateData, 33);
    console.log('[Coherence Bundle] Fallback data generation started');
  }

  private emitEvent(eventName: string, data?: any): void {
    if (typeof window !== 'undefined' && (window as any).bus) {
      (window as any).bus.emit(eventName, data);
    }
  }

  // Public API methods
  public getConfig(): CoherenceBundleConfig {
    return this.configManager.get();
  }

  public updateConfig(updates: Partial<CoherenceBundleConfig>): void {
    this.configManager.update(updates);
  }

  public setBreathingPattern(patternName: 'Coherent' | 'Deep Unity' | 'Alpha Focus' | 'Transcendent'): void {
    this.coach.setBreathingPattern(patternName);
  }

  public setGeometryPattern(pattern: 'SriYantra' | 'Fibonacci'): void {
    this.geometryOverlay.setPattern(pattern);
    this.updateConfig({ geometryPattern: pattern });
  }

  public showGeometry(): void {
    this.geometryOverlay.show();
  }

  public hideGeometry(): void {
    this.geometryOverlay.hide();
  }

  public toggleGeometry(): void {
    const state = this.geometryOverlay.getCurrentState();
    if (state.isVisible) {
      this.hideGeometry();
    } else {
      this.showGeometry();
    }
  }

  public exportConfiguration(): string {
    return this.configManager.export();
  }

  public importConfiguration(configJson: string): boolean {
    return this.configManager.import(configJson);
  }

  public resetConfiguration(): void {
    this.configManager.reset();
  }

  public getSystemState() {
    return {
      isInitialized: this.isInitialized,
      config: this.configManager.get(),
      coach: this.coach.getCurrentState(),
      geometry: this.geometryOverlay.getCurrentState(),
      coherenceTrend: this.morpher.getCoherenceTrend()
    };
  }

  public destroy(): void {
    console.log('[Coherence Bundle] Destroying...');
    
    this.stop();
    
    // Clean up event listeners
    this.eventListeners.forEach(cleanup => cleanup());
    this.eventListeners = [];
    
    // Destroy components
    this.coach.destroy();
    this.geometryOverlay.destroy();
    
    console.log('[Coherence Bundle] Destroyed');
  }
}

// Main initialization function for ψOS integration
export function initCoherenceBundle(config?: Partial<CoherenceBundleConfig>): InternalCoherenceBundle {
  const bundle = new InternalCoherenceBundle(config);
  
  // Auto-start if enabled in config
  if (bundle.getConfig().enabled) {
    bundle.start();
  }
  
  // Make available globally for debugging and external control
  if (typeof window !== 'undefined') {
    (window as any).coherenceBundle = bundle;
  }
  
  return bundle;
}

// Export types and utilities
export type { CoherenceData, CoherenceBundleConfig, BreathState, GeometryPattern } from './types';
export { defaultConfig, breathingPatterns, geometryConfigs } from './config';
export { CoherenceCoach } from './coachOverlay';
export { SacredGeometryOverlay } from './geometryOverlay';
export { MorphingEngine, ConsciousnessResponsiveMorpher } from './morphing';