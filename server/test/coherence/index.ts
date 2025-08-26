/**
 * Coherence Testing Framework Entry Point
 * 
 * Main entry point for the coherence testing framework. This module provides
 * functions to run all coherence tests and generate test reports.
 * 
 * [QUANTUM_STATE: TEST_FRAMEWORK]
 */

import { CoherenceTestHarness, PerturbationType } from './CoherenceTestHarness';
import { OscillationPatternTest } from './OscillationPatternTest';
import { CoherenceIntegrationTest } from './IntegrationTest';

// Test report interface
interface TestReport {
  timestamp: Date;
  allTestsPassed: boolean;
  testsPassed: number;
  testsFailed: number;
  passRate: number;
  stabilityRatioMaintained: boolean;
  explorationRatioMaintained: boolean;
  testDuration: number;
  summaries: string[];
}

// Global test harness instances
const testHarness = new CoherenceTestHarness();
const oscillationTest = new OscillationPatternTest();
const integrationTest = new CoherenceIntegrationTest();

/**
 * Run all coherence tests
 */
export async function runAllTests(): Promise<TestReport> {
  console.log('========================================');
  console.log('Starting Coherence Testing Framework');
  console.log('========================================');
  
  const startTime = Date.now();
  
  // Initialize test counters
  let testsPassed = 0;
  let testsFailed = 0;
  const summaries: string[] = [];
  
  // Run basic tests
  console.log('\n----- Basic Coherence Tests -----');
  const stabilityTest = await testHarness.runStabilityThresholdTest();
  const explorationTest = await testHarness.runExplorationThresholdTest();
  const oscillationRatioTest = oscillationTest.runQuantumModeTest();
  
  // Update counters
  if (stabilityTest.passed) testsPassed++; else testsFailed++;
  if (explorationTest.passed) testsPassed++; else testsFailed++;
  if (oscillationRatioTest.passed) testsPassed++; else testsFailed++;
  
  // Run ratio verification
  console.log('\n----- Ratio Verification Tests -----');
  const ratioVerified = testHarness.runRatioVerificationTest();
  
  // Update counters
  if (ratioVerified) testsPassed++; else testsFailed++;
  
  // Add basic test summaries
  summaries.push(`Stability Threshold Test: ${stabilityTest.passed ? 'PASSED' : 'FAILED'}`);
  summaries.push(`Exploration Threshold Test: ${explorationTest.passed ? 'PASSED' : 'FAILED'}`);
  summaries.push(`Oscillation Pattern Test: ${oscillationRatioTest.passed ? 'PASSED' : 'FAILED'}`);
  summaries.push(`Ratio Verification Test: ${ratioVerified ? 'PASSED' : 'FAILED'}`);
  
  // Run perturbation tests
  console.log('\n----- Perturbation Tests -----');
  
  const perturbationTests = await runPerturbationTests();
  const perturbationsPassed = perturbationTests.filter(t => t.passed).length;
  const perturbationsFailed = perturbationTests.length - perturbationsPassed;
  
  // Update counters
  testsPassed += perturbationsPassed;
  testsFailed += perturbationsFailed;
  
  // Add perturbation test summary
  summaries.push(`Perturbation Tests: ${perturbationsPassed}/${perturbationTests.length} PASSED`);
  
  // Run integration tests
  console.log('\n----- Integration Tests -----');
  
  const integrationResult = await integrationTest.runIntegrationTests();
  const integrationComponentsPassed = integrationResult.componentTests.filter(t => t.passed).length;
  const integrationCrossComponentsPassed = integrationResult.crossComponentTests.filter(t => t.passed).length;
  
  // Update counters
  testsPassed += integrationComponentsPassed + integrationCrossComponentsPassed;
  testsFailed += (integrationResult.componentTests.length - integrationComponentsPassed) +
                (integrationResult.crossComponentTests.length - integrationCrossComponentsPassed);
  
  // Add integration test summary
  summaries.push(`Integration Tests: ${integrationResult.passed ? 'PASSED' : 'FAILED'}`);
  summaries.push(integrationResult.summary);
  
  // Calculate final results
  const endTime = Date.now();
  const testDuration = endTime - startTime;
  const totalTests = testsPassed + testsFailed;
  const passRate = totalTests > 0 ? testsPassed / totalTests : 0;
  const allTestsPassed = testsFailed === 0;
  
  // Log final results
  console.log('\n========================================');
  console.log(`Coherence Testing Complete: ${allTestsPassed ? 'ALL TESTS PASSED' : 'TESTS FAILED'}`);
  console.log(`Tests Passed: ${testsPassed}/${totalTests} (${(passRate * 100).toFixed(1)}%)`);
  console.log(`Test Duration: ${testDuration}ms`);
  console.log('========================================');
  
  // Create test report
  const report: TestReport = {
    timestamp: new Date(),
    allTestsPassed,
    testsPassed,
    testsFailed,
    passRate,
    stabilityRatioMaintained: stabilityTest.passed && ratioVerified,
    explorationRatioMaintained: explorationTest.passed && ratioVerified,
    testDuration,
    summaries
  };
  
  return report;
}

/**
 * Run various perturbation tests
 */
async function runPerturbationTests() {
  // Test configurations
  const perturbationConfigs = [
    {
      testName: 'Random Noise Perturbation',
      perturbationType: PerturbationType.RANDOM_NOISE,
      perturbationStrength: 0.3
    },
    {
      testName: 'Step Function Perturbation',
      perturbationType: PerturbationType.STEP_FUNCTION,
      perturbationStrength: 0.4
    },
    {
      testName: 'Impulse Perturbation',
      perturbationType: PerturbationType.IMPULSE,
      perturbationStrength: 0.6
    },
    {
      testName: 'Drift Perturbation',
      perturbationType: PerturbationType.DRIFT,
      perturbationStrength: 0.3
    },
    {
      testName: 'Phase Shift Perturbation',
      perturbationType: PerturbationType.PHASE_SHIFT,
      perturbationStrength: 0.5
    }
  ];
  
  // Run tests
  const results = [];
  
  for (const config of perturbationConfigs) {
    console.log(`Running ${config.testName}...`);
    const result = await testHarness.runTest(config);
    results.push(result);
    console.log(`  Result: ${result.passed ? 'PASSED' : 'FAILED'}`);
    console.log(`  Recovery Time: ${result.recoveryTimeMs}ms`);
    console.log(`  Final Error: ${result.coherenceError.toFixed(4)}`);
  }
  
  return results;
}

// Export test components
export {
  TestReport,
  testHarness,
  oscillationTest,
  integrationTest
};