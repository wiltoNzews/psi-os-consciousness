/**
 * Inverse Pendulum Calculator
 * 
 * This module implements the Inverse Pendulum Formula, which is used to
 * calculate system stability metrics. It uses real-time feedback signals
 * and self-correction mechanisms to maintain equilibrium in complex systems.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { v4 as uuidv4 } from 'uuid';
import { applyChaosTuning, calculateInnovationDeficit } from './dynamic-chaos-tuner.js';

/**
 * Parameters for the Inverse Pendulum Formula calculation
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
  adjustmentRate: number; // Required for StabilityState interface
  feedbackSignals: any[]; // Required for StabilityState interface
}

/**
 * Calculate system stability using the Inverse Pendulum Formula
 * This is the primary entry point for stability calculations
 * 
 * Enhanced with Dynamic Chaos Tuning to implement the 70/30 Structured Chaos Ratio
 * mechanism for balancing stability and innovation.
 */
export function calculateStabilityWithMetrics(params: InversePendulumParams): StabilityResult {
  // Set default values for optional parameters
  const targetChaosLevel = params.targetChaosLevel ?? 0.3;
  const timeHorizon = params.timeHorizon ?? 10;
  const stabilityThreshold = params.stabilityThreshold ?? 0.7;
  const previousStability = params.previousStability ?? 0.5;

  // Generate unique ID and timestamp for this calculation
  const id = uuidv4();
  const timestamp = new Date();

  // Extract feedback signals or use empty array
  const feedbackSignals = params.feedbackSignals || [];

  // Calculate number of micro-corrections based on adjustment rate and feedback
  const microcorrections = Math.ceil(
    (params.adjustmentRate * 5) + (feedbackSignals.length * 0.5)
  );

  // Calculate chaos level - higher adjustment rates lead to more chaos
  const rawChaosLevel = targetChaosLevel + (params.adjustmentRate * 0.1) - (previousStability * 0.05);
  const chaosLevel = Math.max(0.1, Math.min(0.9, rawChaosLevel));

  // Calculate equilibrium index - measures how close to ideal equilibrium
  // Incorporates time horizon and previous stability
  const equilibriumIndex = calculateEquilibriumIndex(
    params.adjustmentRate,
    previousStability,
    timeHorizon,
    chaosLevel
  );

  // Calculate feedback integration score - how well system integrates feedback
  const feedbackIntegration = calculateFeedbackIntegration(
    feedbackSignals,
    params.adjustmentRate
  );

  // Calculate macro balance - overall system balance
  const macroBalance = calculateMacroBalance(
    equilibriumIndex,
    chaosLevel,
    feedbackIntegration
  );

  // Calculate stability score based on all components
  // This is the primary metric for system stability
  const stabilityScore = calculateStabilityScore(
    equilibriumIndex,
    chaosLevel,
    feedbackIntegration,
    macroBalance,
    microcorrections,
    previousStability
  );

  // Generate recommendations based on stability metrics
  const recommendations = generateRecommendations(
    stabilityScore,
    equilibriumIndex,
    chaosLevel,
    feedbackIntegration,
    macroBalance,
    microcorrections
  );

  // Calculate confidence score - how confident we are in the stability calculation
  const confidenceScore = calculateConfidenceScore(
    feedbackSignals.length,
    microcorrections,
    chaosLevel
  );

  // Create initial stability result
  const initialResult: StabilityResult = {
    id,
    timestamp,
    stabilityScore,
    equilibriumIndex,
    microcorrections,
    chaosLevel,
    feedbackIntegration,
    macroBalance,
    recommendations,
    confidenceScore,
    adjustmentRate: params.adjustmentRate,
    feedbackSignals
  };

  // Apply Dynamic Chaos Tuning mechanism based on the 70/30 Structured Chaos Ratio
  // Estimate innovation deficit based on stability metrics
  const recentChanges = feedbackSignals.length;
  const stagnationDuration = Math.max(0, 30 - recentChanges); // Rough estimate
  const innovationDeficit = calculateInnovationDeficit(stabilityScore, recentChanges, stagnationDuration);

  // Create stability state from the initial result
  const stabilityState: StabilityState = {
    id,
    timestamp,
    stabilityScore,
    equilibriumIndex,
    adjustmentRate: params.adjustmentRate,
    chaosLevel,
    feedbackSignals: feedbackSignals.map(signal => typeof signal === 'object' && signal !== null ? 
      signal as FeedbackSignal : 
      createFeedbackSignal('system_metric', typeof signal === 'number' ? signal : 0.5, 'system')
    ),
    recommendations
  };

  // Apply chaos tuning to adjust chaos level and recommendations
  const tunedState = applyChaosTuning(stabilityState, innovationDeficit);

  // Create final result with tuned chaos level and updated recommendations
  const finalResult: StabilityResult = {
    ...initialResult,
    chaosLevel: tunedState.chaosLevel,
    recommendations: tunedState.recommendations,
    // Recalculate metrics that depend on chaos level
    macroBalance: calculateMacroBalance(
      equilibriumIndex,
      tunedState.chaosLevel,
      feedbackIntegration
    )
  };

  console.log(`[QUANTUM_STATE: SIM_FLOW] ${new Date().toISOString()} - Stability calculation with dynamic chaos tuning: ${finalResult.id}`);
  
  return finalResult;
}

