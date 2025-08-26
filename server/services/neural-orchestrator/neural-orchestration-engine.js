/**
 * Neural Orchestration Engine
 *
 * This module provides the core orchestration capabilities for neural processing,
 * coordinating task decomposition, distribution, and recomposition using the IDDR paradigm.
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
import { ModelType } from './model-strength-analyzer.js';
import { v4 as uuidv4 } from 'uuid';
var NeuralOrchestrationEngine = /** @class */ (function () {
    function NeuralOrchestrationEngine() {
        var _this = this;
        this.tasks = new Map();
        this.taskResults = new Map();
        this.taskProcessors = new Map();
        this.modelAgents = new Map();
        this.availableModels = [ModelType.LITE, ModelType.STANDARD];
        // Register default task processors
        this.registerTaskProcessor('summarization', function (task) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, "Summary of: ".concat(task.prompt.substring(0, 50), "...")];
            });
        }); });
        this.registerTaskProcessor('analysis', function (task) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, "Analysis of: ".concat(task.prompt.substring(0, 50), "...")];
            });
        }); });
    }
    /**
     * Register a task processor for a specific task type
     * @param taskType Type of task to register processor for
     * @param processor Function to process the task
     */
    NeuralOrchestrationEngine.prototype.registerTaskProcessor = function (taskType, processor) {
        this.taskProcessors.set(taskType, processor);
    };
    /**
     * Create a new task
     * @param taskData Task data
     * @returns Created task
     */
    NeuralOrchestrationEngine.prototype.createTask = function (taskData) {
        // Ensure taskData contains required Task properties
        if (!taskData.prompt || !taskData.type || !taskData.requirements) {
            throw new Error('Task must contain prompt, type, and requirements');
        }
        // Create task with all required properties explicitly specified for TypeScript
        var task = __assign({ id: uuidv4(), prompt: taskData.prompt, type: taskData.type, requirements: taskData.requirements }, taskData);
        this.tasks.set(task.id, task);
        return task;
    };
    /**
     * Execute a task
     * @param task Task to execute
     * @returns Task result
     */
    NeuralOrchestrationEngine.prototype.executeTask = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, processor, output, endTime, processingTime, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = new Date();
                        processor = this.taskProcessors.get(task.type);
                        if (!processor) {
                            throw new Error("No processor registered for task type: ".concat(task.type));
                        }
                        return [4 /*yield*/, processor(task)];
                    case 1:
                        output = _a.sent();
                        endTime = new Date();
                        processingTime = endTime.getTime() - startTime.getTime();
                        result = {
                            taskId: task.id,
                            output: output,
                            metadata: {
                                taskType: task.type,
                                requirementsMet: true
                            },
                            startTime: startTime,
                            endTime: endTime,
                            processingTime: processingTime
                        };
                        this.taskResults.set(task.id, result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get all tasks
     * @returns All tasks
     */
    NeuralOrchestrationEngine.prototype.getAllTasks = function () {
        return Array.from(this.tasks.values());
    };
    /**
     * Get tasks by status
     * @param status Status to filter by
     * @returns Tasks with the specified status
     */
    NeuralOrchestrationEngine.prototype.getTasksByStatus = function (status) {
        return Array.from(this.tasks.values()).filter(function (task) { return task.status === status; });
    };
    /**
     * Get task by ID
     * @param taskId Task ID
     * @returns Task if found, undefined otherwise
     */
    NeuralOrchestrationEngine.prototype.getTask = function (taskId) {
        return this.tasks.get(taskId);
    };
    /**
     * Get task result by task ID
     * @param taskId Task ID
     * @returns Task result if found, undefined otherwise
     */
    NeuralOrchestrationEngine.prototype.getTaskResult = function (taskId) {
        return this.taskResults.get(taskId);
    };
    /**
     * Get system statistics
     * @returns System statistics
     */
    NeuralOrchestrationEngine.prototype.getStatistics = function () {
        return {
            totalTasks: this.tasks.size,
            completedTasks: Array.from(this.taskResults.values()).length,
            availableProcessors: Array.from(this.taskProcessors.keys()),
            registeredAgents: Array.from(this.modelAgents.keys())
        };
    };
    /**
     * Get available model types
     * @returns Available model types
     */
    NeuralOrchestrationEngine.prototype.getAvailableModelTypes = function () {
        return this.availableModels;
    };
    /**
     * Get capabilities of a model
     * @param modelType Type of model
     * @returns Model capabilities
     */
    NeuralOrchestrationEngine.prototype.getModelCapabilities = function (modelType) {
        // Default capabilities
        return {
            taskTypes: ['summarization', 'analysis'],
            contextSize: modelType === ModelType.LITE ? 4000 : 8000,
            throughput: modelType === ModelType.LITE ? 'high' : 'medium',
            costFactor: modelType === ModelType.LITE ? 1 : 3
        };
    };
    /**
     * Register an AI model agent with the orchestration engine
     *
     * BOUNDARY AWARENESS: This explicitly registers an agent that can cross the boundary
     * between our system and external AI models. The registration acknowledges and formalizes
     * this boundary crossing capability within our system.
     *
     * @param agent The AI model agent to register
     * @returns The registered agent
     */
    NeuralOrchestrationEngine.prototype.registerAgent = function (agent) {
        // Register the agent by model type
        this.modelAgents.set(agent.modelType, agent);
        // If this model type isn't in the available models, add it
        if (!this.availableModels.includes(agent.modelType)) {
            this.availableModels.push(agent.modelType);
        }
        console.log("Registered agent for model type: ".concat(agent.modelType));
        return agent;
    };
    /**
     * Get a registered AI model agent
     *
     * BOUNDARY AWARENESS: This retrieves an agent that can cross the boundary
     * between our system and external AI models.
     *
     * @param modelType The type of model to get an agent for
     * @returns The registered agent, or undefined if not found
     */
    NeuralOrchestrationEngine.prototype.getModelAgent = function (modelType) {
        return this.modelAgents.get(modelType);
    };
    return NeuralOrchestrationEngine;
}());
export { NeuralOrchestrationEngine };
// Export a singleton instance
export var neuralOrchestrationEngine = new NeuralOrchestrationEngine();
