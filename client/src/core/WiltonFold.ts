/**
 * WiltonFold: Coherence Prediction Engine
 * Applies protein folding logic to symbolic system architecture
 * Inspired by AlphaFold2 for predicting functional coherence states
 */

import { MODULE_REGISTRY, type WiltonModule } from './ModuleRegistry';

// Coherence state analogous to protein secondary structures
export type CoherenceState = 
  | 'alpha_helix'      // Stable, repeating patterns (high coherence)
  | 'beta_sheet'       // Distributed stability (moderate coherence)
  | 'random_coil'      // Flexible, adaptive (low coherence)
  | 'turn'             // Transition states (meta-coherence)
  | 'disulfide_bond';  // Cross-module connections (locked coherence)

// Module interaction energy (analogous to amino acid interactions)
export interface ModuleInteraction {
  moduleA: string;
  moduleB: string;
  bondType: 'hydrogen' | 'ionic' | 'hydrophobic' | 'covalent';
  strength: number; // -1 to 1 (negative = repulsive, positive = attractive)
  distance: number; // Symbolic distance in coherence space
}

// Coherence fold prediction result
export interface CoherenceFold {
  modules: WiltonModule[];
  interactions: ModuleInteraction[];
  globalCoherence: number; // Zλ equivalent
  stability: number; // Energy minimization score
  functionality: 'native' | 'misfolded' | 'partially_folded' | 'unfolded';
  prediction_confidence: number;
}

// Symbolic amino acid equivalents for WiltonOS modules
const MODULE_PROPERTIES: Record<string, {
  hydrophobicity: number;  // -1 (hydrophilic) to 1 (hydrophobic)
  charge: number;          // -1 (negative) to 1 (positive)
  size: number;            // 0 (small) to 1 (large)
  flexibility: number;     // 0 (rigid) to 1 (flexible)
  coherence_affinity: number; // Natural Zλ contribution
}> = {
  'geometry3d': { hydrophobicity: 0.8, charge: 0.2, size: 0.9, flexibility: 0.3, coherence_affinity: 0.85 },
  'visual-theater': { hydrophobicity: 0.6, charge: 0.4, size: 0.8, flexibility: 0.7, coherence_affinity: 0.82 },
  'divine-absurdity': { hydrophobicity: -0.3, charge: 0.8, size: 0.4, flexibility: 0.9, coherence_affinity: 0.92 },
  'ai-consensus': { hydrophobicity: 0.2, charge: -0.2, size: 0.7, flexibility: 0.5, coherence_affinity: 0.88 },
  'meta-cognitive': { hydrophobicity: 0.1, charge: -0.4, size: 0.6, flexibility: 0.8, coherence_affinity: 0.91 },
  'neural-orchestrator': { hydrophobicity: 0.4, charge: 0.1, size: 0.9, flexibility: 0.4, coherence_affinity: 0.87 },
  'wiltonos-dashboard': { hydrophobicity: -0.2, charge: -0.1, size: 0.5, flexibility: 0.6, coherence_affinity: 0.78 },
  'sacred-geometry-api': { hydrophobicity: 0.7, charge: 0.3, size: 0.3, flexibility: 0.2, coherence_affinity: 0.84 },
  'wiltonos-codex': { hydrophobicity: -0.5, charge: -0.3, size: 0.8, flexibility: 0.9, coherence_affinity: 0.89 }
};

export class WiltonFoldEngine {
  private temperature: number = 0.75; // Coherence temperature (0-1)
  private pressure: number = 0.5;     // System pressure (0-1)

  constructor(temperature: number = 0.75, pressure: number = 0.5) {
    this.temperature = temperature;
    this.pressure = pressure;
  }

