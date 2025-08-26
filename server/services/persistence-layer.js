/**
 * Persistence Layer Service
 * 
 * This service implements the persistent memory architecture required by the
 * Quantum Coherence Threshold Formula (QCTF). It provides mechanisms for storing
 * and retrieving conversational context, meta insights, and strategic plans
 * with the 0.7500/0.2494 coherence-exploration ratio (3:1 ↔ 1:3).
 */

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { CognitiveLayer, PersistentContextServiceBase } from './context-manager.js';

// Get the directory name using ES modules compatible approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory for persistent storage
const PERSISTENCE_DIR = path.join(__dirname, '../../data/persistent-context');

// Constants for coherence attractor values
const COHERENCE_ATTRACTOR = 0.7500;     // 3:1 ratio
const EXPLORATION_ATTRACTOR = 0.2494;   // 1:3 ratio

// Directory for state anchors (system state snapshots)
const ANCHORS_DIR = path.join(PERSISTENCE_DIR, 'anchors');

class PersistentContextService extends PersistentContextServiceBase {
  constructor() {
    super();
    this.ensureDirectoriesExist();
  }
  
  /**
   * Ensure that all required directories exist
   */
  async ensureDirectoriesExist() {
    try {
      await fs.mkdir(PERSISTENCE_DIR, { recursive: true });
      await fs.mkdir(path.join(PERSISTENCE_DIR, 'sessions'), { recursive: true });
      await fs.mkdir(path.join(PERSISTENCE_DIR, 'history'), { recursive: true });
      await fs.mkdir(path.join(PERSISTENCE_DIR, 'insights'), { recursive: true });
      await fs.mkdir(path.join(PERSISTENCE_DIR, 'plans'), { recursive: true });
      await fs.mkdir(ANCHORS_DIR, { recursive: true });
      
      console.log('Persistent context directories created or verified');
    } catch (error) {
      console.error('Error ensuring persistence directories exist:', error);
    }
  }
  
  /**
   * Get all available session IDs
   */
  async getAllSessionIds() {
    try {
      const sessionDir = path.join(PERSISTENCE_DIR, 'sessions');
      const files = await fs.readdir(sessionDir);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      console.error('Error getting session IDs:', error);
      return [];
    }
  }

