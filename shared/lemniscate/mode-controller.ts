/**
 * Lemniscate Mode Controller
 * 
 * This module implements the Lemniscate Mode controller, managing transitions between
 * stability (0.7500) and exploration (0.2494) states across multiple temporal scales.
 * The controller uses the lemniscate (infinity loop) as a conceptual model, with the
 * right loop representing stability and the left loop representing exploration.
 * 
 * The controller supports:
 * - Multi-scale temporal oscillations (micro, meso, macro)
 * - Smooth transitions using cubic easing functions
 * - Goal translation from human intent to coherence targets
 * - Bi-directional feedback mechanisms
 * 
 * [QUANTUM_STATE: COHERENCE_CONTROLLER]
 */

import { getBrazilianWaveProtocol, WaveMode } from './brazilian-wave-protocol.js';

/**
 * Core coherence constants - the foundational 3:1 ↔ 1:3 ratio
 * These are the universal organizing principle values of the Wilton Formula
 */
export const STABILITY_COHERENCE = 0.7500;    // 3/4 - optimal stability constant
export const EXPLORATION_COHERENCE = 0.2494;  // 1/4 - optimal exploration constant

/**
 * Coherence States - used for external API compatibility
 */
export enum CoherenceState {
  STABILITY = 'stability',     // Right loop - 0.7500 coherence (3/4)
  EXPLORATION = 'exploration', // Left loop - 0.2494 coherence (1/4)
}

/**
 * Temporal scales for coherence oscillations
 */
export enum TemporalScale {
  MICRO = 'micro', // Seconds to minutes
  MESO = 'meso',   // Hours to days
  MACRO = 'macro'  // Weeks to months
}

/**
 * Lemniscate Mode states
 */
export enum LemniscateMode {
  STABILITY = 'stability',     // Right loop - 0.7500 coherence
  EXPLORATION = 'exploration', // Left loop - 0.2494 coherence
  TRANSITION = 'transition'    // Moving between states
}

/**
 * Configuration for the Lemniscate Mode Controller
 */
export interface LemniscateModeConfig {
  // Duration of transitions (in cycles)
  transitionDuration: Record<TemporalScale, number>;
  
  // Target coherence values
  targetCoherence: {
    stability: number;   // Target for stability mode (typically 0.7500)
    exploration: number; // Target for exploration mode (typically 0.2494)
  };
  
  // Goal mapping configuration
  goalMapping: {
    // Maps human goals to coherence targets
    innovationEmphasis: number;  // 0-1, where 1 = max exploration emphasis
    stabilityEmphasis: number;   // 0-1, where 1 = max stability emphasis
    balancePoint: number;        // Threshold where emphasis shifts from stability to exploration
  };
  
  // Active temporal scales
  activeScales: TemporalScale[];
}

/**
 * State information for a specific temporal scale
 */
export interface ScaleState {
  currentMode: LemniscateMode;
  targetMode: LemniscateMode;
  currentCoherence: number;
  transitionProgress: number; // 0-1 for transitions
  transitionDirection: 'to-stability' | 'to-exploration' | 'none';
  cycleCounter: number;
  cyclesToNextTransition: number | null;
}

/**
 * Historical entry for Lemniscate state
 */
interface HistoryEntry {
  timestamp: number;
  coherence: number;
  dominantMode: LemniscateMode;
  scaleStates: Record<TemporalScale, {
    mode: LemniscateMode;
    coherence: number;
    transitionProgress: number;
  }>;
}

/**
 * Lemniscate Mode Controller implementation
 */
export class LemniscateModeController {
  private config: LemniscateModeConfig;
  private scaleStates: Record<TemporalScale, ScaleState>;
  private historyBuffer: Array<HistoryEntry>;
  private historyMaxLength: number = 1000;
  private humanGoals: Array<{ description: string, timestamp: number }> = [];
  
