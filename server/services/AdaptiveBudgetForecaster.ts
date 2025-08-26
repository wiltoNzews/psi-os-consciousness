/**
 * Adaptive Budget Forecaster
 * 
 * This service predicts and adapts API budget usage to optimize costs
 * and ensure the system stays within defined budget constraints while
 * balancing performance requirements.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Budget profile interface
 */
export interface BudgetProfile {
  id: string;
  name: string;
  mode: 'maximum_savings' | 'balanced' | 'maximum_performance';
  monthlyBudget: number;
  currentSpend: number;
  alertThresholds: {
    warning: number; // percentage of budget (0-1)
    critical: number; // percentage of budget (0-1)
  };
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Cost allocation interface
 */
export interface CostAllocation {
  model: string;
  cost: number;
  timestamp: Date;
  source: string;
  details?: string;
  metadata?: Record<string, any>;
}

/**
 * Budget forecast interface
 */
export interface BudgetForecast {
  id: string;
  timestamp: Date;
  remainingBudget: number;
  predictedEndOfMonthSpend: number;
  recommendedMode: 'maximum_savings' | 'balanced' | 'maximum_performance';
  modelRecommendations: Record<string, number>; // model -> usage percentage
  savingsOpportunities: Array<{
    description: string;
    potentialSavings: number;
    implementation: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  metadata?: Record<string, any>;
}

/**
 * Model pricing interface
 */
export interface ModelPricing {
  model: string;
  inputCost: number; // per 1M tokens
  outputCost: number; // per 1M tokens
  trainingCost?: number; // per 1M tokens
  embeddingCost?: number; // per 1M tokens
  provider: string;
  tier: 'economy' | 'standard' | 'premium';
  metadata?: Record<string, any>;
}

/**
 * Budget alert interface
 */
export interface BudgetAlert {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'critical';
  message: string;
  currentSpend: number;
  monthlyBudget: number;
  percentUsed: number;
  remainingBudget: number;
  triggeredBy: string;
  metadata?: Record<string, any>;
}

/**
 * Default model pricing
 */
const DEFAULT_MODEL_PRICING: ModelPricing[] = [
  {
    model: 'GPT-4o',
    inputCost: 10.0, // $10.00 per 1M input tokens
    outputCost: 30.0, // $30.00 per 1M output tokens
    provider: 'OpenAI',
    tier: 'premium'
  },
  {
    model: 'GPT-4o-mini',
    inputCost: 0.15, // $0.15 per 1M input tokens
    outputCost: 0.60, // $0.60 per 1M output tokens
    provider: 'OpenAI',
    tier: 'standard'
  },
  {
    model: 'GPT-3.5-turbo',
    inputCost: 0.50, // $0.50 per 1M input tokens
    outputCost: 1.50, // $1.50 per 1M output tokens
    provider: 'OpenAI',
    tier: 'economy'
  },
  {
    model: 'claude-3-opus',
    inputCost: 15.0, // $15.00 per 1M input tokens
    outputCost: 75.0, // $75.00 per 1M output tokens
    provider: 'Anthropic',
    tier: 'premium'
  },
  {
    model: 'claude-3-sonnet',
    inputCost: 3.0, // $3.00 per 1M input tokens
    outputCost: 15.0, // $15.00 per 1M output tokens
    provider: 'Anthropic',
    tier: 'standard'
  },
  {
    model: 'claude-3-haiku',
    inputCost: 0.25, // $0.25 per 1M input tokens
    outputCost: 1.25, // $1.25 per 1M output tokens
    provider: 'Anthropic',
    tier: 'economy'
  },
  {
    model: 'gemini-1.5-pro',
    inputCost: 3.5, // $3.50 per 1M input tokens
    outputCost: 10.5, // $10.50 per 1M output tokens
    provider: 'Google',
    tier: 'standard'
  },
  {
    model: 'gemini-1.5-flash',
    inputCost: 0.35, // $0.35 per 1M input tokens
    outputCost: 1.05, // $1.05 per 1M output tokens
    provider: 'Google',
    tier: 'economy'
  },
  {
    model: 'text-embedding-3-large',
    inputCost: 0.13, // $0.13 per 1M tokens
    outputCost: 0.0, // No output cost for embeddings
    embeddingCost: 0.13, // $0.13 per 1M tokens
    provider: 'OpenAI',
    tier: 'standard'
  },
  {
    model: 'text-embedding-3-small',
    inputCost: 0.02, // $0.02 per 1M tokens
    outputCost: 0.0, // No output cost for embeddings
    embeddingCost: 0.02, // $0.02 per 1M tokens
    provider: 'OpenAI',
    tier: 'economy'
  }
];

/**
 * Default budget profile
 */
const DEFAULT_BUDGET_PROFILE: BudgetProfile = {
  id: 'default',
  name: 'Default Budget Profile',
  mode: 'balanced',
  monthlyBudget: 690.0, // $690 per month
  currentSpend: 0.0,
  alertThresholds: {
    warning: 0.7, // 70% of budget
    critical: 0.9 // 90% of budget
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

/**
 * AdaptiveBudgetForecaster class
 */
export class AdaptiveBudgetForecaster {
  private activeProfile: BudgetProfile;
  private profiles: Map<string, BudgetProfile> = new Map();
  private usageHistory: CostAllocation[] = [];
  private modelPricing: Map<string, ModelPricing> = new Map();
  private forecasts: BudgetForecast[] = [];
  private alerts: BudgetAlert[] = [];
  private forecastInterval: NodeJS.Timeout | null = null;
  private budgetCheckInterval: NodeJS.Timeout | null = null;
  private savingsData: {
    cacheSavings: number;
    batchSavings: number;
    modelSwitchSavings: number;
    totalSaved: number;
  } = {
    cacheSavings: 0,
    batchSavings: 0,
    modelSwitchSavings: 0,
    totalSaved: 0
  };
  
  constructor(
    monthlyBudget: number = 690,
    mode: BudgetProfile['mode'] = 'balanced',
    modelPricing: ModelPricing[] = DEFAULT_MODEL_PRICING
  ) {
    // Initialize the default profile
    this.activeProfile = {
      ...DEFAULT_BUDGET_PROFILE,
      monthlyBudget,
      mode,
      updatedAt: new Date()
    };
    
    this.profiles.set('default', this.activeProfile);
    
    // Initialize model pricing
    for (const pricing of modelPricing) {
      this.modelPricing.set(pricing.model, pricing);
    }
    
    // Start forecasting and budget checks
    this.startForecasting();
    this.startBudgetChecks();
    
    console.log(`Adaptive Budget Forecaster initialized with ${monthlyBudget} monthly budget in ${mode} mode`);
  }
  
  /**
   * Log a usage of a model
   * 
   * @param model The model used
   * @param cost The cost incurred
   * @param details Optional details about the usage
   * @param metadata Optional metadata
   */
  logUsage(
    model: string,
    cost: number,
    details: string = '',
    metadata: Record<string, any> = {}
  ): void {
    // Update the active profile's current spend
    this.activeProfile.currentSpend += cost;
    this.activeProfile.updatedAt = new Date();
    this.profiles.set(this.activeProfile.id, this.activeProfile);
    
    // Add to usage history
    const costAllocation: CostAllocation = {
      model,
      cost,
      timestamp: new Date(),
      source: 'api_call',
      details,
      metadata
    };
    
    this.usageHistory.push(costAllocation);
    
    // Log to console
    console.log(`Budget usage logged: ${model} - $${cost.toFixed(6)} - ${details || 'No details provided'}`);
    
    // Check budget thresholds
    this.checkBudgetThresholds();
  }
  
  /**
   * Log savings from the cache
   * 
   * @param model The model that would have been used
   * @param costSaved The cost saved
   * @param details Optional details about the savings
   */
  logCacheSavings(
    model: string,
    costSaved: number,
    details: string = 'Cache hit'
  ): void {
    // Add to usage history
    const costAllocation: CostAllocation = {
      model,
      cost: costSaved,
      timestamp: new Date(),
      source: 'cache_savings',
      details
    };
    
    this.usageHistory.push(costAllocation);
    
    // Update savings data
    this.savingsData.cacheSavings += costSaved;
    this.savingsData.totalSaved += costSaved;
    
    // Log to console
    console.log(`Cache savings logged: ${model} - $${costSaved.toFixed(6)} - ${details}`);
  }
  
  /**
   * Log savings from batch processing
   * 
   * @param model The model used
   * @param costSaved The cost saved
   * @param details Optional details about the savings
   */
  logBatchSavings(
    model: string,
    costSaved: number,
    details: string = 'Batch processing'
  ): void {
    // Add to usage history
    const costAllocation: CostAllocation = {
      model,
      cost: costSaved,
      timestamp: new Date(),
      source: 'batch_savings',
      details
    };
    
    this.usageHistory.push(costAllocation);
    
    // Update savings data
    this.savingsData.batchSavings += costSaved;
    this.savingsData.totalSaved += costSaved;
    
    // Log to console
    console.log(`Batch savings logged: ${model} - $${costSaved.toFixed(6)} - ${details}`);
  }
  
  /**
   * Log savings from model switching
   * 
   * @param originalModel The original model that would have been used
   * @param actualModel The model that was actually used
   * @param costSaved The cost saved
   * @param details Optional details about the savings
   */
  logModelSwitchSavings(
    originalModel: string,
    actualModel: string,
    costSaved: number,
    details: string = 'Model switching'
  ): void {
    // Add to usage history
    const costAllocation: CostAllocation = {
      model: actualModel,
      cost: costSaved,
      timestamp: new Date(),
      source: 'model_switch_savings',
      details: `${details} (from ${originalModel} to ${actualModel})`,
      metadata: {
        originalModel,
        actualModel
      }
    };
    
    this.usageHistory.push(costAllocation);
    
    // Update savings data
    this.savingsData.modelSwitchSavings += costSaved;
    this.savingsData.totalSaved += costSaved;
    
    // Log to console
    console.log(`Model switch savings logged: ${originalModel} -> ${actualModel} - $${costSaved.toFixed(6)}`);
  }
  
  /**
   * Predict remaining budget for the current month
   * 
   * @returns The predicted remaining budget
   */
  predictRemainingBudget(): number {
    const remainingBudget = this.activeProfile.monthlyBudget - this.activeProfile.currentSpend;
    return remainingBudget;
  }
  
  /**
   * Predict end-of-month spend based on current usage patterns
   * 
   * @returns The predicted end-of-month spend
   */
  predictEndOfMonthSpend(): number {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const remainingDays = daysInMonth - currentDay + 1;
    
    // Get recent spend (last 3 days or all if less than 3 days of data)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const recentUsage = this.usageHistory.filter(
      usage => usage.timestamp >= threeDaysAgo && usage.source === 'api_call'
    );
    
    let predictedDailySpend: number;
    
    if (recentUsage.length > 0) {
      // Calculate average daily spend from recent usage
      const recentDays = Math.min(3, currentDay);
      const recentTotalSpend = recentUsage.reduce((sum, usage) => sum + usage.cost, 0);
      predictedDailySpend = recentTotalSpend / recentDays;
    } else {
      // If no recent usage, use current spend divided by days elapsed
      predictedDailySpend = currentDay > 1 ? this.activeProfile.currentSpend / (currentDay - 1) : 0;
    }
    
    // Predict end of month spend
    const predictedRemainingSpend = predictedDailySpend * remainingDays;
    const predictedTotalSpend = this.activeProfile.currentSpend + predictedRemainingSpend;
    
    return predictedTotalSpend;
  }
  
  /**
   * Determine the optimal operational mode based on budget status
   * 
   * @returns The recommended operational mode
   */
  getOptimalMode(): BudgetProfile['mode'] {
    const predictedSpend = this.predictEndOfMonthSpend();
    const budgetRatio = predictedSpend / this.activeProfile.monthlyBudget;
    
    if (budgetRatio > 0.9) {
      // Over 90% of budget predicted to be used - go to maximum savings
      return 'maximum_savings';
    } else if (budgetRatio < 0.7) {
      // Less than 70% of budget predicted to be used - can use maximum performance
      return 'maximum_performance';
    } else {
      // Between 70-90% - use balanced approach
      return 'balanced';
    }
  }
  
  /**
   * Get the current budget status
   * 
   * @returns Object with current budget status
   */
  getBudgetStatus(): {
    mode: BudgetProfile['mode'];
    currentSpend: number;
    monthlyBudget: number;
    remainingBudget: number;
    percentUsed: number;
    predictedEndOfMonthSpend: number;
    predictedOverspend: number;
    predictedPercentUsed: number;
    savingsData: typeof this.savingsData;
  } {
    const remainingBudget = this.predictRemainingBudget();
    const predictedEndOfMonthSpend = this.predictEndOfMonthSpend();
    const predictedOverspend = Math.max(0, predictedEndOfMonthSpend - this.activeProfile.monthlyBudget);
    
    return {
      mode: this.activeProfile.mode,
      currentSpend: this.activeProfile.currentSpend,
      monthlyBudget: this.activeProfile.monthlyBudget,
      remainingBudget,
      percentUsed: (this.activeProfile.currentSpend / this.activeProfile.monthlyBudget) * 100,
      predictedEndOfMonthSpend,
      predictedOverspend,
      predictedPercentUsed: (predictedEndOfMonthSpend / this.activeProfile.monthlyBudget) * 100,
      savingsData: { ...this.savingsData }
    };
  }
  
  /**
   * Get model recommendations based on current budget status
   * 
   * @returns Object with model recommendations
   */
  getModelRecommendations(): Record<string, {
    recommended: boolean;
    reason: string;
    costFactor: number;
  }> {
    const mode = this.activeProfile.mode;
    const recommendations: Record<string, { recommended: boolean; reason: string; costFactor: number }> = {};
    
    // Get models by tier
    const economyModels = Array.from(this.modelPricing.values()).filter(m => m.tier === 'economy');
    const standardModels = Array.from(this.modelPricing.values()).filter(m => m.tier === 'standard');
    const premiumModels = Array.from(this.modelPricing.values()).filter(m => m.tier === 'premium');
    
    // Set recommendations based on mode
    for (const [modelName, pricing] of this.modelPricing.entries()) {
      switch (mode) {
        case 'maximum_savings':
          if (pricing.tier === 'economy') {
            recommendations[modelName] = {
              recommended: true,
              reason: 'Budget constraints require economy models',
              costFactor: 1.0
            };
          } else if (pricing.tier === 'standard') {
            recommendations[modelName] = {
              recommended: false,
              reason: 'Use only for critical tasks that require more capability',
              costFactor: 0.5
            };
          } else {
            recommendations[modelName] = {
              recommended: false,
              reason: 'Avoid premium models due to budget constraints',
              costFactor: 0.1
            };
          }
          break;
          
        case 'balanced':
          if (pricing.tier === 'economy' || pricing.tier === 'standard') {
            recommendations[modelName] = {
              recommended: true,
              reason: 'Good balance of cost and performance',
              costFactor: 1.0
            };
          } else {
            recommendations[modelName] = {
              recommended: false,
              reason: 'Use premium models sparingly for high-value tasks',
              costFactor: 0.3
            };
          }
          break;
          
        case 'maximum_performance':
          if (pricing.tier === 'premium' || pricing.tier === 'standard') {
            recommendations[modelName] = {
              recommended: true,
              reason: 'Performance prioritized over cost',
              costFactor: 1.0
            };
          } else {
            recommendations[modelName] = {
              recommended: true,
              reason: 'Good for lower importance tasks',
              costFactor: 0.8
            };
          }
          break;
      }
    }
    
    return recommendations;
  }
  
  /**
   * Create and store a budget forecast
   * 
   * @returns The created budget forecast
   */
  createForecast(): BudgetForecast {
    const remainingBudget = this.predictRemainingBudget();
    const predictedEndOfMonthSpend = this.predictEndOfMonthSpend();
    const recommendedMode = this.getOptimalMode();
    
    // Create model usage recommendations
    const modelRecommendations: Record<string, number> = {};
    const recommendations = this.getModelRecommendations();
    
    for (const [model, rec] of Object.entries(recommendations)) {
      modelRecommendations[model] = rec.costFactor;
    }
    
    // Create savings opportunities
    const savingsOpportunities = [];
    
    // Check if batching could be increased
    const batchableModels = Array.from(this.modelPricing.values())
      .filter(model => model.tier !== 'premium')
      .map(model => model.model);
      
    if (batchableModels.length > 0) {
      savingsOpportunities.push({
        description: 'Increase batch processing',
        potentialSavings: this.activeProfile.currentSpend * 0.2, // 20% potential savings
        implementation: 'Increase batch size and delay threshold in BatchProcessor',
        impact: 'medium'
      });
    }
    
    // Check if cache hit rate could be improved
    const cacheSavingsRatio = this.savingsData.cacheSavings / (this.activeProfile.currentSpend + this.savingsData.totalSaved);
    
    if (cacheSavingsRatio < 0.3) { // Less than 30% cache savings
      savingsOpportunities.push({
        description: 'Improve semantic caching',
        potentialSavings: this.activeProfile.currentSpend * 0.15, // 15% potential savings
        implementation: 'Adjust similarity thresholds and increase cache TTL',
        impact: 'high'
      });
    }
    
    // Check if premium models are being used too much
    const premiumUsage = this.usageHistory
      .filter(usage => {
        const model = this.modelPricing.get(usage.model);
        return model && model.tier === 'premium' && usage.source === 'api_call';
      })
      .reduce((sum, usage) => sum + usage.cost, 0);
      
    const premiumRatio = premiumUsage / this.activeProfile.currentSpend;
    
    if (premiumRatio > 0.4 && recommendedMode !== 'maximum_performance') { // More than 40% premium usage
      savingsOpportunities.push({
        description: 'Reduce premium model usage',
        potentialSavings: premiumUsage * 0.7, // 70% of premium costs could be saved
        implementation: 'Switch to standard models for most tasks',
        impact: 'high'
      });
    }
    
    // Create forecast
    const forecast: BudgetForecast = {
      id: uuidv4(),
      timestamp: new Date(),
      remainingBudget,
      predictedEndOfMonthSpend,
      recommendedMode,
      modelRecommendations,
      savingsOpportunities,
      metadata: {
        currentSpend: this.activeProfile.currentSpend,
        monthlyBudget: this.activeProfile.monthlyBudget,
        activeBudgetMode: this.activeProfile.mode,
        savingsData: { ...this.savingsData }
      }
    };
    
    // Store forecast
    this.forecasts.push(forecast);
    
    // Limit forecasts to last 100
    if (this.forecasts.length > 100) {
      this.forecasts = this.forecasts.slice(-100);
    }
    
    return forecast;
  }
  
  /**
   * Check budget thresholds and create alerts if necessary
   */
  checkBudgetThresholds(): void {
    const { percentUsed, predictedPercentUsed } = this.getBudgetStatus();
    const warningThreshold = this.activeProfile.alertThresholds.warning * 100;
    const criticalThreshold = this.activeProfile.alertThresholds.critical * 100;
    
    // Check current usage
    if (percentUsed >= criticalThreshold) {
      this.createAlert(
        'critical',
        `Budget critical: ${percentUsed.toFixed(1)}% of monthly budget used`,
        'current_usage'
      );
      
      // If we're in critical territory, force maximum savings mode
      if (this.activeProfile.mode !== 'maximum_savings') {
        this.setMode('maximum_savings');
      }
    } else if (percentUsed >= warningThreshold) {
      this.createAlert(
        'warning',
        `Budget warning: ${percentUsed.toFixed(1)}% of monthly budget used`,
        'current_usage'
      );
      
      // If we're in warning territory, ensure we're not in maximum performance mode
      if (this.activeProfile.mode === 'maximum_performance') {
        this.setMode('balanced');
      }
    }
    
    // Check predicted usage
    if (predictedPercentUsed >= 100) {
      this.createAlert(
        'critical',
        `Budget forecast critical: Projected to use ${predictedPercentUsed.toFixed(1)}% of monthly budget`,
        'projected_usage'
      );
      
      // If we're projected to go over budget, force maximum savings mode
      if (this.activeProfile.mode !== 'maximum_savings') {
        this.setMode('maximum_savings');
      }
    } else if (predictedPercentUsed >= warningThreshold) {
      this.createAlert(
        'warning',
        `Budget forecast warning: Projected to use ${predictedPercentUsed.toFixed(1)}% of monthly budget`,
        'projected_usage'
      );
      
      // If we're projected to be in warning territory, ensure we're not in maximum performance mode
      if (this.activeProfile.mode === 'maximum_performance') {
        this.setMode('balanced');
      }
    }
  }
  
  /**
   * Create a budget alert
   * 
   * @param level The alert level
   * @param message The alert message
   * @param triggeredBy What triggered the alert
   * @returns The created alert
   */
  private createAlert(
    level: 'info' | 'warning' | 'critical',
    message: string,
    triggeredBy: string
  ): BudgetAlert {
    const { currentSpend, monthlyBudget, percentUsed, remainingBudget } = this.getBudgetStatus();
    
    // Check if a similar alert was created in the last hour
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const recentSimilarAlert = this.alerts.find(alert => 
      alert.level === level && 
      alert.triggeredBy === triggeredBy && 
      alert.timestamp >= oneHourAgo
    );
    
    // If we already have a similar recent alert, don't create a new one
    if (recentSimilarAlert) {
      return recentSimilarAlert;
    }
    
    // Create new alert
    const alert: BudgetAlert = {
      id: uuidv4(),
      timestamp: new Date(),
      level,
      message,
      currentSpend,
      monthlyBudget,
      percentUsed,
      remainingBudget,
      triggeredBy
    };
    
    // Store alert
    this.alerts.push(alert);
    
    // Limit alerts to last 100
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
    
    // Log alert
    console.log(`[BUDGET ${level.toUpperCase()}] ${message}`);
    
    return alert;
  }
  
  /**
   * Set the operational mode
   * 
   * @param mode The mode to set
   */
  setMode(mode: BudgetProfile['mode']): void {
    if (this.activeProfile.mode === mode) {
      return; // No change
    }
    
    // Update mode
    const oldMode = this.activeProfile.mode;
    this.activeProfile.mode = mode;
    this.activeProfile.updatedAt = new Date();
    
    // Update in profiles map
    this.profiles.set(this.activeProfile.id, this.activeProfile);
    
    // Create info alert
    this.createAlert(
      'info',
      `Budget mode changed from ${oldMode} to ${mode}`,
      'mode_change'
    );
    
    console.log(`Budget mode changed from ${oldMode} to ${mode}`);
  }
  
  /**
   * Start the forecasting process
   */
  private startForecasting(): void {
    // Create initial forecast
    this.createForecast();
    
    // Set up interval for regular forecasting (every 2 hours)
    this.forecastInterval = setInterval(() => {
      const forecast = this.createForecast();
      
      // Adjust mode if necessary
      if (forecast.recommendedMode !== this.activeProfile.mode) {
        this.setMode(forecast.recommendedMode);
      }
    }, 2 * 60 * 60 * 1000); // Every 2 hours
  }
  
  /**
   * Start budget threshold checks
   */
  private startBudgetChecks(): void {
    // Set up interval for regular budget checks (every 30 minutes)
    this.budgetCheckInterval = setInterval(() => {
      this.checkBudgetThresholds();
    }, 30 * 60 * 1000); // Every 30 minutes
  }
  
  /**
   * Stop forecasting and budget checks
   */
  stopForecasting(): void {
    if (this.forecastInterval) {
      clearInterval(this.forecastInterval);
      this.forecastInterval = null;
    }
    
    if (this.budgetCheckInterval) {
      clearInterval(this.budgetCheckInterval);
      this.budgetCheckInterval = null;
    }
  }
  
  /**
   * Create a budget profile
   * 
   * @param name The profile name
   * @param monthlyBudget The monthly budget
   * @param mode The profile mode
   * @param alertThresholds The alert thresholds
   * @returns The created profile
   */
  createBudgetProfile(
    name: string,
    monthlyBudget: number,
    mode: BudgetProfile['mode'] = 'balanced',
    alertThresholds: BudgetProfile['alertThresholds'] = { warning: 0.7, critical: 0.9 }
  ): BudgetProfile {
    const profile: BudgetProfile = {
      id: uuidv4(),
      name,
      mode,
      monthlyBudget,
      currentSpend: 0,
      alertThresholds,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.profiles.set(profile.id, profile);
    return profile;
  }
  
  /**
   * Get a budget profile by ID
   * 
   * @param id The profile ID
   * @returns The profile or undefined if not found
   */
  getBudgetProfile(id: string): BudgetProfile | undefined {
    return this.profiles.get(id);
  }
  
  /**
   * Get all budget profiles
   * 
   * @returns Array of profiles
   */
  getAllBudgetProfiles(): BudgetProfile[] {
    return Array.from(this.profiles.values());
  }
  
  /**
   * Set the active budget profile
   * 
   * @param id The profile ID to activate
   * @returns The activated profile
   */
  setActiveBudgetProfile(id: string): BudgetProfile {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new Error(`Budget profile with ID ${id} not found`);
    }
    
    this.activeProfile = profile;
    
    // Create info alert
    this.createAlert(
      'info',
      `Budget profile changed to ${profile.name}`,
      'profile_change'
    );
    
    return profile;
  }
  
  /**
   * Get model pricing by model name
   * 
   * @param model The model name
   * @returns The model pricing or undefined if not found
   */
  getModelPricing(model: string): ModelPricing | undefined {
    return this.modelPricing.get(model);
  }
  
  /**
   * Get all model pricing
   * 
   * @returns Array of model pricing
   */
  getAllModelPricing(): ModelPricing[] {
    return Array.from(this.modelPricing.values());
  }
  
  /**
   * Get usage history
   * 
   * @param limit Optional limit on the number of records
   * @param filter Optional filter function
   * @returns Array of cost allocations
   */
  getUsageHistory(
    limit?: number,
    filter?: (allocation: CostAllocation) => boolean
  ): CostAllocation[] {
    let history = [...this.usageHistory].reverse(); // Most recent first
    
    if (filter) {
      history = history.filter(filter);
    }
    
    if (limit) {
      history = history.slice(0, limit);
    }
    
    return history;
  }
  
  /**
   * Get recent forecasts
   * 
   * @param limit Optional limit on the number of forecasts
   * @returns Array of forecasts
   */
  getForecasts(limit: number = 10): BudgetForecast[] {
    // Return most recent first
    return [...this.forecasts].reverse().slice(0, limit);
  }
  
  /**
   * Get recent alerts
   * 
   * @param limit Optional limit on the number of alerts
   * @param level Optional filter by alert level
   * @returns Array of alerts
   */
  getAlerts(limit: number = 10, level?: 'info' | 'warning' | 'critical'): BudgetAlert[] {
    let alerts = [...this.alerts].reverse(); // Most recent first
    
    if (level) {
      alerts = alerts.filter(alert => alert.level === level);
    }
    
    return alerts.slice(0, limit);
  }
  
  /**
   * Get usage statistics by model
   * 
   * @returns Object with model usage statistics
   */
  getModelUsageStats(): Record<string, {
    calls: number;
    totalCost: number;
    averageCost: number;
    percentOfTotal: number;
  }> {
    const stats: Record<string, {
      calls: number;
      totalCost: number;
      averageCost: number;
      percentOfTotal: number;
    }> = {};
    
    // Filter api_call allocations
    const apiCalls = this.usageHistory.filter(allocation => allocation.source === 'api_call');
    
    // Group by model
    for (const allocation of apiCalls) {
      if (!stats[allocation.model]) {
        stats[allocation.model] = {
          calls: 0,
          totalCost: 0,
          averageCost: 0,
          percentOfTotal: 0
        };
      }
      
      stats[allocation.model].calls++;
      stats[allocation.model].totalCost += allocation.cost;
    }
    
    // Calculate averages and percentages
    const totalCost = apiCalls.reduce((sum, allocation) => sum + allocation.cost, 0);
    
    for (const model in stats) {
      stats[model].averageCost = stats[model].totalCost / stats[model].calls;
      stats[model].percentOfTotal = (stats[model].totalCost / totalCost) * 100;
    }
    
    return stats;
  }
  
  /**
   * Get savings statistics
   * 
   * @returns Object with savings statistics
   */
  getSavingsStats(): typeof this.savingsData & {
    cacheSavingsPercent: number;
    batchSavingsPercent: number;
    modelSwitchSavingsPercent: number;
    totalSavingsPercent: number;
    totalSavingsDollar: number;
  } {
    const totalPotentialSpend = this.activeProfile.currentSpend + this.savingsData.totalSaved;
    
    return {
      ...this.savingsData,
      cacheSavingsPercent: totalPotentialSpend > 0 ? (this.savingsData.cacheSavings / totalPotentialSpend) * 100 : 0,
      batchSavingsPercent: totalPotentialSpend > 0 ? (this.savingsData.batchSavings / totalPotentialSpend) * 100 : 0,
      modelSwitchSavingsPercent: totalPotentialSpend > 0 ? (this.savingsData.modelSwitchSavings / totalPotentialSpend) * 100 : 0,
      totalSavingsPercent: totalPotentialSpend > 0 ? (this.savingsData.totalSaved / totalPotentialSpend) * 100 : 0,
      totalSavingsDollar: this.savingsData.totalSaved
    };
  }
  
  /**
   * Generate a budget report
   * 
   * @returns Comprehensive budget report
   */
  generateBudgetReport(): {
    currentStatus: ReturnType<typeof this.getBudgetStatus>;
    modelUsage: ReturnType<typeof this.getModelUsageStats>;
    savings: ReturnType<typeof this.getSavingsStats>;
    recentAlerts: BudgetAlert[];
    recommendations: string[];
    forecast: BudgetForecast;
  } {
    const currentStatus = this.getBudgetStatus();
    const modelUsage = this.getModelUsageStats();
    const savings = this.getSavingsStats();
    const recentAlerts = this.getAlerts(5);
    const forecast = this.createForecast();
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    // Add recommendations based on the forecast
    forecast.savingsOpportunities.forEach(opportunity => {
      recommendations.push(`${opportunity.description}: Save up to $${opportunity.potentialSavings.toFixed(2)} (${opportunity.impact} impact)`);
    });
    
    // Add recommendations based on model usage
    const modelStats = Object.entries(modelUsage)
      .sort((a, b) => b[1].totalCost - a[1].totalCost)
      .slice(0, 3);
      
    if (modelStats.length > 0) {
      const [topModel, topStats] = modelStats[0];
      if (topStats.percentOfTotal > 70) {
        recommendations.push(`Consider diversifying model usage: ${topModel} accounts for ${topStats.percentOfTotal.toFixed(1)}% of total cost`);
      }
    }
    
    // Add recommendations for cost optimization techniques
    if (savings.cacheSavingsPercent < 20) {
      recommendations.push('Increase semantic caching usage - current savings are below optimal levels');
    }
    
    if (savings.batchSavingsPercent < 15) {
      recommendations.push('Increase batch processing - consider adjusting batch thresholds and timing');
    }
    
    return {
      currentStatus,
      modelUsage,
      savings,
      recentAlerts,
      recommendations,
      forecast
    };
  }
}

// Create singleton instance
export const budgetForecaster = new AdaptiveBudgetForecaster();