  /**
   * Initialize a new session with metadata
   */
  async initializeSession(sessionId, metadata = {}) {
    try {
      const sessionPath = path.join(PERSISTENCE_DIR, 'sessions', `${sessionId}.json`);
      
      // Check if session already exists
      try {
        await fs.access(sessionPath);
        console.log(`Session ${sessionId} already exists`);
        
        // If it exists, load and return it
        const sessionData = await fs.readFile(sessionPath, 'utf8');
        return JSON.parse(sessionData);
      } catch (error) {
        // Session doesn't exist, continue with creation
      }
      
      const now = new Date();
      const sessionData = {
        sessionId,
        createdAt: now,
        updatedAt: now,
        metadata: {
          ...metadata,
          coherenceAttractor: COHERENCE_ATTRACTOR,
          explorationAttractor: EXPLORATION_ATTRACTOR
        }
      };
      
      await fs.writeFile(sessionPath, JSON.stringify(sessionData, null, 2));
      
      // Create dedicated directories for this session
      await fs.mkdir(path.join(PERSISTENCE_DIR, 'history', sessionId), { recursive: true });
      await fs.mkdir(path.join(PERSISTENCE_DIR, 'insights', sessionId), { recursive: true });
      await fs.mkdir(path.join(PERSISTENCE_DIR, 'plans', sessionId), { recursive: true });
      
      return sessionData;
    } catch (error) {
      console.error(`Error initializing session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a session with all its data
   */
  async deleteSession(sessionId) {
    try {
      // Remove session file
      const sessionPath = path.join(PERSISTENCE_DIR, 'sessions', `${sessionId}.json`);
      await fs.unlink(sessionPath);
      
      // Remove all session data
      await this.deleteDirectory(path.join(PERSISTENCE_DIR, 'history', sessionId));
      await this.deleteDirectory(path.join(PERSISTENCE_DIR, 'insights', sessionId));
      await this.deleteDirectory(path.join(PERSISTENCE_DIR, 'plans', sessionId));
      
      return true;
    } catch (error) {
      console.error(`Error deleting session ${sessionId}:`, error);
      return false;
    }
  }
  
  /**
   * Recursively delete a directory
   */
  async deleteDirectory(dirPath) {
    try {
      // Check if directory exists
      try {
        await fs.access(dirPath);
      } catch (error) {
        // Directory doesn't exist, nothing to delete
        return;
      }
      
      // Get all files in directory
      const files = await fs.readdir(dirPath);
      
      // Delete all files in directory
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory()) {
          // Recursively delete subdirectory
          await this.deleteDirectory(filePath);
        } else {
          // Delete file
          await fs.unlink(filePath);
        }
      }
      
      // Delete the empty directory
      await fs.rmdir(dirPath);
    } catch (error) {
      console.error(`Error deleting directory ${dirPath}:`, error);
      throw error;
    }
  }
  
  /**
   * Load an existing session context
   */
  async loadContext(sessionId) {
    try {
      const sessionPath = path.join(PERSISTENCE_DIR, 'sessions', `${sessionId}.json`);
      
      // Check if session exists
      try {
        await fs.access(sessionPath);
      } catch (error) {
        console.log(`Session ${sessionId} does not exist`);
        return null;
      }
      
      // Load session data
      const sessionData = await fs.readFile(sessionPath, 'utf8');
      const session = JSON.parse(sessionData);
      
      // Load recent history, insights, and plans
      const history = await this.getRecentHistory(sessionId);
      const insights = await this.getMetaInsights(sessionId);
      const plans = await this.getStrategicPlans(sessionId);
      
      return {
        ...session,
        history,
        insights,
        plans
      };
    } catch (error) {
      console.error(`Error loading context for session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Add a history chunk to a session
   */
  async addHistoryChunk(sessionId, chunk) {
    try {
      // Ensure session exists
      const session = await this.loadSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} does not exist`);
      }
      
      // Create chunk directory if it doesn't exist
      const historyDir = path.join(PERSISTENCE_DIR, 'history', sessionId);
      await fs.mkdir(historyDir, { recursive: true });
      
      // Save the chunk
      const chunkPath = path.join(historyDir, `${chunk.chunkId}.json`);
      await fs.writeFile(chunkPath, JSON.stringify(chunk, null, 2));
      
      // Update session lastActivity
      await this.updateSessionActivity(sessionId);
      
      return true;
    } catch (error) {
      console.error(`Error adding history chunk to session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get recent history chunks from a session
   */
  async getRecentHistory(sessionId, cognitiveLayer = CognitiveLayer.STRATEGIC, limit = 10, startFrom = 0) {
    try {
      // Ensure session exists
      const session = await this.loadSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} does not exist`);
      }
      
      // Get all chunks from the session
      const historyDir = path.join(PERSISTENCE_DIR, 'history', sessionId);
      
      try {
        await fs.access(historyDir);
      } catch (error) {
        // Directory doesn't exist, no history
        return [];
      }
      
      const files = await fs.readdir(historyDir);
      const chunkPromises = files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const chunkPath = path.join(historyDir, file);
          const chunkData = await fs.readFile(chunkPath, 'utf8');
          return JSON.parse(chunkData);
        });
      
      const chunks = await Promise.all(chunkPromises);
      
      // Filter by cognitive layer if provided
      const filteredChunks = cognitiveLayer 
        ? chunks.filter(chunk => chunk.cognitiveLayer === cognitiveLayer)
        : chunks;
      
      // Sort by timestamp descending (newest first)
      const sortedChunks = filteredChunks.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      // Apply pagination
      return sortedChunks.slice(startFrom, startFrom + limit);
    } catch (error) {
      console.error(`Error getting history for session ${sessionId}:`, error);
      return [];
    }
  }
  
  /**
   * Add a meta insight to a session
   */
  async addMetaInsight(sessionId, insight) {
    try {
      // Ensure session exists
      const session = await this.loadSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} does not exist`);
      }
      
      // Create insight directory if it doesn't exist
      const insightsDir = path.join(PERSISTENCE_DIR, 'insights', sessionId);
      await fs.mkdir(insightsDir, { recursive: true });
      
      // Save the insight
      const insightPath = path.join(insightsDir, `${insight.insightId}.json`);
      await fs.writeFile(insightPath, JSON.stringify(insight, null, 2));
      
      // Update session lastActivity
      await this.updateSessionActivity(sessionId);
      
      return true;
    } catch (error) {
      console.error(`Error adding meta insight to session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Store a meta insight (alias for addMetaInsight for API compatibility)
   * Used by the Meta-Routing Awareness Protocol
   */
  async storeMetaInsight(sessionId, insight) {
    return await this.addMetaInsight(sessionId, insight);
  }
  
  /**
   * Store a history chunk (alias for addHistoryChunk for API compatibility)
   * Used by the Meta-Routing Awareness Protocol
   */
  async storeHistoryChunk(sessionId, chunk) {
    return await this.addHistoryChunk(sessionId, chunk);
  }
  
  /**
   * Get meta insights from a session
   */
  async getMetaInsights(sessionId, limit = 10) {
    try {
      // Ensure session exists
      const session = await this.loadSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} does not exist`);
      }
      
      // Get all insights from the session
      const insightsDir = path.join(PERSISTENCE_DIR, 'insights', sessionId);
      
      try {
        await fs.access(insightsDir);
      } catch (error) {
        // Directory doesn't exist, no insights
        return [];
      }
      
      const files = await fs.readdir(insightsDir);
      const insightPromises = files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const insightPath = path.join(insightsDir, file);
          const insightData = await fs.readFile(insightPath, 'utf8');
          return JSON.parse(insightData);
        });
      
