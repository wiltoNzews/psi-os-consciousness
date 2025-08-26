/**
 * Lemniscate Mode Controller
 * 
 * This module implements the core controller for the Lemniscate Mode (∞) toggle feature,
 * which allows controlled oscillation between stability (0.7500 coherence) and
 * exploration (0.2494 coherence) states across multiple temporal scales.
 * 
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 */

import { EventEmitter } from 'events';

/**
 * Temporal scale definitions for coherence oscillations
 */
export enum TemporalScale {
  MICRO = 'micro', // Seconds to minutes (immediate interactions)
  MESO = 'meso',   // Hours to days (session-level patterns)
  MACRO = 'macro'  // Weeks to months (strategic cycles)
}

/**
 * Coherence states representing stability and exploration phases
 */
export enum CoherenceState {
  STABILITY = 'stability',     // 0.7500 coherence (3:1 ratio)
  EXPLORATION = 'exploration', // 0.2494 coherence (1:3 ratio)
  TRANSITION = 'transition'    // Moving between states
}

/**
 * Target coherence values corresponding to each state
 */
export const COHERENCE_TARGETS = {
  [CoherenceState.STABILITY]: 0.7500,
  [CoherenceState.EXPLORATION]: 0.2494,
  [CoherenceState.TRANSITION]: 0.5000 // Midpoint during transitions
};

/**
 * Configuration options for the Lemniscate Mode controller
 */
export interface LemniscateModeConfig {
  // Initial state configuration
  initialState: CoherenceState;
  
  // Transition time in milliseconds for each scale
  transitionTimes: {
    [TemporalScale.MICRO]: number;
    [TemporalScale.MESO]: number;
    [TemporalScale.MACRO]: number;
  };
  
  // Control which temporal scales are active
  enabledScales: TemporalScale[];
  
  // Wave parameters for Brazilian Wave Protocol
  brazilianWaveAmplitude: number;
  brazilianWaveFrequency: number;
  
  // Enable/disable automatic oscillation based on goals/context
  enableAdaptiveOscillation: boolean;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: LemniscateModeConfig = {
  initialState: CoherenceState.EXPLORATION, // Starting in exploration phase (matches current logs)
  transitionTimes: {
    [TemporalScale.MICRO]: 5000,    // 5 seconds for micro transitions
    [TemporalScale.MESO]: 3600000,  // 1 hour for meso transitions
    [TemporalScale.MACRO]: 604800000 // 1 week for macro transitions
  },
  enabledScales: [TemporalScale.MICRO, TemporalScale.MESO, TemporalScale.MACRO],
  brazilianWaveAmplitude: 0.05,     // 5% oscillation around target coherence
  brazilianWaveFrequency: 0.1,      // Complete cycle every 10 seconds
  enableAdaptiveOscillation: true   // Auto-adjust based on goals/context
};

/**
 * Events emitted by the Lemniscate Mode controller
 */
export enum LemniscateEvent {
  STATE_CHANGED = 'state_changed',
  COHERENCE_UPDATED = 'coherence_updated',
  TRANSITION_STARTED = 'transition_started',
  TRANSITION_COMPLETED = 'transition_completed',
  WAVE_OSCILLATION = 'wave_oscillation',
  SCALE_CHANGED = 'scale_changed',
  GOAL_ALIGNMENT_CHANGED = 'goal_alignment_changed'
}

/**
 * Interface for translating between human goals and coherence states
 */
export interface HumanGoalTranslation {
  goalType: string;                 // E.g., "creativity", "documentation", "analysis"
  preferredState: CoherenceState;   // Which coherence state best serves this goal
  targetCoherence?: number;         // Optional specific coherence target
  suggestedTimeScale: TemporalScale;// Recommended temporal scale for this goal
  estimatedCompletionTime?: number; // Optional estimated time to completion
  description: string;              // Human-readable description of this alignment
}

/**
 * Main controller for the Lemniscate Mode feature
 */
export class LemniscateModeController extends EventEmitter {
  private config: LemniscateModeConfig;
  private currentState: CoherenceState;
  private targetCoherence: number;
  private currentCoherence: number;
  private isTransitioning: boolean = false;
  private activeTransitions: Map<TemporalScale, NodeJS.Timeout> = new Map();
  private waveOscillator: NodeJS.Timeout | null = null;
  private humanGoals: HumanGoalTranslation[] = [];
  
  /**
   * Create a new Lemniscate Mode controller
   */
  constructor(config: Partial<LemniscateModeConfig> = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.currentState = this.config.initialState;
    this.targetCoherence = COHERENCE_TARGETS[this.currentState];
    this.currentCoherence = this.targetCoherence;
    
    // Start the Brazilian Wave oscillator
    this.startWaveOscillator();
  }
  
