/**
 * Integration Test for Adaptive Budget Forecaster
 * 
 * This test validates the functionality of the AdaptiveBudgetForecaster service,
 * which tracks API usage, provides cost forecasting, and generates optimization
 * recommendations to control spending.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

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
 * Create sample dates for testing (relative to current date)
 */
function createSampleDates() {
  const now = new Date();
  
  return {
    today: now,
    yesterday: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
    twoDaysAgo: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
    threeDaysAgo: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3),
    fourDaysAgo: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4),
    fiveDaysAgo: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
    sixDaysAgo: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6),
    oneWeekAgo: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
    twoWeeksAgo: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14),
    oneMonthAgo: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  };
}

/**
 * Run the integration tests
 */
async function runTests() {
  console.log('Starting Adaptive Budget Forecaster integration tests...');
  
  // Clear any existing data
  budgetForecaster.clearData();
  
  // Get test dates
  const dates = createSampleDates();
  
  // Test 1: Basic usage logging
  startTiming('Test 1: Basic usage logging');
  
  // Log some sample API usage
  budgetForecaster.logUsage(
    'GPT-4o', 
    1000, // input tokens
    500, // output tokens
    0.02, // cost
    'test-service',
    { prompt: 'What is the capital of France?' }
  );
  
  budgetForecaster.logUsage(
    'GPT-4o-mini', 
    1000, 
    500, 
    0.005, 
    'test-service',
    { prompt: 'What is the capital of Germany?' }
  );
  
  // Get usage records and verify
  const usageRecords = budgetForecaster.getUsageRecords();
  console.log(`Recorded ${usageRecords.length} usage records`);
  console.assert(usageRecords.length === 2, 'Should have 2 usage records');
  
  // Verify model usage statistics
  const modelUsage = budgetForecaster.getModelUsage();
  console.log('Model usage:', Object.keys(modelUsage));
  
  console.assert(modelUsage['GPT-4o'], 'Should have GPT-4o usage');
  console.assert(modelUsage['GPT-4o-mini'], 'Should have GPT-4o-mini usage');
  console.assert(modelUsage['GPT-4o'].totalCost === 0.02, 'GPT-4o cost should be correct');
  console.assert(modelUsage['GPT-4o-mini'].totalCost === 0.005, 'GPT-4o-mini cost should be correct');
  
  // Get total cost
  const totalCost = budgetForecaster.getTotalCost();
  console.log(`Total cost: $${totalCost.toFixed(6)}`);
  console.assert(totalCost === 0.025, 'Total cost should be 0.025');
  
  endTiming('Test 1: Basic usage logging');
  
  // Test 2: Savings tracking
  startTiming('Test 2: Savings tracking');
  
  // Log savings from various sources
  budgetForecaster.logBatchSavings('GPT-4o', 0.01, 'Batched 5 requests');
  budgetForecaster.logCacheSavings('GPT-4o', 0.015, 'Cache hit for 3 similar queries');
  budgetForecaster.logCostSavings('GPT-4o', 0.008, 'model_downgrade', 'Downgraded from GPT-4.5-preview to GPT-4o');
  
  // Get savings records and verify
  const savingsRecords = budgetForecaster.getSavingsRecords();
  console.log(`Recorded ${savingsRecords.length} savings records`);
  console.assert(savingsRecords.length === 3, 'Should have 3 savings records');
  
  // Get total savings
  const totalSavings = budgetForecaster.getTotalSavings();
  console.log(`Total savings: $${totalSavings.toFixed(6)}`);
  console.assert(totalSavings === 0.033, 'Total savings should be 0.033');
  
  // Get savings by source
  const savingsBySource = budgetForecaster.getSavingsBySource();
  console.log('Savings by source:', savingsBySource);
  
  console.assert(savingsBySource.batch_processing === 0.01, 'Batch savings should be 0.01');
  console.assert(savingsBySource.semantic_cache === 0.015, 'Cache savings should be 0.015');
  console.assert(savingsBySource.model_downgrade === 0.008, 'Model downgrade savings should be 0.008');
  
  endTiming('Test 2: Savings tracking');
  
  // Test 3: Daily cost tracking
  startTiming('Test 3: Daily cost tracking');
  
  // Clear data for this test
  budgetForecaster.clearData();
  
  // Create test usage records with specific dates
  // Today
  budgetForecaster.logUsage('GPT-4o', 1000, 500, 0.025);
  budgetForecaster.logUsage('GPT-4o', 2000, 1000, 0.05);
  
  // Override timestamp for previous days
  const usageRecord = budgetForecaster.logUsage('GPT-4o', 1500, 750, 0.035);
  usageRecord.timestamp = dates.yesterday;
  
  const usageRecord2 = budgetForecaster.logUsage('GPT-4o-mini', 1000, 500, 0.005);
  usageRecord2.timestamp = dates.yesterday;
  
  const usageRecord3 = budgetForecaster.logUsage('GPT-4o', 3000, 1500, 0.07);
  usageRecord3.timestamp = dates.twoDaysAgo;
  
  const usageRecord4 = budgetForecaster.logUsage('GPT-4o-mini', 2000, 1000, 0.01);
  usageRecord4.timestamp = dates.twoDaysAgo;
  
  // Get daily costs and verify
  const todayCost = budgetForecaster.getDailyCost(dates.today);
  console.log(`Today's cost: $${todayCost.toFixed(6)}`);
  console.assert(todayCost === 0.075, 'Today\'s cost should be 0.075');
  
  const yesterdayCost = budgetForecaster.getDailyCost(dates.yesterday);
  console.log(`Yesterday's cost: $${yesterdayCost.toFixed(6)}`);
  console.assert(yesterdayCost === 0.04, 'Yesterday\'s cost should be 0.04');
  
  const twoDaysAgoCost = budgetForecaster.getDailyCost(dates.twoDaysAgo);
  console.log(`Two days ago cost: $${twoDaysAgoCost.toFixed(6)}`);
  console.assert(twoDaysAgoCost === 0.08, 'Two days ago cost should be 0.08');
  
  // Get daily costs for a range
  const dailyCosts = budgetForecaster.getDailyCosts(7);
  console.log('Daily costs for last 7 days:', dailyCosts);
  
  // Verify current week cost
  const weekCost = budgetForecaster.getCurrentWeekCost();
  console.log(`Current week cost: $${weekCost.toFixed(6)}`);
  
  endTiming('Test 3: Daily cost tracking');
  
  // Test 4: Budget thresholds and alerts
  startTiming('Test 4: Budget thresholds and alerts');
  
  // Clear data for this test
  budgetForecaster.clearData();
  
  // Set budget thresholds
  budgetForecaster.setBudgetThresholds({
    monthly: 0.2, // Very low budget for testing
    warningPercentage: 50,
    criticalPercentage: 80,
    modelsSpecific: {
      'GPT-4o': 0.1
    }
  });
  
  // Log enough usage to trigger alerts
  budgetForecaster.logUsage('GPT-4o', 5000, 2500, 0.08); // 80% of GPT-4o budget
  budgetForecaster.logUsage('GPT-4o-mini', 5000, 2500, 0.03);
  
  // Get active alerts
  const alerts = budgetForecaster.getActiveAlerts();
  console.log(`Generated ${alerts.length} alerts:`);
  alerts.forEach(alert => {
    console.log(`- ${alert.type}: ${alert.message}`);
  });
  
  // Verify that alerts were generated
  console.assert(alerts.length > 0, 'Should have generated at least one alert');
  
  // Verify model-specific alert
  const gpt4oAlert = alerts.find(a => a.model === 'GPT-4o');
  console.assert(gpt4oAlert, 'Should have an alert for GPT-4o');
  
  // Test dismissing an alert
  if (alerts.length > 0) {
    const dismissed = budgetForecaster.dismissAlert(alerts[0].id);
    console.log(`Dismissed alert: ${dismissed}`);
    console.assert(dismissed, 'Should be able to dismiss an alert');
    
    const remainingAlerts = budgetForecaster.getActiveAlerts();
    console.log(`Remaining alerts: ${remainingAlerts.length}`);
    console.assert(remainingAlerts.length === alerts.length - 1, 'Should have one less active alert');
  }
  
  endTiming('Test 4: Budget thresholds and alerts');
  
  // Test 5: Budget forecasting
  startTiming('Test 5: Budget forecasting');
  
  // Clear data for this test
  budgetForecaster.clearData();
  
  // Create varied usage over time to enable forecasting
  // Today
  budgetForecaster.logUsage('GPT-4o', 1000, 500, 0.025);
  budgetForecaster.logUsage('GPT-4o-mini', 1000, 500, 0.005);
  
  // Create records for previous days with increasing trend
  for (let day = 1; day <= 7; day++) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    
    const dailyBase = 0.02 * (1 + day * 0.05); // Increasing base cost
    
    const record1 = budgetForecaster.logUsage('GPT-4o', 1000, 500, dailyBase);
    record1.timestamp = date;
    
    const record2 = budgetForecaster.logUsage('GPT-4o-mini', 1000, 500, dailyBase * 0.2);
    record2.timestamp = date;
  }
  
  // Get budget forecast
  const forecast = budgetForecaster.getBudgetForecast();
  
  console.log('Budget forecast:');
  console.log(`Daily projected cost: $${forecast.projectedDailyCost.toFixed(6)}`);
  console.log(`Monthly projected cost: $${forecast.projectedMonthlyCost.toFixed(6)}`);
  console.log(`Annual projected cost: $${forecast.projectedAnnualCost.toFixed(6)}`);
  console.log(`Trend percentage: ${forecast.trendPercentage.toFixed(2)}%`);
  console.log(`Confidence score: ${forecast.confidenceScore.toFixed(2)}`);
  
  // Verify model breakdown in forecast
  console.log('Model breakdown:');
  Object.entries(forecast.modelsBreakdown).forEach(([model, data]) => {
    console.log(`${model}: $${data.projectedMonthlyCost.toFixed(6)} (${data.trendPercentage.toFixed(2)}% trend)`);
  });
  
  // Verify most expensive models
  console.log('Most expensive models:');
  forecast.mostExpensiveModels.forEach(model => {
    console.log(`${model.model}: $${model.cost.toFixed(6)} (${model.percentage.toFixed(2)}%)`);
  });
  
  // Verify that we have at least the basic forecast information
  console.assert(forecast.projectedDailyCost > 0, 'Should have a positive daily projection');
  console.assert(forecast.projectedMonthlyCost > 0, 'Should have a positive monthly projection');
  console.assert(forecast.modelsBreakdown['GPT-4o'], 'Should have a GPT-4o in model breakdown');
  console.assert(forecast.modelsBreakdown['GPT-4o-mini'], 'Should have a GPT-4o-mini in model breakdown');
  
  endTiming('Test 5: Budget forecasting');
  
  // Test 6: Optimization recommendations
  startTiming('Test 6: Optimization recommendations');
  
  // Clear data for this test
  budgetForecaster.clearData();
  
  // Create scenario that would trigger optimization recommendations
  
  // 1. Model switch recommendation: heavy use of expensive model
  for (let i = 0; i < 20; i++) {
    budgetForecaster.logUsage('GPT-4.5-preview', 1000, 500, 0.11);
  }
  
  // 2. Batch opportunity: many small requests in short periods
  for (let i = 0; i < 10; i++) {
    budgetForecaster.logUsage('GPT-4o', 500, 250, 0.015, 'test-service', {
      prompt: `Test question batch ${Math.floor(i/3)}`
    });
  }
  
  // 3. Caching opportunity: repeated similar queries
  for (let i = 0; i < 5; i++) {
    budgetForecaster.logUsage('GPT-4o', 1000, 500, 0.025, 'test-service', {
      prompt: 'What is the capital of France?'
    });
  }
  
  // Force recommendation generation by checking thresholds
  budgetForecaster.checkBudgetThresholds();
  
  // Get recommendations
  const recommendations = budgetForecaster.getOptimizationRecommendations();
  console.log(`Generated ${recommendations.length} recommendations:`);
  recommendations.forEach(rec => {
    console.log(`- [${rec.priority}] ${rec.type}: ${rec.description} (Savings: $${rec.potentialSavings.toFixed(6)})`);
  });
  
  // Implement a recommendation
  if (recommendations.length > 0) {
    const implemented = budgetForecaster.markRecommendationImplemented(recommendations[0].id);
    console.log(`Implemented recommendation: ${implemented}`);
    console.assert(implemented, 'Should be able to implement a recommendation');
    
    // Verify that it's no longer in active recommendations
    const activeRecs = budgetForecaster.getOptimizationRecommendations();
    console.log(`Remaining active recommendations: ${activeRecs.length}`);
    console.assert(activeRecs.length === recommendations.length - 1, 'Should have one less active recommendation');
    
    // Get all recommendations including implemented ones
    const allRecs = budgetForecaster.getOptimizationRecommendations(false);
    console.log(`All recommendations: ${allRecs.length}`);
    console.assert(allRecs.length === recommendations.length, 'Should still have all recommendations when including implemented ones');
  }
  
  endTiming('Test 6: Optimization recommendations');
  
  // Test 7: Budget integration with optimization services
  startTiming('Test 7: Budget integration with optimization services');
  
  // Clear data for this test
  budgetForecaster.clearData();
  
  // Log some normal usage
  budgetForecaster.logUsage('GPT-4o', 1000, 500, 0.03);
  budgetForecaster.logUsage('GPT-4o-mini', 1000, 500, 0.01);
  
  // Log savings from batch processor
  budgetForecaster.logBatchSavings('GPT-4o', 0.015, 'Batched 3 requests');
  
  // Log savings from semantic cache
  budgetForecaster.logCacheSavings('GPT-4o', 0.02, 'Cache hit for 4 similar queries');
  
  // Verify total costs and savings
  const finalTotalCost = budgetForecaster.getTotalCost();
  const finalTotalSavings = budgetForecaster.getTotalSavings();
  
  console.log(`Final total cost: $${finalTotalCost.toFixed(6)}`);
  console.log(`Final total savings: $${finalTotalSavings.toFixed(6)}`);
  console.log(`Savings ratio: ${(finalTotalSavings / finalTotalCost * 100).toFixed(2)}%`);
  
  // Get savings breakdown by source
  const finalSavingsBySource = budgetForecaster.getSavingsBySource();
  console.log('Final savings by source:');
  Object.entries(finalSavingsBySource).forEach(([source, amount]) => {
    if (amount > 0) {
      console.log(`- ${source}: $${amount.toFixed(6)}`);
    }
  });
  
  console.assert(finalSavingsBySource.batch_processing === 0.015, 'Batch savings should be 0.015');
  console.assert(finalSavingsBySource.semantic_cache === 0.02, 'Cache savings should be 0.02');
  console.assert(finalTotalSavings === 0.035, 'Total savings should be 0.035');
  
  endTiming('Test 7: Budget integration with optimization services');
  
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
    console.log('\n✅ All Adaptive Budget Forecaster integration tests passed!');
  } else {
    console.log('\n❌ Some Adaptive Budget Forecaster integration tests failed.');
  }
  
  // Clean up
  budgetForecaster.clearData();
}

// Run the tests
runTests().catch(error => {
  console.error('Error in Adaptive Budget Forecaster integration tests:', error);
});