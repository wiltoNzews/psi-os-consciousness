/**
 * Inverse Pendulum Operations Recorder
 * 
 * This module provides functionality to record Inverse Pendulum Formula operations
 * for validation and learning purposes. It connects real formula executions to
 * the meta-learning validation framework.
 */

import { v4 as uuidv4 } from 'uuid';
import { recordMetaLearningDataPoint } from './meta-learning-validation.js';

/**
 * Parameters for the Inverse Pendulum Formula
 */
export interface InversePendulumParams {
  adjustmentRate: number;
  targetChaosLevel?: number;
  feedbackSignals: any[];
  timeHorizon?: number;
  stabilityThreshold?: number;
  previousStability?: number;
}

/**
 * Result of the Inverse Pendulum Formula calculation
 */
export interface StabilityResult {
  id: string;
  timestamp: Date;
  stabilityScore: number; // 0-1 score representing system stability
  equilibriumIndex: number; // Value measuring long-term stability potential
  microcorrections: number; // Required micro-adjustments to maintain stability
  chaosLevel: number; // Controlled entropy level
  feedbackIntegration: number; // How well feedback signals are integrated
  macroBalance: number; // Overall system balance
  recommendations: string[]; // Recommended actions to maintain equilibrium
  confidenceScore?: number; // Confidence in the stability calculation
  
  // Fields required by StabilityState interface
  adjustmentRate: number; // Frequency and magnitude of micro-corrections
  feedbackSignals: any[]; // Previous system states
}

/**
 * Performance metrics for formula execution
 */
export interface PerformanceMetrics {
  executionTime: number;
  accuracy: number;
  resourceUtilization: {
    cpu: number;
    memory: number;
  };
  systemFeedback: number;
}

/**
 * Records an Inverse Pendulum Formula operation for validation
 * 
 * This enhanced version integrates relational and experiential dimensions with the
 * purely computational metrics, acknowledging that cognition is fundamentally
 * relational rather than just computational.
 * 
 * @param params - The parameters used in the formula
 * @param result - The result of the formula calculation
 * @param metrics - Performance metrics of the execution
 * @param experientialContext - Optional human-relevant context to enrich validation
 */
