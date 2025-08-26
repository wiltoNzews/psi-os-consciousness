/**
 * Resonance Evolution Tracker
 * 
 * This module implements the tracking and validation mechanism for the
 * Synaptic Resonance Factor Evolution calculations. It allows us to track,
 * measure, and prove that the resonance between system components is
 * actively learning and improving over time.
 * 
 * Core logic:
 * ResonanceEvolution(t) = ∑(ResonanceScore(i,t) - ResonanceScore(i,t-1)) / Count(i)
 * 
 * This tracks how effectively the resonance between components improves
 * over time, proving that the system is continuously learning to optimize
 * inter-component interactions.
 */

import { v4 as uuidv4 } from 'uuid';
import { ResonanceMetric, calculateResonanceFactor } from './resonance-calculator.js';

/**
 * Resonance evolution data point
 */
export interface ResonanceEvolutionPoint {
  id: string;
  timestamp: Date;
  sourceId: string;
  targetId: string;
  context: string;
  currentResonance: number;
  previousResonance: number;
  resonanceChange: number; // Positive means improvement
  evolutionRate: number; // How quickly resonance is changing
  iterationCount: number; // How many measurements have been taken
  resonanceHistory: Array<{
    timestamp: Date;
    resonanceScore: number;
  }>;
}

/**
 * Resonance evolution validation result
 */
export interface ResonanceEvolutionResult {
  id: string;
  timestamp: Date;
  overallEvolution: number; // Average change across all tracked component pairs
  evolutionTrend: 'improving' | 'stable' | 'declining';
  learningEfficiency: number; // How efficiently resonance improves with iterations
  pairwiseAnalysis: Array<{
    sourceId: string;
    targetId: string;
    evolutionRate: number;
    trend: 'improving' | 'stable' | 'declining';
  }>;
  highestEvolution: {
    sourceId: string;
    targetId: string;
    evolutionRate: number;
  };
  lowestEvolution: {
    sourceId: string;
    targetId: string;
    evolutionRate: number;
  };
  recommendations: string[];
}

// In-memory store for resonance history (in a production environment, use a database)
const resonanceHistoryStore: Map<string, ResonanceEvolutionPoint[]> = new Map();

/**
 * Generate a unique key for a component pair
 */
function getPairKey(sourceId: string, targetId: string, context: string): string {
  return `${sourceId}:${targetId}:${context}`;
}

/**
 * Record a resonance measurement
 * 
 * @param metric The resonance metric to record
 * @returns Resonance evolution point with updated calculations
 */
export function recordResonanceMeasurement(metric: ResonanceMetric): ResonanceEvolutionPoint {
  const pairKey = getPairKey(metric.sourceId, metric.targetId, metric.context || 'default');
  
  // Get existing history or create new
  let history = resonanceHistoryStore.get(pairKey) || [];
  
  // Get previous resonance score
  const previousMeasurement = history.length > 0 ? history[history.length - 1] : null;
  const previousResonance = previousMeasurement ? previousMeasurement.currentResonance : metric.resonanceScore;
  
  // Calculate resonance change
  const resonanceChange = metric.resonanceScore - previousResonance;
  
  // Calculate evolution rate (change per iteration)
  const iterationCount = history.length + 1;
  const evolutionRate = resonanceChange / (iterationCount > 1 ? iterationCount : 1);
  
  // Create new evolution point
  const evolutionPoint: ResonanceEvolutionPoint = {
    id: uuidv4(),
    timestamp: metric.timestamp,
    sourceId: metric.sourceId,
    targetId: metric.targetId,
    context: metric.context || 'default',
    currentResonance: metric.resonanceScore,
    previousResonance,
    resonanceChange,
    evolutionRate,
    iterationCount,
    resonanceHistory: [
      ...history.map(h => ({
        timestamp: h.timestamp,
        resonanceScore: h.currentResonance
      })),
      {
        timestamp: metric.timestamp,
        resonanceScore: metric.resonanceScore
      }
    ]
  };
  
  // Update history
  history = [...history, evolutionPoint];
  
  // Keep only the last 50 measurements to prevent memory issues
  if (history.length > 50) {
    history = history.slice(history.length - 50);
  }
  
  // Update store
  resonanceHistoryStore.set(pairKey, history);
  
  return evolutionPoint;
}

