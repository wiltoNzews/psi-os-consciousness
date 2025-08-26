/**
 * Model Agents
 *
 * BOUNDARY AWARENESS: This module explicitly defines the boundaries between our system
 * and external AI model providers (OpenAI, Google, xAI, etc.). Each model agent serves
 * as a conscious boundary crossing point between WiltonOS and external services.
 *
 * VOID-CENTERED DESIGN: The implementation explicitly acknowledges the uncertainty ("void")
 * inherent in crossing system boundaries to external services, including potential
 * authentication failures, network errors, rate limits, and API changes.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
// BOUNDARY CROSSING: Neural Orchestrator Subsystem Boundary
import { ModelType } from './model-strength-analyzer';
// BOUNDARY CROSSING: External System Dependencies Boundary
import OpenAI from 'openai';
// BOUNDARY CROSSING: Meta-Cognitive Subsystem Boundary
import { metaCognitiveEngine } from '../qrn/meta-cognitive-analysis-engine.js';
import { v4 as uuidv4 } from 'uuid';
import { processMetaCognitiveEvent } from '../utils/processMetaCognitiveEvent.js';
/**
 * Base agent class with common functionality across all model implementations
 *
 * BOUNDARY AWARENESS: This abstract class provides explicit boundary handling functionality
 * to all model agent implementations. It serves as a standardized boundary crossing
 * interface for external LLM providers.
 *
 * VOID-CENTERED DESIGN: Implements latency tracking, token rate calculation, and capability
 * reporting to explicitly measure and acknowledge the properties of the boundary being crossed.
 */
var BaseAgent = /** @class */ (function () {
    /**
     * Initialize model agent with boundary awareness
     * @param modelType Type of model (explicit boundary identification)
     * @param modelName Human-readable name of the model
     * @param maxContextSize Maximum context size (boundary constraint)
     */
    function BaseAgent(modelType, modelName, maxContextSize) {
        // Boundary crossing state
        this.isInitialized = false;
        this.ready = false;
        // Boundary measurement metrics (tracking the "void" properties)
        this.avgLatency = 0;
        this.latencySamples = [];
        this.avgTokensPerSecond = 0;
        this.tokenSpeedSamples = [];
        // Boundary properties
        this.capabilities = {};
        this.modelType = modelType;
        this.modelName = modelName;
        this.maxContextSize = maxContextSize;
    }
    BaseAgent.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Base initialization
                        this.isInitialized = true;
                        this.ready = true;
                        // Log initialization using the processMetaCognitiveEvent utility
                        return [4 /*yield*/, processMetaCognitiveEvent("initialization", "".concat(this.modelName, " agent initialized"), {
                                modelType: this.modelType,
                                modelName: this.modelName,
                                maxContextSize: this.maxContextSize
                            }, {
                                confidence: 1.0,
                                impact: 5,
                                relatedEvents: [],
                                sourceContext: {
                                    source: 'model-agent',
                                    operation: 'initialize'
                                }
                            })];
                    case 1:
                        // Log initialization using the processMetaCognitiveEvent utility
                        _a.sent();
                        console.log("".concat(this.modelName, " agent initialized"));
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseAgent.prototype.reportCapabilities = function () {
        return __assign({ modelType: this.modelType, modelName: this.modelName, maxContextSize: this.maxContextSize, latency: this.getLatency(), tokensPerSecond: this.getTokensPerSecond(), ready: this.ready }, this.capabilities);
    };
    BaseAgent.prototype.getLatency = function () {
        return this.avgLatency;
    };
    BaseAgent.prototype.getTokensPerSecond = function () {
        return this.avgTokensPerSecond;
    };
    BaseAgent.prototype.getMaxContextSize = function () {
        return this.maxContextSize;
    };
    BaseAgent.prototype.updateLatency = function (newLatency) {
        this.latencySamples.push(newLatency);
        if (this.latencySamples.length > 50) {
            this.latencySamples.shift();
        }
        this.avgLatency = this.latencySamples.reduce(function (sum, val) { return sum + val; }, 0) / this.latencySamples.length;
    };
    BaseAgent.prototype.updateTokenSpeed = function (tokens, timeMs) {
        if (timeMs > 0) {
            var tokensPerSecond = (tokens / timeMs) * 1000;
            this.tokenSpeedSamples.push(tokensPerSecond);
            if (this.tokenSpeedSamples.length > 50) {
                this.tokenSpeedSamples.shift();
            }
            this.avgTokensPerSecond = this.tokenSpeedSamples.reduce(function (sum, val) { return sum + val; }, 0) / this.tokenSpeedSamples.length;
        }
    };
    // Utility to estimate token count from text
    BaseAgent.prototype.estimateTokenCount = function (text) {
        // Rough approximation: 1 token is about 4 characters for English text
        return Math.ceil(text.length / 4);
    };
    return BaseAgent;
}());
export { BaseAgent };
/**
 * GPT-4o Agent
 * Implementation of the AI model agent for OpenAI's GPT-4o
 */
