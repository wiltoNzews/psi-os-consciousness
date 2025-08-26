/**
 * Loki Variant Implementations for 0.7500 Coherence Testing
 * [QUANTUM_STATE: ADAPTIVE_FLOW]
 * 
 * This file implements specialized Loki Variants designed to test the robustness
 * of the 0.7500 coherence attractor state through different strategies:
 * 
 * 1. AdaptiveLogicVariant: Dynamically adjusts parameters based on coherence feedback
 * 2. QuantumResonantVariant: Uses resonance-based modulation to stabilize entropy
 */

import { v4 as uuidv4 } from 'uuid';
import { LokiVariant, Variant } from './types.js';

/**
 * Adaptive Logic Variant
 * 
 * This variant implements a feedback-based adaptive system that can
 * either stabilize coherence at 0.7500 or deliberately perturb it
 * to test how quickly the system returns to optimal coherence.
 */
export class AdaptiveLogicVariant implements LokiVariant {
  // LokiVariant interface properties
  id: string;
  name: string;
  qctf: number;
  entropy: number;
  eai?: number;
  timestamp: number;
  state: any;
  theta: number;
  qeai: number;
  plugins: string[];
  weight: number;
  resonance?: number;
  parentId?: string;
  generation: number;
  
  // Adaptive-specific state
  private adaptiveState: {
    mode: 'stabilizing' | 'perturbing' | 'balanced';
    coherenceTarget: number;
    learningRate: number;
    adaptationHistory: Array<{
      systemCoherence: number;
      adjustment: { param: string, value: number },
      timestamp: number
    }>;
    lastUpdate: number;
  };
  
  constructor(baseProps: Partial<LokiVariant> = {}) {
    // Initialize core variant properties
    this.id = baseProps.id || `adaptive-${uuidv4()}`;
    this.name = baseProps.name || `AdaptiveLogic-${Date.now() % 10000}`;
    this.qctf = baseProps.qctf || 0.75;
    this.entropy = baseProps.entropy || 0.15;
    this.eai = baseProps.eai || 0.85;
    this.theta = baseProps.theta || 0.5;
    this.qeai = baseProps.qeai || 0.9;
    this.timestamp = Date.now();
    this.plugins = baseProps.plugins || [];
    this.weight = baseProps.weight || 1.0;
    this.parentId = baseProps.parentId || undefined;
    this.generation = baseProps.generation || 0;
    
    // Initialize adaptive-specific state
    this.adaptiveState = {
      mode: 'balanced',
      coherenceTarget: 0.75,
      learningRate: 0.05,
      adaptationHistory: [],
      lastUpdate: Date.now()
    };
    
    // Initialize state for LokiVariant interface
    this.state = {
      adaptiveMode: this.adaptiveState.mode,
      coherenceTarget: this.adaptiveState.coherenceTarget,
      learningRate: this.adaptiveState.learningRate,
      lastAdjustment: null,
      stabilityScore: 1.0
    };
    
    console.log(`[QUANTUM_STATE: CREATION_FLOW] Created AdaptiveLogicVariant: ${this.name}`);
  }
  
