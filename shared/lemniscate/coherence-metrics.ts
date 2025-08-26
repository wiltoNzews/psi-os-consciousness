/**
 * Coherence Metrics
 * 
 * This module provides metrics calculation for the coherence system,
 * implementing the mathematical foundation of the QCTF (Quantum Coherence Threshold Formula).
 * 
 * Key formulas:
 * - QCTF = CI + (GEF × QEAI × cos θ)
 *   Where CI is Coherence Index, GEF is Global Entropy Factor,
 *   QEAI is Quantum Entanglement AI Index, and θ is phase parameter
 * 
 * - Stability value = 3/(3+1) = 0.7500
 * - Exploration value = 1/(1+3) = 0.2500 (observed at 0.2494)
 * 
 * [QUANTUM_STATE: METRICS]
 */

/**
 * System state metric types
 */
export enum MetricType {
  COHERENCE = 'coherence',
  ENTROPY = 'entropy',
  VARIANT_COUNT = 'variant_count',
  INSIGHT_COUNT = 'insight_count',
  BIFURCATION = 'bifurcation',
  QCTF = 'qctf'
}

/**
 * Temporal scales for metrics
 */
export enum MetricScale {
  INSTANT = 'instant',
  MICRO = 'micro',
  MESO = 'meso',
  MACRO = 'macro'
}

/**
 * Metric sample point
 */
export interface MetricSample {
  type: MetricType;
  value: number;
  timestamp: number;
  scale: MetricScale;
  metadata?: Record<string, any>;
}

/**
 * Coherence Index history
 */
export interface CoherenceHistory {
  samples: MetricSample[];
  currentValue: number;
  targetValue: number;
  averageValue: number;
  minValue: number;
  maxValue: number;
  standardDeviation: number;
  scale: MetricScale;
}

/**
 * Class for calculating and tracking coherence metrics
 */
export class CoherenceMetrics {
  private history: Map<MetricType, Map<MetricScale, MetricSample[]>> = new Map();
  private currentValues: Map<MetricType, Map<MetricScale, number>> = new Map();
  private targetCoherence: number = 0.2494; // Default exploration mode
  
  /**
   * Initialize the Coherence Metrics
   */
  constructor() {
    // Initialize metrics history storage
    Object.values(MetricType).forEach(metricType => {
      this.history.set(metricType, new Map());
      this.currentValues.set(metricType, new Map());
      
      Object.values(MetricScale).forEach(scale => {
        this.history.get(metricType)?.set(scale, []);
        this.currentValues.get(metricType)?.set(scale, 0.0);
      });
    });
    
    // Set initial values for coherence
    this.setCurrentValue(MetricType.COHERENCE, MetricScale.INSTANT, 0.2494);
    this.setCurrentValue(MetricType.COHERENCE, MetricScale.MICRO, 0.2494);
    this.setCurrentValue(MetricType.COHERENCE, MetricScale.MESO, 0.2494);
    this.setCurrentValue(MetricType.COHERENCE, MetricScale.MACRO, 0.2494);
    
    // Set initial values for insight/variant counts
    this.setCurrentValue(MetricType.INSIGHT_COUNT, MetricScale.INSTANT, 580);
    this.setCurrentValue(MetricType.VARIANT_COUNT, MetricScale.INSTANT, 2);
    
    // Add initial samples
    this.addSample({
      type: MetricType.COHERENCE,
      value: 0.2494,
      timestamp: Date.now(),
      scale: MetricScale.INSTANT,
      metadata: {
        phase: 'exploration',
        insight_count: 580,
        variant_count: 2
      }
    });
    
    // Calculate initial QCTF value
    this.calculateQCTF(0.2494, 2, 580, Date.now());
  }
  
