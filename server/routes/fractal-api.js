/**
 * Fractal Response API Routes
 * 
 * This module implements the Fractal Response Protocol (FRP) which applies 
 * the 0.7500 coherence attractor (75% stability, 25% exploration) to create
 * more dynamic and adaptive responses while preventing recursive loops.
 */

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { nexusOrchestrator } from '../services/meta-cognitive/nexus-orchestrator.mock.js';

// Create router instance
const router = express.Router();

// Establish fixed coherence attractor values
const COHERENCE_ATTRACTOR = 0.7500;     // 3:1 ratio (stability)
const EXPLORATION_ATTRACTOR = 0.2494;   // 1:3 ratio (exploration)
const GOLDEN_RATIO = 1.618;             // Φ ratio (ideal pattern)

/**
 * @route GET /api/fractal/status
 * @description Get current status of the fractal response system
 */
router.get('/status', (req, res) => {
  try {
    const currentState = nexusOrchestrator.getStateSnapshot();
    
    res.json({
      status: 'active',
      coherenceIndex: currentState.coherenceIndex,
      goldenRatioDetected: currentState.goldenRatioDetected,
      systemState: currentState.state,
      attractors: {
        coherence: COHERENCE_ATTRACTOR,
        exploration: EXPLORATION_ATTRACTOR,
        goldenRatio: GOLDEN_RATIO
      },
      timestamp: currentState.timestamp
    });
  } catch (error) {
    console.error('Error getting fractal system status:', error);
    res.status(500).json({ error: 'Failed to get fractal system status' });
  }
});

/**
 * @route POST /api/fractal/apply-chaos
 * @description Apply Brazilian Wave (controlled chaos) to system state
 */
