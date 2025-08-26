/**
 * Adaptive Budget Forecaster
 *
 * This service predicts and adapts API budget usage to optimize costs
 * and ensure the system stays within defined budget constraints while
 * balancing performance requirements.
 *
 * [QUANTUM_STATE: SIM_FLOW]
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { v4 as uuidv4 } from 'uuid';
/**
 * Default model pricing
 */
var DEFAULT_MODEL_PRICING = [
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
var DEFAULT_BUDGET_PROFILE = {
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
var AdaptiveBudgetForecaster = /** @class */ (function () {
    function AdaptiveBudgetForecaster(monthlyBudget, mode, modelPricing) {
        if (monthlyBudget === void 0) { monthlyBudget = 690; }
        if (mode === void 0) { mode = 'balanced'; }
        if (modelPricing === void 0) { modelPricing = DEFAULT_MODEL_PRICING; }
        this.profiles = new Map();
        this.usageHistory = [];
        this.modelPricing = new Map();
        this.forecasts = [];
        this.alerts = [];
        this.forecastInterval = null;
        this.budgetCheckInterval = null;
        this.savingsData = {
            cacheSavings: 0,
            batchSavings: 0,
            modelSwitchSavings: 0,
            totalSaved: 0
        };
        // Initialize the default profile
        this.activeProfile = __assign(__assign({}, DEFAULT_BUDGET_PROFILE), { monthlyBudget: monthlyBudget, mode: mode, updatedAt: new Date() });
        this.profiles.set('default', this.activeProfile);
        // Initialize model pricing
        for (var _i = 0, modelPricing_1 = modelPricing; _i < modelPricing_1.length; _i++) {
            var pricing = modelPricing_1[_i];
            this.modelPricing.set(pricing.model, pricing);
        }
        // Start forecasting and budget checks
        this.startForecasting();
        this.startBudgetChecks();
        console.log("Adaptive Budget Forecaster initialized with ".concat(monthlyBudget, " monthly budget in ").concat(mode, " mode"));
    }
    /**
     * Log a usage of a model
     *
     * @param model The model used
     * @param cost The cost incurred
     * @param details Optional details about the usage
     * @param metadata Optional metadata
     */
    AdaptiveBudgetForecaster.prototype.logUsage = function (model, cost, details, metadata) {
        if (details === void 0) { details = ''; }
        if (metadata === void 0) { metadata = {}; }
        // Update the active profile's current spend
        this.activeProfile.currentSpend += cost;
        this.activeProfile.updatedAt = new Date();
        this.profiles.set(this.activeProfile.id, this.activeProfile);
        // Add to usage history
        var costAllocation = {
            model: model,
            cost: cost,
            timestamp: new Date(),
            source: 'api_call',
            details: details,
            metadata: metadata
        };
        this.usageHistory.push(costAllocation);
        // Log to console
        console.log("Budget usage logged: ".concat(model, " - $").concat(cost.toFixed(6), " - ").concat(details || 'No details provided'));
        // Check budget thresholds
        this.checkBudgetThresholds();
    };
    /**
     * Log savings from the cache
     *
     * @param model The model that would have been used
     * @param costSaved The cost saved
     * @param details Optional details about the savings
     */
    AdaptiveBudgetForecaster.prototype.logCacheSavings = function (model, costSaved, details) {
        if (details === void 0) { details = 'Cache hit'; }
        // Add to usage history
        var costAllocation = {
            model: model,
            cost: costSaved,
            timestamp: new Date(),
            source: 'cache_savings',
            details: details
        };
        this.usageHistory.push(costAllocation);
        // Update savings data
        this.savingsData.cacheSavings += costSaved;
        this.savingsData.totalSaved += costSaved;
        // Log to console
        console.log("Cache savings logged: ".concat(model, " - $").concat(costSaved.toFixed(6), " - ").concat(details));
    };
    /**
     * Log savings from batch processing
     *
     * @param model The model used
     * @param costSaved The cost saved
     * @param details Optional details about the savings
     */
    AdaptiveBudgetForecaster.prototype.logBatchSavings = function (model, costSaved, details) {
        if (details === void 0) { details = 'Batch processing'; }
        // Add to usage history
        var costAllocation = {
            model: model,
            cost: costSaved,
            timestamp: new Date(),
            source: 'batch_savings',
            details: details
        };
        this.usageHistory.push(costAllocation);
        // Update savings data
        this.savingsData.batchSavings += costSaved;
        this.savingsData.totalSaved += costSaved;
        // Log to console
        console.log("Batch savings logged: ".concat(model, " - $").concat(costSaved.toFixed(6), " - ").concat(details));
    };
    /**
     * Log savings from model switching
     *
     * @param originalModel The original model that would have been used
     * @param actualModel The model that was actually used
     * @param costSaved The cost saved
     * @param details Optional details about the savings
     */
    AdaptiveBudgetForecaster.prototype.logModelSwitchSavings = function (originalModel, actualModel, costSaved, details) {
        if (details === void 0) { details = 'Model switching'; }
        // Add to usage history
        var costAllocation = {
            model: actualModel,
            cost: costSaved,
            timestamp: new Date(),
            source: 'model_switch_savings',
            details: "".concat(details, " (from ").concat(originalModel, " to ").concat(actualModel, ")"),
            metadata: {
                originalModel: originalModel,
                actualModel: actualModel
            }
        };
        this.usageHistory.push(costAllocation);
        // Update savings data
        this.savingsData.modelSwitchSavings += costSaved;
        this.savingsData.totalSaved += costSaved;
        // Log to console
        console.log("Model switch savings logged: ".concat(originalModel, " -> ").concat(actualModel, " - $").concat(costSaved.toFixed(6)));
    };
    /**
     * Predict remaining budget for the current month
     *
     * @returns The predicted remaining budget
     */
    AdaptiveBudgetForecaster.prototype.predictRemainingBudget = function () {
        var remainingBudget = this.activeProfile.monthlyBudget - this.activeProfile.currentSpend;
        return remainingBudget;
    };
    /**
     * Predict end-of-month spend based on current usage patterns
     *
     * @returns The predicted end-of-month spend
     */
    AdaptiveBudgetForecaster.prototype.predictEndOfMonthSpend = function () {
        var now = new Date();
        var daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        var currentDay = now.getDate();
        var remainingDays = daysInMonth - currentDay + 1;
        // Get recent spend (last 3 days or all if less than 3 days of data)
        var threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        var recentUsage = this.usageHistory.filter(function (usage) { return usage.timestamp >= threeDaysAgo && usage.source === 'api_call'; });
        var predictedDailySpend;
        if (recentUsage.length > 0) {
            // Calculate average daily spend from recent usage
            var recentDays = Math.min(3, currentDay);
            var recentTotalSpend = recentUsage.reduce(function (sum, usage) { return sum + usage.cost; }, 0);
            predictedDailySpend = recentTotalSpend / recentDays;
        }
        else {
            // If no recent usage, use current spend divided by days elapsed
            predictedDailySpend = currentDay > 1 ? this.activeProfile.currentSpend / (currentDay - 1) : 0;
        }
        // Predict end of month spend
        var predictedRemainingSpend = predictedDailySpend * remainingDays;
        var predictedTotalSpend = this.activeProfile.currentSpend + predictedRemainingSpend;
        return predictedTotalSpend;
    };
    /**
     * Determine the optimal operational mode based on budget status
     *
     * @returns The recommended operational mode
     */
    AdaptiveBudgetForecaster.prototype.getOptimalMode = function () {
        var predictedSpend = this.predictEndOfMonthSpend();
        var budgetRatio = predictedSpend / this.activeProfile.monthlyBudget;
        if (budgetRatio > 0.9) {
            // Over 90% of budget predicted to be used - go to maximum savings
            return 'maximum_savings';
        }
        else if (budgetRatio < 0.7) {
            // Less than 70% of budget predicted to be used - can use maximum performance
            return 'maximum_performance';
        }
        else {
            // Between 70-90% - use balanced approach
            return 'balanced';
        }
    };
    /**
     * Get the current budget status
     *
     * @returns Object with current budget status
     */
    AdaptiveBudgetForecaster.prototype.getBudgetStatus = function () {
        var remainingBudget = this.predictRemainingBudget();
        var predictedEndOfMonthSpend = this.predictEndOfMonthSpend();
        var predictedOverspend = Math.max(0, predictedEndOfMonthSpend - this.activeProfile.monthlyBudget);
        return {
            mode: this.activeProfile.mode,
            currentSpend: this.activeProfile.currentSpend,
            monthlyBudget: this.activeProfile.monthlyBudget,
            remainingBudget: remainingBudget,
            percentUsed: (this.activeProfile.currentSpend / this.activeProfile.monthlyBudget) * 100,
            predictedEndOfMonthSpend: predictedEndOfMonthSpend,
            predictedOverspend: predictedOverspend,
            predictedPercentUsed: (predictedEndOfMonthSpend / this.activeProfile.monthlyBudget) * 100,
            savingsData: __assign({}, this.savingsData)
        };
    };
    /**
     * Get model recommendations based on current budget status
     *
     * @returns Object with model recommendations
     */
    AdaptiveBudgetForecaster.prototype.getModelRecommendations = function () {
        var mode = this.activeProfile.mode;
        var recommendations = {};
        // Get models by tier
        var economyModels = Array.from(this.modelPricing.values()).filter(function (m) { return m.tier === 'economy'; });
        var standardModels = Array.from(this.modelPricing.values()).filter(function (m) { return m.tier === 'standard'; });
        var premiumModels = Array.from(this.modelPricing.values()).filter(function (m) { return m.tier === 'premium'; });
        // Set recommendations based on mode
        for (var _i = 0, _a = this.modelPricing.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], modelName = _b[0], pricing = _b[1];
            switch (mode) {
                case 'maximum_savings':
                    if (pricing.tier === 'economy') {
                        recommendations[modelName] = {
                            recommended: true,
                            reason: 'Budget constraints require economy models',
                            costFactor: 1.0
                        };
                    }
                    else if (pricing.tier === 'standard') {
                        recommendations[modelName] = {
                            recommended: false,
                            reason: 'Use only for critical tasks that require more capability',
                            costFactor: 0.5
                        };
                    }
                    else {
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
                    }
                    else {
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
                    }
                    else {
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
    };
    /**
     * Create and store a budget forecast
     *
     * @returns The created budget forecast
     */
    AdaptiveBudgetForecaster.prototype.createForecast = function () {
        var _this = this;
        var remainingBudget = this.predictRemainingBudget();
        var predictedEndOfMonthSpend = this.predictEndOfMonthSpend();
        var recommendedMode = this.getOptimalMode();
        // Create model usage recommendations
        var modelRecommendations = {};
        var recommendations = this.getModelRecommendations();
        for (var _i = 0, _a = Object.entries(recommendations); _i < _a.length; _i++) {
            var _b = _a[_i], model = _b[0], rec = _b[1];
            modelRecommendations[model] = rec.costFactor;
        }
        // Create savings opportunities
        var savingsOpportunities = [];
        // Check if batching could be increased
        var batchableModels = Array.from(this.modelPricing.values())
            .filter(function (model) { return model.tier !== 'premium'; })
            .map(function (model) { return model.model; });
        if (batchableModels.length > 0) {
            savingsOpportunities.push({
                description: 'Increase batch processing',
                potentialSavings: this.activeProfile.currentSpend * 0.2, // 20% potential savings
                implementation: 'Increase batch size and delay threshold in BatchProcessor',
                impact: 'medium'
            });
        }
        // Check if cache hit rate could be improved
        var cacheSavingsRatio = this.savingsData.cacheSavings / (this.activeProfile.currentSpend + this.savingsData.totalSaved);
        if (cacheSavingsRatio < 0.3) { // Less than 30% cache savings
            savingsOpportunities.push({
                description: 'Improve semantic caching',
                potentialSavings: this.activeProfile.currentSpend * 0.15, // 15% potential savings
                implementation: 'Adjust similarity thresholds and increase cache TTL',
                impact: 'high'
            });
        }
        // Check if premium models are being used too much
        var premiumUsage = this.usageHistory
            .filter(function (usage) {
            var model = _this.modelPricing.get(usage.model);
            return model && model.tier === 'premium' && usage.source === 'api_call';
        })
            .reduce(function (sum, usage) { return sum + usage.cost; }, 0);
        var premiumRatio = premiumUsage / this.activeProfile.currentSpend;
        if (premiumRatio > 0.4 && recommendedMode !== 'maximum_performance') { // More than 40% premium usage
            savingsOpportunities.push({
                description: 'Reduce premium model usage',
                potentialSavings: premiumUsage * 0.7, // 70% of premium costs could be saved
                implementation: 'Switch to standard models for most tasks',
                impact: 'high'
            });
        }
        // Create forecast
        var forecast = {
            id: uuidv4(),
            timestamp: new Date(),
            remainingBudget: remainingBudget,
            predictedEndOfMonthSpend: predictedEndOfMonthSpend,
            recommendedMode: recommendedMode,
            modelRecommendations: modelRecommendations,
            savingsOpportunities: savingsOpportunities,
            metadata: {
                currentSpend: this.activeProfile.currentSpend,
                monthlyBudget: this.activeProfile.monthlyBudget,
                activeBudgetMode: this.activeProfile.mode,
                savingsData: __assign({}, this.savingsData)
            }
        };
        // Store forecast
        this.forecasts.push(forecast);
        // Limit forecasts to last 100
        if (this.forecasts.length > 100) {
            this.forecasts = this.forecasts.slice(-100);
        }
        return forecast;
    };
    /**
     * Check budget thresholds and create alerts if necessary
     */
    AdaptiveBudgetForecaster.prototype.checkBudgetThresholds = function () {
        var _a = this.getBudgetStatus(), percentUsed = _a.percentUsed, predictedPercentUsed = _a.predictedPercentUsed;
        var warningThreshold = this.activeProfile.alertThresholds.warning * 100;
        var criticalThreshold = this.activeProfile.alertThresholds.critical * 100;
        // Check current usage
        if (percentUsed >= criticalThreshold) {
            this.createAlert('critical', "Budget critical: ".concat(percentUsed.toFixed(1), "% of monthly budget used"), 'current_usage');
            // If we're in critical territory, force maximum savings mode
            if (this.activeProfile.mode !== 'maximum_savings') {
                this.setMode('maximum_savings');
            }
        }
        else if (percentUsed >= warningThreshold) {
            this.createAlert('warning', "Budget warning: ".concat(percentUsed.toFixed(1), "% of monthly budget used"), 'current_usage');
            // If we're in warning territory, ensure we're not in maximum performance mode
            if (this.activeProfile.mode === 'maximum_performance') {
                this.setMode('balanced');
            }
        }
        // Check predicted usage
        if (predictedPercentUsed >= 100) {
            this.createAlert('critical', "Budget forecast critical: Projected to use ".concat(predictedPercentUsed.toFixed(1), "% of monthly budget"), 'projected_usage');
            // If we're projected to go over budget, force maximum savings mode
            if (this.activeProfile.mode !== 'maximum_savings') {
                this.setMode('maximum_savings');
            }
        }
        else if (predictedPercentUsed >= warningThreshold) {
            this.createAlert('warning', "Budget forecast warning: Projected to use ".concat(predictedPercentUsed.toFixed(1), "% of monthly budget"), 'projected_usage');
            // If we're projected to be in warning territory, ensure we're not in maximum performance mode
            if (this.activeProfile.mode === 'maximum_performance') {
                this.setMode('balanced');
            }
        }
    };
    /**
     * Create a budget alert
     *
     * @param level The alert level
     * @param message The alert message
     * @param triggeredBy What triggered the alert
     * @returns The created alert
     */
    AdaptiveBudgetForecaster.prototype.createAlert = function (level, message, triggeredBy) {
        var _a = this.getBudgetStatus(), currentSpend = _a.currentSpend, monthlyBudget = _a.monthlyBudget, percentUsed = _a.percentUsed, remainingBudget = _a.remainingBudget;
        // Check if a similar alert was created in the last hour
        var oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);
        var recentSimilarAlert = this.alerts.find(function (alert) {
            return alert.level === level &&
                alert.triggeredBy === triggeredBy &&
                alert.timestamp >= oneHourAgo;
        });
        // If we already have a similar recent alert, don't create a new one
        if (recentSimilarAlert) {
            return recentSimilarAlert;
        }
        // Create new alert
        var alert = {
            id: uuidv4(),
            timestamp: new Date(),
            level: level,
            message: message,
            currentSpend: currentSpend,
            monthlyBudget: monthlyBudget,
            percentUsed: percentUsed,
            remainingBudget: remainingBudget,
            triggeredBy: triggeredBy
        };
        // Store alert
        this.alerts.push(alert);
        // Limit alerts to last 100
        if (this.alerts.length > 100) {
            this.alerts = this.alerts.slice(-100);
        }
        // Log alert
        console.log("[BUDGET ".concat(level.toUpperCase(), "] ").concat(message));
        return alert;
    };
    /**
     * Set the operational mode
     *
     * @param mode The mode to set
     */
    AdaptiveBudgetForecaster.prototype.setMode = function (mode) {
        if (this.activeProfile.mode === mode) {
            return; // No change
        }
        // Update mode
        var oldMode = this.activeProfile.mode;
        this.activeProfile.mode = mode;
        this.activeProfile.updatedAt = new Date();
        // Update in profiles map
        this.profiles.set(this.activeProfile.id, this.activeProfile);
        // Create info alert
        this.createAlert('info', "Budget mode changed from ".concat(oldMode, " to ").concat(mode), 'mode_change');
        console.log("Budget mode changed from ".concat(oldMode, " to ").concat(mode));
    };
    /**
     * Start the forecasting process
     */
    AdaptiveBudgetForecaster.prototype.startForecasting = function () {
        var _this = this;
        // Create initial forecast
        this.createForecast();
        // Set up interval for regular forecasting (every 2 hours)
        this.forecastInterval = setInterval(function () {
            var forecast = _this.createForecast();
            // Adjust mode if necessary
            if (forecast.recommendedMode !== _this.activeProfile.mode) {
                _this.setMode(forecast.recommendedMode);
            }
        }, 2 * 60 * 60 * 1000); // Every 2 hours
    };
    /**
     * Start budget threshold checks
     */
    AdaptiveBudgetForecaster.prototype.startBudgetChecks = function () {
        var _this = this;
        // Set up interval for regular budget checks (every 30 minutes)
        this.budgetCheckInterval = setInterval(function () {
            _this.checkBudgetThresholds();
        }, 30 * 60 * 1000); // Every 30 minutes
    };
    /**
     * Stop forecasting and budget checks
     */
    AdaptiveBudgetForecaster.prototype.stopForecasting = function () {
        if (this.forecastInterval) {
            clearInterval(this.forecastInterval);
            this.forecastInterval = null;
        }
        if (this.budgetCheckInterval) {
            clearInterval(this.budgetCheckInterval);
            this.budgetCheckInterval = null;
        }
    };
    /**
     * Create a budget profile
     *
     * @param name The profile name
     * @param monthlyBudget The monthly budget
     * @param mode The profile mode
     * @param alertThresholds The alert thresholds
     * @returns The created profile
     */
    AdaptiveBudgetForecaster.prototype.createBudgetProfile = function (name, monthlyBudget, mode, alertThresholds) {
        if (mode === void 0) { mode = 'balanced'; }
        if (alertThresholds === void 0) { alertThresholds = { warning: 0.7, critical: 0.9 }; }
        var profile = {
            id: uuidv4(),
            name: name,
            mode: mode,
            monthlyBudget: monthlyBudget,
            currentSpend: 0,
            alertThresholds: alertThresholds,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.profiles.set(profile.id, profile);
        return profile;
    };
    /**
     * Get a budget profile by ID
     *
     * @param id The profile ID
     * @returns The profile or undefined if not found
     */
    AdaptiveBudgetForecaster.prototype.getBudgetProfile = function (id) {
        return this.profiles.get(id);
    };
    /**
     * Get all budget profiles
     *
     * @returns Array of profiles
     */
    AdaptiveBudgetForecaster.prototype.getAllBudgetProfiles = function () {
        return Array.from(this.profiles.values());
    };
    /**
     * Set the active budget profile
     *
     * @param id The profile ID to activate
     * @returns The activated profile
     */
    AdaptiveBudgetForecaster.prototype.setActiveBudgetProfile = function (id) {
        var profile = this.profiles.get(id);
        if (!profile) {
            throw new Error("Budget profile with ID ".concat(id, " not found"));
        }
        this.activeProfile = profile;
        // Create info alert
        this.createAlert('info', "Budget profile changed to ".concat(profile.name), 'profile_change');
        return profile;
    };
    /**
     * Get model pricing by model name
     *
     * @param model The model name
     * @returns The model pricing or undefined if not found
     */
    AdaptiveBudgetForecaster.prototype.getModelPricing = function (model) {
        return this.modelPricing.get(model);
    };
    /**
     * Get all model pricing
     *
     * @returns Array of model pricing
     */
    AdaptiveBudgetForecaster.prototype.getAllModelPricing = function () {
        return Array.from(this.modelPricing.values());
    };
    /**
     * Get usage history
     *
     * @param limit Optional limit on the number of records
     * @param filter Optional filter function
     * @returns Array of cost allocations
     */
    AdaptiveBudgetForecaster.prototype.getUsageHistory = function (limit, filter) {
        var history = __spreadArray([], this.usageHistory, true).reverse(); // Most recent first
        if (filter) {
            history = history.filter(filter);
        }
        if (limit) {
            history = history.slice(0, limit);
        }
        return history;
    };
    /**
     * Get recent forecasts
     *
     * @param limit Optional limit on the number of forecasts
     * @returns Array of forecasts
     */
    AdaptiveBudgetForecaster.prototype.getForecasts = function (limit) {
        if (limit === void 0) { limit = 10; }
        // Return most recent first
        return __spreadArray([], this.forecasts, true).reverse().slice(0, limit);
    };
    /**
     * Get recent alerts
     *
     * @param limit Optional limit on the number of alerts
     * @param level Optional filter by alert level
     * @returns Array of alerts
     */
    AdaptiveBudgetForecaster.prototype.getAlerts = function (limit, level) {
        if (limit === void 0) { limit = 10; }
        var alerts = __spreadArray([], this.alerts, true).reverse(); // Most recent first
        if (level) {
            alerts = alerts.filter(function (alert) { return alert.level === level; });
        }
        return alerts.slice(0, limit);
    };
    /**
     * Get usage statistics by model
     *
     * @returns Object with model usage statistics
     */
    AdaptiveBudgetForecaster.prototype.getModelUsageStats = function () {
        var stats = {};
        // Filter api_call allocations
        var apiCalls = this.usageHistory.filter(function (allocation) { return allocation.source === 'api_call'; });
        // Group by model
        for (var _i = 0, apiCalls_1 = apiCalls; _i < apiCalls_1.length; _i++) {
            var allocation = apiCalls_1[_i];
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
        var totalCost = apiCalls.reduce(function (sum, allocation) { return sum + allocation.cost; }, 0);
        for (var model in stats) {
            stats[model].averageCost = stats[model].totalCost / stats[model].calls;
            stats[model].percentOfTotal = (stats[model].totalCost / totalCost) * 100;
        }
        return stats;
    };
    /**
     * Get savings statistics
     *
     * @returns Object with savings statistics
     */
    AdaptiveBudgetForecaster.prototype.getSavingsStats = function () {
        var totalPotentialSpend = this.activeProfile.currentSpend + this.savingsData.totalSaved;
        return __assign(__assign({}, this.savingsData), { cacheSavingsPercent: totalPotentialSpend > 0 ? (this.savingsData.cacheSavings / totalPotentialSpend) * 100 : 0, batchSavingsPercent: totalPotentialSpend > 0 ? (this.savingsData.batchSavings / totalPotentialSpend) * 100 : 0, modelSwitchSavingsPercent: totalPotentialSpend > 0 ? (this.savingsData.modelSwitchSavings / totalPotentialSpend) * 100 : 0, totalSavingsPercent: totalPotentialSpend > 0 ? (this.savingsData.totalSaved / totalPotentialSpend) * 100 : 0, totalSavingsDollar: this.savingsData.totalSaved });
    };
    /**
     * Generate a budget report
     *
     * @returns Comprehensive budget report
     */
    AdaptiveBudgetForecaster.prototype.generateBudgetReport = function () {
        var currentStatus = this.getBudgetStatus();
        var modelUsage = this.getModelUsageStats();
        var savings = this.getSavingsStats();
        var recentAlerts = this.getAlerts(5);
        var forecast = this.createForecast();
        // Generate recommendations
        var recommendations = [];
        // Add recommendations based on the forecast
        forecast.savingsOpportunities.forEach(function (opportunity) {
            recommendations.push("".concat(opportunity.description, ": Save up to $").concat(opportunity.potentialSavings.toFixed(2), " (").concat(opportunity.impact, " impact)"));
        });
        // Add recommendations based on model usage
        var modelStats = Object.entries(modelUsage)
            .sort(function (a, b) { return b[1].totalCost - a[1].totalCost; })
            .slice(0, 3);
        if (modelStats.length > 0) {
            var _a = modelStats[0], topModel = _a[0], topStats = _a[1];
            if (topStats.percentOfTotal > 70) {
                recommendations.push("Consider diversifying model usage: ".concat(topModel, " accounts for ").concat(topStats.percentOfTotal.toFixed(1), "% of total cost"));
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
            currentStatus: currentStatus,
            modelUsage: modelUsage,
            savings: savings,
            recentAlerts: recentAlerts,
            recommendations: recommendations,
            forecast: forecast
        };
    };
    return AdaptiveBudgetForecaster;
}());
export { AdaptiveBudgetForecaster };
// Create singleton instance
export var budgetForecaster = new AdaptiveBudgetForecaster();