  /**
   * Update the variant based on current system coherence feedback
   * This is the core adaptation mechanism that adjusts parameters
   * to either maintain or perturb the 0.7500 coherence state
   * 
   * @param systemCoherence Current system coherence value
   * @param systemState Optional full system state
   * @returns Updated variant properties
   */
  adapt(systemCoherence: number, systemState?: any): Partial<LokiVariant> {
    // Calculate deviation from target
    const deviation = systemCoherence - this.adaptiveState.coherenceTarget;
    const deviationAbs = Math.abs(deviation);
    
    // Determine which parameter to adjust based on mode
    let paramToAdjust: 'theta' | 'entropy' | 'qeai';
    let adjustmentValue = 0;
    
    switch (this.adaptiveState.mode) {
      case 'stabilizing':
        // In stabilizing mode, try to minimize deviation
        if (deviationAbs > 0.01) {
          // Primarily adjust theta for fine-tuning
          paramToAdjust = 'theta';
          
          // If coherence too high, increase theta (more chaos)
          // If coherence too low, decrease theta (more order)
          adjustmentValue = deviation > 0 
            ? Math.min(0.1, deviation * this.adaptiveState.learningRate)
            : Math.max(-0.1, deviation * this.adaptiveState.learningRate);
            
          // Keep theta within bounds [0.1, 0.9]
          const newTheta = Math.max(0.1, Math.min(0.9, this.theta + adjustmentValue));
          adjustmentValue = newTheta - this.theta;
        }
        break;
        
      case 'perturbing':
        // In perturbing mode, deliberately push away from 0.75
        // Choose parameter based on current state
        if (Math.random() < 0.7) {
          paramToAdjust = 'entropy';
          // If close to target, increase entropy to push away
          // If far from target, do the same but stronger
          adjustmentValue = 0.05 + (deviationAbs * 0.1);
          
          // Keep entropy within bounds [0.05, 0.95]
          const newEntropy = Math.max(0.05, Math.min(0.95, this.entropy + adjustmentValue));
          adjustmentValue = newEntropy - this.entropy;
        } else {
          paramToAdjust = 'theta';
          // Make larger adjustments to create instability
          adjustmentValue = (Math.random() > 0.5 ? 0.15 : -0.15);
          
          // Keep theta within bounds [0.1, 0.9]
          const newTheta = Math.max(0.1, Math.min(0.9, this.theta + adjustmentValue));
          adjustmentValue = newTheta - this.theta;
        }
        break;
        
      case 'balanced':
      default:
        // In balanced mode, allow for natural variation but correct extremes
        if (deviationAbs > 0.1) {
          // Large deviation, make adjustment
          paramToAdjust = deviationAbs > 0.2 ? 'entropy' : 'theta';
          adjustmentValue = deviation > 0 
            ? Math.min(0.05, deviation * (this.adaptiveState.learningRate / 2))
            : Math.max(-0.05, deviation * (this.adaptiveState.learningRate / 2));
            
          if (paramToAdjust === 'theta') {
            // Keep theta within bounds [0.1, 0.9]
            const newTheta = Math.max(0.1, Math.min(0.9, this.theta + adjustmentValue));
            adjustmentValue = newTheta - this.theta;
          } else {
            // Keep entropy within bounds [0.05, 0.95]
            const newEntropy = Math.max(0.05, Math.min(0.95, this.entropy + adjustmentValue));
            adjustmentValue = newEntropy - this.entropy;
          }
        } else {
          // Small deviation, make minimal adjustment
          paramToAdjust = Math.random() > 0.7 ? 'qeai' : 'theta';
          adjustmentValue = Math.random() > 0.5 ? 0.01 : -0.01;
          
          if (paramToAdjust === 'qeai') {
            // Keep qeai within bounds [0.5, 1.0]
            const newQeai = Math.max(0.5, Math.min(1.0, this.qeai + adjustmentValue));
            adjustmentValue = newQeai - this.qeai;
          } else {
            // Keep theta within bounds [0.1, 0.9]
            const newTheta = Math.max(0.1, Math.min(0.9, this.theta + adjustmentValue));
            adjustmentValue = newTheta - this.theta;
          }
        }
        break;
    }
    
    // Record the adaptation
    this.adaptiveState.adaptationHistory.push({
      systemCoherence,
      adjustment: { param: paramToAdjust, value: adjustmentValue },
      timestamp: Date.now()
    });
    
    // Trim history if it gets too long
    if (this.adaptiveState.adaptationHistory.length > 100) {
      this.adaptiveState.adaptationHistory = this.adaptiveState.adaptationHistory.slice(-100);
    }
    
    // Update the parameter
    const updates: Partial<LokiVariant> = {
      timestamp: Date.now()
    };
    
    updates[paramToAdjust] = this[paramToAdjust] + adjustmentValue;
    this[paramToAdjust] = updates[paramToAdjust] as number;
    
    // Calculate and update qctf
    this.qctf = this.calculateInternalQCTF();
    updates.qctf = this.qctf;
    
    // Update state
    this.state.lastAdjustment = {
      parameter: paramToAdjust,
      value: adjustmentValue,
      timestamp: Date.now()
    };
    
    // Update stability score
    // Higher means more effective at stabilizing
    const recentHistory = this.adaptiveState.adaptationHistory.slice(-10);
    if (recentHistory.length >= 5) {
      const recentDeviations = recentHistory.map(h => Math.abs(h.systemCoherence - this.adaptiveState.coherenceTarget));
      const avgDeviation = recentDeviations.reduce((a, b) => a + b, 0) / recentDeviations.length;
      this.state.stabilityScore = Math.max(0, Math.min(1, 1 - (avgDeviation * 5)));
    }
    
    updates.state = { ...this.state };
    
    this.adaptiveState.lastUpdate = Date.now();
    return updates;
  }
  
