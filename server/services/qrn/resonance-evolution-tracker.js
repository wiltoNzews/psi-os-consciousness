/**
 * Resonance Evolution Tracker
 *
 * This module implements the tracking and validation mechanism for the
 * Synaptic Resonance Factor Evolution calculations. It allows us to track,
 * measure, and prove that the resonance between system components is
 * actively learning and improving over time.
 *
 * Core logic:
 * ResonanceEvolution(t) = ∑(ResonanceScore(i,t) - ResonanceScore(i,t-1)) / Count(i)
 *
 * This tracks how effectively the resonance between components improves
 * over time, proving that the system is continuously learning to optimize
 * inter-component interactions.
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { v4 as uuidv4 } from 'uuid';
// In-memory store for resonance history (in a production environment, use a database)
var resonanceHistoryStore = new Map();
/**
 * Generate a unique key for a component pair
 */
function getPairKey(sourceId, targetId, context) {
    return "".concat(sourceId, ":").concat(targetId, ":").concat(context);
}
/**
 * Record a resonance measurement
 *
 * @param metric The resonance metric to record
 * @returns Resonance evolution point with updated calculations
 */
export function recordResonanceMeasurement(metric) {
    var pairKey = getPairKey(metric.sourceId, metric.targetId, metric.context || 'default');
    // Get existing history or create new
    var history = resonanceHistoryStore.get(pairKey) || [];
    // Get previous resonance score
    var previousMeasurement = history.length > 0 ? history[history.length - 1] : null;
    var previousResonance = previousMeasurement ? previousMeasurement.currentResonance : metric.resonanceScore;
    // Calculate resonance change
    var resonanceChange = metric.resonanceScore - previousResonance;
    // Calculate evolution rate (change per iteration)
    var iterationCount = history.length + 1;
    var evolutionRate = resonanceChange / (iterationCount > 1 ? iterationCount : 1);
    // Create new evolution point
    var evolutionPoint = {
        id: uuidv4(),
        timestamp: metric.timestamp,
        sourceId: metric.sourceId,
        targetId: metric.targetId,
        context: metric.context || 'default',
        currentResonance: metric.resonanceScore,
        previousResonance: previousResonance,
        resonanceChange: resonanceChange,
        evolutionRate: evolutionRate,
        iterationCount: iterationCount,
        resonanceHistory: __spreadArray(__spreadArray([], history.map(function (h) { return ({
            timestamp: h.timestamp,
            resonanceScore: h.currentResonance
        }); }), true), [
            {
                timestamp: metric.timestamp,
                resonanceScore: metric.resonanceScore
            }
        ], false)
    };
    // Update history
    history = __spreadArray(__spreadArray([], history, true), [evolutionPoint], false);
    // Keep only the last 50 measurements to prevent memory issues
    if (history.length > 50) {
        history = history.slice(history.length - 50);
    }
    // Update store
    resonanceHistoryStore.set(pairKey, history);
    return evolutionPoint;
}
/**
 * Get resonance evolution for a specific component pair
 *
 * @param sourceId Source component ID
 * @param targetId Target component ID
 * @param context Optional context
 * @returns The most recent resonance evolution point
 */
export function getResonanceEvolution(sourceId, targetId, context) {
    if (context === void 0) { context = 'default'; }
    var pairKey = getPairKey(sourceId, targetId, context);
    var history = resonanceHistoryStore.get(pairKey) || [];
    if (history.length === 0) {
        return null;
    }
    return history[history.length - 1];
}
/**
 * Calculate and validate the overall resonance evolution across all components
 *
 * @param timeWindow Optional time window in milliseconds (only consider data within this time window)
 * @returns Comprehensive resonance evolution validation
 */