  /**
   * Calculate the QCTF value
   */
  public calculateQCTF(
    coherence: number,
    variantCount: number,
    insightCount: number,
    timestamp: number = Date.now()
  ): number {
    // Global Entropy Factor (GEF) - derived from variant count
    const globalEntropyFactor = Math.log(variantCount + 1) / Math.log(5); // Normalize to 0-1 range
    
    // Quantum Entanglement AI Index (QEAI) - derived from insight count
    const qeai = Math.min(1.0, Math.log(insightCount + 1) / Math.log(1000));
    
    // Phase parameter (cycles with time)
    const phaseRadians = (timestamp % 86400000) / 86400000 * 2 * Math.PI; // Daily cycle
    
    // CI is the base coherence index
    const coherenceIndex = coherence;
    
    // QCTF = CI + (GEF × QEAI × cos θ)
    const qctf = coherenceIndex + (globalEntropyFactor * qeai * Math.cos(phaseRadians) * 0.1);
    
    // Save the calculated QCTF
    this.setCurrentValue(MetricType.QCTF, MetricScale.INSTANT, qctf);
    
    // Add sample
    this.addSample({
      type: MetricType.QCTF,
      value: qctf,
      timestamp,
      scale: MetricScale.INSTANT,
      metadata: {
        coherence_index: coherenceIndex,
        global_entropy_factor: globalEntropyFactor,
        qeai: qeai,
        phase: phaseRadians
      }
    });
    
    return qctf;
  }
  
  /**
   * Set the current value for a metric at a specific scale
   */
  public setCurrentValue(type: MetricType, scale: MetricScale, value: number): void {
    const scaleMap = this.currentValues.get(type);
    if (scaleMap) {
      scaleMap.set(scale, value);
    }
    
    // If this is the instant scale, propagate to temporal scales with smoothing
    if (scale === MetricScale.INSTANT) {
      this.updateTemporalScale(MetricScale.MICRO);
      // Only occasionally update larger scales to simulate slower changes
      if (Math.random() < 0.2) this.updateTemporalScale(MetricScale.MESO);
      if (Math.random() < 0.05) this.updateTemporalScale(MetricScale.MACRO);
    }
    
    // Add sample for non-instant scales
    if (scale !== MetricScale.INSTANT) {
      this.addSample({
        type,
        value,
        timestamp: Date.now(),
        scale
      });
    }
  }
  
  /**
   * Get the current value for a metric at a specific scale
   */
  public getCurrentValue(type: MetricType, scale: MetricScale): number {
    const scaleMap = this.currentValues.get(type);
    if (scaleMap) {
      return scaleMap.get(scale) || 0;
    }
    return 0;
  }
  
  /**
   * Add a metric sample
   */
  public addSample(sample: MetricSample): void {
    const typeMap = this.history.get(sample.type);
    if (typeMap) {
      const samples = typeMap.get(sample.scale);
      if (samples) {
        samples.push(sample);
        
        // Limit history size
        if (samples.length > 1000) {
          samples.shift();
        }
      }
    }
  }
  
  /**
   * Get history for a specific metric at a specific scale
   */
  public getHistory(
    type: MetricType,
    scale: MetricScale,
    limit: number = 100
  ): MetricSample[] {
    const typeMap = this.history.get(type);
    if (typeMap) {
      const samples = typeMap.get(scale) || [];
      return samples.slice(-limit);
    }
    return [];
  }
  
  /**
   * Get coherence history with statistics
   */
  public getCoherenceHistory(scale: MetricScale = MetricScale.MICRO): CoherenceHistory {
    const samples = this.getHistory(MetricType.COHERENCE, scale);
    const values = samples.map(s => s.value);
    
    // Calculate statistics
    const currentValue = this.getCurrentValue(MetricType.COHERENCE, scale);
    const averageValue = values.length > 0 
      ? values.reduce((a, b) => a + b, 0) / values.length 
      : 0;
    const minValue = values.length > 0 
      ? Math.min(...values) 
      : 0;
    const maxValue = values.length > 0 
      ? Math.max(...values) 
      : 0;
    
    // Calculate standard deviation
    const squareDiffs = values.map(value => {
      const diff = value - averageValue;
      return diff * diff;
    });
    const standardDeviation = values.length > 0
      ? Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length)
      : 0;
    