export function recordInversePendulumOperation(
  params: InversePendulumParams,
  result: StabilityResult,
  metrics: PerformanceMetrics,
  experientialContext?: {
    humanRelevance?: string;
    narrativeContext?: string;
    impactedRelationships?: string[];
    perspectiveSource?: string;
  }
): void {
  try {
    // Experiential integration utilities are already imported at the top
    
    // Create a validation record for the meta-learning system
    const validationRecord = {
      operationId: uuidv4(),
      timestamp: new Date(),
      formulaName: 'inverse-pendulum',
      executionContext: {
        params,
        result
      },
      performance: {
        executionTime: metrics.executionTime,
        accuracy: metrics.accuracy,
        resourceUtilization: metrics.resourceUtilization,
        systemFeedback: metrics.systemFeedback,
        outputQuality: calculateOutputQuality(result)
      },
      validationMetrics: {
        stabilityAccuracy: calculateStabilityAccuracy(result, params),
        equilibriumPrecision: calculateEquilibriumPrecision(result),
        recommendationRelevance: calculateRecommendationRelevance(result),
        overallScore: (result.confidenceScore || 0.7) * metrics.accuracy
      }
    };

    // For now, we'll use simple placeholders for the experiential contexts
    // Format them correctly according to the expected structure in meta-learning-validation.ts
    const experientialContexts = [
      {
        id: uuidv4(),
        timestamp: new Date(),
        associatedMetricName: 'stabilityScore',
        associatedMetricValue: result.stabilityScore,
        humanRelevance: experientialContext?.humanRelevance || 'Represents the system\'s ability to maintain coherent functionality while adapting to change',
        experientialSignificance: 'A balanced stability score enables human-AI collaboration that feels reliable yet responsive',
        narrativeContext: experientialContext?.narrativeContext || 'Like a skilled conversationalist who listens carefully but also contributes meaningfully',
        experienceSources: ['Human-AI Interaction'],
        perspectives: [experientialContext?.perspectiveSource || 'System'],
        values: ['Balance', 'Adaptability', 'Coherence'],
        acknowledgedLimitations: [
          'Does not capture cultural or contextual nuances of stability',
          'Cannot account for human emotional responses to stability changes'
        ],
        creativeTensions: [
          'Stability vs. Adaptability',
          'Structure vs. Flexibility'
        ]
      },
      {
        id: uuidv4(),
        timestamp: new Date(),
        associatedMetricName: 'equilibriumIndex',
        associatedMetricValue: result.equilibriumIndex,
        humanRelevance: 'Reflects how well the system balances multiple competing priorities over time',
        experientialSignificance: 'An optimal equilibrium index creates interactions that feel natural and unforced',
        narrativeContext: 'Similar to how a skilled mediator helps find harmony among diverse perspectives',
        experienceSources: ['System Observation', 'Temporal Analysis'],
        perspectives: [experientialContext?.perspectiveSource || 'System'],
        values: ['Harmony', 'Balance', 'Long-term thinking'],
        acknowledgedLimitations: [
          'Doesn\'t capture cultural variations in equilibrium preferences',
          'Cannot account for situational contexts where imbalance might be preferable'
        ],
        creativeTensions: [
          'Optimization vs. Exploration',
          'Immediate Needs vs. Long-term Vision'
        ]
      }
    ];

    // Correctly format insights according to schema
    const relationalInsights = [
      {
        id: uuidv4(),
        timestamp: new Date(),
        associatedFormula: 'inverse_pendulum',
        title: 'Adaptive Stability as Relationship Quality',
        description: 'The stability score represents not just a mathematical balance point but the quality of the relationship between the system and its environment',
        transformativePotential: 'This transforms our understanding from seeing stability as a fixed target to seeing it as an ongoing relational quality',
        experientialGrounding: 'Grounded in how humans experience stability in conversations and relationships - not as static states but as dynamic, responsive connections',
        impactedRelationships: experientialContext?.impactedRelationships || ['System-Environment', 'Human-AI'],
        embracedTensions: [
          {
            tensionType: 'Stability vs. Adaptability',
            productiveValue: 'Creates a dynamic balance that can respond to changing conditions while maintaining coherence'
          },
          {
            tensionType: 'Control vs. Emergence',
            productiveValue: 'Allows intentional guidance while allowing for unexpected beneficial properties to emerge'
          }
        ],
        confidence: 0.8,
        evolvingUnderstanding: 'Our understanding of stability will continue to evolve as we observe more human-AI interactions',
        contextualRelevance: 'Particularly relevant in rapidly changing environments where adaptation is essential'
      }
    ];

    // Correctly format narratives according to schema
    const narratives = [
      {
        id: uuidv4(),
        timestamp: new Date(),
        relatedMetrics: ['stabilityScore', 'equilibriumIndex', 'chaosLevel'],
        title: 'The Dance of Stability and Change',
        storyContent: experientialContext?.narrativeContext || 
        'Like a skilled improviser in a jazz ensemble, the system must both maintain its own rhythm while responding to changes around it. The stability score reflects not just mathematical balance, but the quality of this ongoing dance between structure and adaptation.',
        narrator: experientialContext?.perspectiveSource || 'System Observer',
        perspective: 'Relational',
        insightGenerated: 'Helps us see system stability not as a fixed target but as an ongoing relational quality',
        humanConnection: 'Connects to how humans experience stability in relationships - not as static states but as dynamic, responsive connections',
        relationshipToMetrics: 'Transforms abstract numbers into experiential qualities that can be intuitively understood'
      }
    ];

    // Send the enriched record to the meta-learning validation system
    recordMetaLearningDataPoint({
      formulaType: 'inverse_pendulum',
      inputParams: params,
      outputResult: result,
      performanceMetrics: {
        executionTime: metrics.executionTime,
        accuracy: metrics.accuracy,
        resourceUtilization: metrics.resourceUtilization,
        systemFeedback: metrics.systemFeedback
      },
      // Add the experiential dimension to enrich pure computational metrics
      experientialDimension: {
        contexts: experientialContexts,
        insights: relationalInsights,
        narratives: narratives
      }
    });
    
    console.log(`Recorded Inverse Pendulum operation with experiential context: ${validationRecord.operationId}`);
  } catch (error) {
    console.error('Failed to record Inverse Pendulum operation:', error);
  }
}

/**
 * Calculate the quality of the stability calculation output
 */
function calculateOutputQuality(result: StabilityResult): number {
  // A simple heuristic for output quality based on available metrics
  const hasRecommendations = result.recommendations.length > 0 ? 1 : 0.5;
  const confidenceWeight = result.confidenceScore || 0.7;
  
  // Quality is affected by stability, equilibrium, and the presence of recommendations
  return (
    (0.4 * result.stabilityScore) + 
    (0.3 * (result.equilibriumIndex / 10)) + 
    (0.3 * hasRecommendations)
  ) * confidenceWeight;
}

