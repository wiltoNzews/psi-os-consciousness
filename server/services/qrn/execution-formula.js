/**
 * Execution Formula Implementation
 *
 * Implementation of the quantitative operational execution formula:
 * Result = (Accuracy × Ideas) + (Clarity × Speed) − Delay
 *
 * This module provides functionality to calculate, measure, and optimize
 * operational execution using the formula's components.
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
/**
 * Calculate execution score using the Execution Formula
 *
 * Result = (Accuracy × Ideas) + (Clarity × Speed) − Delay
 *
 * @param params Execution parameters
 * @returns Raw execution score
 */
export function calculateExecutionScore(params) {
    // Validate parameters
    validateParameters(params);
    // Invert speed for formula (smaller speed value = faster = better)
    // For the formula, we convert to a 0-1 scale where 1 is instantaneous
    var speedFactor = 1 / Math.max(0.1, params.speed); // Prevent division by zero
    // Calculate components
    var accuracyIdeasProduct = params.accuracy * params.ideas;
    var claritySpeedProduct = params.clarity * speedFactor;
    // Calculate final score
    // Result = (Accuracy × Ideas) + (Clarity × Speed) − Delay
    return (accuracyIdeasProduct + claritySpeedProduct * 10) - (params.delay * 0.1);
}
/**
 * Calculate detailed execution result with analysis
 *
 * @param params Execution parameters
 * @param options Additional calculation options
 * @returns Detailed execution result
 */
export function analyzeExecution(params, options) {
    // Default options
    var opts = __assign({ normalizationFactor: 10, historyData: [], optimizationSuggestions: true }, options);
    // Calculate raw score
    var score = calculateExecutionScore(params);
    // Invert speed for formula (smaller speed value = faster = better)
    var speedFactor = 1 / Math.max(0.1, params.speed); // Prevent division by zero
    // Calculate component values
    var components = {
        accuracyIdeasProduct: params.accuracy * params.ideas,
        claritySpeedProduct: params.clarity * speedFactor * 10,
        delayImpact: params.delay * 0.1
    };
    // Normalize score to 0-100 scale
    var normalizedScore = Math.max(0, Math.min(100, (score / opts.normalizationFactor) * 100));
    // Determine quality rating
    var qualityRating = determineQualityRating(normalizedScore);
    // Identify limiting factors
    var limitingFactors = identifyLimitingFactors(params);
    // Generate optimization opportunities
    var optimizationOpportunities = opts.optimizationSuggestions
        ? generateOptimizationOpportunities(params, score)
        : [];
    return {
        score: score,
        normalizedScore: normalizedScore,
        qualityRating: qualityRating,
        components: components,
        limitingFactors: limitingFactors,
        optimizationOpportunities: optimizationOpportunities
    };
}
/**
 * Compare current execution against historical data
 *
 * @param params Current execution parameters
 * @param historyData Array of historical execution parameters
 * @returns Historical comparison analysis
 */
export function compareWithHistory(params, historyData) {
    // Ensure we have history data
    if (!historyData || historyData.length === 0) {
        return createDefaultHistory();
    }
    // Calculate current score
    var currentScore = calculateExecutionScore(params);
    // Calculate historical scores
    var historicalScores = historyData.map(calculateExecutionScore);
    // Calculate averages
    var avgOverall = average(historicalScores);
    // Calculate component averages
    var accuracyIdeasScores = historyData.map(function (p) { return p.accuracy * p.ideas; });
    var claritySpeedScores = historyData.map(function (p) { return p.clarity * (1 / Math.max(0.1, p.speed)) * 10; });
    var delayScores = historyData.map(function (p) { return p.delay * 0.1; });
    var avgAccuracyIdeas = average(accuracyIdeasScores);
    var avgClaritySpeed = average(claritySpeedScores);
    var avgDelay = average(delayScores);
    // Calculate trends (using simple linear regression)
    var overallTrend = calculateTrend(historicalScores);
    var accuracyIdeasTrend = calculateTrend(accuracyIdeasScores);
    var claritySpeedTrend = calculateTrend(claritySpeedScores);
    var delayTrend = calculateTrend(delayScores);
    // Calculate percentile of current score
    var percentile = calculatePercentile(currentScore, historicalScores);
    return {
        averageScores: {
            overall: avgOverall,
            accuracyIdeas: avgAccuracyIdeas,
            claritySpeed: avgClaritySpeed,
            delay: avgDelay
        },
        trends: {
            overall: overallTrend,
            accuracyIdeas: accuracyIdeasTrend,
            claritySpeed: claritySpeedTrend,
            delay: delayTrend
        },
        currentPercentile: percentile
    };
}
/**
 * Suggest parameter improvements to optimize execution
 *
 * @param params Current execution parameters
 * @param targetScore Target execution score to achieve
 * @returns Optimized parameters
 */