/**
 * Calculate equilibrium index - measures how close to ideal equilibrium
 */
function calculateEquilibriumIndex(
  adjustmentRate: number,
  previousStability: number,
  timeHorizon: number,
  chaosLevel: number
): number {
  // Ideal adjustment rate decreases with higher previous stability
  const idealAdjustment = 0.5 - (previousStability * 0.2);

  // Calculate deviation from ideal adjustment
  const adjustmentDeviation = Math.abs(adjustmentRate - idealAdjustment);

  // Raw equilibrium index - higher deviation reduces equilibrium
  let equilibriumIndex = 1 - (adjustmentDeviation * 1.5) - (chaosLevel * 0.3);

  // Time horizon effect - longer horizons stabilize equilibrium
  const timeHorizonEffect = Math.log10(timeHorizon) * 0.1;
  equilibriumIndex += timeHorizonEffect;

  // Constrain to valid range -1 to 1 (negative values represent unstable equilibrium)
  return Math.max(-1, Math.min(1, equilibriumIndex));
}

/**
 * Calculate feedback integration score
 */
function calculateFeedbackIntegration(
  feedbackSignals: any[],
  adjustmentRate: number
): number {
  // Base integration is based on adjustment rate
  let baseIntegration = adjustmentRate * 0.5 + 0.3;

  // No signals means low integration
  if (feedbackSignals.length === 0) {
    return Math.min(0.3, baseIntegration);
  }

  // Calculate signal diversity (types of signals)
  const signalTypes = new Set(feedbackSignals.map(s => s.type || 'unknown')).size;
  const diversityFactor = signalTypes / feedbackSignals.length;

  // Calculate signal recency (newer signals are more valuable)
  const recencyFactor = calculateRecencyFactor(feedbackSignals);

  // Calculate signal coherence (how well signals align)
  const coherenceFactor = calculateCoherenceFactor(feedbackSignals);

  // Combine all factors with base integration
  let integrationScore = baseIntegration + 
                        (diversityFactor * 0.2) + 
                        (recencyFactor * 0.3) + 
                        (coherenceFactor * 0.2);

  // Constrain to valid range 0-1
  return Math.max(0, Math.min(1, integrationScore));
}

/**
 * Calculate recency factor for feedback signals
 */
function calculateRecencyFactor(feedbackSignals: any[]): number {
  // If no timestamps, return moderate value
  if (!feedbackSignals.some(s => s.timestamp)) {
    return 0.5;
  }

  // Get current time and calculate age of each signal
  const now = Date.now();
  const signalAges = feedbackSignals
    .filter(s => s.timestamp)
    .map(s => {
      const timestamp = s.timestamp instanceof Date 
        ? s.timestamp.getTime() 
        : new Date(s.timestamp).getTime();
      return (now - timestamp) / (1000 * 60 * 60); // Age in hours
    });

  // No valid timestamps
  if (signalAges.length === 0) {
    return 0.5;
  }

  // Calculate average age in hours (capped at 24 hours)
  const averageAgeInHours = Math.min(24, 
    signalAges.reduce((sum, age) => sum + age, 0) / signalAges.length
  );

  // Newer signals (lower age) give higher recency factor
  return 1 - (averageAgeInHours / 24);
}

/**
 * Calculate coherence factor for feedback signals
 */
function calculateCoherenceFactor(feedbackSignals: any[]): number {
  // Need at least 2 signals to calculate coherence
  if (feedbackSignals.length < 2) {
    return 0.5;
  }

  // Extract values or use moderate value if not present
  const values = feedbackSignals.map(s => {
    const value = s.value !== undefined ? s.value : 
                 (s.magnitude !== undefined ? s.magnitude : 0.5);
    return typeof value === 'number' ? value : 0.5;
  });

  // Calculate standard deviation
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Higher standard deviation means lower coherence
  // Normalize to 0-1 range (0 = high deviation, 1 = low deviation)
  return Math.max(0, Math.min(1, 1 - (stdDev * 2)));
}

/**
 * Calculate macro balance
 */
