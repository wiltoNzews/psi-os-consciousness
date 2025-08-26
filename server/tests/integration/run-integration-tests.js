/**
 * Integration Test Runner with Performance Metrics
 * 
 * This script runs all integration tests and collects performance metrics
 * following the OROBORO approach of timing and intent tracking.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';

// Performance metrics container
const performanceMetrics = {
  startTime: null,
  endTime: null,
  totalDuration: null,
  testSuites: [],
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  }
};

// Flow stages (OROBORO-style numbered flow)
const FLOW_STAGES = {
  START: '0-Start',
  DISCOVERY: '1-Discovery',
  EXECUTION: '2-Execution',
  ANALYSIS: '3-Analysis',
  REPORTING: '4-Reporting'
};

/**
 * Run a shell command and return the output
 */
async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command execution error: ${error.message}`);
        return reject({ error, stderr, stdout });
      }
      resolve({ stdout, stderr });
    });
  });
}

/**
 * Format milliseconds to a human-readable string
 */
function formatTime(ms) {
  if (ms < 1000) {
    return `${ms.toFixed(2)}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  } else {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(2);
    return `${minutes}m ${seconds}s`;
  }
}

/**
 * Discover integration test files
 */
async function discoverIntegrationTests(testDir) {
  console.log(`\n[${FLOW_STAGES.DISCOVERY}] Discovering integration tests in ${testDir}...`);
  const startTime = performance.now();
  
  try {
    const files = await fs.readdir(testDir);
    const testFiles = files.filter(file => 
      file.endsWith('.test.js') || 
      file.endsWith('.spec.js') ||
      file.endsWith('.test.ts') ||
      file.endsWith('.spec.ts')
    );
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`[${FLOW_STAGES.DISCOVERY}] Found ${testFiles.length} test files in ${formatTime(duration)}`);
    return testFiles.map(file => join(testDir, file));
  } catch (error) {
    console.error(`[ERROR] Failed to discover test files: ${error.message}`);
    return [];
  }
}

/**
 * Run integration tests
 */
async function runIntegrationTests(testFiles) {
  console.log(`\n[${FLOW_STAGES.EXECUTION}] Running integration tests...`);
  const startTime = performance.now();
  const results = [];
  
  for (const testFile of testFiles) {
    const testName = testFile.split('/').pop();
    console.log(`\n[${FLOW_STAGES.EXECUTION}] Running test: ${testName}`);
    
    const testStartTime = performance.now();
    try {
      // Run the test using Jest
      const { stdout, stderr } = await runCommand(`npx jest ${testFile} --json --testTimeout=30000`);
      
      // Parse test results
      let testResult;
      try {
        const jsonStart = stdout.indexOf('{');
        if (jsonStart >= 0) {
          const jsonOutput = stdout.substring(jsonStart);
          testResult = JSON.parse(jsonOutput);
        } else {
          testResult = { success: false, error: 'No JSON output found' };
        }
      } catch (parseError) {
        console.error(`[ERROR] Failed to parse test output: ${parseError.message}`);
        testResult = { 
          success: false, 
          error: `Parse error: ${parseError.message}`,
          rawOutput: stdout
        };
      }
      
      const testEndTime = performance.now();
      const testDuration = testEndTime - testStartTime;
      
      // Collect test metrics
      const testMetrics = {
        file: testName,
        startTime: testStartTime,
        endTime: testEndTime,
        duration: testDuration,
        success: testResult.success === true,
        results: testResult,
        rawOutput: stdout
      };
      
      results.push(testMetrics);
      
      console.log(`[${FLOW_STAGES.EXECUTION}] Completed test: ${testName} in ${formatTime(testDuration)} - ${testMetrics.success ? 'SUCCESS' : 'FAILURE'}`);
    } catch (error) {
      const testEndTime = performance.now();
      const testDuration = testEndTime - testStartTime;
      
      console.error(`[ERROR] Test execution failed: ${error.error?.message || 'Unknown error'}`);
      
      results.push({
        file: testName,
        startTime: testStartTime,
        endTime: testEndTime,
        duration: testDuration,
        success: false,
        error: error.error?.message || 'Unknown error',
        stdout: error.stdout,
        stderr: error.stderr
      });
    }
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`\n[${FLOW_STAGES.EXECUTION}] Completed all tests in ${formatTime(duration)}`);
  return results;
}

