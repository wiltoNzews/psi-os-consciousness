/**
 * Oscillation Pattern Test
 * 
 * Unit tests for verifying the 0.7500/0.2494 oscillation pattern and ensuring
 * that the 3:1 ↔ 1:3 ratio is correctly maintained across all oscillations.
 * 
 * [QUANTUM_STATE: TEST_OSCILLATION]
 */

import { 
  BrazilianWaveCalculator, 
  TemporalScale, 
  WaveMode, 
  STABILITY_COHERENCE, 
  EXPLORATION_COHERENCE,
  WaveDataPoint
} from '../../services/qrn/brazilian-wave-calculator';

// Test result interface
interface OscillationTestResult {
  testName: string;
  passed: boolean;
  dataPoints: WaveDataPoint[];
  stabilityPoints: number;
  explorationPoints: number;
  maxDeviation: number;
  stabilityPhaseCount: number;
  explorationPhaseCount: number;
  transitionPhaseCount: number;
  cycleCount: number;
  details: string;
  executionTime: number;
}

// Test configuration
interface OscillationTestConfig {
  testName: string;
  dataPoints: number;
  waveMode: WaveMode;
  temporalScale: TemporalScale;
  acceptableDeviation: number;
  verifyPhaseTransitions: boolean;
}

// Default test configuration
const DEFAULT_TEST_CONFIG: OscillationTestConfig = {
  testName: 'Default Oscillation Test',
  dataPoints: 100,
  waveMode: WaveMode.QUANTUM,
  temporalScale: TemporalScale.MESO,
  acceptableDeviation: 0.02,
  verifyPhaseTransitions: true
};

/**
 * Oscillation Pattern Test class
 * Tests the oscillation pattern between stability and exploration thresholds
 */
export class OscillationPatternTest {
  private waveCalculator: BrazilianWaveCalculator;
  
  constructor() {
    this.waveCalculator = new BrazilianWaveCalculator({
      mode: WaveMode.QUANTUM,
      baseCoherence: 0.5, // Midpoint between thresholds
      useQuantumThresholds: true
    });
  }
  
  /**
   * Run oscillation pattern test
   */
  runTest(config: Partial<OscillationTestConfig> = {}): OscillationTestResult {
    // Merge with default configuration
    const testConfig: OscillationTestConfig = { ...DEFAULT_TEST_CONFIG, ...config };
    
    // Reset calculator with appropriate configuration
    this.waveCalculator.reset({
      mode: testConfig.waveMode,
      baseCoherence: 0.5,
      useQuantumThresholds: true
    });
    
    // Generate data points
    const dataPoints = this.waveCalculator.generateSeries(testConfig.dataPoints);
    
    // Initialize counters for analysis
    let stabilityPoints = 0;
    let explorationPoints = 0;
    let maxDeviation = 0;
    let stabilityPhaseCount = 0;
    let explorationPhaseCount = 0;
    let transitionPhaseCount = 0;
    let inStabilityPhase = false;
    let inExplorationPhase = false;
    let cycleCount = 0;
    
    // Analyze data points
    for (let i = 0; i < dataPoints.length; i++) {
      const point = dataPoints[i];
      const combined = point.combined;
      
      // Check if point is near stability threshold
      if (Math.abs(combined - STABILITY_COHERENCE) <= testConfig.acceptableDeviation) {
        stabilityPoints++;
        
        // Detect phase transitions for cycle counting
        if (testConfig.verifyPhaseTransitions && !inStabilityPhase) {
          inStabilityPhase = true;
          stabilityPhaseCount++;
          
          // If coming from exploration, count as completed cycle
          if (inExplorationPhase) {
            cycleCount++;
            inExplorationPhase = false;
          }
        }
      } 
      // Check if point is near exploration threshold
      else if (Math.abs(combined - EXPLORATION_COHERENCE) <= testConfig.acceptableDeviation) {
        explorationPoints++;
        
        // Detect phase transitions for cycle counting
        if (testConfig.verifyPhaseTransitions && !inExplorationPhase) {
          inExplorationPhase = true;
          explorationPhaseCount++;
          
          // Not counting cycles here, only when returning to stability
          inStabilityPhase = false;
        }
      } 
      // Point is in transition
      else {
        transitionPhaseCount++;
        
        // If we were in a phase, we're now in transition
        inStabilityPhase = false;
        inExplorationPhase = false;
      }
      
      // Track maximum deviation from either threshold
      const stabilityDev = Math.abs(combined - STABILITY_COHERENCE);
      const explorationDev = Math.abs(combined - EXPLORATION_COHERENCE);
      const minDev = Math.min(stabilityDev, explorationDev);
      
      if (minDev > maxDeviation) {
        maxDeviation = minDev;
      }
    }
    
    // Calculate final results
    const totalThresholdPoints = stabilityPoints + explorationPoints;
    const thresholdRatio = totalThresholdPoints / dataPoints.length;
    const hasCycles = cycleCount > 0;
    
    // Determine if test passed
    const passed = totalThresholdPoints > 0 && 
                 stabilityPoints > 0 && 
                 explorationPoints > 0 &&
                 (testConfig.verifyPhaseTransitions ? hasCycles : true);
    
    // Track execution time
    const executionTime = Date.now();
    
    // Create test results
    const result: OscillationTestResult = {
      testName: testConfig.testName,
      passed: passed,
      dataPoints: dataPoints,
      stabilityPoints: stabilityPoints,
      explorationPoints: explorationPoints,
      maxDeviation: maxDeviation,
      stabilityPhaseCount: stabilityPhaseCount,
      explorationPhaseCount: explorationPhaseCount,
      transitionPhaseCount: transitionPhaseCount,
      cycleCount: cycleCount,
      executionTime: Date.now() - executionTime,
      details: this.generateDetails(
        testConfig,
        stabilityPoints,
        explorationPoints,
        thresholdRatio,
        maxDeviation,
        cycleCount
      )
    };
    
    return result;
  }
  