  /**
   * Toggle the Lemniscate Mode between stability and exploration
   * @param scale The temporal scale at which to toggle
   * @param targetState Optional specific state to toggle to (otherwise toggles to opposite state)
   * @returns The new coherence state
   */
  public toggle(scale: TemporalScale, targetState?: CoherenceState): CoherenceState {
    // If scale is not enabled, do nothing
    if (!this.config.enabledScales.includes(scale)) {
      console.warn(`Cannot toggle at scale ${scale} - not enabled in configuration`);
      return this.currentState;
    }
    
    // Determine the target state (either specified or opposite of current)
    const newState = targetState || 
      (this.currentState === CoherenceState.STABILITY ? 
        CoherenceState.EXPLORATION : CoherenceState.STABILITY);
    
    // If already transitioning at this scale, cancel the existing transition
    if (this.activeTransitions.has(scale)) {
      clearTimeout(this.activeTransitions.get(scale)!);
    }
    
    // Begin transition to the new state
    this.isTransitioning = true;
    this.currentState = CoherenceState.TRANSITION;
    
    // Emit transition started event
    this.emit(LemniscateEvent.TRANSITION_STARTED, {
      fromState: this.currentState,
      toState: newState,
      scale,
      timestamp: Date.now()
    });
    
    // Schedule completion of transition based on scale
    const transitionTime = this.config.transitionTimes[scale];
    const transitionTimeout = setTimeout(() => {
      this.completeTransition(newState, scale);
    }, transitionTime);
    
    // Store the active transition
    this.activeTransitions.set(scale, transitionTimeout);
    
    return newState;
  }
  
  /**
   * Complete a transition to a new coherence state
   * @param newState The state to transition to
   * @param scale The temporal scale of the transition
   */
  private completeTransition(newState: CoherenceState, scale: TemporalScale): void {
    // Update state and target coherence
    this.currentState = newState;
    this.targetCoherence = COHERENCE_TARGETS[newState];
    this.currentCoherence = this.targetCoherence;
    this.isTransitioning = false;
    
    // Remove the transition from active transitions
    this.activeTransitions.delete(scale);
    
    // Emit transition completed event
    this.emit(LemniscateEvent.TRANSITION_COMPLETED, {
      newState,
      scale,
      targetCoherence: this.targetCoherence,
      timestamp: Date.now()
    });
    
    // Emit state changed event
    this.emit(LemniscateEvent.STATE_CHANGED, {
      state: this.currentState,
      coherence: this.currentCoherence,
      timestamp: Date.now()
    });
  }
  
  /**
   * Start the Brazilian Wave oscillator for controlled coherence variation
   */
  private startWaveOscillator(): void {
    if (this.waveOscillator) {
      clearInterval(this.waveOscillator);
    }
    
    // Start oscillating around the target coherence using the Brazilian Wave Protocol
    this.waveOscillator = setInterval(() => {
      // Calculate oscillation using sine wave (Brazilian Wave Protocol)
      const time = Date.now() / 1000; // Convert to seconds for wave calculation
      const oscillation = Math.sin(time * this.config.brazilianWaveFrequency * 2 * Math.PI) * 
                          this.config.brazilianWaveAmplitude;
      
      // Apply oscillation to current coherence
      const baseCoherence = this.targetCoherence;
      this.currentCoherence = baseCoherence + oscillation;
      
      // Ensure coherence stays within valid range
      this.currentCoherence = Math.max(0, Math.min(1, this.currentCoherence));
      
      // Emit coherence updated event
      this.emit(LemniscateEvent.COHERENCE_UPDATED, {
        coherence: this.currentCoherence,
        baseCoherence,
        oscillation,
        timestamp: Date.now()
      });
      
      // Emit wave oscillation event
      this.emit(LemniscateEvent.WAVE_OSCILLATION, {
        amplitude: this.config.brazilianWaveAmplitude,
        frequency: this.config.brazilianWaveFrequency,
        currentPhase: time * this.config.brazilianWaveFrequency * 2 * Math.PI % (2 * Math.PI),
        timestamp: Date.now()
      });
    }, 100); // Update every 100ms for smooth visualization
  }
  
