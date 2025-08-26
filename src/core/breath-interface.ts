/**
 * WiltonOS LightKernel - Breath Interface
 * Quantum breath layer implementing 7:2 → 3× cycles → light pattern unlock
 * Core soul interface that cannot be faked or replicated
 */

import { globalBreathingProtocol } from './coherence/breathing';
import { globalConsciousnessField } from './consciousness/field';
import type { BreathingPhase, ConsciousnessField } from '../types/consciousness';

export interface BreathCycle {
  inhale: number;    // Duration in seconds
  hold: number;      // Duration in seconds  
  exhale: number;    // Duration in seconds
  pause: number;     // Duration in seconds
}

export interface BreathPattern {
  name: string;
  cycles: BreathCycle[];
  totalDuration: number;
  expectedCoherence: number;
  lightPatternUnlock: boolean;
}

export interface BreathSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  pattern: BreathPattern;
  actualCycles: BreathCycle[];
  coherenceReadings: number[];
  lightPatternsUnlocked: string[];
  soulUnlockAchieved: boolean;
}

export interface BreathCalibration {
  baselineCoherence: number;
  naturalRhythm: number;
  optimalPattern: BreathPattern;
  personalFrequency: number;
  calibrationTimestamp: number;
}

export class BreathInterface {
  private currentSession: BreathSession | null = null;
  private calibration: BreathCalibration | null = null;
  private breathPatterns: Map<string, BreathPattern> = new Map();
  private sessionHistory: BreathSession[] = [];
  private isListening: boolean = false;
  private rhythmDetection: {
    keystrokes: number[];
    micInput: number[];
    lastUpdate: number;
  };

  constructor() {
    this.initializeBreathPatterns();
    this.rhythmDetection = {
      keystrokes: [],
      micInput: [],
      lastUpdate: Date.now()
    };
    
    console.log('[BreathInterface] Quantum breath layer initialized');
    console.log('[BreathInterface] Soul interface ready - breath is truth');
  }

  /**
   * Initialize sacred breath patterns
   */
  private initializeBreathPatterns(): void {
    // The sacred 7:2 pattern - kernel unlock sequence
    this.breathPatterns.set('sacred_72', {
      name: 'Sacred 7:2 Unlock',
      cycles: [
        { inhale: 7, hold: 2, exhale: 7, pause: 2 },
        { inhale: 7, hold: 2, exhale: 7, pause: 2 },
        { inhale: 7, hold: 2, exhale: 7, pause: 2 }
      ],
      totalDuration: 54, // 18 seconds × 3 cycles
      expectedCoherence: 0.920,
      lightPatternUnlock: true
    });

    // Fibonacci breathing - golden ratio alignment
    this.breathPatterns.set('fibonacci', {
      name: 'Fibonacci Spiral',
      cycles: [
        { inhale: 3, hold: 2, exhale: 5, pause: 1 },
        { inhale: 5, hold: 3, exhale: 8, pause: 2 },
        { inhale: 8, hold: 5, exhale: 13, pause: 3 }
      ],
      totalDuration: 48,
      expectedCoherence: 0.888,
      lightPatternUnlock: true
    });

    // Schumann resonance breathing - Earth alignment
    this.breathPatterns.set('schumann', {
      name: 'Schumann Resonance',
      cycles: [
        { inhale: 8, hold: 0, exhale: 8, pause: 0 },
        { inhale: 8, hold: 0, exhale: 8, pause: 0 },
        { inhale: 8, hold: 0, exhale: 8, pause: 0 }
      ],
      totalDuration: 48,
      expectedCoherence: 0.863,
      lightPatternUnlock: false
    });

    // Divine proportion breathing - transcendent state
    this.breathPatterns.set('divine', {
      name: 'Divine Proportion',
      cycles: [
        { inhale: 10, hold: 6, exhale: 16, pause: 4 },
        { inhale: 10, hold: 6, exhale: 16, pause: 4 },
        { inhale: 10, hold: 6, exhale: 16, pause: 4 }
      ],
      totalDuration: 108, // Sacred 108
      expectedCoherence: 0.963,
      lightPatternUnlock: true
    });

    console.log('[BreathInterface] Sacred breath patterns loaded:', this.breathPatterns.size);
  }

  /**
   * Start breath calibration session
   */
  public async startCalibration(): Promise<BreathCalibration> {
    console.log('[BreathInterface] Starting breath calibration - finding your natural rhythm');
    
    const baselineField = globalConsciousnessField.getCurrentField();
    const baselineBreathing = globalBreathingProtocol.getCurrentPhase();
    
    // Measure natural breathing rhythm over 60 seconds
    const naturalRhythm = await this.measureNaturalRhythm();
    
    // Test different patterns to find optimal
    const optimalPattern = await this.findOptimalPattern(naturalRhythm);
    
    // Calculate personal frequency
    const personalFrequency = this.calculatePersonalFrequency(naturalRhythm, baselineField);
    
    this.calibration = {
      baselineCoherence: baselineField.zLambda,
      naturalRhythm,
      optimalPattern,
      personalFrequency,
      calibrationTimestamp: Date.now()
    };
    
    console.log('[BreathInterface] Calibration complete - personal frequency established');
    return this.calibration;
  }

