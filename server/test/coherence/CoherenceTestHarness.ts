/**
 * Coherence Test Harness
 * 
 * A framework for testing coherence maintenance across the Quantum Coherence Threshold
 * implementation by injecting perturbations and measuring recovery time and accuracy.
 * 
 * [QUANTUM_STATE: TEST_HARNESS]
 */

import { 
  BrazilianWaveCalculator, 
  TemporalScale, 
  WaveMode, 
  STABILITY_COHERENCE, 
  EXPLORATION_COHERENCE
} from '../../services/qrn/brazilian-wave-calculator';

import { 
  QCTFCalculator,
  TemporalLayer,
  QCTFInputParams
} from '../../services/qrn/qctf-calculator';

// Test result interface
interface CoherenceTestResult {
  testName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  perturbationType: PerturbationType;
  perturbationStrength: number;
  recoveryTimeMs: number;
  targetCoherence: number;
  finalCoherence: number;
  coherenceError: number;
  passed: boolean;
  timeSeriesData: CoherenceTimePoint[];
}

// Time series point for recording coherence values over time
interface CoherenceTimePoint {
  timestamp: Date;
  coherenceValue: number;
  targetValue: number;
  error: number;
  phase: 'stability' | 'transition' | 'exploration';
}

// Perturbation types
enum PerturbationType {
  RANDOM_NOISE = 'random_noise',
  STEP_FUNCTION = 'step_function',
  IMPULSE = 'impulse',
  DRIFT = 'drift',
  OSCILLATION = 'oscillation',
  PHASE_SHIFT = 'phase_shift'
}

// Test configuration interface
interface TestConfig {
  testName: string;
  targetCoherence: number;
  perturbationType: PerturbationType;
  perturbationStrength: number; // 0.0 to 1.0
  maxDurationMs: number;
  sampleRateMs: number;
  recoveryThreshold: number; // error margin for recovery
  temporalLayer: TemporalLayer;
}

// Default test configuration
const DEFAULT_TEST_CONFIG: TestConfig = {
  testName: 'Default Coherence Test',
  targetCoherence: STABILITY_COHERENCE,
  perturbationType: PerturbationType.RANDOM_NOISE,
  perturbationStrength: 0.3,
  maxDurationMs: 5000,
  sampleRateMs: 100,
  recoveryThreshold: 0.01,
  temporalLayer: TemporalLayer.MESO
};

/**
 * Coherence Test Harness
 * Main test framework for coherence testing
 */
export class CoherenceTestHarness {
  private waveCalculator: BrazilianWaveCalculator;
  private qctfCalculator: QCTFCalculator;
  private defaultInputParams: QCTFInputParams;
  
  constructor() {
    this.waveCalculator = new BrazilianWaveCalculator();
    this.qctfCalculator = new QCTFCalculator();
    
    // Setup default input parameters for QCTF
    this.defaultInputParams = {
      globalEfficiencyFactor: 0.8,
      quantumEnergyImpulse: 0.7,
      coherenceIndex: 0.75,
      functionalIntegration: 0.85,
      determinism: 0.7,
      entropyLevel: 0.3,
      togglesPerSecond: 0.5
    };
  }
  
