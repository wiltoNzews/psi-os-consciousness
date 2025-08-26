/**
 * Vector Embedding Fallback Service
 * 
 * This is a simplified fallback implementation for vector embeddings
 * when OpenAI or Pinecone services are not available. It uses simple
 * text matching techniques for semantic similarity.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EMBEDDING_DIR = path.join(__dirname, '../../data/embeddings');

/**
 * Creates a simple fallback "embedding" (token frequency map)
 * @param {string} text - Text to create a representation for
 * @returns {Object} A token frequency map
 */
function createFallbackEmbedding(text) {
  // Simple tokenization by splitting on non-alphanumeric characters and converting to lowercase
  const tokens = text.toLowerCase().split(/[^a-z0-9]/).filter(token => token.length > 0);
  
  // Create frequency map
  const frequencyMap = {};
  for (const token of tokens) {
    frequencyMap[token] = (frequencyMap[token] || 0) + 1;
  }
  
  return frequencyMap;
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
 * Process and store an anchor state using fallback representation
 * @param {string} sessionId - Session identifier
 * @param {string} anchorId - Anchor identifier
 * @param {Object} anchorState - Anchor state data
 * @returns {Promise<Object>} Result with success status and embedding ID
 */
async function processAnchorStateEmbedding(sessionId, anchorId, anchorState) {
  try {
    // Create text representation from anchor state
    const stateText = JSON.stringify({
      name: anchorState.name,
      description: anchorState.description,
      systemState: anchorState.systemState,
      coherenceIndex: anchorState.coherenceIndex,
      goldenRatioDetected: anchorState.goldenRatioDetected,
    });

    // Create fallback representation
    const representation = createFallbackEmbedding(stateText);

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
      representation,
      metadata,
      source: 'anchor-state',
      anchorId,
      sessionId,
      timestamp: new Date().toISOString(),
      isEmbedding: false, // Flag indicating this is a fallback representation
    };

    const localSaved = await saveEmbeddingLocally(embeddingId, embeddingData);

    return {
      success: localSaved,
      embeddingId,
      localSaved,
      usingFallback: true,
    };
  } catch (error) {
    console.error('Error processing anchor state with fallback:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Calculate similarity score between two token frequency maps
 * @param {Object} mapA - First token frequency map
 * @param {Object} mapB - Second token frequency map
 * @returns {number} Similarity score between 0 and 1
 */
function calculateFallbackSimilarity(mapA, mapB) {
  // Get all unique tokens from both maps
  const allTokens = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);
  
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  // Calculate dot product and magnitudes
  for (const token of allTokens) {
    const valueA = mapA[token] || 0;
    const valueB = mapB[token] || 0;
    
    dotProduct += valueA * valueB;
    magnitudeA += valueA * valueA;
    magnitudeB += valueB * valueB;
  }
  
  // Prevent division by zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  // Cosine similarity
  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

/**
 * Search for similar embeddings using a query with fallback approach
 * @param {string} query - Query text
 * @param {number} [limit=5] - Maximum number of results
 * @returns {Promise<Array>} Search results
 */
async function semanticSearch(query, limit = 5) {
  try {
    // Create fallback representation for query
    const queryRepresentation = createFallbackEmbedding(query);
    
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

      // Calculate similarity
      const results = embeddings.map(item => {
        // Check if this is a true embedding or a fallback representation
        const itemRepresentation = item.isEmbedding === false 
          ? item.representation  // Use fallback representation
          : createFallbackEmbedding(JSON.stringify(item.metadata)); // Create representation from metadata
        
        const similarity = calculateFallbackSimilarity(queryRepresentation, itemRepresentation);
        
        return {
          id: item.id,
          score: similarity,
          metadata: item.metadata,
        };
      });

      // Sort by similarity and limit
      return results.sort((a, b) => b.score - a.score).slice(0, limit);
    } catch (error) {
      console.error('Error during fallback search:', error);
      return [];
    }
  } catch (error) {
    console.error('Error during fallback semantic search:', error);
    return [];
  }
}

/**
 * Create a fallback embedding seed for intentional state guidance
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
    
    // Create fallback representation
    const representation = createFallbackEmbedding(content);

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
      representation,
      metadata,
      content,
      source: 'embedding-seed',
      sessionId,
      timestamp: new Date().toISOString(),
      isEmbedding: false, // Flag indicating this is a fallback representation
    };

    const localSaved = await saveEmbeddingLocally(seedId, embeddingData);
    
    return {
      success: localSaved,
      seedId,
      localSaved,
      usingFallback: true,
    };
  } catch (error) {
    console.error('Error creating embedding seed with fallback:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Initialize the embedding service
 */
async function initialize() {
  try {
    await fs.mkdir(EMBEDDING_DIR, { recursive: true });
    console.log('Fallback vector embedding service initialized (using simplified text matching)');
    return true;
  } catch (error) {
    console.error('Error initializing fallback embedding service:', error);
    return false;
  }
}

/**
 * Service health check
 */
async function healthCheck() {
  return {
    status: 'operational',
    mode: 'fallback',
    message: 'Using simplified text matching for semantic search',
    timestamp: new Date()
  };
}

export default {
  initialize,
  processAnchorStateEmbedding,
  semanticSearch,
  createEmbeddingSeed,
  saveEmbeddingLocally,
  createFallbackEmbedding,
  healthCheck,
};