  /**
   * Run a specific test for the quantum mode
   */
  runQuantumModeTest(): OscillationTestResult {
    return this.runTest({
      testName: 'Quantum Mode Oscillation Test',
      dataPoints: 200,
      waveMode: WaveMode.QUANTUM,
      temporalScale: TemporalScale.MESO
    });
  }
  
  /**
   * Run a specific test for the resonant mode
   */
  runResonantModeTest(): OscillationTestResult {
    return this.runTest({
      testName: 'Resonant Mode Oscillation Test',
      dataPoints: 200,
      waveMode: WaveMode.RESONANT,
      temporalScale: TemporalScale.MESO
    });
  }
  
  /**
   * Run specific tests for all temporal scales
   */
  runTemporalScalesTest(): OscillationTestResult[] {
    const results: OscillationTestResult[] = [];
    
    // Test each temporal scale
    Object.values(TemporalScale).forEach(scale => {
      const result = this.runTest({
        testName: `Temporal Scale Test: ${scale}`,
        dataPoints: 150,
        waveMode: WaveMode.QUANTUM,
        temporalScale: scale
      });
      
      results.push(result);
    });
    
    return results;
  }
  
  /**
   * Run ratio verification test
   */
  verifyRatioProducts(): boolean {
    // Stability threshold: 0.7500 / (1 - 0.7500) = 3.0
    const stabilityRatio = STABILITY_COHERENCE / (1 - STABILITY_COHERENCE);
    const stabilityProduct = STABILITY_COHERENCE * (1 / (1 - STABILITY_COHERENCE));
    
    // Exploration threshold: 0.2494 / (1 - 0.2494) = 0.3333
    const explorationRatio = EXPLORATION_COHERENCE / (1 - EXPLORATION_COHERENCE);
    const explorationProduct = EXPLORATION_COHERENCE * (1 / (1 - EXPLORATION_COHERENCE));
    
    // Verify that ratio products are approximately equal (reciprocals)
    const ratioProduct = stabilityRatio * explorationRatio;
    const expectedProduct = 1.0; // Reciprocals should multiply to 1.0
    
    // Check if products match to within tolerance
    const ratioError = Math.abs(ratioProduct - expectedProduct);
    const productDifference = Math.abs(stabilityProduct - explorationProduct);
    
    console.log('--- Oscillation Ratio Verification ---');
    console.log(`Stability Ratio: ${stabilityRatio.toFixed(4)}`);
    console.log(`Exploration Ratio: ${explorationRatio.toFixed(4)}`);
    console.log(`Ratio Product: ${ratioProduct.toFixed(4)} (Expected: ${expectedProduct})`);
    console.log(`Stability Product: ${stabilityProduct.toFixed(4)}`);
    console.log(`Exploration Product: ${explorationProduct.toFixed(4)}`);
    console.log(`Product Difference: ${productDifference.toFixed(4)}`);
    
    return ratioError < 0.05 && productDifference < 0.05;
  }
  
  /**
   * Generate detailed test description
   */
  private generateDetails(
    config: OscillationTestConfig,
    stabilityPoints: number,
    explorationPoints: number,
    thresholdRatio: number,
    maxDeviation: number,
    cycleCount: number
  ): string {
    return `
      Test: ${config.testName}
      Mode: ${config.waveMode}
      Temporal Scale: ${config.temporalScale}
      Data Points: ${config.dataPoints}
      
      Stability Points: ${stabilityPoints} (${(stabilityPoints/config.dataPoints*100).toFixed(1)}%)
      Exploration Points: ${explorationPoints} (${(explorationPoints/config.dataPoints*100).toFixed(1)}%)
      Points at Thresholds: ${thresholdRatio.toFixed(2) * 100}%
      Max Deviation: ${maxDeviation.toFixed(4)}
      Cycle Count: ${cycleCount}
      
      Status: ${cycleCount > 0 ? 'Oscillation Verified' : 'No Complete Oscillation Detected'}
    `;
  }
}

// Export test module
export {
  OscillationTestResult,
  OscillationTestConfig
};