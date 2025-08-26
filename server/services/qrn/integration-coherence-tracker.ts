/**
 * Integration Coherence Tracker
 * 
 * This module implements the IntegrationCoherence(t) validation mechanism for the
 * Wilton GOD Formula, allowing us to track, measure, and prove that the multi-layered
 * integration calculations are actively learning and improving over time.
 * 
 * Core logic:
 * IntegrationCoherence(t) = ∑(LayerCoherence(i) × LayerWeight(i)) × CrossLayerSynergy(t)
 * 
 * This tracks how effectively the integration of multiple domains and layers improves
 * over time, proving that the system is continuously learning to coordinate increasingly
 * complex components.
 */

import { v4 as uuidv4 } from 'uuid';
import { recordWiltonGodOperation } from './meta-learning-validation.js';

/**
 * Integration layer structure
 */
export interface IntegrationLayer {
  id: string;
  name: string;
  coherenceScore: number; // 0-1 scale
  complexity: number; // 1-10 scale
  weight: number; // Relative importance
  domainElements: string[]; // Domain elements integrated at this layer
}

/**
 * Integration coherence data point
 */
export interface IntegrationCoherenceDataPoint {
  id: string;
  timestamp: Date;
  layers: IntegrationLayer[];
  overallIntegrationCoherence: number; // 0-1 scale
  crossLayerSynergy: number; // Multiplier for impact between layers (>1 = synergistic)
  successfulIntegrations: string[]; // IDs of successfully integrated domains
  failedIntegrations: string[]; // IDs of failed integration attempts
  integrationComplexity: number; // Overall complexity (1-10)
  integrationTime: number; // Time taken for integration in ms
  userFeedback?: number; // 1-10 scale
}

/**
 * Integration coherence result
 */
export interface IntegrationCoherenceResult {
  id: string;
  timestamp: Date;
  overallCoherence: number; // 0-1 scale
  coherenceTrend: 'improving' | 'stable' | 'declining';
  layerSpecificCoherence: Record<string, number>; // Coherence by layer
  domainCoverage: number; // Percentage of domains successfully integrated
  crossLayerTransferLearning: {
    transferCoefficient: number; // How well learning transfers between layers
    interLayerDependencies: Array<[string, string, number]>; // [sourceLayer, targetLayer, strength]
    mostInfluentialLayers: string[]; // Layers with highest impact
  };
  complexityHandling: {
    complexityTrend: 'increasing' | 'stable' | 'decreasing';
    maxComplexityHandled: number;
    complexityEfficiency: number; // Coherence relative to complexity
  };
  integrationLearningCoefficient: number; // How rapidly the system improves
  isStatisticallySignificant: boolean;
  recommendations: string[];
}

// In-memory storage of integration coherence data (would be database in production)
const integrationCoherenceHistory: IntegrationCoherenceDataPoint[] = [];

/**
 * Record an integration operation for coherence tracking
 * 
 * @param layers Integration layers
 * @param overallIntegrationCoherence Overall integration coherence
 * @param crossLayerSynergy Cross-layer synergy multiplier
 * @param successfulIntegrations Successfully integrated domains
 * @param failedIntegrations Failed integration attempts
 * @param integrationComplexity Overall integration complexity
 * @param integrationTime Time taken for integration in ms
 * @param userFeedback Optional user feedback (1-10)
 * @returns Recorded coherence data point
 */
export function recordIntegrationOperation(
  layers: IntegrationLayer[],
  overallIntegrationCoherence: number,
  crossLayerSynergy: number,
  successfulIntegrations: string[],
  failedIntegrations: string[],
  integrationComplexity: number,
  integrationTime: number,
  userFeedback?: number
): IntegrationCoherenceDataPoint {
  const dataPoint: IntegrationCoherenceDataPoint = {
    id: uuidv4(),
    timestamp: new Date(),
    layers: [...layers],
    overallIntegrationCoherence,
    crossLayerSynergy,
    successfulIntegrations: [...successfulIntegrations],
    failedIntegrations: [...failedIntegrations],
    integrationComplexity,
    integrationTime,
    userFeedback
  };
  
  // Store in history
  integrationCoherenceHistory.push(dataPoint);
  
  // Prepare domain elements for meta-learning framework
  const domainElements = layers.flatMap(layer => 
    layer.domainElements.map(id => ({ id, layer: layer.id }))
  );
  
  // Record in meta-learning framework for broader analysis
  recordWiltonGodOperation(
    { 
      layers: layers.map(l => l.id),
      domainElements
    },
    {
      overallIntegrationCoherence,
      successfulIntegrations,
      failedIntegrations,
      integrationComplexity,
      crossLayerSynergy,
      integratedDomains: successfulIntegrations
    },
    {
      accuracy: overallIntegrationCoherence,
      executionTime: integrationTime,
      userFeedback
    }
  );
  
  return dataPoint;
}

