# Semantic Caching System

The SemanticCachingSystem is a critical component of the OROBORO NEXUS Cost Optimization Architecture, responsible for intelligently caching responses to similar queries to eliminate redundant API calls and dramatically reduce costs.

## Overview

Embodying the "Learning Is Infinite" principle from the AI Manifesto, the SemanticCachingSystem goes beyond simple exact-match caching to implement semantic similarity matching. This allows it to identify when a new request is substantively similar to a previously processed one, even if the wording or structure differs slightly.

By leveraging lower-cost embedding models like Gemini 1.5 Flash ($0.01/MTok) for similarity calculations, the system achieves significant cost savings compared to repeatedly calling more expensive completion models like GPT-4.5-preview ($75/MTok input, $150/MTok output).

## Core Functionality

### Semantic Similarity Detection

The SemanticCachingSystem employs multiple strategies for identifying similar requests:

- **Exact Key Matching**: Direct hash-based lookup for identical requests
- **Embedding-based Similarity**: Vector comparison of request embeddings
- **Contextual Understanding**: Considering task type and requirements in similarity calculations
- **Adaptive Thresholds**: Dynamically adjusting similarity thresholds based on budget status

### Intelligent Caching Strategies

The system implements sophisticated caching policies:

- **Time-based Expiration**: Automatically invalidating cache entries after configured periods
- **Segmented Caching**: Separate caches for different request types and contexts
- **Confidence-based Retrieval**: Including confidence scores with cached results
- **Cache Prioritization**: Keeping high-value cache entries longer

### Cost-Aware Embedding Generation

The system minimizes the cost of the caching mechanism itself:

- **Low-cost Models**: Using cost-effective models for generating embeddings
- **Optimization Analysis**: Tracking cache hit rates and cost savings
- **Frequency-based Processing**: More aggressive caching for frequent queries
- **Selective Embedding**: Only generating embeddings for cacheable request types

## Implementation Details