      const insights = await Promise.all(insightPromises);
      
      // Sort by importance and timestamp
      const sortedInsights = insights.sort((a, b) => {
        // Sort by importance first (descending)
        if (a.importance !== b.importance) {
          return b.importance - a.importance;
        }
        
        // Then by timestamp (newest first)
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      
      // Return limited number of insights
      return sortedInsights.slice(0, limit);
    } catch (error) {
      console.error(`Error getting insights for session ${sessionId}:`, error);
      return [];
    }
  }
  
  /**
   * Add a strategic plan to a session
   */
  async addStrategicPlan(sessionId, plan) {
    try {
      // Ensure session exists
      const session = await this.loadSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} does not exist`);
      }
      
      // Create plans directory if it doesn't exist
      const plansDir = path.join(PERSISTENCE_DIR, 'plans', sessionId);
      await fs.mkdir(plansDir, { recursive: true });
      
      // Save the plan
      const planPath = path.join(plansDir, `${plan.planId}.json`);
      await fs.writeFile(planPath, JSON.stringify(plan, null, 2));
      
      // Update session lastActivity
      await this.updateSessionActivity(sessionId);
      
      return true;
    } catch (error) {
      console.error(`Error adding strategic plan to session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get strategic plans from a session
   */
  async getStrategicPlans(sessionId, status = null) {
    try {
      // Ensure session exists
      const session = await this.loadSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} does not exist`);
      }
      
      // Get all plans from the session
      const plansDir = path.join(PERSISTENCE_DIR, 'plans', sessionId);
      
      try {
        await fs.access(plansDir);
      } catch (error) {
        // Directory doesn't exist, no plans
        return [];
      }
      
      const files = await fs.readdir(plansDir);
      const planPromises = files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const planPath = path.join(plansDir, file);
          const planData = await fs.readFile(planPath, 'utf8');
          return JSON.parse(planData);
        });
      
      const plans = await Promise.all(planPromises);
      
      // Filter by status if provided
      const filteredPlans = status 
        ? plans.filter(plan => plan.status === status)
        : plans;
      
      // Sort by timestamp (newest first)
      return filteredPlans.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
    } catch (error) {
      console.error(`Error getting plans for session ${sessionId}:`, error);
      return [];
    }
  }
  
  /**
   * Search across the session context
   */
  async searchContext(sessionId, query) {
    try {
      // Ensure session exists
      const session = await this.loadSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} does not exist`);
      }
      