  /**
   * Run a coherence test with the specified configuration
   */
  async runTest(config: Partial<TestConfig> = {}): Promise<CoherenceTestResult> {
    // Merge with default configuration
    const testConfig: TestConfig = { ...DEFAULT_TEST_CONFIG, ...config };
    
    // Initialize test variables
    const startTime = new Date();
    const timeSeriesData: CoherenceTimePoint[] = [];
    let elapsedMs = 0;
    let recoveryTimeMs = testConfig.maxDurationMs; // Default to max if no recovery
    let recovered = false;
    
    // Set initial QCTF parameters based on target coherence
    const initialParams = this.getParamsForCoherence(testConfig.targetCoherence);
    
    // Calculate initial coherence (should be close to target)
    let currentParams = { ...initialParams };
    let currentResult = this.qctfCalculator.calculate({
      ...currentParams,
      timeScale: testConfig.temporalLayer
    });
    
    // Record initial state
    timeSeriesData.push({
      timestamp: new Date(startTime.getTime()),
      coherenceValue: currentResult.normalized,
      targetValue: testConfig.targetCoherence,
      error: Math.abs(currentResult.normalized - testConfig.targetCoherence),
      phase: currentResult.phase
    });
    
    // Apply perturbation
    currentParams = this.applyPerturbation(
      currentParams, 
      testConfig.perturbationType, 
      testConfig.perturbationStrength
    );
    
    // Main test loop
    while (elapsedMs < testConfig.maxDurationMs) {
      // Wait for next sample
      await this.delay(testConfig.sampleRateMs);
      elapsedMs += testConfig.sampleRateMs;
      
      // Calculate new coherence value with gradual recovery
      this.recoverParams(currentParams, initialParams, elapsedMs / testConfig.maxDurationMs);
      
      // Calculate QCTF
      currentResult = this.qctfCalculator.calculate({
        ...currentParams,
        timeScale: testConfig.temporalLayer
      });
      
      // Record state
      const error = Math.abs(currentResult.normalized - testConfig.targetCoherence);
      
      timeSeriesData.push({
        timestamp: new Date(startTime.getTime() + elapsedMs),
        coherenceValue: currentResult.normalized,
        targetValue: testConfig.targetCoherence,
        error: error,
        phase: currentResult.phase
      });
      
      // Check for recovery
      if (!recovered && error <= testConfig.recoveryThreshold) {
        recoveryTimeMs = elapsedMs;
        recovered = true;
      }
    }
    
    // Complete test
    const endTime = new Date();
    const finalCoherence = timeSeriesData[timeSeriesData.length - 1].coherenceValue;
    const coherenceError = Math.abs(finalCoherence - testConfig.targetCoherence);
    
    // Create test result
    const result: CoherenceTestResult = {
      testName: testConfig.testName,
      startTime: startTime,
      endTime: endTime,
      duration: endTime.getTime() - startTime.getTime(),
      perturbationType: testConfig.perturbationType,
      perturbationStrength: testConfig.perturbationStrength,
      recoveryTimeMs: recoveryTimeMs,
      targetCoherence: testConfig.targetCoherence,
      finalCoherence: finalCoherence,
      coherenceError: coherenceError,
      passed: coherenceError <= testConfig.recoveryThreshold,
      timeSeriesData: timeSeriesData
    };
    
    return result;
  }
  
  /**
   * Run a batch of tests with different configurations
   */
  async runTestBatch(configurations: Partial<TestConfig>[]): Promise<CoherenceTestResult[]> {
    const results: CoherenceTestResult[] = [];
    
    for (const config of configurations) {
      const result = await this.runTest(config);
      results.push(result);
    }
    
    return results;
  }
  
  /**
   * Run stability threshold test specific to the 0.7500 coherence value
   */
  async runStabilityThresholdTest(perturbationStrength = 0.3): Promise<CoherenceTestResult> {
    return this.runTest({
      testName: 'Stability Threshold Test (0.7500)',
      targetCoherence: STABILITY_COHERENCE,
      perturbationType: PerturbationType.RANDOM_NOISE,
      perturbationStrength: perturbationStrength
    });
  }
  
  /**
   * Run exploration threshold test specific to the 0.2494 coherence value
   */
  async runExplorationThresholdTest(perturbationStrength = 0.3): Promise<CoherenceTestResult> {
    return this.runTest({
      testName: 'Exploration Threshold Test (0.2494)',
      targetCoherence: EXPLORATION_COHERENCE,
      perturbationType: PerturbationType.RANDOM_NOISE,
      perturbationStrength: perturbationStrength
    });
  }
  
  /**
   * Run threshold oscillation test to verify that the system can properly
   * oscillate between stability and exploration thresholds
   */
  async runThresholdOscillationTest(cycles = 3): Promise<CoherenceTestResult> {
    const cycleMs = 1000; // 1 second per cycle
    const totalTimeMs = cycles * cycleMs;
    const sampleRateMs = 50; // 50ms sample rate
    
    // Initialize test variables
    const startTime = new Date();
    const timeSeriesData: CoherenceTimePoint[] = [];
    let elapsedMs = 0;
    
    // Main test loop
    while (elapsedMs < totalTimeMs) {
      // Calculate target coherence for this point in the oscillation
      const phase = (elapsedMs % cycleMs) / cycleMs;
      const targetCoherence = this.calculateOscillationTarget(phase);
      
      // Get parameters for target
      const params = this.getParamsForCoherence(targetCoherence);
      
      // Calculate QCTF
      const result = this.qctfCalculator.calculate({
        ...params,
        timeScale: TemporalLayer.MICRO // Use micro for faster response
      });
      
      // Record state
      timeSeriesData.push({
        timestamp: new Date(startTime.getTime() + elapsedMs),
        coherenceValue: result.normalized,
        targetValue: targetCoherence,
        error: Math.abs(result.normalized - targetCoherence),
        phase: result.phase
      });
      
      // Wait for next sample
      await this.delay(sampleRateMs);
      elapsedMs += sampleRateMs;
    }
    
    // Complete test
    const endTime = new Date();
    
    // Calculate average error
    const totalError = timeSeriesData.reduce((sum, point) => sum + point.error, 0);
    const avgError = totalError / timeSeriesData.length;
    
    // Create test result
    const result: CoherenceTestResult = {
      testName: 'Threshold Oscillation Test',
      startTime: startTime,
      endTime: endTime,
      duration: endTime.getTime() - startTime.getTime(),
      perturbationType: PerturbationType.OSCILLATION,
      perturbationStrength: 1.0, // Full oscillation
      recoveryTimeMs: 0, // Not applicable
      targetCoherence: 0.5, // Average (not really applicable)
      finalCoherence: timeSeriesData[timeSeriesData.length - 1].coherenceValue,
      coherenceError: avgError,
      passed: avgError <= 0.1, // Higher threshold for oscillation test
      timeSeriesData: timeSeriesData
    };
    
    return result;
  }
  