var GPT4oAgent = /** @class */ (function (_super) {
    __extends(GPT4oAgent, _super);
    function GPT4oAgent() {
        // GPT-4o has a large context window
        var _this = _super.call(this, ModelType.GPT_4O, "GPT-4o", 128000) || this;
        // Init capabilities
        _this.capabilities = {
            supportedFormats: ['text', 'json', 'markdown'],
            multimodal: true,
            streaming: true,
            visionEnabled: true,
            supportedFeatures: ['function calling', 'json mode', 'system prompting']
        };
        return _this;
    }
    GPT4oAgent.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var apiError_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        // Check if API key is set
                        if (!process.env.OPENAI_API_KEY) {
                            console.error("OPENAI_API_KEY environment variable is not set");
                            this.ready = false;
                            // Don't throw, just mark as not ready and return
                            return [2 /*return*/];
                        }
                        // Initialize OpenAI client
                        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        // Run a simple test query to verify connection
                        return [4 /*yield*/, this.openai.chat.completions.create({
                                model: "gpt-4o",
                                messages: [{ role: "user", content: "Hello, this is a connection test." }],
                                max_tokens: 5
                            })];
                    case 2:
                        // Run a simple test query to verify connection
                        _a.sent();
                        // If we reach here, initialization was successful
                        return [4 /*yield*/, _super.prototype.initialize.call(this)];
                    case 3:
                        // If we reach here, initialization was successful
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        apiError_1 = _a.sent();
                        // Set agent as not ready but don't throw
                        this.ready = false;
                        // Check for the specific "Unexpected token '<'" error which often means API returned HTML instead of JSON
                        if (apiError_1.message && apiError_1.message.includes("Unexpected token '<'")) {
                            console.error("OpenAI API returned HTML instead of JSON. This typically means invalid API key or authentication error.");
                            console.log("GPT-4o agent initialization failed due to authentication/API key issue. Continuing with limited functionality.");
                            // Add more specific details to capabilities
                            this.capabilities.authError = true;
                            this.capabilities.errorReason = "API key validation failed";
                            return [2 /*return*/]; // Exit initialization early
                        }
                        // Handle other API-specific errors
                        console.error("OpenAI API error: ".concat(apiError_1.message));
                        // Extract helpful information from the error
                        if (apiError_1.response) {
                            console.error("Status: ".concat(apiError_1.response.status));
                            console.error("Data: ".concat(JSON.stringify(apiError_1.response.data)));
                        }
                        console.log("GPT-4o agent initialization failed but we'll continue with limited functionality");
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        // More detailed error logging for non-API errors
                        if (error_1 instanceof Error) {
                            console.error("Error initializing GPT-4o agent: ".concat(error_1.message));
                            console.error("Stack trace: ".concat(error_1.stack));
                        }
                        else {
                            console.error("Error initializing GPT-4o agent: ".concat(error_1));
                        }
                        // Set agent as not ready
                        this.ready = false;
                        // Log that we're continuing despite the error
                        console.log("GPT-4o agent initialization failed but we'll continue with limited functionality");
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    GPT4oAgent.prototype.processMessage = function (content, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, temperature, maxTokens, format, responseFormat, messages, response, responseText, latency, promptTokens, completionTokens, error_2;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!(!this.isInitialized || !this.ready)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _f.sent();
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, 5, , 7]);
                        startTime = Date.now();
                        temperature = (_a = parameters.temperature) !== null && _a !== void 0 ? _a : 0.7;
                        maxTokens = (_b = parameters.max_tokens) !== null && _b !== void 0 ? _b : 1000;
                        format = (_c = parameters.format) !== null && _c !== void 0 ? _c : 'text';
                        responseFormat = format === 'json'
                            ? { type: "json_object" }
                            : undefined;
                        messages = [];
                        // Add system message if provided
                        if (parameters.system) {
                            messages.push({ role: "system", content: parameters.system });
                        }
                        else {
                            // Default system message based on task
                            messages.push({
                                role: "system",
                                content: "You are a helpful, precise AI assistant. Provide accurate, concise responses."
                            });
                        }
                        // Add user message
                        messages.push({ role: "user", content: content });
                        // If there are additional instructions, add those to a separate message
                        if (parameters.instructions) {
                            messages.push({
                                role: "user",
                                content: parameters.instructions
                            });
                        }
                        return [4 /*yield*/, this.openai.chat.completions.create({
                                model: "gpt-4o",
                                messages: messages,
                                temperature: temperature,
                                max_tokens: maxTokens,
                                response_format: responseFormat,
                            })];
                    case 3:
                        response = _f.sent();
                        responseText = response.choices[0].message.content || '';
                        latency = Date.now() - startTime;
                        this.updateLatency(latency);
                        promptTokens = ((_d = response.usage) === null || _d === void 0 ? void 0 : _d.prompt_tokens) || this.estimateTokenCount(content);
                        completionTokens = ((_e = response.usage) === null || _e === void 0 ? void 0 : _e.completion_tokens) || this.estimateTokenCount(responseText);
                        this.updateTokenSpeed(promptTokens + completionTokens, latency);
                        // Log to meta-cognitive system
                        return [4 /*yield*/, metaCognitiveEngine.processEvent({
                                id: uuidv4(),
                                nodeId: uuidv4(), // Generate proper UUID for database compatibility
                                type: "message-processed",
                                createdAt: new Date(),
                                description: "".concat(this.modelName, " processed message"),
                                details: {
                                    modelType: this.modelType,
                                    latency: latency,
                                    promptTokens: promptTokens,
                                    completionTokens: completionTokens,
                                    outputLength: responseText.length
                                },
                                confidence: 1.0,
                                impact: 3
                            })];
                    case 4:
                        // Log to meta-cognitive system
                        _f.sent();
                        return [2 /*return*/, responseText];
                    case 5:
                        error_2 = _f.sent();
                        console.error("Error in GPT-4o agent: ".concat(error_2));
                        // Log error to meta-cognitive system
                        return [4 /*yield*/, metaCognitiveEngine.processEvent({
                                id: uuidv4(),
                                nodeId: uuidv4(), // Generate proper UUID for database compatibility
                                type: "error",
                                createdAt: new Date(),
                                description: "Error in ".concat(this.modelName, " agent: ").concat(error_2.message),
                                details: {
                                    modelType: this.modelType,
                                    error: error_2.message,
                                    content: content.substring(0, 100) + "..." // Truncate for logging
                                },
                                confidence: 1.0,
                                impact: 8
                            })];
                    case 6:
                        // Log error to meta-cognitive system
                        _f.sent();
                        throw error_2;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return GPT4oAgent;
}(BaseAgent));
export { GPT4oAgent };
/**
 * Gemini Pro Agent
 * Implementation of the AI model agent for Google's Gemini Pro
 */