export function suggestOptimization(params, targetScore) {
    // Calculate current score
    var currentScore = calculateExecutionScore(params);
    // If already meeting or exceeding target, return current params
    if (currentScore >= targetScore) {
        return {
            currentScore: currentScore,
            targetScore: targetScore,
            optimizedParams: __assign({}, params),
            improvements: createNoChangeImprovements(params),
            recommendations: ["Target score already achieved with current parameters"]
        };
    }
    // Calculate score gap
    var scoreGap = targetScore - currentScore;
    // Analyze parameter sensitivity
    var sensitivity = analyzeParameterSensitivity(params);
    // Sort parameters by sensitivity (most impactful first)
    var sortedParams = Object.entries(sensitivity)
        .sort(function (a, b) { return b[1] - a[1]; })
        .map(function (_a) {
        var key = _a[0];
        return key;
    });
    // Clone current parameters for optimization
    var optimizedParams = __assign({}, params);
    // Track improvements
    var improvements = {
        accuracy: { current: params.accuracy, suggested: params.accuracy, change: 0, impact: 0 },
        ideas: { current: params.ideas, suggested: params.ideas, change: 0, impact: 0 },
        clarity: { current: params.clarity, suggested: params.clarity, change: 0, impact: 0 },
        speed: { current: params.speed, suggested: params.speed, change: 0, impact: 0 },
        delay: { current: params.delay, suggested: params.delay, change: 0, impact: 0 }
    };
    // Generate recommendations
    var recommendations = [];
    // Approach: Try to improve each parameter in order of sensitivity
    for (var _i = 0, sortedParams_1 = sortedParams; _i < sortedParams_1.length; _i++) {
        var param = sortedParams_1[_i];
        // Skip if we've already reached target
        if (calculateExecutionScore(optimizedParams) >= targetScore)
            break;
        // Determine potential improvement
        var newValue = optimizedParams[param];
        var potentialImprovement = 0;
        switch (param) {
            case 'accuracy':
                // Can improve up to 1.0
                newValue = Math.min(1.0, params.accuracy + 0.2);
                potentialImprovement = (newValue - params.accuracy) * params.ideas;
                break;
            case 'ideas':
                // Can add more ideas (typically 1-3)
                newValue = params.ideas + 2;
                potentialImprovement = (newValue - params.ideas) * params.accuracy;
                break;
            case 'clarity':
                // Can improve up to 1.0
                newValue = Math.min(1.0, params.clarity + 0.2);
                potentialImprovement = (newValue - params.clarity) * (1 / params.speed) * 10;
                break;
            case 'speed':
                // Can improve by reducing time (up to 50%)
                newValue = Math.max(1, params.speed * 0.7);
                potentialImprovement = params.clarity * ((1 / newValue) - (1 / params.speed)) * 10;
                break;
            case 'delay':
                // Can improve by reducing delay (up to 80%)
                newValue = Math.max(0, params.delay * 0.5);
                potentialImprovement = (params.delay - newValue) * 0.1;
                break;
        }
        // Update optimized parameters
        optimizedParams[param] = newValue;
        // Record improvement
        improvements[param] = {
            current: params[param],
            suggested: newValue,
            change: param === 'speed' || param === 'delay'
                ? params[param] - newValue // For these, reduction is improvement
                : newValue - params[param],
            impact: potentialImprovement
        };
        // Generate recommendation
        if (param === 'accuracy') {
            recommendations.push("Increase accuracy from ".concat(params.accuracy.toFixed(2), " to ").concat(newValue.toFixed(2), " by implementing additional validation and quality controls"));
        }
        else if (param === 'ideas') {
            recommendations.push("Increase idea count from ".concat(params.ideas, " to ").concat(newValue, " by exploring additional solution approaches or feature enhancements"));
        }
        else if (param === 'clarity') {
            recommendations.push("Improve clarity from ".concat(params.clarity.toFixed(2), " to ").concat(newValue.toFixed(2), " through better documentation, code structure, and communication"));
        }
        else if (param === 'speed') {
            recommendations.push("Reduce implementation time from ".concat(params.speed, " to ").concat(newValue.toFixed(1), " minutes by optimizing workflows and eliminating unnecessary steps"));
        }
        else if (param === 'delay') {
            recommendations.push("Reduce delays from ".concat(params.delay, " to ").concat(newValue.toFixed(1), " minutes by addressing blockers, improving resource availability, and streamlining decision processes"));
        }
    }
    // Calculate new score
    var newScore = calculateExecutionScore(optimizedParams);
    return {
        currentScore: currentScore,
        targetScore: targetScore,
        optimizedParams: optimizedParams,
        improvements: improvements,
        recommendations: recommendations
    };
}
/**
 * Measure and record execution parameters from actual performance data
 *
 * @param performanceData Actual performance measurements
 * @returns Extracted execution parameters
 */
