/**
 * Stability Convergence Tracker
 * 
 * This module implements the StabilityConvergence(t) validation mechanism for the
 * Inverse Pendulum Formula, allowing us to track, measure, and prove that the stability
 * calculations are actively learning and improving over time.
 * 
 * Core logic:
 * StabilityConvergence(t) = lim(n→∞) [|Stability(t) - Stability(t-n)|] → 0
 * 
 * This tracks how the stability state converges toward an optimal equilibrium over time,
 * proving that the system is continuously improving its stability calculations based on
 * feedback and historical performance.
 */

import { v4 as uuidv4 } from 'uuid';
import { recordInversePendulumOperation } from './meta-learning-validation.js';
import { StabilityState } from './inverse-pendulum-calculator.js';

/**
 * Stability convergence data point
 */
export interface StabilityConvergenceDataPoint {
  id: string;
  timestamp: Date;
  stabilityScore: number;
  equilibriumIndex: number; // -1 to 1 (negative = too rigid, positive = too chaotic)
  adjustmentRate: number;
  chaosLevel: number;
  targetStability: number;
  stabilityGap: number; // |targetStability - stabilityScore|
  convergenceRate: number | null; // Rate of convergence since previous point
  energyExpenditure: number; // Computational resources used
  timeToStability: number; // Time taken to reach stability in ms
  userFeedback?: number; // 1-10 scale
}

/**
 * Stability convergence result
 */
export interface StabilityConvergenceResult {
  id: string;
  timestamp: Date;
  overallConvergence: number; // 0-1 scale (1 = perfect convergence)
  recentTrend: 'improving' | 'stable' | 'declining';
  asymptoteDistance: number; // Distance from theoretical perfect stability
  oscillationDamping: number; // How quickly oscillations are dampened
  energyEfficiency: number; // Stability achieved per unit of energy
  timeEfficiency: number; // Stability achieved per unit of time
  adaptiveCapacity: {
    adjustmentRateAdaptation: number; // How well adjustment rate adapts to conditions
    chaosLevelTuning: number; // How well chaos level is tuned
    stateHistoryUtilization: number; // How effectively previous states are utilized
  };
  isStatisticallySignificant: boolean;
  recommendations: string[];
}

// In-memory storage of stability convergence data (would be database in production)
const stabilityConvergenceHistory: StabilityConvergenceDataPoint[] = [];

/**
 * Record a stability calculation for convergence tracking
 * 
 * @param stabilityState Current stability state
 * @param targetStability Target stability score
 * @param energyExpenditure Computational resources used
 * @param timeToStability Time taken to reach stability in ms
 * @param userFeedback Optional user feedback (1-10)
 * @returns Recorded convergence data point
 */
export function recordStabilityCalculation(
  stabilityState: StabilityState,
  targetStability: number,
  energyExpenditure: number,
  timeToStability: number,
  userFeedback?: number
): StabilityConvergenceDataPoint {
  const previousPoints = [...stabilityConvergenceHistory].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  const stabilityGap = Math.abs(targetStability - stabilityState.stabilityScore);
  
  let convergenceRate: number | null = null;
  if (previousPoints.length > 0) {
    const previousGap = previousPoints[0].stabilityGap;
    convergenceRate = previousGap > 0 ? (previousGap - stabilityGap) / previousGap : 0;
  }
  
  const dataPoint: StabilityConvergenceDataPoint = {
    id: uuidv4(),
    timestamp: new Date(),
    stabilityScore: stabilityState.stabilityScore,
    equilibriumIndex: stabilityState.equilibriumIndex,
    adjustmentRate: stabilityState.adjustmentRate,
    chaosLevel: stabilityState.chaosLevel,
    targetStability,
    stabilityGap,
    convergenceRate,
    energyExpenditure,
    timeToStability,
    userFeedback
  };
  
  // Store in history
  stabilityConvergenceHistory.push(dataPoint);
  
  // Record in meta-learning framework for broader analysis with enhanced metrics
  recordInversePendulumOperation(
    { 
      targetStability,
      adjustmentRate: stabilityState.adjustmentRate,
      targetChaosLevel: stabilityState.chaosLevel,
      feedbackSignals: stabilityState.feedbackSignals,
      previousStability: stabilityState.stabilityScore
    },
    {
      ...stabilityState,
      microcorrections: Math.ceil(stabilityState.adjustmentRate * 10), // Estimate based on adjustment rate
      feedbackIntegration: calculateFeedbackIntegration(stabilityState.feedbackSignals),
      macroBalance: calculateMacroBalance(stabilityState),
      energyExpenditure,
      timeToStability
    },
    {
      executionTime: timeToStability,
      accuracy: 1 - stabilityGap, // Using inverse of gap as a proxy for accuracy
      resourceUtilization: {
        cpu: energyExpenditure * 0.7, // Estimate CPU usage from energy expenditure
        memory: energyExpenditure * 0.3 // Estimate memory usage from energy expenditure
      },
      systemFeedback: stabilityState.stabilityScore * 10, // Scale to 0-10 range
      userFeedback
    }
  );
  
  return dataPoint;
}