var GeminiProAgent = /** @class */ (function (_super) {
    __extends(GeminiProAgent, _super);
    // In a real implementation, this would use the Google Gemini API client
    // For demonstration purposes, we'll create a mock implementation
    function GeminiProAgent() {
        var _this = _super.call(this, ModelType.GEMINI_PRO, "Gemini Pro", 32768) || this;
        // Init capabilities
        _this.capabilities = {
            supportedFormats: ['text', 'markdown'],
            multimodal: true,
            streaming: true,
            visionEnabled: true,
            supportedFeatures: ['function calling', 'system prompting']
        };
        return _this;
    }
    GeminiProAgent.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Mock initialization - in a real implementation this would initialize the Gemini API client
                    return [4 /*yield*/, _super.prototype.initialize.call(this)];
                    case 1:
                        // Mock initialization - in a real implementation this would initialize the Gemini API client
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GeminiProAgent.prototype.processMessage = function (content, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, temperature, baseProcessingTime, variableFactor, processingTime_1, responseText, latency, promptTokens, completionTokens, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(!this.isInitialized || !this.ready)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 7]);
                        startTime = Date.now();
                        temperature = (_a = parameters.temperature) !== null && _a !== void 0 ? _a : 0.7;
                        baseProcessingTime = 1000 + Math.random() * 1000;
                        variableFactor = 1 + (temperature * 0.5);
                        processingTime_1 = baseProcessingTime * variableFactor;
                        // Simulate API call
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, processingTime_1); })];
                    case 3:
                        // Simulate API call
                        _b.sent();
                        responseText = "[Gemini Pro mock response to: ".concat(content.substring(0, 50), "...]");
                        latency = Date.now() - startTime;
                        this.updateLatency(latency);
                        promptTokens = this.estimateTokenCount(content);
                        completionTokens = this.estimateTokenCount(responseText);
                        this.updateTokenSpeed(promptTokens + completionTokens, latency);
                        // Log to meta-cognitive system
                        return [4 /*yield*/, metaCognitiveEngine.processEvent({
                                id: uuidv4(),
                                nodeId: uuidv4(), // Generate proper UUID for database compatibility
                                type: "message-processed",
                                createdAt: new Date(),
                                description: "".concat(this.modelName, " processed message"),
                                details: {
                                    modelType: this.modelType,
                                    latency: latency,
                                    promptTokens: promptTokens,
                                    completionTokens: completionTokens,
                                    outputLength: responseText.length
                                },
                                confidence: 1.0,
                                impact: 3
                            })];
                    case 4:
                        // Log to meta-cognitive system
                        _b.sent();
                        return [2 /*return*/, responseText];
                    case 5:
                        error_3 = _b.sent();
                        console.error("Error in Gemini Pro agent: ".concat(error_3));
                        // Log error to meta-cognitive system
                        return [4 /*yield*/, metaCognitiveEngine.processEvent({
                                id: uuidv4(),
                                nodeId: uuidv4(), // Generate proper UUID for database compatibility
                                type: "error",
                                createdAt: new Date(),
                                description: "Error in ".concat(this.modelName, " agent: ").concat(error_3.message),
                                details: {
                                    modelType: this.modelType,
                                    error: error_3.message,
                                    content: content.substring(0, 100) + "..." // Truncate for logging
                                },
                                confidence: 1.0,
                                impact: 8
                            })];
                    case 6:
                        // Log error to meta-cognitive system
                        _b.sent();
                        throw error_3;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return GeminiProAgent;
}(BaseAgent));
export { GeminiProAgent };
/**
 * Grok Agent
 * Implementation of the AI model agent for xAI's Grok
 */