/**
 * Analyze test results
 */
function analyzeResults(testResults) {
  console.log(`\n[${FLOW_STAGES.ANALYSIS}] Analyzing test results...`);
  const startTime = performance.now();
  
  // Initialize counters
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;
  
  // Detailed analysis per test suite
  const analyzedResults = testResults.map(result => {
    const testCounts = { total: 0, passed: 0, failed: 0, skipped: 0 };
    const testNames = [];
    
    // Extract test counts if available
    if (result.results && result.results.numTotalTests !== undefined) {
      testCounts.total = result.results.numTotalTests;
      testCounts.passed = result.results.numPassedTests;
      testCounts.failed = result.results.numFailedTests;
      testCounts.skipped = result.results.numPendingTests;
      
      // Collect test names from results
      if (result.results.testResults && result.results.testResults.length > 0) {
        result.results.testResults.forEach(suite => {
          suite.assertionResults.forEach(assertion => {
            testNames.push({
              name: assertion.title,
              status: assertion.status,
              duration: assertion.duration || 0
            });
          });
        });
      }
    }
    
    // Update global counters
    totalTests += testCounts.total;
    passedTests += testCounts.passed;
    failedTests += testCounts.failed;
    skippedTests += testCounts.skipped;
    
    return {
      file: result.file,
      duration: result.duration,
      success: result.success,
      testCounts,
      testNames,
      perfData: extractPerformanceData(result.rawOutput || '')
    };
  });
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`[${FLOW_STAGES.ANALYSIS}] Analysis completed in ${formatTime(duration)}`);
  
  return {
    suiteResults: analyzedResults,
    summary: {
      totalTests,
      passed: passedTests,
      failed: failedTests,
      skipped: skippedTests
    }
  };
}

/**
 * Extract performance data from test output
 */
function extractPerformanceData(output) {
  if (!output) return [];
  
  const perfData = [];
  const timerRegex = /\[TIMER\] (.+?) took (.+?)ms/g;
  const flowMetricsRegex = /\[FLOW METRICS\] (.+?): (.+)/g;
  const performanceRegex = /\[PERFORMANCE\] (.+)/g;
  
  // Extract timer data
  let match;
  while ((match = timerRegex.exec(output)) !== null) {
    perfData.push({
      type: 'timer',
      stage: match[1],
      duration: parseFloat(match[2])
    });
  }
  
  // Extract flow metrics
  while ((match = flowMetricsRegex.exec(output)) !== null) {
    perfData.push({
      type: 'flow',
      metric: match[1],
      value: match[2]
    });
  }
  
  // Extract performance metrics
  while ((match = performanceRegex.exec(output)) !== null) {
    perfData.push({
      type: 'performance',
      info: match[1]
    });
  }
  
  return perfData;
}

/**
 * Generate performance report
 */
