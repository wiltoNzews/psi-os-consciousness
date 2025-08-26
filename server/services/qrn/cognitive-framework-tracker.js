/**
 * Cognitive Framework Tracker
 *
 * This module implements the ValidationMetrics(t) mechanism for the
 * 4W+1H+(X)WHICH(MACRO-OFFSET)(FLOW-ANTI-FLOW) Cognitive Execution Framework,
 * allowing us to track, measure, and prove that the framework is actively
 * learning and improving its decision-making over time.
 *
 * Core logic:
 * ValidationMetrics(t) = ∑(ContextualAccuracy × StrategicFit × Adaptability × OutcomeQuality)
 *
 * This tracks the framework's improvements in contextual awareness, strategic alignment,
 * adaptability, and outcome quality over time.
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
import { recordCognitiveFrameworkOperation } from './meta-learning-validation.js';
// In-memory storage of cognitive framework data (would be database in production)
var cognitiveFrameworkHistory = [];
/**
 * Record a cognitive framework execution for tracking
 *
 * @param contextualElements The 4W+1H context elements
 * @param strategicElements The WHICH strategic elements
 * @param macroOffsetElements The MACRO-OFFSET elements
 * @param flowDynamics The FLOW/ANTI-FLOW dynamics
 * @param frameworkPerformance Performance metrics for the execution
 * @param executionTime Time taken for execution in ms
 * @param userFeedback Optional user feedback (1-10)
 * @returns Recorded framework data point
 */
export function recordCognitiveFrameworkExecution(contextualElements, strategicElements, macroOffsetElements, flowDynamics, frameworkPerformance, executionTime, userFeedback) {
    var dataPoint = {
        id: uuidv4(),
        timestamp: new Date(),
        contextualElements: contextualElements,
        strategicElements: strategicElements,
        macroOffsetElements: macroOffsetElements,
        flowDynamics: flowDynamics,
        frameworkPerformance: frameworkPerformance,
        executionTime: executionTime,
        userFeedback: userFeedback
    };
    // Store in history
    cognitiveFrameworkHistory.push(dataPoint);
    // Record in meta-learning framework for broader analysis
    recordCognitiveFrameworkOperation({
        context: {
            who: contextualElements.who,
            what: contextualElements.what,
            when: contextualElements.when,
            where: contextualElements.where,
            how: contextualElements.how
        },
        strategicLens: {
            lens: strategicElements.lens,
            aspects: strategicElements.aspects
        },
        macroOffset: {
            systemicImplications: macroOffsetElements.systemicImplications,
            offsetFactor: macroOffsetElements.offsetFactor
        },
        flowDynamics: {
            flowRatio: flowDynamics.flowRatio,
            equilibriumState: flowDynamics.equilibriumState
        }
    }, {
        contextualAccuracy: frameworkPerformance.contextualAccuracy,
        strategicFit: frameworkPerformance.strategicFit,
        adaptability: frameworkPerformance.adaptability,
        outcomeQuality: frameworkPerformance.outcomeQuality,
        decisionValue: frameworkPerformance.decisionValue,
        confidenceScore: frameworkPerformance.confidenceScore
    }, {
        accuracy: (frameworkPerformance.contextualAccuracy +
            frameworkPerformance.strategicFit +
            frameworkPerformance.adaptability +
            frameworkPerformance.outcomeQuality) / 4,
        executionTime: executionTime,
        userFeedback: userFeedback
    });
    return dataPoint;
}
/**
 * Calculate cognitive framework validation metrics
 *
 * @param timeWindow Optional time window in milliseconds (default: 7 days)
 * @returns Cognitive framework validation result
 */
