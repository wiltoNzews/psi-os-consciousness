/**
 * Persistent Memory API Routes
 * 
 * This module implements the long-term memory storage system required by
 * the Quantum Coherence Threshold Formula (QCTF). It manages session state,
 * history chunks, meta insights, and strategic plans.
 */

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { persistentContextService } from '../services/persistence-layer.js';
import { CognitiveLayer, MetaEventType } from '../services/context-manager.js';

// Get the directory name using ES modules compatible approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create router instance
const router = express.Router();

/**
 * @route GET /api/memory/sessions
 * @description Get all available memory sessions
 */
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await persistentContextService.getAllSessionIds();
    
    // Load detailed session data for each ID
    const detailedSessions = await Promise.all(
      sessions.map(async sessionId => {
        const session = await persistentContextService.loadSession(sessionId);
        return session;
      })
    );
    
    res.json(detailedSessions);
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

/**
 * @route POST /api/memory/sessions
 * @description Create a new memory session
 */
router.post('/sessions', async (req, res) => {
  try {
    const { sessionId = `session-${uuidv4()}`, description, metadata = {} } = req.body;
    
    // Initialize session with metadata
    const sessionMetadata = {
      description,
      ...metadata,
      createdBy: req.body.createdBy || 'system',
      createdAt: new Date()
    };
    
    const session = await persistentContextService.initializeSession(sessionId, sessionMetadata);
    
    res.status(201).json({
      message: 'Session created successfully',
      sessionId: session.sessionId,
      createdAt: session.createdAt
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

/**
 * @route GET /api/memory/sessions/:sessionId
 * @description Get detailed session data
 */
router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const context = await persistentContextService.loadContext(sessionId);
    
    if (!context) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(context);
  } catch (error) {
    console.error(`Error loading session ${req.params.sessionId}:`, error);
    res.status(500).json({ error: 'Failed to load session' });
  }
});

/**
 * @route DELETE /api/memory/sessions/:sessionId
 * @description Delete a session with all its data
 */
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const deleted = await persistentContextService.deleteSession(sessionId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error(`Error deleting session ${req.params.sessionId}:`, error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

/**
 * @route POST /api/memory/sessions/:sessionId/history
 * @description Add a history chunk to a session
 */
router.post('/sessions/:sessionId/history', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { chunkId, content, cognitiveLayer = CognitiveLayer.STRATEGIC, taskId, tags } = req.body;
    
    // Ensure session exists
    const session = await persistentContextService.loadSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Create chunk with timestamp
    const historyChunk = {
      chunkId: chunkId || `chunk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      content,
      cognitiveLayer,
      timestamp: new Date(),
      taskId,
      tags
    };
    
    // Add chunk to session
    const success = await persistentContextService.addHistoryChunk(sessionId, historyChunk);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to add history chunk' });
    }
    
    res.status(201).json({
      message: 'History chunk added successfully',
      chunkId: historyChunk.chunkId
    });
  } catch (error) {
    console.error(`Error adding history chunk to session ${req.params.sessionId}:`, error);
    res.status(500).json({ error: 'Failed to add history chunk' });
  }
});

/**
 * @route GET /api/memory/sessions/:sessionId/history
 * @description Get recent history chunks from a session
 */
router.get('/sessions/:sessionId/history', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { cognitiveLayer } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const startFrom = req.query.startFrom ? parseInt(req.query.startFrom) : 0;
    
    // Ensure session exists
    const session = await persistentContextService.loadSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Get history chunks
    const chunks = await persistentContextService.getRecentHistory(
      sessionId, 
      cognitiveLayer,
      limit,
      startFrom
    );
    
    res.json(chunks);
  } catch (error) {
    console.error(`Error getting history for session ${req.params.sessionId}:`, error);
    res.status(500).json({ error: 'Failed to get history' });
  }
});

/**
 * @route POST /api/memory/sessions/:sessionId/insights
 * @description Add a meta insight to a session
 */
router.post('/sessions/:sessionId/insights', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const {
      observation,
      confidenceScore,
      importance,
      tags
    } = req.body;
    
    // Ensure session exists
    const session = await persistentContextService.loadSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Create insight with generated ID
    const insightId = req.body.insightId || `insight-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create a meta insight object compliant with our interface
    const metaInsight = {
      insightId,
      observation,
      confidenceScore,
      importance,
      timestamp: new Date(),
      tags
    };
    
    // Add insight to session
    const success = await persistentContextService.addMetaInsight(sessionId, metaInsight);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to add meta insight' });
    }
    
    res.status(201).json({
      message: 'Meta insight added successfully',
      insightId
    });
  } catch (error) {
    console.error(`Error adding meta insight to session ${req.params.sessionId}:`, error);
    res.status(500).json({ error: 'Failed to add meta insight' });
  }
});

/**
 * @route GET /api/memory/sessions/:sessionId/insights
 * @description Get meta insights from a session
 */
router.get('/sessions/:sessionId/insights', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    
    // Ensure session exists
    const session = await persistentContextService.loadSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Get insights
    const insights = await persistentContextService.getMetaInsights(sessionId, limit);
    
    res.json(insights);
  } catch (error) {
    console.error(`Error getting insights for session ${req.params.sessionId}:`, error);
    res.status(500).json({ error: 'Failed to get insights' });
  }
});

