/**
 * Foresight Validation Tracker
 *
 * This module implements the ValidationMetrics(t) mechanism for the
 * Meta-Void Preview & Review Formula, allowing us to track, measure, and prove
 * that the formula is actively learning and improving its foresight capabilities.
 *
 * Core logic:
 * ForesightAccuracy(t) = ActualOutcome(t) ⋅ PredictedOutcome(t) / |PredictedOutcome(t)|
 *
 * This tracks how well the Meta-Void Preview predictions align with actual outcomes,
 * and how the system improves its predictive power over time.
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
import { recordMetaVoidOperation } from './meta-learning-validation.js';
// In-memory storage of foresight data (would be database in production)
var foresightHistory = [];
/**
 * Record a Meta-Void Preview operation for tracking
 *
 * @param subject Subject being previewed
 * @param context Context of the preview
 * @param predictions List of predictions
 * @param overallConfidence Overall confidence in predictions
 * @param executionTime Time taken for execution in ms
 * @param userFeedback Optional user feedback (1-10)
 * @returns Recorded foresight data point
 */
export function recordMetaVoidPreview(subject, context, predictions, overallConfidence, executionTime, userFeedback) {
    // Create full predictions with IDs
    var fullPredictions = predictions.map(function (prediction) { return (__assign(__assign({}, prediction), { id: uuidv4(), outcome: undefined })); });
    var dataPoint = {
        id: uuidv4(),
        timestamp: new Date(),
        operationType: 'preview',
        subject: subject,
        context: context,
        predictions: fullPredictions,
        overallConfidence: overallConfidence,
        executionTime: executionTime,
        userFeedback: userFeedback
    };
    // Store in history
    foresightHistory.push(dataPoint);
    // Record in meta-learning framework for broader analysis
    recordMetaVoidOperation({
        operationType: 'preview',
        subject: subject,
        context: context,
        predictionCount: fullPredictions.length
    }, {
        predictionsGenerated: fullPredictions.length,
        overallConfidence: overallConfidence,
        averagePredictedImpact: fullPredictions.reduce(function (sum, p) { return sum + p.predictedImpact; }, 0) /
            fullPredictions.length,
        averagePredictedComplexity: fullPredictions.reduce(function (sum, p) { return sum + p.predictedComplexity; }, 0) /
            fullPredictions.length
    }, {
        accuracy: userFeedback ? userFeedback / 10 : undefined,
        executionTime: executionTime,
        userFeedback: userFeedback
    });
    return dataPoint;
}
/**
 * Record a Meta-Void Review operation for tracking
 *
 * @param subject Subject being reviewed
 * @param context Context of the review
 * @param actualOutcomes List of actual outcomes corresponding to previous predictions
 * @param executionTime Time taken for execution in ms
 * @param userFeedback Optional user feedback (1-10)
 * @returns Updated foresight data point with outcomes
 */