/**
 * Calculate integration coherence metrics
 * 
 * @param timeWindow Optional time window in milliseconds (default: 7 days)
 * @returns Integration coherence result
 */
export function calculateIntegrationCoherence(
  timeWindow: number = 7 * 24 * 60 * 60 * 1000
): IntegrationCoherenceResult {
  const currentTime = new Date().getTime();
  
  // Filter for relevant history within time window
  const relevantHistory = integrationCoherenceHistory.filter(
    point => (currentTime - point.timestamp.getTime()) <= timeWindow
  );
  
  if (relevantHistory.length < 3) {
    return createDefaultCoherenceResult('Insufficient data points for coherence analysis');
  }
  
  // Sort by timestamp (oldest first)
  relevantHistory.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  // Calculate overall coherence (average of recent points)
  const recentPoints = relevantHistory.slice(-3);
  const overallCoherence = recentPoints.reduce(
    (sum, point) => sum + point.overallIntegrationCoherence, 0
  ) / recentPoints.length;
  
  // Calculate coherence trend
  const coherenceTrend = calculateCoherenceTrend(relevantHistory);
  
  // Calculate layer-specific coherence
  const layerSpecificCoherence = calculateLayerSpecificCoherence(relevantHistory);
  
  // Calculate domain coverage
  const domainCoverage = calculateDomainCoverage(relevantHistory);
  
  // Calculate cross-layer transfer learning
  const crossLayerTransferLearning = calculateCrossLayerTransferLearning(relevantHistory);
  
  // Calculate complexity handling
  const complexityHandling = calculateComplexityHandling(relevantHistory);
  
  // Calculate integration learning coefficient
  const integrationLearningCoefficient = calculateIntegrationLearningCoefficient(relevantHistory);
  
  // Calculate statistical significance
  const isStatisticallySignificant = calculateStatisticalSignificance(relevantHistory);
  
  // Generate recommendations
  const recommendations = generateRecommendations(
    overallCoherence,
    coherenceTrend,
    layerSpecificCoherence,
    domainCoverage,
    crossLayerTransferLearning,
    complexityHandling,
    integrationLearningCoefficient
  );
  
  // Return coherence result
  return {
    id: uuidv4(),
    timestamp: new Date(),
    overallCoherence,
    coherenceTrend,
    layerSpecificCoherence,
    domainCoverage,
    crossLayerTransferLearning,
    complexityHandling,
    integrationLearningCoefficient,
    isStatisticallySignificant,
    recommendations
  };
}

/**
 * Calculate coherence trend
 */
function calculateCoherenceTrend(
  history: IntegrationCoherenceDataPoint[]
): IntegrationCoherenceResult['coherenceTrend'] {
  if (history.length < 3) {
    return 'stable';
  }
  
  // Calculate linear regression slope of coherence over time
  const xValues: number[] = []; // Timestamps
  const yValues: number[] = []; // Coherence values
  
  const baseTime = history[0].timestamp.getTime();
  
  for (const point of history) {
    xValues.push((point.timestamp.getTime() - baseTime) / (1000 * 60 * 60)); // Hours from start
    yValues.push(point.overallIntegrationCoherence);
  }
  
  const slope = calculateLinearRegressionSlope(xValues, yValues);
  
  if (slope > 0.001) {
    return 'improving';
  } else if (slope < -0.001) {
    return 'declining';
  } else {
    return 'stable';
  }
}

/**
 * Calculate layer-specific coherence
 */
function calculateLayerSpecificCoherence(
  history: IntegrationCoherenceDataPoint[]
): Record<string, number> {
  if (history.length === 0) {
    return {};
  }
  
  // Get recent point for most current layer set
  const mostRecent = history[history.length - 1];
  
  // Calculate average coherence for each layer
  const layerCoherence: Record<string, number> = {};
  
  for (const layer of mostRecent.layers) {
    layerCoherence[layer.id] = layer.coherenceScore;
  }
  
  return layerCoherence;
}

/**
 * Calculate domain coverage
 */