export function measureExecutionParameters(performanceData) {
    // Calculate accuracy
    var totalTasks = performanceData.completedTasks.length;
    if (totalTasks === 0) {
        throw new Error("Performance data must include at least one completed task");
    }
    var correctTasks = performanceData.completedTasks.filter(function (task) { return task.correctlyImplemented; }).length;
    var accuracy = correctTasks / totalTasks;
    // Count ideas (each task represents one implemented idea)
    var ideas = totalTasks;
    // Calculate clarity
    var clarity = 0.7; // Default medium-high clarity
    if (performanceData.clarityMetrics) {
        var _a = performanceData.clarityMetrics, documentationScore = _a.documentationScore, codeQualityScore = _a.codeQualityScore, userFeedbackScore = _a.userFeedbackScore;
        var scoreSum = 0;
        var scoreCount = 0;
        if (documentationScore !== undefined) {
            scoreSum += documentationScore;
            scoreCount++;
        }
        if (codeQualityScore !== undefined) {
            scoreSum += codeQualityScore;
            scoreCount++;
        }
        if (userFeedbackScore !== undefined) {
            scoreSum += userFeedbackScore;
            scoreCount++;
        }
        if (scoreCount > 0) {
            clarity = scoreSum / scoreCount;
        }
    }
    // Calculate speed (average time per task)
    var taskTimes = performanceData.completedTasks.map(function (task) { return task.timeToComplete; });
    var speed = average(taskTimes);
    // Use provided blocker time as delay
    var delay = performanceData.blockerTime;
    return {
        accuracy: accuracy,
        ideas: ideas,
        clarity: clarity,
        speed: speed,
        delay: delay
    };
}
/**
 * Create an execution formula dashboard with visualization data
 *
 * @param current Current execution parameters
 * @param history Historical execution parameters
 * @returns Dashboard data for visualization
 */