export function validateCognitiveFramework(timeWindow) {
    if (timeWindow === void 0) { timeWindow = 7 * 24 * 60 * 60 * 1000; }
    var currentTime = new Date().getTime();
    // Filter for relevant history within time window
    var relevantHistory = cognitiveFrameworkHistory.filter(function (point) { return (currentTime - point.timestamp.getTime()) <= timeWindow; });
    if (relevantHistory.length < 3) {
        return createDefaultValidationResult('Insufficient data points for framework validation');
    }
    // Sort by timestamp (oldest first)
    relevantHistory.sort(function (a, b) { return a.timestamp.getTime() - b.timestamp.getTime(); });
    // Calculate performance metrics with trends
    var performanceMetrics = calculatePerformanceMetrics(relevantHistory);
    // Calculate overall improvement
    var overallImprovement = calculateOverallImprovement(relevantHistory);
    // Calculate dimensional analysis
    var dimensionalAnalysis = calculateDimensionalAnalysis(relevantHistory);
    // Calculate learning dynamics
    var learningDynamics = calculateLearningDynamics(relevantHistory);
    // Calculate statistical significance
    var isStatisticallySignificant = calculateStatisticalSignificance(relevantHistory);
    // Generate recommendations
    var recommendations = generateRecommendations(performanceMetrics, dimensionalAnalysis, learningDynamics, overallImprovement);
    // Return validation result
    return {
        id: uuidv4(),
        timestamp: new Date(),
        overallImprovement: overallImprovement,
        performanceMetrics: performanceMetrics,
        dimensionalAnalysis: dimensionalAnalysis,
        learningDynamics: learningDynamics,
        isStatisticallySignificant: isStatisticallySignificant,
        recommendations: recommendations
    };
}
/**
 * Calculate performance metrics with trends
 */
function calculatePerformanceMetrics(history) {
    if (history.length < 3) {
        return {
            contextualAccuracy: { current: 0, trend: 'stable', learningRate: 0 },
            strategicFit: { current: 0, trend: 'stable', learningRate: 0 },
            adaptability: { current: 0, trend: 'stable', learningRate: 0 },
            outcomeQuality: { current: 0, trend: 'stable', learningRate: 0 }
        };
    }
    // Get the most recent values
    var recent = history[history.length - 1].frameworkPerformance;
    // Calculate trends and learning rates
    return {
        contextualAccuracy: __assign({ current: recent.contextualAccuracy }, calculateMetricTrendAndLearningRate(history.map(function (p) { return p.frameworkPerformance.contextualAccuracy; }))),
        strategicFit: __assign({ current: recent.strategicFit }, calculateMetricTrendAndLearningRate(history.map(function (p) { return p.frameworkPerformance.strategicFit; }))),
        adaptability: __assign({ current: recent.adaptability }, calculateMetricTrendAndLearningRate(history.map(function (p) { return p.frameworkPerformance.adaptability; }))),
        outcomeQuality: __assign({ current: recent.outcomeQuality }, calculateMetricTrendAndLearningRate(history.map(function (p) { return p.frameworkPerformance.outcomeQuality; })))
    };
}
/**
 * Calculate metric trend and learning rate
 */
function calculateMetricTrendAndLearningRate(values) {
    if (values.length < 3) {
        return { trend: 'stable', learningRate: 0 };
    }
    // Calculate linear regression slope
    var xValues = Array.from({ length: values.length }, function (_, i) { return i; });
    var slope = calculateLinearRegressionSlope(xValues, values);
    // Determine trend
    var trend = slope > 0.01 ? 'improving' :
        slope < -0.01 ? 'declining' :
            'stable';
    // Calculate learning rate (absolute slope, normalized to 0-1)
    var learningRate = Math.min(1, Math.abs(slope) * 10);
    return { trend: trend, learningRate: learningRate };
}
/**
 * Calculate linear regression slope
 */
function calculateLinearRegressionSlope(x, y) {
    if (x.length !== y.length || x.length < 2) {
        return 0;
    }
    var n = x.length;
    // Calculate means
    var xMean = x.reduce(function (sum, val) { return sum + val; }, 0) / n;
    var yMean = y.reduce(function (sum, val) { return sum + val; }, 0) / n;
    // Calculate slope
    var numerator = 0;
    var denominator = 0;
    for (var i = 0; i < n; i++) {
        numerator += (x[i] - xMean) * (y[i] - yMean);
        denominator += Math.pow(x[i] - xMean, 2);
    }
    return denominator !== 0 ? numerator / denominator : 0;
}
/**
 * Calculate overall improvement
 */