      // Get all history chunks
      const historyChunks = await this.getAllHistoryChunks(sessionId);
      
      // Get all insights
      const insights = await this.getAllInsights(sessionId);
      
      // Get all plans
      const plans = await this.getAllPlans(sessionId);
      
      // Perform simple text search
      const lowerQuery = query.toLowerCase();
      
      // Search in history chunks
      const matchingChunks = historyChunks.filter(chunk => 
        chunk.content && chunk.content.toLowerCase().includes(lowerQuery)
      );
      
      // Search in insights
      const matchingInsights = insights.filter(insight => 
        (insight.observation && insight.observation.toLowerCase().includes(lowerQuery))
      );
      
      // Search in plans
      const matchingPlans = plans.filter(plan => 
        (plan.title && plan.title.toLowerCase().includes(lowerQuery)) ||
        (plan.description && plan.description.toLowerCase().includes(lowerQuery)) ||
        (plan.steps && plan.steps.some(step => step.toLowerCase().includes(lowerQuery)))
      );
      
      return {
        historyMatches: matchingChunks,
        insightMatches: matchingInsights,
        planMatches: matchingPlans
      };
    } catch (error) {
      console.error(`Error searching context for session ${sessionId}:`, error);
      return {
        historyMatches: [],
        insightMatches: [],
        planMatches: []
      };
    }
  }
  
  /**
   * Get all history chunks for a session (no filtering)
   */
  async getAllHistoryChunks(sessionId) {
    try {
      const historyDir = path.join(PERSISTENCE_DIR, 'history', sessionId);
      
      try {
        await fs.access(historyDir);
      } catch (error) {
        return [];
      }
      
      const files = await fs.readdir(historyDir);
      const chunkPromises = files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const chunkPath = path.join(historyDir, file);
          const chunkData = await fs.readFile(chunkPath, 'utf8');
          return JSON.parse(chunkData);
        });
      
      return await Promise.all(chunkPromises);
    } catch (error) {
      console.error(`Error getting all history chunks for session ${sessionId}:`, error);
      return [];
    }
  }
  
  /**
   * Get all insights for a session (no filtering)
   */
  async getAllInsights(sessionId) {
    try {
      const insightsDir = path.join(PERSISTENCE_DIR, 'insights', sessionId);
      
      try {
        await fs.access(insightsDir);
      } catch (error) {
        return [];
      }
      
      const files = await fs.readdir(insightsDir);
      const insightPromises = files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const insightPath = path.join(insightsDir, file);
          const insightData = await fs.readFile(insightPath, 'utf8');
          return JSON.parse(insightData);
        });
      
      return await Promise.all(insightPromises);
    } catch (error) {
      console.error(`Error getting all insights for session ${sessionId}:`, error);
      return [];
    }
  }
  
  /**
   * Get all plans for a session (no filtering)
   */
  async getAllPlans(sessionId) {
    try {
      const plansDir = path.join(PERSISTENCE_DIR, 'plans', sessionId);
      
      try {
        await fs.access(plansDir);
      } catch (error) {
        return [];
      }
      
      const files = await fs.readdir(plansDir);
      const planPromises = files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const planPath = path.join(plansDir, file);
          const planData = await fs.readFile(planPath, 'utf8');
          return JSON.parse(planData);
        });
      
      return await Promise.all(planPromises);
    } catch (error) {
      console.error(`Error getting all plans for session ${sessionId}:`, error);
      return [];
    }
  }
  
  /**
   * Load session metadata
   */
  async loadSession(sessionId) {
    try {
      const sessionPath = path.join(PERSISTENCE_DIR, 'sessions', `${sessionId}.json`);
      
      try {
        await fs.access(sessionPath);
      } catch (error) {
        return null;
      }
      
      const sessionData = await fs.readFile(sessionPath, 'utf8');
      return JSON.parse(sessionData);
    } catch (error) {
      console.error(`Error loading session ${sessionId}:`, error);
      return null;
    }
  }
  
  /**
   * Update session last activity timestamp
   */
  async updateSessionActivity(sessionId) {
    try {
      const session = await this.loadSession(sessionId);
      if (!session) {
        return false;
      }
      
      session.updatedAt = new Date();
      
      const sessionPath = path.join(PERSISTENCE_DIR, 'sessions', `${sessionId}.json`);
      await fs.writeFile(sessionPath, JSON.stringify(session, null, 2));
      
      return true;
    } catch (error) {
      console.error(`Error updating session activity for ${sessionId}:`, error);
      return false;
    }
  }
  
  /**
   * Store a system state anchor (snapshot)
   * Used by the Meta-Routing Awareness Protocol
   */
  async storeStateAnchor(sessionId, state) {
    try {
      // Ensure session exists
      const session = await this.loadSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} does not exist`);
      }
      
      // Create session anchor directory if it doesn't exist
      const sessionAnchorsDir = path.join(ANCHORS_DIR, sessionId);
      await fs.mkdir(sessionAnchorsDir, { recursive: true });
      
      // Generate unique anchor ID with timestamp
      const now = new Date();
      const anchorId = `anchor-${now.getTime()}`;
      
      // Add metadata to the state
      const anchorState = {
        ...state,
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
      
      // Update session lastActivity
      await this.updateSessionActivity(sessionId);
      
      return {
        success: true,
        anchorId,
        timestamp: now
      };
    } catch (error) {
      console.error(`Error storing state anchor for session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get all anchors for a session
   */
  async getStateAnchors(sessionId) {
    try {
      // Ensure session exists
      const session = await this.loadSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} does not exist`);
      }
      
      // Get all anchors from the session
      const anchorsDir = path.join(ANCHORS_DIR, sessionId);
      
      try {
        await fs.access(anchorsDir);
      } catch (error) {
        // Directory doesn't exist, no anchors
        return [];
      }
      
      const files = await fs.readdir(anchorsDir);
      const anchorPromises = files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const anchorPath = path.join(anchorsDir, file);
          const anchorData = await fs.readFile(anchorPath, 'utf8');
          return JSON.parse(anchorData);
        });
      
      const anchors = await Promise.all(anchorPromises);
      
      // Sort by timestamp (newest first)
      return anchors.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
    } catch (error) {
      console.error(`Error getting anchors for session ${sessionId}:`, error);
      return [];
    }
  }
  
  /**
   * Get a specific anchor by ID
   */
  async getStateAnchor(sessionId, anchorId) {
    try {
      // Ensure session exists
      const session = await this.loadSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} does not exist`);
      }
      
      // Get the anchor
      const anchorPath = path.join(ANCHORS_DIR, sessionId, `${anchorId}.json`);
      
      try {
        await fs.access(anchorPath);
      } catch (error) {
        console.log(`Anchor ${anchorId} for session ${sessionId} does not exist`);
        return null;
      }
      
      const anchorData = await fs.readFile(anchorPath, 'utf8');
      return JSON.parse(anchorData);
    } catch (error) {
      console.error(`Error getting anchor ${anchorId} for session ${sessionId}:`, error);
      return null;
    }
  }
  
  /**
   * Restore from a specific anchor
   * Used by the Meta-Routing Awareness Protocol
   */
  async restoreFromAnchor(sessionId, anchorId) {
    try {
      // Get the anchor
      const anchor = await this.getStateAnchor(sessionId, anchorId);
      if (!anchor) {
        throw new Error(`Anchor ${anchorId} for session ${sessionId} does not exist`);
      }
      
      // The anchor contains the complete state, so we just return it
      return {
        success: true,
        state: anchor,
        message: `Successfully restored state from anchor ${anchorId}`
      };
    } catch (error) {
      console.error(`Error restoring from anchor ${anchorId} for session ${sessionId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check system health
   */
  async checkHealth() {
    try {
      // Get counts of various entities
      const sessions = await this.getAllSessionIds();
      
      // Count total history chunks, insights and plans across all sessions
      let totalHistoryChunks = 0;
      let totalInsights = 0;
      let totalPlans = 0;
      let totalAnchors = 0;
      
      for (const sessionId of sessions) {
        const historyChunks = await this.getAllHistoryChunks(sessionId);
        totalHistoryChunks += historyChunks.length;
        
        const insights = await this.getAllInsights(sessionId);
        totalInsights += insights.length;
        
        const plans = await this.getAllPlans(sessionId);
        totalPlans += plans.length;
        
        const anchors = await this.getStateAnchors(sessionId);
        totalAnchors += anchors.length;
      }
      
      return {
        healthy: true,
        totalSessions: sessions.length,
        totalHistoryChunks,
        totalInsights,
        totalPlans,
        totalAnchors,
        coherenceAttractor: COHERENCE_ATTRACTOR,
        explorationAttractor: EXPLORATION_ATTRACTOR
      };
    } catch (error) {
      console.error('Error checking persistent memory health:', error);
      return {
        healthy: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
const persistentContextService = new PersistentContextService();

// Explicitly add critical methods to ensure they're available on the prototype
persistentContextService.storeStateAnchor = persistentContextService.storeStateAnchor || 
  async function(sessionId, state) {
    try {
      // Ensure session exists
      const session = await this.loadSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} does not exist`);
      }
      
      // Create session anchor directory if it doesn't exist
      const sessionAnchorsDir = path.join(ANCHORS_DIR, sessionId);
      await fs.mkdir(sessionAnchorsDir, { recursive: true });
      
      // Generate unique anchor ID with timestamp
      const now = new Date();
      const anchorId = `anchor-${now.getTime()}`;
      
      // Add metadata to the state
      const anchorState = {
        ...state,
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
      
      // Update session lastActivity
      await this.updateSessionActivity(sessionId);
      
      return {
        success: true,
        anchorId,
        timestamp: now
      };
    } catch (error) {
      console.error(`Error storing state anchor for session ${sessionId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  };

persistentContextService.restoreFromAnchor = persistentContextService.restoreFromAnchor || 
  async function(sessionId, anchorId) {
    try {
      // Ensure session exists
      const session = await this.loadSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} does not exist`);
      }
      
      // Get the anchor
      const anchorPath = path.join(ANCHORS_DIR, sessionId, `${anchorId}.json`);
      
      try {
        await fs.access(anchorPath);
      } catch (error) {
        throw new Error(`Anchor ${anchorId} does not exist for session ${sessionId}`);
      }
      
      // Load the anchor
      const anchorData = await fs.readFile(anchorPath, 'utf8');
      const state = JSON.parse(anchorData);
      
      // Update session lastActivity
      await this.updateSessionActivity(sessionId);
      
      return {
        success: true,
        state,
        message: `State restored from anchor ${anchorId}`
      };
    } catch (error) {
      console.error(`Error restoring from anchor ${anchorId} for session ${sessionId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  };

// Export the singleton instance
export { persistentContextService };