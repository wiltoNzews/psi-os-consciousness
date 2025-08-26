/**
 * Lemniscate API Router Implementation
 * 
 * This module provides the backend implementation for the Lemniscate Mode feature,
 * exposing API endpoints to interact with the coherence system.
 * 
 * [QUANTUM_STATE: SERVER_LEMNISCATE_ROUTES]
 */

import express from 'express';

// Define our own enums for the server implementation
export const TemporalScale = {
  MICRO: 'micro',
  MESO: 'meso',
  MACRO: 'macro'
};

export const LemniscateMode = {
  STABILITY: 'stability',
  EXPLORATION: 'exploration',
  STABILITY_TO_EXPLORATION: 'stability_to_exploration',
  EXPLORATION_TO_STABILITY: 'exploration_to_stability',
  BALANCED: 'balanced'
};

export const WaveMode = {
  HARMONIC: 'harmonic',
  CHAOTIC: 'chaotic',
  RESONANT: 'resonant'
};

// Define constants that would be imported from shared modules
export const TemporalLayer = {
  MICRO: 'micro',
  MESO: 'meso',
  MACRO: 'macro' 
};

// Export constants to match client implementation
export const STABILITY_COHERENCE = 0.7500;
export const EXPLORATION_COHERENCE = 0.2494;