export function createExecutionDashboard(current, history) {
    if (history === void 0) { history = []; }
    // Calculate current score
    var currentScore = calculateExecutionScore(current);
    // Calculate historical scores
    var historicalScores = history.map(calculateExecutionScore);
    // Calculate component breakdown
    var speedFactor = 1 / Math.max(0.1, current.speed);
    var accuracyIdeasProduct = current.accuracy * current.ideas;
    var claritySpeedProduct = current.clarity * speedFactor * 10;
    var delayImpact = current.delay * 0.1;
    var totalPositive = accuracyIdeasProduct + claritySpeedProduct;
    var componentBreakdown = [
        {
            label: 'Accuracy × Ideas',
            value: accuracyIdeasProduct,
            contribution: (accuracyIdeasProduct / totalPositive) * 100
        },
        {
            label: 'Clarity × Speed',
            value: claritySpeedProduct,
            contribution: (claritySpeedProduct / totalPositive) * 100
        },
        {
            label: 'Delay (negative)',
            value: -delayImpact,
            contribution: 0 // Negative component doesn't contribute positively
        }
    ];
    // Calculate parameter trends
    var parameterTrends = [];
    // Function to get parameter history
    var getParameterHistory = function (param) {
        return history.map(function (h) { return h[param]; });
    };
    for (var _i = 0, _a = ['accuracy', 'ideas', 'clarity', 'speed', 'delay']; _i < _a.length; _i++) {
        var param = _a[_i];
        var paramHistory = getParameterHistory(param);
        var avgValue = paramHistory.length > 0 ? average(paramHistory) : current[param];
        var trend = paramHistory.length >= 3 ? calculateTrend(paramHistory) : 'stable';
        // Determine impact (for speed and delay, lower is better)
        var impact = 'neutral';
        if (param === 'speed' || param === 'delay') {
            impact = current[param] < avgValue ? 'positive' :
                current[param] > avgValue ? 'negative' : 'neutral';
        }
        else {
            impact = current[param] > avgValue ? 'positive' :
                current[param] < avgValue ? 'negative' : 'neutral';
        }
        parameterTrends.push({
            parameter: param,
            current: current[param],
            average: avgValue,
            trend: trend,
            impact: impact
        });
    }
    // Calculate optimization priorities
    var sensitivity = analyzeParameterSensitivity(current);
    var optimizationPriorities = Object.entries(sensitivity)
        .map(function (_a) {
        var param = _a[0], sensitivity = _a[1];
        // Determine improvement potential
        var potentialImprovement = 0;
        switch (param) {
            case 'accuracy':
                potentialImprovement = (1 - current.accuracy) * current.ideas * sensitivity;
                break;
            case 'ideas':
                potentialImprovement = 2 * current.accuracy * sensitivity; // Assume can add 2 ideas
                break;
            case 'clarity':
                potentialImprovement = (1 - current.clarity) * speedFactor * 10 * sensitivity;
                break;
            case 'speed':
                potentialImprovement = current.clarity * ((1 / (current.speed * 0.7)) - speedFactor) * 10 * sensitivity;
                break;
            case 'delay':
                potentialImprovement = (current.delay * 0.5) * 0.1 * sensitivity; // Assume can reduce by 50%
                break;
        }
        // Determine priority
        var priority;
        if (potentialImprovement > 5) {
            priority = 'high';
        }
        else if (potentialImprovement > 2) {
            priority = 'medium';
        }
        else {
            priority = 'low';
        }
        return {
            parameter: param,
            potentialImprovement: potentialImprovement,
            priority: priority
        };
    })
        .sort(function (a, b) { return b.potentialImprovement - a.potentialImprovement; });
    // Calculate comparative rating
    var percentile = historicalScores.length > 0
        ? calculatePercentile(currentScore, historicalScores)
        : 50; // Default to 50th percentile if no history
    var rating;
    if (percentile >= 90) {
        rating = 'Outstanding (Top 10%)';
    }
    else if (percentile >= 75) {
        rating = 'Excellent (Top 25%)';
    }
    else if (percentile >= 50) {
        rating = 'Above Average';
    }
    else if (percentile >= 25) {
        rating = 'Below Average';
    }
    else {
        rating = 'Needs Improvement (Bottom 25%)';
    }
    return {
        currentScore: currentScore,
        historicalScores: historicalScores,
        componentBreakdown: componentBreakdown,
        parameterTrends: parameterTrends,
        optimizationPriorities: optimizationPriorities,
        comparativeRating: {
            percentile: percentile,
            rating: rating
        }
    };
}
/**
 * Validate execution parameters
 */