export function recordMetaVoidReview(predictionIds, actualOutcomes, executionTime, userFeedback) {
    // Find the preview data point that contains these predictions
    var relevantDataPoints = foresightHistory
        .filter(function (point) { return point.operationType === 'preview'; })
        .filter(function (point) {
        var pointPredictionIds = point.predictions.map(function (p) { return p.id; });
        return predictionIds.some(function (id) { return pointPredictionIds.includes(id); });
    });
    if (relevantDataPoints.length === 0) {
        console.error('No matching preview found for the given prediction IDs');
        return null;
    }
    // Use the most recent relevant data point
    var previewPoint = relevantDataPoints.sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); })[0];
    // Create outcome objects
    var outcomes = actualOutcomes.map(function (outcome) { return ({
        id: uuidv4(),
        predictionId: outcome.predictionId,
        timestamp: new Date(),
        actualOutcome: outcome.actualOutcome,
        actualImpact: outcome.actualImpact,
        actualComplexity: outcome.actualComplexity,
        matchScore: outcome.matchScore,
        unpredictedFactors: outcome.unpredictedFactors
    }); });
    // Create a new review data point based on the preview
    var reviewPoint = __assign(__assign({}, previewPoint), { id: uuidv4(), timestamp: new Date(), operationType: 'review', executionTime: executionTime, userFeedback: userFeedback, predictions: previewPoint.predictions.map(function (prediction) {
            var outcome = outcomes.find(function (o) { return o.predictionId === prediction.id; });
            return outcome ? __assign(__assign({}, prediction), { outcome: outcome }) : prediction;
        }) });
    // Store in history
    foresightHistory.push(reviewPoint);
    // Calculate overall accuracy
    var validatedPredictions = reviewPoint.predictions.filter(function (p) { return p.outcome; });
    var overallAccuracy = validatedPredictions.length > 0
        ? validatedPredictions.reduce(function (sum, p) { var _a; return sum + (((_a = p.outcome) === null || _a === void 0 ? void 0 : _a.matchScore) || 0); }, 0) /
            validatedPredictions.length
        : 0;
    // Record in meta-learning framework for broader analysis
    recordMetaVoidOperation({
        operationType: 'review',
        subject: reviewPoint.subject,
        context: reviewPoint.context,
        predictionCount: validatedPredictions.length
    }, {
        predictionsValidated: validatedPredictions.length,
        overallAccuracy: overallAccuracy,
        averageActualImpact: validatedPredictions.reduce(function (sum, p) { var _a; return sum + (((_a = p.outcome) === null || _a === void 0 ? void 0 : _a.actualImpact) || 0); }, 0) /
            Math.max(1, validatedPredictions.length),
        averageActualComplexity: validatedPredictions.reduce(function (sum, p) { var _a; return sum + (((_a = p.outcome) === null || _a === void 0 ? void 0 : _a.actualComplexity) || 0); }, 0) /
            Math.max(1, validatedPredictions.length)
    }, {
        accuracy: overallAccuracy,
        executionTime: executionTime,
        userFeedback: userFeedback
    });
    return reviewPoint;
}
/**
 * Calculate foresight validation metrics
 *
 * @param timeWindow Optional time window in milliseconds (default: 7 days)
 * @returns Foresight validation result
 */
export function validateForesight(timeWindow) {
    if (timeWindow === void 0) { timeWindow = 7 * 24 * 60 * 60 * 1000; }
    var currentTime = new Date().getTime();
    // Filter for relevant history within time window
    var relevantHistory = foresightHistory.filter(function (point) { return (currentTime - point.timestamp.getTime()) <= timeWindow; });
    // Focus on review points (which have outcomes)
    var reviewPoints = relevantHistory.filter(function (point) { return point.operationType === 'review'; });
    if (reviewPoints.length < 3) {
        return createDefaultValidationResult('Insufficient review data points for foresight validation');
    }
    // Sort by timestamp (oldest first)
    reviewPoints.sort(function (a, b) { return a.timestamp.getTime() - b.timestamp.getTime(); });
    // Calculate overall predictive accuracy
    var overallPredictiveAccuracy = calculateOverallAccuracy(reviewPoints);
    // Calculate accuracy trend
    var accuracyTrend = calculateAccuracyTrend(reviewPoints);
    // Calculate confidence calibration
    var confidenceCalibraton = calculateConfidenceCalibration(reviewPoints);
    // Calculate time horizon performance
    var timeHorizonPerformance = calculateTimeHorizonPerformance(reviewPoints);
    // Calculate domain-specific accuracy
    var domainSpecificAccuracy = calculateDomainSpecificAccuracy(reviewPoints);
    // Identify blind spots
    var blindSpots = identifyBlindSpots(reviewPoints);
    // Calculate learning metrics
    var learningMetrics = calculateLearningMetrics(reviewPoints);
    // Calculate statistical significance
    var isStatisticallySignificant = calculateStatisticalSignificance(reviewPoints);
    // Generate recommendations
    var recommendations = generateRecommendations(overallPredictiveAccuracy, accuracyTrend, confidenceCalibraton, timeHorizonPerformance, domainSpecificAccuracy, blindSpots, learningMetrics);
    // Return validation result
    return {
        id: uuidv4(),
        timestamp: new Date(),
        overallPredictiveAccuracy: overallPredictiveAccuracy,
        accuracyTrend: accuracyTrend,
        confidenceCalibraton: confidenceCalibraton,
        timeHorizonPerformance: timeHorizonPerformance,
        domainSpecificAccuracy: domainSpecificAccuracy,
        blindSpots: blindSpots,
        learningMetrics: learningMetrics,
        isStatisticallySignificant: isStatisticallySignificant,
        recommendations: recommendations
    };
}
/**
 * Calculate overall accuracy across all validated predictions
 */
