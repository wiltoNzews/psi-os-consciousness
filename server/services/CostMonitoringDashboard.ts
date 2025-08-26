/**
 * Cost Monitoring Dashboard
 * 
 * This service monitors API usage costs, displays insights, and provides alerts 
 * for budget overruns as part of the OROBORO NEXUS cost optimization architecture.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { v4 as uuidv4 } from 'uuid';
import { budgetForecaster } from './AdaptiveBudgetForecaster.js';

/**
 * Cost entry interface
 */
export interface CostEntry {
  id: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  source: 'api' | 'cache' | 'batch' | 'estimate';
  originalCost?: number; // Cost before savings from cache or batch
  timestamp: Date;
  taskId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * Alert interface
 */
export interface Alert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  cost: number;
  budget: number;
  percentUsed: number;
  source: string;
  metadata?: Record<string, any>;
  acknowledged: boolean;
}

/**
 * Cost metrics interface
 */
export interface CostMetrics {
  totalCost: number;
  totalSavings: number;
  cacheSavings: number;
  batchSavings: number;
  modelSavings: number;
  inputTokens: number;
  outputTokens: number;
  apiCalls: number;
  cacheHits: number;
  batchedCalls: number;
  costPerCall: number;
  savingsRate: number; // Percentage of potential cost saved
}

/**
 * Model usage stats interface
 */
export interface ModelUsageStats {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  originalCost: number;
  savings: number;
  calls: number;
  cacheHits: number;
  batchedCalls: number;
  averageCostPerCall: number;
  savingsRate: number;
}

/**
 * Cost monitoring dashboard configuration
 */
export interface CostMonitoringConfig {
  monthlyBudget: number;
  dailyBudget?: number;
  hourlyLimit?: number;
  alertThresholds: {
    warning: number; // percentage (0-1)
    critical: number; // percentage (0-1)
  };
  retentionDays: number;
  enableNotifications: boolean;
  notificationChannels?: string[];
  refreshInterval?: number; // milliseconds
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: CostMonitoringConfig = {
  monthlyBudget: 690.0, // $690 per month
  dailyBudget: 23.0, // ~$690/30
  hourlyLimit: 5.0, // Safety limit for hourly spend
  alertThresholds: {
    warning: 0.7, // 70% of budget
    critical: 0.9 // 90% of budget
  },
  retentionDays: 90, // Store 90 days of cost data
  enableNotifications: true,
  notificationChannels: ['console', 'log'],
  refreshInterval: 5 * 60 * 1000 // 5 minutes
};

/**
 * Cost Monitoring Dashboard class
 */
export class CostMonitoringDashboard {
  private costEntries: CostEntry[] = [];
  private alerts: Alert[] = [];
  private config: CostMonitoringConfig;
  private currentMonthStart: Date;
  private currentDayStart: Date;
  private refreshInterval: NodeJS.Timeout | null = null;
  private notificationHandlers: Record<string, (alert: Alert) => void> = {
    console: (alert: Alert) => {
      console.log(`[COST ${alert.level.toUpperCase()}] ${alert.message}`);
    },
    log: (alert: Alert) => {
      console.log(`Cost alert logged: ${JSON.stringify(alert)}`);
    }
  };
  
  constructor(config: Partial<CostMonitoringConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.currentMonthStart = this.getMonthStart(new Date());
    this.currentDayStart = this.getDayStart(new Date());
    
    // Start the dashboard refresh interval
    if (this.config.refreshInterval && this.config.refreshInterval > 0) {
      this.startRefreshInterval();
    }
    
    console.log(`Cost Monitoring Dashboard initialized with monthly budget: $${this.config.monthlyBudget}`);
  }
  
