/**
 * Ouroboros Service
 *
 * This service coordinates the dynamic oscillation between Structure (3:1) and Adaptability (1:3)
 * based on the Ouroboros Principle. It manages the coherence attractor and provides methods
 * to interact with and observe the system's coherence state.
 *
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { EventEmitter } from 'events';
import { coherenceAttractor } from './CoherenceAttractor.js';
/**
 * Service to manage the Ouroboros coherence oscillation
 */
var OuroborosService = /** @class */ (function (_super) {
    __extends(OuroborosService, _super);
    /**
     * Creates a new OuroborosService
     */
    function OuroborosService() {
        var _this = _super.call(this) || this;
        _this.measurements = [];
        _this.MAX_MEASUREMENTS = 100;
        _this.isInitialized = false;
        _this.initialize();
        return _this;
    }
    /**
     * Initializes the service and sets up event listeners
     */
    OuroborosService.prototype.initialize = function () {
        var _this = this;
        if (this.isInitialized)
            return;
        // Listen for coherence cycles
        coherenceAttractor.on('cycle', function (measurement) {
            _this.addMeasurement(measurement);
            _this.emit('measurement', measurement);
            // Emit current state
            _this.emit('state', _this.getCurrentState());
        });
        // Listen for phase changes
        coherenceAttractor.on('phaseChange', function (phase) {
            _this.emit('phaseChange', phase);
            console.log("[QUANTUM_STATE: OUROBOROS_FLOW] Phase changed to ".concat(phase));
        });
        // Listen for perturbations
        coherenceAttractor.on('perturbed', function (data) {
            _this.emit('perturbed', data);
            console.log("[QUANTUM_STATE: OUROBOROS_FLOW] System perturbed to ".concat(data.target, " for ").concat(data.duration, " cycles"));
        });
        // Listen for perturbation end
        coherenceAttractor.on('perturbationEnded', function () {
            _this.emit('perturbationEnded');
            console.log('[QUANTUM_STATE: OUROBOROS_FLOW] Perturbation ended, returning to natural dynamics');
        });
        this.isInitialized = true;
        console.log('[QUANTUM_STATE: OUROBOROS_FLOW] Ouroboros service initialized');
    };
    /**
     * Adds a measurement to the history
     */
    OuroborosService.prototype.addMeasurement = function (measurement) {
        this.measurements.push(measurement);
        // Limit the size of measurements array
        if (this.measurements.length > this.MAX_MEASUREMENTS) {
            this.measurements.shift();
        }
    };
    /**
     * Gets the current state of the Ouroboros system
     */
    OuroborosService.prototype.getCurrentState = function () {
        return {
            coherence: coherenceAttractor.getCoherence(),
            phase: coherenceAttractor.getPhase(),
            ratio: coherenceAttractor.getPhase() === 'stability' ? '3:1' : '1:3',
            isPerturbed: coherenceAttractor.getStatus().isPerturbed,
            cycle: coherenceAttractor.getCycleCount(),
            isActive: coherenceAttractor.isActive(),
            timestamp: Date.now()
        };
    };
    /**
     * Gets recent coherence measurements
     */
    OuroborosService.prototype.getMeasurements = function (limit) {
        if (limit === void 0) { limit = 50; }
        return this.measurements.slice(-Math.min(limit, this.measurements.length));
    };
    /**
     * Starts the Ouroboros oscillation
     */
    OuroborosService.prototype.start = function () {
        coherenceAttractor.start();
        console.log('[QUANTUM_STATE: OUROBOROS_FLOW] Ouroboros oscillation started');
        this.emit('started');
    };
    /**
     * Stops the Ouroboros oscillation
     */
    OuroborosService.prototype.stop = function () {
        coherenceAttractor.stop();
        console.log('[QUANTUM_STATE: OUROBOROS_FLOW] Ouroboros oscillation stopped');
        this.emit('stopped');
    };
    /**
     * Perturbs the system coherence to a target value for a period
     */
    OuroborosService.prototype.perturb = function (targetCoherence, durationCycles) {
        coherenceAttractor.perturb(targetCoherence, durationCycles);
    };
    /**
     * Updates the parameters of the coherence attractor
     */
    OuroborosService.prototype.updateParameters = function (params) {
        coherenceAttractor.updateParameters(params);
        console.log('[QUANTUM_STATE: OUROBOROS_FLOW] Ouroboros parameters updated');
        this.emit('parametersUpdated', coherenceAttractor.getStatus());
    };
    /**
     * Calculates the average coherence over a number of recent cycles
     */
    OuroborosService.prototype.getAverageCoherence = function (cycles) {
        if (cycles === void 0) { cycles = 10; }
        if (this.measurements.length === 0)
            return 0;
        var recentMeasurements = this.measurements.slice(-Math.min(cycles, this.measurements.length));
        var sum = recentMeasurements.reduce(function (acc, m) { return acc + m.coherence; }, 0);
        return sum / recentMeasurements.length;
    };
    /**
     * Calculates the stability of coherence (inverse of standard deviation)
     */
    OuroborosService.prototype.getCoherenceStability = function (cycles) {
        if (cycles === void 0) { cycles = 10; }
        if (this.measurements.length < 2)
            return 1; // Perfect stability with insufficient data
        var recentMeasurements = this.measurements.slice(-Math.min(cycles, this.measurements.length));
        var avg = this.getAverageCoherence(cycles);
        // Calculate variance
        var variance = recentMeasurements.reduce(function (acc, m) { return acc + Math.pow(m.coherence - avg, 2); }, 0) / recentMeasurements.length;
        // Calculate standard deviation
        var stdDev = Math.sqrt(variance);
        // Return stability (inverse of standard deviation, normalized to 0-1)
        // Using 1 / (1 + stdDev) to ensure it's between 0 and 1
        return 1 / (1 + stdDev * 10); // Scaling factor of 10 to make small deviations more visible
    };
    /**
     * Calculates the trend of coherence over recent cycles (positive = increasing, negative = decreasing)
     */
    OuroborosService.prototype.getCoherenceTrend = function (cycles) {
        if (cycles === void 0) { cycles = 10; }
        if (this.measurements.length < 2)
            return 0;
        var recentMeasurements = this.measurements.slice(-Math.min(cycles, this.measurements.length));
        // Simple linear regression to find slope
        var n = recentMeasurements.length;
        var sumX = 0;
        var sumY = 0;
        var sumXY = 0;
        var sumXX = 0;
        for (var i = 0; i < n; i++) {
            var x = i;
            var y = recentMeasurements[i].coherence;
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
        }
        var slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope * 10; // Scale the slope to make small trends more visible
    };
    /**
     * Calculates the QCTF (Quantum Coherence Threshold Formula) value
     * QCTF = CI + (GEF × QEAI × cos θ)
     */
    OuroborosService.prototype.calculateQCTF = function (params) {
        var _a, _b, _c, _d;
        if (params === void 0) { params = {}; }
        // Use current coherence as CI if not provided
        var CI = (_a = params.CI) !== null && _a !== void 0 ? _a : this.getCurrentState().coherence;
        // Default parameters
        var GEF = (_b = params.GEF) !== null && _b !== void 0 ? _b : 0.9;
        var QEAI = (_c = params.QEAI) !== null && _c !== void 0 ? _c : 0.9;
        var theta = (_d = params.theta) !== null && _d !== void 0 ? _d : 0.5;
        // Calculate QCTF
        var QCTF = CI + (GEF * QEAI * Math.cos(theta * Math.PI));
        // Clamp result to 0-1 range
        return Math.max(0, Math.min(1, QCTF));
    };
    /**
     * Returns true if the system is close to the ideal 0.7500 coherence attractor
     */
    OuroborosService.prototype.isAtAttractor = function (tolerance) {
        if (tolerance === void 0) { tolerance = 0.01; }
        var state = this.getCurrentState();
        return Math.abs(state.coherence - 0.75) <= tolerance;
    };
    return OuroborosService;
}(EventEmitter));
export { OuroborosService };
// Export a singleton instance
export var ouroborosService = new OuroborosService();
/**
 * Factory function to create an OuroborosService instance attached to a specific MetaOrchestrator
 *
 * @param metaOrchestrator The meta orchestrator instance to use with the service
 * @returns A new OuroborosService instance
 */
export function createOuroborosService(metaOrchestrator) {
    // For now, we're returning the singleton instance
    // In a future implementation, this could create a new instance tied to the specific metaOrchestrator
    return ouroborosService;
}
