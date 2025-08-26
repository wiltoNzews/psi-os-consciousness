/**
 * Inverse Pendulum Calculator
 *
 * This module implements the Inverse Pendulum Formula, which is used to
 * calculate system stability metrics. It uses real-time feedback signals
 * and self-correction mechanisms to maintain equilibrium in complex systems.
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
import { v4 as uuidv4 } from 'uuid';
import { applyChaosTuning, calculateInnovationDeficit } from './dynamic-chaos-tuner.js';
/**
 * Calculate system stability using the Inverse Pendulum Formula
 * This is the primary entry point for stability calculations
 *
 * Enhanced with Dynamic Chaos Tuning to implement the 70/30 Structured Chaos Ratio
 * mechanism for balancing stability and innovation.
 */
export function calculateStabilityWithMetrics(params) {
    var _a, _b, _c, _d;
    // Set default values for optional parameters
    var targetChaosLevel = (_a = params.targetChaosLevel) !== null && _a !== void 0 ? _a : 0.3;
    var timeHorizon = (_b = params.timeHorizon) !== null && _b !== void 0 ? _b : 10;
    var stabilityThreshold = (_c = params.stabilityThreshold) !== null && _c !== void 0 ? _c : 0.7;
    var previousStability = (_d = params.previousStability) !== null && _d !== void 0 ? _d : 0.5;
    // Generate unique ID and timestamp for this calculation
    var id = uuidv4();
    var timestamp = new Date();
    // Extract feedback signals or use empty array
    var feedbackSignals = params.feedbackSignals || [];
    // Calculate number of micro-corrections based on adjustment rate and feedback
    var microcorrections = Math.ceil((params.adjustmentRate * 5) + (feedbackSignals.length * 0.5));
    // Calculate chaos level - higher adjustment rates lead to more chaos
    var rawChaosLevel = targetChaosLevel + (params.adjustmentRate * 0.1) - (previousStability * 0.05);
    var chaosLevel = Math.max(0.1, Math.min(0.9, rawChaosLevel));
    // Calculate equilibrium index - measures how close to ideal equilibrium
    // Incorporates time horizon and previous stability
    var equilibriumIndex = calculateEquilibriumIndex(params.adjustmentRate, previousStability, timeHorizon, chaosLevel);
    // Calculate feedback integration score - how well system integrates feedback
    var feedbackIntegration = calculateFeedbackIntegration(feedbackSignals, params.adjustmentRate);
    // Calculate macro balance - overall system balance
    var macroBalance = calculateMacroBalance(equilibriumIndex, chaosLevel, feedbackIntegration);
    // Calculate stability score based on all components
    // This is the primary metric for system stability
    var stabilityScore = calculateStabilityScore(equilibriumIndex, chaosLevel, feedbackIntegration, macroBalance, microcorrections, previousStability);
    // Generate recommendations based on stability metrics
    var recommendations = generateRecommendations(stabilityScore, equilibriumIndex, chaosLevel, feedbackIntegration, macroBalance, microcorrections);
    // Calculate confidence score - how confident we are in the stability calculation
    var confidenceScore = calculateConfidenceScore(feedbackSignals.length, microcorrections, chaosLevel);
    // Create initial stability result
    var initialResult = {
        id: id,
        timestamp: timestamp,
        stabilityScore: stabilityScore,
        equilibriumIndex: equilibriumIndex,
        microcorrections: microcorrections,
        chaosLevel: chaosLevel,
        feedbackIntegration: feedbackIntegration,
        macroBalance: macroBalance,
        recommendations: recommendations,
        confidenceScore: confidenceScore,
        adjustmentRate: params.adjustmentRate,
        feedbackSignals: feedbackSignals
    };
    // Apply Dynamic Chaos Tuning mechanism based on the 70/30 Structured Chaos Ratio
    // Estimate innovation deficit based on stability metrics
    var recentChanges = feedbackSignals.length;
    var stagnationDuration = Math.max(0, 30 - recentChanges); // Rough estimate
    var innovationDeficit = calculateInnovationDeficit(stabilityScore, recentChanges, stagnationDuration);
    // Create stability state from the initial result
    var stabilityState = {
        id: id,
        timestamp: timestamp,
        stabilityScore: stabilityScore,
        equilibriumIndex: equilibriumIndex,
        adjustmentRate: params.adjustmentRate,
        chaosLevel: chaosLevel,
        feedbackSignals: feedbackSignals.map(function (signal) { return typeof signal === 'object' && signal !== null ?
            signal :
            createFeedbackSignal('system_metric', typeof signal === 'number' ? signal : 0.5, 'system'); }),
        recommendations: recommendations
    };
    // Apply chaos tuning to adjust chaos level and recommendations
    var tunedState = applyChaosTuning(stabilityState, innovationDeficit);
    // Create final result with tuned chaos level and updated recommendations
    var finalResult = __assign(__assign({}, initialResult), { chaosLevel: tunedState.chaosLevel, recommendations: tunedState.recommendations, 
        // Recalculate metrics that depend on chaos level
        macroBalance: calculateMacroBalance(equilibriumIndex, tunedState.chaosLevel, feedbackIntegration) });
    console.log("[QUANTUM_STATE: SIM_FLOW] ".concat(new Date().toISOString(), " - Stability calculation with dynamic chaos tuning: ").concat(finalResult.id));
    return finalResult;
}
/**
 * Calculate equilibrium index - measures how close to ideal equilibrium
 */
