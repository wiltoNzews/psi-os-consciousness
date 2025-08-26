/**
 * Neural Orchestrator API
 *
 * This module provides RESTful API endpoints for interacting with the Neural Orchestration Engine,
 * allowing for task creation, execution, and monitoring, as well as model management
 * and benchmark operations.
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
import { Router } from 'express';
import { neuralOrchestrationEngine } from '../services/neural-orchestrator/neural-orchestration-engine.js';
import { ModelType, modelStrengthAnalyzer } from '../services/neural-orchestrator/model-strength-analyzer.js';
import { MetaCognitiveEventBuilder } from '../services/utils/MetaCognitiveEventBuilder.js';
/**
 * Evaluation criteria for assessing output quality
 */
export var EvaluationCriteria;
(function (EvaluationCriteria) {
    EvaluationCriteria["ACCURACY"] = "accuracy";
    EvaluationCriteria["CREATIVITY"] = "creativity";
    EvaluationCriteria["SPEED"] = "speed";
    EvaluationCriteria["CONSISTENCY"] = "consistency";
    EvaluationCriteria["DETAIL"] = "detail";
    EvaluationCriteria["FORMAT_ADHERENCE"] = "format_adherence";
    EvaluationCriteria["CONTEXT_AWARENESS"] = "context_awareness";
    EvaluationCriteria["INSTRUCTION_FOLLOWING"] = "instruction_following";
    EvaluationCriteria["REASONING"] = "reasoning";
    EvaluationCriteria["BREVITY"] = "brevity";
    EvaluationCriteria["TOOL_USAGE"] = "tool_usage";
    EvaluationCriteria["EFFICIENCY"] = "efficiency";
    EvaluationCriteria["CODE_QUALITY"] = "code_quality";
    EvaluationCriteria["EXPLANATION"] = "explanation";
    EvaluationCriteria["COHERENCE"] = "coherence";
    EvaluationCriteria["ENGAGEMENT"] = "engagement";
    EvaluationCriteria["ADHERENCE_TO_CONSTRAINTS"] = "adherence_to_constraints";
    EvaluationCriteria["SIMPLIFICATION"] = "simplification";
    EvaluationCriteria["CLARITY"] = "clarity";
    EvaluationCriteria["COMPLETENESS"] = "completeness";
})(EvaluationCriteria || (EvaluationCriteria = {}));
/**
 * Types of tasks the system can process
 */