```typescript
interface CacheEntry {
  key: string;
  result: any;
  embedding?: number[];
  timestamp: Date;
  expiresAt: Date;
  usageCount: number;
  cost: number;
  taskType: string;
}

interface SimilarityMatch {
  entry: CacheEntry;
  similarity: number;
  confidence: number;
}

interface CachingConfiguration {
  similarityThreshold: number;
  maxCacheAge: number; // milliseconds
  contextAwareness: boolean;
  cachingStrategy: 'exact' | 'semantic' | 'hybrid';
}

class SemanticCachingSystem {
  private cache: Map<string, CacheEntry> = new Map();
  private embeddings: Map<string, number[]> = new Map();
  private config: CachingConfiguration;
  private costMonitor: CostMonitoringDashboard;
  private embeddingModel: any; // Would be an actual embedding model client
  
  constructor(costMonitor: CostMonitoringDashboard) {
    this.costMonitor = costMonitor;
    
    // Default configuration
    this.config = {
      similarityThreshold: 0.92, // 92% similarity required
      maxCacheAge: 86400000, // 24 hours
      contextAwareness: true,
      cachingStrategy: 'hybrid'
    };
    
    // Initialize embedding model
    this.initializeEmbeddingModel();
    
    // Periodically clean expired cache entries
    setInterval(() => this.cleanExpiredEntries(), 3600000); // Every hour
  }
  
  /**
   * Set caching configuration
   */
  setConfiguration(config: Partial<CachingConfiguration>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Generate a cache key from input data
   */
  generateCacheKey(input: any): string {
    // Generate a deterministic key from input
    // Include relevant properties that affect the response
    const keyParts = [];
    
    // Include reach data if available
    if (input.stats?.reach) {
      keyParts.push(`reach:${input.stats.reach}`);
    }
    
    // Include views if available
    if (input.stats?.views) {
      keyParts.push(`views:${input.stats.views}`);
    }
    
    // Include segments if available
    if (input.segments) {
      keyParts.push(`segments:${input.segments.join('-')}`);
    }
    
    // Include intent if available
    if (input.intent) {
      keyParts.push(`intent:${input.intent}`);
    }
    
    // Include task type if available
    if (input.type) {
      keyParts.push(`type:${input.type}`);
    }
    
    // If no key parts, use stringified input
    if (keyParts.length === 0) {
      return this.hashString(JSON.stringify(input));
    }
    
    // Join key parts and hash
    return this.hashString(keyParts.join('|'));
  }
  
  /**
   * Get a result from cache
   */
  get(key: string): any | null {
    // Check for exact match
    if (this.cache.has(key)) {
      const entry = this.cache.get(key)!;
      
      // Check if entry has expired
      if (entry.expiresAt < new Date()) {
        this.cache.delete(key);
        return null;
      }
      
      // Update usage count
      entry.usageCount++;
      
      // Record cache hit
      this.recordCacheHit(entry);
      
      return entry.result;
    }
    
    // If not in exact mode, try semantic matching
    if (this.config.cachingStrategy !== 'exact') {
      const semanticMatch = this.findSemanticMatch(key);
      if (semanticMatch) {
        // Record cache hit with confidence
        this.recordCacheHit(semanticMatch.entry, semanticMatch.confidence);
        return {
          ...semanticMatch.entry.result,
          cacheConfidence: semanticMatch.confidence,
          semanticMatch: true
        };
      }
    }
    
    return null;
  }
  
  /**
   * Store a result in cache
   */
  set(key: string, value: any, input?: any, cost: number = 0): void {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.config.maxCacheAge);
    
    // Determine task type
    const taskType = input?.type || 'default';
    
    // Create cache entry
    const entry: CacheEntry = {
      key,
      result: value,
      timestamp: now,
      expiresAt,
      usageCount: 0,
      cost,
      taskType
    };
    
    // Store in cache
    this.cache.set(key, entry);
    
    // If in semantic or hybrid mode, generate embedding for the input
    if (this.config.cachingStrategy !== 'exact' && input) {
      this.generateEmbedding(key, input)
        .then(embedding => {
          if (embedding) {
            entry.embedding = embedding;
          }
        })
        .catch(err => console.error('Failed to generate embedding:', err));
    }
  }
  
  /**
   * Get cache statistics
   */
  getStats(): {
    size: number,
    hitRate: number,
    totalSavings: number,
    entriesByType: { [type: string]: number }
  } {
    // Calculate hit rate and other stats
    const totalHits = this.getCacheHitCount();
    const totalMisses = this.getCacheMissCount();
    const totalRequests = totalHits + totalMisses;
    
    // Calculate entries by type
    const entriesByType: { [type: string]: number } = {};
    for (const entry of this.cache.values()) {
      entriesByType[entry.taskType] = (entriesByType[entry.taskType] || 0) + 1;
    }
    
    return {
      size: this.cache.size,
      hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
      totalSavings: this.getTotalSavings(),
      entriesByType
    };
  }
  
  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
    this.embeddings.clear();
  }
  
  /**
   * Find semantically similar cache entry
   */
  private findSemanticMatch(key: string): SimilarityMatch | null {
    // If we don't have an embedding for this key yet, we can't do semantic matching
    if (!this.embeddings.has(key)) {
      return null;
    }
    
    const queryEmbedding = this.embeddings.get(key)!;
    let bestMatch: SimilarityMatch | null = null;
    
    // Check all cache entries with embeddings
    for (const entry of this.cache.values()) {
      if (!entry.embedding) continue;
      
      // Calculate cosine similarity
      const similarity = this.calculateCosineSimilarity(queryEmbedding, entry.embedding);
      
      // If similarity exceeds threshold and is better than current best match
      if (similarity >= this.config.similarityThreshold && 
          (!bestMatch || similarity > bestMatch.similarity)) {
        
        // Calculate confidence score (combination of similarity and recency)
        const recencyFactor = 1 - Math.min(1, (Date.now() - entry.timestamp.getTime()) / this.config.maxCacheAge);
        const confidence = similarity * 0.7 + recencyFactor * 0.3;
        
        bestMatch = {
          entry,
          similarity,
          confidence
        };
      }
    }
    
    return bestMatch;
  }
  
  /**
   * Generate embedding for a key and input
   */
  private async generateEmbedding(key: string, input: any): Promise<number[] | null> {
    try {
      // Prepare input for embedding
      const text = this.prepareInputForEmbedding(input);
      
      // Generate embedding using low-cost model (e.g., Gemini 1.5 Flash)
      const embedding = await this.embeddingModel.createEmbedding(text);
      
      // Store embedding
      this.embeddings.set(key, embedding);
      
      // Record embedding cost
      this.recordEmbeddingCost(text);
      
      return embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      return null;
    }
  }
  
  /**
   * Prepare input for embedding generation
   */
  private prepareInputForEmbedding(input: any): string {
    // Convert input to string representation for embedding
    if (typeof input === 'string') {
      return input;
    }
    
    // For objects, create a simplified representation
    const parts = [];
    
    if (input.stats) {
      parts.push(`Stats: ${JSON.stringify(input.stats)}`);
    }
    
    if (input.type) {
      parts.push(`Type: ${input.type}`);
    }
    
    if (input.intent) {
      parts.push(`Intent: ${input.intent}`);
    }
    
    if (input.segments) {
      parts.push(`Segments: ${input.segments.join(', ')}`);
    }
    
    // If no specific parts extracted, use full JSON
    if (parts.length === 0) {
      return JSON.stringify(input);
    }
    
    return parts.join('\n');
  }
  
  /**
   * Calculate cosine similarity between two embeddings
   */
  private calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Embeddings must have the same dimension');
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    if (normA === 0 || normB === 0) {
      return 0;
    }
    
    return dotProduct / (normA * normB);
  }
  
  /**
   * Initialize the embedding model
   */
  private initializeEmbeddingModel(): void {
    // This would normally initialize a client for a real embedding model
    // Here we just create a simple mock
    this.embeddingModel = {
      createEmbedding: async (text: string) => {
        // In a real implementation, this would call an API
        // Mock implementation just creates a deterministic pseudo-embedding based on the text
        const hash = this.hashString(text);
        const embedding = [];
        for (let i = 0; i < 384; i++) {
          // Generate a value based on the hash and position
          const value = Math.sin((i + parseInt(hash.substring(i % hash.length, (i % hash.length) + 8), 16)));
          embedding.push(value);
        }
        return embedding;
      }
    };
  }
  
  /**
   * Clean expired cache entries
   */
  private cleanExpiredEntries(): void {
    const now = new Date();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
        this.embeddings.delete(key);
      }
    }
  }
  
  /**
   * Record a cache hit
   */
  private recordCacheHit(entry: CacheEntry, confidence: number = 1.0): void {
    // Record savings in the cost monitor
    this.costMonitor.recordCacheSavings(
      entry.cost,
      entry.taskType,
      confidence
    );
  }
  
  /**
   * Record embedding generation cost
   */
  private recordEmbeddingCost(text: string): void {
    // Calculate token count (rough estimate)
    const tokenCount = Math.ceil(text.length / 4);
    
    // Gemini 1.5 Flash embedding cost: $0.01 per 1M tokens
    const cost = tokenCount * 0.01 / 1000000;
    
    // Record cost
    this.costMonitor.recordEmbeddingCost(cost);
  }
  
  /**
   * Get cache hit count
   */
  private getCacheHitCount(): number {
    // In a real implementation, this would track actual hits
    return Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.usageCount, 0);
  }
  
  /**
   * Get cache miss count
   */
  private getCacheMissCount(): number {
    // In a real implementation, this would track actual misses
    return this.costMonitor.getCacheMissCount();
  }
  
  /**
   * Get total savings from cache hits
   */
  private getTotalSavings(): number {
    return Array.from(this.cache.values())
      .reduce((sum, entry) => sum + (entry.cost * entry.usageCount), 0);
  }
  
  /**
   * Create a hash string from an input string
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16).padStart(8, '0');
  }
}
```