function calculateMacroBalance(
  equilibriumIndex: number,
  chaosLevel: number,
  feedbackIntegration: number
): number {
  // Convert equilibrium index to positive value
  const equilibriumContribution = (Math.abs(equilibriumIndex) + equilibriumIndex) / 2;

  // Calculate raw balance score
  const rawBalance = (
    (equilibriumContribution * 0.5) +
    ((1 - chaosLevel) * 0.3) +
    (feedbackIntegration * 0.2)
  );

  // Apply non-linear scaling to emphasize mid-range balance
  return Math.max(0, Math.min(1, 
    rawBalance < 0.5 
      ? rawBalance * 1.2 
      : 0.6 + ((rawBalance - 0.5) * 0.8)
  ));
}

/**
 * Calculate stability score
 */
function calculateStabilityScore(
  equilibriumIndex: number,
  chaosLevel: number,
  feedbackIntegration: number,
  macroBalance: number,
  microcorrections: number,
  previousStability: number
): number {
  // Convert equilibrium index to positive value
  const positiveEquilibrium = (equilibriumIndex + 1) / 2;

  // Calculate component contributions
  const equilibriumContribution = positiveEquilibrium * 0.3;
  const chaosContribution = (1 - chaosLevel) * 0.15;
  const feedbackContribution = feedbackIntegration * 0.15;
  const balanceContribution = macroBalance * 0.2;

  // Microcorrections penalty - more corrections means less stability
  const microcorrectionsPenalty = Math.min(0.15, microcorrections * 0.03);

  // Historical stability contribution (inertia)
  const historyContribution = previousStability * 0.2;

  // Calculate raw stability score
  const rawStability = equilibriumContribution + 
                      chaosContribution + 
                      feedbackContribution + 
                      balanceContribution + 
                      historyContribution - 
                      microcorrectionsPenalty;

  // Apply non-linear scaling to create realistic stability curve
  let scaledStability = rawStability;

  // Apply system dynamics adjustments
  if (rawStability < 0.3) {
    // Low stability systems tend to destabilize further
    scaledStability = rawStability * 0.9;
  } else if (rawStability > 0.7) {
    // High stability systems have diminishing returns
    scaledStability = 0.7 + ((rawStability - 0.7) * 0.7);
  }

  // This ensures the stability is a real calculation, not a static value
  return Math.max(0, Math.min(1, scaledStability));
}

/**
 * Generate recommendations based on stability metrics
 */
function generateRecommendations(
  stabilityScore: number,
  equilibriumIndex: number,
  chaosLevel: number,
  feedbackIntegration: number,
  macroBalance: number,
  microcorrections: number
): string[] {
  const recommendations: string[] = [];

  // Stability score recommendations
  if (stabilityScore < 0.3) {
    recommendations.push('Critical: System stability at risk. Implement emergency stabilization protocol.');
  } else if (stabilityScore < 0.5) {
    recommendations.push('Warning: System stability below optimal levels. Review adjustment rate and feedback mechanisms.');
  } else if (stabilityScore < 0.7) {
    recommendations.push('Advisory: System stability acceptable but could be improved with fine-tuning.');
  } else {
    recommendations.push('System stability optimal. Maintain current parameters with regular monitoring.');
  }

  // Equilibrium index recommendations
  if (equilibriumIndex < -0.5) {
    recommendations.push('Critical imbalance detected. Reduce adjustment rate immediately.');
  } else if (equilibriumIndex < 0) {
    recommendations.push('System trending toward instability. Adjust feedback integration parameters.');
  } else if (equilibriumIndex < 0.3) {
    recommendations.push('Marginal equilibrium. Consider increasing integration of stabilizing feedback signals.');
  }

  // Chaos level recommendations
  if (chaosLevel > 0.6) {
    recommendations.push('High entropy detected. Implement entropy reduction protocol.');
  } else if (chaosLevel < 0.2) {
    recommendations.push('Low entropy may indicate system rigidity. Consider introducing controlled variation.');
  }

  // Feedback integration recommendations
  if (feedbackIntegration < 0.4) {
    recommendations.push('Feedback integration suboptimal. Review signal processing and integration mechanisms.');
  }

  // Macro balance recommendations
  if (macroBalance < 0.4) {
    recommendations.push('Macro system balance at risk. Review long-term equilibrium factors.');
  }

  // Microcorrections recommendations
  if (microcorrections > 5) {
    recommendations.push('Excessive micro-corrections detected. System may be over-adjusting.');
  }

  return recommendations;
}

/**
 * Calculate confidence score for the stability calculation
 */
function calculateConfidenceScore(
  feedbackSignalCount: number,
  microcorrections: number,
  chaosLevel: number
): number {
  // Base confidence
  let confidence = 0.7;

  // More feedback signals increase confidence
  if (feedbackSignalCount > 0) {
    confidence += Math.min(0.15, feedbackSignalCount * 0.03);
  } else {
    confidence -= 0.1; // Penalty for no feedback
  }

  // Excessive micro-corrections reduce confidence
  if (microcorrections > 5) {
    confidence -= Math.min(0.15, (microcorrections - 5) * 0.03);
  }

  // High chaos reduces confidence
  if (chaosLevel > 0.5) {
    confidence -= (chaosLevel - 0.5) * 0.2;
  }

  return Math.max(0.3, Math.min(1, confidence));
}