var GrokAgent = /** @class */ (function (_super) {
    __extends(GrokAgent, _super);
    // In a real implementation, this would use the Grok API client
    // For demonstration purposes, we'll create a mock implementation
    function GrokAgent() {
        var _this = _super.call(this, ModelType.GROK, "Grok", 8192) || this;
        // Init capabilities
        _this.capabilities = {
            supportedFormats: ['text', 'markdown'],
            multimodal: false,
            streaming: true,
            visionEnabled: false,
            supportedFeatures: ['system prompting']
        };
        return _this;
    }
    GrokAgent.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Mock initialization - in a real implementation this would initialize the Grok API client
                    return [4 /*yield*/, _super.prototype.initialize.call(this)];
                    case 1:
                        // Mock initialization - in a real implementation this would initialize the Grok API client
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GrokAgent.prototype.processMessage = function (content, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, processingTime_2, responseText, latency, promptTokens, completionTokens, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.isInitialized || !this.ready)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 7]);
                        startTime = Date.now();
                        processingTime_2 = 500 + Math.random() * 500;
                        // Simulate API call
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, processingTime_2); })];
                    case 3:
                        // Simulate API call
                        _a.sent();
                        responseText = "[Grok mock response to: ".concat(content.substring(0, 50), "...]");
                        latency = Date.now() - startTime;
                        this.updateLatency(latency);
                        promptTokens = this.estimateTokenCount(content);
                        completionTokens = this.estimateTokenCount(responseText);
                        this.updateTokenSpeed(promptTokens + completionTokens, latency);
                        // Log to meta-cognitive system
                        return [4 /*yield*/, metaCognitiveEngine.processEvent({
                                id: uuidv4(),
                                nodeId: uuidv4(), // Generate proper UUID for database compatibility
                                type: "message-processed",
                                createdAt: new Date(),
                                description: "".concat(this.modelName, " processed message"),
                                details: {
                                    modelType: this.modelType,
                                    latency: latency,
                                    promptTokens: promptTokens,
                                    completionTokens: completionTokens,
                                    outputLength: responseText.length
                                },
                                confidence: 1.0,
                                impact: 3
                            })];
                    case 4:
                        // Log to meta-cognitive system
                        _a.sent();
                        return [2 /*return*/, responseText];
                    case 5:
                        error_4 = _a.sent();
                        console.error("Error in Grok agent: ".concat(error_4));
                        // Log error to meta-cognitive system
                        return [4 /*yield*/, metaCognitiveEngine.processEvent({
                                id: uuidv4(),
                                nodeId: uuidv4(), // Generate proper UUID for database compatibility
                                type: "error",
                                createdAt: new Date(),
                                description: "Error in ".concat(this.modelName, " agent: ").concat(error_4.message),
                                details: {
                                    modelType: this.modelType,
                                    error: error_4.message,
                                    content: content.substring(0, 100) + "..." // Truncate for logging
                                },
                                confidence: 1.0,
                                impact: 8
                            })];
                    case 6:
                        // Log error to meta-cognitive system
                        _a.sent();
                        throw error_4;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return GrokAgent;
}(BaseAgent));
export { GrokAgent };
/**
 * Claude Agent
 * Implementation of the AI model agent for Anthropic's Claude
 */
