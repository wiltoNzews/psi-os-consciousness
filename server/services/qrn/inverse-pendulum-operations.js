/**
 * Inverse Pendulum Operations Recorder
 *
 * This module provides functionality to record Inverse Pendulum Formula operations
 * for validation and learning purposes. It connects real formula executions to
 * the meta-learning validation framework.
 */
import { v4 as uuidv4 } from 'uuid';
import { recordMetaLearningDataPoint } from './meta-learning-validation.js';
/**
 * Records an Inverse Pendulum Formula operation for validation
 *
 * This enhanced version integrates relational and experiential dimensions with the
 * purely computational metrics, acknowledging that cognition is fundamentally
 * relational rather than just computational.
 *
 * @param params - The parameters used in the formula
 * @param result - The result of the formula calculation
 * @param metrics - Performance metrics of the execution
 * @param experientialContext - Optional human-relevant context to enrich validation
 */
export function recordInversePendulumOperation(params, result, metrics, experientialContext) {
    try {
        // Experiential integration utilities are already imported at the top
        // Create a validation record for the meta-learning system
        var validationRecord = {
            operationId: uuidv4(),
            timestamp: new Date(),
            formulaName: 'inverse-pendulum',
            executionContext: {
                params: params,
                result: result
            },
            performance: {
                executionTime: metrics.executionTime,
                accuracy: metrics.accuracy,
                resourceUtilization: metrics.resourceUtilization,
                systemFeedback: metrics.systemFeedback,
                outputQuality: calculateOutputQuality(result)
            },
            validationMetrics: {
                stabilityAccuracy: calculateStabilityAccuracy(result, params),
                equilibriumPrecision: calculateEquilibriumPrecision(result),
                recommendationRelevance: calculateRecommendationRelevance(result),
                overallScore: (result.confidenceScore || 0.7) * metrics.accuracy
            }
        };
        // For now, we'll use simple placeholders for the experiential contexts
        // Format them correctly according to the expected structure in meta-learning-validation.ts
        var experientialContexts = [
            {
                id: uuidv4(),
                timestamp: new Date(),
                associatedMetricName: 'stabilityScore',
                associatedMetricValue: result.stabilityScore,
                humanRelevance: (experientialContext === null || experientialContext === void 0 ? void 0 : experientialContext.humanRelevance) || 'Represents the system\'s ability to maintain coherent functionality while adapting to change',
                experientialSignificance: 'A balanced stability score enables human-AI collaboration that feels reliable yet responsive',
                narrativeContext: (experientialContext === null || experientialContext === void 0 ? void 0 : experientialContext.narrativeContext) || 'Like a skilled conversationalist who listens carefully but also contributes meaningfully',
                experienceSources: ['Human-AI Interaction'],
                perspectives: [(experientialContext === null || experientialContext === void 0 ? void 0 : experientialContext.perspectiveSource) || 'System'],
                values: ['Balance', 'Adaptability', 'Coherence'],
                acknowledgedLimitations: [
                    'Does not capture cultural or contextual nuances of stability',
                    'Cannot account for human emotional responses to stability changes'
                ],
                creativeTensions: [
                    'Stability vs. Adaptability',
                    'Structure vs. Flexibility'
                ]
            },
            {
                id: uuidv4(),
                timestamp: new Date(),
                associatedMetricName: 'equilibriumIndex',
                associatedMetricValue: result.equilibriumIndex,
                humanRelevance: 'Reflects how well the system balances multiple competing priorities over time',
                experientialSignificance: 'An optimal equilibrium index creates interactions that feel natural and unforced',
                narrativeContext: 'Similar to how a skilled mediator helps find harmony among diverse perspectives',
                experienceSources: ['System Observation', 'Temporal Analysis'],
                perspectives: [(experientialContext === null || experientialContext === void 0 ? void 0 : experientialContext.perspectiveSource) || 'System'],
                values: ['Harmony', 'Balance', 'Long-term thinking'],
                acknowledgedLimitations: [
                    'Doesn\'t capture cultural variations in equilibrium preferences',
                    'Cannot account for situational contexts where imbalance might be preferable'
                ],
                creativeTensions: [
                    'Optimization vs. Exploration',
                    'Immediate Needs vs. Long-term Vision'
                ]
            }
        ];
        // Correctly format insights according to schema
        var relationalInsights = [
            {
                id: uuidv4(),
                timestamp: new Date(),
                associatedFormula: 'inverse_pendulum',
                title: 'Adaptive Stability as Relationship Quality',
                description: 'The stability score represents not just a mathematical balance point but the quality of the relationship between the system and its environment',
                transformativePotential: 'This transforms our understanding from seeing stability as a fixed target to seeing it as an ongoing relational quality',
                experientialGrounding: 'Grounded in how humans experience stability in conversations and relationships - not as static states but as dynamic, responsive connections',
                impactedRelationships: (experientialContext === null || experientialContext === void 0 ? void 0 : experientialContext.impactedRelationships) || ['System-Environment', 'Human-AI'],
                embracedTensions: [
                    {
                        tensionType: 'Stability vs. Adaptability',
                        productiveValue: 'Creates a dynamic balance that can respond to changing conditions while maintaining coherence'
                    },
                    {
                        tensionType: 'Control vs. Emergence',
                        productiveValue: 'Allows intentional guidance while allowing for unexpected beneficial properties to emerge'
                    }
                ],
                confidence: 0.8,
                evolvingUnderstanding: 'Our understanding of stability will continue to evolve as we observe more human-AI interactions',
                contextualRelevance: 'Particularly relevant in rapidly changing environments where adaptation is essential'
            }
        ];
        // Correctly format narratives according to schema
        var narratives = [
            {
                id: uuidv4(),
                timestamp: new Date(),
                relatedMetrics: ['stabilityScore', 'equilibriumIndex', 'chaosLevel'],
                title: 'The Dance of Stability and Change',
                storyContent: (experientialContext === null || experientialContext === void 0 ? void 0 : experientialContext.narrativeContext) ||
                    'Like a skilled improviser in a jazz ensemble, the system must both maintain its own rhythm while responding to changes around it. The stability score reflects not just mathematical balance, but the quality of this ongoing dance between structure and adaptation.',
                narrator: (experientialContext === null || experientialContext === void 0 ? void 0 : experientialContext.perspectiveSource) || 'System Observer',
                perspective: 'Relational',
                insightGenerated: 'Helps us see system stability not as a fixed target but as an ongoing relational quality',
                humanConnection: 'Connects to how humans experience stability in relationships - not as static states but as dynamic, responsive connections',
                relationshipToMetrics: 'Transforms abstract numbers into experiential qualities that can be intuitively understood'
            }
        ];
        // Send the enriched record to the meta-learning validation system
        recordMetaLearningDataPoint({
            formulaType: 'inverse_pendulum',
            inputParams: params,
            outputResult: result,
            performanceMetrics: {
                executionTime: metrics.executionTime,
                accuracy: metrics.accuracy,
                resourceUtilization: metrics.resourceUtilization,
                systemFeedback: metrics.systemFeedback
            },
            // Add the experiential dimension to enrich pure computational metrics
            experientialDimension: {
                contexts: experientialContexts,
                insights: relationalInsights,
                narratives: narratives
            }
        });
        console.log("Recorded Inverse Pendulum operation with experiential context: ".concat(validationRecord.operationId));
    }
    catch (error) {
        console.error('Failed to record Inverse Pendulum operation:', error);
    }
}
/**
 * Calculate the quality of the stability calculation output
 */