  // Calculate interaction energy between two modules (Ramachandran plot equivalent)
  private calculateInteractionEnergy(moduleA: WiltonModule, moduleB: WiltonModule): number {
    const propsA = MODULE_PROPERTIES[moduleA.id] || this.getDefaultProperties();
    const propsB = MODULE_PROPERTIES[moduleB.id] || this.getDefaultProperties();

    // Hydrophobic interactions
    const hydrophobic = (propsA.hydrophobicity > 0 && propsB.hydrophobicity > 0) 
      ? propsA.hydrophobicity * propsB.hydrophobicity * 0.8 : 0;

    // Electrostatic interactions
    const electrostatic = (propsA.charge * propsB.charge < 0) 
      ? Math.abs(propsA.charge * propsB.charge) * 0.9 : 
        (propsA.charge * propsB.charge > 0) ? -Math.abs(propsA.charge * propsB.charge) * 0.3 : 0;

    // Size complementarity
    const steric = Math.max(0, 1 - Math.abs(propsA.size - propsB.size)) * 0.4;

    // Coherence resonance
    const coherenceResonance = Math.abs(propsA.coherence_affinity - propsB.coherence_affinity) < 0.1 
      ? 0.6 : 0;

    return hydrophobic + electrostatic + steric + coherenceResonance;
  }

  // Predict local coherence state for a module (secondary structure prediction)
  private predictLocalCoherence(module: WiltonModule, neighbors: WiltonModule[]): CoherenceState {
    const props = MODULE_PROPERTIES[module.id] || this.getDefaultProperties();
    
    if (props.coherence_affinity > 0.9 && props.flexibility < 0.4) {
      return 'alpha_helix'; // Highly stable, structured
    }
    
    if (neighbors.length >= 2 && props.flexibility > 0.7) {
      return 'beta_sheet'; // Distributed stability through connections
    }
    
    if (props.flexibility > 0.8 || module.status === 'external') {
      return 'random_coil'; // Flexible, adaptive
    }
    
    if (module.category === 'ai' && props.coherence_affinity > 0.85) {
      return 'turn'; // Transition facilitator
    }
    
    return 'disulfide_bond'; // Strong cross-connections
  }

  // Main folding prediction algorithm (inspired by AlphaFold2 attention mechanism)
  public predictCoherenceFold(modules: WiltonModule[]): CoherenceFold {
    const interactions: ModuleInteraction[] = [];
    let totalEnergy = 0;
    let coherenceSum = 0;

    // Calculate all pairwise interactions
    for (let i = 0; i < modules.length; i++) {
      for (let j = i + 1; j < modules.length; j++) {
        const moduleA = modules[i];
        const moduleB = modules[j];
        const energy = this.calculateInteractionEnergy(moduleA, moduleB);
        
        if (Math.abs(energy) > 0.1) { // Only significant interactions
          interactions.push({
            moduleA: moduleA.id,
            moduleB: moduleB.id,
            bondType: this.classifyBondType(energy),
            strength: energy,
            distance: this.calculateSymbolicDistance(moduleA, moduleB)
          });
        }
        
        totalEnergy += energy;
      }
    }

    // Calculate global coherence (Zλ equivalent)
    modules.forEach(module => {
      const props = MODULE_PROPERTIES[module.id] || this.getDefaultProperties();
      coherenceSum += props.coherence_affinity;
    });

    const globalCoherence = coherenceSum / modules.length;
    const stability = this.calculateStability(totalEnergy, modules.length);
    const functionality = this.assessFunctionality(globalCoherence, stability);
    
    // Confidence based on module coverage and interaction density
    const coverage = Object.keys(MODULE_PROPERTIES).filter(id => 
      modules.some(m => m.id === id)
    ).length / Object.keys(MODULE_PROPERTIES).length;
    
    const interactionDensity = interactions.length / (modules.length * (modules.length - 1) / 2);
    const prediction_confidence = (coverage + interactionDensity) / 2;

    return {
      modules,
      interactions,
      globalCoherence,
      stability,
      functionality,
      prediction_confidence
    };
  }

  // Optimize module arrangement for maximum coherence (energy minimization)
  public optimizeCoherence(modules: WiltonModule[]): WiltonModule[] {
    let currentFold = this.predictCoherenceFold(modules);
    let bestModules = [...modules];
    let bestStability = currentFold.stability;

    // Simulated annealing optimization
    for (let iteration = 0; iteration < 100; iteration++) {
      const temperature = this.temperature * Math.exp(-iteration / 30);
      
      // Generate random permutation
      const shuffledModules = this.shuffleModules([...modules]);
      const newFold = this.predictCoherenceFold(shuffledModules);
      
      // Accept if better, or with probability based on temperature
      const deltaE = newFold.stability - bestStability;
      const acceptProbability = deltaE > 0 ? 1 : Math.exp(deltaE / temperature);
      
      if (Math.random() < acceptProbability) {
        bestModules = shuffledModules;
        bestStability = newFold.stability;
      }
    }

    return bestModules;
  }