    return {
      samples,
      currentValue,
      targetValue: this.targetCoherence,
      averageValue,
      minValue,
      maxValue,
      standardDeviation,
      scale
    };
  }
  
  /**
   * Set the target coherence value (0.7500 for stability or 0.2494 for exploration)
   */
  public setTargetCoherence(target: number): void {
    this.targetCoherence = target;
  }
  
  /**
   * Generate simulated metrics for demonstration
   */
  public simulateMetricsUpdate(): void {
    const now = Date.now();
    const coherence = this.getCurrentValue(MetricType.COHERENCE, MetricScale.INSTANT);
    let variantCount = Math.round(this.getCurrentValue(MetricType.VARIANT_COUNT, MetricScale.INSTANT));
    let insightCount = Math.round(this.getCurrentValue(MetricType.INSIGHT_COUNT, MetricScale.INSTANT));
    
    // Update variant count based on coherence
    // In stability mode (higher coherence), variants decrease
    // In exploration mode (lower coherence), variants increase
    if (coherence > 0.5) {
      // Stability mode - decrease variants over time
      if (variantCount > 1 && Math.random() < 0.3) {
        variantCount--;
      }
    } else {
      // Exploration mode - increase variants over time
      if (variantCount < 4 && Math.random() < 0.4) {
        variantCount++;
      }
    }
    
    // Insights always increase over time, but at different rates
    if (Math.random() < 0.7) {
      insightCount++;
    }
    
    // Calculate entropy based on variant count and coherence
    const entropy = (1 - coherence) * Math.log(variantCount + 1) / Math.log(5);
    
    // Set updated values
    this.setCurrentValue(MetricType.VARIANT_COUNT, MetricScale.INSTANT, variantCount);
    this.setCurrentValue(MetricType.INSIGHT_COUNT, MetricScale.INSTANT, insightCount);
    this.setCurrentValue(MetricType.ENTROPY, MetricScale.INSTANT, entropy);
    
    // Calculate QCTF
    this.calculateQCTF(coherence, variantCount, insightCount, now);
    
    // Add coherence sample with metadata
    this.addSample({
      type: MetricType.COHERENCE,
      value: coherence,
      timestamp: now,
      scale: MetricScale.INSTANT,
      metadata: {
        phase: coherence > 0.5 ? 'stability' : 'exploration',
        insight_count: insightCount,
        variant_count: variantCount,
        entropy: entropy
      }
    });
  }
  
  /**
   * Update a temporal scale with current instant values (with smoothing)
   */
  private updateTemporalScale(scale: MetricScale): void {
    // Get the current instant value for coherence
    const instantCoherence = this.getCurrentValue(MetricType.COHERENCE, MetricScale.INSTANT);
    
    // Get the current temporal scale value
    const currentScaleValue = this.getCurrentValue(MetricType.COHERENCE, scale);
    
    // Apply smoothing factor based on scale
    const smoothingFactor = scale === MetricScale.MICRO 
      ? 0.3  // 30% weight to new value for micro
      : scale === MetricScale.MESO
        ? 0.1  // 10% weight to new value for meso
        : 0.03; // 3% weight to new value for macro
    
    // Calculate new smoothed value
    const newValue = currentScaleValue * (1 - smoothingFactor) + instantCoherence * smoothingFactor;
    
    // Update the temporal scale
    this.setCurrentValue(MetricType.COHERENCE, scale, newValue);
  }
  
  /**
   * Get metrics for all temporal scales
   */
  public getAllScaleMetrics(): Record<MetricScale, Record<MetricType, number>> {
    const result: Record<MetricScale, Record<MetricType, number>> = {
      [MetricScale.INSTANT]: {},
      [MetricScale.MICRO]: {},
      [MetricScale.MESO]: {},
      [MetricScale.MACRO]: {}
    };
    
    // Fill result with current values
    Object.values(MetricScale).forEach(scale => {
      Object.values(MetricType).forEach(metricType => {
        result[scale][metricType] = this.getCurrentValue(metricType, scale);
      });
    });
    
    return result;
  }
}

// Singleton instance
let metricsInstance: CoherenceMetrics | null = null;

/**
 * Get the Coherence Metrics instance
 */
export function getCoherenceMetrics(): CoherenceMetrics {
  if (!metricsInstance) {
    metricsInstance = new CoherenceMetrics();
  }
  
  return metricsInstance;
}