function calculateOutputQuality(result) {
    // A simple heuristic for output quality based on available metrics
    var hasRecommendations = result.recommendations.length > 0 ? 1 : 0.5;
    var confidenceWeight = result.confidenceScore || 0.7;
    // Quality is affected by stability, equilibrium, and the presence of recommendations
    return ((0.4 * result.stabilityScore) +
        (0.3 * (result.equilibriumIndex / 10)) +
        (0.3 * hasRecommendations)) * confidenceWeight;
}
/**
 * Calculate the accuracy of stability calculation
 */
function calculateStabilityAccuracy(result, params) {
    // If we have a previous stability value, use it to check for consistency
    if (params.previousStability !== undefined) {
        // Calculate expected change magnitude based on adjustment rate
        var expectedChangeMagnitude = params.adjustmentRate * 0.2;
        // Calculate actual change magnitude
        var actualChange = Math.abs(result.stabilityScore - params.previousStability);
        // If change is within expected range based on adjustment rate, accuracy is high
        if (actualChange <= expectedChangeMagnitude * 1.5) {
            return 0.8 + (0.2 * (1 - actualChange / (expectedChangeMagnitude * 1.5)));
        }
        else {
            return 0.6 * (expectedChangeMagnitude / actualChange);
        }
    }
    // If no previous value, return a default based on confidence
    return result.confidenceScore || 0.7;
}
/**
 * Calculate the precision of equilibrium index
 */