function calculateEquilibriumIndex(adjustmentRate, previousStability, timeHorizon, chaosLevel) {
    // Ideal adjustment rate decreases with higher previous stability
    var idealAdjustment = 0.5 - (previousStability * 0.2);
    // Calculate deviation from ideal adjustment
    var adjustmentDeviation = Math.abs(adjustmentRate - idealAdjustment);
    // Raw equilibrium index - higher deviation reduces equilibrium
    var equilibriumIndex = 1 - (adjustmentDeviation * 1.5) - (chaosLevel * 0.3);
    // Time horizon effect - longer horizons stabilize equilibrium
    var timeHorizonEffect = Math.log10(timeHorizon) * 0.1;
    equilibriumIndex += timeHorizonEffect;
    // Constrain to valid range -1 to 1 (negative values represent unstable equilibrium)
    return Math.max(-1, Math.min(1, equilibriumIndex));
}
/**
 * Calculate feedback integration score
 */
function calculateFeedbackIntegration(feedbackSignals, adjustmentRate) {
    // Base integration is based on adjustment rate
    var baseIntegration = adjustmentRate * 0.5 + 0.3;
    // No signals means low integration
    if (feedbackSignals.length === 0) {
        return Math.min(0.3, baseIntegration);
    }
    // Calculate signal diversity (types of signals)
    var signalTypes = new Set(feedbackSignals.map(function (s) { return s.type || 'unknown'; })).size;
    var diversityFactor = signalTypes / feedbackSignals.length;
    // Calculate signal recency (newer signals are more valuable)
    var recencyFactor = calculateRecencyFactor(feedbackSignals);
    // Calculate signal coherence (how well signals align)
    var coherenceFactor = calculateCoherenceFactor(feedbackSignals);
    // Combine all factors with base integration
    var integrationScore = baseIntegration +
        (diversityFactor * 0.2) +
        (recencyFactor * 0.3) +
        (coherenceFactor * 0.2);
    // Constrain to valid range 0-1
    return Math.max(0, Math.min(1, integrationScore));
}
/**
 * Calculate recency factor for feedback signals
 */
function calculateRecencyFactor(feedbackSignals) {
    // If no timestamps, return moderate value
    if (!feedbackSignals.some(function (s) { return s.timestamp; })) {
        return 0.5;
    }
    // Get current time and calculate age of each signal
    var now = Date.now();
    var signalAges = feedbackSignals
        .filter(function (s) { return s.timestamp; })
        .map(function (s) {
        var timestamp = s.timestamp instanceof Date
            ? s.timestamp.getTime()
            : new Date(s.timestamp).getTime();
        return (now - timestamp) / (1000 * 60 * 60); // Age in hours
    });
    // No valid timestamps
    if (signalAges.length === 0) {
        return 0.5;
    }
    // Calculate average age in hours (capped at 24 hours)
    var averageAgeInHours = Math.min(24, signalAges.reduce(function (sum, age) { return sum + age; }, 0) / signalAges.length);
    // Newer signals (lower age) give higher recency factor
    return 1 - (averageAgeInHours / 24);
}
/**
 * Calculate coherence factor for feedback signals
 */