/**
 * @route POST /api/memory/sessions/:sessionId/search
 * @description Search across the session context
 */
router.post('/sessions/:sessionId/search', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Ensure session exists
    const session = await persistentContextService.loadSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Perform search
    const searchResults = await persistentContextService.searchContext(sessionId, query);
    
    res.json({
      query,
      results: searchResults
    });
  } catch (error) {
    console.error(`Error searching context for session ${req.params.sessionId}:`, error);
    res.status(500).json({ error: 'Failed to search context' });
  }
});

/**
 * @route POST /api/memory/sessions/:sessionId/plans
 * @description Add a strategic plan to a session
 */
router.post('/sessions/:sessionId/plans', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const {
      title,
      description,
      steps,
      expectedOutcomes,
      tags
    } = req.body;
    
    // Ensure session exists
    const session = await persistentContextService.loadSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Create plan with generated ID
    const planId = req.body.planId || `plan-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create a strategic plan compliant with our interface
    const strategicPlan = {
      planId,
      title,
      description,
      steps,
      expectedOutcomes,
      timestamp: new Date(),
      tags,
      status: 'active'
    };
    
    // Add plan to session
    const success = await persistentContextService.addStrategicPlan(sessionId, strategicPlan);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to add strategic plan' });
    }
    
    res.status(201).json({
      message: 'Strategic plan added successfully',
      planId
    });
  } catch (error) {
    console.error(`Error adding strategic plan to session ${req.params.sessionId}:`, error);
    res.status(500).json({ error: 'Failed to add strategic plan' });
  }
});

/**
 * @route GET /api/memory/sessions/:sessionId/plans
 * @description Get strategic plans from a session
 */
router.get('/sessions/:sessionId/plans', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.query;
    
    // Ensure session exists
    const session = await persistentContextService.loadSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Get plans
    const plans = await persistentContextService.getStrategicPlans(sessionId, status);
    
    res.json(plans);
  } catch (error) {
    console.error(`Error getting plans for session ${req.params.sessionId}:`, error);
    res.status(500).json({ error: 'Failed to get plans' });
  }
});

/**
 * @route GET /api/memory/health
 * @description Check system health
 */
router.get('/health', async (req, res) => {
  try {
    const health = await persistentContextService.checkHealth();
    res.json(health);
  } catch (error) {
    console.error('Error checking system health:', error);
    res.status(500).json({ 
      healthy: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/memory/sessions/:sessionId/anchors
 * @description Get all state anchors for a session
 */
router.get('/sessions/:sessionId/anchors', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Direct fallback implementation
    console.log('Using direct fallback for retrieving anchors');
    
    // Define directories
    const PERSISTENCE_DIR = path.join(__dirname, '../../data/persistent-context');
    const ANCHORS_DIR = path.join(PERSISTENCE_DIR, 'anchors');
    const sessionAnchorsDir = path.join(ANCHORS_DIR, sessionId);
    
    try {
      // Check if directory exists
      await fs.access(sessionAnchorsDir);
      
      // Get all anchor files
      const files = await fs.readdir(sessionAnchorsDir);
      const anchorFiles = files.filter(file => file.endsWith('.json'));
      
      // Read each anchor file
      const anchors = await Promise.all(
        anchorFiles.map(async (file) => {
          const filePath = path.join(sessionAnchorsDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          return JSON.parse(data);
        })
      );
      
      res.json(anchors);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // Directory doesn't exist, no anchors yet
        return res.json([]);
      }
      throw err;
    }
  } catch (error) {
    console.error(`Error getting anchors for session ${req.params.sessionId}:`, error);
    res.status(500).json({ error: 'Failed to get anchors' });
  }
});

/**
 * @route GET /api/memory/sessions/:sessionId/anchors/:anchorId
 * @description Get a specific anchor by ID
 */
router.get('/sessions/:sessionId/anchors/:anchorId', async (req, res) => {
  try {
    const { sessionId, anchorId } = req.params;
    
    // Direct fallback implementation
    console.log('Using direct fallback for retrieving specific anchor');
    
    // Define directories
    const PERSISTENCE_DIR = path.join(__dirname, '../../data/persistent-context');
    const ANCHORS_DIR = path.join(PERSISTENCE_DIR, 'anchors');
    const sessionAnchorsDir = path.join(ANCHORS_DIR, sessionId);
    const anchorPath = path.join(sessionAnchorsDir, `${anchorId}.json`);
    
    try {
      // Check if file exists
      await fs.access(anchorPath);
      
      // Read anchor file
      const data = await fs.readFile(anchorPath, 'utf8');
      const anchor = JSON.parse(data);
      
      res.json(anchor);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Anchor not found' });
      }
      throw err;
    }
  } catch (error) {
    console.error(`Error getting anchor ${req.params.anchorId} for session ${req.params.sessionId}:`, error);
    res.status(500).json({ error: 'Failed to get anchor' });
  }
});

// Export router
export default router;