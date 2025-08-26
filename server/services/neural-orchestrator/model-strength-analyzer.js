/**
 * Model Strength Analyzer
 *
 * This module provides functionality to analyze the strength and capabilities of
 * various AI models, helping to select the most appropriate model for a given task.
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
/**
 * Enum representing different types of AI models with varying capabilities
 */
/**
 * ModelType Enum - Unified Type Boundary
 *
 * BOUNDARY AWARENESS: This enum explicitly defines the boundary between abstract
 * capability levels (LITE, STANDARD, etc.) and concrete model implementations (GPT_4O, GEMINI_PRO, etc.)
 *
 * VOID-CENTERED DESIGN: By combining these in one enum, we explicitly acknowledge the void
 * between the abstract concept of model capability and the concrete implementation
 * that attempts to fulfill it.
 *
 * This boundary-conscious approach allows for:
 * 1. Clear mapping between capability requirements and concrete models
 * 2. Explicit acknowledgment of the gap between ideal capability and actual implementation
 * 3. Boundary transparency when crossing from orchestration to implementation
 */
export var ModelType;
(function (ModelType) {
    // INTERNAL BOUNDARY: Abstract capability levels (conceptual requirements boundary)
    ModelType["LITE"] = "lite";
    ModelType["STANDARD"] = "standard";
    ModelType["ADVANCED"] = "advanced";
    ModelType["EXPERT"] = "expert";
    ModelType["SPECIALIZED"] = "specialized";
    // EXTERNAL BOUNDARY: Concrete model implementations (implementation provider boundary)
    ModelType["GPT_4O"] = "gpt-4o";
    ModelType["GEMINI_PRO"] = "gemini-pro";
    ModelType["GROK"] = "grok";
    ModelType["CLAUDE"] = "claude";
    ModelType["O3_MINI"] = "o3-mini"; // Local boundary crossing
})(ModelType || (ModelType = {}));
/**
 * Class to analyze model strengths and match them to task requirements
 */
