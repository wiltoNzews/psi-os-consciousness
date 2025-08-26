/**
 * Cognitive Framework Tracker
 * 
 * This module implements the ValidationMetrics(t) mechanism for the
 * 4W+1H+(X)WHICH(MACRO-OFFSET)(FLOW-ANTI-FLOW) Cognitive Execution Framework,
 * allowing us to track, measure, and prove that the framework is actively
 * learning and improving its decision-making over time.
 * 
 * Core logic:
 * ValidationMetrics(t) = ∑(ContextualAccuracy × StrategicFit × Adaptability × OutcomeQuality)
 * 
 * This tracks the framework's improvements in contextual awareness, strategic alignment,
 * adaptability, and outcome quality over time.
 */

import { v4 as uuidv4 } from 'uuid';
import { recordCognitiveFrameworkOperation } from './meta-learning-validation.js';

/**
 * Cognitive framework execution data point
 */
export interface CognitiveFrameworkDataPoint {
  id: string;
  timestamp: Date;
  contextualElements: {
    who: string[];
    what: string;
    when: {
      timeframe: string;
      urgency: number; // 1-10 scale
    };
    where: {
      domain: string;
      scope: string;
    };
    how: {
      methods: string[];
      constraints: string[];
    };
  };
  strategicElements: {
    lens: string;
    aspects: Array<{
      name: string;
      priority: number; // 1-10 scale
    }>;
  };
  macroOffsetElements: {
    systemicImplications: Array<{
      area: string;
      impact: number; // -10 to 10 scale
    }>;
    offsetFactor: number;
  };
  flowDynamics: {
    flowRatio: number;
    equilibriumState: string;
  };
  frameworkPerformance: {
    contextualAccuracy: number; // 0-1 scale
    strategicFit: number; // 0-1 scale
    adaptability: number; // 0-1 scale
    outcomeQuality: number; // 0-1 scale
    decisionValue: number; // -100 to 100 scale
    confidenceScore: number; // 0-1 scale
  };
  executionTime: number; // In milliseconds
  userFeedback?: number; // 1-10 scale
}

/**
 * Cognitive framework validation result
 */
export interface CognitiveFrameworkValidationResult {
  id: string;
  timestamp: Date;
  overallImprovement: number; // -1 to 1 scale
  performanceMetrics: {
    contextualAccuracy: {
      current: number;
      trend: 'improving' | 'stable' | 'declining';
      learningRate: number;
    };
    strategicFit: {
      current: number;
      trend: 'improving' | 'stable' | 'declining';
      learningRate: number;
    };
    adaptability: {
      current: number;
      trend: 'improving' | 'stable' | 'declining';
      learningRate: number;
    };
    outcomeQuality: {
      current: number;
      trend: 'improving' | 'stable' | 'declining';
      learningRate: number;
    };
  };
  dimensionalAnalysis: {
    strongestDimension: 'contextual' | 'strategic' | 'adaptability' | 'outcome';
    weakestDimension: 'contextual' | 'strategic' | 'adaptability' | 'outcome';
    balanceFactor: number; // 0-1 scale, higher = more balanced
  };
  learningDynamics: {
    speedOfLearning: number; // 0-1 scale
    consistencyOfLearning: number; // 0-1 scale
    transferLearning: number; // 0-1 scale, how well learning transfers between domains
    knowledgeRetention: number; // 0-1 scale, how well insights are retained
  };
  isStatisticallySignificant: boolean;
  recommendations: string[];
}

// In-memory storage of cognitive framework data (would be database in production)
const cognitiveFrameworkHistory: CognitiveFrameworkDataPoint[] = [];

/**
 * Record a cognitive framework execution for tracking
 * 
 * @param contextualElements The 4W+1H context elements
 * @param strategicElements The WHICH strategic elements
 * @param macroOffsetElements The MACRO-OFFSET elements
 * @param flowDynamics The FLOW/ANTI-FLOW dynamics
 * @param frameworkPerformance Performance metrics for the execution
 * @param executionTime Time taken for execution in ms
 * @param userFeedback Optional user feedback (1-10)
 * @returns Recorded framework data point
 */