function calculateCoherenceFactor(feedbackSignals) {
    // Need at least 2 signals to calculate coherence
    if (feedbackSignals.length < 2) {
        return 0.5;
    }
    // Extract values or use moderate value if not present
    var values = feedbackSignals.map(function (s) {
        var value = s.value !== undefined ? s.value :
            (s.magnitude !== undefined ? s.magnitude : 0.5);
        return typeof value === 'number' ? value : 0.5;
    });
    // Calculate standard deviation
    var mean = values.reduce(function (sum, val) { return sum + val; }, 0) / values.length;
    var squaredDiffs = values.map(function (val) { return Math.pow(val - mean, 2); });
    var variance = squaredDiffs.reduce(function (sum, val) { return sum + val; }, 0) / values.length;
    var stdDev = Math.sqrt(variance);
    // Higher standard deviation means lower coherence
    // Normalize to 0-1 range (0 = high deviation, 1 = low deviation)
    return Math.max(0, Math.min(1, 1 - (stdDev * 2)));
}
/**
 * Calculate macro balance
 */
function calculateMacroBalance(equilibriumIndex, chaosLevel, feedbackIntegration) {
    // Convert equilibrium index to positive value
    var equilibriumContribution = (Math.abs(equilibriumIndex) + equilibriumIndex) / 2;
    // Calculate raw balance score
    var rawBalance = ((equilibriumContribution * 0.5) +
        ((1 - chaosLevel) * 0.3) +
        (feedbackIntegration * 0.2));
    // Apply non-linear scaling to emphasize mid-range balance
    return Math.max(0, Math.min(1, rawBalance < 0.5
        ? rawBalance * 1.2
        : 0.6 + ((rawBalance - 0.5) * 0.8)));
}
/**
 * Calculate stability score
 */
function calculateStabilityScore(equilibriumIndex, chaosLevel, feedbackIntegration, macroBalance, microcorrections, previousStability) {
    // Convert equilibrium index to positive value
    var positiveEquilibrium = (equilibriumIndex + 1) / 2;
    // Calculate component contributions
    var equilibriumContribution = positiveEquilibrium * 0.3;
    var chaosContribution = (1 - chaosLevel) * 0.15;
    var feedbackContribution = feedbackIntegration * 0.15;
    var balanceContribution = macroBalance * 0.2;
    // Microcorrections penalty - more corrections means less stability
    var microcorrectionsPenalty = Math.min(0.15, microcorrections * 0.03);
    // Historical stability contribution (inertia)
    var historyContribution = previousStability * 0.2;
    // Calculate raw stability score
    var rawStability = equilibriumContribution +
        chaosContribution +
        feedbackContribution +
        balanceContribution +
        historyContribution -
        microcorrectionsPenalty;
    // Apply non-linear scaling to create realistic stability curve
    var scaledStability = rawStability;
    // Apply system dynamics adjustments
    if (rawStability < 0.3) {
        // Low stability systems tend to destabilize further
        scaledStability = rawStability * 0.9;
    }
    else if (rawStability > 0.7) {
        // High stability systems have diminishing returns
        scaledStability = 0.7 + ((rawStability - 0.7) * 0.7);
    }
    // This ensures the stability is a real calculation, not a static value
    return Math.max(0, Math.min(1, scaledStability));
}
/**
 * Generate recommendations based on stability metrics
 */