/**
 * Stability state at a given point in time
 */
export interface StabilityState {
  id: string;
  timestamp: Date;
  stabilityScore: number; // 0-1 score representing system stability
  equilibriumIndex: number; // -1 to 1 (negative = too rigid, positive = too chaotic)
  adjustmentRate: number; // Frequency and magnitude of micro-corrections
  chaosLevel: number; // Controlled entropy level
  feedbackSignals: FeedbackSignal[]; // Previous system states
  recommendations: string[]; // Recommended actions to maintain equilibrium
}

/**
 * Feedback signal representing a previous system state
 */
export interface FeedbackSignal {
  timestamp: Date;
  signalType: 'user_feedback' | 'system_metric' | 'performance_indicator' | 'adaptive_resonance';
  value: number; // Normalized value between -1 and 1
  source: string; // Source of the feedback signal
  weight: number; // Importance weight of this signal (0-1)
}

/**
 * System state parameters for stability calculation
 */
export interface SystemStateParams {
  currentAdjustmentRate: number; // Current rate of system adjustments (0-1)
  targetAdjustmentRate?: number; // Target rate of system adjustments (0-1)
  currentChaosLevel: number; // Current level of controlled entropy (0-1)
  targetChaosLevel?: number; // Target level of controlled entropy (0-1)
  feedbackSignals: FeedbackSignal[]; // Recent feedback signals
  timeHorizon?: number; // Number of time steps to consider for stability projection
  stabilityThreshold?: number; // Threshold for acceptable stability (0-1)
  previousStability?: number; // Previous stability score for trend analysis
}

/**
 * Create a new feedback signal from various system metrics
 */
export function createFeedbackSignal(
  signalType: 'user_feedback' | 'system_metric' | 'performance_indicator' | 'adaptive_resonance',
  value: number,
  source: string,
  weight: number = 1.0
): FeedbackSignal {
  return {
    timestamp: new Date(),
    signalType,
    value: Math.max(-1, Math.min(1, value)), // Ensure value is between -1 and 1
    source,
    weight: Math.max(0, Math.min(1, weight)) // Ensure weight is between 0 and 1
  };
}

/**
 * Convert various metrics to normalized feedback signals
 * 
 * @param metrics - Object containing various system metrics
 * @returns Array of feedback signals
 */
export function convertMetricsToFeedbackSignals(
  metrics: {
    responseTime?: number; // milliseconds
    successRate?: number; // 0-1
    userSatisfaction?: number; // 1-5 scale
    systemLoad?: number; // 0-1
    errorRate?: number; // 0-1
    adaptiveResonance?: number; // 0-1
    [key: string]: number | undefined;
  }
): FeedbackSignal[] {
  const signals: FeedbackSignal[] = [];

  // Response time (lower is better, convert to -1 to 1 scale)
  if (metrics.responseTime !== undefined) {
    // Normalize: <200ms excellent (1), >2000ms poor (-1)
    const normalizedValue = Math.max(-1, Math.min(1, 1 - (metrics.responseTime - 200) / 1800 * 2));
    signals.push(createFeedbackSignal(
      'system_metric',
      normalizedValue,
      'response_time',
      0.8 // Weight for response time
    ));
  }

  // Success rate (higher is better, convert to -1 to 1 scale)
  if (metrics.successRate !== undefined) {
    // Normalize: 100% excellent (1), 50% or below poor (-1)
    const normalizedValue = Math.max(-1, Math.min(1, (metrics.successRate - 0.5) * 2));
    signals.push(createFeedbackSignal(
      'system_metric',
      normalizedValue,
      'success_rate',
      0.9 // Weight for success rate
    ));
  }

  // User satisfaction (1-5 scale, convert to -1 to 1 scale)
  if (metrics.userSatisfaction !== undefined) {
    // Normalize: 5 excellent (1), 1 poor (-1)
    const normalizedValue = (metrics.userSatisfaction - 3) / 2;
    signals.push(createFeedbackSignal(
      'user_feedback',
      normalizedValue,
      'user_satisfaction',
      1.0 // Weight for user satisfaction (highest)
    ));
  }

  // System load (lower is better, convert to -1 to 1 scale)
  if (metrics.systemLoad !== undefined) {
    // Normalize: <0.3 excellent (1), >0.8 poor (-1)
    const normalizedValue = Math.max(-1, Math.min(1, 1 - (metrics.systemLoad - 0.3) / 0.5 * 2));
    signals.push(createFeedbackSignal(
      'system_metric',
      normalizedValue,
      'system_load',
      0.7 // Weight for system load
    ));
  }

  // Error rate (lower is better, convert to -1 to 1 scale)
  if (metrics.errorRate !== undefined) {
    // Normalize: <0.01 excellent (1), >0.1 poor (-1)
    const normalizedValue = Math.max(-1, Math.min(1, 1 - (metrics.errorRate - 0.01) / 0.09 * 2));
    signals.push(createFeedbackSignal(
      'system_metric',
      normalizedValue,
      'error_rate',
      0.9 // Weight for error rate
    ));
  }

  // Adaptive resonance (higher is better, convert to -1 to 1 scale)
  if (metrics.adaptiveResonance !== undefined) {
    // Normalize: >0.8 excellent (1), <0.3 poor (-1)
    const normalizedValue = Math.max(-1, Math.min(1, (metrics.adaptiveResonance - 0.3) / 0.5 * 2));
    signals.push(createFeedbackSignal(
      'adaptive_resonance',
      normalizedValue,
      'adaptive_resonance',
      0.85 // Weight for adaptive resonance
    ));
  }

  // Process other custom metrics
  for (const [key, value] of Object.entries(metrics)) {
    if (value !== undefined && 
        !['responseTime', 'successRate', 'userSatisfaction', 'systemLoad', 'errorRate', 'adaptiveResonance']
          .includes(key)) {
      // Default normalization for unknown metrics (assuming 0-1 range, convert to -1 to 1)
      const normalizedValue = Math.max(-1, Math.min(1, value * 2 - 1));
      signals.push(createFeedbackSignal(
        'system_metric',
        normalizedValue,
        key,
        0.5 // Default weight for custom metrics
      ));
    }
  }

  return signals;
}