/**
 * Calculate stability convergence metrics
 * 
 * @param timeWindow Optional time window in milliseconds (default: 7 days)
 * @returns Stability convergence result
 */
export function calculateStabilityConvergence(
  timeWindow: number = 7 * 24 * 60 * 60 * 1000
): StabilityConvergenceResult {
  const currentTime = new Date().getTime();
  
  // Filter for relevant history within time window
  const relevantHistory = stabilityConvergenceHistory.filter(
    point => (currentTime - point.timestamp.getTime()) <= timeWindow
  );
  
  if (relevantHistory.length < 3) {
    return createDefaultConvergenceResult('Insufficient data points for convergence analysis');
  }
  
  // Sort by timestamp (oldest first)
  relevantHistory.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  // Calculate overall convergence
  const initialGap = relevantHistory[0].stabilityGap;
  const finalGap = relevantHistory[relevantHistory.length - 1].stabilityGap;
  const absoluteImprovement = initialGap - finalGap;
  
  // Scale to 0-1, where 1 means perfect convergence (gap reduced to 0)
  const overallConvergence = initialGap > 0 ? 
    Math.min(1, Math.max(0, absoluteImprovement / initialGap)) : 
    finalGap === 0 ? 1 : 0;
  
  // Calculate recent trend (last 1/3 of the data)
  const recentStartIndex = Math.floor(relevantHistory.length * 2/3);
  const recentPoints = relevantHistory.slice(recentStartIndex);
  
  if (recentPoints.length < 2) {
    return createDefaultConvergenceResult('Insufficient recent data points for trend analysis');
  }
  
  const recentInitialGap = recentPoints[0].stabilityGap;
  const recentFinalGap = recentPoints[recentPoints.length - 1].stabilityGap;
  const recentImprovement = recentInitialGap - recentFinalGap;
  
  const recentTrend: StabilityConvergenceResult['recentTrend'] = 
    recentImprovement > 0.01 ? 'improving' :
    recentImprovement < -0.01 ? 'declining' : 'stable';
  
  // Calculate asymptote distance (distance from theoretical perfect stability)
  const asymptoteDistance = finalGap;
  
  // Calculate oscillation damping
  const oscillationDamping = calculateOscillationDamping(relevantHistory);
  
  // Calculate energy and time efficiency
  const energyEfficiency = calculateEnergyEfficiency(relevantHistory);
  const timeEfficiency = calculateTimeEfficiency(relevantHistory);
  
  // Calculate adaptive capacity
  const adaptiveCapacity = {
    adjustmentRateAdaptation: calculateAdjustmentRateAdaptation(relevantHistory),
    chaosLevelTuning: calculateChaosLevelTuning(relevantHistory),
    stateHistoryUtilization: 0.7 // Default placeholder
  };
  
  // Calculate statistical significance
  const isStatisticallySignificant = calculateStatisticalSignificance(relevantHistory);
  
  // Generate recommendations
  const recommendations = generateRecommendations(
    overallConvergence,
    recentTrend,
    asymptoteDistance,
    oscillationDamping,
    adaptiveCapacity
  );
  
  // Return convergence result
  return {
    id: uuidv4(),
    timestamp: new Date(),
    overallConvergence,
    recentTrend,
    asymptoteDistance,
    oscillationDamping,
    energyEfficiency,
    timeEfficiency,
    adaptiveCapacity,
    isStatisticallySignificant,
    recommendations
  };
}

/**
 * Calculate oscillation damping
 */
