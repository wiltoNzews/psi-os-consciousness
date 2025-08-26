/**
 * REG Analyzer Service
 * 
 * This service analyzes Random Event Generator (REG) data streams
 * from quantum experiments to detect statistically significant deviations
 * that may correlate with collective human intent.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

import { QuantumGlossary } from '../qrn/quantum-glossary.js';
import { calculateREGShift, calculateSignificance, calculateStandardError, calculateBitStability } from './statistical-validator.js';

// Initialize quantum glossary for context tagging
const quantumGlossary = new QuantumGlossary();

// Type definitions
export interface REGExperimentData {
  id: string;
  experimentName: string;
  experimenterId: string;
  startTime: Date;
  endTime: Date;
  intentPeriods: IntentPeriod[];
  controlPeriods: ControlPeriod[];
  participants: number;
  averageCoherence: number;
  settings: ExperimentSettings;
  results?: ExperimentResults;
}

export interface IntentPeriod {
  id: string;
  startTime: Date;
  endTime: Date;
  intentDirection: 'high' | 'low';
  intentStrength: number;
  coherence: number;
  bits: number[];
}

export interface ControlPeriod {
  id: string;
  startTime: Date;
  endTime: Date;
  bits: number[];
}

export interface ExperimentSettings {
  intentDurationSeconds: number;
  controlDurationSeconds: number;
  samplesPerSecond: number;
  alternatingPattern: boolean;
  intentFirst: boolean;
  blindCondition: boolean;
}

export interface ExperimentResults {
  regShift: number;
  standardError: number;
  significance: number;
  stability: number;
  pValue: number;
  confidenceInterval: [number, number];
  bitsAnalyzed: number;
  anomalyScore: number;
}

// Constants
const MIN_SAMPLES_FOR_ANALYSIS = 100;
const ANOMALY_THRESHOLD = 2.0; // Z-score threshold for anomalies

/**
 * Analyze a complete REG experiment
 * Applies the TSAR BOMBA standardized formulas for REG Shift and Significance
 * 
 * @param experiment - The REG experiment data to analyze
 * @returns The updated experiment with results
 */
export function analyzeREGExperiment(experiment: REGExperimentData): REGExperimentData {
  try {
    // Extract all bits from intent and control periods
    const allIntentBits = experiment.intentPeriods.flatMap(period => period.bits);
    const allControlBits = experiment.controlPeriods.flatMap(period => period.bits);
    
    // Check if we have enough data
    if (allIntentBits.length < MIN_SAMPLES_FOR_ANALYSIS || allControlBits.length < MIN_SAMPLES_FOR_ANALYSIS) {
      quantumGlossary.logError(`Insufficient samples for analysis. Need at least ${MIN_SAMPLES_FOR_ANALYSIS} per condition.`, 
        new Error('Insufficient data'));
      return experiment;
    }
    
    // Calculate core metrics using the standardized formulas
    const regShift = calculateREGShift(allIntentBits, allControlBits);
    const standardError = calculateStandardError(allIntentBits);
    const significance = calculateSignificance(regShift, standardError);
    const stability = calculateBitStability([...allIntentBits, ...allControlBits]);
    
    // Calculate p-value from z-score (significance)
    const pValue = Math.min(1, 2 * (1 - normCDF(Math.abs(significance))));
    
    // Calculate 95% confidence interval
    const halfInterval = 1.96 * standardError;
    const confidenceInterval: [number, number] = [
      Math.max(0, regShift - halfInterval),
      regShift + halfInterval
    ];
    
    // Calculate anomaly score (how unusual is this result)
    const anomalyScore = calculateAnomalyScore(significance, stability, experiment.averageCoherence);
    
    // Create results object
    const results: ExperimentResults = {
      regShift,
      standardError,
      significance,
      stability,
      pValue,
      confidenceInterval,
      bitsAnalyzed: allIntentBits.length + allControlBits.length,
      anomalyScore
    };
    
    // Log the analysis
    quantumGlossary.tagWithContext(`[QCO] REG experiment analyzed: ID=${experiment.id}, Shift=${regShift.toFixed(4)}%, Significance=${significance.toFixed(2)}`);
    
    // Record flow metrics
    quantumGlossary.recordFlowMetric(
      'EXPERIMENT_COMPLETE',
      'reg-analyzer',
      significance,
      {
        experimentId: experiment.id,
        participantCount: experiment.participants,
        coherence: experiment.averageCoherence,
        regShift,
        significance,
        pValue,
        anomalyScore,
        bitsAnalyzed: allIntentBits.length + allControlBits.length
      }
    );
    
    // Return updated experiment with results
    return {
      ...experiment,
      results
    };
  } catch (error) {
    quantumGlossary.logError('Error analyzing REG experiment', error as Error);
    return experiment;
  }
}

/**
 * Analyze a real-time stream of REG data
 * For ongoing experiments with continuous updates
 * 
 * @param intentBits - Current accumulated intent condition bits
 * @param controlBits - Current accumulated control condition bits
 * @param coherence - Current coherence measure
 * @returns Real-time analysis results
 */