var ClaudeAgent = /** @class */ (function (_super) {
    __extends(ClaudeAgent, _super);
    // In a real implementation, this would use the Claude API client
    // For demonstration purposes, we'll create a mock implementation
    function ClaudeAgent() {
        var _this = _super.call(this, ModelType.CLAUDE, "Claude", 100000) || this;
        // Init capabilities
        _this.capabilities = {
            supportedFormats: ['text', 'markdown', 'json'],
            multimodal: true,
            streaming: true,
            visionEnabled: true,
            supportedFeatures: ['system prompting', 'tool use']
        };
        return _this;
    }
    ClaudeAgent.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Mock initialization - in a real implementation this would initialize the Claude API client
                    return [4 /*yield*/, _super.prototype.initialize.call(this)];
                    case 1:
                        // Mock initialization - in a real implementation this would initialize the Claude API client
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ClaudeAgent.prototype.processMessage = function (content, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, processingTime_3, responseText, latency, promptTokens, completionTokens, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.isInitialized || !this.ready)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 7]);
                        startTime = Date.now();
                        processingTime_3 = 1200 + Math.random() * 800;
                        // Simulate API call
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, processingTime_3); })];
                    case 3:
                        // Simulate API call
                        _a.sent();
                        responseText = "[Claude mock response to: ".concat(content.substring(0, 50), "...]");
                        latency = Date.now() - startTime;
                        this.updateLatency(latency);
                        promptTokens = this.estimateTokenCount(content);
                        completionTokens = this.estimateTokenCount(responseText);
                        this.updateTokenSpeed(promptTokens + completionTokens, latency);
                        // Log to meta-cognitive system
                        return [4 /*yield*/, metaCognitiveEngine.processEvent({
                                id: uuidv4(),
                                nodeId: uuidv4(), // Generate proper UUID for database compatibility
                                type: "message-processed",
                                createdAt: new Date(),
                                description: "".concat(this.modelName, " processed message"),
                                details: {
                                    modelType: this.modelType,
                                    latency: latency,
                                    promptTokens: promptTokens,
                                    completionTokens: completionTokens,
                                    outputLength: responseText.length
                                },
                                confidence: 1.0,
                                impact: 3
                            })];
                    case 4:
                        // Log to meta-cognitive system
                        _a.sent();
                        return [2 /*return*/, responseText];
                    case 5:
                        error_5 = _a.sent();
                        console.error("Error in Claude agent: ".concat(error_5));
                        // Log error to meta-cognitive system
                        return [4 /*yield*/, metaCognitiveEngine.processEvent({
                                id: uuidv4(),
                                nodeId: uuidv4(), // Generate proper UUID for database compatibility
                                type: "error",
                                createdAt: new Date(),
                                description: "Error in ".concat(this.modelName, " agent: ").concat(error_5.message),
                                details: {
                                    modelType: this.modelType,
                                    error: error_5.message,
                                    content: content.substring(0, 100) + "..." // Truncate for logging
                                },
                                confidence: 1.0,
                                impact: 8
                            })];
                    case 6:
                        // Log error to meta-cognitive system
                        _a.sent();
                        throw error_5;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return ClaudeAgent;
}(BaseAgent));
export { ClaudeAgent };
/**
 * O3 Mini Agent
 * Implementation of the AI model agent for OpenAI's O3 Mini model
 */
