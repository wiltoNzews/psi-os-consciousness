/**
 * Stability Convergence Tracker
 *
 * This module implements the StabilityConvergence(t) validation mechanism for the
 * Inverse Pendulum Formula, allowing us to track, measure, and prove that the stability
 * calculations are actively learning and improving over time.
 *
 * Core logic:
 * StabilityConvergence(t) = lim(n→∞) [|Stability(t) - Stability(t-n)|] → 0
 *
 * This tracks how the stability state converges toward an optimal equilibrium over time,
 * proving that the system is continuously improving its stability calculations based on
 * feedback and historical performance.
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
import { recordInversePendulumOperation } from './meta-learning-validation.js';
// In-memory storage of stability convergence data (would be database in production)
var stabilityConvergenceHistory = [];
/**
 * Record a stability calculation for convergence tracking
 *
 * @param stabilityState Current stability state
 * @param targetStability Target stability score
 * @param energyExpenditure Computational resources used
 * @param timeToStability Time taken to reach stability in ms
 * @param userFeedback Optional user feedback (1-10)
 * @returns Recorded convergence data point
 */
export function recordStabilityCalculation(stabilityState, targetStability, energyExpenditure, timeToStability, userFeedback) {
    var previousPoints = __spreadArray([], stabilityConvergenceHistory, true).sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); });
    var stabilityGap = Math.abs(targetStability - stabilityState.stabilityScore);
    var convergenceRate = null;
    if (previousPoints.length > 0) {
        var previousGap = previousPoints[0].stabilityGap;
        convergenceRate = previousGap > 0 ? (previousGap - stabilityGap) / previousGap : 0;
    }
    var dataPoint = {
        id: uuidv4(),
        timestamp: new Date(),
        stabilityScore: stabilityState.stabilityScore,
        equilibriumIndex: stabilityState.equilibriumIndex,
        adjustmentRate: stabilityState.adjustmentRate,
        chaosLevel: stabilityState.chaosLevel,
        targetStability: targetStability,
        stabilityGap: stabilityGap,
        convergenceRate: convergenceRate,
        energyExpenditure: energyExpenditure,
        timeToStability: timeToStability,
        userFeedback: userFeedback
    };
    // Store in history
    stabilityConvergenceHistory.push(dataPoint);
    // Record in meta-learning framework for broader analysis with enhanced metrics
    recordInversePendulumOperation({
        targetStability: targetStability,
        adjustmentRate: stabilityState.adjustmentRate,
        targetChaosLevel: stabilityState.chaosLevel,
        feedbackSignals: stabilityState.feedbackSignals,
        previousStability: stabilityState.stabilityScore
    }, __assign(__assign({}, stabilityState), { microcorrections: Math.ceil(stabilityState.adjustmentRate * 10), feedbackIntegration: calculateFeedbackIntegration(stabilityState.feedbackSignals), macroBalance: calculateMacroBalance(stabilityState), energyExpenditure: energyExpenditure, timeToStability: timeToStability }), {
        executionTime: timeToStability,
        accuracy: 1 - stabilityGap, // Using inverse of gap as a proxy for accuracy
        resourceUtilization: {
            cpu: energyExpenditure * 0.7, // Estimate CPU usage from energy expenditure
            memory: energyExpenditure * 0.3 // Estimate memory usage from energy expenditure
        },
        systemFeedback: stabilityState.stabilityScore * 10, // Scale to 0-10 range
        userFeedback: userFeedback
    });
    return dataPoint;
}
/**
 * Calculate stability convergence metrics
 *
 * @param timeWindow Optional time window in milliseconds (default: 7 days)
 * @returns Stability convergence result
 */
