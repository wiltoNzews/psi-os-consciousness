/**
 * Integration test for the Cost Optimization components
 * 
 * This test verifies that the AdaptiveBudgetForecaster, BatchProcessor, 
 * SemanticCachingSystem, and CostMonitoringDashboard work together correctly.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { AdaptiveBudgetForecaster } from '../../services/AdaptiveBudgetForecaster.js';
import { CostMonitoringDashboard } from '../../services/CostMonitoringDashboard.js';

// Mock models/tokens for testing
const models = {
  'gpt-4o': { inputCost: 10.0, outputCost: 30.0 },
  'gpt-4o-mini': { inputCost: 0.15, outputCost: 0.60 },
  'claude-3-haiku': { inputCost: 0.25, outputCost: 1.25 },
};

// Test input data
const testData = {
  stats: { 
    reach: 478000, 
    views: 1600000, 
    engagement: '1.08%' 
  },
  youtube: { 
    views: 302000, 
    hours: 25000 
  },
  intent: 'analysis'
};

describe('Cost Optimization Integration', () => {
  let forecaster;
  let dashboard;
  
  beforeEach(() => {
    // Create new instances for each test
    forecaster = new AdaptiveBudgetForecaster(690, 'balanced');
    dashboard = new CostMonitoringDashboard({ monthlyBudget: 690 });
  });
  
  test('AdaptiveBudgetForecaster and CostMonitoringDashboard integration', async () => {
    // 1. Log standard API usage
    const inputTokens = 1000;
    const outputTokens = 500;
    const model = 'gpt-4o';
    const costPerMillionInput = models[model].inputCost;
    const costPerMillionOutput = models[model].outputCost;
    
    const cost = (inputTokens / 1000000) * costPerMillionInput + 
                 (outputTokens / 1000000) * costPerMillionOutput;
    
    // Log to both components
    forecaster.logUsage(model, cost, `API call: ${inputTokens} input tokens, ${outputTokens} output tokens`);
    dashboard.logCost(model, inputTokens, outputTokens, cost, 'api');
    
    // Verify forecaster state
    expect(forecaster.getOptimalMode()).toBe('balanced'); // Should still be balanced with minimal usage
    
    // Verify dashboard state
    const metrics = dashboard.getCostMetrics();
    expect(metrics.totalCost).toBeCloseTo(cost);
    expect(metrics.apiCalls).toBe(1);
    expect(metrics.inputTokens).toBe(inputTokens);
    expect(metrics.outputTokens).toBe(outputTokens);
    
    // 2. Simulate a cache hit
    const cacheModel = 'claude-3-haiku';
    const originalCost = 0.005; // Cost if we had used the model directly
    const cacheCost = 0.0001; // Very low cost for cache hit
    
    // Log to both components
    dashboard.logCost(
      cacheModel, 
      inputTokens, 
      outputTokens, 
      cacheCost, 
      'cache',
      originalCost
    );
    
    // Verify metrics after cache hit
    const metricsAfterCache = dashboard.getCostMetrics();
    expect(metricsAfterCache.cacheHits).toBe(1);
    expect(metricsAfterCache.cacheSavings).toBeCloseTo(originalCost - cacheCost);
    
    // 3. Simulate multiple API calls to trigger budget mode change
    for (let i = 0; i < 50; i++) {
      const highCost = 10.0; // $10 per call
      forecaster.logUsage('gpt-4o', highCost, 'High volume API usage');
      dashboard.logCost('gpt-4o', 10000, 5000, highCost, 'api');
    }
    
    // Verify forecaster switched to maximum_savings mode
    expect(forecaster.getOptimalMode()).toBe('maximum_savings');
    
    // Verify dashboard shows appropriate budget status
    const budgetStatus = dashboard.getBudgetStatus();
    expect(budgetStatus.percentUsed).toBeGreaterThan(50); // Should have used more than 50% of budget
    
    // 4. Simulate batch processing
    const batchModel = 'gpt-4o-mini';
    const batchOriginalCost = 0.01;
    const batchCost = 0.005; // 50% discount
    
    // Log to both components
    dashboard.logCost(
      batchModel,
      5000,
      2500,
      batchCost,
      'batch',
      batchOriginalCost
    );
    
    // Verify metrics after batch processing
    const metricsAfterBatch = dashboard.getCostMetrics();
    expect(metricsAfterBatch.batchedCalls).toBe(1);
    expect(metricsAfterBatch.batchSavings).toBeCloseTo(batchOriginalCost - batchCost);
    
    // 5. Generate a report to verify integration
    const report = dashboard.generateCostReport();
    
    // The report should include forecaster data
    expect(report.budgetStatus.predictedMonthEndSpend).toBeGreaterThan(0);
    expect(report.recommendations.length).toBeGreaterThan(0);
    
    // 6. Verify alert system integration
    const alerts = dashboard.getAlerts();
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts.some(a => a.level === 'warning' || a.level === 'critical')).toBe(true);
  });
  
  test('Maintains consistent state across components', async () => {
    // Log the same data to both components
    const cost = 0.05;
    
    forecaster.logUsage('gpt-4o-mini', cost, 'Standard API call');
    dashboard.logCost('gpt-4o-mini', 3000, 1500, cost, 'api');
    
    // Verify both components have the same total cost
    const forecastStatus = forecaster.getBudgetStatus();
    const dashboardStatus = dashboard.getBudgetStatus();
    
    // The current spend tracked by both components should match
    expect(forecastStatus.currentSpend).toBeCloseTo(dashboardStatus.currentMonthSpend);
    
    // Now log batch savings
    const batchOriginalCost = 0.1;
    const batchCost = 0.05;
    
    // Log savings
    forecaster.logBatchSavings('gpt-4o-mini', batchOriginalCost - batchCost, 'Batch processing');
    dashboard.logCost('gpt-4o-mini', 10000, 5000, batchCost, 'batch', batchOriginalCost);
    
    // Verify savings are tracked consistently
    const forecastSavings = forecaster.getSavingsStats();
    const dashboardMetrics = dashboard.getCostMetrics();
    
    expect(forecastSavings.batchSavings).toBeCloseTo(dashboardMetrics.batchSavings);
  });
  
  test('Generates appropriate recommendations based on usage patterns', async () => {
    // Log mostly API calls with expensive models
    for (let i = 0; i < 20; i++) {
      dashboard.logCost('gpt-4o', 2000, 1000, 0.07, 'api');
    }
    
    // Log just a few cache hits
    for (let i = 0; i < 2; i++) {
      dashboard.logCost('gpt-4o-mini', 2000, 1000, 0.0002, 'cache', 0.003);
    }
    
    // Get recommendations
    const report = dashboard.generateCostReport();
    
    // Should recommend increasing cache usage
    const cacheRecommendation = report.recommendations.find(r => 
      r.type === 'cache_optimization'
    );
    expect(cacheRecommendation).toBeDefined();
    expect(cacheRecommendation.impact).toBe('high');
    
    // Should recommend model switching
    const modelRecommendation = report.recommendations.find(r => 
      r.type === 'model_optimization'
    );
    expect(modelRecommendation).toBeDefined();
  });
});