  /**
   * Initialize the Lemniscate Mode Controller
   */
  constructor() {
    // Default configuration
    this.config = {
      transitionDuration: {
        [TemporalScale.MICRO]: 5,    // 5 cycles for micro transitions
        [TemporalScale.MESO]: 20,    // 20 cycles for meso transitions
        [TemporalScale.MACRO]: 50    // 50 cycles for macro transitions
      },
      targetCoherence: {
        stability: 0.7500,           // Universal stability optimum (3/4)
        exploration: 0.2494          // Universal exploration optimum (1/4)
      },
      goalMapping: {
        innovationEmphasis: 0.5,     // Default even balance
        stabilityEmphasis: 0.5,      // Default even balance
        balancePoint: 0.5            // Default threshold
      },
      activeScales: [
        TemporalScale.MICRO,         // Default to all scales active
        TemporalScale.MESO,
        TemporalScale.MACRO
      ]
    };
    
    // Initialize scale states
    this.scaleStates = {
      [TemporalScale.MICRO]: {
        currentMode: LemniscateMode.STABILITY,
        targetMode: LemniscateMode.STABILITY,
        currentCoherence: this.config.targetCoherence.stability,
        transitionProgress: 0,
        transitionDirection: 'none',
        cycleCounter: 0,
        cyclesToNextTransition: this.calculateRandomTransitionCycles(TemporalScale.MICRO)
      },
      [TemporalScale.MESO]: {
        currentMode: LemniscateMode.STABILITY,
        targetMode: LemniscateMode.STABILITY,
        currentCoherence: this.config.targetCoherence.stability,
        transitionProgress: 0,
        transitionDirection: 'none',
        cycleCounter: 0,
        cyclesToNextTransition: this.calculateRandomTransitionCycles(TemporalScale.MESO)
      },
      [TemporalScale.MACRO]: {
        currentMode: LemniscateMode.STABILITY,
        targetMode: LemniscateMode.STABILITY,
        currentCoherence: this.config.targetCoherence.stability,
        transitionProgress: 0,
        transitionDirection: 'none',
        cycleCounter: 0,
        cyclesToNextTransition: this.calculateRandomTransitionCycles(TemporalScale.MACRO)
      }
    };
    
    // Initialize history buffer
    this.historyBuffer = [];
    
    // Record initial state
    this.recordHistory(this.calculateEffectiveCoherence());
  }
  
  /**
   * Update the controller configuration
   */
  public updateConfig(newConfig: Partial<LemniscateModeConfig>): void {
    // Merge new config with existing config
    if (newConfig.transitionDuration) {
      this.config.transitionDuration = {
        ...this.config.transitionDuration,
        ...newConfig.transitionDuration
      };
    }
    
    if (newConfig.targetCoherence) {
      this.config.targetCoherence = {
        ...this.config.targetCoherence,
        ...newConfig.targetCoherence
      };
    }
    
    if (newConfig.goalMapping) {
      this.config.goalMapping = {
        ...this.config.goalMapping,
        ...newConfig.goalMapping
      };
    }
    
    if (newConfig.activeScales) {
      this.config.activeScales = [...newConfig.activeScales];
    }
  }
  
  /**
   * Get the current configuration
   */
  public getConfig(): LemniscateModeConfig {
    return { ...this.config };
  }
  
