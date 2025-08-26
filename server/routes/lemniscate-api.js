/**
 * Lemniscate Mode API Routes
 * 
 * This module implements the API endpoints for the Lemniscate Mode feature,
 * providing access to the controller's functionality through RESTful endpoints.
 * 
 * [QUANTUM_STATE: API_FLOW]
 */

import express from 'express';
import { 
  CoherenceState,
  TemporalScale,
  LemniscateMode
} from '../../shared/lemniscate/mode-controller.js';
import { getBrazilianWaveProtocol, WaveMode } from '../../shared/lemniscate/brazilian-wave-protocol.js';

// Create router
const router = express.Router();

// Mock data for simulation (in production, would use actual controller)
const mockSystemState = {
  state: 'exploration',
  currentCoherence: 0.2494,
  targetCoherence: 0.2494,
  isTransitioning: false
};

const mockTemporalScales = {
  micro: { 
    mode: LemniscateMode.EXPLORATION,
    coherence: 0.2494,
    oscillationFrequency: 0.1
  },
  meso: { 
    mode: LemniscateMode.EXPLORATION,
    coherence: 0.2494,
    oscillationFrequency: 0.05
  },
  macro: { 
    mode: LemniscateMode.EXPLORATION,
    coherence: 0.2494,
    oscillationFrequency: 0.01
  }
};

const mockMetrics = {
  insights: 602,
  variants: 2,
  temporalScales: mockTemporalScales
};

const mockGoals = {
  goals: [
    {
      id: '1',
      description: 'More creative and exploratory responses',
      timestamp: new Date(Date.now() - 3600000),
      preferredState: CoherenceState.EXPLORATION,
      coherence: 0.2494
    },
    {
      id: '2',
      description: 'Structured and deterministic analysis',
      timestamp: new Date(Date.now() - 86400000),
      preferredState: CoherenceState.STABILITY,
      coherence: 0.7500
    }
  ]
};

const mockHistoricalData = {
  data: Array.from({ length: 100 }).map((_, i) => {
    const noise = Math.sin(i * 0.1) * 0.015;
    const baseCoherence = (i < 50) ? 0.2494 : 0.7500;
    
    return {
      timestamp: new Date(Date.now() - (100 - i) * 900000),
      coherence: baseCoherence + noise,
      state: (i < 50) ? CoherenceState.EXPLORATION : CoherenceState.STABILITY
    };
  })
};

// GET /api/lemniscate/state - Get current system state
router.get('/state', (req, res) => {
  res.json(mockSystemState);
});

// GET /api/lemniscate/metrics - Get system metrics and temporal scales
router.get('/metrics', (req, res) => {
  res.json(mockMetrics);
});

// GET /api/lemniscate/goals - Get active human goals
router.get('/goals', (req, res) => {
  res.json(mockGoals);
});

// GET /api/lemniscate/historical - Get historical coherence data
router.get('/historical', (req, res) => {
  res.json(mockHistoricalData);
});

// POST /api/lemniscate/toggle - Toggle mode for a temporal scale
router.post('/toggle', (req, res) => {
  const { scale } = req.body;
  
  if (!scale || !Object.values(TemporalScale).includes(scale)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid scale parameter'
    });
  }
  
  // Toggle the scale's mode in mock data
  const currentMode = mockTemporalScales[scale].mode;
  const newMode = currentMode === LemniscateMode.STABILITY ? 
    LemniscateMode.EXPLORATION : LemniscateMode.STABILITY;
    
  mockTemporalScales[scale].mode = newMode;
  mockTemporalScales[scale].coherence = newMode === LemniscateMode.STABILITY ? 0.7500 : 0.2494;
  
  // Update system state if macro scale changes
  if (scale === TemporalScale.MACRO) {
    mockSystemState.state = newMode;
    mockSystemState.currentCoherence = mockTemporalScales[scale].coherence;
    mockSystemState.targetCoherence = mockTemporalScales[scale].coherence;
  }
  
  return res.json({
    success: true,
    scale,
    newState: {
      currentMode: newMode,
      coherence: mockTemporalScales[scale].coherence
    }
  });
});

// POST /api/lemniscate/translate-goal - Translate human goal to coherence target
router.post('/translate-goal', (req, res) => {
  const { goalDescription } = req.body;
  
  if (!goalDescription) {
    return res.status(400).json({
      success: false,
      message: 'Goal description is required'
    });
  }
  
  // Simple goal translation logic (would be more sophisticated in production)
  const isExplorationRelated = goalDescription.toLowerCase().includes('creative') || 
    goalDescription.toLowerCase().includes('explor') ||
    goalDescription.toLowerCase().includes('novel') ||
    goalDescription.toLowerCase().includes('idea');
    
  const isStabilityRelated = goalDescription.toLowerCase().includes('structur') ||
    goalDescription.toLowerCase().includes('determin') ||
    goalDescription.toLowerCase().includes('analy') ||
    goalDescription.toLowerCase().includes('precise');
  
  // Calculate confidence and emphasis based on keyword matches
  const explorationEmphasis = isExplorationRelated ? 0.8 : 0.2;
  const stabilityEmphasis = isStabilityRelated ? 0.8 : 0.2;
  const confidenceScore = Math.max(0.5, Math.max(explorationEmphasis, stabilityEmphasis));
  
  // Determine preferred state
  const preferredState = explorationEmphasis > stabilityEmphasis ? 
    CoherenceState.EXPLORATION : CoherenceState.STABILITY;
    
  // Suggest time scale based on goal (simple logic)
  const suggestedTimeScale = goalDescription.length > 100 ? 
    TemporalScale.MACRO : (goalDescription.length > 50 ? 
      TemporalScale.MESO : TemporalScale.MICRO);
  
  return res.json({
    success: true,
    translation: {
      goalDescription,
      preferredState,
      suggestedTimeScale,
      confidenceScore,
      stabilityEmphasis,
      explorationEmphasis
    }
  });
});

// POST /api/lemniscate/apply-goal - Apply translated goal to system
router.post('/apply-goal', (req, res) => {
  const { translation } = req.body;
  
  if (!translation || !translation.preferredState) {
    return res.status(400).json({
      success: false,
      message: 'Valid translation object is required'
    });
  }
  
  // Apply the goal to the mock system state
  const targetCoherence = translation.preferredState === CoherenceState.STABILITY ? 
    0.7500 : 0.2494;
    
  mockSystemState.targetCoherence = targetCoherence;
  mockSystemState.isTransitioning = true;
  
  // In a real implementation, would initiate transition in the controller
  
  // Simulate immediate transition for demo purposes
  mockSystemState.currentCoherence = targetCoherence;
  mockSystemState.state = translation.preferredState;
  mockSystemState.isTransitioning = false;
  
  // Add to mock goals
  const newGoal = {
    id: Date.now().toString(),
    description: translation.goalDescription,
    timestamp: new Date(),
    preferredState: translation.preferredState,
    coherence: targetCoherence
  };
  
  mockGoals.goals.unshift(newGoal);
  
  // Update scale that matches the suggested time scale
  if (translation.suggestedTimeScale) {
    mockTemporalScales[translation.suggestedTimeScale].mode = 
      translation.preferredState === CoherenceState.STABILITY ? 
        LemniscateMode.STABILITY : LemniscateMode.EXPLORATION;
        
    mockTemporalScales[translation.suggestedTimeScale].coherence = targetCoherence;
  }
  
  return res.json({
    success: true,
    message: 'Goal applied successfully',
    newState: mockSystemState,
    appliedGoal: newGoal
  });
});

export default router;