var ModelStrengthAnalyzer = /** @class */ (function () {
    function ModelStrengthAnalyzer() {
        this.modelCapabilities = new Map();
        // Initialize with default capabilities for each model type
        this.modelCapabilities.set(ModelType.LITE, {
            complexity: 3,
            precision: 3,
            creativity: 2,
            contextSize: 4000,
            speed: 5,
            cost: 1
        });
        this.modelCapabilities.set(ModelType.STANDARD, {
            complexity: 5,
            precision: 5,
            creativity: 4,
            contextSize: 8000,
            speed: 4,
            cost: 2
        });
        this.modelCapabilities.set(ModelType.ADVANCED, {
            complexity: 8,
            precision: 7,
            creativity: 6,
            contextSize: 16000,
            speed: 3,
            cost: 4
        });
        this.modelCapabilities.set(ModelType.EXPERT, {
            complexity: 9,
            precision: 9,
            creativity: 8,
            contextSize: 32000,
            speed: 2,
            cost: 8
        });
        this.modelCapabilities.set(ModelType.SPECIALIZED, {
            complexity: 10,
            precision: 10,
            creativity: 9,
            contextSize: 64000,
            speed: 1,
            cost: 10
        });
    }
    /**
     * Evaluate how well a model matches requirements
     * @param requirements Task requirements
     * @param modelType Type of model to evaluate
     * @returns Score from 0-1 representing match quality
     */
    ModelStrengthAnalyzer.prototype.evaluateModelForRequirements = function (requirements, modelType) {
        var capabilities = this.modelCapabilities.get(modelType);
        if (!capabilities) {
            throw new Error("Unknown model type: ".concat(modelType));
        }
        // Calculate a weighted score based on how well capabilities match requirements
        var totalWeight = 6; // Number of criteria
        var complexityScore = Math.min(capabilities.complexity / requirements.complexity, 1);
        var precisionScore = Math.min(capabilities.precision / requirements.precision, 1);
        var creativityScore = Math.min(capabilities.creativity / requirements.creativity, 1);
        var contextScore = Math.min(capabilities.contextSize / requirements.contextSize, 1);
        var speedScore = Math.min(capabilities.speed / requirements.speed, 1);
        var costScore = Math.min(requirements.cost / capabilities.cost, 1); // Inverted for cost
        // Weighted average
        return (complexityScore + precisionScore + creativityScore + contextScore + speedScore + costScore) / totalWeight;
    };
    /**
     * Find the best model for given requirements
     * @param requirements Task requirements
     * @returns The most appropriate model type
     */
    ModelStrengthAnalyzer.prototype.findBestModelForRequirements = function (requirements) {
        var bestScore = 0;
        var bestModel = ModelType.LITE;
        for (var _i = 0, _a = Object.values(ModelType); _i < _a.length; _i++) {
            var modelType = _a[_i];
            var score = this.evaluateModelForRequirements(requirements, modelType);
            if (score > bestScore) {
                bestScore = score;
                bestModel = modelType;
            }
        }
        return bestModel;
    };
    /**
     * Get detailed evaluation for all models against requirements
     * @param requirements Task requirements
     * @returns Evaluation results for all models
     */
    ModelStrengthAnalyzer.prototype.getModelEvaluations = function (requirements) {
        var evaluations = [];
        for (var _i = 0, _a = Object.values(ModelType); _i < _a.length; _i++) {
            var modelType = _a[_i];
            var typedModelType = modelType;
            var capabilities = this.modelCapabilities.get(typedModelType);
            if (!capabilities)
                continue;
            var score = this.evaluateModelForRequirements(requirements, typedModelType);
            var strengths = [];
            var weaknesses = [];
            // Determine strengths and weaknesses
            if (capabilities.complexity >= requirements.complexity)
                strengths.push('complexity handling');
            else
                weaknesses.push('complexity handling');
            if (capabilities.precision >= requirements.precision)
                strengths.push('precision');
            else
                weaknesses.push('precision');
            if (capabilities.creativity >= requirements.creativity)
                strengths.push('creativity');
            else
                weaknesses.push('creativity');
            if (capabilities.contextSize >= requirements.contextSize)
                strengths.push('context size');
            else
                weaknesses.push('context size');
            if (capabilities.speed >= requirements.speed)
                strengths.push('speed');
            else
                weaknesses.push('speed');
            if (capabilities.cost <= requirements.cost)
                strengths.push('cost efficiency');
            else
                weaknesses.push('cost efficiency');
            // Determine recommended task types
            var recommendedFor = [];
            var notRecommendedFor = [];
            if (capabilities.complexity >= 7)
                recommendedFor.push('complex reasoning');
            else
                notRecommendedFor.push('complex reasoning');
            if (capabilities.precision >= 7)
                recommendedFor.push('detailed analysis');
            else
                notRecommendedFor.push('detailed analysis');
            if (capabilities.creativity >= 7)
                recommendedFor.push('creative generation');
            else
                notRecommendedFor.push('creative generation');
            if (capabilities.contextSize >= 16000)
                recommendedFor.push('long context tasks');
            else
                notRecommendedFor.push('long context tasks');
            if (capabilities.speed >= 4)
                recommendedFor.push('time-sensitive tasks');
            else
                notRecommendedFor.push('time-sensitive tasks');
            if (capabilities.cost <= 3)
                recommendedFor.push('budget-constrained tasks');
            else
                notRecommendedFor.push('budget-constrained tasks');
            evaluations.push({
                modelType: typedModelType,
                score: score,
                strengths: strengths,
                weaknesses: weaknesses,
                recommendedFor: recommendedFor,
                notRecommendedFor: notRecommendedFor
            });
        }
        // Sort by score (highest first)
        return evaluations.sort(function (a, b) { return b.score - a.score; });
    };
    /**
     * Determine if a model is suitable for a specific criteria
     * @param modelType Type of model to check
     * @param criteriaName Name of criteria to check
     * @param minimumValue Minimum value required
     * @returns Boolean indicating if model meets criteria
     */
    ModelStrengthAnalyzer.prototype.modelMeetsCriteria = function (modelType, criteriaName, minimumValue) {
        var capabilities = this.modelCapabilities.get(modelType);
        if (!capabilities) {
            return false;
        }
        return capabilities[criteriaName] >= minimumValue;
    };
    /**
     * Allocate models to a set of tasks based on requirements
     * @param tasks Array of tasks with requirements
     * @returns Allocation of models to tasks
     */
    ModelStrengthAnalyzer.prototype.allocateModelsToTasks = function (tasks) {
        var allocations = new Map();
        for (var _i = 0, tasks_1 = tasks; _i < tasks_1.length; _i++) {
            var task = tasks_1[_i];
            var bestModel = this.findBestModelForRequirements(task.requirements);
            var score = this.evaluateModelForRequirements(task.requirements, bestModel);
            var capabilities = this.modelCapabilities.get(bestModel);
            if (!capabilities) {
                continue;
            }
            // Calculate estimated time based on complexity and model speed
            var estimatedTime = (task.requirements.complexity / capabilities.speed) * 10; // in seconds
            // Calculate estimated cost based on model cost and complexity
            var estimatedCost = capabilities.cost * (task.requirements.complexity / 5);
            allocations.set(task.id, {
                modelType: bestModel,
                score: score,
                matchPercentage: score * 100,
                estimatedCost: estimatedCost,
                estimatedTime: estimatedTime
            });
        }
        return allocations;
    };
    /**
     * Check if a task would benefit from using an ensemble of models
     * @param requirements Task requirements
     * @returns Boolean indicating if ensemble is recommended
     */
    ModelStrengthAnalyzer.prototype.shouldUseEnsembleForTask = function (requirements) {
        // Check if the task has complex, multi-faceted requirements
        var complexityRequirement = requirements.complexity > 7;
        var precisionRequirement = requirements.precision > 8;
        var creativityRequirement = requirements.creativity > 6;
        // If multiple high requirements, an ensemble might perform better
        var highRequirementCount = [
            complexityRequirement,
            precisionRequirement,
            creativityRequirement
        ].filter(Boolean).length;
        return highRequirementCount >= 2;
    };
    /**
     * Update capabilities for a model based on performance data
     * @param modelType Type of model to update
     * @param performanceData New performance metrics
     */
    ModelStrengthAnalyzer.prototype.updateModelCapabilities = function (modelType, performanceData) {
        var currentCapabilities = this.modelCapabilities.get(modelType);
        if (!currentCapabilities) {
            throw new Error("Unknown model type: ".concat(modelType));
        }
        // Update capabilities with new performance data
        this.modelCapabilities.set(modelType, __assign(__assign({}, currentCapabilities), performanceData));
    };
    /**
     * Get the performance profile for a model
     * @param modelType Type of model to get profile for
     * @returns Performance profile with capabilities and recommendations
     */
    ModelStrengthAnalyzer.prototype.getModelPerformanceProfile = function (modelType) {
        var capabilities = this.modelCapabilities.get(modelType);
        if (!capabilities) {
            throw new Error("Unknown model type: ".concat(modelType));
        }
        // Determine tasks the model is suitable for
        var suitableFor = [];
        var notSuitableFor = [];
        if (capabilities.complexity >= 7)
            suitableFor.push('complex reasoning');
        else
            notSuitableFor.push('complex reasoning');
        if (capabilities.precision >= 7)
            suitableFor.push('detailed analysis');
        else
            notSuitableFor.push('detailed analysis');
        if (capabilities.creativity >= 7)
            suitableFor.push('creative generation');
        else
            notSuitableFor.push('creative generation');
        if (capabilities.contextSize >= 16000)
            suitableFor.push('long context tasks');
        else
            notSuitableFor.push('long context tasks');
        if (capabilities.speed >= 4)
            suitableFor.push('time-sensitive tasks');
        else
            notSuitableFor.push('time-sensitive tasks');
        if (capabilities.cost <= 3)
            suitableFor.push('budget-constrained tasks');
        else
            notSuitableFor.push('budget-constrained tasks');
        return {
            capabilities: capabilities,
            suitableFor: suitableFor,
            notSuitableFor: notSuitableFor
        };
    };
    /**
     * Run benchmarks for a specific model
     * @param modelType Type of model to benchmark
     * @returns Promise resolving to benchmark results
     */
    ModelStrengthAnalyzer.prototype.runBenchmarksForModel = function (modelType) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // Simulate running benchmarks with a promise
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            var benchmarkTasks = _this.getAllBenchmarkTasks();
                            var results = benchmarkTasks.map(function (task) {
                                var score = _this.evaluateModelForRequirements(task.requirements, modelType);
                                var capabilities = _this.modelCapabilities.get(modelType);
                                var executionTime = capabilities ?
                                    (task.requirements.complexity / capabilities.speed) * 10 :
                                    30; // Default execution time if capabilities not found
                                return {
                                    taskId: task.id,
                                    taskType: task.taskType,
                                    score: Math.round(score * 100) / 100,
                                    executionTime: Math.round(executionTime * 10) / 10
                                };
                            });
                            resolve(results);
                        }, 500); // Simulate benchmark taking time
                    })];
            });
        });
    };
    /**
     * Get all benchmark tasks used for evaluating models
     * @returns Array of benchmark tasks
     */
    ModelStrengthAnalyzer.prototype.getAllBenchmarkTasks = function () {
        return [
            {
                id: 'bench-001',
                taskType: 'text_generation',
                description: 'Generate a coherent paragraph on a given topic',
                requirements: {
                    complexity: 4,
                    precision: 5,
                    creativity: 7,
                    contextSize: 2000,
                    speed: 3,
                    cost: 2
                }
            },
            {
                id: 'bench-002',
                taskType: 'code_generation',
                description: 'Write a function to solve a specific programming problem',
                requirements: {
                    complexity: 6,
                    precision: 8,
                    creativity: 4,
                    contextSize: 4000,
                    speed: 4,
                    cost: 3
                }
            },
            {
                id: 'bench-003',
                taskType: 'reasoning',
                description: 'Solve a multi-step logical reasoning problem',
                requirements: {
                    complexity: 8,
                    precision: 7,
                    creativity: 3,
                    contextSize: 6000,
                    speed: 5,
                    cost: 4
                }
            },
            {
                id: 'bench-004',
                taskType: 'creative_writing',
                description: 'Write a creative short story with specific elements',
                requirements: {
                    complexity: 7,
                    precision: 5,
                    creativity: 9,
                    contextSize: 8000,
                    speed: 3,
                    cost: 5
                }
            },
            {
                id: 'bench-005',
                taskType: 'summarization',
                description: 'Summarize a long document preserving key information',
                requirements: {
                    complexity: 6,
                    precision: 8,
                    creativity: 2,
                    contextSize: 16000,
                    speed: 4,
                    cost: 3
                }
            }
        ];
    };
    return ModelStrengthAnalyzer;
}());
export { ModelStrengthAnalyzer };
// Export a singleton instance
export var modelStrengthAnalyzer = new ModelStrengthAnalyzer();
