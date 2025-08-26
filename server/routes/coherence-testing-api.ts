/**
 * Coherence Testing API Routes
 * 
 * This module provides API endpoints for running coherence tests and
 * retrieving test history.
 * 
 * [QUANTUM_STATE: TEST_API]
 */

import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import { runAllTests } from '../test/coherence/index.js';
import { CoherenceIntegrationTest } from '../test/coherence/IntegrationTest.js';
import { CoherenceTestHarness } from '../test/coherence/CoherenceTestHarness.js';
import { OscillationPatternTest } from '../test/coherence/OscillationPatternTest.js';
import { 
  BrazilianWaveCalculator, 
  STABILITY_COHERENCE, 
  EXPLORATION_COHERENCE 
} from '../services/qrn/brazilian-wave-calculator.js';
import { 
  QCTFCalculator 
} from '../services/qrn/qctf-calculator.js';

// Create a router instance
const router = express.Router();

// Define interfaces for test reports
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

interface RatioVerification {
  stabilityRatio: number;
  explorationRatio: number;
  product: number;
  stabilityRatioMaintained: boolean;
  explorationRatioMaintained: boolean;
  timestamp: Date;
}

// Store test history (in-memory for simplicity, could be moved to file system storage)
const testHistory: TestReport[] = [];

/**
 * Run all coherence tests
 * POST /api/coherence/run-tests
 */
router.post('/run-tests', async (req, res) => {
  try {
    console.log('[QUANTUM_STATE: TEST_FLOW] Running all coherence tests');
    
    // Run all tests and get report
    const report = await runAllTests();
    
    // Add timestamp if not present
    if (!report.timestamp) {
      report.timestamp = new Date();
    }
    
    // Add to history
    addToHistory(report);
    
    return res.json(report);
  } catch (error: any) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error running coherence tests:', error);
    return res.status(500).json({ 
      error: 'Failed to run coherence tests',
      message: error.message,
      timestamp: new Date()
    });
  }
});

/**
 * Get test history
 * GET /api/coherence/test-history
 */
router.get('/test-history', (req, res) => {
  try {
    // Get limit from query params, default to 10
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    // Return most recent test results first
    const history = testHistory
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    return res.json(history);
  } catch (error: any) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error getting test history:', error);
    return res.status(500).json({ 
      error: 'Failed to get test history',
      message: error.message,
      timestamp: new Date()
    });
  }
});

/**
 * Run specific test
 * POST /api/coherence/run-test/:testType
 */