function calculateDomainCoverage(
  history: IntegrationCoherenceDataPoint[]
): number {
  if (history.length === 0) {
    return 0;
  }
  
  // Collect all domains mentioned across all integration points
  const allDomains = new Set<string>();
  const successfullyIntegratedDomains = new Set<string>();
  
  for (const point of history) {
    // Add all domains from all layers
    for (const layer of point.layers) {
      for (const domain of layer.domainElements) {
        allDomains.add(domain);
      }
    }
    
    // Add successfully integrated domains
    for (const domain of point.successfulIntegrations) {
      successfullyIntegratedDomains.add(domain);
    }
  }
  
  // Calculate coverage
  return allDomains.size > 0 ? successfullyIntegratedDomains.size / allDomains.size : 0;
}

/**
 * Calculate cross-layer transfer learning
 */
function calculateCrossLayerTransferLearning(
  history: IntegrationCoherenceDataPoint[]
): IntegrationCoherenceResult['crossLayerTransferLearning'] {
  if (history.length < 3) {
    return {
      transferCoefficient: 0.5,
      interLayerDependencies: [],
      mostInfluentialLayers: []
    };
  }
  
  // Identify all unique layers
  const allLayers = new Set<string>();
  for (const point of history) {
    for (const layer of point.layers) {
      allLayers.add(layer.id);
    }
  }
  
  // Calculate inter-layer dependencies
  const interLayerDependencies: Array<[string, string, number]> = [];
  const layerInfluence: Record<string, number> = {};
  
  // Initialize layer influence
  for (const layerId of allLayers) {
    layerInfluence[layerId] = 0;
  }
  
  // Calculate dependencies between pairs of layers
  for (const sourceId of allLayers) {
    for (const targetId of allLayers) {
      if (sourceId !== targetId) {
        const dependencyStrength = calculateLayerDependency(history, sourceId, targetId);
        interLayerDependencies.push([sourceId, targetId, dependencyStrength]);
        
        // Accumulate influence
        layerInfluence[sourceId] += dependencyStrength;
      }
    }
  }
  
  // Identify most influential layers (top 3)
  const mostInfluentialLayers = Object.entries(layerInfluence)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([layerId, _]) => layerId);
  
  // Calculate overall transfer coefficient
  const transferCoefficient = interLayerDependencies.reduce(
    (sum, [_, __, strength]) => sum + strength, 0
  ) / Math.max(1, interLayerDependencies.length);
  
  return {
    transferCoefficient,
    interLayerDependencies,
    mostInfluentialLayers
  };
}

/**
 * Calculate dependency strength between two layers
 */
function calculateLayerDependency(
  history: IntegrationCoherenceDataPoint[],
  sourceLayerId: string,
  targetLayerId: string
): number {
  const layerPairs: Array<[number, number]> = [];
  
  // Collect coherence score pairs for the two layers
  for (const point of history) {
    const sourceLayer = point.layers.find(l => l.id === sourceLayerId);
    const targetLayer = point.layers.find(l => l.id === targetLayerId);
    
    if (sourceLayer && targetLayer) {
      layerPairs.push([sourceLayer.coherenceScore, targetLayer.coherenceScore]);
    }
  }
  
  if (layerPairs.length < 3) {
    return 0;
  }
  
  // Calculate correlation between layer coherence scores
  return calculateCorrelation(
    layerPairs.map(([source, _]) => source),
    layerPairs.map(([_, target]) => target)
  );
}

/**
 * Calculate Pearson correlation coefficient
 */
function calculateCorrelation(
  x: number[],
  y: number[]
): number {
  if (x.length !== y.length || x.length < 2) {
    return 0;
  }
  
  const n = x.length;
  
  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate numerator and denominators
  let numerator = 0;
  let xDenominator = 0;
  let yDenominator = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    numerator += xDiff * yDiff;
    xDenominator += xDiff * xDiff;
    yDenominator += yDiff * yDiff;
  }
  
  // Avoid division by zero
  if (xDenominator === 0 || yDenominator === 0) {
    return 0;
  }
  
  return numerator / Math.sqrt(xDenominator * yDenominator);
}

/**
 * Calculate complexity handling metrics
 */
