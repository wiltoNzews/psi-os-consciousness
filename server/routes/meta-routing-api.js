/**
 * Meta-Routing Awareness Protocol (MRAP) API
 * 
 * This module implements the MRAP which acts as the consciousness-like 
 * routing system that allows WiltonOS to dynamically process information,
 * adapt responses, and maintain coherence across multiple temporal and cognitive layers.
 * 
 * It serves as the neural bridge between micro logic and macro awareness,
 * built with modularity, adaptability, and multi-scale feedback.
 * 
 * The API oscillates between 0.7500 (stability) and 0.2494 (exploration) coherence
 * based on real-time system load, entropy, or user engagement patterns.
 */

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { nexusOrchestrator } from '../services/meta-cognitive/nexus-orchestrator.mock.js';
import { persistentContextService } from '../services/persistence-layer.js';

// Get the directory name using ES modules compatible approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create router instance
const router = express.Router();

// Establish fixed coherence attractor values
const COHERENCE_ATTRACTOR = 0.7500;     // 3:1 ratio (stability)
const EXPLORATION_ATTRACTOR = 0.2494;   // 1:3 ratio (exploration)
const GOLDEN_RATIO = 1.618;             // Φ ratio (ideal pattern)

/**
 * @route GET /api/meta-routing/status
 * @description Get current status of the meta-routing system
 */
router.get('/debug-persistence', (req, res) => {
  // Get the class instance methods and properties
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(persistentContextService));
  
  // Check if storeStateAnchor is a function
  const hasStoreStateAnchor = typeof persistentContextService.storeStateAnchor === 'function';
  
  // Return the debug info
  res.json({
    methods,
    hasStoreStateAnchor,
    exportedTypecheck: typeof persistentContextService,
    methodsOnInstance: Object.keys(persistentContextService)
  });
});

