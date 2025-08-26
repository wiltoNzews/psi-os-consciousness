/**
 * Quantum Coherence Threshold Formula (QCTF) API Routes v4.0
 * [QUANTUM_STATE: OPERATIONAL_FLOW]
 * 
 * This file provides the REST API endpoints for interacting with the QCTF service
 */

import express from 'express';
import { z } from 'zod';
import { getQCTFService } from './qctf-service.js';

const router = express.Router();
const qctfService = getQCTFService();

// Validation schemas for API endpoints
const basicCoreUpdateSchema = z.object({
  value: z.number().min(0).max(1),
});

const moduleCoherenceUpdateSchema = z.object({
  oracle: z.number().min(0).max(1).optional(),
  nova: z.number().min(0).max(1).optional(),
  gnosis: z.number().min(0).max(1).optional(),
  sanctum: z.number().min(0).max(1).optional(),
  halo: z.number().min(0).max(1).optional(),
});

const scalingMetricsUpdateSchema = z.object({
  parallelTasks: z.number().int().positive().optional(),
  modules: z.number().int().positive().optional(),
  depth: z.number().int().min(0).optional(),
  latency: z.number().min(0).max(1).optional(),
  errorRate: z.number().min(0).max(1).optional(),
});

const toggleActivationSchema = z.object({
  toggleType: z.enum(['stop', 'failsafe', 'reroute', 'wormhole']),
  sourceModule: z.string(),
  reason: z.string(),
  value: z.number().min(0.8).max(1.2).optional(),
});

const cyclicFlowConfigSchema = z.object({
  enabled: z.boolean(),
  period: z.number().positive().optional(),
  amplitude: z.number().min(0.01).max(0.2).optional(),
});

const thresholdUpdateSchema = z.object({
  threshold: z.number().min(0.5).max(0.99),
});

/**
 * GET /api/qctf/current
 * Get current QCTF value and basic metrics
 */
router.get('/current', (req, res) => {
  try {
    const qctfValue = qctfService.calculateCurrentQCTF();
    const qctfData = qctfService.getCurrentQCTFData();
    
    res.json({
      success: true,
      qctf: qctfValue,
      timestamp: new Date().toISOString(),
      thresholdStatus: qctfService.getThresholdStatus(qctfValue),
      targetThreshold: qctfService.getTargetThreshold(),
      metrics: {
        gef: qctfData.gef,
        qeai: qctfData.qeai,
        ci: qctfData.ci,
        dimensionFactor: qctfData.dimensionScalingFactor,
        activeToggles: Object.entries(qctfData.toggles)
          .filter(([_, toggle]) => toggle.active)
          .map(([type, _]) => type)
      }
    });
  } catch (error) {
    console.error('Error getting current QCTF:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get current QCTF',
      error: (error instanceof Error) ? error.message : String(error)
    });
  }
});

/**
 * GET /api/qctf/data
 * Get full QCTF data including history
 */
router.get('/data', (req, res) => {
  try {
    const qctfData = qctfService.getCurrentQCTFData();
    
    res.json({
      success: true,
      data: qctfData,
      toggleEvents: qctfService.getToggleEvents()
    });
  } catch (error) {
    console.error('Error getting QCTF data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get QCTF data',
      error: (error instanceof Error) ? error.message : String(error)
    });
  }
});

/**
 * PATCH /api/qctf/gef
 * Update Global Entanglement Factor
 */
router.patch('/gef', (req, res) => {
  try {
    const validation = basicCoreUpdateSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request data',
        errors: validation.error.errors
      });
    }
    
    qctfService.updateGEF(validation.data.value);
    
    // Calculate the new QCTF after GEF update
    const newQctf = qctfService.calculateCurrentQCTF();
    
    res.json({ 
      success: true, 
      message: 'GEF updated',
      qctf: newQctf
    });
  } catch (error) {
    console.error('Error updating GEF:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update GEF',
      error: (error instanceof Error) ? error.message : String(error)
    });
  }
});

/**
 * PATCH /api/qctf/qeai
 * Update Quantum Ethical Alignment Index
 */
router.patch('/qeai', (req, res) => {
  try {
    const validation = basicCoreUpdateSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request data',
        errors: validation.error.errors
      });
    }
    
    qctfService.updateQEAI(validation.data.value);
    
    // Calculate the new QCTF after QEAI update
    const newQctf = qctfService.calculateCurrentQCTF();
    
    res.json({ 
      success: true, 
      message: 'QEAI updated',
      qctf: newQctf
    });
  } catch (error) {
    console.error('Error updating QEAI:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update QEAI',
      error: (error instanceof Error) ? error.message : String(error)
    });
  }
});

/**
 * PATCH /api/qctf/ci
 * Update Coherence Index
 */
router.patch('/ci', (req, res) => {
  try {
    const validation = basicCoreUpdateSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request data',
        errors: validation.error.errors
      });
    }
    
    qctfService.updateCI(validation.data.value);
    
    // Calculate the new QCTF after CI update
    const newQctf = qctfService.calculateCurrentQCTF();
    
    res.json({ 
      success: true, 
      message: 'CI updated',
      qctf: newQctf
    });
  } catch (error) {
    console.error('Error updating CI:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update CI',
      error: (error instanceof Error) ? error.message : String(error)
    });
  }
});