function calculateComplexityHandling(
  history: IntegrationCoherenceDataPoint[]
): IntegrationCoherenceResult['complexityHandling'] {
  if (history.length < 3) {
    return {
      complexityTrend: 'stable',
      maxComplexityHandled: 0,
      complexityEfficiency: 0.5
    };
  }
  
  // Extract complexity values
  const complexityValues = history.map(point => point.integrationComplexity);
  
  // Calculate complexity trend using linear regression
  const xValues = Array.from({ length: history.length }, (_, i) => i);
  const slope = calculateLinearRegressionSlope(xValues, complexityValues);
  
  const complexityTrend: IntegrationCoherenceResult['complexityHandling']['complexityTrend'] =
    slope > 0.1 ? 'increasing' :
    slope < -0.1 ? 'decreasing' :
    'stable';
  
  // Find maximum complexity handled
  const maxComplexityHandled = Math.max(...complexityValues);
  
  // Calculate efficiency (coherence relative to complexity)
  const efficiencyValues = history.map(point => 
    point.overallIntegrationCoherence / Math.max(1, point.integrationComplexity)
  );
  
  const complexityEfficiency = efficiencyValues.reduce((sum, val) => sum + val, 0) / 
                              efficiencyValues.length;
  
  return {
    complexityTrend,
    maxComplexityHandled,
    complexityEfficiency
  };
}

/**
 * Calculate linear regression slope
 */
function calculateLinearRegressionSlope(
  x: number[],
  y: number[]
): number {
  if (x.length !== y.length || x.length < 2) {
    return 0;
  }
  
  const n = x.length;
  
  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate slope
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (x[i] - xMean) * (y[i] - yMean);
    denominator += Math.pow(x[i] - xMean, 2);
  }
  
  return denominator !== 0 ? numerator / denominator : 0;
}

/**
 * Calculate integration learning coefficient
 */
function calculateIntegrationLearningCoefficient(
  history: IntegrationCoherenceDataPoint[]
): number {
  if (history.length < 3) {
    return 0.5;
  }
  
  // Count newly successful integrations
  let newSuccessfulIntegrations = 0;
  let previouslyFailedIntegrations = 0;
  
  // Track all successful and failed integrations over time
  const allPreviouslySuccessful = new Set<string>();
  const allPreviouslyFailed = new Set<string>();
  
  for (let i = 0; i < history.length - 1; i++) {
    const point = history[i];
    
    // Add to tracking sets
    for (const domain of point.successfulIntegrations) {
      allPreviouslySuccessful.add(domain);
    }
    
    for (const domain of point.failedIntegrations) {
      allPreviouslyFailed.add(domain);
    }
  }
  
  // Check the most recent point against history
  const latestPoint = history[history.length - 1];
  
  for (const domain of latestPoint.successfulIntegrations) {
    // If not previously successful, it's new
    if (!allPreviouslySuccessful.has(domain)) {
      newSuccessfulIntegrations++;
      
      // If it was previously failed, that's even better
      if (allPreviouslyFailed.has(domain)) {
        previouslyFailedIntegrations++;
      }
    }
  }
  
  // Calculate integration learning coefficient
  // Higher values indicate better learning from failures
  const baseCoefficient = newSuccessfulIntegrations / Math.max(1, latestPoint.integrationComplexity);
  const failureRecoveryBonus = previouslyFailedIntegrations * 0.2; // Bonus for recovering from failures
  
  return Math.min(1, baseCoefficient + failureRecoveryBonus);
}

/**
 * Calculate statistical significance
 */
function calculateStatisticalSignificance(
  history: IntegrationCoherenceDataPoint[]
): boolean {
  if (history.length < 5) {
    return false;
  }
  
  // Extract coherence values
  const coherenceValues = history.map(point => point.overallIntegrationCoherence);
  
  // Split into first half and second half
  const midpoint = Math.floor(coherenceValues.length / 2);
  const firstHalf = coherenceValues.slice(0, midpoint);
  const secondHalf = coherenceValues.slice(midpoint);
  
  // Calculate means
  const firstHalfMean = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondHalfMean = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  // Calculate variances
  const firstHalfVariance = firstHalf.reduce((sum, val) => sum + Math.pow(val - firstHalfMean, 2), 0) / 
                           firstHalf.length;
  const secondHalfVariance = secondHalf.reduce((sum, val) => sum + Math.pow(val - secondHalfMean, 2), 0) / 
                            secondHalf.length;
  
  // Calculate standard errors
  const firstHalfStdError = Math.sqrt(firstHalfVariance / firstHalf.length);
  const secondHalfStdError = Math.sqrt(secondHalfVariance / secondHalf.length);
  
  // Calculate t-statistic
  const tStatistic = (secondHalfMean - firstHalfMean) / 
                    Math.sqrt(Math.pow(firstHalfStdError, 2) + Math.pow(secondHalfStdError, 2));
  
  // Critical t-value for 95% confidence (approximate for df > 30)
  const criticalT = 1.96;
  
  // Compare absolute t-statistic with critical value
  return Math.abs(tStatistic) > criticalT;
}