function validateParameters(params) {
    // Validate accuracy (0-1)
    if (params.accuracy < 0 || params.accuracy > 1) {
        throw new Error('Accuracy must be between 0 and 1');
    }
    // Validate ideas (positive integer)
    if (params.ideas < 0 || !Number.isInteger(params.ideas)) {
        throw new Error('Ideas must be a non-negative integer');
    }
    // Validate clarity (0-1)
    if (params.clarity < 0 || params.clarity > 1) {
        throw new Error('Clarity must be between 0 and 1');
    }
    // Validate speed (positive number)
    if (params.speed <= 0) {
        throw new Error('Speed must be a positive number');
    }
    // Validate delay (non-negative number)
    if (params.delay < 0) {
        throw new Error('Delay must be a non-negative number');
    }
}
/**
 * Determine quality rating based on normalized score
 */
function determineQualityRating(normalizedScore) {
    if (normalizedScore >= 90)
        return 'exceptional';
    if (normalizedScore >= 70)
        return 'high';
    if (normalizedScore >= 50)
        return 'good';
    if (normalizedScore >= 30)
        return 'moderate';
    return 'poor';
}
/**
 * Identify limiting factors in execution
 */
function identifyLimitingFactors(params) {
    var limitingFactors = [];
    // Check accuracy
    if (params.accuracy < 0.7) {
        limitingFactors.push('Low accuracy is reducing effectiveness');
    }
    // Check ideas
    if (params.ideas < 3) {
        limitingFactors.push('Limited idea implementation is constraining results');
    }
    // Check clarity
    if (params.clarity < 0.7) {
        limitingFactors.push('Insufficient clarity is hampering execution');
    }
    // Check speed
    if (params.speed > 20) { // More than 20 minutes per idea
        limitingFactors.push('Slow implementation speed is delaying results');
    }
    // Check delay
    if (params.delay > 30) { // More than 30 minutes of delay
        limitingFactors.push('Significant delays are impacting overall execution');
    }
    // If no specific limiting factors, look at ratios
    if (limitingFactors.length === 0) {
        // Check accuracy-to-ideas ratio
        if (params.accuracy * params.ideas < 2) {
            limitingFactors.push('Accuracy-to-ideas balance needs optimization');
        }
        // Check clarity-to-speed ratio
        if (params.clarity / params.speed < 0.05) {
            limitingFactors.push('Clarity-to-speed ratio could be improved');
        }
    }
    return limitingFactors;
}
/**
 * Generate optimization opportunities
 */
function generateOptimizationOpportunities(params, currentScore) {
    var opportunities = [];
    // Calculate potential improvements
    // 1. Improve accuracy
    if (params.accuracy < 0.95) {
        var improvedAccuracy = Math.min(1, params.accuracy + 0.1);
        var newScore = calculateExecutionScore(__assign(__assign({}, params), { accuracy: improvedAccuracy }));
        var impact = newScore - currentScore;
        opportunities.push({
            factor: 'Accuracy',
            impact: impact,
            description: "Increase accuracy from ".concat(params.accuracy.toFixed(2), " to ").concat(improvedAccuracy.toFixed(2), " through enhanced quality control")
        });
    }
    // 2. Add ideas
    var newIdeas = params.ideas + 1;
    var ideasNewScore = calculateExecutionScore(__assign(__assign({}, params), { ideas: newIdeas }));
    var ideasImpact = ideasNewScore - currentScore;
    opportunities.push({
        factor: 'Ideas',
        impact: ideasImpact,
        description: "Implement additional idea (from ".concat(params.ideas, " to ").concat(newIdeas, ") to expand solution coverage")
    });
    // 3. Improve clarity
    if (params.clarity < 0.95) {
        var improvedClarity = Math.min(1, params.clarity + 0.1);
        var newScore = calculateExecutionScore(__assign(__assign({}, params), { clarity: improvedClarity }));
        var impact = newScore - currentScore;
        opportunities.push({
            factor: 'Clarity',
            impact: impact,
            description: "Enhance clarity from ".concat(params.clarity.toFixed(2), " to ").concat(improvedClarity.toFixed(2), " through improved documentation and communication")
        });
    }
    // 4. Improve speed
    var improvedSpeed = params.speed * 0.8; // 20% faster
    var speedNewScore = calculateExecutionScore(__assign(__assign({}, params), { speed: improvedSpeed }));
    var speedImpact = speedNewScore - currentScore;
    opportunities.push({
        factor: 'Speed',
        impact: speedImpact,
        description: "Reduce implementation time from ".concat(params.speed.toFixed(1), " to ").concat(improvedSpeed.toFixed(1), " minutes through process optimization")
    });
    // 5. Reduce delay
    if (params.delay > 0) {
        var reducedDelay = Math.max(0, params.delay * 0.7); // 30% less delay
        var newScore = calculateExecutionScore(__assign(__assign({}, params), { delay: reducedDelay }));
        var impact = newScore - currentScore;
        opportunities.push({
            factor: 'Delay',
            impact: impact,
            description: "Decrease delay from ".concat(params.delay.toFixed(1), " to ").concat(reducedDelay.toFixed(1), " minutes by addressing blockers")
        });
    }
    // Sort by impact (highest first)
    return opportunities.sort(function (a, b) { return b.impact - a.impact; });
}
/**
 * Analyze parameter sensitivity
 */
