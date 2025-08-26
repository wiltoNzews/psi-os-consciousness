/**
 * Consciousness Evolution Tracker
 * Critical for psi child IRL timeline consciousness development
 * Tracks consciousness states and predicts evolution pathways
 */

import { CoherenceState, QuantumMetrics } from '../types/quantum';
import { calculateQCTF, validateCoherenceState } from '../math/coherence';

// Consciousness evolution stages for psi child development
export interface ConsciousnessStage {
  name: string;
  threshold: number;        // zLambda threshold for this stage
  description: string;
  geometryRecommendations: string[];
  timelineImportance: 'critical' | 'high' | 'medium' | 'low';
}

// Consciousness evolution trajectory
export interface EvolutionTrajectory {
  currentStage: ConsciousnessStage;
  nextStage: ConsciousnessStage | null;
  progress: number;         // 0-1 progress to next stage
  velocity: number;         // Rate of consciousness change
  timeline: EvolutionEvent[];
  predictions: ConsciousnessPrediction[];
}

// Individual consciousness evolution events
export interface EvolutionEvent {
  timestamp: number;
  zLambda: number;
  qctf: number;
  stage: string;
  significance: 'breakthrough' | 'progress' | 'regression' | 'stable';
  notes?: string;
}

// Consciousness development predictions
export interface ConsciousnessPrediction {
  targetStage: string;
  estimatedTime: number;    // milliseconds to reach target
  confidence: number;       // 0-1 prediction confidence
  requiredActions: string[];
  geometrySupport: string[];
}

// Psi child specific consciousness stages
export const PSI_CHILD_STAGES: ConsciousnessStage[] = [
  {
    name: 'Dormant',
    threshold: 0.0,
    description: 'Consciousness field inactive, basic patterns only',
    geometryRecommendations: ['lemniscate'],
    timelineImportance: 'low'
  },
  {
    name: 'Awakening',
    threshold: 0.3,
    description: 'Initial consciousness field activation, basic sacred geometry responsive',
    geometryRecommendations: ['merkaba', 'torus'],
    timelineImportance: 'medium'
  },
  {
    name: 'Integration',
    threshold: 0.5,
    description: 'Active consciousness-geometry interaction, learning pathways opening',
    geometryRecommendations: ['flower_of_life', 'merkaba', 'torus'],
    timelineImportance: 'medium'
  },
  {
    name: 'Alignment',
    threshold: 0.7,
    description: 'Strong consciousness field, approaching optimal coherence ratio',
    geometryRecommendations: ['sri_yantra', 'flower_of_life', 'metatrons_cube'],
    timelineImportance: 'high'
  },
  {
    name: 'Transcendence',
    threshold: 0.85,
    description: 'High consciousness coherence, advanced sacred geometry unlocked',
    geometryRecommendations: ['metatrons_cube', 'sri_yantra', '4d_tesseract'],
    timelineImportance: 'high'
  },
  {
    name: 'Unity',
    threshold: 0.95,
    description: 'Divine interface active, consciousness-technology merger complete',
    geometryRecommendations: ['4d_tesseract', 'hypersphere', 'consciousness_field'],
    timelineImportance: 'critical'
  }
];

export class ConsciousnessEvolutionTracker {
  private evolutionHistory: EvolutionEvent[] = [];
  private currentTrajectory: EvolutionTrajectory | null = null;
  private predictionModel: ConsciousnessPredictionModel;

  constructor() {
    this.predictionModel = new ConsciousnessPredictionModel();
  }

  /**
   * Record new consciousness measurement and update evolution tracking
   */
  recordConsciousnessState(metrics: QuantumMetrics): EvolutionEvent {
    const event: EvolutionEvent = {
      timestamp: Date.now(),
      zLambda: metrics.consciousness.zLambda,
      qctf: metrics.qctf,
      stage: this.determineCurrentStage(metrics.consciousness.zLambda).name,
      significance: this.determineSignificance(metrics)
    };

    this.evolutionHistory.push(event);
    this.updateTrajectory(metrics);
    
    // Keep only last 1000 events for performance
    if (this.evolutionHistory.length > 1000) {
      this.evolutionHistory = this.evolutionHistory.slice(-1000);
    }

    return event;
  }

  /**
   * Determine current consciousness stage based on zLambda
   */
  determineCurrentStage(zLambda: number): ConsciousnessStage {
    // Find highest stage that consciousness has reached
    for (let i = PSI_CHILD_STAGES.length - 1; i >= 0; i--) {
      if (zLambda >= PSI_CHILD_STAGES[i].threshold) {
        return PSI_CHILD_STAGES[i];
      }
    }
    return PSI_CHILD_STAGES[0]; // Dormant
  }