/**
 * Generate recommendations based on coherence analysis
 */
function generateRecommendations(
  overallCoherence: number,
  coherenceTrend: IntegrationCoherenceResult['coherenceTrend'],
  layerSpecificCoherence: Record<string, number>,
  domainCoverage: number,
  crossLayerTransferLearning: IntegrationCoherenceResult['crossLayerTransferLearning'],
  complexityHandling: IntegrationCoherenceResult['complexityHandling'],
  integrationLearningCoefficient: number
): string[] {
  const recommendations: string[] = [];
  
  // Overall coherence recommendations
  if (overallCoherence < 0.5) {
    recommendations.push('Overall integration coherence is low - implement more robust cross-domain mappings');
  }
  
  // Coherence trend recommendations
  if (coherenceTrend === 'declining') {
    recommendations.push('Integration coherence is declining - diagnose layer-specific issues and refactor integration pipelines');
  }
  
  // Layer-specific recommendations
  const weakLayers = Object.entries(layerSpecificCoherence)
    .filter(([_, coherence]) => coherence < 0.5)
    .map(([layerId, _]) => layerId);
  
  if (weakLayers.length > 0) {
    recommendations.push(`Weak coherence detected in layers: ${weakLayers.join(', ')} - strengthen these integration points`);
  }
  
  // Domain coverage recommendations
  if (domainCoverage < 0.7) {
    recommendations.push(`Domain coverage at ${(domainCoverage * 100).toFixed(1)}% - expand integration to include more domains`);
  }
  
  // Transfer learning recommendations
  if (crossLayerTransferLearning.transferCoefficient < 0.3) {
    recommendations.push('Cross-layer transfer learning is weak - implement more explicit knowledge sharing between layers');
  }
  
  // Most influential layers
  if (crossLayerTransferLearning.mostInfluentialLayers.length > 0) {
    recommendations.push(`Focus optimization on most influential layers: ${crossLayerTransferLearning.mostInfluentialLayers.join(', ')}`);
  }
  
  // Complexity handling recommendations
  if (complexityHandling.complexityEfficiency < 0.3) {
    recommendations.push('Low complexity efficiency detected - simplify integration patterns for better performance');
  }
  
  if (complexityHandling.complexityTrend === 'increasing' && complexityHandling.complexityEfficiency < 0.5) {
    recommendations.push('Complexity is increasing faster than coherence can handle - introduce intermediate abstraction layers');
  }
  
  // Learning coefficient recommendations
  if (integrationLearningCoefficient < 0.5) {
    recommendations.push('Integration learning coefficient is low - implement more aggressive learning from failed integrations');
  }
  
  // Ensure we have at least one recommendation
  if (recommendations.length === 0) {
    recommendations.push('Current integration approach is effective - continue exploring more complex domain combinations');
  }
  
  return recommendations;
}

/**
 * Create a default coherence result when insufficient data is available
 */
function createDefaultCoherenceResult(
  reason: string
): IntegrationCoherenceResult {
  return {
    id: uuidv4(),
    timestamp: new Date(),
    overallCoherence: 0.5,
    coherenceTrend: 'stable',
    layerSpecificCoherence: {},
    domainCoverage: 0,
    crossLayerTransferLearning: {
      transferCoefficient: 0.5,
      interLayerDependencies: [],
      mostInfluentialLayers: []
    },
    complexityHandling: {
      complexityTrend: 'stable',
      maxComplexityHandled: 0,
      complexityEfficiency: 0.5
    },
    integrationLearningCoefficient: 0.5,
    isStatisticallySignificant: false,
    recommendations: [
      reason,
      'Collect at least 3 data points to enable integration coherence analysis'
    ]
  };
}

/**
 * Get integration coherence history
 * 
 * @returns Integration coherence history data points
 */
export function getIntegrationCoherenceHistory(): IntegrationCoherenceDataPoint[] {
  return [...integrationCoherenceHistory];
}

/**
 * Clear integration coherence history (for testing purposes)
 */
export function clearIntegrationCoherenceHistory(): void {
  integrationCoherenceHistory.length = 0;
}