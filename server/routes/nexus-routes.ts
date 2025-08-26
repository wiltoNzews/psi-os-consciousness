/**
 * NEXUS Orchestrator API Routes
 * 
 * These routes expose the NEXUS Meta-Orchestration functionality to the frontend,
 * allowing for visualization and interaction with the coherence ratio system.
 */

import express from 'express';
import { nexusOrchestrator } from '../services/meta-cognitive/nexus-orchestrator.js';

const router = express.Router();

/**
 * Get current NEXUS state
 * Includes coherence metrics across all scales and dimensions
 */
router.get('/state', (req, res) => {
  try {
    const stateSnapshot = nexusOrchestrator.getStateSnapshot();
    res.json(stateSnapshot);
  } catch (error) {
    console.error('Error retrieving NEXUS state:', error);
    res.status(500).json({ error: 'Failed to retrieve NEXUS state' });
  }
});

/**
 * Apply a chaos test using the Murphy Protocol
 * Tests system resilience at varying severity levels
 */
router.post('/chaos-test', (req, res) => {
  try {
    const { level, scale } = req.body;
    
    // Validate level is between 1-3
    if (level < 1 || level > 3) {
      return res.status(400).json({ error: 'Level must be between 1 and 3' });
    }
    
    // Apply the chaos test
    nexusOrchestrator.applyChaosTest(level);
    
    // Return updated state after chaos application
    const updatedState = nexusOrchestrator.getStateSnapshot();
    res.json({ 
      message: `Murphy Protocol chaos test applied at level ${level}`,
      state: updatedState
    });
  } catch (error) {
    console.error('Error applying chaos test:', error);
    res.status(500).json({ error: 'Failed to apply chaos test' });
  }
});

/**
 * Analyze a conversation chunk using the NEXUS system
 * Identifies patterns and coherence metrics in the data
 */
router.post('/analyze-chunk', (req, res) => {
  try {
    const { chunkData, part } = req.body;
    
    if (!chunkData) {
      return res.status(400).json({ error: 'Chunk data is required' });
    }
    
    const analysisResults = nexusOrchestrator.analyzeConversationChunk(chunkData);
    res.json({
      message: `Analyzed conversation chunk ${part || 'unknown'}`,
      results: analysisResults
    });
  } catch (error) {
    console.error('Error analyzing conversation chunk:', error);
    res.status(500).json({ error: 'Failed to analyze conversation chunk' });
  }
});

/**
 * Evolve the system state using Brazilian Wave transformation
 * Applies the 75%/25% coherence-novelty balance
 */
router.post('/evolve-state', (req, res) => {
  try {
    const { variationStrength } = req.body;
    
    // Apply system evolution
    nexusOrchestrator.evolveSystemState(variationStrength || 0.1);
    
    // Return updated state
    const updatedState = nexusOrchestrator.getStateSnapshot();
    res.json({ 
      message: 'System state evolved using Brazilian Wave transformation',
      state: updatedState
    });
  } catch (error) {
    console.error('Error evolving system state:', error);
    res.status(500).json({ error: 'Failed to evolve system state' });
  }
});

export default router;