export function calculateStabilityConvergence(timeWindow) {
    if (timeWindow === void 0) { timeWindow = 7 * 24 * 60 * 60 * 1000; }
    var currentTime = new Date().getTime();
    // Filter for relevant history within time window
    var relevantHistory = stabilityConvergenceHistory.filter(function (point) { return (currentTime - point.timestamp.getTime()) <= timeWindow; });
    if (relevantHistory.length < 3) {
        return createDefaultConvergenceResult('Insufficient data points for convergence analysis');
    }
    // Sort by timestamp (oldest first)
    relevantHistory.sort(function (a, b) { return a.timestamp.getTime() - b.timestamp.getTime(); });
    // Calculate overall convergence
    var initialGap = relevantHistory[0].stabilityGap;
    var finalGap = relevantHistory[relevantHistory.length - 1].stabilityGap;
    var absoluteImprovement = initialGap - finalGap;
    // Scale to 0-1, where 1 means perfect convergence (gap reduced to 0)
    var overallConvergence = initialGap > 0 ?
        Math.min(1, Math.max(0, absoluteImprovement / initialGap)) :
        finalGap === 0 ? 1 : 0;
    // Calculate recent trend (last 1/3 of the data)
    var recentStartIndex = Math.floor(relevantHistory.length * 2 / 3);
    var recentPoints = relevantHistory.slice(recentStartIndex);
    if (recentPoints.length < 2) {
        return createDefaultConvergenceResult('Insufficient recent data points for trend analysis');
    }
    var recentInitialGap = recentPoints[0].stabilityGap;
    var recentFinalGap = recentPoints[recentPoints.length - 1].stabilityGap;
    var recentImprovement = recentInitialGap - recentFinalGap;
    var recentTrend = recentImprovement > 0.01 ? 'improving' :
        recentImprovement < -0.01 ? 'declining' : 'stable';
    // Calculate asymptote distance (distance from theoretical perfect stability)
    var asymptoteDistance = finalGap;
    // Calculate oscillation damping
    var oscillationDamping = calculateOscillationDamping(relevantHistory);
    // Calculate energy and time efficiency
    var energyEfficiency = calculateEnergyEfficiency(relevantHistory);
    var timeEfficiency = calculateTimeEfficiency(relevantHistory);
    // Calculate adaptive capacity
    var adaptiveCapacity = {
        adjustmentRateAdaptation: calculateAdjustmentRateAdaptation(relevantHistory),
        chaosLevelTuning: calculateChaosLevelTuning(relevantHistory),
        stateHistoryUtilization: 0.7 // Default placeholder
    };
    // Calculate statistical significance
    var isStatisticallySignificant = calculateStatisticalSignificance(relevantHistory);
    // Generate recommendations
    var recommendations = generateRecommendations(overallConvergence, recentTrend, asymptoteDistance, oscillationDamping, adaptiveCapacity);
    // Return convergence result
    return {
        id: uuidv4(),
        timestamp: new Date(),
        overallConvergence: overallConvergence,
        recentTrend: recentTrend,
        asymptoteDistance: asymptoteDistance,
        oscillationDamping: oscillationDamping,
        energyEfficiency: energyEfficiency,
        timeEfficiency: timeEfficiency,
        adaptiveCapacity: adaptiveCapacity,
        isStatisticallySignificant: isStatisticallySignificant,
        recommendations: recommendations
    };
}
/**
 * Calculate oscillation damping
 */
function calculateOscillationDamping(history) {
    if (history.length < 4) {
        return 0.5; // Default moderate damping
    }
    // Calculate stability score oscillations
    var oscillations = [];
    for (var i = 1; i < history.length; i++) {
        oscillations.push(Math.abs(history[i].stabilityScore - history[i - 1].stabilityScore));
    }
    if (oscillations.length < 3) {
        return 0.5;
    }
    // Split into first half and second half
    var midpoint = Math.floor(oscillations.length / 2);
    var firstHalf = oscillations.slice(0, midpoint);
    var secondHalf = oscillations.slice(midpoint);
    // Calculate average oscillation amplitude for each half
    var firstHalfAvg = firstHalf.reduce(function (sum, val) { return sum + val; }, 0) / firstHalf.length;
    var secondHalfAvg = secondHalf.reduce(function (sum, val) { return sum + val; }, 0) / secondHalf.length;
    // If second half has lower amplitude, system is damping oscillations
    if (firstHalfAvg === 0) {
        return secondHalfAvg === 0 ? 1 : 0.5;
    }
    // Calculate damping ratio (0 = no damping, 1 = perfect damping)
    var dampingRatio = Math.max(0, Math.min(1, 1 - (secondHalfAvg / firstHalfAvg)));
    return dampingRatio;
}
/**
 * Calculate energy efficiency
 */