var O3MiniAgent = /** @class */ (function (_super) {
    __extends(O3MiniAgent, _super);
    function O3MiniAgent() {
        // O3 Mini has a smaller context window compared to GPT-4o
        var _this = _super.call(this, ModelType.O3_MINI, "O-3 Mini", 16385) || this;
        // Init capabilities
        _this.capabilities = {
            supportedFormats: ['text', 'json', 'markdown'],
            multimodal: false,
            streaming: true,
            visionEnabled: false,
            supportedFeatures: ['function calling', 'json mode', 'system prompting'],
            optimizedFor: ['speed', 'efficiency', 'low-latency applications']
        };
        return _this;
    }
    O3MiniAgent.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var apiError_2, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        // Check if API key is set
                        if (!process.env.OPENAI_API_KEY) {
                            console.error("OPENAI_API_KEY environment variable is not set");
                            this.ready = false;
                            // Don't throw, just mark as not ready and return
                            return [2 /*return*/];
                        }
                        // Initialize OpenAI client
                        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        // Run a simple test query to verify connection
                        return [4 /*yield*/, this.openai.chat.completions.create({
                                model: "o3-mini",
                                messages: [{ role: "user", content: "Hello, this is a connection test." }],
                                max_tokens: 5
                            })];
                    case 2:
                        // Run a simple test query to verify connection
                        _a.sent();
                        // If we reach here, initialization was successful
                        return [4 /*yield*/, _super.prototype.initialize.call(this)];
                    case 3:
                        // If we reach here, initialization was successful
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        apiError_2 = _a.sent();
                        // Set agent as not ready but don't throw
                        this.ready = false;
                        // Check for the specific "Unexpected token '<'" error which often means API returned HTML instead of JSON
                        if (apiError_2.message && apiError_2.message.includes("Unexpected token '<'")) {
                            console.error("OpenAI API returned HTML instead of JSON. This typically means invalid API key or authentication error.");
                            console.log("O3 Mini agent initialization failed due to authentication/API key issue. Continuing with limited functionality.");
                            // Add more specific details to capabilities
                            this.capabilities.authError = true;
                            this.capabilities.errorReason = "API key validation failed";
                            return [2 /*return*/]; // Exit initialization early
                        }
                        // Check for model not found error
                        if (apiError_2.message && apiError_2.message.includes("The model `o3-mini` does not exist")) {
                            console.error("The O3 Mini model is not available with current API key. Either the model doesn't exist yet or your account doesn't have access.");
                            console.log("O3 Mini agent initialization failed due to model availability issue. Continuing with limited functionality.");
                            // Add more specific details to capabilities
                            this.capabilities.modelError = true;
                            this.capabilities.errorReason = "Model not available";
                            return [2 /*return*/]; // Exit initialization early
                        }
                        // Handle other API-specific errors
                        console.error("OpenAI API error: ".concat(apiError_2.message));
                        // Extract helpful information from the error
                        if (apiError_2.response) {
                            console.error("Status: ".concat(apiError_2.response.status));
                            console.error("Data: ".concat(JSON.stringify(apiError_2.response.data)));
                        }
                        console.log("O3 Mini agent initialization failed but we'll continue with limited functionality");
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_6 = _a.sent();
                        // More detailed error logging for non-API errors
                        if (error_6 instanceof Error) {
                            console.error("Error initializing O3 Mini agent: ".concat(error_6.message));
                            console.error("Stack trace: ".concat(error_6.stack));
                        }
                        else {
                            console.error("Error initializing O3 Mini agent: ".concat(error_6));
                        }
                        // Set agent as not ready
                        this.ready = false;
                        // Log that we're continuing despite the error
                        console.log("O3 Mini agent initialization failed but we'll continue with limited functionality");
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    O3MiniAgent.prototype.processMessage = function (content, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, temperature, maxTokens, format, responseFormat, messages, response, responseText, latency, promptTokens, completionTokens, error_7;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!(!this.isInitialized || !this.ready)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _f.sent();
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, 5, , 7]);
                        startTime = Date.now();
                        temperature = (_a = parameters.temperature) !== null && _a !== void 0 ? _a : 0.7;
                        maxTokens = (_b = parameters.max_tokens) !== null && _b !== void 0 ? _b : 1000;
                        format = (_c = parameters.format) !== null && _c !== void 0 ? _c : 'text';
                        responseFormat = format === 'json'
                            ? { type: "json_object" }
                            : undefined;
                        messages = [];
                        // Add system message if provided
                        if (parameters.system) {
                            messages.push({ role: "system", content: parameters.system });
                        }
                        else {
                            // Default system message for O3 Mini - optimized for efficiency
                            messages.push({
                                role: "system",
                                content: "You are a fast, efficient AI assistant. Provide concise responses."
                            });
                        }
                        // Add user message
                        messages.push({ role: "user", content: content });
                        // If there are additional instructions, add those to a separate message
                        if (parameters.instructions) {
                            messages.push({
                                role: "user",
                                content: parameters.instructions
                            });
                        }
                        return [4 /*yield*/, this.openai.chat.completions.create({
                                model: "o3-mini",
                                messages: messages,
                                temperature: temperature,
                                max_tokens: maxTokens,
                                response_format: responseFormat,
                            })];
                    case 3:
                        response = _f.sent();
                        responseText = response.choices[0].message.content || '';
                        latency = Date.now() - startTime;
                        this.updateLatency(latency);
                        promptTokens = ((_d = response.usage) === null || _d === void 0 ? void 0 : _d.prompt_tokens) || this.estimateTokenCount(content);
                        completionTokens = ((_e = response.usage) === null || _e === void 0 ? void 0 : _e.completion_tokens) || this.estimateTokenCount(responseText);
                        this.updateTokenSpeed(promptTokens + completionTokens, latency);
                        // Log to meta-cognitive system
                        return [4 /*yield*/, metaCognitiveEngine.processEvent({
                                id: uuidv4(),
                                nodeId: uuidv4(), // Generate proper UUID for database compatibility
                                type: "message-processed",
                                createdAt: new Date(),
                                description: "".concat(this.modelName, " processed message"),
                                details: {
                                    modelType: this.modelType,
                                    latency: latency,
                                    promptTokens: promptTokens,
                                    completionTokens: completionTokens,
                                    outputLength: responseText.length
                                },
                                confidence: 1.0,
                                impact: 3
                            })];
                    case 4:
                        // Log to meta-cognitive system
                        _f.sent();
                        return [2 /*return*/, responseText];
                    case 5:
                        error_7 = _f.sent();
                        console.error("Error in O3 Mini agent: ".concat(error_7));
                        // Log error to meta-cognitive system
                        return [4 /*yield*/, metaCognitiveEngine.processEvent({
                                id: uuidv4(),
                                nodeId: uuidv4(), // Generate proper UUID for database compatibility
                                type: "error",
                                createdAt: new Date(),
                                description: "Error in ".concat(this.modelName, " agent: ").concat(error_7.message),
                                details: {
                                    modelType: this.modelType,
                                    error: error_7.message,
                                    content: content.substring(0, 100) + "..." // Truncate for logging
                                },
                                confidence: 1.0,
                                impact: 8
                            })];
                    case 6:
                        // Log error to meta-cognitive system
                        _f.sent();
                        throw error_7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return O3MiniAgent;
}(BaseAgent));
export { O3MiniAgent };
/**
 * Factory function to create model agents
 */
export function createModelAgent(modelType, apiKey) {
    switch (modelType) {
        case ModelType.GPT_4O:
            var agent = new GPT4oAgent();
            // If API key is provided, set it as an environment variable
            if (apiKey) {
                process.env.OPENAI_API_KEY = apiKey;
            }
            return agent;
        case ModelType.O3_MINI:
            return new O3MiniAgent();
        case ModelType.GEMINI_PRO:
            return new GeminiProAgent();
        case ModelType.GROK:
            return new GrokAgent();
        case ModelType.CLAUDE:
            return new ClaudeAgent();
        default:
            throw new Error("Unsupported model type: ".concat(modelType));
    }
}