function generateReport(analysis) {
  console.log(`\n[${FLOW_STAGES.REPORTING}] Generating performance report...`);
  const startTime = performance.now();
  
  // Summary
  console.log('\n🔍 INTEGRATION TEST SUMMARY');
  console.log('==========================');
  console.log(`Total Test Suites: ${analysis.suiteResults.length}`);
  console.log(`Total Tests: ${analysis.summary.totalTests}`);
  console.log(`Passed: ${analysis.summary.passed}`);
  console.log(`Failed: ${analysis.summary.failed}`);
  console.log(`Skipped: ${analysis.summary.skipped}`);
  console.log(`Pass Rate: ${(analysis.summary.passed / analysis.summary.totalTests * 100).toFixed(2)}%`);
  console.log('==========================\n');
  
  // Individual test results
  console.log('📊 TEST SUITE PERFORMANCE');
  console.log('==========================');
  analysis.suiteResults.forEach(suite => {
    console.log(`\n${suite.file}`);
    console.log('-'.repeat(suite.file.length));
    console.log(`Status: ${suite.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Duration: ${formatTime(suite.duration)}`);
    console.log(`Tests: ${suite.testCounts.total} total, ${suite.testCounts.passed} passed, ${suite.testCounts.failed} failed, ${suite.testCounts.skipped} skipped`);
    
    // Show individual test names
    if (suite.testNames.length > 0) {
      console.log('\nTest Cases:');
      suite.testNames.forEach(test => {
        const statusIcon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏭️';
        console.log(`  ${statusIcon} ${test.name} (${formatTime(test.duration)})`);
      });
    }
    
    // Show performance metrics
    if (suite.perfData.length > 0) {
      console.log('\nPerformance Metrics:');
      
      // Group by type
      const timerData = suite.perfData.filter(p => p.type === 'timer');
      const flowData = suite.perfData.filter(p => p.type === 'flow');
      const perfData = suite.perfData.filter(p => p.type === 'performance');
      
      // Display timers
      if (timerData.length > 0) {
        console.log('  Timers:');
        timerData.forEach(t => {
          console.log(`    • ${t.stage}: ${formatTime(t.duration)}`);
        });
      }
      
      // Display flow metrics
      if (flowData.length > 0) {
        console.log('  Flow Metrics:');
        flowData.forEach(f => {
          console.log(`    • ${f.metric}: ${f.value}`);
        });
      }
      
      // Display performance info
      if (perfData.length > 0) {
        console.log('  Performance Info:');
        perfData.forEach(p => {
          console.log(`    • ${p.info}`);
        });
      }
    }
  });
  
  // Calculate overall performance stats
  const totalDuration = analysis.suiteResults.reduce((sum, suite) => sum + suite.duration, 0);
  const avgDuration = totalDuration / analysis.suiteResults.length;
  
  console.log('\n📈 OVERALL PERFORMANCE');
  console.log('==========================');
  console.log(`Total Execution Time: ${formatTime(totalDuration)}`);
  console.log(`Average Suite Duration: ${formatTime(avgDuration)}`);
  console.log('==========================\n');
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`[${FLOW_STAGES.REPORTING}] Report generated in ${formatTime(duration)}`);
  
  return {
    totalDuration,
    avgDuration,
    suites: analysis.suiteResults.length,
    tests: analysis.summary
  };
}

/**
 * Main execution function
 */
async function runTests() {
  console.log('\n🚀 STARTING INTEGRATION TEST SUITE');
  console.log('==================================');
  
  const startTime = performance.now();
  performanceMetrics.startTime = startTime;
  
  console.log(`[${FLOW_STAGES.START}] Initializing test run at: ${new Date().toISOString()}`);
  
  try {
    // Discover tests
    const testDir = './server/tests/integration';
    const testFiles = await discoverIntegrationTests(testDir);
    
    if (testFiles.length === 0) {
      console.error(`[ERROR] No test files found in ${testDir}`);
      return;
    }
    
    // Run tests
    const testResults = await runIntegrationTests(testFiles);
    
    // Analyze results
    const analysis = analyzeResults(testResults);
    
    // Generate report
    const report = generateReport(analysis);
    
    // Store metrics
    performanceMetrics.testSuites = analysis.suiteResults;
    performanceMetrics.summary = analysis.summary;
    
    const endTime = performance.now();
    performanceMetrics.endTime = endTime;
    performanceMetrics.totalDuration = endTime - startTime;
    
    console.log(`\n✨ ALL TESTS COMPLETED in ${formatTime(performanceMetrics.totalDuration)}`);
    console.log(`Pass rate: ${(analysis.summary.passed / analysis.summary.totalTests * 100).toFixed(2)}%`);
    
    // Save performance metrics to file
    await fs.writeFile(
      './server/tests/integration/integration-test-metrics.json', 
      JSON.stringify(performanceMetrics, null, 2), 
      'utf8'
    );
    console.log('\n📝 Performance metrics saved to integration-test-metrics.json');
    
    // Return error code based on test results
    process.exit(analysis.summary.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error(`\n❌ TEST EXECUTION FAILED: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error(`\n❌ UNHANDLED ERROR: ${error.message}`);
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
});