export function recordCognitiveFrameworkExecution(
  contextualElements: CognitiveFrameworkDataPoint['contextualElements'],
  strategicElements: CognitiveFrameworkDataPoint['strategicElements'],
  macroOffsetElements: CognitiveFrameworkDataPoint['macroOffsetElements'],
  flowDynamics: CognitiveFrameworkDataPoint['flowDynamics'],
  frameworkPerformance: CognitiveFrameworkDataPoint['frameworkPerformance'],
  executionTime: number,
  userFeedback?: number
): CognitiveFrameworkDataPoint {
  const dataPoint: CognitiveFrameworkDataPoint = {
    id: uuidv4(),
    timestamp: new Date(),
    contextualElements,
    strategicElements,
    macroOffsetElements,
    flowDynamics,
    frameworkPerformance,
    executionTime,
    userFeedback
  };
  
  // Store in history
  cognitiveFrameworkHistory.push(dataPoint);
  
  // Record in meta-learning framework for broader analysis
  recordCognitiveFrameworkOperation(
    {
      context: {
        who: contextualElements.who,
        what: contextualElements.what,
        when: contextualElements.when,
        where: contextualElements.where,
        how: contextualElements.how
      },
      strategicLens: {
        lens: strategicElements.lens,
        aspects: strategicElements.aspects
      },
      macroOffset: {
        systemicImplications: macroOffsetElements.systemicImplications,
        offsetFactor: macroOffsetElements.offsetFactor
      },
      flowDynamics: {
        flowRatio: flowDynamics.flowRatio,
        equilibriumState: flowDynamics.equilibriumState
      }
    },
    {
      contextualAccuracy: frameworkPerformance.contextualAccuracy,
      strategicFit: frameworkPerformance.strategicFit,
      adaptability: frameworkPerformance.adaptability,
      outcomeQuality: frameworkPerformance.outcomeQuality,
      decisionValue: frameworkPerformance.decisionValue,
      confidenceScore: frameworkPerformance.confidenceScore
    },
    {
      accuracy: (frameworkPerformance.contextualAccuracy + 
                frameworkPerformance.strategicFit + 
                frameworkPerformance.adaptability + 
                frameworkPerformance.outcomeQuality) / 4,
      executionTime,
      userFeedback
    }
  );
  
  return dataPoint;
}

/**
 * Calculate cognitive framework validation metrics
 * 
 * @param timeWindow Optional time window in milliseconds (default: 7 days)
 * @returns Cognitive framework validation result
 */
export function validateCognitiveFramework(
  timeWindow: number = 7 * 24 * 60 * 60 * 1000
): CognitiveFrameworkValidationResult {
  const currentTime = new Date().getTime();
  
  // Filter for relevant history within time window
  const relevantHistory = cognitiveFrameworkHistory.filter(
    point => (currentTime - point.timestamp.getTime()) <= timeWindow
  );
  
  if (relevantHistory.length < 3) {
    return createDefaultValidationResult('Insufficient data points for framework validation');
  }
  
  // Sort by timestamp (oldest first)
  relevantHistory.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  // Calculate performance metrics with trends
  const performanceMetrics = calculatePerformanceMetrics(relevantHistory);
  
  // Calculate overall improvement
  const overallImprovement = calculateOverallImprovement(relevantHistory);
  
  // Calculate dimensional analysis
  const dimensionalAnalysis = calculateDimensionalAnalysis(relevantHistory);
  
  // Calculate learning dynamics
  const learningDynamics = calculateLearningDynamics(relevantHistory);
  
  // Calculate statistical significance
  const isStatisticallySignificant = calculateStatisticalSignificance(relevantHistory);
  
  // Generate recommendations
  const recommendations = generateRecommendations(
    performanceMetrics,
    dimensionalAnalysis,
    learningDynamics,
    overallImprovement
  );
  
  // Return validation result
  return {
    id: uuidv4(),
    timestamp: new Date(),
    overallImprovement,
    performanceMetrics,
    dimensionalAnalysis,
    learningDynamics,
    isStatisticallySignificant,
    recommendations
  };
}

/**
 * Calculate performance metrics with trends
 */
function calculatePerformanceMetrics(
  history: CognitiveFrameworkDataPoint[]
): CognitiveFrameworkValidationResult['performanceMetrics'] {
  if (history.length < 3) {
    return {
      contextualAccuracy: { current: 0, trend: 'stable', learningRate: 0 },
      strategicFit: { current: 0, trend: 'stable', learningRate: 0 },
      adaptability: { current: 0, trend: 'stable', learningRate: 0 },
      outcomeQuality: { current: 0, trend: 'stable', learningRate: 0 }
    };
  }
  
  // Get the most recent values
  const recent = history[history.length - 1].frameworkPerformance;
  
  // Calculate trends and learning rates
  return {
    contextualAccuracy: {
      current: recent.contextualAccuracy,
      ...calculateMetricTrendAndLearningRate(history.map(p => p.frameworkPerformance.contextualAccuracy))
    },
    strategicFit: {
      current: recent.strategicFit,
      ...calculateMetricTrendAndLearningRate(history.map(p => p.frameworkPerformance.strategicFit))
    },
    adaptability: {
      current: recent.adaptability,
      ...calculateMetricTrendAndLearningRate(history.map(p => p.frameworkPerformance.adaptability))
    },
    outcomeQuality: {
      current: recent.outcomeQuality,
      ...calculateMetricTrendAndLearningRate(history.map(p => p.frameworkPerformance.outcomeQuality))
    }
  };
}