  /**
   * Log a cost entry
   * 
   * @param model The model used
   * @param inputTokens The number of input tokens
   * @param outputTokens The number of output tokens
   * @param cost The cost incurred
   * @param source The source of the cost (api, cache, batch, estimate)
   * @param originalCost The original cost before any savings (for cache/batch)
   * @param metadata Additional metadata
   * @returns The created cost entry
   */
  logCost(
    model: string,
    inputTokens: number,
    outputTokens: number,
    cost: number,
    source: CostEntry['source'] = 'api',
    originalCost?: number,
    metadata: Record<string, any> = {}
  ): CostEntry {
    // Create cost entry
    const entry: CostEntry = {
      id: uuidv4(),
      model,
      inputTokens,
      outputTokens,
      cost,
      source,
      originalCost: originalCost || cost,
      timestamp: new Date(),
      metadata
    };
    
    // Add to cost entries
    this.costEntries.push(entry);
    
    // Update the budget forecaster
    if (source === 'api') {
      budgetForecaster.logUsage(model, cost, `API usage: ${inputTokens} input tokens, ${outputTokens} output tokens`);
    } else if (source === 'cache') {
      const saving = (originalCost || 0) - cost;
      if (saving > 0 && originalCost) {
        budgetForecaster.logCacheSavings(model, saving, `Cache hit for ${inputTokens} tokens`);
      }
    } else if (source === 'batch') {
      const saving = (originalCost || 0) - cost;
      if (saving > 0 && originalCost) {
        budgetForecaster.logBatchSavings(model, saving, `Batched request for ${inputTokens} tokens`);
      }
    }
    
    // Check budget thresholds
    this.checkBudgetThresholds();
    
    // Clean up old entries
    this.cleanupOldEntries();
    
    return entry;
  }
  
  /**
   * Get all cost entries
   * 
   * @param limit The maximum number of entries to return
   * @param filter Optional filter function
   * @returns Array of cost entries
   */
  getCostEntries(
    limit?: number,
    filter?: (entry: CostEntry) => boolean
  ): CostEntry[] {
    let entries = [...this.costEntries];
    
    if (filter) {
      entries = entries.filter(filter);
    }
    
    // Sort by timestamp (newest first)
    entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    if (limit && limit > 0) {
      entries = entries.slice(0, limit);
    }
    
    return entries;
  }
  
  /**
   * Get cost metrics for a specific period
   * 
   * @param period 'day', 'month', 'all', or a date range
   * @returns Cost metrics
   */
  getCostMetrics(
    period: 'day' | 'month' | 'all' | { start: Date; end: Date; } = 'month'
  ): CostMetrics {
    // Get entries for the period
    const entries = this.getEntriesForPeriod(period);
    
    // Calculate metrics
    const metrics: CostMetrics = {
      totalCost: 0,
      totalSavings: 0,
      cacheSavings: 0,
      batchSavings: 0,
      modelSavings: 0,
      inputTokens: 0,
      outputTokens: 0,
      apiCalls: 0,
      cacheHits: 0,
      batchedCalls: 0,
      costPerCall: 0,
      savingsRate: 0
    };
    
    // Calculate total cost and savings
    for (const entry of entries) {
      metrics.totalCost += entry.cost;
      metrics.inputTokens += entry.inputTokens;
      metrics.outputTokens += entry.outputTokens;
      
      if (entry.source === 'api') {
        metrics.apiCalls++;
      } else if (entry.source === 'cache') {
        metrics.cacheHits++;
        if (entry.originalCost) {
          const saving = entry.originalCost - entry.cost;
          metrics.cacheSavings += saving;
          metrics.totalSavings += saving;
        }
      } else if (entry.source === 'batch') {
        metrics.batchedCalls++;
        if (entry.originalCost) {
          const saving = entry.originalCost - entry.cost;
          metrics.batchSavings += saving;
          metrics.totalSavings += saving;
        }
      }
    }
    
    // Calculate model switching savings from budget forecaster
    metrics.modelSavings = budgetForecaster.getSavingsStats().modelSwitchSavings;
    metrics.totalSavings += metrics.modelSavings;
    
    // Calculate cost per call and savings rate
    const totalCalls = metrics.apiCalls + metrics.cacheHits + metrics.batchedCalls;
    metrics.costPerCall = totalCalls > 0 ? metrics.totalCost / totalCalls : 0;
    
    const potentialCost = metrics.totalCost + metrics.totalSavings;
    metrics.savingsRate = potentialCost > 0 ? (metrics.totalSavings / potentialCost) * 100 : 0;
    
    return metrics;
  }
  
