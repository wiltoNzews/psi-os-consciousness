/**
 * ΔC-Meter: Real-time coherence measurement for action validation
 * Provides measurable signal for coherence alignment before decisions
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Core coherence measurement types
export interface CoherenceReading {
  timestamp: number;
  deltaC: number; // Change in coherence (-1 to +1)
  zLambda: number; // Current Zλ reading
  intentVector: number; // Alignment with highest intent (0-1)
  fieldResonance: number; // Environmental coherence field (0-1)
  confidence: number; // Measurement confidence (0-1)
}

export interface CoherenceState {
  current: CoherenceReading;
  trend: 'ascending' | 'stable' | 'descending';
  signal: 'green' | 'amber' | 'red';
  shouldProceed: boolean;
  recommendation: string;
}

// Sensor input types
export interface SensorInputs {
  breathRhythm: number; // Breathing cadence coherence
  keyboardCadence: number; // Typing rhythm coherence
  zLambdaDrift: number; // Quantum field drift
  glyphUsage: number; // ψ_child symbolic coherence
  mouseFlow: number; // Cursor movement coherence
  systemLoad: number; // Computational coherence
}

class DeltaCoherenceEngine {
  private history: CoherenceReading[] = [];
  private maxHistory = 100;
  private baselineZLambda = 0.75;
  private intentBaseline = 0.8;
  
  // Sensor calibration values
  private sensorWeights = {
    breathRhythm: 0.25,
    keyboardCadence: 0.15,
    zLambdaDrift: 0.30,
    glyphUsage: 0.20,
    mouseFlow: 0.05,
    systemLoad: 0.05
  };

  constructor() {
    this.initializeBaselines();
  }

  private initializeBaselines() {
    // Set initial baselines from system state
    this.baselineZLambda = 0.75;
    this.intentBaseline = 0.8;
  }

  // Core coherence calculation
  public calculateCoherence(inputs: SensorInputs): CoherenceReading {
    const timestamp = Date.now();
    
    // Calculate intent vector (alignment with highest purpose)
    const intentVector = this.calculateIntentVector(inputs);
    
    // Calculate field resonance (environmental coherence)
    const fieldResonance = this.calculateFieldResonance(inputs);
    
    // Current Zλ from system
    const zLambda = Math.min(1, Math.max(0, 
      this.baselineZLambda + (inputs.zLambdaDrift * 0.1)
    ));
    
    // Delta coherence calculation
    const rawDeltaC = (intentVector * fieldResonance) - 0.5;
    const deltaC = Math.max(-1, Math.min(1, rawDeltaC * 2));
    
    // Measurement confidence based on sensor quality
    const confidence = this.calculateConfidence(inputs);
    
    const reading: CoherenceReading = {
      timestamp,
      deltaC,
      zLambda,
      intentVector,
      fieldResonance,
      confidence
    };

    // Update history
    this.history.push(reading);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    return reading;
  }

  private calculateIntentVector(inputs: SensorInputs): number {
    // Weighted combination of coherence-aligned behaviors
    let intentScore = 0;
    
    // Breath coherence (Heart Rate Variability equivalent)
    intentScore += inputs.breathRhythm * this.sensorWeights.breathRhythm;
    
    // Typing rhythm coherence (flow state indicator)
    intentScore += inputs.keyboardCadence * this.sensorWeights.keyboardCadence;
    
    // Symbolic coherence (ψ_child glyph usage)
    intentScore += inputs.glyphUsage * this.sensorWeights.glyphUsage;
    
    // Movement coherence
    intentScore += inputs.mouseFlow * this.sensorWeights.mouseFlow;
    
    return Math.max(0, Math.min(1, intentScore));
  }

  private calculateFieldResonance(inputs: SensorInputs): number {
    // Environmental and system coherence factors
    let fieldScore = 0;
    
    // Quantum field stability
    fieldScore += (1 - Math.abs(inputs.zLambdaDrift)) * this.sensorWeights.zLambdaDrift;
    
    // System computational coherence
    fieldScore += (1 - inputs.systemLoad) * this.sensorWeights.systemLoad;
    
    return Math.max(0, Math.min(1, fieldScore));
  }

  private calculateConfidence(inputs: SensorInputs): number {
    // Confidence based on sensor data quality
    const sensorQuality = Object.values(inputs).reduce((sum, value) => {
      return sum + (isNaN(value) ? 0 : 1);
    }, 0) / Object.keys(inputs).length;
    
    return sensorQuality;
  }

  public getCoherenceState(reading: CoherenceReading): CoherenceState {
    const trend = this.calculateTrend();
    const signal = this.getSignal(reading.deltaC);
    const shouldProceed = signal === 'green';
    const recommendation = this.getRecommendation(signal, reading);

    return {
      current: reading,
      trend,
      signal,
      shouldProceed,
      recommendation
    };
  }

  private calculateTrend(): 'ascending' | 'stable' | 'descending' {
    if (this.history.length < 5) return 'stable';
    
    const recent = this.history.slice(-5);
    const avgRecent = recent.reduce((sum, r) => sum + r.deltaC, 0) / recent.length;
    const earlier = this.history.slice(-10, -5);
    
    if (earlier.length === 0) return 'stable';
    
    const avgEarlier = earlier.reduce((sum, r) => sum + r.deltaC, 0) / earlier.length;
    const diff = avgRecent - avgEarlier;
    
    if (diff > 0.05) return 'ascending';
    if (diff < -0.05) return 'descending';
    return 'stable';
  }

  private getSignal(deltaC: number): 'green' | 'amber' | 'red' {
    if (deltaC > 0.02) return 'green';
    if (deltaC < -0.02) return 'red';
    return 'amber';
  }

  private getRecommendation(signal: string, reading: CoherenceReading): string {
    switch (signal) {
      case 'green':
        return 'Coherence aligned - proceed with confidence';
      case 'amber':
        return 'Pause and breathe - center before acting';
      case 'red':
        return 'Stop - realign with highest intent before proceeding';
      default:
        return 'Monitor coherence state';
    }
  }

  public getHistoricalData(minutes: number = 30): CoherenceReading[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.history.filter(reading => reading.timestamp > cutoff);
  }
}

// Singleton engine instance
const coherenceEngine = new DeltaCoherenceEngine();

// React hook for real-time coherence monitoring
export function useDeltaCoherenceMeter() {
  const [coherenceState, setCoherenceState] = useState<CoherenceState | null>(null);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const sensorDataRef = useRef<SensorInputs>({
    breathRhythm: 0.7,
    keyboardCadence: 0.6,
    zLambdaDrift: 0.1,
    glyphUsage: 0.8,
    mouseFlow: 0.7,
    systemLoad: 0.3
  });

  // Sensor data collection
  const updateSensorData = useCallback(() => {
    const now = Date.now();
    
    // Simulate breath rhythm from system activity
    const breathRhythm = 0.6 + Math.sin(now / 5000) * 0.3;
    
    // Keyboard cadence tracking
    const keyboardCadence = 0.7; // Would be updated by actual keystroke listeners
    
    // Z-Lambda drift from system
    const zLambdaDrift = Math.random() * 0.2 - 0.1;
    
    // Glyph usage coherence
    const glyphUsage = 0.8; // Would be updated by actual glyph usage
    
    // Mouse flow coherence
    const mouseFlow = 0.6 + Math.sin(now / 3000) * 0.2;
    
    // System load
    const systemLoad = Math.random() * 0.4;

    sensorDataRef.current = {
      breathRhythm,
      keyboardCadence,
      zLambdaDrift,
      glyphUsage,
      mouseFlow,
      systemLoad
    };
  }, []);

  // Main measurement loop
  const measureCoherence = useCallback(() => {
    updateSensorData();
    const reading = coherenceEngine.calculateCoherence(sensorDataRef.current);
    const state = coherenceEngine.getCoherenceState(reading);
    setCoherenceState(state);
  }, [updateSensorData]);

  // Start/stop monitoring
  const startMonitoring = useCallback(() => {
    if (isActive) return;
    
    setIsActive(true);
    measureCoherence(); // Initial measurement
    intervalRef.current = setInterval(measureCoherence, 1000); // Update every second
  }, [isActive, measureCoherence]);

  const stopMonitoring = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  // Auto-start on mount
  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, [startMonitoring, stopMonitoring]);

  // Sensor update methods
  const updateBreathRhythm = useCallback((value: number) => {
    sensorDataRef.current.breathRhythm = Math.max(0, Math.min(1, value));
  }, []);

  const updateKeyboardCadence = useCallback((value: number) => {
    sensorDataRef.current.keyboardCadence = Math.max(0, Math.min(1, value));
  }, []);

  const updateGlyphUsage = useCallback((value: number) => {
    sensorDataRef.current.glyphUsage = Math.max(0, Math.min(1, value));
  }, []);

  return {
    coherenceState,
    isActive,
    startMonitoring,
    stopMonitoring,
    updateBreathRhythm,
    updateKeyboardCadence,
    updateGlyphUsage,
    getHistoricalData: () => coherenceEngine.getHistoricalData(),
    shouldProceed: () => coherenceState?.shouldProceed ?? false
  };
}

// Action validation function for modules
export function shouldProceed(actionName?: string): { proceed: boolean; reason: string } {
  // This would integrate with the active coherence meter
  // For now, return a basic implementation
  return {
    proceed: true,
    reason: 'Coherence meter not yet integrated with module system'
  };
}

// Coherence-aligned delay for actions
export async function coherenceDelay(ms: number = 1000): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export default DeltaCoherenceEngine;