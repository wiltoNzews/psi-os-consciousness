/**
 * System Integration Adapter
 *
 * This module serves as the central hub for coordinating communication between
 * all components of the Neural-Symbiotic Orchestration Platform. It ensures that
 * the Meta-Cognitive Analysis Engine, QRN Context Manager, Neural Orchestration Engine,
 * and Adaptive Resonance Service all operate as a single unified system.
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
import { metaCognitiveEngine } from './qrn/index.js';
import { neuralOrchestrationEngine } from './neural-orchestrator/neural-orchestration-engine.js';
import { adaptiveResonanceService } from './qrn/adaptive-resonance-service.js';
import { ModelType } from './neural-orchestrator/model-strength-analyzer.js';
import { createModelAgent } from './neural-orchestrator/model-agents.js';
import * as openaiService from './openai.js';
import { log } from '../vite.js';
import { v4 as uuidv4 } from 'uuid';
var eventBus = new Map();
var SystemIntegrationAdapter = /** @class */ (function () {
    function SystemIntegrationAdapter() {
        this.activeQrnId = null;
        this.systemState = {
            status: 'initialized',
            components: {
                metaCognitiveEngine: 'ready',
                neuralOrchestrationEngine: 'ready',
                qrnContextManager: 'ready',
                adaptiveResonanceService: 'ready'
            },
            activeModels: [],
            metrics: {
                resonanceScore: 0,
                stabilityScore: 0,
                coherenceIndex: 0,
                adaptiveEfficency: 0
            },
            lastUpdated: new Date()
        };
        // Initialize component connections
        this.initializeComponentConnections();
    }
    SystemIntegrationAdapter.getInstance = function () {
        if (!SystemIntegrationAdapter.instance) {
            SystemIntegrationAdapter.instance = new SystemIntegrationAdapter();
        }
        return SystemIntegrationAdapter.instance;
    };
    /**
     * Initialize connections between all system components
     */
    SystemIntegrationAdapter.prototype.initializeComponentConnections = function () {
        var _this = this;
        // Subscribe to meta-cognitive events
        this.subscribe('meta-cognitive-event', function (event) {
            // Update system state with the latest meta-cognitive event
            _this.systemState.lastMetaCognitiveEvent = event;
            _this.systemState.lastUpdated = new Date();
            // Propagate the event to neural orchestration engine for potential actions
            _this.emit('neural-orchestration-update', {
                type: 'meta-cognitive-event',
                data: event
            });
        });
        // Subscribe to neural pathway updates
        this.subscribe('neural-pathway-update', function (pathway) {
            // Update system state with the latest neural pathway information
            if (!_this.systemState.activePaths) {
                _this.systemState.activePaths = [];
            }
            var existingIndex = _this.systemState.activePaths.findIndex(function (p) { return p.id === pathway.id; });
            if (existingIndex >= 0) {
                _this.systemState.activePaths[existingIndex] = pathway;
            }
            else {
                _this.systemState.activePaths.push(pathway);
            }
            _this.systemState.lastUpdated = new Date();
            // Notify meta-cognitive engine about the neural pathway update
            _this.emit('meta-cognitive-update', {
                type: 'neural-pathway-change',
                data: pathway
            });
        });
        // Subscribe to QRN updates
        this.subscribe('qrn-update', function (node) {
            // Update system state with the latest QRN information
            _this.systemState.activeQrn = node;
            _this.activeQrnId = node.id;
            _this.systemState.lastUpdated = new Date();
            // Propagate QRN update to both engines
            _this.emit('meta-cognitive-update', {
                type: 'qrn-change',
                data: node
            });
            _this.emit('neural-orchestration-update', {
                type: 'qrn-change',
                data: node
            });
        });
        // Subscribe to system status updates to broadcast to all clients
        this.subscribe('system-status-updated', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var broadcastSystemStatus, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, import('./events.js')];
                    case 1:
                        broadcastSystemStatus = (_a.sent()).broadcastSystemStatus;
                        // Call the broadcast function to update all UI clients
                        broadcastSystemStatus();
                        log("Broadcasting system status update to all clients (".concat(data.type, ")"), 'SystemIntegrationAdapter');
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error broadcasting system status:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // Log initialization success
        log('System Integration Adapter initialized and components connected', 'SystemIntegrationAdapter');
    };
    /**
     * Subscribe to an event
     */
    SystemIntegrationAdapter.prototype.subscribe = function (event, callback) {
        var _a;
        if (!eventBus.has(event)) {
            eventBus.set(event, new Set());
        }
        (_a = eventBus.get(event)) === null || _a === void 0 ? void 0 : _a.add(callback);
    };
    /**
     * Unsubscribe from an event
     */
    SystemIntegrationAdapter.prototype.unsubscribe = function (event, callback) {
        var _a;
        if (eventBus.has(event)) {
            (_a = eventBus.get(event)) === null || _a === void 0 ? void 0 : _a.delete(callback);
        }
    };
    /**
     * Emit an event
     */
    SystemIntegrationAdapter.prototype.emit = function (event, data) {
        var _a;
        if (eventBus.has(event)) {
            (_a = eventBus.get(event)) === null || _a === void 0 ? void 0 : _a.forEach(function (callback) {
                try {
                    callback(data);
                }
                catch (error) {
                    console.error("Error in ".concat(event, " event handler:"), error);
                }
            });
        }
    };
    /**
     * Process a task using appropriate engines based on task type
     */
    SystemIntegrationAdapter.prototype.processTask = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var requiresMetaCognitive, requiresNeuralOrchestration, requiresResonance, requiresOpenAI, taskContext, result, metaResult, neuralResult, resonanceResult, aiResult, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        // Generate task ID if not provided
                        if (!task.id) {
                            task.id = uuidv4();
                        }
                        requiresMetaCognitive = ['analyze', 'pattern_detection', 'insight'].includes(task.type);
                        requiresNeuralOrchestration = ['chunking', 'processing', 'recomposition'].includes(task.type);
                        requiresResonance = task.type === 'resonance_calculation';
                        requiresOpenAI = task.type === 'ai_interaction';
                        taskContext = {
                            systemState: this.systemState,
                            activeQrnId: this.activeQrnId,
                            timestamp: new Date()
                        };
                        result = { success: false };
                        if (!requiresMetaCognitive) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.processMetaCognitiveTask(task, taskContext)];
                    case 1:
                        metaResult = _a.sent();
                        result = __assign(__assign(__assign({}, result), metaResult), { metaCognitiveProcessed: true });
                        _a.label = 2;
                    case 2:
                        if (!requiresNeuralOrchestration) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.processNeuralOrchestrationTask(task, taskContext)];
                    case 3:
                        neuralResult = _a.sent();
                        result = __assign(__assign(__assign({}, result), neuralResult), { neuralOrchestrationProcessed: true });
                        _a.label = 4;
                    case 4:
                        if (!requiresResonance) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.processResonanceTask(task, taskContext)];
                    case 5:
                        resonanceResult = _a.sent();
                        result = __assign(__assign(__assign({}, result), resonanceResult), { resonanceProcessed: true });
                        _a.label = 6;
                    case 6:
                        if (!requiresOpenAI) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.processAITask(task, taskContext)];
                    case 7:
                        aiResult = _a.sent();
                        result = __assign(__assign(__assign({}, result), aiResult), { aiProcessed: true });
                        _a.label = 8;
                    case 8:
                        // Mark task as successful if at least one component processed it
                        result.success = result.metaCognitiveProcessed ||
                            result.neuralOrchestrationProcessed ||
                            result.resonanceProcessed ||
                            result.aiProcessed;
                        // Update system state with task result
                        this.updateSystemState({
                            lastTaskProcessed: {
                                id: task.id,
                                type: task.type,
                                timestamp: new Date(),
                                success: result.success
                            }
                        });
                        return [2 /*return*/, result];
                    case 9:
                        error_2 = _a.sent();
                        console.error('Error processing task in System Integration Adapter:', error_2);
                        return [2 /*return*/, {
                                success: false,
                                error: error_2 instanceof Error ? error_2.message : 'Unknown error in task processing'
                            }];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Process a task through the Meta-Cognitive Engine
     */
    SystemIntegrationAdapter.prototype.processMetaCognitiveTask = function (task, context) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = task.type;
                        switch (_a) {
                            case 'analyze': return [3 /*break*/, 1];
                            case 'pattern_detection': return [3 /*break*/, 3];
                            case 'insight': return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, metaCognitiveEngine.analyzeEvents(task.data)];
                    case 2: 
                    // Process an analysis task through meta-cognitive engine
                    return [2 /*return*/, _b.sent()];
                    case 3: return [4 /*yield*/, metaCognitiveEngine.detectPatterns(task.data)];
                    case 4: 
                    // Detect patterns in cognitive events
                    return [2 /*return*/, _b.sent()];
                    case 5: return [4 /*yield*/, metaCognitiveEngine.generateInsights(task.data)];
                    case 6: 
                    // Generate insights from patterns
                    return [2 /*return*/, _b.sent()];
                    case 7: return [2 /*return*/, { metaCognitiveProcessed: false }];
                }
            });
        });
    };
    /**
     * Process a task through the Neural Orchestration Engine
     */
    SystemIntegrationAdapter.prototype.processNeuralOrchestrationTask = function (task, context) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = task.type;
                        switch (_a) {
                            case 'chunking': return [3 /*break*/, 1];
                            case 'processing': return [3 /*break*/, 3];
                            case 'recomposition': return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, neuralOrchestrationEngine.createChunks(task.data)];
                    case 2: 
                    // Process a chunking task
                    return [2 /*return*/, _b.sent()];
                    case 3: return [4 /*yield*/, neuralOrchestrationEngine.processChunks(task.data)];
                    case 4: 
                    // Process chunks
                    return [2 /*return*/, _b.sent()];
                    case 5: return [4 /*yield*/, neuralOrchestrationEngine.recomposeChunks(task.data)];
                    case 6: 
                    // Recompose processed chunks
                    return [2 /*return*/, _b.sent()];
                    case 7: return [2 /*return*/, { neuralOrchestrationProcessed: false }];
                }
            });
        });
    };
    /**
     * Process a resonance calculation task
     */
    SystemIntegrationAdapter.prototype.processResonanceTask = function (task, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(task.type === 'resonance_calculation')) return [3 /*break*/, 2];
                        return [4 /*yield*/, adaptiveResonanceService.calculateNodeResonance(task.data.sourceId, task.data.targetId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, { resonanceProcessed: false }];
                }
            });
        });
    };
    /**
     * Process an AI interaction task using OpenAI
     */
    /**
     * Process an AI task using OpenAI integration
     * Enhanced with HTML token handling and error prevention
     * @param task The AI task to process
     * @param context Task context
     * @returns Processed AI result
     */
    SystemIntegrationAdapter.prototype.processAITask = function (task, context) {
        return __awaiter(this, void 0, void 0, function () {
            var preprocessedTask, startTime, taskId, result, _a, duration, error_3, errorMessage;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 13, , 14]);
                        preprocessedTask = this.preprocessAITaskInputs(task);
                        startTime = Date.now();
                        taskId = preprocessedTask.id || 'unknown-task';
                        // Log the start of AI processing
                        log("Starting AI processing for task ".concat(taskId, " (type: ").concat((_b = preprocessedTask.data) === null || _b === void 0 ? void 0 : _b.interaction, ")"), 'ai');
                        result = void 0;
                        _a = preprocessedTask.data.interaction;
                        switch (_a) {
                            case 'text_analysis': return [3 /*break*/, 1];
                            case 'image_analysis': return [3 /*break*/, 3];
                            case 'augmentation_recommendations': return [3 /*break*/, 5];
                            case 'symbiotic_response': return [3 /*break*/, 7];
                            case 'concept_mapping': return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 11];
                    case 1: return [4 /*yield*/, openaiService.analyzeText(preprocessedTask.data.text)];
                    case 2:
                        result = _c.sent();
                        return [3 /*break*/, 12];
                    case 3: return [4 /*yield*/, openaiService.analyzeImage(preprocessedTask.data.image)];
                    case 4:
                        result = _c.sent();
                        return [3 /*break*/, 12];
                    case 5: return [4 /*yield*/, openaiService.generateAugmentationRecommendations(preprocessedTask.data.domain, preprocessedTask.data.humanContext)];
                    case 6:
                        result = _c.sent();
                        return [3 /*break*/, 12];
                    case 7: return [4 /*yield*/, openaiService.generateSymbioticResponse(preprocessedTask.data.humanInput, preprocessedTask.data.domain)];
                    case 8:
                        result = _c.sent();
                        return [3 /*break*/, 12];
                    case 9: return [4 /*yield*/, openaiService.mapConceptualConnections(preprocessedTask.data.domain, preprocessedTask.data.concepts)];
                    case 10:
                        result = _c.sent();
                        return [3 /*break*/, 12];
                    case 11: return [2 /*return*/, {
                            aiProcessed: false,
                            error: 'Unknown AI interaction type',
                            taskId: taskId
                        }];
                    case 12:
                        duration = Date.now() - startTime;
                        // Log successful completion
                        log("AI processing completed for task ".concat(taskId, " in ").concat(duration, "ms"), 'ai');
                        // Return enhanced result with metadata
                        return [2 /*return*/, __assign(__assign({}, result), { aiProcessed: true, taskId: taskId, processingTime: duration, timestamp: new Date() })];
                    case 13:
                        error_3 = _c.sent();
                        errorMessage = error_3 instanceof Error ? error_3.message : 'Unknown error in AI processing';
                        console.error('Error in AI task processing:', error_3);
                        // Log the error with additional context for debugging
                        log("AI processing error: ".concat(errorMessage), 'error');
                        // Emit event for error handling systems
                        this.emit('ai-processing-error', {
                            task: task.id || 'unknown',
                            error: errorMessage,
                            timestamp: new Date()
                        });
                        return [2 /*return*/, {
                                aiProcessed: false,
                                error: errorMessage,
                                errorDetails: error_3 instanceof Error ? error_3.stack : undefined,
                                taskId: task.id || 'unknown-task',
                                timestamp: new Date()
                            }];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Preprocess AI task inputs to handle HTML tokens and prevent errors
     * @param task The original task
     * @returns Preprocessed task
     */
    SystemIntegrationAdapter.prototype.preprocessAITaskInputs = function (task) {
        var processedTask = __assign({}, task);
        // Create data object if it doesn't exist
        if (!processedTask.data) {
            processedTask.data = {};
        }
        // Handle HTML content in text fields
        if (processedTask.data.text) {
            processedTask.data.text = this.sanitizeHtmlContent(processedTask.data.text);
        }
        if (processedTask.data.humanContext) {
            processedTask.data.humanContext = this.sanitizeHtmlContent(processedTask.data.humanContext);
        }
        if (processedTask.data.humanInput) {
            processedTask.data.humanInput = this.sanitizeHtmlContent(processedTask.data.humanInput);
        }
        // Ensure concepts is always an array
        if (processedTask.data.concepts && !Array.isArray(processedTask.data.concepts)) {
            processedTask.data.concepts = [processedTask.data.concepts];
        }
        // Set defaults for domain if missing
        if (processedTask.data.domain &&
            !['finance', 'crypto', 'sports', 'general'].includes(processedTask.data.domain)) {
            processedTask.data.domain = 'general';
        }
        return processedTask;
    };
    /**
     * Sanitize HTML content to prevent token errors with OpenAI
     * @param content The content to sanitize
     * @returns Sanitized content
     */
    SystemIntegrationAdapter.prototype.sanitizeHtmlContent = function (content) {
        if (!content)
            return '';
        // Replace problematic HTML token sequences that cause errors with OpenAI
        return content
            // Replace HTML entities with their character equivalents
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&amp;/g, '&')
            // Replace script tags (potential security issue)
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[script content removed]')
            // Replace other problematic HTML sequences
            .replace(/<!\[CDATA\[.*?\]\]>/g, '')
            .replace(/<!--.*?-->/g, '')
            // Limit content length to prevent token limit errors
            .substring(0, 32000);
    };
    /**
     * Initialize an AI model with comprehensive error handling
     * @param modelType The type of model to initialize (GPT_4O, GEMINI_PRO, etc.)
     * @param apiKey Optional API key (for models requiring external API access)
     * @param systemMetrics Optional system metrics for meta-cognitive enhancements
     * @returns Result of the initialization
     */
    SystemIntegrationAdapter.prototype.initializeModel = function (modelType, apiKey, systemMetrics) {
        return __awaiter(this, void 0, void 0, function () {
            var effectiveApiKey, originalApiKey, openaiError_1, agent, existingModelIndex, error_4;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        log("Initializing model: ".concat(modelType), 'system');
                        // Log meta-cognitive data if provided
                        if (systemMetrics) {
                            log("With meta-cognitive metrics - Stability: ".concat(((_a = systemMetrics.systemStability) === null || _a === void 0 ? void 0 : _a.toFixed(2)) || 'N/A', ", Synergy: ").concat(((_b = systemMetrics.nodeSynergy) === null || _b === void 0 ? void 0 : _b.toFixed(2)) || 'N/A', ", Coherence: ").concat(((_c = systemMetrics.globalCoherence) === null || _c === void 0 ? void 0 : _c.toFixed(2)) || 'N/A'), 'system');
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 7, , 8]);
                        if (!(modelType === ModelType.GPT_4O)) return [3 /*break*/, 5];
                        effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;
                        // Validate OpenAI API key presence
                        if (!effectiveApiKey) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: 'OpenAI API Key is required for GPT-4o initialization',
                                    requiresApiKey: true
                                }];
                        }
                        originalApiKey = process.env.OPENAI_API_KEY;
                        if (apiKey) {
                            process.env.OPENAI_API_KEY = apiKey;
                        }
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 4, , 5]);
                        log("Testing OpenAI connection for ".concat(modelType, "..."), 'system');
                        // Use the openaiService to perform a simple validation
                        return [4 /*yield*/, openaiService.validateApiConnection()];
                    case 3:
                        // Use the openaiService to perform a simple validation
                        _d.sent();
                        log("OpenAI API connection validated for ".concat(modelType), 'system');
                        return [3 /*break*/, 5];
                    case 4:
                        openaiError_1 = _d.sent();
                        // Restore original API key if needed
                        if (apiKey && originalApiKey) {
                            process.env.OPENAI_API_KEY = originalApiKey;
                        }
                        // Specific error handling for OpenAI connectivity issues
                        console.error('OpenAI API error during model initialization:', openaiError_1);
                        return [2 /*return*/, {
                                success: false,
                                error: openaiError_1 instanceof Error
                                    ? "OpenAI API error: ".concat(openaiError_1.message)
                                    : 'Unknown OpenAI API error',
                                details: 'The system could not establish a valid connection to OpenAI API',
                                requiresApiKey: true
                            }];
                    case 5:
                        agent = createModelAgent(modelType, apiKey);
                        if (!agent) {
                            throw new Error("Failed to create agent for model type: ".concat(modelType));
                        }
                        // Handle any model-specific initialization
                        return [4 /*yield*/, agent.initialize()];
                    case 6:
                        // Handle any model-specific initialization
                        _d.sent();
                        // Register the model with the orchestration engine
                        neuralOrchestrationEngine.registerAgent(agent);
                        existingModelIndex = this.systemState.activeModels.findIndex(function (m) { return m.type === modelType; });
                        if (existingModelIndex >= 0) {
                            this.systemState.activeModels[existingModelIndex] = {
                                type: modelType,
                                status: 'ready',
                                initialized: new Date()
                            };
                        }
                        else {
                            this.systemState.activeModels.push({
                                type: modelType,
                                status: 'ready',
                                initialized: new Date()
                            });
                        }
                        // Update the timestamp for tracking
                        this.systemState.lastUpdated = new Date();
                        // Notify other components about the new model
                        this.emit('model-initialized', {
                            modelType: modelType,
                            timestamp: new Date()
                        });
                        // Add broadcast event for UI update
                        this.emit('system-status-updated', {
                            type: 'model_initialization',
                            modelType: modelType,
                            timestamp: new Date()
                        });
                        log("Model ".concat(modelType, " successfully initialized"), 'system');
                        return [2 /*return*/, {
                                success: true,
                                model: {
                                    type: modelType,
                                    status: 'ready',
                                    initialized: new Date(),
                                    capabilities: agent.reportCapabilities ? agent.reportCapabilities() : null
                                }
                            }];
                    case 7:
                        error_4 = _d.sent();
                        console.error('Error initializing model:', error_4);
                        // Log the error for monitoring
                        log("Model initialization failed for ".concat(modelType, ": ").concat(error_4 instanceof Error ? error_4.message : 'Unknown error'), 'error');
                        return [2 /*return*/, {
                                success: false,
                                error: error_4 instanceof Error ? error_4.message : 'Unknown error initializing model',
                                details: error_4 instanceof Error && error_4.stack ? error_4.stack : undefined
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the current system state
     */
    SystemIntegrationAdapter.prototype.getSystemState = function () {
        return __assign(__assign({}, this.systemState), { timestamp: new Date() });
    };
    /**
     * Update the system state
     */
    SystemIntegrationAdapter.prototype.updateSystemState = function (update) {
        this.systemState = __assign(__assign(__assign({}, this.systemState), update), { lastUpdated: new Date() });
    };
    return SystemIntegrationAdapter;
}());
// Export singleton instance
export var systemIntegrationAdapter = SystemIntegrationAdapter.getInstance();
