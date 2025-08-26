/**
 * AI Service Integration with Meta-Learning Components
 *
 * This module connects the AI service with the meta-learning components,
 * including the Inverse Pendulum Stability Tracker, to feed real operational
 * data into the mathematical validation frameworks.
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
import { v4 as uuidv4 } from 'uuid';
import { confidenceToStability, calculateTargetStability, recordStabilityDataPoint } from '../services/qrn/inverse-pendulum-tracker.js';
import { systemIntegrationAdapter } from '../services/SystemIntegrationAdapter.js';
/**
 * AI task complexity levels
 */
export var TaskComplexity;
(function (TaskComplexity) {
    TaskComplexity[TaskComplexity["SIMPLE"] = 0.3] = "SIMPLE";
    TaskComplexity[TaskComplexity["MODERATE"] = 0.5] = "MODERATE";
    TaskComplexity[TaskComplexity["COMPLEX"] = 0.7] = "COMPLEX";
    TaskComplexity[TaskComplexity["VERY_COMPLEX"] = 0.9] = "VERY_COMPLEX";
})(TaskComplexity || (TaskComplexity = {}));
/**
 * AI task importance levels
 */
export var TaskImportance;
(function (TaskImportance) {
    TaskImportance[TaskImportance["LOW"] = 0.3] = "LOW";
    TaskImportance[TaskImportance["MEDIUM"] = 0.5] = "MEDIUM";
    TaskImportance[TaskImportance["HIGH"] = 0.7] = "HIGH";
    TaskImportance[TaskImportance["CRITICAL"] = 0.9] = "CRITICAL";
})(TaskImportance || (TaskImportance = {}));
/**
 * Process and record text analysis outcome for meta-learning
 *
 * @param text Text that was analyzed
 * @param result Analysis result object
 * @param context Task context information
 */