function calculateEnergyEfficiency(history) {
    if (history.length < 2) {
        return 0.5; // Default moderate efficiency
    }
    // Compare first and last points
    var firstPoint = history[0];
    var lastPoint = history[history.length - 1];
    var stabilityImprovement = Math.max(0, firstPoint.stabilityGap - lastPoint.stabilityGap);
    var energyExpended = history.reduce(function (sum, point) { return sum + point.energyExpenditure; }, 0);
    if (energyExpended === 0) {
        return 0.5; // Default if no energy data
    }
    // Efficiency is improvement per unit of energy
    var rawEfficiency = stabilityImprovement / energyExpended;
    // Normalize to 0-1 scale (assuming reasonable maximum efficiency)
    var normalizedEfficiency = Math.min(1, rawEfficiency * 10);
    return normalizedEfficiency;
}
/**
 * Calculate time efficiency
 */
function calculateTimeEfficiency(history) {
    if (history.length < 2) {
        return 0.5; // Default moderate efficiency
    }
    // Compare first and last points
    var firstPoint = history[0];
    var lastPoint = history[history.length - 1];
    var stabilityImprovement = Math.max(0, firstPoint.stabilityGap - lastPoint.stabilityGap);
    var timeExpended = history.reduce(function (sum, point) { return sum + point.timeToStability; }, 0);
    if (timeExpended === 0) {
        return 0.5; // Default if no time data
    }
    // Efficiency is improvement per unit of time
    var rawEfficiency = stabilityImprovement / timeExpended;
    // Normalize to 0-1 scale (assuming reasonable maximum efficiency)
    var normalizedEfficiency = Math.min(1, rawEfficiency * 1000); // Scaling factor for milliseconds
    return normalizedEfficiency;
}
/**
 * Calculate adjustment rate adaptation
 */
function calculateAdjustmentRateAdaptation(history) {
    if (history.length < 3) {
        return 0.5; // Default moderate adaptation
    }
    var appropriateAdjustments = 0;
    for (var i = 1; i < history.length; i++) {
        var currentPoint = history[i];
        var previousPoint = history[i - 1];
        // Check if stability gap increased or decreased
        var gapIncreased = currentPoint.stabilityGap > previousPoint.stabilityGap;
        // Check if adjustment rate changed
        var adjustmentRateIncreased = currentPoint.adjustmentRate > previousPoint.adjustmentRate;
        // Appropriate adaptation:
        // 1. If gap increased, adjustment rate should increase (more aggressive correction)
        // 2. If gap decreased, adjustment rate should decrease (more cautious, don't overshoot)
        var isAppropriate = (gapIncreased && adjustmentRateIncreased) ||
            (!gapIncreased && !adjustmentRateIncreased);
        if (isAppropriate) {
            appropriateAdjustments++;
        }
    }
    // Calculate adaptation score (0-1)
    return appropriateAdjustments / (history.length - 1);
}
/**
 * Calculate chaos level tuning
 */
function calculateChaosLevelTuning(history) {
    if (history.length < 3) {
        return 0.5; // Default moderate tuning
    }
    var appropriateTunings = 0;
    for (var i = 1; i < history.length; i++) {
        var currentPoint = history[i];
        var previousPoint = history[i - 1];
        // Check if stability score is too low (system too rigid)
        var tooRigid = previousPoint.equilibriumIndex < -0.3;
        // Check if stability score is too high (system too chaotic)
        var tooChaotic = previousPoint.equilibriumIndex > 0.3;
        // Check if chaos level changed
        var chaosLevelIncreased = currentPoint.chaosLevel > previousPoint.chaosLevel;
        // Appropriate tuning:
        // 1. If too rigid, chaos level should increase
        // 2. If too chaotic, chaos level should decrease
        // 3. If balanced, chaos level should remain similar
        var isAppropriate = (tooRigid && chaosLevelIncreased) ||
            (tooChaotic && !chaosLevelIncreased) ||
            (!tooRigid && !tooChaotic && Math.abs(currentPoint.chaosLevel - previousPoint.chaosLevel) < 0.1);
        if (isAppropriate) {
            appropriateTunings++;
        }
    }
    // Calculate tuning score (0-1)
    return appropriateTunings / (history.length - 1);
}
/**
 * Calculate statistical significance
 */