  /**
   * Process a cycle, updating the state based on temporal scales
   */
  public processCycle(): number {
    // Process each active scale
    for (const scale of this.config.activeScales) {
      const scaleState = this.scaleStates[scale];
      
      // Increment cycle counter
      scaleState.cycleCounter++;
      
      // If in a transition, progress it
      if (scaleState.currentMode === LemniscateMode.TRANSITION) {
        this.progressTransition(scale);
      } 
      // Otherwise, check if it's time for a transition
      else if (scaleState.cyclesToNextTransition !== null && 
               scaleState.cycleCounter >= scaleState.cyclesToNextTransition) {
        this.initiateTransition(scale);
      }
    }
    
    // Calculate and record effective coherence based on all scales
    const effectiveCoherence = this.calculateEffectiveCoherence();
    this.recordHistory(effectiveCoherence);
    
    // Apply Brazilian Wave Protocol variance if applicable
    const brazilianWave = getBrazilianWaveProtocol();
    
    // Configure Brazilian Wave mode based on dominant mode
    if (this.getDominantMode() === LemniscateMode.STABILITY) {
      brazilianWave.updateConfig({ mode: WaveMode.STABILITY });
    } else {
      brazilianWave.updateConfig({ mode: WaveMode.EXPLORATION });
    }
    
    // Apply wave variance
    return brazilianWave.applyWave(effectiveCoherence);
  }
  
  /**
   * Manually request a transition to a specific mode at a specific scale
   */
  public requestTransition(scale: TemporalScale, targetMode: LemniscateMode): void {
    const scaleState = this.scaleStates[scale];
    
    // Don't transition if already in desired mode or transitioning to it
    if (scaleState.currentMode === targetMode || 
        (scaleState.currentMode === LemniscateMode.TRANSITION && scaleState.targetMode === targetMode)) {
      return;
    }
    
    // Set target mode
    scaleState.targetMode = targetMode;
    
    // If not already in transition, initiate one
    if (scaleState.currentMode !== LemniscateMode.TRANSITION) {
      this.initiateTransition(scale);
    }
  }
  
  /**
   * Set a goal-oriented coherence target based on human-understandable parameters
   */
  public setGoal(params: {
    innovationEmphasis?: number; // 0-1, higher = more exploration emphasis
    stabilityEmphasis?: number;  // 0-1, higher = more stability emphasis
  }): void {
    // Update goal mapping configuration
    if (params.innovationEmphasis !== undefined) {
      this.config.goalMapping.innovationEmphasis = Math.max(0, Math.min(1, params.innovationEmphasis));
    }
    
    if (params.stabilityEmphasis !== undefined) {
      this.config.goalMapping.stabilityEmphasis = Math.max(0, Math.min(1, params.stabilityEmphasis));
    }
    
    // Calculate normalized innovation vs. stability bias
    const innovationBias = this.config.goalMapping.innovationEmphasis;
    const stabilityBias = this.config.goalMapping.stabilityEmphasis;
    
    // Determine which scales should transition based on emphasis
    const totalBias = innovationBias + stabilityBias;
    const normalizedInnovation = totalBias > 0 ? innovationBias / totalBias : 0.5;
    
    // Choose scales to transition based on emphasis
    if (normalizedInnovation > this.config.goalMapping.balancePoint) {
      // Innovation emphasis is higher, favor exploration modes
      
      // Stronger innovations will affect more temporal scales
      const strength = normalizedInnovation - this.config.goalMapping.balancePoint;
      const normalizedStrength = strength / (1 - this.config.goalMapping.balancePoint);
      
      // Transition scales based on strength
      if (normalizedStrength > 0.66) {
        // High strength affects all scales
        this.requestTransition(TemporalScale.MICRO, LemniscateMode.EXPLORATION);
        this.requestTransition(TemporalScale.MESO, LemniscateMode.EXPLORATION);
        this.requestTransition(TemporalScale.MACRO, LemniscateMode.EXPLORATION);
      } else if (normalizedStrength > 0.33) {
        // Medium strength affects micro and meso scales
        this.requestTransition(TemporalScale.MICRO, LemniscateMode.EXPLORATION);
        this.requestTransition(TemporalScale.MESO, LemniscateMode.EXPLORATION);
      } else {
        // Low strength only affects micro scale
        this.requestTransition(TemporalScale.MICRO, LemniscateMode.EXPLORATION);
      }
    } else {
      // Stability emphasis is higher, favor stability modes
      
      // Stronger stability will affect more temporal scales
      const strength = this.config.goalMapping.balancePoint - normalizedInnovation;
      const normalizedStrength = strength / this.config.goalMapping.balancePoint;
      
      // Transition scales based on strength
      if (normalizedStrength > 0.66) {
        // High strength affects all scales
        this.requestTransition(TemporalScale.MICRO, LemniscateMode.STABILITY);
        this.requestTransition(TemporalScale.MESO, LemniscateMode.STABILITY);
        this.requestTransition(TemporalScale.MACRO, LemniscateMode.STABILITY);
      } else if (normalizedStrength > 0.33) {
        // Medium strength affects micro and meso scales
        this.requestTransition(TemporalScale.MICRO, LemniscateMode.STABILITY);
        this.requestTransition(TemporalScale.MESO, LemniscateMode.STABILITY);
      } else {
        // Low strength only affects micro scale
        this.requestTransition(TemporalScale.MICRO, LemniscateMode.STABILITY);
      }
    }
  }