  /**
   * Translate a human goal into appropriate coherence settings
   * @param goalDescription Human-readable description of the goal
   * @returns Translation mapping the goal to coherence states and settings
   */
  public translateHumanGoal(goalDescription: string): HumanGoalTranslation {
    // This is a simplified implementation - in production, this would use
    // more sophisticated NLP and pattern matching to analyze the goal

    // Keywords indicating exploration vs. stability preference
    const explorationKeywords = ['create', 'explore', 'innovate', 'brainstorm', 'discover', 'new'];
    const stabilityKeywords = ['document', 'refine', 'finalize', 'polish', 'implement', 'build'];
    
    // Check which keywords appear in the goal description
    const lowerGoal = goalDescription.toLowerCase();
    const explorationScore = explorationKeywords.filter(word => lowerGoal.includes(word)).length;
    const stabilityScore = stabilityKeywords.filter(word => lowerGoal.includes(word)).length;
    
    // Determine preferred state based on keyword matches
    let preferredState = CoherenceState.TRANSITION; // Default if unclear
    if (explorationScore > stabilityScore) {
      preferredState = CoherenceState.EXPLORATION;
    } else if (stabilityScore > explorationScore) {
      preferredState = CoherenceState.STABILITY;
    }
    
    // Determine temporal scale based on timeframe keywords
    let suggestedTimeScale = TemporalScale.MESO; // Default to meso scale
    if (lowerGoal.includes('immediate') || lowerGoal.includes('quickly') || lowerGoal.includes('now')) {
      suggestedTimeScale = TemporalScale.MICRO;
    } else if (lowerGoal.includes('month') || lowerGoal.includes('quarter') || lowerGoal.includes('long-term')) {
      suggestedTimeScale = TemporalScale.MACRO;
    }
    
    // Create the translation
    const translation: HumanGoalTranslation = {
      goalType: explorationScore > stabilityScore ? 'creativity' : 'productivity',
      preferredState,
      suggestedTimeScale,
      description: `This goal appears to need ${preferredState} at the ${suggestedTimeScale} scale.`
    };
    
    // Store the translation
    this.humanGoals.push(translation);
    
    // Emit goal alignment changed event
    this.emit(LemniscateEvent.GOAL_ALIGNMENT_CHANGED, {
      goalDescription,
      translation,
      timestamp: Date.now()
    });
    
    return translation;
  }
  
  /**
   * Apply a human goal translation by toggling to the recommended state
   * @param translation The goal translation to apply
   * @returns The new coherence state
   */
  public applyGoalTranslation(translation: HumanGoalTranslation): CoherenceState {
    return this.toggle(translation.suggestedTimeScale, translation.preferredState);
  }
  
  /**
   * Get the current coherence state
   * @returns Current coherence state
   */
  public getState(): CoherenceState {
    return this.currentState;
  }
  
  /**
   * Get the current coherence value
   * @returns Current coherence value
   */
  public getCurrentCoherence(): number {
    return this.currentCoherence;
  }
  
  /**
   * Get the target coherence value
   * @returns Target coherence value
   */
  public getTargetCoherence(): number {
    return this.targetCoherence;
  }
  
  /**
   * Check if system is currently transitioning between states
   * @returns True if transitioning, false otherwise
   */
  public isInTransition(): boolean {
    return this.isTransitioning;
  }
  
  /**
   * Get all active human goals
   * @returns Array of human goal translations
   */
  public getHumanGoals(): HumanGoalTranslation[] {
    return [...this.humanGoals];
  }
  
  /**
   * Update the configuration
   * @param config New configuration settings (partial)
   */
  public updateConfig(config: Partial<LemniscateModeConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart wave oscillator with new settings
    this.startWaveOscillator();
  }
  
  /**
   * Clean up resources when the controller is no longer needed
   */
  public dispose(): void {
    // Clear all transitions
    this.activeTransitions.forEach(timeout => clearTimeout(timeout));
    this.activeTransitions.clear();
    
    // Stop the wave oscillator
    if (this.waveOscillator) {
      clearInterval(this.waveOscillator);
      this.waveOscillator = null;
    }
    
    // Remove all event listeners
    this.removeAllListeners();
  }
}

/**
 * Create and export a singleton instance of the controller
 */
export const lemniscateController = new LemniscateModeController();

/**
 * Export a convenience function for easier toggling
 * @param scale The temporal scale at which to toggle
 * @param targetState Optional specific state to toggle to
 * @returns The new coherence state
 */
export function toggleLemniscateMode(
  scale: TemporalScale = TemporalScale.MICRO,
  targetState?: CoherenceState
): CoherenceState {
  return lemniscateController.toggle(scale, targetState);
}

/**
 * Export a convenience function for translating human goals
 * @param goalDescription Human-readable description of the goal
 * @returns Translation mapping the goal to coherence states
 */
export function translateHumanGoal(goalDescription: string): HumanGoalTranslation {
  return lemniscateController.translateHumanGoal(goalDescription);
}

/**
 * Export a convenience function for applying human goal translations
 * @param translation The goal translation to apply (or goal description to translate and apply)
 * @returns The new coherence state
 */
export function applyHumanGoal(translation: HumanGoalTranslation | string): CoherenceState {
  if (typeof translation === 'string') {
    const goalTranslation = lemniscateController.translateHumanGoal(translation);
    return lemniscateController.applyGoalTranslation(goalTranslation);
  }
  return lemniscateController.applyGoalTranslation(translation);
}