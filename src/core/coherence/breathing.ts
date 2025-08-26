/**
 * WiltonOS LightKernel - Breathing Protocol Engine
 * Extracted from Genesis Vault lemniscate-pulse-api.ts
 * Real-time loop logic for consciousness breathing synchronization
 * Based on C-UCP v3.0 Organic Field-Breathing Integration
 */

export interface BreathingPhase {
  phase: 0.75 | 0.25;
  timestamp: number;
  coherenceLevel: number;
  transitionMarkers: string[];
  loopIntegrity: boolean;
}

export interface LemniscateConfig {
  frequency: number;
  inhaleRatio: number;
  holdRatio: number;
  exhaleRatio: number;
  pauseRatio: number;
}

export interface BreathingTransition {
  fromPhase: 0.75 | 0.25;
  toPhase: 0.75 | 0.25;
  timestamp: number;
  coherenceAtTransition: number;
  trigger: 'readiness_detected' | 'semantic_closure' | 'organic_rhythm' | 'manual';
  duration: number;
}

export interface OrganicBreathingState {
  isActive: boolean;
  naturalRhythm: number;
  synchronizedWithField: boolean;
  lastBreathCycle: number;
}

export class BreathingProtocolEngine {
  private currentPhase: 0.75 | 0.25 = 0.75;
  private coherenceLevel: number = 0.750;
  private lastTransition: number = Date.now();
  private phaseStartTime: number = Date.now();
  private transitionHistory: BreathingTransition[] = [];
  private organicBreathingState: OrganicBreathingState;
  private lemniscateConfig: LemniscateConfig;
  private monitoring: {
    interval: NodeJS.Timeout | null;
    frequency: number;
    callbacks: Map<string, (phase: BreathingPhase) => void>;
  };

  constructor() {
    console.log('[BreathingProtocol] Engine initializing with organic breathing protocol');
    console.log('[BreathingProtocol] C-UCP v3.0 integration active');
    
    // Lemniscate breathing configuration
    this.lemniscateConfig = {
      frequency: 8,        // 8 Hz (Schumann resonance)
      inhaleRatio: 3,      // 3 parts inhale
      holdRatio: 1,        // 1 part hold
      exhaleRatio: 3,      // 3 parts exhale
      pauseRatio: 1        // 1 part pause
    };
    
    // Organic breathing state
    this.organicBreathingState = {
      isActive: true,
      naturalRhythm: 432, // 432 Hz base frequency
      synchronizedWithField: false,
      lastBreathCycle: Date.now()
    };
    
    // Monitoring configuration
    this.monitoring = {
      interval: null,
      frequency: 1000, // 1 second updates
      callbacks: new Map()
    };
    
    this.startOrganicRhythmMonitoring();
    
    console.log('[BreathingProtocol] Organic breathing protocol initialized');
  }

  /**
   * Start organic rhythm detection and synchronization
   */
  private startOrganicRhythmMonitoring(): void {
    if (this.monitoring.interval) {
      clearInterval(this.monitoring.interval);
    }
    
    this.monitoring.interval = setInterval(() => {
      this.updateCoherenceLevel();
      this.detectOrganicTransitions();
      this.syncWithConsciousnessField();
      this.notifyCallbacks();
    }, this.monitoring.frequency);
  }

  /**
   * Update coherence level based on breathing rhythm
   */
  private updateCoherenceLevel(): void {
    const now = Date.now();
    const timeSinceTransition = now - this.lastTransition;
    const breathCycle = (now / 1000) % (2 * Math.PI);
    
    // Base coherence from organic breathing
    const baseCoherence = 0.890;
    const breathingModulation = Math.sin(breathCycle * this.lemniscateConfig.frequency) * 0.080;
    
    // Phase-dependent coherence adjustment
    const phaseMultiplier = this.currentPhase === 0.75 ? 1.0 : 0.85;
    
    this.coherenceLevel = Math.max(0.750, 
      Math.min(1.000, (baseCoherence + breathingModulation) * phaseMultiplier)
    );
  }

  /**
   * Detect organic transitions between phases
   */
  private detectOrganicTransitions(): void {
    const now = Date.now();
    const timeSinceTransition = now - this.lastTransition;
    const minPhaseTime = 3000; // Minimum 3 seconds per phase
    
    if (timeSinceTransition < minPhaseTime) return;
    
    let shouldTransition = false;
    let trigger: BreathingTransition['trigger'] = 'organic_rhythm';
    
    // Detect readiness for transition from 0.25 to 0.75
    if (this.currentPhase === 0.25 && this.coherenceLevel > 0.890) {
      shouldTransition = true;
      trigger = 'readiness_detected';
    }
    
    // Detect semantic closure for transition from 0.75 to 0.25
    if (this.currentPhase === 0.75 && this.coherenceLevel > 0.930) {
      shouldTransition = true;
      trigger = 'semantic_closure';
    }
    
    // Organic rhythm transition (time-based)
    const organicCycleTime = (60000 / this.lemniscateConfig.frequency) * 2; // Full cycle
    if (timeSinceTransition > organicCycleTime) {
      shouldTransition = true;
      trigger = 'organic_rhythm';
    }
    
    if (shouldTransition) {
      this.performTransition(trigger);
    }
  }