  /**
   * Get model usage statistics
   * 
   * @param period 'day', 'month', 'all', or a date range
   * @returns Array of model usage statistics
   */
  getModelUsageStats(
    period: 'day' | 'month' | 'all' | { start: Date; end: Date; } = 'month'
  ): ModelUsageStats[] {
    // Get entries for the period
    const entries = this.getEntriesForPeriod(period);
    
    // Group by model
    const modelStats: Record<string, ModelUsageStats> = {};
    
    for (const entry of entries) {
      if (!modelStats[entry.model]) {
        modelStats[entry.model] = {
          model: entry.model,
          inputTokens: 0,
          outputTokens: 0,
          cost: 0,
          originalCost: 0,
          savings: 0,
          calls: 0,
          cacheHits: 0,
          batchedCalls: 0,
          averageCostPerCall: 0,
          savingsRate: 0
        };
      }
      
      const stats = modelStats[entry.model];
      stats.inputTokens += entry.inputTokens;
      stats.outputTokens += entry.outputTokens;
      stats.cost += entry.cost;
      stats.originalCost += entry.originalCost || entry.cost;
      stats.calls++;
      
      if (entry.source === 'cache') {
        stats.cacheHits++;
      } else if (entry.source === 'batch') {
        stats.batchedCalls++;
      }
    }
    
    // Calculate derived metrics
    for (const model in modelStats) {
      const stats = modelStats[model];
      stats.savings = stats.originalCost - stats.cost;
      stats.averageCostPerCall = stats.calls > 0 ? stats.cost / stats.calls : 0;
      stats.savingsRate = stats.originalCost > 0 ? (stats.savings / stats.originalCost) * 100 : 0;
    }
    
    // Sort by cost (highest first)
    return Object.values(modelStats).sort((a, b) => b.cost - a.cost);
  }
  
  /**
   * Get alerts
   * 
   * @param limit The maximum number of alerts to return
   * @param level Optional filter by alert level
   * @returns Array of alerts
   */
  getAlerts(
    limit: number = 10,
    level?: Alert['level']
  ): Alert[] {
    let alerts = [...this.alerts];
    
    if (level) {
      alerts = alerts.filter(alert => alert.level === level);
    }
    
    // Sort by timestamp (newest first)
    alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    if (limit && limit > 0) {
      alerts = alerts.slice(0, limit);
    }
    
    return alerts;
  }
  
  /**
   * Acknowledge an alert
   * 
   * @param alertId The ID of the alert to acknowledge
   * @returns True if the alert was acknowledged, false if not found
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }
  
  /**
   * Get current budget status
   * 
   * @returns Object with current budget status
   */
  getBudgetStatus(): {
    currentMonthSpend: number;
    monthlyBudget: number;
    percentUsed: number;
    remainingBudget: number;
    dailySpend: number;
    dailyBudget: number;
    dailyPercentUsed: number;
    predictedMonthEndSpend: number;
    predictedOverBudget: boolean;
  } {
    const monthMetrics = this.getCostMetrics('month');
    const dayMetrics = this.getCostMetrics('day');
    
    const currentMonthSpend = monthMetrics.totalCost;
    const percentUsed = (currentMonthSpend / this.config.monthlyBudget) * 100;
    const remainingBudget = this.config.monthlyBudget - currentMonthSpend;
    
    const dailySpend = dayMetrics.totalCost;
    const dailyPercentUsed = this.config.dailyBudget ? (dailySpend / this.config.dailyBudget) * 100 : 0;
    
    // Get prediction from budget forecaster
    const predictedMonthEndSpend = budgetForecaster.predictEndOfMonthSpend();
    const predictedOverBudget = predictedMonthEndSpend > this.config.monthlyBudget;
    
    return {
      currentMonthSpend,
      monthlyBudget: this.config.monthlyBudget,
      percentUsed,
      remainingBudget,
      dailySpend,
      dailyBudget: this.config.dailyBudget || 0,
      dailyPercentUsed,
      predictedMonthEndSpend,
      predictedOverBudget
    };
  }
  