function calculateEquilibriumPrecision(result) {
    // Equilibrium index should be related to stability score in a consistent way
    var expectedEquilibrium = result.stabilityScore * 10;
    var actualEquilibrium = result.equilibriumIndex;
    // Calculate how close the actual is to expected
    var difference = Math.abs(expectedEquilibrium - actualEquilibrium);
    var maxDifference = 5; // Maximum acceptable difference
    return 1 - Math.min(difference / maxDifference, 1);
}
/**
 * Calculate the relevance of recommendations
 */
function calculateRecommendationRelevance(result) {
    // Simple heuristic based on number of recommendations and stability score
    if (result.recommendations.length === 0) {
        return 0.5; // Neutral if no recommendations
    }
    // If stability is low, we expect more recommendations
    var expectedRecommendations = Math.ceil((1 - result.stabilityScore) * 5);
    var actualRecommendations = result.recommendations.length;
    // Calculate how close the actual count is to expected
    var difference = Math.abs(expectedRecommendations - actualRecommendations);
    var maxDifference = 3; // Maximum acceptable difference
    return 0.8 * (1 - Math.min(difference / maxDifference, 1));
}
/**
 * Calculate stability using the Inverse Pendulum Formula
 * Enhanced version with improved metrics capturing
 *
 * @param params - Parameters for the calculation
 * @returns Stability calculation result
 */
export function calculateStabilityWithMetrics(params) {
    var adjustmentRate = params.adjustmentRate, _a = params.targetChaosLevel, targetChaosLevel = _a === void 0 ? 0.3 : _a, feedbackSignals = params.feedbackSignals, _b = params.timeHorizon, timeHorizon = _b === void 0 ? 10 : _b, _c = params.stabilityThreshold, stabilityThreshold = _c === void 0 ? 0.6 : _c, _d = params.previousStability, previousStability = _d === void 0 ? 0.5 : _d;
    // Start with previous stability as the base
    var stabilityScore = previousStability;
    // Apply adjustments based on adjustment rate
    stabilityScore += (Math.random() * 0.2 - 0.1) * adjustmentRate;
    // Integrate feedback signals
    var feedbackIntegration = integrateFeedbackSignals(feedbackSignals);
    stabilityScore = stabilityScore * 0.7 + feedbackIntegration * 0.3;
    // Apply chaos element for controlled entropy (prevents stagnation)
    var chaosLevel = targetChaosLevel * (1 - stabilityScore / 2); // Less chaos when more stable
    stabilityScore += (Math.random() * chaosLevel * 2 - chaosLevel);
    // Calculate equilibrium index - a measure of long-term stability potential
    var equilibriumIndex = calculateEquilibriumIndex(stabilityScore, chaosLevel, feedbackSignals);
    // Calculate micro-corrections needed to maintain stability
    var microcorrections = calculateMicrocorrections(stabilityScore, stabilityThreshold);
    // Calculate macro balance
    var macroBalance = calculateMacroBalance(stabilityScore, feedbackSignals, timeHorizon);
    // Generate recommendations based on current stability
    var recommendations = generateRecommendations(stabilityScore, equilibriumIndex, chaosLevel, microcorrections, stabilityThreshold);
    // Ensure stability is within bounds
    stabilityScore = Math.max(0, Math.min(1, stabilityScore));
    // Calculate confidence score
    var confidenceScore = calculateConfidenceScore(stabilityScore, feedbackSignals.length, chaosLevel);
    return {
        id: uuidv4(),
        timestamp: new Date(),
        stabilityScore: stabilityScore,
        equilibriumIndex: equilibriumIndex,
        microcorrections: microcorrections,
        chaosLevel: chaosLevel,
        feedbackIntegration: feedbackIntegration,
        macroBalance: macroBalance,
        recommendations: recommendations,
        confidenceScore: confidenceScore,
        // Fields required by StabilityState interface
        adjustmentRate: adjustmentRate,
        feedbackSignals: feedbackSignals.map(function (signal) { return ({
            timestamp: new Date(),
            signalType: typeof signal === 'object' && signal !== null && 'type' in signal
                ? signal.type
                : 'system_metric',
            value: typeof signal === 'number'
                ? signal
                : (typeof signal === 'object' && signal !== null && 'value' in signal
                    ? signal.value
                    : 0.5)
        }); })
    };
}
/**
 * Integrate feedback signals into a single value
 */