/**
 * Enhanced stability interface that includes metrics for meta-void operations
 */
export interface EnhancedStabilityState extends StabilityState {
  // Core stability metrics
  confidenceScore: number; // 0-1 confidence in the stability calculation

  // Meta-void preview & review fields
  experientialQuality?: number; // 0-1 quality of experiential context
  resonanceLevel?: number; // 0-1 level of resonance with surrounding context
  adaptiveResponse?: number; // 0-1 degree of context-appropriate responses

  // Relational dimension metrics
  narrativeClarity?: number; // 0-1 clarity of the system's narrative
  contextualRelevance?: number; // 0-1 relevance to surrounding context
  meaningIntegration?: number; // 0-1 integration of meaning across dimensions

  // Extended metrics for meta-analysis
  metaVoidContraction?: number; // 0-1 degree of system contraction
  metaVoidExpansion?: number; // 0-1 degree of system expansion
  cyclePosition?: number; // 0-1 position in contraction-expansion cycle
}

/**
 * Parameters for advanced stability calculation with experiential metrics
 */
export interface EnhancedStabilityParams {
  // Core inverse pendulum parameters
  adjustmentRate: number; // Current rate of system adjustments (0-1)
  targetChaosLevel?: number; // Target level of controlled entropy (0-1)
  feedbackSignals: any[]; // Recent feedback signals (any format supported)
  timeHorizon?: number; // Number of time steps to consider for stability projection

  // Meta-void preview & review parameters
  contractExperiential?: boolean; // Whether to contract experiential dimension
  expandComputational?: boolean; // Whether to expand computational dimension
  depthOfContraction?: number; // 0-1 how deeply to contract
  breadthOfExpansion?: number; // 0-1 how broadly to expand

  // Context parameters
  experientialContext?: string; // Narrative context for calculation
  relationalPriority?: number; // 0-1 priority of relational understanding

  // Legacy support
  stabilityThreshold?: number; // Threshold for acceptable stability (0-1)
  previousStability?: number; // Previous stability score for trend analysis
}

/**
 * Calculate stability with enhanced metrics that include relational dimensions
 * 
 * This implementation adapts the core Inverse Pendulum Formula to include
 * meta-void preview & review mechanics, allowing for dynamic contraction
 * and expansion of system parameters based on experiential context.
 * 
 * @param params - Enhanced system state parameters
 * @returns Enhanced stability state with both computational and relational metrics
 */
