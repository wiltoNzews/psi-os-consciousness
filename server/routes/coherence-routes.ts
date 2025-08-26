/**
 * Coherence Routes
 * 
 * API routes for the quantum coherence system
 * 
 * [QUANTUM_STATE: API_FLOW]
 */

import express from 'express';
import { z } from 'zod';
import type { MetaOrchestrator } from '../../shared/meta-orchestrator.js';
import type { OuroborosService } from '../../shared/OuroborosService.js';
import { metaOrchestrator as defaultMetaOrchestrator } from '../../shared/meta-orchestrator.js';
import { ouroborosService as defaultOuroborosService } from '../../shared/OuroborosService.js';

// Import CoherenceMeasurement interface
import type { CoherenceMeasurement } from '../../shared/CoherenceAttractor.js';

// Create default router
const defaultRouter = express.Router();

// Helper function to find the median value
function findMedian(values: number[]): number {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
}

// Export initCoherenceRoutes function for integration with main routes
export function initCoherenceRoutes(
  router: express.Router, 
  metaOrchestratorInstance: typeof defaultMetaOrchestrator = defaultMetaOrchestrator, 
  ouroborosServiceInstance: typeof defaultOuroborosService = defaultOuroborosService
): express.Router {
  
  // Schema validations
  const perturbationSchema = z.object({
    targetCoherence: z.number().min(0).max(1),
    duration: z.number().int().positive()
  });
  
  const phaseRatioSchema = z.object({
    stabilityPhaseDuration: z.number().int().positive(),
    adaptabilityPhaseDuration: z.number().int().positive()
  });
  
  const targetCoherenceSchema = z.object({
    targetCoherence: z.number().min(0).max(1)
  });
  
  const qctfParamsSchema = z.object({
    CI: z.number().min(0).max(1).optional(),
    GEF: z.number().min(0).max(1).optional(),
    QEAI: z.number().min(0).max(1).optional(),
    theta: z.number().min(0).max(1).optional()
  });

  // Define base route for coherence endpoints
  const coherenceBasePath = '/coherence';

  /**
   * GET /api/coherence/status
   * 
   * Get the current status of the coherence system
   */
  router.get(`${coherenceBasePath}/status`, (req, res) => {
    try {
      const systemState = metaOrchestratorInstance.getSystemState();
      const ouroborosState = ouroborosServiceInstance.getCurrentState();
      
      res.json({
        success: true,
        data: {
          systemState,
          ouroborosState
        }
      });
    } catch (error) {
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
  router.get(`${coherenceBasePath}/measurements`, (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const measurements = ouroborosServiceInstance.getMeasurements(limit);
      
      res.json({
        success: true,
        data: {
          measurements,
          count: measurements.length
        }
      });
    } catch (error) {
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
  router.put(`${coherenceBasePath}/target`, (req, res) => {
    try {
      const { targetCoherence } = targetCoherenceSchema.parse(req.body);
      
      metaOrchestratorInstance.updateCoherenceTarget(targetCoherence);
      
      res.json({
        success: true,
        data: {
          targetCoherence,
          message: `Target coherence updated to ${targetCoherence}`
        }
      });
    } catch (error) {
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
  router.put(`${coherenceBasePath}/phase-ratio`, (req, res) => {
    try {
      const { stabilityPhaseDuration, adaptabilityPhaseDuration } = phaseRatioSchema.parse(req.body);
      
      ouroborosServiceInstance.updateParameters({
        stabilityPhaseDuration,
        adaptabilityPhaseDuration
      });
      
      res.json({
        success: true,
        data: {
          stabilityPhaseDuration,
          adaptabilityPhaseDuration,
          message: `Phase ratio updated to ${stabilityPhaseDuration}:${adaptabilityPhaseDuration}`
        }
      });
    } catch (error) {
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
  router.post(`${coherenceBasePath}/perturb`, (req, res) => {
    try {
      const { targetCoherence, duration } = perturbationSchema.parse(req.body);
      
      metaOrchestratorInstance.perturbSystem(targetCoherence, duration);
      
      res.json({
        success: true,
        data: {
          targetCoherence,
          duration,
          message: `System perturbed to ${targetCoherence} for ${duration} cycles`
        }
      });
    } catch (error) {
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
  router.get(`${coherenceBasePath}/heartbeat`, (req, res) => {
    try {
      const timestamp = new Date().toISOString();
      
      // Trigger heartbeat in coherence attractor
      ouroborosServiceInstance.getCurrentState();
      
      res.json({
        success: true,
        data: {
          timestamp,
          message: 'Heartbeat received'
        }
      });
    } catch (error) {
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
  router.get(`${coherenceBasePath}/qctf`, (req, res) => {
    try {
      // Parse query parameters
      const params = {
        CI: req.query.CI ? parseFloat(req.query.CI as string) : undefined,
        GEF: req.query.GEF ? parseFloat(req.query.GEF as string) : undefined,
        QEAI: req.query.QEAI ? parseFloat(req.query.QEAI as string) : undefined,
        theta: req.query.theta ? parseFloat(req.query.theta as string) : undefined
      };
      
      // Calculate QCTF
      const qctf = metaOrchestratorInstance.calculateQCTF(params);
      
      // Get current state for context
      const systemState = metaOrchestratorInstance.getSystemState();
      
      res.json({
        success: true,
        data: {
          qctf,
          params,
          coherence: systemState.coherence,
          phase: systemState.coherencePhase
        }
      });
    } catch (error) {
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
  router.post(`${coherenceBasePath}/qctf`, (req, res) => {
    try {
      const params = qctfParamsSchema.parse(req.body);
      
      // Calculate QCTF
      const qctf = metaOrchestratorInstance.calculateQCTF(params);
      
      res.json({
        success: true,
        data: {
          qctf,
          params
        }
      });
    } catch (error) {
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
  router.get(`${coherenceBasePath}/analyze`, (req, res) => {
    try {
      const measurements = ouroborosServiceInstance.getMeasurements(100);
      const stabilityFactor = ouroborosServiceInstance.getCoherenceStability(20);
      const trend = ouroborosServiceInstance.getCoherenceTrend(20);
      const averageCoherence = ouroborosServiceInstance.getAverageCoherence(20);
      const currentQCTF = metaOrchestratorInstance.getQCTF();
      
      // Extract coherence values for statistics
      const coherenceValues = measurements.map((m: CoherenceMeasurement) => m.coherence);
      
      // Calculate statistical values
      const stats = {
        count: coherenceValues.length,
        min: Math.min(...coherenceValues),
        max: Math.max(...coherenceValues),
        average: averageCoherence,
        median: findMedian(coherenceValues),
        trend,
        stability: stabilityFactor,
        qctf: currentQCTF,
        isAtAttractor: ouroborosServiceInstance.isAtAttractor(0.01)
      };
      
      // Calculate distribution - how many measurements are in each coherence range (0.0-0.1, 0.1-0.2, etc.)
      const distribution = Array(10).fill(0);
      coherenceValues.forEach((val: number) => {
        const index = Math.min(Math.floor(val * 10), 9);
        distribution[index]++;
      });
      
      // Format distribution
      const formattedDistribution = distribution.map((count, i) => ({
        range: `${i/10}-${(i+1)/10}`,
        count,
        percentage: (count / coherenceValues.length) * 100
      }));
      
      res.json({
        success: true,
        data: {
          stats,
          distribution: formattedDistribution
        }
      });
    } catch (error) {
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