/**
 * Semantic Caching System
 * 
 * This service provides intelligent caching of AI responses based on semantic similarity
 * of queries, reducing redundant API calls for similar questions and optimizing costs.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { v4 as uuidv4 } from 'uuid';
import { budgetForecaster } from './AdaptiveBudgetForecaster.js';

/**
 * Cache entry interface
 */
export interface CacheEntry {
  id: string;
  query: string;
  response: string;
  model: string;
  embedding?: number[];
  cost: number;
  createdAt: Date;
  lastAccessed: Date;
  accessCount: number;
  savedCost: number;
  metadata?: Record<string, any>;
}

/**
 * Cache match result interface
 */
export interface CacheMatchResult {
  entry: CacheEntry;
  similarityScore: number;
}

/**
 * Cache hit type
 */
export type CacheHitType = 'exact' | 'semantic' | 'none';

/**
 * Cache statistics interface
 */
export interface CacheStats {
  cacheSize: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  totalSaved: number;
  avgSimilarityScore: number;
  avgResponseTime: number;
  avgValueScore: number;
}

/**
 * Cache configuration interface
 */
export interface SemanticCacheConfig {
  maxCacheSize?: number;
  cacheTTL?: number;
  minQueryLength?: number;
  minSimilarityThresholds?: {
    strict: number;
    standard: number;
    relaxed: number;
    experimental: number;
  };
  similarityFunction?: 'cosine' | 'dotProduct' | 'euclidean';
  enablePersistence?: boolean;
  storageKey?: string;
  logStats?: boolean;
  valueFactor?: {
    recency: number;
    frequency: number;
    savings: number;
  };
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: SemanticCacheConfig = {
  maxCacheSize: 1000,
  cacheTTL: 24 * 60 * 60 * 1000, // 24 hours
  minQueryLength: 10,
  minSimilarityThresholds: {
    strict: 0.95,
    standard: 0.92,
    relaxed: 0.85,
    experimental: 0.75
  },
  similarityFunction: 'cosine',
  enablePersistence: false,
  storageKey: 'semantic-cache',
  logStats: true,
  valueFactor: {
    recency: 0.3,
    frequency: 0.3,
    savings: 0.4
  }
};

/**
 * Calculate Cosine Similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vector dimensions must match for cosine similarity calculation');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Calculate Dot Product similarity between two vectors
 */
function dotProductSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vector dimensions must match for dot product calculation');
  }
  
  let dotProduct = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  
  return dotProduct;
}

/**
 * Calculate Euclidean Distance similarity between two vectors
 * Returns a similarity score (1 - normalized distance)
 */
function euclideanSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vector dimensions must match for euclidean distance calculation');
  }
  
  let sumSquaredDifferences = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sumSquaredDifferences += diff * diff;
  }
  
  const distance = Math.sqrt(sumSquaredDifferences);
  
  // Convert distance to similarity (0-1 range)
  // Using a simple normalization approach
  return 1 / (1 + distance);
}

/**
 * Generate a simple embedding for a string
 * Note: This is a simplified embedding for demonstration purposes.
 * In production, you would use a proper embedding model API.
 */
function generateSimpleEmbedding(text: string): number[] {
  // Normalize text
  const normalized = text.toLowerCase().trim();
  
  // Create a simple character frequency map
  const charMap = new Map<string, number>();
  for (const char of normalized) {
    charMap.set(char, (charMap.get(char) || 0) + 1);
  }
  
  // Convert to fixed-length vector (using ASCII values as positions)
  const embedding: number[] = new Array(128).fill(0);
  for (const [char, count] of charMap.entries()) {
    const code = char.charCodeAt(0);
    if (code < 128) {
      embedding[code] = count / normalized.length;
    }
  }
  
  // Normalize the embedding vector
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => (norm > 0 ? val / norm : 0));
}

/**
 * SemanticCachingSystem class for intelligently caching AI responses
 */
