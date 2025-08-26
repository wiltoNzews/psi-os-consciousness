/**
 * Foresight Validation Tracker
 * 
 * This module implements the ValidationMetrics(t) mechanism for the
 * Meta-Void Preview & Review Formula, allowing us to track, measure, and prove
 * that the formula is actively learning and improving its foresight capabilities.
 * 
 * Core logic:
 * ForesightAccuracy(t) = ActualOutcome(t) ⋅ PredictedOutcome(t) / |PredictedOutcome(t)|
 * 
 * This tracks how well the Meta-Void Preview predictions align with actual outcomes,
 * and how the system improves its predictive power over time.
 */

import { v4 as uuidv4 } from 'uuid';
import { recordMetaVoidOperation } from './meta-learning-validation.js';

/**
 * Prediction outcome
 * Used to measure the accuracy of Meta-Void Preview predictions
 */
export interface PredictionOutcome {
  id: string;
  predictionId: string;
  timestamp: Date;
  actualOutcome: string;
  actualImpact: number; // -10 to 10 scale
  actualComplexity: number; // 1-10 scale
  matchScore: number; // 0-1 scale, how well prediction matched reality
  unpredictedFactors: string[]; // Factors that weren't considered in prediction
}

/**
 * Foresight data point
 */
export interface ForesightDataPoint {
  id: string;
  timestamp: Date;
  operationType: 'preview' | 'review';
  subject: string;
  context: {
    domain: string;
    stakeholders: string[];
    timeFrame: string;
  };
  predictions: Array<{
    id: string;
    description: string;
    predictedImpact: number; // -10 to 10 scale
    predictedProbability: number; // 0-1 scale
    predictedComplexity: number; // 1-10 scale
    reasoning: string;
    factors: string[];
    outcome?: PredictionOutcome; // Only present for validated predictions
  }>;
  overallConfidence: number; // 0-1 scale
  executionTime: number; // In milliseconds
  userFeedback?: number; // 1-10 scale
}

/**
 * Foresight validation result
 */
export interface ForesightValidationResult {
  id: string;
  timestamp: Date;
  overallPredictiveAccuracy: number; // 0-1 scale
  accuracyTrend: 'improving' | 'stable' | 'declining';
  confidenceCalibraton: number; // 0-1 scale, how well confidence matches accuracy
  timeHorizonPerformance: {
    shortTerm: number; // 0-1 scale
    mediumTerm: number; // 0-1 scale
    longTerm: number; // 0-1 scale
  };
  domainSpecificAccuracy: Record<string, number>; // Accuracy by domain
  blindSpots: {
    consistentlyMissedFactors: string[];
    overconfidentAreas: string[];
    underconfidentAreas: string[];
  };
  learningMetrics: {
    predictionRefinementRate: number; // How quickly predictions improve
    noveltyHandling: number; // How well system handles novel scenarios
    complexityManagement: number; // How well system handles complexity
  };
  isStatisticallySignificant: boolean;
  recommendations: string[];
}

// In-memory storage of foresight data (would be database in production)
const foresightHistory: ForesightDataPoint[] = [];

/**
 * Record a Meta-Void Preview operation for tracking
 * 
 * @param subject Subject being previewed
 * @param context Context of the preview
 * @param predictions List of predictions
 * @param overallConfidence Overall confidence in predictions
 * @param executionTime Time taken for execution in ms
 * @param userFeedback Optional user feedback (1-10)
 * @returns Recorded foresight data point
 */