  /**
   * Run verification test for the 3:1 ↔ 1:3 ratio product
   */
  runRatioVerificationTest(): boolean {
    // Stability threshold: 0.7500 / (1 - 0.7500) = 3.0
    const stabilityRatio = STABILITY_COHERENCE / (1 - STABILITY_COHERENCE);
    const stabilityProduct = STABILITY_COHERENCE * (1 / (1 - STABILITY_COHERENCE));
    
    // Exploration threshold: 0.2494 / (1 - 0.2494) = 0.3333
    const explorationRatio = EXPLORATION_COHERENCE / (1 - EXPLORATION_COHERENCE);
    const explorationProduct = EXPLORATION_COHERENCE * (1 / (1 - EXPLORATION_COHERENCE));
    
    // Log results
    console.log('--- Coherence Ratio Verification Test ---');
    console.log(`Stability (${STABILITY_COHERENCE}): Ratio = ${stabilityRatio.toFixed(4)}, Product = ${stabilityProduct.toFixed(4)}`);
    console.log(`Exploration (${EXPLORATION_COHERENCE}): Ratio = ${explorationRatio.toFixed(4)}, Product = ${explorationProduct.toFixed(4)}`);
    
    // Verify that products are approximately equal
    const productDifference = Math.abs(stabilityProduct - explorationProduct);
    const passed = productDifference < 0.05;
    
    console.log(`Product Difference: ${productDifference.toFixed(4)}`);
    console.log(`Test Passed: ${passed ? 'YES' : 'NO'}`);
    
    return passed;
  }
  
  /**
   * Verify stability coherence value (0.7500)
   */
  async verifyStabilityCoherence(): Promise<number> {
    const calculator = new QCTFCalculator();
    const stabilityRatio = await calculator.calculateStabilityRatio();
    return stabilityRatio;
  }
  
  /**
   * Verify exploration coherence value (0.2494)
   */
  async verifyExplorationCoherence(): Promise<number> {
    const calculator = new QCTFCalculator();
    const explorationRatio = await calculator.calculateExplorationRatio();
    return explorationRatio;
  }
  
  /**
   * Run a complete perturbation test with multiple iterations
   */
  async runPerturbationTest(iterations: number = 3): Promise<{
    passedTests: number;
    failedTests: number;
    allPassed: boolean;
    stabilityRatioMaintained: boolean;
    explorationRatioMaintained: boolean;
    summaries: string[];
  }> {
    const summaries: string[] = [];
    const tests: Partial<TestConfig>[] = [];
    
    // Configure different perturbation tests
    for (const perturbType of Object.values(PerturbationType)) {
      tests.push({
        testName: `Stability Perturbation (${perturbType})`,
        targetCoherence: STABILITY_COHERENCE,
        perturbationType: perturbType as PerturbationType,
        perturbationStrength: 0.3
      });
      
      tests.push({
        testName: `Exploration Perturbation (${perturbType})`,
        targetCoherence: EXPLORATION_COHERENCE,
        perturbationType: perturbType as PerturbationType,
        perturbationStrength: 0.3
      });
    }
    
    // Run tests
    const results = await this.runTestBatch(tests);
    
    // Analyze results
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = results.length - passedTests;
    
    // Check if stability and exploration ratios maintained
    const stabilityTests = results.filter(r => Math.abs(r.targetCoherence - STABILITY_COHERENCE) < 0.01);
    const explorationTests = results.filter(r => Math.abs(r.targetCoherence - EXPLORATION_COHERENCE) < 0.01);
    
    const stabilityRatioMaintained = stabilityTests.filter(r => r.passed).length / stabilityTests.length > 0.7;
    const explorationRatioMaintained = explorationTests.filter(r => r.passed).length / explorationTests.length > 0.7;
    
    // Generate summaries
    for (const result of results) {
      summaries.push(
        `${result.testName}: ${result.passed ? 'PASSED' : 'FAILED'} - ` +
        `Error: ${result.coherenceError.toFixed(4)}, ` +
        `Recovery Time: ${result.recoveryTimeMs}ms`
      );
    }
    
    return {
      passedTests,
      failedTests,
      allPassed: passedTests === results.length,
      stabilityRatioMaintained,
      explorationRatioMaintained,
      summaries
    };
  }
  