  /**
   * Check budget thresholds and create alerts if necessary
   */
  checkBudgetThresholds(): void {
    const status = this.getBudgetStatus();
    
    // Check monthly budget
    if (status.percentUsed >= this.config.alertThresholds.critical * 100) {
      this.createAlert(
        'critical',
        `Monthly budget critical: ${status.percentUsed.toFixed(1)}% of monthly budget used ($${status.currentMonthSpend.toFixed(2)}/$${status.monthlyBudget.toFixed(2)})`,
        status.currentMonthSpend,
        status.monthlyBudget,
        status.percentUsed,
        'monthly_budget'
      );
    } else if (status.percentUsed >= this.config.alertThresholds.warning * 100) {
      this.createAlert(
        'warning',
        `Monthly budget warning: ${status.percentUsed.toFixed(1)}% of monthly budget used ($${status.currentMonthSpend.toFixed(2)}/$${status.monthlyBudget.toFixed(2)})`,
        status.currentMonthSpend,
        status.monthlyBudget,
        status.percentUsed,
        'monthly_budget'
      );
    }
    
    // Check daily budget
    if (this.config.dailyBudget && status.dailyPercentUsed >= this.config.alertThresholds.critical * 100) {
      this.createAlert(
        'critical',
        `Daily budget critical: ${status.dailyPercentUsed.toFixed(1)}% of daily budget used ($${status.dailySpend.toFixed(2)}/$${this.config.dailyBudget.toFixed(2)})`,
        status.dailySpend,
        this.config.dailyBudget,
        status.dailyPercentUsed,
        'daily_budget'
      );
    } else if (this.config.dailyBudget && status.dailyPercentUsed >= this.config.alertThresholds.warning * 100) {
      this.createAlert(
        'warning',
        `Daily budget warning: ${status.dailyPercentUsed.toFixed(1)}% of daily budget used ($${status.dailySpend.toFixed(2)}/$${this.config.dailyBudget.toFixed(2)})`,
        status.dailySpend,
        this.config.dailyBudget,
        status.dailyPercentUsed,
        'daily_budget'
      );
    }
    
    // Check predicted overspend
    if (status.predictedOverBudget) {
      const predictedPercent = (status.predictedMonthEndSpend / status.monthlyBudget) * 100;
      this.createAlert(
        'warning',
        `Budget forecast warning: Projected to spend ${predictedPercent.toFixed(1)}% of monthly budget ($${status.predictedMonthEndSpend.toFixed(2)}/$${status.monthlyBudget.toFixed(2)})`,
        status.predictedMonthEndSpend,
        status.monthlyBudget,
        predictedPercent,
        'forecast'
      );
    }
  }
  
  /**
   * Create a budget alert
   * 
   * @param level The alert level
   * @param message The alert message
   * @param cost The current cost
   * @param budget The budget
   * @param percentUsed The percentage of budget used
   * @param source The source of the alert
   * @returns The created alert
   */
  private createAlert(
    level: Alert['level'],
    message: string,
    cost: number,
    budget: number,
    percentUsed: number,
    source: string
  ): Alert {
    // Check if a similar alert was created in the last hour
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const recentSimilarAlert = this.alerts.find(alert => 
      alert.level === level && 
      alert.source === source && 
      alert.timestamp >= oneHourAgo
    );
    
    // If we already have a similar recent alert, don't create a new one
    if (recentSimilarAlert) {
      return recentSimilarAlert;
    }
    
    // Create new alert
    const alert: Alert = {
      id: uuidv4(),
      level,
      message,
      timestamp: new Date(),
      cost,
      budget,
      percentUsed,
      source,
      acknowledged: false
    };
    
    // Add to alerts
    this.alerts.push(alert);
    
    // Send notifications
    this.sendNotifications(alert);
    
    return alert;
  }
  
  /**
   * Send notifications for an alert
   * 
   * @param alert The alert to send notifications for
   */
  private sendNotifications(alert: Alert): void {
    if (!this.config.enableNotifications) {
      return;
    }
    
    const channels = this.config.notificationChannels || ['console'];
    
    for (const channel of channels) {
      const handler = this.notificationHandlers[channel];
      if (handler) {
        handler(alert);
      }
    }
  }
  
  /**
   * Register a notification handler
   * 
   * @param channel The notification channel
   * @param handler The notification handler
   */
  registerNotificationHandler(
    channel: string,
    handler: (alert: Alert) => void
  ): void {
    this.notificationHandlers[channel] = handler;
  }
  