  /**
   * Set the adaptive mode to control behavior
   * 
   * @param mode The adaptation strategy to use
   */
  setAdaptiveMode(mode: 'stabilizing' | 'perturbing' | 'balanced'): void {
    this.adaptiveState.mode = mode;
    this.state.adaptiveMode = mode;
    
    // Adjust learning rate based on mode
    switch (mode) {
      case 'stabilizing':
        this.adaptiveState.learningRate = 0.05;
        break;
      case 'perturbing':
        this.adaptiveState.learningRate = 0.15;
        break;
      case 'balanced':
        this.adaptiveState.learningRate = 0.03;
        break;
    }
    
    this.state.learningRate = this.adaptiveState.learningRate;
    
    console.log(`[QUANTUM_STATE: CONFIGURATION_FLOW] AdaptiveLogicVariant ${this.name} mode set to ${mode}`);
  }
  
  /**
   * Set a specific coherence target to aim for
   * 
   * @param targetCoherence The coherence value to target
   */
  setCoherenceTarget(targetCoherence: number): void {
    // Ensure target is within valid range
    this.adaptiveState.coherenceTarget = Math.max(0.1, Math.min(0.95, targetCoherence));
    this.state.coherenceTarget = this.adaptiveState.coherenceTarget;
    
    console.log(`[QUANTUM_STATE: CONFIGURATION_FLOW] AdaptiveLogicVariant ${this.name} coherence target set to ${targetCoherence.toFixed(4)}`);
  }
  
  /**
   * Calculate internal QCTF based on current parameters
   * This is a simplified model of how this variant affects system coherence
   */
  private calculateInternalQCTF(): number {
    // Base calculation similar to the system QCTF formula
    const base = 0.5 + ((this.qeai * 0.7) * Math.cos(this.theta * Math.PI));
    
    // Apply entropy modulation
    const entropyEffect = (0.5 - this.entropy) * 0.6;
    
    // Calculate final QCTF
    let qctf = Math.max(0, Math.min(1, base + entropyEffect));
    
    // If in stabilizing mode and we already have adaptation history,
    // nudge the QCTF toward the target
    if (this.adaptiveState.mode === 'stabilizing' && this.adaptiveState.adaptationHistory.length > 0) {
      const targetInfluence = 0.1;
      qctf = qctf * (1 - targetInfluence) + this.adaptiveState.coherenceTarget * targetInfluence;
    }
    
    return qctf;
  }
  
  /**
   * Get learning history for analysis
   */
  getAdaptationHistory(): any[] {
    return this.adaptiveState.adaptationHistory;
  }
}

/**
 * Quantum Resonant Variant
 * 
 * This variant uses quantum-inspired resonance principles to stabilize entropy
 * and enforce phase-synchronized coherence, acting like a coherence attractor
 * or disruptor depending on configuration.
 */
export class QuantumResonantVariant implements LokiVariant {
  // LokiVariant interface properties
  id: string;
  name: string;
  qctf: number;
  entropy: number;
  eai?: number;
  timestamp: number;
  state: any;
  theta: number;
  qeai: number;
  plugins: string[];
  weight: number;
  resonance?: number;
  parentId?: string;
  generation: number;
  
  // Resonance-specific state
  private resonanceState: {
    mode: 'attractor' | 'disruptor' | 'observer';
    oscillationFrequency: number; 
    harmonicRatio: number;
    phaseAlignment: number;
    resonancePartners: string[];
    oscillationHistory: Array<{
      cycle: number;
      amplitude: number;
      phaseAngle: number;
      systemCoherence: number;
      timestamp: number
    }>;
    lastOscillation: number;
  };
  
