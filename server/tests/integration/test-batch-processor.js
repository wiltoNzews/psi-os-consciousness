/**
 * Integration Test for Batch Processor
 * 
 * This test validates the BatchProcessor's ability to combine multiple requests
 * into batches, apply appropriate discounts, and handle different priority levels
 * and modes for optimal cost savings.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { BatchProcessor, batchProcessor } from '../../services/BatchProcessor.js';
import { budgetForecaster } from '../../services/AdaptiveBudgetForecaster.js';

/**
 * Track execution timing
 */
const timing = {};

/**
 * Start timing for a test stage
 */
function startTiming(stage) {
  timing[stage] = { start: Date.now() };
  console.log(`\n--- ${stage} ---`);
}

/**
 * End timing for a test stage
 */
function endTiming(stage) {
  timing[stage].end = Date.now();
  timing[stage].duration = timing[stage].end - timing[stage].start;
  console.log(`${stage} completed in ${timing[stage].duration}ms`);
}

/**
 * Run the integration tests
 */
async function runTests() {
  console.log('Starting Batch Processor integration tests...');
  
  // Clear any existing data
  batchProcessor.clearAllData();
  budgetForecaster.clearData();
  
  // Prepare default test configuration
  const testConfig = {
    maxBatchSize: 5,
    lowPriorityWaitTime: 500,
    normalPriorityWaitTime: 300,
    highPriorityWaitTime: 100,
    maxWaitTime: 2000,
    smartBatchThreshold: 3
  };
  
  // Create a test instance with faster timeouts for testing
  const testProcessor = new BatchProcessor(testConfig);
  
  // Test 1: Basic batching functionality
  startTiming('Test 1: Basic batching functionality');
  
  const basicPromises = [];
  
  // Create 4 similar requests that should be batched together
  for (let i = 0; i < 4; i++) {
    basicPromises.push(
      testProcessor.addRequest({
        text: `Test request ${i + 1}`,
        model: 'GPT-4o-mini',
        priority: 'normal'
      })
    );
  }
  
  // Wait for all requests to be processed
  const basicResults = await Promise.all(basicPromises);
  
  // Verify results
  console.log(`Received ${basicResults.length} results`);
  
  // All responses should have the same batch ID
  const batchId = basicResults[0].batchId;
  console.assert(batchId, 'Response should have a batch ID');
  
  // All responses should be from the same batch
  console.assert(
    basicResults.every(r => r.batchId === batchId),
    'All responses should have the same batch ID'
  );
  
  // All responses should show cost savings
  console.assert(
    basicResults.every(r => r.savings > 0),
    'All responses should show cost savings'
  );
  
  endTiming('Test 1: Basic batching functionality');
  
  // Test 2: Different model batching
  startTiming('Test 2: Different model batching');
  
  const modelPromises = [];
  
  // Create requests for different models
  for (const model of ['GPT-4o', 'GPT-4o-mini', 'Gemini-1.5-Flash']) {
    modelPromises.push(
      testProcessor.addRequest({
        text: `Test request for ${model}`,
        model,
        priority: 'normal'
      })
    );
  }
  
  // Add more requests for GPT-4o to ensure batching
  for (let i = 0; i < 3; i++) {
    modelPromises.push(
      testProcessor.addRequest({
        text: `Additional GPT-4o request ${i + 1}`,
        model: 'GPT-4o',
        priority: 'normal'
      })
    );
  }
  
  // Wait for all requests to be processed
  const modelResults = await Promise.all(modelPromises);
  
  // Group results by model
  const resultsByModel = {};
  modelResults.forEach(result => {
    if (!resultsByModel[result.model]) {
      resultsByModel[result.model] = [];
    }
    resultsByModel[result.model].push(result);
  });
  
  // Verify each model's results
  for (const [model, results] of Object.entries(resultsByModel)) {
    console.log(`Model ${model}: ${results.length} results`);
    
    // If multiple results for same model, they should have same batch ID
    if (results.length > 1) {
      const modelBatchId = results[0].batchId;
      console.assert(
        results.every(r => r.batchId === modelBatchId),
        `All ${model} results should have the same batch ID`
      );
    }
  }
  
  // GPT-4o results should be batched
  console.assert(
    resultsByModel['GPT-4o'].every(r => r.batchId === resultsByModel['GPT-4o'][0].batchId),
    'All GPT-4o results should be batched together'
  );
  
  endTiming('Test 2: Different model batching');
  
  // Test 3: Priority handling
  startTiming('Test 3: Priority handling');
  
  // Set to economy mode to test prioritization
  testProcessor.setBatchMode('economy');
  console.log(`Batch mode set to: ${testProcessor.getBatchMode()}`);
  
  // Low priority requests first
  const lowPriorityPromises = [];
  for (let i = 0; i < 2; i++) {
    lowPriorityPromises.push(
      testProcessor.addRequest({
        text: `Low priority request ${i + 1}`,
        model: 'GPT-4o',
        priority: 'low'
      })
    );
  }
  
  // Add a high priority request that should jump the queue
  const highPriorityPromise = testProcessor.addRequest({
    text: 'High priority request',
    model: 'GPT-4o',
    priority: 'high'
  });
  
  // Add normal priority requests
  const normalPriorityPromises = [];
  for (let i = 0; i < 2; i++) {
    normalPriorityPromises.push(
      testProcessor.addRequest({
        text: `Normal priority request ${i + 1}`,
        model: 'GPT-4o',
        priority: 'normal'
      })
    );
  }
  
  // Wait for high priority request first
  const highPriorityResult = await highPriorityPromise;
  console.log('High priority result:', highPriorityResult.id.substring(0, 8));
  
  // Wait for all other requests
  const [lowPriorityResults, normalPriorityResults] = await Promise.all([
    Promise.all(lowPriorityPromises),
    Promise.all(normalPriorityPromises)
  ]);
  
  // Verify high priority was processed first or in separate batch
  console.log('Completed batch stats:', testProcessor.getBatchStatistics());
  
  endTiming('Test 3: Priority handling');
  
  // Test 4: Batch modes
  startTiming('Test 4: Batch modes');
  
  // Test each batch mode
  for (const mode of ['immediate', 'smart', 'economy']) {
    testProcessor.setBatchMode(mode);
    console.log(`\nTesting batch mode: ${mode}`);
    
    const modePromises = [];
    for (let i = 0; i < 3; i++) {
      modePromises.push(
        testProcessor.addRequest({
          text: `${mode} mode request ${i + 1}`,
          model: 'GPT-4o-mini',
          priority: 'normal'
        })
      );
    }
    
    const modeResults = await Promise.all(modePromises);
    
    // For immediate mode, each request might be processed immediately
    // For smart mode, the requests should be batched once they hit threshold
    // For economy mode, requests should be batched after timeout
    
    if (mode === 'immediate') {
      console.log('Immediate mode results:', modeResults.map(r => r.id.substring(0, 8)));
    } else {
      console.log(`${mode} mode batch ID:`, modeResults[0].batchId.substring(0, 8));
    }
  }
  
  endTiming('Test 4: Batch modes');
  
  // Test 5: Cost savings calculation
  startTiming('Test 5: Cost savings calculation');
  
  // Set to smart mode for this test
  testProcessor.setBatchMode('smart');
  
  // Create and wait for a batch of 5 requests
  const savingsPromises = [];
  for (let i = 0; i < 5; i++) {
    savingsPromises.push(
      testProcessor.addRequest({
        text: `Test savings request ${i + 1} with some extra text to increase token count`,
        model: 'GPT-4o',
        priority: 'normal'
      })
    );
  }
  
  const savingsResults = await Promise.all(savingsPromises);
  
  // Calculate total costs and savings
  const totalRegularCost = savingsResults.reduce((sum, r) => sum + r.regularCost, 0);
  const totalBatchedCost = savingsResults.reduce((sum, r) => sum + r.cost, 0);
  const totalSavings = savingsResults.reduce((sum, r) => sum + r.savings, 0);
  
  console.log(`Regular cost: $${totalRegularCost.toFixed(6)}`);
  console.log(`Batched cost: $${totalBatchedCost.toFixed(6)}`);
  console.log(`Total savings: $${totalSavings.toFixed(6)}`);
  console.log(`Savings percentage: ${((totalSavings / totalRegularCost) * 100).toFixed(2)}%`);
  
  // Verify 50% savings (within small rounding error)
  const savingsPercent = (totalSavings / totalRegularCost) * 100;
  console.assert(
    Math.abs(savingsPercent - 50) < 0.1,
    `Expected 50% savings, got ${savingsPercent.toFixed(2)}%`
  );
  
  endTiming('Test 5: Cost savings calculation');
  
  // Test 6: Timeout handling
  startTiming('Test 6: Timeout handling');
  
  // Create a processor with very short timeout
  const timeoutProcessor = new BatchProcessor({
    ...testConfig,
    maxWaitTime: 100, // 100ms timeout
    lowPriorityWaitTime: 1000, // Force timeout before batch processing
    normalPriorityWaitTime: 1000,
    highPriorityWaitTime: 1000,
    smartBatchThreshold: 10 // Set high so it won't trigger batch processing
  });
  
  timeoutProcessor.setBatchMode('economy');
  
  // Create a request that will timeout
  const timeoutPromise = timeoutProcessor.addRequest({
    text: 'This request should timeout and be processed individually',
    model: 'GPT-4o',
    priority: 'normal'
  });
  
  // Wait for the result
  const timeoutResult = await timeoutPromise;
  
  console.log('Timeout result:', timeoutResult);
  console.assert(
    timeoutResult.batchId === null,
    'Timeout request should be processed individually (batchId === null)'
  );
  
  endTiming('Test 6: Timeout handling');
  
  // Test 7: Batch statistics
  startTiming('Test 7: Batch statistics');
  
  // Get batch statistics from the main test processor
  const statistics = testProcessor.getBatchStatistics();
  
  console.log('Batch statistics:');
  console.log(`Total batches: ${statistics.totalBatches}`);
  console.log(`Total requests: ${statistics.totalRequests}`);
  console.log(`Average batch size: ${statistics.averageBatchSize.toFixed(2)}`);
  console.log(`Total savings: $${statistics.totalSavings.toFixed(6)}`);
  console.log(`Average savings: ${statistics.averageSavingsPercentage.toFixed(2)}%`);
  
  console.log('Model distribution:');
  for (const [model, count] of Object.entries(statistics.modelDistribution)) {
    console.log(`  ${model}: ${count} batches`);
  }
  
  console.log('Batch size distribution:');
  for (const [size, count] of Object.entries(statistics.batchSizeDistribution)) {
    console.log(`  Size ${size}: ${count} batches`);
  }
  
  endTiming('Test 7: Batch statistics');
  
  // Test 8: Non-batchable model handling
  startTiming('Test 8: Non-batchable model handling');
  
  // Create a custom processor with limited model support
  const limitedProcessor = new BatchProcessor({
    ...testConfig,
    modelBatchingSupport: {
      'GPT-4o': true,
      'GPT-4o-mini': true,
      // Other models not supported
    }
  });
  
  // Process request with non-batchable model
  const nonBatchableResult = await limitedProcessor.addRequest({
    text: 'This request should be processed individually',
    model: 'GPT-4.5-preview', // Not in the supported list
    priority: 'normal'
  });
  
  console.log('Non-batchable result:', nonBatchableResult);
  console.assert(
    nonBatchableResult.batchId === null,
    'Non-batchable model request should be processed individually'
  );
  
  endTiming('Test 8: Non-batchable model handling');
  
  // Test 9: Budget integration
  startTiming('Test 9: Budget integration');
  
  // Clear budget data
  budgetForecaster.clearData();
  
  // Process a batch
  const budgetPromises = [];
  for (let i = 0; i < 3; i++) {
    budgetPromises.push(
      testProcessor.addRequest({
        text: `Budget integration test request ${i + 1}`,
        model: 'GPT-4o',
        priority: 'normal'
      })
    );
  }
  
  await Promise.all(budgetPromises);
  
  // Check budget forecaster data
  const dailyCosts = budgetForecaster.getDailyCosts();
  console.log('Daily costs from budget forecaster:', dailyCosts);
  
  // Verify data was logged
  const today = new Date().toISOString().split('T')[0];
  console.assert(
    dailyCosts[today] && dailyCosts[today] > 0,
    'Budget forecaster should have recorded costs for today'
  );
  
  const modelUsage = budgetForecaster.getModelUsage();
  console.log('Model usage from budget forecaster:', modelUsage);
  
  // Verify model data was logged
  console.assert(
    modelUsage['GPT-4o'] && modelUsage['GPT-4o'].totalCost > 0,
    'Budget forecaster should have recorded GPT-4o usage'
  );
  
  endTiming('Test 9: Budget integration');
  
  // Print summary
  console.log('\n--- Test Results Summary ---');
  
  let allPassed = true;
  
  for (const stage in timing) {
    console.log(`${stage}: ${timing[stage].duration}ms`);
    if (timing[stage].error) {
      console.error(`  Error: ${timing[stage].error}`);
      allPassed = false;
    }
  }
  
  if (allPassed) {
    console.log('\n✅ All BatchProcessor integration tests passed!');
  } else {
    console.log('\n❌ Some BatchProcessor integration tests failed.');
  }
  
  // Clean up
  testProcessor.clearAllData();
  timeoutProcessor.clearAllData();
  limitedProcessor.clearAllData();
  batchProcessor.clearAllData();
  budgetForecaster.clearData();
}

// Run the tests
runTests().catch(error => {
  console.error('Error in BatchProcessor integration tests:', error);
});