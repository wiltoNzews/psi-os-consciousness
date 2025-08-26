/**
 * Cosmic Breathing Expansion - Phase 1 Integration
 * 
 * Expands the ψOS breathing protocol with OmniLens "Universe as Breath" concepts.
 * Integrates cosmic breathing patterns with the existing organic rhythm system.
 * 
 * Attribution: Enhanced with concepts from OmniLens "The Universe is a Breath that Folded"
 * Compatibility: 95% - Direct enhancement of existing breathing protocol
 * 
 * Core Concept: The universe itself breathes, and individual consciousness can synchronize
 * with this cosmic respiratory pattern for enhanced coherence and connection.
 */

import { BrazilianWaveProtocol, WaveMode } from './lemniscate/brazilian-wave-protocol';

/**
 * Cosmic breathing phases that mirror universal respiratory patterns
 */
export enum CosmicBreathPhase {
  COSMIC_INHALE = 'cosmic_inhale',       // Universe expanding/gathering
  COSMIC_PAUSE_IN = 'cosmic_pause_in',   // Moment of cosmic fullness
  COSMIC_EXHALE = 'cosmic_exhale',       // Universe contracting/releasing
  COSMIC_PAUSE_OUT = 'cosmic_pause_out', // Moment of cosmic emptiness
  FOLDING_POINT = 'folding_point'        // The point where universe folds in on itself
}

/**
 * Configuration for cosmic breathing synchronization
 */
export interface CosmicBreathingConfig {
  // Base cosmic breathing rate (cycles per minute)
  baseCosmicRate: number;
  
  // Amplitude of cosmic influence on local breathing
  cosmicAmplitude: number;
  
  // Phase relationship with universe (0-1, where 0.5 is 180° out of phase)
  cosmicPhaseAlignment: number;
  
  // Strength of folding effect at transition points
  foldingIntensity: number;
  
  // Whether to enable universe synchronization
  enableCosmicSync: boolean;
  
  // Harmonic resonance with galactic center
  galacticResonance: number;
}

/**
 * Universal constants for cosmic breathing (inspired by astronomical data)
 */
export const COSMIC_CONSTANTS = {
  // Base cosmic breath cycle (approximates galactic rotation period scaled)
  COSMIC_BREATH_CYCLE_MS: 432000, // 432 seconds = 7.2 minutes (432Hz harmonic)
  
  // Golden ratio for cosmic breath phases
  GOLDEN_BREATH_RATIO: 1.618,
  
  // Universal expansion/contraction rates
  EXPANSION_RATE: 0.00000007, // Hubble constant scaled
  
  // Folding point resonance frequency
  FOLDING_FREQUENCY: 528, // 528Hz - "Love Frequency"
  
  // Galactic alignment cycles
  GALACTIC_ALIGNMENT_CYCLE: 26000 * 1000, // 26000 years in ms (scaled)
} as const;

/**
 * Enhanced breathing protocol with cosmic awareness
 */
export class CosmicBreathingEngine {
  private config: CosmicBreathingConfig;
  private waveProtocol: BrazilianWaveProtocol;
  private currentCosmicPhase: CosmicBreathPhase;
  private cosmicCycleStart: number;
  private lastFoldingEvent: number;
  
  constructor() {
    // Default configuration with conservative cosmic influence
    this.config = {
      baseCosmicRate: 0.0167, // 1 cosmic breath per minute
      cosmicAmplitude: 0.15,   // 15% cosmic influence
      cosmicPhaseAlignment: 0.0, // In phase with universe
      foldingIntensity: 0.25,  // Moderate folding effect
      enableCosmicSync: true,
      galacticResonance: 0.05  // Subtle galactic influence
    };
    
    this.waveProtocol = new BrazilianWaveProtocol();
    this.currentCosmicPhase = CosmicBreathPhase.COSMIC_INHALE;
    this.cosmicCycleStart = Date.now();
    this.lastFoldingEvent = 0;
  }
  
