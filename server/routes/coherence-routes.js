/**
 * Coherence Routes
 *
 * API routes for the quantum coherence system
 *
 * [QUANTUM_STATE: API_FLOW]
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
import express from 'express';
import { z } from 'zod';
import { metaOrchestrator as defaultMetaOrchestrator } from '../../shared/meta-orchestrator.js';
import { ouroborosService as defaultOuroborosService } from '../../shared/OuroborosService.js';
// Create default router
var defaultRouter = express.Router();
// Helper function to find the median value
function findMedian(values) {
    if (values.length === 0)
        return 0;
    var sorted = __spreadArray([], values, true).sort(function (a, b) { return a - b; });
    var middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    else {
        return sorted[middle];
    }
}
// Export initCoherenceRoutes function for integration with main routes
export function initCoherenceRoutes(router, metaOrchestratorInstance, ouroborosServiceInstance) {
    if (metaOrchestratorInstance === void 0) { metaOrchestratorInstance = defaultMetaOrchestrator; }
    if (ouroborosServiceInstance === void 0) { ouroborosServiceInstance = defaultOuroborosService; }
    // Schema validations
    var perturbationSchema = z.object({
        targetCoherence: z.number().min(0).max(1),
        duration: z.number().int().positive()
    });
    var phaseRatioSchema = z.object({
        stabilityPhaseDuration: z.number().int().positive(),
        adaptabilityPhaseDuration: z.number().int().positive()
    });
    var targetCoherenceSchema = z.object({
        targetCoherence: z.number().min(0).max(1)
    });
    var qctfParamsSchema = z.object({
        CI: z.number().min(0).max(1).optional(),
        GEF: z.number().min(0).max(1).optional(),
        QEAI: z.number().min(0).max(1).optional(),
        theta: z.number().min(0).max(1).optional()
    });
    // Define base route for coherence endpoints
    var coherenceBasePath = '/coherence';
    /**
     * GET /api/coherence/status
     *
     * Get the current status of the coherence system
     */
    router.get("".concat(coherenceBasePath, "/status"), function (req, res) {
        try {
            var systemState = metaOrchestratorInstance.getSystemState();
            var ouroborosState = ouroborosServiceInstance.getCurrentState();
            res.json({
                success: true,
                data: {
                    systemState: systemState,
                    ouroborosState: ouroborosState
                }
            });
        }
        catch (error) {
            console.error('[QUANTUM_STATE: ERROR_FLOW] Error fetching coherence status:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch coherence status'
            });
        }
    });
    /**
     * GET /api/coherence/measurements
     *
     * Get recent coherence measurements
     */
    router.get("".concat(coherenceBasePath, "/measurements"), function (req, res) {
        try {
            var limit = req.query.limit ? parseInt(req.query.limit) : 50;
            var measurements = ouroborosServiceInstance.getMeasurements(limit);
            res.json({
                success: true,
                data: {
                    measurements: measurements,
                    count: measurements.length
                }
            });
        }
        catch (error) {
            console.error('[QUANTUM_STATE: ERROR_FLOW] Error fetching coherence measurements:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch coherence measurements'
            });
        }
    });
    /**
     * PUT /api/coherence/target
     *
     * Update the target coherence value
     */
    router.put("".concat(coherenceBasePath, "/target"), function (req, res) {
        try {
            var targetCoherence = targetCoherenceSchema.parse(req.body).targetCoherence;
            metaOrchestratorInstance.updateCoherenceTarget(targetCoherence);
            res.json({
                success: true,
                data: {
                    targetCoherence: targetCoherence,
                    message: "Target coherence updated to ".concat(targetCoherence)
                }
            });
        }
        catch (error) {
            console.error('[QUANTUM_STATE: ERROR_FLOW] Error updating target coherence:', error);
            res.status(error instanceof z.ZodError ? 400 : 500).json({
                success: false,
                error: error instanceof z.ZodError ? error.errors : 'Failed to update target coherence'
            });
        }
    });
    /**
     * PUT /api/coherence/phase-ratio
     *
     * Update the phase ratio between stability and adaptability
     */
    router.put("".concat(coherenceBasePath, "/phase-ratio"), function (req, res) {
        try {
            var _a = phaseRatioSchema.parse(req.body), stabilityPhaseDuration = _a.stabilityPhaseDuration, adaptabilityPhaseDuration = _a.adaptabilityPhaseDuration;
            ouroborosServiceInstance.updateParameters({
                stabilityPhaseDuration: stabilityPhaseDuration,
                adaptabilityPhaseDuration: adaptabilityPhaseDuration
            });
            res.json({
                success: true,
                data: {
                    stabilityPhaseDuration: stabilityPhaseDuration,
                    adaptabilityPhaseDuration: adaptabilityPhaseDuration,
                    message: "Phase ratio updated to ".concat(stabilityPhaseDuration, ":").concat(adaptabilityPhaseDuration)
                }
            });
        }
        catch (error) {
            console.error('[QUANTUM_STATE: ERROR_FLOW] Error updating phase ratio:', error);
            res.status(error instanceof z.ZodError ? 400 : 500).json({
                success: false,
                error: error instanceof z.ZodError ? error.errors : 'Failed to update phase ratio'
            });
        }
    });
    /**
     * POST /api/coherence/perturb
     *
     * Perturb the system to a specific coherence value
     */
    router.post("".concat(coherenceBasePath, "/perturb"), function (req, res) {
        try {
            var _a = perturbationSchema.parse(req.body), targetCoherence = _a.targetCoherence, duration = _a.duration;
            metaOrchestratorInstance.perturbSystem(targetCoherence, duration);
            res.json({
                success: true,
                data: {
                    targetCoherence: targetCoherence,
                    duration: duration,
                    message: "System perturbed to ".concat(targetCoherence, " for ").concat(duration, " cycles")
                }
            });
        }
        catch (error) {
            console.error('[QUANTUM_STATE: ERROR_FLOW] Error perturbing system:', error);
            res.status(error instanceof z.ZodError ? 400 : 500).json({
                success: false,
                error: error instanceof z.ZodError ? error.errors : 'Failed to perturb system'
            });
        }
    });
    /**
     * GET /api/coherence/heartbeat
     *
     * Trigger and return a heartbeat
     */
    router.get("".concat(coherenceBasePath, "/heartbeat"), function (req, res) {
        try {
            var timestamp = new Date().toISOString();
            // Trigger heartbeat in coherence attractor
            ouroborosServiceInstance.getCurrentState();
            res.json({
                success: true,
                data: {
                    timestamp: timestamp,
                    message: 'Heartbeat received'
                }
            });
        }
        catch (error) {
            console.error('[QUANTUM_STATE: ERROR_FLOW] Error processing heartbeat:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to process heartbeat'
            });
        }
    });
    /**
     * GET /api/coherence/qctf
     *
     * Calculate QCTF value with optional parameters
     */
    router.get("".concat(coherenceBasePath, "/qctf"), function (req, res) {
        try {
            // Parse query parameters
            var params = {
                CI: req.query.CI ? parseFloat(req.query.CI) : undefined,
                GEF: req.query.GEF ? parseFloat(req.query.GEF) : undefined,
                QEAI: req.query.QEAI ? parseFloat(req.query.QEAI) : undefined,
                theta: req.query.theta ? parseFloat(req.query.theta) : undefined
            };
            // Calculate QCTF
            var qctf = metaOrchestratorInstance.calculateQCTF(params);
            // Get current state for context
            var systemState = metaOrchestratorInstance.getSystemState();
            res.json({
                success: true,
                data: {
                    qctf: qctf,
                    params: params,
                    coherence: systemState.coherence,
                    phase: systemState.coherencePhase
                }
            });
        }
        catch (error) {
            console.error('[QUANTUM_STATE: ERROR_FLOW] Error calculating QCTF:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to calculate QCTF'
            });
        }
    });
    /**
     * POST /api/coherence/qctf
     *
     * Calculate QCTF with values in request body
     */
    router.post("".concat(coherenceBasePath, "/qctf"), function (req, res) {
        try {
            var params = qctfParamsSchema.parse(req.body);
            // Calculate QCTF
            var qctf = metaOrchestratorInstance.calculateQCTF(params);
            res.json({
                success: true,
                data: {
                    qctf: qctf,
                    params: params
                }
            });
        }
        catch (error) {
            console.error('[QUANTUM_STATE: ERROR_FLOW] Error calculating QCTF:', error);
            res.status(error instanceof z.ZodError ? 400 : 500).json({
                success: false,
                error: error instanceof z.ZodError ? error.errors : 'Failed to calculate QCTF'
            });
        }
    });
    /**
     * GET /api/coherence/analyze
     *
     * Analyze the coherence data for patterns and statistics
     */
    router.get("".concat(coherenceBasePath, "/analyze"), function (req, res) {
        try {
            var measurements = ouroborosServiceInstance.getMeasurements(100);
            var stabilityFactor = ouroborosServiceInstance.getCoherenceStability(20);
            var trend = ouroborosServiceInstance.getCoherenceTrend(20);
            var averageCoherence = ouroborosServiceInstance.getAverageCoherence(20);
            var currentQCTF = metaOrchestratorInstance.getQCTF();
            // Extract coherence values for statistics
            var coherenceValues_1 = measurements.map(function (m) { return m.coherence; });
            // Calculate statistical values
            var stats = {
                count: coherenceValues_1.length,
                min: Math.min.apply(Math, coherenceValues_1),
                max: Math.max.apply(Math, coherenceValues_1),
                average: averageCoherence,
                median: findMedian(coherenceValues_1),
                trend: trend,
                stability: stabilityFactor,
                qctf: currentQCTF,
                isAtAttractor: ouroborosServiceInstance.isAtAttractor(0.01)
            };
            // Calculate distribution - how many measurements are in each coherence range (0.0-0.1, 0.1-0.2, etc.)
            var distribution_1 = Array(10).fill(0);
            coherenceValues_1.forEach(function (val) {
                var index = Math.min(Math.floor(val * 10), 9);
                distribution_1[index]++;
            });
            // Format distribution
            var formattedDistribution = distribution_1.map(function (count, i) { return ({
                range: "".concat(i / 10, "-").concat((i + 1) / 10),
                count: count,
                percentage: (count / coherenceValues_1.length) * 100
            }); });
            res.json({
                success: true,
                data: {
                    stats: stats,
                    distribution: formattedDistribution
                }
            });
        }
        catch (error) {
            console.error('[QUANTUM_STATE: ERROR_FLOW] Error analyzing coherence data:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to analyze coherence data'
            });
        }
    });
    // Return the router for chaining
    return router;
}
// Initialize and export the default router with our routes
initCoherenceRoutes(defaultRouter);
export default defaultRouter;