// Create the router function
export default function createLemniscateRouter({ storage }) {
  const router = express.Router();
  
  // Mock controller state for the server
  // Note: In a production system, this would be loaded from the shared module
  // but for this demo, we'll create a basic state structure
  let controllerState = {
    currentMode: 'stability',
    previousMode: null,
    currentCoherence: STABILITY_COHERENCE,
    targetCoherence: STABILITY_COHERENCE,
    inTransition: false,
    transitionStartTime: null,
    transitionProgress: 0,
    temporalScales: {
      'micro': { mode: 'stability', coherence: STABILITY_COHERENCE },
      'meso': { mode: 'stability', coherence: STABILITY_COHERENCE },
      'macro': { mode: 'stability', coherence: STABILITY_COHERENCE }
    },
    lastUpdateTime: Date.now(),
    history: [],
    metrics: {
      stability: {
        durationTotal: 0,
        transitionCount: 0,
        averageCoherence: STABILITY_COHERENCE
      },
      exploration: {
        durationTotal: 0,
        transitionCount: 0,
        averageCoherence: EXPLORATION_COHERENCE
      },
      insights: []
    }
  };
  
  // Mock implementation of the Brazilian wave protocol
  let brazilianWaveProtocol = {
    mode: 'harmonic',
    baseCoherence: 0.75,
    variability: 0.1,
    getVisualizationData: (points = 100, startTime = 0) => {
      const data = [];
      const timeStep = 0.5;
      
      for (let i = 0; i < points; i++) {
        const t = startTime + (i * timeStep);
        const value = 0.5 + Math.sin(t * 0.5) * 0.2;
        
        data.push({
          index: i,
          time: t,
          y: value,
          micro: value + Math.sin(t * 2) * 0.1,
          meso: value + Math.sin(t * 0.8) * 0.1,
          macro: value + Math.sin(t * 0.3) * 0.1
        });
      }
      
      return data;
    }
  };
  
  // Mock functions for state management that would normally be imported
  function updateControllerState(state, timestamp) {
    // Simple mock implementation that just updates last update time
    // In a real implementation, this would handle transitions and time-based coherence changes
    return {
      ...state,
      lastUpdateTime: timestamp
    };
  }
  
  function toggleScale(state, scaleName, timestamp) {
    // Simple mock implementation that toggles the specified scale between stability and exploration
    const scale = state.temporalScales[scaleName];
    const newMode = scale.mode === 'stability' ? 'exploration' : 'stability';
    const newCoherence = newMode === 'stability' ? STABILITY_COHERENCE : EXPLORATION_COHERENCE;
    
    return {
      ...state,
      temporalScales: {
        ...state.temporalScales,
        [scaleName]: {
          mode: newMode,
          coherence: newCoherence
        }
      },
      lastUpdateTime: timestamp
    };
  }
  
  function applyFeedback(state, feedback, timestamp) {
    // Simple mock implementation that adds an insight and adjusts coherence slightly
    const { insightValue, insightType } = feedback;
    const newInsight = {
      type: insightType,
      value: insightValue,
      timestamp: new Date(timestamp)
    };
    
    // Adjust coherence based on insight type
    let coherenceAdjustment = 0;
    if (insightType === 'creative' && insightValue > 3) {
      coherenceAdjustment = -0.05; // Move toward exploration for high creative insights
    } else if (insightType === 'structured' && insightValue > 3) {
      coherenceAdjustment = 0.05; // Move toward stability for high structured insights
    }
    
    const newCoherence = Math.max(0.1, Math.min(0.9, state.currentCoherence + coherenceAdjustment));
    
    return {
      ...state,
      currentCoherence: newCoherence,
      metrics: {
        ...state.metrics,
        insights: [...state.metrics.insights, newInsight]
      },
      lastUpdateTime: timestamp
    };
  }
  
  function applyCoherenceGoal(state, goal, timestamp) {
    // Simple mock implementation that sets a target coherence based on the goal
    const { preferredState, suggestedTimeScale } = goal;
    
    let targetCoherence = state.currentCoherence;
    if (preferredState === 'stability') {
      targetCoherence = STABILITY_COHERENCE;
    } else if (preferredState === 'exploration') {
      targetCoherence = EXPLORATION_COHERENCE;
    } else {
      targetCoherence = 0.5; // Balanced
    }
    
    return {
      ...state,
      targetCoherence,
      currentMode: preferredState,
      lastUpdateTime: timestamp
    };
  }

  // Get current controller state
  router.get('/state', (req, res) => {
    // Update state with current time
    const currentTime = Date.now();
    controllerState = updateControllerState(controllerState, currentTime);
    
    res.json({
      mode: controllerState.currentMode,
      coherence: controllerState.currentCoherence,
      inTransition: controllerState.inTransition,
      transitionProgress: controllerState.transitionProgress,
      timestamp: currentTime
    });
  });
  
  // Get visualization data for the dashboard
  router.get('/visualization', (req, res) => {
    const currentTime = Date.now();
    controllerState = updateControllerState(controllerState, currentTime);
    
    // Prepare visualization data response
    const stateForClient = {
      currentMode: controllerState.currentMode,
      currentCoherence: controllerState.currentCoherence,
      targetCoherence: controllerState.targetCoherence,
      state: getModeCoherenceState(controllerState.currentMode),
      inTransition: controllerState.inTransition,
      transitionProgress: controllerState.transitionProgress,
      temporalScales: controllerState.temporalScales,
      insights: controllerState.metrics.insights || [],
      historicalData: controllerState.history.slice(-50), // Last 50 history points
      timestamp: currentTime
    };
    
    res.json(stateForClient);
  });
  
  // Toggle a temporal scale
  router.post('/toggle-scale', (req, res) => {
    const { scale } = req.body;
    
    if (!scale || !Object.values(TemporalScale).includes(scale)) {
      return res.status(400).json({ error: 'Invalid temporal scale' });
    }
    
    const currentTime = Date.now();
    controllerState = toggleScale(controllerState, scale, currentTime);
    
    res.json({
      mode: controllerState.currentMode,
      coherence: controllerState.currentCoherence,
      scales: controllerState.temporalScales,
      timestamp: currentTime
    });
  });
  
  // Apply user feedback to adjust the system
  router.post('/feedback', (req, res) => {
    const { insightValue, insightType } = req.body;
    
    if (insightValue === undefined || !insightType) {
      return res.status(400).json({ error: 'Invalid feedback data' });
    }
    
    const currentTime = Date.now();
    controllerState = applyFeedback(controllerState, {
      insightValue: parseFloat(insightValue),
      insightType
    }, currentTime);
    
    res.json({
      mode: controllerState.currentMode,
      coherence: controllerState.currentCoherence,
      insights: controllerState.metrics.insights.slice(-10), // Last 10 insights
      timestamp: currentTime
    });
  });
  
  // Translate natural language goal to system parameters
  router.post('/translate-goal', (req, res) => {
    const { goalText } = req.body;
    
    if (!goalText) {
      return res.status(400).json({ error: 'Goal text is required' });
    }
    
    // Simplified goal translation logic
    // In a production system, this would use NLP or similar
    const lowerGoal = goalText.toLowerCase();
    const goal = {
      originalText: goalText,
      preferredState: 'balanced', // Default to balanced
      suggestedTimeScale: TemporalScale.MESO
    };
    
    // Detect stability indicators
    if (
      lowerGoal.includes('focus') || 
      lowerGoal.includes('stability') || 
      lowerGoal.includes('structured') ||
      lowerGoal.includes('detailed') ||
      lowerGoal.includes('logical') ||
      lowerGoal.includes('analytical')
    ) {
      goal.preferredState = 'stability';
    }
    
    // Detect exploration indicators
    if (
      lowerGoal.includes('creative') || 
      lowerGoal.includes('explore') || 
      lowerGoal.includes('exploration') ||
      lowerGoal.includes('divergent') ||
      lowerGoal.includes('inspiration') ||
      lowerGoal.includes('innovative')
    ) {
      goal.preferredState = 'exploration';
    }
    
    // Detect temporal scale indicators
    if (lowerGoal.includes('quick') || lowerGoal.includes('immediate')) {
      goal.suggestedTimeScale = TemporalScale.MICRO;
    } else if (lowerGoal.includes('long term') || lowerGoal.includes('sustained')) {
      goal.suggestedTimeScale = TemporalScale.MACRO;
    }
    
    res.json(goal);
  });
  
  // Apply coherence goal
  router.post('/apply-goal', (req, res) => {
    const { preferredState, suggestedTimeScale } = req.body;
    
    if (!preferredState) {
      return res.status(400).json({ error: 'Preferred state is required' });
    }
    
    const currentTime = Date.now();
    controllerState = applyCoherenceGoal(controllerState, {
      preferredState,
      suggestedTimeScale
    }, currentTime);
    
    res.json({
      mode: controllerState.currentMode,
      coherence: controllerState.currentCoherence,
      goalApplied: true,
      timestamp: currentTime
    });
  });
  
  // Get historical data points for analytics
  router.get('/history', (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const history = controllerState.history.slice(-limit);
    
    res.json(history);
  });
  
  // Get system metrics
  router.get('/metrics', (req, res) => {
    const currentTime = Date.now();
    controllerState = updateControllerState(controllerState, currentTime);
    
    res.json({
      stability: controllerState.metrics.stability,
      exploration: controllerState.metrics.exploration,
      insightCount: controllerState.metrics.insights.length,
      recentInsights: controllerState.metrics.insights.slice(-5),
      timestamp: currentTime
    });
  });
  
  // Brazilian Wave Protocol endpoints
  
  // Get wave configurations
  router.get('/wave-modes', (req, res) => {
    res.json({
      modes: Object.values(WaveMode),
      currentMode: brazilianWaveProtocol.mode
    });
  });
  
  // Update wave protocol configuration
  router.post('/wave-config', (req, res) => {
    const { mode, baseCoherence, variability } = req.body;
    
    if (mode && Object.values(WaveMode).includes(mode)) {
      // Update protocol configuration
      brazilianWaveProtocol = {
        ...brazilianWaveProtocol,
        mode: mode,
        baseCoherence: parseFloat(baseCoherence) || 0.75,
        variability: parseFloat(variability) || 0.1
      };
      
      res.json({
        mode: brazilianWaveProtocol.mode,
        baseCoherence: brazilianWaveProtocol.baseCoherence,
        variability: brazilianWaveProtocol.variability
      });
    } else {
      res.status(400).json({ error: 'Invalid wave mode' });
    }
  });
  
  // Get wave visualization data
  router.get('/wave-visualization', (req, res) => {
    const points = parseInt(req.query.points) || 100;
    const startTime = parseInt(req.query.startTime) || 0;
    
    const visualizationData = brazilianWaveProtocol.getVisualizationData(points, startTime);
    
    res.json(visualizationData);
  });
  
  return router;
}

/**
 * Utility to get coherence state from mode
 * 
 * @param {string} mode - The mode
 * @returns {string} The coherence state
 */
function getModeCoherenceState(mode) {
  switch (mode) {
    case LemniscateMode.STABILITY:
      return 'stability';
    case LemniscateMode.EXPLORATION:
      return 'exploration';
    case LemniscateMode.STABILITY_TO_EXPLORATION:
    case LemniscateMode.EXPLORATION_TO_STABILITY:
      return 'transition';
    default:
      return 'balanced';
  }
}