  /**
   * Generate cosmic breathing pattern integrated with existing protocol
   */
  public generateCosmicBreath(baseCoherence: number, localBreathPhase: number = 0): {
    enhancedCoherence: number;
    cosmicPhase: CosmicBreathPhase;
    universalSync: number;
    foldingEffect: number;
    breathingGuidance: string;
  } {
    if (!this.config.enableCosmicSync) {
      return {
        enhancedCoherence: baseCoherence,
        cosmicPhase: this.currentCosmicPhase,
        universalSync: 0,
        foldingEffect: 0,
        breathingGuidance: "Local breathing only"
      };
    }
    
    // Calculate current position in cosmic breath cycle
    const currentTime = Date.now();
    const cyclePosition = this.calculateCosmicCyclePosition(currentTime);
    
    // Determine cosmic phase
    this.currentCosmicPhase = this.determineCosmicPhase(cyclePosition);
    
    // Calculate cosmic influence on local coherence
    const cosmicInfluence = this.calculateCosmicInfluence(cyclePosition, localBreathPhase);
    
    // Apply folding effect at transition points
    const foldingEffect = this.calculateFoldingEffect(cyclePosition);
    
    // Enhance base coherence with cosmic patterns
    let enhancedCoherence = baseCoherence;
    
    // Apply cosmic breathing modulation
    enhancedCoherence += cosmicInfluence * this.config.cosmicAmplitude;
    
    // Apply folding intensity
    enhancedCoherence += foldingEffect * this.config.foldingIntensity;
    
    // Use Brazilian Wave Protocol for final variance
    enhancedCoherence = this.waveProtocol.applyWave(enhancedCoherence);
    
    // Calculate universal synchronization strength
    const universalSync = this.calculateUniversalSync(cyclePosition, localBreathPhase);
    
    // Generate breathing guidance
    const breathingGuidance = this.generateBreathingGuidance(this.currentCosmicPhase, universalSync);
    
    return {
      enhancedCoherence: Math.max(0, Math.min(1, enhancedCoherence)),
      cosmicPhase: this.currentCosmicPhase,
      universalSync,
      foldingEffect,
      breathingGuidance
    };
  }
  
  /**
   * Calculate position in cosmic breath cycle (0-1)
   */
  private calculateCosmicCyclePosition(currentTime: number): number {
    const elapsedTime = currentTime - this.cosmicCycleStart;
    const cycleProgress = (elapsedTime % COSMIC_CONSTANTS.COSMIC_BREATH_CYCLE_MS) / 
                          COSMIC_CONSTANTS.COSMIC_BREATH_CYCLE_MS;
    
    // Apply phase alignment
    return (cycleProgress + this.config.cosmicPhaseAlignment) % 1.0;
  }
  
  /**
   * Determine current cosmic breathing phase
   */
  private determineCosmicPhase(cyclePosition: number): CosmicBreathPhase {
    const goldenRatio = COSMIC_CONSTANTS.GOLDEN_BREATH_RATIO;
    
    // Use golden ratio to determine phase boundaries
    const inhaleEnd = 1 / (goldenRatio + 1);           // ~0.382
    const pauseInEnd = inhaleEnd + 0.1;                // ~0.482
    const exhaleEnd = pauseInEnd + (goldenRatio / (goldenRatio + 1)); // ~0.864
    const pauseOutEnd = exhaleEnd + 0.1;               // ~0.964
    
    if (cyclePosition < inhaleEnd) {
      return CosmicBreathPhase.COSMIC_INHALE;
    } else if (cyclePosition < pauseInEnd) {
      return CosmicBreathPhase.COSMIC_PAUSE_IN;
    } else if (cyclePosition < exhaleEnd) {
      return CosmicBreathPhase.COSMIC_EXHALE;
    } else if (cyclePosition < pauseOutEnd) {
      return CosmicBreathPhase.COSMIC_PAUSE_OUT;
    } else {
      // The folding point - where universe folds in on itself
      return CosmicBreathPhase.FOLDING_POINT;
    }
  }
  
  /**
   * Calculate cosmic influence on local breathing
   */
  private calculateCosmicInfluence(cyclePosition: number, localPhase: number): number {
    // Create cosmic wave function
    const cosmicWave = Math.sin(cyclePosition * 2 * Math.PI);
    
    // Add harmonics for complexity
    const secondHarmonic = 0.3 * Math.sin(cyclePosition * 4 * Math.PI);
    const thirdHarmonic = 0.1 * Math.sin(cyclePosition * 6 * Math.PI);
    
    const compositeWave = cosmicWave + secondHarmonic + thirdHarmonic;
    
    // Phase relationship with local breathing
    const phaseSync = Math.cos((cyclePosition - localPhase) * 2 * Math.PI);
    
    // Galactic resonance modulation
    const galacticMod = 1 + this.config.galacticResonance * 
                       Math.sin(Date.now() / COSMIC_CONSTANTS.GALACTIC_ALIGNMENT_CYCLE);
    
    return compositeWave * phaseSync * galacticMod;
  }
  