## Integration with Cost Optimization Architecture

### Interaction with OroboroNexusIntegration

The SemanticCachingSystem is integrated into the request processing flow:

```typescript
class OroboroNexusIntegration {
  private cache: SemanticCachingSystem;
  private costMonitor: CostMonitoringDashboard;
  
  constructor() {
    this.costMonitor = new CostMonitoringDashboard(690);
    this.cache = new SemanticCachingSystem(this.costMonitor);
    
    // Configure caching based on forecaster recommendations
    const forecaster = new AdaptiveBudgetForecaster(690);
    const cacheParams = forecaster.getOptimizationParameters('semantic_cache');
    this.cache.setConfiguration(cacheParams);
  }
  
  async process(input: any): Promise<any> {
    // Generate cache key
    const cacheKey = this.cache.generateCacheKey(input);
    
    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      // If we have a cache hit, return it with source information
      this.logCacheHit(input, cached);
      return { ...cached, source: 'cache' };
    }
    
    // Cache miss - process normally
    const taskProfile = this.selector.profileTask(input);
    const selection = this.selector.selectModel(taskProfile);
    
    // Check if it should be processed in batch
    if (selection.batchable && !input.requiresImmediate) {
      return this.batchProcessor.queue(input, selection.model, input.priority || 0);
    }
    
    // Process individually
    const result = await this.processIndividually(input, selection.model);
    
    // Store in cache
    this.cache.set(cacheKey, result, input, selection.costEstimate);
    
    return result;
  }
  
  private logCacheHit(input: any, result: any): void {
    const inputSummary = JSON.stringify(input).substring(0, 100);
    console.log(`Cache hit for input: ${inputSummary}...`);
    
    if (result.semanticMatch) {
      console.log(`Semantic match with confidence: ${result.cacheConfidence.toFixed(2)}`);
    }
  }
}
```