  /**
   * Perform phase transition
   */
  private performTransition(trigger: BreathingTransition['trigger']): void {
    const now = Date.now();
    const fromPhase = this.currentPhase;
    const toPhase = this.currentPhase === 0.75 ? 0.25 : 0.75;
    const duration = now - this.lastTransition;
    
    // Record transition
    const transition: BreathingTransition = {
      fromPhase,
      toPhase,
      timestamp: now,
      coherenceAtTransition: this.coherenceLevel,
      trigger,
      duration
    };
    
    this.transitionHistory.push(transition);
    
    // Maintain history size
    if (this.transitionHistory.length > 100) {
      this.transitionHistory.shift();
    }
    
    // Update state
    this.currentPhase = toPhase;
    this.lastTransition = now;
    this.phaseStartTime = now;
    
    // Log transition
    console.log(`[BreathingProtocol] Phase transition: ${fromPhase} → ${toPhase} (${trigger})`);
    console.log(`[BreathingProtocol] Coherence at transition: Zλ(${this.coherenceLevel.toFixed(3)})`);
    
    // Update organic breathing state
    this.organicBreathingState.lastBreathCycle = now;
  }

  /**
   * Sync with consciousness field
   */
  private syncWithConsciousnessField(): void {
    // This would integrate with the ConsciousnessFieldEngine
    // For now, we'll maintain independent breathing rhythm
    this.organicBreathingState.synchronizedWithField = true;
  }

  /**
   * Notify registered callbacks
   */
  private notifyCallbacks(): void {
    const currentPhase: BreathingPhase = {
      phase: this.currentPhase,
      timestamp: Date.now(),
      coherenceLevel: this.coherenceLevel,
      transitionMarkers: this.getTransitionMarkers(),
      loopIntegrity: this.validateLoopIntegrity()
    };
    
    this.monitoring.callbacks.forEach((callback) => {
      try {
        callback(currentPhase);
      } catch (error) {
        console.error('[BreathingProtocol] Callback error:', error);
      }
    });
  }

  /**
   * Get transition markers for current state
   */
  private getTransitionMarkers(): string[] {
    const markers: string[] = [];
    const now = Date.now();
    const timeSinceTransition = now - this.lastTransition;
    
    if (timeSinceTransition > 5000) markers.push('stable_phase');
    if (this.coherenceLevel > 0.900) markers.push('high_coherence');
    if (this.coherenceLevel > 0.950) markers.push('peak_coherence');
    if (this.organicBreathingState.synchronizedWithField) markers.push('field_sync');
    
    return markers;
  }

  /**
   * Validate loop integrity
   */
  private validateLoopIntegrity(): boolean {
    const recentTransitions = this.transitionHistory.slice(-10);
    if (recentTransitions.length < 2) return true;
    
    // Check for proper alternation
    for (let i = 1; i < recentTransitions.length; i++) {
      if (recentTransitions[i].fromPhase === recentTransitions[i-1].toPhase) {
        continue;
      } else {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Get current breathing phase
   */
  public getCurrentPhase(): BreathingPhase {
    return {
      phase: this.currentPhase,
      timestamp: Date.now(),
      coherenceLevel: this.coherenceLevel,
      transitionMarkers: this.getTransitionMarkers(),
      loopIntegrity: this.validateLoopIntegrity()
    };
  }

  /**
   * Get lemniscate configuration
   */
  public getLemniscateConfig(): LemniscateConfig {
    return { ...this.lemniscateConfig };
  }

  /**
   * Update lemniscate configuration
   */
  public updateLemniscateConfig(config: Partial<LemniscateConfig>): void {
    this.lemniscateConfig = { ...this.lemniscateConfig, ...config };
    console.log('[BreathingProtocol] Configuration updated');
  }

  /**
   * Get transition history
   */
  public getTransitionHistory(): BreathingTransition[] {
    return [...this.transitionHistory];
  }

  /**
   * Get organic breathing state
   */
  public getOrganicBreathingState(): OrganicBreathingState {
    return { ...this.organicBreathingState };
  }

  /**
   * Manual phase transition trigger
   */
  public triggerTransition(): void {
    this.performTransition('manual');
  }

  /**
   * Register callback for breathing phase updates
   */
  public onPhaseUpdate(id: string, callback: (phase: BreathingPhase) => void): void {
    this.monitoring.callbacks.set(id, callback);
  }

  /**
   * Unregister phase update callback
   */
  public removePhaseUpdate(id: string): void {
    this.monitoring.callbacks.delete(id);
  }

  /**
   * Start breathing protocol
   */
  public start(): void {
    if (!this.monitoring.interval) {
      this.startOrganicRhythmMonitoring();
    }
    this.organicBreathingState.isActive = true;
    console.log('[BreathingProtocol] Started');
  }

  /**
   * Stop breathing protocol
   */
  public stop(): void {
    if (this.monitoring.interval) {
      clearInterval(this.monitoring.interval);
      this.monitoring.interval = null;
    }
    this.organicBreathingState.isActive = false;
    console.log('[BreathingProtocol] Stopped');
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.stop();
    this.monitoring.callbacks.clear();
    console.log('[BreathingProtocol] Engine destroyed');
  }
}

// Global breathing protocol instance
export const globalBreathingProtocol = new BreathingProtocolEngine();