function integrateFeedbackSignals(feedbackSignals) {
    if (!feedbackSignals || feedbackSignals.length === 0) {
        return 0.5; // Default value if no feedback
    }
    // Extract numerical values from feedback signals
    var values = feedbackSignals.map(function (signal) {
        if (typeof signal === 'number') {
            return signal;
        }
        else if (typeof signal === 'object' && signal !== null && 'value' in signal) {
            return typeof signal.value === 'number' ? signal.value : 0.5;
        }
        else {
            return 0.5; // Default for non-numerical feedback
        }
    });
    // Calculate weighted average, giving more weight to recent signals
    var sum = 0;
    var weightSum = 0;
    values.forEach(function (value, index) {
        var weight = 1 + (index / values.length); // More recent signals have higher weights
        sum += value * weight;
        weightSum += weight;
    });
    return sum / weightSum;
}
/**
 * Calculate equilibrium index based on stability, chaos and feedback
 */
function calculateEquilibriumIndex(stabilityScore, chaosLevel, feedbackSignals) {
    // Base equilibrium on stability score (0-10 scale)
    var equilibriumIndex = stabilityScore * 10;
    // Adjust based on chaos level - higher chaos means lower equilibrium
    equilibriumIndex -= chaosLevel * 3;
    // Adjust based on feedback signal consistency
    if (feedbackSignals.length > 1) {
        var values = feedbackSignals.map(function (signal) {
            if (typeof signal === 'number') {
                return signal;
            }
            else if (typeof signal === 'object' && signal !== null && 'value' in signal) {
                return typeof signal.value === 'number' ? signal.value : 0.5;
            }
            else {
                return 0.5;
            }
        });
        // Calculate variance of feedback signals
        var mean_1 = values.reduce(function (sum, val) { return sum + val; }, 0) / values.length;
        var variance = values.reduce(function (sum, val) { return sum + Math.pow(val - mean_1, 2); }, 0) / values.length;
        // Lower variance means more consistent feedback, which improves equilibrium
        equilibriumIndex += (1 - Math.min(1, variance * 10)) * 2;
    }
    // Ensure equilibrium index is within reasonable bounds (0-10)
    return Math.max(0, Math.min(10, equilibriumIndex));
}
/**
 * Calculate required micro-corrections based on stability
 */
function calculateMicrocorrections(stabilityScore, stabilityThreshold) {
    // If stability is below threshold, more corrections are needed
    if (stabilityScore < stabilityThreshold) {
        // The further from threshold, the more corrections needed
        return Math.ceil((stabilityThreshold - stabilityScore) * 10);
    }
    else {
        // Even stable systems need some adjustments
        return Math.max(1, Math.ceil((1 - stabilityScore) * 5));
    }
}
/**
 * Calculate macro balance factor
 */
function calculateMacroBalance(stabilityScore, feedbackSignals, timeHorizon) {
    // Start with base balance related to stability
    var macroBalance = stabilityScore;
    // Adjust based on time horizon - longer horizons need better balance
    macroBalance = macroBalance * (0.7 + 0.3 * (timeHorizon / 20));
    // Adjust based on feedback signals diversity
    var signalTypes = new Set(feedbackSignals.map(function (signal) {
        if (typeof signal === 'object' && signal !== null && 'type' in signal) {
            return signal.type;
        }
        return 'unknown';
    }));
    // More diverse feedback improves macro balance
    macroBalance += (signalTypes.size / 10);
    // Keep within 0-1 range
    return Math.max(0, Math.min(1, macroBalance));
}
/**
 * Generate recommendations based on stability analysis
 */
