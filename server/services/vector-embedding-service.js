/**
 * Vector Embedding Service
 * 
 * This service provides functionality for creating and managing embeddings
 * using OpenAI's embedding model to enable semantic search and retrieval
 * for the Meta-Routing Awareness Protocol (MRAP).
 * 
 * The embeddings follow the 0.7500/0.2494 coherence-exploration ratio
 * to maintain quantum balance within the system.
 */

import { OpenAI } from 'openai';
import { promises as fs } from 'fs';
import path from 'path';
import * as Pinecone from '@pinecone-database/pinecone';
import { fileURLToPath } from 'url';

// Constants
const EMBEDDING_MODEL = 'text-embedding-ada-002';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'quantum-embeddings';

// Directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EMBEDDING_DIR = path.join(__dirname, '../../data/embeddings');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Initialize Pinecone client
let pineconeClient = null;
let pineconeIndex = null;

/**
 * Initialize the Pinecone client and index
 */
async function initializePinecone() {
  if (!PINECONE_API_KEY) {
    console.warn('PINECONE_API_KEY not found in environment, vector database will not be available');
    return false;
  }

  try {
    // Initialize with the updated Pinecone SDK API - no environment needed for serverless
    pineconeClient = new Pinecone.Pinecone({
      apiKey: PINECONE_API_KEY
    });
    
    // List existing indexes
    const indexes = await pineconeClient.listIndexes();
    
    // Check if the index exists in the returned list
    let indexExists = false;
    if (Array.isArray(indexes)) {
      // Handle the case where indexes is an array
      indexExists = indexes.some(index => index.name === PINECONE_INDEX_NAME);
    } else if (indexes && typeof indexes === 'object') {
      // Handle the case where indexes might be an object with a different structure
      console.log('Pinecone indexes response format:', JSON.stringify(indexes));
      // Check if it has an items property that's an array
      indexExists = Array.isArray(indexes.indexes) 
        ? indexes.indexes.some(index => index.name === PINECONE_INDEX_NAME)
        : false;
    }
    
    if (!indexExists) {
      console.log(`Creating Pinecone index: ${PINECONE_INDEX_NAME}`);
      
      // Create a new index with the specified configuration using the updated API
      await pineconeClient.createIndex({
        name: PINECONE_INDEX_NAME,
        dimension: 1536, // Ada-002 embedding dimension
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1' // Using the region from your screenshot
          }
        }
      });
      
      // Wait for the index to initialize
      console.log('Waiting for Pinecone index to initialize...');
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
    
    // Get a reference to the index
    pineconeIndex = pineconeClient.index(PINECONE_INDEX_NAME);
    console.log('Pinecone initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Pinecone:', error);
    return false;
  }
}

/**
 * Create an embedding for the given text using OpenAI
 * @param {string} text - Text to create an embedding for
 * @returns {Promise<Array<number>|null>} Embedding vector or null if failed
 */
async function createEmbedding(text) {
  if (!OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY not found in environment, embeddings will not be available');
    return null;
  }

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    return null;
  }
}

/**
 * Save an embedding locally
 * @param {string} id - Unique identifier for the embedding
 * @param {Object} data - Data object containing embedding and metadata
 * @returns {Promise<boolean>} Success indicator
 */