function calculateOscillationDamping(
  history: StabilityConvergenceDataPoint[]
): number {
  if (history.length < 4) {
    return 0.5; // Default moderate damping
  }
  
  // Calculate stability score oscillations
  const oscillations: number[] = [];
  
  for (let i = 1; i < history.length; i++) {
    oscillations.push(Math.abs(history[i].stabilityScore - history[i-1].stabilityScore));
  }
  
  if (oscillations.length < 3) {
    return 0.5;
  }
  
  // Split into first half and second half
  const midpoint = Math.floor(oscillations.length / 2);
  const firstHalf = oscillations.slice(0, midpoint);
  const secondHalf = oscillations.slice(midpoint);
  
  // Calculate average oscillation amplitude for each half
  const firstHalfAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  // If second half has lower amplitude, system is damping oscillations
  if (firstHalfAvg === 0) {
    return secondHalfAvg === 0 ? 1 : 0.5;
  }
  
  // Calculate damping ratio (0 = no damping, 1 = perfect damping)
  const dampingRatio = Math.max(0, Math.min(1, 1 - (secondHalfAvg / firstHalfAvg)));
  
  return dampingRatio;
}

/**
 * Calculate energy efficiency
 */
function calculateEnergyEfficiency(
  history: StabilityConvergenceDataPoint[]
): number {
  if (history.length < 2) {
    return 0.5; // Default moderate efficiency
  }
  
  // Compare first and last points
  const firstPoint = history[0];
  const lastPoint = history[history.length - 1];
  
  const stabilityImprovement = Math.max(0, firstPoint.stabilityGap - lastPoint.stabilityGap);
  const energyExpended = history.reduce((sum, point) => sum + point.energyExpenditure, 0);
  
  if (energyExpended === 0) {
    return 0.5; // Default if no energy data
  }
  
  // Efficiency is improvement per unit of energy
  const rawEfficiency = stabilityImprovement / energyExpended;
  
  // Normalize to 0-1 scale (assuming reasonable maximum efficiency)
  const normalizedEfficiency = Math.min(1, rawEfficiency * 10);
  
  return normalizedEfficiency;
}

/**
 * Calculate time efficiency
 */
function calculateTimeEfficiency(
  history: StabilityConvergenceDataPoint[]
): number {
  if (history.length < 2) {
    return 0.5; // Default moderate efficiency
  }
  
  // Compare first and last points
  const firstPoint = history[0];
  const lastPoint = history[history.length - 1];
  
  const stabilityImprovement = Math.max(0, firstPoint.stabilityGap - lastPoint.stabilityGap);
  const timeExpended = history.reduce((sum, point) => sum + point.timeToStability, 0);
  
  if (timeExpended === 0) {
    return 0.5; // Default if no time data
  }
  
  // Efficiency is improvement per unit of time
  const rawEfficiency = stabilityImprovement / timeExpended;
  
  // Normalize to 0-1 scale (assuming reasonable maximum efficiency)
  const normalizedEfficiency = Math.min(1, rawEfficiency * 1000); // Scaling factor for milliseconds
  
  return normalizedEfficiency;
}

/**
 * Calculate adjustment rate adaptation
 */
function calculateAdjustmentRateAdaptation(
  history: StabilityConvergenceDataPoint[]
): number {
  if (history.length < 3) {
    return 0.5; // Default moderate adaptation
  }
  
  let appropriateAdjustments = 0;
  
  for (let i = 1; i < history.length; i++) {
    const currentPoint = history[i];
    const previousPoint = history[i-1];
    
    // Check if stability gap increased or decreased
    const gapIncreased = currentPoint.stabilityGap > previousPoint.stabilityGap;
    
    // Check if adjustment rate changed
    const adjustmentRateIncreased = currentPoint.adjustmentRate > previousPoint.adjustmentRate;
    
    // Appropriate adaptation:
    // 1. If gap increased, adjustment rate should increase (more aggressive correction)
    // 2. If gap decreased, adjustment rate should decrease (more cautious, don't overshoot)
    const isAppropriate = (gapIncreased && adjustmentRateIncreased) || 
                         (!gapIncreased && !adjustmentRateIncreased);
    
    if (isAppropriate) {
      appropriateAdjustments++;
    }
  }
  
  // Calculate adaptation score (0-1)
  return appropriateAdjustments / (history.length - 1);
}

/**
 * Calculate chaos level tuning
 */