  /**
   * Start breath session with specific pattern
   */
  public startSession(patternName: string): BreathSession {
    const pattern = this.breathPatterns.get(patternName);
    if (!pattern) {
      throw new Error(`Breath pattern '${patternName}' not found`);
    }

    if (this.currentSession) {
      this.endSession();
    }

    this.currentSession = {
      sessionId: `breath_${Date.now()}`,
      startTime: Date.now(),
      pattern,
      actualCycles: [],
      coherenceReadings: [],
      lightPatternsUnlocked: [],
      soulUnlockAchieved: false
    };

    console.log(`[BreathInterface] Session started: ${pattern.name}`);
    console.log(`[BreathInterface] Expected duration: ${pattern.totalDuration}s`);
    
    return this.currentSession;
  }

  /**
   * Record breath cycle during session
   */
  public recordBreathCycle(cycle: BreathCycle): void {
    if (!this.currentSession) {
      throw new Error('No active breath session');
    }

    this.currentSession.actualCycles.push(cycle);
    
    // Record current coherence
    const currentField = globalConsciousnessField.getCurrentField();
    this.currentSession.coherenceReadings.push(currentField.zLambda);
    
    // Check for light pattern unlock
    const cyclePrecision = this.calculateCyclePrecision(cycle, this.currentSession.pattern.cycles[0]);
    if (cyclePrecision > 0.90 && currentField.zLambda > 0.900) {
      const lightPattern = this.detectLightPattern(cycle, currentField);
      if (lightPattern && !this.currentSession.lightPatternsUnlocked.includes(lightPattern)) {
        this.currentSession.lightPatternsUnlocked.push(lightPattern);
        console.log(`[BreathInterface] Light pattern unlocked: ${lightPattern}`);
      }
    }
    
    // Check for soul unlock (3 precise cycles with high coherence)
    if (this.currentSession.actualCycles.length >= 3 && !this.currentSession.soulUnlockAchieved) {
      const recentCycles = this.currentSession.actualCycles.slice(-3);
      const recentCoherence = this.currentSession.coherenceReadings.slice(-3);
      
      const avgPrecision = recentCycles.reduce((sum, c, i) => 
        sum + this.calculateCyclePrecision(c, this.currentSession!.pattern.cycles[i % this.currentSession!.pattern.cycles.length]), 0
      ) / 3;
      
      const avgCoherence = recentCoherence.reduce((sum, c) => sum + c, 0) / 3;
      
      if (avgPrecision > 0.85 && avgCoherence > 0.920) {
        this.currentSession.soulUnlockAchieved = true;
        console.log('[BreathInterface] 🌟 SOUL UNLOCK ACHIEVED - Divine interface activated');
      }
    }
  }

  /**
   * End current breath session
   */
  public endSession(): BreathSession | null {
    if (!this.currentSession) {
      return null;
    }

    this.currentSession.endTime = Date.now();
    this.sessionHistory.push(this.currentSession);
    
    // Maintain history size
    if (this.sessionHistory.length > 50) {
      this.sessionHistory.shift();
    }

    console.log(`[BreathInterface] Session completed: ${this.currentSession.pattern.name}`);
    console.log(`[BreathInterface] Cycles completed: ${this.currentSession.actualCycles.length}`);
    console.log(`[BreathInterface] Light patterns unlocked: ${this.currentSession.lightPatternsUnlocked.length}`);
    console.log(`[BreathInterface] Soul unlock: ${this.currentSession.soulUnlockAchieved ? 'YES' : 'NO'}`);

    const completedSession = this.currentSession;
    this.currentSession = null;
    
    return completedSession;
  }

  /**
   * Start rhythm detection from keystroke or mic input
   */
  public startRhythmDetection(source: 'keystrokes' | 'mic' = 'keystrokes'): void {
    this.isListening = true;
    this.rhythmDetection.lastUpdate = Date.now();
    
    if (source === 'keystrokes') {
      this.setupKeystrokeDetection();
    } else {
      this.setupMicDetection();
    }
    
    console.log(`[BreathInterface] Rhythm detection started: ${source}`);
  }

  /**
   * Stop rhythm detection
   */
  public stopRhythmDetection(): void {
    this.isListening = false;
    console.log('[BreathInterface] Rhythm detection stopped');
  }

  /**
   * Get available breath patterns
   */
  public getBreathPatterns(): BreathPattern[] {
    return Array.from(this.breathPatterns.values());
  }