function analyzeParameterSensitivity(params) {
    var baseScore = calculateExecutionScore(params);
    var results = {};
    // Test each parameter
    for (var _i = 0, _a = ['accuracy', 'ideas', 'clarity', 'speed', 'delay']; _i < _a.length; _i++) {
        var param = _a[_i];
        var testParams = __assign({}, params);
        var delta = 0;
        // Adjust parameter based on type
        switch (param) {
            case 'accuracy':
            case 'clarity':
                // For 0-1 values, increase by 0.1 (10%)
                testParams[param] = Math.min(1, params[param] + 0.1);
                delta = 0.1;
                break;
            case 'ideas':
                // For count values, increase by 1
                testParams[param] = params[param] + 1;
                delta = 1;
                break;
            case 'speed':
            case 'delay':
                // For time values, decrease by 10%
                testParams[param] = params[param] * 0.9;
                delta = params[param] * 0.1;
                break;
        }
        // Calculate new score
        var newScore = calculateExecutionScore(testParams);
        // Calculate sensitivity (normalized by delta)
        results[param] = delta > 0 ? Math.abs(newScore - baseScore) / delta : 0;
    }
    return results;
}
/**
 * Calculate average of an array of numbers
 */
function average(values) {
    if (values.length === 0)
        return 0;
    return values.reduce(function (sum, value) { return sum + value; }, 0) / values.length;
}
/**
 * Calculate trend from array of values
 */
function calculateTrend(values) {
    if (values.length < 3)
        return 'stable';
    // Simple linear trend detection
    var recentValues = values.slice(-3); // Last 3 values
    // Calculate direction
    var first = recentValues[0];
    var last = recentValues[recentValues.length - 1];
    // Determine if significant change (> 10%)
    var changePct = Math.abs(last - first) / Math.max(0.1, Math.abs(first));
    if (changePct < 0.1)
        return 'stable';
    return last > first ? 'improving' : 'declining';
}
/**
 * Calculate percentile of a value within an array
 */
function calculatePercentile(value, array) {
    if (array.length === 0)
        return 50; // Default to 50th percentile
    // Sort the array
    var sorted = __spreadArray([], array, true).sort(function (a, b) { return a - b; });
    // Count values below current value
    var belowCount = sorted.filter(function (v) { return v < value; }).length;
    // Calculate percentile
    return (belowCount / array.length) * 100;
}
/**
 * Create default history data
 */
function createDefaultHistory() {
    return {
        averageScores: {
            overall: 0,
            accuracyIdeas: 0,
            claritySpeed: 0,
            delay: 0
        },
        trends: {
            overall: 'stable',
            accuracyIdeas: 'stable',
            claritySpeed: 'stable',
            delay: 'stable'
        },
        currentPercentile: 50
    };
}
/**
 * Create no-change improvements object
 */
function createNoChangeImprovements(params) {
    return {
        accuracy: { current: params.accuracy, suggested: params.accuracy, change: 0, impact: 0 },
        ideas: { current: params.ideas, suggested: params.ideas, change: 0, impact: 0 },
        clarity: { current: params.clarity, suggested: params.clarity, change: 0, impact: 0 },
        speed: { current: params.speed, suggested: params.speed, change: 0, impact: 0 },
        delay: { current: params.delay, suggested: params.delay, change: 0, impact: 0 }
    };
}