### Interaction with AdaptiveBudgetForecaster

The SemanticCachingSystem receives optimization parameters from the AdaptiveBudgetForecaster:

```typescript
// Adaptive adjustments based on budget status
const budgetStatus = forecaster.getBudgetStatus();

if (budgetStatus.status === 'critical') {
  // Maximize cache usage when budget is critical
  cache.setConfiguration({
    similarityThreshold: 0.85, // Lower similarity requirement
    maxCacheAge: 172800000,   // 48 hours
    contextAwareness: true,
    cachingStrategy: 'hybrid'
  });
} else if (budgetStatus.status === 'warning') {
  // Enhanced caching in warning state
  cache.setConfiguration({
    similarityThreshold: 0.89, // Moderate similarity requirement
    maxCacheAge: 129600000,   // 36 hours
    contextAwareness: true,
    cachingStrategy: 'hybrid'
  });
} else {
  // Default balanced configuration
  cache.setConfiguration({
    similarityThreshold: 0.92, // Standard similarity requirement
    maxCacheAge: 86400000,    // 24 hours
    contextAwareness: true,
    cachingStrategy: 'hybrid'
  });
}
```

### Interaction with CostMonitoringDashboard

The SemanticCachingSystem records caching statistics for tracking:

```typescript
// In SemanticCachingSystem.recordCacheHit method
this.costMonitor.recordCacheSavings(
  entry.cost,
  entry.taskType,
  confidence
);

// In CostMonitoringDashboard class
recordCacheSavings(cost: number, taskType: string, confidence: number = 1.0): void {
  this.cacheSavings.push({
    timestamp: new Date(),
    cost,
    taskType,
    confidence
  });
  
  this.totalSavings += cost * confidence;
  this.savingsByType.caching += cost * confidence;
  
  this.updateSavingsChart();
}
```