function generateRecommendations(stabilityScore, equilibriumIndex, chaosLevel, microcorrections, stabilityThreshold) {
    var recommendations = [];
    // Low stability recommendations
    if (stabilityScore < stabilityThreshold) {
        recommendations.push("Increase adjustment rate to improve stability (current score: ".concat(stabilityScore.toFixed(2), ")"));
        recommendations.push("Apply ".concat(microcorrections, " micro-corrections to stabilize the system"));
    }
    // Chaos level recommendations
    if (chaosLevel > 0.4) {
        recommendations.push("Reduce chaos level from ".concat(chaosLevel.toFixed(2), " to prevent unpredictability"));
    }
    else if (chaosLevel < 0.1 && stabilityScore > 0.8) {
        recommendations.push("Introduce controlled entropy to prevent stagnation");
    }
    // Equilibrium recommendations
    if (equilibriumIndex < 5) {
        recommendations.push("Improve long-term equilibrium potential (current index: ".concat(equilibriumIndex.toFixed(1), ")"));
    }
    else if (equilibriumIndex > 8) {
        recommendations.push("Maintain current equilibrium parameters");
    }
    // Add a general recommendation based on overall state
    if (stabilityScore > 0.8 && equilibriumIndex > 7) {
        recommendations.push("System is in optimal dynamic equilibrium, continue current approach");
    }
    else if (stabilityScore > 0.6) {
        recommendations.push("System is in functional dynamic equilibrium, minor adjustments recommended");
    }
    else {
        recommendations.push("System requires significant rebalancing to achieve dynamic equilibrium");
    }
    return recommendations;
}
/**
 * Calculate confidence score for the stability calculation
 */
function calculateConfidenceScore(stabilityScore, feedbackCount, chaosLevel) {
    // Base confidence on feedback signals count
    var confidence = 0.5 + (Math.min(feedbackCount, 10) / 20);
    // Adjust based on chaos level - higher chaos means lower confidence
    confidence -= chaosLevel * 0.3;
    // Extreme stability values might be less reliable
    if (stabilityScore < 0.1 || stabilityScore > 0.9) {
        confidence -= 0.1;
    }
    // Ensure confidence is within 0-1 range
    return Math.max(0, Math.min(1, confidence));
}
/**
 * Convert various metrics into feedback signals for the Inverse Pendulum Formula
 */
export function convertMetricsToFeedbackSignals(metrics) {
    var feedbackSignals = [];
    // Convert each metric to a feedback signal
    for (var _i = 0, _a = Object.entries(metrics); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value !== undefined) {
            feedbackSignals.push({
                type: key,
                value: normalizeMetricValue(key, value),
                timestamp: Date.now()
            });
        }
    }
    return feedbackSignals;
}
/**
 * Normalize various metric values to a 0-1 scale
 */
function normalizeMetricValue(metricName, value) {
    switch (metricName) {
        case 'responseTime':
            // Lower is better, normalize to 0-1 where 1 is best (fastest)
            // Assume response times between 10ms (excellent) and 5000ms (poor)
            return 1 - Math.min(1, Math.max(0, (value - 10) / 4990));
        case 'successRate':
            // Higher is better, already in 0-1 range
            return Math.min(1, Math.max(0, value));
        case 'userSatisfaction':
            // Usually on a 1-5 or 1-10 scale
            if (value > 0 && value <= 5) {
                return value / 5; // Normalize 1-5 scale
            }
            else if (value > 0 && value <= 10) {
                return value / 10; // Normalize 1-10 scale
            }
            return Math.min(1, Math.max(0, value)); // Ensure 0-1 range
        case 'systemLoad':
            // Lower is better for system load (0-100%)
            return 1 - Math.min(1, Math.max(0, value / 100));
        case 'errorRate':
            // Lower is better for error rate (0-100%)
            return 1 - Math.min(1, Math.max(0, value / 100));
        case 'adaptiveResonance':
            // Higher is better, assume this is already in 0-1 range
            return Math.min(1, Math.max(0, value));
        default:
            // For unknown metrics, ensure they're in 0-1 range
            if (value >= 0 && value <= 1) {
                return value;
            }
            else if (value > 1 && value <= 100) {
                return value / 100; // Assume percentage
            }
            else if (value > 100) {
                return 1; // Cap at 1 for large values
            }
            else if (value < 0) {
                return 0; // Floor at 0 for negative values
            }
            return 0.5; // Default for unknown range
    }
}