function calculateStatisticalSignificance(history) {
    if (history.length < 5) {
        return false; // Not enough data
    }
    // Extract stability gaps
    var stabilityGaps = history.map(function (point) { return point.stabilityGap; });
    // Split into first half and second half
    var midpoint = Math.floor(stabilityGaps.length / 2);
    var firstHalf = stabilityGaps.slice(0, midpoint);
    var secondHalf = stabilityGaps.slice(midpoint);
    // Calculate means
    var firstHalfMean = firstHalf.reduce(function (sum, val) { return sum + val; }, 0) / firstHalf.length;
    var secondHalfMean = secondHalf.reduce(function (sum, val) { return sum + val; }, 0) / secondHalf.length;
    // Calculate variances
    var firstHalfVariance = firstHalf.reduce(function (sum, val) { return sum + Math.pow(val - firstHalfMean, 2); }, 0) / firstHalf.length;
    var secondHalfVariance = secondHalf.reduce(function (sum, val) { return sum + Math.pow(val - secondHalfMean, 2); }, 0) / secondHalf.length;
    // Calculate standard errors
    var firstHalfStdError = Math.sqrt(firstHalfVariance / firstHalf.length);
    var secondHalfStdError = Math.sqrt(secondHalfVariance / secondHalf.length);
    // Calculate t-statistic
    var tStatistic = (firstHalfMean - secondHalfMean) /
        Math.sqrt(Math.pow(firstHalfStdError, 2) + Math.pow(secondHalfStdError, 2));
    // Calculate degrees of freedom (approximate)
    var df = firstHalf.length + secondHalf.length - 2;
    // Critical t-value for 95% confidence with the calculated df
    var criticalT = 1.96; // Approximate for df > 30
    // Compare absolute t-statistic with critical value
    return Math.abs(tStatistic) > criticalT;
}
/**
 * Generate recommendations based on convergence analysis
 */
function generateRecommendations(overallConvergence, recentTrend, asymptoteDistance, oscillationDamping, adaptiveCapacity) {
    var recommendations = [];
    // Overall convergence recommendations
    if (overallConvergence < 0.3) {
        recommendations.push('Significantly increase adjustment rate to accelerate convergence');
    }
    else if (overallConvergence < 0.7) {
        recommendations.push('Moderately increase adjustment rate to improve convergence');
    }
    // Recent trend recommendations
    if (recentTrend === 'declining') {
        recommendations.push('Recent negative trend detected - reset to last stable configuration');
    }
    else if (recentTrend === 'stable' && asymptoteDistance > 0.1) {
        recommendations.push('Convergence has plateaued - introduce controlled perturbation to escape local minimum');
    }
    // Asymptote distance recommendations
    if (asymptoteDistance > 0.2) {
        recommendations.push("System remains ".concat((asymptoteDistance * 100).toFixed(1), "% from perfect stability - refine feedback signal processing"));
    }
    // Oscillation damping recommendations
    if (oscillationDamping < 0.5) {
        recommendations.push('Poor oscillation damping detected - decrease adjustment rate to prevent overcorrection');
    }
    // Adaptive capacity recommendations
    if (adaptiveCapacity.adjustmentRateAdaptation < 0.5) {
        recommendations.push('Adjustment rate adaptation is suboptimal - implement more responsive adjustment algorithm');
    }
    if (adaptiveCapacity.chaosLevelTuning < 0.5) {
        recommendations.push('Chaos level tuning is ineffective - implement more precise chaos control mechanism');
    }
    // Ensure we have at least one recommendation
    if (recommendations.length === 0) {
        recommendations.push('Current convergence path is optimal - continue collecting data to refine stability');
    }
    return recommendations;
}
/**
 * Create a default convergence result when insufficient data is available
 */
