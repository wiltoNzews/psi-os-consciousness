/**
 * Batch Processor Service
 *
 * This service combines multiple API requests into batches to optimize costs
 * by leveraging the batch processing discounts offered by LLM providers.
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
import { budgetForecaster } from './AdaptiveBudgetForecaster.js';
/**
 * Default configuration
 */
var DEFAULT_CONFIG = {
    defaultBatchSize: 5,
    maxBatchSize: 20,
    defaultWaitTime: 500, // ms
    maxWaitTime: 2000, // ms
    batchingThreshold: 2, // minimum number of requests to create a batch
    savingsPercentage: 0.5, // 50% discount for batched requests
    enabledModels: ['GPT-4o', 'GPT-4o-mini', 'GPT-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    autoFlushInterval: 1000, // ms
    priorityLevels: {
        low: 0,
        normal: 50,
        high: 75,
        critical: 100
    }
};
/**
 * Calculate token counts for content (simplified estimation)
 * In a real implementation, this would use a proper tokenizer
 */
function estimateTokenCount(content) {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(content.length / 4);
}
/**
 * Estimates cost for a request based on model and token count
 * This is a simplified version; real implementation would use provider-specific pricing
 */
function estimateCost(model, inputTokens, outputTokens) {
    if (outputTokens === void 0) { outputTokens = 0; }
    // Simplified pricing model (per 1K tokens)
    var pricing = {
        'GPT-4o': { input: 0.01, output: 0.03 },
        'GPT-4o-mini': { input: 0.00015, output: 0.0006 },
        'GPT-3.5-turbo': { input: 0.0005, output: 0.0015 },
        'claude-3-opus': { input: 0.015, output: 0.075 },
        'claude-3-sonnet': { input: 0.003, output: 0.015 },
        'claude-3-haiku': { input: 0.00025, output: 0.00125 },
        // Default pricing if model not found
        'default': { input: 0.005, output: 0.015 }
    };
    // Get model pricing or default
    var modelPricing = pricing[model] || pricing['default'];
    // Calculate cost
    var inputCost = (inputTokens / 1000) * modelPricing.input;
    var outputCost = (outputTokens / 1000) * modelPricing.output;
    return inputCost + outputCost;
}
/**
 * BatchProcessor class for optimizing API calls by batching
 */
var BatchProcessor = /** @class */ (function () {
    function BatchProcessor(config) {
        if (config === void 0) { config = {}; }
        var _a;
        this.pendingRequests = new Map();
        this.activeBatches = new Map();
        this.completedBatches = [];
        this.pendingResponses = new Map();
        this.flushTimers = new Map();
        this.stats = {
            totalRequests: 0,
            totalBatches: 0,
            totalSavedCost: 0,
            averageBatchSize: 0,
            averageSavingsPerBatch: 0,
            averageSavingsPercentage: 0,
            modelStats: {}
        };
        this.config = __assign(__assign({}, DEFAULT_CONFIG), config);
        console.log('Batch Processor initialized with config:', {
            defaultBatchSize: this.config.defaultBatchSize,
            maxBatchSize: this.config.maxBatchSize,
            defaultWaitTime: this.config.defaultWaitTime,
            maxWaitTime: this.config.maxWaitTime,
            enabledModels: (_a = this.config.enabledModels) === null || _a === void 0 ? void 0 : _a.length,
            autoFlushInterval: this.config.autoFlushInterval
        });
    }
    /**
     * Add a request to the batch processor
     *
     * @param model The model to use
     * @param content The request content
     * @param options Additional options
     * @returns The request ID
     */
    BatchProcessor.prototype.addRequest = function (model_1, content_1) {
        return __awaiter(this, arguments, void 0, function (model, content, options) {
            var requestId, priority, request, timer, pendingCount, threshold;
            var _this = this;
            var _a, _b, _c, _d, _e, _f;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_g) {
                // Check if model is supported for batching
                if (!this.isModelSupported(model)) {
                    throw new Error("Model ".concat(model, " is not supported for batching"));
                }
                requestId = uuidv4();
                if (typeof options.priority === 'number') {
                    priority = options.priority;
                }
                else if (typeof options.priority === 'string') {
                    priority = ((_a = this.config.priorityLevels) === null || _a === void 0 ? void 0 : _a[options.priority]) ||
                        ((_b = DEFAULT_CONFIG.priorityLevels) === null || _b === void 0 ? void 0 : _b[options.priority]) ||
                        ((_c = DEFAULT_CONFIG.priorityLevels) === null || _c === void 0 ? void 0 : _c.normal) ||
                        50;
                }
                else {
                    priority = ((_d = DEFAULT_CONFIG.priorityLevels) === null || _d === void 0 ? void 0 : _d.normal) || 50;
                }
                request = {
                    id: requestId,
                    model: model,
                    content: content,
                    priority: priority,
                    maxBatchSize: options.maxBatchSize || this.config.defaultBatchSize,
                    maxWaitTime: options.maxWaitTime || this.config.defaultWaitTime,
                    createdAt: new Date(),
                    metadata: options.metadata
                };
                // Initialize model stats if needed
                if (!this.stats.modelStats[model]) {
                    this.stats.modelStats[model] = {
                        requests: 0,
                        batches: 0,
                        averageBatchSize: 0,
                        savedCost: 0
                    };
                }
                // Update stats
                this.stats.totalRequests++;
                this.stats.modelStats[model].requests++;
                // Add request to pending requests for the model
                if (!this.pendingRequests.has(model)) {
                    this.pendingRequests.set(model, []);
                    // Start auto-flush timer for this model
                    if (this.config.autoFlushInterval && this.config.autoFlushInterval > 0) {
                        timer = setTimeout(function () {
                            _this.flushModelRequests(model);
                        }, this.config.autoFlushInterval);
                        this.flushTimers.set(model, timer);
                    }
                }
                (_e = this.pendingRequests.get(model)) === null || _e === void 0 ? void 0 : _e.push(request);
                pendingCount = ((_f = this.pendingRequests.get(model)) === null || _f === void 0 ? void 0 : _f.length) || 0;
                threshold = this.config.batchingThreshold || DEFAULT_CONFIG.batchingThreshold || 2;
                if (pendingCount >= threshold) {
                    // Try to create batches
                    this.createBatches(model);
                }
                return [2 /*return*/, requestId];
            });
        });
    };
    /**
     * Process a batch of requests
     *
     * @param batchId The batch ID to process
     * @param processFunction The function to process the batch
     * @returns The processing results
     */
    BatchProcessor.prototype.processBatch = function (batchId, processFunction) {
        return __awaiter(this, void 0, void 0, function () {
            var batch, individualRequests, individualCostEstimate, startTime, result, endTime, savedCost, responses, _loop_1, this_1, _i, _a, item, error_1, _b, _c, request;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        batch = this.activeBatches.get(batchId);
                        if (!batch) {
                            throw new Error("Batch ".concat(batchId, " not found"));
                        }
                        // Update batch status
                        batch.status = 'processing';
                        batch.processedAt = new Date();
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        individualRequests = batch.requests.map(function (req) {
                            var inputTokens = estimateTokenCount(req.content);
                            return estimateCost(batch.model, inputTokens);
                        });
                        individualCostEstimate = individualRequests.reduce(function (sum, cost) { return sum + cost; }, 0);
                        batch.individualCostEstimate = individualCostEstimate;
                        startTime = Date.now();
                        return [4 /*yield*/, processFunction(batch)];
                    case 2:
                        result = _e.sent();
                        endTime = Date.now();
                        // Update batch with results
                        batch.status = 'completed';
                        batch.completedAt = new Date();
                        batch.tokenCount = result.tokenCount;
                        batch.cost = result.cost;
                        savedCost = Math.max(0, individualCostEstimate - result.cost);
                        batch.savedCost = savedCost;
                        // Update stats
                        this.stats.totalSavedCost += savedCost;
                        this.stats.modelStats[batch.model].savedCost += savedCost;
                        // Update averages
                        this.updateAverages();
                        // Report to budget forecaster
                        budgetForecaster.logBatchSavings(batch.model, savedCost, "Batched ".concat(batch.requests.length, " requests into 1 API call"));
                        responses = [];
                        _loop_1 = function (item) {
                            var request = batch.requests.find(function (req) { return req.id === item.requestId; });
                            if (!request)
                                return "continue";
                            // Calculate token counts for this specific response
                            var inputTokens = estimateTokenCount(request.content);
                            var outputTokens = estimateTokenCount(item.response);
                            // Calculate individual cost
                            var individualCost = estimateCost(batch.model, inputTokens, outputTokens);
                            // Calculate this request's share of the batch cost
                            var ratio = inputTokens / (result.tokenCount.input || 1);
                            var shareCost = result.cost * ratio;
                            // Calculate savings for this request
                            var requestSavedCost = Math.max(0, individualCost - shareCost);
                            // Create response object
                            var response = {
                                requestId: item.requestId,
                                response: item.response,
                                model: batch.model,
                                tokenCount: {
                                    input: inputTokens,
                                    output: outputTokens
                                },
                                cost: shareCost,
                                processingTime: endTime - startTime,
                                batchId: batch.id,
                                wasBatched: true,
                                savedCost: requestSavedCost,
                                createdAt: new Date()
                            };
                            // Store the response
                            this_1.pendingResponses.set(item.requestId, response);
                            responses.push(response);
                        };
                        this_1 = this;
                        for (_i = 0, _a = result.responses; _i < _a.length; _i++) {
                            item = _a[_i];
                            _loop_1(item);
                        }
                        // Add to completed batches
                        this.completedBatches.push(batch);
                        this.activeBatches.delete(batchId);
                        return [2 /*return*/, responses];
                    case 3:
                        error_1 = _e.sent();
                        // Update batch status on error
                        batch.status = 'failed';
                        batch.error = error_1 instanceof Error ? error_1.message : String(error_1);
                        // Move failed requests back to pending
                        for (_b = 0, _c = batch.requests; _b < _c.length; _b++) {
                            request = _c[_b];
                            (_d = this.pendingRequests.get(batch.model)) === null || _d === void 0 ? void 0 : _d.push(request);
                        }
                        // Remove from active batches
                        this.activeBatches.delete(batchId);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a batch by ID
     *
     * @param batchId The batch ID
     * @returns The batch or undefined if not found
     */
    BatchProcessor.prototype.getBatch = function (batchId) {
        // Check active batches
        var activeBatch = this.activeBatches.get(batchId);
        if (activeBatch)
            return activeBatch;
        // Check completed batches
        return this.completedBatches.find(function (batch) { return batch.id === batchId; });
    };
    /**
     * Get pending requests for a model
     *
     * @param model The model to check
     * @returns Array of pending requests
     */
    BatchProcessor.prototype.getPendingRequests = function (model) {
        if (model) {
            return this.pendingRequests.get(model) || [];
        }
        // Get all pending requests across models
        return Array.from(this.pendingRequests.values()).flat();
    };
    /**
     * Get active batches
     *
     * @param model Optional model to filter by
     * @returns Array of active batches
     */
    BatchProcessor.prototype.getActiveBatches = function (model) {
        var batches = Array.from(this.activeBatches.values());
        if (model) {
            return batches.filter(function (batch) { return batch.model === model; });
        }
        return batches;
    };
    /**
     * Get completed batches
     *
     * @param model Optional model to filter by
     * @param limit Optional limit on the number of results
     * @returns Array of completed batches
     */
    BatchProcessor.prototype.getCompletedBatches = function (model, limit) {
        var batches = this.completedBatches;
        if (model) {
            batches = batches.filter(function (batch) { return batch.model === model; });
        }
        // Sort by completion time (newest first)
        batches = batches.sort(function (a, b) {
            var _a, _b;
            var timeA = ((_a = a.completedAt) === null || _a === void 0 ? void 0 : _a.getTime()) || a.createdAt.getTime();
            var timeB = ((_b = b.completedAt) === null || _b === void 0 ? void 0 : _b.getTime()) || b.createdAt.getTime();
            return timeB - timeA;
        });
        if (limit && limit > 0) {
            batches = batches.slice(0, limit);
        }
        return batches;
    };
    /**
     * Get response for a request
     *
     * @param requestId The request ID
     * @returns The response or undefined if not found
     */
    BatchProcessor.prototype.getResponse = function (requestId) {
        return this.pendingResponses.get(requestId);
    };
    /**
     * Check if a response is ready
     *
     * @param requestId The request ID
     * @returns True if the response is ready
     */
    BatchProcessor.prototype.isResponseReady = function (requestId) {
        return this.pendingResponses.has(requestId);
    };
    /**
     * Wait for a response to be ready
     *
     * @param requestId The request ID
     * @param timeout Optional timeout in milliseconds
     * @returns The response
     */
    BatchProcessor.prototype.waitForResponse = function (requestId, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var immediate;
            var _this = this;
            return __generator(this, function (_a) {
                immediate = this.getResponse(requestId);
                if (immediate)
                    return [2 /*return*/, immediate];
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        // Set timeout if specified
                        var timeoutId;
                        if (timeout) {
                            timeoutId = setTimeout(function () {
                                reject(new Error("Timeout waiting for response to request ".concat(requestId)));
                            }, timeout);
                        }
                        // Check for response every 100ms
                        var interval = setInterval(function () {
                            var response = _this.getResponse(requestId);
                            if (response) {
                                clearInterval(interval);
                                if (timeoutId)
                                    clearTimeout(timeoutId);
                                resolve(response);
                            }
                        }, 100);
                    })];
            });
        });
    };
    /**
     * Force creation of batches for a model
     *
     * @param model The model to create batches for
     * @returns Array of created batch IDs
     */
    BatchProcessor.prototype.createBatches = function (model) {
        var _this = this;
        var pendingRequests = this.pendingRequests.get(model) || [];
        if (pendingRequests.length === 0) {
            return [];
        }
        // Cancel any existing flush timer for this model
        if (this.flushTimers.has(model)) {
            clearTimeout(this.flushTimers.get(model));
            this.flushTimers.delete(model);
        }
        // Sort requests by priority (highest first)
        pendingRequests.sort(function (a, b) { return b.priority - a.priority; });
        var batchIds = [];
        var remaining = __spreadArray([], pendingRequests, true);
        while (remaining.length > 0) {
            // Get the highest priority request
            var highestPriority = remaining[0];
            // Determine batch size (min of request's max batch size and config max batch size)
            var maxBatchSize = Math.min(highestPriority.maxBatchSize || this.config.defaultBatchSize || 5, this.config.maxBatchSize || 20);
            // Create a new batch with up to maxBatchSize requests
            var batchRequests = remaining.slice(0, maxBatchSize);
            remaining = remaining.slice(maxBatchSize);
            // Create batch
            var batchId = uuidv4();
            var batch = {
                id: batchId,
                model: model,
                requests: batchRequests,
                status: 'pending',
                createdAt: new Date()
            };
            // Add to active batches
            this.activeBatches.set(batchId, batch);
            batchIds.push(batchId);
            // Update stats
            this.stats.totalBatches++;
            this.stats.modelStats[model].batches++;
            var currentTotal = this.stats.modelStats[model].batches;
            var currentSize = batch.requests.length;
            var currentAvg = this.stats.modelStats[model].averageBatchSize;
            // Update average batch size
            this.stats.modelStats[model].averageBatchSize =
                (currentAvg * (currentTotal - 1) + currentSize) / currentTotal;
        }
        // Clear pending requests for this model
        this.pendingRequests.set(model, []);
        // Start a new flush timer for this model
        if (this.config.autoFlushInterval && this.config.autoFlushInterval > 0) {
            var timer = setTimeout(function () {
                _this.flushModelRequests(model);
            }, this.config.autoFlushInterval);
            this.flushTimers.set(model, timer);
        }
        return batchIds;
    };
    /**
     * Flush all pending requests for a model
     *
     * @param model The model to flush
     * @returns Array of created batch IDs
     */
    BatchProcessor.prototype.flushModelRequests = function (model) {
        var pendingRequests = this.pendingRequests.get(model) || [];
        if (pendingRequests.length === 0) {
            return [];
        }
        // Need at least the threshold number of requests to create a batch
        var threshold = this.config.batchingThreshold || DEFAULT_CONFIG.batchingThreshold || 2;
        if (pendingRequests.length < threshold) {
            // Not enough requests to batch, process individually
            var batchIds = [];
            for (var _i = 0, pendingRequests_1 = pendingRequests; _i < pendingRequests_1.length; _i++) {
                var request = pendingRequests_1[_i];
                // Create individual "batch" for each request
                var batchId = uuidv4();
                var batch = {
                    id: batchId,
                    model: model,
                    requests: [request],
                    status: 'pending',
                    createdAt: new Date()
                };
                // Add to active batches
                this.activeBatches.set(batchId, batch);
                batchIds.push(batchId);
                // Update stats
                this.stats.totalBatches++;
                this.stats.modelStats[model].batches++;
            }
            // Clear pending requests
            this.pendingRequests.set(model, []);
            return batchIds;
        }
        // Create batches normally
        return this.createBatches(model);
    };
    /**
     * Flush all pending requests across all models
     *
     * @returns Map of model to created batch IDs
     */
    BatchProcessor.prototype.flushAllRequests = function () {
        var result = new Map();
        for (var _i = 0, _a = this.pendingRequests.keys(); _i < _a.length; _i++) {
            var model = _a[_i];
            var batchIds = this.flushModelRequests(model);
            result.set(model, batchIds);
        }
        return result;
    };
    /**
     * Process a request outside of batching
     *
     * @param model The model to use
     * @param content The request content
     * @param processFunction The function to process the request
     * @param options Additional options
     * @returns The response
     */
    BatchProcessor.prototype.processIndividual = function (model_1, content_1, processFunction_1) {
        return __awaiter(this, arguments, void 0, function (model, content, processFunction, options) {
            var requestId, priority, request, startTime, result, endTime, response;
            var _a, _b, _c, _d;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        requestId = uuidv4();
                        if (typeof options.priority === 'number') {
                            priority = options.priority;
                        }
                        else if (typeof options.priority === 'string') {
                            priority = ((_a = this.config.priorityLevels) === null || _a === void 0 ? void 0 : _a[options.priority]) ||
                                ((_b = DEFAULT_CONFIG.priorityLevels) === null || _b === void 0 ? void 0 : _b[options.priority]) ||
                                ((_c = DEFAULT_CONFIG.priorityLevels) === null || _c === void 0 ? void 0 : _c.normal) ||
                                50;
                        }
                        else {
                            priority = ((_d = DEFAULT_CONFIG.priorityLevels) === null || _d === void 0 ? void 0 : _d.normal) || 50;
                        }
                        request = {
                            id: requestId,
                            model: model,
                            content: content,
                            priority: priority,
                            createdAt: new Date(),
                            metadata: options.metadata
                        };
                        startTime = Date.now();
                        return [4 /*yield*/, processFunction(request)];
                    case 1:
                        result = _e.sent();
                        endTime = Date.now();
                        response = {
                            requestId: requestId,
                            response: result.response,
                            model: model,
                            tokenCount: result.tokenCount,
                            cost: result.cost,
                            processingTime: result.processingTime || (endTime - startTime),
                            wasBatched: false,
                            createdAt: new Date()
                        };
                        // Store the response
                        this.pendingResponses.set(requestId, response);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Get batch statistics
     *
     * @returns Batch statistics
     */
    BatchProcessor.prototype.getStats = function () {
        return __assign({}, this.stats);
    };
    /**
     * Reset batch statistics
     */
    BatchProcessor.prototype.resetStats = function () {
        this.stats = {
            totalRequests: 0,
            totalBatches: 0,
            totalSavedCost: 0,
            averageBatchSize: 0,
            averageSavingsPerBatch: 0,
            averageSavingsPercentage: 0,
            modelStats: {}
        };
        console.log('Batch processor statistics reset');
    };
    /**
     * Update the processor configuration
     *
     * @param config Updated configuration
     */
    BatchProcessor.prototype.updateConfig = function (config) {
        this.config = __assign(__assign({}, this.config), config);
        console.log('Batch processor configuration updated');
    };
    /**
     * Clear completed batches to free memory
     *
     * @param olderThan Optional age threshold in milliseconds
     * @returns Number of batches cleared
     */
    BatchProcessor.prototype.clearCompletedBatches = function (olderThan) {
        var now = Date.now();
        if (olderThan) {
            var threshold_1 = now - olderThan;
            var oldBatches = this.completedBatches.filter(function (batch) {
                return batch.completedAt && batch.completedAt.getTime() < threshold_1;
            });
            this.completedBatches = this.completedBatches.filter(function (batch) {
                return !batch.completedAt || batch.completedAt.getTime() >= threshold_1;
            });
            return oldBatches.length;
        }
        // Clear all completed batches
        var count = this.completedBatches.length;
        this.completedBatches = [];
        return count;
    };
    /**
     * Check if a model is supported for batching
     *
     * @private
     * @param model The model to check
     * @returns True if the model is supported
     */
    BatchProcessor.prototype.isModelSupported = function (model) {
        var _a;
        return !!((_a = this.config.enabledModels) === null || _a === void 0 ? void 0 : _a.includes(model));
    };
    /**
     * Update average statistics
     *
     * @private
     */
    BatchProcessor.prototype.updateAverages = function () {
        // Update average batch size
        if (this.stats.totalBatches > 0) {
            var totalBatchSize = 0;
            var batchCount = 0;
            for (var model in this.stats.modelStats) {
                var modelStats = this.stats.modelStats[model];
                totalBatchSize += modelStats.averageBatchSize * modelStats.batches;
                batchCount += modelStats.batches;
            }
            this.stats.averageBatchSize = totalBatchSize / batchCount;
        }
        // Update average savings per batch
        if (this.stats.totalBatches > 0) {
            this.stats.averageSavingsPerBatch = this.stats.totalSavedCost / this.stats.totalBatches;
        }
        // Update average savings percentage
        var completedBatches = this.completedBatches.filter(function (batch) {
            return batch.cost !== undefined && batch.individualCostEstimate !== undefined;
        });
        if (completedBatches.length > 0) {
            var totalPercentage = 0;
            for (var _i = 0, completedBatches_1 = completedBatches; _i < completedBatches_1.length; _i++) {
                var batch = completedBatches_1[_i];
                if (batch.individualCostEstimate && batch.individualCostEstimate > 0) {
                    var savedPercentage = ((batch.savedCost || 0) / batch.individualCostEstimate) * 100;
                    totalPercentage += savedPercentage;
                }
            }
            this.stats.averageSavingsPercentage = totalPercentage / completedBatches.length;
        }
    };
    /**
     * Generate a report on batch processor efficiency
     */
    BatchProcessor.prototype.generateEfficiencyReport = function () {
        // Generate recommendations
        var recommendations = [];
        // Check if batching is being used effectively
        if (this.stats.totalRequests > 0 && this.stats.totalBatches > 0) {
            var avgBatchSize = this.stats.averageBatchSize;
            var maxBatchSize = this.config.maxBatchSize || DEFAULT_CONFIG.maxBatchSize || 20;
            if (avgBatchSize < 2) {
                recommendations.push({
                    type: 'batch_size',
                    description: 'Batching is underutilized. Consider increasing wait time to accumulate more requests.',
                    impact: 'high'
                });
            }
            else if (avgBatchSize < maxBatchSize / 2) {
                recommendations.push({
                    type: 'batch_size',
                    description: "Average batch size (".concat(avgBatchSize.toFixed(1), ") is below optimal. Consider adjusting wait time or batch thresholds."),
                    impact: 'medium'
                });
            }
            // Check savings
            if (this.stats.averageSavingsPercentage < 20) {
                recommendations.push({
                    type: 'savings',
                    description: 'Cost savings from batching are below expectations. Review batch processing implementation.',
                    impact: 'high'
                });
            }
        }
        // Check model-specific recommendations
        for (var model in this.stats.modelStats) {
            var modelStats = this.stats.modelStats[model];
            if (modelStats.requests > 20 && modelStats.batches === 0) {
                recommendations.push({
                    type: 'model_usage',
                    description: "Model ".concat(model, " has ").concat(modelStats.requests, " requests but no batches. Check if batching is enabled for this model."),
                    impact: 'medium'
                });
            }
        }
        // Create summary
        var summary = "Batch Processor Efficiency Report\n";
        summary += "Total requests: ".concat(this.stats.totalRequests, "\n");
        summary += "Total batches: ".concat(this.stats.totalBatches, "\n");
        summary += "Total cost savings: $".concat(this.stats.totalSavedCost.toFixed(6), "\n");
        summary += "Average batch size: ".concat(this.stats.averageBatchSize.toFixed(2), "\n");
        summary += "Average savings per batch: $".concat(this.stats.averageSavingsPerBatch.toFixed(6), "\n");
        summary += "Average savings percentage: ".concat(this.stats.averageSavingsPercentage.toFixed(2), "%\n\n");
        summary += "Model usage:\n";
        for (var model in this.stats.modelStats) {
            var ms = this.stats.modelStats[model];
            summary += "- ".concat(model, ": ").concat(ms.requests, " requests, ").concat(ms.batches, " batches, avg size ").concat(ms.averageBatchSize.toFixed(2), ", saved $").concat(ms.savedCost.toFixed(6), "\n");
        }
        // Ensure budget forecaster gets our data
        budgetForecaster.checkBudgetThresholds();
        return {
            summary: summary,
            stats: this.stats,
            recommendations: recommendations
        };
    };
    return BatchProcessor;
}());
export { BatchProcessor };
// Create singleton instance
export var batchProcessor = new BatchProcessor();