  /**
   * Get entries for a specific period
   * 
   * @param period 'day', 'month', 'all', or a date range
   * @returns Array of cost entries
   */
  private getEntriesForPeriod(
    period: 'day' | 'month' | 'all' | { start: Date; end: Date; }
  ): CostEntry[] {
    if (period === 'all') {
      return [...this.costEntries];
    }
    
    if (period === 'day') {
      const dayStart = this.getDayStart(new Date());
      return this.costEntries.filter(entry => entry.timestamp >= dayStart);
    }
    
    if (period === 'month') {
      const monthStart = this.getMonthStart(new Date());
      return this.costEntries.filter(entry => entry.timestamp >= monthStart);
    }
    
    // Date range
    return this.costEntries.filter(entry => 
      entry.timestamp >= period.start && entry.timestamp <= period.end
    );
  }
  
  /**
   * Get the start of a day
   * 
   * @param date The date
   * @returns The start of the day
   */
  private getDayStart(date: Date): Date {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    return dayStart;
  }
  
  /**
   * Get the start of a month
   * 
   * @param date The date
   * @returns The start of the month
   */
  private getMonthStart(date: Date): Date {
    const monthStart = new Date(date);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    return monthStart;
  }
  
  /**
   * Clean up old entries
   */
  private cleanupOldEntries(): void {
    if (this.config.retentionDays <= 0) {
      return; // Keep all entries
    }
    
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - this.config.retentionDays);
    
    // Filter out old entries
    this.costEntries = this.costEntries.filter(entry => entry.timestamp >= cutoff);
    
    // Also clean up old alerts
    this.alerts = this.alerts.filter(alert => alert.timestamp >= cutoff);
  }
  
  /**
   * Start the dashboard refresh interval
   */
  private startRefreshInterval(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    this.refreshInterval = setInterval(() => {
      // Check if we've moved to a new day or month
      const now = new Date();
      const dayStart = this.getDayStart(now);
      const monthStart = this.getMonthStart(now);
      
      // Check if we're in a new day
      if (dayStart.getTime() !== this.currentDayStart.getTime()) {
        this.currentDayStart = dayStart;
        console.log(`New day started: ${dayStart.toISOString()}`);
        
        // Daily budget reset notification
        this.createAlert(
          'info',
          `Daily budget reset for ${dayStart.toISOString().split('T')[0]}`,
          0,
          this.config.dailyBudget || 0,
          0,
          'daily_reset'
        );
      }
      
      // Check if we're in a new month
      if (monthStart.getTime() !== this.currentMonthStart.getTime()) {
        this.currentMonthStart = monthStart;
        console.log(`New month started: ${monthStart.toISOString()}`);
        
        // Monthly budget reset notification
        this.createAlert(
          'info',
          `Monthly budget reset for ${monthStart.toISOString().split('T')[0]}`,
          0,
          this.config.monthlyBudget,
          0,
          'monthly_reset'
        );
      }
      
      // Check budget thresholds
      this.checkBudgetThresholds();
      
    }, this.config.refreshInterval);
  }
  
