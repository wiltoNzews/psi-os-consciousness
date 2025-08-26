/**
 * Vector Embedding API Router
 * 
 * This router handles semantic search and vector embedding operations for the system.
 * It integrates with both Pinecone-based and fallback implementations.
 */

import express from 'express';
import vectorEmbeddingService from '../services/vector-embedding-service.js';
import vectorEmbeddingFallback from '../services/vector-embedding-fallback.js';

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const openAiKey = process.env.OPENAI_API_KEY ? true : false;
    const pineconeKey = process.env.PINECONE_API_KEY ? true : false;
    
    res.json({
      status: 'operational',
      services: {
        openai: openAiKey ? 'available' : 'not configured',
        pinecone: pineconeKey ? 'available' : 'not configured',
        fallback: 'available'
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error in vector embedding health check:', error);
    res.status(500).json({ error: 'Internal server error during health check' });
  }
});

// Perform semantic search
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
      // Use primary implementation with OpenAI and Pinecone
      results = await vectorEmbeddingService.semanticSearch(query, limit);
      
      // If primary returns empty and not explicitly using fallback, try fallback
      if (results.length === 0) {
        console.log('No results from primary embedding service, trying fallback...');
        results = await vectorEmbeddingFallback.semanticSearch(query, limit);
      }
    }
    
    res.json({
      results,
      count: results.length,
      query,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error in semantic search:', error);
    res.status(500).json({ error: 'Internal server error during search' });
  }
});

// Create embedding for text
router.post('/embed', async (req, res) => {
  try {
    const { text, useFallback = false } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }
    
    let embedding;
    let usingFallback = useFallback;
    
    if (!useFallback) {
      // Try OpenAI first
      embedding = await vectorEmbeddingService.createEmbedding(text);
      
      // If OpenAI fails, use fallback
      if (!embedding) {
        console.log('OpenAI embedding creation failed, using fallback...');
        embedding = vectorEmbeddingFallback.createFallbackEmbedding(text);
        usingFallback = true;
      }
    } else {
      // Explicitly use fallback
      embedding = vectorEmbeddingFallback.createFallbackEmbedding(text);
    }
    
    res.json({
      success: !!embedding,
      usingFallback,
      embedding,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error creating embedding:', error);
    res.status(500).json({ error: 'Internal server error creating embedding' });
  }
});

export default router;