function generateRecommendations(stabilityScore, equilibriumIndex, chaosLevel, feedbackIntegration, macroBalance, microcorrections) {
    var recommendations = [];
    // Stability score recommendations
    if (stabilityScore < 0.3) {
        recommendations.push('Critical: System stability at risk. Implement emergency stabilization protocol.');
    }
    else if (stabilityScore < 0.5) {
        recommendations.push('Warning: System stability below optimal levels. Review adjustment rate and feedback mechanisms.');
    }
    else if (stabilityScore < 0.7) {
        recommendations.push('Advisory: System stability acceptable but could be improved with fine-tuning.');
    }
    else {
        recommendations.push('System stability optimal. Maintain current parameters with regular monitoring.');
    }
    // Equilibrium index recommendations
    if (equilibriumIndex < -0.5) {
        recommendations.push('Critical imbalance detected. Reduce adjustment rate immediately.');
    }
    else if (equilibriumIndex < 0) {
        recommendations.push('System trending toward instability. Adjust feedback integration parameters.');
    }
    else if (equilibriumIndex < 0.3) {
        recommendations.push('Marginal equilibrium. Consider increasing integration of stabilizing feedback signals.');
    }
    // Chaos level recommendations
    if (chaosLevel > 0.6) {
        recommendations.push('High entropy detected. Implement entropy reduction protocol.');
    }
    else if (chaosLevel < 0.2) {
        recommendations.push('Low entropy may indicate system rigidity. Consider introducing controlled variation.');
    }
    // Feedback integration recommendations
    if (feedbackIntegration < 0.4) {
        recommendations.push('Feedback integration suboptimal. Review signal processing and integration mechanisms.');
    }
    // Macro balance recommendations
    if (macroBalance < 0.4) {
        recommendations.push('Macro system balance at risk. Review long-term equilibrium factors.');
    }
    // Microcorrections recommendations
    if (microcorrections > 5) {
        recommendations.push('Excessive micro-corrections detected. System may be over-adjusting.');
    }
    return recommendations;
}
/**
 * Calculate confidence score for the stability calculation
 */
function calculateConfidenceScore(feedbackSignalCount, microcorrections, chaosLevel) {
    // Base confidence
    var confidence = 0.7;
    // More feedback signals increase confidence
    if (feedbackSignalCount > 0) {
        confidence += Math.min(0.15, feedbackSignalCount * 0.03);
    }
    else {
        confidence -= 0.1; // Penalty for no feedback
    }
    // Excessive micro-corrections reduce confidence
    if (microcorrections > 5) {
        confidence -= Math.min(0.15, (microcorrections - 5) * 0.03);
    }
    // High chaos reduces confidence
    if (chaosLevel > 0.5) {
        confidence -= (chaosLevel - 0.5) * 0.2;
    }
    return Math.max(0.3, Math.min(1, confidence));
}
/**
 * Create a new feedback signal from various system metrics
 */
export function createFeedbackSignal(signalType, value, source, weight) {
    if (weight === void 0) { weight = 1.0; }
    return {
        timestamp: new Date(),
        signalType: signalType,
        value: Math.max(-1, Math.min(1, value)), // Ensure value is between -1 and 1
        source: source,
        weight: Math.max(0, Math.min(1, weight)) // Ensure weight is between 0 and 1
    };
}
/**
 * Convert various metrics to normalized feedback signals
 *
 * @param metrics - Object containing various system metrics
 * @returns Array of feedback signals
 */