export function analyzeREGStream(
  intentBits: number[],
  controlBits: number[],
  coherence: number
): Partial<ExperimentResults> {
  try {
    // Check if we have enough data for a meaningful analysis
    if (intentBits.length < MIN_SAMPLES_FOR_ANALYSIS || controlBits.length < MIN_SAMPLES_FOR_ANALYSIS) {
      return {
        regShift: 0,
        significance: 0,
        stability: calculateBitStability([...intentBits, ...controlBits]),
        bitsAnalyzed: intentBits.length + controlBits.length
      };
    }
    
    // Calculate core metrics
    const regShift = calculateREGShift(intentBits, controlBits);
    const standardError = calculateStandardError(intentBits);
    const significance = calculateSignificance(regShift, standardError);
    const stability = calculateBitStability([...intentBits, ...controlBits]);
    
    // Calculate p-value
    const pValue = Math.min(1, 2 * (1 - normCDF(Math.abs(significance))));
    
    // Record real-time metrics
    quantumGlossary.recordFlowMetric(
      'REALTIME_REG_ANALYSIS',
      'reg-analyzer',
      significance,
      {
        sampleSize: intentBits.length + controlBits.length,
        coherence,
        regShift,
        significance,
        stability
      }
    );
    
    return {
      regShift,
      standardError,
      significance,
      stability,
      pValue,
      bitsAnalyzed: intentBits.length + controlBits.length
    };
  } catch (error) {
    quantumGlossary.logError('Error analyzing real-time REG stream', error as Error);
    return {
      regShift: 0,
      significance: 0,
      stability: 0,
      bitsAnalyzed: intentBits.length + controlBits.length
    };
  }
}

/**
 * Calculate an overall anomaly score for the experiment
 * Combines significance, stability, and coherence
 * 
 * @param significance - Statistical significance (z-score)
 * @param stability - System stability measure
 * @param coherence - Group coherence measure
 * @returns Anomaly score (higher = more anomalous)
 */
function calculateAnomalyScore(significance: number, stability: number, coherence: number): number {
  // Weighted combination of factors:
  // - High significance increases anomaly score
  // - High stability with high significance is more anomalous
  // - High coherence with high significance is more anomalous
  const baseScore = Math.abs(significance);
  const stabilityFactor = stability > 0.5 ? (stability - 0.5) * 2 : 0;
  const coherenceFactor = coherence > 0.3 ? (coherence - 0.3) * 2 : 0;
  
  // Final formula weights significance most heavily, then stability and coherence
  return baseScore * (1 + 0.2 * stabilityFactor + 0.3 * coherenceFactor);
}

/**
 * Detect significant anomalies in a REG data stream
 * 
 * @param recentBits - Recent window of bits to analyze
 * @param baselineMean - Expected mean from baseline/control
 * @param baselineStdDev - Expected standard deviation from baseline
 * @returns True if an anomaly is detected
 */
export function detectREGAnomaly(
  recentBits: number[],
  baselineMean: number,
  baselineStdDev: number
): boolean {
  if (recentBits.length < 30 || baselineStdDev === 0) {
    return false;
  }
  
  try {
    // Calculate mean of recent window
    const windowMean = recentBits.reduce((sum, bit) => sum + bit, 0) / recentBits.length;
    
    // Calculate z-score of window mean compared to baseline
    const zScore = Math.abs((windowMean - baselineMean) / (baselineStdDev / Math.sqrt(recentBits.length)));
    
    // Detect anomaly if z-score exceeds threshold
    const isAnomaly = zScore > ANOMALY_THRESHOLD;
    
    if (isAnomaly) {
      quantumGlossary.tagWithContext(`[QCO] REG anomaly detected: z-score=${zScore.toFixed(2)}, threshold=${ANOMALY_THRESHOLD}`);
      
      quantumGlossary.recordFlowMetric(
        'REG_ANOMALY',
        'reg-analyzer',
        zScore,
        {
          windowMean,
          baselineMean,
          baselineStdDev,
          windowSize: recentBits.length,
          threshold: ANOMALY_THRESHOLD
        }
      );
    }
    
    return isAnomaly;
  } catch (error) {
    quantumGlossary.logError('Error detecting REG anomaly', error as Error);
    return false;
  }
}

/**
 * Standard normal cumulative distribution function (helper function)
 * 
 * @param z - Z-score
 * @returns Cumulative probability
 */
function normCDF(z: number): number {
  // Approximation of the cumulative distribution function
  // for the standard normal distribution
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  
  const p = 0.2316419;
  const c = 0.39894228;
  
  if (z >= 0) {
    const t = 1.0 / (1.0 + p * z);
    return 1.0 - c * Math.exp(-z * z / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  } else {
    const t = 1.0 / (1.0 - p * z);
    return c * Math.exp(-z * z / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  }
}

// Export the module
export default {
  analyzeREGExperiment,
  analyzeREGStream,
  detectREGAnomaly
};