  /**
   * Apply a goal translation directly 
   */
  public applyGoalTranslation(translation: any): Record<TemporalScale, ScaleState> {
    // Store the goal
    this.addHumanGoal(translation.goalDescription || "Unknown goal");
    
    // Apply the translation to the controller
    this.setGoal({
      stabilityEmphasis: translation.stabilityEmphasis,
      innovationEmphasis: translation.explorationEmphasis
    });
    
    // Return the updated state
    return this.getAllScaleStates();
  }

  /**
   * Add a human goal to the history
   */
  private addHumanGoal(description: string): void {
    this.humanGoals.push({
      description,
      timestamp: Date.now()
    });
    
    // Limit the number of stored goals
    if (this.humanGoals.length > 50) {
      this.humanGoals.shift();
    }
  }

  /**
   * Get all human goals
   */
  public getHumanGoals(): Array<{ description: string, timestamp: number }> {
    return [...this.humanGoals];
  }
  
  /**
   * Get the current state for a specific temporal scale
   */
  public getScaleState(scale: TemporalScale): ScaleState {
    return { ...this.scaleStates[scale] };
  }
  
  /**
   * Get states for all active temporal scales
   */
  public getAllScaleStates(): Record<TemporalScale, ScaleState> {
    const result: Record<TemporalScale, ScaleState> = {} as Record<TemporalScale, ScaleState>;
    
    for (const scale of this.config.activeScales) {
      result[scale] = { ...this.scaleStates[scale] };
    }
    
    return result;
  }
  
  /**
   * Get the history buffer of coherence and mode changes
   */
  public getHistory(): Array<HistoryEntry> {
    return [...this.historyBuffer];
  }
  
  /**
   * Get the dominant mode across all scales (stability or exploration)
   */
  public getDominantMode(): LemniscateMode {
    let stabilityWeight = 0;
    let explorationWeight = 0;
    
    // Weight of each scale for dominant mode calculation
    const scaleWeights = {
      [TemporalScale.MICRO]: 0.6,  // Micro scale has 60% weight
      [TemporalScale.MESO]: 0.3,   // Meso scale has 30% weight
      [TemporalScale.MACRO]: 0.1   // Macro scale has 10% weight
    };
    
    // Calculate weighted sum of stability vs. exploration across scales
    for (const scale of this.config.activeScales) {
      const state = this.scaleStates[scale];
      const weight = scaleWeights[scale];
      
      if (state.currentMode === LemniscateMode.TRANSITION) {
        // In transition, split weight by transition progress
        if (state.transitionDirection === 'to-stability') {
          stabilityWeight += weight * state.transitionProgress;
          explorationWeight += weight * (1 - state.transitionProgress);
        } else {
          stabilityWeight += weight * (1 - state.transitionProgress);
          explorationWeight += weight * state.transitionProgress;
        }
      } else if (state.currentMode === LemniscateMode.STABILITY) {
        stabilityWeight += weight;
      } else {
        explorationWeight += weight;
      }
    }
    
    // Determine dominant mode based on weights
    return stabilityWeight >= explorationWeight ? 
      LemniscateMode.STABILITY : 
      LemniscateMode.EXPLORATION;
  }