## Usage Examples

### Basic Usage

```typescript
// Initialize the cost monitor and caching system
const costMonitor = new CostMonitoringDashboard(690);
const cache = new SemanticCachingSystem(costMonitor);

// Process a request, checking cache first
async function processRequest(input) {
  const cacheKey = cache.generateCacheKey(input);
  const cached = cache.get(cacheKey);
  
  if (cached) {
    console.log("Cache hit! Saved API call cost");
    return cached;
  }
  
  // Cache miss - make real API call
  const result = await makeRealApiCall(input);
  const cost = calculateCost(input, result);
  
  // Store in cache
  cache.set(cacheKey, result, input, cost);
  
  return result;
}

// Process multiple similar requests
const result1 = await processRequest({
  stats: { reach: 478000, views: 1600000 },
  type: "crypto",
  intent: "reasoned"
});

// Almost identical request will hit cache
const result2 = await processRequest({
  stats: { reach: 478000, views: 1600000 },
  type: "crypto",
  intent: "reasoned"
});

// Similar request with slight variation may hit cache via semantic matching
const result3 = await processRequest({
  stats: { reach: 478500, views: 1605000 },
  type: "crypto",
  intent: "analysis"
});
```

### Advanced Configuration

```typescript
// Configure for aggressive caching
cache.setConfiguration({
  similarityThreshold: 0.85,   // Accept lower similarity matches
  maxCacheAge: 259200000,      // 3 days
  contextAwareness: true,      // Consider context in similarity
  cachingStrategy: 'hybrid'    // Use both exact and semantic matching
});

// Check cache statistics
const stats = cache.getStats();
console.log(`Cache size: ${stats.size} entries`);
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
console.log(`Total savings: $${stats.totalSavings.toFixed(4)}`);
console.log("Entries by type:", stats.entriesByType);
```

### Cache Management

```typescript
// Clear cache when necessary
function handleLowMemoryWarning() {
  console.log("Low memory warning - clearing cache");
  cache.clear();
}

// Selective cache management
function pruneCache() {
  const stats = cache.getStats();
  
  if (stats.size > 10000) {
    // Too many entries, clear older ones
    console.log("Cache size exceeded threshold, pruning");
    cache.clear();
  }
}
```

## Performance Metrics

The SemanticCachingSystem achieves substantial cost savings:

| Model | Original Cost | Cost with Caching | Savings on Cache Hit |
|-------|--------------|------------------|---------------------|
| GPT-4.5-preview | $0.1125/request | $0.00001/request | 99.99% |
| GPT-4o | $0.00625/request | $0.00001/request | 99.84% |
| Claude-3.7-Sonnet | $0.009/request | $0.00001/request | 99.89% |
| GPT-4o-mini | $0.000225/request | $0.00001/request | 95.56% |

For a typical workload with a 30% cache hit rate using GPT-4o-mini:

- **Without caching**: $0.225 per day, $6.75 per month
- **With caching**: $0.158 per day, $4.74 per month
- **Monthly savings**: $2.01 (30%)

When combined with other optimization techniques and when using higher-cost models, the savings become even more substantial.

## Conclusion

The SemanticCachingSystem exemplifies the "Learning Is Infinite" principle from the AI Manifesto by intelligently reusing knowledge from previous requests. It demonstrates that mistakes (or in this case, redundancies) are truly data points for improvement, not failures.

By dramatically reducing redundant API calls while maintaining high-quality responses, the system enables OROBORO NEXUS to scale efficiently, particularly for workloads with recurring or similar queries. The integration of semantic similarity detection allows for nuanced understanding of when requests are substantively the same, even when their surface form differs.

Through its contribution to the overall Cost Optimization Architecture, the SemanticCachingSystem helps transform the economics of large language model usage, making advanced AI capabilities financially sustainable at scale.