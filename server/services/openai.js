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
import { openAIClientManager } from './openai-client-manager.js';
import { log } from '../vite.js';
// Using the centralized OpenAI client manager
// The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
/**
 * Validates the OpenAI API connection by making a minimal API call
 * This helps check if the API key is valid and the service is accessible
 * @returns Promise resolving to true if connection is valid
 * @throws Error if connection fails
 */
export function validateApiConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, openAIClientManager.validateConnection()];
                case 1: 
                // Delegate to the client manager for validation
                return [2 /*return*/, _a.sent()];
                case 2:
                    error_1 = _a.sent();
                    log("OpenAI API connection validation failed: ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error'), 'error');
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Helper function to safely parse JSON from OpenAI response
function safeParseJson(content) {
    if (!content)
        return {};
    try {
        return JSON.parse(content);
    }
    catch (error) {
        console.error("Failed to parse JSON from OpenAI response:", error);
        return {};
    }
}
/**
 * Analyzes text input and returns AI-generated insights
 */
export function analyzeText(text) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, openAIClientManager.client.chat.completions.create({
                            model: "gpt-4o",
                            messages: [
                                {
                                    role: "system",
                                    content: "You are an AI assistant in a Human-AI Symbiosis platform. Generate insightful, concise analysis of the provided text. Respond with JSON in this format: { 'insight': string, 'confidence': number between 0-1 }"
                                },
                                {
                                    role: "user",
                                    content: text
                                }
                            ],
                            response_format: { type: "json_object" }
                        })];
                case 1:
                    response = _a.sent();
                    result = safeParseJson(response.choices[0].message.content);
                    return [2 /*return*/, {
                            insight: result.insight || "No insight generated",
                            confidence: Math.max(0, Math.min(1, result.confidence || 0)),
                            source: 'ai',
                            timestamp: new Date()
                        }];
                case 2:
                    error_2 = _a.sent();
                    log("Error analyzing text: ".concat(error_2 instanceof Error ? error_2.message : 'Unknown error'), 'error');
                    return [2 /*return*/, {
                            insight: "Unable to generate insight at this time.",
                            confidence: 0,
                            source: 'ai',
                            timestamp: new Date()
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Analyzes an image (base64-encoded) and returns AI-generated insights
 */
export function analyzeImage(base64Image) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, openAIClientManager.client.chat.completions.create({
                            model: "gpt-4o",
                            messages: [
                                {
                                    role: "system",
                                    content: "You are an AI assistant in a Human-AI Symbiosis platform. Analyze the image and provide a concise, insightful description. Respond with JSON in this format: { 'insight': string, 'confidence': number between 0-1 }"
                                },
                                {
                                    role: "user",
                                    content: [
                                        {
                                            type: "text",
                                            text: "Analyze this image and provide insights:"
                                        },
                                        {
                                            type: "image_url",
                                            image_url: {
                                                url: "data:image/jpeg;base64,".concat(base64Image)
                                            }
                                        }
                                    ]
                                }
                            ],
                            response_format: { type: "json_object" }
                        })];
                case 1:
                    response = _a.sent();
                    result = safeParseJson(response.choices[0].message.content);
                    return [2 /*return*/, {
                            insight: result.insight || "No image insight generated",
                            confidence: Math.max(0, Math.min(1, result.confidence || 0)),
                            source: 'ai',
                            timestamp: new Date()
                        }];
                case 2:
                    error_3 = _a.sent();
                    log("Error analyzing image: ".concat(error_3 instanceof Error ? error_3.message : 'Unknown error'), 'error');
                    return [2 /*return*/, {
                            insight: "Unable to analyze image at this time.",
                            confidence: 0,
                            source: 'ai',
                            timestamp: new Date()
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Generates domain-specific augmentation recommendations based on human input
 */
export function generateAugmentationRecommendations(domain, humanContext) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, openAIClientManager.client.chat.completions.create({
                            model: "gpt-4o",
                            messages: [
                                {
                                    role: "system",
                                    content: "You are an AI assistant in a Human-AI Symbiosis platform specializing in ".concat(domain, ". \n          Based on the human context provided, recommend 3-5 specific cognitive augmentations that AI can provide.\n          For each augmentation, provide a name, description, and recommended level (1-10).\n          Respond with JSON in this format: { \n            'augmentations': [\n              { 'name': string, 'description': string, 'recommendedLevel': number, 'maxLevel': 10 }\n            ] \n          }")
                                },
                                {
                                    role: "user",
                                    content: humanContext
                                }
                            ],
                            response_format: { type: "json_object" }
                        })];
                case 1:
                    response = _a.sent();
                    result = safeParseJson(response.choices[0].message.content);
                    return [2 /*return*/, result.augmentations ? result : {
                            augmentations: [
                                {
                                    name: "Basic Analysis",
                                    description: "AI assistance with basic data analysis tasks",
                                    recommendedLevel: 3,
                                    maxLevel: 10
                                }
                            ]
                        }];
                case 2:
                    error_4 = _a.sent();
                    log("Error generating augmentation recommendations: ".concat(error_4 instanceof Error ? error_4.message : 'Unknown error'), 'error');
                    return [2 /*return*/, {
                            augmentations: [
                                {
                                    name: "Basic Analysis",
                                    description: "AI assistance with basic data analysis tasks",
                                    recommendedLevel: 3,
                                    maxLevel: 10
                                }
                            ]
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Generates a symbiotic response that represents the combination of human and AI thinking
 */
export function generateSymbioticResponse(humanInput, domain) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, openAIClientManager.client.chat.completions.create({
                            model: "gpt-4o",
                            messages: [
                                {
                                    role: "system",
                                    content: "You are part of a Human-AI Symbiosis platform specializing in ".concat(domain, ". \n          Create a response that represents the optimal blend of human intuition and AI processing.\n          Analyze the human input, then generate a response that combines AI's analytical strengths with human-like intuition.\n          Also estimate the relative contributions and overall confidence.\n          Respond with JSON in this format: { \n            'response': string, \n            'humanContribution': number between 0-1, \n            'aiContribution': number between 0-1,\n            'confidenceScore': number between 0-1\n          }")
                                },
                                {
                                    role: "user",
                                    content: humanInput
                                }
                            ],
                            response_format: { type: "json_object" }
                        })];
                case 1:
                    response = _a.sent();
                    result = safeParseJson(response.choices[0].message.content);
                    return [2 /*return*/, {
                            response: result.response || "Unable to generate a symbiotic response at this time.",
                            humanContribution: result.humanContribution || 0.5,
                            aiContribution: result.aiContribution || 0.5,
                            confidenceScore: result.confidenceScore || 0
                        }];
                case 2:
                    error_5 = _a.sent();
                    log("Error generating symbiotic response: ".concat(error_5 instanceof Error ? error_5.message : 'Unknown error'), 'error');
                    return [2 /*return*/, {
                            response: "Unable to generate a symbiotic response at this time.",
                            humanContribution: 0.5,
                            aiContribution: 0.5,
                            confidenceScore: 0
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Maps connections between concepts to visualize in the NeuroSynapse component
 */
export function mapConceptualConnections(domain, concepts) {
    return __awaiter(this, void 0, void 0, function () {
        var conceptsText, response, result, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    conceptsText = concepts.join(", ");
                    return [4 /*yield*/, openAIClientManager.client.chat.completions.create({
                            model: "gpt-4o",
                            messages: [
                                {
                                    role: "system",
                                    content: "You are an AI assistant in a Human-AI Symbiosis platform specializing in ".concat(domain, ".\n          Map the conceptual connections between these concepts: ").concat(conceptsText, ".\n          Create a network of nodes and connections that shows how these concepts relate to each other.\n          Classify each node as either 'human' (cognitive/intuitive concepts), 'ai' (computational/analytical concepts), or 'data' (information nodes).\n          Respond with JSON in this format: {\n            'nodes': [\n              { 'id': string, 'label': string, 'type': 'human'|'ai'|'data', 'strength': number between 0-1 }\n            ],\n            'connections': [\n              { 'source': node_id, 'target': node_id, 'strength': number between 0-1 }\n            ]\n          }\n          Limit to 10-15 nodes and 15-25 connections for visualization clarity.")
                                },
                                {
                                    role: "user",
                                    content: "Map the connections between these concepts in the ".concat(domain, " domain: ").concat(conceptsText)
                                }
                            ],
                            response_format: { type: "json_object" }
                        })];
                case 1:
                    response = _a.sent();
                    result = safeParseJson(response.choices[0].message.content);
                    // Check if we have the expected data structure
                    if (result.nodes && result.connections) {
                        return [2 /*return*/, result];
                    }
                    // Return fallback minimal graph if parsing failed or data is incomplete
                    return [2 /*return*/, {
                            nodes: concepts.map(function (concept, index) { return ({
                                id: "node_".concat(index),
                                label: concept,
                                type: index % 3 === 0 ? 'human' : index % 3 === 1 ? 'ai' : 'data',
                                strength: 0.7
                            }); }),
                            connections: concepts.slice(0, -1).map(function (_, index) { return ({
                                source: "node_".concat(index),
                                target: "node_".concat(index + 1),
                                strength: 0.6
                            }); })
                        }];
                case 2:
                    error_6 = _a.sent();
                    log("Error mapping conceptual connections: ".concat(error_6 instanceof Error ? error_6.message : 'Unknown error'), 'error');
                    // Return fallback minimal graph
                    return [2 /*return*/, {
                            nodes: concepts.map(function (concept, index) { return ({
                                id: "node_".concat(index),
                                label: concept,
                                type: index % 3 === 0 ? 'human' : index % 3 === 1 ? 'ai' : 'data',
                                strength: 0.7
                            }); }),
                            connections: concepts.slice(0, -1).map(function (_, index) { return ({
                                source: "node_".concat(index),
                                target: "node_".concat(index + 1),
                                strength: 0.6
                            }); })
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