export var TaskType;
(function (TaskType) {
    TaskType["SUMMARIZATION"] = "summarization";
    TaskType["ANALYSIS"] = "analysis";
    TaskType["GENERATION"] = "generation";
    TaskType["TRANSLATION"] = "translation";
    TaskType["CLASSIFICATION"] = "classification";
    TaskType["EXTRACTION"] = "extraction";
    TaskType["CONVERSATION"] = "conversation";
    TaskType["CALCULATION"] = "calculation";
    TaskType["TEXT_GENERATION"] = "text_generation";
    TaskType["CODE_GENERATION"] = "code_generation";
    TaskType["REASONING"] = "reasoning";
    TaskType["CREATIVE_WRITING"] = "creative_writing";
    TaskType["POETRY"] = "poetry";
    TaskType["STORY_TELLING"] = "story_telling";
    TaskType["MATHEMATICS"] = "mathematics";
    TaskType["SCIENTIFIC_ANALYSIS"] = "scientific_analysis";
    TaskType["DOMAIN_SPECIFIC"] = "domain_specific";
    TaskType["IMAGE_UNDERSTANDING"] = "image_understanding";
    TaskType["AUDIO_UNDERSTANDING"] = "audio_understanding";
    TaskType["INSTRUCTION_FOLLOWING"] = "instruction_following";
    TaskType["TOOL_USAGE"] = "tool_usage";
    TaskType["PLANNING"] = "planning";
    TaskType["META_COGNITION"] = "meta_cognition";
})(TaskType || (TaskType = {}));
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { metaCognitiveEngine } from '../services/qrn/meta-cognitive-analysis-engine.js';
import { storage } from '../storage.js';
// MemStorage implementation doesn't use direct database queries
export var router = Router();
// Validation schemas
var taskRequirementsSchema = z.object({
    taskType: z.nativeEnum(TaskType),
    complexity: z.number().min(1).max(10).default(5),
    domainSpecificity: z.number().min(1).max(10).default(5),
    creativityLevel: z.number().min(1).max(10).default(5),
    timeConstraint: z.number().min(0).default(0),
    outputFormat: z.string().optional(),
    qualityThreshold: z.number().min(0).max(1).optional(),
    criteriaImportance: z.record(z.number().min(0).max(1)).default({}),
    contextSize: z.number().min(1).max(100000).default(1000),
    multimodalInputs: z.boolean().default(false),
    systemConstraints: z.object({
        maxTokens: z.number().optional(),
        maxLatency: z.number().optional(),
        maxCost: z.number().optional(),
    }).optional(),
});
var taskCreateSchema = z.object({
    prompt: z.string().min(1).max(10000),
    requirements: z.object({
        taskType: z.nativeEnum(TaskType),
        complexity: z.number().min(1).max(10).default(5),
        domainSpecificity: z.number().min(1).max(10).default(5),
        creativityLevel: z.number().min(1).max(10).default(5),
        timeConstraint: z.number().min(0).default(0),
        outputFormat: z.string().optional(),
        qualityThreshold: z.number().min(0).max(1).optional(),
        criteriaImportance: z.record(z.number().min(0).max(1)).default({}),
        contextSize: z.number().min(1).max(100000).default(1000),
        multimodalInputs: z.boolean().default(false),
        enableAdvancedRouting: z.boolean().default(false), // New field for advanced routing
        systemConstraints: z.object({
            maxTokens: z.number().optional(),
            maxLatency: z.number().optional(),
            maxCost: z.number().optional(),
        }).optional(),
    }),
    priority: z.number().min(1).max(10).default(5),
    deadline: z.string().optional(), // ISO date string
    multimodalContent: z.array(z.object({
        type: z.enum(['image', 'audio', 'video']),
        data: z.string(), // base64 or URL
    })).optional(),
});
var modelInitializeSchema = z.object({
    modelType: z.nativeEnum(ModelType),
    apiKey: z.string().optional(),
    systemStability: z.number().min(0).max(1).optional(),
    nodeSynergy: z.number().min(0).max(1).optional(),
    globalCoherence: z.number().min(0).max(1).optional(),
});
var benchmarkRunSchema = z.object({
    modelType: z.nativeEnum(ModelType),
    benchmarkId: z.string().optional(), // If not provided, run all benchmarks
});
// GET /api/neural-orchestrator/status
// Get the current status of the Neural Orchestration Engine
router.get('/status', function (req, res) {
    try {
        var stats = neuralOrchestrationEngine.getStatistics();
        var availableModels = neuralOrchestrationEngine.getAvailableModelTypes();
        res.json({
            status: 'active',
            statistics: stats,
            availableModels: availableModels,
            createdAt: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Error getting NOE status:', error);
        res.status(500).json({ error: 'Failed to get Neural Orchestration Engine status' });
    }
});
// Import the System Integration Adapter
import { systemIntegrationAdapter } from '../services/SystemIntegrationAdapter.js';
// POST /api/neural-orchestrator/models/initialize
// Initialize a specific AI model agent
router.post('/models/initialize', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var requestBody, validation, _a, modelType, apiKey, systemStability, nodeSynergy, globalCoherence, result, broadcastSystemStatus, error_1;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                requestBody = __assign({}, req.body);
                if (requestBody.modelType && typeof requestBody.modelType === 'string') {
                    // Try to normalize model type if it contains underscores
                    requestBody.modelType = requestBody.modelType.replace(/_/g, '-');
                }
                validation = modelInitializeSchema.safeParse(requestBody);
                if (!validation.success) {
                    return [2 /*return*/, res.status(400).json({ error: validation.error.message })];
                }
                _a = validation.data, modelType = _a.modelType, apiKey = _a.apiKey, systemStability = _a.systemStability, nodeSynergy = _a.nodeSynergy, globalCoherence = _a.globalCoherence;
                return [4 /*yield*/, systemIntegrationAdapter.initializeModel(modelType, apiKey, {
                        systemStability: systemStability,
                        nodeSynergy: nodeSynergy,
                        globalCoherence: globalCoherence
                    })];
            case 1:
                result = _d.sent();
                if (!result.success) {
                    return [2 /*return*/, res.status(500).json({
                            error: 'Failed to initialize model agent',
                            details: result.error
                        })];
                }
                return [4 /*yield*/, import('../services/events.js')];
            case 2:
                broadcastSystemStatus = (_d.sent()).broadcastSystemStatus;
                // Broadcast the system status update to all clients
                broadcastSystemStatus();
                // Log to meta-cognitive system using the builder pattern
                return [4 /*yield*/, metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("model-initialized")
                        .withCreatedAt(new Date())
                        .withDescription("Model ".concat(modelType, " initialized"))
                        .withDetails({
                        modelType: modelType,
                        unified: true,
                        createdAt: new Date(),
                        hasApiKey: !!apiKey,
                        systemMetrics: {
                            systemStability: systemStability || null,
                            nodeSynergy: nodeSynergy || null,
                            globalCoherence: globalCoherence || null
                        },
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(1.0)
                        .withImpact(7)
                        .withRelatedEvents([]) // Builder handles empty array conversion
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'initialize-model'
                    })
                        .build())];
            case 3:
                // Log to meta-cognitive system using the builder pattern
                _d.sent();
                res.status(200).json({
                    success: true,
                    modelType: modelType,
                    status: (_b = result.model) === null || _b === void 0 ? void 0 : _b.status,
                    initialized: (_c = result.model) === null || _c === void 0 ? void 0 : _c.initialized
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _d.sent();
                console.error('Error initializing model:', error_1);
                res.status(500).json({ error: 'Failed to initialize model agent' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// GET /api/neural-orchestrator/models
// Get all available models and their capabilities
router.get('/models', function (req, res) {
    try {
        var models = neuralOrchestrationEngine.getAvailableModelTypes();
        var modelsWithCapabilities = models.map(function (modelType) {
            return {
                modelType: modelType,
                capabilities: neuralOrchestrationEngine.getModelCapabilities(modelType)
            };
        });
        res.json(modelsWithCapabilities);
    }
    catch (error) {
        console.error('Error getting models:', error);
        res.status(500).json({ error: 'Failed to get available models' });
    }
});
// GET /api/neural-orchestrator/models/:modelType/performance
// Get the performance profile for a specific model
router.get('/models/:modelType/performance', function (req, res) {
    try {
        // Convert model type from underscore to hyphen format if needed
        var normalizedModelType = req.params.modelType;
        if (normalizedModelType && typeof normalizedModelType === 'string') {
            // Try to normalize model type if it contains underscores
            normalizedModelType = normalizedModelType.replace(/_/g, '-');
        }
        // Validate model type
        if (!Object.values(ModelType).includes(normalizedModelType)) {
            return res.status(400).json({ error: 'Invalid model type' });
        }
        var profile = modelStrengthAnalyzer.getModelPerformanceProfile(normalizedModelType);
        res.json(profile);
    }
    catch (error) {
        console.error('Error getting model performance:', error);
        res.status(500).json({ error: 'Failed to get model performance profile' });
    }
});
// POST /api/neural-orchestrator/models/:modelType/benchmarks
// Run benchmarks for a specific model
router.post('/models/:modelType/benchmarks', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var normalizedModelType, validation, _a, validatedModelType_1, benchmarkId, availableModels, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                normalizedModelType = req.params.modelType;
                if (normalizedModelType && typeof normalizedModelType === 'string') {
                    // Try to normalize model type if it contains underscores
                    normalizedModelType = normalizedModelType.replace(/_/g, '-');
                }
                validation = benchmarkRunSchema.safeParse(__assign(__assign({}, req.body), { modelType: normalizedModelType }));
                if (!validation.success) {
                    return [2 /*return*/, res.status(400).json({ error: validation.error.message })];
                }
                _a = validation.data, validatedModelType_1 = _a.modelType, benchmarkId = _a.benchmarkId;
                availableModels = neuralOrchestrationEngine.getAvailableModelTypes();
                if (!availableModels.includes(validatedModelType_1)) {
                    return [2 /*return*/, res.status(400).json({ error: 'Model not initialized. Please initialize the model first.' })];
                }
                // Log to meta-cognitive system using the builder pattern
                return [4 /*yield*/, metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("benchmark-started")
                        .withCreatedAt(new Date())
                        .withDescription("Benchmark started for model ".concat(validatedModelType_1))
                        .withDetails({
                        modelType: validatedModelType_1,
                        benchmarkId: benchmarkId,
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(1.0)
                        .withImpact(6)
                        .withRelatedEvents([]) // Builder handles empty array conversion
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'run-benchmark'
                    })
                        .build())];
            case 1:
                // Log to meta-cognitive system using the builder pattern
                _b.sent();
                // Run the benchmarks (asynchronously)
                modelStrengthAnalyzer.runBenchmarksForModel(validatedModelType_1)
                    .then(function (results) {
                    console.log("Completed ".concat(results.length, " benchmarks for ").concat(validatedModelType_1));
                    // Log completion to meta-cognitive system using the builder pattern
                    metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("benchmark-completed")
                        .withCreatedAt(new Date())
                        .withDescription("Benchmark completed for model ".concat(validatedModelType_1))
                        .withDetails({
                        modelType: validatedModelType_1,
                        benchmarkCount: results.length,
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(1.0)
                        .withImpact(6)
                        .withRelatedEvents([]) // Builder handles empty array conversion
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'run-benchmark-complete'
                    })
                        .build());
                })
                    .catch(function (err) {
                    console.error("Error running benchmarks for ".concat(validatedModelType_1, ":"), err);
                    // Log error to meta-cognitive system using the builder pattern
                    metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("error")
                        .withCreatedAt(new Date())
                        .withDescription("Error running benchmarks for model ".concat(validatedModelType_1))
                        .withDetails({
                        modelType: validatedModelType_1,
                        error: err.message,
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(1.0)
                        .withImpact(8)
                        .withRelatedEvents([]) // Builder handles empty array conversion
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'run-benchmark-error'
                    })
                        .build());
                });
                res.status(202).json({
                    message: 'Benchmark execution started',
                    modelType: validatedModelType_1
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Error running benchmarks:', error_2);
                res.status(500).json({ error: 'Failed to run benchmarks' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/neural-orchestrator/tasks
// Create and execute a new task
router.post('/tasks', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validation, taskData, metadata, task_1, taskRequest, processPromise, routingMode_1, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validation = taskCreateSchema.safeParse(req.body);
                if (!validation.success) {
                    return [2 /*return*/, res.status(400).json({ error: validation.error.message })];
                }
                taskData = validation.data;
                metadata = {};
                if (taskData.deadline) {
                    metadata.deadline = new Date(taskData.deadline);
                }
                // Add multimodal content if provided
                if (taskData.multimodalContent) {
                    metadata.multimodalContent = taskData.multimodalContent;
                }
                task_1 = neuralOrchestrationEngine.createTask({
                    prompt: taskData.prompt,
                    requirements: taskData.requirements,
                    priority: taskData.priority,
                    deadline: taskData.deadline ? new Date(taskData.deadline) : undefined,
                    multimodalContent: taskData.multimodalContent
                });
                taskRequest = {
                    id: task_1.id,
                    type: taskData.requirements.taskType,
                    prompt: taskData.prompt,
                    requirements: taskData.requirements,
                    priority: taskData.priority,
                    metadata: {
                        deadline: taskData.deadline ? new Date(taskData.deadline) : undefined,
                        multimodalContent: taskData.multimodalContent,
                        isAdvancedRouting: taskData.requirements.enableAdvancedRouting
                    }
                };
                processPromise = systemIntegrationAdapter.processTask(taskRequest);
                // Log to meta-cognitive system using the builder pattern
                return [4 /*yield*/, metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("task-created")
                        .withCreatedAt(new Date())
                        .withDescription("Task created: ".concat(task_1.id))
                        .withDetails({
                        taskId: task_1.id,
                        taskType: taskData.requirements.taskType,
                        priority: taskData.priority,
                        unified: true,
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(1.0)
                        .withImpact(5)
                        .withRelatedEvents([]) // Builder handles empty array conversion
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'create-task'
                    })
                        .build())];
            case 1:
                // Log to meta-cognitive system using the builder pattern
                _a.sent();
                routingMode_1 = taskData.requirements.enableAdvancedRouting ? 'advanced' : 'standard';
                // Process the task asynchronously
                processPromise
                    .then(function (result) {
                    console.log("Task ".concat(task_1.id, " processed successfully with ").concat(routingMode_1, " routing"));
                })
                    .catch(function (err) {
                    console.error("Error processing task ".concat(task_1.id, ":"), err);
                });
                res.status(202).json({
                    message: "Task created and execution started with ".concat(routingMode_1, " routing"),
                    taskId: task_1.id,
                    routingMode: routingMode_1,
                    unifiedProcessing: true
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error creating task:', error_3);
                res.status(500).json({ error: 'Failed to create and execute task' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/neural-orchestrator/tasks
// Get all tasks, optionally filtered by status
router.get('/tasks', function (req, res) {
    try {
        var status_1 = req.query.status;
        if (status_1 && !['pending', 'analyzing', 'executing', 'completed', 'failed'].includes(status_1)) {
            return res.status(400).json({ error: 'Invalid status filter' });
        }
        // Fix: Get all tasks from the Neural Orchestration Engine
        var tasks = status_1
            ? neuralOrchestrationEngine.getTasksByStatus(status_1)
            : neuralOrchestrationEngine.getAllTasks();
        // Always return an array, even if empty
        res.json(tasks || []);
    }
    catch (error) {
        console.error('Error getting tasks:', error);
        // Return an empty array even on error to prevent client-side issues
        res.status(200).json([]);
    }
});
// GET /api/neural-orchestrator/chunks
// Get all chunks, optionally filtered by taskId or state
router.get('/chunks', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var taskId_1, state_1, allChunks, chunkResults, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 5]);
                taskId_1 = req.query.taskId;
                state_1 = req.query.state;
                // Validate state if provided
                if (state_1 && !['pending', 'processing', 'completed', 'error'].includes(state_1)) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid state filter' })];
                }
                return [4 /*yield*/, storage.getAllChunks()];
            case 1:
                allChunks = _a.sent();
                chunkResults = allChunks.filter(function (chunk) {
                    if (taskId_1 && chunk.parentTaskId !== taskId_1)
                        return false;
                    if (state_1 && chunk.chunkState !== state_1)
                        return false;
                    return true;
                });
                // Log success to meta-cognitive system using the builder pattern
                return [4 /*yield*/, metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("chunks-retrieved")
                        .withCreatedAt(new Date())
                        .withDescription("Retrieved ".concat(chunkResults.length, " chunks").concat(taskId_1 ? " for task ".concat(taskId_1) : ''))
                        .withDetails({
                        count: chunkResults.length,
                        taskId: taskId_1 || null,
                        state: state_1 || null,
                        unified: true,
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(1.0)
                        .withImpact(3)
                        .withRelatedEvents([]) // Builder handles empty array conversion
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'get-chunks'
                    })
                        .build())];
            case 2:
                // Log success to meta-cognitive system using the builder pattern
                _a.sent();
                // Always return an array, even if empty
                res.json(chunkResults || []);
                return [3 /*break*/, 5];
            case 3:
                error_4 = _a.sent();
                console.error('Error getting chunks:', error_4);
                // Log error to meta-cognitive system using the builder pattern
                return [4 /*yield*/, metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("error")
                        .withCreatedAt(new Date())
                        .withDescription("Error retrieving chunks: ".concat(error_4.message))
                        .withDetails({
                        error: error_4.message,
                        stack: error_4.stack,
                        operation: 'get-chunks',
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(1.0)
                        .withImpact(7)
                        .withRelatedEvents([]) // Builder handles empty array conversion
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'get-chunks-error'
                    })
                        .build())];
            case 4:
                // Log error to meta-cognitive system using the builder pattern
                _a.sent();
                // Return an empty array even on error to prevent client-side issues
                res.status(200).json([]);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// GET /api/neural-orchestrator/chunks/:chunkId
// Get a specific chunk by ID
router.get('/chunks/:chunkId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var chunkId, chunk, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 5]);
                chunkId = req.params.chunkId;
                return [4 /*yield*/, storage.getChunk(chunkId)];
            case 1:
                chunk = _a.sent();
                if (!chunk) {
                    return [2 /*return*/, res.status(404).json({ error: 'Chunk not found' })];
                }
                // Log success to meta-cognitive system using the builder pattern
                return [4 /*yield*/, metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("chunk-retrieved")
                        .withCreatedAt(new Date())
                        .withDescription("Retrieved chunk ".concat(chunkId))
                        .withDetails({
                        chunkId: chunkId,
                        taskId: chunk.parentTaskId,
                        state: chunk.chunkState, // Changed from state to chunkState
                        unified: true,
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(1.0)
                        .withImpact(2)
                        .withRelatedEvents([]) // Builder handles empty array conversion
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'get-chunk-by-id'
                    })
                        .build())];
            case 2:
                // Log success to meta-cognitive system using the builder pattern
                _a.sent();
                res.json(chunk);
                return [3 /*break*/, 5];
            case 3:
                error_5 = _a.sent();
                console.error("Error getting chunk ".concat(req.params.chunkId, ":"), error_5);
                // Log error to meta-cognitive system using the builder pattern
                return [4 /*yield*/, metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("error")
                        .withCreatedAt(new Date())
                        .withDescription("Error retrieving chunk: ".concat(error_5.message))
                        .withDetails({
                        error: error_5.message,
                        stack: error_5.stack,
                        chunkId: req.params.chunkId,
                        operation: 'get-chunk-by-id',
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(1.0)
                        .withImpact(6)
                        .withRelatedEvents([]) // Builder handles empty array conversion
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'get-chunk-by-id-error'
                    })
                        .build())];
            case 4:
                // Log error to meta-cognitive system using the builder pattern
                _a.sent();
                res.status(500).json({ error: 'Failed to get chunk' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// POST /api/neural-orchestrator/chunks
// Create a new chunk
router.post('/chunks', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, parentTaskId, content, order, modelType, boundaries, metadata, chunkId, now, contentLength, initialMetrics, newChunk, allTaskChunks, chunkCount, synBroadcastChunkCreate, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 7]);
                _a = req.body, parentTaskId = _a.parentTaskId, content = _a.content, order = _a.order, modelType = _a.modelType, boundaries = _a.boundaries, metadata = _a.metadata;
                if (!parentTaskId || !content) {
                    return [2 /*return*/, res.status(400).json({ error: 'parentTaskId and content are required' })];
                }
                chunkId = uuidv4();
                now = new Date();
                contentLength = content.length;
                initialMetrics = {
                    semanticCoherence: Math.random() * 0.5 + 0.5, // Random value between 0.5 and 1
                    contextDependency: Math.random() * 0.5, // Random value between 0 and 0.5
                    conceptualDensity: Math.random() * 0.7 + 0.3, // Random value between 0.3 and 1
                    microMacroBalance: 0.5, // Default balanced
                    decompositionQuality: Math.random() * 0.5 + 0.5, // Random value between 0.5 and 1
                    distributionSuitability: Math.random() * 0.5 + 0.5, // Random value between 0.5 and 1
                    recompositionPotential: Math.random() * 0.5 + 0.5 // Random value between 0.5 and 1
                };
                newChunk = {
                    id: chunkId,
                    parentTaskId: parentTaskId,
                    originalContent: content,
                    chunkIndex: order || 0,
                    totalChunks: 1, // Will be updated later if needed
                    chunkSize: contentLength,
                    chunkState: 'pending',
                    createdAt: now,
                    updatedAt: now,
                    processedContent: null,
                    embedding: null, // Will be populated later if needed
                    metadata: __assign(__assign({ semanticCoherence: initialMetrics.semanticCoherence, contextDependency: initialMetrics.contextDependency, conceptualDensity: initialMetrics.conceptualDensity, microMacroBalance: initialMetrics.microMacroBalance, decompositionQuality: initialMetrics.decompositionQuality, distributionSuitability: initialMetrics.distributionSuitability, recompositionPotential: initialMetrics.recompositionPotential }, (metadata || {})), { modelType: modelType || null, boundaries: boundaries || {
                            start: 0,
                            end: contentLength
                        } })
                };
                // Store the chunk using MemStorage
                return [4 /*yield*/, storage.createChunk(newChunk)];
            case 1:
                // Store the chunk using MemStorage
                _b.sent();
                return [4 /*yield*/, storage.getAllChunks(undefined, { parentTaskId: parentTaskId })];
            case 2:
                allTaskChunks = _b.sent();
                chunkCount = allTaskChunks.length;
                // Log success to meta-cognitive system using the builder pattern
                return [4 /*yield*/, metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("chunk-created")
                        .withCreatedAt(new Date())
                        .withDescription("Created new chunk ".concat(chunkId, " for task ").concat(parentTaskId))
                        .withDetails({
                        chunkId: chunkId,
                        taskId: parentTaskId,
                        contentLength: contentLength,
                        chunkCount: chunkCount,
                        metrics: initialMetrics,
                        unified: true,
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(1.0)
                        .withImpact(5)
                        .withRelatedEvents([]) // Builder handles empty array conversion
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'create-chunk'
                    })
                        .build())];
            case 3:
                // Log success to meta-cognitive system using the builder pattern
                _b.sent();
                return [4 /*yield*/, import('../routes.js')];
            case 4:
                synBroadcastChunkCreate = (_b.sent()).synBroadcastChunkCreate;
                synBroadcastChunkCreate(newChunk);
                res.status(201).json({
                    message: 'Chunk created successfully',
                    chunk: newChunk
                });
                return [3 /*break*/, 7];
            case 5:
                error_6 = _b.sent();
                console.error('Error creating chunk:', error_6);
                // Log error to meta-cognitive system using the builder pattern
                return [4 /*yield*/, metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("error")
                        .withCreatedAt(new Date())
                        .withDescription("Error creating chunk: ".concat(error_6.message))
                        .withDetails({
                        error: error_6.message,
                        stack: error_6.stack,
                        operation: 'create-chunk',
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(1.0)
                        .withImpact(7)
                        .withRelatedEvents([]) // Builder handles empty array conversion
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'create-chunk-error'
                    })
                        .build())];
            case 6:
                // Log error to meta-cognitive system using the builder pattern
                _b.sent();
                res.status(500).json({ error: 'Failed to create chunk' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// GET /api/neural-orchestrator/tasks/:taskId
// Get a specific task by ID
router.get('/tasks/:taskId', function (req, res) {
    try {
        var taskId = req.params.taskId;
        var task = neuralOrchestrationEngine.getTask(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    }
    catch (error) {
        console.error('Error getting task:', error);
        res.status(500).json({ error: 'Failed to get task' });
    }
});
// POST /api/neural-orchestrator/tasks/:taskId/ensemble
// Create and execute an ensemble plan for an existing task
router.post('/tasks/:taskId/ensemble', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var taskId, task_2, executionPlan, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                taskId = req.params.taskId;
                task_2 = neuralOrchestrationEngine.getTask(taskId);
                if (!task_2) {
                    return [2 /*return*/, res.status(404).json({ error: 'Task not found' })];
                }
                if (task_2.status === 'completed' || task_2.status === 'failed') {
                    return [2 /*return*/, res.status(422).json({
                            error: 'Task already completed or failed',
                            status: task_2.status
                        })];
                }
                executionPlan = neuralOrchestrationEngine.createEnsembleExecutionPlan(task_2, {
                    parallelExecution: true, // Enable parallel processing
                    includeAllModels: req.body.includeAllModels || false,
                    weightByPerformance: req.body.weightByPerformance || true,
                    minimumModelConfidence: req.body.minimumModelConfidence || 0.6
                });
                if (!executionPlan || executionPlan.steps.length === 0) {
                    return [2 /*return*/, res.status(422).json({
                            error: 'Failed to create ensemble execution plan',
                            details: 'No suitable models available or task not supported for ensemble execution'
                        })];
                }
                // Log to meta-cognitive system using the builder pattern
                // EXPLICIT BOUNDARY: Event creation and processing begins here
                return [4 /*yield*/, metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("ensemble-plan-created")
                        .withCreatedAt(new Date())
                        .withDescription("Ensemble execution plan created for task ".concat(task_2.id))
                        .withDetails({
                        taskId: task_2.id,
                        executionPlanId: executionPlan.id,
                        modelCount: executionPlan.steps.length,
                        parallelExecution: executionPlan.parallelExecution,
                        taskType: task_2.requirements.taskType,
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(0.9)
                        .withImpact(7)
                        .withRelatedEvents([]) // Builder handles empty array conversion to 'none'
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'create-ensemble-plan'
                    }) // Converts to "api:create-ensemble-plan"
                        .build())];
            case 1:
                // Log to meta-cognitive system using the builder pattern
                // EXPLICIT BOUNDARY: Event creation and processing begins here
                _a.sent();
                // Execute the ensemble plan asynchronously
                neuralOrchestrationEngine.executeEnsemblePlan(executionPlan)
                    .then(function (result) {
                    console.log("Ensemble plan for task ".concat(task_2.id, " executed successfully"));
                })
                    .catch(function (err) {
                    console.error("Error executing ensemble plan for task ".concat(task_2.id, ":"), err);
                });
                res.status(202).json({
                    message: 'Ensemble execution plan created and execution started',
                    taskId: task_2.id,
                    executionPlanId: executionPlan.id,
                    modelCount: executionPlan.steps.length,
                    parallelExecution: executionPlan.parallelExecution
                });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error creating ensemble execution plan:', error_7);
                res.status(500).json({ error: 'Failed to create and execute ensemble plan' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/neural-orchestrator/tasks/:taskId/result
// Get the result of a specific task
router.get('/tasks/:taskId/result', function (req, res) {
    try {
        var taskId = req.params.taskId;
        var task = neuralOrchestrationEngine.getTask(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        if (task.status !== 'completed') {
            return res.status(422).json({
                error: 'Task not completed',
                status: task.status
            });
        }
        // Find the result for this task
        var result = neuralOrchestrationEngine.getTaskResult(taskId);
        if (!result) {
            return res.status(404).json({ error: 'Task result not found' });
        }
        // Return the actual result with all its properties
        // Ensure timestamp is formatted as ISO string for consistent date handling
        res.json({
            taskId: result.taskId,
            output: result.output,
            completedAt: result.timestamp.toISOString(),
            executionTime: result.executionTime,
            model: result.modelUsed ? result.modelUsed.join(', ') : 'Unknown'
        });
    }
    catch (error) {
        console.error('Error getting task result:', error);
        res.status(500).json({ error: 'Failed to get task result' });
    }
});
// GET /api/neural-orchestrator/benchmarks
// Get all available benchmarks
router.get('/benchmarks', function (req, res) {
    try {
        var benchmarks = modelStrengthAnalyzer.getAllBenchmarkTasks();
        res.json(benchmarks);
    }
    catch (error) {
        console.error('Error getting benchmarks:', error);
        res.status(500).json({ error: 'Failed to get benchmarks' });
    }
});
// GET /api/neural-orchestrator/task-types
// Get all task types and their descriptions
router.get('/task-types', function (req, res) {
    try {
        // Create a map of task types with descriptions
        var taskTypes = Object.keys(TaskType)
            .filter(function (key) { return isNaN(Number(key)); }) // Filter out numeric keys
            .map(function (key) {
            return {
                type: key,
                value: TaskType[key],
                description: getTaskTypeDescription(TaskType[key])
            };
        });
        res.json(taskTypes);
    }
    catch (error) {
        console.error('Error getting task types:', error);
        res.status(500).json({ error: 'Failed to get task types' });
    }
});
// POST /api/neural-orchestrator/tasks/:taskId/decompose
// Decompose a complex task into subtasks without execution
router.post('/tasks/:taskId/decompose', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var taskId, task, modifiedTask, subtasks, subtaskData, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                taskId = req.params.taskId;
                task = neuralOrchestrationEngine.getTask(taskId);
                if (!task) {
                    return [2 /*return*/, res.status(404).json({ error: 'Task not found' })];
                }
                if (task.status === 'completed' || task.status === 'failed') {
                    return [2 /*return*/, res.status(422).json({
                            error: 'Task already completed or failed',
                            status: task.status
                        })];
                }
                modifiedTask = __assign(__assign({}, task), { requirements: __assign(__assign({}, task.requirements), { complexity: Math.max(task.requirements.complexity, 7) // Ensure complexity is at least 7 for decomposition
                     }) });
                subtasks = neuralOrchestrationEngine.decomposeComplexTask(modifiedTask);
                if (subtasks.length <= 1) {
                    return [2 /*return*/, res.status(422).json({
                            error: 'Task decomposition failed',
                            details: 'Unable to decompose the task into subtasks'
                        })];
                }
                // Log to meta-cognitive system using the builder pattern
                // EXPLICIT BOUNDARY: Event creation and processing begins here
                return [4 /*yield*/, metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("task-decomposed")
                        .withCreatedAt(new Date())
                        .withDescription("Task ".concat(task.id, " decomposed into ").concat(subtasks.length, " subtasks"))
                        .withDetails({
                        taskId: task.id,
                        subtaskCount: subtasks.length,
                        taskType: task.requirements.taskType,
                        complexityReduction: task.requirements.complexity - subtasks[0].requirements.complexity,
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(0.9)
                        .withImpact(7)
                        .withRelatedEvents([]) // Builder handles empty array conversion to 'none'
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'decompose-task'
                    }) // Converts to "api:decompose-task"
                        .build())];
            case 1:
                // Log to meta-cognitive system using the builder pattern
                // EXPLICIT BOUNDARY: Event creation and processing begins here
                _a.sent();
                subtaskData = subtasks.map(function (subtask) { return ({
                    id: subtask.id,
                    prompt: subtask.prompt.substring(0, 100) + (subtask.prompt.length > 100 ? '...' : ''),
                    taskType: subtask.requirements.taskType,
                    complexity: subtask.requirements.complexity,
                    priority: subtask.priority,
                    isSubtask: subtask.isSubtask,
                    parentTaskId: subtask.parentTaskId,
                    status: subtask.status
                }); });
                res.json({
                    taskId: task.id,
                    originalComplexity: task.requirements.complexity,
                    subtaskCount: subtasks.length,
                    subtasks: subtaskData,
                    createdAt: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error('Error decomposing task:', error_8);
                res.status(500).json({ error: 'Failed to decompose task' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/neural-orchestrator/task-allocation
// Test dynamic task allocation without executing a task
router.post('/task-allocation', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validation, requirements, recommendations, useEnsemble, error_9;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                validation = taskRequirementsSchema.safeParse(req.body);
                if (!validation.success) {
                    return [2 /*return*/, res.status(400).json({ error: validation.error.message })];
                }
                requirements = validation.data;
                // Ensure criteria importance is populated if not provided
                if (Object.keys(requirements.criteriaImportance).length === 0) {
                    // Default to valuing accuracy highly for most tasks
                    requirements.criteriaImportance = (_a = {},
                        _a[EvaluationCriteria.ACCURACY] = 0.9,
                        _a[EvaluationCriteria.INSTRUCTION_FOLLOWING] = 0.8,
                        _a[EvaluationCriteria.DETAIL] = 0.7,
                        _a[EvaluationCriteria.CONTEXT_AWARENESS] = 0.6,
                        _a[EvaluationCriteria.CONSISTENCY] = 0.6,
                        _a[EvaluationCriteria.SPEED] = 0.5,
                        _a);
                    // For creative tasks, adjust importance
                    if (requirements.taskType === TaskType.CREATIVE_WRITING ||
                        requirements.taskType === TaskType.POETRY ||
                        requirements.taskType === TaskType.STORY_TELLING) {
                        requirements.criteriaImportance[EvaluationCriteria.CREATIVITY] = 0.9;
                        requirements.criteriaImportance[EvaluationCriteria.ENGAGEMENT] = 0.8;
                    }
                }
                recommendations = neuralOrchestrationEngine.getModelRecommendations(requirements);
                useEnsemble = neuralOrchestrationEngine.shouldUseEnsemble(requirements, recommendations);
                // Log the allocation test event using the builder pattern
                // EXPLICIT BOUNDARY: Event creation and processing begins here
                return [4 /*yield*/, metaCognitiveEngine.processEvent(new MetaCognitiveEventBuilder()
                        .withId(uuidv4())
                        .withNodeId(uuidv4())
                        .withType("task-allocation-test")
                        .withCreatedAt(new Date())
                        .withDescription("Task allocation test for ".concat(requirements.taskType))
                        .withDetails({
                        requirements: requirements,
                        recommendationCount: recommendations.length,
                        topRecommendation: recommendations.length > 0 ? recommendations[0].modelType : null,
                        useEnsemble: useEnsemble,
                        processingTime: null // Now included in details instead
                    })
                        .withConfidence(recommendations.length > 0 ? recommendations[0].confidence : 0.5)
                        .withImpact(4)
                        .withRelatedEvents([]) // Builder handles empty array conversion to 'none'
                        .withOutcome(undefined)
                        .withSourceContext({
                        source: 'api',
                        operation: 'task-allocation-test'
                    }) // Converts to "api:task-allocation-test"
                        .build())];
            case 1:
                // Log the allocation test event using the builder pattern
                // EXPLICIT BOUNDARY: Event creation and processing begins here
                _b.sent();
                // Return the task allocation analysis
                res.json({
                    taskType: requirements.taskType,
                    recommendations: recommendations,
                    useEnsemble: useEnsemble,
                    ensembleReason: useEnsemble ? determineEnsembleReason(requirements, recommendations) : null,
                    createdAt: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _b.sent();
                console.error('Error in task allocation test:', error_9);
                res.status(500).json({ error: 'Failed to test task allocation' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Helper function to determine ensemble reason
function determineEnsembleReason(requirements, recommendations) {
    if (requirements.complexity > 8) {
        return "High task complexity requires multiple models";
    }
    if (requirements.qualityThreshold && requirements.qualityThreshold > 0.9) {
        return "High quality threshold requires ensemble approach";
    }
    if (recommendations[0].confidence < 0.8) {
        return "Low confidence in primary model recommendation";
    }
    if (recommendations.length >= 2) {
        var scoreDifference = recommendations[0].score - recommendations[1].score;
        if (scoreDifference < 0.5) {
            return "Close performance scores between top models";
        }
    }
    if (requirements.domainSpecificity > 8) {
        return "Highly domain-specific task requires specialized model combination";
    }
    return "Multiple factors requiring ensemble approach";
}
// GET /api/neural-orchestrator/evaluation-criteria
// Get all evaluation criteria and their descriptions
router.get('/evaluation-criteria', function (req, res) {
    try {
        // Create a map of evaluation criteria with descriptions
        var criteria = Object.keys(EvaluationCriteria)
            .filter(function (key) { return isNaN(Number(key)); }) // Filter out numeric keys
            .map(function (key) {
            return {
                name: key,
                value: EvaluationCriteria[key],
                description: getEvaluationCriteriaDescription(EvaluationCriteria[key])
            };
        });
        res.json(criteria);
    }
    catch (error) {
        console.error('Error getting evaluation criteria:', error);
        res.status(500).json({ error: 'Failed to get evaluation criteria' });
    }
});
// Helper function to get task type descriptions
function getTaskTypeDescription(taskType) {
    var _a;
    var descriptions = (_a = {},
        _a[TaskType.TEXT_GENERATION] = 'Generate natural language text based on a prompt',
        _a[TaskType.CODE_GENERATION] = 'Write code in a specified programming language',
        _a[TaskType.REASONING] = 'Use logical reasoning to solve problems or answer questions',
        _a[TaskType.SUMMARIZATION] = 'Create concise summaries of longer texts',
        _a[TaskType.TRANSLATION] = 'Translate text from one language to another',
        _a[TaskType.CREATIVE_WRITING] = 'Generate creative content like stories or articles',
        _a[TaskType.POETRY] = 'Create poems in various styles and formats',
        _a[TaskType.STORY_TELLING] = 'Craft narrative stories with characters and plot',
        _a[TaskType.MATHEMATICS] = 'Solve mathematical problems and equations',
        _a[TaskType.SCIENTIFIC_ANALYSIS] = 'Analyze scientific data or concepts',
        _a[TaskType.DOMAIN_SPECIFIC] = 'Tasks within a specific knowledge domain or field',
        _a[TaskType.IMAGE_UNDERSTANDING] = 'Comprehend and describe the content of images',
        _a[TaskType.AUDIO_UNDERSTANDING] = 'Process and analyze audio content',
        _a[TaskType.INSTRUCTION_FOLLOWING] = 'Follow complex multi-step instructions precisely',
        _a[TaskType.TOOL_USAGE] = 'Use external tools and APIs to accomplish tasks',
        _a[TaskType.PLANNING] = 'Create structured plans to achieve objectives',
        _a[TaskType.META_COGNITION] = 'Reflect on reasoning processes and improve them',
        _a);
    return descriptions[taskType] || 'No description available';
}
// Helper function to get evaluation criteria descriptions
function getEvaluationCriteriaDescription(criterion) {
    var _a;
    var descriptions = (_a = {},
        _a[EvaluationCriteria.ACCURACY] = 'Correctness and factual validity of the output',
        _a[EvaluationCriteria.CREATIVITY] = 'Originality and novelty of ideas in the output',
        _a[EvaluationCriteria.SPEED] = 'Processing time and response latency',
        _a[EvaluationCriteria.CONSISTENCY] = 'Reliability and predictability of outputs',
        _a[EvaluationCriteria.DETAIL] = 'Level of specific information and elaboration provided',
        _a[EvaluationCriteria.FORMAT_ADHERENCE] = 'Compliance with requested output formats',
        _a[EvaluationCriteria.CONTEXT_AWARENESS] = 'Understanding and incorporating contextual information',
        _a[EvaluationCriteria.INSTRUCTION_FOLLOWING] = 'Ability to precisely follow given instructions',
        _a[EvaluationCriteria.REASONING] = 'Quality of logical thought processes and deductions',
        _a[EvaluationCriteria.BREVITY] = 'Conciseness and efficiency of expression',
        _a[EvaluationCriteria.TOOL_USAGE] = 'Effectiveness in using external tools and APIs',
        _a[EvaluationCriteria.EFFICIENCY] = 'Computational efficiency and resource usage',
        _a[EvaluationCriteria.CODE_QUALITY] = 'Clarity, organization, and maintainability of code',
        _a[EvaluationCriteria.EXPLANATION] = 'Quality of explanations for reasoning or methods',
        _a[EvaluationCriteria.COHERENCE] = 'Logical flow and connectedness of ideas',
        _a[EvaluationCriteria.ENGAGEMENT] = 'Ability to maintain reader interest and attention',
        _a[EvaluationCriteria.ADHERENCE_TO_CONSTRAINTS] = 'Following specific requirements or limitations',
        _a[EvaluationCriteria.SIMPLIFICATION] = 'Ability to make complex concepts understandable',
        _a[EvaluationCriteria.CLARITY] = 'Clear and unambiguous communication',
        _a[EvaluationCriteria.COMPLETENESS] = 'Comprehensive coverage of all relevant aspects',
        _a);
    return descriptions[criterion] || 'No description available';
}