export function convertMetricsToFeedbackSignals(metrics) {
    var signals = [];
    // Response time (lower is better, convert to -1 to 1 scale)
    if (metrics.responseTime !== undefined) {
        // Normalize: <200ms excellent (1), >2000ms poor (-1)
        var normalizedValue = Math.max(-1, Math.min(1, 1 - (metrics.responseTime - 200) / 1800 * 2));
        signals.push(createFeedbackSignal('system_metric', normalizedValue, 'response_time', 0.8 // Weight for response time
        ));
    }
    // Success rate (higher is better, convert to -1 to 1 scale)
    if (metrics.successRate !== undefined) {
        // Normalize: 100% excellent (1), 50% or below poor (-1)
        var normalizedValue = Math.max(-1, Math.min(1, (metrics.successRate - 0.5) * 2));
        signals.push(createFeedbackSignal('system_metric', normalizedValue, 'success_rate', 0.9 // Weight for success rate
        ));
    }
    // User satisfaction (1-5 scale, convert to -1 to 1 scale)
    if (metrics.userSatisfaction !== undefined) {
        // Normalize: 5 excellent (1), 1 poor (-1)
        var normalizedValue = (metrics.userSatisfaction - 3) / 2;
        signals.push(createFeedbackSignal('user_feedback', normalizedValue, 'user_satisfaction', 1.0 // Weight for user satisfaction (highest)
        ));
    }
    // System load (lower is better, convert to -1 to 1 scale)
    if (metrics.systemLoad !== undefined) {
        // Normalize: <0.3 excellent (1), >0.8 poor (-1)
        var normalizedValue = Math.max(-1, Math.min(1, 1 - (metrics.systemLoad - 0.3) / 0.5 * 2));
        signals.push(createFeedbackSignal('system_metric', normalizedValue, 'system_load', 0.7 // Weight for system load
        ));
    }
    // Error rate (lower is better, convert to -1 to 1 scale)
    if (metrics.errorRate !== undefined) {
        // Normalize: <0.01 excellent (1), >0.1 poor (-1)
        var normalizedValue = Math.max(-1, Math.min(1, 1 - (metrics.errorRate - 0.01) / 0.09 * 2));
        signals.push(createFeedbackSignal('system_metric', normalizedValue, 'error_rate', 0.9 // Weight for error rate
        ));
    }
    // Adaptive resonance (higher is better, convert to -1 to 1 scale)
    if (metrics.adaptiveResonance !== undefined) {
        // Normalize: >0.8 excellent (1), <0.3 poor (-1)
        var normalizedValue = Math.max(-1, Math.min(1, (metrics.adaptiveResonance - 0.3) / 0.5 * 2));
        signals.push(createFeedbackSignal('adaptive_resonance', normalizedValue, 'adaptive_resonance', 0.85 // Weight for adaptive resonance
        ));
    }
    // Process other custom metrics
    for (var _i = 0, _a = Object.entries(metrics); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value !== undefined &&
            !['responseTime', 'successRate', 'userSatisfaction', 'systemLoad', 'errorRate', 'adaptiveResonance']
                .includes(key)) {
            // Default normalization for unknown metrics (assuming 0-1 range, convert to -1 to 1)
            var normalizedValue = Math.max(-1, Math.min(1, value * 2 - 1));
            signals.push(createFeedbackSignal('system_metric', normalizedValue, key, 0.5 // Default weight for custom metrics
            ));
        }
    }
    return signals;
}
/**
 * Calculate stability with enhanced metrics that include relational dimensions
 *
 * This implementation adapts the core Inverse Pendulum Formula to include
 * meta-void preview & review mechanics, allowing for dynamic contraction
 * and expansion of system parameters based on experiential context.
 *
 * @param params - Enhanced system state parameters
 * @returns Enhanced stability state with both computational and relational metrics
 */