export function validateResonanceEvolution(timeWindow) {
    // Get all tracked component pairs
    var allPairs = [];
    for (var _i = 0, _a = resonanceHistoryStore.values(); _i < _a.length; _i++) {
        var history_1 = _a[_i];
        if (history_1.length > 0) {
            allPairs.push(history_1[history_1.length - 1]);
        }
    }
    if (allPairs.length === 0) {
        // Return default result if no data
        return {
            id: uuidv4(),
            timestamp: new Date(),
            overallEvolution: 0,
            evolutionTrend: 'stable',
            learningEfficiency: 0,
            pairwiseAnalysis: [],
            highestEvolution: {
                sourceId: '',
                targetId: '',
                evolutionRate: 0
            },
            lowestEvolution: {
                sourceId: '',
                targetId: '',
                evolutionRate: 0
            },
            recommendations: [
                'No resonance data available yet. Record measurements to start tracking evolution.'
            ]
        };
    }
    // Calculate overall evolution
    var overallEvolution = allPairs.reduce(function (sum, pair) { return sum + pair.resonanceChange; }, 0) / allPairs.length;
    // Determine trend
    var evolutionTrend = overallEvolution > 0.01 ? 'improving' :
        overallEvolution < -0.01 ? 'declining' : 'stable';
    // Calculate learning efficiency
    // This measures how quickly resonance improves relative to the number of iterations
    var learningEfficiency = allPairs.reduce(function (sum, pair) {
        var efficiency = pair.resonanceChange / (pair.iterationCount > 1 ? Math.log(pair.iterationCount) : 1);
        return sum + efficiency;
    }, 0) / allPairs.length;
    // Analyze individual pairs
    var pairwiseAnalysis = allPairs.map(function (pair) { return ({
        sourceId: pair.sourceId,
        targetId: pair.targetId,
        evolutionRate: pair.evolutionRate,
        trend: pair.resonanceChange > 0.01 ? 'improving' :
            pair.resonanceChange < -0.01 ? 'declining' : 'stable'
    }); });
    // Find highest and lowest evolution rates
    var highestEvolution = pairwiseAnalysis[0];
    var lowestEvolution = pairwiseAnalysis[0];
    for (var _b = 0, pairwiseAnalysis_1 = pairwiseAnalysis; _b < pairwiseAnalysis_1.length; _b++) {
        var pair = pairwiseAnalysis_1[_b];
        if (pair.evolutionRate > highestEvolution.evolutionRate) {
            highestEvolution = pair;
        }
        if (pair.evolutionRate < lowestEvolution.evolutionRate) {
            lowestEvolution = pair;
        }
    }
    // Generate recommendations
    var recommendations = [];
    if (evolutionTrend === 'declining') {
        recommendations.push('Overall resonance is declining. Review and optimize communication between components.');
    }
    if (lowestEvolution.evolutionRate < -0.05) {
        recommendations.push("Poor resonance evolution between ".concat(lowestEvolution.sourceId, " and ").concat(lowestEvolution.targetId, ". Consider recalibrating interaction parameters."));
    }
    if (highestEvolution.evolutionRate > 0.05) {
        recommendations.push("Strong resonance improvement between ".concat(highestEvolution.sourceId, " and ").concat(highestEvolution.targetId, ". Consider applying similar patterns to other component interactions."));
    }
    if (recommendations.length === 0) {
        recommendations.push('Resonance evolution is stable. Continue monitoring for changes.');
    }
    return {
        id: uuidv4(),
        timestamp: new Date(),
        overallEvolution: overallEvolution,
        evolutionTrend: evolutionTrend,
        learningEfficiency: learningEfficiency,
        pairwiseAnalysis: pairwiseAnalysis,
        highestEvolution: highestEvolution,
        lowestEvolution: lowestEvolution,
        recommendations: recommendations
    };
}
/**
 * Calculate the integration factor for a component
 * This measures how well a component integrates with the overall system
 *
 * @param componentId The ID of the component to evaluate
 * @returns Integration factor (0-1 scale)
 */