function calculateChaosLevelTuning(
  history: StabilityConvergenceDataPoint[]
): number {
  if (history.length < 3) {
    return 0.5; // Default moderate tuning
  }
  
  let appropriateTunings = 0;
  
  for (let i = 1; i < history.length; i++) {
    const currentPoint = history[i];
    const previousPoint = history[i-1];
    
    // Check if stability score is too low (system too rigid)
    const tooRigid = previousPoint.equilibriumIndex < -0.3;
    
    // Check if stability score is too high (system too chaotic)
    const tooChaotic = previousPoint.equilibriumIndex > 0.3;
    
    // Check if chaos level changed
    const chaosLevelIncreased = currentPoint.chaosLevel > previousPoint.chaosLevel;
    
    // Appropriate tuning:
    // 1. If too rigid, chaos level should increase
    // 2. If too chaotic, chaos level should decrease
    // 3. If balanced, chaos level should remain similar
    const isAppropriate = (tooRigid && chaosLevelIncreased) || 
                         (tooChaotic && !chaosLevelIncreased) ||
                         (!tooRigid && !tooChaotic && Math.abs(currentPoint.chaosLevel - previousPoint.chaosLevel) < 0.1);
    
    if (isAppropriate) {
      appropriateTunings++;
    }
  }
  
  // Calculate tuning score (0-1)
  return appropriateTunings / (history.length - 1);
}

/**
 * Calculate statistical significance
 */
function calculateStatisticalSignificance(
  history: StabilityConvergenceDataPoint[]
): boolean {
  if (history.length < 5) {
    return false; // Not enough data
  }
  
  // Extract stability gaps
  const stabilityGaps = history.map(point => point.stabilityGap);
  
  // Split into first half and second half
  const midpoint = Math.floor(stabilityGaps.length / 2);
  const firstHalf = stabilityGaps.slice(0, midpoint);
  const secondHalf = stabilityGaps.slice(midpoint);
  
  // Calculate means
  const firstHalfMean = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondHalfMean = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  // Calculate variances
  const firstHalfVariance = firstHalf.reduce((sum, val) => sum + Math.pow(val - firstHalfMean, 2), 0) / firstHalf.length;
  const secondHalfVariance = secondHalf.reduce((sum, val) => sum + Math.pow(val - secondHalfMean, 2), 0) / secondHalf.length;
  
  // Calculate standard errors
  const firstHalfStdError = Math.sqrt(firstHalfVariance / firstHalf.length);
  const secondHalfStdError = Math.sqrt(secondHalfVariance / secondHalf.length);
  
  // Calculate t-statistic
  const tStatistic = (firstHalfMean - secondHalfMean) / 
                    Math.sqrt(Math.pow(firstHalfStdError, 2) + Math.pow(secondHalfStdError, 2));
  
  // Calculate degrees of freedom (approximate)
  const df = firstHalf.length + secondHalf.length - 2;
  
  // Critical t-value for 95% confidence with the calculated df
  const criticalT = 1.96; // Approximate for df > 30
  
  // Compare absolute t-statistic with critical value
  return Math.abs(tStatistic) > criticalT;
}

/**
 * Generate recommendations based on convergence analysis
 */
function generateRecommendations(
  overallConvergence: number,
  recentTrend: StabilityConvergenceResult['recentTrend'],
  asymptoteDistance: number,
  oscillationDamping: number,
  adaptiveCapacity: StabilityConvergenceResult['adaptiveCapacity']
): string[] {
  const recommendations: string[] = [];
  
  // Overall convergence recommendations
  if (overallConvergence < 0.3) {
    recommendations.push('Significantly increase adjustment rate to accelerate convergence');
  } else if (overallConvergence < 0.7) {
    recommendations.push('Moderately increase adjustment rate to improve convergence');
  }
  
  // Recent trend recommendations
  if (recentTrend === 'declining') {
    recommendations.push('Recent negative trend detected - reset to last stable configuration');
  } else if (recentTrend === 'stable' && asymptoteDistance > 0.1) {
    recommendations.push('Convergence has plateaued - introduce controlled perturbation to escape local minimum');
  }
  
  // Asymptote distance recommendations
  if (asymptoteDistance > 0.2) {
    recommendations.push(`System remains ${(asymptoteDistance * 100).toFixed(1)}% from perfect stability - refine feedback signal processing`);
  }
  
  // Oscillation damping recommendations
  if (oscillationDamping < 0.5) {
    recommendations.push('Poor oscillation damping detected - decrease adjustment rate to prevent overcorrection');
  }
  
  // Adaptive capacity recommendations
  if (adaptiveCapacity.adjustmentRateAdaptation < 0.5) {
    recommendations.push('Adjustment rate adaptation is suboptimal - implement more responsive adjustment algorithm');
  }
  
  if (adaptiveCapacity.chaosLevelTuning < 0.5) {
    recommendations.push('Chaos level tuning is ineffective - implement more precise chaos control mechanism');
  }
  
  // Ensure we have at least one recommendation
  if (recommendations.length === 0) {
    recommendations.push('Current convergence path is optimal - continue collecting data to refine stability');
  }
  
  return recommendations;
}