function calculateOverallImprovement(history) {
    if (history.length < 3) {
        return 0;
    }
    // Calculate composite performance for first and last points
    var firstPoint = history[0];
    var lastPoint = history[history.length - 1];
    var firstComposite = (firstPoint.frameworkPerformance.contextualAccuracy +
        firstPoint.frameworkPerformance.strategicFit +
        firstPoint.frameworkPerformance.adaptability +
        firstPoint.frameworkPerformance.outcomeQuality) / 4;
    var lastComposite = (lastPoint.frameworkPerformance.contextualAccuracy +
        lastPoint.frameworkPerformance.strategicFit +
        lastPoint.frameworkPerformance.adaptability +
        lastPoint.frameworkPerformance.outcomeQuality) / 4;
    // Calculate improvement (-1 to 1 scale)
    return Math.max(-1, Math.min(1, lastComposite - firstComposite));
}
/**
 * Calculate dimensional analysis
 */
function calculateDimensionalAnalysis(history) {
    if (history.length === 0) {
        return {
            strongestDimension: 'contextual',
            weakestDimension: 'outcome',
            balanceFactor: 0.5
        };
    }
    // Get the most recent performance metrics
    var recent = history[history.length - 1].frameworkPerformance;
    // Calculate the strongest and weakest dimensions
    var dimensions = [
        ['contextual', recent.contextualAccuracy],
        ['strategic', recent.strategicFit],
        ['adaptability', recent.adaptability],
        ['outcome', recent.outcomeQuality]
    ];
    dimensions.sort(function (a, b) { return b[1] - a[1]; });
    var strongestDimension = dimensions[0][0];
    var weakestDimension = dimensions[dimensions.length - 1][0];
    // Calculate balance factor (higher = more balanced)
    var values = dimensions.map(function (_a) {
        var _ = _a[0], value = _a[1];
        return value;
    });
    var minValue = Math.min.apply(Math, values);
    var maxValue = Math.max.apply(Math, values);
    var balanceFactor = maxValue > 0 ? minValue / maxValue : 0;
    return {
        strongestDimension: strongestDimension,
        weakestDimension: weakestDimension,
        balanceFactor: balanceFactor
    };
}
/**
 * Calculate learning dynamics
 */
function calculateLearningDynamics(history) {
    if (history.length < 3) {
        return {
            speedOfLearning: 0.5,
            consistencyOfLearning: 0.5,
            transferLearning: 0.5,
            knowledgeRetention: 0.5
        };
    }
    // Calculate speed of learning (how quickly performance improves)
    var speedOfLearning = calculateSpeedOfLearning(history);
    // Calculate consistency of learning (how stable improvements are)
    var consistencyOfLearning = calculateConsistencyOfLearning(history);
    // Calculate transfer learning (how well learning transfers between domains)
    var transferLearning = calculateTransferLearning(history);
    // Calculate knowledge retention (how well insights are retained)
    var knowledgeRetention = calculateKnowledgeRetention(history);
    return {
        speedOfLearning: speedOfLearning,
        consistencyOfLearning: consistencyOfLearning,
        transferLearning: transferLearning,
        knowledgeRetention: knowledgeRetention
    };
}
/**
 * Calculate speed of learning
 */
function calculateSpeedOfLearning(history) {
    if (history.length < 3) {
        return 0.5;
    }
    // Calculate composite performance over time
    var performances = history.map(function (point) {
        var perf = point.frameworkPerformance;
        return (perf.contextualAccuracy + perf.strategicFit + perf.adaptability + perf.outcomeQuality) / 4;
    });
    // Calculate initial slope (first half of data)
    var midpoint = Math.floor(performances.length / 2);
    var xValuesFirstHalf = Array.from({ length: midpoint }, function (_, i) { return i; });
    var yValuesFirstHalf = performances.slice(0, midpoint);
    var initialSlope = calculateLinearRegressionSlope(xValuesFirstHalf, yValuesFirstHalf);
    // Normalize to 0-1 scale (0.1 slope would be very fast learning)
    return Math.min(1, Math.max(0, initialSlope * 10));
}
/**
 * Calculate consistency of learning
 */
function calculateConsistencyOfLearning(history) {
    if (history.length < 3) {
        return 0.5;
    }
    // Calculate composite performance over time
    var performances = history.map(function (point) {
        var perf = point.frameworkPerformance;
        return (perf.contextualAccuracy + perf.strategicFit + perf.adaptability + perf.outcomeQuality) / 4;
    });
    // Calculate variance of differences between consecutive performances
    var differences = [];
    for (var i = 1; i < performances.length; i++) {
        differences.push(performances[i] - performances[i - 1]);
    }
    var meanDifference = differences.reduce(function (sum, val) { return sum + val; }, 0) / differences.length;
    var variance = differences.reduce(function (sum, val) { return sum + Math.pow(val - meanDifference, 2); }, 0) / differences.length;
    // Lower variance = more consistent learning (normalize to 0-1)
    return Math.min(1, Math.max(0, 1 - (variance * 10)));
}
/**
 * Calculate transfer learning
 */
