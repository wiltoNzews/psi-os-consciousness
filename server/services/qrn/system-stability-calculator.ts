/**
 * System Stability Calculator
 * 
 * This service implements the standardized Stability formula (S = 1 - Var(bits))
 * to assess the overall quantum system stability. It integrates with the Inverse
 * Pendulum Module (MODULE_7) to provide dynamic balance management.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

import { QuantumGlossary } from './quantum-glossary.js';

// Initialize quantum glossary for context tagging
const quantumGlossary = new QuantumGlossary();

// Type definitions for stability metrics
export interface SystemStabilityMetrics {
  overallStability: number;              // 0-1 scale, overall stability score
  componentStabilities: {                // Individual stability scores for major system components
    quantumRootNodes: number;            // QRN stability
    neuralPathways: number;              // Neural pathway network stability
    chunks: number;                      // Chunk processing stability
    adaptiveResonances: number;          // Adaptive resonance stability
    metaCognitiveEvents: number;         // Meta-cognitive event processing stability
    coherenceNetwork: number;            // Coherence network stability
  };
  variances: {                           // Measured variances in key system metrics
    processingTime: number;              // Variance in processing times
    errorRate: number;                   // Variance in error rates
    memoryUsage: number;                 // Variance in memory usage
    coherence: number;                   // Variance in coherence measures
  };
  timestamps: {                          // Timing information
    calculatedAt: Date;                  // When this stability calculation was performed
    periodStart: Date;                   // Start of measurement period
    periodEnd: Date;                     // End of measurement period
  };
  // Fractal dimensions analysis would be here for advanced stability metrics
}

// Configuration for stability calculation
interface StabilityCalculatorConfig {
  measurementPeriodMs: number;           // Time window for stability measurement
  componentWeights: {                    // Weights for each component in overall stability
    quantumRootNodes: number;
    neuralPathways: number;
    chunks: number;
    adaptiveResonances: number;
    metaCognitiveEvents: number;
    coherenceNetwork: number;
  };
  varianceWeights: {                     // Weights for each variance type in overall stability
    processingTime: number;
    errorRate: number;
    memoryUsage: number;
    coherence: number;
  };
  updateFrequencyMs: number;             // How often to recalculate stability
}

// Default configuration
const DEFAULT_CONFIG: StabilityCalculatorConfig = {
  measurementPeriodMs: 3600000,          // 1 hour by default
  componentWeights: {
    quantumRootNodes: 0.20,
    neuralPathways: 0.15,
    chunks: 0.20,
    adaptiveResonances: 0.15,
    metaCognitiveEvents: 0.15,
    coherenceNetwork: 0.15
  },
  varianceWeights: {
    processingTime: 0.30,
    errorRate: 0.40,
    memoryUsage: 0.10,
    coherence: 0.20
  },
  updateFrequencyMs: 300000              // 5 minutes by default
};

/**
 * System Stability Calculator class
 * Implements the standardized Stability (S) formula:
 * S = 1 - Var(bits)
 */
export class SystemStabilityCalculator {
  private config: StabilityCalculatorConfig;
  private metrics: SystemStabilityMetrics;
  private updateTimer: NodeJS.Timeout | null = null;
  private processingTimeHistory: number[] = [];
  private errorRateHistory: number[] = [];
  private memoryUsageHistory: number[] = [];
  private coherenceHistory: number[] = [];
  
  constructor(config: Partial<StabilityCalculatorConfig> = {}) {
    // Merge provided config with defaults
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      componentWeights: {
        ...DEFAULT_CONFIG.componentWeights,
        ...config.componentWeights
      },
      varianceWeights: {
        ...DEFAULT_CONFIG.varianceWeights,
        ...config.varianceWeights
      }
    };
    
    // Initialize metrics
    this.metrics = this.initializeMetrics();
    
    // Setup periodic calculation
    this.startPeriodicCalculation();
    