export function processTextAnalysisOutcome(text_1, result_1) {
    return __awaiter(this, arguments, void 0, function (text, result, context) {
        var taskId, complexity, importance, targetStability, actualStability, resultVector, targetVector;
        if (context === void 0) { context = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    taskId = context.taskId || uuidv4();
                    complexity = context.complexity || calculateTextComplexity(text);
                    importance = context.importance || TaskImportance.MEDIUM;
                    targetStability = calculateTargetStability(complexity, importance);
                    actualStability = confidenceToStability(result.confidence || 0.5);
                    resultVector = generateSimpleTextVector(result.insight || '');
                    targetVector = generateExpectedVector(text, context.domain || 'general');
                    // Record stability data point for inverse pendulum tracking
                    return [4 /*yield*/, recordStabilityDataPoint(targetStability, actualStability, resultVector, targetVector)];
                case 1:
                    // Record stability data point for inverse pendulum tracking
                    _a.sent();
                    // Log this processing event
                    console.log("Processed text analysis outcome for task ".concat(taskId, ":"));
                    console.log("- Target stability: ".concat(targetStability.toFixed(4)));
                    console.log("- Actual stability: ".concat(actualStability.toFixed(4)));
                    // Emit event for other system components
                    systemIntegrationAdapter.emit('ai_task_processed', {
                        taskId: taskId,
                        type: 'text_analysis',
                        complexity: complexity,
                        importance: importance,
                        targetStability: targetStability,
                        actualStability: actualStability,
                        result: {
                            confidence: result.confidence,
                            timestamp: result.timestamp
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Process and record symbiotic response outcome for meta-learning
 *
 * @param humanInput Original human input
 * @param result Symbiotic response result
 * @param context Task context information
 */
export function processSymbioticResponseOutcome(humanInput_1, result_1) {
    return __awaiter(this, arguments, void 0, function (humanInput, result, context) {
        var taskId, complexity, importance, humanContribution, aiContribution, contributionFactor, adjustedImportance, targetStability, actualStability, resultVector, targetVector;
        if (context === void 0) { context = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    taskId = context.taskId || uuidv4();
                    complexity = context.complexity || calculateTextComplexity(humanInput);
                    importance = context.importance || TaskImportance.MEDIUM;
                    humanContribution = result.humanContribution || 0.5;
                    aiContribution = result.aiContribution || 0.5;
                    contributionFactor = aiContribution / (humanContribution + aiContribution);
                    adjustedImportance = importance * (1 + (contributionFactor - 0.5));
                    targetStability = calculateTargetStability(complexity, adjustedImportance);
                    actualStability = confidenceToStability(result.confidenceScore || 0.5);
                    resultVector = generateSimpleTextVector(result.response || '');
                    targetVector = generateExpectedVector(humanInput, context.domain || 'general');
                    // Record stability data point
                    return [4 /*yield*/, recordStabilityDataPoint(targetStability, actualStability, resultVector, targetVector)];
                case 1:
                    // Record stability data point
                    _a.sent();
                    // Log this processing event
                    console.log("Processed symbiotic response outcome for task ".concat(taskId, ":"));
                    console.log("- Target stability: ".concat(targetStability.toFixed(4)));
                    console.log("- Actual stability: ".concat(actualStability.toFixed(4)));
                    console.log("- Human/AI ratio: ".concat(humanContribution, "/").concat(aiContribution));
                    // Emit event for other system components
                    systemIntegrationAdapter.emit('ai_task_processed', {
                        taskId: taskId,
                        type: 'symbiotic_response',
                        complexity: complexity,
                        importance: adjustedImportance,
                        targetStability: targetStability,
                        actualStability: actualStability,
                        humanContribution: humanContribution,
                        aiContribution: aiContribution,
                        result: {
                            confidenceScore: result.confidenceScore,
                            timestamp: new Date()
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Calculate text complexity based on length and content
 *
 * @param text Text to analyze
 * @returns Complexity score (0-1)
 */
function calculateTextComplexity(text) {
    // Simple calculation based on text length
    // In a production system, this would use more sophisticated metrics
    // such as readability scores, topic complexity, etc.
    var length = text.length;
    var complexityScore = 0;
    // Length-based component (longer text is typically more complex)
    if (length < 100) {
        complexityScore += 0.2;
    }
    else if (length < 500) {
        complexityScore += 0.4;
    }
    else if (length < 1000) {
        complexityScore += 0.6;
    }
    else if (length < 2000) {
        complexityScore += 0.8;
    }
    else {
        complexityScore += 1.0;
    }
    // Basic content analysis (check for complex terms, technical words, etc.)
    var complexTerms = [
        'algorithm', 'quantum', 'neural', 'cognitive', 'inference',
        'statistical', 'cryptography', 'theoretical', 'methodology',
        'framework', 'implementation', 'architecture'
    ];
    var termCount = 0;
    for (var _i = 0, complexTerms_1 = complexTerms; _i < complexTerms_1.length; _i++) {
        var term = complexTerms_1[_i];
        if (text.toLowerCase().includes(term)) {
            termCount++;
        }
    }
    // Add complexity based on presence of complex terms
    var termComplexity = Math.min(1.0, termCount / 10);
    complexityScore = (complexityScore + termComplexity) / 2;
    // Return final complexity score capped between 0.3 and 0.9
    return Math.max(0.3, Math.min(0.9, complexityScore));
}
/**
 * Generate a simple vector representation of text for similarity comparison
 * This is a very basic implementation - in a production system, this would
 * use proper embeddings from the AI model
 *
 * @param text Text to vectorize
 * @param dimensions Number of dimensions for the vector
 * @returns Simple vector representation
 */
function generateSimpleTextVector(text, dimensions) {
    if (dimensions === void 0) { dimensions = 10; }
    var vector = new Array(dimensions).fill(0);
    var normalizedText = text.toLowerCase();
    // Generate a simple hash-based vector
    for (var i = 0; i < normalizedText.length; i++) {
        var char = normalizedText.charCodeAt(i);
        var bucket = char % dimensions;
        vector[bucket] += char / 128; // Normalize to roughly 0-1 range
    }
    // Normalize the vector
    var magnitude = Math.sqrt(vector.reduce(function (sum, val) { return sum + val * val; }, 0));
    if (magnitude > 0) {
        for (var i = 0; i < vector.length; i++) {
            vector[i] /= magnitude;
        }
    }
    return vector;
}
/**
 * Generate an expected vector based on text and domain
 *
 * @param text Original text
 * @param domain Domain context
 * @param dimensions Number of dimensions for the vector
 * @returns Expected vector for comparison
 */
function generateExpectedVector(text, domain, dimensions) {
    // In a production system, this would retrieve an expected embedding
    // based on historical successful responses for similar queries
    if (domain === void 0) { domain = 'general'; }
    if (dimensions === void 0) { dimensions = 10; }
    // For now, we'll create a simple domain-influenced vector
    var baseVector = generateSimpleTextVector(text, dimensions);
    var domainVector = generateSimpleTextVector(domain, dimensions);
    // Blend the vectors (60% text, 40% domain influence)
    var blendedVector = baseVector.map(function (val, i) {
        return val * 0.6 + domainVector[i] * 0.4;
    });
    // Normalize the blended vector
    var magnitude = Math.sqrt(blendedVector.reduce(function (sum, val) { return sum + val * val; }, 0));
    if (magnitude > 0) {
        for (var i = 0; i < blendedVector.length; i++) {
            blendedVector[i] /= magnitude;
        }
    }
    return blendedVector;
}