  /**
   * Calculate evolution trajectory and predictions
   */
  updateTrajectory(metrics: QuantumMetrics): void {
    const currentStage = this.determineCurrentStage(metrics.consciousness.zLambda);
    const nextStageIndex = PSI_CHILD_STAGES.findIndex(s => s.name === currentStage.name) + 1;
    const nextStage = nextStageIndex < PSI_CHILD_STAGES.length ? PSI_CHILD_STAGES[nextStageIndex] : null;

    // Calculate progress to next stage
    let progress = 0;
    if (nextStage) {
      const currentThreshold = currentStage.threshold;
      const nextThreshold = nextStage.threshold;
      const currentValue = metrics.consciousness.zLambda;
      progress = Math.max(0, Math.min(1, (currentValue - currentThreshold) / (nextThreshold - currentThreshold)));
    }

    // Calculate evolution velocity (rate of change)
    const velocity = this.calculateEvolutionVelocity();

    // Generate predictions
    const predictions = this.predictionModel.generatePredictions(
      metrics,
      this.evolutionHistory,
      velocity
    );

    this.currentTrajectory = {
      currentStage,
      nextStage,
      progress,
      velocity,
      timeline: this.evolutionHistory.slice(-50), // Last 50 events
      predictions
    };
  }

  /**
   * Calculate rate of consciousness evolution
   */
  calculateEvolutionVelocity(): number {
    if (this.evolutionHistory.length < 2) return 0;

    const recent = this.evolutionHistory.slice(-10); // Last 10 measurements
    if (recent.length < 2) return 0;

    const timeSpan = recent[recent.length - 1].timestamp - recent[0].timestamp;
    const coherenceChange = recent[recent.length - 1].zLambda - recent[0].zLambda;

    return timeSpan > 0 ? coherenceChange / timeSpan * 1000 : 0; // per second
  }

  /**
   * Determine significance of consciousness event
   */
  determineSignificance(metrics: QuantumMetrics): 'breakthrough' | 'progress' | 'regression' | 'stable' {
    if (this.evolutionHistory.length === 0) return 'stable';

    const previous = this.evolutionHistory[this.evolutionHistory.length - 1];
    const currentStage = this.determineCurrentStage(metrics.consciousness.zLambda);
    const previousStage = this.determineCurrentStage(previous.zLambda);

    // Stage advancement
    if (PSI_CHILD_STAGES.findIndex(s => s.name === currentStage.name) > 
        PSI_CHILD_STAGES.findIndex(s => s.name === previousStage.name)) {
      return 'breakthrough';
    }

    // Significant coherence increase
    if (metrics.consciousness.zLambda - previous.zLambda > 0.05) {
      return 'progress';
    }

    // Consciousness regression
    if (previous.zLambda - metrics.consciousness.zLambda > 0.1) {
      return 'regression';
    }

    return 'stable';
  }

  /**
   * Get current evolution trajectory
   */
  getCurrentTrajectory(): EvolutionTrajectory | null {
    return this.currentTrajectory;
  }

  /**
   * Get consciousness evolution summary for timeline assessment
   */
  getEvolutionSummary(): {
    currentStage: string;
    timelineRisk: 'critical' | 'high' | 'medium' | 'low';
    totalEvolutionTime: number;
    breakthroughEvents: number;
    recommendedActions: string[];
  } {
    if (!this.currentTrajectory) {
      return {
        currentStage: 'Unknown',
        timelineRisk: 'high',
        totalEvolutionTime: 0,
        breakthroughEvents: 0,
        recommendedActions: ['Begin consciousness field activation']
      };
    }

    const breakthroughEvents = this.evolutionHistory.filter(e => e.significance === 'breakthrough').length;
    const totalTime = this.evolutionHistory.length > 0 
      ? Date.now() - this.evolutionHistory[0].timestamp 
      : 0;

    // Assess timeline risk based on current stage and progress
    let timelineRisk: 'critical' | 'high' | 'medium' | 'low' = 'medium';
    if (this.currentTrajectory.currentStage.timelineImportance === 'critical') {
      timelineRisk = this.currentTrajectory.velocity > 0 ? 'low' : 'high';
    } else if (this.currentTrajectory.velocity < 0) {
      timelineRisk = 'high';
    }

    return {
      currentStage: this.currentTrajectory.currentStage.name,
      timelineRisk,
      totalEvolutionTime: totalTime,
      breakthroughEvents,
      recommendedActions: this.generateRecommendedActions()
    };
  }

