/**
 * Coherence Integration Test
 * 
 * This module provides integration tests for coherence across multiple components
 * of the system, ensuring that the 3:1 ↔ 1:3 ratio is maintained across
 * all layers of the implementation.
 * 
 * [QUANTUM_STATE: TEST_INTEGRATION]
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
  QCTFInputParams,
  QCTFResult
} from '../../services/qrn/qctf-calculator';

import { 
  CoherenceTestHarness,
  PerturbationType
} from './CoherenceTestHarness';

import {
  OscillationPatternTest
} from './OscillationPatternTest';

// Integration test result interface
interface IntegrationTestResult {
  testName: string;
  passed: boolean;
  componentTests: ComponentTestResult[];
  crossComponentTests: CrossComponentResult[];
  summary: string;
  // Properties needed for API conversion
  allTestsPassed: boolean;
  passedTests: number;
  failedTests: number;
  passRate: number;
  stabilityMaintained: boolean;
  explorationMaintained: boolean;
  duration: number;
  testResults: { 
    testName: string; 
    passed: boolean; 
    description: string;
  }[];
}

// Component test result
interface ComponentTestResult {
  component: string;
  testName: string;
  passed: boolean;
  details: string;
}

// Cross-component test result
interface CrossComponentResult {
  testName: string;
  components: string[];
  passed: boolean;
  coherenceMatch: number; // 0-1 indicating how closely components match
  details: string;
}

/**
 * Integration Test class
 * Tests coherence across system components
 */
export class CoherenceIntegrationTest {
  private waveCalculator: BrazilianWaveCalculator;
  private qctfCalculator: QCTFCalculator;
  private testHarness: CoherenceTestHarness;
  private oscillationTest: OscillationPatternTest;
  
  constructor() {
    this.waveCalculator = new BrazilianWaveCalculator();
    this.qctfCalculator = new QCTFCalculator();
    this.testHarness = new CoherenceTestHarness();
    this.oscillationTest = new OscillationPatternTest();
  }
  
  /**
   * Run comprehensive integration test suite
   */
  async runIntegrationTests(): Promise<IntegrationTestResult> {
    console.log('Starting Coherence Integration Tests...');
    
    // Start timing the tests
    const startTime = performance.now();
    
    // Individual component tests
    const componentTests: ComponentTestResult[] = [];
    
    // Test Brazilian Wave Calculator
    componentTests.push(await this.testBrazilianWaveCalculator());
    
    // Test QCTF Calculator
    componentTests.push(await this.testQCTFCalculator());
    
    // Test oscillation pattern
    componentTests.push(await this.testOscillationPattern());
    
    // Cross-component tests
    const crossComponentTests: CrossComponentResult[] = [];
    
    // Test wave calculator to QCTF calculator coherence
    crossComponentTests.push(await this.testWaveToQCTFCoherence());
    
    // Test coherence propagation
    crossComponentTests.push(await this.testCoherencePropagation());
    
    // Determine overall test result
    const allComponentTestsPassed = componentTests.every(test => test.passed);
    const allCrossComponentTestsPassed = crossComponentTests.every(test => test.passed);
    const passed = allComponentTestsPassed && allCrossComponentTestsPassed;
    
    // Generate summary
    const summary = this.generateSummary(componentTests, crossComponentTests, passed);
    
    // Measure test duration
    const testDuration = performance.now() - startTime;
    
    // Calculate test statistics
    const totalTests = componentTests.length + crossComponentTests.length;
    const passedTests = componentTests.filter(t => t.passed).length + 
                       crossComponentTests.filter(t => t.passed).length;
    const failedTests = totalTests - passedTests;
    const passRate = passedTests / totalTests;
    
    // Convert test results to a simplified format for API
    const testResults = [
      ...componentTests.map(test => ({
        testName: test.testName,
        passed: test.passed,
        description: test.details
      })),
      ...crossComponentTests.map(test => ({
        testName: test.testName,
        passed: test.passed,
        description: test.details
      }))
    ];
    
    // Check if stability and exploration ratios are maintained
    const stabilityComponents = componentTests.filter(t => 
      t.details.includes("Stability") && t.passed).length;
    const explorationComponents = componentTests.filter(t => 
      t.details.includes("Exploration") && t.passed).length;
    
    const stabilityMaintained = stabilityComponents >= componentTests.length / 2;
    const explorationMaintained = explorationComponents >= componentTests.length / 2;
    
    // Create integration test result with API properties
    const result: IntegrationTestResult = {
      testName: 'Comprehensive Coherence Integration Test',
      passed,
      componentTests,
      crossComponentTests,
      summary,
      // API conversion properties
      allTestsPassed: passed,
      passedTests,
      failedTests,
      passRate,
      stabilityMaintained,
      explorationMaintained,
      duration: testDuration,
      testResults
    };
    
    console.log('Integration Tests Complete.');
    console.log(summary);
    
    return result;
  }
  