function createDefaultConvergenceResult(reason) {
    return {
        id: uuidv4(),
        timestamp: new Date(),
        overallConvergence: 0,
        recentTrend: 'stable',
        asymptoteDistance: 1,
        oscillationDamping: 0.5,
        energyEfficiency: 0.5,
        timeEfficiency: 0.5,
        adaptiveCapacity: {
            adjustmentRateAdaptation: 0.5,
            chaosLevelTuning: 0.5,
            stateHistoryUtilization: 0.5
        },
        isStatisticallySignificant: false,
        recommendations: [
            reason,
            'Collect at least 3 data points to enable stability convergence analysis'
        ]
    };
}
/**
 * Get stability convergence history
 *
 * @returns Stability convergence history data points
 */
export function getStabilityConvergenceHistory() {
    return __spreadArray([], stabilityConvergenceHistory, true);
}
/**
 * Clear stability convergence history (for testing purposes)
 */
export function clearStabilityConvergenceHistory() {
    stabilityConvergenceHistory.length = 0;
}
/**
 * Calculate feedback integration score based on feedback signals
 * Measures how well feedback signals are integrated into the system
 * @param feedbackSignals Array of feedback signals
 * @returns Feedback integration score (0-1)
 */
function calculateFeedbackIntegration(feedbackSignals) {
    if (!feedbackSignals || feedbackSignals.length === 0) {
        return 0.5; // Default value when no signals
    }
    // Calculate average weight of feedback signals
    var totalWeight = feedbackSignals.reduce(function (sum, signal) { return sum + (signal.weight || 0.5); }, 0);
    var avgWeight = totalWeight / feedbackSignals.length;
    // Calculate diversity of signal types
    var signalTypes = new Set(feedbackSignals.map(function (signal) { return signal.signalType; }));
    var typeDiversity = Math.min(1, signalTypes.size / 4); // Normalize to 0-1 (4 types is considered diverse)
    // Calculate recency factor - more weight to recent signals
    var sortedSignals = __spreadArray([], feedbackSignals, true).sort(function (a, b) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    var recencyWeight = 0;
    for (var i = 0; i < sortedSignals.length; i++) {
        var position = i / sortedSignals.length; // 0 for most recent, 1 for oldest
        recencyWeight += (1 - position) * (sortedSignals[i].weight || 0.5);
    }
    var recencyFactor = sortedSignals.length > 0 ? recencyWeight / sortedSignals.length : 0.5;
    // Combine factors with weights
    return (avgWeight * 0.3) + (typeDiversity * 0.3) + (recencyFactor * 0.4);
}
/**
 * Calculate macro balance based on stability state
 * Measures the overall system balance
 * @param stabilityState The stability state
 * @returns Macro balance score (0-1)
 */
function calculateMacroBalance(stabilityState) {
    // Extract key metrics from stability state
    var stabilityScore = stabilityState.stabilityScore || 0.5;
    var equilibriumIndex = stabilityState.equilibriumIndex || 0;
    var chaosLevel = stabilityState.chaosLevel || 0.3;
    // Calculate equilibrium factor (closer to 0 is better)
    var equilibriumFactor = 1 - Math.min(1, Math.abs(equilibriumIndex) * 2);
    // Calculate chaos balance (optimal is around 0.3-0.4)
    var optimalChaos = 0.35;
    var chaosBalance = 1 - Math.min(1, Math.abs(chaosLevel - optimalChaos) * 3);
    // Calculate stability factor (higher is better, but too high might indicate rigidity)
    var stabilityFactor = stabilityScore > 0.8
        ? 1 - ((stabilityScore - 0.8) * 2) // Penalize for being too rigid
        : stabilityScore;
    // Combine factors with weights
    return (equilibriumFactor * 0.4) + (chaosBalance * 0.3) + (stabilityFactor * 0.3);
}