function calculateTransferLearning(history) {
    if (history.length < 5) {
        return 0.5;
    }
    // Group data points by domain
    var domainGroups = {};
    for (var _i = 0, history_1 = history; _i < history_1.length; _i++) {
        var point = history_1[_i];
        var domain = point.contextualElements.where.domain;
        if (!domainGroups[domain]) {
            domainGroups[domain] = [];
        }
        domainGroups[domain].push(point);
    }
    // Only analyze domains with multiple data points
    var eligibleDomains = Object.entries(domainGroups)
        .filter(function (_a) {
        var _ = _a[0], points = _a[1];
        return points.length >= 2;
    })
        .map(function (_a) {
        var domain = _a[0], _ = _a[1];
        return domain;
    });
    if (eligibleDomains.length < 2) {
        return 0.5; // Not enough domains for transfer learning analysis
    }
    // Calculate learning rates for each domain
    var domainLearningRates = {};
    for (var _a = 0, eligibleDomains_1 = eligibleDomains; _a < eligibleDomains_1.length; _a++) {
        var domain = eligibleDomains_1[_a];
        var domainPoints = domainGroups[domain];
        domainPoints.sort(function (a, b) { return a.timestamp.getTime() - b.timestamp.getTime(); });
        // Calculate composite performance for first and last points
        var firstPoint = domainPoints[0];
        var lastPoint = domainPoints[domainPoints.length - 1];
        var firstPerf = firstPoint.frameworkPerformance;
        var lastPerf = lastPoint.frameworkPerformance;
        var firstComposite = (firstPerf.contextualAccuracy + firstPerf.strategicFit +
            firstPerf.adaptability + firstPerf.outcomeQuality) / 4;
        var lastComposite = (lastPerf.contextualAccuracy + lastPerf.strategicFit +
            lastPerf.adaptability + lastPerf.outcomeQuality) / 4;
        // Learning rate is improvement per unit of time
        var timeSpan = (lastPoint.timestamp.getTime() - firstPoint.timestamp.getTime()) / (1000 * 60 * 60); // Hours
        if (timeSpan > 0) {
            domainLearningRates[domain] = (lastComposite - firstComposite) / timeSpan;
        }
        else {
            domainLearningRates[domain] = 0;
        }
    }
    // Calculate temporal sequence of domains
    var domainSequence = [];
    var seenDomains = new Set();
    for (var _b = 0, history_2 = history; _b < history_2.length; _b++) {
        var point = history_2[_b];
        var domain = point.contextualElements.where.domain;
        if (!seenDomains.has(domain) && eligibleDomains.includes(domain)) {
            domainSequence.push(domain);
            seenDomains.add(domain);
        }
    }
    // Calculate transfer learning by comparing learning rates of domains
    // after experience with previous domains
    var totalTransfer = 0;
    var transferCount = 0;
    for (var i = 1; i < domainSequence.length; i++) {
        var previousDomain = domainSequence[i - 1];
        var currentDomain = domainSequence[i];
        // Higher learning rate in later domains indicates good transfer
        if (domainLearningRates[currentDomain] > domainLearningRates[previousDomain]) {
            totalTransfer += 1;
        }
        else if (domainLearningRates[currentDomain] > 0) {
            totalTransfer += 0.5; // Some transfer is happening
        }
        transferCount++;
    }
    return transferCount > 0 ? totalTransfer / transferCount : 0.5;
}
/**
 * Calculate knowledge retention
 */