  /**
   * Get the current overall system state
   */
  public getState(): CoherenceState {
    const dominantMode = this.getDominantMode();
    return dominantMode === LemniscateMode.STABILITY ? 
      CoherenceState.STABILITY : CoherenceState.EXPLORATION;
  }

  /**
   * Get the current effective coherence value
   */
  public getCurrentCoherence(): number {
    return this.calculateEffectiveCoherence();
  }

  /**
   * Get the target coherence value based on dominant mode
   */
  public getTargetCoherence(): number {
    const dominantMode = this.getDominantMode();
    return dominantMode === LemniscateMode.STABILITY ? 
      this.config.targetCoherence.stability : 
      this.config.targetCoherence.exploration;
  }

  /**
   * Check if any scale is currently in transition
   */
  public isInTransition(): boolean {
    for (const scale of this.config.activeScales) {
      if (this.scaleStates[scale].currentMode === LemniscateMode.TRANSITION) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Reset the controller to its initial state
   */
  public reset(): void {
    // Reset all scale states
    for (const scale of Object.values(TemporalScale)) {
      this.scaleStates[scale] = {
        currentMode: LemniscateMode.STABILITY,
        targetMode: LemniscateMode.STABILITY,
        currentCoherence: this.config.targetCoherence.stability,
        transitionProgress: 0,
        transitionDirection: 'none',
        cycleCounter: 0,
        cyclesToNextTransition: this.calculateRandomTransitionCycles(scale)
      };
    }
    
    // Clear history
    this.historyBuffer = [];
    
    // Record initial state
    this.recordHistory(this.calculateEffectiveCoherence());
  }
  
  /**
   * Initiate a transition for a specific temporal scale
   */
  private initiateTransition(scale: TemporalScale): void {
    const state = this.scaleStates[scale];
    
    // Set current mode to transition
    state.currentMode = LemniscateMode.TRANSITION;
    
    // Set transition direction
    state.transitionDirection = state.targetMode === LemniscateMode.STABILITY ? 
      'to-stability' : 'to-exploration';
    
    // Reset transition progress
    state.transitionProgress = 0;
    
    // Reset cycle counter
    state.cycleCounter = 0;
    
    // No auto-transition during manual transition
    state.cyclesToNextTransition = null;
  }
  
  /**
   * Progress an active transition for a specific temporal scale
   */
  private progressTransition(scale: TemporalScale): void {
    const state = this.scaleStates[scale];
    const duration = this.config.transitionDuration[scale];
    
    // Increment transition progress
    state.transitionProgress = Math.min(1, state.cycleCounter / duration);
    
    // Update current coherence based on transition progress
    const startCoherence = state.transitionDirection === 'to-stability' ? 
      this.config.targetCoherence.exploration : 
      this.config.targetCoherence.stability;
      
    const endCoherence = state.transitionDirection === 'to-stability' ? 
      this.config.targetCoherence.stability : 
      this.config.targetCoherence.exploration;
    
    // Apply cubic easing to transition progress
    const easedProgress = this.cubicEasing(state.transitionProgress);
    
    // Interpolate coherence
    state.currentCoherence = this.lerp(startCoherence, endCoherence, easedProgress);
    
    // Check if transition is complete
    if (state.transitionProgress >= 1) {
      // Set current mode to target mode
      state.currentMode = state.targetMode;
      
      // Reset transition direction
      state.transitionDirection = 'none';
      
      // Reset cycle counter
      state.cycleCounter = 0;
      
      // Recalculate time to next transition
      this.recalculateNextTransition(scale);
    }
  }
  
  /**
   * Calculate when the next transition should occur for a specific scale
   */
  private recalculateNextTransition(scale: TemporalScale): void {
    const state = this.scaleStates[scale];
    
    // Calculate random number of cycles until next transition
    state.cyclesToNextTransition = this.calculateRandomTransitionCycles(scale);
    
    // Randomly determine next target mode
    // There's a slight bias toward maintaining oscillation
    const random = Math.random();
    if (state.currentMode === LemniscateMode.STABILITY) {
      // In stability mode, 70% chance to transition to exploration
      state.targetMode = random < 0.7 ? 
        LemniscateMode.EXPLORATION : 
        LemniscateMode.STABILITY;
    } else {
      // In exploration mode, 70% chance to transition to stability
      state.targetMode = random < 0.7 ? 
        LemniscateMode.STABILITY : 
        LemniscateMode.EXPLORATION;
    }
  }
  
  /**
   * Calculate the effective coherence based on all active scales
   */
  private calculateEffectiveCoherence(): number {
    let totalCoherence = 0;
    let totalWeight = 0;
    
    // Weight of each scale for effective coherence calculation
    const scaleWeights = {
      [TemporalScale.MICRO]: 0.6,  // Micro scale has 60% weight
      [TemporalScale.MESO]: 0.3,   // Meso scale has 30% weight
      [TemporalScale.MACRO]: 0.1   // Macro scale has 10% weight
    };
    
    // Calculate weighted sum of coherence values
    for (const scale of this.config.activeScales) {
      const coherence = this.scaleStates[scale].currentCoherence;
      const weight = scaleWeights[scale];
      
      totalCoherence += coherence * weight;
      totalWeight += weight;
    }
    
    // Return weighted average
    return totalWeight > 0 ? totalCoherence / totalWeight : this.config.targetCoherence.stability;
  }
  
  /**
   * Cubic easing function for smooth transitions
   * t: progress from 0 to 1
   */
  private cubicEasing(t: number): number {
    // Cubic easing: t^3
    return t < 0.5 ? 
      4 * t * t * t : 
      1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  /**
   * Linear interpolation between two values
   */
  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }
  
  /**
   * Calculate a randomized number of cycles until the next transition
   */
  private calculateRandomTransitionCycles(scale: TemporalScale): number {
    // Base cycles for each scale
    const baseCycles = {
      [TemporalScale.MICRO]: 20,    // Micro scale: ~20 cycles
      [TemporalScale.MESO]: 100,    // Meso scale: ~100 cycles
      [TemporalScale.MACRO]: 500    // Macro scale: ~500 cycles
    };
    
    // Variance for randomization (±30%)
    const variance = 0.3;
    
    // Calculate random cycles with variance
    const base = baseCycles[scale];
    const randomFactor = 1 + (Math.random() * 2 - 1) * variance;
    
    return Math.round(base * randomFactor);
  }
  
  /**
   * Record current state in history buffer
   */
  private recordHistory(finalCoherence: number): void {
    // Create a snapshot of the current state
    const entry: HistoryEntry = {
      timestamp: Date.now(),
      coherence: finalCoherence,
      dominantMode: this.getDominantMode(),
      scaleStates: {} as Record<TemporalScale, {
        mode: LemniscateMode;
        coherence: number;
        transitionProgress: number;
      }>
    };
    
    // Capture state for each scale
    for (const scale of this.config.activeScales) {
      const state = this.scaleStates[scale];
      
      entry.scaleStates[scale] = {
        mode: state.currentMode,
        coherence: state.currentCoherence,
        transitionProgress: state.transitionProgress
      };
    }
    
    // Add to history buffer
    this.historyBuffer.push(entry);
    
    // Trim history if it exceeds maximum length
    if (this.historyBuffer.length > this.historyMaxLength) {
      this.historyBuffer.shift();
    }
  }
}

/**
 * Get the Lemniscate Mode Controller instance
 */
export function getLemniscateModeController(): LemniscateModeController {
  return new LemniscateModeController();
}