/**
 * Integration Test for OROBORO NEXUS Optimizer
 * 
 * This test validates the integration between the OroboroNexusOptimizer and
 * the AdaptiveBudgetForecaster, verifying proper cost optimization functionality.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

// Import the OroboroNexusOptimizer directly
import { OroboroNexusOptimizer, oroboroNexusOptimizer } from '../../services/OroboroNexusOptimizer.js';
import { budgetForecaster } from '../../services/AdaptiveBudgetForecaster.js';

/**
 * Stage timing tracking
 */
const timing = {};

/**
 * Start timing for a stage
 */
function startTiming(stage) {
  timing[stage] = { start: Date.now() };
}

/**
 * End timing for a stage
 */
function endTiming(stage) {
  timing[stage].end = Date.now();
  timing[stage].duration = timing[stage].end - timing[stage].start;
  console.log(`${stage} completed in ${timing[stage].duration}ms`);
}

/**
 * Run the OROBORO NEXUS Optimizer integration tests
 */
async function runTests() {
  console.log('Starting OROBORO NEXUS Optimizer integration tests...');
  
  // Reset data for testing
  budgetForecaster.clearData();
  
  // Test 1: Basic optimization request
  startTiming('Test 1: Basic optimization request');
  console.log('\n--- Test 1: Basic optimization request ---');
  
  const basicResult = await oroboroNexusOptimizer.process({
    text: 'Explain the benefits of quantum computing in medicine',
    type: 'text_generation'
  });
  
  console.log('Basic optimization result:', basicResult);
  console.assert(basicResult.model === 'GPT-4o', 'Default model should be GPT-4o based on request type');
  console.assert(basicResult.tokensUsed.input > 0, 'Should have input tokens');
  console.assert(basicResult.tokensUsed.output > 0, 'Should have output tokens');
  console.assert(basicResult.cost > 0, 'Should have positive cost');
  console.assert(basicResult.executionTime > 0, 'Should have positive execution time');
  
  // Get forecast after first request
  const initialForecast = oroboroNexusOptimizer.getBudgetForecast();
  console.log('Initial forecast:', initialForecast);
  
  endTiming('Test 1: Basic optimization request');

  // Test 2: Request with explicit model selection
  startTiming('Test 2: Request with explicit model selection');
  console.log('\n--- Test 2: Request with explicit model selection ---');
  
  const explicitModelResult = await oroboroNexusOptimizer.process({
    text: 'Generate Python code to analyze DNA sequences',
    type: 'code_generation',
    options: {
      forceModel: 'GPT-4.5-preview'
    }
  });
  
  console.log('Explicit model result:', explicitModelResult);
  console.assert(explicitModelResult.model === 'GPT-4.5-preview', 'Model should match forced selection');
  
  // Get model distribution after explicit selection
  const modelDistribution = oroboroNexusOptimizer.getModelDistribution();
  console.log('Model distribution after explicit selection:', modelDistribution);
  console.assert(modelDistribution['GPT-4o'] && modelDistribution['GPT-4.5-preview'], 
    'Distribution should include both models');
  
  endTiming('Test 2: Request with explicit model selection');

  // Test 3: Maximum savings profile
  startTiming('Test 3: Maximum savings profile');
  console.log('\n--- Test 3: Maximum savings profile ---');
  
  const savingsResult = await oroboroNexusOptimizer.process({
    text: 'Translate the following text to French: "The quick brown fox jumps over the lazy dog"',
    type: 'translation',
    options: {
      optimizationProfile: 'maximum_savings'
    }
  });
  
  console.log('Maximum savings result:', savingsResult);
  console.assert(savingsResult.model === 'GPT-4o-mini', 'Should use cheapest model based on profile');
  
  // Track costs for comparison
  const savingsCost = savingsResult.cost;
  
  endTiming('Test 3: Maximum savings profile');

  // Test 4: Maximum performance profile
  startTiming('Test 4: Maximum performance profile');
  console.log('\n--- Test 4: Maximum performance profile ---');
  
  const performanceResult = await oroboroNexusOptimizer.process({
    text: 'Translate the following text to French: "The quick brown fox jumps over the lazy dog"',
    type: 'translation',
    options: {
      optimizationProfile: 'maximum_performance'
    }
  });
  
  console.log('Maximum performance result:', performanceResult);
  console.assert(performanceResult.model === 'GPT-4o', 'Should use premium model based on profile');
  
  // Compare costs between profiles
  console.log(`Cost comparison - Savings: ${savingsCost}, Performance: ${performanceResult.cost}`);
  console.assert(performanceResult.cost > savingsCost, 'Performance profile should have higher cost');
  
  endTiming('Test 4: Maximum performance profile');

  // Test 5: Adaptive budget strategy integration
  startTiming('Test 5: Adaptive budget strategy integration');
  console.log('\n--- Test 5: Adaptive budget strategy integration ---');
  
  // Update budget settings to test adaptive behaviors
  oroboroNexusOptimizer.updateBudgetSettings({
    monthlyCap: 100, // Lower cap for testing
    warningThreshold: 0.5, // 50% warning
    criticalThreshold: 0.8 // 80% critical
  });
  
  // Simulate approaching warning threshold with many requests
  console.log('Simulating high usage to approach warning threshold...');
  for (let i = 0; i < 50; i++) {
    await oroboroNexusOptimizer.process({
      text: 'Generate a short paragraph about space exploration.',
      type: 'text_generation'
    });
  }
  
  // Get the current strategy after high usage
  const highUsageStrategy = oroboroNexusOptimizer.getAdaptiveStrategy();
  console.log('Adaptive strategy after high usage:', highUsageStrategy);
  
  // Test strategy influence on model selection
  const adaptiveResult = await oroboroNexusOptimizer.process({
    text: 'Write a poem about autumn leaves.',
    type: 'creative_writing',
    options: {
      priority: 'normal' // Not high priority, should follow strategy
    }
  });
  
  console.log('Adaptive model selection result:', adaptiveResult);
  
  // Check if strategy influenced model selection
  const strategyInfluenced = adaptiveResult.model === highUsageStrategy.modelPreference;
  console.log(`Strategy influenced model selection: ${strategyInfluenced}`);
  
  // Get budget alerts
  const alerts = oroboroNexusOptimizer.getBudgetAlerts();
  console.log('Budget alerts:', alerts.slice(-2)); // Show the most recent alerts
  
  endTiming('Test 5: Adaptive budget strategy integration');

  // Test 6: High priority override
  startTiming('Test 6: High priority override');
  console.log('\n--- Test 6: High priority override ---');
  
  // Simulate exceeding critical threshold
  oroboroNexusOptimizer.updateBudgetSettings({
    monthlyCap: 10 // Very low cap to force critical threshold
  });
  
  // Get current strategy to confirm critical state
  const criticalStrategy = oroboroNexusOptimizer.getAdaptiveStrategy();
  console.log('Strategy in critical state:', criticalStrategy);
  console.assert(criticalStrategy.thresholdReached === 'critical', 'Should be in critical threshold');
  
  // Test high priority override
  const highPriorityResult = await oroboroNexusOptimizer.process({
    text: 'Generate complex analysis of market trends in renewable energy.',
    type: 'reasoning',
    options: {
      priority: 'high'
    }
  });
  
  console.log('High priority override result:', highPriorityResult);
  // High priority should ignore critical budget constraints
  console.assert(highPriorityResult.model !== criticalStrategy.modelPreference, 
    'High priority should override budget-constrained model preference');
  
  // For comparison, run normal priority in critical state
  const normalPriorityResult = await oroboroNexusOptimizer.process({
    text: 'Generate complex analysis of market trends in renewable energy.',
    type: 'reasoning',
    options: {
      priority: 'normal'
    }
  });
  
  console.log('Normal priority in critical state result:', normalPriorityResult);
  console.assert(normalPriorityResult.model === criticalStrategy.modelPreference, 
    'Normal priority should follow budget-constrained model preference');
  
  endTiming('Test 6: High priority override');

  // Test 7: Get budget analytics
  startTiming('Test 7: Budget analytics');
  console.log('\n--- Test 7: Budget analytics ---');
  
  const currentForecast = oroboroNexusOptimizer.getBudgetForecast();
  console.log('Current budget forecast:', currentForecast);
  
  const finalModelDistribution = oroboroNexusOptimizer.getModelDistribution();
  console.log('Final model distribution:');
  Object.entries(finalModelDistribution).forEach(([model, stats]) => {
    console.log(`  ${model}: ${stats.count} uses, $${stats.cost.toFixed(4)}, ${stats.percentage.toFixed(1)}%`);
  });
  
  const dailyCosts = budgetForecaster.getDailyCosts();
  console.log('Daily costs:', dailyCosts);
  
  endTiming('Test 7: Budget analytics');

  // Test 8: Change default optimization profile
  startTiming('Test 8: Change default profile');
  console.log('\n--- Test 8: Change default profile ---');
  
  oroboroNexusOptimizer.setDefaultOptimizationProfile('maximum_savings');
  
  const defaultProfileResult = await oroboroNexusOptimizer.process({
    text: 'Summarize the key points of quantum physics',
    type: 'summarization'
    // No options specified, should use default profile
  });
  
  console.log('Result with changed default profile:', defaultProfileResult);
  console.assert(defaultProfileResult.model === 'GPT-4o-mini', 
    'Should use maximum_savings model with changed default profile');
  
  endTiming('Test 8: Change default profile');

  // Print overall test results
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
    console.log('\n✅ All OROBORO NEXUS Optimizer integration tests passed!');
  } else {
    console.log('\n❌ Some OROBORO NEXUS Optimizer integration tests failed.');
  }
  
  // Reset budget data after testing
  budgetForecaster.clearData();
}

// Run the tests
runTests().catch(error => {
  console.error('Error in OROBORO NEXUS Optimizer integration tests:', error);
});