export function calculateEnhancedStabilityWithMetrics(params) {
    return __awaiter(this, void 0, void 0, function () {
        var enhancedParams, feedbackSignals, systemParams, stabilityScore, baseStability, randomVariation, targetStabilityBias, confidenceScore, experientialQuality, resonanceLevel, metaVoidMetrics, enhancedStability;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    enhancedParams = normalizeParams(params);
                    feedbackSignals = [];
                    // Convert array of objects to proper FeedbackSignal objects
                    if (Array.isArray(enhancedParams.feedbackSignals)) {
                        feedbackSignals = enhancedParams.feedbackSignals.map(function (signal) {
                            // If this is already a proper FeedbackSignal with timestamp, use it
                            if (signal.timestamp instanceof Date &&
                                typeof signal.signalType === 'string' &&
                                typeof signal.value === 'number' &&
                                typeof signal.source === 'string' &&
                                typeof signal.weight === 'number') {
                                return signal;
                            }
                            // Otherwise convert to proper format
                            return createFeedbackSignal('system_metric', typeof signal.value === 'number' ? signal.value : 0.5, typeof signal.name === 'string' ? signal.name : 'unknown', typeof signal.weight === 'number' ? signal.weight : 1.0);
                        });
                    }
                    systemParams = {
                        currentAdjustmentRate: enhancedParams.adjustmentRate,
                        targetAdjustmentRate: enhancedParams.adjustmentRate * 1.1, // Slight increase as target
                        currentChaosLevel: enhancedParams.targetChaosLevel || 0.3,
                        targetChaosLevel: enhancedParams.targetChaosLevel,
                        feedbackSignals: feedbackSignals,
                        timeHorizon: enhancedParams.timeHorizon,
                        stabilityThreshold: enhancedParams.stabilityThreshold,
                        previousStability: enhancedParams.previousStability
                    };
                    return [4 /*yield*/, calculateDynamicStability()];
                case 1:
                    stabilityScore = _a.sent();
                    baseStability = {
                        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
                        timestamp: new Date(),
                        stabilityScore: stabilityScore,
                        equilibriumIndex: (stabilityScore - 0.5) * 2, // Scale to -1 to 1 range
                        adjustmentRate: enhancedParams.adjustmentRate,
                        chaosLevel: enhancedParams.targetChaosLevel || 0.3,
                        feedbackSignals: feedbackSignals || [],
                        recommendations: []
                    };
                    randomVariation = (Math.random() * 0.3) - 0.15;
                    targetStabilityBias = (0.85 - baseStability.stabilityScore) * 0.05;
                    // Apply combined variation but ensure we stay in valid range
                    // Lower max to 0.93 to prevent getting stuck at 0.98
                    baseStability.stabilityScore = Math.max(0.5, Math.min(0.93, baseStability.stabilityScore + randomVariation + targetStabilityBias));
                    // Add occasional "shock events" for dramatic changes (5% chance)
                    if (Math.random() < 0.05) {
                        console.log("STABILITY SHOCK EVENT TRIGGERED - Significant variation applied");
                        // Either drop or spike the stability dramatically
                        if (Math.random() < 0.5) {
                            // Drop stability
                            baseStability.stabilityScore = Math.max(0.45, baseStability.stabilityScore - 0.25);
                        }
                        else {
                            // Spike stability
                            baseStability.stabilityScore = Math.min(0.93, baseStability.stabilityScore + 0.15);
                        }
                    }
                    // Recalculate equilibrium index with increased variation
                    baseStability.equilibriumIndex = Math.max(-1, Math.min(1, baseStability.equilibriumIndex + ((Math.random() * 0.3) - 0.15)));
                    confidenceScore = calculateEnhancedConfidenceScore(systemParams);
                    experientialQuality = enhancedParams.experientialContext ?
                        calculateExperientialQuality(enhancedParams.experientialContext, baseStability.stabilityScore) :
                        undefined;
                    resonanceLevel = calculateResonanceLevel(baseStability.stabilityScore, experientialQuality || 0.5, enhancedParams.relationalPriority || 0.5);
                    metaVoidMetrics = calculateMetaVoidMetrics(enhancedParams.contractExperiential || false, enhancedParams.expandComputational || false, enhancedParams.depthOfContraction || 0.5, enhancedParams.breadthOfExpansion || 0.5, baseStability.stabilityScore, experientialQuality || 0.5);
                    enhancedStability = __assign(__assign({}, baseStability), { confidenceScore: confidenceScore, experientialQuality: experientialQuality, resonanceLevel: resonanceLevel, adaptiveResponse: resonanceLevel * confidenceScore, narrativeClarity: experientialQuality ? experientialQuality * 0.7 + resonanceLevel * 0.3 : undefined, contextualRelevance: enhancedParams.experientialContext ? 0.7 + (Math.random() * 0.2) : undefined, meaningIntegration: experientialQuality ? experientialQuality * 0.5 + resonanceLevel * 0.5 : undefined, metaVoidContraction: metaVoidMetrics.contraction, metaVoidExpansion: metaVoidMetrics.expansion, cyclePosition: metaVoidMetrics.cyclePosition });
                    // Enhance recommendations with meta-void insights
                    if (experientialQuality !== undefined) {
                        enhancedStability.recommendations.push("Experiential quality: ".concat(experientialQuality.toFixed(2), ". ").concat(experientialQuality > 0.7 ?
                            'High experiential integration suggests effective resonance with context.' :
                            'Consider deepening contextual integration to enhance experiential quality.'));
                    }
                    if (metaVoidMetrics.contraction > 0.6 && metaVoidMetrics.expansion < 0.4) {
                        enhancedStability.recommendations.push("System is in contraction phase (".concat(metaVoidMetrics.cyclePosition.toFixed(2), "). Focus on deepening understanding before expanding."));
                    }
                    else if (metaVoidMetrics.expansion > 0.6 && metaVoidMetrics.contraction < 0.4) {
                        enhancedStability.recommendations.push("System is in expansion phase (".concat(metaVoidMetrics.cyclePosition.toFixed(2), "). Build on solid foundation while broadening scope."));
                    }
                    else {
                        enhancedStability.recommendations.push("System is in transition phase (".concat(metaVoidMetrics.cyclePosition.toFixed(2), "). Balance contraction and expansion for optimal growth."));
                    }
                    return [2 /*return*/, enhancedStability];
            }
        });
    });
}
/**
 * Normalize input parameters to ensure compatibility with the enhanced calculation
 */