function calculateOverallAccuracy(reviewPoints) {
    var totalMatchScore = 0;
    var totalPredictions = 0;
    for (var _i = 0, reviewPoints_1 = reviewPoints; _i < reviewPoints_1.length; _i++) {
        var point = reviewPoints_1[_i];
        for (var _a = 0, _b = point.predictions; _a < _b.length; _a++) {
            var prediction = _b[_a];
            if (prediction.outcome) {
                totalMatchScore += prediction.outcome.matchScore;
                totalPredictions++;
            }
        }
    }
    return totalPredictions > 0 ? totalMatchScore / totalPredictions : 0;
}
/**
 * Calculate accuracy trend
 */
function calculateAccuracyTrend(reviewPoints) {
    if (reviewPoints.length < 3) {
        return 'stable';
    }
    // Calculate accuracy per review point
    var accuracies = []; // [timestamp, accuracy]
    for (var _i = 0, reviewPoints_2 = reviewPoints; _i < reviewPoints_2.length; _i++) {
        var point = reviewPoints_2[_i];
        var pointMatchScore = 0;
        var pointPredictions = 0;
        for (var _a = 0, _b = point.predictions; _a < _b.length; _a++) {
            var prediction = _b[_a];
            if (prediction.outcome) {
                pointMatchScore += prediction.outcome.matchScore;
                pointPredictions++;
            }
        }
        if (pointPredictions > 0) {
            accuracies.push([
                point.timestamp.getTime(),
                pointMatchScore / pointPredictions
            ]);
        }
    }
    if (accuracies.length < 3) {
        return 'stable';
    }
    // Calculate linear regression slope
    var slope = calculateLinearRegressionSlope(accuracies.map(function (_a) {
        var x = _a[0], _ = _a[1];
        return x;
    }), accuracies.map(function (_a) {
        var _ = _a[0], y = _a[1];
        return y;
    }));
    if (slope > 0.0001) {
        return 'improving';
    }
    else if (slope < -0.0001) {
        return 'declining';
    }
    else {
        return 'stable';
    }
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
 * Calculate confidence calibration
 */
function calculateConfidenceCalibration(reviewPoints) {
    var totalCalibration = 0;
    var totalPredictions = 0;
    for (var _i = 0, reviewPoints_3 = reviewPoints; _i < reviewPoints_3.length; _i++) {
        var point = reviewPoints_3[_i];
        for (var _a = 0, _b = point.predictions; _a < _b.length; _a++) {
            var prediction = _b[_a];
            if (prediction.outcome) {
                // Calculate how well confidence matched actual match score
                // 1 - |confidence - accuracy| gives a score where 1 = perfect calibration
                var calibration = 1 - Math.abs(prediction.predictedProbability - prediction.outcome.matchScore);
                totalCalibration += calibration;
                totalPredictions++;
            }
        }
    }
    return totalPredictions > 0 ? totalCalibration / totalPredictions : 0;
}
/**
 * Calculate time horizon performance
 */
function calculateTimeHorizonPerformance(reviewPoints) {
    // Define time horizons (could be more sophisticated with actual time data)
    var timeHorizons = {
        'immediate': 'shortTerm',
        'short-term': 'shortTerm',
        'days': 'shortTerm',
        'weeks': 'mediumTerm',
        'medium-term': 'mediumTerm',
        'months': 'mediumTerm',
        'long-term': 'longTerm',
        'years': 'longTerm'
    };
    // Initialize accuracy counters
    var horizonScores = {
        shortTerm: 0,
        mediumTerm: 0,
        longTerm: 0
    };
    var horizonCounts = {
        shortTerm: 0,
        mediumTerm: 0,
        longTerm: 0
    };
    // Categorize predictions by time horizon and calculate accuracy
    for (var _i = 0, reviewPoints_4 = reviewPoints; _i < reviewPoints_4.length; _i++) {
        var point = reviewPoints_4[_i];
        // Look for time frame indicators in context
        var timeHorizon = 'mediumTerm'; // Default
        // Try to determine horizon from context timeFrame
        var timeFrameLower = point.context.timeFrame.toLowerCase();
        for (var _a = 0, _b = Object.entries(timeHorizons); _a < _b.length; _a++) {
            var _c = _b[_a], keyword = _c[0], horizon = _c[1];
            if (timeFrameLower.includes(keyword)) {
                timeHorizon = horizon;
                break;
            }
        }
        // Calculate accuracy for this horizon
        for (var _d = 0, _e = point.predictions; _d < _e.length; _d++) {
            var prediction = _e[_d];
            if (prediction.outcome) {
                horizonScores[timeHorizon] += prediction.outcome.matchScore;
                horizonCounts[timeHorizon]++;
            }
        }
    }
    // Calculate average accuracy for each horizon
    return {
        shortTerm: horizonCounts.shortTerm > 0 ? horizonScores.shortTerm / horizonCounts.shortTerm : 0,
        mediumTerm: horizonCounts.mediumTerm > 0 ? horizonScores.mediumTerm / horizonCounts.mediumTerm : 0,
        longTerm: horizonCounts.longTerm > 0 ? horizonScores.longTerm / horizonCounts.longTerm : 0
    };
}
/**
 * Calculate domain-specific accuracy
 */
function calculateDomainSpecificAccuracy(reviewPoints) {
    var domainScores = {};
    var domainCounts = {};
    for (var _i = 0, reviewPoints_5 = reviewPoints; _i < reviewPoints_5.length; _i++) {
        var point = reviewPoints_5[_i];
        var domain = point.context.domain;
        if (!domainScores[domain]) {
            domainScores[domain] = 0;
            domainCounts[domain] = 0;
        }
        for (var _a = 0, _b = point.predictions; _a < _b.length; _a++) {
            var prediction = _b[_a];
            if (prediction.outcome) {
                domainScores[domain] += prediction.outcome.matchScore;
                domainCounts[domain]++;
            }
        }
    }
    // Calculate average accuracy for each domain
    var domainAccuracy = {};
    for (var _c = 0, _d = Object.keys(domainScores); _c < _d.length; _c++) {
        var domain = _d[_c];
        domainAccuracy[domain] = domainCounts[domain] > 0
            ? domainScores[domain] / domainCounts[domain]
            : 0;
    }
    return domainAccuracy;
}
/**
 * Identify blind spots
 */
function identifyBlindSpots(reviewPoints) {
    // Track consistently missed factors
    var missedFactorCounts = {};
    // Track overconfident and underconfident predictions
    var confidenceDeviations = {};
    for (var _i = 0, reviewPoints_6 = reviewPoints; _i < reviewPoints_6.length; _i++) {
        var point = reviewPoints_6[_i];
        // Process each prediction with an outcome
        for (var _a = 0, _b = point.predictions; _a < _b.length; _a++) {
            var prediction = _b[_a];
            if (prediction.outcome) {
                // Count unpredicted factors
                for (var _c = 0, _d = prediction.outcome.unpredictedFactors; _c < _d.length; _c++) {
                    var factor = _d[_c];
                    missedFactorCounts[factor] = (missedFactorCounts[factor] || 0) + 1;
                }
                // Track confidence deviations by subject area
                // Use first word of the subject as a rough categorization
                var subjectArea = prediction.description.split(' ')[0].toLowerCase();
                if (!confidenceDeviations[subjectArea]) {
                    confidenceDeviations[subjectArea] = [];
                }
                // Deviation = predicted confidence - actual accuracy
                // Positive = overconfident, Negative = underconfident
                var deviation = prediction.predictedProbability - prediction.outcome.matchScore;
                confidenceDeviations[subjectArea].push(deviation);
            }
        }
    }
    // Identify consistently missed factors (appear in at least 3 predictions)
    var consistentlyMissedFactors = Object.entries(missedFactorCounts)
        .filter(function (_a) {
        var _ = _a[0], count = _a[1];
        return count >= 3;
    })
        .map(function (_a) {
        var factor = _a[0], _ = _a[1];
        return factor;
    });
    // Identify overconfident and underconfident areas
    var overconfidentAreas = [];
    var underconfidentAreas = [];
    for (var _e = 0, _f = Object.entries(confidenceDeviations); _e < _f.length; _e++) {
        var _g = _f[_e], area = _g[0], deviations = _g[1];
        if (deviations.length < 3)
            continue;
        var avgDeviation = deviations.reduce(function (sum, val) { return sum + val; }, 0) / deviations.length;
        if (avgDeviation > 0.2) {
            overconfidentAreas.push(area);
        }
        else if (avgDeviation < -0.2) {
            underconfidentAreas.push(area);
        }
    }
    return {
        consistentlyMissedFactors: consistentlyMissedFactors,
        overconfidentAreas: overconfidentAreas,
        underconfidentAreas: underconfidentAreas
    };
}
/**
 * Calculate learning metrics
 */
function calculateLearningMetrics(reviewPoints) {
    if (reviewPoints.length < 3) {
        return {
            predictionRefinementRate: 0.5,
            noveltyHandling: 0.5,
            complexityManagement: 0.5
        };
    }
    // Calculate prediction refinement rate
    var predictionRefinementRate = calculatePredictionRefinementRate(reviewPoints);
    // Calculate novelty handling
    var noveltyHandling = calculateNoveltyHandling(reviewPoints);
    // Calculate complexity management
    var complexityManagement = calculateComplexityManagement(reviewPoints);
    return {
        predictionRefinementRate: predictionRefinementRate,
        noveltyHandling: noveltyHandling,
        complexityManagement: complexityManagement
    };
}
/**
 * Calculate prediction refinement rate
 */
function calculatePredictionRefinementRate(reviewPoints) {
    if (reviewPoints.length < 3) {
        return 0.5;
    }
    // Split into first half and second half
    var midpoint = Math.floor(reviewPoints.length / 2);
    var firstHalf = reviewPoints.slice(0, midpoint);
    var secondHalf = reviewPoints.slice(midpoint);
    // Calculate accuracy for first and second half
    var firstHalfAccuracy = calculateOverallAccuracy(firstHalf);
    var secondHalfAccuracy = calculateOverallAccuracy(secondHalf);
    // Calculate improvement rate (normalized to 0-1)
    var improvementRate = Math.max(0, Math.min(1, (secondHalfAccuracy - firstHalfAccuracy) + 0.5));
    return improvementRate;
}
/**
 * Calculate novelty handling
 */
function calculateNoveltyHandling(reviewPoints) {
    // Count unique factors across all predictions
    var allFactors = new Set();
    var predictedFactors = new Set();
    for (var _i = 0, reviewPoints_7 = reviewPoints; _i < reviewPoints_7.length; _i++) {
        var point = reviewPoints_7[_i];
        for (var _a = 0, _b = point.predictions; _a < _b.length; _a++) {
            var prediction = _b[_a];
            // Add predicted factors
            for (var _c = 0, _d = prediction.factors; _c < _d.length; _c++) {
                var factor = _d[_c];
                allFactors.add(factor);
                predictedFactors.add(factor);
            }
            // Add unpredicted factors from outcomes
            if (prediction.outcome) {
                for (var _e = 0, _f = prediction.outcome.unpredictedFactors; _e < _f.length; _e++) {
                    var factor = _f[_e];
                    allFactors.add(factor);
                }
            }
        }
    }
    // Calculate how well system identifies all relevant factors
    var noveltyHandling = predictedFactors.size / Math.max(1, allFactors.size);
    return noveltyHandling;
}
/**
 * Calculate complexity management
 */
function calculateComplexityManagement(reviewPoints) {
    var complexityEfficiency = 0;
    var validPredictions = 0;
    for (var _i = 0, reviewPoints_8 = reviewPoints; _i < reviewPoints_8.length; _i++) {
        var point = reviewPoints_8[_i];
        for (var _a = 0, _b = point.predictions; _a < _b.length; _a++) {
            var prediction = _b[_a];
            if (prediction.outcome) {
                // Compare predicted vs. actual complexity
                var predictedComplexity = prediction.predictedComplexity;
                var actualComplexity = prediction.outcome.actualComplexity;
                // Calculate how accurately complexity was estimated
                // 1 - |predicted - actual|/10 gives a score where 1 = perfect estimation
                var complexityAccuracy = 1 - Math.abs(predictedComplexity - actualComplexity) / 10;
                // Calculate match score relative to complexity
                // Higher scores for accurate predictions of complex scenarios
                var efficiencyScore = prediction.outcome.matchScore *
                    (1 + (actualComplexity - 1) / 9); // Scales up with complexity
                complexityEfficiency += efficiencyScore * complexityAccuracy;
                validPredictions++;
            }
        }
    }
    return validPredictions > 0 ? Math.min(1, complexityEfficiency / validPredictions) : 0;
}
/**
 * Calculate statistical significance
 */
function calculateStatisticalSignificance(reviewPoints) {
    if (reviewPoints.length < 5) {
        return false;
    }
    // Extract match scores for each validated prediction
    var matchScores = [];
    for (var _i = 0, reviewPoints_9 = reviewPoints; _i < reviewPoints_9.length; _i++) {
        var point = reviewPoints_9[_i];
        for (var _a = 0, _b = point.predictions; _a < _b.length; _a++) {
            var prediction = _b[_a];
            if (prediction.outcome) {
                matchScores.push(prediction.outcome.matchScore);
            }
        }
    }
    if (matchScores.length < 10) {
        return false; // Need at least 10 validated predictions
    }
    // Split into first half and second half
    var midpoint = Math.floor(matchScores.length / 2);
    var firstHalf = matchScores.slice(0, midpoint);
    var secondHalf = matchScores.slice(midpoint);
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
 * Generate recommendations based on foresight validation
 */
function generateRecommendations(overallPredictiveAccuracy, accuracyTrend, confidenceCalibraton, timeHorizonPerformance, domainSpecificAccuracy, blindSpots, learningMetrics) {
    var recommendations = [];
    // Overall accuracy recommendations
    if (overallPredictiveAccuracy < 0.5) {
        recommendations.push('Overall predictive accuracy is low - implement more rigorous prediction protocols');
    }
    // Accuracy trend recommendations
    if (accuracyTrend === 'declining') {
        recommendations.push('Predictive accuracy is declining - conduct system-wide prediction audit');
    }
    // Confidence calibration recommendations
    if (confidenceCalibraton < 0.6) {
        recommendations.push('Confidence calibration is poor - recalibrate confidence estimation algorithms');
    }
    // Time horizon recommendations
    var weakestHorizon = Object.entries(timeHorizonPerformance)
        .sort(function (_a, _b) {
        var _ = _a[0], a = _a[1];
        var __ = _b[0], b = _b[1];
        return a - b;
    })[0][0];
    if (timeHorizonPerformance[weakestHorizon] < 0.5) {
        recommendations.push("".concat(weakestHorizon, " predictions are weak - enhance forecasting methods for this time horizon"));
    }
    // Domain-specific recommendations
    var weakDomains = Object.entries(domainSpecificAccuracy)
        .filter(function (_a) {
        var _ = _a[0], accuracy = _a[1];
        return accuracy < 0.5;
    })
        .map(function (_a) {
        var domain = _a[0], _ = _a[1];
        return domain;
    });
    if (weakDomains.length > 0) {
        recommendations.push("Low accuracy in domains: ".concat(weakDomains.join(', '), " - increase training in these areas"));
    }
    // Blind spot recommendations
    if (blindSpots.consistentlyMissedFactors.length > 0) {
        recommendations.push("Consistently missing factors: ".concat(blindSpots.consistentlyMissedFactors.join(', '), " - expand factor analysis"));
    }
    if (blindSpots.overconfidentAreas.length > 0) {
        recommendations.push("Overconfident in areas: ".concat(blindSpots.overconfidentAreas.join(', '), " - implement confidence penalties"));
    }
    if (blindSpots.underconfidentAreas.length > 0) {
        recommendations.push("Underconfident in areas: ".concat(blindSpots.underconfidentAreas.join(', '), " - boost confidence estimation"));
    }
    // Learning metrics recommendations
    if (learningMetrics.predictionRefinementRate < 0.4) {
        recommendations.push('Slow prediction refinement - implement more aggressive learning algorithms');
    }
    if (learningMetrics.noveltyHandling < 0.5) {
        recommendations.push('Poor novelty handling - enhance factor discovery mechanisms');
    }
    if (learningMetrics.complexityManagement < 0.5) {
        recommendations.push('Weak complexity management - implement hierarchical prediction structures');
    }
    // Ensure we have at least one recommendation
    if (recommendations.length === 0) {
        recommendations.push('Foresight capabilities are learning effectively - continue current approach');
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
        overallPredictiveAccuracy: 0.5,
        accuracyTrend: 'stable',
        confidenceCalibraton: 0.5,
        timeHorizonPerformance: {
            shortTerm: 0.5,
            mediumTerm: 0.5,
            longTerm: 0.5
        },
        domainSpecificAccuracy: {},
        blindSpots: {
            consistentlyMissedFactors: [],
            overconfidentAreas: [],
            underconfidentAreas: []
        },
        learningMetrics: {
            predictionRefinementRate: 0.5,
            noveltyHandling: 0.5,
            complexityManagement: 0.5
        },
        isStatisticallySignificant: false,
        recommendations: [
            reason,
            'Collect validated predictions to enable foresight validation'
        ]
    };
}
/**
 * Get foresight history
 *
 * @returns Foresight history data points
 */
export function getForesightHistory() {
    return __spreadArray([], foresightHistory, true);
}
/**
 * Clear foresight history (for testing purposes)
 */
export function clearForesightHistory() {
    foresightHistory.length = 0;
}
