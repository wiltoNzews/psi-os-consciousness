/**
 * Embedding Seeds API Router
 * 
 * This router manages the creation and retrieval of embedding seeds,
 * which are anchor points in the semantic space used for guidance in the
 * Meta-Routing Awareness Protocol (MRAP).
 */

import express from 'express';
import vectorEmbeddingService from '../services/vector-embedding-service.js';
import vectorEmbeddingFallback from '../services/vector-embedding-fallback.js';

const router = express.Router();

// Create a new embedding seed
router.post('/', async (req, res) => {
  try {
    const { sessionId, seedName, content, metadata = {}, useFallback = false } = req.body;
    
    if (!sessionId || !seedName || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['sessionId', 'seedName', 'content']
      });
    }
    
    let result;
    if (useFallback) {
      // Use fallback implementation
      result = await vectorEmbeddingFallback.createEmbeddingSeed(
        sessionId,
        seedName,
        content,
        metadata
      );
    } else {
      // Use primary implementation
      result = await vectorEmbeddingService.createEmbeddingSeed(
        sessionId,
        seedName,
        content,
        metadata
      );
      
      // If primary fails and not explicitly using fallback, try fallback
      if (!result.success) {
        console.log('Primary embedding seed creation failed, trying fallback...');
        result = await vectorEmbeddingFallback.createEmbeddingSeed(
          sessionId,
          seedName,
          content,
          metadata
        );
      }
    }
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json({
        error: 'Failed to create embedding seed',
        details: result.error
      });
    }
  } catch (error) {
    console.error('Error creating embedding seed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve embedding seeds similar to a concept
router.post('/search', async (req, res) => {
  try {
    const { query, limit = 5, useFallback = false } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    let results;
    if (useFallback) {
      // Use fallback implementation
      results = await vectorEmbeddingFallback.semanticSearch(query, limit);
    } else {
      // Use primary implementation
      results = await vectorEmbeddingService.semanticSearch(query, limit);
      
      // If primary returns empty and not explicitly using fallback, try fallback
      if (results.length === 0) {
        console.log('No results from primary embedding service, trying fallback...');
        results = await vectorEmbeddingFallback.semanticSearch(query, limit);
      }
    }
    
    // Filter results to only include seeds
    const seedResults = results.filter(result => 
      result.metadata && result.metadata.type === 'embedding-seed'
    );
    
    res.json({
      results: seedResults,
      count: seedResults.length,
      query,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error searching embedding seeds:', error);
    res.status(500).json({ error: 'Internal server error during search' });
  }
});

// Get seeds by session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    // Perform a simple query with the session ID
    const query = `session:${sessionId}`;
    const limit = parseInt(req.query.limit) || 100;
    
    // Try both implementations and combine results
    const primaryResults = await vectorEmbeddingService.semanticSearch(query, limit);
    const fallbackResults = await vectorEmbeddingFallback.semanticSearch(query, limit);
    
    // Combine results, filter to seeds only, and deduplicate by ID
    const allResults = [...primaryResults, ...fallbackResults];
    const seedResults = allResults.filter(result => 
      result.metadata && result.metadata.type === 'embedding-seed' && 
      result.metadata.sessionId === sessionId
    );
    
    // Deduplicate by ID
    const uniqueResults = Array.from(
      seedResults.reduce((map, item) => map.set(item.id, item), new Map()).values()
    );
    
    res.json({
      results: uniqueResults,
      count: uniqueResults.length,
      sessionId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error retrieving embedding seeds by session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;