export function recordMetaVoidPreview(
  subject: string,
  context: ForesightDataPoint['context'],
  predictions: Array<Omit<ForesightDataPoint['predictions'][0], 'id' | 'outcome'>>,
  overallConfidence: number,
  executionTime: number,
  userFeedback?: number
): ForesightDataPoint {
  // Create full predictions with IDs
  const fullPredictions = predictions.map(prediction => ({
    ...prediction,
    id: uuidv4(),
    outcome: undefined
  }));
  
  const dataPoint: ForesightDataPoint = {
    id: uuidv4(),
    timestamp: new Date(),
    operationType: 'preview',
    subject,
    context,
    predictions: fullPredictions,
    overallConfidence,
    executionTime,
    userFeedback
  };
  
  // Store in history
  foresightHistory.push(dataPoint);
  
  // Record in meta-learning framework for broader analysis
  recordMetaVoidOperation(
    {
      operationType: 'preview',
      subject,
      context,
      predictionCount: fullPredictions.length
    },
    {
      predictionsGenerated: fullPredictions.length,
      overallConfidence,
      averagePredictedImpact: fullPredictions.reduce((sum, p) => sum + p.predictedImpact, 0) / 
                             fullPredictions.length,
      averagePredictedComplexity: fullPredictions.reduce((sum, p) => sum + p.predictedComplexity, 0) / 
                                 fullPredictions.length
    },
    {
      accuracy: userFeedback ? userFeedback / 10 : undefined,
      executionTime,
      userFeedback
    }
  );
  
  return dataPoint;
}

/**
 * Record a Meta-Void Review operation for tracking
 * 
 * @param subject Subject being reviewed
 * @param context Context of the review
 * @param actualOutcomes List of actual outcomes corresponding to previous predictions
 * @param executionTime Time taken for execution in ms
 * @param userFeedback Optional user feedback (1-10)
 * @returns Updated foresight data point with outcomes
 */
export function recordMetaVoidReview(
  predictionIds: string[],
  actualOutcomes: Array<{
    predictionId: string;
    actualOutcome: string;
    actualImpact: number;
    actualComplexity: number;
    matchScore: number;
    unpredictedFactors: string[];
  }>,
  executionTime: number,
  userFeedback?: number
): ForesightDataPoint | null {
  // Find the preview data point that contains these predictions
  const relevantDataPoints = foresightHistory
    .filter(point => point.operationType === 'preview')
    .filter(point => {
      const pointPredictionIds = point.predictions.map(p => p.id);
      return predictionIds.some(id => pointPredictionIds.includes(id));
    });
  
  if (relevantDataPoints.length === 0) {
    console.error('No matching preview found for the given prediction IDs');
    return null;
  }
  
  // Use the most recent relevant data point
  const previewPoint = relevantDataPoints.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  )[0];
  
  // Create outcome objects
  const outcomes = actualOutcomes.map(outcome => ({
    id: uuidv4(),
    predictionId: outcome.predictionId,
    timestamp: new Date(),
    actualOutcome: outcome.actualOutcome,
    actualImpact: outcome.actualImpact,
    actualComplexity: outcome.actualComplexity,
    matchScore: outcome.matchScore,
    unpredictedFactors: outcome.unpredictedFactors
  }));
  
  // Create a new review data point based on the preview
  const reviewPoint: ForesightDataPoint = {
    ...previewPoint,
    id: uuidv4(),
    timestamp: new Date(),
    operationType: 'review',
    executionTime,
    userFeedback,
    predictions: previewPoint.predictions.map(prediction => {
      const outcome = outcomes.find(o => o.predictionId === prediction.id);
      return outcome ? { ...prediction, outcome } : prediction;
    })
  };
  
  // Store in history
  foresightHistory.push(reviewPoint);
  
  // Calculate overall accuracy
  const validatedPredictions = reviewPoint.predictions.filter(p => p.outcome);
  const overallAccuracy = validatedPredictions.length > 0 
    ? validatedPredictions.reduce((sum, p) => sum + (p.outcome?.matchScore || 0), 0) / 
      validatedPredictions.length
    : 0;
  
  // Record in meta-learning framework for broader analysis
  recordMetaVoidOperation(
    {
      operationType: 'review',
      subject: reviewPoint.subject,
      context: reviewPoint.context,
      predictionCount: validatedPredictions.length
    },
    {
      predictionsValidated: validatedPredictions.length,
      overallAccuracy,
      averageActualImpact: validatedPredictions.reduce((sum, p) => sum + (p.outcome?.actualImpact || 0), 0) / 
                          Math.max(1, validatedPredictions.length),
      averageActualComplexity: validatedPredictions.reduce((sum, p) => sum + (p.outcome?.actualComplexity || 0), 0) / 
                              Math.max(1, validatedPredictions.length)
    },
    {
      accuracy: overallAccuracy,
      executionTime,
      userFeedback
    }
  );
  
  return reviewPoint;
}

