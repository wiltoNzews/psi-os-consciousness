/**
 * Quantum Prompt API
 * 
 * This API provides endpoints for generating responses using the Quantum Prompt methodology,
 * implementing the MASTER PROMPT concepts: Fractal Response Diversification, 
 * Adaptive Checkpoints, Brazilian Wave Oscillation, and Quantum Chaos & Coherence.
 * 
 * [QUANTUM_STATE: PROMPT_API]
 */

import express from 'express';
import quantumPromptService from '../services/quantum-prompt-service.js';

const router = express.Router();

/**
 * Generate a quantum-enhanced response
 * POST /api/quantum-prompt/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt, sessionId, explorationLevel, languageOverlap, previousResponses } = req.body;
    
    if (!prompt || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: prompt and sessionId are required'
      });
    }
    
    // Generate response using quantum prompt service
    const result = await quantumPromptService.generateQuantumResponse(
      prompt,
      sessionId,
      {
        explorationLevel: parseFloat(explorationLevel || 0.2494),
        languageOverlap: languageOverlap || 'en',
        previousResponses: previousResponses || []
      }
    );
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generating quantum response:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get previous responses for a session (to help with loop detection)
 * GET /api/quantum-prompt/history
 */
router.get('/history', async (req, res) => {
  try {
    const { sessionId, limit } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameter: sessionId'
      });
    }
    
    // For now, we'll return placeholder history
    // In a real implementation, this would query from storage
    const history = {
      success: true,
      sessionId,
      responses: [],
      coherenceMetrics: {
        averageCoherence: 0.7500,
        averageExploration: 0.2494,
        balanceRatio: 3.0072
      }
    };
    
    return res.status(200).json(history);
  } catch (error) {
    console.error('Error retrieving quantum response history:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Reset a quantum prompt session
 * POST /api/quantum-prompt/reset
 */
router.post('/reset', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: sessionId'
      });
    }
    
    // For now, just return success
    // In a real implementation, this would clear session history
    return res.status(200).json({
      success: true,
      message: 'Quantum prompt session reset successfully',
      sessionId
    });
  } catch (error) {
    console.error('Error resetting quantum prompt session:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;