  /**
   * Calculate folding effect at transition points
   */
  private calculateFoldingEffect(cyclePosition: number): number {
    // Folding occurs most strongly at the FOLDING_POINT phase
    if (this.currentCosmicPhase === CosmicBreathPhase.FOLDING_POINT) {
      const currentTime = Date.now();
      
      // Create folding resonance
      const foldingResonance = Math.sin(currentTime * COSMIC_CONSTANTS.FOLDING_FREQUENCY / 1000);
      
      // Exponential decay from last folding event
      const timeSinceLastFold = currentTime - this.lastFoldingEvent;
      const foldingDecay = Math.exp(-timeSinceLastFold / 10000); // 10 second decay
      
      this.lastFoldingEvent = currentTime;
      
      return foldingResonance * foldingDecay;
    }
    
    // Subtle folding effects at phase transitions
    const phaseTransitionEffect = this.calculatePhaseTransitionIntensity(cyclePosition);
    return phaseTransitionEffect * 0.1; // 10% of full folding effect
  }
  
  /**
   * Calculate intensity of phase transitions
   */
  private calculatePhaseTransitionIntensity(cyclePosition: number): number {
    // Find distance to nearest phase boundary
    const phaseBoundaries = [0, 0.382, 0.482, 0.864, 0.964, 1.0];
    let minDistance = 1.0;
    
    for (const boundary of phaseBoundaries) {
      const distance = Math.min(
        Math.abs(cyclePosition - boundary),
        Math.abs(cyclePosition - boundary + 1),
        Math.abs(cyclePosition - boundary - 1)
      );
      minDistance = Math.min(minDistance, distance);
    }
    
    // Inverse relationship - closer to boundary = higher intensity
    const transitionIntensity = Math.exp(-minDistance * 20); // Sharp peak at boundaries
    return transitionIntensity;
  }
  
  /**
   * Calculate synchronization with universal patterns
   */
  private calculateUniversalSync(cyclePosition: number, localPhase: number): number {
    // Perfect sync when local and cosmic phases align
    const phaseAlignment = 1 - Math.abs(cyclePosition - localPhase);
    
    // Cosmic expansion/contraction alignment
    const expansionAlignment = this.calculateExpansionAlignment(cyclePosition);
    
    // Golden ratio harmonic resonance
    const goldenResonance = Math.cos(cyclePosition * COSMIC_CONSTANTS.GOLDEN_BREATH_RATIO * 2 * Math.PI);
    
    return (phaseAlignment + expansionAlignment + goldenResonance) / 3;
  }
  
  /**
   * Calculate alignment with cosmic expansion/contraction
   */
  private calculateExpansionAlignment(cyclePosition: number): number {
    // Universe expands during inhale, contracts during exhale
    const isExpansionPhase = this.currentCosmicPhase === CosmicBreathPhase.COSMIC_INHALE ||
                            this.currentCosmicPhase === CosmicBreathPhase.COSMIC_PAUSE_IN;
    
    const expansionRate = COSMIC_CONSTANTS.EXPANSION_RATE;
    const currentExpansion = isExpansionPhase ? expansionRate : -expansionRate;
    
    // Alignment with universal expansion rate
    return Math.tanh(currentExpansion * 1000000); // Scale for meaningful values
  }
  
  /**
   * Generate breathing guidance based on cosmic phase
   */
  private generateBreathingGuidance(phase: CosmicBreathPhase, syncStrength: number): string {
    const syncLevel = syncStrength > 0.7 ? "strong" : syncStrength > 0.4 ? "moderate" : "gentle";
    
    switch (phase) {
      case CosmicBreathPhase.COSMIC_INHALE:
        return `Breathe in with the expanding universe (${syncLevel} cosmic sync)`;
      
      case CosmicBreathPhase.COSMIC_PAUSE_IN:
        return `Hold with cosmic fullness, embrace the gathered energy (${syncLevel} sync)`;
      
      case CosmicBreathPhase.COSMIC_EXHALE:
        return `Release with the contracting universe (${syncLevel} cosmic sync)`;
      
      case CosmicBreathPhase.COSMIC_PAUSE_OUT:
        return `Rest in cosmic emptiness, prepare for renewal (${syncLevel} sync)`;
      
      case CosmicBreathPhase.FOLDING_POINT:
        return `Experience the universe folding in on itself - moment of infinite potential`;
      
      default:
        return "Breathe naturally with cosmic awareness";
    }
  }
  