export class SemanticCachingSystem {
  private cache: Map<string, CacheEntry> = new Map();
  private config: SemanticCacheConfig;
  private stats: CacheStats = {
    cacheSize: 0,
    totalHits: 0,
    totalMisses: 0,
    hitRate: 0,
    totalSaved: 0,
    avgSimilarityScore: 0,
    avgResponseTime: 0,
    avgValueScore: 0
  };
  private simScoreSum = 0;
  private responseTimeSum = 0;
  private valueScoreSum = 0;
  
  constructor(config: Partial<SemanticCacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Validate config
    if (this.config.maxCacheSize && this.config.maxCacheSize <= 0) {
      throw new Error('maxCacheSize must be greater than 0');
    }
    
    if (this.config.cacheTTL && this.config.cacheTTL <= 0) {
      throw new Error('cacheTTL must be greater than 0');
    }
    
    if (this.config.minQueryLength && this.config.minQueryLength <= 0) {
      throw new Error('minQueryLength must be greater than 0');
    }
    
    console.log('Semantic Caching System initialized with config:', {
      maxCacheSize: this.config.maxCacheSize,
      cacheTTL: `${this.config.cacheTTL}ms`,
      minQueryLength: this.config.minQueryLength,
      similarityFunction: this.config.similarityFunction
    });
  }
  
  /**
   * Create a cache entry
   *
   * @param query The query text
   * @param response The AI response
   * @param model The model used
   * @param cost The cost of the API call
   * @param metadata Optional metadata
   * @returns The created cache entry
   */
  async createCacheEntry(
    query: string,
    response: string,
    model: string,
    cost: number,
    metadata: Record<string, any> = {}
  ): Promise<{ entry: CacheEntry, error?: string }> {
    // Validate query length
    if (query.length < (this.config.minQueryLength || 0)) {
      const error = `Query too short (${query.length} chars). Minimum length: ${this.config.minQueryLength} chars`;
      console.warn(error);
      return { entry: {} as CacheEntry, error };
    }
    
    // Generate embedding
    const embedding = generateSimpleEmbedding(query);
    
    // Create cache entry
    const entry: CacheEntry = {
      id: uuidv4(),
      query,
      response,
      model,
      embedding,
      cost,
      createdAt: new Date(),
      lastAccessed: new Date(),
      accessCount: 1,
      savedCost: 0,
      metadata: { ...metadata }
    };
    
    // Add to cache
    this.cache.set(entry.id, entry);
    
    // Update stats
    this.stats.cacheSize = this.cache.size;
    
    // Prune cache if needed
    if (this.config.maxCacheSize && this.cache.size > this.config.maxCacheSize) {
      this.pruneCache();
    }
    
    return { entry };
  }
  
  /**
   * Check cache for a matching query
   *
   * @param query The query text
   * @param model The model to check for
   * @param thresholdName Similarity threshold to use
   * @returns The matching cache entry or null if not found
   */
  async checkCache(
    query: string,
    model: string,
    thresholdName: 'strict' | 'standard' | 'relaxed' | 'experimental' = 'standard'
  ): Promise<CacheMatchResult | null> {
    const startTime = Date.now();
    
    // Validate query length
    if (query.length < (this.config.minQueryLength || 0)) {
      return null;
    }
    
    // Check for exact match first
    const entries = this.getCacheEntriesByModel(model);
    const exactMatch = entries.find(entry => entry.query === query);
    
    if (exactMatch) {
      // Update stats for exact match
      this.updateEntryStats(exactMatch.id);
      
      const responseTime = Date.now() - startTime;
      this.updateResponseTime(responseTime);
      
      return {
        entry: exactMatch,
        similarityScore: 1.0
      };
    }
    
    // No exact match, try semantic similarity
    const queryEmbedding = generateSimpleEmbedding(query);
    let bestMatch: CacheEntry | null = null;
    let bestScore = 0;
    
    // Get threshold
    const threshold = this.config.minSimilarityThresholds?.[thresholdName] || 
                      DEFAULT_CONFIG.minSimilarityThresholds?.[thresholdName] ||
                      0.9;
    
    // Find best semantic match
    for (const entry of entries) {
      if (!entry.embedding) continue;
      
      let similarity: number;
      switch (this.config.similarityFunction) {
        case 'dotProduct':
          similarity = dotProductSimilarity(queryEmbedding, entry.embedding);
          break;
        case 'euclidean':
          similarity = euclideanSimilarity(queryEmbedding, entry.embedding);
          break;
        case 'cosine':
        default:
          similarity = cosineSimilarity(queryEmbedding, entry.embedding);
          break;
      }
      
      if (similarity > bestScore && similarity >= threshold) {
        bestScore = similarity;
        bestMatch = entry;
      }
    }
    
    if (bestMatch) {
      // Update stats for semantic match
      this.updateEntryStats(bestMatch.id, bestScore);
      
      // Log the match for monitoring
      if (this.config.logStats) {
        console.log(`Semantic cache hit: ${bestScore.toFixed(4)} similarity for model ${model}`);
        console.log(`  Query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`);
        console.log(`  Cached: "${bestMatch.query.substring(0, 50)}${bestMatch.query.length > 50 ? '...' : ''}"`);
      }
      
      const responseTime = Date.now() - startTime;
      this.updateResponseTime(responseTime);
      
      // Update budgetForecaster with savings
      budgetForecaster.logCacheSavings(
        model,
        bestMatch.cost,
        `Cache hit with ${bestScore.toFixed(2)} similarity`
      );
      
      return {
        entry: bestMatch,
        similarityScore: bestScore
      };
    }
    
    // No match found
    this.stats.totalMisses++;
    this.updateHitRate();
    
    const responseTime = Date.now() - startTime;
    this.updateResponseTime(responseTime);
    
    return null;
  }
  