/**
 * Calculate foresight validation metrics
 * 
 * @param timeWindow Optional time window in milliseconds (default: 7 days)
 * @returns Foresight validation result
 */
export function validateForesight(
  timeWindow: number = 7 * 24 * 60 * 60 * 1000
): ForesightValidationResult {
  const currentTime = new Date().getTime();
  
  // Filter for relevant history within time window
  const relevantHistory = foresightHistory.filter(
    point => (currentTime - point.timestamp.getTime()) <= timeWindow
  );
  
  // Focus on review points (which have outcomes)
  const reviewPoints = relevantHistory.filter(point => point.operationType === 'review');
  
  if (reviewPoints.length < 3) {
    return createDefaultValidationResult('Insufficient review data points for foresight validation');
  }
  
  // Sort by timestamp (oldest first)
  reviewPoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  // Calculate overall predictive accuracy
  const overallPredictiveAccuracy = calculateOverallAccuracy(reviewPoints);
  
  // Calculate accuracy trend
  const accuracyTrend = calculateAccuracyTrend(reviewPoints);
  
  // Calculate confidence calibration
  const confidenceCalibraton = calculateConfidenceCalibration(reviewPoints);
  
  // Calculate time horizon performance
  const timeHorizonPerformance = calculateTimeHorizonPerformance(reviewPoints);
  
  // Calculate domain-specific accuracy
  const domainSpecificAccuracy = calculateDomainSpecificAccuracy(reviewPoints);
  
  // Identify blind spots
  const blindSpots = identifyBlindSpots(reviewPoints);
  
  // Calculate learning metrics
  const learningMetrics = calculateLearningMetrics(reviewPoints);
  
  // Calculate statistical significance
  const isStatisticallySignificant = calculateStatisticalSignificance(reviewPoints);
  
  // Generate recommendations
  const recommendations = generateRecommendations(
    overallPredictiveAccuracy,
    accuracyTrend,
    confidenceCalibraton,
    timeHorizonPerformance,
    domainSpecificAccuracy,
    blindSpots,
    learningMetrics
  );
  
  // Return validation result
  return {
    id: uuidv4(),
    timestamp: new Date(),
    overallPredictiveAccuracy,
    accuracyTrend,
    confidenceCalibraton,
    timeHorizonPerformance,
    domainSpecificAccuracy,
    blindSpots,
    learningMetrics,
    isStatisticallySignificant,
    recommendations
  };
}

/**
 * Calculate overall accuracy across all validated predictions
 */
function calculateOverallAccuracy(
  reviewPoints: ForesightDataPoint[]
): number {
  let totalMatchScore = 0;
  let totalPredictions = 0;
  
  for (const point of reviewPoints) {
    for (const prediction of point.predictions) {
      if (prediction.outcome) {
        totalMatchScore += prediction.outcome.matchScore;
        totalPredictions++;
      }
    }
  }
  
  return totalPredictions > 0 ? totalMatchScore / totalPredictions : 0;
}

/**
 * Calculate accuracy trend
 */