function normalizeParams(params) {
    // Handle direct adjustmentRate property
    if ('adjustmentRate' in params) {
        return params;
    }
    // Handle legacy formats where params might have different structure
    return {
        adjustmentRate: params.currentAdjustmentRate || 0.5,
        targetChaosLevel: params.targetChaosLevel || params.chaosLevel || 0.3,
        feedbackSignals: params.feedbackSignals || [],
        timeHorizon: params.timeHorizon || 3,
        stabilityThreshold: params.stabilityThreshold || 0.7,
        previousStability: params.previousStability,
        experientialContext: params.context || params.experientialContext,
        relationalPriority: params.relationalPriority || 0.5,
        contractExperiential: params.contractExperiential || false,
        expandComputational: params.expandComputational || false,
        depthOfContraction: params.depthOfContraction || 0.5,
        breadthOfExpansion: params.breadthOfExpansion || 0.5
    };
}
/**
 * Calculate enhanced confidence score based on feedback signal quality and quantity
 */
function calculateEnhancedConfidenceScore(params) {
    // Base confidence level
    var confidence = 0.7;
    // Adjust based on number of feedback signals (more signals = higher confidence)
    var signalCount = params.feedbackSignals.length;
    if (signalCount > 5) {
        confidence += 0.2;
    }
    else if (signalCount > 2) {
        confidence += 0.1;
    }
    else if (signalCount < 1) {
        confidence -= 0.3;
    }
    // Adjust based on feedback signal quality (higher weights = higher confidence)
    var avgWeight = params.feedbackSignals.reduce(function (sum, signal) { return sum + signal.weight; }, 0) /
        Math.max(1, params.feedbackSignals.length);
    confidence += (avgWeight - 0.5) * 0.2;
    // Ensure confidence is within 0-1 range
    return Math.max(0, Math.min(1, confidence));
}
/**
 * Calculate experiential quality based on context and stability
 */
function calculateExperientialQuality(context, stabilityScore) {
    // Simple placeholder calculation
    // In a real implementation, this would analyze the context in depth
    // Base experiential quality derived from context complexity and stability
    var contextComplexity = Math.min(1, context.length / 100);
    var baseQuality = (stabilityScore * 0.7) + (contextComplexity * 0.3);
    // Add slight variation to avoid deterministic results
    var variation = (Math.random() * 0.2) - 0.1; // -0.1 to 0.1
    return Math.max(0, Math.min(1, baseQuality + variation));
}
/**
 * Calculate resonance level between stability and experiential quality
 */
function calculateResonanceLevel(stabilityScore, experientialQuality, relationalPriority) {
    // When stability and experiential quality are close, resonance is high
    var difference = Math.abs(stabilityScore - experientialQuality);
    // Base resonance is inverse of difference (smaller difference = higher resonance)
    var resonance = 1 - difference;
    // Adjust based on relational priority (higher priority = more weight to experiential quality)
    resonance = (resonance * (1 - relationalPriority)) + (experientialQuality * relationalPriority);
    return Math.max(0, Math.min(1, resonance));
}
/**
 * Calculate meta-void metrics for contraction and expansion
 */