  /**
   * Get or create cache entry - convenience method for typical usage
   *
   * @param query The query text
   * @param model The model to use
   * @param generateResponseFn Function to generate response if cache miss
   * @param threshold Similarity threshold to use
   * @returns The cache entry, response, and cost information
   */
  async getOrCreate(
    query: string,
    model: string,
    generateResponseFn: () => Promise<{ response: string, cost: number }>,
    threshold: 'strict' | 'standard' | 'relaxed' | 'experimental' = 'standard'
  ): Promise<{
    response: string,
    cost: number,
    isFreshMatch: boolean,
    cacheEntryId?: string,
    similarityScore?: number
  }> {
    // Check cache first
    const cacheResult = await this.checkCache(query, model, threshold);
    
    if (cacheResult) {
      // Cache hit
      return {
        response: cacheResult.entry.response,
        cost: 0, // No cost for cache hits
        isFreshMatch: false,
        cacheEntryId: cacheResult.entry.id,
        similarityScore: cacheResult.similarityScore
      };
    }
    
    // Cache miss - generate new response
    const { response, cost } = await generateResponseFn();
    
    // Create cache entry
    const cacheResult2 = await this.createCacheEntry(query, response, model, cost);
    
    return {
      response,
      cost,
      isFreshMatch: true,
      cacheEntryId: cacheResult2.entry.id
    };
  }
  
  /**
   * Get cache entry by ID
   *
   * @param id The cache entry ID
   * @returns The cache entry or undefined if not found
   */
  getCacheEntry(id: string): CacheEntry | undefined {
    return this.cache.get(id);
  }
  
  /**
   * Get cache entries by model
   *
   * @param model The model to filter by
   * @returns Array of cache entries for the specified model
   */
  getCacheEntriesByModel(model: string): CacheEntry[] {
    return Array.from(this.cache.values())
      .filter(entry => entry.model === model)
      .filter(entry => this.isEntryValid(entry));
  }
  
  /**
   * Get all cache entries
   *
   * @returns Array of all cache entries
   */
  getAllCacheEntries(): CacheEntry[] {
    return Array.from(this.cache.values())
      .filter(entry => this.isEntryValid(entry));
  }
  
  /**
   * Delete cache entry
   *
   * @param id The cache entry ID
   * @returns True if deleted, false if not found
   */
  deleteCacheEntry(id: string): boolean {
    const result = this.cache.delete(id);
    this.stats.cacheSize = this.cache.size;
    return result;
  }
  
  /**
   * Clear all cache entries
   */
  clearCache(): void {
    this.cache.clear();
    this.stats.cacheSize = 0;
    console.log('Semantic cache cleared');
  }
  