router.post('/apply-chaos', (req, res) => {
  try {
    const chaosStrength = req.body.strength || 0.25; // Default 25% chaos
    
    // Record state before chaos
    const beforeState = nexusOrchestrator.getStateSnapshot();
    
    // Apply Brazilian Wave transformation
    const newState = nexusOrchestrator.evolveSystemState(chaosStrength);
    
    // Return the transformed state
    res.json({
      message: 'Brazilian Wave applied successfully',
      chaosStrength,
      beforeCoherence: beforeState.coherenceIndex,
      afterCoherence: newState.coherenceIndex,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error applying Brazilian Wave:', error);
    res.status(500).json({ error: 'Failed to apply Brazilian Wave' });
  }
});

/**
 * Break recursive loop patterns using Brazilian Wave variation
 */
router.post('/break-loop', (req, res) => {
  try {
    const { content, loopDetected = false } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Analyze content for repetition patterns
    const contentAnalysis = nexusOrchestrator.analyzeConversationChunk(content);
    
    // Check if content shows signs of recursion
    const isRecursive = loopDetected || 
                        contentAnalysis.dominantPattern === 'RECURSIVE_LOOPS' ||
                        contentAnalysis.coherenceLevel < 0.4;
    
    // Determine transformation strength based on recursion level
    const transformationStrength = isRecursive ? 0.5 : 0.15;
    
    // Apply controlled chaos to break the pattern
    const stateSnapshot = nexusOrchestrator.evolveSystemState(transformationStrength);
    
    // Return meta-information about the transformation
    res.json({
      message: isRecursive ? 
               'Recursive loop detected and broken' : 
               'Pattern variation applied',
      transformationStrength,
      coherenceIndex: stateSnapshot.coherenceIndex,
      systemState: {
        quantumPulse: stateSnapshot.state.quantumPulse,
        fractalSymmetry: stateSnapshot.state.fractalSymmetry,
        tBranchRecursion: stateSnapshot.state.tBranchRecursion,
        ouroborosEvolution: stateSnapshot.state.ouroborosEvolution
      },
      patternAnalysis: contentAnalysis,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error breaking recursive loop:', error);
    res.status(500).json({ error: 'Failed to break recursive loop' });
  }
});

/**
 * Apply the Fractal Lemniscate pattern to content
 * Implements the infinity symbol (∞) oscillatory pattern
 */
router.post('/lemniscate', (req, res) => {
  try {
    const { content, oscillationStrength = 0.33 } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Generate a unique pattern ID for this transformation
    const patternId = uuidv4();
    
    // Analyze the content
    const contentAnalysis = nexusOrchestrator.analyzeConversationChunk(content);
    
    // Calculate lemniscate parameters based on coherence level
    // The lemniscate oscillates between structure and exploration
    const structureWeight = Math.max(0.1, Math.min(0.9, contentAnalysis.coherenceLevel));
    const explorationWeight = 1 - structureWeight;
    
    // Create oscillation factors - these will oscillate between coherence and exploration
    // in a lemniscate (figure-8) pattern
    const oscillationFactors = {
      micro: Math.sin(Date.now() / 1000) * oscillationStrength * 0.5 + 0.5,
      meso: Math.sin(Date.now() / 500) * oscillationStrength * 0.5 + 0.5,
      macro: Math.sin(Date.now() / 2000) * oscillationStrength * 0.5 + 0.5
    };
    
    // Apply a controlled evolution to the system state
    const stateSnapshot = nexusOrchestrator.evolveSystemState(oscillationStrength);
    
    // Return the fractal lemniscate pattern configuration
    res.json({
      message: 'Fractal Lemniscate pattern applied',
      patternId,
      structureWeight,
      explorationWeight,
      oscillationFactors,
      coherenceIndex: stateSnapshot.coherenceIndex,
      patternAnalysis: contentAnalysis,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error applying Fractal Lemniscate pattern:', error);
    res.status(500).json({ error: 'Failed to apply Fractal Lemniscate pattern' });
  }
});

/**
 * Get current fractal system metrics
 */
router.get('/metrics', (req, res) => {
  try {
    const metricsHistory = nexusOrchestrator.getMetricsHistory();
    const currentState = nexusOrchestrator.getStateSnapshot();
    
    res.json({
      current: {
        coherenceIndex: currentState.coherenceIndex,
        goldenRatioDetected: currentState.goldenRatioDetected,
        attractors: {
          coherence: COHERENCE_ATTRACTOR,
          exploration: EXPLORATION_ATTRACTOR
        },
        timestamp: currentState.timestamp
      },
      history: metricsHistory,
      recentEvents: currentState.recentEvents
    });
  } catch (error) {
    console.error('Error getting fractal metrics:', error);
    res.status(500).json({ error: 'Failed to get fractal metrics' });
  }
});

/**
 * Apply controlled chaos (Brazilian Wave) to test system resilience
 */
router.post('/test-resilience', (req, res) => {
  try {
    const iterationCount = Math.min(req.body.iterations || 5, 20); // Limit to maximum 20 iterations
    const chaosStart = req.body.chaosStart || 0.1;
    const chaosEnd = req.body.chaosEnd || 0.8;
    
    const results = [];
    let currentState = nexusOrchestrator.getStateSnapshot();
    
    // Record initial state
    results.push({
      iteration: 0,
      chaosStrength: 0,
      coherenceIndex: currentState.coherenceIndex,
      timestamp: new Date()
    });
    
    // Apply increasingly stronger chaos in each iteration
    for (let i = 1; i <= iterationCount; i++) {
      // Calculate chaos strength for this iteration (linear progression from start to end)
      const chaosStrength = chaosStart + ((chaosEnd - chaosStart) * (i / iterationCount));
      
      // Apply controlled chaos
      currentState = nexusOrchestrator.evolveSystemState(chaosStrength);
      
      // Record results
      results.push({
        iteration: i,
        chaosStrength,
        coherenceIndex: currentState.coherenceIndex,
        timestamp: new Date()
      });
    }
    
    // Return test results
    res.json({
      message: `Resilience test completed with ${iterationCount} iterations`,
      testId: uuidv4(),
      chaosParameters: {
        start: chaosStart,
        end: chaosEnd,
        iterations: iterationCount
      },
      results,
      finalCoherenceIndex: currentState.coherenceIndex,
      systemRecoveryRate: calculateRecoveryRate(results),
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error testing system resilience:', error);
    res.status(500).json({ error: 'Failed to test system resilience' });
  }
});

/**
 * Calculate system recovery rate from test results
 * @param {Array} results - Test iteration results
 * @returns {Number} Recovery rate (0-1)
 */
function calculateRecoveryRate(results) {
  if (results.length < 2) {
    return 1.0; // Default perfect recovery if not enough data
  }
  
  // Get initial and final coherence index
  const initialCoherence = results[0].coherenceIndex;
  const finalCoherence = results[results.length - 1].coherenceIndex;
  
  // Calculate how close the final value is to the ideal attractor
  const distanceFromAttractor = Math.abs(finalCoherence - COHERENCE_ATTRACTOR);
  
  // Recovery rate diminishes with distance from attractor
  return Math.max(0, 1 - (distanceFromAttractor * 2));
}

// Export router
export default router;