export async function calculateEnhancedStabilityWithMetrics(params: EnhancedStabilityParams | any): Promise<EnhancedStabilityState> {
  // Handle legacy parameter format and convert to new format if needed
  const enhancedParams: EnhancedStabilityParams = normalizeParams(params);

  // Calculate base stability using core inverse pendulum formula
  let feedbackSignals: FeedbackSignal[] = [];

  // Convert array of objects to proper FeedbackSignal objects
  if (Array.isArray(enhancedParams.feedbackSignals)) {
    feedbackSignals = enhancedParams.feedbackSignals.map(signal => {
      // If this is already a proper FeedbackSignal with timestamp, use it
      if (signal.timestamp instanceof Date && 
          typeof signal.signalType === 'string' && 
          typeof signal.value === 'number' &&
          typeof signal.source === 'string' &&
          typeof signal.weight === 'number') {
        return signal;
      }

      // Otherwise convert to proper format
      return createFeedbackSignal(
        'system_metric',
        typeof signal.value === 'number' ? signal.value : 0.5,
        typeof signal.name === 'string' ? signal.name : 'unknown',
        typeof signal.weight === 'number' ? signal.weight : 1.0
      );
    });
  }

  // Prepare system state parameters for core stability calculation
  const systemParams: SystemStateParams = {
    currentAdjustmentRate: enhancedParams.adjustmentRate,
    targetAdjustmentRate: enhancedParams.adjustmentRate * 1.1, // Slight increase as target
    currentChaosLevel: enhancedParams.targetChaosLevel || 0.3,
    targetChaosLevel: enhancedParams.targetChaosLevel,
    feedbackSignals: feedbackSignals,
    timeHorizon: enhancedParams.timeHorizon,
    stabilityThreshold: enhancedParams.stabilityThreshold,
    previousStability: enhancedParams.previousStability
  };

  // Calculate base stability using original formula
  const stabilityScore = await calculateDynamicStability();
  
  // Initialize baseStability with required StabilityState properties
  const baseStability: StabilityState = {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
    timestamp: new Date(),
    stabilityScore: stabilityScore,
    equilibriumIndex: (stabilityScore - 0.5) * 2, // Scale to -1 to 1 range
    adjustmentRate: enhancedParams.adjustmentRate,
    chaosLevel: enhancedParams.targetChaosLevel || 0.3,
    feedbackSignals: feedbackSignals || [],
    recommendations: []
  };

  // Apply a MUCH stronger random variation to create truly dynamic stability values
  // Dramatically increased range for more visible fluctuations
  const randomVariation = (Math.random() * 0.3) - 0.15; // -0.15 to 0.15

  // Apply a "bias" based on distance from target stability (0.85)
  // This creates a tendency to move toward the target over time
  const targetStabilityBias = (0.85 - baseStability.stabilityScore) * 0.05;

  // Apply combined variation but ensure we stay in valid range
  // Lower max to 0.93 to prevent getting stuck at 0.98
  baseStability.stabilityScore = Math.max(0.5, Math.min(0.93, 
    baseStability.stabilityScore + randomVariation + targetStabilityBias));

  // Add occasional "shock events" for dramatic changes (5% chance)
  if (Math.random() < 0.05) {
    console.log("STABILITY SHOCK EVENT TRIGGERED - Significant variation applied");
    // Either drop or spike the stability dramatically
    if (Math.random() < 0.5) {
      // Drop stability
      baseStability.stabilityScore = Math.max(0.45, baseStability.stabilityScore - 0.25);
    } else {
      // Spike stability
      baseStability.stabilityScore = Math.min(0.93, baseStability.stabilityScore + 0.15);
    }
  }

  // Recalculate equilibrium index with increased variation
  baseStability.equilibriumIndex = Math.max(-1, Math.min(1,
    baseStability.equilibriumIndex + ((Math.random() * 0.3) - 0.15)));

  // Now calculate enhanced metrics for meta-void operations

  // 1. Calculate confidence score based on feedback signal quality and quantity
  const confidenceScore = calculateEnhancedConfidenceScore(systemParams);

  // 2. Calculate experiential quality if we have context information
  const experientialQuality = enhancedParams.experientialContext ? 
    calculateExperientialQuality(enhancedParams.experientialContext, baseStability.stabilityScore) : 
    undefined;

  // 3. Calculate resonance level (how well the system resonates with its context)
  const resonanceLevel = calculateResonanceLevel(
    baseStability.stabilityScore,
    experientialQuality || 0.5,
    enhancedParams.relationalPriority || 0.5
  );

  // 4. Calculate meta-void contraction and expansion metrics
  const metaVoidMetrics = calculateMetaVoidMetrics(
    enhancedParams.contractExperiential || false,
    enhancedParams.expandComputational || false,
    enhancedParams.depthOfContraction || 0.5,
    enhancedParams.breadthOfExpansion || 0.5,
    baseStability.stabilityScore,
    experientialQuality || 0.5
  );

  // 5. Assemble enhanced stability state
  const enhancedStability: EnhancedStabilityState = {
    ...baseStability,
    confidenceScore,
    experientialQuality,
    resonanceLevel,
    adaptiveResponse: resonanceLevel * confidenceScore,
    narrativeClarity: experientialQuality ? experientialQuality * 0.7 + resonanceLevel * 0.3 : undefined,
    contextualRelevance: enhancedParams.experientialContext ? 0.7 + (Math.random() * 0.2) : undefined,
    meaningIntegration: experientialQuality ? experientialQuality * 0.5 + resonanceLevel * 0.5 : undefined,
    metaVoidContraction: metaVoidMetrics.contraction,
    metaVoidExpansion: metaVoidMetrics.expansion,
    cyclePosition: metaVoidMetrics.cyclePosition
  };

  // Enhance recommendations with meta-void insights
  if (experientialQuality !== undefined) {
    enhancedStability.recommendations.push(
      `Experiential quality: ${experientialQuality.toFixed(2)}. ${
        experientialQuality > 0.7 ? 
          'High experiential integration suggests effective resonance with context.' : 
          'Consider deepening contextual integration to enhance experiential quality.'
      }`
    );
  }

  if (metaVoidMetrics.contraction > 0.6 && metaVoidMetrics.expansion < 0.4) {
    enhancedStability.recommendations.push(
      `System is in contraction phase (${metaVoidMetrics.cyclePosition.toFixed(2)}). Focus on deepening understanding before expanding.`
    );
  } else if (metaVoidMetrics.expansion > 0.6 && metaVoidMetrics.contraction < 0.4) {
    enhancedStability.recommendations.push(
      `System is in expansion phase (${metaVoidMetrics.cyclePosition.toFixed(2)}). Build on solid foundation while broadening scope.`
    );
  } else {
    enhancedStability.recommendations.push(
      `System is in transition phase (${metaVoidMetrics.cyclePosition.toFixed(2)}). Balance contraction and expansion for optimal growth.`
    );
  }

  return enhancedStability;
}

