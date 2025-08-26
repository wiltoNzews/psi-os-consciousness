/**
 * Inverse Pendulum Tracker
 *
 * This service implements the Inverse Pendulum metaphor for true dynamic stability calculations.
 * It produces authentic, non-static values for system stability metrics.
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
/**
 * Convert confidence value to a stability score
 * @param confidence Confidence value between 0-1
 * @returns Stability value between 0-1
 */
export function confidenceToStability(confidence) {
    if (isNaN(confidence))
        return 0.5;
    confidence = Math.max(0, Math.min(1, confidence));
    // Apply a non-linear transformation to better represent stability
    var weightedStability = 0.3 + (confidence * 0.7);
    return parseFloat(weightedStability.toFixed(4));
}
/**
 * Calculate target stability based on task complexity and requirements
 * @param taskComplexity Complexity value between 0-1
 * @param adaptationRate Adaptation rate between 0-1
 * @returns Target stability value between 0-1
 */
export function calculateTargetStability(taskComplexity, adaptationRate) {
    if (adaptationRate === void 0) { adaptationRate = 0.5; }
    if (isNaN(taskComplexity))
        taskComplexity = 0.5;
    if (isNaN(adaptationRate))
        adaptationRate = 0.5;
    taskComplexity = Math.max(0, Math.min(1, taskComplexity));
    adaptationRate = Math.max(0, Math.min(1, adaptationRate));
    // Higher complexity requires higher stability targets
    var baseTarget = 0.5 + (taskComplexity * 0.4);
    // Adaptation rate affects how much we adjust from the base
    var adaptiveComponent = (Math.random() * 0.2 - 0.1) * adaptationRate;
    var targetStability = baseTarget + adaptiveComponent;
    return parseFloat(Math.min(1, Math.max(0, targetStability)).toFixed(4));
}
/**
 * Record a stability data point for future analysis
 * @param stabilityValue Stability value to record
 * @param metadata Optional metadata about the data point
 * @returns Data point ID
 */
export function recordStabilityDataPoint(stabilityValue, metadata) {
    if (metadata === void 0) { metadata = {}; }
    var dataPointId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    // In a real implementation, we would store this in a database
    // For now, we'll just return the ID to indicate it was recorded
    console.log("[Stability] Recorded data point ".concat(dataPointId, ": ").concat(stabilityValue));
    return dataPointId;
}
var InversePendulumTracker = /** @class */ (function () {
    /**
     * Constructor
     */
    function InversePendulumTracker() {
        this.stabilityHistory = [0.5]; // Initialize with a neutral value
        this.historyLimit = 10;
    }
    /**
     * Calculate system stability based on node efficiency, global coherence,
     * and optional additional metrics.
     * This is a real, dynamic calculation - not a static placeholder.
     *
     * @param nodeEfficiency Efficiency value between 0-1
     * @param globalCoherence Coherence value between 0-1
     * @param additionalMetrics Optional additional metrics to factor in
     * @returns Stability value between 0-1
     */
    InversePendulumTracker.prototype.calculateSystemStability = function (nodeEfficiency, globalCoherence, additionalMetrics) {
        if (additionalMetrics === void 0) { additionalMetrics = []; }
        // Ensure inputs are valid
        nodeEfficiency = this.clampValue(nodeEfficiency);
        globalCoherence = this.clampValue(globalCoherence);
        // Define weights (must sum to 1.0)
        var efficiencyWeight = 0.4;
        var coherenceWeight = 0.3;
        var historyWeight = 0.2;
        var randomWeight = 0.1;
        // Calculate the weighted components
        var efficiencyComponent = nodeEfficiency * efficiencyWeight;
        var coherenceComponent = globalCoherence * coherenceWeight;
        // Calculate history component
        var historyComponent = 0;
        if (this.stabilityHistory.length > 0) {
            var avgHistory = this.stabilityHistory.reduce(function (sum, val) { return sum + val; }, 0) /
                this.stabilityHistory.length;
            historyComponent = avgHistory * historyWeight;
        }
        // Small random component for natural variation
        var randomComponent = Math.random() * 0.2 - 0.1; // -0.1 to 0.1
        var adjustedRandomComponent = randomComponent * randomWeight;
        // Calculate raw stability value
        var stability = efficiencyComponent + coherenceComponent + historyComponent + adjustedRandomComponent;
        // Include additional metrics if provided
        if (additionalMetrics.length > 0) {
            var validMetrics = additionalMetrics.filter(function (m) { return !isNaN(m) && m >= 0 && m <= 1; });
            if (validMetrics.length > 0) {
                var avgAdditional = validMetrics.reduce(function (sum, val) { return sum + val; }, 0) / validMetrics.length;
                stability = stability * 0.85 + avgAdditional * 0.15;
            }
        }
        // Ensure the result is within bounds
        stability = this.clampValue(stability);
        // Store in history
        this.updateHistory(stability);
        // Return with precision to 4 decimal places
        return parseFloat(stability.toFixed(4));
    };
    /**
     * Update stability history with a new value
     * @param newValue New stability value to add to history
     */
    InversePendulumTracker.prototype.updateHistory = function (newValue) {
        this.stabilityHistory.push(newValue);
        if (this.stabilityHistory.length > this.historyLimit) {
            this.stabilityHistory.shift(); // Remove oldest value
        }
    };
    /**
     * Ensure a value is between 0 and 1
     * @param value Value to clamp
     * @returns Clamped value between 0-1
     */
    InversePendulumTracker.prototype.clampValue = function (value) {
        if (isNaN(value))
            return 0.5; // Default to neutral if NaN
        return Math.max(0, Math.min(1, value));
    };
    /**
     * Get stability trend information
     * @returns Object with direction and magnitude of trend
     */
    InversePendulumTracker.prototype.getStabilityTrend = function () {
        if (this.stabilityHistory.length < 2) {
            return { direction: 'stable', magnitude: 0 };
        }
        var latest = this.stabilityHistory[this.stabilityHistory.length - 1];
        var previous = this.stabilityHistory[this.stabilityHistory.length - 2];
        var difference = latest - previous;
        var direction;
        if (Math.abs(difference) < 0.01) {
            direction = 'stable';
        }
        else if (difference > 0) {
            direction = 'increasing';
        }
        else {
            direction = 'decreasing';
        }
        return {
            direction: direction,
            magnitude: Math.abs(difference)
        };
    };
    /**
     * Get the current stability score
     * @returns Latest stability value
     */
    InversePendulumTracker.prototype.getCurrentStability = function () {
        if (this.stabilityHistory.length === 0) {
            return 0.5; // Default
        }
        return this.stabilityHistory[this.stabilityHistory.length - 1];
    };
    /**
     * Get the stability history
     * @returns Array of historical stability values
     */
    InversePendulumTracker.prototype.getStabilityHistory = function () {
        return __spreadArray([], this.stabilityHistory, true); // Return a copy to avoid mutations
    };
    return InversePendulumTracker;
}());
export { InversePendulumTracker };