/**
 * Calculate the accuracy of stability calculation
 */
function calculateStabilityAccuracy(result: StabilityResult, params: InversePendulumParams): number {
  // If we have a previous stability value, use it to check for consistency
  if (params.previousStability !== undefined) {
    // Calculate expected change magnitude based on adjustment rate
    const expectedChangeMagnitude = params.adjustmentRate * 0.2;
    
    // Calculate actual change magnitude
    const actualChange = Math.abs(result.stabilityScore - params.previousStability);
    
    // If change is within expected range based on adjustment rate, accuracy is high
    if (actualChange <= expectedChangeMagnitude * 1.5) {
      return 0.8 + (0.2 * (1 - actualChange / (expectedChangeMagnitude * 1.5)));
    } else {
      return 0.6 * (expectedChangeMagnitude / actualChange);
    }
  }
  
  // If no previous value, return a default based on confidence
  return result.confidenceScore || 0.7;
}

/**
 * Calculate the precision of equilibrium index
 */
function calculateEquilibriumPrecision(result: StabilityResult): number {
  // Equilibrium index should be related to stability score in a consistent way
  const expectedEquilibrium = result.stabilityScore * 10;
  const actualEquilibrium = result.equilibriumIndex;
  
  // Calculate how close the actual is to expected
  const difference = Math.abs(expectedEquilibrium - actualEquilibrium);
  const maxDifference = 5; // Maximum acceptable difference
  
  return 1 - Math.min(difference / maxDifference, 1);
}

/**
 * Calculate the relevance of recommendations
 */
function calculateRecommendationRelevance(result: StabilityResult): number {
  // Simple heuristic based on number of recommendations and stability score
  if (result.recommendations.length === 0) {
    return 0.5; // Neutral if no recommendations
  }
  
  // If stability is low, we expect more recommendations
  const expectedRecommendations = Math.ceil((1 - result.stabilityScore) * 5);
  const actualRecommendations = result.recommendations.length;
  
  // Calculate how close the actual count is to expected
  const difference = Math.abs(expectedRecommendations - actualRecommendations);
  const maxDifference = 3; // Maximum acceptable difference
  
  return 0.8 * (1 - Math.min(difference / maxDifference, 1));
}

/**
 * Calculate stability using the Inverse Pendulum Formula
 * Enhanced version with improved metrics capturing
 * 
 * @param params - Parameters for the calculation
 * @returns Stability calculation result
 */
export function calculateStabilityWithMetrics(params: InversePendulumParams): StabilityResult {
  const {
    adjustmentRate,
    targetChaosLevel = 0.3,
    feedbackSignals,
    timeHorizon = 10,
    stabilityThreshold = 0.6,
    previousStability = 0.5
  } = params;
  
  // Start with previous stability as the base
  let stabilityScore = previousStability;
  
  // Apply adjustments based on adjustment rate
  stabilityScore += (Math.random() * 0.2 - 0.1) * adjustmentRate;
  
  // Integrate feedback signals
  const feedbackIntegration = integrateFeedbackSignals(feedbackSignals);
  stabilityScore = stabilityScore * 0.7 + feedbackIntegration * 0.3;
  
  // Apply chaos element for controlled entropy (prevents stagnation)
  const chaosLevel = targetChaosLevel * (1 - stabilityScore / 2); // Less chaos when more stable
  stabilityScore += (Math.random() * chaosLevel * 2 - chaosLevel);
  
  // Calculate equilibrium index - a measure of long-term stability potential
  const equilibriumIndex = calculateEquilibriumIndex(stabilityScore, chaosLevel, feedbackSignals);
  
  // Calculate micro-corrections needed to maintain stability
  const microcorrections = calculateMicrocorrections(stabilityScore, stabilityThreshold);
  
  // Calculate macro balance
  const macroBalance = calculateMacroBalance(stabilityScore, feedbackSignals, timeHorizon);
  
  // Generate recommendations based on current stability
  const recommendations = generateRecommendations(
    stabilityScore, 
    equilibriumIndex, 
    chaosLevel,
    microcorrections,
    stabilityThreshold
  );
  
  // Ensure stability is within bounds
  stabilityScore = Math.max(0, Math.min(1, stabilityScore));
  
  // Calculate confidence score
  const confidenceScore = calculateConfidenceScore(
    stabilityScore, 
    feedbackSignals.length,
    chaosLevel
  );
  
  return {
    id: uuidv4(),
    timestamp: new Date(),
    stabilityScore,
    equilibriumIndex,
    microcorrections,
    chaosLevel,
    feedbackIntegration,
    macroBalance,
    recommendations,
    confidenceScore,
    
    // Fields required by StabilityState interface
    adjustmentRate,
    feedbackSignals: feedbackSignals.map(signal => ({
      timestamp: new Date(),
      signalType: typeof signal === 'object' && signal !== null && 'type' in signal 
        ? signal.type as 'user_feedback' | 'system_metric' | 'performance_indicator' | 'adaptive_resonance'
        : 'system_metric',
      value: typeof signal === 'number' 
        ? signal 
        : (typeof signal === 'object' && signal !== null && 'value' in signal 
          ? signal.value as number 
          : 0.5)
    }))
  };
}