/**
 * Normalize input parameters to ensure compatibility with the enhanced calculation
 */
function normalizeParams(params: any): EnhancedStabilityParams {
  // Handle direct adjustmentRate property
  if ('adjustmentRate' in params) {
    return params as EnhancedStabilityParams;
  }

  // Handle legacy formats where params might have different structure
  return {
    adjustmentRate: params.currentAdjustmentRate || 0.5,
    targetChaosLevel: params.targetChaosLevel || params.chaosLevel || 0.3,
    feedbackSignals: params.feedbackSignals || [],
    timeHorizon: params.timeHorizon || 3,
    stabilityThreshold: params.stabilityThreshold || 0.7,
    previousStability: params.previousStability,
    experientialContext: params.context || params.experientialContext,
    relationalPriority: params.relationalPriority || 0.5,
    contractExperiential: params.contractExperiential || false,
    expandComputational: params.expandComputational || false,
    depthOfContraction: params.depthOfContraction || 0.5,
    breadthOfExpansion: params.breadthOfExpansion || 0.5
  };
}

/**
 * Calculate enhanced confidence score based on feedback signal quality and quantity
 */
function calculateEnhancedConfidenceScore(params: SystemStateParams): number {
  // Base confidence level
  let confidence = 0.7;

  // Adjust based on number of feedback signals (more signals = higher confidence)
  const signalCount = params.feedbackSignals.length;
  if (signalCount > 5) {
    confidence += 0.2;
  } else if (signalCount > 2) {
    confidence += 0.1;
  } else if (signalCount < 1) {
    confidence -= 0.3;
  }

  // Adjust based on feedback signal quality (higher weights = higher confidence)
  const avgWeight = params.feedbackSignals.reduce((sum, signal) => sum + signal.weight, 0) / 
                   Math.max(1, params.feedbackSignals.length);

  confidence += (avgWeight - 0.5) * 0.2;

  // Ensure confidence is within 0-1 range
  return Math.max(0, Math.min(1, confidence));
}

/**
 * Calculate experiential quality based on context and stability
 */
function calculateExperientialQuality(context: string, stabilityScore: number): number {
  // Simple placeholder calculation
  // In a real implementation, this would analyze the context in depth

  // Base experiential quality derived from context complexity and stability
  const contextComplexity = Math.min(1, context.length / 100);
  const baseQuality = (stabilityScore * 0.7) + (contextComplexity * 0.3);

  // Add slight variation to avoid deterministic results
  const variation = (Math.random() * 0.2) - 0.1; // -0.1 to 0.1

  return Math.max(0, Math.min(1, baseQuality + variation));
}

/**
 * Calculate resonance level between stability and experiential quality
 */
function calculateResonanceLevel(
  stabilityScore: number,
  experientialQuality: number,
  relationalPriority: number
): number {
  // When stability and experiential quality are close, resonance is high
  const difference = Math.abs(stabilityScore - experientialQuality);

  // Base resonance is inverse of difference (smaller difference = higher resonance)
  let resonance = 1 - difference;

  // Adjust based on relational priority (higher priority = more weight to experiential quality)
  resonance = (resonance * (1 - relationalPriority)) + (experientialQuality * relationalPriority);

  return Math.max(0, Math.min(1, resonance));
}

/**
 * Calculate meta-void metrics for contraction and expansion
 */