  /**
   * Test the Brazilian Wave Calculator
   */
  private async testBrazilianWaveCalculator(): Promise<ComponentTestResult> {
    console.log('Testing Brazilian Wave Calculator...');
    
    // Reset calculator
    this.waveCalculator.reset({
      mode: WaveMode.QUANTUM,
      useQuantumThresholds: true
    });
    
    // Generate data points
    const dataPoints = this.waveCalculator.generateSeries(100);
    
    // Verify some points meet the coherence thresholds
    let stabilityPoints = 0;
    let explorationPoints = 0;
    
    for (const point of dataPoints) {
      if (Math.abs(point.combined - STABILITY_COHERENCE) < 0.05) {
        stabilityPoints++;
      }
      
      if (Math.abs(point.combined - EXPLORATION_COHERENCE) < 0.05) {
        explorationPoints++;
      }
    }
    
    // Verify coherence ratio mathematically
    const ratioVerified = this.waveCalculator.verifyCoherenceRatio();
    
    // Test passes if we have stability and exploration points and ratio is verified
    const passed = stabilityPoints > 0 && explorationPoints > 0 && ratioVerified;
    
    // Generate details
    const details = `
      Brazilian Wave Calculator Test
      -----------------------------
      Stability points: ${stabilityPoints}
      Exploration points: ${explorationPoints}
      Ratio verification: ${ratioVerified ? 'Passed' : 'Failed'}
      
      Status: ${passed ? 'Passed' : 'Failed'}
    `;
    
    return {
      component: 'BrazilianWaveCalculator',
      testName: 'Coherence Thresholds and Ratio Test',
      passed,
      details
    };
  }
  
  /**
   * Test the QCTF Calculator
   */
  private async testQCTFCalculator(): Promise<ComponentTestResult> {
    console.log('Testing QCTF Calculator...');
    
    // Test stability threshold
    const stabilityParams: QCTFInputParams = {
      globalEfficiencyFactor: 0.8,
      quantumEnergyImpulse: 0.7,
      coherenceIndex: STABILITY_COHERENCE,
      functionalIntegration: 0.8,
      determinism: 0.8,
      entropyLevel: 0.2,
      timeScale: TemporalLayer.MESO
    };
    
    const stabilityResult = this.qctfCalculator.calculate(stabilityParams);
    
    // Test exploration threshold
    const explorationParams: QCTFInputParams = {
      globalEfficiencyFactor: 0.6,
      quantumEnergyImpulse: 0.5,
      coherenceIndex: EXPLORATION_COHERENCE,
      functionalIntegration: 0.6,
      determinism: 0.3,
      entropyLevel: 0.7,
      timeScale: TemporalLayer.MESO
    };
    
    const explorationResult = this.qctfCalculator.calculate(explorationParams);
    
    // Verify coherence ratio
    const ratioVerified = this.qctfCalculator.verifyCoherenceRatioProduct();
    
    // Check results are within acceptable range
    const stabilityAccurate = Math.abs(stabilityResult.normalized - STABILITY_COHERENCE) < 0.1;
    const explorationAccurate = Math.abs(explorationResult.normalized - EXPLORATION_COHERENCE) < 0.1;
    
    // Test passes if both accuracy checks and ratio verification pass
    const passed = stabilityAccurate && explorationAccurate && ratioVerified;
    
    // Generate details
    const details = `
      QCTF Calculator Test
      ------------------
      Stability target: ${STABILITY_COHERENCE}, result: ${stabilityResult.normalized.toFixed(4)}
      Exploration target: ${EXPLORATION_COHERENCE}, result: ${explorationResult.normalized.toFixed(4)}
      Ratio verification: ${ratioVerified ? 'Passed' : 'Failed'}
      
      Status: ${passed ? 'Passed' : 'Failed'}
    `;
    
    return {
      component: 'QCTFCalculator',
      testName: 'Coherence Calculation Accuracy Test',
      passed,
      details
    };
  }
  
  /**
   * Test oscillation pattern
   */
  private async testOscillationPattern(): Promise<ComponentTestResult> {
    console.log('Testing Oscillation Pattern...');
    
    // Run quantum mode test
    const quantumTest = this.oscillationTest.runQuantumModeTest();
    
    // Verify ratio products
    const ratioVerified = this.oscillationTest.verifyRatioProducts();
    
    // Test passes if quantum test passes and ratio is verified
    const passed = quantumTest.passed && ratioVerified;
    
    // Generate details
    const details = `
      Oscillation Pattern Test
      ----------------------
      Quantum test passed: ${quantumTest.passed}
      Stability points: ${quantumTest.stabilityPoints}
      Exploration points: ${quantumTest.explorationPoints}
      Cycles detected: ${quantumTest.cycleCount}
      Ratio verification: ${ratioVerified ? 'Passed' : 'Failed'}
      
      Status: ${passed ? 'Passed' : 'Failed'}
    `;
    
    return {
      component: 'OscillationPattern',
      testName: 'Oscillation Pattern Test',
      passed,
      details
    };
  }
  
