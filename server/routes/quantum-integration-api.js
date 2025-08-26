/**
 * Quantum-Fractal Integration API Routes
 * 
 * These routes expose the quantum-fractal integration services, enabling:
 * - Seamless modularity and coherent quantum-fractal operations
 * - Direct integration of external AI agents
 * - Recursive coherence checks and adaptive execution loops
 */

const express = require('express');
const router = express.Router();
const quantumFractalIntegration = require('../services/quantum-fractal-integration');

/**
 * @route POST /api/quantum-integration/tag-agent
 * @desc Identify and tag an external agent with quantum metadata
 */
router.post('/tag-agent', async (req, res) => {
  try {
    const { agentPurpose, fractalLevel, coherenceParams } = req.body;
    
    if (!agentPurpose) {
      return res.status(400).json({
        success: false,
        error: 'Agent purpose is required'
      });
    }

    const module = quantumFractalIntegration.identifyAndTagAgent(
      agentPurpose,
      fractalLevel || 1,
      coherenceParams || {}
    );

    return res.json({
      success: true,
      module: module.serialize()
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR] Failed to tag agent:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to tag agent'
    });
  }
});

/**
 * @route POST /api/quantum-integration/embed
 * @desc Embed a tagged agent module into the quantum-fractal execution environment
 */
router.post('/embed', async (req, res) => {
  try {
    const { moduleId, parentModuleId } = req.body;
    
    if (!moduleId) {
      return res.status(400).json({
        success: false,
        error: 'Module ID is required'
      });
    }

    const module = quantumFractalIntegration.quantumEmbed(moduleId, parentModuleId);

    return res.json({
      success: true,
      module: module.serialize()
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR] Failed to embed module:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to embed module'
    });
  }
});

/**
 * @route GET /api/quantum-integration/validate-coherence
 * @desc Validate fractal coherence across the integrated system
 */
router.get('/validate-coherence', async (req, res) => {
  try {
    const coherenceState = quantumFractalIntegration.validateFractalCoherence();

    return res.json({
      success: true,
      coherenceState
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR] Failed to validate coherence:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to validate coherence'
    });
  }
});

/**
 * @route POST /api/quantum-integration/adaptive-loop
 * @desc Execute an adaptive adjustment loop to optimize coherence
 */
router.post('/adaptive-loop', async (req, res) => {
  try {
    const updatedCoherenceState = quantumFractalIntegration.adaptiveExecutionLoop();
    
    // Check if adjustments were made based on ratio deviation threshold check in the service
    const adjustmentsApplied = updatedCoherenceState.ratioDeviation > 0.1;

    return res.json({
      success: true,
      adjustmentsApplied,
      coherenceState: updatedCoherenceState
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR] Failed to execute adaptive loop:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to execute adaptive loop'
    });
  }
});

/**
 * @route GET /api/quantum-integration/modules
 * @desc Get all modules in the quantum-fractal system
 */
router.get('/modules', async (req, res) => {
  try {
    const modules = quantumFractalIntegration.getAllModules();

    return res.json({
      success: true,
      modules
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR] Failed to get modules:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get modules'
    });
  }
});

/**
 * @route POST /api/quantum-integration/send-message
 * @desc Send a quantum-tagged message to a specific module
 */
router.post('/send-message', async (req, res) => {
  try {
    const { targetModuleId, message, options } = req.body;
    
    if (!targetModuleId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Target module ID and message are required'
      });
    }

    const result = quantumFractalIntegration.sendQuantumTaggedMessage(
      targetModuleId,
      message,
      options || {}
    );

    return res.json({
      success: true,
      messageId: result.id,
      targetModuleId,
      quantumTags: result.quantumTags
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR] Failed to send message:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send message'
    });
  }
});

/**
 * @route POST /api/quantum-integration/broadcast
 * @desc Broadcast a quantum-tagged message to all modules
 */
router.post('/broadcast', async (req, res) => {
  try {
    const { message, options } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const results = quantumFractalIntegration.broadcastQuantumMessage(
      message,
      options || {}
    );

    return res.json({
      success: true,
      messageCount: results.length,
      messageIds: results.map(r => r.id)
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR] Failed to broadcast message:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to broadcast message'
    });
  }
});

module.exports = router;