  /**
   * Apply perturbation to QCTF parameters
   */
  private applyPerturbation(
    params: QCTFInputParams, 
    type: PerturbationType, 
    strength: number
  ): QCTFInputParams {
    // Clone params to avoid mutating original
    const newParams = { ...params };
    
    // Apply different perturbation types
    switch (type) {
      case PerturbationType.RANDOM_NOISE:
        // Add random noise to all factors
        Object.keys(newParams).forEach(key => {
          // Skip non-numeric or time-related properties
          if (
            typeof newParams[key] === 'number' && 
            key !== 'timestamp' &&
            key !== 'timeScale'
          ) {
            // Add noise within strength bounds
            const noise = (Math.random() * 2 - 1) * strength;
            newParams[key] = Math.max(0, Math.min(1, newParams[key] + noise));
          }
        });
        break;
        
      case PerturbationType.STEP_FUNCTION:
        // Sudden step change to coherence index
        newParams.coherenceIndex = Math.max(
          0, 
          Math.min(1, newParams.coherenceIndex + (strength * 0.5))
        );
        break;
        
      case PerturbationType.IMPULSE:
        // Temporary spike in entropy
        newParams.entropyLevel = Math.min(1, newParams.entropyLevel + strength);
        break;
        
      case PerturbationType.DRIFT:
        // Gradual drift in determinism
        newParams.determinism = Math.max(
          0, 
          Math.min(1, newParams.determinism - (strength * 0.3))
        );
        break;
        
      case PerturbationType.OSCILLATION:
        // Will be handled in the test loop
        break;
        
      case PerturbationType.PHASE_SHIFT:
        // Reverse relationship between factors temporarily
        const temp = newParams.coherenceIndex;
        newParams.coherenceIndex = newParams.entropyLevel;
        newParams.entropyLevel = temp;
        break;
    }
    
    return newParams;
  }
  
  /**
   * Gradually recover parameters toward initial values
   */
  private recoverParams(
    currentParams: QCTFInputParams, 
    targetParams: QCTFInputParams, 
    recoveryFactor: number
  ): void {
    // Apply recovery to all numeric parameters
    Object.keys(currentParams).forEach(key => {
      if (
        typeof currentParams[key] === 'number' && 
        typeof targetParams[key] === 'number' &&
        key !== 'timestamp' &&
        key !== 'timeScale'
      ) {
        // Linear interpolation towards target
        currentParams[key] = currentParams[key] + 
          (targetParams[key] - currentParams[key]) * recoveryFactor * 0.2;
      }
    });
  }
  
  /**
   * Calculate oscillation target coherence based on phase
   */
  private calculateOscillationTarget(phase: number): number {
    // Oscillate between EXPLORATION_COHERENCE and STABILITY_COHERENCE
    if (phase < 0.5) {
      // First half: Linear transition from exploration to stability
      return EXPLORATION_COHERENCE + (phase * 2) * (STABILITY_COHERENCE - EXPLORATION_COHERENCE);
    } else {
      // Second half: Linear transition from stability to exploration
      return STABILITY_COHERENCE - ((phase - 0.5) * 2) * (STABILITY_COHERENCE - EXPLORATION_COHERENCE);
    }
  }
  
  /**
   * Get QCTF parameters that would produce the target coherence
   */
  private getParamsForCoherence(targetCoherence: number): QCTFInputParams {
    // Clone default params
    const params = { ...this.defaultInputParams };
    
    // Adjust coherence index to match target
    // (This is simplified - in practice multiple params would need adjustment)
    params.coherenceIndex = targetCoherence;
    
    // Adjust complementary parameters based on the 3:1 ↔ 1:3 ratio
    if (Math.abs(targetCoherence - STABILITY_COHERENCE) < 0.05) {
      // Near stability threshold - low entropy, high determinism
      params.entropyLevel = 0.25;
      params.determinism = 0.75;
    } else if (Math.abs(targetCoherence - EXPLORATION_COHERENCE) < 0.05) {
      // Near exploration threshold - high entropy, low determinism
      params.entropyLevel = 0.75;
      params.determinism = 0.25;
    }
    
    return params;
  }
  
  /**
   * Helper method to create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export types for use in other test modules
export {
  CoherenceTestResult,
  CoherenceTimePoint,
  PerturbationType,
  TestConfig
};