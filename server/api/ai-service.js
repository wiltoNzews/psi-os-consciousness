/**
 * AI Service Router
 *
 * This module provides direct API endpoints for AI service integration,
 * bypassing the neural orchestration layer for simplified access.
 * It connects directly to OpenAI and other AI services.
 */
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
import express from 'express';
import { validateApiConnection, analyzeText, analyzeImage, generateAugmentationRecommendations, generateSymbioticResponse, mapConceptualConnections } from '../services/openai';
import { processTextAnalysisOutcome, processSymbioticResponseOutcome, TaskComplexity, TaskImportance } from './ai-service-integration';
// Create router
export var aiServiceRouter = express.Router();
// Validate API connection
aiServiceRouter.get('/validate-connection', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var valid, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Validating OpenAI API connection');
                return [4 /*yield*/, validateApiConnection()];
            case 1:
                valid = _a.sent();
                console.log('OpenAI API connection validated successfully');
                return [2 /*return*/, res.json({ valid: valid, message: 'OpenAI API connection is valid' })];
            case 2:
                error_1 = _a.sent();
                console.error('Failed to validate OpenAI API connection:', error_1);
                return [2 /*return*/, res.status(500).json({
                        valid: false,
                        message: 'Failed to validate OpenAI API connection',
                        error: error_1.message
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Text analysis endpoint
aiServiceRouter.post('/analyze-text', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, text, domain, complexity, importance, startTime, result, endTime, responseTime, resourceEstimate, qualityScore, response, error_2, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, text = _a.text, domain = _a.domain, complexity = _a.complexity, importance = _a.importance;
                startTime = Date.now();
                if (!text || typeof text !== 'string') {
                    return [2 /*return*/, res.status(400).json({ message: 'Text is required' })];
                }
                console.log('Handling direct text analysis request');
                console.log("Processing text analysis: ".concat(text.substring(0, 50)).concat(text.length > 50 ? '...' : ''));
                return [4 /*yield*/, analyzeText(text)];
            case 1:
                result = _b.sent();
                console.log('Analysis complete:', result);
                endTime = Date.now();
                responseTime = endTime - startTime;
                resourceEstimate = Math.min(0.2 + (text.length / 10000), 0.9);
                qualityScore = result.confidence;
                // Process outcome for meta-learning and stability tracking
                return [4 /*yield*/, processTextAnalysisOutcome(text, result, {
                        domain: domain || 'general',
                        complexity: complexity ? parseFloat(complexity) :
                            (text.length > 500 ? TaskComplexity.COMPLEX : TaskComplexity.MODERATE),
                        importance: importance ? parseFloat(importance) : TaskImportance.MEDIUM
                    })];
            case 2:
                // Process outcome for meta-learning and stability tracking
                _b.sent();
                response = {
                    data: result,
                    metrics: {
                        responseTime: responseTime,
                        successRate: 1, // Success
                        resourceUtilization: resourceEstimate,
                        qualityScore: qualityScore,
                        timestamp: new Date()
                    }
                };
                return [2 /*return*/, res.json(response)];
            case 3:
                error_2 = _b.sent();
                console.error('Failed to analyze text:', error_2);
                response = {
                    data: {
                        insight: "Error analyzing text",
                        confidence: 0,
                        source: 'ai',
                        timestamp: new Date()
                    },
                    metrics: {
                        responseTime: Date.now() - (req.body.startTime || Date.now()),
                        successRate: 0, // Failure
                        resourceUtilization: 0.1, // Minimal resource usage during error
                        qualityScore: 0,
                        timestamp: new Date()
                    }
                };
                return [2 /*return*/, res.status(500).json(response)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Image analysis endpoint
aiServiceRouter.post('/analyze-image', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var base64Image, startTime, result, endTime, responseTime, imageSize, resourceEstimate, qualityScore, response, error_3, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                base64Image = req.body.base64Image;
                startTime = Date.now();
                if (!base64Image || typeof base64Image !== 'string') {
                    return [2 /*return*/, res.status(400).json({ message: 'Base64 encoded image is required' })];
                }
                return [4 /*yield*/, analyzeImage(base64Image)];
            case 1:
                result = _a.sent();
                endTime = Date.now();
                responseTime = endTime - startTime;
                imageSize = base64Image.length * 0.75;
                resourceEstimate = Math.min(0.3 + (imageSize / 1000000), 0.9);
                qualityScore = result.confidence;
                response = {
                    data: result,
                    metrics: {
                        responseTime: responseTime,
                        successRate: 1, // Success
                        resourceUtilization: resourceEstimate,
                        qualityScore: qualityScore,
                        timestamp: new Date()
                    }
                };
                return [2 /*return*/, res.json(response)];
            case 2:
                error_3 = _a.sent();
                console.error('Failed to analyze image:', error_3);
                response = {
                    data: {
                        insight: "Error analyzing image",
                        confidence: 0,
                        source: 'ai',
                        timestamp: new Date()
                    },
                    metrics: {
                        responseTime: Date.now() - (req.body.startTime || Date.now()),
                        successRate: 0, // Failure
                        resourceUtilization: 0.1, // Minimal resource usage during error
                        qualityScore: 0,
                        timestamp: new Date()
                    }
                };
                return [2 /*return*/, res.status(500).json(response)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Symbiotic response endpoint (combined human + AI thinking)
aiServiceRouter.post('/symbiotic-response', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, humanInput, domain, complexity, importance, startTime, result, endTime, responseTime, inputComplexity, resourceEstimate, response, error_4, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, humanInput = _a.humanInput, domain = _a.domain, complexity = _a.complexity, importance = _a.importance;
                startTime = Date.now();
                if (!humanInput || typeof humanInput !== 'string') {
                    return [2 /*return*/, res.status(400).json({ message: 'Human input is required' })];
                }
                console.log("Processing symbiotic response for domain: ".concat(domain || 'general'));
                return [4 /*yield*/, generateSymbioticResponse(humanInput, domain || 'general')];
            case 1:
                result = _b.sent();
                // Process outcome for meta-learning and stability tracking
                return [4 /*yield*/, processSymbioticResponseOutcome(humanInput, result, {
                        domain: domain || 'general',
                        complexity: complexity ? parseFloat(complexity) : undefined,
                        importance: importance ? parseFloat(importance) : undefined
                    })];
            case 2:
                // Process outcome for meta-learning and stability tracking
                _b.sent();
                endTime = Date.now();
                responseTime = endTime - startTime;
                inputComplexity = humanInput.length / 100;
                resourceEstimate = Math.min(0.2 + (inputComplexity * 0.05), 0.9);
                response = {
                    data: result,
                    metrics: {
                        responseTime: responseTime,
                        successRate: 1, // Success
                        resourceUtilization: resourceEstimate,
                        qualityScore: result.confidenceScore, // Use confidence from result as quality indicator
                        timestamp: new Date()
                    }
                };
                return [2 /*return*/, res.json(response)];
            case 3:
                error_4 = _b.sent();
                console.error('Failed to generate symbiotic response:', error_4);
                response = {
                    data: {
                        response: "Unable to generate a symbiotic response at this time.",
                        humanContribution: 0.5,
                        aiContribution: 0.5,
                        confidenceScore: 0
                    },
                    metrics: {
                        responseTime: Date.now() - (req.body.startTime || Date.now()),
                        successRate: 0, // Failure
                        resourceUtilization: 0.1, // Minimal resource usage during error
                        qualityScore: 0,
                        timestamp: new Date()
                    }
                };
                return [2 /*return*/, res.status(500).json(response)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Augmentation recommendations endpoint
aiServiceRouter.post('/augmentation-recommendations', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, humanContext, domain, startTime, result, endTime, responseTime, contextComplexity, resourceEstimate, recommendationCount, averageRecommendedLevel, qualityScore, response, error_5, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, humanContext = _a.humanContext, domain = _a.domain;
                startTime = Date.now();
                if (!humanContext || typeof humanContext !== 'string') {
                    return [2 /*return*/, res.status(400).json({ message: 'Human context is required' })];
                }
                console.log("Processing augmentation recommendations for domain: ".concat(domain || 'general'));
                return [4 /*yield*/, generateAugmentationRecommendations(humanContext, domain || 'general')];
            case 1:
                result = _b.sent();
                endTime = Date.now();
                responseTime = endTime - startTime;
                contextComplexity = humanContext.length / 100;
                resourceEstimate = Math.min(0.2 + (contextComplexity * 0.05), 0.9);
                recommendationCount = result.augmentations.length;
                averageRecommendedLevel = result.augmentations.reduce(function (sum, item) { return sum + item.recommendedLevel; }, 0) /
                    (recommendationCount || 1);
                qualityScore = Math.min((recommendationCount * 0.1) + (averageRecommendedLevel / 20), 1);
                response = {
                    data: result,
                    metrics: {
                        responseTime: responseTime,
                        successRate: 1, // Success
                        resourceUtilization: resourceEstimate,
                        qualityScore: qualityScore,
                        timestamp: new Date()
                    }
                };
                return [2 /*return*/, res.json(response)];
            case 2:
                error_5 = _b.sent();
                console.error('Failed to generate augmentation recommendations:', error_5);
                response = {
                    data: {
                        augmentations: [
                            {
                                name: "Basic Analysis",
                                description: "AI assistance with basic data analysis tasks",
                                recommendedLevel: 3,
                                maxLevel: 10
                            }
                        ]
                    },
                    metrics: {
                        responseTime: Date.now() - (req.body.startTime || Date.now()),
                        successRate: 0, // Failure
                        resourceUtilization: 0.1, // Minimal resource usage during error
                        qualityScore: 0,
                        timestamp: new Date()
                    }
                };
                return [2 /*return*/, res.status(500).json(response)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Concept mapping endpoint
aiServiceRouter.post('/concept-mapping', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, concepts, domain, startTime, result, endTime, responseTime, conceptCount, resourceEstimate, connectionCount, avgStrength, qualityScore, response, error_6, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, concepts = _a.concepts, domain = _a.domain;
                startTime = Date.now();
                if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
                    return [2 /*return*/, res.status(400).json({
                            message: 'At least two concepts are required for mapping'
                        })];
                }
                return [4 /*yield*/, mapConceptualConnections(concepts, domain || 'general')];
            case 1:
                result = _b.sent();
                endTime = Date.now();
                responseTime = endTime - startTime;
                conceptCount = concepts.length;
                resourceEstimate = Math.min(0.1 * conceptCount, 0.9);
                connectionCount = result.connections.length;
                avgStrength = result.connections.reduce(function (sum, item) { return sum + item.strength; }, 0) /
                    (connectionCount || 1);
                qualityScore = Math.min((connectionCount / (conceptCount * (conceptCount - 1) / 2)) * avgStrength, 1);
                response = {
                    data: result,
                    metrics: {
                        responseTime: responseTime,
                        successRate: 1, // Success
                        resourceUtilization: resourceEstimate,
                        qualityScore: qualityScore,
                        timestamp: new Date()
                    }
                };
                return [2 /*return*/, res.json(response)];
            case 2:
                error_6 = _b.sent();
                console.error('Failed to map conceptual connections:', error_6);
                response = {
                    data: {
                        connections: []
                    },
                    metrics: {
                        responseTime: Date.now() - (req.body.startTime || Date.now()),
                        successRate: 0, // Failure
                        resourceUtilization: 0.1, // Minimal resource usage during error
                        qualityScore: 0,
                        timestamp: new Date()
                    }
                };
                return [2 /*return*/, res.status(500).json(response)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Endpoint to get stability metrics for the dashboard
aiServiceRouter.get('/stability-metrics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var startTime, stabilityModule, history_1, trend, endTime, responseTime, historyDataPoints, resourceEstimate, dataAvailabilityScore, qualityScore, response, error_7, response;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                startTime = Date.now();
                return [4 /*yield*/, import('../services/qrn/inverse-pendulum-tracker')];
            case 1:
                stabilityModule = _b.sent();
                history_1 = stabilityModule.getStabilityHistory(20);
                trend = stabilityModule.analyzeStabilityTrend(3600000);
                endTime = Date.now();
                responseTime = endTime - startTime;
                historyDataPoints = history_1.length;
                resourceEstimate = Math.min(0.1 + (historyDataPoints * 0.01), 0.5);
                dataAvailabilityScore = Math.min(historyDataPoints / 20, 1);
                qualityScore = trend.confidence * dataAvailabilityScore;
                response = {
                    data: {
                        currentData: history_1.length > 0 ? history_1[history_1.length - 1] : null,
                        history: history_1,
                        trend: trend
                    },
                    metrics: {
                        responseTime: responseTime,
                        successRate: 1, // Success
                        resourceUtilization: resourceEstimate,
                        qualityScore: qualityScore,
                        timestamp: new Date()
                    }
                };
                return [2 /*return*/, res.json(response)];
            case 2:
                error_7 = _b.sent();
                console.error('Failed to get stability metrics:', error_7);
                response = {
                    data: {
                        currentData: null,
                        history: [],
                        trend: {
                            direction: 'unknown',
                            magnitude: 0,
                            confidence: 0,
                            analysis: 'Unable to retrieve stability metrics'
                        }
                    },
                    metrics: {
                        responseTime: Date.now() - (((_a = req.body) === null || _a === void 0 ? void 0 : _a.startTime) || Date.now()),
                        successRate: 0, // Failure
                        resourceUtilization: 0.1,
                        qualityScore: 0,
                        timestamp: new Date()
                    }
                };
                return [2 /*return*/, res.status(500).json(response)];
            case 3: return [2 /*return*/];
        }
    });
}); });