  /**
   * Get cache statistics
   *
   * @returns Cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }
  
  /**
   * Reset cache statistics
   */
  resetStats(): void {
    this.stats = {
      cacheSize: this.cache.size,
      totalHits: 0,
      totalMisses: 0,
      hitRate: 0,
      totalSaved: 0,
      avgSimilarityScore: 0,
      avgResponseTime: 0,
      avgValueScore: 0
    };
    this.simScoreSum = 0;
    this.responseTimeSum = 0;
    this.valueScoreSum = 0;
    console.log('Semantic cache statistics reset');
  }
  
  /**
   * Export cache to JSON
   *
   * @returns Exportable cache data
   */
  exportCache(): { timestamp: string, entries: CacheEntry[] } {
    return {
      timestamp: new Date().toISOString(),
      entries: Array.from(this.cache.values())
    };
  }
  
  /**
   * Import cache from exported data
   *
   * @param data Exported cache data
   */
  importCache(data: { timestamp: string, entries: CacheEntry[] }): void {
    // Clear existing cache
    this.cache.clear();
    
    // Import entries
    for (const entry of data.entries) {
      // Convert date strings back to Date objects
      const fixedEntry: CacheEntry = {
        ...entry,
        createdAt: new Date(entry.createdAt),
        lastAccessed: new Date(entry.lastAccessed)
      };
      
      this.cache.set(entry.id, fixedEntry);
    }
    
    // Update stats
    this.stats.cacheSize = this.cache.size;
    console.log(`Imported ${data.entries.length} cache entries from ${data.timestamp}`);
  }
  
  /**
   * Update cache configuration
   *
   * @param config Updated configuration
   */
  updateConfig(config: Partial<SemanticCacheConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('Semantic cache configuration updated');
    
    // Apply changes that might require immediate action
    if (this.config.maxCacheSize && this.cache.size > this.config.maxCacheSize) {
      this.pruneCache();
    }
  }
  
  /**
   * Check if entry is valid (not expired)
   *
   * @private
   * @param entry The cache entry to check
   * @returns True if valid, false if expired
   */
  private isEntryValid(entry: CacheEntry): boolean {
    if (!this.config.cacheTTL) return true;
    
    const now = Date.now();
    const entryAge = now - entry.lastAccessed.getTime();
    return entryAge <= this.config.cacheTTL;
  }
  
  /**
   * Update entry stats on access
   *
   * @private
   * @param id The cache entry ID
   * @param similarityScore Optional similarity score for semantic matches
   */
  private updateEntryStats(id: string, similarityScore: number = 1.0): void {
    const entry = this.cache.get(id);
    if (!entry) return;
    
    // Update entry stats
    entry.lastAccessed = new Date();
    entry.accessCount++;
    entry.savedCost += entry.cost;
    
    // Update cache stats
    this.stats.totalHits++;
    this.stats.totalSaved += entry.cost;
    this.simScoreSum += similarityScore;
    this.stats.avgSimilarityScore = this.simScoreSum / this.stats.totalHits;
    
    // Update the value score for this entry
    this.calculateEntryValueScore(entry);
    
    // Update hit rate
    this.updateHitRate();
    
    // Report to budget forecaster
    budgetForecaster.logCacheSavings(
      entry.model, 
      entry.cost,
      `Cache hit for "${entry.query.substring(0, 30)}..."`
    );
  }
  
  /**
   * Update hit rate statistic
   *
   * @private
   */
  private updateHitRate(): void {
    const total = this.stats.totalHits + this.stats.totalMisses;
    this.stats.hitRate = total > 0 ? this.stats.totalHits / total : 0;
  }
  
  /**
   * Update response time statistics
   *
   * @private
   * @param responseTime Response time in ms
   */
  private updateResponseTime(responseTime: number): void {
    const total = this.stats.totalHits + this.stats.totalMisses;
    this.responseTimeSum += responseTime;
    this.stats.avgResponseTime = total > 0 ? this.responseTimeSum / total : 0;
  }
  