/**
 * Integrate feedback signals into a single value
 */
function integrateFeedbackSignals(feedbackSignals: any[]): number {
  if (!feedbackSignals || feedbackSignals.length === 0) {
    return 0.5; // Default value if no feedback
  }
  
  // Extract numerical values from feedback signals
  const values = feedbackSignals.map(signal => {
    if (typeof signal === 'number') {
      return signal;
    } else if (typeof signal === 'object' && signal !== null && 'value' in signal) {
      return typeof signal.value === 'number' ? signal.value : 0.5;
    } else {
      return 0.5; // Default for non-numerical feedback
    }
  });
  
  // Calculate weighted average, giving more weight to recent signals
  let sum = 0;
  let weightSum = 0;
  
  values.forEach((value, index) => {
    const weight = 1 + (index / values.length); // More recent signals have higher weights
    sum += value * weight;
    weightSum += weight;
  });
  
  return sum / weightSum;
}

/**
 * Calculate equilibrium index based on stability, chaos and feedback
 */
function calculateEquilibriumIndex(
  stabilityScore: number,
  chaosLevel: number,
  feedbackSignals: any[]
): number {
  // Base equilibrium on stability score (0-10 scale)
  let equilibriumIndex = stabilityScore * 10;
  
  // Adjust based on chaos level - higher chaos means lower equilibrium
  equilibriumIndex -= chaosLevel * 3;
  
  // Adjust based on feedback signal consistency
  if (feedbackSignals.length > 1) {
    const values = feedbackSignals.map(signal => {
      if (typeof signal === 'number') {
        return signal;
      } else if (typeof signal === 'object' && signal !== null && 'value' in signal) {
        return typeof signal.value === 'number' ? signal.value : 0.5;
      } else {
        return 0.5;
      }
    });
    
    // Calculate variance of feedback signals
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    // Lower variance means more consistent feedback, which improves equilibrium
    equilibriumIndex += (1 - Math.min(1, variance * 10)) * 2;
  }
  
  // Ensure equilibrium index is within reasonable bounds (0-10)
  return Math.max(0, Math.min(10, equilibriumIndex));
}

/**
 * Calculate required micro-corrections based on stability
 */
function calculateMicrocorrections(
  stabilityScore: number,
  stabilityThreshold: number
): number {
  // If stability is below threshold, more corrections are needed
  if (stabilityScore < stabilityThreshold) {
    // The further from threshold, the more corrections needed
    return Math.ceil((stabilityThreshold - stabilityScore) * 10);
  } else {
    // Even stable systems need some adjustments
    return Math.max(1, Math.ceil((1 - stabilityScore) * 5));
  }
}

/**
 * Calculate macro balance factor
 */
function calculateMacroBalance(
  stabilityScore: number,
  feedbackSignals: any[],
  timeHorizon: number
): number {
  // Start with base balance related to stability
  let macroBalance = stabilityScore;
  
  // Adjust based on time horizon - longer horizons need better balance
  macroBalance = macroBalance * (0.7 + 0.3 * (timeHorizon / 20));
  
  // Adjust based on feedback signals diversity
  const signalTypes = new Set(
    feedbackSignals.map(signal => {
      if (typeof signal === 'object' && signal !== null && 'type' in signal) {
        return signal.type;
      }
      return 'unknown';
    })
  );
  
  // More diverse feedback improves macro balance
  macroBalance += (signalTypes.size / 10);
  
  // Keep within 0-1 range
  return Math.max(0, Math.min(1, macroBalance));
}

/**
 * Generate recommendations based on stability analysis
 */