/**
 * Create a default convergence result when insufficient data is available
 */
function createDefaultConvergenceResult(
  reason: string
): StabilityConvergenceResult {
  return {
    id: uuidv4(),
    timestamp: new Date(),
    overallConvergence: 0,
    recentTrend: 'stable',
    asymptoteDistance: 1,
    oscillationDamping: 0.5,
    energyEfficiency: 0.5,
    timeEfficiency: 0.5,
    adaptiveCapacity: {
      adjustmentRateAdaptation: 0.5,
      chaosLevelTuning: 0.5,
      stateHistoryUtilization: 0.5
    },
    isStatisticallySignificant: false,
    recommendations: [
      reason,
      'Collect at least 3 data points to enable stability convergence analysis'
    ]
  };
}

/**
 * Get stability convergence history
 * 
 * @returns Stability convergence history data points
 */
export function getStabilityConvergenceHistory(): StabilityConvergenceDataPoint[] {
  return [...stabilityConvergenceHistory];
}

/**
 * Clear stability convergence history (for testing purposes)
 */
export function clearStabilityConvergenceHistory(): void {
  stabilityConvergenceHistory.length = 0;
}

/**
 * Calculate feedback integration score based on feedback signals
 * Measures how well feedback signals are integrated into the system
 * @param feedbackSignals Array of feedback signals
 * @returns Feedback integration score (0-1)
 */
function calculateFeedbackIntegration(feedbackSignals: any[]): number {
  if (!feedbackSignals || feedbackSignals.length === 0) {
    return 0.5; // Default value when no signals
  }
  
  // Calculate average weight of feedback signals
  const totalWeight = feedbackSignals.reduce((sum, signal) => sum + (signal.weight || 0.5), 0);
  const avgWeight = totalWeight / feedbackSignals.length;
  
  // Calculate diversity of signal types
  const signalTypes = new Set(feedbackSignals.map(signal => signal.signalType));
  const typeDiversity = Math.min(1, signalTypes.size / 4); // Normalize to 0-1 (4 types is considered diverse)
  
  // Calculate recency factor - more weight to recent signals
  const sortedSignals = [...feedbackSignals].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  let recencyWeight = 0;
  for (let i = 0; i < sortedSignals.length; i++) {
    const position = i / sortedSignals.length; // 0 for most recent, 1 for oldest
    recencyWeight += (1 - position) * (sortedSignals[i].weight || 0.5);
  }
  const recencyFactor = sortedSignals.length > 0 ? recencyWeight / sortedSignals.length : 0.5;
  
  // Combine factors with weights
  return (avgWeight * 0.3) + (typeDiversity * 0.3) + (recencyFactor * 0.4);
}

/**
 * Calculate macro balance based on stability state
 * Measures the overall system balance
 * @param stabilityState The stability state
 * @returns Macro balance score (0-1)
 */
function calculateMacroBalance(stabilityState: any): number {
  // Extract key metrics from stability state
  const stabilityScore = stabilityState.stabilityScore || 0.5;
  const equilibriumIndex = stabilityState.equilibriumIndex || 0;
  const chaosLevel = stabilityState.chaosLevel || 0.3;
  
  // Calculate equilibrium factor (closer to 0 is better)
  const equilibriumFactor = 1 - Math.min(1, Math.abs(equilibriumIndex) * 2);
  
  // Calculate chaos balance (optimal is around 0.3-0.4)
  const optimalChaos = 0.35;
  const chaosBalance = 1 - Math.min(1, Math.abs(chaosLevel - optimalChaos) * 3);
  
  // Calculate stability factor (higher is better, but too high might indicate rigidity)
  const stabilityFactor = stabilityScore > 0.8 
    ? 1 - ((stabilityScore - 0.8) * 2) // Penalize for being too rigid
    : stabilityScore;
  
  // Combine factors with weights
  return (equilibriumFactor * 0.4) + (chaosBalance * 0.3) + (stabilityFactor * 0.3);
}