  /**
   * Get current session status
   */
  public getCurrentSession(): BreathSession | null {
    return this.currentSession;
  }

  /**
   * Get calibration status
   */
  public getCalibration(): BreathCalibration | null {
    return this.calibration;
  }

  /**
   * Get session history
   */
  public getSessionHistory(): BreathSession[] {
    return [...this.sessionHistory];
  }

  /**
   * Measure natural breathing rhythm
   */
  private async measureNaturalRhythm(): Promise<number> {
    // Simulate natural rhythm measurement
    // In real implementation, this would use audio input or user timing
    return new Promise((resolve) => {
      setTimeout(() => {
        // Average human breathing rate: 12-20 breaths per minute
        const naturalRate = 15 + Math.random() * 5; // 15-20 bpm
        resolve(60 / naturalRate); // Convert to seconds per breath
      }, 1000);
    });
  }

  /**
   * Find optimal breath pattern for user
   */
  private async findOptimalPattern(naturalRhythm: number): Promise<BreathPattern> {
    // Find pattern closest to natural rhythm
    let bestPattern = this.breathPatterns.get('sacred_72')!;
    let bestScore = 0;
    
    for (const pattern of this.breathPatterns.values()) {
      const patternRhythm = pattern.totalDuration / pattern.cycles.length;
      const rhythmDiff = Math.abs(patternRhythm - naturalRhythm);
      const score = 1 / (1 + rhythmDiff);
      
      if (score > bestScore) {
        bestScore = score;
        bestPattern = pattern;
      }
    }
    
    return bestPattern;
  }

  /**
   * Calculate personal frequency based on breath and field
   */
  private calculatePersonalFrequency(naturalRhythm: number, field: ConsciousnessField): number {
    const baseFrequency = 432; // Universal frequency
    const rhythmFactor = naturalRhythm / 4; // Normalize to ~1
    const coherenceFactor = field.zLambda;
    const phaseFactor = Math.cos(field.psiPhase);
    
    return baseFrequency * rhythmFactor * coherenceFactor * (1 + phaseFactor * 0.1);
  }

  /**
   * Calculate precision of breath cycle
   */
  private calculateCyclePrecision(actual: BreathCycle, expected: BreathCycle): number {
    const inhalePrecision = 1 - Math.abs(actual.inhale - expected.inhale) / expected.inhale;
    const holdPrecision = expected.hold > 0 ? 1 - Math.abs(actual.hold - expected.hold) / expected.hold : 1;
    const exhalePrecision = 1 - Math.abs(actual.exhale - expected.exhale) / expected.exhale;
    const pausePrecision = expected.pause > 0 ? 1 - Math.abs(actual.pause - expected.pause) / expected.pause : 1;
    
    return (inhalePrecision + holdPrecision + exhalePrecision + pausePrecision) / 4;
  }

  /**
   * Detect light pattern from breath cycle and field
   */
  private detectLightPattern(cycle: BreathCycle, field: ConsciousnessField): string | null {
    // Sacred geometry patterns based on breath ratios
    const ratio = cycle.inhale / cycle.exhale;
    
    if (Math.abs(ratio - 1.618) < 0.1) {
      return 'golden_ratio_breath';
    } else if (Math.abs(ratio - 1.0) < 0.05) {
      return 'unity_breath';
    } else if (cycle.inhale === 7 && cycle.exhale === 7) {
      return 'sacred_seven_breath';
    } else if (field.zLambda > 0.950) {
      return 'transcendent_pattern';
    }
    
    return null;
  }

  /**
   * Setup keystroke rhythm detection
   */
  private setupKeystrokeDetection(): void {
    // This would be implemented in the frontend
    // For now, simulate rhythm detection
    const interval = setInterval(() => {
      if (!this.isListening) {
        clearInterval(interval);
        return;
      }
      
      // Simulate keystroke timing
      this.rhythmDetection.keystrokes.push(Date.now());
      if (this.rhythmDetection.keystrokes.length > 20) {
        this.rhythmDetection.keystrokes.shift();
      }
    }, 2000 + Math.random() * 2000);
  }

  /**
   * Setup microphone rhythm detection
   */
  private setupMicDetection(): void {
    // This would use Web Audio API in the frontend
    console.log('[BreathInterface] Microphone detection would be implemented in frontend');
  }

  /**
   * Clear session - reset to base state
   */
  public clear(): void {
    if (this.currentSession) {
      this.endSession();
    }
    
    this.stopRhythmDetection();
    this.rhythmDetection = {
      keystrokes: [],
      micInput: [],
      lastUpdate: Date.now()
    };
    
    console.log('[BreathInterface] Interface cleared - returning to base state');
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.clear();
    this.sessionHistory = [];
    this.calibration = null;
    console.log('[BreathInterface] Breath interface destroyed');
  }
}

// Global breath interface instance
export const globalBreathInterface = new BreathInterface();