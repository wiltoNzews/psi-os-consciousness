/**
 * QCO Sensitivity Analysis Module
 * 
 * This service performs sensitivity analysis calculations for the Quantum Consciousness Operator (QCO) v3.1
 * to optimize experimental parameters for physical pilot studies. It helps determine the required
 * sample sizes and experiment durations needed to achieve statistical significance.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

import { quantumIntentExperiment } from './quantum-intent-experiment.js';
import { QuantumGlossary } from '../qrn/quantum-glossary.js';

// Create a local instance of QuantumGlossary for this module
// This avoids circular dependency issues with the singleton instance
const qcoGlossary = new QuantumGlossary();

// Types for sensitivity analysis
export interface QCOSensitivityParameters {
  // Quantum coupling constant range
  qRange: {
    min: number;      // Minimum value of Q to test
    max: number;      // Maximum value of Q to test
    likely: number;   // Most likely value of Q based on prior research
    steps: number;    // Number of steps for Q range simulation
  };
  
  // Noise parameters
  noise: {
    eegNoise: number;   // Post-averaging EEG noise level (µV²)
    regStability: number; // REG baseline stability (deviation from p=0.5)
  };
  
  // Statistical targets
  statistics: {
    sigmaThreshold: number; // Statistical significance threshold (sigma)
    alpha: number;         // Significance level (derived from sigmaThreshold)
    power: number;         // Statistical power (1-β, typically 0.8 or 0.9)
  };
}

export interface SensitivityAnalysisResult {
  recommendedSampleSize: number; // Recommended number of participants (N)
  recommendedDuration: number;   // Recommended experiment duration in seconds
  estimatedEffect: number;       // Estimated effect size based on Q value
  powerCurve: Array<{q: number, n: number, power: number}>; // Power analysis curve
  nullHypothesisPower: number;   // Power for detecting Q=0 (null hypothesis)
  confidenceInterval: [number, number]; // 95% confidence interval for Q detection
  recommendedConfig: {
    participantsPerSession: number;
    sessionsCount: number;
    sessionDuration: number;
    eegSamplingRate: number;
    intentFocusDuration: number;
    controlPeriodDuration: number;
  };
}

export class QCOSensitivityAnalysis {
  // Constants for the analysis
  private readonly SECONDS_PER_SAMPLE = 0.25; // Time per sample
  private readonly MAX_PARTICIPANTS = 500;    // Upper bound on participants
  private readonly MAX_DURATION = 3600 * 2;   // Max duration (2 hours in seconds)
  private readonly DEFAULT_EEG_RATE = 250;    // Default EEG sampling rate (Hz)
  
  /**
   * Run a comprehensive sensitivity analysis for QCO experiments
   * 
   * @param params The sensitivity analysis parameters
   * @returns Analysis results with recommended experiment configuration
   */
  public async runSensitivityAnalysis(params: QCOSensitivityParameters): Promise<SensitivityAnalysisResult> {
    try {
      // Log the analysis start
      qcoGlossary.tagWithContext(`[QCO] Starting sensitivity analysis with Q range: [${params.qRange.min}, ${params.qRange.max}]`);
      
      // Generate Q values to test
      const qValues = this.generateQValues(params.qRange);
      
      // Calculate minimum detectable effect size given statistical parameters
      const minDetectableEffect = this.calculateMinDetectableEffect(
        params.statistics.sigmaThreshold,
        params.statistics.power,
        params.noise.regStability
      );
      
      // Power analysis for each Q value
      const powerAnalysis = await this.runPowerAnalysis(
        qValues,
        params.noise.regStability,
        params.statistics.alpha,
        params.statistics.power
      );
      
      // Find optimal sample size (N) and duration (T)
      const { optimalN, optimalT } = this.findOptimalParameters(
        powerAnalysis,
        params.qRange.likely,
        params.statistics.power
      );
      
      // Determine the recommended experimental configuration
      const recommendedConfig = this.determineExperimentalConfiguration(
        optimalN,
        optimalT,
        params.statistics.sigmaThreshold
      );
      
      // Create confidence interval for Q detection
      const confidenceInterval = this.calculateConfidenceInterval(
        params.qRange.likely,
        optimalN,
        optimalT,
        params.noise.regStability
      );
      
      // Calculate power for null hypothesis (Q=0)
      const nullHypothesisPower = this.calculateNullHypothesisPower(
        optimalN,
        optimalT,
        params.qRange.likely,
        params.statistics.alpha,
        params.noise.regStability
      );
      
      // Generate power curve data for visualization
      const powerCurve = this.generatePowerCurve(
        qValues,
        optimalN,
        params.statistics.alpha,
        params.noise.regStability
      );
      
      // Create the result object
      const result: SensitivityAnalysisResult = {
        recommendedSampleSize: optimalN,
        recommendedDuration: optimalT,
        estimatedEffect: this.calculateEffectSize(params.qRange.likely, optimalN, optimalT),
        powerCurve,
        nullHypothesisPower,
        confidenceInterval,
        recommendedConfig
      };
      
      // Log the analysis completion
      qcoGlossary.tagWithContext(
        `[QCO] Sensitivity analysis complete. Recommended N=${optimalN}, T=${optimalT}s, Effect=${result.estimatedEffect.toExponential(3)}`
      );
      
      return result;
    } catch (error) {
      console.error(qcoGlossary.tagWithContext('Error performing QCO sensitivity analysis'), error);
      throw error;
    }
  }
  
  /**
   * Generate array of Q values to test in the sensitivity analysis
   */
  private generateQValues(qRange: QCOSensitivityParameters['qRange']): number[] {
    const { min, max, steps } = qRange;
    const qValues: number[] = [];
    
    // Always include Q=0 (null hypothesis)
    qValues.push(0);
    
    // Linear spacing for small ranges, logarithmic for large ranges
    const range = max - min;
    const isLargeRange = range > 1e-30;
    
    if (isLargeRange) {
      // Logarithmic spacing for large ranges
      const logMin = min === 0 ? -35 : Math.log10(min);
      const logMax = Math.log10(max);
      const logStep = (logMax - logMin) / (steps - 1);
      
      for (let i = 0; i < steps; i++) {
        const logValue = logMin + i * logStep;
        qValues.push(Math.pow(10, logValue));
      }
    } else {
      // Linear spacing for small ranges
      const step = range / (steps - 1);
      
      for (let i = 0; i < steps; i++) {
        qValues.push(min + i * step);
      }
    }
    
    // Ensure the array includes the likely value
    if (!qValues.includes(qRange.likely)) {
      qValues.push(qRange.likely);
      qValues.sort((a, b) => a - b);
    }
    
    return qValues;
  }
  
  /**
   * Calculate the minimum detectable effect size given statistical parameters
   */
  private calculateMinDetectableEffect(
    sigmaThreshold: number,
    power: number,
    noise: number
  ): number {
    // Convert sigma threshold to z-score
    const zAlpha = sigmaThreshold;
    
    // Power converted to z-score (e.g., 0.8 power → z₁₋ᵦ = 0.84)
    const zBeta = this.powerToZScore(power);
    
    // Minimum detectable effect
    return (zAlpha + zBeta) * noise;
  }
  
  /**
   * Run power analysis to determine sample sizes needed for each Q value
   */
  private async runPowerAnalysis(
    qValues: number[],
    noise: number,
    alpha: number,
    targetPower: number
  ): Promise<Array<{q: number, n: number, t: number}>> {
    const results: Array<{q: number, n: number, t: number}> = [];
    
    // Calculate critical value for significance
    const zAlpha = this.alphaToZScore(alpha);
    
    // Convert target power to z-score
    const zBeta = this.powerToZScore(targetPower);
    
    // Find minimum N for each Q value
    for (const q of qValues) {
      if (q === 0) {
        // Null hypothesis case
        results.push({ q: 0, n: this.MAX_PARTICIPANTS, t: this.MAX_DURATION });
        continue;
      }
      
      // Range of possible N values to test
      const nValues = Array.from({ length: this.MAX_PARTICIPANTS }, (_, i) => i + 5);
      
      // Range of possible T values to test (in seconds)
      const tValues = [
        60, 120, 300, 600, 900, 1200, 1800, 2700, 3600, 5400, 7200
      ].filter(t => t <= this.MAX_DURATION);
      
      let bestN = this.MAX_PARTICIPANTS;
      let bestT = this.MAX_DURATION;
      let bestCost = Number.MAX_VALUE;
      
      // Search for optimal N,T combination
      for (const n of nValues) {
        for (const t of tValues) {
          // Calculate effect size for this Q with these parameters
          const effectSize = this.calculateEffectSize(q, n, t);
          
          // Calculate power
          const power = this.calculatePower(effectSize, n, noise, zAlpha);
          
          // Check if power meets target
          if (power >= targetPower) {
            // Calculate "cost" (weighted combination of N and T)
            const cost = n * Math.sqrt(t);
            
            // Keep track of lowest cost solution
            if (cost < bestCost) {
              bestCost = cost;
              bestN = n;
              bestT = t;
            }
          }
        }
      }
      
      results.push({ q, n: bestN, t: bestT });
    }
    
    return results;
  }
  
  /**
   * Find optimal sample size and duration based on power analysis
   */
  private findOptimalParameters(
    powerAnalysis: Array<{q: number, n: number, t: number}>,
    likelyQ: number,
    targetPower: number
  ): { optimalN: number, optimalT: number } {
    // Find the result closest to the likely Q value
    const likelyResult = powerAnalysis.reduce((closest, current) => {
      return Math.abs(current.q - likelyQ) < Math.abs(closest.q - likelyQ)
        ? current
        : closest;
    });
    
    // Safety margin: Increase by 20% to account for uncertainties
    const optimalN = Math.min(
      Math.ceil(likelyResult.n * 1.2), 
      this.MAX_PARTICIPANTS
    );
    
    const optimalT = Math.min(
      Math.ceil(likelyResult.t * 1.2),
      this.MAX_DURATION
    );
    
    return { optimalN, optimalT };
  }
  
  /**
   * Calculate the statistical power for detecting an effect
   */
  private calculatePower(
    effectSize: number,
    sampleSize: number,
    noise: number,
    zAlpha: number
  ): number {
    // Calculate the non-centrality parameter
    const ncp = effectSize / (noise / Math.sqrt(sampleSize));
    
    // Calculate power (1 - β)
    return 1 - this.normalCDF(zAlpha - ncp);
  }
  
  /**
   * Calculate the null hypothesis power (probability of correctly detecting no effect)
   */
  private calculateNullHypothesisPower(
    sampleSize: number,
    duration: number,
    likelyQ: number,
    alpha: number, 
    noise: number
  ): number {
    const zAlpha = this.alphaToZScore(alpha);
    const effectSize = this.calculateEffectSize(likelyQ, sampleSize, duration);
    
    // Calculate power for the null hypothesis
    return this.calculatePower(effectSize, sampleSize, noise, zAlpha);
  }
  
  /**
   * Generate data for a power curve visualization
   */
  private generatePowerCurve(
    qValues: number[],
    sampleSize: number,
    alpha: number,
    noise: number
  ): Array<{q: number, n: number, power: number}> {
    const zAlpha = this.alphaToZScore(alpha);
    
    return qValues.map(q => {
      // Calculate effect size for this Q value
      const effectSize = this.calculateEffectSize(q, sampleSize, 1800); // Use 30 min as reference
      
      // Calculate power
      const power = this.calculatePower(effectSize, sampleSize, noise, zAlpha);
      
      return { q, n: sampleSize, power };
    });
  }
  
  /**
   * Convert alpha (significance level) to Z-score
   */
  private alphaToZScore(alpha: number): number {
    // Inverse CDF of standard normal distribution
    return -this.inverseNormalCDF(alpha / 2); // Two-tailed test
  }
  
  /**
   * Convert statistical power to Z-score
   */
  private powerToZScore(power: number): number {
    // Inverse CDF of standard normal distribution
    return this.inverseNormalCDF(power);
  }
  
  /**
   * Calculate 95% confidence interval for Q detection
   */
  private calculateConfidenceInterval(
    likelyQ: number,
    sampleSize: number,
    duration: number,
    noise: number
  ): [number, number] {
    // Calculate standard error
    const effectSize = this.calculateEffectSize(likelyQ, sampleSize, duration);
    const standardError = noise / Math.sqrt(sampleSize);
    
    // 95% confidence interval (±1.96 SE)
    return [
      Math.max(0, effectSize - 1.96 * standardError),
      effectSize + 1.96 * standardError
    ];
  }
  
  /**
   * Calculate expected effect size based on Q, N, and T
   */
  private calculateEffectSize(q: number, n: number, duration: number): number {
    // Expected effect size model based on QCO v3.1 formula:
    // ΔP = Q * Ω * σ_z effect
    // Where Ω = N * avgIntent * coherence^1.5
    
    // Assumptions:
    const avgIntent = 0.7;  // Assume 70% average intent strength
    const coherence = 0.6;  // Assume 60% coherence between participants
    
    // Calculate Omega field strength
    const omega = n * avgIntent * Math.pow(coherence, 1.5);
    
    // Calculate samples based on duration
    const samples = duration / this.SECONDS_PER_SAMPLE;
    
    // Effect size increases with sqrt of duration (more samples)
    const durationFactor = Math.sqrt(samples / 100);
    
    // Combined effect
    return q * omega * durationFactor;
  }
  
  /**
   * Determine specific experimental configuration based on optimal N and T
   */
  private determineExperimentalConfiguration(
    n: number, 
    t: number,
    sigmaThreshold: number
  ): SensitivityAnalysisResult['recommendedConfig'] {
    // Convert total duration to practical session structure
    let sessionDuration = Math.min(1800, t); // Max 30 min per session
    const sessionsCount = Math.ceil(t / sessionDuration);
    
    // Adjust session duration to distribute total time
    sessionDuration = Math.ceil(t / sessionsCount);
    
    // Determine participants per session based on statistical requirements
    const participantsPerSession = Math.ceil(n / Math.sqrt(sessionsCount));
    
    // EEG sampling rate based on significance threshold (higher for more stringent thresholds)
    const eegSamplingRate = sigmaThreshold >= 4 ? 500 : this.DEFAULT_EEG_RATE;
    
    // Calculate focus and control period durations
    const intentFocusDuration = Math.min(300, sessionDuration / 3);
    const controlPeriodDuration = Math.min(300, sessionDuration / 6);
    
    return {
      participantsPerSession,
      sessionsCount,
      sessionDuration,
      eegSamplingRate,
      intentFocusDuration,
      controlPeriodDuration
    };
  }
  
  /**
   * Standard normal cumulative distribution function
   */
  private normalCDF(z: number): number {
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
  
  /**
   * Approximate inverse of the standard normal CDF
   */
  private inverseNormalCDF(p: number): number {
    // Approximation of the inverse CDF
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    
    if (p < 0.5) {
      // For lower tail
      return -this.inverseNormalCDF(1 - p);
    }
    
    // Rational approximation for upper tail
    const y = Math.sqrt(-2 * Math.log(1 - p));
    
    const a1 = 2.515517;
    const a2 = 0.802853;
    const a3 = 0.010328;
    const b1 = 1.432788;
    const b2 = 0.189269;
    const b3 = 0.001308;
    
    return y - ((a3 * y + a2) * y + a1) / (((b3 * y + b2) * y + b1) * y + 1);
  }
}

// Export singleton instance
export const qcoSensitivityAnalysis = new QCOSensitivityAnalysis();