function calculateKnowledgeRetention(history) {
    if (history.length < 5) {
        return 0.5;
    }
    // Filter for domains that appear multiple times with gaps
    var domainTimestamps = {};
    for (var _i = 0, history_3 = history; _i < history_3.length; _i++) {
        var point = history_3[_i];
        var domain = point.contextualElements.where.domain;
        if (!domainTimestamps[domain]) {
            domainTimestamps[domain] = [];
        }
        domainTimestamps[domain].push(point.timestamp.getTime());
    }
    // Find domains with at least 3 appearances and at least one significant gap
    var domainsWithGaps = [];
    for (var _a = 0, _b = Object.entries(domainTimestamps); _a < _b.length; _a++) {
        var _c = _b[_a], domain = _c[0], timestamps = _c[1];
        if (timestamps.length >= 3) {
            // Sort timestamps
            timestamps.sort(function (a, b) { return a - b; });
            // Check for significant gaps (more than 24 hours)
            var hasSignificantGap = false;
            for (var i = 1; i < timestamps.length; i++) {
                var gap = timestamps[i] - timestamps[i - 1];
                if (gap > 24 * 60 * 60 * 1000) {
                    hasSignificantGap = true;
                    break;
                }
            }
            if (hasSignificantGap) {
                domainsWithGaps.push(domain);
            }
        }
    }
    if (domainsWithGaps.length === 0) {
        return 0.5; // Not enough data for retention analysis
    }
    // Calculate performance before and after gaps for each eligible domain
    var totalRetention = 0;
    var _loop_1 = function (domain) {
        var domainPoints = history.filter(function (p) { return p.contextualElements.where.domain === domain; });
        // Sort by timestamp
        domainPoints.sort(function (a, b) { return a.timestamp.getTime() - b.timestamp.getTime(); });
        // Find significant gaps
        var gaps = []; // [beforeIndex, afterIndex]
        for (var i = 1; i < domainPoints.length; i++) {
            var gap = domainPoints[i].timestamp.getTime() - domainPoints[i - 1].timestamp.getTime();
            if (gap > 24 * 60 * 60 * 1000) {
                gaps.push([i - 1, i]);
            }
        }
        for (var _e = 0, gaps_1 = gaps; _e < gaps_1.length; _e++) {
            var _f = gaps_1[_e], beforeIndex = _f[0], afterIndex = _f[1];
            var beforePoint = domainPoints[beforeIndex];
            var afterPoint = domainPoints[afterIndex];
            // Calculate composite performance before and after gap
            var beforePerf = beforePoint.frameworkPerformance;
            var afterPerf = afterPoint.frameworkPerformance;
            var beforeComposite = (beforePerf.contextualAccuracy + beforePerf.strategicFit +
                beforePerf.adaptability + beforePerf.outcomeQuality) / 4;
            var afterComposite = (afterPerf.contextualAccuracy + afterPerf.strategicFit +
                afterPerf.adaptability + afterPerf.outcomeQuality) / 4;
            // Retention is the ratio of after/before performance (capped at 1)
            var retention = Math.min(1, afterComposite / Math.max(0.1, beforeComposite));
            totalRetention += retention;
        }
    };
    for (var _d = 0, domainsWithGaps_1 = domainsWithGaps; _d < domainsWithGaps_1.length; _d++) {
        var domain = domainsWithGaps_1[_d];
        _loop_1(domain);
    }
    // Calculate average retention across all gaps
    return totalRetention / domainsWithGaps.length;
}
/**
 * Calculate statistical significance
 */
function calculateStatisticalSignificance(history) {
    if (history.length < 5) {
        return false;
    }
    // Calculate composite performance for each point
    var performances = history.map(function (point) {
        var perf = point.frameworkPerformance;
        return (perf.contextualAccuracy + perf.strategicFit + perf.adaptability + perf.outcomeQuality) / 4;
    });
    // Split into first half and second half
    var midpoint = Math.floor(performances.length / 2);
    var firstHalf = performances.slice(0, midpoint);
    var secondHalf = performances.slice(midpoint);
    // Calculate means
    var firstHalfMean = firstHalf.reduce(function (sum, val) { return sum + val; }, 0) / firstHalf.length;
    var secondHalfMean = secondHalf.reduce(function (sum, val) { return sum + val; }, 0) / secondHalf.length;
    // Calculate variances
    var firstHalfVariance = firstHalf.reduce(function (sum, val) { return sum + Math.pow(val - firstHalfMean, 2); }, 0) /
        firstHalf.length;
    var secondHalfVariance = secondHalf.reduce(function (sum, val) { return sum + Math.pow(val - secondHalfMean, 2); }, 0) /
        secondHalf.length;
    // Calculate standard errors
    var firstHalfStdError = Math.sqrt(firstHalfVariance / firstHalf.length);
    var secondHalfStdError = Math.sqrt(secondHalfVariance / secondHalf.length);
    // Calculate t-statistic
    var tStatistic = (secondHalfMean - firstHalfMean) /
        Math.sqrt(Math.pow(firstHalfStdError, 2) + Math.pow(secondHalfStdError, 2));
    // Critical t-value for 95% confidence (approximate for df > 30)
    var criticalT = 1.96;
    // Compare absolute t-statistic with critical value
    return Math.abs(tStatistic) > criticalT;
}
/**
 * Generate recommendations based on framework validation
 */