/**
 * Get resonance evolution for a specific component pair
 * 
 * @param sourceId Source component ID
 * @param targetId Target component ID
 * @param context Optional context
 * @returns The most recent resonance evolution point
 */
export function getResonanceEvolution(
  sourceId: string, 
  targetId: string, 
  context: string = 'default'
): ResonanceEvolutionPoint | null {
  const pairKey = getPairKey(sourceId, targetId, context);
  const history = resonanceHistoryStore.get(pairKey) || [];
  
  if (history.length === 0) {
    return null;
  }
  
  return history[history.length - 1];
}

/**
 * Calculate and validate the overall resonance evolution across all components
 * 
 * @param timeWindow Optional time window in milliseconds (only consider data within this time window)
 * @returns Comprehensive resonance evolution validation
 */
export function validateResonanceEvolution(timeWindow?: number): ResonanceEvolutionResult {
  // Get all tracked component pairs
  const allPairs: ResonanceEvolutionPoint[] = [];
  
  for (const history of resonanceHistoryStore.values()) {
    if (history.length > 0) {
      allPairs.push(history[history.length - 1]);
    }
  }
  
  if (allPairs.length === 0) {
    // Return default result if no data
    return {
      id: uuidv4(),
      timestamp: new Date(),
      overallEvolution: 0,
      evolutionTrend: 'stable',
      learningEfficiency: 0,
      pairwiseAnalysis: [],
      highestEvolution: {
        sourceId: '',
        targetId: '',
        evolutionRate: 0
      },
      lowestEvolution: {
        sourceId: '',
        targetId: '',
        evolutionRate: 0
      },
      recommendations: [
        'No resonance data available yet. Record measurements to start tracking evolution.'
      ]
    };
  }
  
  // Calculate overall evolution
  const overallEvolution = allPairs.reduce((sum, pair) => sum + pair.resonanceChange, 0) / allPairs.length;
  
  // Determine trend
  const evolutionTrend = overallEvolution > 0.01 ? 'improving' : 
                         overallEvolution < -0.01 ? 'declining' : 'stable';
  
  // Calculate learning efficiency
  // This measures how quickly resonance improves relative to the number of iterations
  const learningEfficiency = allPairs.reduce((sum, pair) => {
    const efficiency = pair.resonanceChange / (pair.iterationCount > 1 ? Math.log(pair.iterationCount) : 1);
    return sum + efficiency;
  }, 0) / allPairs.length;
  
  // Analyze individual pairs
  const pairwiseAnalysis = allPairs.map(pair => ({
    sourceId: pair.sourceId,
    targetId: pair.targetId,
    evolutionRate: pair.evolutionRate,
    trend: pair.resonanceChange > 0.01 ? 'improving' as const : 
           pair.resonanceChange < -0.01 ? 'declining' as const : 'stable' as const
  }));
  
  // Find highest and lowest evolution rates
  let highestEvolution = pairwiseAnalysis[0];
  let lowestEvolution = pairwiseAnalysis[0];
  
  for (const pair of pairwiseAnalysis) {
    if (pair.evolutionRate > highestEvolution.evolutionRate) {
      highestEvolution = pair;
    }
    if (pair.evolutionRate < lowestEvolution.evolutionRate) {
      lowestEvolution = pair;
    }
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (evolutionTrend === 'declining') {
    recommendations.push('Overall resonance is declining. Review and optimize communication between components.');
  }
  
  if (lowestEvolution.evolutionRate < -0.05) {
    recommendations.push(`Poor resonance evolution between ${lowestEvolution.sourceId} and ${lowestEvolution.targetId}. Consider recalibrating interaction parameters.`);
  }
  
  if (highestEvolution.evolutionRate > 0.05) {
    recommendations.push(`Strong resonance improvement between ${highestEvolution.sourceId} and ${highestEvolution.targetId}. Consider applying similar patterns to other component interactions.`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Resonance evolution is stable. Continue monitoring for changes.');
  }
  
  return {
    id: uuidv4(),
    timestamp: new Date(),
    overallEvolution,
    evolutionTrend,
    learningEfficiency,
    pairwiseAnalysis,
    highestEvolution,
    lowestEvolution,
    recommendations
  };
}

/**
 * Calculate the integration factor for a component
 * This measures how well a component integrates with the overall system
 * 
 * @param componentId The ID of the component to evaluate
 * @returns Integration factor (0-1 scale)
 */
export function calculateIntegrationFactor(componentId: string): number {
  // Find all resonance pairs involving this component
  const relevantPairs: ResonanceEvolutionPoint[] = [];
  
  for (const pairKey of resonanceHistoryStore.keys()) {
    if (pairKey.startsWith(`${componentId}:`) || pairKey.includes(`:${componentId}:`)) {
      const history = resonanceHistoryStore.get(pairKey) || [];
      if (history.length > 0) {
        relevantPairs.push(history[history.length - 1]);
      }
    }
  }
  
  if (relevantPairs.length === 0) {
    return 0.5; // Default value if no data
  }
  
  // Calculate average resonance
  const averageResonance = relevantPairs.reduce((sum, pair) => {
    // If this component is the source, use the resonance as is
    // If it's the target, use the resonance but weighted slightly differently
    const isSource = pair.sourceId === componentId;
    const weightedResonance = isSource ? pair.currentResonance : pair.currentResonance * 0.9;
    return sum + weightedResonance;
  }, 0) / relevantPairs.length;
  
  // Calculate stability of resonance
  const resonanceVariance = relevantPairs.reduce((sum, pair) => {
    const variance = Math.pow(pair.currentResonance - averageResonance, 2);
    return sum + variance;
  }, 0) / relevantPairs.length;
  
  // Calculate trend factor
  const trendFactor = relevantPairs.reduce((sum, pair) => sum + pair.resonanceChange, 0) / relevantPairs.length;
  
  // Calculate integration factor combining average resonance and stability
  // Higher resonance and lower variance (more stable) leads to better integration
  const stabilityFactor = Math.max(0, 1 - resonanceVariance * 10);
  const baseIntegration = averageResonance * 0.7 + stabilityFactor * 0.3;
  
  // Add trend bonus/penalty
  const trendAdjustment = trendFactor * 2; // Amplify trend impact
  
  // Final integration factor (ensure it's between 0 and 1)
  return Math.max(0, Math.min(1, baseIntegration + trendAdjustment));
}

/**
 * Get recommendations for optimizing resonance between components
 * 
 * @param sourceId Source component ID
 * @param targetId Target component ID
 * @returns Array of specific recommendations
 */
export function getResonanceOptimizationRecommendations(
  sourceId: string,
  targetId: string
): string[] {
  const evolution = getResonanceEvolution(sourceId, targetId);
  
  if (!evolution) {
    return [
      'No resonance data available yet. Record measurements to generate recommendations.'
    ];
  }
  
  const recommendations: string[] = [];
  
  // Check resonance level
  if (evolution.currentResonance < 0.3) {
    recommendations.push('Critical resonance mismatch detected. Consider fundamental redesign of interaction patterns.');
  } else if (evolution.currentResonance < 0.5) {
    recommendations.push('Poor resonance levels. Analyze interaction data format and communication frequency.');
  } else if (evolution.currentResonance < 0.7) {
    recommendations.push('Moderate resonance. Fine-tune communication protocols and data transformations.');
  } else {
    recommendations.push('Strong resonance. Maintain current integration patterns.');
  }
  
  // Check evolution trend
  if (evolution.resonanceChange < -0.05) {
    recommendations.push('Resonance is actively degrading. Identify recent changes that might have caused the decline.');
  } else if (evolution.resonanceChange < -0.01) {
    recommendations.push('Slight resonance decline observed. Monitor closely for further degradation.');
  } else if (evolution.resonanceChange > 0.05) {
    recommendations.push('Significant resonance improvement. Document recent changes for application to other components.');
  } else if (evolution.resonanceChange > 0.01) {
    recommendations.push('Gradual resonance improvement. Continue current optimization approach.');
  }
  
  // Check iteration count
  if (evolution.iterationCount < 5) {
    recommendations.push('Limited measurement data available. Collect more interaction data for better analysis.');
  } else if (evolution.iterationCount > 20 && Math.abs(evolution.resonanceChange) < 0.01) {
    recommendations.push('Resonance has stabilized after multiple iterations. Consider more aggressive optimization techniques.');
  }
  
  return recommendations;
}