function generateRecommendations(
  stabilityScore: number,
  equilibriumIndex: number,
  chaosLevel: number,
  microcorrections: number,
  stabilityThreshold: number
): string[] {
  const recommendations: string[] = [];
  
  // Low stability recommendations
  if (stabilityScore < stabilityThreshold) {
    recommendations.push(`Increase adjustment rate to improve stability (current score: ${stabilityScore.toFixed(2)})`);
    recommendations.push(`Apply ${microcorrections} micro-corrections to stabilize the system`);
  }
  
  // Chaos level recommendations
  if (chaosLevel > 0.4) {
    recommendations.push(`Reduce chaos level from ${chaosLevel.toFixed(2)} to prevent unpredictability`);
  } else if (chaosLevel < 0.1 && stabilityScore > 0.8) {
    recommendations.push(`Introduce controlled entropy to prevent stagnation`);
  }
  
  // Equilibrium recommendations
  if (equilibriumIndex < 5) {
    recommendations.push(`Improve long-term equilibrium potential (current index: ${equilibriumIndex.toFixed(1)})`);
  } else if (equilibriumIndex > 8) {
    recommendations.push(`Maintain current equilibrium parameters`);
  }
  
  // Add a general recommendation based on overall state
  if (stabilityScore > 0.8 && equilibriumIndex > 7) {
    recommendations.push(`System is in optimal dynamic equilibrium, continue current approach`);
  } else if (stabilityScore > 0.6) {
    recommendations.push(`System is in functional dynamic equilibrium, minor adjustments recommended`);
  } else {
    recommendations.push(`System requires significant rebalancing to achieve dynamic equilibrium`);
  }
  
  return recommendations;
}

/**
 * Calculate confidence score for the stability calculation
 */
function calculateConfidenceScore(
  stabilityScore: number,
  feedbackCount: number,
  chaosLevel: number
): number {
  // Base confidence on feedback signals count
  let confidence = 0.5 + (Math.min(feedbackCount, 10) / 20);
  
  // Adjust based on chaos level - higher chaos means lower confidence
  confidence -= chaosLevel * 0.3;
  
  // Extreme stability values might be less reliable
  if (stabilityScore < 0.1 || stabilityScore > 0.9) {
    confidence -= 0.1;
  }
  
  // Ensure confidence is within 0-1 range
  return Math.max(0, Math.min(1, confidence));
}

/**
 * Convert various metrics into feedback signals for the Inverse Pendulum Formula
 */
export function convertMetricsToFeedbackSignals(metrics: Record<string, number | undefined>): any[] {
  const feedbackSignals = [];
  
  // Convert each metric to a feedback signal
  for (const [key, value] of Object.entries(metrics)) {
    if (value !== undefined) {
      feedbackSignals.push({
        type: key,
        value: normalizeMetricValue(key, value),
        timestamp: Date.now()
      });
    }
  }
  
  return feedbackSignals;
}

/**
 * Normalize various metric values to a 0-1 scale
 */
function normalizeMetricValue(metricName: string, value: number): number {
  switch (metricName) {
    case 'responseTime':
      // Lower is better, normalize to 0-1 where 1 is best (fastest)
      // Assume response times between 10ms (excellent) and 5000ms (poor)
      return 1 - Math.min(1, Math.max(0, (value - 10) / 4990));
      
    case 'successRate':
      // Higher is better, already in 0-1 range
      return Math.min(1, Math.max(0, value));
      
    case 'userSatisfaction':
      // Usually on a 1-5 or 1-10 scale
      if (value > 0 && value <= 5) {
        return value / 5; // Normalize 1-5 scale
      } else if (value > 0 && value <= 10) {
        return value / 10; // Normalize 1-10 scale
      }
      return Math.min(1, Math.max(0, value)); // Ensure 0-1 range
      
    case 'systemLoad':
      // Lower is better for system load (0-100%)
      return 1 - Math.min(1, Math.max(0, value / 100));
      
    case 'errorRate':
      // Lower is better for error rate (0-100%)
      return 1 - Math.min(1, Math.max(0, value / 100));
      
    case 'adaptiveResonance':
      // Higher is better, assume this is already in 0-1 range
      return Math.min(1, Math.max(0, value));
      
    default:
      // For unknown metrics, ensure they're in 0-1 range
      if (value >= 0 && value <= 1) {
        return value;
      } else if (value > 1 && value <= 100) {
        return value / 100; // Assume percentage
      } else if (value > 100) {
        return 1; // Cap at 1 for large values
      } else if (value < 0) {
        return 0; // Floor at 0 for negative values
      }
      return 0.5; // Default for unknown range
  }
}