function generateRecommendations(performanceMetrics, dimensionalAnalysis, learningDynamics, overallImprovement) {
    var recommendations = [];
    // Overall improvement recommendations
    if (overallImprovement < 0) {
        recommendations.push('Framework performance is declining - reset parameters and recalibrate baseline');
    }
    else if (overallImprovement < 0.1) {
        recommendations.push('Minimal overall improvement - increase training frequency and diversity');
    }
    // Metric-specific recommendations
    if (performanceMetrics.contextualAccuracy.trend === 'declining') {
        recommendations.push('Contextual accuracy is declining - enhance 4W+1H element detection and correlation');
    }
    if (performanceMetrics.strategicFit.trend === 'declining') {
        recommendations.push('Strategic fit is declining - refine WHICH lens selection algorithms');
    }
    if (performanceMetrics.adaptability.trend === 'declining') {
        recommendations.push('Adaptability is declining - strengthen MACRO-OFFSET impact assessment');
    }
    if (performanceMetrics.outcomeQuality.trend === 'declining') {
        recommendations.push('Outcome quality is declining - improve FLOW/ANTI-FLOW equilibrium detection');
    }
    // Dimensional balance recommendations
    if (dimensionalAnalysis.balanceFactor < 0.7) {
        recommendations.push("Dimensional imbalance detected - focus training on weakest dimension: ".concat(dimensionalAnalysis.weakestDimension));
    }
    // Learning dynamics recommendations
    if (learningDynamics.speedOfLearning < 0.3) {
        recommendations.push('Slow learning speed detected - implement more aggressive parameter updates');
    }
    if (learningDynamics.consistencyOfLearning < 0.5) {
        recommendations.push('Inconsistent learning detected - stabilize training process with regularization');
    }
    if (learningDynamics.transferLearning < 0.4) {
        recommendations.push('Poor transfer learning detected - implement explicit cross-domain knowledge sharing');
    }
    if (learningDynamics.knowledgeRetention < 0.6) {
        recommendations.push('Weak knowledge retention detected - strengthen memory persistence mechanisms');
    }
    // Ensure we have at least one recommendation
    if (recommendations.length === 0) {
        recommendations.push('Current cognitive framework is learning effectively - continue with diverse domain exposure');
    }
    return recommendations;
}
/**
 * Create a default validation result when insufficient data is available
 */
function createDefaultValidationResult(reason) {
    return {
        id: uuidv4(),
        timestamp: new Date(),
        overallImprovement: 0,
        performanceMetrics: {
            contextualAccuracy: { current: 0.5, trend: 'stable', learningRate: 0 },
            strategicFit: { current: 0.5, trend: 'stable', learningRate: 0 },
            adaptability: { current: 0.5, trend: 'stable', learningRate: 0 },
            outcomeQuality: { current: 0.5, trend: 'stable', learningRate: 0 }
        },
        dimensionalAnalysis: {
            strongestDimension: 'contextual',
            weakestDimension: 'outcome',
            balanceFactor: 0.5
        },
        learningDynamics: {
            speedOfLearning: 0.5,
            consistencyOfLearning: 0.5,
            transferLearning: 0.5,
            knowledgeRetention: 0.5
        },
        isStatisticallySignificant: false,
        recommendations: [
            reason,
            'Collect at least 3 data points to enable cognitive framework validation'
        ]
    };
}
/**
 * Get cognitive framework history
 *
 * @returns Cognitive framework history data points
 */
export function getCognitiveFrameworkHistory() {
    return __spreadArray([], cognitiveFrameworkHistory, true);
}
/**
 * Clear cognitive framework history (for testing purposes)
 */
export function clearCognitiveFrameworkHistory() {
    cognitiveFrameworkHistory.length = 0;
}