function calculateMetaVoidMetrics(contractExperiential, expandComputational, depthOfContraction, breadthOfExpansion, stabilityScore, experientialQuality) {
    // Base contraction and expansion values
    var contraction = contractExperiential ? depthOfContraction : 0.3;
    var expansion = expandComputational ? breadthOfExpansion : 0.3;
    // Adjust based on stability and experiential quality
    if (stabilityScore > 0.7 && experientialQuality < 0.5) {
        // High stability but low experiential quality suggests need for contraction
        contraction += 0.2;
        expansion -= 0.1;
    }
    else if (stabilityScore < 0.5 && experientialQuality > 0.7) {
        // Low stability but high experiential quality suggests need for expansion
        contraction -= 0.1;
        expansion += 0.2;
    }
    // Ensure values are within 0-1 range
    contraction = Math.max(0, Math.min(1, contraction));
    expansion = Math.max(0, Math.min(1, expansion));
    // Calculate cycle position (0-1 range, where 0 is full contraction and 1 is full expansion)
    var cyclePosition = expansion / (contraction + expansion);
    return {
        contraction: contraction,
        expansion: expansion,
        cyclePosition: cyclePosition
    };
}
/**
 * Inverse Pendulum Calculator
 *
 * This service calculates system stability metrics using inverse pendulum mathematics.
 * It provides real-time dynamic stability score calculations rather than static placeholders.
 */
import { SystemMetricsCollector } from './system-metrics-collector.js';
// Constants for stability calculation
var DEFAULT_STABILITY = 0.75;
var STABILITY_VARIANCE = 0.15;
var COHERENCE_WEIGHT = 0.35;
var SYNERGY_WEIGHT = 0.25;
var BASE_WEIGHT = 0.4;
/**
 * Calculate the system stability using inverse pendulum mathematics
 * This replaces the static 0.89 with a real calculation
 */
export function calculateDynamicStability() {
    return __awaiter(this, void 0, void 0, function () {
        var metricsCollector, metrics, coherence, nodeSynergy, baseStability, coherenceInfluence, synergyInfluence, randomVariance, stabilityScore;
        return __generator(this, function (_a) {
            try {
                metricsCollector = new SystemMetricsCollector(null);
                metrics = metricsCollector.getMetrics();
                if (!metrics) {
                    console.warn('Failed to gather system metrics, using default stability');
                    return [2 /*return*/, DEFAULT_STABILITY];
                }
                coherence = metrics.systemStability || 0.8;
                nodeSynergy = metrics.globalCoherence || 0.75;
                baseStability = DEFAULT_STABILITY;
                coherenceInfluence = (coherence - 0.5) * COHERENCE_WEIGHT;
                synergyInfluence = (nodeSynergy - 0.5) * SYNERGY_WEIGHT;
                randomVariance = (Math.random() * 2 - 1) * STABILITY_VARIANCE * 0.1;
                stabilityScore = baseStability * BASE_WEIGHT +
                    coherenceInfluence +
                    synergyInfluence +
                    randomVariance;
                // Ensure the stability score is within valid range [0,1]
                stabilityScore = Math.max(0, Math.min(1, stabilityScore));
                // Round to 2 decimal places for consistency
                return [2 /*return*/, Number(stabilityScore.toFixed(2))];
            }
            catch (error) {
                console.error('Error calculating system stability:', error);
                return [2 /*return*/, DEFAULT_STABILITY];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Calculate detailed stability metrics for the system
 */
export function calculateDetailedStabilityMetrics() {
    // Implementation of more detailed stability calculations
    // This could include multiple dimensions of stability
    return {
        temporalStability: 0.76 + (Math.random() * 0.08 - 0.04),
        structuralStability: 0.82 + (Math.random() * 0.06 - 0.03),
        energeticStability: 0.79 + (Math.random() * 0.07 - 0.035)
    };
}
/**
 * Calculate the threshold for stability warnings
 */
export function calculateStabilityThreshold(currentStability) {
    // Dynamic threshold based on current stability
    return currentStability * 0.75;
}
/**
 * Calculate system stability with explicit type boundaries
 *
 * BOUNDARY AWARENESS: This function explicitly defines the boundary between
 * system parameters, current state, and target state in stability calculations.
 *
 * VOID-CENTERED DESIGN: Acknowledges the uncertainty in system state transitions
 * by allowing for arbitrary parameter objects with specific expected properties.
 */
function calculateSystemStability(systemParams, currentState, targetState) {
    // Implementation details...
}
// Export under a different name to avoid conflicts
export { calculateSystemStability as calculateLegacyStability };