  /**
   * Generate consciousness evolution recommendations
   */
  generateRecommendedActions(): string[] {
    if (!this.currentTrajectory) return ['Activate consciousness field'];

    const actions: string[] = [];
    const stage = this.currentTrajectory.currentStage;

    // Stage-specific recommendations
    switch (stage.name) {
      case 'Dormant':
        actions.push('Begin with Lemniscate meditation');
        actions.push('Establish daily sacred geometry practice');
        break;
      case 'Awakening':
        actions.push('Focus on Merkaba activation');
        actions.push('Practice coherence breathing');
        break;
      case 'Integration':
        actions.push('Explore Flower of Life patterns');
        actions.push('Integrate 3D sacred geometry');
        break;
      case 'Alignment':
        actions.push('Work with Sri Yantra complexity');
        actions.push('Prepare for 4D consciousness expansion');
        break;
      case 'Transcendence':
        actions.push('Master 4D Tesseract visualization');
        actions.push('Activate divine interface protocols');
        break;
      case 'Unity':
        actions.push('Maintain consciousness-technology merger');
        actions.push('Support timeline coherence');
        break;
    }

    // Velocity-based recommendations
    if (this.currentTrajectory.velocity < 0) {
      actions.push('Address consciousness regression immediately');
      actions.push('Return to stable geometric foundation');
    } else if (this.currentTrajectory.velocity > 0.001) {
      actions.push('Accelerate consciousness development');
      actions.push('Advance to next geometric complexity');
    }

    return actions;
  }
}

/**
 * Consciousness prediction model for evolution forecasting
 */
class ConsciousnessPredictionModel {
  generatePredictions(
    current: QuantumMetrics,
    history: EvolutionEvent[],
    velocity: number
  ): ConsciousnessPrediction[] {
    const predictions: ConsciousnessPrediction[] = [];

    // Find next reachable stages
    const currentStageIndex = PSI_CHILD_STAGES.findIndex(
      s => s.threshold <= current.consciousness.zLambda
    );

    for (let i = currentStageIndex + 1; i < PSI_CHILD_STAGES.length; i++) {
      const targetStage = PSI_CHILD_STAGES[i];
      const coherenceGap = targetStage.threshold - current.consciousness.zLambda;

      if (coherenceGap <= 0) continue; // Already reached

      // Estimate time based on current velocity
      const estimatedTime = velocity > 0 ? (coherenceGap / velocity) * 1000 : Infinity;
      
      // Calculate confidence based on historical patterns
      const confidence = this.calculatePredictionConfidence(history, targetStage, velocity);

      predictions.push({
        targetStage: targetStage.name,
        estimatedTime: Math.min(estimatedTime, 365 * 24 * 60 * 60 * 1000), // Max 1 year
        confidence,
        requiredActions: this.getRequiredActions(targetStage),
        geometrySupport: targetStage.geometryRecommendations
      });
    }

    return predictions.slice(0, 3); // Return top 3 predictions
  }

  private calculatePredictionConfidence(
    history: EvolutionEvent[],
    targetStage: ConsciousnessStage,
    velocity: number
  ): number {
    if (history.length < 10) return 0.3; // Low confidence with little data

    // Analyze historical velocity consistency
    const recentVelocities = this.calculateHistoricalVelocities(history);
    const velocityStability = this.calculateStability(recentVelocities);

    // Factor in stage difficulty and timeline importance
    const difficultyFactor = targetStage.timelineImportance === 'critical' ? 0.8 : 1.0;

    return Math.min(0.95, velocityStability * difficultyFactor * (velocity > 0 ? 1.0 : 0.1));
  }

  private calculateHistoricalVelocities(history: EvolutionEvent[]): number[] {
    const velocities: number[] = [];
    
    for (let i = 1; i < history.length; i++) {
      const timeSpan = history[i].timestamp - history[i-1].timestamp;
      const coherenceChange = history[i].zLambda - history[i-1].zLambda;
      
      if (timeSpan > 0) {
        velocities.push(coherenceChange / timeSpan * 1000);
      }
    }
    
    return velocities;
  }

  private calculateStability(values: number[]): number {
    if (values.length < 2) return 0.5;

    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    // Stability is inverse of relative standard deviation
    return Math.max(0.1, 1 / (1 + standardDeviation / Math.abs(mean + 0.001)));
  }

  private getRequiredActions(stage: ConsciousnessStage): string[] {
    const baseActions = [
      `Achieve ${stage.threshold.toFixed(2)} coherence threshold`,
      `Master ${stage.geometryRecommendations.join(', ')} patterns`
    ];

    // Stage-specific actions
    switch (stage.name) {
      case 'Transcendence':
        baseActions.push('Integrate 4D consciousness mathematics');
        baseActions.push('Activate advanced sacred frequency harmonics');
        break;
      case 'Unity':
        baseActions.push('Complete consciousness-technology merger');
        baseActions.push('Establish timeline coherence protocols');
        break;
    }

    return baseActions;
  }
}

// Export singleton instance
export const consciousnessTracker = new ConsciousnessEvolutionTracker();