/**
 * Calculate metric trend and learning rate
 */
function calculateMetricTrendAndLearningRate(
  values: number[]
): { trend: 'improving' | 'stable' | 'declining'; learningRate: number } {
  if (values.length < 3) {
    return { trend: 'stable', learningRate: 0 };
  }
  
  // Calculate linear regression slope
  const xValues = Array.from({ length: values.length }, (_, i) => i);
  const slope = calculateLinearRegressionSlope(xValues, values);
  
  // Determine trend
  const trend: 'improving' | 'stable' | 'declining' =
    slope > 0.01 ? 'improving' :
    slope < -0.01 ? 'declining' :
    'stable';
  
  // Calculate learning rate (absolute slope, normalized to 0-1)
  const learningRate = Math.min(1, Math.abs(slope) * 10);
  
  return { trend, learningRate };
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
 * Calculate overall improvement
 */
function calculateOverallImprovement(
  history: CognitiveFrameworkDataPoint[]
): number {
  if (history.length < 3) {
    return 0;
  }
  
  // Calculate composite performance for first and last points
  const firstPoint = history[0];
  const lastPoint = history[history.length - 1];
  
  const firstComposite = (
    firstPoint.frameworkPerformance.contextualAccuracy +
    firstPoint.frameworkPerformance.strategicFit +
    firstPoint.frameworkPerformance.adaptability +
    firstPoint.frameworkPerformance.outcomeQuality
  ) / 4;
  
  const lastComposite = (
    lastPoint.frameworkPerformance.contextualAccuracy +
    lastPoint.frameworkPerformance.strategicFit +
    lastPoint.frameworkPerformance.adaptability +
    lastPoint.frameworkPerformance.outcomeQuality
  ) / 4;
  
  // Calculate improvement (-1 to 1 scale)
  return Math.max(-1, Math.min(1, lastComposite - firstComposite));
}

/**
 * Calculate dimensional analysis
 */
function calculateDimensionalAnalysis(
  history: CognitiveFrameworkDataPoint[]
): CognitiveFrameworkValidationResult['dimensionalAnalysis'] {
  if (history.length === 0) {
    return {
      strongestDimension: 'contextual',
      weakestDimension: 'outcome',
      balanceFactor: 0.5
    };
  }
  
  // Get the most recent performance metrics
  const recent = history[history.length - 1].frameworkPerformance;
  
  // Calculate the strongest and weakest dimensions
  const dimensions: Array<[string, number]> = [
    ['contextual', recent.contextualAccuracy],
    ['strategic', recent.strategicFit],
    ['adaptability', recent.adaptability],
    ['outcome', recent.outcomeQuality]
  ];
  
  dimensions.sort((a, b) => b[1] - a[1]);
  
  const strongestDimension = dimensions[0][0] as 'contextual' | 'strategic' | 'adaptability' | 'outcome';
  const weakestDimension = dimensions[dimensions.length - 1][0] as 'contextual' | 'strategic' | 'adaptability' | 'outcome';
  
  // Calculate balance factor (higher = more balanced)
  const values = dimensions.map(([_, value]) => value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  const balanceFactor = maxValue > 0 ? minValue / maxValue : 0;
  
  return {
    strongestDimension,
    weakestDimension,
    balanceFactor
  };
}

/**
 * Calculate learning dynamics
 */
function calculateLearningDynamics(
  history: CognitiveFrameworkDataPoint[]
): CognitiveFrameworkValidationResult['learningDynamics'] {
  if (history.length < 3) {
    return {
      speedOfLearning: 0.5,
      consistencyOfLearning: 0.5,
      transferLearning: 0.5,
      knowledgeRetention: 0.5
    };
  }
  
  // Calculate speed of learning (how quickly performance improves)
  const speedOfLearning = calculateSpeedOfLearning(history);
  
  // Calculate consistency of learning (how stable improvements are)
  const consistencyOfLearning = calculateConsistencyOfLearning(history);
  
  // Calculate transfer learning (how well learning transfers between domains)
  const transferLearning = calculateTransferLearning(history);
  
  // Calculate knowledge retention (how well insights are retained)
  const knowledgeRetention = calculateKnowledgeRetention(history);
  
  return {
    speedOfLearning,
    consistencyOfLearning,
    transferLearning,
    knowledgeRetention
  };
}

/**
 * Calculate speed of learning
 */
function calculateSpeedOfLearning(
  history: CognitiveFrameworkDataPoint[]
): number {
  if (history.length < 3) {
    return 0.5;
  }
  
  // Calculate composite performance over time
  const performances = history.map(point => {
    const perf = point.frameworkPerformance;
    return (perf.contextualAccuracy + perf.strategicFit + perf.adaptability + perf.outcomeQuality) / 4;
  });
  
  // Calculate initial slope (first half of data)
  const midpoint = Math.floor(performances.length / 2);
  const xValuesFirstHalf = Array.from({ length: midpoint }, (_, i) => i);
  const yValuesFirstHalf = performances.slice(0, midpoint);
  
  const initialSlope = calculateLinearRegressionSlope(xValuesFirstHalf, yValuesFirstHalf);
  
  // Normalize to 0-1 scale (0.1 slope would be very fast learning)
  return Math.min(1, Math.max(0, initialSlope * 10));
}

/**
 * Calculate consistency of learning
 */
function calculateConsistencyOfLearning(
  history: CognitiveFrameworkDataPoint[]
): number {
  if (history.length < 3) {
    return 0.5;
  }
  
  // Calculate composite performance over time
  const performances = history.map(point => {
    const perf = point.frameworkPerformance;
    return (perf.contextualAccuracy + perf.strategicFit + perf.adaptability + perf.outcomeQuality) / 4;
  });
  
  // Calculate variance of differences between consecutive performances
  const differences: number[] = [];
  
  for (let i = 1; i < performances.length; i++) {
    differences.push(performances[i] - performances[i-1]);
  }
  
  const meanDifference = differences.reduce((sum, val) => sum + val, 0) / differences.length;
  const variance = differences.reduce((sum, val) => sum + Math.pow(val - meanDifference, 2), 0) / differences.length;
  
  // Lower variance = more consistent learning (normalize to 0-1)
  return Math.min(1, Math.max(0, 1 - (variance * 10)));
}

/**
 * Calculate transfer learning
 */
function calculateTransferLearning(
  history: CognitiveFrameworkDataPoint[]
): number {
  if (history.length < 5) {
    return 0.5;
  }
  
  // Group data points by domain
  const domainGroups: Record<string, CognitiveFrameworkDataPoint[]> = {};
  
  for (const point of history) {
    const domain = point.contextualElements.where.domain;
    
    if (!domainGroups[domain]) {
      domainGroups[domain] = [];
    }
    
    domainGroups[domain].push(point);
  }
  
  // Only analyze domains with multiple data points
  const eligibleDomains = Object.entries(domainGroups)
    .filter(([_, points]) => points.length >= 2)
    .map(([domain, _]) => domain);
  
  if (eligibleDomains.length < 2) {
    return 0.5; // Not enough domains for transfer learning analysis
  }
  
  // Calculate learning rates for each domain
  const domainLearningRates: Record<string, number> = {};
  
  for (const domain of eligibleDomains) {
    const domainPoints = domainGroups[domain];
    domainPoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Calculate composite performance for first and last points
    const firstPoint = domainPoints[0];
    const lastPoint = domainPoints[domainPoints.length - 1];
    
    const firstPerf = firstPoint.frameworkPerformance;
    const lastPerf = lastPoint.frameworkPerformance;
    
    const firstComposite = (firstPerf.contextualAccuracy + firstPerf.strategicFit + 
                           firstPerf.adaptability + firstPerf.outcomeQuality) / 4;
    
    const lastComposite = (lastPerf.contextualAccuracy + lastPerf.strategicFit + 
                          lastPerf.adaptability + lastPerf.outcomeQuality) / 4;
    
    // Learning rate is improvement per unit of time
    const timeSpan = (lastPoint.timestamp.getTime() - firstPoint.timestamp.getTime()) / (1000 * 60 * 60); // Hours
    
    if (timeSpan > 0) {
      domainLearningRates[domain] = (lastComposite - firstComposite) / timeSpan;
    } else {
      domainLearningRates[domain] = 0;
    }
  }
  
  // Calculate temporal sequence of domains
  const domainSequence: string[] = [];
  const seenDomains = new Set<string>();
  
  for (const point of history) {
    const domain = point.contextualElements.where.domain;
    
    if (!seenDomains.has(domain) && eligibleDomains.includes(domain)) {
      domainSequence.push(domain);
      seenDomains.add(domain);
    }
  }
  
  // Calculate transfer learning by comparing learning rates of domains
  // after experience with previous domains
  let totalTransfer = 0;
  let transferCount = 0;
  
  for (let i = 1; i < domainSequence.length; i++) {
    const previousDomain = domainSequence[i-1];
    const currentDomain = domainSequence[i];
    
    // Higher learning rate in later domains indicates good transfer
    if (domainLearningRates[currentDomain] > domainLearningRates[previousDomain]) {
      totalTransfer += 1;
    } else if (domainLearningRates[currentDomain] > 0) {
      totalTransfer += 0.5; // Some transfer is happening
    }
    
    transferCount++;
  }
  
  return transferCount > 0 ? totalTransfer / transferCount : 0.5;
}

/**
 * Calculate knowledge retention
 */
function calculateKnowledgeRetention(
  history: CognitiveFrameworkDataPoint[]
): number {
  if (history.length < 5) {
    return 0.5;
  }
  
  // Filter for domains that appear multiple times with gaps
  const domainTimestamps: Record<string, number[]> = {};
  
  for (const point of history) {
    const domain = point.contextualElements.where.domain;
    
    if (!domainTimestamps[domain]) {
      domainTimestamps[domain] = [];
    }
    
    domainTimestamps[domain].push(point.timestamp.getTime());
  }
  
  // Find domains with at least 3 appearances and at least one significant gap
  const domainsWithGaps: string[] = [];
  
  for (const [domain, timestamps] of Object.entries(domainTimestamps)) {
    if (timestamps.length >= 3) {
      // Sort timestamps
      timestamps.sort((a, b) => a - b);
      
      // Check for significant gaps (more than 24 hours)
      let hasSignificantGap = false;
      
      for (let i = 1; i < timestamps.length; i++) {
        const gap = timestamps[i] - timestamps[i-1];
        if (gap > 24 * 60 * 60 * 1000) {
          hasSignificantGap = true;
          break;
        }
      }
      
      if (hasSignificantGap) {
        domainsWithGaps.push(domain);
      }
    }
  }
  
  if (domainsWithGaps.length === 0) {
    return 0.5; // Not enough data for retention analysis
  }
  
  // Calculate performance before and after gaps for each eligible domain
  let totalRetention = 0;
  
  for (const domain of domainsWithGaps) {
    const domainPoints = history.filter(p => p.contextualElements.where.domain === domain);
    
    // Sort by timestamp
    domainPoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Find significant gaps
    const gaps: Array<[number, number]> = []; // [beforeIndex, afterIndex]
    
    for (let i = 1; i < domainPoints.length; i++) {
      const gap = domainPoints[i].timestamp.getTime() - domainPoints[i-1].timestamp.getTime();
      
      if (gap > 24 * 60 * 60 * 1000) {
        gaps.push([i-1, i]);
      }
    }
    
    for (const [beforeIndex, afterIndex] of gaps) {
      const beforePoint = domainPoints[beforeIndex];
      const afterPoint = domainPoints[afterIndex];
      
      // Calculate composite performance before and after gap
      const beforePerf = beforePoint.frameworkPerformance;
      const afterPerf = afterPoint.frameworkPerformance;
      
      const beforeComposite = (beforePerf.contextualAccuracy + beforePerf.strategicFit + 
                              beforePerf.adaptability + beforePerf.outcomeQuality) / 4;
      
      const afterComposite = (afterPerf.contextualAccuracy + afterPerf.strategicFit + 
                             afterPerf.adaptability + afterPerf.outcomeQuality) / 4;
      
      // Retention is the ratio of after/before performance (capped at 1)
      const retention = Math.min(1, afterComposite / Math.max(0.1, beforeComposite));
      
      totalRetention += retention;
    }
  }
  
  // Calculate average retention across all gaps
  return totalRetention / domainsWithGaps.length;
}

/**
 * Calculate statistical significance
 */
function calculateStatisticalSignificance(
  history: CognitiveFrameworkDataPoint[]
): boolean {
  if (history.length < 5) {
    return false;
  }
  
  // Calculate composite performance for each point
  const performances = history.map(point => {
    const perf = point.frameworkPerformance;
    return (perf.contextualAccuracy + perf.strategicFit + perf.adaptability + perf.outcomeQuality) / 4;
  });
  
  // Split into first half and second half
  const midpoint = Math.floor(performances.length / 2);
  const firstHalf = performances.slice(0, midpoint);
  const secondHalf = performances.slice(midpoint);
  
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
 * Generate recommendations based on framework validation
 */
function generateRecommendations(
  performanceMetrics: CognitiveFrameworkValidationResult['performanceMetrics'],
  dimensionalAnalysis: CognitiveFrameworkValidationResult['dimensionalAnalysis'],
  learningDynamics: CognitiveFrameworkValidationResult['learningDynamics'],
  overallImprovement: number
): string[] {
  const recommendations: string[] = [];
  
  // Overall improvement recommendations
  if (overallImprovement < 0) {
    recommendations.push('Framework performance is declining - reset parameters and recalibrate baseline');
  } else if (overallImprovement < 0.1) {
    recommendations.push('Minimal overall improvement - increase training frequency and diversity');
  }
  
  // Metric-specific recommendations
  if (performanceMetrics.contextualAccuracy.trend === 'declining') {
    recommendations.push('Contextual accuracy is declining - enhance 4W+1H element detection and correlation');
  }
  
  if (performanceMetrics.strategicFit.trend === 'declining') {
    recommendations.push('Strategic fit is declining - refine WHICH lens selection algorithms');
  }
  
  if (performanceMetrics.adaptability.trend === 'declining') {
    recommendations.push('Adaptability is declining - strengthen MACRO-OFFSET impact assessment');
  }
  
  if (performanceMetrics.outcomeQuality.trend === 'declining') {
    recommendations.push('Outcome quality is declining - improve FLOW/ANTI-FLOW equilibrium detection');
  }
  
  // Dimensional balance recommendations
  if (dimensionalAnalysis.balanceFactor < 0.7) {
    recommendations.push(`Dimensional imbalance detected - focus training on weakest dimension: ${dimensionalAnalysis.weakestDimension}`);
  }
  
  // Learning dynamics recommendations
  if (learningDynamics.speedOfLearning < 0.3) {
    recommendations.push('Slow learning speed detected - implement more aggressive parameter updates');
  }
  
  if (learningDynamics.consistencyOfLearning < 0.5) {
    recommendations.push('Inconsistent learning detected - stabilize training process with regularization');
  }
  
  if (learningDynamics.transferLearning < 0.4) {
    recommendations.push('Poor transfer learning detected - implement explicit cross-domain knowledge sharing');
  }
  
  if (learningDynamics.knowledgeRetention < 0.6) {
    recommendations.push('Weak knowledge retention detected - strengthen memory persistence mechanisms');
  }
  
  // Ensure we have at least one recommendation
  if (recommendations.length === 0) {
    recommendations.push('Current cognitive framework is learning effectively - continue with diverse domain exposure');
  }
  
  return recommendations;
}

/**
 * Create a default validation result when insufficient data is available
 */
function createDefaultValidationResult(
  reason: string
): CognitiveFrameworkValidationResult {
  return {
    id: uuidv4(),
    timestamp: new Date(),
    overallImprovement: 0,
    performanceMetrics: {
      contextualAccuracy: { current: 0.5, trend: 'stable', learningRate: 0 },
      strategicFit: { current: 0.5, trend: 'stable', learningRate: 0 },
      adaptability: { current: 0.5, trend: 'stable', learningRate: 0 },
      outcomeQuality: { current: 0.5, trend: 'stable', learningRate: 0 }
    },
    dimensionalAnalysis: {
      strongestDimension: 'contextual',
      weakestDimension: 'outcome',
      balanceFactor: 0.5
    },
    learningDynamics: {
      speedOfLearning: 0.5,
      consistencyOfLearning: 0.5,
      transferLearning: 0.5,
      knowledgeRetention: 0.5
    },
    isStatisticallySignificant: false,
    recommendations: [
      reason,
      'Collect at least 3 data points to enable cognitive framework validation'
    ]
  };
}

/**
 * Get cognitive framework history
 * 
 * @returns Cognitive framework history data points
 */
export function getCognitiveFrameworkHistory(): CognitiveFrameworkDataPoint[] {
  return [...cognitiveFrameworkHistory];
}

/**
 * Clear cognitive framework history (for testing purposes)
 */
export function clearCognitiveFrameworkHistory(): void {
  cognitiveFrameworkHistory.length = 0;
}