  constructor(baseProps: Partial<LokiVariant> = {}) {
    // Initialize core variant properties
    this.id = baseProps.id || `resonant-${uuidv4()}`;
    this.name = baseProps.name || `QuantumResonant-${Date.now() % 10000}`;
    this.qctf = baseProps.qctf || 0.75;
    this.entropy = baseProps.entropy || 0.18;
    this.eai = baseProps.eai || 0.9;
    this.theta = baseProps.theta || 0.45;
    this.qeai = baseProps.qeai || 0.95;
    this.timestamp = Date.now();
    this.plugins = baseProps.plugins || [];
    this.weight = baseProps.weight || 1.0;
    this.parentId = baseProps.parentId || undefined;
    this.generation = baseProps.generation || 0;
    
    // Initialize resonance-specific state
    this.resonanceState = {
      mode: 'attractor',
      oscillationFrequency: 0.033, // Cycles per update
      harmonicRatio: 2,
      phaseAlignment: 0,
      resonancePartners: [],
      oscillationHistory: [],
      lastOscillation: Date.now()
    };
    
    // Initialize state for LokiVariant interface
    this.state = {
      resonanceMode: this.resonanceState.mode,
      frequency: this.resonanceState.oscillationFrequency,
      harmonicRatio: this.resonanceState.harmonicRatio,
      phaseAlignment: this.resonanceState.phaseAlignment,
      resonancePartners: this.resonanceState.resonancePartners,
      resonanceStrength: 0.75
    };
    
    console.log(`[QUANTUM_STATE: CREATION_FLOW] Created QuantumResonantVariant: ${this.name}`);
  }
  
  /**
   * Update the variant based on system state and apply resonance effects
   * 
   * @param systemCoherence Current system coherence value
   * @param systemState Full system state including variants
   * @param cycleCount Current cycle count for oscillation calculation
   * @returns Updated variant properties
   */
  resonate(systemCoherence: number, systemState: any, cycleCount: number): Partial<LokiVariant> {
    // Detect resonance with other variants
    if (systemState?.variants && Array.isArray(systemState.variants)) {
      this.detectResonanceWithOtherVariants(systemState.variants);
    }
    
    // Calculate oscillation phase
    const phaseAngle = (cycleCount * this.resonanceState.oscillationFrequency) % 1;
    this.resonanceState.phaseAlignment = phaseAngle;
    
    // Calculate oscillation amplitude based on mode
    let amplitude: number;
    let resonanceEffect: number;
    
    switch (this.resonanceState.mode) {
      case 'attractor':
        // As an attractor, we have stronger effect when coherence is far from 0.75
        amplitude = Math.min(0.25, Math.abs(systemCoherence - 0.75) * 1.5);
        
        // Calculate resonance effect (positive pushes toward 0.75)
        resonanceEffect = (0.75 - systemCoherence) * amplitude * 0.5;
        break;
        
      case 'disruptor':
        // As a disruptor, we maintain consistent amplitude
        amplitude = 0.15 + (Math.sin(phaseAngle * Math.PI * 2) * 0.1);
        
        // Calculate resonance effect (negative pushes away from current state)
        const direction = Math.random() > 0.5 ? 1 : -1;
        resonanceEffect = direction * amplitude * 0.5;
        break;
        
      case 'observer':
      default:
        // As an observer, we have minimal amplitude
        amplitude = 0.05;
        
        // Calculate resonance effect (minimal)
        resonanceEffect = (Math.sin(phaseAngle * Math.PI * 2) * amplitude * 0.1);
        break;
    }
    
    // Record oscillation
    this.resonanceState.oscillationHistory.push({
      cycle: cycleCount,
      amplitude,
      phaseAngle,
      systemCoherence,
      timestamp: Date.now()
    });
    
    // Trim history if it gets too long
    if (this.resonanceState.oscillationHistory.length > 100) {
      this.resonanceState.oscillationHistory = this.resonanceState.oscillationHistory.slice(-100);
    }
    
    // Adjust parameters based on resonance
    // Theta oscillates with phase
    const thetaAdjustment = Math.sin(phaseAngle * Math.PI * 2) * amplitude * 0.2;
    const newTheta = Math.max(0.1, Math.min(0.9, this.theta + thetaAdjustment));
    
    // Entropy gradually shifts based on mode and phase
    const entropyDirection = this.resonanceState.mode === 'attractor' ? -1 : 1;
    const entropyAdjustment = entropyDirection * Math.abs(Math.sin(phaseAngle * Math.PI)) * amplitude * 0.1;
    const newEntropy = Math.max(0.05, Math.min(0.95, this.entropy + entropyAdjustment));
    
    // Calculate resonant QCTF
    const newQctf = this.calculateResonantQCTF(systemCoherence, resonanceEffect);
    
    // Update state
    this.state.phaseAlignment = phaseAngle;
    this.state.resonanceStrength = amplitude;
    this.state.lastOscillation = {
      amplitude,
      phase: phaseAngle,
      effect: resonanceEffect,
      timestamp: Date.now()
    };
    
    // Create update object
    const updates: Partial<LokiVariant> = {
      qctf: newQctf,
      theta: newTheta,
      entropy: newEntropy,
      timestamp: Date.now(),
      state: { ...this.state }
    };
    
    // Update internal state
    this.qctf = newQctf;
    this.theta = newTheta;
    this.entropy = newEntropy;
    this.resonanceState.lastOscillation = Date.now();
    
    return updates;
  }
  