  /**
   * Stop the dashboard refresh interval
   */
  stopRefreshInterval(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
  
  /**
   * Generate a cost report
   * 
   * @param period 'day', 'month', 'all', or a date range
   * @returns The cost report
   */
  generateCostReport(
    period: 'day' | 'month' | 'all' | { start: Date; end: Date; } = 'month'
  ): {
    period: string;
    metrics: CostMetrics;
    modelStats: ModelUsageStats[];
    budgetStatus: ReturnType<typeof this.getBudgetStatus>;
    alerts: Alert[];
    recommendations: Array<{
      type: string;
      description: string;
      impact: 'low' | 'medium' | 'high';
      potentialSavings: number;
    }>;
  } {
    // Get period description
    let periodDescription: string;
    if (period === 'day') {
      periodDescription = `Day: ${new Date().toISOString().split('T')[0]}`;
    } else if (period === 'month') {
      const now = new Date();
      periodDescription = `Month: ${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    } else if (period === 'all') {
      periodDescription = 'All time';
    } else {
      periodDescription = `Custom: ${period.start.toISOString().split('T')[0]} to ${period.end.toISOString().split('T')[0]}`;
    }
    
    // Get metrics and stats
    const metrics = this.getCostMetrics(period);
    const modelStats = this.getModelUsageStats(period);
    const budgetStatus = this.getBudgetStatus();
    const activeAlerts = this.getAlerts(5).filter(a => !a.acknowledged);
    
    // Generate recommendations
    const recommendations: Array<{
      type: string;
      description: string;
      impact: 'low' | 'medium' | 'high';
      potentialSavings: number;
    }> = [];
    
    // Check for low cache hit rate
    if (metrics.cacheHits / (metrics.cacheHits + metrics.apiCalls) < 0.4) {
      const potentialSavings = metrics.totalCost * 0.2; // Estimate 20% savings potential
      recommendations.push({
        type: 'cache_optimization',
        description: 'Increase cache usage by adjusting semantic similarity thresholds and TTL',
        impact: 'high',
        potentialSavings
      });
    }
    
    // Check for low batch rate
    if (metrics.batchedCalls / (metrics.batchedCalls + metrics.apiCalls) < 0.3) {
      const potentialSavings = metrics.totalCost * 0.15; // Estimate 15% savings potential
      recommendations.push({
        type: 'batch_optimization',
        description: 'Increase batch processing by adjusting batch size and timing parameters',
        impact: 'medium',
        potentialSavings
      });
    }
    
    // Check for expensive models
    const expensiveModels = modelStats.filter(m => 
      m.cost > metrics.totalCost * 0.3 && m.averageCostPerCall > 0.01
    );
    
    if (expensiveModels.length > 0) {
      const totalExpensiveModelCost = expensiveModels.reduce((sum, m) => sum + m.cost, 0);
      const potentialSavings = totalExpensiveModelCost * 0.6; // Estimate 60% savings potential
      
      recommendations.push({
        type: 'model_optimization',
        description: `Switch from expensive models (${expensiveModels.map(m => m.model).join(', ')}) to more cost-effective alternatives when possible`,
        impact: 'high',
        potentialSavings
      });
    }
    
    // Recommend budget adjustment if we're consistently under budget
    if (budgetStatus.predictedMonthEndSpend < budgetStatus.monthlyBudget * 0.6) {
      recommendations.push({
        type: 'budget_optimization',
        description: 'Consider adjusting budget allocation or increasing model quality as usage is consistently below budget',
        impact: 'low',
        potentialSavings: 0 // Not a cost-saving recommendation
      });
    }
    
    return {
      period: periodDescription,
      metrics,
      modelStats,
      budgetStatus,
      alerts: activeAlerts,
      recommendations
    };
  }
  
  /**
   * Get real-time dashboard data
   * 
   * @returns Real-time dashboard data
   */
  getDashboardData(): {
    currentCost: number;
    savingsToday: number;
    savingsTotal: number;
    apiCalls: number;
    cacheHits: number;
    batchedCalls: number;
    topModels: Array<{ model: string; cost: number; calls: number }>;
    recentCalls: CostEntry[];
    alerts: Alert[];
    budgetStatus: ReturnType<typeof this.getBudgetStatus>;
  } {
    const dayMetrics = this.getCostMetrics('day');
    const monthMetrics = this.getCostMetrics('month');
    const modelStats = this.getModelUsageStats('day');
    const budgetStatus = this.getBudgetStatus();
    
    // Get top models by cost
    const topModels = modelStats
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5)
      .map(m => ({
        model: m.model,
        cost: m.cost,
        calls: m.calls
      }));
    
    // Get recent calls
    const recentCalls = this.getCostEntries(10);
    
    // Get active alerts
    const alerts = this.getAlerts(5).filter(a => !a.acknowledged);
    
    return {
      currentCost: dayMetrics.totalCost,
      savingsToday: dayMetrics.totalSavings,
      savingsTotal: monthMetrics.totalSavings,
      apiCalls: dayMetrics.apiCalls,
      cacheHits: dayMetrics.cacheHits,
      batchedCalls: dayMetrics.batchedCalls,
      topModels,
      recentCalls,
      alerts,
      budgetStatus
    };
  }
  
  /**
   * Update the dashboard configuration
   * 
   * @param config Updated configuration
   */
  updateConfig(config: Partial<CostMonitoringConfig>): void {
    const oldConfig = { ...this.config };
    this.config = { ...this.config, ...config };
    
    // If refresh interval changed, restart it
    if (config.refreshInterval !== undefined && 
        config.refreshInterval !== oldConfig.refreshInterval) {
      this.startRefreshInterval();
    }
    
    console.log('Cost monitoring dashboard configuration updated');
  }
}

// Create singleton instance
export const costMonitoringDashboard = new CostMonitoringDashboard();