  /**
   * Prune cache when it exceeds maxCacheSize
   *
   * @private
   */
  private pruneCache(): void {
    if (!this.config.maxCacheSize) return;
    
    // Calculate value scores for all entries
    for (const entry of this.cache.values()) {
      this.calculateEntryValueScore(entry);
    }
    
    // Sort entries by value score (ascending - lowest value first)
    const entries = Array.from(this.cache.values())
      .sort((a, b) => {
        const scoreA = a.metadata?.valueScore || 0;
        const scoreB = b.metadata?.valueScore || 0;
        return scoreA - scoreB;
      });
    
    // Calculate how many to remove
    const removeCount = this.cache.size - this.config.maxCacheSize;
    
    // Remove lowest value entries
    for (let i = 0; i < removeCount; i++) {
      if (i < entries.length) {
        this.cache.delete(entries[i].id);
      }
    }
    
    // Update stats
    this.stats.cacheSize = this.cache.size;
    console.log(`Pruned ${removeCount} entries from semantic cache`);
  }
  
  /**
   * Calculate value score for a cache entry
   * Higher score = more valuable to keep in cache
   *
   * @private
   * @param entry The cache entry
   */
  private calculateEntryValueScore(entry: CacheEntry): number {
    const now = Date.now();
    
    // Recency: how recently was this entry accessed (0-1, higher = more recent)
    const ageMs = now - entry.lastAccessed.getTime();
    const maxAgeMs = this.config.cacheTTL || (24 * 60 * 60 * 1000);
    const recencyScore = Math.max(0, 1 - (ageMs / maxAgeMs));
    
    // Frequency: how often is this entry accessed (normalized 0-1)
    const frequencyScore = Math.min(1, entry.accessCount / 10); // Cap at 10 accesses
    
    // Savings: how much cost has this entry saved (normalized 0-1)
    const maxSavings = 0.5; // Assume $0.50 is a lot of savings for normalization
    const savingsScore = Math.min(1, entry.savedCost / maxSavings);
    
    // Calculate weighted score
    const valueFactor = this.config.valueFactor || DEFAULT_CONFIG.valueFactor;
    const valueScore = (
      (recencyScore * (valueFactor?.recency || 0.3)) +
      (frequencyScore * (valueFactor?.frequency || 0.3)) +
      (savingsScore * (valueFactor?.savings || 0.4))
    );
    
    // Store score in entry metadata
    if (!entry.metadata) entry.metadata = {};
    entry.metadata.valueScore = valueScore;
    entry.metadata.recencyScore = recencyScore;
    entry.metadata.frequencyScore = frequencyScore;
    entry.metadata.savingsScore = savingsScore;
    
    // Update average value score statistic
    const entries = this.getAllCacheEntries();
    const sum = entries.reduce((total, e) => total + (e.metadata?.valueScore || 0), 0);
    this.stats.avgValueScore = entries.length > 0 ? sum / entries.length : 0;
    
    return valueScore;
  }
  
  /**
   * Helper method to check if the cache has a specific query
   * 
   * @param query The query to check for
   * @param model The model to check for
   * @returns True if the cache has the query, false otherwise
   */
  async hasQuery(query: string, model: string): Promise<boolean> {
    const result = await this.checkCache(query, model);
    return result !== null;
  }
  
  /**
   * Get available models in the cache
   * 
   * @returns Array of model names that have cache entries
   */
  getAvailableModels(): string[] {
    const models = new Set<string>();
    for (const entry of this.cache.values()) {
      if (this.isEntryValid(entry)) {
        models.add(entry.model);
      }
    }
    return Array.from(models);
  }
  
  /**
   * Check if cache hits are valid for query processing
   *
   * @returns True if cache contains valid entries
   */
  checkBudgetForecaster(): void {
    // Share cost info with the AdaptiveBudgetForecaster
    const cachedModels = this.getAvailableModels();
    
    if (cachedModels.length > 0) {
      // Report cache statistics
      const report = {
        hitRate: this.stats.hitRate,
        totalSaved: this.stats.totalSaved,
        cacheSize: this.stats.cacheSize,
        cachedModels
      };
      
      console.log('Cache report shared with budget forecaster:', report);
    }
  }
}

// Create singleton instance
export const semanticCache = new SemanticCachingSystem();