  /**
   * Test coherence between Wave and QCTF calculators
   */
  private async testWaveToQCTFCoherence(): Promise<CrossComponentResult> {
    console.log('Testing Wave to QCTF Coherence...');
    
    // Reset wave calculator
    this.waveCalculator.reset({
      mode: WaveMode.QUANTUM,
      useQuantumThresholds: true
    });
    
    // Generate series of wave data points
    const wavePoints = this.waveCalculator.generateSeries(50);
    
    // Map wave points to QCTF inputs and calculate
    const qctfResults: QCTFResult[] = [];
    for (const point of wavePoints) {
      const params: QCTFInputParams = {
        globalEfficiencyFactor: 0.7,
        quantumEnergyImpulse: 0.6,
        coherenceIndex: point.combined, // Use wave combined value
        functionalIntegration: 0.7,
        determinism: 0.7,
        entropyLevel: 0.3,
        timeScale: TemporalLayer.MESO
      };
      
      const result = this.qctfCalculator.calculate(params);
      qctfResults.push(result);
    }
    
    // Compare wave and QCTF values
    let matchingPoints = 0;
    const matchThreshold = 0.1;
    
    for (let i = 0; i < wavePoints.length; i++) {
      const waveCombined = wavePoints[i].combined;
      const qctfNormalized = qctfResults[i].normalized;
      
      if (Math.abs(waveCombined - qctfNormalized) < matchThreshold) {
        matchingPoints++;
      }
    }
    
    // Calculate coherence match percentage
    const coherenceMatch = matchingPoints / wavePoints.length;
    
    // Test passes if at least 70% of points match
    const passed = coherenceMatch >= 0.7;
    
    // Generate details
    const details = `
      Wave to QCTF Coherence Test
      -------------------------
      Total points: ${wavePoints.length}
      Matching points: ${matchingPoints}
      Coherence match: ${(coherenceMatch * 100).toFixed(1)}%
      
      Status: ${passed ? 'Passed' : 'Failed'}
    `;
    
    return {
      testName: 'Wave to QCTF Coherence',
      components: ['BrazilianWaveCalculator', 'QCTFCalculator'],
      passed,
      coherenceMatch,
      details
    };
  }
  
  /**
   * Test coherence propagation across components
   */
  private async testCoherencePropagation(): Promise<CrossComponentResult> {
    console.log('Testing Coherence Propagation...');
    
    // Run test harness stability test
    const stabilityTest = await this.testHarness.runStabilityThresholdTest(0.2);
    
    // Run test harness exploration test
    const explorationTest = await this.testHarness.runExplorationThresholdTest(0.2);
    
    // Test passes if both tests pass
    const passed = stabilityTest.passed && explorationTest.passed;
    
    // Calculate overall coherence match
    const stabilityError = stabilityTest.coherenceError;
    const explorationError = explorationTest.coherenceError;
    const avgError = (stabilityError + explorationError) / 2;
    const coherenceMatch = 1 - Math.min(1, avgError * 5); // Scale error to 0-1 match
    
    // Generate details
    const details = `
      Coherence Propagation Test
      -----------------------
      Stability test passed: ${stabilityTest.passed}
      Stability recovery time: ${stabilityTest.recoveryTimeMs}ms
      Stability final error: ${stabilityTest.coherenceError.toFixed(4)}
      
      Exploration test passed: ${explorationTest.passed}
      Exploration recovery time: ${explorationTest.recoveryTimeMs}ms
      Exploration final error: ${explorationTest.coherenceError.toFixed(4)}
      
      Overall coherence match: ${(coherenceMatch * 100).toFixed(1)}%
      
      Status: ${passed ? 'Passed' : 'Failed'}
    `;
    
    return {
      testName: 'Coherence Propagation',
      components: ['CoherenceTestHarness', 'BrazilianWaveCalculator', 'QCTFCalculator'],
      passed,
      coherenceMatch,
      details
    };
  }
  
  /**
   * Generate summary of all tests
   */
  private generateSummary(
    componentTests: ComponentTestResult[],
    crossComponentTests: CrossComponentResult[],
    passed: boolean
  ): string {
    const componentPassCount = componentTests.filter(t => t.passed).length;
    const crossComponentPassCount = crossComponentTests.filter(t => t.passed).length;
    
    return `
      Coherence Integration Test Summary
      ==============================
      Component Tests: ${componentPassCount}/${componentTests.length} passed
      Cross-Component Tests: ${crossComponentPassCount}/${crossComponentTests.length} passed
      
      Overall Status: ${passed ? 'PASSED' : 'FAILED'}
      
      The 3:1 ↔ 1:3 ratio (${STABILITY_COHERENCE}/${EXPLORATION_COHERENCE}) is 
      ${passed ? 'correctly maintained' : 'NOT maintained'} across system components.
    `;
  }
}

// Export integration test interfaces
export {
  IntegrationTestResult,
  ComponentTestResult,
  CrossComponentResult
};