async function saveEmbeddingLocally(id, data) {
  try {
    await fs.mkdir(EMBEDDING_DIR, { recursive: true });
    const filePath = path.join(EMBEDDING_DIR, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving embedding ${id}:`, error);
    return false;
  }
}

/**
 * Save an embedding to Pinecone
 * @param {string} id - Unique identifier for the embedding
 * @param {Array<number>} embedding - Embedding vector
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<boolean>} Success indicator
 */
async function saveEmbeddingToPinecone(id, embedding, metadata) {
  if (!pineconeIndex) {
    console.warn('Pinecone index not available, saving locally only');
    return false;
  }

  try {
    // Using the new Pinecone API format for serverless (no namespace parameter)
    await pineconeIndex.upsert([{
      id,
      values: embedding,
      metadata,
    }]);
    
    return true;
  } catch (error) {
    console.error(`Error saving embedding ${id} to Pinecone:`, error);
    return false;
  }
}

/**
 * Process and store an anchor state as embeddings
 * @param {string} sessionId - Session identifier
 * @param {string} anchorId - Anchor identifier
 * @param {Object} anchorState - Anchor state data
 * @returns {Promise<Object>} Result with success status and embedding ID
 */
async function processAnchorStateEmbedding(sessionId, anchorId, anchorState) {
  try {
    // Create embedded representation
    const stateText = JSON.stringify({
      name: anchorState.name,
      description: anchorState.description,
      systemState: anchorState.systemState,
      coherenceIndex: anchorState.coherenceIndex,
      goldenRatioDetected: anchorState.goldenRatioDetected,
    });

    const embedding = await createEmbedding(stateText);
    if (!embedding) {
      return { success: false, error: 'Failed to create embedding' };
    }

    // Create metadata
    const metadata = {
      sessionId,
      anchorId,
      name: anchorState.name,
      description: anchorState.description,
      timestamp: anchorState.timestamp,
      coherenceIndex: anchorState.coherenceIndex,
      type: 'anchor-state',
    };

    // Create unique embedding ID
    const embeddingId = `emb-${anchorId}`;

    // Save locally
    const embeddingData = {
      id: embeddingId,
      embedding,
      metadata,
      source: 'anchor-state',
      anchorId,
      sessionId,
      timestamp: new Date().toISOString(),
    };

    const localSaved = await saveEmbeddingLocally(embeddingId, embeddingData);
    
    // Save to Pinecone
    let pineconeSuccess = false;
    if (pineconeIndex) {
      pineconeSuccess = await saveEmbeddingToPinecone(embeddingId, embedding, metadata);
    }

    return {
      success: localSaved || pineconeSuccess,
      embeddingId,
      localSaved,
      pineconeSuccess,
    };
  } catch (error) {
    console.error('Error processing anchor state embedding:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Search for similar embeddings using a query
 * @param {string} query - Query text
 * @param {number} [limit=5] - Maximum number of results
 * @returns {Promise<Array>} Search results
 */
async function semanticSearch(query, limit = 5) {
  try {
    const queryEmbedding = await createEmbedding(query);
    if (!queryEmbedding) {
      return [];
    }

    if (pineconeIndex) {
      try {
        // Search in Pinecone using the updated API (serverless version doesn't use namespace)
        const queryResponse = await pineconeIndex.query({
          vector: queryEmbedding,
          topK: limit,
          includeMetadata: true
        });

        return queryResponse.matches.map(match => ({
          id: match.id,
          score: match.score,
          metadata: match.metadata,
        }));
      } catch (pineconeError) {
        console.error('Error querying Pinecone:', pineconeError);
        console.log('Falling back to local search...');
        // Continue to local search
      }
    }
    
    // Local search in files
    try {
      await fs.mkdir(EMBEDDING_DIR, { recursive: true });
      const files = await fs.readdir(EMBEDDING_DIR);
      const embeddingFiles = files.filter(file => file.endsWith('.json'));

      const embeddings = await Promise.all(
        embeddingFiles.map(async (file) => {
          const filePath = path.join(EMBEDDING_DIR, file);
          const data = await fs.readFile(filePath, 'utf8');
          return JSON.parse(data);
        })
      );

      // Calculate cosine similarity
      const results = embeddings.map(item => {
        const similarity = calculateCosineSimilarity(queryEmbedding, item.embedding);
        return {
          id: item.id,
          score: similarity,
          metadata: item.metadata,
        };
      });

      // Sort by similarity and limit
      return results.sort((a, b) => b.score - a.score).slice(0, limit);
    } catch (error) {
      console.error('Error during local search:', error);
      return [];
    }
  } catch (error) {
    console.error('Error during semantic search:', error);
    return [];
  }
}

/**
 * Calculate cosine similarity between two vectors
 * @param {Array<number>} vecA First vector
 * @param {Array<number>} vecB Second vector
 * @returns {number} Cosine similarity score (-1 to 1)
 */
function calculateCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }

  // Dot product
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  // Prevent division by zero
  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Create an embedding seed for intentional state guidance
 * @param {string} sessionId - Session identifier
 * @param {string} seedName - Seed name/identifier
 * @param {string} content - Seed content/description
 * @param {Object} metaData - Additional metadata
 * @returns {Promise<Object>} Result with success status and embedding ID
 */
async function createEmbeddingSeed(sessionId, seedName, content, metaData = {}) {
  try {
    // Generate a unique seed ID
    const seedId = `seed-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Create embedding for the seed content
    const embedding = await createEmbedding(content);
    if (!embedding) {
      return { success: false, error: 'Failed to create embedding' };
    }

    // Create metadata
    const metadata = {
      sessionId,
      seedName,
      type: 'embedding-seed',
      timestamp: new Date().toISOString(),
      ...metaData,
    };

    // Save locally
    const embeddingData = {
      id: seedId,
      embedding,
      metadata,
      content,
      source: 'embedding-seed',
      sessionId,
      timestamp: new Date().toISOString(),
    };

    const localSaved = await saveEmbeddingLocally(seedId, embeddingData);
    
    // Save to Pinecone
    let pineconeSuccess = false;
    if (pineconeIndex) {
      pineconeSuccess = await saveEmbeddingToPinecone(seedId, embedding, metadata);
    }

    return {
      success: localSaved || pineconeSuccess,
      seedId,
      localSaved,
      pineconeSuccess,
    };
  } catch (error) {
    console.error('Error creating embedding seed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Initialize the embedding service
 */
async function initialize() {
  try {
    await fs.mkdir(EMBEDDING_DIR, { recursive: true });
    await initializePinecone();
    return true;
  } catch (error) {
    console.error('Error initializing embedding service:', error);
    return false;
  }
}

export default {
  initialize,
  createEmbedding,
  processAnchorStateEmbedding,
  semanticSearch,
  createEmbeddingSeed,
  saveEmbeddingLocally,
  saveEmbeddingToPinecone,
};