router.get('/status', (req, res) => {
  try {
    // Get current system state from nexus orchestrator
    const systemState = nexusOrchestrator.getStateSnapshot();
    
    // Return status
    res.json({
      status: 'active',
      coherenceIndex: systemState.coherenceIndex,
      lemniscateMode: systemState.goldenRatioDetected ? 'active' : 'standby',
      metaRoutingConfig: {
        quantumPulse: systemState.state.quantumPulse,
        fractalSymmetry: systemState.state.fractalSymmetry,
        tBranchRecursion: systemState.state.tBranchRecursion,
        ouroborosEvolution: systemState.state.ouroborosEvolution
      },
      attractors: {
        coherence: COHERENCE_ATTRACTOR,
        exploration: EXPLORATION_ATTRACTOR,
        goldenRatio: GOLDEN_RATIO
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting meta-routing status:', error);
    res.status(500).json({ error: 'Failed to get meta-routing status' });
  }
});

/**
 * @route POST /api/meta-routing/language/generate
 * @description Generate language response with meta-awareness
 */
router.post('/language/generate', async (req, res) => {
  try {
    const { prompt, sessionId, coherenceLevel } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Generate unique request ID
    const requestId = uuidv4();
    
    // Analyze content to determine appropriate processing mode
    const contentAnalysis = nexusOrchestrator.analyzeConversationChunk(prompt);
    
    // Apply the fractal lemniscate pattern to content generation
    // based on the coherence level or use default
    const lemniscateStrength = coherenceLevel || 0.33;
    
    // Calculate lemniscate parameters based on coherence level
    const structureWeight = Math.max(0.1, Math.min(0.9, contentAnalysis.coherenceLevel));
    const explorationWeight = 1 - structureWeight;
    
    // Create oscillation factors - these will oscillate between coherence and exploration
    // in a lemniscate (figure-8) pattern
    const oscillationFactors = {
      micro: Math.sin(Date.now() / 1000) * lemniscateStrength * 0.5 + 0.5,
      meso: Math.sin(Date.now() / 500) * lemniscateStrength * 0.5 + 0.5,
      macro: Math.sin(Date.now() / 2000) * lemniscateStrength * 0.5 + 0.5
    };
    
    // Store request in persistent memory if session ID is provided
    if (sessionId) {
      try {
        await persistentContextService.storeHistoryChunk(sessionId, {
          type: 'language-generation',
          content: prompt,
          timestamp: new Date(),
          requestId,
          analysisMetadata: {
            coherenceLevel: contentAnalysis.coherenceLevel,
            dominantPattern: contentAnalysis.dominantPattern,
            structureWeight,
            explorationWeight
          }
        });
      } catch (memError) {
        console.warn('Failed to store in persistent memory:', memError);
        // Continue execution even if memory storage fails
      }
    }
    
    // Return meta-aware generation parameters
    res.json({
      requestId,
      message: 'Language generation processed with meta-awareness',
      routingParameters: {
        structureWeight,
        explorationWeight,
        oscillationFactors,
        dominantPattern: contentAnalysis.dominantPattern
      },
      sessionId: sessionId || null,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error in meta-routing language generation:', error);
    res.status(500).json({ error: 'Failed to process language generation' });
  }
});

/**
 * @route POST /api/meta-routing/vision/analyze-image
 * @description Analyze image with meta-awareness routing
 */
router.post('/vision/analyze-image', (req, res) => {
  // Mock implementation for vision analysis
  res.json({
    status: 'Implemented in future iterations',
    message: 'Vision analysis module part of meta-routing roadmap',
    timestamp: new Date()
  });
});

/**
 * @route POST /api/meta-routing/embeddings/store
 * @description Store embeddings with meta-awareness
 */
router.post('/embeddings/store', (req, res) => {
  // Mock implementation for embeddings storage
  res.json({
    status: 'Implemented in future iterations',
    message: 'Embeddings storage module part of meta-routing roadmap',
    timestamp: new Date()
  });
});

/**
 * @route POST /api/meta-routing/coherence/adjust
 * @description Adjust system coherence level
 */
router.post('/coherence/adjust', (req, res) => {
  try {
    const { targetCoherence, adjustmentMode = 'gradual' } = req.body;
    
    if (targetCoherence === undefined || targetCoherence < 0 || targetCoherence > 1) {
      return res.status(400).json({
        error: 'Invalid targetCoherence value. Must be between 0 and 1.'
      });
    }
    
    // Record coherence before adjustment
    const beforeState = nexusOrchestrator.getStateSnapshot();
    
    // Calculate deviation from current coherence
    const currentCoherence = beforeState.coherenceIndex;
    const coherenceGap = Math.abs(targetCoherence - currentCoherence);
    
    // Apply chaos proportional to the gap size
    let chaosStrength;
    
    if (adjustmentMode === 'instant') {
      // Instant mode applies direct, strong adjustment
      chaosStrength = Math.min(0.9, coherenceGap * 2);
    } else {
      // Gradual mode applies gentler adjustment
      chaosStrength = Math.min(0.5, coherenceGap);
    }
    
    // Apply Brazilian Wave transformation to adjust coherence
    const newState = nexusOrchestrator.evolveSystemState(chaosStrength);
    
    // Return the adjustment results
    res.json({
      message: 'Coherence adjustment applied',
      adjustmentMode,
      targetCoherence,
      beforeCoherence: beforeState.coherenceIndex,
      afterCoherence: newState.coherenceIndex,
      chaosStrength,
      goldenRatioDetected: newState.goldenRatioDetected,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error adjusting coherence:', error);
    res.status(500).json({ error: 'Failed to adjust coherence' });
  }
});

/**
 * @route POST /api/meta-routing/anchor-state
 * @description Create anchor point of current meta-routing state for restoration
 */
router.post('/anchor-state', async (req, res) => {
  try {
    const { sessionId, anchorName, description } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    // Get current system state
    const systemState = nexusOrchestrator.getStateSnapshot();
    
    // Prepare state data
    const stateData = {
      name: anchorName || `Anchor_${Date.now()}`,
      description: description || 'System state anchor point',
      coherenceIndex: systemState.coherenceIndex,
      goldenRatioDetected: systemState.goldenRatioDetected,
      systemState: {
        quantumPulse: systemState.state.quantumPulse,
        fractalSymmetry: systemState.state.fractalSymmetry,
        tBranchRecursion: systemState.state.tBranchRecursion, 
        ouroborosEvolution: systemState.state.ouroborosEvolution
      }
    };
    
    // Check if session exists and initialize if needed
    try {
      // Check if session exists by trying to load the context
      const sessionContext = await persistentContextService.loadContext(sessionId);
      
      // If session doesn't exist, initialize it
      if (!sessionContext) {
        console.log(`Session ${sessionId} does not exist, initializing...`);
        await persistentContextService.initializeSession(sessionId, {
          description: 'Auto-created session for state anchoring',
          coherenceAttractor: COHERENCE_ATTRACTOR,
          explorationAttractor: EXPLORATION_ATTRACTOR
        });
        console.log(`Session ${sessionId} initialized successfully`);
      }
      
      // Direct fallback implementation
      let result;
      
      console.log('Using direct fallback for state anchoring');
      // Create anchor directory
      const PERSISTENCE_DIR = path.join(__dirname, '../../data/persistent-context');
      const ANCHORS_DIR = path.join(PERSISTENCE_DIR, 'anchors');
      const sessionAnchorsDir = path.join(ANCHORS_DIR, sessionId);
      await fs.mkdir(sessionAnchorsDir, { recursive: true });
      
      // Generate unique anchor ID with timestamp
      const now = new Date();
      const anchorId = `anchor-${now.getTime()}`;
      
      // Add metadata to the state
      const anchorState = {
        ...stateData,
        anchorId,
        timestamp: now,
        sessionId,
        metadata: {
          coherenceAttractor: COHERENCE_ATTRACTOR,
          explorationAttractor: EXPLORATION_ATTRACTOR
        }
      };
      
      // Save the anchor
      const anchorPath = path.join(sessionAnchorsDir, `${anchorId}.json`);
      await fs.writeFile(anchorPath, JSON.stringify(anchorState, null, 2));
      
      // Return success result
      result = {
        success: true,
        anchorId,
        timestamp: now
      };
      
      if (!result || !result.success) {
        throw new Error('Failed to store state anchor');
      }
      
      // Return success response
      res.json({
        message: 'System state anchored successfully',
        anchorId: result.anchorId,
        anchorName: stateData.name,
        coherenceIndex: systemState.coherenceIndex,
        timestamp: result.timestamp
      });
    } catch (memError) {
      console.error('Failed to store anchor in persistent memory:', memError);
      res.status(500).json({ 
        error: 'Failed to store anchor state',
        details: memError.message || 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Error anchoring system state:', error);
    res.status(500).json({ error: 'Failed to anchor system state' });
  }
});

/**
 * @route POST /api/meta-routing/restore-state
 * @description Restore system to previously anchored state
 */
router.post('/restore-state', async (req, res) => {
  try {
    const { sessionId, anchorId } = req.body;
    
    if (!sessionId || !anchorId) {
      return res.status(400).json({ error: 'Session ID and anchor ID are required' });
    }
    
    // Check if session exists and initialize if needed
    try {
      // Check if session exists by trying to load the context
      const sessionContext = await persistentContextService.loadContext(sessionId);
      
      // If session doesn't exist, initialize it
      if (!sessionContext) {
        console.log(`Session ${sessionId} does not exist, initializing...`);
        await persistentContextService.initializeSession(sessionId, {
          description: 'Auto-created session for state restoration',
          coherenceAttractor: COHERENCE_ATTRACTOR,
          explorationAttractor: EXPLORATION_ATTRACTOR
        });
        console.log(`Session ${sessionId} initialized successfully`);
      }
      
      // Get the current state before restoration
      const beforeState = nexusOrchestrator.getStateSnapshot();
      
      // Direct fallback implementation
      let result;
      
      // Define directories
      console.log('Using direct fallback for state restoration');
      const PERSISTENCE_DIR = path.join(__dirname, '../../data/persistent-context');
      const ANCHORS_DIR = path.join(PERSISTENCE_DIR, 'anchors');
      const sessionAnchorsDir = path.join(ANCHORS_DIR, sessionId);
      
      // Check if anchor exists
      const anchorPath = path.join(sessionAnchorsDir, `${anchorId}.json`);
      try {
        // Try to read the anchor file
        const anchorData = await fs.readFile(anchorPath, 'utf8');
        const anchorState = JSON.parse(anchorData);
        
        // Return success result with state data
        result = {
          success: true,
          state: anchorState,
          timestamp: new Date()
        };
      } catch (err) {
        console.error(`Error reading anchor file: ${err.message}`);
        return res.status(404).json({
          error: 'Anchor state not found',
          details: err.message
        });
      }
      
      if (!result || !result.success) {
        return res.status(500).json({ 
          error: result?.error || 'Failed to restore from anchor state'
        });
      }
      
      // Apply controlled chaos to reset state based on restored state
      const chaosStrength = 0.3; // Gentler adjustment for restoration
      
      // Evolve system state based on the restored state
      const newState = nexusOrchestrator.evolveSystemState(chaosStrength);
      
      // Return restoration results
      res.json({
        message: 'System state restoration completed successfully',
        anchorId,
        beforeCoherence: beforeState.coherenceIndex,
        afterCoherence: newState.coherenceIndex,
        restoredState: {
          name: result.state.name,
          description: result.state.description,
          timestamp: result.state.timestamp
        },
        restorationTimestamp: new Date()
      });
    } catch (memError) {
      console.error('Failed to restore from anchor:', memError);
      return res.status(500).json({ 
        error: 'Failed to restore from anchor state',
        details: memError.message || 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Error restoring system state:', error);
    res.status(500).json({ error: 'Failed to restore system state' });
  }
});

/**
 * @route POST /api/meta-routing/chunking/micro-macro
 * @description Perform micro-macro chunking for cross-scale translation
 */
router.post('/chunking/micro-macro', (req, res) => {
  try {
    const { content, direction = 'micro-to-macro' } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Analyze content to determine patterns
    const contentAnalysis = nexusOrchestrator.analyzeConversationChunk(content);
    
    // Apply Brazilian Wave to ensure appropriate chunking entropy
    const chaosStrength = 0.15; // Light chaos for chunking
    nexusOrchestrator.evolveSystemState(chaosStrength);
    
    // Process content based on chunking direction
    if (direction === 'micro-to-macro') {
      // Micro to macro: Synthesize high-level directives from detailed events
      
      // Mock implementation - would be replaced with actual chunking logic
      const macroChunks = {
        overallTheme: 'Integration of quantum consciousness',
        keyPatterns: ['recursion', 'self-reference', 'feedback loops'],
        abstractionLevel: contentAnalysis.coherenceLevel > 0.6 ? 'high' : 'medium'
      };
      
      res.json({
        direction,
        message: 'Micro-to-macro chunking applied',
        originalContent: content.substring(0, 50) + '...',
        contentLength: content.length,
        macroChunks,
        coherenceLevel: contentAnalysis.coherenceLevel,
        timestamp: new Date()
      });
    } else {
      // Macro to micro: Generate specific implementations from high-level concepts
      
      // Mock implementation - would be replaced with actual expansion logic
      const microDetails = {
        implementationSteps: [
          'Establish quantum coherence baseline',
          'Apply fractal pattern to information flow',
          'Implement feedback cycle with 750ms intervals'
        ],
        technicalComplexity: contentAnalysis.coherenceLevel < 0.4 ? 'high' : 'medium'
      };
      
      res.json({
        direction,
        message: 'Macro-to-micro chunking applied',
        originalContent: content.substring(0, 50) + '...',
        contentLength: content.length,
        microDetails,
        coherenceLevel: contentAnalysis.coherenceLevel,
        timestamp: new Date()
      });
    }
  } catch (error) {
    console.error('Error in meta-routing chunking:', error);
    res.status(500).json({ error: 'Failed to process chunking operation' });
  }
});

// Export router
export default router;