/**
 * PATCH /api/qctf/module-coherence
 * Update module coherence values
 */
router.patch('/module-coherence', (req, res) => {
  try {
    const validation = moduleCoherenceUpdateSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request data',
        errors: validation.error.errors
      });
    }
    
    qctfService.updateModuleCoherence(validation.data);
    
    // Calculate the new QCTF after coherence update
    const newQctf = qctfService.calculateCurrentQCTF();
    
    res.json({ 
      success: true, 
      message: 'Module coherence updated',
      qctf: newQctf
    });
  } catch (error) {
    console.error('Error updating module coherence:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update module coherence',
      error: (error instanceof Error) ? error.message : String(error)
    });
  }
});

/**
 * PATCH /api/qctf/scaling-metrics
 * Update scaling metrics
 */
router.patch('/scaling-metrics', (req, res) => {
  try {
    const validation = scalingMetricsUpdateSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request data',
        errors: validation.error.errors
      });
    }
    
    qctfService.updateScalingMetrics(validation.data);
    
    // Calculate the new QCTF after metrics update
    const newQctf = qctfService.calculateCurrentQCTF();
    
    res.json({ 
      success: true, 
      message: 'Scaling metrics updated',
      qctf: newQctf
    });
  } catch (error) {
    console.error('Error updating scaling metrics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update scaling metrics',
      error: (error instanceof Error) ? error.message : String(error)
    });
  }
});

/**
 * POST /api/qctf/toggles/activate
 * Activate a toggle
 */
router.post('/toggles/activate', (req, res) => {
  try {
    const validation = toggleActivationSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request data',
        errors: validation.error.errors
      });
    }
    
    const { toggleType, sourceModule, reason, value } = validation.data;
    
    const toggleEvent = qctfService.activateToggle(
      toggleType,
      sourceModule,
      reason,
      value
    );
    
    // Calculate the new QCTF after toggle activation
    const newQctf = qctfService.calculateCurrentQCTF();
    
    res.json({ 
      success: true, 
      message: `Toggle ${toggleType} activated`,
      event: toggleEvent,
      qctf: newQctf
    });
  } catch (error) {
    console.error('Error activating toggle:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to activate toggle',
      error: (error instanceof Error) ? error.message : String(error)
    });
  }
});

/**
 * POST /api/qctf/toggles/deactivate
 * Deactivate a toggle
 */
router.post('/toggles/deactivate', (req, res) => {
  try {
    const validation = toggleActivationSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request data',
        errors: validation.error.errors
      });
    }
    
    const { toggleType, sourceModule, reason } = validation.data;
    
    const toggleEvent = qctfService.deactivateToggle(
      toggleType,
      sourceModule,
      reason
    );
    
    // Calculate the new QCTF after toggle deactivation
    const newQctf = qctfService.calculateCurrentQCTF();
    
    res.json({ 
      success: true, 
      message: `Toggle ${toggleType} deactivated`,
      event: toggleEvent,
      qctf: newQctf
    });
  } catch (error) {
    console.error('Error deactivating toggle:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to deactivate toggle',
      error: (error instanceof Error) ? error.message : String(error)
    });
  }
});

/**
 * PATCH /api/qctf/cyclic-flow
 * Configure cyclic flow detection
 */
router.patch('/cyclic-flow', (req, res) => {
  try {
    const validation = cyclicFlowConfigSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request data',
        errors: validation.error.errors
      });
    }
    
    const { enabled, period, amplitude } = validation.data;
    
    qctfService.configureCyclicFlow(enabled, period, amplitude);
    
    res.json({ 
      success: true, 
      message: `Cyclic flow ${enabled ? 'enabled' : 'disabled'}`
    });
  } catch (error) {
    console.error('Error configuring cyclic flow:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to configure cyclic flow',
      error: (error instanceof Error) ? error.message : String(error)
    });
  }
});

/**
 * PATCH /api/qctf/threshold
 * Update target threshold
 */
router.patch('/threshold', (req, res) => {
  try {
    const validation = thresholdUpdateSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request data',
        errors: validation.error.errors
      });
    }
    
    qctfService.setTargetThreshold(validation.data.threshold);
    
    // Calculate the current QCTF to get updated threshold status
    const currentQctf = qctfService.calculateCurrentQCTF();
    
    res.json({ 
      success: true, 
      message: 'Target threshold updated',
      threshold: validation.data.threshold,
      currentStatus: qctfService.getThresholdStatus(currentQctf)
    });
  } catch (error) {
    console.error('Error updating target threshold:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update target threshold',
      error: (error instanceof Error) ? error.message : String(error)
    });
  }
});

/**
 * POST /api/qctf/reset
 * Reset QCTF to default values
 */
router.post('/reset', (req, res) => {
  try {
    qctfService.resetQCTF();
    
    // Calculate the new QCTF after reset
    const newQctf = qctfService.calculateCurrentQCTF();
    
    res.json({ 
      success: true, 
      message: 'QCTF reset to defaults',
      qctf: newQctf
    });
  } catch (error) {
    console.error('Error resetting QCTF:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reset QCTF',
      error: (error instanceof Error) ? error.message : String(error)
    });
  }
});

export { router };
export default router;