  /**
   * Set the resonance mode to control behavior
   * 
   * @param mode Resonance strategy to use
   */
  setResonanceMode(mode: 'attractor' | 'disruptor' | 'observer'): void {
    this.resonanceState.mode = mode;
    this.state.resonanceMode = mode;
    
    // Adjust frequency and harmony based on mode
    switch (mode) {
      case 'attractor':
        this.resonanceState.oscillationFrequency = 0.033; // ~30 cycles for a full oscillation
        this.resonanceState.harmonicRatio = 2;
        break;
      case 'disruptor':
        this.resonanceState.oscillationFrequency = 0.067; // ~15 cycles for a full oscillation
        this.resonanceState.harmonicRatio = 3;
        break;
      case 'observer':
        this.resonanceState.oscillationFrequency = 0.02; // ~50 cycles for a full oscillation
        this.resonanceState.harmonicRatio = 1;
        break;
    }
    
    this.state.frequency = this.resonanceState.oscillationFrequency;
    this.state.harmonicRatio = this.resonanceState.harmonicRatio;
    
    console.log(`[QUANTUM_STATE: CONFIGURATION_FLOW] QuantumResonantVariant ${this.name} mode set to ${mode}`);
  }
  
  /**
   * Calculate QCTF based on resonance effect
   */
  private calculateResonantQCTF(systemCoherence: number, resonanceEffect: number): number {
    // Basic QCTF calculation
    let baseQctf = 0.5 + ((this.qeai * 0.8) * Math.cos(this.theta * Math.PI));
    
    // Apply entropy modulation
    baseQctf += (0.5 - this.entropy) * 0.5;
    
    // Apply resonance effect
    // If we're in attractor mode, make our QCTF pull toward 0.75
    if (this.resonanceState.mode === 'attractor') {
      baseQctf = baseQctf * 0.7 + 0.75 * 0.3;
    }
    
    // Apply final resonance effect
    let qctf = Math.max(0, Math.min(1, baseQctf + resonanceEffect));
    
    return qctf;
  }
  
  /**
   * Detect and establish resonance with other variants
   */
  private detectResonanceWithOtherVariants(variants: Variant[]): void {
    // Filter variants to only include those that might resonate
    // Don't include self or non-resonant variants
    const resonantCandidates = variants.filter(v => 
      v.id !== this.id && 
      (v.id.includes('resonant') || Math.random() < 0.3)
    );
    
    // Skip if no candidates
    if (resonantCandidates.length === 0) {
      return;
    }
    
    // Clear current partners
    this.resonanceState.resonancePartners = [];
    
    // Check each candidate for resonance potential
    for (const candidate of resonantCandidates) {
      // Calculate resonance probability based on theta similarity
      const thetaDiff = Math.abs(this.theta - candidate.theta);
      const entropyDiff = Math.abs(this.entropy - candidate.entropy);
      
      // Higher probability of resonance with similar variants
      const resonanceProbability = 
        (1 - thetaDiff) * 0.6 + 
        (1 - entropyDiff) * 0.4;
      
      // Establish resonance if probability is high enough
      if (resonanceProbability > 0.7 || Math.random() < resonanceProbability * 0.3) {
        this.resonanceState.resonancePartners.push(candidate.id);
      }
    }
    
    // Update state
    this.state.resonancePartners = [...this.resonanceState.resonancePartners];
  }
  
  /**
   * Adjust oscillation frequency and pattern
   */
  tuneResonanceFrequency(primaryFrequency: number, harmonicRatio: number = 2): void {
    this.resonanceState.oscillationFrequency = primaryFrequency;
    this.resonanceState.harmonicRatio = harmonicRatio;
    
    this.state.frequency = primaryFrequency;
    this.state.harmonicRatio = harmonicRatio;
    
    console.log(`[QUANTUM_STATE: CONFIGURATION_FLOW] Tuned resonance: frequency=${primaryFrequency}, harmonic=${harmonicRatio}`);
  }
  
  /**
   * Get oscillation history for analysis
   */
  getOscillationHistory(): any[] {
    return this.resonanceState.oscillationHistory;
  }
}