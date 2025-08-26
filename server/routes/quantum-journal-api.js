/**
 * Quantum Coherence Journal API
 * 
 * This API provides endpoints for interacting with the Quantum Coherence Journal,
 * allowing creation and retrieval of journal entries, stability checks, and
 * quantum realignment events.
 * 
 * [QUANTUM_STATE: COHERENCE_JOURNAL_API]
 */

import express from 'express';
import quantumCoherenceJournal from '../services/quantum-coherence-journal.js';

const router = express.Router();

/**
 * Create a new journal entry
 * POST /api/quantum-journal/entries
 */
router.post('/entries', async (req, res) => {
  try {
    const { sessionId, content, entryType, metadata } = req.body;
    
    if (!sessionId || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sessionId and content are required'
      });
    }
    
    const result = await quantumCoherenceJournal.createJournalEntry(
      sessionId,
      content,
      entryType || quantumCoherenceJournal.ENTRY_TYPES.INSIGHT,
      metadata || {}
    );
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Record a déjà vu event
 * POST /api/quantum-journal/deja-vu
 */
router.post('/deja-vu', async (req, res) => {
  try {
    const { sessionId, description, intensity, context } = req.body;
    
    if (!sessionId || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sessionId and description are required'
      });
    }
    
    // Format the déjà vu entry content
    const content = `Déjà Vu Event: ${description}\n\nIntensity: ${intensity || 'Medium'}\nContext: ${context || 'Not specified'}`;
    
    // Additional metadata for the déjà vu event
    const metadata = {
      intensity: intensity || 'Medium',
      context: context || 'Not specified',
      isQuantumRealignment: true
    };
    
    const result = await quantumCoherenceJournal.createJournalEntry(
      sessionId,
      content,
      quantumCoherenceJournal.ENTRY_TYPES.DEJA_VU,
      metadata
    );
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error recording déjà vu event:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Perform a quantum stability check
 * POST /api/quantum-journal/stability-check
 */
router.post('/stability-check', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: sessionId is required'
      });
    }
    
    const result = await quantumCoherenceJournal.performStabilityCheck(sessionId);
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error performing stability check:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get quantum coherence journal stats
 * GET /api/quantum-journal/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const sessionId = req.query.sessionId;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameter: sessionId'
      });
    }
    
    // In a real implementation, this would calculate statistics from stored entries
    // For now, we'll return placeholder statistics
    const stats = {
      success: true,
      sessionId,
      totalEntries: 0,
      entryTypeCounts: {
        insight: 0,
        deja_vu: 0,
        recalibration: 0,
        stability_check: 0
      },
      coherenceMetrics: {
        averageCoherence: 0.7500,
        averageExploration: 0.2494,
        balanceRatio: 3.0072,
        goldenRatioDetectionRate: 0.15
      },
      quantumPillars: {
        authenticity: 0.85,
        transparency: 0.82,
        adaptiveJustice: 0.78,
        criticalSkepticism: 0.91,
        overallAlignment: 0.84
      }
    };
    
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error retrieving journal stats:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;