function calculateAccuracyTrend(
  reviewPoints: ForesightDataPoint[]
): ForesightValidationResult['accuracyTrend'] {
  if (reviewPoints.length < 3) {
    return 'stable';
  }
  
  // Calculate accuracy per review point
  const accuracies: Array<[number, number]> = []; // [timestamp, accuracy]
  
  for (const point of reviewPoints) {
    let pointMatchScore = 0;
    let pointPredictions = 0;
    
    for (const prediction of point.predictions) {
      if (prediction.outcome) {
        pointMatchScore += prediction.outcome.matchScore;
        pointPredictions++;
      }
    }
    
    if (pointPredictions > 0) {
      accuracies.push([
        point.timestamp.getTime(),
        pointMatchScore / pointPredictions
      ]);
    }
  }
  
  if (accuracies.length < 3) {
    return 'stable';
  }
  
  // Calculate linear regression slope
  const slope = calculateLinearRegressionSlope(
    accuracies.map(([x, _]) => x),
    accuracies.map(([_, y]) => y)
  );
  
  if (slope > 0.0001) {
    return 'improving';
  } else if (slope < -0.0001) {
    return 'declining';
  } else {
    return 'stable';
  }
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
 * Calculate confidence calibration
 */
function calculateConfidenceCalibration(
  reviewPoints: ForesightDataPoint[]
): number {
  let totalCalibration = 0;
  let totalPredictions = 0;
  
  for (const point of reviewPoints) {
    for (const prediction of point.predictions) {
      if (prediction.outcome) {
        // Calculate how well confidence matched actual match score
        // 1 - |confidence - accuracy| gives a score where 1 = perfect calibration
        const calibration = 1 - Math.abs(prediction.predictedProbability - prediction.outcome.matchScore);
        
        totalCalibration += calibration;
        totalPredictions++;
      }
    }
  }
  
  return totalPredictions > 0 ? totalCalibration / totalPredictions : 0;
}

/**
 * Calculate time horizon performance
 */
function calculateTimeHorizonPerformance(
  reviewPoints: ForesightDataPoint[]
): ForesightValidationResult['timeHorizonPerformance'] {
  // Define time horizons (could be more sophisticated with actual time data)
  const timeHorizons: Record<string, 'shortTerm' | 'mediumTerm' | 'longTerm'> = {
    'immediate': 'shortTerm',
    'short-term': 'shortTerm',
    'days': 'shortTerm',
    'weeks': 'mediumTerm',
    'medium-term': 'mediumTerm',
    'months': 'mediumTerm',
    'long-term': 'longTerm',
    'years': 'longTerm'
  };
  
  // Initialize accuracy counters
  const horizonScores: Record<string, number> = {
    shortTerm: 0,
    mediumTerm: 0,
    longTerm: 0
  };
  
  const horizonCounts: Record<string, number> = {
    shortTerm: 0,
    mediumTerm: 0,
    longTerm: 0
  };
  
  // Categorize predictions by time horizon and calculate accuracy
  for (const point of reviewPoints) {
    // Look for time frame indicators in context
    let timeHorizon: 'shortTerm' | 'mediumTerm' | 'longTerm' = 'mediumTerm'; // Default
    
    // Try to determine horizon from context timeFrame
    const timeFrameLower = point.context.timeFrame.toLowerCase();
    for (const [keyword, horizon] of Object.entries(timeHorizons)) {
      if (timeFrameLower.includes(keyword)) {
        timeHorizon = horizon;
        break;
      }
    }
    
    // Calculate accuracy for this horizon
    for (const prediction of point.predictions) {
      if (prediction.outcome) {
        horizonScores[timeHorizon] += prediction.outcome.matchScore;
        horizonCounts[timeHorizon]++;
      }
    }
  }
  
  // Calculate average accuracy for each horizon
  return {
    shortTerm: horizonCounts.shortTerm > 0 ? horizonScores.shortTerm / horizonCounts.shortTerm : 0,
    mediumTerm: horizonCounts.mediumTerm > 0 ? horizonScores.mediumTerm / horizonCounts.mediumTerm : 0,
    longTerm: horizonCounts.longTerm > 0 ? horizonScores.longTerm / horizonCounts.longTerm : 0
  };
}

/**
 * Calculate domain-specific accuracy
 */
function calculateDomainSpecificAccuracy(
  reviewPoints: ForesightDataPoint[]
): Record<string, number> {
  const domainScores: Record<string, number> = {};
  const domainCounts: Record<string, number> = {};
  
  for (const point of reviewPoints) {
    const domain = point.context.domain;
    
    if (!domainScores[domain]) {
      domainScores[domain] = 0;
      domainCounts[domain] = 0;
    }
    
    for (const prediction of point.predictions) {
      if (prediction.outcome) {
        domainScores[domain] += prediction.outcome.matchScore;
        domainCounts[domain]++;
      }
    }
  }
  
  // Calculate average accuracy for each domain
  const domainAccuracy: Record<string, number> = {};
  
  for (const domain of Object.keys(domainScores)) {
    domainAccuracy[domain] = domainCounts[domain] > 0 
      ? domainScores[domain] / domainCounts[domain] 
      : 0;
  }
  
  return domainAccuracy;
}

/**
 * Identify blind spots
 */
function identifyBlindSpots(
  reviewPoints: ForesightDataPoint[]
): ForesightValidationResult['blindSpots'] {
  // Track consistently missed factors
  const missedFactorCounts: Record<string, number> = {};
  
  // Track overconfident and underconfident predictions
  const confidenceDeviations: Record<string, Array<number>> = {};
  
  for (const point of reviewPoints) {
    // Process each prediction with an outcome
    for (const prediction of point.predictions) {
      if (prediction.outcome) {
        // Count unpredicted factors
        for (const factor of prediction.outcome.unpredictedFactors) {
          missedFactorCounts[factor] = (missedFactorCounts[factor] || 0) + 1;
        }
        
        // Track confidence deviations by subject area
        // Use first word of the subject as a rough categorization
        const subjectArea = prediction.description.split(' ')[0].toLowerCase();
        
        if (!confidenceDeviations[subjectArea]) {
          confidenceDeviations[subjectArea] = [];
        }
        
        // Deviation = predicted confidence - actual accuracy
        // Positive = overconfident, Negative = underconfident
        const deviation = prediction.predictedProbability - prediction.outcome.matchScore;
        confidenceDeviations[subjectArea].push(deviation);
      }
    }
  }
  
  // Identify consistently missed factors (appear in at least 3 predictions)
  const consistentlyMissedFactors = Object.entries(missedFactorCounts)
    .filter(([_, count]) => count >= 3)
    .map(([factor, _]) => factor);
  
  // Identify overconfident and underconfident areas
  const overconfidentAreas: string[] = [];
  const underconfidentAreas: string[] = [];
  
  for (const [area, deviations] of Object.entries(confidenceDeviations)) {
    if (deviations.length < 3) continue;
    
    const avgDeviation = deviations.reduce((sum, val) => sum + val, 0) / deviations.length;
    
    if (avgDeviation > 0.2) {
      overconfidentAreas.push(area);
    } else if (avgDeviation < -0.2) {
      underconfidentAreas.push(area);
    }
  }
  
  return {
    consistentlyMissedFactors,
    overconfidentAreas,
    underconfidentAreas
  };
}

/**
 * Calculate learning metrics
 */
function calculateLearningMetrics(
  reviewPoints: ForesightDataPoint[]
): ForesightValidationResult['learningMetrics'] {
  if (reviewPoints.length < 3) {
    return {
      predictionRefinementRate: 0.5,
      noveltyHandling: 0.5,
      complexityManagement: 0.5
    };
  }
  
  // Calculate prediction refinement rate
  const predictionRefinementRate = calculatePredictionRefinementRate(reviewPoints);
  
  // Calculate novelty handling
  const noveltyHandling = calculateNoveltyHandling(reviewPoints);
  
  // Calculate complexity management
  const complexityManagement = calculateComplexityManagement(reviewPoints);
  
  return {
    predictionRefinementRate,
    noveltyHandling,
    complexityManagement
  };
}

/**
 * Calculate prediction refinement rate
 */
function calculatePredictionRefinementRate(
  reviewPoints: ForesightDataPoint[]
): number {
  if (reviewPoints.length < 3) {
    return 0.5;
  }
  
  // Split into first half and second half
  const midpoint = Math.floor(reviewPoints.length / 2);
  const firstHalf = reviewPoints.slice(0, midpoint);
  const secondHalf = reviewPoints.slice(midpoint);
  
  // Calculate accuracy for first and second half
  const firstHalfAccuracy = calculateOverallAccuracy(firstHalf);
  const secondHalfAccuracy = calculateOverallAccuracy(secondHalf);
  
  // Calculate improvement rate (normalized to 0-1)
  const improvementRate = Math.max(0, Math.min(1, (secondHalfAccuracy - firstHalfAccuracy) + 0.5));
  
  return improvementRate;
}

/**
 * Calculate novelty handling
 */
function calculateNoveltyHandling(
  reviewPoints: ForesightDataPoint[]
): number {
  // Count unique factors across all predictions
  const allFactors = new Set<string>();
  const predictedFactors = new Set<string>();
  
  for (const point of reviewPoints) {
    for (const prediction of point.predictions) {
      // Add predicted factors
      for (const factor of prediction.factors) {
        allFactors.add(factor);
        predictedFactors.add(factor);
      }
      
      // Add unpredicted factors from outcomes
      if (prediction.outcome) {
        for (const factor of prediction.outcome.unpredictedFactors) {
          allFactors.add(factor);
        }
      }
    }
  }
  
  // Calculate how well system identifies all relevant factors
  const noveltyHandling = predictedFactors.size / Math.max(1, allFactors.size);
  
  return noveltyHandling;
}

/**
 * Calculate complexity management
 */
function calculateComplexityManagement(
  reviewPoints: ForesightDataPoint[]
): number {
  let complexityEfficiency = 0;
  let validPredictions = 0;
  
  for (const point of reviewPoints) {
    for (const prediction of point.predictions) {
      if (prediction.outcome) {
        // Compare predicted vs. actual complexity
        const predictedComplexity = prediction.predictedComplexity;
        const actualComplexity = prediction.outcome.actualComplexity;
        
        // Calculate how accurately complexity was estimated
        // 1 - |predicted - actual|/10 gives a score where 1 = perfect estimation
        const complexityAccuracy = 1 - Math.abs(predictedComplexity - actualComplexity) / 10;
        
        // Calculate match score relative to complexity
        // Higher scores for accurate predictions of complex scenarios
        const efficiencyScore = prediction.outcome.matchScore * 
                               (1 + (actualComplexity - 1) / 9); // Scales up with complexity
        
        complexityEfficiency += efficiencyScore * complexityAccuracy;
        validPredictions++;
      }
    }
  }
  
  return validPredictions > 0 ? Math.min(1, complexityEfficiency / validPredictions) : 0;
}

/**
 * Calculate statistical significance
 */
function calculateStatisticalSignificance(
  reviewPoints: ForesightDataPoint[]
): boolean {
  if (reviewPoints.length < 5) {
    return false;
  }
  
  // Extract match scores for each validated prediction
  const matchScores: number[] = [];
  
  for (const point of reviewPoints) {
    for (const prediction of point.predictions) {
      if (prediction.outcome) {
        matchScores.push(prediction.outcome.matchScore);
      }
    }
  }
  
  if (matchScores.length < 10) {
    return false; // Need at least 10 validated predictions
  }
  
  // Split into first half and second half
  const midpoint = Math.floor(matchScores.length / 2);
  const firstHalf = matchScores.slice(0, midpoint);
  const secondHalf = matchScores.slice(midpoint);
  
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
 * Generate recommendations based on foresight validation
 */
function generateRecommendations(
  overallPredictiveAccuracy: number,
  accuracyTrend: ForesightValidationResult['accuracyTrend'],
  confidenceCalibraton: number,
  timeHorizonPerformance: ForesightValidationResult['timeHorizonPerformance'],
  domainSpecificAccuracy: Record<string, number>,
  blindSpots: ForesightValidationResult['blindSpots'],
  learningMetrics: ForesightValidationResult['learningMetrics']
): string[] {
  const recommendations: string[] = [];
  
  // Overall accuracy recommendations
  if (overallPredictiveAccuracy < 0.5) {
    recommendations.push('Overall predictive accuracy is low - implement more rigorous prediction protocols');
  }
  
  // Accuracy trend recommendations
  if (accuracyTrend === 'declining') {
    recommendations.push('Predictive accuracy is declining - conduct system-wide prediction audit');
  }
  
  // Confidence calibration recommendations
  if (confidenceCalibraton < 0.6) {
    recommendations.push('Confidence calibration is poor - recalibrate confidence estimation algorithms');
  }
  
  // Time horizon recommendations
  const weakestHorizon = Object.entries(timeHorizonPerformance)
    .sort(([_, a], [__, b]) => a - b)[0][0];
  
  if (timeHorizonPerformance[weakestHorizon as keyof typeof timeHorizonPerformance] < 0.5) {
    recommendations.push(`${weakestHorizon} predictions are weak - enhance forecasting methods for this time horizon`);
  }
  
  // Domain-specific recommendations
  const weakDomains = Object.entries(domainSpecificAccuracy)
    .filter(([_, accuracy]) => accuracy < 0.5)
    .map(([domain, _]) => domain);
  
  if (weakDomains.length > 0) {
    recommendations.push(`Low accuracy in domains: ${weakDomains.join(', ')} - increase training in these areas`);
  }
  
  // Blind spot recommendations
  if (blindSpots.consistentlyMissedFactors.length > 0) {
    recommendations.push(`Consistently missing factors: ${blindSpots.consistentlyMissedFactors.join(', ')} - expand factor analysis`);
  }
  
  if (blindSpots.overconfidentAreas.length > 0) {
    recommendations.push(`Overconfident in areas: ${blindSpots.overconfidentAreas.join(', ')} - implement confidence penalties`);
  }
  
  if (blindSpots.underconfidentAreas.length > 0) {
    recommendations.push(`Underconfident in areas: ${blindSpots.underconfidentAreas.join(', ')} - boost confidence estimation`);
  }
  
  // Learning metrics recommendations
  if (learningMetrics.predictionRefinementRate < 0.4) {
    recommendations.push('Slow prediction refinement - implement more aggressive learning algorithms');
  }
  
  if (learningMetrics.noveltyHandling < 0.5) {
    recommendations.push('Poor novelty handling - enhance factor discovery mechanisms');
  }
  
  if (learningMetrics.complexityManagement < 0.5) {
    recommendations.push('Weak complexity management - implement hierarchical prediction structures');
  }
  
  // Ensure we have at least one recommendation
  if (recommendations.length === 0) {
    recommendations.push('Foresight capabilities are learning effectively - continue current approach');
  }
  
  return recommendations;
}

/**
 * Create a default validation result when insufficient data is available
 */
function createDefaultValidationResult(
  reason: string
): ForesightValidationResult {
  return {
    id: uuidv4(),
    timestamp: new Date(),
    overallPredictiveAccuracy: 0.5,
    accuracyTrend: 'stable',
    confidenceCalibraton: 0.5,
    timeHorizonPerformance: {
      shortTerm: 0.5,
      mediumTerm: 0.5,
      longTerm: 0.5
    },
    domainSpecificAccuracy: {},
    blindSpots: {
      consistentlyMissedFactors: [],
      overconfidentAreas: [],
      underconfidentAreas: []
    },
    learningMetrics: {
      predictionRefinementRate: 0.5,
      noveltyHandling: 0.5,
      complexityManagement: 0.5
    },
    isStatisticallySignificant: false,
    recommendations: [
      reason,
      'Collect validated predictions to enable foresight validation'
    ]
  };
}

/**
 * Get foresight history
 * 
 * @returns Foresight history data points
 */
export function getForesightHistory(): ForesightDataPoint[] {
  return [...foresightHistory];
}

/**
 * Clear foresight history (for testing purposes)
 */
export function clearForesightHistory(): void {
  foresightHistory.length = 0;
}