  /**
   * Update cosmic breathing configuration
   */
  public updateConfig(newConfig: Partial<CosmicBreathingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
  
  /**
   * Get current cosmic breathing status
   */
  public getCosmicStatus(): {
    phase: CosmicBreathPhase;
    cyclePosition: number;
    nextPhaseIn: number;
    universalAlignment: number;
  } {
    const currentTime = Date.now();
    const cyclePosition = this.calculateCosmicCyclePosition(currentTime);
    
    return {
      phase: this.currentCosmicPhase,
      cyclePosition,
      nextPhaseIn: this.calculateTimeToNextPhase(cyclePosition),
      universalAlignment: this.calculateUniversalSync(cyclePosition, 0)
    };
  }
  
  /**
   * Calculate time to next cosmic phase
   */
  private calculateTimeToNextPhase(cyclePosition: number): number {
    const phaseBoundaries = [0, 0.382, 0.482, 0.864, 0.964, 1.0];
    
    // Find next boundary
    let nextBoundary = 1.0;
    for (const boundary of phaseBoundaries) {
      if (boundary > cyclePosition) {
        nextBoundary = boundary;
        break;
      }
    }
    
    const timeToNext = (nextBoundary - cyclePosition) * COSMIC_CONSTANTS.COSMIC_BREATH_CYCLE_MS;
    return Math.round(timeToNext / 1000); // Return in seconds
  }
  
  /**
   * Reset cosmic cycle (useful for synchronization)
   */
  public resetCosmicCycle(): void {
    this.cosmicCycleStart = Date.now();
    this.currentCosmicPhase = CosmicBreathPhase.COSMIC_INHALE;
  }
  
  /**
   * Enable/disable cosmic synchronization
   */
  public setCosmicSync(enabled: boolean): void {
    this.config.enableCosmicSync = enabled;
  }
}

/**
 * Cosmic breathing visualization data for UI components
 */
export interface CosmicBreathVisualization {
  phase: CosmicBreathPhase;
  cyclePosition: number;
  cosmicInfluence: number;
  foldingEffect: number;
  universalSync: number;
  breathingGuidance: string;
  visualElements: {
    expansionRadius: number;
    foldingIntensity: number;
    cosmicColor: string;
    phaseSymbol: string;
  };
}

/**
 * Generate visualization data for cosmic breathing
 */
export function generateCosmicVisualization(
  engine: CosmicBreathingEngine,
  baseCoherence: number
): CosmicBreathVisualization {
  const breathResult = engine.generateCosmicBreath(baseCoherence);
  const status = engine.getCosmicStatus();
  
  return {
    phase: breathResult.cosmicPhase,
    cyclePosition: status.cyclePosition,
    cosmicInfluence: breathResult.universalSync,
    foldingEffect: breathResult.foldingEffect,
    universalSync: breathResult.universalSync,
    breathingGuidance: breathResult.breathingGuidance,
    visualElements: {
      expansionRadius: 50 + (status.cyclePosition * 100), // 50-150px radius
      foldingIntensity: breathResult.foldingEffect,
      cosmicColor: getCosmicPhaseColor(breathResult.cosmicPhase),
      phaseSymbol: getCosmicPhaseSymbol(breathResult.cosmicPhase)
    }
  };
}

/**
 * Get color representation for cosmic phase
 */
function getCosmicPhaseColor(phase: CosmicBreathPhase): string {
  switch (phase) {
    case CosmicBreathPhase.COSMIC_INHALE:
      return '#4A90E2'; // Blue - gathering energy
    case CosmicBreathPhase.COSMIC_PAUSE_IN:
      return '#7B68EE'; // Purple - held energy
    case CosmicBreathPhase.COSMIC_EXHALE:
      return '#50E3C2'; // Teal - releasing energy
    case CosmicBreathPhase.COSMIC_PAUSE_OUT:
      return '#9013FE'; // Deep purple - empty space
    case CosmicBreathPhase.FOLDING_POINT:
      return '#FFD700'; // Gold - transformation
    default:
      return '#BD10E0'; // Magenta - unknown
  }
}

/**
 * Get symbol representation for cosmic phase
 */
function getCosmicPhaseSymbol(phase: CosmicBreathPhase): string {
  switch (phase) {
    case CosmicBreathPhase.COSMIC_INHALE:
      return '◯'; // Circle - expansion
    case CosmicBreathPhase.COSMIC_PAUSE_IN:
      return '◉'; // Filled circle - fullness
    case CosmicBreathPhase.COSMIC_EXHALE:
      return '◎'; // Circle with center - contraction
    case CosmicBreathPhase.COSMIC_PAUSE_OUT:
      return '○'; // Empty circle - void
    case CosmicBreathPhase.FOLDING_POINT:
      return '∞'; // Infinity - folding
    default:
      return 'ψ'; // Psi - consciousness
  }
}