    quantumGlossary.tagWithContext('[SYS] System Stability Calculator initialized');
  }
  
  /**
   * Initialize metrics with default values
   */
  private initializeMetrics(): SystemStabilityMetrics {
    const now = new Date();
    const periodStart = new Date(now.getTime() - this.config.measurementPeriodMs);
    
    return {
      overallStability: 0.5,  // Start with neutral stability
      componentStabilities: {
        quantumRootNodes: 0.5,
        neuralPathways: 0.5,
        chunks: 0.5,
        adaptiveResonances: 0.5,
        metaCognitiveEvents: 0.5,
        coherenceNetwork: 0.5
      },
      variances: {
        processingTime: 0.5,
        errorRate: 0.5,
        memoryUsage: 0.5,
        coherence: 0.5
      },
      timestamps: {
        calculatedAt: now,
        periodStart,
        periodEnd: now
      }
    };
  }
  
  /**
   * Start periodic stability calculation
   */
  private startPeriodicCalculation(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
    
    this.updateTimer = setInterval(() => {
      this.calculateSystemStability();
    }, this.config.updateFrequencyMs);
  }
  
  /**
   * Stop periodic stability calculation
   */
  public stopPeriodicCalculation(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }
  
  /**
   * Calculate the overall system stability
   * Implements the S = 1 - Var(bits) formula in a weighted, multi-component way
   */
  public calculateSystemStability(): SystemStabilityMetrics {
    try {
      const now = new Date();
      const periodStart = new Date(now.getTime() - this.config.measurementPeriodMs);
      
      // Calculate component stabilities
      const componentStabilities = this.calculateComponentStabilities();
      
      // Calculate variances
      const variances = this.calculateVariances();
      
      // Calculate overall stability as weighted average of components
      // and adjusted by variances
      let overallStability = this.calculateWeightedStability(componentStabilities, variances);
      
      // Create updated metrics
      this.metrics = {
        overallStability,
        componentStabilities,
        variances,
        timestamps: {
          calculatedAt: now,
          periodStart,
          periodEnd: now
        }
      };
      
      // Log and record metrics
      quantumGlossary.tagWithContext(`[SYS] System stability calculated: ${overallStability.toFixed(4)}`);
      
      quantumGlossary.recordFlowMetric(
        'SYSTEM_STABILITY',
        'system-stability-calculator',
        overallStability,
        {
          componentStabilities,
          variances,
          timestamp: now.toISOString()
        }
      );
      
      return this.metrics;
    } catch (error) {
      quantumGlossary.logError('Error calculating system stability', error as Error);
      return this.metrics;
    }
  }
  
  /**
   * Calculate stability of individual system components
   */
  private calculateComponentStabilities(): SystemStabilityMetrics['componentStabilities'] {
    // In a full implementation, these would be calculated based on actual metrics
    // from the corresponding system components
    
    // For now, use simulated values based on historical data
    return {
      quantumRootNodes: this.calculateComponentStability('quantumRootNodes'),
      neuralPathways: this.calculateComponentStability('neuralPathways'),
      chunks: this.calculateComponentStability('chunks'),
      adaptiveResonances: this.calculateComponentStability('adaptiveResonances'),
      metaCognitiveEvents: this.calculateComponentStability('metaCognitiveEvents'),
      coherenceNetwork: this.calculateComponentStability('coherenceNetwork')
    };
  }
  
  /**
   * Calculate stability for a specific component
   * S = 1 - Var(metrics)
   */
  private calculateComponentStability(component: string): number {
    // In a full implementation, get real metrics for this component
    // For now, use simulated values with some randomness
    
    // Generate synthetic operation bits (0/1) for demonstration
    // In a real system, these would be performance indicators, error flags, etc.
    const operationBits = Array.from({ length: 100 }, () => Math.random() > 0.7 ? 0 : 1);
    
    // Calculate variance of these operations
    const mean = operationBits.reduce((sum, bit) => sum + bit, 0) / operationBits.length;
    const variance = operationBits.reduce((sum, bit) => sum + Math.pow(bit - mean, 2), 0) / operationBits.length;
    
    // Apply the S = 1 - Var(bits) formula
    const stability = 1 - variance;
    
    return stability;
  }
  
  /**
   * Calculate variances in key system metrics
   */
  private calculateVariances(): SystemStabilityMetrics['variances'] {
    // In a full implementation, calculate real variances from collected metrics
    
    // For now, calculate variances of our synthetic histories
    return {
      processingTime: this.calculateMetricVariance(this.processingTimeHistory),
      errorRate: this.calculateMetricVariance(this.errorRateHistory),
      memoryUsage: this.calculateMetricVariance(this.memoryUsageHistory),
      coherence: this.calculateMetricVariance(this.coherenceHistory)
    };
  }
  
  /**
   * Calculate variance of a metric history
   * Then convert to stability score (1 - normalized variance)
   */
  private calculateMetricVariance(history: number[]): number {
    if (history.length < 2) {
      return 0.5; // Default mid-point if not enough data
    }
    
    const mean = history.reduce((sum, value) => sum + value, 0) / history.length;
    const variance = history.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / history.length;
    
    // Normalize variance to 0-1 range
    // Higher variance means lower stability
    const normalizedVariance = Math.min(1, variance / (mean * mean + 0.0001));
    
    // Apply S = 1 - Var formula
    return 1 - normalizedVariance;
  }
  
  /**
   * Calculate weighted stability from component stabilities and variances
   */
  private calculateWeightedStability(
    componentStabilities: SystemStabilityMetrics['componentStabilities'],
    variances: SystemStabilityMetrics['variances']
  ): number {
    // Calculate weighted component stability
    const componentStabilityScore = 
      componentStabilities.quantumRootNodes * this.config.componentWeights.quantumRootNodes + 
      componentStabilities.neuralPathways * this.config.componentWeights.neuralPathways +
      componentStabilities.chunks * this.config.componentWeights.chunks +
      componentStabilities.adaptiveResonances * this.config.componentWeights.adaptiveResonances +
      componentStabilities.metaCognitiveEvents * this.config.componentWeights.metaCognitiveEvents +
      componentStabilities.coherenceNetwork * this.config.componentWeights.coherenceNetwork;
    
    // Calculate weighted variance stability
    const varianceStabilityScore =
      variances.processingTime * this.config.varianceWeights.processingTime +
      variances.errorRate * this.config.varianceWeights.errorRate +
      variances.memoryUsage * this.config.varianceWeights.memoryUsage +
      variances.coherence * this.config.varianceWeights.coherence;
    
    // Combine with 70% weight on components, 30% on variances
    return componentStabilityScore * 0.7 + varianceStabilityScore * 0.3;
  }
  
  /**
   * Record processing time for a system operation
   */
  public recordProcessingTime(operationName: string, timeMs: number): void {
    this.processingTimeHistory.push(timeMs);
    
    // Keep history within measurement period
    this.trimHistory(this.processingTimeHistory);
  }
  
  /**
   * Record an error occurrence
   */
  public recordError(errorType: string, errorDetails: any): void {
    // For error rate, we just count occurrences in the time window
    this.errorRateHistory.push(1);
    
    // Keep history within measurement period
    this.trimHistory(this.errorRateHistory);
    
    // Log error
    quantumGlossary.logError(`System stability error recorded: ${errorType}`, errorDetails);
  }
  
  /**
   * Record memory usage
   */
  public recordMemoryUsage(usageBytes: number): void {
    this.memoryUsageHistory.push(usageBytes);
    
    // Keep history within measurement period
    this.trimHistory(this.memoryUsageHistory);
  }
  
  /**
   * Record coherence measure
   */
  public recordCoherence(coherenceValue: number): void {
    this.coherenceHistory.push(coherenceValue);
    
    // Keep history within measurement period
    this.trimHistory(this.coherenceHistory);
  }
  
  /**
   * Trim a history array to keep only records within the measurement period
   */
  private trimHistory(history: number[]): void {
    // Remove elements beyond our max history size
    const maxHistorySize = Math.ceil(this.config.measurementPeriodMs / this.config.updateFrequencyMs) * 2;
    
    if (history.length > maxHistorySize) {
      history.splice(0, history.length - maxHistorySize);
    }
  }
  
  /**
   * Get the most recent stability metrics
   */
  public getStabilityMetrics(): SystemStabilityMetrics {
    return this.metrics;
  }
}

// Export a singleton instance
export const systemStabilityCalculator = new SystemStabilityCalculator();

// Export the module
export default systemStabilityCalculator;