/**
 * OROBORO NEXUS Optimizer
 *
 * This service orchestrates all cost optimization components including the AdaptiveBudgetForecaster,
 * DynamicModelSelector, BatchProcessor, and SemanticCachingSystem to optimize API costs
 * while maintaining high quality results.
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { budgetForecaster } from './AdaptiveBudgetForecaster.js';
/**
 * OROBORO NEXUS Optimizer class
 */
var OroboroNexusOptimizer = /** @class */ (function () {
    function OroboroNexusOptimizer() {
        this.defaultOptimizationProfile = 'balanced';
        this.defaultTokenLimit = 4096;
        this.defaultTimeout = 30000; // 30 seconds
        // Use the singleton budgetForecaster
        this.budgetForecaster = budgetForecaster;
        console.log('OROBORO NEXUS Optimizer initialized');
    }
    /**
     * Process a request with cost optimization
     *
     * @param request Request to process
     * @returns Optimized result
     */
    OroboroNexusOptimizer.prototype.process = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, options, strategy, modelSelection, result, endTime, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        options = this.prepareOptions(request.options);
                        strategy = this.budgetForecaster.getAdaptiveStrategy();
                        return [4 /*yield*/, this.selectModel(request.text, request.type, options, strategy)];
                    case 2:
                        modelSelection = _a.sent();
                        return [4 /*yield*/, this.simulateApiCall(request.text, modelSelection.model, request.type, options)];
                    case 3:
                        result = _a.sent();
                        // Log the usage for budget tracking
                        this.budgetForecaster.logUsage(modelSelection.model, result.tokensUsed.input, result.tokensUsed.output, result.cost);
                        endTime = Date.now();
                        // Return the formatted result
                        return [2 /*return*/, __assign(__assign({}, result), { executionTime: endTime - startTime })];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Error in OroboroNexusOptimizer.process:', error_1);
                        throw new Error("Processing failed: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Prepare options with defaults
     *
     * @param options User-provided options
     * @returns Complete options with defaults
     */
    OroboroNexusOptimizer.prototype.prepareOptions = function (options) {
        return __assign({ priority: 'normal', bypassCache: false, optimizationProfile: this.defaultOptimizationProfile, tokenLimit: this.defaultTokenLimit, timeout: this.defaultTimeout }, options);
    };
    /**
     * Select the most appropriate model based on request and constraints
     *
     * @param text Request text
     * @param type Request type
     * @param options Request options
     * @param strategy Current adaptive strategy
     * @returns Selected model and decision factors
     */
    OroboroNexusOptimizer.prototype.selectModel = function (text, type, options, strategy) {
        return __awaiter(this, void 0, void 0, function () {
            var model;
            return __generator(this, function (_a) {
                // Start with the forced model if specified
                if (options.forceModel) {
                    return [2 /*return*/, {
                            model: options.forceModel,
                            factors: { reason: 'explicitly_specified' }
                        }];
                }
                // If in critical budget mode, override with the cheapest option
                if (strategy.thresholdReached === 'critical' && options.priority !== 'high') {
                    return [2 /*return*/, {
                            model: strategy.modelPreference,
                            factors: { reason: 'budget_critical' }
                        }];
                }
                // If in warning budget mode and optimization profile is not maximum performance,
                // use the strategy-recommended model
                if (strategy.thresholdReached === 'warning' &&
                    options.optimizationProfile !== 'maximum_performance' &&
                    options.priority !== 'high') {
                    return [2 /*return*/, {
                            model: strategy.modelPreference,
                            factors: { reason: 'budget_warning' }
                        }];
                }
                model = this.getModelForRequestType(type, options.optimizationProfile);
                return [2 /*return*/, {
                        model: model,
                        factors: {
                            reason: 'type_profile_match',
                            type: type,
                            profile: options.optimizationProfile
                        }
                    }];
            });
        });
    };
    /**
     * Get appropriate model for request type and optimization profile
     *
     * @param type Request type
     * @param profile Optimization profile
     * @returns Best model for the request
     */
    OroboroNexusOptimizer.prototype.getModelForRequestType = function (type, profile) {
        // Model mapping tables for different optimization profiles
        var models = {
            maximum_savings: {
                text_generation: 'GPT-4o-mini',
                code_generation: 'Gemini-1.5-Flash',
                reasoning: 'Gemini-1.5-Flash',
                summarization: 'GPT-4o-mini',
                translation: 'GPT-4o-mini',
                creative_writing: 'GPT-4o-mini',
                chat: 'GPT-4o-mini',
                qa: 'GPT-4o-mini',
                classification: 'GPT-4o-mini',
                embedding: 'Gemini-1.5-Flash',
            },
            balanced: {
                text_generation: 'GPT-4o',
                code_generation: 'GPT-4o',
                reasoning: 'GPT-4o',
                summarization: 'Gemini-1.5-Pro',
                translation: 'Gemini-1.5-Pro',
                creative_writing: 'Claude-3.5-Haiku',
                chat: 'GPT-4o',
                qa: 'GPT-4o',
                classification: 'Gemini-1.5-Pro',
                embedding: 'Gemini-1.5-Pro',
            },
            maximum_performance: {
                text_generation: 'GPT-4.5-preview',
                code_generation: 'GPT-4.5-preview',
                reasoning: 'GPT-4.5-preview',
                summarization: 'Claude-3.7-Sonnet',
                translation: 'GPT-4o',
                creative_writing: 'Claude-3.7-Sonnet',
                chat: 'GPT-4.5-preview',
                qa: 'GPT-4.5-preview',
                classification: 'GPT-4o',
                embedding: 'GPT-4o',
            }
        };
        var profileToUse = profile || this.defaultOptimizationProfile;
        return models[profileToUse][type] || 'GPT-4o'; // Default to GPT-4o if no match
    };
    /**
     * Simulate an API call (for demonstration purposes)
     * In a real implementation, this would call the actual LLM API
     *
     * @param text Request text
     * @param model Model to use
     * @param type Request type
     * @param options Request options
     * @returns Simulated API response
     */
    OroboroNexusOptimizer.prototype.simulateApiCall = function (text, model, type, options) {
        return __awaiter(this, void 0, void 0, function () {
            var inputTokens, outputTokens, modelCosts, defaultRate, rate, inputCost, outputCost, totalCost, responseTime, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputTokens = Math.ceil(text.length / 4);
                        outputTokens = Math.ceil(inputTokens * 0.75);
                        modelCosts = {
                            'GPT-4.5-preview': { input: 75.00, output: 150.00 },
                            'GPT-4o': { input: 2.50, output: 10.00 },
                            'o1': { input: 15.00, output: 60.00 },
                            'o1-mini': { input: 1.10, output: 4.40 },
                            'GPT-4o-mini': { input: 0.15, output: 0.60 },
                            'Gemini-2.5-Pro': { input: 7.00, output: 21.00 },
                            'Gemini-2.0-Advanced-Flash': { input: 0.10, output: 0.40 },
                            'Gemini-1.5-Pro': { input: 3.50, output: 10.50 },
                            'Gemini-1.5-Flash': { input: 0.075, output: 0.30 },
                            'Claude-3.7-Sonnet': { input: 3.00, output: 15.00 },
                            'Claude-3.5-Haiku': { input: 0.80, output: 4.00 },
                            'Grok-3': { input: 38.15, output: 114.44 },
                            'Grok-1': { input: 0.50, output: 1.50 }
                        };
                        defaultRate = { input: 1.00, output: 2.00 };
                        rate = modelCosts[model] || defaultRate;
                        inputCost = (rate.input / 1000000) * inputTokens;
                        outputCost = (rate.output / 1000000) * outputTokens;
                        totalCost = inputCost + outputCost;
                        responseTime = Math.floor(Math.random() * 2000) + 500;
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, responseTime); })];
                    case 1:
                        _a.sent();
                        response = '';
                        switch (type) {
                            case 'text_generation':
                                response = "Generated text response using ".concat(model, " for the query about \"").concat(text.substring(0, 30), "...\"");
                                break;
                            case 'code_generation':
                                response = "```python\ndef process_data(input_data):\n    # Generated code for ".concat(text.substring(0, 20), "...\n    result = analyze(input_data)\n    return result\n```");
                                break;
                            case 'reasoning':
                                response = "Reasoning step by step:\n1. First, we consider ".concat(text.substring(0, 20), "...\n2. Given this context, we can deduce...\n3. Therefore, the conclusion is...");
                                break;
                            case 'summarization':
                                response = "Summary: ".concat(text.substring(0, 50), "... [content summarized by ").concat(model, "]");
                                break;
                            default:
                                response = "Response from ".concat(model, " for ").concat(type, " request: \"").concat(text.substring(0, 30), "...\"");
                        }
                        return [2 /*return*/, {
                                response: response,
                                model: model,
                                cost: totalCost,
                                tokensUsed: {
                                    input: inputTokens,
                                    output: outputTokens
                                },
                                cacheHit: false, // In a real implementation, this would be true for cache hits
                                batchProcessed: false, // In a real implementation, this would be true for batched requests
                                executionTime: responseTime
                            }];
                }
            });
        });
    };
    /**
     * Get current budget forecast
     *
     * @returns Budget forecast information
     */
    OroboroNexusOptimizer.prototype.getBudgetForecast = function () {
        return this.budgetForecaster.forecastNextPeriod();
    };
    /**
     * Get budget alerts
     *
     * @returns Array of budget alerts
     */
    OroboroNexusOptimizer.prototype.getBudgetAlerts = function () {
        return this.budgetForecaster.getBudgetAlerts();
    };
    /**
     * Get current adaptive strategy
     *
     * @returns Current adaptive strategy
     */
    OroboroNexusOptimizer.prototype.getAdaptiveStrategy = function () {
        return this.budgetForecaster.getAdaptiveStrategy();
    };
    /**
     * Get model usage distribution
     *
     * @returns Distribution of model usage
     */
    OroboroNexusOptimizer.prototype.getModelDistribution = function () {
        return this.budgetForecaster.getModelDistribution();
    };
    /**
     * Update budget settings
     *
     * @param settings Budget settings to update
     */
    OroboroNexusOptimizer.prototype.updateBudgetSettings = function (settings) {
        return this.budgetForecaster.updateBudgetSettings(settings);
    };
    /**
     * Set default optimization profile
     *
     * @param profile Profile to set as default
     */
    OroboroNexusOptimizer.prototype.setDefaultOptimizationProfile = function (profile) {
        this.defaultOptimizationProfile = profile;
    };
    /**
     * Log API latency metrics for performance monitoring
     *
     * @param provider API provider name
     * @param model Model name
     * @param latencyMs Latency in milliseconds
     */
    OroboroNexusOptimizer.prototype.logLatencyMetric = function (provider, model, latencyMs) {
        // Store latency data for performance analysis
        var timestamp = new Date();
        var latencyData = {
            provider: provider,
            model: model,
            latencyMs: latencyMs,
            timestamp: timestamp
        };
        // In a production environment, we would:
        // 1. Store metrics in a time-series database
        // 2. Update rolling averages for alerting and dashboards
        // 3. Trigger alerts for unusual latency patterns
        console.log("[Performance] ".concat(provider, "/").concat(model, " latency: ").concat(latencyMs, "ms"));
        // Report to budget forecaster for model selection optimization
        this.budgetForecaster.logPerformanceMetric('latency', model, latencyMs);
        // Could emit an event for real-time dashboards
        // eventEmitter.emit('metric:latency', latencyData);
    };
    /**
     * Log API error metrics for reliability monitoring
     *
     * @param provider API provider name
     * @param model Model name
     * @param statusCode HTTP status code
     * @param errorMessage Error message
     */
    OroboroNexusOptimizer.prototype.logErrorMetric = function (provider, model, statusCode, errorMessage) {
        // Store error data for reliability analysis
        var timestamp = new Date();
        var errorData = {
            provider: provider,
            model: model,
            statusCode: statusCode,
            errorMessage: errorMessage,
            timestamp: timestamp
        };
        // In a production environment, we would:
        // 1. Store error events in a database
        // 2. Update error rate calculations
        // 3. Trigger alerts for unusual error patterns
        console.error("[Error] ".concat(provider, "/").concat(model, " error (").concat(statusCode, "): ").concat(errorMessage));
        // Report to budget forecaster for adaptive model selection
        this.budgetForecaster.logProviderIssue(provider, model, statusCode, errorMessage);
        // Could emit an event for real-time dashboards and alerts
        // eventEmitter.emit('metric:error', errorData);
    };
    return OroboroNexusOptimizer;
}());
export { OroboroNexusOptimizer };
// Create singleton instance
export var oroboroNexusOptimizer = new OroboroNexusOptimizer();