export function calculateIntegrationFactor(componentId) {
    // Find all resonance pairs involving this component
    var relevantPairs = [];
    for (var _i = 0, _a = resonanceHistoryStore.keys(); _i < _a.length; _i++) {
        var pairKey = _a[_i];
        if (pairKey.startsWith("".concat(componentId, ":")) || pairKey.includes(":".concat(componentId, ":"))) {
            var history_2 = resonanceHistoryStore.get(pairKey) || [];
            if (history_2.length > 0) {
                relevantPairs.push(history_2[history_2.length - 1]);
            }
        }
    }
    if (relevantPairs.length === 0) {
        return 0.5; // Default value if no data
    }
    // Calculate average resonance
    var averageResonance = relevantPairs.reduce(function (sum, pair) {
        // If this component is the source, use the resonance as is
        // If it's the target, use the resonance but weighted slightly differently
        var isSource = pair.sourceId === componentId;
        var weightedResonance = isSource ? pair.currentResonance : pair.currentResonance * 0.9;
        return sum + weightedResonance;
    }, 0) / relevantPairs.length;
    // Calculate stability of resonance
    var resonanceVariance = relevantPairs.reduce(function (sum, pair) {
        var variance = Math.pow(pair.currentResonance - averageResonance, 2);
        return sum + variance;
    }, 0) / relevantPairs.length;
    // Calculate trend factor
    var trendFactor = relevantPairs.reduce(function (sum, pair) { return sum + pair.resonanceChange; }, 0) / relevantPairs.length;
    // Calculate integration factor combining average resonance and stability
    // Higher resonance and lower variance (more stable) leads to better integration
    var stabilityFactor = Math.max(0, 1 - resonanceVariance * 10);
    var baseIntegration = averageResonance * 0.7 + stabilityFactor * 0.3;
    // Add trend bonus/penalty
    var trendAdjustment = trendFactor * 2; // Amplify trend impact
    // Final integration factor (ensure it's between 0 and 1)
    return Math.max(0, Math.min(1, baseIntegration + trendAdjustment));
}
/**
 * Get recommendations for optimizing resonance between components
 *
 * @param sourceId Source component ID
 * @param targetId Target component ID
 * @returns Array of specific recommendations
 */
export function getResonanceOptimizationRecommendations(sourceId, targetId) {
    var evolution = getResonanceEvolution(sourceId, targetId);
    if (!evolution) {
        return [
            'No resonance data available yet. Record measurements to generate recommendations.'
        ];
    }
    var recommendations = [];
    // Check resonance level
    if (evolution.currentResonance < 0.3) {
        recommendations.push('Critical resonance mismatch detected. Consider fundamental redesign of interaction patterns.');
    }
    else if (evolution.currentResonance < 0.5) {
        recommendations.push('Poor resonance levels. Analyze interaction data format and communication frequency.');
    }
    else if (evolution.currentResonance < 0.7) {
        recommendations.push('Moderate resonance. Fine-tune communication protocols and data transformations.');
    }
    else {
        recommendations.push('Strong resonance. Maintain current integration patterns.');
    }
    // Check evolution trend
    if (evolution.resonanceChange < -0.05) {
        recommendations.push('Resonance is actively degrading. Identify recent changes that might have caused the decline.');
    }
    else if (evolution.resonanceChange < -0.01) {
        recommendations.push('Slight resonance decline observed. Monitor closely for further degradation.');
    }
    else if (evolution.resonanceChange > 0.05) {
        recommendations.push('Significant resonance improvement. Document recent changes for application to other components.');
    }
    else if (evolution.resonanceChange > 0.01) {
        recommendations.push('Gradual resonance improvement. Continue current optimization approach.');
    }
    // Check iteration count
    if (evolution.iterationCount < 5) {
        recommendations.push('Limited measurement data available. Collect more interaction data for better analysis.');
    }
    else if (evolution.iterationCount > 20 && Math.abs(evolution.resonanceChange) < 0.01) {
        recommendations.push('Resonance has stabilized after multiple iterations. Consider more aggressive optimization techniques.');
    }
    return recommendations;
}