  // Predict coherence trajectory over time (molecular dynamics equivalent)
  public simulateCoherenceEvolution(
    modules: WiltonModule[], 
    timesteps: number = 50
  ): { time: number; coherence: number; stability: number }[] {
    const trajectory = [];
    let currentModules = [...modules];

    for (let t = 0; t < timesteps; t++) {
      const fold = this.predictCoherenceFold(currentModules);
      trajectory.push({
        time: t,
        coherence: fold.globalCoherence,
        stability: fold.stability
      });

      // Evolve system based on current state
      if (fold.functionality === 'misfolded' && Math.random() < 0.3) {
        currentModules = this.optimizeCoherence(currentModules);
      }
    }

    return trajectory;
  }

  private getDefaultProperties() {
    return { hydrophobicity: 0, charge: 0, size: 0.5, flexibility: 0.5, coherence_affinity: 0.7 };
  }

  private classifyBondType(energy: number): 'hydrogen' | 'ionic' | 'hydrophobic' | 'covalent' {
    if (energy > 0.7) return 'covalent';
    if (energy > 0.4) return 'ionic';
    if (energy > 0.2) return 'hydrogen';
    return 'hydrophobic';
  }

  private calculateSymbolicDistance(moduleA: WiltonModule, moduleB: WiltonModule): number {
    // Distance based on category similarity and coherence requirements
    const categoryDistance = moduleA.category === moduleB.category ? 0.2 : 0.8;
    const coherenceDistance = Math.abs(
      (moduleA.coherenceRequired || 0.7) - (moduleB.coherenceRequired || 0.7)
    );
    return (categoryDistance + coherenceDistance) / 2;
  }

  private calculateStability(totalEnergy: number, moduleCount: number): number {
    const averageEnergy = totalEnergy / moduleCount;
    // Convert to 0-1 scale where higher is more stable
    return Math.max(0, Math.min(1, (averageEnergy + 1) / 2));
  }

  private assessFunctionality(coherence: number, stability: number): 'native' | 'misfolded' | 'partially_folded' | 'unfolded' {
    const score = (coherence + stability) / 2;
    if (score > 0.85) return 'native';
    if (score > 0.65) return 'partially_folded';
    if (score > 0.4) return 'misfolded';
    return 'unfolded';
  }

  private shuffleModules(modules: WiltonModule[]): WiltonModule[] {
    for (let i = modules.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [modules[i], modules[j]] = [modules[j], modules[i]];
    }
    return modules;
  }
}

// Factory function for easy instantiation
export function createWiltonFold(temperature: number = 0.75, pressure: number = 0.5): WiltonFoldEngine {
  return new WiltonFoldEngine(temperature, pressure);
}

// Coherence validation function (quality control for symbolic folding)
export function validateCoherenceFold(fold: CoherenceFold): {
  isValid: boolean;
  warnings: string[];
  recommendations: string[];
} {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (fold.globalCoherence < 0.7) {
    warnings.push('Low global coherence detected');
    recommendations.push('Consider optimizing module arrangement');
  }

  if (fold.functionality === 'misfolded') {
    warnings.push('System may not function properly in current configuration');
    recommendations.push('Run coherence optimization or adjust module parameters');
  }

  if (fold.prediction_confidence < 0.6) {
    warnings.push('Low prediction confidence');
    recommendations.push('Add more characterized modules to improve accuracy');
  }

  const strongRepulsions = fold.interactions.filter(i => i.strength < -0.5);
  if (strongRepulsions.length > 0) {
    warnings.push(`${strongRepulsions.length} strong repulsive interactions detected`);
    recommendations.push('Review conflicting modules and consider separation');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    recommendations
  };
}