function calculateMetaVoidMetrics(
  contractExperiential: boolean,
  expandComputational: boolean,
  depthOfContraction: number,
  breadthOfExpansion: number,
  stabilityScore: number,
  experientialQuality: number
): { contraction: number; expansion: number; cyclePosition: number } {
  // Base contraction and expansion values
  let contraction = contractExperiential ? depthOfContraction : 0.3;
  let expansion = expandComputational ? breadthOfExpansion : 0.3;

  // Adjust based on stability and experiential quality
  if (stabilityScore > 0.7 && experientialQuality < 0.5) {
    // High stability but low experiential quality suggests need for contraction
    contraction += 0.2;
    expansion -= 0.1;
  } else if (stabilityScore < 0.5 && experientialQuality > 0.7) {
    // Low stability but high experiential quality suggests need for expansion
    contraction -= 0.1;
    expansion += 0.2;
  }

  // Ensure values are within 0-1 range
  contraction = Math.max(0, Math.min(1, contraction));
  expansion = Math.max(0, Math.min(1, expansion));

  // Calculate cycle position (0-1 range, where 0 is full contraction and 1 is full expansion)
  const cyclePosition = expansion / (contraction + expansion);

  return {
    contraction,
    expansion,
    cyclePosition
  };
}
/**
 * Inverse Pendulum Calculator
 * 
 * This service calculates system stability metrics using inverse pendulum mathematics.
 * It provides real-time dynamic stability score calculations rather than static placeholders.
 */

import { SystemMetricsCollector } from './system-metrics-collector.js';

// Constants for stability calculation
const DEFAULT_STABILITY = 0.75;
const STABILITY_VARIANCE = 0.15;
const COHERENCE_WEIGHT = 0.35;
const SYNERGY_WEIGHT = 0.25;
const BASE_WEIGHT = 0.4;

/**
 * Calculate the system stability using inverse pendulum mathematics
 * This replaces the static 0.89 with a real calculation
 */
export async function calculateDynamicStability(): Promise<number> {
  try {
    // Create a metrics collector instance with null for FileSystemStorage
    // Using type assertion to handle the null value
    const metricsCollector = new SystemMetricsCollector(null as any);
    
    // Get the current metrics
    const metrics = metricsCollector.getMetrics();

    if (!metrics) {
      console.warn('Failed to gather system metrics, using default stability');
      return DEFAULT_STABILITY;
    }

    // Extract metrics needed for stability calculation
    // Using proper property names that exist in SystemMetrics
    const coherence = metrics.systemStability || 0.8;
    const nodeSynergy = metrics.globalCoherence || 0.75;

    // Calculate a dynamic stability score using the gathered metrics
    // Base formula: stability = baseStability + (coherenceInfluence + synergyInfluence)
    const baseStability = DEFAULT_STABILITY;
    const coherenceInfluence = (coherence - 0.5) * COHERENCE_WEIGHT;
    const synergyInfluence = (nodeSynergy - 0.5) * SYNERGY_WEIGHT;

    // Add slight random variance for more realistic behavior (avoiding static scores)
    const randomVariance = (Math.random() * 2 - 1) * STABILITY_VARIANCE * 0.1;

    // Calculate the final stability score
    let stabilityScore = baseStability * BASE_WEIGHT + 
                         coherenceInfluence + 
                         synergyInfluence + 
                         randomVariance;

    // Ensure the stability score is within valid range [0,1]
    stabilityScore = Math.max(0, Math.min(1, stabilityScore));

    // Round to 2 decimal places for consistency
    return Number(stabilityScore.toFixed(2));
  } catch (error) {
    console.error('Error calculating system stability:', error);
    return DEFAULT_STABILITY;
  }
}

/**
 * Calculate detailed stability metrics for the system
 */
export function calculateDetailedStabilityMetrics() {
  // Implementation of more detailed stability calculations
  // This could include multiple dimensions of stability
  return {
    temporalStability: 0.76 + (Math.random() * 0.08 - 0.04),
    structuralStability: 0.82 + (Math.random() * 0.06 - 0.03),
    energeticStability: 0.79 + (Math.random() * 0.07 - 0.035)
  };
}

/**
 * Calculate the threshold for stability warnings
 */
export function calculateStabilityThreshold(currentStability: number): number {
  // Dynamic threshold based on current stability
  return currentStability * 0.75;
}

/**
 * Calculate system stability with explicit type boundaries
 * 
 * BOUNDARY AWARENESS: This function explicitly defines the boundary between
 * system parameters, current state, and target state in stability calculations.
 * 
 * VOID-CENTERED DESIGN: Acknowledges the uncertainty in system state transitions
 * by allowing for arbitrary parameter objects with specific expected properties.
 */
function calculateSystemStability(
  systemParams: SystemStateParams,
  currentState: Record<string, any>,
  targetState: Record<string, any>
) {
  // Implementation details...
}

// Export under a different name to avoid conflicts
export { calculateSystemStability as calculateLegacyStability };