router.post('/run-test/:testType', async (req, res) => {
  try {
    const { testType } = req.params;
    console.log(`[QUANTUM_STATE: TEST_FLOW] Running ${testType} test`);
    
    let report: TestReport;
    
    switch (testType) {
      case 'brazilian-wave':
        report = await runBrazilianWaveTest();
        break;
      case 'qctf':
        report = await runQCTFTest();
        break;
      case 'oscillation':
        const oscillationTest = new OscillationPatternTest();
        const result = await oscillationTest.runQuantumModeTest();
        report = {
          timestamp: new Date(),
          allTestsPassed: result.passed,
          testsPassed: result.stabilityPoints + result.explorationPoints,
          testsFailed: 100 - (result.stabilityPoints + result.explorationPoints),
          passRate: (result.stabilityPoints + result.explorationPoints) / 100,
          stabilityRatioMaintained: result.stabilityPoints > 20,
          explorationRatioMaintained: result.explorationPoints > 20,
          testDuration: result.executionTime,
          summaries: [
            `Oscillation Pattern Test: ${result.passed ? 'PASSED' : 'FAILED'}`,
            `Stability Points: ${result.stabilityPoints}`,
            `Exploration Points: ${result.explorationPoints}`,
            `Cycles Detected: ${result.cycleCount}`
          ]
        };
        break;
      case 'integration':
        const integrationTest = new CoherenceIntegrationTest();
        const integrationResult = await integrationTest.runIntegrationTests();
        report = {
          timestamp: new Date(),
          allTestsPassed: integrationResult.allTestsPassed,
          testsPassed: integrationResult.passedTests,
          testsFailed: integrationResult.failedTests,
          passRate: integrationResult.passRate,
          stabilityRatioMaintained: integrationResult.stabilityMaintained,
          explorationRatioMaintained: integrationResult.explorationMaintained,
          testDuration: integrationResult.duration,
          summaries: integrationResult.testResults.map(result => 
            `${result.testName}: ${result.passed ? 'PASSED' : 'FAILED'} - ${result.description}`
          )
        };
        break;
      case 'perturbation':
        report = await runPerturbationTest();
        break;
      default:
        return res.status(400).json({ 
          error: 'Invalid test type',
          message: `Test type '${testType}' is not supported`,
          timestamp: new Date()
        });
    }
    
    // Add timestamp if not present
    if (!report.timestamp) {
      report.timestamp = new Date();
    }
    
    // Add to history
    addToHistory(report);
    
    return res.json(report);
  } catch (error: any) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Error running ${req.params.testType} test:`, error);
    return res.status(500).json({ 
      error: `Failed to run ${req.params.testType} test`,
      message: error.message,
      timestamp: new Date()
    });
  }
});

/**
 * Get ratio verification
 * GET /api/coherence/verify-ratio
 */
router.get('/verify-ratio', async (req, res) => {
  try {
    console.log('[QUANTUM_STATE: TEST_FLOW] Verifying coherence ratio');
    
    // Create test harness for verification
    const testHarness = new CoherenceTestHarness();
    
    // Verify the stability ratio (0.7500)
    const stabilityRatio = await testHarness.verifyStabilityCoherence();
    
    // Verify the exploration ratio (0.2494)
    const explorationRatio = await testHarness.verifyExplorationCoherence();
    
    // Calculate the product
    const product = stabilityRatio * explorationRatio;
    
    // Check if ratios are maintained within tolerance
    const stabilityTolerance = 0.0001;
    const explorationTolerance = 0.0001;
    
    const stabilityRatioMaintained = Math.abs(stabilityRatio - 0.7500) <= stabilityTolerance;
    const explorationRatioMaintained = Math.abs(explorationRatio - 0.2494) <= explorationTolerance;
    
    // Create verification result
    const verification: RatioVerification = {
      stabilityRatio,
      explorationRatio,
      product,
      stabilityRatioMaintained,
      explorationRatioMaintained,
      timestamp: new Date()
    };
    
    return res.json(verification);
  } catch (error: any) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error verifying coherence ratio:', error);
    return res.status(500).json({ 
      error: 'Failed to verify coherence ratio',
      message: error.message,
      timestamp: new Date()
    });
  }
});

/**
 * Run Brazilian Wave test
 */
async function runBrazilianWaveTest(): Promise<TestReport> {
  const startTime = Date.now();
  
  // Initialize the test
  const calculator = new BrazilianWaveCalculator();
  
  // Run tests for micro, meso, and macro temporal scales
  const microResult = await calculator.calculateWave({ layer: 'micro', points: 100 });
  const mesoResult = await calculator.calculateWave({ layer: 'meso', points: 100 });
  const macroResult = await calculator.calculateWave({ layer: 'macro', points: 100 });
  
  // Verify correct wave amplitudes
  const microAmplitudeCorrect = verifyWaveAmplitude(microResult, 'micro');
  const mesoAmplitudeCorrect = verifyWaveAmplitude(mesoResult, 'meso');
  const macroAmplitudeCorrect = verifyWaveAmplitude(macroResult, 'macro');
  
  // Verify correct coherence values
  const microCoherenceCorrect = verifyCoherenceValue(microResult.coherence);
  const mesoCoherenceCorrect = verifyCoherenceValue(mesoResult.coherence);
  const macroCoherenceCorrect = verifyCoherenceValue(macroResult.coherence);
  
  // Calculate passed and failed tests
  const testsPassed = [
    microAmplitudeCorrect, mesoAmplitudeCorrect, macroAmplitudeCorrect,
    microCoherenceCorrect, mesoCoherenceCorrect, macroCoherenceCorrect
  ].filter(t => t).length;
  
  const testsFailed = 6 - testsPassed;
  const allTestsPassed = testsPassed === 6;
  const passRate = testsPassed / 6;
  
  // Generate test report
  let report: TestReport = {
    timestamp: new Date(),
    allTestsPassed,
    testsPassed,
    testsFailed,
    passRate,
    stabilityRatioMaintained: microCoherenceCorrect && mesoCoherenceCorrect && macroCoherenceCorrect,
    explorationRatioMaintained: microCoherenceCorrect && mesoCoherenceCorrect && macroCoherenceCorrect,
    testDuration: Date.now() - startTime,
    summaries: [
      `Brazilian Wave Calculator - Micro Scale: ${microAmplitudeCorrect ? 'PASSED' : 'FAILED'}`,
      `Brazilian Wave Calculator - Meso Scale: ${mesoAmplitudeCorrect ? 'PASSED' : 'FAILED'}`,
      `Brazilian Wave Calculator - Macro Scale: ${macroAmplitudeCorrect ? 'PASSED' : 'FAILED'}`,
      `Coherence Values - Micro Scale: ${microCoherenceCorrect ? 'PASSED' : 'FAILED'}`,
      `Coherence Values - Meso Scale: ${mesoCoherenceCorrect ? 'PASSED' : 'FAILED'}`,
      `Coherence Values - Macro Scale: ${macroCoherenceCorrect ? 'PASSED' : 'FAILED'}`
    ]
  };
  
  return report;
}

/**
 * Run QCTF test
 */
async function runQCTFTest(): Promise<TestReport> {
  const startTime = Date.now();
  
  // Initialize the test
  const calculator = new QCTFCalculator();
  
  // Run tests for stability and exploration ratios
  const stabilityRatio = await calculator.calculateStabilityRatio();
  const explorationRatio = await calculator.calculateExplorationRatio();
  
  // Calculate product
  const product = stabilityRatio * explorationRatio;
  
  // Verify correct ratios within tolerance
  const stabilityTolerance = 0.0001;
  const explorationTolerance = 0.0001;
  const productTolerance = 0.0001;
  
  const stabilityRatioCorrect = Math.abs(stabilityRatio - 0.7500) <= stabilityTolerance;
  const explorationRatioCorrect = Math.abs(explorationRatio - 0.2494) <= explorationTolerance;
  const productCorrect = Math.abs(product - 0.1869) <= productTolerance;
  
  // Calculate passed and failed tests
  const testsPassed = [stabilityRatioCorrect, explorationRatioCorrect, productCorrect].filter(t => t).length;
  const testsFailed = 3 - testsPassed;
  const allTestsPassed = testsPassed === 3;
  const passRate = testsPassed / 3;
  
  // Generate test report
  let report: TestReport = {
    timestamp: new Date(),
    allTestsPassed,
    testsPassed,
    testsFailed,
    passRate,
    stabilityRatioMaintained: stabilityRatioCorrect,
    explorationRatioMaintained: explorationRatioCorrect,
    testDuration: Date.now() - startTime,
    summaries: [
      `QCTF Stability Ratio (0.7500): ${stabilityRatioCorrect ? 'PASSED' : 'FAILED'} - Actual: ${stabilityRatio.toFixed(4)}`,
      `QCTF Exploration Ratio (0.2494): ${explorationRatioCorrect ? 'PASSED' : 'FAILED'} - Actual: ${explorationRatio.toFixed(4)}`,
      `QCTF Product (0.1869): ${productCorrect ? 'PASSED' : 'FAILED'} - Actual: ${product.toFixed(4)}`
    ]
  };
  
  return report;
}

/**
 * Run Perturbation test
 */
async function runPerturbationTest(): Promise<TestReport> {
  const startTime = Date.now();
  
  // Create test harness
  const testHarness = new CoherenceTestHarness();
  
  // Run perturbation injection and recovery test
  const results = await testHarness.runPerturbationTest(3);
  
  // Calculate passed and failed tests
  const testsPassed = results.passedTests;
  const testsFailed = results.failedTests;
  const allTestsPassed = results.allPassed;
  const passRate = testsPassed / (testsPassed + testsFailed);
  
  // Generate test report
  let report: TestReport = {
    timestamp: new Date(),
    allTestsPassed,
    testsPassed,
    testsFailed,
    passRate,
    stabilityRatioMaintained: results.stabilityRatioMaintained,
    explorationRatioMaintained: results.explorationRatioMaintained,
    testDuration: Date.now() - startTime,
    summaries: results.summaries
  };
  
  return report;
}

/**
 * Verify wave amplitude is correct for given temporal scale
 */
function verifyWaveAmplitude(waveResult: any, scale: string): boolean {
  if (!waveResult || !waveResult.wave || !waveResult.wave.length) {
    return false;
  }
  
  // Get amplitude range
  const values = waveResult.wave.map((point: any) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const amplitude = max - min;
  
  // Expected amplitude range based on scale
  let expectedMin: number, expectedMax: number;
  
  switch (scale) {
    case 'micro':
      expectedMin = 0.05;
      expectedMax = 0.3;
      break;
    case 'meso':
      expectedMin = 0.2;
      expectedMax = 0.5;
      break;
    case 'macro':
      expectedMin = 0.4;
      expectedMax = 0.8;
      break;
    default:
      return false;
  }
  
  return amplitude >= expectedMin && amplitude <= expectedMax;
}

/**
 * Verify coherence value is within expected range
 */
function verifyCoherenceValue(coherence: number): boolean {
  // Coherence should be between 0 and 1
  if (coherence < 0 || coherence > 1) {
    return false;
  }
  
  // For the core 3:1↔1:3 ratio, we expect coherence close to 0.2494 or 0.7500
  const tolerance = 0.01;
  return (
    Math.abs(coherence - 0.2494) <= tolerance ||
    Math.abs(coherence - 0.7500) <= tolerance
  );
}

/**
 * Add test report to history
 */
function addToHistory(report: TestReport): void {
  // Keep history limited to 50 items
  if (testHistory.length >= 50) {
    testHistory.shift(); // Remove oldest
  }
  
  testHistory.push(report);
  console.log(`[QUANTUM_STATE: INFO_FLOW] Added test report to history. History size: ${testHistory.length}`);
}

export default router;